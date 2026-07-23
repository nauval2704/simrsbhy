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
            error: "Internal Server Error", raw_error: err ? err.message : "",
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
            error: "Internal Server Error", raw_error: err ? err.message : "",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
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
          error: "Internal Server Error", raw_error: err ? err.message : "",
          status: "error",
          message: "ERROR_CREATE",
          data: httpResponse,
        });
      });
  },
};
