const operasiModel = require("../models/operasi");
const kodepoliModel = require("../models/kodepolis");
module.exports = {
  /*     getById: function (req, res, next) {
            operasiModel.findById(req.params.movieId, function (err, movieInfo) {
                if (err) {
                    next(err);
                } else {
                    res.json({
                        status: "success",
                        message: "Movie found!!!",
                        data: {
                            movies: movieInfo
                        }
                    });
                }
            });
        },
        getAll: function (req, res, next) {
            let moviesList = [];
            operasiModel.find({}, function (err, movies) {
                if (err) {
                    next(err);
                } else {
                    for (let movie of movies) {
                        moviesList.push({
                            id: movie._id,
                            name: movie.name,
                            released_on: movie.released_on
                        });
                    }
                    res.json({
                        status: "success",
                        message: "Movies list found!!!",
                        data: {
                            movies: moviesList
                        }
                    });

                }
            });
        },
        updateById: function (req, res, next) {
            operasiModel.findByIdAndUpdate(req.params.movieId, {
                name: req.body.name
            }, function (err, movieInfo) {
                if (err)
                    next(err);
                else {
                    res.json({
                        status: "success",
                        message: "Movie updated successfully!!!",
                        data: null
                    });
                }
            });
        },
        deleteById: function (req, res, next) {
            operasiModel.findByIdAndRemove(req.params.movieId, function (err, movieInfo) {
                if (err)
                    next(err);
                else {
                    res.json({
                        status: "success",
                        message: "Movie deleted successfully!!!",
                        data: null
                    });
                }
            });
        }, */
  getById: function (req, res, next) {
    let list = [];
    operasiModel.find(
      {
        nopeserta: req.body.nopeserta,
        terlaksana: 0,
      },
      function (err, operasiInfo) {
        if (!operasiInfo.length) {
          res.status(404).json({
            message:
              "ERROR!, list tidak di temukan / nopeserta harus 13 digit number dan tdk boleh kosong / null",
          });
        } else {
          if (err) {
            next(err);
          } else {
            for (let operasi of operasiInfo) {
              var dateOperasi = new Date(operasi.tanggaloperasi);
              var d = ("0" + dateOperasi.getDate()).slice(-2);
              var m = ("0" + (dateOperasi.getMonth() + 1)).slice(-2);
              var y = dateOperasi.getFullYear();

              list.push({
                kodebooking: operasi.kodebooking,
                tanggaloperasi: y + "-" + m + "-" + d,
                jenistindakan: operasi.jenistindakan,
                kodepoli: operasi.kodepoli,
                namapoli: operasi.namapoli,
                terlaksana: operasi.terlaksana,
              });
            }
            res.json({
              response: {
                list,
              },
              metadata: {
                message: "Ok",
                code: 200,
              },
            });
          }
        }
      }
    );
  },
  getByTgl: function (req, res, next) {
    let list = [];
    var tanggalawal = req.body.tanggalawal;
    var tanggalakhir = req.body.tanggalakhir;
    if (tanggalakhir < tanggalawal) {
      res.status(404).json({
        message:
          "ERROR!, tanggal akhir tdk boleh lebih kecil dari tanggal awal",
      });
    } else {
      operasiModel.find(
        {
          tanggaloperasi: {
            $gte: new Date(tanggalawal),
            $lte: new Date(tanggalakhir),
          },
        },
        function (err, operasiInfo) {
          if (!operasiInfo) {
            res.status(404).json({
              message: "ERROR!, Format Tanggal tdk sesuai / null / kosong",
            });
          } else {
            if (err) {
              next(err);
            } else {
              for (let operasi of operasiInfo) {
                var dateOperasi = new Date(operasi.tanggaloperasi);
                var d = ("0" + dateOperasi.getDate()).slice(-2);
                var m = ("0" + (dateOperasi.getMonth() + 1)).slice(-2);
                var y = dateOperasi.getFullYear();

                list.push({
                  kodebooking: operasi.kodebooking,
                  tanggaloperasi: y + "-" + m + "-" + d,
                  jenistindakan: operasi.jenistindakan,
                  kodepoli: operasi.kodepoli,
                  namapoli: operasi.namapoli,
                  terlaksana: operasi.terlaksana,
                  nopeserta: operasi.nopeserta,
                  lastupdate: Date.now(),
                });
              }
              res.json({
                response: {
                  list,
                },
                metadata: {
                  message: "Ok",
                  code: 200,
                },
              });
            }
          }
        }
      );
    }
  },
  create: function (req, res, next) {
    kodepoliModel.findOne(
      {
        kdpoli: req.body.kodepoli,
      },
      function (err, kodepoliInfo) {
        if (!kodepoliInfo) {
          res.status(404).json({
            message: "ERROR!, kodepoli null / kosong / tdk ditemukan",
          });
        } else {
          if (err) {
            next(err);
          } else {
            operasiModel.create(
              {
                nopeserta: req.body.nopeserta,
                kodebooking: req.body.kodebooking,
                tanggaloperasi: req.body.tanggaloperasi,
                jenistindakan: req.body.jenistindakan,
                kodepoli: req.body.kodepoli,
                namapoli: kodepoliInfo.nmpoli,
                terlaksana: req.body.terlaksana,
              },
              function (err, result) {
                if (err) next(err);
                else
                  res.json({
                    response: {
                      message: "Operasi Berhasil Di Create",
                    },
                    metadata: {
                      message: "Ok",
                      code: 200,
                    },
                  });
              }
            );
          }
        }
      }
    );
  },
};
