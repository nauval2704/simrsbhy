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
  vclaimApiSep11Insert: function (req, res, next) {
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
  vclaimApiSep11Cari: function (req, res, next) {
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
