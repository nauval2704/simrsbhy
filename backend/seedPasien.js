const mongoose = require('mongoose');
const Pasien = require('./app/api/models/pasien');
const moment = require('moment');

// Connect to the database using your existing config
require('./config/database');

const generateRandomNumber = (length) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

const dummyPatients = [
  {
    norm: '000001',
    nama: 'Budi Santoso',
    nik: '110101' + generateRandomNumber(10),
    nobpjs: '000' + generateRandomNumber(10),
    notelp: '0812' + generateRandomNumber(8),
    tempatlahir: 'Banda Aceh',
    tgllahir: '1985-05-15',
    sex: 'L',
    agama: 'Islam',
    alamat: 'Jl. Merdeka No. 1, Banda Aceh',
  },
  {
    norm: '000002',
    nama: 'Siti Aminah',
    nik: '110102' + generateRandomNumber(10),
    nobpjs: '000' + generateRandomNumber(10),
    notelp: '0852' + generateRandomNumber(8),
    tempatlahir: 'Meulaboh',
    tgllahir: '1990-10-20',
    sex: 'P',
    agama: 'Islam',
    alamat: 'Jl. Teuku Umar No. 45, Meulaboh',
  },
  {
    norm: '000003',
    nama: 'Andi Saputra',
    nik: '110103' + generateRandomNumber(10),
    nobpjs: '000' + generateRandomNumber(10),
    notelp: '0813' + generateRandomNumber(8),
    tempatlahir: 'Lhokseumawe',
    tgllahir: '1978-02-08',
    sex: 'L',
    agama: 'Islam',
    alamat: 'Jl. Sudirman No. 12, Lhokseumawe',
  },
  {
    norm: '000004',
    nama: 'Rina Wijaya',
    nik: '110104' + generateRandomNumber(10),
    nobpjs: '000' + generateRandomNumber(10),
    notelp: '0821' + generateRandomNumber(8),
    tempatlahir: 'Sigli',
    tgllahir: '2000-12-01',
    sex: 'P',
    agama: 'Islam',
    alamat: 'Jl. Diponegoro No. 8, Sigli',
  },
  {
    norm: '000005',
    nama: 'Agus Setiawan',
    nik: '110105' + generateRandomNumber(10),
    nobpjs: '000' + generateRandomNumber(10),
    notelp: '0822' + generateRandomNumber(8),
    tempatlahir: 'Langsa',
    tgllahir: '1995-07-25',
    sex: 'L',
    agama: 'Islam',
    alamat: 'Jl. Ahmad Yani No. 99, Langsa',
  }
];

async function seedPatients() {
  try {
    const tglinput = moment().format('YYYY-MM-DD HH:mm:ss');
    
    for (let patientData of dummyPatients) {
      // Check if patient already exists by NORM
      const existingPatient = await Pasien.findOne({ norm: patientData.norm });
      
      if (!existingPatient) {
        const patient = new Pasien({
          ...patientData,
          tglinput: tglinput,
          user: 'admin@admin.com'
        });
        await patient.save();
        console.log(`Seeded: ${patient.nama} (NORM: ${patient.norm})`);
      } else {
        console.log(`Skipped: ${patientData.nama} (NORM: ${patientData.norm} already exists)`);
      }
    }

    console.log('✅ 5 Dummy Patients seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
    process.exit(1);
  }
}

// Wait a second for Mongoose to establish connection before running
setTimeout(seedPatients, 1000);
