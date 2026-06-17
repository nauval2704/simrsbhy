require('dotenv').config()
const { getSatusehatToken } = require('../../../utils/satusehat/generateToken');
const { getOrganizationSatusehat } = require("../../../utils/satusehat/getOrganization");
const checkinModel = require("../../../models/checkin");
const moment = require('moment');
const fetch = require("node-fetch");

module.exports = {
    create: async (req, res) => {
        try {


            const org = await getOrganizationSatusehat();

            const tglCheckin = req.body.tglCheckin;
            const localDate = moment(tglCheckin, "YYYY-MM-DD HH:mm:ss");
            const utcDate = localDate.utc().format('YYYY-MM-DDTHH:mm:ssZ');

            const dataForm = {
                "resourceType": "Condition",
                "clinicalStatus": {
                    "coding": [
                        {
                            "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
                            "code": "active",
                            "display": "Active"
                        }
                    ]
                },
                "category": [
                    {
                        "coding": [
                            {
                                "system": "http://terminology.hl7.org/CodeSystem/condition-category",
                                "code": "encounter-diagnosis",
                                "display": "Encounter Diagnosis"
                            }
                        ]
                    }
                ],
                "code": {
                    "coding": [
                        {
                            "system": "http://hl7.org/fhir/sid/icd-10",
                            "code": req.body.diagnosis.code,
                            "display": req.body.diagnosis.name
                        }
                    ]
                },
                "subject": {
                    "reference": "Patient/" + req.body.patient.ihsNumber,
                    "display": req.body.patient.name
                },
                "encounter": {
                    "reference": "Encounter/" + req.body.encounterId
                },
                "onsetDateTime": utcDate,
                "recordedDate": utcDate,
                "note": [
                    {
                        "text": req.body.keterangan
                    }
                ]
            }

            const token = await getSatusehatToken();
            const baseUrl = process.env.BASE_URL;
            const apiUrl = `${baseUrl}/Condition`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataForm)
            });

            const result = await response.json();

            const updateCheckin = await checkinModel.findOneAndUpdate({ noCheckin: req.body.noCheckin }, { $set: { conditionId: result.id } },)
            return res.status(200).send({
                status: 200,
                message: 'Ok.',
                data: result,
            });
        } catch (error) {
            return res.status(500).send({
                status: 500,
                message: 'error generate token satusehat',
                data: null,
            });
        }
    },
}