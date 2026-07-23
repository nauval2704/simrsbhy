
require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const { getOrganizationSatusehat } = require("../../../utils/satusehat/getOrganization");
const fetch = require("node-fetch");

module.exports = {
    create: async (req, res) => {
        try {

            const org = await getOrganizationSatusehat();

            const dataForm = {
                "resourceType": "Location",
                "identifier": [
                    {
                        "system": "http://sys-ids.kemkes.go.id/location/" + org.id,
                        "value": req.body.identifierName
                    }
                ],
                "status": "active",
                "name": req.body.name,
                "description": req.body.description,
                "mode": "instance",
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
                "type": [
                    {
                        "coding": [
                            {
                                "system": "http://terminology.kemkes.go.id/CodeSystem/location-type",
                                "code": req.body.code,
                                "display": req.body.identifierName
                            }
                        ]
                    }
                ],
                "physicalType": {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/location-physical-type",
                            "code": "ro",
                            "display": "Room"
                        }
                    ]
                },
                "position": {
                    "longitude": req.body.longitude,
                    "latitude": req.body.latitude,
                    "altitude": 0
                },
                "managingOrganization": {
                    "reference": "Organization/" + req.body.managingOrganization
                },
                "extension": [
                    {
                        "url": "https://fhir.kemkes.go.id/r4/StructureDefinition/LocationServiceClass",
                        "valueCodeableConcept": {
                            "coding": [
                                {
                                    "system": "http://terminology.kemkes.go.id/CodeSystem/locationServiceClass-Outpatient",
                                    "code": "reguler",
                                    "display": "Kelas Reguler"
                                }
                            ]
                        }
                    }
                ]
            }

            // partOfigd

            // if (req.body.partof) {
            //     dataForm.partOf = {
            //         "reference": "Location/421f48dc-4b44-42b2-9e8e-0cb6656bdc71",
            //         "display": "Instalasi Gawat Darurat"
            //     };
            // }

            // partOfpoli

            if (req.body.partof) {
                dataForm.partOf = {
                    "reference": "Location/9168d93d-4eae-4b7a-b83c-fd7f035ac685",
                    "display": "Instalasi Rawat Jalan Terpadu"
                };
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Location`;

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
    searchByPartOf: async (req, res) => {
        try {

            const org = await getOrganizationSatusehat();
            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Organization?partof=${org.id}`;

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
};