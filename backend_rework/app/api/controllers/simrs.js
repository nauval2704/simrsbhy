const provinsiModel = require("../models/provinsi");
const pasienModel = require("../models/pasien");
var request = require("request");
var sha256 = require("sha256");
const crypto = require("crypto");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "192.168.101.56",
  user: "apimansis",
  password: "dbP625216",
  database: "rspur3",
});

var consid = "16916";
var key = "9iA76C39FC";

module.exports = {
  laporan: function (req, res, next) {
    var start = req.params.start;
    var end = req.params.end;

    request(
      "http://172.55.55.5/api/laporan_obat.php?start=" + start + "&end=" + end,
      {
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({
            data: body,
          });
        }
      }
    );
  },
  pasien: async (req, res) => {
    try {
      const dataAbsen = await connection.query(
        "SELECT no_rekmedis, nama as nama_pasien, no_bpjs FROM pel_pasien",
        function (error, results, fields) {
          if (error) throw error;
          res.json(results);
        }
      );
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  poli: function (req, res, next) {
    request(
      "http://dev.rspur.co.id/mjkn/poli",
      {
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json(body);
        }
      }
    );
  },
  jadwalOperasi: function (req, res, next) {
    request(
      "http://dev.rspur.co.id/mjkn/operasi/currentDate",
      {
        json: true,
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json(body);
        }
      }
    );
  },
  createOperasi: function (req, res, next) {
    request.post(
      {
        url: "http://dev.rspur.co.id/mjkn/operasi/create",
        form: {
          nopeserta: req.body.nopeserta,
          kodebooking: req.body.kodebooking,
          tanggaloperasi: req.body.tanggaloperasi,
          jenistindakan: req.body.jenistindakan,
          kodepoli: req.body.kodepoli,
          namapoli: req.body.namapoli,
        },
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          res.status(400).send({
            error: err,
            status: "error",
            message: "ERROR_OPERASI",
            data: null,
          });
        }
        res.json({
          status: "success",
          message: "Operation added successfully!!!",
          data: null,
        });
      }
    );
  },
  dataProvinsi: function (req, res, next) {
    var name = req.params.nama;
    provinsiModel
      .find(
        {
          LEVEL: 1,
          NAMA: { $regex: ".*" + name.toUpperCase() + ".*" },
        },
        function (err, data) {
          if (!data) {
            res.status(404).json({
              message:
                "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
            });
          } else {
            if (err) {
              next(err);
            } else {
              res.json(data);
            }
          }
        }
      )
      .sort({ NAMA: 1 })
      .select({ _id: 0, NAMA: 1 })
      .lean();
  },
  dataKabupaten: function (req, res, next) {
    var name = req.params.nama;
    provinsiModel
      .find(
        {
          LEVEL: 2,
          NAMA: { $regex: ".*" + name.toUpperCase() + ".*" },
        },
        function (err, data) {
          if (!data) {
            res.status(404).json({
              message:
                "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
            });
          } else {
            if (err) {
              next(err);
            } else {
              res.json(data);
            }
          }
        }
      )
      .sort({ NAMA: 1 })
      .select({ _id: 0, NAMA: 1 })
      .lean();
  },
  dataKecamatan: function (req, res, next) {
    var name = req.params.nama;
    provinsiModel
      .find(
        {
          LEVEL: 3,
          NAMA: { $regex: ".*" + name.toUpperCase() + ".*" },
        },
        function (err, data) {
          if (!data) {
            res.status(404).json({
              message:
                "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
            });
          } else {
            if (err) {
              next(err);
            } else {
              res.json(data);
            }
          }
        }
      )
      .sort({ NAMA: 1 })
      .select({ _id: 0, NAMA: 1 })
      .lean();
  },
  dataDesa: function (req, res, next) {
    var name = req.params.nama;
    provinsiModel
      .find(
        {
          LEVEL: 4,
          NAMA: { $regex: ".*" + name.toUpperCase() + ".*" },
        },
        function (err, data) {
          if (!data) {
            res.status(404).json({
              message:
                "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
            });
          } else {
            if (err) {
              next(err);
            } else {
              res.json(data);
            }
          }
        }
      )
      .sort({ NAMA: 1 })
      .select({ _id: 0, NAMA: 1 })
      .lean();
  },
  createProvinsi: function (req, res, next) {
    provinsiModel.create(
      {
        /* name: req.body.name, */
        KODE_WILAYAH: "321",
        MST_KODE_WILAYAH: "123",
        NAMA: "dadang",
        LEVEL: "100",
      },
      function (err, result) {
        if (!result.length) {
          res.status(404).json({
            message:
              "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
          });
        } else {
          if (err) {
            next(err);
          } else {
            res.json({
              response: "sukses",
              metadata: {
                message: "Ok",
                code: 200,
              },
            });
          }
        }
      }
    );
  },
  vclaimApiPropinsi: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url: "https://dvlp.bpjs-kesehatan.go.id/VClaim-Rest/referensi/propinsi",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          res.status(400).send({
            error: err,
            status: "error",
            message: "ERROR_OPERASI",
            data: httpResponse,
          });
        }
        res.json(JSON.parse(body));
      }
    );
  },
  normLatest: async (req, res) => {
    try {
      const getNorm = await pasienModel.findOne({}).sort({ norm: -1 });
      res.json(getNorm.norm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_NORM",
        data: null,
      });
    }
  },
};
