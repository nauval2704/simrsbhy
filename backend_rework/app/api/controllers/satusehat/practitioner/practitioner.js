require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const practitionerModel = require("../../../models/practitioner");
const fetch = require("node-fetch");


module.exports = {

    searchByNik: async (req, res) => {
        try {
            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const identifier = `https://fhir.kemkes.go.id/id/nik|${req.body.nik}`
            const apiUrl = baseUrl + "/Practitioner?identifier=" + identifier;

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
                message: 'error generate token satusehat',
                data: null,
            });
        }
    },
    listPractitioner: async (req, res) => {
        try {
            const result = await practitionerModel.find({}).limit(5).sort({ nama: 1 })
            return res.status(200).send({
                status: 200,
                message: 'Ok.',
                data: result,
            });
        } catch (error) {
            return res.status(400).send({
                status: 400,
                message: 'error generate token satusehat',
                data: null,
            });
        }
    },
    listPractitionerByTerm: async (req, res) => {
        try {
            const term = req.body.term
            const result = await practitionerModel.find({
                $or: [
                    { nama: { $regex: new RegExp(term, 'i') } },
                    { nik: { $regex: new RegExp(term, 'i') } },
                ],
            }).sort({ nama: 1 });

            return res.status(200).send({
                status: 200,
                message: 'Ok.',
                data: result,
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