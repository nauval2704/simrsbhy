const antreanrsModel = require("../models/antreanrs");
var moment = require("moment"); // require
module.exports = {
  createAntrean: async (req, res) => {
    try {
      var tglInput = moment().format("YYYY-MM-DD HH:mm:ss");
      const dataAntri = new antreanrsModel({
        loket: req.body.loket,
        kodeAntrean: req.body.kode,
        noAntrean: 1,
        reset: 0,
        tglInput: tglInput,
      });
      const newAntri = await dataAntri.save();
      var io = req.app.get("socketio");
      const sendIo = await io.emit("antrianBaru", req.body.loket);
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: "berhasil di create",
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  getAntrean: async (req, res) => {
    try {
      const loket = req.body.loket;
      const kode = req.body.kode;
      const dataAntri = await antreanrsModel.aggregate([
        {
          $match: {
            kodeAntrean: kode,
          },
        },
        {
          $count: "noAntrean",
        },
      ]);
      var io = req.app.get("socketio");
      const sendIo = await io.emit("printAntrian", loket);
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: dataAntri,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  sisaAntrean: async (req, res) => {
    try {
      const dataAntri1 = await antreanrsModel
        .find({ loket: "1", reset: 0 })
        .count();
      const dataAntri2 = await antreanrsModel
        .find({ loket: "2", reset: 0 })
        .count();
      const dataAntri3 = await antreanrsModel
        .find({ loket: "3", reset: 0 })
        .count();
      var io = req.app.get("socketio");
      const sendIo = await io.emit("printAntrian", "sisa antrean");
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: { l1: dataAntri1, l2: dataAntri2, l3: dataAntri3 },
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  pAntrean: async (req, res) => {
    try {
      const loket = req.body.loket;
      const dataAntri = await antreanrsModel
        .find({ loket: loket, reset: 0 })
        .count();
      const dataAntri1 = await antreanrsModel
        .find({ loket: loket, reset: 1 })
        .count();
      const dataAntri2 = await antreanrsModel.find({ loket: loket }).count();
      var io = req.app.get("socketio");
      const sendIo = await io.emit("loadAntrian", loket);
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: { b: dataAntri, s: dataAntri1, t: dataAntri2 },
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  uAntrean: async (req, res) => {
    try {
      const loket = req.body.loket;
      const dataAntri = await antreanrsModel.findOne({
        loket: loket,
        reset: 0,
      });
      dataAntri.reset = 1;
      dataAntri.save();
      var io = req.app.get("socketio");
      const sendIo = await io.emit("uAntrian", loket);
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  iAntrean: async (req, res) => {
    try {
      const loket = req.body.loket;
      const kode = req.body.kode;
      const no = req.body.no;
      var io = req.app.get("socketio");
      const sendIo = await io.emit("iAntrian", {
        loket: loket,
        kode: kode,
        no: no,
      });
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  sAntrean: async (req, res) => {
    try {
      const loket = req.body.loket;
      const kode = req.body.kode;
      const no = req.body.no;
      var io = req.app.get("socketio");
      const sendIo = await io.emit("sAntrian", {
        loket: loket,
        kode: kode,
        no: no,
      });
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
  rAntrean: async (req, res) => {
    try {
      const dataAntri = await antreanrsModel.deleteMany({});
      var io = req.app.get("socketio");
      const sendIo = await io.emit("rAntrian", "RESET ANTREAN");
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_RUJUKAN",
        data: null,
      });
    }
  },
};
