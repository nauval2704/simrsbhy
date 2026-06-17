
require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const { getOrganizationSatusehat } = require("../../../utils/satusehat/getOrganization");
const fetch = require("node-fetch");

module.exports = {
    create: async (req, res) => {
        try {

            const org = await getOrganizationSatusehat();

            const dataForm = {
                "resourceType": "Organization",
                "active": true,
                "identifier": [
                    {
                        "use": "official",
                        "system": "http://sys-ids.kemkes.go.id/organization/" + org.id,
                        "value": req.body.identifierName
                    }
                ],
                "type": [
                    {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/organization-type",
                                "code": "dept",
                                "display": "Hospital Department"
                            }
                        ]
                    }
                ],
                "name": req.body.name,
                "telecom": [
                    {
                        "system": "phone",
                        "value": req.body.phone,
                        "use": "work"
                    },
                    {
                        "system": "email",
                        "value": req.body.email,
                        "use": "work"
                    },
                    {
                        "system": "url",
                        "value": req.body.url,
                        "use": "work"
                    }
                ],
                "address": [
                    {
                        "use": "work",
                        "type": "both",
                        "line": [
                            req.body.line
                        ],
                        "city": req.body.kota,
                        "postalCode": req.body.postalCode,
                        "country": req.body.country,
                        "extension": [
                            {
                                "url": "https://fhir.kemkes.go.id/r4/StructureDefinition/administrativeCode",
                                "extension": [
                                    {
                                        "url": "province",
                                        "valueCode": req.body.province
                                    },
                                    {
                                        "url": "city",
                                        "valueCode": req.body.city
                                    },
                                    {
                                        "url": "district",
                                        "valueCode": req.body.district
                                    },
                                    {
                                        "url": "village",
                                        "valueCode": req.body.village
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "partOf": {
                    "reference": "Organization/" + org.id,
                    "display": org.name
                }
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Organization`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm)
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
    searchByNik: async (req, res) => {
        try {
            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const identifier = `https://fhir.kemkes.go.id/id/nik|${req.body.nik}`
            const apiUrl = baseUrl + "/Patient?identifier=" + identifier;

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
            return res.status(500).send({
                status: 500,
                message: 'error search data pasien satusehat',
                data: null,
            });
        }
    },
};