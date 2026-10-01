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

// Harga billing dinormalisasi menurut nama obat karena resep menyimpan ID baris stok, bukan ID master obat.
function normalizeBillingMedicinePrices(recipes) {
  const plainRecipes = recipes.map((recipe) =>
    typeof recipe.toObject === "function" ? recipe.toObject() : recipe
  );
  const canonicalPrices = new Map();
  const getMedicineKey = (item) => {
    const name = Array.isArray(item?.nama)
      ? item.nama.join(", ")
      : item?.nama ?? item?.namaObat ?? item?.namaobat;
    const normalizedName = String(name ?? "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("id-ID");
    return normalizedName || null;
  };
  const isChronic = (item) =>
    item?.kronis === true || item?.kronis === "true" || item?.kronis === 1 || item?.kronis === "1";
  const registerPrices = (item) => {
    const key = getMedicineKey(item);
    if (!key) return;
    const value = item?.hargaJualBPJS;
    if (
      canonicalPrices.has(key) ||
      value === null ||
      value === undefined ||
      value === "" ||
      !Number.isFinite(Number(value))
    ) return;
    canonicalPrices.set(key, Number(value));
  };

  // Tarif BPJS dari item kronis menjadi sumber utama harga semua jenis resep untuk obat yang sama.
  plainRecipes.forEach((recipe) =>
    (Array.isArray(recipe.obat) ? recipe.obat : [])
      .filter(isChronic)
      .forEach(registerPrices)
  );
  // Jika obat tidak memiliki item kronis, gunakan tarif BPJS item non-kronis sebagai fallback.
  plainRecipes.forEach((recipe) =>
    (Array.isArray(recipe.obat) ? recipe.obat : [])
      .filter((item) => !isChronic(item))
      .forEach(registerPrices)
  );

  return plainRecipes.map((recipe) => ({
    ...recipe,
    obat: (Array.isArray(recipe.obat) ? recipe.obat : []).map((item) => {
      const bpjsPrice = canonicalPrices.get(getMedicineKey(item));
      // Samakan kedua kolom harga dengan tarif BPJS agar semua komponen billing memakai sumber tarif yang sama.
      return bpjsPrice === undefined
        ? item
        : { ...item, hargaJualBPJS: bpjsPrice, hargaJualYANKES: bpjsPrice };
    }),
  }));
}

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
      const addResep = new ResepModel({
        noCheckin: req.body.noCheckin,
        idPrmrj: req.body.idPrmrj || null,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        user: req.body.user,
      });

      const savedResep = await addResep.save();
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: savedResep,
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
      const query = {};
      const noCheckin = req.body?.noCheckin;
      const norm = req.body?.norm || req.body?.noMr || req.body?.noMR;
      const idPrmrj = req.body?.idPrmrj;

      const candidateNoCheckins = [];
      if (noCheckin && String(noCheckin).trim() !== "") {
        candidateNoCheckins.push(String(noCheckin).trim());
      }

      if (norm && String(norm).trim() !== "") {
        const normValue = String(norm).trim();
        const checkinList = await CheckinModel.find({ noMr: normValue }).distinct("noCheckin");
        checkinList
          .filter((value) => value && String(value).trim() !== "")
          .forEach((value) => candidateNoCheckins.push(String(value).trim()));
      }

      const uniqueNoCheckins = [...new Set(candidateNoCheckins)];
      if (uniqueNoCheckins.length > 0) {
        query.noCheckin = { $in: uniqueNoCheckins };
      }

      if (idPrmrj && String(idPrmrj).trim() !== "") {
        query.idPrmrj = String(idPrmrj).trim();
      }

      // Tampilan rincian poli dan modal resep memakai endpoint ini, jadi harga itemnya juga dinormalisasi.
      const getDetailResep = normalizeBillingMedicinePrices(
        await ResepModel.find(query).sort({ createdAt: -1 }).lean()
      );
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
      // Billing reguler dinormalisasi bersama item kronis sebelum menghitung subtotal per resep dan nama obat.
      const resep = normalizeBillingMedicinePrices(
        await ResepModel.find({ noCheckin: req.body.noCheckin }).sort({ createdAt: 1 }).lean()
      );
      const billingByRecipe = new Map();
      resep.forEach((recipe) => {
        (Array.isArray(recipe.obat) ? recipe.obat : [])
          .filter((item) =>
            item?.kronis === false || !Object.prototype.hasOwnProperty.call(item || {}, "kronis")
          )
          .forEach((item) => {
            const recipeKey = String(recipe._id);
            const nameKey = JSON.stringify(item.nama);
            let recipeBilling = billingByRecipe.get(recipeKey);
            if (!recipeBilling) {
              recipeBilling = { _id: recipe._id, items: new Map() };
              billingByRecipe.set(recipeKey, recipeBilling);
            }
            let medicineBilling = recipeBilling.items.get(nameKey);
            if (!medicineBilling) {
              medicineBilling = {
                nama: item.nama,
                count: 0,
                subtotalBPJS: 0,
                subtotalYANKES: 0,
              };
              recipeBilling.items.set(nameKey, medicineBilling);
            }

            // Aturan RACIKAN dipertahankan agar subtotal tetap kompatibel dengan perhitungan billing sebelumnya.
            const quantity = Number(item.jumlah) || 0;
            const multiplier = item.jenis === "RACIKAN" ? 1 : quantity;
            medicineBilling.count += quantity;
            medicineBilling.subtotalBPJS += (Number(item.hargaJualBPJS) || 0) * multiplier;
            // Subtotal YANKES juga memakai tarif BPJS sesuai sumber tarif billing yang diminta.
            medicineBilling.subtotalYANKES += (Number(item.hargaJualBPJS) || 0) * multiplier;
          });
      });
      // Bentuk respons dan total tiap resep tetap sama seperti hasil agregasi billing sebelumnya.
      const getDetailResep = Array.from(billingByRecipe.values())
        .map((recipeBilling) => {
          const obat = Array.from(recipeBilling.items.values());
          return {
            _id: recipeBilling._id,
            obat,
            grandTotalBPJS: obat.reduce((total, item) => total + item.subtotalBPJS, 0),
            grandTotalYANKES: obat.reduce((total, item) => total + item.subtotalYANKES, 0),
          };
        })
        .sort((left, right) => String(left._id).localeCompare(String(right._id)));
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
      // Data cetak billing kronis memakai harga acuan yang sama dengan billing obat non-kronis.
      const getDetailResep = normalizeBillingMedicinePrices(
        await ResepModel.find({ noCheckin: req.body.noCheckin }).sort({ createdAt: 1 }).lean()
      );
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
  deleteObatKronis: async (req, res) => { // start obat kronis 
    try {
      const { idObat, resepId, noCheckin } = req.body;
      if (!idObat || !noCheckin) {
        return res.status(400).send({
          status: "error",
          message: "idObat dan noCheckin wajib diisi",
          data: null,
        });
      }

      const resepQuery = { noCheckin: String(noCheckin).trim() };
     if (resepId) {
        resepQuery._id = ObjectId(resepId);
      }

      const resep = await ResepModel.findOne(resepQuery);
      if (!resep) {
        return res.status(404).send({
          status: "error",
          message: "Obat kronis tidak ditemukan pada resep pasien",
          data: null,
        });
      }

      const chronicItem = resep.obat.find(
        (item) => String(item?.idObat ?? "") === String(idObat) && item?.kronis === true
      );

      if (!chronicItem) {
        return res.status(404).send({
          status: "error",
          message: "Obat kronis tidak ditemukan pada resep pasien",
          data: null,
        });
      }

      const stockModels = { APOTEK: stockApotek, IGD: stockIgd, INAP: stockInap };
      const stockModel = stockModels[chronicItem.sumberStock] || stockApotek;
      await stockModel.findByIdAndUpdate(chronicItem.idObat, {
        $inc: { jumlah: Number(chronicItem.jumlah || 0) },
        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      resep.obat = resep.obat.filter(
        (item) => !(String(item?.idObat ?? "") === String(idObat) && item?.kronis === true)
      );
      await resep.save();

      return res.status(200).send({
        status: "success",
        message: "Obat kronis berhasil dihapus",
        data: { idObat },
      });
    } catch (error) {
      return res.status(400).send({
        error,
        status: "error",
        message: "Gagal menghapus obat kronis",
        data: null,
      });
    }
  },   //end delete obat kronis
  deleteObatResep: async (req, res) => {
    try {
      const { noCheckin, resepId, jenisObat, dataObat } = req.body;
      if (!noCheckin || !resepId) {
        return res.status(400).send({
          status: "error",
          message: "noCheckin dan resepId wajib diisi",
        });
      }

      let resep = await ResepModel.findOne({
        _id: ObjectId(resepId),
        noCheckin: String(noCheckin),
      });

      if (!resep) {
        resep = await ResepModel.findOne({
          _id: ObjectId(resepId),
        });
      }

      if (!resep || !Array.isArray(resep.obat)) {
        return res.status(404).send({
          status: "error",
          message: "Data resep tidak ditemukan",
        });
      }

      // Periksa apakah item target adalah racikan
      const isRacikan =
        jenisObat === "RACIKAN" ||
        dataObat?.jenis === "RACIKAN" ||
        dataObat?.jenisObat === "RACIKAN" ||
        Array.isArray(dataObat?.nama);

      // Cari index item obat dalam resep.obat
      let targetIndex = -1;

      // 1. Jika index eksplisit diberikan dan valid
      if (
        dataObat?.index !== undefined &&
        Number.isInteger(Number(dataObat.index)) &&
        resep.obat[Number(dataObat.index)]
      ) {
        const candidate = resep.obat[Number(dataObat.index)];
        const candidateIsRacikan =
          candidate?.jenis === "RACIKAN" ||
          candidate?.jenisObat === "RACIKAN" ||
          Array.isArray(candidate?.nama);
        if (Boolean(candidateIsRacikan) === Boolean(isRacikan)) {
          targetIndex = Number(dataObat.index);
        }
      }

      // 2. Jika belum ditemukan berdasarkan index, cocokkan konten
      if (targetIndex === -1) {
        if (isRacikan) {
          targetIndex = resep.obat.findIndex((item) => {
            const itemIsRacikan =
              item?.jenis === "RACIKAN" ||
              item?.jenisObat === "RACIKAN" ||
              Array.isArray(item?.nama);
            if (!itemIsRacikan) return false;

            if (Array.isArray(dataObat?.nama) && Array.isArray(item?.nama)) {
              if (JSON.stringify(item.nama) === JSON.stringify(dataObat.nama)) return true;
              if (item.nama.length === dataObat.nama.length && item.nama[0] === dataObat.nama[0]) return true;
            }

            if (typeof dataObat?.nama === "string" && Array.isArray(item?.nama)) {
              const joined = item.nama.join(", ");
              if (joined === dataObat.nama || dataObat.nama.includes(item.nama[0])) return true;
            }

            if (Array.isArray(dataObat?.namaobat) && Array.isArray(item?.namaobat)) {
              if (JSON.stringify(item.namaobat) === JSON.stringify(dataObat.namaobat)) return true;
            }

            return false;
          });
        } else {
          const targetName = typeof dataObat?.nama === "string" ? dataObat.nama.trim() : (dataObat?.namaobat || "");
          targetIndex = resep.obat.findIndex((item) => {
            if (item?.jenis === "RACIKAN" || Array.isArray(item?.nama)) return false;
            const itemNama = typeof item?.nama === "string" ? item.nama.trim() : "";
            if (targetName && itemNama.toLowerCase() === targetName.toLowerCase()) {
              if (dataObat?.noFaktur && item?.noFaktur) {
                return item.noFaktur === dataObat.noFaktur;
              }
              return true;
            }
            return false;
          });
        }
      }

      // Fallback: Jika belum ketemu, cari item yang paling cocok dengan nama
      if (targetIndex === -1 && dataObat?.nama) {
        targetIndex = resep.obat.findIndex((item) => {
          const itemStr = JSON.stringify(item.nama || "");
          const targetStr = typeof dataObat.nama === "string" ? dataObat.nama : JSON.stringify(dataObat.nama);
          return itemStr.includes(targetStr) || targetStr.includes(itemStr);
        });
      }

      if (targetIndex === -1) {
        return res.status(404).send({
          status: "error",
          message: "Item obat tidak ditemukan dalam resep",
        });
      }

      const targetItem = resep.obat[targetIndex];

      // Kembalikan stok obat
      if (isRacikan || Array.isArray(targetItem.nama)) {
        const ingredients = Array.isArray(targetItem.nama)
          ? targetItem.nama
          : (Array.isArray(dataObat?.nama) ? dataObat.nama : []);

        for (const ing of ingredients) {
          if (typeof ing === "string") {
            const parts = ing.split(" | ");
            const ingNama = parts[0]?.trim();
            let ingQty = 1;
            const jmlPart = parts.find((p) => p.toLowerCase().includes("jumlah:"));
            if (jmlPart) {
              const parsed = parseInt(jmlPart.split(":")[1]?.trim(), 10);
              if (!isNaN(parsed) && parsed > 0) ingQty = parsed;
            }

            if (ingNama) {
              const stockModel =
                targetItem.sumberStock === "IGD" ? stockIgd :
                targetItem.sumberStock === "INAP" ? stockInap : stockApotek;

              await stockModel.findOneAndUpdate(
                { nama: { $regex: "(?i)^" + ingNama.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$" } },
                {
                  $inc: { jumlah: +ingQty },
                  updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                }
              ).sort({ createdAt: 1 });
            }
          }
        }
      } else {
        const qty = Number(targetItem.jumlah || targetItem.count || targetItem.qty || 1);
        const stockModel =
          targetItem.sumberStock === "IGD" ? stockIgd :
          targetItem.sumberStock === "INAP" ? stockInap : stockApotek;

        const query = { nama: targetItem.nama };
        if (targetItem.noFaktur) query.noFaktur = targetItem.noFaktur;

        await stockModel.findOneAndUpdate(
          query,
          {
            $inc: { jumlah: +qty },
            updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          }
        ).sort({ createdAt: 1 });
      }

      // Hapus item dari array dan simpan
      resep.obat.splice(targetIndex, 1);
      resep.markModified("obat");
      await resep.save();

      await ResepModel.updateOne(
        { _id: resep._id },
        { $set: { obat: resep.obat, updatedAt: moment().format("YYYY-MM-DD HH:mm:ss") } }
      );

      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di hapus",
        data: resep.obat,
      });
    } catch (error) {
      console.error("deleteObatResep error:", error);
      return res.status(400).send({
        error: error.message || error,
        status: "error",
        message: error.message || "Gagal menghapus obat dari resep",
      });
    }
  },
  inputResep: async (req, res) => { // start input resep
    try {
      const item = req.body.dataObat;
      let findItem;
      const payloadResep = req.body.dataResep || {};
      const idPrmrj = req.body.idPrmrj || (payloadResep && payloadResep.idPrmrj) || null;

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

      if (!findItem) {
        return res.status(400).send({
          status: "error",
          message: "Obat tidak ditemukan pada stock yang dipilih",
          data: null,
        });
      }

      // Fallback penting untuk flow kronis: kadang frontend mengirim dataResep
      // tanpa _id atau dengan _id stale, sehingga server harus mencari resep
      // berdasarkan noCheckin/idPrmrj terlebih dahulu dan baru bikin jika belum ada.
      let getResep = null;
      const resepId = payloadResep._id || payloadResep.id || payloadResep.resepId;
      if (resepId) {
        try {
          getResep = await ResepModel.findById(ObjectId(resepId));
        } catch (error) {
          getResep = null;
        }
      }

      if (!getResep) {
        const searchQuery = { noCheckin: payloadResep.noCheckin };
        if (idPrmrj) {
          searchQuery.idPrmrj = String(idPrmrj);
        }
        getResep = await ResepModel.findOne(searchQuery).sort({ createdAt: -1 });
      }

      if (!getResep) {
        getResep = await new ResepModel({
          noCheckin: payloadResep.noCheckin,
          idPrmrj: idPrmrj || null,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          user: req.body.user || "system",
        }).save();
      }

      if (idPrmrj) {
        getResep.idPrmrj = idPrmrj;
      }
      const obatData = {
        idObat: findItem._id,
        noFaktur: findItem.noFaktur,
        tglFaktur: findItem.tglFaktur,
        distributor: findItem.distributor,
        kategori: findItem.kategori,
        batch: findItem.batch,
        nama: findItem.nama,
        expired: findItem.expired,
        satuan: item.satuanObat || item.jenisObat || findItem.satuan,
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
        idPrmrj: idPrmrj,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
        kronis:req.body.kronis || false,  
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
  }, // end input resep
  inputResepRacikan: async (req, res) => { //start input racikan 
    try {
      const item = await req.body.dataObat;
      const payloadResep = req.body.dataResep || {};
      const idPrmrj = req.body.idPrmrj || (payloadResep && payloadResep.idPrmrj) || null;

      const getCabar = await CheckinModel.findOne({
        noCheckin: payloadResep.noCheckin,
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

      // Untuk racikan, proses yang sama berlaku: cari resep yang cocok berdasarkan
      // noCheckin/idPrmrj, atau buat baru agar tidak terhalang oleh missing _id.
      let getResep = null;
      const resepId = payloadResep._id || payloadResep.id || payloadResep.resepId;
      if (resepId) {
        try {
          getResep = await ResepModel.findById(ObjectId(resepId));
        } catch (error) {
          getResep = null;
        }
      }

      if (!getResep) {
        const searchQuery = { noCheckin: payloadResep.noCheckin };
        if (idPrmrj) {
          searchQuery.idPrmrj = String(idPrmrj);
        }
        getResep = await ResepModel.findOne(searchQuery).sort({ createdAt: -1 });
      }

      // Jika resep belum ada, buat instance baru agar input racikan tetap bisa
      // disimpan tanpa refresh halaman.
      if (!getResep) {
        getResep = await new ResepModel({
          noCheckin: payloadResep.noCheckin,
          idPrmrj: idPrmrj || null,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          user: req.body.user || "system",
        }).save();
      }

      if (idPrmrj) {
        getResep.idPrmrj = idPrmrj;
      }

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
        idPrmrj: idPrmrj,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
        kronis: req.body.kronis || false,
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
  }, // end
  detailResep: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.aggregate([
        { $match: { _id: ObjectId(req.body._id) } },
        { $sort: { "obat.nama": 1 } },
        { $unwind: "$obat" },
        {
          $match: {
            "obat.kronis": { $nin: [true, "true"] },
          },
        },
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

      let detailData = getDetailResep;
      if (!detailData.length) {
        const resep = await ResepModel.findById(ObjectId(req.body._id)).lean();
        const obat = Array.isArray(resep?.obat)
          ? resep.obat
              .filter((item) => item?.kronis !== true && item?.kronis !== "true")
              .reduce((items, item) => {
                const nama = Array.isArray(item.nama) ? item.nama.join(", ") : item.nama;
                const existing = items.find((entry) => entry.nama === nama);
                const jumlah = Number(item.jumlah) || 0;
                const subtotalBPJS = Number(item.hargaJualBPJS) * jumlah || 0;
                const subtotalYANKES = Number(item.hargaJualYANKES) * jumlah || 0;

                if (existing) {
                  existing.count += jumlah;
                  existing.subtotalBPJS += subtotalBPJS;
                  existing.subtotalYANKES += subtotalYANKES;
                } else {
                  items.push({ nama, count: jumlah, subtotalBPJS, subtotalYANKES });
                }
                return items;
              }, [])
          : [];

        if (obat.length) {
          detailData = [{
            _id: resep._id,
            obat,
            grandTotalBPJS: obat.reduce((total, item) => total + item.subtotalBPJS, 0),
            grandTotalYANKES: obat.reduce((total, item) => total + item.subtotalYANKES, 0),
          }];
        }
      }

      return res.status(200).send({
        status: "success",
        message: "ok.",
        data: detailData,
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
