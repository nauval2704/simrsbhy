const response = require("../../../config/response");
const userModel = require("../models/users");
const pasienModel = require("../models/pasien");
const antreanModel = require("../models/antreans");
const antreanAdmisiModel = require("../models/modelantrian/antreanAdmisi");
const taskIdModel = require("../models/modelantrian/taskid");
const jadwalOperasiModel = require("../models/modelantrian/jadwalOperasi");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const moment = require("moment");
var lz = require("lz-string");
require("dotenv").config();

const avgPelayanan = 6; // Average service time in minutes
const defaultCapacity = 40; // 

module.exports = {
    ambilAntrean: async (req, res) => {
        const generateHeaders = () => {
            const timestamp = Math.floor(Date.now() / 1000);
            const data = `${process.env.CONSID}&${timestamp}`;
            const signature = crypto
                .createHmac("sha256", process.env.SECRETKEY)
                .update(data)
                .digest("base64");

            return {
                headers: {
                    "x-cons-id": process.env.CONSID,
                    "x-timestamp": timestamp, 
                    "x-signature": signature,
                    user_key: process.env.USERKEY,
                },
            };
        };
        // Helper function to calculate service time estimation
        const calculateEstimatedServiceTime = (startHour, startMinute, queueTime) => {
            const waktuDilayani = new Date();
            waktuDilayani.setHours(startHour, startMinute + queueTime, 0);

            return waktuDilayani.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            });
        };
        try {
            let {
                jenispasien,
                nomorkartu,
                nik,
                nohp,
                kodepoli,
                namapoli,
                pasienbaru,
                norm,
                tanggalperiksa,
                kodedokter,
                namadokter,
                kapasitaspasien,
                jampraktek,
                jeniskunjungan,
                nomorreferensi,
                jenisresep,
                kodebooking,
            } = req.body;


            // Calculate queues and quotas
            const sisaAntrean = await antreanModel.countDocuments({
                kodepoli,
                tanggalperiksa,
                status: 0,
            });

            const angkaantrean =
                (await antreanModel.countDocuments({
                    tanggalperiksa,
                    jampraktek,
                    kodepoli,
                    kodedokter,
                })) + 1;

            const nomorantrean = `${kodepoli}-${angkaantrean}`;

            if (kodebooking === '-') {
                kodebooking = `${Date.now()}${nomorantrean.replace("-", "")}`;
            }

            const queueTime = sisaAntrean * avgPelayanan;
            const [startHour, startMinute] = jampraktek.split("-")[0].split(":").map(Number);
            const formattedTime = calculateEstimatedServiceTime(startHour, startMinute, queueTime);

            const stringDatePraktek = `${tanggalperiksa} ${jampraktek.split("-")[0]}`;
            const estimasidilayani = moment().isAfter(moment(stringDatePraktek))
                ? moment().add(queueTime, "minutes").valueOf()
                : moment(`${tanggalperiksa} ${formattedTime}`).valueOf();

            const patientCapacity = kapasitaspasien ?? defaultCapacity;
            const kuotajkn = patientCapacity * 0.8;
            const kuotanonjkn = patientCapacity * 0.2;

            const countJkn = await antreanModel.countDocuments({
                jenispasien: "JKN",
                kodepoli,
                kodedokter,
                tanggalperiksa,
                jampraktek,
                status: { $nin: [99] },
            });
            const sisakuotajkn = kuotajkn - (countJkn + 1);

            const countNonJkn = await antreanModel.countDocuments({
                jenispasien: "NON JKN",
                kodepoli,
                kodedokter,
                tanggalperiksa,
                jampraktek,
                status: { $nin: [99] },
            });
            const sisakuotanonjkn = kuotanonjkn - (countNonJkn + 1);

            const keterangan = "Peserta harap 60 menit lebih awal guna pencatatan administrasi.";

            // Prepare data for antrean
            const dataAntrean = {
                kodebooking,
                jenispasien,
                nomorkartu,
                nik,
                nohp,
                kodepoli,
                namapoli,
                pasienbaru,
                norm,
                tanggalperiksa,
                kodedokter,
                namadokter,
                jampraktek,
                jeniskunjungan,
                nomorreferensi,
                nomorantrean,
                angkaantrean,
                estimasidilayani,
                sisakuotajkn,
                kuotajkn,
                sisakuotanonjkn,
                kuotanonjkn,
                keterangan,
                jenisresep,
            };

            if (jenispasien === 'JKN') {

                const dataFarmasi = {
                    kodebooking: dataAntrean.kodebooking,
                    jenisresep: dataAntrean.jenisresep,
                    nomorantrean: dataAntrean.nomorantrean,
                    keterangan: dataAntrean.jenisresep
                }

                const { headers } = generateHeaders();
                const tambahAntreanBpjs = await axios.post(
                    `${process.env.BASEURL}antrean/farmasi/add`,
                    dataFarmasi,
                    { headers }
                );

                if (tambahAntreanBpjs.data.metadata.code !== 200) {
                    return res.status(400).json({
                        metadata: { code: 201, message: tambahAntreanBpjs.data.metadata.message },
                    });
                }
            }


            const addAntrean = new antreanModel(dataAntrean);
            await addAntrean.save();

            return res.status(200).json({
                response: {
                    nomorantrean,
                    angkaantrean,
                    kodebooking,
                    norm,
                    namapoli,
                    namadokter,
                    estimasidilayani,
                    sisakuotajkn,
                    kuotajkn,
                    sisakuotanonjkn,
                    kuotanonjkn,
                    keterangan,
                },
                metadata: { message: "Ok", code: 200 },
            });
        } catch (error) {
            return res.status(400).json({ metadata: { message: "Error", code: 400 }, error });
        }

    },
    ambilAntreanPoli: async (req, res) => {
        try {


            // const checkPasienBaru = await pasienModel.findOne({
            //     nobpjs: req.body.nomorkartu,
            // });

            // if (!checkPasienBaru) {
            //     return res.status(200).send({
            //         "metadata": {
            //             "message": "Data pasien ini tidak ditemukan, silahkan Melakukan Registrasi Pasien Baru",
            //             "code": 202
            //         }
            //     });
            // }

            const checkAntrean = await antreanModel.findOne({
                nomorkartu: req.body.nomorkartu,
                kodepoli: req.body.kodepoli,
                tanggalperiksa: req.body.tanggalperiksa,
            });

            if (checkAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Nomor Antrean Hanya Dapat Diambil 1 Kali Pada Tanggal Yang Sama",
                        "code": 201
                    }
                });
            }

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const getDataDokter = await axios.get(
                process.env.BASEURL + "ref/dokter/",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );


            const dataDokter = await JSON.parse(
                decryptResponse(getDataDokter.data.response, password)
            );


            const filteredDokter = dataDokter.filter(item => item.kodedokter === req.body.kodedokter);


            const getDataPoli = await axios.get(
                process.env.BASEURL + "jadwaldokter/kodepoli/" + req.body.kodepoli + "/tanggal/" + req.body.tanggalperiksa,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );

            const dataPoli = await JSON.parse(
                decryptResponse(getDataPoli.data.response, password)
            );


            if (getDataPoli.data?.metadata?.code !== 200) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Pendaftaran ke Poli Ini Sedang Tutup",
                        "code": 201
                    }
                });
            }

            const filteredPoli = dataPoli.some(item =>
                item.kodedokter === req.body.kodedokter &&
                item.jadwal === req.body.jampraktek &&
                item.kodesubspesialis === req.body.kodepoli
            );


            if (!filteredPoli) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Jadwal Dokter " + filteredDokter[0].namadokter + " Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya",
                        "code": 201
                    }
                });
            };

            const jadwalTime = dataPoli[0].jadwal;
            const tglperiksa = moment(req.body.tanggalperiksa + " " + jadwalTime, 'YYYY-MM-DD HH:mm');
            const tglnow = moment();

            const jadwalEndTime = moment(jadwalTime.split("-")[1].trim(), 'HH:mm'); // Extract the end time as a moment object


            if (tglperiksa.isBefore(tglnow)) {
                const message = `Pendaftaran Ke Poli ${dataPoli[0].namapoli} Sudah Tutup Jam ${jadwalEndTime.format('HH:mm')}`;
                const metadata = {
                    message,
                    code: 201
                };

                return res.status(200).send({ metadata });
            }

            const noAntrean = await antreanModel.countDocuments({
                kodepoli: req.body.kodepoli,
                tanggalperiksa: req.body.tanggalperiksa
            })



            const jenispasien = req.body.jenispasien;
            const pasienbaru = req.body.pasienbaru;
            const nomorkartu = req.body.nomorkartu;
            const nik = req.body.nik;
            const nohp = req.body.nohp;
            const kodepoli = req.body.kodepoli;
            const tanggalperiksa = req.body.tanggalperiksa;
            const kodedokter = req.body.kodedokter;
            const jampraktek = req.body.jampraktek;
            const jeniskunjungan = req.body.jeniskunjungan;
            const nomorreferensi = req.body.nomorreferensi;
            const nomorantrean = req.body.kodepoli + '-' + (noAntrean + 1);
            const angkaantrean = noAntrean + 1;
            const currentdate = Date.now(); // Assuming currentdate is a timestamp in milliseconds
            const kodebooking = currentdate.toString() + nomorantrean.replace('-', '');
            const norm = req.body.norm; // Set the appropriate value for norm
            const namapoli = dataPoli[0].namapoli;
            const namadokter = filteredDokter[0].namadokter;

            const avgPelayanan = 6
            const menitAntrean = (angkaantrean - 1) * avgPelayanan;
            const startTime = jampraktek.split("-")[0];
            const [jam, menit] = startTime.split(":").map(Number);
            const waktuDilayani = new Date(0, 0, 0, jam, menit + menitAntrean);
            const formattedTime = waktuDilayani.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            });

            const stringDate = tanggalperiksa + " " + formattedTime
            const unixTimestamp = Date.parse(stringDate) / 1000;
            const estimasidilayani = unixTimestamp; // Set the appropriate value for estimasidilayani
            const kuotajkn = 40; // Set the appropriate value for kuotajkn
            const countJkn = await antreanModel.countDocuments({
                nomorkartu: { $nin: [null, ""] },
                tanggalperiksa: req.body.tanggalperiksa
            })
            const sisakuotajkn = kuotajkn - countJkn; // Set the appropriate value for sisakuotajkn
            const kuotanonjkn = 40;
            const countNonJkn = await antreanModel.countDocuments({
                nomorkartu: { $in: [null, ""] },
                tanggalperiksa: req.body.tanggalperiksa
            })
            const sisakuotanonjkn = kuotanonjkn - countNonJkn; // Set the appropriate value for sisakuotanonjkn
            const keterangan = "Peserta harap 60 menit lebih awal guna pencatatan administrasi.";




            const dataAntrean = {
                "kodebooking": kodebooking,
                "jenispasien": jenispasien,
                "nomorkartu": nomorkartu,
                "nik": nik,
                "nohp": nohp,
                "kodepoli": kodepoli,
                "namapoli": namapoli,
                "pasienbaru": pasienbaru,
                "norm": norm,
                "tanggalperiksa": tanggalperiksa,
                "kodedokter": kodedokter,
                "namadokter": namadokter,
                "jampraktek": jampraktek,
                "jeniskunjungan": jeniskunjungan,
                "nomorreferensi": nomorreferensi,
                "nomorantrean": nomorantrean,
                "angkaantrean": angkaantrean,
                "estimasidilayani": estimasidilayani,
                "sisakuotajkn": sisakuotajkn,
                "kuotajkn": kuotajkn,
                "sisakuotanonjkn": sisakuotanonjkn,
                "kuotanonjkn": kuotanonjkn,
                "keterangan": keterangan
            }


            const tambahAntreanBpjs = await axios.post(
                process.env.BASEURL + "antrean/add", dataAntrean,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (tambahAntreanBpjs.data.metadata.code !== 200) {
                return response(400, tambahAntreanBpjs.data.metadata.message, null, res);
            }

            const addAntrean = new antreanModel(dataAntrean);
            await addAntrean.save();

            return res.status(200).send({
                "response": {
                    "nomorantrean": nomorantrean,
                    "angkaantrean": angkaantrean,
                    "kodebooking": kodebooking,
                    "norm": norm,
                    "namapoli": namapoli,
                    "namadokter": namadokter,
                    "estimasidilayani": estimasidilayani,
                    "sisakuotajkn": sisakuotajkn,
                    "kuotajkn": kuotajkn,
                    "sisakuotanonjkn": sisakuotanonjkn,
                    "kuotanonjkn": kuotanonjkn,
                    "keterangan": keterangan
                },
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    sisaAntrean: async (req, res) => {
        try {
            const sudahPelayanan = await antreanAdmisiModel.countDocuments({
                status: 1,
                tanggalperiksa: req.body.tanggalPeriksa
            })

            const belumPelayanan = await antreanAdmisiModel.countDocuments({
                tanggalperiksa: req.body.tanggalPeriksa
            })

            const sisaAntrean = (belumPelayanan - 1) - sudahPelayanan


            return res.status(200).send({
                "response": sisaAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    jadwalDokter: async (req, res) => {
        try {
            const { poli, tanggal } = req.body;
            if (!poli || !tanggal) {
                return res.status(400).json({ error: 'Missing required fields: poli and tanggal' });
            }

            const poliMapping = {
                '079': 'SAR',
                '015': 'INT'
            };
            const resolvedPoli = poliMapping[poli] || poli;

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const getData = await axios.get(
                process.env.BASEURL + "jadwaldokter/kodepoli/" + resolvedPoli + "/tanggal/" + req.body.tanggal,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );


            const jadwalDokter = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": {
                    "jadwal": jadwalDokter,
                },
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    addJadwalOperasi: async (req, res) => {
        try {

            const addJadwalOperasi = new jadwalOperasiModel(req.body)
            await addJadwalOperasi.save();

            return res.status(200).send({
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    searchAntrean: async (req, res) => {
        try {
            // Search for antrean with the provided status
            let dataAntrean = await antreanModel
                .findOne({
                    kodepoli: req.body.kodepoli,
                    kodedokter: req.body.kodedokter,
                    tanggalperiksa: req.body.tanggalperiksa,
                    status: req.body.status,
                })
                .sort({ angkaantrean: 1 });

            // If no antrean found with the provided status, search with status 0
            if (!dataAntrean) {
                dataAntrean = await antreanModel
                    .findOne({
                        kodepoli: req.body.kodepoli,
                        kodedokter: req.body.kodedokter,
                        tanggalperiksa: req.body.tanggalperiksa,
                        status: 0,
                    })
                    .sort({ angkaantrean: -1 });
            }

            // Respond with the found antrean or an empty response if none found
            return res.status(200).send({
                response: dataAntrean || null,
                metadata: {
                    message: "Ok",
                    code: 200,
                },
            });
        } catch (error) {
            return res.status(400).send({
                metadata: {
                    message: "Error occurred while searching antrean",
                    code: 400,
                },
                error: error.message,
            });
        }
    },

    searchPasien: async (req, res) => {
        try {

            const dataAntrean = await pasienModel.findOne({
                norm: req.body.norm,
            })


            return res.status(200).send({
                "response": dataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    searchPasienNokartu: async (req, res) => {
        try {

            const dataAntrean = await pasienModel.findOne({
                nobpjs: req.body.nokartu,
            })


            return res.status(200).send({
                "response": dataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    searchAntreanNokartu: async (req, res) => {
        try {

            const dataAntrean = await antreanModel.findOne({
                nomorkartu: req.body.nomorkartu,
                tanggalperiksa: req.body.tanggalperiksa,
            })


            return res.status(200).send({
                "response": dataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    allPoli: async (req, res) => {
        try {


            const dataAntrean = await antreanModel.find({ tanggalperiksa: req.body.tanggalperiksa, kodepoli: { $nin: ['ADM', 'FAR'] } }).sort({ kodepoli: 1, angkaantrean: 1 })

            return res.status(200).send({
                "response": dataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    allAdmFar: async (req, res) => {
        try {

            const dataAntrean = await antreanModel.find({ tanggalperiksa: req.body.tanggalperiksa, kodepoli: { $in: ['ADM', 'FAR'] } }).sort({ kodepoli: 1, angkaantrean: 1 })

            return res.status(200).send({
                "response": dataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    updateWaktu: async (req, res) => {
        try {


            if (req.body.jenispasien === 'JKN') {

                const dateSkrg = Date.now();
                const tmStamp = Math.floor(dateSkrg / 1000);
                const data = process.env.CONSID + "&" + tmStamp;
                const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
                var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
                var encodedSigna = Buffer.from(signa).toString("base64");

                function decryptResponse(string, key) {
                    var key_hash = crypto.createHash("sha256").update(key).digest();
                    var iv = key_hash.slice(0, 16);
                    var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                    var output =
                        decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                    let response = lz.decompressFromEncodedURIComponent(output);
                    return response;
                }

                const dataAntrean = {
                    "kodebooking": req.body.kodebooking,
                    "taskid": req.body.taskid,
                    "waktu": req.body.waktu
                }


                const updateTaskid = await axios.post(
                    process.env.BASEURL + "antrean/updatewaktu", dataAntrean,
                    {
                        headers: {
                            "x-cons-id": process.env.CONSID,
                            "x-timestamp": tmStamp,
                            "x-signature": encodedSigna,
                            user_key: process.env.USERKEY,
                        }
                    }
                );


                if (updateTaskid.data.metadata.code !== 200) {
                    return res.status(400).send({
                        "metadata": {
                            "message": updateTaskid.data.metadata.message,
                            "code": 400
                        }
                    });
                }

            }

            // const getDataAntrean = await antreanModel.findOne({ kodebooking: req.body.kodebooking }).sort({ _id: -1 })
            // getDataAntrean.status = req.body.taskid

            await antreanModel.updateMany({ kodebooking: req.body.kodebooking }, { $set: { status: req.body.taskid, updatedAt: moment().format('YYYY-MM-DD HH:mm:ss') } })
            // await getDataAntrean.save()
            var io = req.app.get("socketio");
            const sendIo = await io.emit("antrean-farmasi", 'Ada antrean baru');

            return res.status(200).send({
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {


            return response(400, "error", error, res);
        }
    },
    jadwalOperasi: async (req, res) => {
        try {

            const tanggalString = req.body.tahun + '-' + req.body.bulan

            const getDataAntrean = await jadwalOperasiModel.aggregate([
                {
                    $match: {
                        tanggaloperasi: { $regex: tanggalString, $options: "i" },
                    },
                },
                {
                    $lookup: {
                        from: "pasiens", // Replace with the actual collection name
                        localField: "nopeserta", // Field from jadwalOperasiModel
                        foreignField: "nobpjs", // Field from the pasiens collection
                        as: "pasiensData",
                    },
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);



            return res.status(200).send({
                "response": getDataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    jadwalOperasiPasien: async (req, res) => {
        try {

            const getDataAntrean = await jadwalOperasiModel.aggregate([
                {
                    $match: {
                        nopeserta: req.body.nopeserta,
                    },
                },
                {
                    $lookup: {
                        from: "pasiens", // Replace with the actual collection name
                        localField: "nopeserta", // Field from jadwalOperasiModel
                        foreignField: "nobpjs", // Field from the pasiens collection
                        as: "pasiensData",
                    },
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);



            return res.status(200).send({
                "response": getDataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    updateJadwalOperasi: async (req, res) => {
        try {

            const getDataOperasi = await jadwalOperasiModel.findOne({ kodebooking: req.body.kodebooking })
            getDataOperasi.terlaksana = 1
            getDataOperasi.lastupdate = moment().unix() * 1000
            await getDataOperasi.save()

            return res.status(200).send({
                "response": getDataOperasi,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    getBatalAntrean: async (req, res) => {
        try {

            const getDataAntrean = await antreanModel.aggregate([
                {
                    $match: {
                        kodepoli: req.body.kodepoli,
                        status: 99,
                    },
                },
                {
                    $lookup: {
                        from: "pasiens", // Replace with the actual collection name
                        localField: "nomorkartu", // Field from jadwalOperasiModel
                        foreignField: "nobpjs", // Field from the pasiens collection
                        as: "pasiensData",
                    },
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);


            return res.status(200).send({
                "response": getDataAntrean,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    ketersediaanTempatTidur: async (req, res) => {
        try {

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const getDataKamar = await axios.get(
                process.env.APLICAREURL + "rest/bed/read/0101R009/1/100",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );


            if (getDataKamar.data.metadata.code !== 1) {
                return res.status(201).send({
                    "metadata": {
                        "message": getDataKamar.data.metadata.message,
                        "code": 200
                    }
                });
            }



            return res.status(200).send({
                "response": getDataKamar.data.response.list,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    refKelas: async (req, res) => {
        try {

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const getDataKamar = await axios.get(
                process.env.APLICAREURL + "rest/ref/kelas",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );


            if (getDataKamar.data.metadata.code !== 1) {
                return res.status(201).send({
                    "metadata": {
                        "message": getDataKamar.data.metadata.message,
                        "code": 200
                    }
                });
            }



            return res.status(200).send({
                "response": getDataKamar.data.response.list,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    tambahTempatTidur: async (req, res) => {
        try {

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const dataTempatTidur = {
                "kodekelas": req.body.kodekelas,
                "koderuang": req.body.koderuang,
                "namaruang": req.body.namaruang,
                "kapasitas": req.body.kapasitas,
                "tersedia": req.body.tersedia,
                "tersediapria": req.body.tersediapria,
                "tersediawanita": req.body.tersediawanita,
                "tersediapriawanita": req.body.tersediapriawanita
            }

            const getDataKamar = await axios.post(
                process.env.APLICAREURL + "rest/bed/create/0101R009", dataTempatTidur,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );


            if (getDataKamar.data.metadata.code !== 1) {
                return res.status(201).send({
                    "metadata": {
                        "message": getDataKamar.data.metadata.message,
                        "code": 200
                    }
                });
            }



            return res.status(200).send({
                "response": getDataKamar.data.metadata.message,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    updateTempatTidur: async (req, res) => {
        try {

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const dataTempatTidur = {
                "kodekelas": req.body.kodekelas,
                "koderuang": req.body.koderuang,
                "namaruang": req.body.namaruang,
                "kapasitas": req.body.kapasitas,
                "tersedia": req.body.tersedia,
                "tersediapria": req.body.tersediapria,
                "tersediawanita": req.body.tersediawanita,
                "tersediapriawanita": req.body.tersediapriawanita
            }

            const getDataKamar = await axios.post(
                process.env.APLICAREURL + "rest/bed/update/0101R009", dataTempatTidur,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );


            if (getDataKamar.data.metadata.code !== 1) {
                return res.status(201).send({
                    "metadata": {
                        "message": getDataKamar.data.metadata.message,
                        "code": 200
                    }
                });
            }



            return res.status(200).send({
                "response": getDataKamar.data.metadata.message,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    deleteTempatTidur: async (req, res) => {
        try {

            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            function decryptResponse(string, key) {
                var key_hash = crypto.createHash("sha256").update(key).digest();
                var iv = key_hash.slice(0, 16);
                var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                var output =
                    decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                let response = lz.decompressFromEncodedURIComponent(output);
                return response;
            }

            const dataTempatTidur = {
                "kodekelas": req.body.kodekelas,
                "koderuang": req.body.koderuang,
            }

            const getDataKamar = await axios.post(
                process.env.APLICAREURL + "rest/bed/delete/0101R009", dataTempatTidur,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );


            if (getDataKamar.data.metadata.code !== 1) {
                return res.status(201).send({
                    "metadata": {
                        "message": getDataKamar.data.metadata.message,
                        "code": 200
                    }
                });
            }

            return res.status(200).send({
                "metadata": {
                    "message": getDataKamar.data.metadata.message,
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
};
