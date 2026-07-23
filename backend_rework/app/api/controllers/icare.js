const gudangModel = require("../models/gudang");
const importModel = require("../models/import");
const apotekModel = require("../models/stockApotek");

var moment = require("moment");
var mongoose = require("mongoose");
const crypto = require("crypto");
const axios = require("axios");
var lz = require("lz-string");
const ObjectId = mongoose.Types.ObjectId;


var consid = "1962";
var key = "5jBCABEED9";

var kodeRs = "0008S003";
// var kodeRs = "1211402";
var consProd = "1962";
var keyProd = "5jBCABEED9";


// const ConsId = "11349";
// const SecretKey = "8qN14DBB1B";
// const UserKey = "b9b3652f2cc0887755ba567f759a41d6";

// const BaseUrl = "https://apijkn.bpjs-kesehatan.go.id/wsihs/api/rs/validate/";
// const BaseUrl = "https://apijkn-dev.bpjs-kesehatan.go.id/ihs_dev/";

const ConsId = process.env.BPJS_CONS_ID;
const SecretKey = process.env.BPJS_SECRET_KEY;
const UserKey = process.env.BPJS_USER_KEY;
const BaseUrl = process.env.BPJS_ICARE_BASE_URL;

var urlApplicares = "https://dvlp.bpjs-kesehatan.go.id:8888/aplicaresws/";


module.exports = {

    icareFkrtl: async (req, res) => {
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

            if (req.body.kodeDokter === null) {

                return res.json({
                    response: {
                        metaData: {
                            message: "Ok",
                            code: 200,
                        },
                        data: { metaData: { message: 'dokter tidak ditemukan' } },
                    },
                });
            }

            const formData = {
                param: req.body.noKartu,
                // param: '0002065166706',
                // param: '0001444700801',
                kodedokter: req.body.kodeDokter,
            };
            const getList = await axios.post(BaseUrl,
                formData,
                {
                    headers: {
                        "X-cons-id": ConsId,
                        "X-timestamp": tmStamp,
                        "X-signature": encodedSigna,
                        user_key: UserKey,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    }
                });


            if (getList.data.metaData.code === 200) {
                const response = await JSON.parse(decryptResponse(getList.data.response, password))
                return res.json({
                    response: {
                        metaData: {
                            message: "Ok",
                            code: 200,
                        },
                        data: response,
                    },
                });
            }

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

    icareFktp: async (req, res) => {
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
                param: '0002079759868',
            };
            const getList = await axios.delete(BaseUrl + "api/pcare/validate", {
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

            const response = await JSON.parse(decryptResponse(getList.data.response, password))

            res.json({
                response: {
                    metaData: {
                        message: "Ok",
                        code: 200,
                    },
                    data: response,
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

}