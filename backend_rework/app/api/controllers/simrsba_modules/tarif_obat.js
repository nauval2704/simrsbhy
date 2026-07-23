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
  editTarif: async (req, res) => {
    var nama = req.body.nama;
    var harga = req.body.harga;
    var pelayanan = req.body.pelayanan;
    var komposisi = req.body.komposisi;
    var stock = req.body.stock;
    var user = req.body.user;
    var noTarif = Number(req.body.noTarif);
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const editTarif = await Tarif.updateOne(
        { noTarif: noTarif },
        {
          $set: {
            nama: nama,
            harga: harga,
            pelayanan: pelayanan,
            komposisi: komposisi,
            stock: stock,
            user: user,
            tglInput: tglInput,
          },
        }
      );
      res.json({
        status: "success",
        message: "Tarif sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  editTarifFarmasi: async (req, res) => {
    var nama = req.body.data.nama;
    var harga = req.body.data.harga;
    var pelayanan = req.body.data.pelayanan;
    var satuan = req.body.data.satuan;
    var stock = req.body.data.stock;
    var user = req.body.data.user;
    var noTarif = req.body.data.noTarif;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const editTarif = await Tarif.updateOne(
        { noTarif: noTarif },
        {
          $set: {
            nama: nama,
            harga: harga,
            pelayanan: pelayanan,
            satuan: satuan,
            stock: stock,
            user: user,
            tglInput: tglInput,
          },
        }
      );
      res.json({
        status: "success",
        message: "Edit tarif sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  editStock: async (req, res) => {
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const addFaktur = new Faktur({
        noFaktur: req.body.data.noFaktur,
        noTarif: req.body.data.tarif.noTarif,
        stock: req.body.data.tarif.stock,
        user: req.body.data.tarif.user,
        tglInput: tglInput,
      });

      addFaktur.save((err, book) => {
        if (err)
          return res.status(400).send({
            error: err,
            status: "error",
            message: "ERROR_TARIF",
            data: null,
          });
      });

      const editTarif = await Tarif.updateOne(
        { noTarif: req.body.data.tarif.noTarif },
        {
          $set: {
            user: req.body.data.tarif.user,
            tglInput: tglInput,
          },
          $inc: { stock: req.body.data.tarif.stock },
        }
      );
      res.json({
        status: "success",
        message: "Tambah stock sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  tarifBaru: async (req, res) => {
    var nama = req.body.nama;
    var harga = req.body.harga;
    var pelayanan = req.body.pelayanan;
    var komposisi = req.body.komposisi;
    var stock = req.body.stock;
    var user = req.body.user;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      let noTarif = 0
      const cariNoTarif = await Tarif.findOne({})
        .select({ _id: 0, noTarif: 1 })
        .sort({ noTarif: -1 });
      if (cariNoTarif) {
        noTarif = Number(cariNoTarif.noTarif) + 1;
      }
      const daftarBaru = await Tarif.create({
        noTarif: noTarif,
        nama: nama,
        harga: harga,
        pelayanan: pelayanan,
        komposisi: komposisi,
        stock: stock,
        user: user,
        tglInput: tglInput,
      });
      res.json({
        status: "success",
        message: "Tarif sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  printObatv1: async (req, res) => {
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
};
