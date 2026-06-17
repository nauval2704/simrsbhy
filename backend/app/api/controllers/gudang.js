const distributorModel = require("../models/distributor");
const gudangModel = require("../models/gudang");
const obatLuarModel = require("../models/stock/obatLuar");
const jenisSediaannModel = require("../models/gudangJenisSediaan");
const satuanModel = require("../models/gudangSatuan");
const kategoriModel = require("../models/gudangKategori");
const obatModel = require("../models/gudangObat");
const bhpModel = require("../models/gudangBhp");
const alkesModel = require("../models/gudangAlkes");
const stockApotekModel = require("../models/stockApotek");
const stockIgdModel = require("../models/stockIgd");
const requestGudangModel = require("../models/requestGudang");
const employeeModel = require("../models/employee");
var moment = require("moment");
var mongoose = require("mongoose");
const gudangObat = require("../models/gudangObat");
const gudangBhp = require("../models/gudangBhp");
const gudangAlkes = require("../models/gudangAlkes");
const { get } = require("request");
const stockInap = require("../models/stockInap");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  addDistributor: async (req, res) => {
    try {
      const addDistributor = new distributorModel({
        nama: req.body.nama,
        alamat: req.body.alamat,
        telp: req.body.telp,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await addDistributor.save();
      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: addDistributor,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Distributor sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  getDistributor: async (req, res) => {
    try {
      const getDistributor = await distributorModel.find({}).sort({ nama: 1 });
      if (getDistributor.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getDistributor);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  getDistributorById: async (req, res) => {
    try {
      const getDistributor = await distributorModel.findById(req.params.id);
      if (getDistributor.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getDistributor);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  inputFaktur: async (req, res) => {
    try {
      const inputFaktur = new gudangModel({
        noFaktur: req.body.noFaktur,
        tglFaktur: req.body.tglFaktur,
        distributor: req.body.distributor,
        kategori: req.body.kategori,
        batch: req.body.batch,
        nama: req.body.nama,
        expired: req.body.expired,
        satuan: req.body.satuan,
        jenis: req.body.jenis,
        jumlah: req.body.jumlah,
        hargaBeli: req.body.hargaBeli,
        hargaSatuan: req.body.hargaSatuan,
        hargaJualBPJS: req.body.hargaJualBPJS,
        hargaJualYANKES: req.body.hargaJualYANKES,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await inputFaktur.save();

      return res.status(200).send({
        status: "success",
        message: "Input Barang sukses",
        data: null,
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
  obatLuar: async (req, res) => {
    try {
      const inputObatLuar = new obatLuarModel(req.body);
      await inputObatLuar.save();

      return res.status(200).send({
        status: "success",
        message: "Input Barang sukses",
        data: inputObatLuar,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add obat luar",
        data: null,
      });
    }
  },
  barangBhp: async (req, res) => {
    try {
      const stock = req.params.stock;
      const data = req.body;

      const modelMapping = {
        'IGD': stockIgdModel,
        'INAP': stockInap,
        'APOTEK': stockApotekModel
      };

      const Model = modelMapping[stock];

      if (!Model) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid stock type'
        });
      }

      const inputBarang = new Model(data);
      await inputBarang.save();

      // Return Success
      res.status(200).json({
        status: 'success',
        message: 'Input Barang sukses',
        data: inputBarang
      });

    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add obat luar",
        data: null,
      });
    }
  },
  getFaktur: async (req, res) => {
    const today = moment().format("YYYY-MM-DD");
    try {
      const getFaktur = await gudangModel.aggregate([
        {
          $match: {
            $or: [{ createdAt: { $regex: "(?i).*" + today + ".*" } }],
          },
        },
        {
          $group: {
            _id: "$noFaktur",
            distributor: { $first: "$distributor" },
            jumlah: { $sum: "$jumlah" },
            createdAt: { $first: "$createdAt" },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
      if (getFaktur.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getFaktur);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get faktur",
        data: null,
      });
    }
  },
  getFakturByNoFaktur: async (req, res) => {
    try {
      const getItem = await gudangModel.aggregate([
        {
          $match: {
            noFaktur: req.body.noFaktur,
            tglFaktur: req.body.tglFaktur,
            distributor: ObjectId(req.body.idDistributor),
          },
        },
        {
          $group: {
            _id: { nama: "$nama", batch: "$batch" },
            noFaktur: { $first: "$noFaktur" },
            tglFaktur: { $first: "$tglFaktur" },
            jumlah: { $sum: "$jumlah" },
            hargaBeli: { $first: "$hargaBeli" },
            hargaSatuan: { $first: "$hargaSatuan" },
            hargaJualBPJS: { $first: "$hargaJualBPJS" },
            hargaJualYANKES: { $first: "$hargaJualYANKES" },
            total: {
              $sum: {
                $multiply: ["$jumlah", "$hargaBeli"],
              },
            },
            createdAt: { $first: "$createdAt" },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
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
  getFakturByTanggalFaktur: async (req, res) => {
    try {
      const getItem = await gudangModel.aggregate([
        {
          $match: {
            tglFaktur: req.body.tglFaktur,
          },
        },
        {
          $group: {
            _id: { nama: "$nama", batch: "$batch" },
            noFaktur: { $first: "$noFaktur" },
            distributor: { $first: "$distributor" },
            tglFaktur: { $first: "$tglFaktur" },
            jumlah: { $sum: "$jumlah" },
            hargaBeli: { $first: "$hargaBeli" },
            hargaSatuan: { $first: "$hargaSatuan" },
            hargaJualBPJS: { $first: "$hargaJualBPJS" },
            hargaJualYANKES: { $first: "$hargaJualYANKES" },
            total: {
              $sum: {
                $multiply: ["$jumlah", "$hargaBeli"],
              },
            },
            createdAt: { $first: "$createdAt" },
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
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
  addJenisSediaan: async (req, res) => {
    try {
      const addJenisSediaan = new jenisSediaannModel({
        nama: req.body.nama,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await addJenisSediaan.save();
      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: addJenisSediaan,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Jenis Sediaan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Jenis Sediaan",
        data: null,
      });
    }
  },
  getJenisSediaan: async (req, res) => {
    try {
      const getJenisSediaan = await jenisSediaannModel
        .find({})
        .sort({ nama: 1 });
      if (getJenisSediaan.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getJenisSediaan);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Jenis Sediaan",
        data: null,
      });
    }
  },
  addSatuan: async (req, res) => {
    try {
      const addDSatuan = new satuanModel({
        nama: req.body.nama,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await addDSatuan.save();
      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: addDSatuan,
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
  getSatuan: async (req, res) => {
    try {
      const getSatuanr = await satuanModel.find({}).sort({ nama: 1 });
      if (getSatuanr.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getSatuanr);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  getFakturItemsByDate: async (req, res) => {
    try {
      const getItem = await gudangModel.aggregate([
        {
          $match: {
            tglFaktur: {
              $gte: req.params.start,
              $lte: req.params.end,
            },
          },
        },
        {
          $group: {
            _id: {
              noFaktur: "$noFaktur",
              distributor: "$distributor",
              tglFaktur: "$tglFaktur",
            },
            tglFaktur: { $first: "$tglFaktur" },
            createdAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "distributors",
            localField: "_id.distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
        {
          $lookup: {
            from: "gudangs",
            let: {
              noFaktur: "$_id.noFaktur",
              tglFaktur: "$_id.tglFaktur",
              distributor: "$_id.distributor",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$noFaktur", "$noFaktur"] },
                      { $eq: ["$$tglFaktur", "$tglFaktur"] },
                      { $eq: ["$$distributor", "$distributor"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$nama",
                  noFaktur: { $first: "$noFaktur" },
                  tglFaktur: { $first: "$tglFaktur" },
                  jumlah: { $sum: 1 },
                  hargaBeli: { $first: "$hargaBeli" },
                  hargaSatuan: { $first: "$hargaSatuan" },
                  hargaJualBPJS: { $first: "$hargaJualBPJS" },
                  hargaJualYANKES: { $first: "$hargaJualYANKES" },
                  total: {
                    $sum: {
                      $multiply: ["$jumlah", "$hargaBeli"],
                    },
                  },
                  createdAt: { $first: "$createdAt" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            as: "dataObat",
          },
        },
        { $sort: { tglFaktur: 1, createdAt: 1 } },
      ]);
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
  getRincianHutangItemsByDate: async (req, res) => {
    try {
      const getItem = await gudangModel.aggregate([
        {
          $match: {
            tglFaktur: {
              $gte: req.params.start,
              $lte: req.params.end,
            },
          },
        },
        {
          $group: {
            _id: "$distributor",
          },
        },
        {
          $lookup: {
            from: "distributors",
            localField: "_id",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
        { $unwind: "$dataDistributor" },
        { $project: { "dataDistributor.nama": 1 } },
        {
          $lookup: {
            from: "gudangs",
            let: {
              idDistributor: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$idDistributor", "$distributor"] },
                      { $gte: ["$tglFaktur", req.params.start] },
                      { $lte: ["$tglFaktur", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$noFaktur",
                },
              },
              {
                $lookup: {
                  from: "gudangs",
                  let: {
                    noFaktur: "$_id",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$$noFaktur", "$noFaktur"] },
                            { $gte: ["$tglFaktur", req.params.start] },
                            { $lte: ["$tglFaktur", req.params.end] },
                          ],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: { nama: "$nama", batch: "$batch" },
                        tglFaktur: { $first: "$tglFaktur" },
                        jumlah: { $sum: 1 },
                        satuan: { $first: "$satuan" },
                        jenis: { $first: "$jenis" },
                        hargaBeli: { $first: "$hargaBeli" },
                        noFaktur: { $first: "$noFaktur" },
                      },
                    },
                    {
                      $facet: {
                        dataTotal: [
                          {
                            $group: {
                              _id: null,
                              total: { $sum: "$hargaBeli" },
                            },
                          },
                          {
                            $addFields: {
                              _id: "$_id",
                            },
                          },
                        ],
                        dataListObat: [{ $skip: 0 }, { $limit: 10 }],
                      },
                    },
                    { $unwind: "$dataTotal" },
                  ],
                  as: "listObat",
                },
              },
              { $unwind: "$listObat" },
              {
                $facet: {
                  dataGrandTotal: [
                    {
                      $group: {
                        _id: null,
                        gTotal: { $sum: "$listObat.dataTotal.total" },
                      },
                    },
                    {
                      $addFields: {
                        _id: "$_id",
                      },
                    },
                  ],

                  data: [{ $skip: 0 }, { $limit: 10 }],
                },
              },
            ],
            as: "dataObat",
          },
        },
        { $sort: { "dataDistributor.nama": 1 } },
      ]);
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
  getBeritaAcaraItemsByDate: async (req, res) => {
    try {
      const getItem = await gudangModel.aggregate([
        {
          $match: {
            tglFaktur: {
              $gte: req.params.start,
              $lte: req.params.end,
            },
          },
        },
        {
          $group: {
            _id: "$distributor",
          },
        },
        {
          $lookup: {
            from: "distributors",
            localField: "_id",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
        { $unwind: "$dataDistributor" },
        {
          $lookup: {
            from: "gudangs",
            let: {
              idDistributor: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$idDistributor", "$distributor"] },
                      { $gte: ["$tglFaktur", req.params.start] },
                      { $lte: ["$tglFaktur", req.params.end] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$noFaktur",
                },
              },
              {
                $lookup: {
                  from: "gudangs",
                  let: {
                    noFaktur: "$_id",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$$noFaktur", "$noFaktur"] },
                            { $gte: ["$tglFaktur", req.params.start] },
                            { $lte: ["$tglFaktur", req.params.end] },
                          ],
                        },
                      },
                    },
                    {
                      $group: {
                        _id: "$nama",
                        tglFaktur: { $first: "$tglFaktur" },
                        jumlah: { $sum: 1 },
                        satuan: { $first: "$satuan" },
                        jenis: { $first: "$jenis" },
                        hargaBeli: { $first: "$hargaBeli" },
                        noFaktur: { $first: "$noFaktur" },
                      },
                    },
                    { $sort: { tglFaktur: -1 } },
                  ],
                  as: "listObat",
                },
              },
              { $sort: { _id: 1 } },
              { $unwind: "$listObat" },
            ],
            as: "dataObat",
          },
        },
        { $sort: { "dataDistributor.nama": 1 } },
      ]);
      if (getItem.length == 0) {
        return res.status(200).send([]);
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
  laporanGudang: async (req, res) => {
    try {
      const getLaporanObat = await gudangObat.aggregate([
        {
          $lookup: {
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $eq: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $lt: ["$createdAt", req.params.start] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$tglFaktur", req.params.start] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start + 1] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
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
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $eq: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $lt: ["$createdAt", req.params.start] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$tglFaktur", req.params.start] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start + 1] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
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
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $eq: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $lt: ["$createdAt", req.params.start] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $lt: ["$tglFaktur", req.params.start] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "gudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$nama", "$nama"] },
                      { $gte: ["$createdAt", req.params.start + 1] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      { $ne: ["$noFaktur", "000000"] },
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
            from: "requestgudangs",
            let: {
              nama: "$nama",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $gte: ["$createdAt", req.params.start] },
                      { $lt: ["$createdAt", req.params.end + 1] },
                      {
                        $anyElementTrue: {
                          $map: {
                            input: "$items",
                            as: "item",
                            in: { $eq: ["$$item.nama", "$$nama"] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              {
                $unwind: "$items",
              },
              {
                $group: {
                  _id: "$items.nama",
                  jumlah: { $sum: "$items.jumlah" },
                },
              },
              { $sort: { _id: 1 } },
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
            from: "gudangs",
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
                      { $ne: ["$noFaktur", "000000"] },
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

  addKategori: async (req, res) => {
    try {
      const addItems = new kategoriModel({
        nama: req.body.nama,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      await addItems.save();
      return res.status(200).send({
        status: "success",
        message: "Add kategori sukses",
        data: addItems,
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
  getKategori: async (req, res) => {
    try {
      const getItems = await kategoriModel.find({}).sort({ nama: 1 });
      if (getItems.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getItems);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  addDaftarItems: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori == "OBAT") {
        const addItems = new obatModel({
          nama: req.body.nama.toUpperCase(),
          satuan: req.body.satuan,
          jenis: req.body.jenis,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Add distributor sukses",
          data: addItems,
        });
      }
      if (kategori == "BHP") {
        const addItems = new bhpModel({
          nama: req.body.nama.toUpperCase(),
          satuan: req.body.satuan,
          jenis: req.body.jenis,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Add distributor sukses",
          data: addItems,
        });
      }
      if (kategori == "ALKES") {
        const addItems = new alkesModel({
          nama: req.body.nama.toUpperCase(),
          satuan: req.body.satuan,
          jenis: req.body.jenis,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Add alkes sukses",
          data: addItems,
        });
      }
      return res.status(200).send(null);
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
  getdaftarItems: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori == "OBAT") {
        const getItems = await obatModel.find({}).sort({ nama: 1 });
        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      if (kategori == "BHP") {
        const getItems = await bhpModel.find({}).sort({ nama: 1 });
        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      if (kategori == "ALKES") {
        const getItems = await alkesModel.find({}).sort({ nama: 1 });
        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(200).send(null);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  addRequestGudang: async (req, res) => {
    try {
      if (req.body) {
        const addItems = new requestGudangModel({
          items: req.body.data,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        addItems.from = req.body.from;
        await addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Add request gudang sukses",
          data: addItems,
        });
      }
      return res.status(200).send(null);
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
  getRequestGudang: async (req, res) => {
    try {
      if (req.body) {
        const getItems = await requestGudangModel
          .find({ status: 0 })
          .sort({ createdAt: 1 });
        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(200).send(null);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  requestGudangSelesai: async (req, res) => {
    try {
      if (req.body.from === "INAP") {
        for (let index = 0; index < req.body.items.length; index++) {
          const element = await req.body.items[index];
          const item = await element;

          const findItem = await gudangModel
            .findOneAndUpdate(
              { nama: item.nama, noFaktur: item.noFaktur },
              {
                $inc: { jumlah: -item.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
          const addStockInap = await new stockInap({
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
            jumlah: item.jumlah,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          addStockInap.save();
          // TODO update requset apotek
        }
        const updateRequestApotek = await requestGudangModel.findById(
          req.body._id
        );
        updateRequestApotek.status = 1;
        updateRequestApotek.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        updateRequestApotek.save();
        return res.status(200).send({
          status: "success",
          message: "Add request gudang sukses",
          data: null,
        });
      }
      if (req.body.from === "APOTEK") {
        for (let index = 0; index < req.body.items.length; index++) {
          const element = await req.body.items[index];
          const item = await element;

          const findItem = await gudangModel
            .findOneAndUpdate(
              { nama: item.nama, noFaktur: item.noFaktur },
              {
                $inc: { jumlah: -item.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
          const addStockApotek = await new stockApotekModel({
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
            jumlah: item.jumlah,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          addStockApotek.save();
          // TODO update requset apotek
        }
        const updateRequestApotek = await requestGudangModel.findById(
          req.body._id
        );
        updateRequestApotek.status = 1;
        updateRequestApotek.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        updateRequestApotek.save();
        return res.status(200).send({
          status: "success",
          message: "Add request gudang sukses",
          data: null,
        });
      }
      for (let index = 0; index < req.body.items.length; index++) {
        const element = await req.body.items[index];
        const item = await element;

        const findItem = await gudangModel
          .findOneAndUpdate(
            { nama: item.nama, noFaktur: item.noFaktur },
            {
              $inc: { jumlah: -item.jumlah },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            {
              new: true,
            }
          )
          .sort({ createdAt: 1 });
        const addStockIgd = await new stockIgdModel({
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
          jumlah: item.jumlah,
          hargaBeli: findItem.hargaBeli,
          hargaSatuan: findItem.hargaSatuan,
          hargaJualBPJS: findItem.hargaJualBPJS,
          hargaJualYANKES: findItem.hargaJualYANKES,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        addStockIgd.save();
        // TODO update requset apotek
      }
      const updateRequestIgd = await requestGudangModel.findById(req.body._id);
      updateRequestIgd.status = 1;
      updateRequestIgd.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      updateRequestIgd.save();
      return res.status(200).send({
        status: "success",
        message: "Add request gudang sukses",
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
  requestGudangBatal: async (req, res) => {
    try {
      if (req.body) {
        const addItems = await requestGudangModel.findOne({
          _id: req.body.id,
        });
        addItems.status = 3;
        addItems.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Remove request gudang sukses",
          data: addItems,
        });
      }
      return res.status(200).send(null);
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
  laporanSppm: async (req, res) => {
    try {
      const getLaporanObat = await gudangModel.aggregate([
        {
          $match: {
            kategori: "OBAT",
            $expr: {
              $and: [
                { $gte: ["$createdAt", req.params.start + " 00:00:01"] },
                { $lte: ["$createdAt", req.params.end + " 23:59:59"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$nama",
            jumlah: { $sum: "$jumlah" },
            satuan: { $first: "$satuan" },
            jenis: { $first: "$jenis" },
            harga: { $first: "$hargaBeli" },
          },
        },
        {
          $project: {
            _id: "$_id",
            jumlah: "$jumlah",
            satuan: "$satuan",
            jenis: "$jenis",
            harga: "$harga",
          },
        },
        {
          $facet: {
            dataTotal: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$harga" },
                },
              },
              {
                $addFields: {
                  _id: "$_id",
                },
              },
            ],
            data: [{ $skip: 0 }, { $limit: 10 }],
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const getLaporanBhp = await gudangModel.aggregate([
        {
          $match: {
            kategori: "BHP",
            $expr: {
              $and: [
                { $gte: ["$createdAt", req.params.start + " 00:00:01"] },
                { $lte: ["$createdAt", req.params.end + " 23:59:59"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$nama",
            jumlah: { $sum: "$jumlah" },
            satuan: { $first: "$satuan" },
            jenis: { $first: "$jenis" },
            harga: { $first: "$hargaBeli" },
          },
        },
        {
          $project: {
            _id: "$_id",
            jumlah: "$jumlah",
            satuan: "$satuan",
            jenis: "$jenis",
            harga: "$harga",
          },
        },
        {
          $facet: {
            dataTotal: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$harga" },
                },
              },
              {
                $addFields: {
                  _id: "$_id",
                },
              },
            ],
            data: [{ $skip: 0 }, { $limit: 10 }],
          },
        },
        { $sort: { _id: 1 } },
      ]);
      const getLaporanAlkes = await gudangModel.aggregate([
        {
          $match: {
            kategori: "ALKES",
            $expr: {
              $and: [
                { $gte: ["$createdAt", req.params.start + " 00:00:01"] },
                { $lte: ["$createdAt", req.params.end + " 23:59:59"] },
              ],
            },
          },
        },
        {
          $group: {
            _id: "$nama",
            jumlah: { $sum: "$jumlah" },
            satuan: { $first: "$satuan" },
            jenis: { $first: "$jenis" },
            harga: { $first: "$hargaBeli" },
          },
        },
        {
          $project: {
            _id: "$_id",
            jumlah: "$jumlah",
            satuan: "$satuan",
            jenis: "$jenis",
            harga: "$harga",
          },
        },
        {
          $facet: {
            dataTotal: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$harga" },
                },
              },
              {
                $addFields: {
                  _id: "$_id",
                },
              },
            ],
            data: [{ $skip: 0 }, { $limit: 10 }],
          },
        },
        { $sort: { _id: 1 } },
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
  getdaftarItemsByStock: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await gudangModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
          { $sort: { createdAt: 1 } },
          {
            $group: {
              _id: {
                nama: "$nama",
                noFaktur: "$noFaktur",
              },
              stock: { $sum: "$jumlah" },
              harga: { $first: "$hargaSatuan" },
              distributor: { $first: "$distributor" },
            },
          },
          { $sort: { "_id.nama": 1 } },
          {
            $lookup: {
              from: "distributors",
              localField: "distributor",
              foreignField: "_id",
              as: "dataDistributor",
            },
          },
        ]);

        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get stock",
        data: null,
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
  getListObatLuar: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await obatLuarModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
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

        if (getItems.length === 0) {
          return res.status(200).send({
            status: "error",
            message: "error get stock",
            data: null,
          });
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        status: "error",
        message: "selected category is not available",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  deleteBarang: async (req, res) => {
    try {
      const checkBarang = await gudangModel.findOne({
        distributor: ObjectId(req.body.distributor),
        nama: req.body.data._id.nama,
        batch: req.body.data._id.batch,
        noFaktur: req.body.data.noFaktur,
        tglFaktur: req.body.data.tglFaktur,
      });
      if (checkBarang.jumlah !== req.body.data.jumlah) {
        return res.status(400).send({
          error: "check barang error",
          status: "error",
          message:
            "Barang Sudah ada yang di transfer ke apotek, tidak bisa di hapus, hubungi admin untuk lebih lanjut",
          data: null,
        });
      }
      const deleteBarang = await gudangModel.deleteMany({
        distributor: ObjectId(req.body.distributor),
        nama: req.body.data._id.nama,
        batch: req.body.data._id.batch,
        noFaktur: req.body.data.noFaktur,
        tglFaktur: req.body.data.tglFaktur,
        jumlah: req.body.data.jumlah,
      });
      return res.status(200).send(deleteBarang);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  addEmployee: async (req, res) => {
    try {
      const updateEmployee = await employeeModel
        .findOneAndUpdate(
          {},
          {
            namaKarumkit: req.body.namaKarumkit,
            noKarumkit: req.body.noKarumkit,
            namaKafarmasi: req.body.namaKafarmasi,
            noKafarmasi: req.body.noKafarmasi,
            namaApoteker: req.body.namaApoteker,
            noApoteker: req.body.noApoteker,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            new: true,
            upsert: true,
          }
        )
        .sort({ createdAt: 1 });
      return res.status(200).send({
        status: "success",
        message: "Update Employee sukses",
        data: updateEmployee,
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
  getEmployee: async (req, res) => {
    try {
      const getEmployee = await employeeModel.findOne({});
      return res.status(200).send({
        status: "success",
        message: "get employee sukses",
        data: getEmployee,
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
