const userModel = require("../models/users");
const Pasien = require("../models/pasien");
const Absen = require("../models/absen");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


module.exports = {
  create: async (req, res) => {
    try {
      const findOneEmail = await userModel.find({
        username: req.body.username,
      });

      if (findOneEmail.length > 0) {
        return res.status(400).send({
          error: 'error creating',
          status: "error",
          message: "EMAIL_EXISTS",
          data: null,
        });
      }

      const saltRounds = 10;
      const hash = bcrypt.hashSync(req.body.password, saltRounds);
      const token = jwt.sign({ hash }, req.app.get("secretKey"), {
        expiresIn: 60 * 60 * 12,
      });
      const user = new userModel({
        nama: req.body.nama,
        username: req.body.username,
        password: hash,
        token: token,
      });
      await user.save();
      return res.json({
        status: "success",
        message: "User added successfully!!!",
        data: user,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "ERROR_NEW_USER",
        data: null,
      });
    }
  },
  current: async (req, res) => {
    try {
      const user = await userModel.findOne({
        token: req.headers["x-token"],
      });

      if (!user) {
        return res.status(400).send({
          error: 'token is invalid',
          status: "error",
          message: "ERROR_TOKEN",
          data: null,
        });
      }
      res.status(200).send({
        nama: user.nama,
        username: user.username,
        localId: user._id,
        role: user.role,
        umjkn: 'bpjs@bpjs-kesehatan.go.id',
        pmjkn: 'br1dgingANTREAN',
        idToken: user.token,
        expiresIn: 60 * 60 * 12,
      });
    } catch (error) {
      return res.status(400).send({
        error: error,
        status: "error",
        message: "ERROR_NEW_USER",
        data: null,
      });
    }
  },
  authenticate: async (req, res) => {
    try {
      const user = await userModel.findOne({
        username: req.body.username,
      });

      if (!user) {
        return res.status(500).send({
          error: 'invalid username / password',
          status: "error",
          message: "ERROR_LOGIN",
          data: null,
        });
      }

     if (bcrypt.compareSync(req.body.password, user.password)) {
        let id = user._id
        const token = jwt.sign(
          {
            id
          },
          req.app.get("secretKey"),
          {
            expiresIn: 60 * 60 * 12,
          }
        );
        user.token =token;
        user.save()
        return res.status(200).send({
          nama: user.nama,
          username:user.username,
          localId: user._id,
          role: user.role,
          umjkn: 'bpjs@bpjs-kesehatan.go.id',
          pmjkn: 'br1dgingANTREAN',
          idToken: user.token,
          expiresIn: 160 * 60 * 12,
        });
      }
      
      return res.status(500).send({
        error: 'invalid username / password',
        status: "error",
        message: "ERROR_NEW_USER",
        data: null,
      });

    } catch (error) {

     return res.status(400).send({
        error: error,
        status: "error",
        message: "ERROR_NEW_USER",
        data: null,
      }); 
      
    }
  },
  // authenticate: function (req, res, next) {
  //   userModel.findOne(
  //     {
  //       username: req.body.username,
  //     },
  //     function (err, userInfo) {
  //       let dataUser = userInfo?._id
  //       if (!userInfo) {
  //         res.status(400).send({
  //           error: err,
  //           status: "error",
  //           message: "EMAIL_NOT_FOUND",
  //           data: null,
  //         });
  //       } else {
  //         if (bcrypt.compareSync(req.body.password, userInfo.password)) {
  //           const token = jwt.sign(
  //             {
  //               dataUser
  //             },
  //             req.app.get("secretKey"),
  //             {
  //               expiresIn: 60 * 60 * 12,
  //             }
  //           );
  //           userInfo.token = token;
  //           userInfo.save()
  //           res.status(200).send({
  //             nama: userInfo.nama,
  //             username: userInfo.username,
  //             localId: userInfo._id,
  //             role: userInfo.role,
  //             umjkn: 'bpjs@bpjs-kesehatan.go.id',
  //             pmjkn: 'br1dgingANTREAN',
  //             idToken: token,
  //             expiresIn: 60 * 60 * 12,
  //           });
  //           /* res.json({
  //             response: {
  //               token: token,
  //             },
  //             metadata: {
  //               message: "Ok",
  //               code: 200,
  //             },
  //           }); */
  //         } else {
  //           res.status(400).send({
  //             error: err,
  //             status: "error",
  //             message: "INVALID_PASSWORD",
  //             data: null,
  //           });
  //         }
  //       }
  //     }
  //   );
  // },
  findAll: function (req, res, next) { },
  absen: async (req, res) => {
    const absenKaryawan = new Absen({
      email: req.body.email,
      nama: req.body.nama,
      absen: req.body.absen,
      location: req.body.location,
      status: req.body.status,
      bagian: req.body.bagian,
      wfh: req.body.wfh,
      kendaraan: req.body.kendaraan,
      pekerjaan: req.body.pekerjaan,
      kondisi: req.body.kondisi,
      usia: req.body.usia,
      hamil: req.body.hamil,
      menyusui: req.body.menyusui,
      demam: req.body.demam,
      batuk: req.body.batuk,
      pilek: req.body.pilek,
      tenggorokan: req.body.tenggorokan,
      sesak: req.body.sesak,
    });
    try {
      var io = req.app.get("socketio");
      const newAbsen = await absenKaryawan.save();
      if (req.body.absen === "DATANG") {
        const sendIo = await io.emit("absen datang dari server", req.body.nama);
      } else {
        const sendIo = await io.emit("absen pulang dari server", req.body.nama);
      }

      res.json({
        status: "success",
        message: "Absen sukses",
        data: null,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  currentDate: async (req, res) => {
    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    try {
      const dataAbsen = await Absen.find({
        tglInput: { $gte: start, $lt: end },
      }).sort({ tglInput: "desc" });

      res.json({
        data: dataAbsen,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  currentDateKaryawan: async (req, res) => {
    var getEmail = req.params.email;

    var start = new Date();
    start.setHours(0, 0, 0, 0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);
    try {
      const dataAbsen = await Absen.find({
        email: getEmail,
        tglInput: { $gte: start, $lt: end },
      }).sort({ tglInput: "desc" });

      res.json({
        data: dataAbsen,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  rekapAbsen: async (req, res) => {
    var getEmail = req.params.email;
    var getStart = req.params.start;
    var getEnd = req.params.end;

    var start = new Date(getStart);
    start.setHours(0, 0, 0, 0);
    var end = new Date(getEnd);
    end.setHours(23, 59, 59, 999);
    try {
      const dataAbsen = await Absen.find({
        email: getEmail,
        tglInput: { $gte: start, $lt: end },
      }).sort({ tglInput: "desc" });

      res.json({
        data: dataAbsen,
      });
    } catch (err) {
      res.json({
        data: {},
      });
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  rekapAbsenAll: async (req, res) => {
    var getStart = req.params.start;
    var getEnd = req.params.end;

    var start = new Date(getStart);
    start.setHours(0, 0, 0, 0);
    var end = new Date(getEnd);
    end.setHours(23, 59, 59, 999);
    try {
      const dataAbsen = await Absen.find({
        tglInput: { $gte: start, $lt: end },
      }).sort({ tglInput: "desc" });

      res.json({
        data: dataAbsen,
      });
    } catch (err) {
      res.json({
        data: {},
      });
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_ABSEN",
        data: null,
      });
    }
  },
  resetPass: function (req, res, next) {
    userModel.findOne(
      {
        username: req.body.username,
      },
      function (err, userInfo) {
        if (!userInfo) {
          res.status(400).send({
            error: err,
            status: "error",
            message: "EMAIL_NOT_FOUND",
            data: null,
          });
        } else {
          if (bcrypt.compareSync(req.body.passLama, userInfo.password)) {
            userInfo.password = req.body.password;
            userInfo.save();
            res.json({
              status: "success",
              message: "Password Berhasil Di Ganti",
              data: null,
            });
          } else {
            res.status(400).send({
              error: err,
              status: "error",
              message: "INVALID_PASSWORD",
              data: null,
            });
          }
        }
      }
    );
  },
  lastnorm: async (req, res) => {
    try {
      const lastnorm = await Pasien.find({}).sort({ norm: -1 }).limit(1);
      res.json({
        status: "success",
        message: "Insert Rujukan Sukses",
        data: lastnorm,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_NETWORK",
        data: null,
      });
    }
  },
  getnorm: async (req, res) => {
    try {
      const getnorm = await Pasien.find({ norm: req.params.norm })
        .sort({ norm: -1 })
        .limit(1);
      res.json({
        status: "success",
        message: "Insert Rujukan Sukses",
        data: getnorm,
      });
    } catch (err) {
      res.status(400).send({
        error: err,
        status: "error",
        message: "ERROR_NETWORK",
        data: null,
      });
    }
  },
};
