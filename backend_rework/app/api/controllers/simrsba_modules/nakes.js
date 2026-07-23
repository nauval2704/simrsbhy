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
  cariDokter: async (req, res) => {
    var term = req.params.term;
    try {
      const cariNorm = await Nakes.find({
        nama: { $regex: "(?i).*" + term + ".*" },
      })
        .sort({ nama: 1 })
        .select({
          _id: 0,
          nama: 1,
        })
        .limit(100)
        .lean();
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
  hakUser: async (req, res) => {
    var username = req.body.username;
    var role = req.body.role;
    try {
      const checkNorm = await Users.updateOne(
        { username: username },
        { $set: { role: role } }
      );
      if (checkNorm.length > 0) {
        return res.status(404).send({
          error: 400,
          status: "error",
          message: "ERROR_CHECKUSER",
          data: null,
        });
      } else {
        res.json({
          status: "success",
          message: "Hak Akses User Berhasil",
          data: null,
        });
      }
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKUSER",
        data: null,
      });
    }
  },
  cariUser: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Users.find({ role: { $nin: "ROLE_ADMIN" } })
        .select({
          _id: 0,
          nama: 1,
          username: 1,
          role: 1,
        })
        .lean();
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
};
