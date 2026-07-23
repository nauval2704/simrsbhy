const crypto = require('crypto');
const lz = require('lz-string');
require('dotenv').config();

// Kredensial BPJS VClaim (prod)
const ConsId = process.env.BPJS_CONS_ID;
const SecretKey = process.env.BPJS_SECRET_KEY;
const UserKey = process.env.BPJS_USER_KEY;
const BaseUrl = process.env.BPJS_VCLAIM_BASE_URL;

// Kredensial Applicares (Kamar)
const KodeRs = process.env.BPJS_KODE_RS;
const UrlApplicares = process.env.BPJS_URL_APPLICARES;
// Generate header autentikasi BPJS
function getBpjsAuth() {
  const tmStamp = Math.floor(Date.now() / 1000);
  const data = ConsId + '&' + tmStamp;
  const password = ConsId + SecretKey + tmStamp;
  const signa = crypto.createHmac('sha256', SecretKey).update(data).digest();
  const encodedSigna = Buffer.from(signa).toString('base64');
  return { tmStamp, password, encodedSigna };
}

// Dekripsi respons terenkripsi dari BPJS
function decryptResponse(string, password) {
  const key_hash = crypto.createHash('sha256').update(password).digest();
  const iv = key_hash.slice(0, 16);
  const decoder = crypto.createDecipheriv('aes-256-cbc', key_hash, iv);
  const output = decoder.update(string, 'base64', 'utf8') + decoder.final('utf8');
  return lz.decompressFromEncodedURIComponent(output);
}

module.exports = { ConsId, SecretKey, UserKey, BaseUrl, KodeRs, UrlApplicares, getBpjsAuth, decryptResponse };
