const response =require("../../../config/response");
const userModel = require("../models/users");
const pasienModel = require("../models/pasien");
const antreanModel = require("../models/antreans");
const taskIdModel = require("../models/modelantrian/taskid");
const jadwalOperasiRsModel = require("../models/modelantrian/jadwalOperasi");
const dokterModel = require("../models/modelantrian/dokter");
const poliModel = require("../models/modelantrian/poli");
const antreanFarmasiModel = require("../models/modelantrian/antreanFarmasi");
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
    statusAntrean: async (req, res) => {
        try {
            const { kodepoli, kodedokter, tanggalperiksa, jampraktek } = req.body;
            const username = req.headers["x-username"];

            // Validate user
            //const tglPeriksa = moment(`${req.body.tanggalperiksa}`, 'YYYY-MM-DD');
            const user = await userModel.findOne({ username });
            if (!user) {
                return res.status(200).send({
                    metadata: {
                        message: "Username atau Password Tidak Sesuai",
                        code: 201,
                    },
                });
            } 
            /*if(req.body.tanggalperiksa!=tglPeriksa){
                return res.status(200).send({
                    metadata: {
                        message: "Format Tanggal Tidak Sesuai, format yang benar adalah yyyy-mm-dd",
                        code: 201,
                    },
                });
            }*/ 
            let jadwalDokter = [];
            let filteredDokter = null;

            // Fetch doctor schedule if kodepoli is not ADM or FAR
            if (kodepoli !== "ADM" && kodepoli !== "FAR") {
                const timestamp = Math.floor(Date.now() / 1000);
                const data = `${process.env.CONSID}&${timestamp}`;
                const password = `${process.env.CONSID}${process.env.SECRETKEY}${timestamp}`;
                const signature = crypto
                    .createHmac("sha256", process.env.SECRETKEY)
                    .update(data)
                    .digest("base64");

                const decryptResponse = (string, key) => {
                    const keyHash = crypto.createHash("sha256").update(key).digest();
                    const iv = keyHash.slice(0, 16);
                    const decipher = crypto.createDecipheriv("aes-256-cbc", keyHash, iv);
                    const decrypted = decipher.update(string, "base64", "utf8") + decipher.final("utf8");
                    return lz.decompressFromEncodedURIComponent(decrypted);
                };

                const fetchData = async (url) => {
                    try {
                        const response = await axios.get(url, {
                            headers: {
                                "x-cons-id": process.env.CONSID,
                                "x-timestamp": timestamp,
                                "x-signature": signature,
                                user_key: process.env.USERKEY,
                            },
                        });

                        if (response.data?.metadata?.code !== 200) {
                            return null;
                        }
                        return JSON.parse(decryptResponse(response.data.response, password));
                    } catch (error) {
                        return null;
                    }
                };

                const jadwalDokterUrl = `${process.env.BASEURL}jadwaldokter/kodepoli/${kodepoli}/tanggal/${tanggalperiksa}`;
                jadwalDokter = await fetchData(jadwalDokterUrl);

                filteredDokter = jadwalDokter?.find(
                    (dokter) => dokter.kodedokter === kodedokter && dokter.jadwal === jampraktek
                );
                const dateSkrg = Date.now();
                const now = new Date();
const formatter = new Intl.DateTimeFormat('en-CA', { // 'en-CA' produces YYYY-MM-DD
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

const formattedDate = formatter.format(now);
console.log(formattedDate); // Output: "202X-MM-DD"
                if(req.body.tanggalperiksa < formattedDate){
                    return res.status(200).send({
                        metadata: { message: "Tanggal Periksa Tidak Berlaku", code: 201 },
                    });
                }

                if (!filteredDokter) {
                    return res.status(200).send({
                        metadata: { message: "Poli tidak ditemukan "+formattedDate, code: 201 },
                    });
                }
            }

            const commonFilters = { kodepoli, kodedokter, tanggalperiksa, jampraktek };
            const kapasitasPasien = filteredDokter?.kapasitaspasien ?? 40;
            const kuotajkn = Math.ceil(kapasitasPasien * 0.8);
            const kuotanonjkn = Math.floor(kapasitasPasien * 0.2);

            const [
                totalAntrean,
                belumDipanggil,
                countJkn,
                countNonJkn,
                antreanPanggil,
            ] = await Promise.all([
                antreanModel.countDocuments({ ...commonFilters, status: { $nin: [99] } }),
                antreanModel.countDocuments({ ...commonFilters, status: 0 }),
                antreanModel.countDocuments({ ...commonFilters, jenispasien: "JKN", status: { $nin: [99] } }),
                antreanModel.countDocuments({ ...commonFilters, jenispasien: "NON JKN", status: { $nin: [99] } }),
                antreanModel.findOne({ ...commonFilters, status: 1 }).sort({ angkaantrean: -1 }),
            ]);

            const sisaKuotaJkn = Math.max(kuotajkn - countJkn, 0);
            const sisaKuotaNonJkn = Math.max(kuotanonjkn - countNonJkn, 0);

            return res.status(200).send({
                response: {
                    namapoli: filteredDokter?.namasubspesialis ?? (req.body.kodepoli === 'ADM' ? 'Admisi' : 'Farmasi'),
                    namadokter: filteredDokter?.namadokter ?? "-",
                    totalantrean: totalAntrean,
                    sisaantrean: belumDipanggil,
                    antreanpanggil: antreanPanggil?.nomorantrean ?? "-",
                    sisakuotajkn: sisaKuotaJkn,
                    kuotajkn,
                    sisakuotanonjkn: sisaKuotaNonJkn,
                    kuotanonjkn,
                    keterangan: "",
                },
                metadata: {
                    message: "Ok",
                    code: 200,
                },
            });
        } catch (error) {
            return res.status(400).send({
                metadata: {
                    message: "Terjadi kesalahan",
                    code: 400,
                },
                error: error.message,
            });
        }
    },
    ambilAntrean: async (req, res) => {

        let jadwalDokter = [];
        let filteredDokter = [];
        let dataPoli = [];
        let filteredData = [];
        let noAntrean = 0;
        let sisaAntrean = 0;
        let tambahAntreanBpjs = null;

        // Reusable function for generating headers
        const generateHeaders = () => {
            const dateSkrg = Date.now();
            const tmStamp = Math.floor(dateSkrg / 1000);
            const data = process.env.CONSID + "&" + tmStamp;
            const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
            var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
            var encodedSigna = Buffer.from(signa).toString("base64");

            return {
                headers: {
                    "x-cons-id": process.env.CONSID,
                    "x-timestamp": tmStamp,
                    "x-signature": encodedSigna,
                    user_key: process.env.USERKEY,
                },
                password,
            };
        };

        // Reusable function to decrypt API response
        const decryptResponse = (string, key) => {
            const keyHash = crypto.createHash('sha256').update(key).digest();
            const iv = keyHash.slice(0, 16);
            const decoder = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
            const output = decoder.update(string, 'base64', 'utf8') + decoder.final('utf8');
            return JSON.parse(lz.decompressFromEncodedURIComponent(output));
        };



        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const checkPasienBaru = await pasienModel.findOne({
                nik: req.body.nik,
            });

            if (!checkPasienBaru) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Data pasien ini tidak ditemukan, silahkan Melakukan Registrasi Pasien Baru",
                        "code": 202
                    }
                });
            }

            if (req.body.kodepoli !== 'ADM' && req.body.kodepoli !== 'FAR') {
                // Check for existing antrean
                const existingAntrean = await antreanModel.findOne({
                    nomorkartu: req.body.nomorkartu,
                    kodepoli: req.body.kodepoli,
                    tanggalperiksa: req.body.tanggalperiksa,
                    status: { $nin: [99] },
                });

                if (existingAntrean) {
                    return res.status(200).send({
                        metadata: {
                            message: "Nomor Antrean Hanya Dapat Diambil 1 Kali Pada Tanggal Yang Sama",
                            code: 201,
                        },
                    });
                }

                // Generate headers
                const { headers, password } = generateHeaders();

                // Fetch jadwal dokter
                const jadwalResponse = await axios.get(
                    `${process.env.BASEURL}jadwaldokter/kodepoli/${req.body.kodepoli}/tanggal/${req.body.tanggalperiksa}`,
                    { headers }
                );
                if (jadwalResponse.data?.metadata?.code !== 200) {
                    return res.status(200).send({
                        metadata: {
                            message: "Pendaftaran ke Poli Ini Sedang Tutup",
                            code: 201,
                        },
                    });
                }
                jadwalDokter = decryptResponse(jadwalResponse.data.response, password);

                // Fetch and filter dokter data
                const dokterResponse = await axios.get(`${process.env.BASEURL}ref/dokter/`, { headers });
                const dokterData = decryptResponse(dokterResponse.data.response, password);
                filteredDokter = dokterData.filter(item => item.kodedokter === req.body.kodedokter);

                // Fetch poli data
                const poliResponse = await axios.get(
                    `${process.env.BASEURL}jadwaldokter/kodepoli/${req.body.kodepoli}/tanggal/${req.body.tanggalperiksa}`,
                    { headers }
                );
                if (poliResponse.data?.metadata?.code !== 200) {
                    return res.status(200).send({
                        metadata: {
                            message: "Pendaftaran ke Poli Ini Sedang Tutup",
                            code: 201,
                        },
                    });
                }
                dataPoli = decryptResponse(poliResponse.data.response, password);

                // Check if the schedule is still open
                const jadwalTime = dataPoli[0].jadwal;
                const jadwalEndTime = moment(jadwalTime.split("-")[1].trim(), 'HH:mm');
                const tglPeriksa = moment(`${req.body.tanggalperiksa} ${jadwalEndTime.format('HH:mm')}`, 'YYYY-MM-DD HH:mm');
                const tglNow = moment();

                if (tglPeriksa.isBefore(tglNow)) {
                    const message = `Pendaftaran Ke Poli ${dataPoli[0].namapoli} Sudah Tutup Jam ${jadwalEndTime.format('HH:mm')}`;
                    return res.status(200).send({
                        metadata: {
                            message,
                            code: 201,
                        },
                    });
                }

                const filteredPoli = dataPoli.some(item =>
                    item.kodedokter === req.body.kodedokter &&
                    item.jadwal === req.body.jampraktek &&
                    item.kodepoli === req.body.kodepoli
                );

                if (!filteredPoli) {
                    return res.status(200).send({
                        "metadata": {
                            "message": "Jadwal Dokter " + filteredDokter[0].namadokter + " Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya",
                            "code": 201
                        }
                    });
                };
                filteredData = dataPoli.filter(item => item.kodedokter === req.body.kodedokter);


                if (req.body.sumber === 'SIMRS') {

                    tambahAntreanBpjs = await axios.post(
                        process.env.BASEURL + "antrean/add", dataAntrean,
                        { headers }
                    );

                    if (tambahAntreanBpjs.data.metadata.code !== 200) {
                        return res.status(400).json({
                            code: 201,
                            message: tambahAntreanBpjs.data.metadata.message
                        });
                    }
                }
            }


            noAntrean = await antreanModel.countDocuments({
                kodepoli: filteredData[0]?.kodesubspesialis ?? req.body.kodepoli,
                tanggalperiksa: req.body.tanggalperiksa,
            })

            sisaAntrean = await antreanModel.countDocuments({
                kodepoli: filteredData[0]?.kodesubspesialis ?? req.body.kodepoli,
                tanggalperiksa: req.body.tanggalperiksa,
                status: 0,
            })

            const jenispasien = req.body.jenispasien ?? 'JKN';
            const pasienbaru = req.body.pasienbaru ?? 0;
            const nomorkartu = req.body.nomorkartu;
            const nik = req.body.nik;
            const nohp = checkPasienBaru.notelp;
            const tanggalperiksa = req.body.tanggalperiksa;
            const kodedokter = req.body.kodedokter;
            const jampraktek = req.body.jampraktek;
            const jeniskunjungan = req.body.jeniskunjungan;
            const nomorreferensi = req.body.nomorreferensi;
            const nomorantrean = filteredData[0]?.kodesubspesialis ?? req.body.kodepoli + '-' + (noAntrean + 1);
            const angkaantrean = noAntrean + 1;
            const currentdate = Date.now(); // Assuming currentdate is a timestamp in milliseconds
            const kodebooking = currentdate.toString() + nomorantrean.replace('-', '');
            const norm = checkPasienBaru.norm; // Set the appropriate value for norm
            const namapoli = dataPoli[0]?.namapoli ?? req.body.kodepoli === 'ADM' ? 'ADMISI' : 'FARMASI';
            const namadokter = filteredDokter[0]?.namadokter ?? '-';

            const avgPelayanan = 6
            const menitAntrean = sisaAntrean * avgPelayanan;
            const startTime = jampraktek.split("-")[0];
            const [jam, menit] = startTime.split(":").map(Number);
            const waktuDilayani = new Date(0, 0, 0, jam, menit + menitAntrean);
            const formattedTime = waktuDilayani.toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            });

            const stringDate = `${tanggalperiksa} ${formattedTime}`;
            const stringDatePraktek = `${tanggalperiksa} ${startTime}`;
            const stringDateNow = moment().format('YYYY-MM-DD HH:mm');
            const stringDateCurrent = moment(); // Current date and time

            const updatedDate = stringDateCurrent.clone().add(menitAntrean, 'minutes');
            const stringDateCurrentNow = updatedDate.format('YYYY-MM-DD HH:mm');


            let estimasidilayani;
            let estimasi;
            if (moment(stringDateNow).isAfter(moment(stringDatePraktek))) {
                estimasi = new Date(stringDateCurrentNow);
                estimasidilayani = estimasi.getTime();
            } else {
                estimasi = new Date(stringDate);
                estimasidilayani = estimasi.getTime();
            }

            const kuotajkn = (jadwalDokter[0]?.kapasitaspasien ?? 40) * 0.8; // Set the appropriate value for kuotajkn
            const countJkn = await antreanModel.countDocuments({
                jenispasien: 'JKN',
                kodepoli: filteredData[0]?.kodesubspesialis ?? req.body.kodepoli,
                kodedokter: req.body.kodedokter,
                tanggalperiksa: req.body.tanggalperiksa,
                jampraktek: req.body.jampraktek,
                status: { $nin: [99] }
            })
            const sisakuotajkn = kuotajkn - (countJkn === 0 ? 1 : countJkn + 1); // Set the appropriate value for sisakuotajkn
            const kuotanonjkn = (jadwalDokter[0]?.kapasitaspasien ?? 40) * 0.2;
            const countNonJkn = await antreanModel.countDocuments({
                jenispasien: 'NON JKN',
                kodepoli: filteredData[0]?.kodesubspesialis ?? req.body.kodepoli,
                kodedokter: req.body.kodedokter,
                tanggalperiksa: req.body.tanggalperiksa,
                jampraktek: req.body.jampraktek,
                status: { $nin: [99] }
            })
            const sisakuotanonjkn = kuotanonjkn - (countNonJkn === 0 ? countNonJkn : countNonJkn + 1); // Set the appropriate value for sisakuotanonjkn
            const keterangan = "Peserta harap 60 menit lebih awal guna pencatatan administrasi.";

            const dataAntrean = {
                "kodebooking": kodebooking,
                "jenispasien": jenispasien,
                "nomorkartu": nomorkartu,
                "nik": nik,
                "nohp": nohp,
                "kodepoli": filteredData[0]?.kodesubspesialis ?? req.body.kodepoli,
                "namapoli": filteredData[0]?.kodesubspesialis ?? (req.body.kodepoli === 'ADM' ? 'ADMISI' : 'FARMASI'),
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
    ambilantreanlimit: async (req, res) => {
        // Helper function to generate headers for external API calls
        const generateHeaders = () => {
            const timestamp = Math.floor(Date.now() / 1000);
            const data = `${process.env.CONSID}&${timestamp}`;
            const password = process.env.CONSID + process.env.SECRETKEY + timestamp;
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
                password,
            };
        };

        const decryptResponse = (string, key) => {
            const keyHash = crypto.createHash('sha256').update(key).digest();
            const iv = keyHash.slice(0, 16);
            const decoder = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
            const output = decoder.update(string, 'base64', 'utf8') + decoder.final('utf8');
            return JSON.parse(lz.decompressFromEncodedURIComponent(output));
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
            const {
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
                sumber,
            } = req.body;
            const { headers, password } = generateHeaders();




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
            const kodebooking = `${Date.now()}${nomorantrean.replace("-", "")}`;

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
            };

            const existingAntrean = await antreanModel.findOne({
                nik,
                kodepoli,
                tanggalperiksa,
                status: { $nin: [99] },
            });


            const today = new Date();
            today.setDate(today.getDate() + 30);
            const datePlusSevenDays = today.toISOString().split('T')[0];
            if (tanggalperiksa > datePlusSevenDays) {
                return res.status(200).send({
                    metadata: {
                        message: "Tidak Dapat Mengambil antran, Batas Limit hari 30 hari dari tgl saat ini",
                        code: 201,
                    },
                });
            } 

            if (existingAntrean) {
                return res.status(200).send({
                    metadata: {
                        message: "Nomor Antrean Hanya Dapat Diambil 1 Kali Pada Tanggal Yang Sama",
                        code: 201,
                    },
                });
            }


            // Validate from mjkn
            if (!sumber) {

                dataAntrean.jenispasien = 'JKN'

                const getPoli = await poliModel.findOne({ kdsubspesialis: kodepoli });
                dataAntrean.namapoli = getPoli.nmsubspesialis;
                dataAntrean.pasienbaru = 0

                const getDokter = await dokterModel.findOne({ kodedokter: kodedokter });
                dataAntrean.namadokter = getDokter.namadokter;

                const user = await userModel.findOne({ username: req.headers["x-username"] });
                if (!user) {
                    return res.status(200).json({
                        metadata: { message: "Username atau Password Tidak Sesuai", code: 201 },
                    });
                }
                const checkPasienBaru = await pasienModel.findOne({ nik });
                if (!checkPasienBaru) {
                    return res.status(200).json({
                        metadata: {
                            message: "Data pasien tidak ditemukan, silahkan registrasi baru.",
                            code: 202,
                        },
                    });
                }

                const checkJadwalPoli = await axios.get(
                    `${process.env.BASEURL}jadwaldokter/kodepoli/${getPoli.kdpoli}/tanggal/${req.body.tanggalperiksa}`,
                    { headers }
                );


                if (checkJadwalPoli.data.metadata.code !== 200) {
                    return res.status(200).json({
                        metadata: {
                            message: "Pendaftaran ke Poli Ini Sedang Tutup",
                            code: 201,
                        },
                    });
                }

                const listPoli = decryptResponse(checkJadwalPoli.data.response, password);


                const filteredPoli = listPoli.find(item =>
                    item.kodedokter === kodedokter &&
                    item.jadwal === jampraktek &&
                    item.kodesubspesialis === kodepoli
                );


                if (!filteredPoli) {
                    return res.status(200).send({
                        "metadata": {
                            "message": "Jadwal Dokter " + getDokter.namadokter + " Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya",
                            "code": 201
                        }
                    });
                };

                const [startTime, endTime] = filteredPoli.jadwal.split(" - ");
                const currentTime = moment();

                // Parse the end time into a moment object for comparison
                const endMoment = moment(endTime, "HH:mm");

                if (currentTime.isAfter(endMoment)) {
                    return res.status(200).send({
                        metadata: {
                            message: `Pendaftaran Ke Poli ${filteredPoli.namasubspesialis} Sudah Tutup Jam ${endTime}`,
                            code: 201,
                        },
                    });
                }


            }


            if (sumber === 'SIMRS' && jenispasien === 'JKN') {

                const tambahAntreanBpjs = await axios.post(
                    `${process.env.BASEURL}antrean/add`,
                    dataAntrean,
                    { headers }
                );


                if (tambahAntreanBpjs.data.metadata.code !== 200) {
                    return res.status(400).json({
                        metadata: { code: 201, message: tambahAntreanBpjs.data.metadata.message },
                    });
                }
            }


            // Save antrean
            const addAntrean = new antreanModel(dataAntrean);
            await addAntrean.save();

            return res.status(200).json({
                response: {
                    nomorantrean: dataAntrean.nomorantrean,
                    angkaantrean: dataAntrean.angkaantrean,
                    kodebooking: dataAntrean.kodebooking,
                    norm: dataAntrean.norm,
                    namapoli: dataAntrean.namapoli,
                    namadokter: dataAntrean.namadokter,
                    estimasidilayani: dataAntrean.estimasidilayani,
                    sisakuotajkn: dataAntrean.sisakuotajkn,
                    kuotajkn: dataAntrean.kuotajkn,
                    sisakuotanonjkn: sisakuotanonjkn,
                    kuotanonjkn: dataAntrean.kuotanonjkn,
                    keterangan: dataAntrean.keterangan,
                   // responbpjs: tambahAntreanBpjs.data.metadata.message, 
                },
                metadata: { message: "Ok", code: 200 },
            });
        } catch (error) {
            return res.status(400).json({ metadata: { message: "Error", code: 400 }, error });
        }
    },

    ambilAntrean2: async (req, res) => {
        // Helper function to generate headers for external API calls
        const generateHeaders = () => {
            const timestamp = Math.floor(Date.now() / 1000);
            const data = `${process.env.CONSID}&${timestamp}`;
            const password = process.env.CONSID + process.env.SECRETKEY + timestamp;
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
                password,
            };
        };

        const decryptResponse = (string, key) => {
            const keyHash = crypto.createHash('sha256').update(key).digest();
            const iv = keyHash.slice(0, 16);
            const decoder = crypto.createDecipheriv('aes-256-cbc', keyHash, iv);
            const output = decoder.update(string, 'base64', 'utf8') + decoder.final('utf8');
            return JSON.parse(lz.decompressFromEncodedURIComponent(output));
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
            const {
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
                sumber,
            } = req.body;
            const { headers, password } = generateHeaders();




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
            const kodebooking = `${Date.now()}${nomorantrean.replace("-", "")}`;

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
            };

            const existingAntrean = await antreanModel.findOne({
                nik,
                kodepoli,
                tanggalperiksa,
                status: { $nin: [99] },
            });



            if (existingAntrean) {
                return res.status(200).send({
                    metadata: {
                        message: "Nomor Antrean Hanya Dapat Diambil 1 Kali Pada Tanggal Yang Sama",
                        code: 201,
                    },
                });
            }


            // Validate from mjkn
            if (!sumber) {

                dataAntrean.jenispasien = 'JKN'

                const getPoli = await poliModel.findOne({ kdsubspesialis: kodepoli });
                dataAntrean.namapoli = getPoli.nmsubspesialis;
                dataAntrean.pasienbaru = 0

                const getDokter = await dokterModel.findOne({ kodedokter: kodedokter });
                dataAntrean.namadokter = getDokter.namadokter;

                const user = await userModel.findOne({ username: req.headers["x-username"] });
                if (!user) {
                    return res.status(200).json({
                        metadata: { message: "Username atau Password Tidak Sesuai", code: 201 },
                    });
                }
                const checkPasienBaru = await pasienModel.findOne({ nik });
                if (!checkPasienBaru) {
                    return res.status(200).json({
                        metadata: {
                            message: "Data pasien tidak ditemukan, silahkan registrasi baru.",
                            code: 202,
                        },
                    });
                }

                const checkJadwalPoli = await axios.get(
                    `${process.env.BASEURL}jadwaldokter/kodepoli/${getPoli.kdpoli}/tanggal/${req.body.tanggalperiksa}`,
                    { headers }
                );


                if (checkJadwalPoli.data.metadata.code !== 200) {
                    return res.status(200).json({
                        metadata: {
                            message: "Pendaftaran ke Poli Ini Sedang Tutup",
                            code: 201,
                        },
                    });
                }

                const listPoli = decryptResponse(checkJadwalPoli.data.response, password);


                const filteredPoli = listPoli.find(item =>
                    item.kodedokter === kodedokter &&
                    item.jadwal === jampraktek &&
                    item.kodesubspesialis === kodepoli
                );


                if (!filteredPoli) {
                    return res.status(200).send({
                        "metadata": {
                            "message": "Jadwal Dokter " + getDokter.namadokter + " Tersebut Belum Tersedia, Silahkan Reschedule Tanggal dan Jam Praktek Lainnya",
                            "code": 201
                        }
                    });
                };

                const [startTime, endTime] = filteredPoli.jadwal.split(" - ");
                const currentTime = moment();

                // Parse the end time into a moment object for comparison
                const endMoment = moment(endTime, "HH:mm");

                if (currentTime.isAfter(endMoment)) {
                    return res.status(200).send({
                        metadata: {
                            message: `Pendaftaran Ke Poli ${filteredPoli.namasubspesialis} Sudah Tutup Jam ${endTime}`,
                            code: 201,
                        },
                    });
                }


            }


            if (sumber === 'SIMRS' && jenispasien === 'JKN') {

                const tambahAntreanBpjs = await axios.post(
                    `${process.env.BASEURL}antrean/add`,
                    dataAntrean,
                    { headers }
                );


                if (tambahAntreanBpjs.data.metadata.code !== 200) {
                    return res.status(400).json({
                        metadata: { code: 201, message: tambahAntreanBpjs.data.metadata.message },
                    });
                }
            }


            // Save antrean
            const addAntrean = new antreanModel(dataAntrean);
            await addAntrean.save();

            return res.status(200).json({
                response: {
                    nomorantrean: dataAntrean.nomorantrean,
                    angkaantrean: dataAntrean.angkaantrean,
                    kodebooking: dataAntrean.kodebooking,
                    norm: dataAntrean.norm,
                    namapoli: dataAntrean.namapoli,
                    namadokter: dataAntrean.namadokter,
                    estimasidilayani: dataAntrean.estimasidilayani,
                    sisakuotajkn: dataAntrean.sisakuotajkn,
                    kuotajkn: dataAntrean.kuotajkn,
                    sisakuotanonjkn: sisakuotanonjkn,
                    kuotanonjkn: dataAntrean.kuotanonjkn,
                    keterangan: dataAntrean.keterangan,
                   // responbpjs: tambahAntreanBpjs.data.metadata.message, 
                },
                metadata: { message: "Ok", code: 200 },
            });
        } catch (error) {
            return res.status(400).json({ metadata: { message: "Error", code: 400 }, error });
        }
    },
    jadwalDokter: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "jadwaldokter/kodepoli/" + req.body.poli + "/tanggal/" + req.body.tanggal,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Pendaftaran ke Poli Ini Sedang Tutup",
                        "code": 201
                    }
                });
            }


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
    sisaAntrean: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const getDataAntrean = await antreanModel.findOne({
                kodebooking: req.body.kodebooking,
                status: { $nin: [99] },
            })

            if (!getDataAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan",
                        "code": 201
                    }
                });
            }

            // Consolidate the count and find queries into a single aggregate pipeline
            const aggregateResult = await antreanModel.aggregate([
                {
                    $match: {
                        kodepoli: getDataAntrean.kodepoli,
                        kodedokter: getDataAntrean.kodedokter,
                        tanggalperiksa: getDataAntrean.tanggalperiksa,
                        jampraktek: getDataAntrean.jampraktek,
                        status: { $nin: [99] },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalantrean: { $sum: 1 },
                        sudahdipanggil: {
                            $sum: { $cond: [{ $ne: ["$status", 0] }, 1, 0] },
                        },
                    },
                },
            ]);

            const { totalantrean = 0, sudahdipanggil = 0 } = aggregateResult[0] || {};

            // Find the latest antreanpanggil with status 1
            const antreanpanggil = await antreanModel.findOne({
                kodepoli: getDataAntrean.kodepoli,
                kodedokter: getDataAntrean.kodedokter,
                tanggalperiksa: getDataAntrean.tanggalperiksa,
                jampraktek: getDataAntrean.jampraktek,
                status: 1,
            }).sort({ angkaantrean: -1 });

            // Calculate remaining antrean and waiting time
            const sisaantrean = totalantrean > sudahdipanggil ? totalantrean - sudahdipanggil : 0;
            const waktuTunggu = sisaantrean > 0 ? 6 * 60 * (sisaantrean - 1) : 0;

            // Return the response with the calculated data
            return res.status(200).send({
                response: {
                    nomorantrean: getDataAntrean.nomorantrean,
                    namapoli: getDataAntrean.namapoli,
                    namadokter: getDataAntrean.namadokter,
                    sisaantrean,
                    antreanpanggil: antreanpanggil?.nomorantrean ?? "-",
                    waktutunggu: waktuTunggu,
                    keterangan: "",
                },
                metadata: {
                    message: "Ok",
                    code: 200,
                },
            });

        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    batalAntrean: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const getDataAntrean = await antreanModel.findOne({
                kodebooking: req.body.kodebooking,
            }).sort({ _id: -1 })


            if (!getDataAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan",
                        "code": 201
                    }
                });
            }


            if (getDataAntrean.status === 99) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan atau Sudah Dibatalkan",
                        "code": 201
                    }
                });
            }

            if (getDataAntrean.status > 1) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Pasien Sudah Dilayani, Antrean Tidak Dapat Dibatalkan",
                        "code": 201
                    }
                });
            }

            const tglperiksa = moment(getDataAntrean.tanggalperiksa);
            const tglnow = moment().format('YYYY-MM-DD');
            // const tglnow = moment().format('2023-09-25');


            if (tglperiksa.isBefore(tglnow)) {
                const message = "Antrean Tidak Ditemukan"
                const metadata = {
                    message,
                    code: 201
                };

                return res.status(200).send({ metadata });
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

            // Convert the local date to a Unix timestamp in milliseconds
            const unixTimestampMilliseconds = moment().unix() * 1000;

            const dataAntrean = {
                "kodebooking": req.body.kodebooking,
                "taskid": 99,
                "waktu": unixTimestampMilliseconds
            }


            const updateTaskid99 = await axios.post(
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


            getDataAntrean.status = 99
            getDataAntrean.keterangan = req.body.keterangan
            await getDataAntrean.save()

            // var io = req.app.get("socketio");
            // const sendIo = await io.emit("panggilanBaru", 'Ada antrean baru');

            if (getDataAntrean.jenispeserta === 'JKN') {
                if (updateTaskid99.data.metadata.code !== 200) {
                    return res.status(200).send({
                        "metadata": {
                            "message": updateTaskid99.data.metadata.message,
                            "code": 201
                        }
                    });
                }
            }


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
    checkIn: async (req, res) => {
     
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const getDataAntrean = await antreanModel.findOne({
                kodebooking: req.body.kodebooking,
            })




            if (!getDataAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan",
                        "code": 201
                    }
                });
            }


            if (getDataAntrean.status === 99) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan atau Sudah Dibatalkan",
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

            const dataAntrean = {
                "kodebooking": req.body.kodebooking,
                "taskid": 3,
                "waktu": req.body.waktu
            }

            const updateAntrean = await antreanModel.findOne({ kodebooking: req.body.kodebooking })
            updateAntrean.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
            await updateAntrean.save()


            const updateTaskid3 = await axios.post(
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


            if (updateTaskid3.data.metadata.code !== 200) {
                return res.status(201).send({
                    "metadata": {
                        "message":pdateTaskid3.data.metadata.message,
                        "code": 200
                    }
                });
            }

            // var io = req.app.get("socketio");
            // const sendIo = await io.emit("panggilanBaru", 'Ada antrean baru');


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
    pasienBaru: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            if (req.body.nomorkartu.length >=1 && req.body.nomorkartu.length <= 12) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Format nomor kartu tidak sesuai",
                        "code": 201
                    }
                });
            }
            if (req.body.nik.length >=1 && req.body.nik.length < 16) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Format NIK tidak sesuai",
                        "code": 201
                    }
                });
            }
            if (req.body.nik.length ==0 ||  req.body.nik== null || req.body.nik=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "  NIK Belum anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.nomorkartu.length >  13) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Format nomor kartu tidak sesuai",
                        "code": 201
                    }
                });
            }

            if (req.body.nomorkartu.length ==0 || req.body.nomorkartu==null || req.body.nomorkartu=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Nomor Kartu belum anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.nama==null || req.body.nama=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Nama belum anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.nomorkk==null || req.body.nomorkk=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Nomor KK belum anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.alamat==null || req.body.alamat=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "alamat belum anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.kodeprop==null || req.body.kodeprop=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Propinsi Belum anda pilih",
                        "code": 201
                    }
                });
            }
            if (req.body.namaprop==null || req.body.namaprop=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Nama Propinsi Belum anda isi",
                        "code": 201
                    }
                });
            }


            if (req.body.jeniskelamin==null || req.body.jeniskelamin=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Jenis Kelamin Belum Anda Pilih",
                        "code": 201
                    }
                });
            }
            if (req.body.kodedati2==null || req.body.kodedati2=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Kode Dati 2 Belum Anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.namadati2==null || req.body.namadati2=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": " Dati 2 Belum Anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.kodekec==null || req.body.kodekec=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Kode Kecamatan  Belum Anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.namakec==null || req.body.namakec=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": " Kecamatan  Belum Anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.tanggallahir==null || req.body.tanggallahir=="") {
                return res.status(200).send({
                    "metadata": {
                        "message": "Tanggal Lahir Tidak sesuai",
                        "code": 201
                    }
                });
            }
            if (req.body.kodekel==null || req.body.kodekel=="") {
                return res.status(200).send({
                    "metadata": {
                        "message":"Kode Kelurahan  Belum Anda isi",
                        "code": 201
                    }
                });
            }
            if (req.body.namakel==null || req.body.namakel=="") {
                return res.status(200).send({
                    "metadata": {
                        "message":" Kelurahan  Belum Anda isi",
                        "code": 201
                    }
                });
            }
            
            

            const checknokartu = await pasienModel.findOne({ nobpjs: req.body.nomorkartu })

            if (checknokartu) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Pasien Sudah terdaftar",
                        "code": 201
                    }
                });
            }

            const cariNorm = await pasienModel.findOne({})
                .select({ _id: 0, norm: 1 })
                .sort({ norm: -1 });
            if (cariNorm) {
                var norm = Number(cariNorm.norm) + 1;
            } else {
                var norm = 1;
            }
            var normwithzero = "000000" + norm;
            const dateTime = moment().format("YYYY-MM-DD HH:mm:ss.SSS000");
            var tglInput = dateTime;
            const carinorm = await pasienModel.find({
                norm: normwithzero.slice(-6),
            });
            if (carinorm.length > 0) {
                return res.status(404).send({
                    error: 400,
                    status: "error",
                    message: "ERROR_NORM",
                    data: null,
                });
            }

            const daftarBaru = new pasienModel({
                norm: normwithzero.slice(-6),
                nama: req.body.nama,
                nik: req.body.nik,
                nobpjs: req.body.nomorkartu,
                notelp: req.body.nohp,
                tempatlahir: "",
                tgllahir: req.body.tanggallahir,
                sex: req.body.jeniskelamin,
                agama: "-",
                tglinput: tglInput,
                alamat: req.body.alamat,
                propinsi: req.body.namaprop,
                kabupaten: req.body.namadati2,
                kecamatan: req.body.namakec,
                user: 'antrean BPJS',
            });
            await daftarBaru.save();

            return res.status(200).send({
                "response": {
                    "norm": normwithzero.slice(-6)
                },
                "metadata": {
                    "message": "Harap datang ke admisi untuk melengkapi data rekam medis",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    jadwalOperasiRs: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const start = moment(req.body.tanggalawal);
            const end = moment(req.body.tanggalakhir);


            if (end.isBefore(start)) {
                const message = "Tanggal Akhir Tidak Boleh Lebih Kecil dari Tanggal Awal"
                const metadata = {
                    message,
                    code: 201
                };

                return res.status(200).send({ metadata });
            }

            const getJadwalOperasiRs = await jadwalOperasiRsModel.find({
                tanggaloperasi: {
                    $gte: req.body.tanggalawal,
                    $lte: req.body.tanggalakhir,
                },
            });


            return res.status(200).send({
                "response": {
                    "list": getJadwalOperasiRs
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
    jadwalOperasiPasien: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }


            if (req.body.nopeserta.length !== 13) {
                const message = "No Kartu Tidak Valid. Jumlah nomor kartu adalah 13 digit (Numeric)"
                const metadata = {
                    message,
                    code: 201
                };

                return res.status(200).send({ metadata });
            }

            const getJadwalOperasiRs = await jadwalOperasiRsModel.find({
                nopeserta: req.body.nopeserta,
            });


            return res.status(200).send({
                "response": {
                    "list": getJadwalOperasiRs
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
    ambilAntreanFarmasi: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const checkAntrean = await antreanModel.findOne({
                kodebooking: req.body.kodebooking,
                kodepoli: 'FAR',
                status: { $nin: [99] },
            });

            if (!checkAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Kode Booking tidak ditemukan",
                        "code": 201
                    }
                });
            }


            return res.status(200).send({
                "response": {
                    "jenisresep": checkAntrean.jenisresep,
                    "nomorantrean": checkAntrean.nomorantrean,
                    "keterangan": checkAntrean.keterangan
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
    statusAntreanFarmasi: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const getDataAntreanFarmasi = await antreanModel.findOne({
                kodebooking: req.body.kodebooking,
                kodepoli: 'FAR',
            })

            if (!getDataAntreanFarmasi) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Kode Booking tidak ditemukan",
                        "code": 201
                    }
                });
            }

            const totalantrean = await antreanModel.countDocuments({
                tanggalperiksa: getDataAntreanFarmasi.tanggalperiksa,
                kodepoli: getDataAntreanFarmasi.kodepoli,
                status: { $nin: [99] }
            })

            const sudahdipanggil = await antreanModel.countDocuments({
                tanggalperiksa: getDataAntreanFarmasi.tanggalperiksa,
                kodepoli: getDataAntreanFarmasi.kodepoli,
                status: 6
            })

            const belumdipanggil = await antreanModel.countDocuments({
                tanggalperiksa: getDataAntreanFarmasi.tanggalperiksa,
                kodepoli: getDataAntreanFarmasi.kodepoli,
                status: 5
            })

            const sisaantrean = totalantrean - sudahdipanggil


            const antreanpanggil = await antreanModel.findOne({
                tanggalperiksa: getDataAntreanFarmasi.tanggalperiksa,
                kodepoli: getDataAntreanFarmasi.kodepoli,
                status: 1,
            }).sort({ angkaantrean: -1 })

            return res.status(200).send({
                "response": {
                    "jenisresep": antreanpanggil?.jenisresep ?? getDataAntreanFarmasi?.jenisresep,
                    "totalantrean": totalantrean,
                    "sisaantrean": sisaantrean,
                    "antreanpanggil": antreanpanggil?.nomorantrean ?? getDataAntreanFarmasi?.nomorantrean,
                    "keterangan": ""
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
    referensiPoli: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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


            const getRefPoli = await axios.get(
                process.env.BASEURL + "ref/poli/",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );

            if (getRefPoli.data?.metadata?.code !== 1) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Poli tidak ditemukan",
                        "code": 201
                    }
                });
            }

            const dataPoli = await JSON.parse(
                decryptResponse(getRefPoli.data.response, password)
            );

            if (Array.isArray(dataPoli)) {
                // Use Promise.all for parallel database operations
                await Promise.all(
                    dataPoli.map(async (poli) => {
                        try {
                            await poliModel.updateOne(
                                { kdsubspesialis: poli.kdsubspesialis }, // Match condition
                                {
                                    $set: {
                                        ...poli,
                                        updatedAt: moment().unix(), // Set the updatedAt field to the current timestamp
                                    },
                                },// Update fields (entire object)
                                { upsert: true }  // Insert if not exists
                            );
                        } catch (error) {
                        }
                    })
                );
            } else {
            }


            return res.status(200).send({
                "response": {
                    "list": dataPoli
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
    referensiDokter: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            if (getDataDokter.data?.metadata?.code !== 1) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Poli tidak ditemukan",
                        "code": 201
                    }
                });
            }


            const dataDokter = await JSON.parse(
                decryptResponse(getDataDokter.data.response, password)
            );

            if (Array.isArray(dataDokter)) {
                // Use Promise.all for parallel database operations
                await Promise.all(
                    dataDokter.map(async (dokter) => {
                        try {
                            await dokterModel.updateOne(
                                { kodedokter: dokter.kodedokter }, // Match condition
                                {
                                    $set: {
                                        ...dokter,
                                        updatedAt: moment().unix(), // Set the updatedAt field to the current timestamp
                                    },
                                },// Update fields (entire object)
                                { upsert: true }  // Insert if not exists
                            );
                        } catch (error) {
                        }
                    })
                );
            } else {
            }

            return res.status(200).send({
                "response": {
                    "list": dataDokter
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
    referensiPoliFingerPrint: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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


            const getData = await axios.get(
                process.env.BASEURL + "ref/poli/fp",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );

            if (getData.data?.metadata?.code !== 1) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Poli tidak ditemukan",
                        "code": 201
                    }
                });
            }


            const dataPoliFIngerPrint = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );

            return res.status(200).send({
                "response": {
                    "list": dataPoliFIngerPrint
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
    referensiPasienFingerPrint: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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


            const getData = await axios.get(
                process.env.BASEURL + "ref/pasien/fp/identitas/" + req.body.identitas + "/noidentitas/" + req.body.noidentitas,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );

            if (getData.data?.metadata?.code !== 1) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Poli tidak ditemukan",
                        "code": 201
                    }
                });
            }


            const dataPasienFIngerPrint = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );

            return res.status(200).send({
                "response": {
                    "list": dataPasienFIngerPrint
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
    updateJadwalDokter: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.post(
                process.env.BASEURL + "jadwaldokter/updatejadwaldokter", req.body,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    },
                }
            );


            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }

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
    panggilAntrean: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
                        "code": 201
                    }
                });
            }

            const getDataAntrean = await antreanModel.findOne({
                kodepoli: req.body.kodepoli,
                kodedokter: req.body.kodedokter,
                tanggalperiksa: req.body.tanggalperiksa,
                jampraktek: req.body.jampraktek
            })


            if (!getDataAntrean) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Antrean Tidak Ditemukan",
                        "code": 201
                    }
                });
            }



            const antreanpanggil = await antreanModel.findOne({
                kodepoli: getDataAntrean.kodepoli,
                kodedokter: getDataAntrean.kodedokter,
                tanggalperiksa: getDataAntrean.tanggalperiksa,
                jampraktek: getDataAntrean.jampraktek,
                status: 0,
            }).sort({ angkaantrean: 1 })


            if (!antreanpanggil) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Sisa antrean 0",
                        "code": 201
                    }
                });
            }



            if (req.body.kodepoli !== 'ADM' && req.body.kodepoli !== 'FAR') {

                // antreanpanggil.status = 1
                antreanpanggil.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
                await antreanpanggil.save()


                // const dateSkrg = Date.now();
                // const tmStamp = Math.floor(dateSkrg / 1000);
                // const data = process.env.CONSID + "&" + tmStamp;
                // const password = process.env.CONSID + process.env.SECRETKEY + tmStamp;
                // var signa = crypto.createHmac("sha256", process.env.SECRETKEY).update(data).digest();
                // var encodedSigna = Buffer.from(signa).toString("base64");

                // function decryptResponse(string, key) {
                //     var key_hash = crypto.createHash("sha256").update(key).digest();
                //     var iv = key_hash.slice(0, 16);
                //     var decoder = crypto.createDecipheriv("aes-256-cbc", key_hash, iv);
                //     var output =
                //         decoder.update(string, "base64", "utf8") + decoder.final("utf8");
                //     let response = lz.decompressFromEncodedURIComponent(output);
                //     return response;
                // }

                // const unixWaktu = moment().unix() * 1000

                // const dataAntrean = {
                //     "kodebooking": antreanpanggil?.kodebooking,
                //     "taskid": 4,
                //     "waktu": unixWaktu
                // }


                // const updateTaskid4 = await axios.post(
                //     process.env.BASEURL + "antrean/updatewaktu", dataAntrean,
                //     {
                //         headers: {
                //             "x-cons-id": process.env.CONSID,
                //             "x-timestamp": tmStamp,
                //             "x-signature": encodedSigna,
                //             user_key: process.env.USERKEY,
                //         }
                //     }
                // );


                // if (updateTaskid4.data.metadata.code !== 200) {
                //     return res.status(201).send({
                //         "metadata": {
                //             "message": updateTaskid4.data.metadata.message,
                //             "code": 200
                //         }
                //     });
                // }


                // const task4Timestamp = moment().unix() * 1000;
                // const update = {
                //     $set: { task4: task4Timestamp },
                // };
                // const options = {
                //     upsert: true, // Create a new document if kodebooking doesn't exist
                //     new: true,    // Return the updated document
                // };
                // const query = { kodebooking: getDataAntrean?.kodebooking };
                // const updatedKodebooking = await taskIdModel.findOneAndUpdate(query, update, options);

                var io = req.app.get("socketio");
                const sendIo = await io.emit("panggilanBaru", req.body);

                return res.status(200).send({
                    "metadata": {
                        "message": "Ok",
                        "code": 200
                    }
                });
            }

            // ini adm
            antreanpanggil.status = 1
            antreanpanggil.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
            await antreanpanggil.save()

            var io = req.app.get("socketio");
            const sendIo = await io.emit("panggilanBaru", 'Ada antrean baru');

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
    hadirAntrean: async (req, res) => {
        try {


            const antreanpanggil = await antreanModel.findOne({
                kodepoli: req.body.kodepoli,
                kodedokter: req.body.kodedokter,
                tanggalperiksa: req.body.tanggalperiksa,
                jampraktek: req.body.jampraktek,
                status: 0
            }).sort({ angkaantrean: 1 })




            if (!antreanpanggil) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Sisa antrean 0",
                        "code": 201
                    }
                });
            }


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

                const unixWaktu = moment().unix() * 1000

                const dataAntrean = {
                    "kodebooking": antreanpanggil?.kodebooking,
                    "taskid": 4,
                    "waktu": unixWaktu
                }


                const updateTaskid4 = await axios.post(
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


                if (updateTaskid4.data.metadata.code !== 200) {
                    return res.status(400).send({
                        "metadata": {
                            "message": "Kode booking tidak ditemukan atau Belum Checkin, Silahkan CHECKIN terlebih dahulu",
                            "code": 400
                        }
                    });
                }
            }




            antreanpanggil.status = 1
            antreanpanggil.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
            await antreanpanggil.save()

            var io = req.app.get("socketio");
            const sendIo = await io.emit("antrean-hadir", req.body);

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
    updateWaktu: async (req, res) => {
        try {
            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });

            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            if (req.body.jenisresep = 'tidak ada') {
                const dataAntrean = {
                    "kodebooking": req.body.kodebooking,
                    "taskid": parseInt(req.body.taskid),
                    "waktu": req.body.waktu,
                }

                const updateWaktu = await axios.post(
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


                if (updateWaktu.data?.metadata?.code !== 200) {
                    return res.status(200).send({
                        "metadata": {
                            "message": "Ok",
                            "code": 200
                        }
                         //updateWaktu.data
                    });
                }

                return res.status(200).send({
                    "metadata": {
                        "message": "Ok",
                        "code": 200
                    }
                });
            }

            const dataAntrean = {
                "kodebooking": req.body.kodebooking,
                "taskid": parseInt(req.body.taskid),
                "waktu": req.body.waktu,
                "jenisresep": req.body.jenisresep
            }


            const updateWaktu = await axios.post(
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


            if (updateWaktu.data?.metadata?.code !== 200) {
                return res.status(200).send(updateWaktu.data);
                
            }

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
    listWaktuTaskid: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const dataAntrean = {
                "kodebooking": req.body.kodebooking
            }


            const getData = await axios.post(
                process.env.BASEURL + "antrean/getlisttask", dataAntrean,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            const dataList = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": dataList,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {


            return response(400, "error", error, res);
        }
    },
    dashboardPertanggal: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "dashboard/waktutunggu/tanggal/" + req.body.tanggal + "/waktu/rs",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            // const dataList = await JSON.parse(
            //     decryptResponse(getData.data.response, password)
            // );


            return res.status(200).send({
                "response": getData.data,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    dashboardPerbulan: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "dashboard/waktutunggu/bulan/" + req.body.bulan + "/tahun/" + req.body.tahun + "/waktu/rs",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            // const dataList = await JSON.parse(
            //     decryptResponse(getData.data.response, password)
            // );


            return res.status(200).send({
                "response": getData.data,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    antreanPertanggal: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "antrean/pendaftaran/tanggal/" + req.body.tanggal,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            const dataList = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": dataList,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    antreanPerkodebooking: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "antrean/pendaftaran/kodebooking/" + req.body.kodebooking,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            const dataList = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": dataList,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    antreanBelumdilayani: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "antrean/pendaftaran/aktif",
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            const dataList = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": dataList,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
    antreanBelumdilayaniPer: async (req, res) => {
        try {

            const user = await userModel.findOne({
                username: req.headers["x-username"],
            });


            if (!user) {
                return res.status(200).send({
                    "metadata": {
                        "message": "Username atau Password Tidak Sesuai",
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

            const getData = await axios.get(
                process.env.BASEURL + "antrean/pendaftaran/kodepoli/" + req.body.kodepoli + "/kodedokter/" + parseInt(req.body.kodedokter) + "/hari/" + parseInt(req.body.hari) + "/jampraktek/" + req.body.jampraktek,
                {
                    headers: {
                        "x-cons-id": process.env.CONSID,
                        "x-timestamp": tmStamp,
                        "x-signature": encodedSigna,
                        user_key: process.env.USERKEY,
                    }
                }
            );

            if (getData.data?.metadata?.code !== 200) {
                return res.status(200).send(getData.data);
            }


            const dataList = await JSON.parse(
                decryptResponse(getData.data.response, password)
            );


            return res.status(200).send({
                "response": dataList,
                "metadata": {
                    "message": "Ok",
                    "code": 200
                }
            });
        } catch (error) {
            return response(400, "error", error, res);
        }
    },
};
