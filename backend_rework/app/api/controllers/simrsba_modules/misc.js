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
