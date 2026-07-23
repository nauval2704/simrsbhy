const requestGudangModel = require("../../models/requestGudang");
const requestApotekModel = require("../../models/requestApotek");
const gudangObat = require("../../models/gudangObat");
const gudangBhp = require("../../models/gudangBhp");
const gudangAlkes = require("../../models/gudangAlkes");
const stockApotek = require("../../models/stockApotek");
const stockIgd = require("../../models/stockIgd");
const stockInap = require("../../models/stockInap");
const ResepModel = require("../../models/resep");
const MarginModel = require("../../models/margin");
const CheckinModel = require("../../models/checkin");
const rincianFarmasiModel = require("../../models/rincianFarmasi");
var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


module.exports = {
  addResep: async (req, res) => {
    try {
      const addResep = await new ResepModel({
        noCheckin: req.body.noCheckin,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        user: req.body.user,
      });

      addResep.save();
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: addResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  getResepByNoCheckin: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.find({
        noCheckin: req.body.noCheckin,
      });
      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di tambah",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: error ? error.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  deleteResep: async (req, res) => {
    try {
      const delResep = await ResepModel.deleteOne({
        _id: ObjectId(req.body._id._id),
      });

      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di hapus",
        data: delResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  deletObatResep: async (req, res) => {
    try {
        let nama=''; 
        let sumberstok='';
      if (req.body.jenisObat === "RACIKAN") {
            req.body.dataObat.nama.forEach(async (element) => { 
            nama=element.nama;//+' resepid: '+req.body.resepId; 
             const getDataObatv = await ResepModel.aggregate([
                {
                  $match: {
                    noCheckin: req.body.noCheckin,
                    _id: ObjectId(req.body.resepId),
                    "obat.namaobat":element.nama,
                   // "obat.nama": { $regex: "(?i).*" + element.nama + ".*" },
                   // "obat.nama":element.nama,
                  },
                },
                {
                  $project: {
                    obat: {
                      $filter: {
                        input: "$obat",
                        as: "ob",
                        cond: {
                          $eq: ["$$ob.namaobat", element.nama],
                        },
                      },
                    },
                  },
        
                }, 
              ]);

              const obatArray1 = await getDataObatv[0].obat;
              obatArray1.forEach(async (elementv) => {
                sumberstok=elementv.sumberStock; 
                if (elementv.sumberStock === "IGD") {
                  const findItem = await stockIgd
                    .findOneAndUpdate(
                      { nama:nama, noFaktur: elementv.noFaktur },
                      {
                        $inc: { jumlah: +elementv.jumlah },
                        updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                      },
                      {
                        new: true,
                      }
                    )
                    .sort({ createdAt: 1 });
                }
                if (elementv.sumberStock === "APOTEK") {
                    const findItem = await stockApotek
                      .findOneAndUpdate(
                        { nama: nama, noFaktur: elementv.noFaktur },
                        {
                          $inc: { jumlah: +elementv.jumlah },
                          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        {
                          new: true,
                        }
                      )
                      .sort({ createdAt: 1 });
                  }
                  if (elementv.sumberStock === "INAP") {
                    const findItem = await stockInap
                      .findOneAndUpdate(
                        { nama: nama, noFaktur: elementv.noFaktur },
                        {
                          $inc: { jumlah: +elementv.jumlah },
                          updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
                        },
                        {
                          new: true,
                        }
                      )
                      .sort({ createdAt: 1 });
                  }

            });  

            const findItem = await stockApotek
            .findOneAndUpdate(
              {
                nama: { $regex: "(?i).*" + element.nama + ".*" },
                noFaktur: element.noFaktur,
              },
              {
                $inc: { jumlah: +1 },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              { 
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          const deleteDataObatResep = await ResepModel.updateOne(
            {
              noCheckin: req.body.noCheckin,
              _id: ObjectId(req.body.resepId),
              "obat.nama": { $regex: "(?i).*" + element.nama + ".*" },
            },
            {
              $pull: {
                obat: { nama: { $regex: "(?i).*" + element.nama + ".*" } },
              },
            }
          );
        });

        return res.status(200).send({
          status: "success",
          message: "Resep berhasil di hapus",
          data:'',// obatArray1,
          dataobat:'',//getDataObatv,   
          namaobat:nama, 
          sumberstok:sumberstok, 
        });
      } 

      /** end racikan  */
        const getDataObat = await ResepModel.aggregate([
            {
              $match: { 
                noCheckin: req.body.noCheckin,
                _id: ObjectId(req.body.resepId),
                "obat.nama":req.body.dataObat.nama,
              },
            },
            {
              $project: {
                obat: {
                  $filter: {
                    input: "$obat", 
                    as: "ob",
                    cond: {
                      $eq: ["$$ob.nama", req.body.dataObat.nama],
                    },
                  },
                },
              },
    
            }, 
          ]);
      

        /*const getDataObat = await ResepModel.aggregate([
            {
              $match: {
                noCheckin: req.body.noCheckin,
                _id: ObjectId(req.body.resepId),
                "obat.nama":req.body.dataObat.nama,
              },
            },
            {
              $project: {
                obat: {
                  $filter: {
                    input: "$obat",
                    as: "ob",
                    cond: {
                      $eq: ["$$ob.nama", req.body.dataObat.nama],
                    },
                  },
                },
              },
    
            }, 
          ]); */ 
     
      

      const obatArray = await getDataObat[0].obat;

      obatArray.forEach(async (element) => {
        if (element.sumberStock === "IGD") {
          const findItem = await stockIgd
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
        if (element.sumberStock === "INAP") {
          const findItem = await stockInap
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
        if (element.sumberStock === "APOTEK") {
          const findItem = await stockApotek
            .findOneAndUpdate(
              { nama: element.nama, noFaktur: element.noFaktur },
              {
                $inc: { jumlah: +element.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }
      });
 
        const deleteDataObatResep = await ResepModel.updateOne(
            {
              noCheckin: req.body.noCheckin,
              _id: ObjectId(req.body.resepId),
              "obat.nama": req.body.dataObat.nama,
            },
            { $pull: { obat: { nama: req.body.dataObat.nama } } }
          ); 
 

      return res.status(200).send({
        status: "success",
        message: "Resep berhasil di hapus",
        data: getDataObat,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "", 
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  inputResep: async (req, res) => {
    try {
      const item = req.body.dataObat;
      let findItem;

      if (item.sumberStock === "IGD") {
        findItem = await stockIgd
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      } else if (item.sumberStock === "INAP") {
        findItem = await stockInap
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      } else {
        findItem = await stockApotek
          .findOneAndUpdate(
            { _id: item.idObat },
            {
              $inc: { jumlah: -item.qty },
              updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
            },
            { new: true }
          )
          .sort({ createdAt: 1 });
      }

      const getResep = await ResepModel.findById(
        ObjectId(req.body.dataResep._id)
      );
      const obatData = {
        idObat: findItem._id,
        noFaktur: findItem.noFaktur,
        tglFaktur: findItem.tglFaktur,
        distributor: findItem.distributor,
        kategori: findItem.kategori,
        batch: findItem.batch,
        nama: findItem.nama,
        expired: findItem.expired,
        satuan: findItem.satuan,
        jenis: findItem.jenis,
        jenisObat: item.jenisObat,
        takaran: item.takaran,
        quantity: item.quantity,
        kapan: item.kapan,
        jam: item.jam,
        deskripsi: item.deskripsi,
        jumlah: item.qty,
        hargaBeli: findItem.hargaBeli,
        hargaSatuan: findItem.hargaSatuan,
        hargaJualBPJS: findItem.hargaJualBPJS,
        hargaJualYANKES: findItem.hargaJualYANKES,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        noCheckin: req.body.dataResep.noCheckin,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
      };

      getResep.obat.push(obatData);
      await getResep.save();

      return res.status(200).send({
        status: "success",
        message: "Obat berhasil ditambahkan",
        data: req.body,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "Terjadi kesalahan saat menambahkan obat",
        data: null,
      });
    }
  },
  inputResepRacikan: async (req, res) => {
    try {
      const item = await req.body.dataObat;

      const getCabar = await CheckinModel.findOne({
        noCheckin: req.body.dataResep.noCheckin,
      });

      const getMargin = await MarginModel.findOne({});

      var cabar = getCabar.cabar;

      const namaObat = [];
      let jumlah = 0;
      let hargaBeli = 0;
      let hargaSatuan = 0;
      let hargaJualBPJS = 0;
      let hargaJualYANKES = 0;
      let namaobat="";

      for (let index = 0; index < req.body.dataRacikan.length; index++) {
        const element = req.body.dataRacikan[index];
        let findItem;
        if (item.sumberStock === "IGD") {
          findItem = await stockIgd
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        } else if (item.sumberStock === "INAP") {
          findItem = await stockInap
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        } else {
          findItem = await stockApotek
            .findOneAndUpdate(
              { _id: element.idObat },
              {
                $inc: { jumlah: -element.qty },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });
        }


        hargaBeli += findItem.hargaBeli;
        hargaSatuan += findItem.hargaSatuan;
        hargaJualBPJS += findItem.hargaJualBPJS * element.qty;
        hargaJualYANKES += findItem.hargaJualYANKES * element.qty;
        jumlah += element.qty;
        namaobat=element.nama; 
        if (cabar == "UMUM") {
          let jumlah =
            findItem.hargaJualBPJS +
            (findItem.hargaJualBPJS * getMargin.marginUmum) / 100;

          namaObat.push(
            element.nama +
            " | Jumlah: " +
            element.qty +
            " | Satuan: " +
            findItem.satuan +
            " | Harga: " +
            (element.qty * findItem.hargaJualYANKES).toLocaleString()
          );
        } else {
          let jumlah =
            findItem.hargaJualYANKES +
            (findItem.hargaJualBPJS * getMargin.marginBpjsYankes) / 100;

          namaObat.push(
            element.nama +
            " | Jumlah: " +
            element.qty +
            " | Satuan: " +
            findItem.satuan +
            " | Harga: " +
            (element.qty * findItem.hargaJualBPJS).toLocaleString()
          );
        }
      }

      const getResep = await ResepModel.findById(
        ObjectId(req.body.dataResep._id)
      );

      /* idObat: "",
        noFaktur: "", 
        tglFaktur: "",
        distributor: "", */ 

      getResep.obat.push({
        idObat:"",
        noFaktur: req.body.dataObat.noFaktur,
        tglFaktur: "",
        distributor: req.body.dataObat.distributor,
        kategori: "OBAT",
        batch: "",
        nama: namaObat,
        namaobat:namaobat, 
        expired: "",
        satuan: "",
        jenis: "RACIKAN",
        jenisObat: req.body.dataObat.jenisObat,
        takaran: req.body.dataObat.takaran,
        quantity: req.body.dataObat.quantity,
        kapan: req.body.dataObat.kapan,
        jam: req.body.dataObat.jam,
        deskripsi: req.body.dataObat.deskripsi,
        jumlah: jumlah,
        hargaBeli: hargaBeli, 
        hargaSatuan: hargaSatuan,
        hargaJualBPJS: hargaJualBPJS,
        hargaJualYANKES: hargaJualYANKES,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        noCheckin: req.body.dataResep.noCheckin,
        sumberStock: req.body.dataObat.sumberStock,
        user: req.body.user,
      });
      await getResep.save();

      return res.status(200).send({
        status: "success",
        message: "Obat berhasil di tambah",
        data: req.body,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
  detailResep: async (req, res) => {
    try {
      const getDetailResep = await ResepModel.aggregate([
        { $match: { _id: ObjectId(req.body._id) } },
        { $sort: { "obat.nama": 1 } },
        { $unwind: "$obat" },
        {
          $group: {
            _id: { _id: "$_id", nama: "$obat.nama" },
            count: { $sum: "$obat.jumlah" },
            subtotalBPJS: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualBPJS",
                  { $multiply: ["$obat.hargaJualBPJS", "$obat.jumlah"] }, //hargaJualBPJS
                ],
              },
            },
            subtotalYANKES: {
              $sum: {
                $cond: [
                  { $eq: ["$obat.jenis", "RACIKAN"] },
                  "$obat.hargaJualYANKES", //hargaJualYANKES
                  { $multiply: ["$obat.hargaJualYANKES", "$obat.jumlah"] }, //hargaJualYANKES
                ],
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id._id",
            obat: {
              $push: {
                nama: "$_id.nama", 
                count: "$count",
                subtotalBPJS: "$subtotalBPJS",
                subtotalYANKES: "$subtotalYANKES",
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            obat: 1,
            grandTotalBPJS: { $sum: "$obat.subtotalBPJS" },
            grandTotalYANKES: { $sum: "$obat.subtotalYANKES" },
          },
        },
      ]);

      return res.status(200).send({
        status: "success",
        message: "ok.",
        data: getDetailResep,
      });
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error add distributor",
        data: null,
      });
    }
  },
};
