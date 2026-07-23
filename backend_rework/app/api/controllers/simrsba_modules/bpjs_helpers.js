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
  checknosep: async (req, res) => {
    try {
      const cariNorm = await Checkin.find({ noSep: req.params.nosep });
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
  countSep: async (req, res) => {
    try {
      const cariNorm = await Sep.countDocuments({
        noSep: req.params.noSep,
      });
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_DOKTER",
        data: null,
      });
    }
  },
  countNoRujukan: async (req, res) => {
    try {
      const cariNorm = await Sep.find({
        noRujukan: req.params.noRujukan,
      });
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_DOKTER",
        data: null,
      });
    }
  },
  updateCounter: async (req, res) => {
    try {
      const cariNorm = await Checkin.findOne({
        noCheckin: req.params.nocheckin,
      });
      cariNorm.counter += 1;
      cariNorm.save();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_DOKTER",
        data: null,
      });
    }
  },
};
