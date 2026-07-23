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
};
