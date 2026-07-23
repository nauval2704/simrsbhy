const Pasien = require("../../models/pasien");
const Triase = require("../../models/triase");
const { buildTriageBundle, sendFhirBundle } = require("../../utils/satusehat/fhirMapper");
const Users = require("../../models/users");
const Checkin = require("../../models/checkin");
const Sep = require("../../models/sep");
const Rujukan = require("../../models/rujukan");
const Tarif = require("../../models/tarif");
const Rincian = require("../../models/rincian");
const Nakes = require("../../models/nakes");
const Ruangan = require("../../models/ruangan");
const Faktur = require("../../models/faktur");
const ResepModel = require("../../models/resep");
var moment = require("moment"); // require
const checkin = require("../../models/checkin");
const Prmrj = require("../../models/prmrj");
const EdukasiPoli = require("../../models/edukasiPoli");
const CpptIgd = require("../../models/cpptIgd");
const CpptPoli = require("../../models/cpptPoli");
const RingkasanPulang = require("../../models/ringkasanPulang");
const PemberianObatIgd = require("../../models/pemberianObatIgd");
const PengkajianAwalPoli = require("../../models/pengkajianAwalPoli");
const PengkajianAwalIgd = require("../../models/pengkajianAwalIgd");
const PoliGigi = require("../../models/poliGigi");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types.ObjectId;


module.exports = {
  insertRujukan: async (req, res) => {
    try {
      const cariRujukan = await Pasien.find({
        $or: [{ noRujukan: { $regex: "(?i).*" + req.body.noRujukan + ".*" } }],
      });
      if (cariRujukan.length > 0) {
        return res.status(404).send({
          error: 400,
          status: "error",
          message: "ERROR_DAFTAR",
          data: null,
        });
      }

      const insertRujukan = await Rujukan.create({
        AsalRujukanKode: req.body.AsalRujukanKode,
        AsalRujukanNama: req.body.AsalRujukanNama,
        diagnosaKode: req.body.diagnosaKode,
        diagnosaNama: req.body.diagnosaNama,
        noRujukan: req.body.noRujukan,
        pesertaAsuransi: req.body.pesertaAsuransi,
        pesertaHakKelas: req.body.pesertaHakKelas,
        pesertaJnsPeserta: req.body.pesertaJnsPeserta,
        pesertaKelamin: req.body.pesertaKelamin,
        pesertaNama: req.body.pesertaNama,
        pesertaNoKartu: req.body.pesertaNoKartu,
        pesertaNoMr: req.body.pesertaNoMr,
        pesertaTglLahir: req.body.pesertaTglLahir,
        poliTujuanKode: req.body.poliTujuanKode,
        poliTujuanNama: req.body.poliTujuanNama,
        tglBerlakuKunjungan: req.body.tglBerlakuKunjungan,
        tglRencanaKunjungan: req.body.tglRencanaKunjungan,
        tglRujukan: req.body.tglRujukan,
        tujuanRujukanKode: req.body.tujuanRujukanKode,
        tujuanRujukanNama: req.body.tujuanRujukanNama,
        jenisPelayanan: req.body.jenisPelayanan,
        catatan: req.body.catatan,
        tipeRujukan: req.body.tipeRujukan,
        user: req.body.user,
      });
      res.json({
        status: "success",
        message: "Insert Rujukan Sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_NETWORK",
        data: null,
      });
    }
  },
  getLokalRujukan: async (req, res) => {
    try {
      const cariRujukan = await Rujukan.find({
        $or: [{ noRujukan: { $regex: "(?i).*" + req.body.noRujukan + ".*" } }],
      });
      res.json({
        status: "success",
        message: "Insert Rujukan Sukses",
        data: cariRujukan,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_NETWORK",
        data: null,
      });
    }
  },
  getLokalRujukanKartu: async (req, res) => {
    try {
      const cariRujukan = await Rujukan.find({
        $or: [
          { pesertaNoKartu: { $regex: "(?i).*" + req.body.noKartu + ".*" } },
        ],
      });
      res.json({
        status: "success",
        message: "Insert Rujukan Sukses",
        data: cariRujukan,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_NETWORK",
        data: null,
      });
    }
  },
  cariRujukanNoKartu: async (req, res) => {
    var nokartu = req.params.nokartu;
    try {
      const cariNorm = await Pasien.aggregate([
        {
          $match: {
            nobpjs: nokartu,
          },
        },
        {
          $lookup: {
            from: "checkins",
            localField: "norm",
            foreignField: "norm",
            as: "dRujukan",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dRujukan", 0] }, "$$ROOT"],
            },
          },
        },
        { $sort: { noCheckin: -1 } },
      ]);
      /* res.json(cariNorm); */
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: cariNorm,
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
  cariRujukanNoRujukan: async (req, res) => {
    var norujukan = req.params.norujukan;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noRujukan: norujukan } },
        {
          $lookup: {
            from: "pasiens",
            localField: "norm",
            foreignField: "norm",
            as: "user",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { user: 0 } },
        { $sort: { noCheckin: -1 } },
      ]);
      res.json({
        error: "EMPTY",
        status: "success",
        message: "OK",
        data: cariNorm,
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
  cariSuratKontrol: async (req, res) => {
    var nosuratkontrol = req.params.nosuratkontrol;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { nokontrolulang: nosuratkontrol } },
        {
          $lookup: {
            from: "pasiens",
            localField: "norm",
            foreignField: "norm",
            as: "user",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { user: 0 } },
        { $sort: { noCheckin: -1 } },
      ]);
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_PASIEN",
        data: null,
      });
    }
  },
  updatenorujukan: async (req, res) => {
    var nocheckin = req.body.nocheckin;
    var norujukan = req.body.norujukan;
    var user = req.body.user;
    var tglRujukan = req.body.tglRujukan;
    var jenisPelRujukan = req.body.jenisPelRujukan;
    var catatanRujukan = req.body.catatanRujukan;
    var diagRujukan = req.body.diagRujukan;
    var tipeRujukan = req.body.tipeRujukan;
    var poliRujukan = req.body.poliRujukan;
    var ppkDirujuk = req.body.ppkDirujuk;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglCheckout = dateTime;
      const updatePasien = await Checkin.findOne({
        noCheckin: nocheckin,
      });
      updatePasien.noRujukan = norujukan;
      updatePasien.status = "1";
      updatePasien.caraPulang = "2";
      updatePasien.tglCheckout = tglCheckout;
      updatePasien.userOut = user;
      updatePasien.tglRujukan = tglRujukan;
      updatePasien.jenisPelRujukan = jenisPelRujukan;
      updatePasien.catatanRujukan = catatanRujukan;
      updatePasien.diagRujukan = diagRujukan;
      updatePasien.tipeRujukan = tipeRujukan;
      updatePasien.poliRujukan = poliRujukan;
      updatePasien.ppkDirujuk = ppkDirujuk;
      updatePasien.save();

      var io = req.app.get("socketio");
      const sendIo = await io.emit("updateRujukan", "PENDAFTARAN");

      res.json({
        status: "success",
        message: "Update sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKOUT",
        data: null,
      });
    }
  },
};
