require('dotenv').config();
const { getSatusehatToken } = require('./generateToken');

function createObservationResource(patientId, encounterId, loincCode, display, value, unit, unitCode) {
  return {
    resourceType: "Observation",
    status: "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "vital-signs",
        display: "Vital Signs"
      }]
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code: loincCode,
        display: display
      }]
    },
    subject: { reference: "Patient/" + patientId },
    encounter: { reference: "Encounter/" + encounterId },
    effectiveDateTime: new Date().toISOString(),
    valueQuantity: {
      value: parseFloat(value),
      unit: unit,
      system: "http://unitsofmeasure.org",
      code: unitCode
    }
  };
}

function buildTriageBundle(triaseData, patientId, encounterId) {
  const entries = [];

  if (triaseData.hr) {
    entries.push({
      request: { method: "POST", url: "Observation" },
      resource: createObservationResource(patientId, encounterId, "8867-4", "Heart rate", triaseData.hr, "beats/minute", "/min")
    });
  }

  if (triaseData.suhu) {
    entries.push({
      request: { method: "POST", url: "Observation" },
      resource: createObservationResource(patientId, encounterId, "8310-5", "Body temperature", triaseData.suhu, "C", "Cel")
    });
  }

  if (triaseData.rr) {
    entries.push({
      request: { method: "POST", url: "Observation" },
      resource: createObservationResource(patientId, encounterId, "9279-1", "Respiratory rate", triaseData.rr, "breaths/minute", "/min")
    });
  }

  if (triaseData.spo2) {
    entries.push({
      request: { method: "POST", url: "Observation" },
      resource: createObservationResource(patientId, encounterId, "2708-6", "Oxygen saturation", triaseData.spo2, "%", "%")
    });
  }

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: entries
  };
}

async function sendFhirBundle(bundle) {
  const token = await getSatusehatToken();
  const baseUrl = process.env.BASE_URL;

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(bundle)
  });

  return await response.json();
}

module.exports = {
  buildTriageBundle,
  sendFhirBundle
};
