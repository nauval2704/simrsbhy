const pasien = require('./simrsba_modules/pasien');
const rujukan = require('./simrsba_modules/rujukan');
const kunjungan = require('./simrsba_modules/kunjungan');
const ruangan = require('./simrsba_modules/ruangan');
const tarif_obat = require('./simrsba_modules/tarif_obat');
const bpjs_helpers = require('./simrsba_modules/bpjs_helpers');
const nakes = require('./simrsba_modules/nakes');
const misc = require('./simrsba_modules/misc');

module.exports = {
  ...pasien,
  ...rujukan,
  ...kunjungan,
  ...ruangan,
  ...tarif_obat,
  ...bpjs_helpers,
  ...nakes,
  ...misc
};
