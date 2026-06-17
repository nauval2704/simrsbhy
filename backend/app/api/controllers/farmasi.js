const requestGudangModel = require("../models/requestGudang");
const requestApotekModel = require("../models/requestApotek");
const gudangObat = require("../models/gudangObat");
const gudangBhp = require("../models/gudangBhp");
const gudangAlkes = require("../models/gudangAlkes");
const stockApotek = require("../models/stockApotek");
const stockIgd = require("../models/stockIgd");
const stockInap = require("../models/stockInap");
const ResepModel = require("../models/resep");
const MarginModel = require("../models/margin");
const CheckinModel = require("../models/checkin");
const rincianFarmasiModel = require("../models/rincianFarmasi");
var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getNotif: async (req, res) => {
    try {
      const notifReqGudang = await requestGudangModel.countDocuments({
        status: 0,
      });
      const notifReqIgd = await requestApotekModel.countDocuments({
        status: 0,
        unit: "IGD",
      });
      return res.status(200).send({
        data: {
          notifReqGudang: notifReqGudang,
          notifReqIgd: notifReqIgd,
        },
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
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
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },

  getRequestGudang: async (req, res) => {
    try {
      if (req.params.from === "null") {
        const getItem = await requestGudangModel
          .find({
            createdAt: {
              $gte: req.params.start,
              $lte: req.params.end + " 59:59:59",
            },
          })
          .sort({ createdAt: -1 });
        if (getItem.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItem);
      }
      const getItem = await requestGudangModel
        .find({
          from: req.params.from,
          createdAt: {
            $gte: req.params.start,
            $lte: req.params.end + " 59:59:59",
          },
        })
        .sort({ createdAt: -1 });
      if (getItem.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getItem);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get faktur",
        data: null,
      });
    }
  },
  getStockApotek: async (req, res) => {
    try {
      const getStockApotek = await stockApotek.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStockApotek);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  getStockIgd: async (req, res) => {
    try {
      const getStockIgd = await stockIgd.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStockIgd);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  getStockInap: async (req, res) => {
    try {
      const getStock = await stockInap.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStock);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  requestApotekSelesai: async (req, res) => {
    try {
      if (req.body) {
        for (let index = 0; index < req.body.qty; index++) {
          const item = await req.body;
          const findItem = await stockApotek
            .findOneAndUpdate(
              { nama: item.nama, jumlah: 1 },
              {
                jumlah: 0,
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const addRincianApotek = await new rincianFarmasiModel({
            idObat: findItem._id,
            noFaktur: findItem.noFaktur,
            tglFaktur: findItem.tglFaktur,
            distributor: findItem.distributor,
            kategori: findItem.kategori,
            batch: findItem.batch,
            nama: findItem.nama,
            expired: findItem.expired,
            satuan: findItem.satuan,
            jenis: findItem.jenis,
            jumlah: 1,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            noCheckin: req.body.noCheckin,
            sumberStock: "APOTEK",
            user: req.body.user,
          });
          addRincianApotek.save();
        }
        // const updateRequestApotek = await requestGudangModel.findById(
        //   req.body._id
        // );
        // updateRequestApotek.status = 1;
        // updateRequestApotek.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        // updateRequestApotek.save();
        return res.status(200).send({
          status: "success",
          message: "Add request apotek sukses",
          data: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Add request apotek sukses",
        data: null,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  requestIgdSelesai: async (req, res) => {
    try {
      if (req.body) {
        for (let index = 0; index < req.body.qty; index++) {
          const item = await req.body;
          const findItem = await stockIgd
            .findOneAndUpdate(
              { nama: item.nama, jumlah: 1 },
              {
                jumlah: 0,
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const addRincianApotek = await new rincianFarmasiModel({
            idObat: findItem._id,
            noFaktur: findItem.noFaktur,
            tglFaktur: findItem.tglFaktur,
            distributor: findItem.distributor,
            kategori: findItem.kategori,
            batch: findItem.batch,
            nama: findItem.nama,
            satuan: findItem.satuan,
            jenis: findItem.jenis,
            jumlah: 1,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            noCheckin: req.body.noCheckin,
            sumberStock: "IGD",
            user: req.body.user,
          });
          addRincianApotek.save();
        }
        // const updateRequestApotek = await requestGudangModel.findById(
        //   req.body._id
        // );
        // updateRequestApotek.status = 1;
        // updateRequestApotek.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        // updateRequestApotek.save();
        return res.status(200).send({
          status: "success",
          message: "Add request apotek sukses",
          data: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Add request apotek sukses",
        data: null,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  requestInapSelesai: async (req, res) => {
    try {
      if (req.body) {
        for (let index = 0; index < req.body.qty; index++) {
          const item = await req.body;
          const findItem = await stockInap
            .findOneAndUpdate(
              { nama: item.nama, jumlah: 1 },
              {
                jumlah: 0,
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const addRincianApotek = await new rincianFarmasiModel({
            idObat: findItem._id,
            noFaktur: findItem.noFaktur,
            tglFaktur: findItem.tglFaktur,
            distributor: findItem.distributor,
            kategori: findItem.kategori,
            batch: findItem.batch,
            nama: findItem.nama,
            satuan: findItem.satuan,
            jenis: findItem.jenis,
            jumlah: 1,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            noCheckin: req.body.noCheckin,
            sumberStock: "IGD",
            user: req.body.user,
          });
          addRincianApotek.save();
        }
        // const updateRequestApotek = await requestGudangModel.findById(
        //   req.body._id
        // );
        // updateRequestApotek.status = 1;
        // updateRequestApotek.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        // updateRequestApotek.save();
        return res.status(200).send({
          status: "success",
          message: "Add request apotek sukses",
          data: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Add request apotek sukses",
        data: null,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  getRincianFarmasi: async (req, res) => {
    try {
      const rincianFarmasi = await rincianFarmasiModel.aggregate([
        {
          $match: { noCheckin: req.params.noCheckin },
        },
        {
          $group: {
            _id: "$nama",
            jumlah: { $sum: "$jumlah" },
            totalHargaSatuan: { $sum: "$hargaSatuan" },
            totalHargaBPJS: { $sum: "$hargaJualBPJS" },
            totalHargaYANKES: { $sum: "$hargaJualYANKES" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $facet: {
            metadata: [
              {
                $group: {
                  _id: null,
                  grandTotalHargaSatuan: { $sum: "$totalHargaSatuan" },
                  grandTotalHargaBPJS: { $sum: "$totalHargaBPJS" },
                  grandTotalHargaYANKES: { $sum: "$totalHargaYANKES" },
                },
              },
            ],
            data: [{ $skip: 0 }, { $limit: 10 }],
          },
        },
      ]);
      return res.status(200).send(rincianFarmasi);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
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
        error: error,
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
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  deleteRincian: async (req, res) => {
    try {
      const getItems = await rincianFarmasiModel.find({
        nama: req.body.data._id,
        noCheckin: req.body.noCheckin,
      });

      getItems.forEach(async (element) => {
        if (element.sumberStock == "IGD") {
          const rollBackItem = await stockIgd
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                jumlah: 1,
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const deleteRincian = await rincianFarmasiModel.findOneAndRemove({
            idObat: rollBackItem._id,
          });
        }
        if (element.sumberStock == "APOTEK") {
          const rollBackItem = await stockApotek
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                jumlah: 1,
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const deleteRincian = await rincianFarmasiModel.findOneAndRemove({
            idObat: rollBackItem._id,
          });
        }
      });

      return res.status(200).send({
        status: "success",
        message: "delete rincian sukses",
        data: getItems,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },

  addResep: async (req, res) => {
    try {
      const addResep = await new ResepModel({
        noCheckin: req.body.noCheckin,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        user: req.body.user,
      });

      addResep.save();
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: addResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },

  getResepByNoCheckin: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.find({
        noCheckin: req.body.noCheckin,
      });
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  billingFarmasi: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.aggregate([
        { $match: { noCheckin: req.body.noCheckin } },
        { $sort: { "obat.nama": 1 } },
        { $unwind: "$obat" },
        {
          $group: {
            _id: { _id: "$_id", nama: "$obat.nama" },
            count: { $sum: "$obat.jumlah" },
            subtotalBPJS: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualBPJS", //hargaJualBPJS
                  { $multiply: ["$obat.hargaJualBPJS", "$obat.jumlah"] }, //hargaJualBPJS
                ],
              },
            },
            subtotalYANKES: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualYANKES",
                  { $multiply: ["$obat.hargaJualYANKES", "$obat.jumlah"] },
                ],
              },
            },
          },
        }, 
        {
          $group: {
            _id: "$_id._id",
            obat: {
              $push: {
                nama: "$_id.nama",
                count: "$count",
                subtotalBPJS: "$subtotalBPJS",
                subtotalYANKES: "$subtotalYANKES",// "$subtotalBPJS",//"$subtotalYANKES",
              },
            },
          },
        },
        { 
          $project: {
            _id: 1,
            obat: 1,
            grandTotalBPJS: { $sum: "$obat.subtotalBPJS" }, //subtotalYANKES
            grandTotalYANKES:  { $sum: "$obat.subtotalYANKES" },//{ $sum: "$obat.subtotalYANKES" },subtotalBPJS
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  printObat: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.find({ noCheckin: req.body.noCheckin });
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  printObat1: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.find({ noCheckin: req.params.noCheckin });
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  deleteResep: async (req, res) => {
    try {
      const delResep = await ResepModel.deleteOne({
        _id: ObjectId(req.body._id._id),
      });

      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di hapus",
        data: delResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  deletObatResep: async (req, res) => {
    try {
        let nama=''; 
        let sumberstok='';
      if (req.body.jenisObat === "RACIKAN") {
            req.body.dataObat.nama.forEach(async (element) => { 
            nama=element.nama;//+' resepid: '+req.body.resepId; 
             const getDataObatv = await ResepModel.aggregate([
                {
                  $match: {
                    noCheckin: req.body.noCheckin,
                    _id: ObjectId(req.body.resepId),
                    "obat.namaobat":element.nama,
                   // "obat.nama": { $regex: "(?i).*" + element.nama + ".*" },
                   // "obat.nama":element.nama,
                  },
                },
                {
                  $project: {
                    obat: {
                      $filter: {
                        input: "$obat",
                        as: "ob",
                        cond: {
                          $eq: ["$$ob.namaobat", element.nama],
                        },
                      },
                    },
                  },
        
                }, 
              ]);

              const obatArray1 = await getDataObatv[0].obat;
              obatArray1.forEach(async (elementv) => {
                sumberstok=elementv.sumberStock; 
                if (elementv.sumberStock === "IGD") {
                  const findItem = await stockIgd
                    .findOneAndUpdate(
                      { nama:nama, noFaktur: elementv.noFaktur },
                      {
                        $inc: { jumlah: +elementv.jumlah },
                        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                      },
                      {
                        new: true,
                      }
                    )
                    .sort({ createdAt: 1 });
                }
                if (elementv.sumberStock === "APOTEK") {
                    const findItem = await stockApotek
                      .findOneAndUpdate(
                        { nama: nama, noFaktur: elementv.noFaktur },
                        {
                          $inc: { jumlah: +elementv.jumlah },
                          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        {
                          new: true,
                        }
                      )
                      .sort({ createdAt: 1 });
                  }
                  if (elementv.sumberStock === "INAP") {
                    const findItem = await stockInap
                      .findOneAndUpdate(
                        { nama: nama, noFaktur: elementv.noFaktur },
                        {
                          $inc: { jumlah: +elementv.jumlah },
                          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        {
                          new: true,
                        }
                      )
                      .sort({ createdAt: 1 });
                  }

            });  

            const findItem = await stockApotek
            .findOneAndUpdate(
              {
                nama: { $regex: "(?i).*" + element.nama + ".*" },
                noFaktur: element.noFaktur,
              },
              {
                $inc: { jumlah: +1 },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              { 
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const deleteDataObatResep = await ResepModel.updateOne(
            {
              noCheckin: req.body.noCheckin,
              _id: ObjectId(req.body.resepId),
              "obat.nama": { $regex: "(?i).*" + element.nama + ".*" },
            },
            {
              $pull: {
                obat: { nama: { $regex: "(?i).*" + element.nama + ".*" } },
              },
            }
          );
        });

        return res.status(200).send({
          status: "success",
          message: "Resep berhasil di hapus",
          data:'',// obatArray1,
          dataobat:'',//getDataObatv,   
          namaobat:nama, 
          sumberstok:sumberstok, 
        });
      } 

      /** end racikan  */
        const getDataObat = await ResepModel.aggregate([
            {
              $match: { 
                noCheckin: req.body.noCheckin,
                _id: ObjectId(req.body.resepId),
                "obat.nama":req.body.dataObat.nama,
              },
            },
            {
              $project: {
                obat: {
                  $filter: {
                    input: "$obat", 
                    as: "ob",
                    cond: {
                      $eq: ["$$ob.nama", req.body.dataObat.nama],
                    },
                  },
                },
              },
    
            }, 
          ]);
      

        /*const getDataObat = await ResepModel.aggregate([
            {
              $match: {
                noCheckin: req.body.noCheckin,
                _id: ObjectId(req.body.resepId),
                "obat.nama":req.body.dataObat.nama,
              },
            },
            {
              $project: {
                obat: {
                  $filter: {
                    input: "$obat",
                    as: "ob",
                    cond: {
                      $eq: ["$$ob.nama", req.body.dataObat.nama],
                    },
                  },
                },
              },
    
            }, 
          ]); */ 
     
      

      const obatArray = await getDataObat[0].obat;

      obatArray.forEach(async (element) => {
        if (element.sumberStock === "IGD") {
          const findItem = await stockIgd
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
        if (element.sumberStock === "INAP") {
          const findItem = await stockInap
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
        if (element.sumberStock === "APOTEK") {
          const findItem = await stockApotek
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
      });
 
        const deleteDataObatResep = await ResepModel.updateOne(
            {
              noCheckin: req.body.noCheckin,
              _id: ObjectId(req.body.resepId),
              "obat.nama": req.body.dataObat.nama,
            },
            { $pull: { obat: { nama: req.body.dataObat.nama } } }
          ); 
 

      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di hapus",
        data: getDataObat,
      });
    } catch (error) {
      return res.status(400).send({
        error: error, 
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  inputResep: async (req, res) => {
    try {
      const item = req.body.dataObat;
      let findItem;

      if (item.sumberStock === "IGD") {
        findItem = await stockIgd
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      } else if (item.sumberStock === "INAP") {
        findItem = await stockInap
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      } else {
        findItem = await stockApotek
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      }

      const getResep = await ResepModel.findById(
        ObjectId(req.body.dataResep._id)
      );
      const obatData = {
        idObat: findItem._id,
        noFaktur: findItem.noFaktur,
        tglFaktur: findItem.tglFaktur,
        distributor: findItem.distributor,
        kategori: findItem.kategori,
        batch: findItem.batch,
        nama: findItem.nama,
        expired: findItem.expired,
        satuan: findItem.satuan,
        jenis: findItem.jenis,
        jenisObat: item.jenisObat,
        takaran: item.takaran,
        quantity: item.quantity,
        kapan: item.kapan,
        jam: item.jam,
        deskripsi: item.deskripsi,
        jumlah: item.qty,
        hargaBeli: findItem.hargaBeli,
        hargaSatuan: findItem.hargaSatuan,
        hargaJualBPJS: findItem.hargaJualBPJS,
        hargaJualYANKES: findItem.hargaJualYANKES,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        noCheckin: req.body.dataResep.noCheckin,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
      };

      getResep.obat.push(obatData);
      await getResep.save();

      return res.status(200).send({
        status: "success",
        message: "Obat berhasil ditambahkan",
        data: req.body,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "Terjadi kesalahan saat menambahkan obat",
        data: null,
      });
    }
  },
  inputResepRacikan: async (req, res) => {
    try {
      const item = await req.body.dataObat;

      const getCabar = await CheckinModel.findOne({
        noCheckin: req.body.dataResep.noCheckin,
      });

      const getMargin = await MarginModel.findOne({});

      var cabar = getCabar.cabar;

      const namaObat = [];
      let jumlah = 0;
      let hargaBeli = 0;
      let hargaSatuan = 0;
      let hargaJualBPJS = 0;
      let hargaJualYANKES = 0;
      let namaobat="";

      for (let index = 0; index < req.body.dataRacikan.length; index++) {
        const element = req.body.dataRacikan[index];
        let findItem;
        if (item.sumberStock === "IGD") {
          findItem = await stockIgd
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        } else if (item.sumberStock === "INAP") {
          findItem = await stockInap
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        } else {
          findItem = await stockApotek
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }


        hargaBeli += findItem.hargaBeli;
        hargaSatuan += findItem.hargaSatuan;
        hargaJualBPJS += findItem.hargaJualBPJS * element.qty;
        hargaJualYANKES += findItem.hargaJualYANKES * element.qty;
        jumlah += element.qty;
        namaobat=element.nama; 
        if (cabar == "UMUM") {
          let jumlah =
            findItem.hargaJualBPJS +
            (findItem.hargaJualBPJS * getMargin.marginUmum) / 100;

          namaObat.push(
            element.nama +
            " | Jumlah: " +
            element.qty +
            " | Satuan: " +
            findItem.satuan +
            " | Harga: " +
            (element.qty * findItem.hargaJualYANKES).toLocaleString()
          );
        } else {
          let jumlah =
            findItem.hargaJualYANKES +
            (findItem.hargaJualBPJS * getMargin.marginBpjsYankes) / 100;

          namaObat.push(
            element.nama +
            " | Jumlah: " +
            element.qty +
            " | Satuan: " +
            findItem.satuan +
            " | Harga: " +
            (element.qty * findItem.hargaJualBPJS).toLocaleString()
          );
        }
      }

      const getResep = await ResepModel.findById(
        ObjectId(req.body.dataResep._id)
      );

      /* idObat: "",
        noFaktur: "", 
        tglFaktur: "",
        distributor: "", */ 

      getResep.obat.push({
        idObat:"",
        noFaktur: req.body.dataObat.noFaktur,
        tglFaktur: "",
        distributor: req.body.dataObat.distributor,
        kategori: "OBAT",
        batch: "",
        nama: namaObat,
        namaobat:namaobat, 
        expired: "",
        satuan: "",
        jenis: "RACIKAN",
        jenisObat: req.body.dataObat.jenisObat,
        takaran: req.body.dataObat.takaran,
        quantity: req.body.dataObat.quantity,
        kapan: req.body.dataObat.kapan,
        jam: req.body.dataObat.jam,
        deskripsi: req.body.dataObat.deskripsi,
        jumlah: jumlah,
        hargaBeli: hargaBeli, 
        hargaSatuan: hargaSatuan,
        hargaJualBPJS: hargaJualBPJS,
        hargaJualYANKES: hargaJualYANKES,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        noCheckin: req.body.dataResep.noCheckin,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
      });
      await getResep.save();

      return res.status(200).send({
        status: "success",
        message: "Obat berhasil di tambah",
        data: req.body,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  detailResep: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.aggregate([
        { $match: { _id: ObjectId(req.body._id) } },
        { $sort: { "obat.nama": 1 } },
        { $unwind: "$obat" },
        {
          $group: {
            _id: { _id: "$_id", nama: "$obat.nama" },
            count: { $sum: "$obat.jumlah" },
            subtotalBPJS: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualBPJS",
                  { $multiply: ["$obat.hargaJualBPJS", "$obat.jumlah"] }, //hargaJualBPJS
                ],
              },
            },
            subtotalYANKES: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualYANKES", //hargaJualYANKES
                  { $multiply: ["$obat.hargaJualYANKES", "$obat.jumlah"] }, //hargaJualYANKES
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            obat: {
              $push: {
                nama: "$_id.nama", 
                count: "$count",
                subtotalBPJS: "$subtotalBPJS",
                subtotalYANKES: "$subtotalYANKES",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            obat: 1,
            grandTotalBPJS: { $sum: "$obat.subtotalBPJS" },
            grandTotalYANKES: { $sum: "$obat.subtotalYANKES" },
          },
        },
      ]);

      return res.status(200).send({
        status: "success",
        message: "ok.",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  editTotal: async (req, res) => {
    try {
      const filter = {
        noCheckin: req.body.noCheckin,
        "obat.nama": req.body.nama,
      };

      const update = {
        $set: {
          "obat.$[].hargaSatuan": req.body.total,
          "obat.$[].hargaJualBPJS": req.body.total,
          "obat.$[].hargaJualYANKES": req.body.total,
        },
      };

      await ResepModel.updateOne(filter, update);

      return res.status(200).send({
        status: "success",
        message: "ok.",
        data: req.body,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  marginHarga: async (req, res) => {
    try {
      const checkPpnMargin = await MarginModel.find({});

      if (checkPpnMargin.length == 0) {
        const newDocument = {
          marginBpjsYankes: req.body.marginBpjsYankes,
          marginUmum: req.body.marginUmum,
        };

        const result = await MarginModel.create(newDocument);
        return res.status(200).send({
          status: 200,
          message: "Ok.",
          data: result,
        });
      }

      const filter = {}; // empty filter to update all documents
      const update = {
        $set: {
          marginBpjsYankes: req.body.marginBpjsYankes,
          marginUmum: req.body.marginUmum,
          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
      };
      const options = { new: true }; // return the updated document

      const result = await MarginModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return res.status(200).send({
        status: 200,
        message: "Ok.",
        data: result,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  getMarginHarga: async (req, res) => {
    try {
      const getMargin = await MarginModel.findOne({});

      return res.status(200).send({
        status: 200,
        message: "Ok.",
        data: getMargin,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
};
