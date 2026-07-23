

module.exports = {
  getApp: function (req, res, next) {
    res.sendFile(process.cwd()+"/mansis/index.html")
  },
};
