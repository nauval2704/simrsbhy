const Pasien = require("../models/pasien");
const Triase = require("../models/triase");
const { buildTriageBundle, sendFhirBundle } = require("../utils/satusehat/fhirMapper");
const Users = require("../models/users");
const Checkin = require("../models/checkin");
const Sep = require("../models/sep");
const Rujukan = require("../models/rujukan");
const Tarif = require("../models/tarif");
const Rincian = require("../models/rincian");
const Nakes = require("../models/nakes");
const Ruangan = require("../models/ruangan");
const Faktur = require("../models/faktur");
const ResepModel = require("../models/resep");
var moment = require("moment"); // require
const checkin = require("../models/checkin");
const Prmrj = require("../models/prmrj");
const EdukasiPoli = require("../models/edukasiPoli");
const CpptIgd = require("../models/cpptIgd");
const CpptPoli = require("../models/cpptPoli");
const RingkasanPulang = require("../models/ringkasanPulang");
const PemberianObatIgd = require("../models/pemberianObatIgd");
const PengkajianAwalPoli = require("../models/pengkajianAwalPoli");
const PengkajianAwalIgd = require("../models/pengkajianAwalIgd");
const PoliGigi = require("../models/poliGigi");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types.ObjectId;

module.exports = {
  daftarPasienbaru: async (req, res) => {
    try {
      const {
        nama,
        nik,
        nobpjs,
        notelp,
        tempatlahir,
        tgllahir,
        sex,
        agama,
        alamat,
        propinsi,
        kabupaten,
        kecamatan,
        user
      } = req.body;

      if (nik !== '0000000000000000') {
        const cariPasienNik = await Pasien.findOne({ nik });
        if (cariPasienNik) {
          return res.status(400).json({
            error: 400,
            status: 'error',
            message: 'Nik sudah terdaftar',
            data: null,
          });
        }
      }

      if (nobpjs !== '0000000000000') {
        const cariPasienNoBpjs = await Pasien.findOne({ nobpjs });
        if (cariPasienNoBpjs) {
          return res.status(400).json({
            error: 400,
            status: 'error',
            message: 'No BPJS sudah terdaftar',
            data: null,
          });
        }
      }

      const cariNorm = await Pasien.findOne({})
        .select({ _id: 0, norm: 1 })
        .sort({ norm: -1 });

      const norm = cariNorm ? Number(cariNorm.norm) + 1 : 1;
      const normwithzero = `000000${norm}`.slice(-6);

      const dateTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS000');
      const tglInput = dateTime;

      const carinorm = await Pasien.find({
        norm: normwithzero,
      });

      if (carinorm.length > 0) {
        return res.status(404).json({
          error: 400,
          status: 'error',
          message: 'ERROR_NORM',
          data: null,
        });
      }

      const daftarBaru = await Pasien.create({
        norm: normwithzero,
        nama,
        nik,
        nobpjs,
        notelp,
        tempatlahir,
        tgllahir,
        sex,
        agama,
        tglinput: tglInput,
        alamat,
        propinsi,
        kabupaten,
        kecamatan,
        user,
      });

      res.json({
        status: 'success',
        message: 'Pendaftaran sukses',
        data: daftarBaru,
      });
    } catch (err) {
      res.status(400).json({
        error: err,
        status: 'error',
        message: 'ERROR_NETWORK',
        data: null,
      });
    }
  },
  editDataPasien: async (req, res) => {
    norm = req.body.norm;
    nama = req.body.nama;
    nik = req.body.nik;
    nobpjs = req.body.nobpjs;
    notelp = req.body.notelp;
    tempatlahir = req.body.tempatlahir;
    tgllahir = req.body.tgllahir;
    sex = req.body.sex;
    agama = req.body.agama;
    alamat = req.body.alamat;
    propinsi = req.body.propinsi;
    kabupaten = req.body.kabupaten;
    kecamatan = req.body.kecamatan;
    user = req.body.user;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const editDataPasien = await Pasien.updateOne(
        { norm: norm },
        {
          $set: {
            nama: nama,
            nik: nik,
            nobpjs: nobpjs,
            notelp: notelp,
            tempatlahir: tempatlahir,
            tgllahir: tgllahir,
            sex: sex,
            agama: agama,
            alamat: alamat,
            propinsi: propinsi,
            kabupaten: kabupaten,
            kecamatan: kecamatan,
            user: user,
            tglinput: tglInput,
          },
        }
      );
      res.json({
        status: "success",
        message: "Pendaftaran sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DAFTAR",
        data: null,
      });
    }
  },
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
  cariPasien: async (req, res) => {
    var term = req.params.term;
    try {
      const cariNorm = await Pasien.find({
        $or: [
          { norm: { $regex: "(?i).*" + term + ".*" } },
          { nama: { $regex: "(?i).*" + term + ".*" } },
          { nik: { $regex: "(?i).*" + term + ".*" } },
          { nobpjs: { $regex: "(?i).*" + term + ".*" } },
        ],
      })
        .sort({
          nomr: 1,
          norm: 1,
          nama: 1
        })
        .select({
          _id: 0,
          norm: 1,
          nama: 1,
          nik: 1,
          tgllahir: 1,
          nobpjs: 1,
          alamat: 1,
          sex: 1,
          notelp: 1,
          propinsi: 1,
          kabupaten: 1,
          kecamatan: 1,
          user: 1,
        })
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DAFTAR",
        data: null,
      });
    }
  },
  pasienBaru: async (req, res) => {
    try {
      const cariNorm = await Pasien.find({})
        .skip(Pasien.count() - 10)
        .sort({ norm: -1 })
        .select({
          _id: 0,
          norm: 1,
          nama: 1,
          nik: 1,
          tgllahir: 1,
          nobpjs: 1,
          alamat: 1,
          sex: 1,
          notelp: 1,
          notelp: 1,
          user: 1,
          propinsi: 1,
          kabupaten: 1,
          kecamatan: 1,
        })
        .limit(10)
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DAFTAR",
        data: null,
      });
    }
  },
  cariPasienNorm: async (req, res) => {
    var term = req.params.term;
    try {
      const cariNorm = await Pasien.find({
        $or: [{ norm: term }],
      })
        .sort({ nama: 1 })
        .limit(100)
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DAFTAR",
        data: null,
      });
    }
  },
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
  cariPasienPelayanan: async (req, res) => {
    var pelayanan = req.params.pelayanan;
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      if (pelayanan === 'YANMEDDOKPOL') {
        const cariNorm = await Checkin.aggregate([
          {
            $match: {
              $or: [
                { status: "0", poli: { $regex: "(?i).*" + pelayanan + ".*" } },
              ],
            },
          },
          { $sort: { status: 1, tglInput: -1 } },
        ]);
        return res.json(cariNorm);
      }
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            $or: [
              { status: "0", poli: { $regex: "(?i).*" + pelayanan + ".*" } },
              {
                poli: { $regex: "(?i).*" + pelayanan + ".*" },
                status: "1",
                tglOut: { $regex: "(?i).*" + dateSkrg + ".*" },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "rujukans",
            let: {
              noKartu: "$noKartu",
              tglSep: "$tglSep",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$pesertaNoKartu", "$$noKartu"] },
                      { $eq: ["$tglRujukan", "$$tglSep"] },
                    ],
                  },
                },
              },
            ],
            as: "rujukanData",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
      ]);
      return res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_PASIEN",
        data: null,
      });
    }
  },
  cariPasienPoli: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            $or: [
              {
                status: "0",
                jnsPelayanan: { $in: ["R.Jalan"] },
                poli: { $nin: ["INSTALASI GAWAT DARURAT", "YANMEDDOKPOL"] },
              },
              {
                jnsPelayanan: { $in: ["R.Jalan"] },
                poli: { $nin: ["INSTALASI GAWAT DARURAT", "YANMEDDOKPOL"] },
                status: { $in: ["0", "1"] },
                tglInput: { $regex: "(?i).*" + dateSkrg + ".*" },
              },
              {
                jnsPelayanan: { $in: ["R.Jalan"] },
                poli: { $nin: ["INSTALASI GAWAT DARURAT", "YANMEDDOKPOL"] },
                status: { $in: ["0", "1"] },
                tglOut: { $regex: "(?i).*" + dateSkrg + ".*" },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "rujukans",
            localField: "noMr",
            foreignField: "pesertaNoMr",
            as: "rujukanData",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
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
  cariPasienInap: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            $or: [
              { status: "0", jnsPelayanan: { $in: ["R.Inap"] } },
              {
                jnsPelayanan: { $in: ["R.Inap"] },
                status: { $in: ["1"] },
                tglOut: { $regex: "(?i).*" + dateSkrg + ".*" },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $lookup: {
            from: "rujukans",
            localField: "noMr",
            foreignField: "pesertaNoMr",
            as: "rujukanData",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
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
  cariPasienPoliNorm: async (req, res) => {
    var norm = req.params.norm;
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            jnsPelayanan: { $in: ["R.Jalan"] },
            poli: { $nin: ["INSTALASI GAWAT DARURAT", "YANMEDDOKPOL"] },
            noMr: norm,
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
        { $limit: 1 },
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
  cariPasienInapNorm: async (req, res) => {
    var norm = req.params.norm;
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            jnsPelayanan: { $in: ["R.Inap"] },
            status: "0",
            noMr: norm,
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
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
  cariPasienPelayananNorm: async (req, res) => {
    var pelayanan = req.params.pelayanan;
    var norm = req.params.norm;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noMr: norm, poli: "INSTALASI GAWAT DARURAT" } },
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
        { $limit: 1 },
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
  caripasienpolinocheckin: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noCheckin: noCheckin } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
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
  caripasieninapnocheckin: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noCheckin: noCheckin } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
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
  cariPasienNik: async (req, res) => {
    try {
      var nik = req.params.nik;
      const cariNik = await Pasien.findOne({ nik: nik });
      res.json(cariNik);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_PASIEN",
        data: null,
      });
    }
  },
  cariPasienNoMr: async (req, res) => {
    var noMr = req.params.noMr;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noMr: noMr } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
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
  caripasiennokartu: async (req, res) => {
    try {
      const cariNorm = await Pasien.aggregate([
        { $match: { nobpjs: req.params.noKartu } },
        {
          $lookup: {
            from: "checkins",
            localField: "norm",
            foreignField: "noMr",
            as: "checkin",
          },
        },
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
  cariPasienNocheckin: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noCheckin: noCheckin } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
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
  cariPasienNoRujukan: async (req, res) => {
    var norujukan = req.params.norujukan;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noRujukan: norujukan } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
        { $sort: { noCheckin: 1 } },
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
  cariPasienNoSep: async (req, res) => {
    var nosep = req.params.nosep;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noSep: nosep } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "user",
          },
        },
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
  cariPasienPelayananNoCheckin: async (req, res) => {
    var pelayanan = req.params.pelayanan;
    var noCheckin = req.params.noCheckin;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { noCheckin: noCheckin } },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
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
  checkpasien: async (req, res) => {
    var norm = req.body.norm;
    try {
      const checkNorm = await Checkin.find({ noMr: norm, status: 0 });
      if (checkNorm.length > 0) {
        return res.json({
          error: 400,
          status: "error",
          message: "ERROR_CHECKPASIEN",
          data: checkNorm,
        });
      } else {
        res.json({
          status: "success",
          message: "Checkin Pasien sukses",
          data: null,
        });
      }
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
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
  updatedatapasien: async (req, res) => {
    var norm = req.body.norm;
    var nobpjs = req.body.nobpjs;
    var prb = req.body.prb;
    var hakKelas = req.body.hakKelas;
    try {
      const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      var tglCheckout = dateTime;
      const updatePasien = await Pasien.findOne({
        norm: norm,
      });
      updatePasien.nobpjs = nobpjs;
      updatePasien.prb = prb;
      updatePasien.hakKelas = hakKelas;
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
  createTarif: async (req, res) => {
    var nama = req.params.nama;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const daftarBaru = await Tarif.create({
        nama: nama,
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
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  createNakes: async (req, res) => {
    var nama = req.params.nama;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const daftarBaru = await Nakes.create({
        nama: nama,
        tglInput: tglInput,
      });
      res.json({
        status: "success",
        message: "Pendaftaran Nakes sukses",
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
  createRuang: async (req, res) => {
    var nama = req.params.nama;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const daftarBaru = await Ruangan.create({
        namaruang: nama,
        tglInput: tglInput,
      });
      res.json({
        status: "success",
        message: "Pendaftaran Ruang sukses",
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
  getTarifNoTarif: async (req, res) => {
    var notarif = req.params.notarif;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        noTarif: notarif,
      }).lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  deleteTarif: async (req, res) => {
    try {
      const dataTarif = await Tarif.deleteOne({
        _id: ObjectId(req.body.id),
      }).lean();
      res.status(200).send({
        error: 0,
        status: "success",
        message: "ok.",
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
  getDataSepSimrs: async (req, res) => {
    try {
      const dataSep = await Sep.find({
        noSep: req.params.noSep,
      }).lean();
      res.json(dataSep);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  getDataSepSimrsNoKartu: async (req, res) => {
    try {
      const dataSep = await Sep.find({
        noKartu: req.params.noKartu,
      }).lean();
      res.json(dataSep);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  getTarifPelayanan: async (req, res) => {
    var pelayanan = req.params.pelayanan;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        pelayanan: pelayanan,
      }).lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_TARIF",
        data: null,
      });
    }
  },
  getTarif: async (req, res) => {
    var term = req.params.term;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        $or: [{ nama: { $regex: "(?i).*" + term + ".*" } }],
      })
        .limit(100)
        .lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  getTarifFarmasi: async (req, res) => {
    var term = req.params.term;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        $or: [{ nama: { $regex: "(?i).*" + term + ".*" } }],
        pelayanan: { $in: ["FARMASI"] },
      })
        .limit(100)
        .lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  getTarifLAB: async (req, res) => {
    var term = req.params.term;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        $or: [{ nama: { $regex: "(?i).*" + term + ".*" } }],
        pelayanan: { $in: ["LAB"] },
      })
        .limit(100)
        .lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  getTarifRadiologi: async (req, res) => {
    var term = req.params.term;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataTarif = await Tarif.find({
        $or: [{ nama: { $regex: "(?i).*" + term + ".*" } }],
        pelayanan: { $in: ["RADIOLOGI"] },
      })
        .limit(100)
        .lean();
      res.json(dataTarif);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  getRincianIgd: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin, pelayanan: "IGD" } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  getRincianBedah: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin, pelayanan: "BEDAH" } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  getRincianFarmasi: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin, pelayanan: "FARMASI" } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  // method getPasienLab (untuk indexing)
  getPasienLab: async (req, res) => {
    try {
      const data = await Rincian.aggregate([
        { $match: { pelayanan: "LAB" } },
        {
          $group: {
            _id: "$noCheckin",
            noCheckin: { $first: "$noCheckin" },
            tglInput: { $first: "$tglInput" },
            totalItem: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "checkins",
            localField: "noCheckin",
            foreignField: "noCheckin",
            as: "dataCheckin",
          },
        },
        { $unwind: "$dataCheckin" },
        { $match: { "dataCheckin.status": "0" } },
        {
          $lookup: {
            from: "pasiens",
            localField: "dataCheckin.noMr",
            foreignField: "norm",
            as: "dataPasien",
          },
        },
        { $unwind: { path: "$dataPasien", preserveNullAndEmpty: true } },
        {
          $project: {
            _id: 0,
            noCheckin: 1,
            tglInput: 1,
            totalItem: 1,
            noMr: "$dataCheckin.noMr",
            nama: "$dataCheckin.nama",
            kelamin: "$dataCheckin.kelamin",
            tglLahir: "$dataCheckin.tglLahir",
            dpjp: "$dataCheckin.dpjp",
            poli: "$dataCheckin.poli",
            tglCheckin: "$dataCheckin.tglInput",
          },
        },
        { $sort: { tglCheckin: -1 } },
      ]);
      res.json(data);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_PASIEN_LAB",
        data: null,
      });
    }
  },

  //method getPasienRadiologi (untuk indexing)
  getPasienRadiologi: async (req, res) => {
    try {
      const data = await Rincian.aggregate([
        { $match: { pelayanan: "RADIOLOGI" } },
        {
          $group: {
            _id: "$noCheckin",
            noCheckin: { $first: "$noCheckin" },
            tglInput: { $first: "$tglInput" },
            totalItem: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "checkins",
            localField: "noCheckin",
            foreignField: "noCheckin",
            as: "dataCheckin",
          },
        },
        { $unwind: "$dataCheckin" },
        { $match: { "dataCheckin.status": "0" } },
        {
          $lookup: {
            from: "pasiens",
            localField: "dataCheckin.noMr",
            foreignField: "norm",
            as: "dataPasien",
          },
        },
        { $unwind: { path: "$dataPasien", preserveNullAndEmpty: true } },
        {
          $project: {
            _id: 0,
            noCheckin: 1,
            tglInput: 1,
            totalItem: 1,
            noMr: "$dataCheckin.noMr",
            nama: "$dataCheckin.nama",
            kelamin: "$dataCheckin.kelamin",
            tglLahir: "$dataCheckin.tglLahir",
            dpjp: "$dataCheckin.dpjp",
            poli: "$dataCheckin.poli",
            tglCheckin: "$dataCheckin.tglInput",
          },
        },
        { $sort: { tglCheckin: -1 } },
      ]);
      res.json(data);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_PASIEN_RADIOLOGI",
        data: null,
      });
    }
  },
  getRincianLAB: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin, pelayanan: "LAB" } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  getRincianRadiologi: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin, pelayanan: "RADIOLOGI" } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  getRincian: async (req, res) => {
    var noCheckin = req.params.noCheckin;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const dataRincian = await Rincian.aggregate([
        { $match: { noCheckin: noCheckin } },
        {
          $lookup: {
            from: "tarifs",
            localField: "noTarif",
            foreignField: "noTarif",
            as: "dataTarif",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$dataTarif", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { dataTarif: 0 } },
        { $sort: { tglInput: -1 } },
      ]);
      res.json(dataRincian);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_GET_RINCIAN",
        data: null,
      });
    }
  },
  inputRincian: async (req, res) => {
    var noCheckin = req.body.noCheckin;
    var noTarif = req.body.noTarif;
    var qty = req.body.qty;
    var pelayanan = req.body.pelayanan;
    var user = req.body.user;
    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var tglInput = dateTime;
    try {
      const createRincian = await Rincian.create({
        noCheckin: noCheckin,
        noTarif: noTarif,
        qty: qty,
        user: user,
        pelayanan: pelayanan,
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
        message: "ERROR_CHECKIN",
        data: null,
      });
    }
  },
  deleteRincian: async (req, res) => {
    var noId = req.body.noId;
    try {
      const createRincian = await Rincian.findByIdAndDelete({
        _id: noId,
      });
      res.json({
        status: "success",
        message: "Delete sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DELETE_RINCIAN",
        data: null,
      });
    }
  },
  homeDashboardKunjungan: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            tglInput: { $regex: "(?i).*" + dateSkrg + ".*" },
            jnsPeserta: { $nin: ['YANMEDDOKPOL'] },
          },
        },
        {
          $group: {
            _id: dateSkrg,
            kunjungan: {
              $sum: 1,
            },
          },
        },
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
  homeDashboardPasienBaru: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Pasien.aggregate([
        {
          $match: {
            tglinput: { $regex: "(?i).*" + dateSkrg + ".*" },
          },
        },
        {
          $group: {
            _id: dateSkrg,
            pasienbaru: {
              $sum: 1,
            },
          },
        },
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
  homeDashboardCancel: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Pasien.aggregate([
        {
          $match: {
            tglInput: { $regex: "(?i).*" + dateSkrg + ".*" },
            caraPulang: "CANCEL",
          },
        },
        {
          $group: {
            _id: dateSkrg,
            cancel: {
              $sum: 1,
            },
          },
        },
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
  getRiwayat: async (req, res) => {
    try {
      const cariNorm = await Checkin.find({
        noMr: req.params.norm,
      })
        .sort({ tglInput: -1 })
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_DAFTAR",
        data: null,
      });
    }
  },
  getLaporanIgd: async (req, res) => {
    var start = req.params.start;
    var end = req.params.end;
    var keterangan = req.params.keterangan;

    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      if (keterangan == 2) {
        const cariNorm = await Checkin.aggregate([
          {
            $match: {
              poli: "INSTALASI GAWAT DARURAT",
              tglOut: { $gte: start, $lt: end + 1 },
            },
          },
          {
            $lookup: {
              from: "pasiens",
              localField: "noMr",
              foreignField: "norm",
              as: "userData",
            },
          },
          {
            $unwind: "$userData",
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "IGD"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataPelayanan",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "FARMASI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataFarmasi",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "LAB"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataLab",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "RADIOLOGI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataRadiologi",
            },
          },
          { $sort: { status: 1, tglInput: -1 } },
        ]);
        res.json(cariNorm);
        return;
      }
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            poli: "INSTALASI GAWAT DARURAT",
            tglInput: { $gte: start, $lt: end + 1 },
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "IGD"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataPelayanan",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "FARMASI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataFarmasi",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "LAB"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataLab",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "RADIOLOGI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataRadiologi",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
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
  getLaporanPoli: async (req, res) => {
    var start = req.params.start;
    var end = req.params.end;
    var keterangan = req.params.keterangan;
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      if (keterangan == 2) {
        const cariNorm = await Checkin.aggregate([
          {
            $match: {
              jnsPelayanan: "R.Jalan",
              poli: { $ne: "INSTALASI GAWAT DARURAT" },
              tglOut: { $gte: start, $lt: end + 1 },
            },
          },
          {
            $lookup: {
              from: "pasiens",
              localField: "noMr",
              foreignField: "norm",
              as: "userData",
            },
          },
          {
            $unwind: "$userData",
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "IGD"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataPelayanan",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "FARMASI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataFarmasi",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "LAB"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataLab",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "RADIOLOGI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataRadiologi",
            },
          },
          { $sort: { status: 1, tglInput: -1 } },
        ]);
        res.json(cariNorm);
        return;
      }
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            jnsPelayanan: "R.Jalan",
            poli: { $ne: "INSTALASI GAWAT DARURAT" },
            tglInput: { $gte: start, $lt: end + 1 },
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "IGD"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataPelayanan",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "FARMASI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataFarmasi",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "LAB"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataLab",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "RADIOLOGI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataRadiologi",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
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
  getLaporanInap: async (req, res) => {
    var start = req.params.start;
    var end = req.params.end;
    var keterangan = req.params.keterangan;
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      if (keterangan == 2) {
        const cariNorm = await Checkin.aggregate([
          {
            $match: {
              jnsPelayanan: "R.Inap",
              tglOut: { $gte: start, $lt: end + 1 },
            },
          },
          {
            $lookup: {
              from: "pasiens",
              localField: "noMr",
              foreignField: "norm",
              as: "userData",
            },
          },
          {
            $unwind: "$userData",
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "IGD"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataPelayanan",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "FARMASI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataFarmasi",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "LAB"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataLab",
            },
          },
          {
            $lookup: {
              from: "rincians",
              let: { noCheckinUtama: "$noCheckin" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                        { $eq: ["$pelayanan", "RADIOLOGI"] },
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "tarifs",
                    localField: "noTarif",
                    foreignField: "noTarif",
                    as: "dataTarif",
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [
                        { $arrayElemAt: ["$dataTarif", 0] },
                        "$$ROOT",
                      ],
                    },
                  },
                },
              ],
              as: "dataRadiologi",
            },
          },
          { $sort: { status: 1, tglInput: -1 } },
        ]);
        res.json(cariNorm);
        return;
      }
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            jnsPelayanan: "R.Inap",
            tglInput: { $gte: start, $lt: end + 1 },
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $unwind: "$userData",
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "IGD"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataPelayanan",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "FARMASI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataFarmasi",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "LAB"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataLab",
          },
        },
        {
          $lookup: {
            from: "rincians",
            let: { noCheckinUtama: "$noCheckin" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$noCheckin", "$$noCheckinUtama"] },
                      { $eq: ["$pelayanan", "RADIOLOGI"] },
                    ],
                  },
                },
              },
              {
                $lookup: {
                  from: "tarifs",
                  localField: "noTarif",
                  foreignField: "noTarif",
                  as: "dataTarif",
                },
              },
              {
                $replaceRoot: {
                  newRoot: {
                    $mergeObjects: [
                      { $arrayElemAt: ["$dataTarif", 0] },
                      "$$ROOT",
                    ],
                  },
                },
              },
            ],
            as: "dataRadiologi",
          },
        },
        { $sort: { status: 1, tglInput: -1 } },
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
  getLaporanCabar: async (req, res) => {
    var start = req.params.start;
    var end = req.params.end;
    var cabar = req.params.cabar;
    if (cabar == "SEMUA") {
      cabar = { $ne: "" };
    }
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Checkin.aggregate([
        {
          $match: {
            cabar: cabar,
            tglInput: { $gte: start, $lt: end + 1 },
          },
        },
        {
          $lookup: {
            from: "pasiens",
            localField: "noMr",
            foreignField: "norm",
            as: "userData",
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [{ $arrayElemAt: ["$userData", 0] }, "$$ROOT"],
            },
          },
        },
        { $project: { userData: 0 } },
        { $sort: { status: 1, tglInput: -1 } },
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
  getLaporanDiagnosa: async (req, res) => {
    var start = req.params.start;
    var end = req.params.end;
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { tglInput: { $gte: start, $lt: end + 1 } } },
        { $group: { _id: "$diagnosa", total: { $sum: 1 } } },
        { $sort: { total: -1, diagnosa: 1 } },
        { $limit: 10 },
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
  getLastKunjungan: async (req, res) => {
    var nokontrolulang = req.params.nokontrolulang;
    try {
      const cariNorm = await Checkin.aggregate([
        { $match: { nokontrolulang: nokontrolulang } },
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
  updatetku: async (req, res) => {
    var noCheckin = req.body.noCheckin;
    var tglAwal = req.body.tglAwal;
    try {
      const updateCheckin = await Checkin.findOne({
        noCheckin: noCheckin,
      });
      updateCheckin.tglAwalRujukan = tglAwal;
      updateCheckin.save();
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
  updatetio: async (req, res) => {
    var noCheckin = req.body.noCheckin;
    var tglCheckin = req.body.tglCheckin;
    var tglCheckout = req.body.tglCheckout;
    try {
      const updateCheckin = await Checkin.findOne({
        noCheckin: noCheckin,
      });
      updateCheckin.tglInput = tglCheckin;
      updateCheckin.tglOut = tglCheckout;
      updateCheckin.save();
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
  bukaCheckout: async (req, res) => {
    var noCheckin = req.body.noCheckin;
    try {
      const updateCheckin = await Checkin.findOne({
        noCheckin: noCheckin,
      });
      updateCheckin.status = 0;
      updateCheckin.save();
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
  graphPasien: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    /* const startDate = "2020-12-01";
    const lastDate = "2020-13-30"; */
    const cabar = req.params.cabar;
    const startDate = moment().clone().startOf("month").format("YYYY-MM-DD");
    const lastDate = moment().clone().endOf("month").format("YYYY-MM-DD");
    try {
      const graphData = await Checkin.aggregate()
        .match({
          tglInput: { $gte: startDate, $lte: lastDate },
          cabar: cabar,
        })
        .group({
          _id: { $substr: ["$tglInput", 8, 2] },
          value: { $sum: 1 },
        })
        .project({
          _id: false,
          name: "$_id",
          value: "$value",
        })
        .sort({ name: 1 });
      res.json({
        name: cabar,
        series: graphData,
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
  jenisPasien: async (req, res) => {
    try {
      const getItem = await Checkin.aggregate([
        {
          $match: {
            tglInput: {
              $gte: req.params.start + " 00:00:01",
              $lte: req.params.end + " 23:59:59",
            },
            jenisPasien: { $nin: ["", null] },
          },
        },
        {
          $group: {
            _id: {
              jenisPasien: "$jenisPasien",
            },
            jumlah: { $sum: 1 },
          },
        },
        { $sort: { jenisPasien: 1, tglInput: 1 } },
      ]);
      if (getItem.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getItem);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get faktur",
        data: null,
      });
    }
  },
  saveTriase: async (req, res) => {
    try {
      const payload = req.body;
      payload.tglInput = require("moment")().format("YYYY-MM-DD HH:mm:ss");
      const saved = await Triase.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Triase berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan triase", data: null });
    }
  },
  getTriase: async (req, res) => {
    try {
      const triase = await Triase.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: triase });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data triase", data: null });
    }
  },
  syncTriaseSatuSehat: async (req, res) => {
    try {
      const { noCheckin, patientIhsNumber } = req.body;
      const checkinData = await Checkin.findOne({ noCheckin });
      if (!checkinData || !checkinData.encounterId || !checkinData.encounterStatus) {
        return res.status(400).send({ status: 400, message: "Pasien belum memiliki Encounter di SATUSEHAT", data: null });
      }
      const triaseData = await Triase.findOne({ noCheckin });
      if (!triaseData) {
        return res.status(400).send({ status: 400, message: "Data triase belum disimpan", data: null });
      }
      const bundle = buildTriageBundle(triaseData, patientIhsNumber, checkinData.encounterId);
      if (bundle.entry.length === 0) {
        return res.status(400).send({ status: 400, message: "Tidak ada data vital sign untuk dikirim", data: null });
      }
      const result = await sendFhirBundle(bundle);
      const createdIds = result.entry ? result.entry.map(e => e.response?.location || '') : [];
      await Triase.findOneAndUpdate({ noCheckin }, { $set: { satusehatSynced: true, satusehatIds: createdIds } });
      return res.status(200).send({ status: 200, message: "Sync SATUSEHAT berhasil", data: { satusehatIds: createdIds } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal sync ke SATUSEHAT", data: null });
    }
  },
  savePrmrj: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await Prmrj.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "PRMRJ berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan PRMRJ", data: null });
    }
  },
  getPrmrj: async (req, res) => {
    try {
      const data = await Prmrj.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data PRMRJ", data: null });
    }
  },
  saveEdukasiPoli: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await EdukasiPoli.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Edukasi Poli berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Edukasi Poli", data: null });
    }
  },
  getEdukasiPoli: async (req, res) => {
    try {
      const data = await EdukasiPoli.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Edukasi Poli", data: null });
    }
  },
  saveCpptIgd: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await CpptIgd.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "CPPT IGD berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan CPPT IGD", data: null });
    }
  },
  getCpptIgd: async (req, res) => {
    try {
      const data = await CpptIgd.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data CPPT IGD", data: null });
    }
  },
  saveCpptPoli: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await CpptPoli.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "CPPT Poliklinik berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan CPPT Poliklinik", data: null });
    }
  },
  getCpptPoli: async (req, res) => {
    try {
      const data = await CpptPoli.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data CPPT Poliklinik", data: null });
    }
  },
  listCpptPoli: async (req, res) => {
    try {
      const data = await CpptPoli.find({ noMr: req.params.noMr })
        .select("-canvasImage") // Exclude heavy canvas string from list view
        .sort({ tglInput: -1 }); // Sort descending (newest first)
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil daftar CPPT Poliklinik", data: null });
    }
  },
  saveRingkasanPulang: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await RingkasanPulang.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Ringkasan Pulang berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Ringkasan Pulang", data: null });
    }
  },
  getRingkasanPulang: async (req, res) => {
    try {
      const data = await RingkasanPulang.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Ringkasan Pulang", data: null });
    }
  },
  savePemberianObatIgd: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await PemberianObatIgd.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Formulir Pemberian Obat berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Formulir Pemberian Obat", data: null });
    }
  },
  getPemberianObatIgd: async (req, res) => {
    try {
      const data = await PemberianObatIgd.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Formulir Pemberian Obat", data: null });
    }
  },
  savePengkajianAwalPoli: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await PengkajianAwalPoli.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Pengkajian Awal Poliklinik berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Pengkajian Awal Poliklinik", data: null });
    }
  },
  getPengkajianAwalPoli: async (req, res) => {
    try {
      const data = await PengkajianAwalPoli.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Pengkajian Awal Poliklinik", data: null });
    }
  },
  savePengkajianAwalIgd: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await PengkajianAwalIgd.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Pengkajian Awal IGD berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Pengkajian Awal IGD", data: null });
    }
  },
  getPengkajianAwalIgd: async (req, res) => {
    try {
      const data = await PengkajianAwalIgd.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Pengkajian Awal IGD", data: null });
    }
  },
  savePoliGigi: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await PoliGigi.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: payload },
        { upsert: true, new: true }
      );
      return res.status(200).send({ status: 200, message: "Poli Gigi berhasil disimpan", data: saved });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan Poli Gigi", data: null });
    }
  },
  getPoliGigi: async (req, res) => {
    try {
      const data = await PoliGigi.findOne({ noCheckin: req.params.noCheckin });
      return res.status(200).send({ status: 200, message: "Ok", data: data });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal mengambil data Poli Gigi", data: null });
    }
  },
  saveLab: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await Checkin.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: { laboratorium: payload.laboratorium } },
        { new: true }
      );
      return res.status(200).send({ status: 200, message: "Hasil LAB berhasil disimpan", data: { checkin: saved } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan hasil LAB", data: null });
    }
  },
  saveRad: async (req, res) => {
    try {
      const payload = req.body;
      const saved = await Checkin.findOneAndUpdate(
        { noCheckin: payload.noCheckin },
        { $set: { radiologi: payload.radiologi } },
        { new: true }
      );
      return res.status(200).send({ status: 200, message: "Hasil Radiologi berhasil disimpan", data: { checkin: saved } });
    } catch (error) {
      return res.status(400).send({ status: 400, message: "Gagal menyimpan hasil Radiologi", data: null });
    }
  },
};
