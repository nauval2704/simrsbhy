const Pasien = require("../../models/pasien");
const Triase = require("../../models/triase");
const { buildTriageBundle, sendFhirBundle } = require("../../utils/satusehat/fhirMapper");
const Users = require("../../models/users");
const Checkin = require("../../models/checkin");
const Sep = require("../../models/sep");
const Rujukan = require("../../models/rujukan");
const Tarif = require("../../models/tarif");
const Rincian = require("../../models/rincian");
const Nakes = require("../../models/nakes");
const Ruangan = require("../../models/ruangan");
const Faktur = require("../../models/faktur");
const ResepModel = require("../../models/resep");
var moment = require("moment"); // require
const checkin = require("../../models/checkin");
const Prmrj = require("../../models/prmrj");
const EdukasiPoli = require("../../models/edukasiPoli");
const CpptIgd = require("../../models/cpptIgd");
const CpptPoli = require("../../models/cpptPoli");
const RingkasanPulang = require("../../models/ringkasanPulang");
const PemberianObatIgd = require("../../models/pemberianObatIgd");
const PengkajianAwalPoli = require("../../models/pengkajianAwalPoli");
const PengkajianAwalIgd = require("../../models/pengkajianAwalIgd");
const PoliGigi = require("../../models/poliGigi");
var mongoose = require("mongoose");
const { ObjectId } = mongoose.Types.ObjectId;


module.exports = {
  cariDokter: async (req, res) => {
    var term = req.params.term;
    try {
      const cariNorm = await Nakes.find({
        nama: { $regex: "(?i).*" + term + ".*" },
      })
        .sort({ nama: 1 })
        .select({
          _id: 0,
          nama: 1,
        })
        .limit(100)
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_DOKTER",
        data: null,
      });
    }
  },
  hakUser: async (req, res) => {
    var username = req.body.username;
    var role = req.body.role;
    try {
      const checkNorm = await Users.updateOne(
        { username: username },
        { $set: { role: role } }
      );
      if (checkNorm.length > 0) {
        return res.status(404).send({
          error: 400,
          status: "error",
          message: "ERROR_CHECKUSER",
          data: null,
        });
      } else {
        res.json({
          status: "success",
          message: "Hak Akses User Berhasil",
          data: null,
        });
      }
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CHECKUSER",
        data: null,
      });
    }
  },
  cariUser: async (req, res) => {
    const dateSkrg = moment().format("YYYY-MM-DD");
    try {
      const cariNorm = await Users.find({ role: { $nin: "ROLE_ADMIN" } })
        .select({
          _id: 0,
          nama: 1,
          username: 1,
          role: 1,
        })
        .lean();
      res.json(cariNorm);
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_CARI_PASIEN",
        data: null,
      });
    }
  },

  // ==========================
  // SDM Nakes User Management
  // ==========================

  listUnlinkedUsers: async (req, res) => {
    try {
      const users = await Users.find({
        $or: [{ nakesId: null }, { nakesId: { $exists: false } }, { nakesId: "" }]
      })
      .select({ password: 0, token: 0 })
      .lean();

      return res.json({
        status: "success",
        message: "Data User unlinked berhasil dimuat.",
        data: users,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "ERROR_LIST_UNLINKED_USERS",
        error: err.message,
        data: null,
      });
    }
  },

  createNakesUser: async (req, res) => {
    const bcrypt = require("bcryptjs");
    const { userId, nama, email, password, role, kodedpjp, kategori } = req.body;

    try {
      // Mode 2: Link existing User account
      if (userId) {
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({
            status: "error",
            message: "User account not found.",
            data: null,
          });
        }

        // Create Nakes record
        const nakes = new Nakes({
          nama: (nama || user.nama).trim(),
          kategori: kategori || "DOKTER",
          tglInput: moment().format("YYYY-MM-DD"),
          user: user.username,
        });
        await nakes.save();

        // Update existing user document
        user.nakesId = String(nakes._id);
        if (kodedpjp) user.kodedpjp = kodedpjp.trim();
        if (role) user.role = role;
        if (email) user.email = email.trim();
        await user.save();

        return res.json({
          status: "success",
          message: `Akun "${user.username}" berhasil di-link ke Data Nakes.`,
          data: {
            nakesId: nakes._id,
            userId: user._id,
            nama: user.nama,
            username: user.username,
            role: user.role,
            kodedpjp: user.kodedpjp,
            kategori: nakes.kategori,
          },
        });
      }

      // Mode 1: Register brand new User & Nakes account
      if (!nama || !email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Nama, email, dan password wajib diisi.",
          data: null,
        });
      }

      const username = email.trim().toLowerCase();

      const existingUser = await Users.findOne({
        $or: [{ username }, { email: username }]
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "USERNAME_EXISTS",
          data: null,
        });
      }

      const nakes = new Nakes({
        nama: nama.trim(),
        kategori: kategori || "DOKTER",
        tglInput: moment().format("YYYY-MM-DD"),
        user: username,
      });
      await nakes.save();

      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      const token = "";
      const user = new Users({
        nama: nama.trim(),
        username,
        password: hash,
        token,
        email: email.trim(),
        kodedpjp: kodedpjp ? kodedpjp.trim() : null,
        nakesId: String(nakes._id),
        role: role || "ROLE_POLI",
      });

      try {
        await user.save();
      } catch (userSaveErr) {
        await Nakes.findByIdAndDelete(nakes._id);
        throw userSaveErr;
      }

      return res.json({
        status: "success",
        message: "Nakes & Akun User berhasil didaftarkan.",
        data: {
          nakesId: nakes._id,
          userId: user._id,
          nama: user.nama,
          username: user.username,
          role: user.role,
          kodedpjp: user.kodedpjp,
          kategori: nakes.kategori,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "ERROR_CREATE_NAKES_USER",
        error: err.message,
        data: null,
      });
    }
  },

  listNakesUser: async (req, res) => {
    try {
      // Get all users that have a nakesId (linked to a Nakes record)
      const users = await Users.find({ nakesId: { $ne: null } })
        .select({ password: 0, token: 0 })
        .lean();

      // Also pull from Nakes for users that were created via old method (nakes.user = username)
      const allNakes = await Nakes.find({}).lean();

      // Build combined list: prefer users with nakesId, then fill from Nakes
      const linkedNakesIds = new Set(users.map(u => u.nakesId).filter(Boolean));
      const linked = users.map(u => {
        const matchNakes = allNakes.find(n => String(n._id) === u.nakesId);
        return {
          _id: u._id,
          nama: u.nama,
          username: u.username,
          role: u.role,
          email: u.email,
          kodedpjp: u.kodedpjp,
          kategori: matchNakes ? matchNakes.kategori : "DOKTER",
          sub: matchNakes ? matchNakes.sub : null,
          ket: matchNakes ? matchNakes.ket : null,
          nakesId: u.nakesId,
          createdAt: u.createdAt,
        };
      });

      // Add unlinked Nakes (no user account) for completeness
      const unlinked = allNakes
        .filter(n => !linkedNakesIds.has(String(n._id)))
        .map(n => ({
          _id: null,
          nama: n.nama,
          username: n.user || null,
          role: null,
          email: null,
          kodedpjp: null,
          kategori: n.kategori || "DOKTER",
          nakesId: String(n._id),
          createdAt: n.tglInput,
        }));

      return res.json({
        status: "success",
        message: "Data Nakes & User berhasil dimuat.",
        data: [...linked, ...unlinked],
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "ERROR_LIST_NAKES_USER",
        error: err.message,
        data: null,
      });
    }
  },

  deleteNakesUser: async (req, res) => {
    const { username, nakesId, nama } = req.body;
    if (!username && !nakesId) {
      return res.status(400).json({
        status: "error",
        message: "Username atau nakesId wajib diisi.",
        data: null,
      });
    }
    try {
      let targetNakesId = nakesId || null;

      if (username) {
        const user = await Users.findOne({ username });
        if (user) {
          if (user.nakesId) {
            targetNakesId = user.nakesId;
          }
          await Users.deleteOne({ username });
        }
      }

      if (targetNakesId) {
        await Nakes.findByIdAndDelete(targetNakesId);
      }

      return res.json({
        status: "success",
        message: `Nakes & Akun "${nama || username || nakesId}" berhasil dihapus.`,
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "ERROR_DELETE_NAKES_USER",
        error: err.message,
        data: null,
      });
    }
  },

  updateNakesUser: async (req, res) => {
    const { userId, nakesId, username, nama, email, password, role, kodedpjp, kategori } = req.body;
    const bcrypt = require("bcryptjs");

    try {
      let user = null;
      if (userId) {
        user = await Users.findById(userId);
      } else if (username) {
        user = await Users.findOne({ username });
      } else if (nakesId) {
        user = await Users.findOne({ nakesId: String(nakesId) });
      }

      const nakes = nakesId ? await Nakes.findById(nakesId) : (username ? await Nakes.findOne({ user: username }) : null);

      // If editing an unlinked Nakes record (no User document yet), auto-create User document!
      if (!user && (nakes || nama)) {
        const derivedUsername = (email && email.trim().toLowerCase()) || username || (nama ? nama.toLowerCase().replace(/[^a-z0-9]/g, '') : 'user');
        const pwd = (password && password.trim().length > 0) ? password.trim() : '123456';
        const hash = bcrypt.hashSync(pwd, 10);

        user = new Users({
          nama: (nama || (nakes ? nakes.nama : '')).trim(),
          username: derivedUsername,
          password: hash,
          email: email ? email.trim() : derivedUsername,
          kodedpjp: kodedpjp ? kodedpjp.trim() : null,
          nakesId: nakes ? String(nakes._id) : (nakesId ? String(nakesId) : null),
          role: role || "ROLE_POLI",
        });
        await user.save();

        if (nakes) {
          nakes.user = derivedUsername;
          nakes.nama = (nama || nakes.nama).trim();
          if (kategori) nakes.kategori = kategori;
          await nakes.save();
        }
      } else {
        if (user) {
          if (nama) user.nama = nama.trim();
          if (email) {
            user.email = email.trim();
            user.username = email.trim().toLowerCase();
          }
          if (role) user.role = role;
          if (kodedpjp !== undefined) user.kodedpjp = kodedpjp ? kodedpjp.trim() : null;

          if (password && password.trim().length > 0) {
            const saltRounds = 10;
            user.password = bcrypt.hashSync(password.trim(), saltRounds);
          }

          if (nakesId && !user.nakesId) {
            user.nakesId = String(nakesId);
          }

          await user.save();
        }

        if (nakes) {
          if (nama) nakes.nama = nama.trim();
          if (kategori) nakes.kategori = kategori;
          if (user && user.username) nakes.user = user.username;
          await nakes.save();
        }
      }

      return res.json({
        status: "success",
        message: "Data Nakes & User berhasil diperbarui.",
        data: null,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "ERROR_UPDATE_NAKES_USER",
        error: err.message,
        data: null,
      });
    }
  },
};

