
require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const { getOrganizationSatusehat } = require("../../../utils/satusehat/getOrganization");
const checkinModel = require("../../../models/checkin");
const moment = require("moment");
const fetch = require("node-fetch");


module.exports = {
    detail: async (req, res) => {
        try {

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Condition/${req.body.conditionId}`;

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            const result = await response.json();

            return res.status(200).send({
                status: 200,
                message: 'Ok.',
                data: result,
            });
        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: 'error get condition',
                data: null,
            });
        }
    },
}