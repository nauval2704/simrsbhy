const express = require("express");
const router = express.Router();
const simrsController = require("../app/api/controllers/vclaim");
router.get("/api/diagnosa/:diagnosa", simrsController.vclaimApiDiagnosa);
router.get("/api/poli/:poli", simrsController.vclaimApiPoli);
router.get(
  "/api/poliRujukan/kode/:kode/tanggal/:tanggal",
  simrsController.vclaimApiPoliRujukan
);
router.get("/api/faskes/:nama/:jenis", simrsController.vclaimApiFaskes);
router.get("/api/dpjp/:jenis/:tgl/:kode", simrsController.vclaimApiDpjp);
router.get(
  "/api/fingerprint/:noKartu/tgl/:tgl",
  simrsController.vclaimApiFingerPrint
);
router.get(
  "/api/fingerprint/list/tgl/:tgl",
  simrsController.vclaimApiListFingerPrint
);
router.get("/api/propinsi", simrsController.vclaimApiPropinsi);
router.get("/api/kabupaten/:kode", simrsController.vclaimApiKabupaten);
router.get("/api/kecamatan/:kode", simrsController.vclaimApiKecamatan);
router.get("/api/tindakan/:kode", simrsController.vclaimApiProcedure);
router.get("/api/kelasrawat", simrsController.vclaimApiKelasRawat);
router.get("/api/dokter/:nama", simrsController.vclaimApiDokter);
router.get("/api/spesialistik", simrsController.vclaimApiSpesialistik);
router.get("/api/ruangrawat", simrsController.vclaimApiRuangRawat);
router.get("/api/carakeluar", simrsController.vclaimApiCaraKeluar);
router.get("/api/obatprb/:nama", simrsController.vclaimApiObatPrb);
router.get("/api/diagnosaprb", simrsController.vclaimApiDiagnosaPrb);
router.get("/api/pascapulang", simrsController.vclaimApiPascaPulang);
router.post("/api/tanggalpulang", simrsController.vclaimApiTanggalPulang);
router.get(
  "/api/peserta/nokartu/:nokartu/tglsep/:tgl",
  simrsController.vclaimApiPesertaNokartu
);
router.get(
  "/api/peserta/nik/:nik/tglsep/:tgl",
  simrsController.vclaimApiPesertaNik
);
router.post("/api/SEP/1.1/insert", simrsController.vclaimApiSep11Insert);
router.post("/api/SEP/1.1/update", simrsController.vclaimApiSep11Update);
router.post("/api/SEP/1.1/delete", simrsController.vclaimApiSep11Delete);
router.post(
  "/api/SEP/Internal/delete",
  simrsController.vclaimApiSepInternalDelete
);
router.get("/api/SEP/1.1/cari/:sep", simrsController.vclaimApiSep11Cari);
router.get(
  "/api/SEP/Internal/cari/:sep",
  simrsController.vclaimApiSepInternalCari
);
router.get("/api/SEP/Internal/:noSep", simrsController.vclaimApiSepInternal);

router.post(
  "/api/suratkontrol/insert",
  simrsController.vclaimApiSuratKontrolInsert
);
router.get(
  "/api/suratkontrol/cari/:noSuratKontrol",
  simrsController.vclaimApiSuratKontrolCari
);
router.post("/api/SPRI/insert", simrsController.vclaimApiSpriInsert);
router.post("/api/SPRI/delete", simrsController.vclaimApiSpriDelete);
router.post("/api/SPRI/update", simrsController.vclaimApiSpriUpdate);
router.post("/api/update/SPRI", simrsController.vclaimApiUpdateSpri);
router.get(
  "/api/SPRI/bulan/:bulan/tahun/:tahun/nokartu/:nokartu/filter/:filter",
  simrsController.vclaimApiSpriCariNokartu
);
router.get(
  "/api/SPRI/RencanaKontrol/ListSpesialistik/JnsKontrol/:jenis/nomor/:nomor/TglRencanaKontrol/:tanggal",
  simrsController.vclaimApiSpriListPoli
);
router.get(
  "/api/SPRI/RencanaKontrol/JadwalPraktekDokter/JnsKontrol/:jenis/KdPoli/:kode/TglRencanaKontrol/:tanggal",
  simrsController.vclaimApiSpriListDokter
);

router.get(
  "/api/jasaraharja/suplesi/:nokartu/tglpelayanan/:tgl",
  simrsController.vclaimApiJasaRaharjaSuplesi
);
router.post("/api/pengajuansep", simrsController.vclaimApiPengajuanSep);
router.post("/api/approvalsep", simrsController.vclaimApiApprovalSep);
router.post("/api/updtglplg", simrsController.vclaimApiSepUpdtglplg);
router.get("/api/sepcbg/:nosep", simrsController.vclaimApiSepCbg);
router.get("/api/carirujukan/:norujukan", simrsController.vclaimApiCariRujukan);
router.get(
  "/api/carirujukanrs/:norujukan",
  simrsController.vclaimApiCariRujukanRs
);
router.get(
  "/api/listrujukanrs/awal/:tglAwal/akhir/:tglAkhir",
  simrsController.vclaimApiListRujukanRs
);
router.get(
  "/api/listsuratkontrol/awal/:tglAwal/akhir/:tglAkhir/filter/:filter",
  simrsController.vclaimApiListSuratKontrol
);
router.get(
  "/api/listRujukanKhusus/bulan/:bulan/tahun/:tahun/",
  simrsController.vclaimApiListRujukanKhusus
);
router.get(
  "/api/datasuratkontrol/nosurat/:nosurat",
  simrsController.vclaimApiDataSuratKontrol
);
router.get("/api/rujukanrs/:noRujukan", simrsController.vclaimApiRujukanRs);
router.get(
  "/api/rujukan/keluar/:noRujukan",
  simrsController.vclaimApiRujukanPeserta
);
router.get(
  "/api/rujukan/nokartu/:nokartu",
  simrsController.vclaimApiCariRujukanNokartu
);
router.get(
  "/api/rujukan/list/nokarturs/:nokartu",
  simrsController.vclaimApiCariListRujukanNokartuRs
);
router.get(
  "/api/rujukan/list/nokartu/:nokartu",
  simrsController.vclaimApiCariListRujukanNokartu
);
router.post("/api/insertrujukan", simrsController.vclaimApiRujukanInsert);
router.post("/api/insertrujukan2", simrsController.vclaimApiRujukanInsert2);
router.post("/api/rujukan/update", simrsController.vclaimApiRujukanUpdate);
router.get("/api/listsarana/:kode", simrsController.vclaimApiListSarana);
router.post("/api/rujukan/delete", simrsController.vclaimApiRujukanDelete);
router.post(
  "/api/perpanjanganrujukan",
  simrsController.vclaimApiPerpanjanganRujukan
);
router.post(
  "/api/hapusperpanjanganrujukan",
  simrsController.vclaimApiHapusPerpanjanganRujukan
);
router.post("/api/lpk/insert", simrsController.vclaimApiLpkInsert);
router.post("/api/lpk/update", simrsController.vclaimApiLpkUpdate);
router.post("/api/lpk/delete", simrsController.vclaimApiLpkDelete);
router.get(
  "/api/lpk/data/tglmasuk/:tglmasuk/jenispelayanan/:jenis",
  simrsController.vclaimApiLpkData
);
router.get(
  "/api/monitoring/kunjungan/tanggal/:tgl/jenispelayanan/:jenis",
  simrsController.vclaimApiMonitoringKunjungan
);
router.get(
  "/api/monitoring/klaim/tanggal/:tgl/jenispelayanan/:jenis/status/:status",
  simrsController.vclaimApiMonitoringKlaim
);
router.get(
  "/api/monitoring/historipelayanan/nokartu/:nokartu/tglawal/:tglawal/tglakhir/:tglakhir",
  simrsController.vclaimApiMonitoringHistori
);
router.get(
  "/api/monitoringjasaraharja/tglmulai/:tglmulai/tglakhir/:tglakhir",
  simrsController.vclaimApiMonitoringJasaRaharja
);
router.get("/api/kamar/referensi", simrsController.vclaimApiKamarReferensiProd);
router.get("/api/kamar/tersedia", simrsController.vclaimApiKamarTersediaProd);
router.get("/api/kamar/local", simrsController.kamarLocal);
router.post("/api/kamar/create", simrsController.vclaimApiKamarCreateProd);
router.post("/api/kamar/update", simrsController.vclaimApiKamarUpdate);
router.post("/api/kamar/delete", simrsController.vclaimApiKamarDelete);
router.post("/api/prb/insert", simrsController.vclaimApiPrbInsert);
router.get("/api/rujukan1/:nokartu", simrsController.vclaimApiCariRujukan1Nokartu);
module.exports = router;
