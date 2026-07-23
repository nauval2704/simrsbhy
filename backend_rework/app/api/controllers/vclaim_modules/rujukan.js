const axios = require('axios');
const moment = require('moment');
const { ConsId, SecretKey, UserKey, BaseUrl, getBpjsAuth, decryptResponse } = require('../../utils/vclaim/auth');

const crypto = require('crypto');
const lz = require('lz-string');
const ruanganModel = require('../../models/ruangan');
const kodeRs = '0101R009';
const consProd = '13034';
const keyProd = '0xR53761A8';
const urlApplicares = 'https://new-api.bpjs-kesehatan.go.id/aplicaresws/';

module.exports = {
  vclaimApiPoliRujukan: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl +
        "Rujukan/ListSpesialistik/PPKRujukan/" +
        req.params.kode +
        "/TglRujukan/" +
        req.params.tanggal,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiHapusPerpanjanganRujukan: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const formData = {
        request: {
          t_rujukan: {
            idRujukan: req.body.idRujukan,
            noRujukan: req.body.noRujukan,
            user: req.body.user,
          },
        },
      };
      const getList = await axios.post(
        BaseUrl + "Rujukan/Khusus/delete",
        formData,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
            "Content-Type": "Application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            data: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Insert SEP",
          code: 201,
        },
      });
    }
  },
  vclaimApiPerpanjanganRujukan: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const formData = {
        noRujukan: req.body.noRujukan,
        diagnosa: req.body.diagnosa,
        procedure: req.body.procedure,
        user: req.body.user,
      };
      const getList = await axios.post(
        BaseUrl + "Rujukan/Khusus/insert",
        formData,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
            "Content-Type": "Application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            data: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Insert SEP",
          code: 201,
        },
      });
    }
  },
  vclaimApiListRujukanKhusus: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl +
        "Rujukan/Khusus/List/Bulan/" +
        req.params.bulan +
        "/Tahun/" +
        req.params.tahun,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiListRujukanRs: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {

      const getList = await axios.get(
        BaseUrl +
        "Rujukan/Keluar/List/tglMulai/" +
        req.params.tglAwal +
        "/tglAkhir/" +
        req.params.tglAkhir,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiRujukanRs: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/Keluar/" + req.params.noRujukan,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiRujukanPeserta: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/Keluar" + req.params.noRujukan,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariRujukan: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/" + req.params.norujukan,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariRujukanRs: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/RS/" + req.params.norujukan,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariRujukanNokartu: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/List/Peserta/" + req.params.nokartu,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariRujukan1Nokartu: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/Peserta/" + req.params.nokartu,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariListRujukanNokartu: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/List/Peserta/" + req.params.nokartu,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiCariListRujukanNokartuRs: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const getList = await axios.get(
        BaseUrl + "Rujukan/RS/List/Peserta/" + req.params.nokartu,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
          },
        }
      );

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data.metaData.message,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );

        res.json(response);
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiRujukanInsert: function (req, res, next) {
    var noSep = req.body.noSep;
    var tglRujukan = req.body.tglRujukan;
    var ppkDirujuk = req.body.ppkDirujuk;
    var jnsPelayanan = req.body.jnsPelayanan;
    var catatan = req.body.catatan;
    var diagRujukan = req.body.diagRujukan;
    var tipeRujukan = req.body.tipeRujukan;
    var poliRujukan = req.body.poliRujukan;
    var user = req.body.user;
    const formData = {
      request: {
        t_rujukan: {
          noSep: noSep,
          tglRujukan: tglRujukan,
          ppkDirujuk: ppkDirujuk,
          jnsPelayanan: jnsPelayanan,
          catatan: catatan,
          diagRujukan: diagRujukan,
          tipeRujukan: tipeRujukan,
          poliRujukan: poliRujukan,
          user: user,
        },
      },
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.post(
      {
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/Rujukan/insert",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          res.status(400).send({
            error: "Internal Server Error", raw_error: err ? err.message : "",
            status: "error",
            message: "ERROR_OPERASI",
            data: httpResponse,
          });
        }
        res.json(JSON.parse(body));
      }
    );
  },
  vclaimApiRujukanInsert2: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const formData = {
        request: {
          t_rujukan: {
            noSep: req.body.noSep,
            tglRujukan: req.body.tglRujukan,
            tglRencanaKunjungan: req.body.tglRencanaKunjungan,
            ppkDirujuk: req.body.ppkDirujuk,
            jnsPelayanan: req.body.jnsPelayanan,
            catatan: req.body.catatan,
            diagRujukan: req.body.diagRujukan,
            tipeRujukan: req.body.tipeRujukan,
            poliRujukan: req.body.poliRujukan,
            user: req.body.user,
          },
        },
      };
      const getList = await axios.post(
        BaseUrl + "Rujukan/2.0/insert",
        formData,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
            "Content-Type": "Application/x-www-form-urlencoded",
          },
        }
      );

      /* res.json(getList.data); */

      if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Insert SEP",
          code: 201,
        },
      });
    }
  },
  vclaimApiRujukanUpdate: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");

    function decryptResponse(string, key) {
      var key_hash = crypto.createHash("sha256").update(key).digest();
      var iv = key_hash.slice(0, 16);
      var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
      var output =
        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
      let response = lz.decompressFromEncodedURIComponent(output);
      return response;
    }

    try {
      const formData = {
        request: {
          t_rujukan: {
            noRujukan: req.body.noRujukan,
            tglRujukan: req.body.tglRujukan,
            tglRencanaKunjungan: req.body.tglRencanaKunjungan,
            ppkDirujuk: req.body.ppkDirujuk,
            jnsPelayanan: req.body.jnsPelayanan,
            catatan: req.body.catatan,
            diagRujukan: req.body.diagRujukan,
            tipeRujukan: req.body.tipeRujukan,
            poliRujukan: req.body.poliRujukan,
            user: req.body.user,
          },
        },
      };
      const dataReq = await axios.put(
        BaseUrl + "Rujukan/2.0/Update",
        formData,
        {
          headers: {
            "x-cons-id": ConsId,
            "x-timestamp": tmStamp,
            "x-signature": encodedSigna,
            user_key: UserKey,
            "Content-Type": "Application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      );

      if (dataReq.data.metaData.code !== "200") {
        res.json({
          response: dataReq.data,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(dataReq.data.response, password)
        );
        res.json({
          response: {
            metaData: {
              message: "Ok",
              code: 200,
            },
            response: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiRujukanDelete: function (req, res, next) {
    const formData = {
      request: {
        t_rujukan: {
          noRujukan: "0301R0011117B000015",
          user: "Dadang",
        },
      },
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.del(
      {
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/Rujukan/delete",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          res.status(400).send({
            error: "Internal Server Error", raw_error: err ? err.message : "",
            status: "error",
            message: "ERROR_OPERASI",
            data: httpResponse,
          });
        }
        res.json(JSON.parse(body));
      }
    );
  },
};
