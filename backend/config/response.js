const response = (code, message, data, res) => {
    res.status(code).send({ code, message, data });
  };
  
  module.exports = response;