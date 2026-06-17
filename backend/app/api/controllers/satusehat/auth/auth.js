
var moment = require("moment");
const axios = require("axios");
const fetch = require("node-fetch");

const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');

module.exports = {
    generateToken: async (req, res) => {
        try {
            const token = await getSatusehatToken();
            return res.status(200).send({
                status: 200,
                message: 'Ok.',
                data: token,
            });
        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: 'error generate token satusehat',
                data: null,
            });
        }
    },
};