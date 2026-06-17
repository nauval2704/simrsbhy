
require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const { getOrganizationSatusehat } = require("../../../utils/satusehat/getOrganization");
const checkinModel = require("../../../models/checkin");
const moment = require("moment");


module.exports = {
    create: async (req, res) => {
        try {


            const org = await getOrganizationSatusehat();

            const tglCheckin = req.body.tglCheckin;
            const localDate = moment(tglCheckin, "YYYY-MM-DD HH:mm:ss");
            const utcDate = localDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');

            const dataForm = {
                "resourceType": "Encounter",
                "identifier": [
                    {
                        "system": "http://sys-ids.kemkes.go.id/encounter/" + org.id,
                        "value": req.body.noCheckin
                    }
                ],
                "status": req.body.status,
                "class": {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                    "code": req.body.class.code,
                    "display": req.body.class.name
                },
                "subject": {
                    "reference": "Patient/" + req.body.patient.ihsNumber,
                    "display": req.body.patient.name
                },
                "participant": [
                    {
                        "type": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                                        "code": "ATND",
                                        "display": "attender"
                                    }
                                ]
                            }
                        ],
                        "individual": {
                            "reference": "Practitioner/" + req.body.practitioner.ihsNumber,
                            "display": req.body.practitioner.name
                        }
                    }
                ],
                "period": {
                    "start": utcDate
                },
                "location": [
                    {
                        "location": {
                            "reference": "Location/" + req.body.location.id,
                            "display": req.body.location.nama
                        },
                    }
                ],
                "statusHistory": [
                    {
                        "status": req.body.status,
                        "period": {
                            "start": utcDate
                        }
                    }
                ],
                "serviceProvider": {
                    "reference": "Organization/" + org.id
                }
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Encounter`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm)
            });

            const result = await response.json();

            const updateCheckin = await checkinModel.findOneAndUpdate({ noCheckin: req.body.noCheckin }, { $set: { encounterId: result.id, encounterStatus: req.body.status } },)


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
    detail: async (req, res) => {
        try {

            if (req.body.encounterId === '' || !req.body.encounterId) {
                return res.status(200).send({
                    status: 200,
                    message: 'Ok.',
                    data: null,
                });
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Encounter/${req.body.encounterId}`;

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
    updateTriase: async (req, res) => {
        try {


            const org = await getOrganizationSatusehat();

            const tglCheckin = req.body.period;
            const localDate = moment(tglCheckin, "YYYY-MM-DD HH:mm:ss");
            const utcDate = localDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');

            const dataForm = {
                "resourceType": "Encounter",
                "id": req.body.encounterId,
                "identifier": [
                    {
                        "system": "http://sys-ids.kemkes.go.id/encounter/" + org.id,
                        "value": req.body.noCheckin
                    }
                ],
                "status": req.body.status,
                "class": {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                    "code": req.body.class.code,
                    "display": req.body.class.name
                },
                "subject": {
                    "reference": "Patient/" + req.body.patient.ihsNumber,
                    "display": req.body.patient.name
                },
                "participant": [
                    {
                        "type": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                                        "code": "ATND",
                                        "display": "attender"
                                    }
                                ]
                            }
                        ],
                        "individual": {
                            "reference": "Practitioner/" + req.body.practitioner.ihsNumber,
                            "display": req.body.practitioner.name
                        }
                    }
                ],
                "period": {
                    "start": utcDate
                },
                "location": [
                    {
                        "location": {
                            "reference": "Location/" + req.body.location.id,
                            "display": req.body.location.nama
                        },
                        "period": {
                            "start": utcDate
                        }
                    }
                ],
                "statusHistory": [
                    {
                        "status": "arrived",
                        "period": {
                            "start": req.body.tglArrived,
                            "end": utcDate
                        }
                    },
                    {
                        "status": req.body.status,
                        "period": {
                            "start": utcDate
                        }
                    }
                ],
                "serviceProvider": {
                    "reference": "Organization/" + org.id
                }
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Encounter`;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm)
            });

            const result = await response.json();

            const updateCheckin = await checkinModel.findOneAndUpdate({ noCheckin: req.body.noCheckin }, { $set: { encounterId: result.id, encounterStatus: req.body.status } },)

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
    updateFinished: async (req, res) => {
        try {


            const org = await getOrganizationSatusehat();

            const tglCheckin = req.body.period;
            const localDate = moment(tglCheckin, "YYYY-MM-DD HH:mm:ss");
            const utcDate = localDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');

            const dataForm = {
                "resourceType": "Encounter",
                "id": req.body.encounterId,
                "identifier": [
                    {
                        "system": "http://sys-ids.kemkes.go.id/encounter/" + org.id,
                        "value": req.body.noCheckin
                    }
                ],
                "status": req.body.status,
                "class": {
                    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                    "code": req.body.class.code,
                    "display": req.body.class.name
                },
                "subject": {
                    "reference": "Patient/" + req.body.patient.ihsNumber,
                    "display": req.body.patient.name
                },
                "participant": [
                    {
                        "type": [
                            {
                                "coding": [
                                    {
                                        "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                                        "code": "ATND",
                                        "display": "attender"
                                    }
                                ]
                            }
                        ],
                        "individual": {
                            "reference": "Practitioner/" + req.body.practitioner.ihsNumber,
                            "display": req.body.practitioner.name
                        }
                    }
                ],
                "period": {
                    "start": req.body.period,
                    "end": req.body.period
                },
                "location": [
                    {
                        "location": {
                            "reference": req.body.location.reference,
                            "display": req.body.location.display
                        },
                        "period": {
                            "start": req.body.location.start,
                            "end": req.body.period
                        },
                    },
                ],
                "diagnosis": [
                    {
                        "condition": {
                            "reference": "Condition/" + req.body.diagnosis.reference,
                            "display": req.body.diagnosis.display
                        },
                        "use": {
                            "coding": [
                                {
                                    "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
                                    "code": "AD",
                                    "display": "Admission diagnosis "
                                }
                            ]
                        }
                    }
                ],
                "statusHistory": req.body.statusHistory,
                "serviceProvider": {
                    "reference": "Organization/" + org.id
                }
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Encounter`;

            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm)
            });

            const result = await response.json();

            const updateCheckin = await checkinModel.findOneAndUpdate({ noCheckin: req.body.noCheckin }, { $set: { encounterId: result.id, encounterStatus: req.body.status } },)

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
}