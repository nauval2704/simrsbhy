const requestGudangModel = require("../../models/requestGudang");
const requestApotekModel = require("../../models/requestApotek");
const gudangObat = require("../../models/gudangObat");
const gudangBhp = require("../../models/gudangBhp");
const gudangAlkes = require("../../models/gudangAlkes");
const stockApotek = require("../../models/stockApotek");
const stockIgd = require("../../models/stockIgd");
const stockInap = require("../../models/stockInap");
const ResepModel = require("../../models/resep");
const MarginModel = require("../../models/margin");
const CheckinModel = require("../../models/checkin");
const rincianFarmasiModel = require("../../models/rincianFarmasi");
var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
  laporanApotek: async (req, res) => {
    try {
      const getLaporanObat = await gudangObat.aggregate([
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanBhp = await gudangBhp.aggregate([
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanAlkes = await gudangAlkes.aggregate([
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "APOTEK"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockapoteks",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return res.status(200).send({
        data: {
          dataObat: getLaporanObat,
          dataBhp: getLaporanBhp,
          dataAlkes: getLaporanAlkes,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  laporanIgd: async (req, res) => {
    try {
      const getLaporanObat = await gudangObat.aggregate([
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanBhp = await gudangBhp.aggregate([
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanAlkes = await gudangAlkes.aggregate([
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "IGD"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockigds",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return res.status(200).send({
        data: {
          dataObat: getLaporanObat,
          dataBhp: getLaporanBhp,
          dataAlkes: getLaporanAlkes,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  laporanInap: async (req, res) => {
    try {
      const getLaporanObat = await gudangObat.aggregate([
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanBhp = await gudangBhp.aggregate([
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      const getLaporanAlkes = await gudangAlkes.aggregate([
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLama",
          },
        },
        {
          $unwind: {
            path: "$stockLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $lt: ["$obat.createdAt", req.params.start] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLama",
          },
        },
        {
          $project: {
            _id: 1,
            nama: 1,
            satuan: 1,
            jenis: 1,
            kategori: 1,
            stockLama: 1,
            pemakaianLama: {
              $filter: {
                input: "$pemakaianLama",
                as: "item",
                cond: { $eq: ["$$item._id", "$nama"] },
              },
            },
          },
        },
        {
          $unwind: {
            path: "$pemakaianLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$createdAt", req.params.start] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLama",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLama",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "stockLaporan",
          },
        },
        {
          $unwind: {
            path: "$stockLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "reseps",
            let: {
              nama: "$nama",
              obatId: "$obat.idObat", // Store the obat.idObat for matching later
            },
            pipeline: [
              {
                $unwind: "$obat",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$obat.nama", "$$nama"] }, // Filter for obat.nama
                      { $gte: ["$obat.createdAt", req.params.start] },
                      { $lt: ["$obat.createdAt", req.params.end + 1] },
                      { $eq: ["$obat.sumberStock", "INAP"] }, // Filter for obat.sumberStock
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$obat.nama",
                  jumlah: { $sum: "$obat.jumlah" },
                  reseps: {
                    $push: {
                      // Reconstruct the reseps document for obat with IGD
                      idObat: "$obat.idObat",
                      nama: "$obat.nama",
                      createdAt: "$obat.createdAt",
                      sumberStock: "$obat.sumberStock",
                    },
                  },
                },
              },
            ],
            as: "pemakaianLaporan",
          },
        },
        {
          $unwind: {
            path: "$pemakaianLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "stockinaps",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      // { $gte: ["$tglFaktur", req.params.start] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  jumlah: { $sum: "$jumlah" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "penerimaanLaporan",
          },
        },
        {
          $unwind: {
            path: "$penerimaanLaporan",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return res.status(200).send({
        data: {
          dataObat: getLaporanObat,
          dataBhp: getLaporanBhp,
          dataAlkes: getLaporanAlkes,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
};
