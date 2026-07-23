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
  cariRuang: async (req, res) => {
    var term = req.params.term;
    try {
      const cariNorm = await Ruangan.find({
        $or: [{ namaruang: { $regex: "(?i).*" + term + ".*" } }],
      })
        .sort({ namaruang: 1 })
        .select({
          _id: 0,
          kodeKelas: 1,
          koderuang: 1,
          namaruang: 1,
          kapasitas: 1,
          tersedia: 1,
          tersediapria: 1,
          tersediawanita: 1,
          tersediapriawanita: 1,
        })
        .limit(100)
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARIRUANG",
        data: null,
      });
    }
  },
  updateruang: async (req, res) => {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    var namaruang = req.body.namaruang;
    var kapasitas = req.body.kapasitas;
    var tersedia = req.body.tersedia;
    var tersediapria = req.body.tersediapria;
    var tersediawanita = req.body.tersediawanita;
    var tersediapriawanita = req.body.tersediapriawanita;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglinput = dateTime;
      const updatePasien = await Ruangan.findOne({
        namaruang: namaruang,
      });
      updatePasien.tersedia = tersedia;
      updatePasien.tersediapriawanita = tersediapriawanita;
      updatePasien.user = "SYSTEM";
      updatePasien.tglinput = tglinput;
      updatePasien.save();
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
  updateruangmasuk: async (req, res) => {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    var namaruang = req.body.namaruang;
    var kapasitas = req.body.kapasitas;
    var tersedia = req.body.tersedia;
    var tersediapria = req.body.tersediapria;
    var tersediawanita = req.body.tersediawanita;
    var tersediapriawanita = req.body.tersediapriawanita;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglinput = dateTime;
      const updatePasien = await Ruangan.findOne({
        namaruang: namaruang,
      });
      updatePasien.tersedia = tersedia - 1;
      updatePasien.tersediapriawanita = tersediapriawanita - 1;
      updatePasien.user = "SYSTEM";
      updatePasien.tglinput = tglinput;
      updatePasien.save();
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
