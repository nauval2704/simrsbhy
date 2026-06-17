const gudangModel = require("../models/gudang");
const importModel = require("../models/import");
const apotekModel = require("../models/stockApotek");

var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  importStock: async (req, res) => {
    try {
      const getData = await importModel.find({});

      const updateData = await getData.forEach((element) => {
        for (let index = 0; index < element.jumlah; index++) {
          const inputFaktur = new gudangModel({
            noFaktur: element.noFaktur,
            tglFaktur: element.tglFaktur,
            distributor: element.distributor,
            kategori: element.kategori,
            batch: element.batch,
            nama: element.nama,
            satuan: element.satuan,
            jenis: element.jenis,
            jumlah: 1,
            hargaBeli: element.hargaBeli,
            hargaSatuan: element.hargaSatuan,
            hargaJualBPJS: element.hargaJualBPJS,
            hargaJualYANKES: element.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          inputFaktur.save();
        }
      });

      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: getData,
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
  deleteStock: async (req, res) => {
    try {
      const getData = await gudangModel.deleteMany({ tglFaktur: "2023-02-22" });

      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: getData,
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
  importStockApotek: async (req, res) => {
    try {
      const getData = await importModel.find({});

      const updateData = await getData.forEach((element) => {
        for (let index = 0; index < element.jumlah; index++) {
          const inputFaktur = new apotekModel({
            noFaktur: element.noFaktur,
            tglFaktur: element.tglFaktur,
            distributor: element.distributor,
            kategori: element.kategori,
            batch: element.batch,
            nama: element.nama,
            satuan: element.satuan,
            jenis: element.jenis,
            jumlah: 1,
            hargaBeli: element.hargaBeli,
            hargaSatuan: element.hargaSatuan,
            hargaJualBPJS: element.hargaJualBPJS,
            hargaJualYANKES: element.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          inputFaktur.save();
        }
      });

      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: getData,
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
  deleteStockApotek: async (req, res) => {
    try {
      const getData = await apotekModel.deleteMany({ tglFaktur: "2023-02-22" });

      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: getData,
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
