import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { getStandardGridCSS, hospitalHeaderTableRow, signatureFooterRows, footerLabel, createSuratShell, bindSuratPrintButton } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-pengkajian-awal-poli-placeholder");
    ɵelementEnd();
  }
}

var PengkajianAwalPoliComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.draftData = null;
      this.formData = {};

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    fetchPatient() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.patient = res[0];
            }
            this.loading = false;
            this.fetchDraft();
          },
          error: () => {
            this.loading = false;
            this.renderView();
          },
        });
    }

    fetchDraft() {
      this.http
        .get(i.apiUrl + "/simrsba/pengkajian-awal-poli/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.data && res.data.formData) {
              this.draftData = res.data.formData;
            }
            this.renderView();
          },
          error: () => {
            this.renderView();
          },
        });
    }

    handleSubmit() {
      const root = document.querySelector("app-pengkajian-awal-poli-placeholder");
      const btn = (root && root.querySelector("#btn-save-poli")) || document.getElementById("btn-save-poli");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Menyimpan...';
      }

      const getVal = (id) => {
        const el = (root && root.querySelector("#" + id)) || document.getElementById(id);
        if (!el) return "";
        if (el.type === "checkbox") return el.checked ? el.value : "";
        return el.value || "";
      };

      const getChecked = (name) => {
        const els = (root && root.querySelectorAll('input[name="' + name + '"]:checked')) || document.querySelectorAll('input[name="' + name + '"]:checked');
        return Array.from(els).map((e) => e.value);
      };

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        namaPasien: this.patient?.nama || "",
        dpjp: this.patient?.dokterDpjp || this.patient?.dpjp || "",
        formData: {
          ...this.formData,
          asalPasien: getVal("f-asal-pasien"),
          asalPasienLain: getVal("f-asal-pasien-lain"),
          keluhanUtama: getVal("f-keluhan-utama"),
          riwayatPengobatan: getVal("f-riwayat-pengobatan"),
          alergiObat: getVal("f-alergi-obat"),
          namaAlergiObat: getVal("f-nama-alergi-obat"),
          riwayatPenyakitSekarang: getVal("f-riwayat-penyakit-sekarang"),
          riwayatPenyakitDahulu: getVal("f-riwayat-penyakit-dahulu"),
          ku: getVal("f-ku"),
          td: getVal("f-td"),
          nadi: getVal("f-nadi"),
          suhu: getVal("f-suhu"),
          nafas: getVal("f-nafas"),
          bb: getVal("f-bb"),
          gcs: getVal("f-gcs"),
          riwayatPsikososial: getVal("f-riwayat-psikososial"),
          haidTerakhir: getVal("f-haid-terakhir"),
          hamilStatus: getVal("f-hamil-status"),
          hamilUsia: getVal("f-hamil-usia"),
          pemeriksaanPenunjang: getVal("f-pemeriksaan-penunjang"),
          pemeriksaanFisik: getVal("f-pemeriksaan-fisik"),
          statusFungsional: getVal("f-fungsional"),
          nyeri: getVal("f-nyeri"),
          nyeriFaktorPemicu: getVal("f-nyeri-pemicu"),
          nyeriFaktorKurang: getVal("f-nyeri-kurang"),
          nyeriFrekuensi: getVal("f-nyeri-frekuensi"),
          nyeriLokasi: getVal("f-nyeri-lokasi"),
          nyeriMenjalar: getVal("f-nyeri-menjalar"),
          nyeriLama: getVal("f-nyeri-lama"),
          nyeriSkala: getVal("f-nyeri-skala"),
          nyeriP: getVal("f-nyeri-p"),
          nyeriQ: getVal("f-nyeri-q"),
          nyeriR: getVal("f-nyeri-r"),
          nyeriS: getVal("f-nyeri-s"),
          nyeriT: getVal("f-nyeri-t"),
          gizianakA1: getVal("f-gizi-anak-a1"),
          gizianakA2: getVal("f-gizi-anak-a2"),
          gizianakA3: getVal("f-gizi-anak-a3"),
          gizianakA4: getVal("f-gizi-anak-a4"),
          gizianakTotal: getVal("f-gizi-anak-total"),
          giziDewasaD1: getVal("f-gizi-dewasa-d1"),
          giziDewasaD2: getVal("f-gizi-dewasa-d2"),
          giziDewasaTotal: getVal("f-gizi-dewasa-total"),
          diagnosisKerja: getVal("f-diagnosis-kerja"),
          permasalahanMedis: getVal("f-permasalahan-medis"),
          diagnosisKeperawatan: getVal("f-diagnosis-keperawatan"),
          terapiTindakan: getVal("f-terapi-tindakan"),
          tindakLanjut: getVal("f-tindak-lanjut"),
          tindakLanjutKontrolTgl: getVal("f-tl-kontrol-tgl"),
          tindakLanjutKontrolKe: getVal("f-tl-kontrol-ke"),
          tindakLanjutDirujukKe: getVal("f-tl-dirujuk-ke"),
          tindakLanjutDirujukJenis: getChecked("f-tl-dirujuk-jenis"),
          tindakLanjutRawatInapIndikasi: getVal("f-tl-rawat-indikasi"),
          kondisiKUKeluar: getVal("f-kondisi-ku-keluar"),
          kondisiKesadaran: getVal("f-kondisi-kesadaran"),
          kondisiGCS: getVal("f-kondisi-gcs"),
          kondisiTD: getVal("f-kondisi-td"),
          kondisiTandaVital: getVal("f-kondisi-tv"),
          kondisiSuhu: getVal("f-kondisi-suhu"),
          kondisiNadi: getVal("f-kondisi-nadi"),
          kondisiNafas: getVal("f-kondisi-nafas"),
          kondisiTgl: getVal("f-kondisi-tgl"),
          kondisiPukul: getVal("f-kondisi-pukul"),
          keluarPasien: getVal("f-keluar-pasien"),
          perawat: getVal("f-perawat"),
          dokter: getVal("f-dokter"),
        },
      };

      this.http
        .post(i.apiUrl + "/simrsba/pengkajian-awal-poli", payload)
        .subscribe({
          next: () => {
            this.toastr.success("Pengkajian Awal Poli berhasil disimpan", "Sukses");
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<i class="bi bi-check-circle"></i> Tersimpan!';
              setTimeout(() => {
                btn.innerHTML = '<i class="bi bi-save"></i> Simpan Pengkajian Awal Poli';
              }, 2000);
            }
          },
          error: () => {
            this.toastr.error("Gagal menyimpan Pengkajian Awal Poli", "Error");
            if (btn) {
              btn.disabled = false;
              btn.innerHTML = '<i class="bi bi-save"></i> Simpan Pengkajian Awal Poli';
            }
          },
        });
    }

    showToast(type, message) {
      const toast = document.createElement("div");
      toast.style.cssText = "position:fixed;top:20px;right:20px;z-index:99999;min-width:320px;";
      toast.innerHTML =
        '<div class="alert alert-' +
        type +
        ' shadow d-flex align-items-center gap-2 py-2">' +
        '<i class="bi bi-' +
        (type === "success"
          ? "check-circle-fill"
          : type === "warning"
            ? "exclamation-triangle-fill"
            : "x-circle-fill") +
        ' fs-5"></i>' +
        "<div>" +
        message +
        "</div>" +
        '<button class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>' +
        "</div>";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }

    populateDraft(draft) {
      if (!draft) return;
      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (!el || val === undefined || val === null) return;
        if (el.type === "checkbox") {
          el.checked = el.value === val || val === true;
        } else {
          el.value = val;
        }
      };
      const setChecked = (name, vals) => {
        if (!Array.isArray(vals)) return;
        document.querySelectorAll('input[name="' + name + '"]').forEach((el) => {
          el.checked = vals.includes(el.value);
        });
      };

      setVal("f-asal-pasien", draft.asalPasien);
      setVal("f-asal-pasien-lain", draft.asalPasienLain);
      setVal("f-keluhan-utama", draft.keluhanUtama);
      setVal("f-riwayat-pengobatan", draft.riwayatPengobatan);
      setVal("f-alergi-obat", draft.alergiObat);
      setVal("f-nama-alergi-obat", draft.namaAlergiObat);
      setVal("f-riwayat-penyakit-sekarang", draft.riwayatPenyakitSekarang);
      setVal("f-riwayat-penyakit-dahulu", draft.riwayatPenyakitDahulu);
      setVal("f-ku", draft.ku);
      setVal("f-td", draft.td);
      setVal("f-nadi", draft.nadi);
      setVal("f-suhu", draft.suhu);
      setVal("f-nafas", draft.nafas);
      setVal("f-bb", draft.bb);
      setVal("f-gcs", draft.gcs);
      setVal("f-riwayat-psikososial", draft.riwayatPsikososial);
      setVal("f-haid-terakhir", draft.haidTerakhir);
      setVal("f-hamil-status", draft.hamilStatus);
      setVal("f-hamil-usia", draft.hamilUsia);
      setVal("f-pemeriksaan-penunjang", draft.pemeriksaanPenunjang);
      setVal("f-pemeriksaan-fisik", draft.pemeriksaanFisik);
      setVal("f-fungsional", draft.statusFungsional);
      setVal("f-nyeri", draft.nyeri);
      setVal("f-nyeri-pemicu", draft.nyeriFaktorPemicu);
      setVal("f-nyeri-kurang", draft.nyeriFaktorKurang);
      setVal("f-nyeri-frekuensi", draft.nyeriFrekuensi);
      setVal("f-nyeri-lokasi", draft.nyeriLokasi);
      setVal("f-nyeri-menjalar", draft.nyeriMenjalar);
      setVal("f-nyeri-lama", draft.nyeriLama);
      setVal("f-nyeri-skala", draft.nyeriSkala);
      setVal("f-nyeri-p", draft.nyeriP);
      setVal("f-nyeri-q", draft.nyeriQ);
      setVal("f-nyeri-r", draft.nyeriR);
      setVal("f-nyeri-s", draft.nyeriS);
      setVal("f-nyeri-t", draft.nyeriT);
      setVal("f-gizi-anak-a1", draft.gizianakA1);
      setVal("f-gizi-anak-a2", draft.gizianakA2);
      setVal("f-gizi-anak-a3", draft.gizianakA3);
      setVal("f-gizi-anak-a4", draft.gizianakA4);
      setVal("f-gizi-anak-total", draft.gizianakTotal);
      setVal("f-gizi-dewasa-d1", draft.giziDewasaD1);
      setVal("f-gizi-dewasa-d2", draft.giziDewasaD2);
      setVal("f-gizi-dewasa-total", draft.giziDewasaTotal);
      setVal("f-diagnosis-kerja", draft.diagnosisKerja);
      setVal("f-permasalahan-medis", draft.permasalahanMedis);
      setVal("f-diagnosis-keperawatan", draft.diagnosisKeperawatan);
      setVal("f-terapi-tindakan", draft.terapiTindakan);
      setVal("f-tindak-lanjut", draft.tindakLanjut);
      setVal("f-tl-kontrol-tgl", draft.tindakLanjutKontrolTgl);
      setVal("f-tl-kontrol-ke", draft.tindakLanjutKontrolKe);
      setVal("f-tl-dirujuk-ke", draft.tindakLanjutDirujukKe);
      setChecked("f-tl-dirujuk-jenis", draft.tindakLanjutDirujukJenis);
      setVal("f-tl-rawat-indikasi", draft.tindakLanjutRawatInapIndikasi);
      setVal("f-kondisi-ku-keluar", draft.kondisiKUKeluar);
      setVal("f-kondisi-kesadaran", draft.kondisiKesadaran);
      setVal("f-kondisi-gcs", draft.kondisiGCS);
      setVal("f-kondisi-td", draft.kondisiTD);
      setVal("f-kondisi-tv", draft.kondisiTandaVital);
      setVal("f-kondisi-suhu", draft.kondisiSuhu);
      setVal("f-kondisi-nadi", draft.kondisiNadi);
      setVal("f-kondisi-nafas", draft.kondisiNafas);
      setVal("f-kondisi-tgl", draft.kondisiTgl);
      setVal("f-kondisi-pukul", draft.kondisiPukul);
      setVal("f-keluar-pasien", draft.keluarPasien);
      setVal("f-perawat", draft.perawat);
      setVal("f-dokter", draft.dokter);

      const alergiStatus = draft.alergiObat;
      const alergiDetail = document.getElementById("f-alergi-obat-detail");
      if (alergiDetail) {
        alergiDetail.classList.toggle("d-none", alergiStatus !== "Ya");
      }
      if (draft.canvasAnatomi) this.formData.canvasAnatomi = draft.canvasAnatomi;
      if (draft.sigKeluarga) this.formData.sigKeluarga = draft.sigKeluarga;
      if (draft.sigPerawat) this.formData.sigPerawat = draft.sigPerawat;
      if (draft.sigDokter) this.formData.sigDokter = draft.sigDokter;

      const tindakLanjutVal = draft.tindakLanjut;
      const tlKontrol = document.getElementById("tl-kontrol");
      const tlDirujuk = document.getElementById("tl-dirujuk");
      const tlRawatInap = document.getElementById("tl-rawat-inap");
      if (tlKontrol) tlKontrol.classList.toggle("d-none", tindakLanjutVal !== "Kontrol");
      if (tlDirujuk) tlDirujuk.classList.toggle("d-none", tindakLanjutVal !== "Dirujuk");
      if (tlRawatInap) tlRawatInap.classList.toggle("d-none", tindakLanjutVal !== "Rawat Inap");
    }

    syncToPreview() {
      const getVal = (id) => {
        const el = document.getElementById(id);
        if (!el) return "";
        if (el.type === "checkbox") return el.checked ? el.value : "";
        return el.value || "";
      };
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val || "";
      };
      const setCheckedMark = (id, condition) => {
        const el = document.getElementById(id);
        if (el) el.textContent = condition ? "☑" : "☐";
      };

      const asalPasien = getVal("f-asal-pasien");
      const asalPasienLain = getVal("f-asal-pasien-lain");
      setCheckedMark("p-asal-umum", asalPasien === "Umum");
      setCheckedMark("p-asal-yankes", asalPasien === "yankes");
      setCheckedMark("p-asal-bpjs", asalPasien === "BPJS");
      setCheckedMark("p-asal-mandiri", asalPasien === "Mandiri");
      setCheckedMark("p-asal-jkn", asalPasien === "JKN");
      setCheckedMark("p-asal-lainnya", asalPasien === "Lainnya");
      setCheckedMark("p-asal-asuransi", asalPasien === "Asuransi");
      setText("p-asal-lain-detail", asalPasien === "Lainnya" ? asalPasienLain : "");

      setText("p-keluhan-utama", getVal("f-keluhan-utama"));
      setText("p-riwayat-pengobatan", getVal("f-riwayat-pengobatan"));

      const alergiObat = getVal("f-alergi-obat");
      setCheckedMark("p-alergi-tidak", alergiObat === "Tidak");
      setCheckedMark("p-alergi-ya", alergiObat === "Ya");
      setText("p-nama-alergi-obat", alergiObat === "Ya" ? getVal("f-nama-alergi-obat") : "");

      setText("p-riwayat-penyakit-sekarang", getVal("f-riwayat-penyakit-sekarang"));
      setText("p-riwayat-penyakit-dahulu", getVal("f-riwayat-penyakit-dahulu"));

      setText("p-ku", getVal("f-ku"));
      setText("p-td", getVal("f-td"));
      setText("p-nadi", getVal("f-nadi"));
      setText("p-suhu", getVal("f-suhu"));
      setText("p-nafas", getVal("f-nafas"));
      setText("p-bb", getVal("f-bb"));
      setText("p-gcs", getVal("f-gcs"));

      setText("p-riwayat-psikososial", getVal("f-riwayat-psikososial"));
      setText("p-haid-terakhir", getVal("f-haid-terakhir"));

      const hamilStatus = getVal("f-hamil-status");
      setCheckedMark("p-hamil-tidak", hamilStatus === "Tidak");
      setCheckedMark("p-hamil-ya", hamilStatus === "Ya");
      setText("p-hamil-usia", hamilStatus === "Ya" ? getVal("f-hamil-usia") : "");

      setText("p-pemeriksaan-penunjang", getVal("f-pemeriksaan-penunjang"));
      setText("p-pemeriksaan-fisik", getVal("f-pemeriksaan-fisik"));

      const fungsional = getVal("f-fungsional");
      setCheckedMark("p-fungsional-mandiri", fungsional === "Mandiri");
      setCheckedMark("p-fungsional-intermiten", fungsional === "Intermiten");
      setCheckedMark("p-fungsional-total", fungsional === "Ketergantungan Total");

      const nyeriStatus = getVal("f-nyeri");
      setCheckedMark("p-nyeri-tidak", nyeriStatus === "tidak");
      setCheckedMark("p-nyeri-ya", nyeriStatus === "ya");
      setText("p-nyeri-pemicu", getVal("f-nyeri-pemicu"));
      setText("p-nyeri-kurang", getVal("f-nyeri-kurang"));
      setText("p-nyeri-frekuensi", getVal("f-nyeri-frekuensi"));
      setText("p-nyeri-lokasi", getVal("f-nyeri-lokasi"));
      setText("p-nyeri-menjalar", getVal("f-nyeri-menjalar"));
      setText("p-nyeri-lama", getVal("f-nyeri-lama"));
      setText("p-nyeri-skala", getVal("f-nyeri-skala"));
      setText("p-nyeri-p", getVal("f-nyeri-p"));
      setText("p-nyeri-q", getVal("f-nyeri-q"));
      setText("p-nyeri-r", getVal("f-nyeri-r"));
      setText("p-nyeri-s", getVal("f-nyeri-s"));
      setText("p-nyeri-t", getVal("f-nyeri-t"));

      const gizianakA1 = getVal("f-gizi-anak-a1");
      setCheckedMark("p-gizi-anak-a1-ya", gizianakA1 === "1");
      setCheckedMark("p-gizi-anak-a1-tidak", gizianakA1 === "0");
      const gizianakA2 = getVal("f-gizi-anak-a2");
      setCheckedMark("p-gizi-anak-a2-ya", gizianakA2 === "2");
      setCheckedMark("p-gizi-anak-a2-tidak", gizianakA2 === "0");
      const gizianakA3 = getVal("f-gizi-anak-a3");
      setCheckedMark("p-gizi-anak-a3-ya", gizianakA3 === "1");
      setCheckedMark("p-gizi-anak-a3-tidak", gizianakA3 === "0");
      const gizianakA4 = getVal("f-gizi-anak-a4");
      setCheckedMark("p-gizi-anak-a4-ya", gizianakA4 === "2");
      setCheckedMark("p-gizi-anak-a4-tidak", gizianakA4 === "0");
      setText("p-gizi-anak-total", getVal("f-gizi-anak-total"));

      const giziDewasaD1 = getVal("f-gizi-dewasa-d1");
      setCheckedMark("p-gizi-dewasa-d1-ya", giziDewasaD1 === "2");
      setCheckedMark("p-gizi-dewasa-d1-tidak", giziDewasaD1 === "0");
      const giziDewasaD2 = getVal("f-gizi-dewasa-d2");
      setCheckedMark("p-gizi-dewasa-d2-ya", giziDewasaD2 === "2");
      setCheckedMark("p-gizi-dewasa-d2-tidak", giziDewasaD2 === "0");
      setText("p-gizi-dewasa-total", getVal("f-gizi-dewasa-total"));

      setText("p-diagnosis-kerja", getVal("f-diagnosis-kerja"));
      setText("p-permasalahan-medis", getVal("f-permasalahan-medis"));
      setText("p-diagnosis-keperawatan", getVal("f-diagnosis-keperawatan"));
      setText("p-terapi-tindakan", getVal("f-terapi-tindakan"));

      const tindakLanjut = getVal("f-tindak-lanjut");
      setCheckedMark("p-tl-kontrol", tindakLanjut === "Kontrol");
      setText("p-tl-kontrol-tgl", tindakLanjut === "Kontrol" ? getVal("f-tl-kontrol-tgl") : "");
      setText("p-tl-kontrol-ke", tindakLanjut === "Kontrol" ? getVal("f-tl-kontrol-ke") : "");
      setCheckedMark("p-tl-dirujuk", tindakLanjut === "Dirujuk");
      setText("p-tl-dirujuk-ke", tindakLanjut === "Dirujuk" ? getVal("f-tl-dirujuk-ke") : "");
      const dirujukJenis = tindakLanjut === "Dirujuk"
        ? Array.from(document.querySelectorAll('input[name="f-tl-dirujuk-jenis"]:checked')).map((e) => e.value)
        : [];
      setCheckedMark("p-tl-dirujuk-preventif", dirujukJenis.includes("preventif"));
      setCheckedMark("p-tl-dirujuk-kuratif", dirujukJenis.includes("kuratif"));
      setCheckedMark("p-tl-dirujuk-rehabilitatif", dirujukJenis.includes("rehabilitatif"));
      setCheckedMark("p-tl-dirujuk-paliatif", dirujukJenis.includes("paliatif"));
      setCheckedMark("p-tl-rawat-inap", tindakLanjut === "Rawat Inap");
      setText("p-tl-rawat-indikasi", tindakLanjut === "Rawat Inap" ? getVal("f-tl-rawat-indikasi") : "");

      setText("p-kondisi-ku-keluar", getVal("f-kondisi-ku-keluar"));
      setText("p-kondisi-kesadaran", getVal("f-kondisi-kesadaran"));
      setText("p-kondisi-gcs", getVal("f-kondisi-gcs"));
      setText("p-kondisi-td", getVal("f-kondisi-td"));
      setText("p-kondisi-tv", getVal("f-kondisi-tv"));
      setText("p-kondisi-suhu", getVal("f-kondisi-suhu"));
      setText("p-kondisi-nadi", getVal("f-kondisi-nadi"));
      setText("p-kondisi-nafas", getVal("f-kondisi-nafas"));
      setText("p-kondisi-tgl", getVal("f-kondisi-tgl"));
      setText("p-kondisi-pukul", getVal("f-kondisi-pukul"));
      setText("p-keluar-pasien", getVal("f-keluar-pasien"));
      setText("p-perawat", getVal("f-perawat"));
      setText("p-dokter", getVal("f-dokter"));

      const root = document.querySelector("app-pengkajian-awal-poli-placeholder");
      const anatomiImg = (root && root.querySelector("#p-anatomi-img")) || document.getElementById("p-anatomi-img");
      if (anatomiImg) {
        anatomiImg.src = (this.formData && this.formData.canvasAnatomi) || "assets/img/anatomi (front & back).jpg";
      }

      const setSigImg = (imgId, dataUrl) => {
        const img = (root && root.querySelector("#" + imgId)) || document.getElementById(imgId);
        if (!img) return;
        if (dataUrl) {
          img.src = dataUrl;
          img.style.display = "block";
        } else {
          img.src = "";
          img.style.display = "none";
        }
      };

      setSigImg("p-keluar-pasien-img", this.formData && this.formData.sigKeluarga);
      setSigImg("p-perawat-img", this.formData && this.formData.sigPerawat);
      setSigImg("p-dokter-img", this.formData && this.formData.sigDokter);
    }

    renderView() {
      const root = document.querySelector("app-pengkajian-awal-poli-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div style="display:flex;justify-content:center;align-items:center;min-height:300px;font-family:Arial;color:#888;">Memuat data pasien...</div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || "-";
      const kelamin = p.kelamin || "-";
      const tglMasukRaw = p.tglInput || "-";
      let tglMasukDate = "-";
      let tglMasukTime = "";
      if (tglMasukRaw !== "-" && tglMasukRaw.length >= 10) {
        tglMasukDate = tglMasukRaw.substring(0, 10);
        tglMasukTime = tglMasukRaw.substring(11);
      } else if (tglMasukRaw !== "-") {
        tglMasukDate = tglMasukRaw;
      }

      const self = this;

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "surat/surat.css";
        document.head.appendChild(link);
      }

      const inputContent = `
      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="${tglLahir} (${kelamin})" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="${p.dokterDpjp || p.dpjp || '-'}" disabled style="background:#e9ecef;"></div></div>
          </div>
        </div>
      </div>

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-file-earmark-medical me-1"></i> Formulir Pengkajian Awal Poliklinik Rawat Jalan</div>
        <div class="card-body p-3">
          <div class="accordion" id="accordionPoli">

            <!-- Section 1 -->
            <div class="accordion-item mb-2 border rounded shadow-sm">
              <h2 class="accordion-header" id="heading_sec_1">
                <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_1" aria-expanded="true" aria-controls="collapse_sec_1">
                  <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-journal-medical me-2 text-primary"></i> 1. Anamnesis, Asal Pasien &amp; Riwayat Penyakit</span>
                </button>
              </h2>
              <div id="collapse_sec_1" class="accordion-collapse collapse show" aria-labelledby="heading_sec_1" data-bs-parent="#accordionPoli">
                <div class="accordion-body bg-white p-3">
                  <div class="row g-2 mb-2">
                    <div class="col-md-4">
                      <label class="f-label">Asal Pasien</label>
                      <select class="f-input" id="f-asal-pasien">
                        <option value="">- Pilih Asal Pasien -</option>
                        <option value="Umum">Umum</option>
                        <option value="BPJS">BPJS</option>
                        <option value="JKN">JKN</option>
                        <option value="Asuransi">Asuransi</option>
                        <option value="yankes">yankes</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div class="col-md-8 d-none" id="f-asal-pasien-lain">
                      <label class="f-label">Asal Pasien Lainnya</label>
                      <input type="text" class="f-input" id="f-asal-pasien-lain" placeholder="Sebutkan asal pasien...">
                    </div>
                  </div>
                  <div class="row g-2 mb-2">
                    <div class="col-12">
                      <label class="f-label">Keluhan Utama (Auto/Allo Anamnesis)</label>
                      <textarea class="f-input" id="f-keluhan-utama" rows="2" placeholder="Keluhan utama pasien..."></textarea>
                    </div>
                    <div class="col-12">
                      <label class="f-label">Riwayat Pengobatan (Perawat)</label>
                      <textarea class="f-input" id="f-riwayat-pengobatan" rows="2" placeholder="Riwayat konsumsi obat..."></textarea>
                    </div>
                  </div>
                  <div class="row g-2 mb-2">
                    <div class="col-md-3">
                      <label class="f-label">Alergi Obat</label>
                      <select class="f-input" id="f-alergi-obat">
                        <option value="">- Pilih -</option>
                        <option value="Tidak">Tidak</option>
                        <option value="Ya">Ya</option>
                      </select>
                    </div>
                    <div class="col-md-9 d-none" id="f-alergi-obat-detail">
                      <label class="f-label">Nama Obat Penyebab Alergi</label>
                      <input type="text" class="f-input" id="f-nama-alergi-obat" placeholder="Nama obat...">
                    </div>
                  </div>
                  <div class="row g-2">
                    <div class="col-md-6">
                      <label class="f-label">Riwayat Penyakit Sekarang</label>
                      <textarea class="f-input" id="f-riwayat-penyakit-sekarang" rows="2" placeholder="Riwayat perjalanan penyakit sekarang..."></textarea>
                    </div>
                    <div class="col-md-6">
                      <label class="f-label">Riwayat Penyakit Dahulu</label>
                      <textarea class="f-input" id="f-riwayat-penyakit-dahulu" rows="2" placeholder="Riwayat penyakit dahulu..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2 -->
            <div class="accordion-item mb-2 border rounded shadow-sm">
              <h2 class="accordion-header" id="heading_sec_2">
                <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_2" aria-expanded="false" aria-controls="collapse_sec_2">
                  <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-heart-pulse me-2 text-primary"></i> 2. Tanda Vital, Psikososial &amp; Reproduksi</span>
                </button>
              </h2>
              <div id="collapse_sec_2" class="accordion-collapse collapse" aria-labelledby="heading_sec_2" data-bs-parent="#accordionPoli">
                <div class="accordion-body bg-white p-3">
                  <div class="row g-2 mb-2">
                    <div class="col-md-4"><label class="f-label">Keadaan Umum</label><input type="text" class="f-input" id="f-ku" placeholder="Baik / Sedang / Lemah"></div>
                    <div class="col-md-4"><label class="f-label">Tekanan Darah (mmHg)</label><input type="text" class="f-input" id="f-td" placeholder="120/80"></div>
                    <div class="col-md-4"><label class="f-label">Suhu (&deg;C)</label><input type="text" class="f-input" id="f-suhu" placeholder="36.5"></div>
                    <div class="col-md-3"><label class="f-label">Nadi (x/Menit)</label><input type="text" class="f-input" id="f-nadi" placeholder="80"></div>
                    <div class="col-md-3"><label class="f-label">Pernapasan (x/Menit)</label><input type="text" class="f-input" id="f-nafas" placeholder="20"></div>
                    <div class="col-md-3"><label class="f-label">Berat Badan (Kg)</label><input type="text" class="f-input" id="f-bb" placeholder="60"></div>
                    <div class="col-md-3"><label class="f-label">GCS (E, M, V)</label><input type="text" class="f-input" id="f-gcs" placeholder="E4M6V5"></div>
                  </div>
                  <div class="row g-2 mb-2">
                    <div class="col-12">
                      <label class="f-label">Riwayat Psiko-Sosio-Budaya-Spiritual &amp; Ekonomi</label>
                      <textarea class="f-input" id="f-riwayat-psikososial" rows="2" placeholder="Kondisi psikologis, sosial, budaya, spiritual..."></textarea>
                    </div>
                  </div>
                  <div class="row g-2">
                    <div class="col-md-4">
                      <label class="f-label">Haid Terakhir</label>
                      <input type="text" class="f-input" id="f-haid-terakhir" placeholder="Tgl / keterangan haid...">
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Status Hamil</label>
                      <select class="f-input" id="f-hamil-status">
                        <option value="">- Pilih -</option>
                        <option value="Tidak">Tidak</option>
                        <option value="Ya">Ya</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Umur Kehamilan (Minggu)</label>
                      <input type="text" class="f-input" id="f-hamil-usia" placeholder="Minggu ke...">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3 -->
            <div class="accordion-item mb-2 border rounded shadow-sm">
              <h2 class="accordion-header" id="heading_sec_3">
                <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_3" aria-expanded="false" aria-controls="collapse_sec_3">
                  <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-activity me-2 text-primary"></i> 3. Status Fungsional, Skrining Nyeri &amp; Gizi</span>
                </button>
              </h2>
              <div id="collapse_sec_3" class="accordion-collapse collapse" aria-labelledby="heading_sec_3" data-bs-parent="#accordionPoli">
                <div class="accordion-body bg-white p-3">
                  <div class="row g-2 mb-3">
                    <div class="col-12">
                      <label class="f-label text-dark">Status Fungsional</label>
                      <select class="f-input" id="f-fungsional">
                        <option value="">- Pilih Status Fungsional -</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="Intermiten">Intermiten</option>
                        <option value="Ketergantungan Total">Ketergantungan Total</option>
                      </select>
                    </div>
                  </div>

                  <div class="p-2 border rounded bg-light mb-3">
                    <div class="fw-bold mb-2" style="font-size:11px;"><i class="bi bi-emoji-expressionless me-1"></i> Penilaian &amp; Skrining Nyeri</div>
                    <div class="row g-2 mb-2">
                      <div class="col-md-2">
                        <label class="f-label">Ada Nyeri?</label>
                        <select class="f-input" id="f-nyeri">
                          <option value="">- Pilih -</option>
                          <option value="tidak">Tidak</option>
                          <option value="ya">Ya</option>
                        </select>
                      </div>
                      <div class="col-md-3"><label class="f-label">Faktor Pemicu</label><input type="text" class="f-input" id="f-nyeri-pemicu" placeholder="Pemicu nyeri..."></div>
                      <div class="col-md-3"><label class="f-label">Faktor Mengurangi</label><input type="text" class="f-input" id="f-nyeri-kurang" placeholder="Mengurangi nyeri..."></div>
                      <div class="col-md-2"><label class="f-label">Frekuensi (x/hari)</label><input type="text" class="f-input" id="f-nyeri-frekuensi" placeholder="3"></div>
                      <div class="col-md-2"><label class="f-label">Skala Nyeri (0-10)</label><input type="text" class="f-input" id="f-nyeri-skala" placeholder="0"></div>
                    </div>
                    <div class="row g-2 mb-2">
                      <div class="col-md-4"><label class="f-label">Lokasi Nyeri</label><input type="text" class="f-input" id="f-nyeri-lokasi" placeholder="Lokasi..."></div>
                      <div class="col-md-4"><label class="f-label">Menjalar</label><input type="text" class="f-input" id="f-nyeri-menjalar" placeholder="Menjalar ke..."></div>
                      <div class="col-md-4"><label class="f-label">Lama Nyeri</label><input type="text" class="f-input" id="f-nyeri-lama" placeholder="Lama nyeri..."></div>
                    </div>
                    <div class="row g-2">
                      <div class="col-md-2"><label class="f-label">P (Provokes)</label><input type="text" class="f-input" id="f-nyeri-p"></div>
                      <div class="col-md-2"><label class="f-label">Q (Quality)</label><input type="text" class="f-input" id="f-nyeri-q"></div>
                      <div class="col-md-3"><label class="f-label">R (Radiates)</label><input type="text" class="f-input" id="f-nyeri-r"></div>
                      <div class="col-md-2"><label class="f-label">S (Severity)</label><input type="text" class="f-input" id="f-nyeri-s"></div>
                      <div class="col-md-3"><label class="f-label">T (Time)</label><input type="text" class="f-input" id="f-nyeri-t"></div>
                    </div>
                  </div>

                  <div class="row g-2">
                    <div class="col-md-6">
                      <div class="p-2 border rounded bg-light">
                        <div class="fw-bold mb-2" style="font-size:11px;">Skrining Gizi Anak (1 bln - 18 thn)</div>
                        <div class="mb-1"><label class="f-label">1. Tampak Kurus?</label><select class="f-input" id="f-gizi-anak-a1"><option value="">- Pilih -</option><option value="1">Ya (1)</option><option value="0">Tidak (0)</option></select></div>
                        <div class="mb-1"><label class="f-label">2. Penurunan BB (1 bln)?</label><select class="f-input" id="f-gizi-anak-a2"><option value="">- Pilih -</option><option value="2">Ya (2)</option><option value="0">Tidak (0)</option></select></div>
                        <div class="mb-1"><label class="f-label">3. Diare / Asupan Kurang?</label><select class="f-input" id="f-gizi-anak-a3"><option value="">- Pilih -</option><option value="1">Ya (1)</option><option value="0">Tidak (0)</option></select></div>
                        <div class="mb-1"><label class="f-label">4. Risiko Malnutrisi?</label><select class="f-input" id="f-gizi-anak-a4"><option value="">- Pilih -</option><option value="2">Ya (2)</option><option value="0">Tidak (0)</option></select></div>
                        <div><label class="f-label">Total Skor Gizi Anak</label><input type="text" class="f-input" id="f-gizi-anak-total" placeholder="Automatis / Skor..."></div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="p-2 border rounded bg-light">
                        <div class="fw-bold mb-2" style="font-size:11px;">Skrining Gizi Dewasa</div>
                        <div class="mb-2"><label class="f-label">1. Penurunan BB (6 bln terakhir)?</label><select class="f-input" id="f-gizi-dewasa-d1"><option value="">- Pilih -</option><option value="2">Ya (2)</option><option value="0">Tidak (0)</option></select></div>
                        <div class="mb-2"><label class="f-label">2. Asupan Berkurang (Nafsu makan)?</label><select class="f-input" id="f-gizi-dewasa-d2"><option value="">- Pilih -</option><option value="2">Ya (2)</option><option value="0">Tidak (0)</option></select></div>
                        <div><label class="f-label">Total Skor Gizi Dewasa</label><input type="text" class="f-input" id="f-gizi-dewasa-total" placeholder="Automatis / Skor..."></div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <!-- Section 4 -->
            <div class="accordion-item mb-2 border rounded shadow-sm">
              <h2 class="accordion-header" id="heading_sec_4">
                <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_4" aria-expanded="false" aria-controls="collapse_sec_4">
                  <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-file-earmark-medical me-2 text-primary"></i> 4. Pemeriksaan Penunjang &amp; Fisik</span>
                </button>
              </h2>
              <div id="collapse_sec_4" class="accordion-collapse collapse" aria-labelledby="heading_sec_4" data-bs-parent="#accordionPoli">
                <div class="accordion-body bg-white p-3">
                  <div class="row g-2 mb-2">
                    <div class="col-12">
                      <label class="f-label">Pemeriksaan Penunjang (Lab / Rad / EKG)</label>
                      <textarea class="f-input" id="f-pemeriksaan-penunjang" rows="2" placeholder="Hasil pemeriksaan penunjang..."></textarea>
                    </div>
                  </div>
                  <div class="row g-2">
                    <div class="col-12">
                      <label class="f-label">Pemeriksaan Fisik (Tulis yang Positif)</label>
                      <textarea class="f-input" id="f-pemeriksaan-fisik" rows="3" placeholder="Pemeriksaan fisik positif..."></textarea>
                    </div>
                  </div>
                  <div class="row g-2 mt-2">
                    <div class="col-12">
                      <label class="f-label">Penandaan Anatomi Tubuh (Coret / Tandai pada Gambar)</label>
                      <div class="border rounded p-2 text-center bg-light">
                        <canvas id="canvas-anatomi-input" width="360" height="180" style="display:block; margin:0 auto; cursor:crosshair; touch-action:none; background:#fff; border:1px solid #ccc;"></canvas>
                        <div class="mt-1">
                          <button type="button" class="btn btn-sm btn-outline-secondary py-0" id="btn-clear-anatomi" style="font-size:11px;">Reset Gambar Anatomi</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 5 -->
            <div class="accordion-item mb-2 border rounded shadow-sm">
              <h2 class="accordion-header" id="heading_sec_5">
                <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_5" aria-expanded="false" aria-controls="collapse_sec_5">
                  <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-clipboard-check me-2 text-primary"></i> 5. Diagnosis, Terapi, Tindak Lanjut &amp; Kondisi Keluar</span>
                </button>
              </h2>
              <div id="collapse_sec_5" class="accordion-collapse collapse" aria-labelledby="heading_sec_5" data-bs-parent="#accordionPoli">
                <div class="accordion-body bg-white p-3">
                  <div class="row g-2 mb-2">
                    <div class="col-md-4">
                      <label class="f-label">Diagnosis Kerja</label>
                      <textarea class="f-input" id="f-diagnosis-kerja" rows="2" placeholder="Diagnosis kerja..."></textarea>
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Permasalahan Medis</label>
                      <textarea class="f-input" id="f-permasalahan-medis" rows="2" placeholder="Permasalahan medis..."></textarea>
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Diagnosis Keperawatan (Perawat)</label>
                      <textarea class="f-input" id="f-diagnosis-keperawatan" rows="2" placeholder="Diagnosis keperawatan..."></textarea>
                    </div>
                  </div>

                  <div class="row g-2 mb-2">
                    <div class="col-12">
                      <label class="f-label">Terapi &amp; Tindakan</label>
                      <textarea class="f-input" id="f-terapi-tindakan" rows="2" placeholder="Terapi obat, tindakan medis..."></textarea>
                    </div>
                  </div>

                  <div class="p-2 border rounded bg-light mb-2">
                    <div class="fw-bold mb-2" style="font-size:11px;">Tindak Lanjut Pasien</div>
                    <div class="row g-2 mb-2">
                      <div class="col-md-4">
                        <label class="f-label">Rencana Tindak Lanjut</label>
                        <select class="f-input" id="f-tindak-lanjut">
                          <option value="">- Pilih -</option>
                          <option value="Kontrol">Kontrol</option>
                          <option value="Dirujuk">Dirujuk</option>
                          <option value="Rawat Inap">Rawat Inap</option>
                        </select>
                      </div>
                    </div>
                    <div class="row g-2 d-none" id="tl-kontrol">
                      <div class="col-md-6"><label class="f-label">Kontrol Tanggal</label><input type="date" class="f-input" id="f-tl-kontrol-tgl"></div>
                      <div class="col-md-6"><label class="f-label">Ke (Poliklinik)</label><input type="text" class="f-input" id="f-tl-kontrol-ke" placeholder="Nama Poliklinik..."></div>
                    </div>
                    <div class="row g-2 d-none" id="tl-dirujuk">
                      <div class="col-md-6"><label class="f-label">Dirujuk Ke</label><input type="text" class="f-input" id="f-tl-dirujuk-ke" placeholder="RS Rujukan..."></div>
                      <div class="col-md-6">
                        <label class="f-label">Jenis Rujukan</label>
                        <div class="d-flex gap-2 border rounded p-1 bg-white">
                          <label class="f-radio-label"><input type="checkbox" name="f-tl-dirujuk-jenis" value="preventif"> Preventif</label>
                          <label class="f-radio-label"><input type="checkbox" name="f-tl-dirujuk-jenis" value="kuratif"> Kuratif</label>
                          <label class="f-radio-label"><input type="checkbox" name="f-tl-dirujuk-jenis" value="rehabilitatif"> Rehab</label>
                          <label class="f-radio-label"><input type="checkbox" name="f-tl-dirujuk-jenis" value="paliatif"> Paliatif</label>
                        </div>
                      </div>
                    </div>
                    <div class="row g-2 d-none" id="tl-rawat-inap">
                      <div class="col-12"><label class="f-label">Indikasi Rawat Inap</label><input type="text" class="f-input" id="f-tl-rawat-indikasi" placeholder="Indikasi rawat inap..."></div>
                    </div>
                  </div>

                  <div class="p-2 border rounded bg-light mb-2">
                    <div class="fw-bold mb-2" style="font-size:11px;">Kondisi Saat Keluar Poliklinik</div>
                    <div class="row g-2 mb-2">
                      <div class="col-md-3"><label class="f-label">Keadaan Umum</label><input type="text" class="f-input" id="f-kondisi-ku-keluar"></div>
                      <div class="col-md-3"><label class="f-label">Kesadaran</label><input type="text" class="f-input" id="f-kondisi-kesadaran"></div>
                      <div class="col-md-3"><label class="f-label">GCS</label><input type="text" class="f-input" id="f-kondisi-gcs"></div>
                      <div class="col-md-3"><label class="f-label">Tekanan Darah</label><input type="text" class="f-input" id="f-kondisi-td"></div>
                    </div>
                    <div class="row g-2 mb-2">
                      <div class="col-md-3"><label class="f-label">Tanda Vital</label><input type="text" class="f-input" id="f-kondisi-tv"></div>
                      <div class="col-md-3"><label class="f-label">Suhu</label><input type="text" class="f-input" id="f-kondisi-suhu"></div>
                      <div class="col-md-3"><label class="f-label">Nadi</label><input type="text" class="f-input" id="f-kondisi-nadi"></div>
                      <div class="col-md-3"><label class="f-label">Nafas</label><input type="text" class="f-input" id="f-kondisi-nafas"></div>
                    </div>
                    <div class="row g-2">
                      <div class="col-md-6"><label class="f-label">Tanggal Keluar</label><input type="date" class="f-input" id="f-kondisi-tgl"></div>
                      <div class="col-md-6"><label class="f-label">Pukul</label><input type="time" class="f-input" id="f-kondisi-pukul"></div>
                    </div>
                  </div>

                  <div class="row g-2">
                    <div class="col-md-4">
                      <label class="f-label">Nama Pasien / Keluarga</label>
                      <input type="text" class="f-input mb-1" id="f-keluar-pasien" placeholder="Nama Pasien / Keluarga...">
                      <div class="border rounded p-1 bg-light text-center">
                        <canvas id="sig-keluarga-poli" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none; background:#fff; border:1px solid #ccc;"></canvas>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" style="font-size:11px;">Hapus TTD</button>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Nama Perawat</label>
                      <input type="text" class="f-input mb-1" id="f-perawat" placeholder="Nama Perawat...">
                      <div class="border rounded p-1 bg-light text-center">
                        <canvas id="sig-perawat-poli" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none; background:#fff; border:1px solid #ccc;"></canvas>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" style="font-size:11px;">Hapus TTD</button>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <label class="f-label">Nama Dokter (DPJP)</label>
                      <input type="text" class="f-input mb-1" id="f-dokter" value="${p.dokterDpjp || p.dpjp || ''}" placeholder="Nama Dokter...">
                      <div class="border rounded p-1 bg-light text-center">
                        <canvas id="sig-dokter-poli" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none; background:#fff; border:1px solid #ccc;"></canvas>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" style="font-size:11px;">Hapus TTD</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
          <div class="d-flex justify-content-end mt-3 border-top pt-3">
            <button type="button" id="btn-save-poli" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
          </div>
        </div>
      </div>`;

            const printContent = `
        <div class="surat-document" style="width:816px;min-height:1247px;background:#fff;margin:0 auto 20px auto;padding:0;box-shadow:0 0 10px rgba(0,0,0,0.1);text-align:left;font-size:12px;font-family:'Times New Roman',Times,serif;position:relative;">
        <div class="pap-page">
          <table class="pap-master-grid">
            <colgroup>
              <col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;">
            </colgroup>
            <tbody>
              ${hospitalHeaderTableRow(noMr, nama, tglLahir, kelamin)}
              <tr>
                <td colspan="6" style="text-align:center;padding:6px;font-weight:bold;font-size:12px;">
                  PENGKAJIAN AWAL PASIEN TERINTEGRASI<br>POLIKLINIK RAWAT JALAN
                </td>
              </tr>
              <tr style="height:75px;">
                <td colspan="2">Tanggal : ${tglMasukDate}</td>
                <td colspan="1">Jam : ${tglMasukTime}</td>
                <td colspan="3">
                  Asal Pasien : <br>
                  <table class="pap-inner-align" style="margin-top:2px;">
                    <tr>
                      <td style="width:50%;"><span class="pap-cb" id="p-asal-umum">&#9744;</span> Umum</td>
                      <td style="width:50%;"><span class="pap-cb" id="p-asal-yankes">&#9744;</span> yankes</td>
                    </tr>
                    <tr>
                      <td><span class="pap-cb" id="p-asal-bpjs">&#9744;</span> BPJS</td>
                      <td><span class="pap-cb" id="p-asal-mandiri">&#9744;</span> Mandiri</td>
                    </tr>
                    <tr>
                      <td><span class="pap-cb" id="p-asal-jkn">&#9744;</span> JKN</td>
                      <td><span class="pap-cb" id="p-asal-lainnya">&#9744;</span> Lainnya <span id="p-asal-lain-detail"></span></td>
                    </tr>
                    <tr>
                      <td colspan="2"><span class="pap-cb" id="p-asal-asuransi">&#9744;</span> Asuransi</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr style="height:130px;">
                <td colspan="3">
                  <strong>KELUHAN UTAMA: (Auto/Allo Anamnesis)</strong><br>
                  <div style="min-height:90px;margin-top:2px;" id="p-keluhan-utama"></div>
                </td>
                <td colspan="3">
                  <strong>RIWAYAT PENGOBATAN : (perawat)</strong><br>
                  <div style="min-height:35px;margin-top:2px;" id="p-riwayat-pengobatan"></div>
                  Alergi Obat :<br>
                  <span class="pap-cb" id="p-alergi-tidak">&#9744;</span> Tidak<br>
                  <span class="pap-cb" id="p-alergi-ya">&#9744;</span> Ya, Nama obat : <span id="p-nama-alergi-obat"></span>
                </td>
              </tr>
              <tr style="height:85px;">
                <td colspan="6">
                  <strong>RIWAYAT PENYAKIT SEKARANG :</strong><br>
                  <div style="min-height:50px;margin-top:2px;" id="p-riwayat-penyakit-sekarang"></div>
                </td>
              </tr>
              <tr style="height:85px;">
                <td colspan="6">
                  <strong>RIWAYAT PENYAKIT DAHULU :</strong><br>
                  <div style="min-height:50px;margin-top:2px;" id="p-riwayat-penyakit-dahulu"></div>
                </td>
              </tr>
              <tr style="height:190px;">
                <td colspan="3">
                  <strong>TANDA-TANDA VITAL (perawat)</strong><br><br>
                  <table class="pap-inner-align" style="line-height:1.7;">
                    <tr><td style="width:85px;">Keadaan Umum</td><td style="width:10px;">:</td><td><span id="p-ku"></span></td><td></td></tr>
                    <tr><td>Tekanan darah</td><td>:</td><td><span id="p-td"></span></td><td style="width:45px;">mmHg</td></tr>
                    <tr><td>Nadi</td><td>:</td><td><span id="p-nadi"></span></td><td>x/Menit</td></tr>
                    <tr><td>Suhu</td><td>:</td><td><span id="p-suhu"></span></td><td>&deg;C</td></tr>
                    <tr><td>Pernapasan</td><td>:</td><td><span id="p-nafas"></span></td><td>x/Menit</td></tr>
                    <tr><td>Berat Badan</td><td>:</td><td><span id="p-bb"></span></td><td>Kg</td></tr>
                  </table>
                  <div style="margin-top:5px;">GCS : <span id="p-gcs"></span></div>
                </td>
                <td colspan="3">
                  <strong>RIWAYAT PSIKO-SOSIO-BUDAYA-SPIRITUAL DAN EKONOMI : (perawat)</strong><br>
                  <div style="min-height:130px;margin-top:2px;" id="p-riwayat-psikososial"></div>
                </td>
              </tr>
              <tr style="height:100px;">
                <td colspan="3">
                  <strong>RIWAYAT REPRODUKSI WANITA (perawat)</strong><br><br>
                  Haid terakhir : <span id="p-haid-terakhir"></span><br><br>
                  Hamil : <span class="pap-cb" id="p-hamil-tidak">&#9744;</span> Tidak &nbsp; <span class="pap-cb" id="p-hamil-ya">&#9744;</span> Ya, Umur Kehamilan : <span id="p-hamil-usia"></span> Minggu
                </td>
                <td colspan="3">
                  <strong>PEMERIKSAAN PENUNJANG :</strong><br>
                  <div style="min-height:60px;margin-top:2px;" id="p-pemeriksaan-penunjang"></div>
                </td>
              </tr>
              <tr style="height:250px;">
                <td colspan="6">
                  <strong>PEMERIKSAAN FISIK :</strong><br>
                  Keterangan : (Tulis yang positif)<br>
                  <table class="pap-inner-align" style="margin-top:15px;width:100%;">
                    <tr>
                      <td style="width:40%;vertical-align:top;">
                        <div style="min-height:160px;" id="p-pemeriksaan-fisik"></div>
                      </td>
                      <td style="width:60%;text-align:center;vertical-align:middle;">
                        <img id="p-anatomi-img" src="assets/img/anatomi (front &amp; back).jpg" style="max-width:100%;max-height:170px;object-fit:contain;" alt="Anatomi">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          ${footerLabel('005/RMBHY/2026')}
        </div>
        </div>

        <div class="surat-document" style="width:816px;min-height:1247px;background:#fff;margin:0 auto 20px auto;padding:0;box-shadow:0 0 10px rgba(0,0,0,0.1);text-align:left;font-size:12px;font-family:'Times New Roman',Times,serif;position:relative;">
        <div class="pap-page">
          <table class="pap-master-grid">
            <colgroup>
              <col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;">
            </colgroup>
            <tbody>
              <tr>
                <td colspan="2"><strong>STATUS FUNGSIONAL</strong></td>
                <td colspan="4">
                  <span class="pap-cb" id="p-fungsional-mandiri">&#9744;</span> Mandiri &emsp; <span class="pap-cb" id="p-fungsional-intermiten">&#9744;</span> Intermiten &emsp; <span class="pap-cb" id="p-fungsional-total">&#9744;</span> Ketergantungan Total
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>PENILAIAN NYERI (diisi oleh perawat)</strong><br><br>
                  Nyeri : <span class="pap-cb" id="p-nyeri-tidak">&#9744;</span> tidak &nbsp; <span class="pap-cb" id="p-nyeri-ya">&#9744;</span> ya<br>
                  Faktor-faktor pemicu : <span id="p-nyeri-pemicu"></span><br>
                  Faktor-faktor mengurang : <span id="p-nyeri-kurang"></span><br>
                  Frekuensi : <span id="p-nyeri-frekuensi"></span> x/hari
                </td>
                <td colspan="3">
                  Lokasi : <span id="p-nyeri-lokasi"></span><br><br>
                  Menjalar : <span id="p-nyeri-menjalar"></span><br><br>
                  Lama nyeri : <span id="p-nyeri-lama"></span>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <strong>SKRINING NYERI (diisi oleh perawat)</strong><br><br>
                  <div style="font-weight:bold;text-align:center;margin-bottom:5px;">PAIN MEASUREMENT SCALE</div>
                  <table class="pap-inner-align">
                    <tr>
                      <td style="width:60%;">
                        <img src="assets/img/pain measurement.png" style="width:100%;max-height:80px;object-fit:contain;" alt="Skala Nyeri">
                      </td>
                      <td style="width:40%;vertical-align:middle;text-align:center;">
                        <strong>Skala nyeri: <span id="p-nyeri-skala"></span></strong>
                      </td>
                    </tr>
                  </table>
                </td>
                <td colspan="3">
                  P : <span id="p-nyeri-p"></span><br><br>
                  Q : <span id="p-nyeri-q"></span><br><br>
                  R : <span id="p-nyeri-r"></span><br><br>
                  S : <span id="p-nyeri-s"></span><br><br>
                  T : <span id="p-nyeri-t"></span>
                </td>
              </tr>
              <tr>
                <td colspan="3"><strong>SKRINING GIZI ANAK (usia 1 bulan - 18 tahun) *(perawat)</strong></td>
                <td colspan="3"><strong>SKRINING GIZI DEWASA (perawat)</strong></td>
              </tr>
              <tr>
                <th rowspan="2" style="border:1px solid black;padding:4px;">PARAMETER</th>
                <th colspan="2" style="border:1px solid black;text-align:center;padding:4px;">SKOR</th>
                <th rowspan="2" style="border:1px solid black;padding:4px;">PARAMETER</th>
                <th colspan="2" style="border:1px solid black;text-align:center;padding:4px;">SKOR</th>
              </tr>
              <tr>
                <th style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;">YA</th>
                <th style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;">TIDAK</th>
                <th style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;">YA</th>
                <th style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;">TIDAK</th>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:4px;">1. Apakah pasien tampak kurus?</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a1-ya">&#9744;</span> 1</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a1-tidak">&#9744;</span> 0</td>
                <td style="border:1px solid black;padding:4px;">1. Apakah pasien mengalami penurunan berat badan yang tidak direncanakan / tidak diinginkan dalam 6 bulan terakhir?</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-dewasa-d1-ya">&#9744;</span> 2</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-dewasa-d1-tidak">&#9744;</span> 0</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:4px;">
                  2. Apakah terdapat penurunan BB selama satu bulan terakhir?<br>
                  - Berdasarkan penilaian obyektif data BB bila ada atau penilaian subyektif orang tua pasien<br>
                  - Untuk bayi kurang 1 tahun BB tidak naik selama 3 bulan terakhir
                </td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a2-ya">&#9744;</span> 2</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a2-tidak">&#9744;</span> 0</td>
                <td style="border:1px solid black;padding:4px;">2. Apakah asupan makan pasien berkurang karena penurunan nafsu makan / kesulitan menerima makanan?</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-dewasa-d2-ya">&#9744;</span> 2</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-dewasa-d2-tidak">&#9744;</span> 0</td>
              </tr>
              <tr>
                <td style="border:1px solid black;padding:4px;">
                  3. Apakah terdapat salah satu dari kondisi berikut?<br>
                  - Diare lebih 5 kali perhari dalam seminggu terakhir<br>
                  - Asupan makanan berkurang selama 1 minggu terakhir
                </td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a3-ya">&#9744;</span> 1</td>
                <td style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a3-tidak">&#9744;</span> 0</td>
                <td style="border:1px solid black;font-weight:bold;vertical-align:middle;padding:4px;">TOTAL SKOR</td>
                <td colspan="2" style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;"><span id="p-gizi-dewasa-total"></span></td>
              </tr>
              <tr>
                <td rowspan="2" style="border:1px solid black;padding:4px;">
                  4. Apakah terdapat penyakit atau keadaan yang menyebabkan pasien berisiko mengalami malnutrisi? (penyakit diare kronis, HIV, PJB, hepatum, ginjal, stoma, dan lain-lain)
                </td>
                <td rowspan="2" style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a4-ya">&#9744;</span> 2</td>
                <td rowspan="2" style="border:1px solid black;text-align:center;vertical-align:middle;padding:4px;"><span class="pap-cb" id="p-gizi-anak-a4-tidak">&#9744;</span> 0</td>
                <td colspan="3" rowspan="2" style="border:1px solid black;font-size:10.5px;line-height:1.35;padding:6px;">
                  <strong>PASIEN DENGAN DIAGNOSIS KHUSUS :</strong><br>
                  Diabetes Melitus, kemoterapi, hemodialisa, Bedah digestif, imunitas dan lain-lain.<br><br>
                  Bila skor &gt; 2 dan atau pasien dengan diagnosis/kondisi khusus dilanjutkan dengan asesmen gizi dietisien.
                </td>
              </tr>
              <tr></tr>
              <tr>
                <td style="border:1px solid black;font-weight:bold;padding:4px;">TOTAL SKOR</td>
                <td colspan="2" style="border:1px solid black;text-align:center;font-weight:bold;padding:4px;"><span id="p-gizi-anak-total"></span></td>
                <td colspan="3" style="background-color:#ffffff;border-top:none;border:1px solid black;"></td>
              </tr>
              <tr style="height:75px;">
                <td colspan="6"><strong>DIAGNOSIS KERJA :</strong><br><span id="p-diagnosis-kerja"></span></td>
              </tr>
              <tr style="height:75px;">
                <td colspan="6"><strong>PERMASALAHAN MEDIS :</strong><br><span id="p-permasalahan-medis"></span></td>
              </tr>
              <tr style="height:75px;">
                <td colspan="6"><strong>DIAGNOSA KEPERAWATAN (perawat) :</strong><br><span id="p-diagnosis-keperawatan"></span></td>
              </tr>
            </tbody>
          </table>
          ${footerLabel('005/RMBHY/2026')}
        </div>
        </div>

        <div class="surat-document" style="width:816px;min-height:1247px;background:#fff;margin:0 auto 20px auto;padding:0;box-shadow:0 0 10px rgba(0,0,0,0.1);text-align:left;font-size:12px;font-family:'Times New Roman',Times,serif;position:relative;">
        <div class="pap-page">
          <table class="pap-master-grid">
            <colgroup>
              <col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;"><col style="width:16.66%;">
            </colgroup>
            <tbody>
              <tr style="height:150px;">
                <td colspan="6"><strong>TERAPI DAN TINDAKAN</strong><br><span id="p-terapi-tindakan"></span></td>
              </tr>
              <tr>
                <td colspan="6" style="padding-bottom:15px;">
                  <strong>TINDAK LANJUT</strong><br><br>
                  <span class="pap-cb" id="p-tl-kontrol">&#9744;</span> Kontrol tanggal : <span id="p-tl-kontrol-tgl"></span> &nbsp;&nbsp;&nbsp;&nbsp; Ke : <span id="p-tl-kontrol-ke"></span><br>
                  <table class="pap-inner-align" style="margin-top:4px;">
                    <tr>
                      <td style="width:55%;">
                        <span class="pap-cb" id="p-tl-dirujuk">&#9744;</span> Dirujuk ke : <span id="p-tl-dirujuk-ke"></span>
                        <div style="padding-left:15px;margin-top:4px;line-height:1.6;">
                          <span class="pap-cb" id="p-tl-dirujuk-preventif">&#9744;</span> preventif<br>
                          <span class="pap-cb" id="p-tl-dirujuk-kuratif">&#9744;</span> kuratif<br>
                          <span class="pap-cb" id="p-tl-dirujuk-rehabilitatif">&#9744;</span> rehabilitatif<br>
                          <span class="pap-cb" id="p-tl-dirujuk-paliatif">&#9744;</span> paliatif
                        </div>
                      </td>
                      <td style="width:42%;padding-top:2px;">
                        <span class="pap-cb" id="p-tl-rawat-inap">&#9744;</span> Rawat inap, Indikasi : <span id="p-tl-rawat-indikasi"></span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="6" style="border-bottom:none;padding-bottom:0;">
                  <strong>KONDISI SAAT KELUAR POLIKLINIK (perawat)</strong>
                </td>
              </tr>
              <tr>
                <td colspan="3" style="border-top:none;border-right:1px solid black;">
                  <table class="pap-inner-align" style="line-height:1.8;">
                    <tr><td style="width:100px;">Keadaan Umum</td><td style="width:10px;">:</td><td><span id="p-kondisi-ku-keluar"></span></td><td style="width:40px;"></td></tr>
                    <tr><td>Kesadaran</td><td>:</td><td><span id="p-kondisi-kesadaran"></span></td><td></td></tr>
                    <tr><td>GCS</td><td>:</td><td><span id="p-kondisi-gcs"></span></td><td></td></tr>
                    <tr><td>Tekanan Darah</td><td>:</td><td><span id="p-kondisi-td"></span></td><td>mmHg</td></tr>
                  </table>
                </td>
                <td colspan="3" style="border-top:none;">
                  <table class="pap-inner-align" style="line-height:1.8;">
                    <tr><td style="width:90px;">Tanda vital</td><td style="width:10px;">:</td><td><span id="p-kondisi-tv"></span></td><td style="width:55px;">mmHg</td></tr>
                    <tr><td>Suhu</td><td>:</td><td><span id="p-kondisi-suhu"></span></td><td>&deg;C</td></tr>
                    <tr><td>Nadi</td><td>:</td><td><span id="p-nadi"></span></td><td>x/Menit</td></tr>
                    <tr><td>Nafas</td><td>:</td><td><span id="p-nafas"></span></td><td></td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td colspan="6" style="border-bottom:none;padding-top:8px;">
                  <table class="pap-inner-align">
                    <tr>
                      <td></td>
                      <td style="text-align:right;font-size:11px;padding-right:15px;">
                        Tgl : <span id="p-kondisi-tgl"></span> &nbsp;&nbsp;&nbsp;&nbsp; Pukul : <span id="p-kondisi-pukul"></span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr style="height:150px;">
                <td colspan="2" style="border-top:none;border-right:none;text-align:center;vertical-align:top;padding:5px;">
                  <div>Keluarnya Pasien</div>
                  <div style="height:85px;display:flex;align-items:center;justify-content:center;">
                    <img id="p-keluar-pasien-img" style="max-height:75px;max-width:140px;object-fit:contain;display:none;" alt="TTD Pasien">
                  </div>
                  <div>( &nbsp;<span id="p-keluar-pasien"></span>&nbsp; )</div>
                </td>
                <td colspan="2" style="border-top:none;border-left:none;border-right:none;text-align:center;vertical-align:top;padding:5px;">
                  <div>Perawat/Bidan</div>
                  <div style="height:85px;display:flex;align-items:center;justify-content:center;">
                    <img id="p-perawat-img" style="max-height:75px;max-width:140px;object-fit:contain;display:none;" alt="TTD Perawat">
                  </div>
                  <div>( &nbsp;<span id="p-perawat"></span>&nbsp; )</div>
                </td>
                <td colspan="2" style="border-top:none;border-left:none;text-align:center;vertical-align:top;padding:5px;">
                  <div>Dokter</div>
                  <div style="height:85px;display:flex;align-items:center;justify-content:center;">
                    <img id="p-dokter-img" style="max-height:75px;max-width:140px;object-fit:contain;display:none;" alt="TTD Dokter">
                  </div>
                  <div>( &nbsp;<span id="p-dokter"></span>&nbsp; )</div>
                </td>
              </tr>
            </tbody>
          </table>
          ${footerLabel('005/RMBHY/2026')}
        </div>
        </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'pengkajian-poli',
        wrapperTag: 'app-pengkajian-awal-poli-placeholder',
        inputPaneId: 'pengkajian-poli-input',
        printPaneId: 'pengkajian-poli-print',
        printTabId: 'pengkajian-poli-print-tab',
        tabsClass: 'pengkajian-poli-tabs',
        inputContent,
        printContent,
      });
      bindSuratPrintButton(root);

      const initAnatomiCanvas = () => {
        const canvasAnatomi = root.querySelector("#canvas-anatomi-input");
        if (!canvasAnatomi) return;
        canvasAnatomi.width = 400;
        canvasAnatomi.height = 200;
        const ctx = canvasAnatomi.getContext("2d");
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvasAnatomi.width, canvasAnatomi.height);
          if (this.formData && this.formData.canvasAnatomi) {
            const savedImg = new Image();
            savedImg.onload = () => ctx.drawImage(savedImg, 0, 0, canvasAnatomi.width, canvasAnatomi.height);
            savedImg.src = this.formData.canvasAnatomi;
          }
        };
        bgImg.src = "assets/img/anatomi (front & back).jpg";

        let drawing = false;
        let lastX = 0, lastY = 0;
        const getPos = (e) => {
          const r = canvasAnatomi.getBoundingClientRect();
          const sx = r.width > 0 ? canvasAnatomi.width / r.width : 1;
          const sy = r.height > 0 ? canvasAnatomi.height / r.height : 1;
          let clientX = e.clientX;
          let clientY = e.clientY;
          if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          }
          return [(clientX - r.left) * sx, (clientY - r.top) * sy];
        };
        const startDraw = (e) => { drawing = true; [lastX, lastY] = getPos(e); };
        const moveDraw = (e) => {
          if (!drawing) return;
          const [x, y] = getPos(e);
          ctx.beginPath();
          ctx.strokeStyle = "#d32f2f";
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          [lastX, lastY] = [x, y];
        };
        const stopDraw = () => {
          if (drawing) {
            drawing = false;
            this.formData = this.formData || {};
            this.formData.canvasAnatomi = canvasAnatomi.toDataURL();
            self2.syncToPreview();
          }
        };
        canvasAnatomi.onmousedown = startDraw;
        canvasAnatomi.onmousemove = moveDraw;
        canvasAnatomi.onmouseup = stopDraw;
        canvasAnatomi.onmouseleave = stopDraw;
        canvasAnatomi.ontouchstart = (e) => { e.preventDefault(); startDraw(e); };
        canvasAnatomi.ontouchmove = (e) => { e.preventDefault(); moveDraw(e); };
        canvasAnatomi.ontouchend = stopDraw;

        const btnClear = root.querySelector("#btn-clear-anatomi");
        if (btnClear) {
          btnClear.onclick = () => {
            ctx.clearRect(0, 0, canvasAnatomi.width, canvasAnatomi.height);
            ctx.drawImage(bgImg, 0, 0, canvasAnatomi.width, canvasAnatomi.height);
            if (this.formData) delete this.formData.canvasAnatomi;
            self2.syncToPreview();
          };
        }
      };

      const makeSigPad = (id, fieldName) => {
        const canvas = root.querySelector("#" + id);
        if (!canvas) return;
        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext("2d");
        if (this.formData && this.formData[fieldName]) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = this.formData[fieldName];
        }
        let drawing = false;
        let lastX = 0, lastY = 0;
        const getPos = (e) => {
          const r = canvas.getBoundingClientRect();
          const sx = r.width > 0 ? canvas.width / r.width : 1;
          const sy = r.height > 0 ? canvas.height / r.height : 1;
          let clientX = e.clientX;
          let clientY = e.clientY;
          if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
          }
          return [(clientX - r.left) * sx, (clientY - r.top) * sy];
        };
        const startDraw = (e) => { drawing = true; [lastX, lastY] = getPos(e); };
        const moveDraw = (e) => {
          if (!drawing) return;
          const [x, y] = getPos(e);
          ctx.beginPath();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          [lastX, lastY] = [x, y];
        };
        const stopDraw = () => {
          if (drawing) {
            drawing = false;
            this.formData = this.formData || {};
            this.formData[fieldName] = canvas.toDataURL();
            self2.syncToPreview();
          }
        };
        canvas.onmousedown = startDraw;
        canvas.onmousemove = moveDraw;
        canvas.onmouseup = stopDraw;
        canvas.onmouseleave = stopDraw;
        canvas.ontouchstart = (e) => { e.preventDefault(); startDraw(e); };
        canvas.ontouchmove = (e) => { e.preventDefault(); moveDraw(e); };
        canvas.ontouchend = stopDraw;

        const clearBtn = canvas.parentElement ? canvas.parentElement.querySelector(".sig-clear-btn") : null;
        if (clearBtn) {
          clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (this.formData) delete this.formData[fieldName];
            self2.syncToPreview();
          };
        }
      };

      initAnatomiCanvas();
      makeSigPad("sig-keluarga-poli", "sigKeluarga");
      makeSigPad("sig-perawat-poli", "sigPerawat");
      makeSigPad("sig-dokter-poli", "sigDokter");

      root.querySelectorAll('.accordion-collapse').forEach((acc) => {
        acc.addEventListener('shown.bs.collapse', () => {
          initAnatomiCanvas();
          makeSigPad("sig-keluarga-poli", "sigKeluarga");
          makeSigPad("sig-perawat-poli", "sigPerawat");
          makeSigPad("sig-dokter-poli", "sigDokter");
        });
      });




      const self2 = this;

      const printTabBtn = root.querySelector("#pengkajian-poli-print-tab");
      if (printTabBtn) {
        printTabBtn.addEventListener("click", () => {
          self2.syncToPreview();
        });
        printTabBtn.addEventListener("shown.bs.tab", () => {
          self2.syncToPreview();
        });
      }

      const tlSelect = root.querySelector("#f-tindak-lanjut");
      if (tlSelect) {
        tlSelect.addEventListener("change", (e) => {
          const tlKontrol = root.querySelector("#tl-kontrol");
          const tlDirujuk = root.querySelector("#tl-dirujuk");
          const tlRawatInap = root.querySelector("#tl-rawat-inap");
          if (tlKontrol) tlKontrol.classList.add("d-none");
          if (tlDirujuk) tlDirujuk.classList.add("d-none");
          if (tlRawatInap) tlRawatInap.classList.add("d-none");
          if (e.target.value === "Kontrol" && tlKontrol) tlKontrol.classList.remove("d-none");
          if (e.target.value === "Dirujuk" && tlDirujuk) tlDirujuk.classList.remove("d-none");
          if (e.target.value === "Rawat Inap" && tlRawatInap) tlRawatInap.classList.remove("d-none");
        });
      }

      const asalSelect = root.querySelector("#f-asal-pasien");
      if (asalSelect) {
        asalSelect.addEventListener("change", (e) => {
          const lainDiv = root.querySelector("#f-asal-pasien-lain");
          if (lainDiv) {
            lainDiv.classList.toggle("d-none", e.target.value !== "Lainnya");
          }
        });
      }

      const alergiSelect = root.querySelector("#f-alergi-obat");
      if (alergiSelect) {
        alergiSelect.addEventListener("change", (e) => {
          const alergiDetail = root.querySelector("#f-alergi-obat-detail");
          if (alergiDetail) {
            alergiDetail.classList.toggle("d-none", e.target.value !== "Ya");
          }
        });
      }

      root.addEventListener("click", (e) => {
        const btn = e.target.closest("#btn-save-poli");
        if (btn) {
          e.preventDefault();
          self2.handleSubmit();
        }
      });

      if (this.draftData) {
        this.populateDraft(this.draftData);
      }
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-pengkajian-awal-poli-placeholder"]],
        decls: 1,
        vars: 0,
        template: renderTemplate,
        encapsulation: 2,
        standalone: true,
      });
    }
  }

  return t;
})();

export { PengkajianAwalPoliComponent };
