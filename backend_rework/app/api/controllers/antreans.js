const antreanModel = require("../models/antreans");
const kodepoliModel = require("../models/kodepolis");
module.exports = {
  /*     getById: function (req, res, next) {
            antreanModel.findById(req.params.movieId, function (err, movieInfo) {
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
            antreanModel.find({}, function (err, movies) {
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
            antreanModel.findByIdAndUpdate(req.params.movieId, {
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
            antreanModel.findByIdAndRemove(req.params.movieId, function (err, movieInfo) {
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
  getByTgl: function (req, res, next) {
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
          antreanModel.find(
            {
              tanggalperiksa: req.body.tanggalperiksa,
              kodepoli: req.body.kodepoli,
              polieksekutif: req.body.polieksekutif,
            },
            function (err, antreanInfo) {
              if (!antreanInfo) {
                res.status(404).json({
                  message: "ERROR!, antrean tdk ditemukan",
                });
              } else {
                antreanModel.find(
                  {
                    tanggalperiksa: req.body.tanggalperiksa,
                    kodepoli: req.body.kodepoli,
                    polieksekutif: req.body.polieksekutif,
                    terlayani: 1,
                  },
                  function (err, antreanTerlayani) {
                    if (!antreanTerlayani) {
                      res.status(404).json({
                        message: "ERROR!, antrean tdk ditemukan",
                      });
                    } else {
                      if (err) {
                        next(err);
                      } else {
                        res.json({
                          response: {
                            namapoli: kodepoliInfo.nmpoli,
                            totalantrean: antreanInfo.length,
                            jumlahterlayani: antreanTerlayani.length,
                            lastupdate: Date.now(),
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
            }
          );
        }
      }
    );
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
          antreanModel.find(
            {
              kodepoli: req.body.kodepoli,
              tanggalperiksa: req.body.tanggalperiksa,
            },
            function (err, kodepoliJumlah) {
              if (!kodepoliJumlah) {
                res.status(404).json({
                  message: "ERROR!, kodepoli null / kosong / tdk ditemukan",
                });
              } else {
                if (err) {
                  next(err);
                } else {
                  antreanModel.create(
                    {
                      nomorkartu: req.body.nomorkartu,
                      nik: req.body.nik,
                      nomorrm: req.body.nomorrm,
                      notelp: req.body.notelp,
                      tanggalperiksa: req.body.tanggalperiksa,
                      kodepoli: req.body.kodepoli,
                      nomorreferensi: req.body.nomorreferensi,
                      jenisreferensi: req.body.jenisreferensi,
                      jenisrequest: req.body.jenisrequest,
                      polieksekutif: req.body.polieksekutif,
                    },
                    function (err, result) {
                      if (err) next(err);
                      else var tanggalSplit = req.body.tanggalperiksa;
                      tanggalSplit = tanggalSplit.split("-").join("");
                      var noantrean = kodepoliJumlah.length + 1;
                      res.json({
                        response: {
                          nomorantrean:
                            "MJKN" + req.body.kodepoli + "-" + noantrean,
                          kodebooking:
                            "RSPURMJKN" +
                            tanggalSplit +
                            "" +
                            req.body.kodepoli +
                            "" +
                            noantrean,
                          jenisantrean: 2,
                          estimasidilayani: 8 * 60 * kodepoliJumlah.length,
                          namapoli: kodepoliInfo.nmpoli,
                          namadokter: "",
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
        }
      }
    );
  },
  getAll: function (req, res, next) {
    res.status(200).send({
      nama: req.body.nama,
      nik: req.body.nik,
      noBpjs: req.body.noBpjs,
      noHp: req.body.noHp,
      tempatLahir: req.body.tempatLahir,
      tglLahir: req.body.tglLahir,
      jenisKelamin: req.body.jenisKelamin,
      agama: req.body.agama,
      alamat: req.body.alamat,
      kabupaten: req.body.kabupaten,
      kecamatan: req.body.kecamatan,
      domisili: req.body.domisili,
    });
  },
  display: async (req, res) => {
    try {
      const getDisplayData = await antreanModel.aggregate([
        {
          $match: {
            tanggalperiksa: req.body.tanggal,
            kodepoli: { $nin: ['ADM', 'FAR'] }
          }
        },
        {
          $facet: { // Divide the aggregation pipeline into multiple facets
            validEntries: [ // First facet to process valid entries
              { $sort: { nomorantrean: -1 } },
              {
                $match: {
                  status: { $nin: [0, 99] }
                }
              },
              {
                $group: {
                  _id: "$kodepoli",
                  count: { $sum: 1 },
                  nomorantrean: { $first: "$nomorantrean" },
                  angkaantrean: { $first: "$angkaantrean" },
                  namadokter: { $first: "$namadokter" },
                  jampraktek: { $first: "$jampraktek" },
                }
              },
              {
                $project: {
                  _id: 0,
                  kodepoli: "$_id",
                  count: 1,
                  nomorantrean: 1,
                  angkaantrean: 1,
                  namadokter: 1,
                  jampraktek: 1
                }
              },
              { $sort: { count: -1 } }
            ],
            allKodepoli: [ // Second facet to get all distinct kodepoli values
              { $group: { _id: "$kodepoli" } },
              { $project: { _id: 0, kodepoli: "$_id" } }
            ]
          }
        },
        {
          $project: { // Combine the results
            result: {
              $map: { // Use $map to iterate over allKodepoli and add missing entries
                input: "$allKodepoli",
                as: "kp",
                in: {
                  $mergeObjects: [
                    { kodepoli: "$$kp.kodepoli", count: 0, nomorantrean: "-", angkaantrean: "-" },
                    {
                      $arrayElemAt: [ // Find matching entry in validEntries, if exists
                        {
                          $filter: {
                            input: "$validEntries",
                            cond: { $eq: ["$$this.kodepoli", "$$kp.kodepoli"] }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            }
          }
        },
        { $unwind: "$result" }, // Unwind the result array
        { $replaceRoot: { newRoot: "$result" } }, // Replace the root with the result objects
        { $sort: { count: -1 } } // Sort by count in descending order
      ]);
      return res.status(200).send({
        status: 200,
        message: "ok.",
        data: getDisplayData,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error.message,
        data: null,
      });
    }
  },
};
