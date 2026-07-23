const requestGudangModel = require("../models/requestGudang");
const requestApotekModel = require("../models/requestApotek");
const gudangObat = require("../models/gudangObat");
const gudangBhp = require("../models/gudangBhp");
const gudangAlkes = require("../models/gudangAlkes");
const stockApotek = require("../models/stockApotek");
const stockIgd = require("../models/stockIgd");
const stockInap = require("../models/stockInap");
const ResepModel = require("../models/resep");
const MarginModel = require("../models/margin");
const CheckinModel = require("../models/checkin");
const rincianFarmasiModel = require("../models/rincianFarmasi");
var moment = require("moment");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const resep = require('./farmasi_modules/resep');
const stok = require('./farmasi_modules/stok');
const laporan = require('./farmasi_modules/laporan');
const misc = require('./farmasi_modules/misc');

module.exports = {
  ...resep,
  ...stok,
  ...laporan,
  ...misc,
};
