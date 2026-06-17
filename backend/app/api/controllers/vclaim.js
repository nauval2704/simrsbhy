var request = require("request");
const crypto = require("crypto");
const axios = require("axios");
const moment = require("moment");
const ruanganModel = require("../models/ruangan");
var lz = require("lz-string");

/* RS BHAYANGKARA 
BASE URL DEVELOPMENT : https://dvlp.bpjs-kesehatan.go.id/VClaim-Rest/ */
var considDev = "11349";
var keyDev = "8qN14DBB1B";
var urlDev = "https://dvlp.bpjs-kesehatan.go.id/VClaim-Rest/";

var consid = "13034";
var key = "0xR53761A8";

var kodeRs = "0101R009";
var consProd = "13034";
var keyProd = "0xR53761A8";

var urlVclaim = "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/";
var urlApplicares = "https://new-api.bpjs-kesehatan.go.id/aplicaresws/";

// prod

const ConsId = "13034";
const SecretKey = "0xR53761A8";
const UserKey = "6824f88f2b12582ebd98c430afc8c76f";
const BaseUrl = "https://apijkn.bpjs-kesehatan.go.id/vclaim-rest/";

// dev

// const ConsId = "11349";
// const SecretKey = "8qN14DBB1B";
// const UserKey = "b9b3652f2cc0887755ba567f759a41d6";
// const BaseUrl = "https://apijkn-dev.bpjs-kesehatan.go.id/vclaim-rest-dev/";

/* var consid = "16916";
var key = "9iA76C39FC"; */

module.exports = {
  vclaimApiDiagnosa: async (req, res) => {
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
        BaseUrl + "referensi/diagnosa/" + req.params.diagnosa,
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
  vclaimApiPoli: async (req, res) => {
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
        BaseUrl + "referensi/poli/" + req.params.poli,
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
  vclaimApiFaskes: async (req, res) => {
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
        "referensi/faskes/" +
        req.params.nama +
        "/" +
        req.params.jenis,
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
  vclaimApiDpjp: async (req, res) => {
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
        "referensi/dokter/pelayanan/" +
        req.params.jenis +
        "/tglPelayanan/" +
        req.params.tgl +
        "/Spesialis/" +
        req.params.kode,
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
  vclaimApiFingerPrint: async (req, res) => {
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
        "SEP/FingerPrint/Peserta/" +
        req.params.noKartu +
        "/TglPelayanan/" +
        req.params.tgl,
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
  vclaimApiListFingerPrint: async (req, res) => {
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
        BaseUrl + "SEP/FingerPrint/List/Peserta/TglPelayanan/" + req.params.tgl,
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
  vclaimApiListSarana: async (req, res) => {
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
        BaseUrl + "Rujukan/ListSarana/PPKRujukan/" + req.params.kode,
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
  vclaimApiPropinsi: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/propinsi", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiKabupaten: async (req, res) => {
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
        BaseUrl + "referensi/kabupaten/propinsi/" + req.params.kode,
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
  vclaimApiKecamatan: async (req, res) => {
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
        BaseUrl + "referensi/kecamatan/kabupaten/" + req.params.kode,
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
  vclaimApiProcedure: async (req, res) => {
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
        BaseUrl + "referensi/procedure/" + req.params.kode,
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
  vclaimApiKelasRawat: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/kelasrawat", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiDokter: async (req, res) => {
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
        BaseUrl + "referensi/dokter/" + req.params.nama,
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
  vclaimApiSuratKontrolCari: async (req, res) => {
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
        BaseUrl + "RencanaKontrol/noSuratKontrol/" + req.params.noSuratKontrol,
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
  vclaimApiSpesialistik: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/spesialistik", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiRuangRawat: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/ruangrawat", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiCaraKeluar: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/carakeluar", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiObatPrb: async (req, res) => {
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
        BaseUrl + "referensi/obatprb/" + req.params.nama,
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
  vclaimApiDiagnosaPrb: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/diagnosaprb", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiPascaPulang: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "referensi/pascapulang", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });

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
  vclaimApiTanggalPulang: async (req, res) => {
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
          t_sep: {
            noSep: req.body.noSep,
            statusPulang: req.body.statusPulang,
            noSuratMeninggal: req.body.noSuratMeninggal,
            tglMeninggal: req.body.tglMeninggal,
            tglPulang: req.body.tglPulang,
            noLPManual: req.body.noLPManual,
            user: req.body.user,
          },
        },
      };
      const dataReq = await axios.put(BaseUrl + "SEP/2.0/updtglplg", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

      res.json({
        response: {
          metaData: {
            message: "Ok",
            code: 200,
          },
          data: dataReq.data,
        },
      });
    } catch (err) {
      res.json({
        metadata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiPesertaNokartu: async (req, res) => {
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
        "Peserta/nokartu/" +
        req.params.nokartu +
        "/tglSEP/" +
        req.params.tgl,
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
  vclaimApiPesertaNik: async (req, res) => {
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
        BaseUrl + "Peserta/nik/" + req.params.nik + "/tglSEP/" + req.params.tgl,
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
  vclaimApiSpriUpdate: async (req, res) => {
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
          noSuratKontrol: req.body.noSuratKontrol,
          noSEP: req.body.noSEP,
          kodeDokter: req.body.kodeDokter,
          poliKontrol: req.body.poliKontrol,
          tglRencanaKontrol: req.body.tglRencanaKontrol,
          user: req.body.user,
        },
      };
      const dataReq = await axios.put(
        BaseUrl + "RencanaKontrol/Update",
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
            data: response,
          },
        });
      }
    } catch (err) {
      res.json({
        metaata: {
          message: "Jadwal Tidak Ditemukan",
          code: 201,
        },
      });
    }
  },
  vclaimApiSpriDelete: async (req, res) => {
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
        t_suratkontrol: {
          noSuratKontrol: req.body.noSuratKontrol,
          user: req.body.user,
        },
      };
      const getList = await axios.delete(BaseUrl + "RencanaKontrol/Delete", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        data: {
          request: formData,
        },
      });

      res.json({
        response: {
          metaData: {
            message: "Ok",
            code: 200,
          },
          data: getList.data,
        },
      });

      /* if (getList.data.metaData.code !== "200") {
        res.json({
          response: getList.data,
        });
      } else {
        const response = await JSON.parse(
          decryptResponse(getList.data.response, password)
        );


        
      } */
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Delete SPRI",
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
  vclaimApiPrbInsert: async (req, res) => {
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
          t_prb: {
            noSep: req.body.noSep,
            noKartu: req.body.noKartu,
            alamat: req.body.alamat,
            email: req.body.email,
            programPRB: req.body.programPRB,
            kodeDPJP: req.body.kodeDPJP,
            keterangan: req.body.keterangan,
            saran: req.body.saran,
            user: req.body.user,
            obat: req.body.obat,
          },
        },
      };
      const getList = await axios.post(BaseUrl + "PRB/insert", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

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
  vclaimApiSuratKontrolInsert: async (req, res) => {
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
          noSEP: req.body.noSEP,
          kodeDokter: req.body.kodeDokter,
          poliKontrol: req.body.poliKontrol,
          tglRencanaKontrol: req.body.tglRencanaKontrol,
          user: req.body.user,
        },
      };
      const getList = await axios.post(
        BaseUrl + "RencanaKontrol/insert",
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
  vclaimApiSpriInsert: async (req, res) => {
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
          noKartu: req.body.noKartu,
          kodeDokter: req.body.kodeDokter,
          poliKontrol: req.body.poliKontrol,
          tglRencanaKontrol: req.body.tglRencanaKontrol,
          user: req.body.user,
        },
      };
      const getList = await axios.post(
        BaseUrl + "RencanaKontrol/InsertSPRI",
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
  vclaimApiSpriCariNokartu: async (req, res) => {
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
        "RencanaKontrol/ListRencanaKontrol/Bulan/" +
        req.params.bulan +
        "/Tahun/" +
        req.params.tahun +
        "/Nokartu/" +
        req.params.nokartu +
        "/filter/" +
        req.params.filter,
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
  vclaimApiSpriListPoli: async (req, res) => {
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
        "RencanaKontrol/ListSpesialistik/JnsKontrol/" +
        req.params.jenis +
        "/nomor/" +
        req.params.nomor +
        "/TglRencanaKontrol/" +
        req.params.tanggal,
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
  vclaimApiSpriListDokter: async (req, res) => {
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
        "/RencanaKontrol/JadwalPraktekDokter/JnsKontrol/" +
        req.params.jenis +
        "/KdPoli/" +
        req.params.kode +
        "/TglRencanaKontrol/" +
        req.params.tanggal,
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
  vclaimApiSep11Insert: async (req, res) => {
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
          t_sep: {
            noKartu: req.body.noKartu,
            tglSep: req.body.tglSep,
            ppkPelayanan: req.body.ppkPelayanan,
            jnsPelayanan: req.body.jnsPelayanan,
            klsRawat: {
              klsRawatHak: req.body.klsRawatHak,
              klsRawatNaik: req.body.klsRawatNaik,
              pembiayaan: req.body.pembiayaan,
              penanggungJawab: req.body.penanggungJawab,
            },
            noMR: req.body.noMR,
            rujukan: {
              asalRujukan: req.body.asalRujukan,
              tglRujukan: req.body.tglRujukan,
              noRujukan: req.body.noRujukan,
              ppkRujukan: req.body.ppkRujukan,
            },
            catatan: req.body.catatan,
            diagAwal: req.body.diagAwal,
            poli: {
              tujuan: req.body.tujuan,
              eksekutif: req.body.eksekutif,
            },
            cob: {
              cob: req.body.cob,
            },
            katarak: {
              katarak: req.body.katarak,
            },
            jaminan: {
              lakaLantas: req.body.lakaLantas,
              noLP: req.body.noLP,
              penjamin: {
                tglKejadian: req.body.tglKejadian,
                keterangan: req.body.keterangan,
                suplesi: {
                  suplesi: req.body.suplesi,
                  noSepSuplesi: req.body.noSepSuplesi,
                  lokasiLaka: {
                    kdPropinsi: req.body.kdPropinsi,
                    kdKabupaten: req.body.kdKabupaten,
                    kdKecamatan: req.body.kdKecamatan,
                  },
                },
              },
            },
            tujuanKunj: req.body.tujuanKunj,
            flagProcedure: req.body.flagProcedure,
            kdPenunjang: req.body.kdPenunjang,
            assesmentPel: req.body.assesmentPel,
            skdp: {
              noSurat: req.body.noSurat,
              kodeDPJP: req.body.kodeDPJP,
            },
            dpjpLayan: req.body.dpjpLayan,
            noTelp: req.body.noTelp,
            user: req.body.user,
          },
        },
      };
      const getList = await axios.post(BaseUrl + "SEP/2.0/insert", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

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
  /* vclaimApiSep11Insert: function (req, res, next) {
    var nobpjs = req.body.nobpjs;
    var tglsep = req.body.tglsep;
    var searchFaskes = req.body.searchFaskes;
    var ppkPelayanan = req.body.ppkPelayanan;
    var jnsPelayanan = req.body.jnsPelayanan;
    var klsRawat = req.body.klsRawat;
    var noMR = req.body.noMR;
    var asalRujukan = req.body.asalRujukan;
    var tglRujukan = req.body.tglRujukan;
    var noRujukan = req.body.noRujukan;
    var searchFaskesRujukan = req.body.searchFaskesRujukan;
    var ppkRujukan = req.body.ppkRujukan;
    var catatan = req.body.catatan;
    var diagAwal = req.body.diagAwal;
    var tujuan = req.body.tujuan;
    var eksekutif = req.body.eksekutif;
    var cob = req.body.cob;
    var katarak = req.body.katarak;
    var lakaLantas = req.body.lakaLantas;
    var penjamin = req.body.penjamin;
    var tglKejadian = req.body.tglKejadian;
    var keterangan = req.body.keterangan;
    var suplesi = req.body.suplesi;
    var noSepSuplesi = req.body.noSepSuplesi;
    var kdPropinsi = req.body.kdPropinsi;
    var kdKabupaten = req.body.kdKabupaten;
    var kdKecamatan = req.body.kdKecamatan;
    var noSurat = req.body.noSurat;
    var kodeDPJP = req.body.kodeDPJP;
    var noTelp = req.body.noTelp;
    var user = req.body.user;
    const formData = {
      request: {
        t_sep: {
          noKartu: req.body.noKartu,
          tglSep: req.body.noKartu,
          ppkPelayanan: req.body.noKartu,
          jnsPelayanan: req.body.noKartu,
          klsRawat: {
            klsRawatHak: req.body.noKartu,
            klsRawatNaik: req.body.noKartu,
            pembiayaan: req.body.noKartu,
            penanggungJawab: req.body.noKartu,
          },
          noMR: req.body.noKartu,
          rujukan: {
            asalRujukan: req.body.noKartu,
            tglRujukan: req.body.noKartu,
            noRujukan: req.body.noKartu,
            ppkRujukan: req.body.noKartu,
          },
          catatan: req.body.noKartu,
          diagAwal: req.body.noKartu,
          poli: {
            tujuan: req.body.noKartu,
            eksekutif: req.body.noKartu,
          },
          cob: {
            cob: req.body.noKartu,
          },
          katarak: {
            katarak: req.body.noKartu,
          },
          jaminan: {
            lakaLantas: req.body.noKartu,
            noLP: req.body.noKartu,
            penjamin: {
              tglKejadian: req.body.noKartu,
              keterangan: req.body.noKartu,
              suplesi: {
                suplesi: req.body.noKartu,
                noSepSuplesi: req.body.noKartu,
                lokasiLaka: {
                  kdPropinsi: req.body.noKartu,
                  kdKabupaten: req.body.noKartu,
                  kdKecamatan: req.body.noKartu,
                },
              },
            },
          },
          tujuanKunj: req.body.noKartu,
          flagProcedure: req.body.noKartu,
          kdPenunjang: req.body.noKartu,
          assesmentPel: req.body.noKartu,
          skdp: {
            noSurat: req.body.noKartu,
            kodeDPJP: req.body.noKartu,
          },
          dpjpLayan: req.body.noKartu,
          noTelp: req.body.noKartu,
          user: req.body.noKartu,
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
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/SEP/1.1/insert",
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
            error: err,
            status: "error",
            message: "ERROR_OPERASI",
            data: httpResponse,
          });
        }
        res.json(JSON.parse(body));
      }
    );
  }, */
  vclaimApiSep11Update: async (req, res) => {
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
          t_sep: {
            noSep: req.body.noSep,
            klsRawat: {
              klsRawatHak: req.body.klsRawatHak,
              klsRawatNaik: req.body.klsRawatNaik,
              pembiayaan: req.body.pembiayaan,
              penanggungJawab: req.body.penanggungJawab,
            },
            noMR: req.body.noMR,
            catatan: req.body.catatan,
            diagAwal: req.body.diagAwal,
            poli: {
              tujuan: req.body.tujuan,
              eksekutif: req.body.eksekutif,
            },
            cob: {
              cob: req.body.cob,
            },
            katarak: {
              katarak: req.body.katarak,
            },
            jaminan: {
              lakaLantas: req.body.lakaLantas,
              penjamin: {
                tglKejadian: req.body.tglKejadian,
                keterangan: req.body.keterangan,
                suplesi: {
                  suplesi: req.body.suplesi,
                  noSepSuplesi: req.body.noSepSuplesi,
                  lokasiLaka: {
                    kdPropinsi: req.body.kdPropinsi,
                    kdKabupaten: req.body.kdKabupaten,
                    kdKecamatan: req.body.kdKecamatan,
                  },
                },
              },
            },
            dpjpLayan: req.body.dpjpLayan,
            noTelp: req.body.noTelp,
            user: req.body.user,
          },
        },
      };
      const dataReq = await axios.put(BaseUrl + "SEP/2.0/update", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

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
  vclaimApiSep11Delete: async (req, res) => {
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
        t_sep: {
          noSep: req.body.noSep,
          user: req.body.user,
        },
      };
      const getList = await axios.delete(BaseUrl + "SEP/2.0/delete", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        data: {
          request: formData,
        },
      });

      res.json({
        response: {
          metaData: {
            message: "Ok",
            code: 200,
          },
          data: getList.data,
        },
      });
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Delete SPRI",
          code: 201,
        },
      });
    }
  },
  vclaimApiSepInternalDelete: async (req, res) => {
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
        t_sep: {
          noSep: req.body.noSep,
          noSurat: req.body.noSurat,
          tglRujukanInternal: req.body.tglRujukanInternal,
          kdPoliTuj: req.body.kdPoliTuj,
          user: req.body.user,
        },
      };
      const getList = await axios.delete(BaseUrl + "SEP/Internal/delete", {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        data: {
          request: formData,
        },
      });

      res.json({
        response: {
          metaData: {
            message: "Ok",
            code: 200,
          },
          data: getList.data,
        },
      });
    } catch (err) {
      res.json({
        metaData: {
          message: "Error Delete SPRI",
          code: 201,
        },
      });
    }
  },
  vclaimApiSep11Cari: async (req, res) => {
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
      const getList = await axios.get(BaseUrl + "/SEP/" + req.params.sep, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
        },
      });


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
  vclaimApiSepInternalCari: async (req, res) => {
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
        BaseUrl + "/SEP/Internal/" + req.params.sep,
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
  vclaimApiSepInternal: async (req, res) => {
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
        BaseUrl + "/SEP/Internal/" + req.params.noSep,
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
  /*   vclaimApiSep11Cari: function (req, res, next) {
    var sep = req.params.sep;
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url:
          "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/SEP/" +
          sep,
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
  }, */
  vclaimApiDataSuratKontrol: async (req, res) => {
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
        BaseUrl + "RencanaKontrol/noSuratKontrol/" + req.params.nosurat,
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
  vclaimApiListSuratKontrol: async (req, res) => {

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
        "RencanaKontrol/ListRencanaKontrol/tglAwal/" +
        req.params.tglAwal +
        "/tglAkhir/" +
        req.params.tglAkhir +
        "/filter/" +
        req.params.filter,
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
  vclaimApiJasaRaharjaSuplesi: async (req, res) => {
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
        "sep/JasaRaharja/Suplesi/" +
        req.params.nokartu +
        "/tglPelayanan/" +
        req.params.tgl,
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
  vclaimApiPengajuanSep: async (req, res) => {
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
          t_sep: {
            noKartu: req.body.noKartu,
            tglSep: req.body.tglSep,
            jnsPelayanan: req.body.jnsPelayanan,
            jnsPengajuan: req.body.jnsPengajuan,
            keterangan: req.body.keterangan,
            user: req.body.user,
          },
        },
      };
      const getList = await axios.post(BaseUrl + "Sep/pengajuanSEP", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

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
  vclaimApiApprovalSep: async (req, res) => {
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
          t_sep: {
            noKartu: req.body.noKartu,
            tglSep: req.body.tglSep,
            jnsPelayanan: req.body.jnsPelayanan,
            jnsPengajuan: req.body.jnsPengajuan,
            keterangan: req.body.keterangan,
            user: req.body.user,
          },
        },
      };
      const getList = await axios.post(BaseUrl + "Sep/aprovalSEP", formData, {
        headers: {
          "x-cons-id": ConsId,
          "x-timestamp": tmStamp,
          "x-signature": encodedSigna,
          user_key: UserKey,
          "Content-Type": "Application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });

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
  vclaimApiSepUpdtglplg: function (req, res, next) {
    var noSep = req.body.noSep;
    var tglPulang = req.body.tglPulang;
    var user = req.body.user;
    const formData = {
      request: {
        t_sep: {
          noSep: noSep,
          tglPulang: tglPulang,
          user: user,
        },
      },
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.put(
      {
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/Sep/updtglplg",
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
  vclaimApiSepCbg: function (req, res, next) {
    var nosep = req.params.nosep;
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url:
          "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/sep/cbg/" +
          nosep,
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
  vclaimApiUpdateSpri: async (req, res) => {
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
          noSPRI: req.body.noSPRI,
          kodeDokter: req.body.kodeDokter,
          poliKontrol: req.body.poliKontrol,
          tglRencanaKontrol: req.body.tglRencanaKontrol,
          user: req.body.user,
        },
      };
      const dataReq = await axios.put(
        BaseUrl + "RencanaKontrol/UpdateSPRI",
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
  vclaimApiLpkInsert: function (req, res, next) {
    const formData = {
      request: {
        t_lpk: {
          noSep: "0017R0171020V000002",
          tglMasuk: "2020-10-28",
          tglKeluar: "2020-10-28",
          jaminan: "1",
          poli: {
            poli: "INT",
          },
          perawatan: {
            ruangRawat: "",
            kelasRawat: "",
            spesialistik: "",
            caraKeluar: "",
            kondisiPulang: "",
          },
          diagnosa: [
            {
              kode: "N88.0",
              level: "1",
            },
            {
              kode: "A00.1",
              level: "2",
            },
          ],
          procedure: [
            {
              kode: "00.82",
            },
            {
              kode: "00.83",
            },
          ],
          rencanaTL: {
            tindakLanjut: "1",
            dirujukKe: {
              kodePPK: "",
            },
            kontrolKembali: {
              tglKontrol: "2020-11-28",
              poli: "",
            },
          },
          DPJP: "31661",
          user: "Coba Ws",
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
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/LPK/insert",
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
  vclaimApiLpkUpdate: function (req, res, next) {
    const formData = {
      request: {
        t_lpk: {
          noSep: "0017R0171020V000002",
          tglMasuk: "2020-10-28",
          tglKeluar: "2020-10-28",
          jaminan: "1",
          poli: {
            poli: "INT",
          },
          perawatan: {
            ruangRawat: "1",
            kelasRawat: "1",
            spesialistik: "1",
            caraKeluar: "1",
            kondisiPulang: "1",
          },
          diagnosa: [
            {
              kode: "N88.0",
              level: "1",
            },
            {
              kode: "A00.1",
              level: "2",
            },
          ],
          procedure: [
            {
              kode: "00.82",
            },
            {
              kode: "00.83",
            },
          ],
          rencanaTL: {
            tindakLanjut: "1",
            dirujukKe: {
              kodePPK: "",
            },
            kontrolKembali: {
              tglKontrol: "2020-10-29",
              poli: "",
            },
          },
          DPJP: "3",
          user: "Coba Ws",
        },
      },
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.put(
      {
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/LPK/update",
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
  vclaimApiLpkDelete: function (req, res, next) {
    const formData = {
      request: {
        t_lpk: {
          noSep: "0017R0171020V000002",
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
        url: "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/LPK/delete",
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
  vclaimApiLpkData: function (req, res, next) {
    var tglmasuk = req.params.tglmasuk;
    var jenis = req.params.jenis;
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url:
          "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/LPK/TglMasuk/" +
          tglmasuk +
          "/JnsPelayanan/" +
          jenis,
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
  vclaimApiMonitoringKunjungan: async (req, res) => {
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
        "Monitoring/Kunjungan/Tanggal/" +
        req.params.tgl +
        "/JnsPelayanan/" +
        req.params.jenis,
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
  vclaimApiMonitoringKlaim: async (req, res) => {
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
        "Monitoring/Klaim/Tanggal/" +
        req.params.tgl +
        "/JnsPelayanan/" +
        req.params.jenis +
        "/status/" +
        req.params.status,
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
  vclaimApiMonitoringHistori: async (req, res) => {
    const dateSkrg = Date.now();
    const tmStamp = Math.floor(dateSkrg / 1000);
    const data = ConsId + "&" + tmStamp;
    const password = ConsId + SecretKey + tmStamp;
    var signa = crypto.createHmac("sha256", SecretKey).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const today = moment(new Date(), "YYYYMMDD");
    const tgl90Hari = moment().add(-90, "days").format("YYYY-MM-DD");

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
        "monitoring/HistoriPelayanan/NoKartu/" +
        req.params.nokartu +
        "/tglMulai/" +
        tgl90Hari +
        "/tglAkhir/" +
        req.params.tglakhir,
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
  vclaimApiMonitoringJasaRaharja: function (req, res, next) {
    var tglmulai = req.params.tglmulai;
    var tglakhir = req.params.tglakhir;
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url:
          "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/monitoring/JasaRaharja/tglMulai/" +
          tglmulai +
          "/tglAkhir/" +
          tglakhir,
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
            message: "ERROR_JASARAHARJA",
            data: httpResponse,
          });
        }
        res.json(JSON.parse(body));
      }
    );
  },
  vclaimApiKamarReferensi: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url: "https://new-api.bpjs-kesehatan.go.id/aplicaresws/rest/ref/kelas",
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
  vclaimApiKamarTersedia: async (req, res) => {
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
        BaseUrl + "referensi/diagnosa/" + req.params.diagnosa,
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
          message: "Error update kamar",
          code: 201,
        },
      });
    }
  },
  vclaimApiKamarTersedia1: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.get(
      {
        url: "https://new-api.bpjs-kesehatan.go.id/aplicaresws/rest/bed/read/0101R009/1/100",
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
        } else {
          res.json(JSON.parse(body));
        }
      }
    );
  },
  vclaimApiKamarCreate: function (req, res, next) {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    var namaruang = req.body.namaruang;
    var kapasitas = req.body.kapasitas;
    var tersedia = req.body.tersedia;
    var tersediapria = req.body.tersediapria;
    var tersediawanita = req.body.tersediawanita;
    var tersediapriawanita = req.body.tersediapriawanita;
    const formData = {
      kodekelas: kodekelas,
      koderuang: koderuang,
      namaruang: namaruang,
      kapasitas: kapasitas,
      tersedia: tersedia,
      tersediapria: tersediapria,
      tersediawanita: tersediawanita,
      tersediapriawanita: tersediapriawanita,
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.post(
      {
        url: "https://new-api.bpjs-kesehatan.go.id/aplicaresws/rest/bed/create/0101R009",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
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
  vclaimApiKamarUpdate1: async (req, res) => {
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
        kodekelas: req.body.kodekelas,
        koderuang: req.body.koderuang,
        namaruang: req.body.namaruang,
        kapasitas: req.body.kapasitas,
        tersedia: req.body.tersedia,
        tersediapria: req.body.tersediapria,
        tersediawanita: req.body.tersediawanita,
        tersediapriawanita: req.body.tersediapriawanita,
      };

      const getList = await axios.post(
        BaseUrl + "aplicaresws/rest/bed/update/0101R009",
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
          message: "Error update kamar",
          code: 201,
        },
      });
    }
  },
  vclaimApiKamarUpdate: function (req, res, next) {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    var namaruang = req.body.namaruang;
    var kapasitas = req.body.kapasitas;
    var tersedia = req.body.tersedia;
    var tersediapria = req.body.tersediapria;
    var tersediawanita = req.body.tersediawanita;
    var tersediapriawanita = req.body.tersediapriawanita;
    const formData = {
      kodekelas: kodekelas,
      koderuang: koderuang,
      namaruang: namaruang,
      kapasitas: kapasitas,
      tersedia: tersedia,
      tersediapria: tersediapria,
      tersediawanita: tersediawanita,
      tersediapriawanita: tersediapriawanita,
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.post(
      {
        url: "https://new-api.bpjs-kesehatan.go.id/aplicaresws/rest/bed/update/0101R009",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
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
  vclaimApiKamarDelete: function (req, res, next) {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    const formData = {
      kodekelas: kodekelas,
      koderuang: koderuang,
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consid + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", key).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    request.post(
      {
        url: "https://new-api.bpjs-kesehatan.go.id/aplicaresws/rest/bed/delete/0101R009",
        headers: {
          "X-cons-id": consid,
          "X-timestamp": tmStamp,
          "X-signature": encodedSigna,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
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
  vclaimApiKamarReferensiProd: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consProd + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", keyProd).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    const options = {
      headers: {
        "X-cons-id": consProd,
        "X-timestamp": tmStamp,
        "X-signature": encodedSigna,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
    };

    axios({
      url: urlApplicares + "rest/ref/kelas",
      method: "get",
      headers: {
        "X-cons-id": consProd,
        "X-timestamp": tmStamp,
        "X-signature": encodedSigna,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => { });
  },
  vclaimApiKamarTersediaProd: function (req, res, next) {
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consProd + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", keyProd).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");

    axios({
      url: urlApplicares + "rest/bed/read/" + kodeRs + "/1/100",
      method: "get",
      headers: {
        "X-cons-id": consProd,
        "X-timestamp": tmStamp,
        "X-signature": encodedSigna,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(200).send({
          error: err,
          status: "error",
          message: "ERROR_OPERASI",
          data: err,
        });
      });
  },
  kamarLocal: async function (req, res, next) {
    try {
      const getData = await ruanganModel.aggregate([
        {
          $match: {
            kodeKelas: { $in: ['KL1', 'KL2', 'KL3', 'VVIP', 'VIP'] } // Filter by kodeKelas values 'KL1' and 'KL2'
          }
        }, {
          $addFields: {
            tersediaNumber: { $toInt: "$tersedia" } // Convert tersedia to a number
          }
        },
        {
          $group: {
            _id: "$kodeKelas",
            tersedia: { $sum: "$tersediaNumber" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]).exec();

      res.json(getData);
    } catch (err) {
      res.status(500).json({ error: 'An error occurred' });
    }
  },
  vclaimApiKamarCreateProd: function (req, res, next) {
    var kodekelas = req.body.kodekelas;
    var koderuang = req.body.koderuang;
    var namaruang = req.body.namaruang;
    var kapasitas = req.body.kapasitas;
    var tersedia = req.body.tersedia;
    var tersediapria = req.body.tersediapria;
    var tersediawanita = req.body.tersediawanita;
    var tersediapriawanita = req.body.tersediapriawanita;
    const formData = {
      kodekelas: kodekelas,
      koderuang: koderuang,
      namaruang: namaruang,
      kapasitas: kapasitas,
      tersedia: tersedia,
      tersediapria: tersediapria,
      tersediawanita: tersediawanita,
      tersediapriawanita: tersediapriawanita,
    };
    var dateSkrg = Date.now();
    var tmStamp = Math.floor(dateSkrg / 1000);
    var data = consProd + "&" + tmStamp;
    var signa = crypto.createHmac("sha256", keyProd).update(data).digest();
    var encodedSigna = Buffer.from(signa).toString("base64");
    axios({
      url: urlApplicares + "rest/bed/create/" + kodeRs,
      method: "post",
      headers: {
        "X-cons-id": consProd,
        "X-timestamp": tmStamp,
        "X-signature": encodedSigna,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      data: formData,
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        res.status(400).send({
          error: err,
          status: "error",
          message: "ERROR_CREATE",
          data: httpResponse,
        });
      });
  },
};
