require('dotenv').config();
const { getSatusehatToken } = require('./generateToken');
const crypto = require('crypto');

function generateUUID() {
  return crypto.randomUUID();
}

function buildLabBundle(laboratoriumArray, patientId, encounterId) {
  const diagnosticReportId = generateUUID();
  const entries = [];

  const observationReferences = [];
  
  laboratoriumArray.forEach(lab => {
    const observationId = generateUUID();
    observationReferences.push({ reference: "urn:uuid:" + observationId });
    
    entries.push({
      fullUrl: "urn:uuid:" + observationId,
      request: { method: "POST", url: "Observation" },
      resource: {
        resourceType: "Observation",
        status: "final",
        category: [{
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory"
          }]
        }],
        code: {
          coding: [{
            system: "http://loinc.org",
            code: lab.testCode || "11502-2",
            display: lab.testName || "Laboratory test"
          }]
        },
        subject: { reference: "Patient/" + patientId },
        encounter: { reference: "Encounter/" + encounterId },
        effectiveDateTime: new Date().toISOString(),
        valueQuantity: {
          value: parseFloat(lab.value) || 0,
          unit: lab.unit,
          system: "http://unitsofmeasure.org",
          code: lab.unit
        },
        ...(lab.referenceRange && {
          referenceRange: [{
            text: lab.referenceRange
          }]
        })
      }
    });
  });

  // Create the DiagnosticReport envelope
  entries.push({
    fullUrl: "urn:uuid:" + diagnosticReportId,
    request: { method: "POST", url: "DiagnosticReport" },
    resource: {
      resourceType: "DiagnosticReport",
      status: "final",
      category: [{
        coding: [{
          system: "http://terminology.hl7.org/CodeSystem/v2-0074",
          code: "LAB"
        }]
      }],
      code: {
        coding: [{
          system: "http://loinc.org",
          code: "11502-2",
          display: "Laboratory report"
        }]
      },
      subject: { reference: "Patient/" + patientId },
      encounter: { reference: "Encounter/" + encounterId },
      result: observationReferences
    }
  });

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: entries
  };
}

function buildRadBundle(radiologiArray, patientId, encounterId) {
  const entries = [];

  radiologiArray.forEach(rad => {
    entries.push({
      request: { method: "POST", url: "DiagnosticReport" },
      resource: {
        resourceType: "DiagnosticReport",
        status: "final",
        category: [{
          coding: [{
            system: "http://terminology.hl7.org/CodeSystem/v2-0074",
            code: "RAD"
          }]
        }],
        code: {
          coding: [{
            system: "http://loinc.org",
            code: rad.examCode || "24648-8",
            display: rad.examName || "Radiology Report"
          }]
        },
        subject: { reference: "Patient/" + patientId },
        encounter: { reference: "Encounter/" + encounterId },
        conclusion: rad.impression || "Tidak ada kesimpulan",
        effectiveDateTime: new Date().toISOString()
      }
    });
  });

  return {
    resourceType: "Bundle",
    type: "transaction",
    entry: entries
  };
}

async function sendDiagnosticBundle(bundle) {
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
  buildLabBundle,
  buildRadBundle,
  sendDiagnosticBundle
};
