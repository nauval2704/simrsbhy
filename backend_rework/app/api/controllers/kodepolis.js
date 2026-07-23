const kodepoliModel = require("../models/kodepolis");
module.exports = {
  /*     getById: function (req, res, next) {
        kodepoliModel.findById(req.params.movieId, function (err, movieInfo) {
            if (err) {
                next(err);
            } else {
                res.json({
                    status: "success",
                    message: "Movie found!!!",
                    data: {
                        kodepolis: movieInfo
                    }
                });
            }
        });
    },
    getAll: function (req, res, next) {
        let kodepolisList = [];
        kodepoliModel.find({}, function (err, kodepolis) {
            if (err) {
                next(err);
            } else {
                for (let movie of kodepolis) {
                    kodepolisList.push({
                        id: movie._id,
                        name: movie.name,
                        released_on: movie.released_on
                    });
                }
                res.json({
                    status: "success",
                    message: "kodepolis list found!!!",
                    data: {
                        kodepolis: kodepolisList
                    }
                });

            }
        });
    },
    updateById: function (req, res, next) {
        kodepoliModel.findByIdAndUpdate(req.params.movieId, {
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
        kodepoliModel.findByIdAndRemove(req.params.movieId, function (err, movieInfo) {
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
  create: function (req, res, next) {
    kodepoliModel.create(
      {
        kdpoli: req.body.kdpoli,
        nmpoli: req.body.nmpoli,
      },
      function (err, result) {
        if (err) next(err);
        else
          res.json({
            status: "success",
            message: "poli added successfully!!!",
            data: null,
          });
      }
    );
  },
};
