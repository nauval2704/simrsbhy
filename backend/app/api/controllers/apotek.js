const distributorModel = require("../models/distributor");
const gudangModel = require("../models/gudang");
const jenisSediaannModel = require("../models/gudangJenisSediaan");
const satuanModel = require("../models/gudangSatuan");
const kategoriModel = require("../models/gudangKategori");
const obatModel = require("../models/gudangObat");
const bhpModel = require("../models/gudangBhp");
const alkesModel = require("../models/gudangAlkes");
const stockApotekModel = require("../models/stockApotek");
const stockIgdModel = require("../models/stockIgd");
const stockInapModel = require("../models/stockInap");
const stockLuarModel = require("../models/stock/obatLuar");
const logsObatModel = require("../models/logsObat");
const requestApotekModel = require("../models/requestApotek");
var moment = require("moment");
var mongoose = require("mongoose");
const gudangObat = require("../models/gudangObat");
const gudangBhp = require("../models/gudangBhp");
const gudangAlkes = require("../models/gudangAlkes");
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  getdaftarItemsByKategori: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await stockApotekModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
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

        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get stock",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  getdaftarItemsInapByKategori: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await stockInapModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
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

        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get stock",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  getdaftarItemsIgdByKategori: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await stockIgdModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
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

        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get stock",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  getdaftarItemsGudangByKategori: async (req, res) => {
    try {
      let kategori = req.params.kategori;
      if (kategori) {
        const getItems = await gudangModel.aggregate([
          { $match: { kategori: kategori, jumlah: { $gt: 0 } } },
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

        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get stock",
        data: null,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  addRequestApotekFromIgd: async (req, res) => {
    try {
      if (req.body) {
        const addItems = new requestApotekModel({
          items: req.body,
          unit: "IGD",
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        });
        await addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Add request apotek sukses",
          data: addItems,
        });
      }
      return res.status(200).send(null);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  getRekapRequestApotek: async (req, res) => {
    try {
      const getItem = await requestApotekModel
        .find({
          $or: [
            {
              createdAt: {
                $gte: req.params.start,
                $lte: req.params.end + " 59:59:59",
              },
            },
            {
              status: 0,
            },
          ],
        })
        .sort({ createdAt: -1 });
      if (getItem.length == 0) {
        return res.status(200).send(null);
      }
      return res.status(200).send(getItem);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get faktur",
        data: null,
      });
    }
  },
  getRequestApotek: async (req, res) => {
    try {
      if (req.body) {
        const getItems = await requestApotekModel
          .find({ status: 0 })
          .sort({ createdAt: 1 });
        if (getItems.length == 0) {
          return res.status(200).send(null);
        }
        return res.status(200).send(getItems);
      }
      return res.status(200).send(null);
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error get Satuan",
        data: null,
      });
    }
  },
  requestApotekBatal: async (req, res) => {
    try {
      if (req.body) {
        const addItems = await requestApotekModel.findOne({
          _id: req.body.id,
        });
        addItems.status = 3;
        addItems.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        addItems.save();
        return res.status(200).send({
          status: "success",
          message: "Remove request gudang sukses",
          data: addItems,
        });
      }
      return res.status(200).send(null);
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  requestApotekSelesai: async (req, res) => {
    try {
      if (req.body) {
        for (let index = 0; index < req.body.items.length; index++) {
          const element = await req.body.items[index];
          const item = await element;
          // TODO setiap obat findone dari gudang
          const findItem = await stockApotekModel
            .findOneAndUpdate(
              { nama: item.nama, noFaktur: item.noFaktur },
              {
                $inc: { jumlah: -item.jumlah },
                updatedAt: moment().format("YYYY-MM-DD HH:mm:ss"),
              },
              {
                new: true,
              }
            )
            .sort({ createdAt: 1 });

          // TODO insert obat tersebut ke stockApotek
          const addStockIgd = await new stockIgdModel({
            idObat: findItem._id,
            noFaktur: findItem.noFaktur,
            tglFaktur: findItem.tglFaktur,
            distributor: findItem.distributor,
            kategori: findItem.kategori,
            batch: findItem.batch,
            nama: findItem.nama,
            satuan: findItem.satuan,
            jenis: findItem.jenis,
            jumlah: item.jumlah,
            hargaBeli: findItem.hargaBeli,
            hargaSatuan: findItem.hargaSatuan,
            hargaJualBPJS: findItem.hargaJualBPJS,
            hargaJualYANKES: findItem.hargaJualYANKES,
            createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
          });
          addStockIgd.save();
          // TODO update requset apotek
        }
        const updateRequestIgd = await requestApotekModel.findById(
          req.body._id
        );
        updateRequestIgd.status = 1;
        updateRequestIgd.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        updateRequestIgd.save();
        return res.status(200).send({
          status: "success",
          message: "Add request gudang sukses",
          data: null,
        });
      }
      return res.status(200).send({
        status: "success",
        message: "Add request apotek sukses",
        data: null,
      });
    } catch (error) {
      if (error.name === "MongoError" && error.code === 11000) {
        return res.status(400).send({
          error: error,
          status: "error",
          message: "Satuan sudah terdaftar",
          data: null,
        });
      }
      return res.status(400).send({
        error: error,
        status: "error",
        message: "error add Satuan",
        data: null,
      });
    }
  },
  ambilStockIgd: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockIgdModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Check if stock quantity is sufficient
      if (stock.jumlah < jumlah) {
        return res.status(400).send({
          status: "error",
          message: "Insufficient stock quantity",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockIgdModel.findByIdAndUpdate(id, {
        $inc: { jumlah: -jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "ambilStockIgd",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  tambahStockIgd: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockIgdModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockIgdModel.findByIdAndUpdate(id, {
        $inc: { jumlah: +jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "tambahStockIgd",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  ambilStockInap: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockInapModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Check if stock quantity is sufficient
      if (stock.jumlah < jumlah) {
        return res.status(400).send({
          status: "error",
          message: "Insufficient stock quantity",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockInapModel.findByIdAndUpdate(id, {
        $inc: { jumlah: -jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "ambilStockInap",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  tambahStockInap: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockInapModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockInapModel.findByIdAndUpdate(id, {
        $inc: { jumlah: +jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "tambahStockInap",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  ambilStockApotek: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockApotekModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Check if stock quantity is sufficient
      if (stock.jumlah < jumlah) {
        return res.status(400).send({
          status: "error",
          message: "Insufficient stock quantity",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockApotekModel.findByIdAndUpdate(id, {
        $inc: { jumlah: -jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "ambilStockApotek",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  tambahStockApotek: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockApotekModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockApotekModel.findByIdAndUpdate(id, {
        $inc: { jumlah: +jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "tambahStockApotek",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  ambilStockGudang: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await gudangModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Check if stock quantity is sufficient
      if (stock.jumlah < jumlah) {
        return res.status(400).send({
          status: "error",
          message: "Insufficient stock quantity",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await gudangModel.findByIdAndUpdate(id, {
        $inc: { jumlah: -jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "ambilStockGudang",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  tambahStockGudang: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await gudangModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await gudangModel.findByIdAndUpdate(id, {
        $inc: { jumlah: +jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "tambahStockGudang",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  ambilStockLuar: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockLuarModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      // Check if stock quantity is sufficient
      if (stock.jumlah < jumlah) {
        return res.status(400).send({
          status: "error",
          message: "Insufficient stock quantity",
          data: null,
        });
      }

      // Update stock quantity atomically
      const updatedStock = await stockLuarModel.findByIdAndUpdate(id, {
        $inc: { jumlah: -jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "ambilStockLuar",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  tambahStockLuar: async (req, res) => {
    try {
      const { depo, id, jumlah, keterangan, user } = req.body;
      // Validate request body
      if (!id || !jumlah || typeof jumlah !== 'number') {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      // Find stock by ID
      const stock = await stockLuarModel.findById(id);

      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }


      // Update stock quantity atomically
      const updatedStock = await stockLuarModel.findByIdAndUpdate(id, {
        $inc: { jumlah: +jumlah } // Decrease jumlah by the requested amount
      }, { new: true });

      // Insert req.body into logs model
      const logEntry = new logsObatModel({
        depo: depo,
        stockId: id,
        quantity: jumlah,
        action: "tambahStockLuar",
        keterangan: keterangan,
        user: user
      });
      await logEntry.save();

      return res.status(200).send({
        status: "success",
        message: "Stock successfully updated",
        data: updatedStock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
  logsObat: async (req, res) => {
    try {
      const { tanggal, depo } = req.body;
      const startOfDayUnix = moment(tanggal, 'YYYY-MM-DD').startOf('day').unix() * 1000;
      const endOfDayUnix = moment(tanggal, 'YYYY-MM-DD').endOf('day').unix() * 1000;
      let pipeline = [];
      let collection;

      // Validate request body
      if (!tanggal || !depo) {
        return res.status(400).send({
          status: "error",
          message: "Invalid request body",
          data: null,
        });
      }

      switch (depo) {
        case 'igd':
          collection = 'stockigds';
          break;
        case 'inap':
          collection = 'stockinaps';
          break;
        case 'apotek':
          collection = 'stockapoteks';
          break;
        case 'gudang':
          collection = 'gudangs';
          break;
        case 'luar':
          collection = 'obatluars';
          break;
      }

      if (collection) {
        pipeline = [
          {
            $match: {
              createdAt: { $gte: startOfDayUnix, $lte: endOfDayUnix },
              depo: depo
            }
          },
          {
            $lookup: {
              from: collection,
              localField: "stockId",
              foreignField: "_id",
              as: "dataObat",
            },
          },
          {
            $unwind: '$dataObat',
          },
          {
            $lookup: {
              from: "distributors",
              localField: "dataObat.distributor",
              foreignField: "_id",
              as: "dataDistributor",
            },
          },
          {
            $unwind: '$dataDistributor',
          }
        ];
      }

      // Find stock tanggal and depo
      const stock = await logsObatModel.aggregate(pipeline);


      // If stock not found
      if (!stock) {
        return res.status(404).send({
          status: "error",
          message: "Stock not found",
          data: null,
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Stock successfully loaded",
        data: stock,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Internal server error",
        error: error.message,
        data: null,
      });
    }
  },
};
