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
  getStockApotek: async (req, res) => {
    try {
      const getStockApotek = await stockApotek.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStockApotek);
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  getStockIgd: async (req, res) => {
    try {
      const getStockIgd = await stockIgd.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStockIgd);
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
  getStockInap: async (req, res) => {
    try {
      const getStock = await stockInap.aggregate([
        { $match: { jumlah: { $gt: 0 } } },
        { $sort: { nama: 1, createdAt: 1 } },
        {
          $lookup: {
            from: "distributors",
            localField: "distributor",
            foreignField: "_id",
            as: "dataDistributor",
          },
        },
      ]);
      return res.status(200).send(getStock);
    } catch (error) {
      return res.status(400).send({
        error: "Internal Server Error", raw_error: err ? err.message : "",
        status: "error",
        message: "error get distributor",
        data: null,
      });
    }
  },
};
