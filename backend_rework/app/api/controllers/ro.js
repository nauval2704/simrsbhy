const pasienModel = require("../models/pasien");
const roModel = require("../models/ro");

var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  pasien: async (req, res) => {
    try {
      const getData = await pasienModel.findOne({
        nik: req.params.nik,
        tgllahir: req.params.tglLahir,
      });

      if (!getData) {
        return res.status(400).send({
          status: "error",
          message: "Data Tidak Ditemukan",
          data: null,
        });
      }

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
  register: async (req, res) => {
    try {
      const data = await roModel.findOne({
        nik: req.body.nik,
      });

      if (!data) {
        const newData = new roModel({
          nik: req.body.nik,
          norm: req.body.norm,
          nama: req.body.nama,
          tglLahir: req.body.tglLahir,
          jenisKelamin: req.body.jenisKelamin,
          noTelp: req.body.noTelp,
          poli: req.body.poli,
          tglKunjungan: req.body.tglKunjungan,
          kategori: req.body.kategori,
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await newData.save();
        return res.status(200).send({
          status: "200",
          message: "ok",
          data: newData,
        });
      }

      data.poli = req.body.poli;
      data.tglKunjungan = req.body.tglKunjungan;
      data.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");

      await data.save();

      return res.status(200).send({
        status: "success",
        message: "Add distributor sukses",
        data: data,
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
  list: async (req, res) => {
    try {
      const getData = await roModel.find({});

      if (!getData) {
        return res.status(400).send({
          status: "error",
          message: "Data Tidak Ditemukan",
          data: null,
        });
      }

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
