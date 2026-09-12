const crypto = require('crypto');
const lz = require('lz-string');

// prod config from environment
const ConsId = process.env.BPJS_CONS_ID || '13034';
const SecretKey = process.env.BPJS_SECRET_KEY || '9UH68UK4gr';
const UserKey = process.env.BPJS_USER_KEY || '6824f88f2b12582ebd98c430afc8c76f';
const BaseUrl = process.env.BPJS_VCLAIM_BASE_URL || process.env.BPJS_BASE_URL || 'https://apijkn.bpjs-kesehatan.go.id/vclaim-rest/';
const KodeRs = process.env.BPJS_KODE_RS || '0101R009';
const UrlApplicares = process.env.BPJS_URL_APPLICARES || 'https://new-api.bpjs-kesehatan.go.id/aplicaresws/';
function getBpjsAuth() {
  const tmStamp = Math.floor(Date.now() / 1000);
  const data = ConsId + '&' + tmStamp;
  const password = ConsId + SecretKey + tmStamp;
  const signa = crypto.createHmac('sha256', SecretKey).update(data).digest();
  const encodedSigna = Buffer.from(signa).toString('base64');
  return { tmStamp, password, encodedSigna };
}

function decryptResponse(string, password) {
  const key_hash = crypto.createHash('sha256').update(password).digest();
  const iv = key_hash.slice(0, 16);
  const decoder = crypto.createDecipheriv('aes-256-cbc', key_hash, iv);
  const output = decoder.update(string, 'base64', 'utf8') + decoder.final('utf8');
  return lz.decompressFromEncodedURIComponent(output);
}

module.exports = { ConsId, SecretKey, UserKey, BaseUrl, KodeRs, UrlApplicares, getBpjsAuth, decryptResponse };
