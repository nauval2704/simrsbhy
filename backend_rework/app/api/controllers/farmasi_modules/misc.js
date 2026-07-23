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
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get distributor",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get faktur",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get distributor",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add Satuan",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
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
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
};
