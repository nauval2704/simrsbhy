const mongoose = require('mongoose');
const Kodepolis = require('./app/api/models/kodepolis');
const Nakes = require('./app/api/models/nakes');
const Tarif = require('./app/api/models/tarif');
const Ruangan = require('./app/api/models/ruangan');

// Connect to the database using your existing config
require('./config/database');

const kodepolisData = [
  { kdpoli: 'IGD', nmpoli: 'Instalasi Gawat Darurat (IGD)' },
  { kdpoli: 'U001', nmpoli: 'Poli Umum' },
  { kdpoli: 'G001', nmpoli: 'Poli Gigi & Mulut' },
  { kdpoli: 'P001', nmpoli: 'Poli Penyakit Dalam' },
  { kdpoli: 'A001', nmpoli: 'Poli Anak' },
  { kdpoli: 'K001', nmpoli: 'Poli Kandungan & Kebidanan (Obgyn)' },
  { kdpoli: 'M001', nmpoli: 'Poli Mata' },
  { kdpoli: 'S001', nmpoli: 'Poli Saraf' }
];

const nakesData = [
  // Dokter IGD
  { nama: 'dr. Rahman Hidayat', ket: 'Dokter Jaga IGD', sub: 'IGD', bag: 'IGD', kategori: 'Dokter Umum', telp: '081234567890' },
  { nama: 'dr. Siti Aminah', ket: 'Dokter Jaga IGD', sub: 'IGD', bag: 'IGD', kategori: 'Dokter Umum', telp: '081234567891' },
  { nama: 'dr. Budi Santoso', ket: 'Dokter Jaga IGD', sub: 'IGD', bag: 'IGD', kategori: 'Dokter Umum', telp: '081234567892' },
  
  // Dokter Spesialis Poli
  { nama: 'dr. Andi Wijaya, Sp.PD', ket: 'Dokter Spesialis', sub: 'Penyakit Dalam', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567893' },
  { nama: 'dr. Maya Sari, Sp.PD', ket: 'Dokter Spesialis', sub: 'Penyakit Dalam', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567894' },
  { nama: 'dr. Dian Pertiwi, Sp.A', ket: 'Dokter Spesialis', sub: 'Anak', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567895' },
  { nama: 'dr. Hendra Gunawan, Sp.OG', ket: 'Dokter Spesialis', sub: 'Kandungan', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567896' },
  { nama: 'drg. Fitriani', ket: 'Dokter Gigi', sub: 'Gigi', bag: 'POLI', kategori: 'Dokter Gigi', telp: '081234567897' },
  { nama: 'dr. Kusuma, Sp.M', ket: 'Dokter Spesialis', sub: 'Mata', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567898' },
  { nama: 'dr. Fajar, Sp.S', ket: 'Dokter Spesialis', sub: 'Saraf', bag: 'POLI', kategori: 'Dokter Spesialis', telp: '081234567899' },
  { nama: 'dr. Lestari', ket: 'Dokter Umum', sub: 'Umum', bag: 'POLI', kategori: 'Dokter Umum', telp: '081234567800' }
];

  const tarifData = [
    // Tarif IGD
    { noTarif: 1001, nama: 'Pendaftaran Pasien Baru IGD', harga: 50000, pelayanan: 'IGD', komposisi: 'Administrasi', stock: null },
    { noTarif: 1002, nama: 'Pendaftaran Pasien Lama IGD', harga: 30000, pelayanan: 'IGD', komposisi: 'Administrasi', stock: null },
    { noTarif: 1003, nama: 'Pemeriksaan Dokter IGD', harga: 75000, pelayanan: 'IGD', komposisi: 'Jasa Medis', stock: null },
    { noTarif: 1004, nama: 'Tindakan Triase & Observasi IGD', harga: 150000, pelayanan: 'IGD', komposisi: 'Jasa Medis & Keperawatan', stock: null },
    { noTarif: 1005, nama: 'Jahit Luka Kecil (1-5 Jahitan)', harga: 120000, pelayanan: 'IGD', komposisi: 'Tindakan', stock: null },
    { noTarif: 1006, nama: 'Pasang Infus IGD', harga: 60000, pelayanan: 'IGD', komposisi: 'Tindakan', stock: null },
    { noTarif: 1007, nama: 'Nebulizer / Uap', harga: 80000, pelayanan: 'IGD', komposisi: 'Tindakan', stock: null },
  
    // Tarif POLI
    { noTarif: 2001, nama: 'Pendaftaran Pasien Baru Poli', harga: 40000, pelayanan: 'POLI', komposisi: 'Administrasi', stock: null },
    { noTarif: 2002, nama: 'Pendaftaran Pasien Lama Poli', harga: 25000, pelayanan: 'POLI', komposisi: 'Administrasi', stock: null },
    { noTarif: 2003, nama: 'Konsultasi Dokter Umum', harga: 60000, pelayanan: 'POLI', komposisi: 'Jasa Medis', stock: null },
    { noTarif: 2004, nama: 'Konsultasi Dokter Spesialis', harga: 120000, pelayanan: 'POLI', komposisi: 'Jasa Medis', stock: null },
    { noTarif: 2005, nama: 'Konsultasi Dokter Gigi', harga: 80000, pelayanan: 'POLI', komposisi: 'Jasa Medis', stock: null },
    { noTarif: 2006, nama: 'Tindakan Cabut Gigi Biasa', harga: 150000, pelayanan: 'POLI', komposisi: 'Tindakan', stock: null },
    { noTarif: 2007, nama: 'Pemeriksaan USG Kandungan', harga: 200000, pelayanan: 'POLI', komposisi: 'Tindakan', stock: null },
    { noTarif: 2008, nama: 'Rekam Jantung (EKG)', harga: 100000, pelayanan: 'POLI', komposisi: 'Tindakan', stock: null },

    // Tarif LAB
    { noTarif: 3001, nama: 'Darah Lengkap (Hematologi Rutin)', harga: 85000, pelayanan: 'LAB', komposisi: 'Pemeriksaan Lab', stock: null },
    { noTarif: 3002, nama: 'Urine Rutin', harga: 45000, pelayanan: 'LAB', komposisi: 'Pemeriksaan Lab', stock: null },
    { noTarif: 3003, nama: 'Gula Darah Puasa (GDP)', harga: 35000, pelayanan: 'LAB', komposisi: 'Pemeriksaan Lab', stock: null },
    { noTarif: 3004, nama: 'Cholesterol Total', harga: 50000, pelayanan: 'LAB', komposisi: 'Pemeriksaan Lab', stock: null },
    { noTarif: 3005, nama: 'Widal Test (Tipes)', harga: 75000, pelayanan: 'LAB', komposisi: 'Pemeriksaan Lab', stock: null },

    // Tarif RADIOLOGI
    { noTarif: 4001, nama: 'Rontgen Thorax (Dada)', harga: 150000, pelayanan: 'RADIOLOGI', komposisi: 'Pemeriksaan Radiologi', stock: null },
    { noTarif: 4002, nama: 'USG Abdomen (Perut)', harga: 250000, pelayanan: 'RADIOLOGI', komposisi: 'Pemeriksaan Radiologi', stock: null },
    { noTarif: 4003, nama: 'Rontgen Ekstremitas (Tulang/Sendi)', harga: 120000, pelayanan: 'RADIOLOGI', komposisi: 'Pemeriksaan Radiologi', stock: null },
    { noTarif: 4004, nama: 'CT Scan Kepala Tanpa Kontras', harga: 850000, pelayanan: 'RADIOLOGI', komposisi: 'Pemeriksaan Radiologi', stock: null }
  ];

const ruanganData = [
  // Ruang Rawat Inap & IGD
  { kodeKelas: 'VIP', koderuang: 'V01', namaruang: 'Ruang VIP Mawar', kapasitas: '1', tersedia: '1', tersediapria: '1', tersediawanita: '1' },
  { kodeKelas: '1', koderuang: 'K101', namaruang: 'Ruang Kelas 1 Melati', kapasitas: '2', tersedia: '2', tersediapria: '1', tersediawanita: '1' },
  { kodeKelas: '2', koderuang: 'K201', namaruang: 'Ruang Kelas 2 Anggrek', kapasitas: '4', tersedia: '4', tersediapria: '2', tersediawanita: '2' },
  { kodeKelas: '3', koderuang: 'K301', namaruang: 'Ruang Kelas 3 Flamboyan', kapasitas: '6', tersedia: '6', tersediapria: '3', tersediawanita: '3' },
  { kodeKelas: 'ICU', koderuang: 'ICU1', namaruang: 'Ruang ICU', kapasitas: '4', tersedia: '4', tersediapria: '2', tersediawanita: '2' },
  { kodeKelas: 'IGD', koderuang: 'IGD1', namaruang: 'Bed Observasi IGD', kapasitas: '10', tersedia: '10', tersediapria: '5', tersediawanita: '5' }
];

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    // Clear existing data
    await Kodepolis.deleteMany({});
    console.log('Kodepolis data cleared.');
    await Nakes.deleteMany({});
    console.log('Nakes data cleared.');
    await Tarif.deleteMany({});
    console.log('Tarif data cleared.');
    await Ruangan.deleteMany({});
    console.log('Ruangan data cleared.');

    // Insert new data
    await Kodepolis.insertMany(kodepolisData);
    console.log('Kodepolis data seeded successfully!');

    const now = new Date().toISOString();
    const mappedNakesData = nakesData.map(n => ({ ...n, tglInput: now }));
    await Nakes.insertMany(mappedNakesData);
    console.log('Nakes data seeded successfully!');

    const mappedTarifData = tarifData.map(t => ({ ...t, tglInput: now }));
    await Tarif.insertMany(mappedTarifData);
    console.log('Tarif data seeded successfully!');

    const mappedRuanganData = ruanganData.map(r => ({ ...r, tglInput: now }));
    await Ruangan.insertMany(mappedRuanganData);
    console.log('Ruangan data seeded successfully!');

    console.log('All master data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Ensure database connection is established before running seed
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected. Starting seed...');
  seedData();
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
