var request = require("request");
const crypto = require("crypto");
const axios = require("axios");
const Ruangan = require("../models/ruangan");

/* RS BHAYANGKARA  */
var kodeRs = "1171143";
// var passRs = "S!rs2020!!";
var passRs = "1234567Ab@";

module.exports = {
  refTempatTidur: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    axios({
      url: "http://sirs.kemkes.go.id/fo/index.php/Referensi/tempat_tidur",
      method: "get",
      headers: {
        "X-rs-id": kodeRs,
        "X-Timestamp": tmStamp,
        "X-pass": passRs,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(400).send({
          error: err,
          status: "error",
          message: "ERROR_RSONLINE",
          data: null,
        });
      });
  },
  fasyankes: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    axios({
      url: "http://sirs.kemkes.go.id/fo/index.php/Fasyankes",
      method: "get",
      headers: {
        "X-rs-id": kodeRs,
        "X-Timestamp": tmStamp,
        "X-pass": passRs,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(400).send({
          error: err,
          status: "error",
          message: "ERROR_RSONLINE",
          data: null,
        });
      });
  },
  ufasyankes: async (req, res) => {
    try {
      const updateRuang = await Ruangan.aggregate([
        {
          $group: {
            _id: "$kode_tt",
            id_t_tt: { $first: "$id_t_tt" },
            jumlah_ruang: { $sum: 1 },
            jumlah: { $sum: { $toDouble: "$tersedia" } },
            kapasitas: { $sum: { $toDouble: "$kapasitas" } },
          },
        },
        {
          $addFields: {
            prepare: "0",
            prepare_plan: "0",
            covid: 0,
          },
        },
        {
          $project: {
            _id: "$_id",
            id_t_tt: "$id_t_tt",
            jumlah_ruang: "$jumlah_ruang",
            jumlah: "$jumlah",
            terpakai: { $subtract: ["$kapasitas", "$jumlah"] },
            prepare: "$prepare",
            prepare_plan: "$prepare_plan",
            covid: "$covid",
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const updateRuangRsonline = await updateRuang.forEach((element) => {
        var dateSkrg = Date.now();
        var tmStamp = Math.floor(dateSkrg / 1000);
        const formDataRuangRsonline = {
          id_t_tt: element.id_t_tt,
          jumlah_ruang: element.jumlah_ruang,
          jumlah: element.jumlah,
          terpakai: element.terpakai,
          prepare: element.prepare,
          prepare_plan: element.prepare_plan,
          covid: element.covid,
        };
        axios({
          url: "http://sirs.kemkes.go.id/fo/index.php/Fasyankes",
          method: "put",
          headers: {
            "X-rs-id": kodeRs,
            "X-Timestamp": tmStamp,
            "X-pass": passRs,
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
          },
          data: formDataRuangRsonline,
        })
          .then((response) => {})
          .catch((err) => {
            res.json({
              error: err,
              status: "error",
              message: "ERROR_RSONLINE",
              data: null,
            });
          });
      });

      var kodeCovid = [
        "383736",
        "383737",
        "383738",
        "383739",
        "383741",
        "383742",
        "383743",
        "383744",
        "383745",
        "383746",
      ];

      const updateRuangCovid = kodeCovid.forEach((element) => {
        var dateSkrg = Date.now();
        var tmStamp = Math.floor(dateSkrg / 1000);
        const formDataCovid = {
          id_t_tt: element,
          jumlah_ruang: "0",
          jumlah: "0",
          terpakai: "0",
          prepare: "0",
          prepare_plan: "0",
          covid: 1,
        };

        axios({
          url: "http://sirs.kemkes.go.id/fo/index.php/Fasyankes",
          method: "put",
          headers: {
            "X-rs-id": kodeRs,
            "X-Timestamp": tmStamp,
            "X-pass": passRs,
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
          },
          data: formDataCovid,
        })
          .then((response) => {})
          .catch((err) => {
            res.json({
              error: err,
              status: "error",
              message: "ERROR_RSONLINE",
              data: null,
            });
          });
      });
      res.json({
        status: "success",
        message: "Update sukses",
        data: null,
      });
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
