

const sep = require('./vclaim_modules/sep');
const rujukan = require('./vclaim_modules/rujukan');
const peserta = require('./vclaim_modules/peserta');
const klaim = require('./vclaim_modules/klaim');
const prb = require('./vclaim_modules/prb');
const spri = require('./vclaim_modules/spri');
const misc = require('./vclaim_modules/misc');

module.exports = {
  ...sep,
  ...rujukan,
  ...peserta,
  ...klaim,
  ...prb,
  ...spri,
  ...misc,
};
