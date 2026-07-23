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
  checkin: async (req, res) => {
    var catatan = req.body.catatan;
    var diagnosa = req.body.diagnosa;
    var dinsos = req.body.dinsos;
    var noSKTM = req.body.noSKTM;
    var prolanisPRB = req.body.prolanisPRB;
    var jnsPelayanan = req.body.jnsPelayanan;
    var kelasRawat = req.body.kelasRawat;
    var noRujukan = req.body.noRujukan;
    var noSep = req.body.noSep;
    var penjamin = req.body.penjamin;
    var asuransi = req.body.asuransi;
    var hakKelas = req.body.hakKelas;
    var jnsPeserta = req.body.jnsPeserta;
    var kelamin = req.body.kelamin;
    var nama = req.body.nama;
    var noKartu = req.body.noKartu;
    var noMr = req.body.noMr;
    var tglLahir = req.body.tglLahir;
    var poli = req.body.poli;
    var poliEksekutif = req.body.poliEksekutif;
    var tglSep = req.body.tglSep;
    var dpjp = req.body.dpjp;
    var kodedpjp = req.body.kodedpjp;
    var cabar = req.body.cabar;
    var ruangan = req.body.ruangan;
    var user = req.body.user;
    var jenisPasien = req.body.jenisPasien;
    try {
      const cariCheckin = await Checkin.countDocuments({});
      var noCheckin = cariCheckin + 1;
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglInput = dateTime;
      const checkNorm = await Checkin.find({ noMr: noMr, status: 0 });
      if (checkNorm.length > 0) {
        return res.status(404).send({
          error: 400,
          status: "error",
          message: "ERROR_CHECKIN_UP",
          data: null,
        });
      }
      const daftarBaru = await Checkin.create({
        noCheckin: noCheckin,
        catatan: catatan,
        diagnosa: diagnosa,
        dinsos: dinsos,
        noSKTM: noSKTM,
        prolanisPRB: prolanisPRB,
        jnsPelayanan: jnsPelayanan,
        kelasRawat: kelasRawat,
        noRujukan: noRujukan,
        noSep: noSep,
        penjamin: penjamin,
        asuransi: asuransi,
        hakKelas: hakKelas,
        jnsPeserta: jnsPeserta,
        kelamin: kelamin,
        nama: nama,
        noKartu: noKartu,
        noMr: noMr,
        tglLahir: tglLahir,
        poli: poli,
        poliEksekutif: poliEksekutif,
        tglSep: tglSep,
        dpjp: dpjp,
        kodedpjp: kodedpjp,
        user: user,
        cabar: cabar,
        ruangan: ruangan,
        tglInput: tglInput,
        jenisPasien: jenisPasien,
      });

      var io = req.app.get("socketio");
      const sendIo = await io.emit("checkin", jnsPelayanan);

      res.json({
        status: "success",
        message: "Checkin sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  checkout: async (req, res) => {
    var noCheckin = req.body.nocheckin;
    var caraPulang = req.body.caraPulang;
    var userOut = req.body.userOut;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglCheckout = dateTime;
      const daftarBaru = await Checkin.findOne({
        noCheckin: noCheckin,
      });
      daftarBaru.tglOut = tglCheckout;
      daftarBaru.caraPulang = caraPulang;
      daftarBaru.userOut = userOut;
      daftarBaru.status = "1";
      daftarBaru.save();

      var io = req.app.get("socketio");
      const sendIo = await io.emit("checkout", "PENDAFTARAN");

      res.json({
        status: "success",
        message: "Checkout sukses",
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
  saveSep: async (req, res) => {
    try {
      const saveSep = await Sep.create({
        noSep: req.body.noSep,
        noKartu: req.body.noKartu,
        tglSep: req.body.tglSep,
        ppkPelayanan: req.body.ppkPelayanan,
        jnsPelayanan: req.body.jnsPelayanan,
        klsRawatHak: req.body.klsRawatHak,
        klsRawatNaik: req.body.klsRawatNaik,
        pembiayaan: req.body.nopembiayaanSep,
        penanggungJawab: req.body.penanggungJawab,
        noMR: req.body.noMR,
        asalRujukan: req.body.asalRujukan,
        tglRujukan: req.body.tglRujukan,
        noRujukan: req.body.noRujukan,
        ppkRujukan: req.body.ppkRujukan,
        catatan: req.body.catatan,
        diagAwal: req.body.diagAwal,
        tujuan: req.body.tujuan,
        eksekutif: req.body.eksekutif,
        cob: req.body.cob,
        katarak: req.body.katarak,
        lakaLantas: req.body.lakaLantas,
        noLP: req.body.noLP,
        tglKejadian: req.body.tglKejadian,
        keterangan: req.body.keterangan,
        suplesi: req.body.suplesi,
        noSepSuplesi: req.body.noSepSuplesi,
        kdPropinsi: req.body.kdPropinsi,
        kdKabupaten: req.body.kdKabupaten,
        kdKecamatan: req.body.kdKecamatan,
        tujuanKunj: req.body.tujuanKunj,
        flagProcedure: req.body.flagProcedure,
        kdPenunjang: req.body.kdPenunjang,
        assesmentPel: req.body.assesmentPel,
        noSurat: req.body.noSurat,
        kodeDPJP: req.body.kodeDPJP,
        dpjpLayan: req.body.dpjpLayan,
        noTelp: req.body.noTelp,
        user: req.body.user,
      });

      var io = req.app.get("socketio");
      const sendIo = await io.emit("saveSep", req.body.jnsPelayanan);

      res.json({
        status: "success",
        message: "Save SEP sukses",
        data: req.body,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  updatedatasep: async (req, res) => {
    var nocheckin = req.body.nocheckin;
    var nosep = req.body.nosep;
    var prb = req.body.prb;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglCheckout = dateTime;
      const updatePasien = await Checkin.findOne({
        nocheckin: nocheckin,
      });
      updatePasien.noSep = nosep;
      updatePasien.prb = prb;
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
  cariDataKunjunganNoSep: async (req, res) => {
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
  cariDataKunjungan: async (req, res) => {
    try {
      const cariNorm = await Checkin.find({ noRujukan: req.params.nosep });
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
