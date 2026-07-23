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
};
