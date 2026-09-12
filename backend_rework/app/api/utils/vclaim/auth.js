const crypto = require('crypto');
const lz = require('lz-string');

// prod
const ConsId = '13034';
const SecretKey = '0xR53761A8';
const UserKey = '6824f88f2b12582ebd98c430afc8c76f';
const BaseUrl = 'https://apijkn.bpjs-kesehatan.go.id/vclaim-rest/';
const KodeRs = '0101R009';
const UrlApplicares = 'https://new-api.bpjs-kesehatan.go.id/aplicaresws/';
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
