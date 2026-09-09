import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as _cmp,
  gc as _elementStart,
  hc as _elementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { createSuratShell, bindSuratPrintButton, hospitalHeaderRow, showSuccessToast, showErrorAlert, buildSuratPdfFilename } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-ringkasan-pulang-wrapper");
    _elementEnd();
  }
}

var RingkasanPulangComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.formData = {
        tglJamMasuk: "",
        tglJamKeluar: "",
        indikasiMasuk: "",
        keluhanUtama: "",
        pemeriksaanFisik: "",
        pemeriksaanPenunjang: "",
        diagnosisKerja: "",
        diagnosisBanding: "",
        tindakanTerapi: "", terapiPulang: "",
        edukasi: "",
        tindakLanjut: { tipe: "", alasanAps: "", jamPersetujuan: "", kontrolTgl: "", kontrolKe: "", rujukKe: "", jamMeninggal: "" },
        alasanTidakDirawat: { keadaanUmum: "", tandaKegawatan: "" },
        kondisiKeluar: { keadaanUmum: "", kesadaran: "", td: "", nadi: "", rr: "", suhu: "", nyeri: "" }
      };

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1] || pathParts[5];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() {}

    fetchPatient() {
      this.http
        .get(
          i.apiUrl +
            "/simrsba/caripasien/pelayanan/IGD/nocheckin/" +
            this.noCheckin,
        )
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.patient = res[0];
            }
            this.fetchDraft();
          },
          error: (err) => {
            console.error("Error fetching patient", err);
            this.loading = false;
            this.renderUI();
          },
        });
    }

    fetchDraft() {
      this.http.get(i.apiUrl + "/simrsba/ringkasan-pulang/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.formData = { ...this.formData, ...res.data };
            if (!this.formData.tindakLanjut) this.formData.tindakLanjut = {};
            if (!this.formData.alasanTidakDirawat) this.formData.alasanTidakDirawat = {};
            if (!this.formData.kondisiKeluar) this.formData.kondisiKeluar = {};
          }
          this.fetchPengkajianIfEmpty();
        },
        error: (err) => {
          console.error("Error fetching draft", err);
          this.fetchPengkajianIfEmpty();
        }
      });
    }

    fetchPengkajianIfEmpty() {
      const toDatetimeLocal = (dateStr, timeStr) => {
        if (!dateStr && !timeStr) return "";
        let d = "";
        let t = "00:00";
        if (dateStr) {
          const s = String(dateStr).trim();
          if (s.includes("T")) {
            const parts = s.split("T");
            d = parts[0];
            if (parts[1]) t = parts[1].substring(0, 5);
          } else if (s.includes(" ")) {
            const parts = s.split(" ");
            d = parts[0];
            if (parts[1]) t = parts[1].substring(0, 5);
          } else {
            d = s;
          }
        }
        if (timeStr) {
          const s = String(timeStr).trim();
          t = s.length >= 5 ? s.substring(0, 5) : s.padStart(5, "0");
        }
        if (!d) return "";
        return `${d}T${t}`;
      };

      this.http.get(i.apiUrl + "/simrsba/pengkajian-awal-igd/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            const pk = res.data;
            if (!this.formData.tglJamMasuk) {
              const ptDate = this.patient?.tglMasuk || this.patient?.tglInput || this.patient?.tglCheckin;
              if (pk.tglMasukDate) {
                this.formData.tglJamMasuk = toDatetimeLocal(pk.tglMasukDate, pk.tglMasukTime);
              } else if (ptDate) {
                this.formData.tglJamMasuk = toDatetimeLocal(ptDate, pk.tglMasukTime);
              }
            }

            if (!this.formData.tglJamKeluar) {
              if (pk.outTgl) {
                this.formData.tglJamKeluar = toDatetimeLocal(pk.outTgl, pk.outPukul || pk.tlJamPersetujuan);
              } else if (this.patient?.tglOut) {
                this.formData.tglJamKeluar = toDatetimeLocal(this.patient.tglOut);
              }
            }

            // A: Indikasi Masuk IGD <- pk.keluhanUtama (A)
            if (!this.formData.indikasiMasuk) {
              if (pk.keluhanUtama) {
                this.formData.indikasiMasuk = pk.keluhanUtama;
              } else if (pk.inapIndikasi) {
                this.formData.indikasiMasuk = pk.inapIndikasi;
              } else if (pk.riwayatPenyakitSekarang) {
                this.formData.indikasiMasuk = pk.riwayatPenyakitSekarang;
              }
            }

            // B: Keluhan Utama <- pk.riwayatPenyakitSekarang (B)
            if (!this.formData.keluhanUtama) {
              if (pk.riwayatPenyakitSekarang) {
                this.formData.keluhanUtama = pk.riwayatPenyakitSekarang;
              } else if (pk.keluhanUtama) {
                this.formData.keluhanUtama = pk.keluhanUtama;
              }
            }

            // C: Pemeriksaan Fisik
            if (!this.formData.pemeriksaanFisik && pk.fisik) {
              this.formData.pemeriksaanFisik = pk.fisik;
            }

            // D: Pemeriksaan Penunjang
            if (!this.formData.pemeriksaanPenunjang && pk.penunjang) {
              this.formData.pemeriksaanPenunjang = pk.penunjang;
            }

            // E: Diagnosis Kerja
            if (!this.formData.diagnosisKerja && pk.diagnosisKerja) {
              this.formData.diagnosisKerja = pk.diagnosisKerja;
            }

            // Diagnosis Banding
            if (!this.formData.diagnosisBanding && pk.permasalahanMedis) {
              this.formData.diagnosisBanding = pk.permasalahanMedis;
            }

            // F: Tindakan / Terapi saat di IGD
            if (!this.formData.tindakanTerapi) {
              if (pk.terapi) this.formData.tindakanTerapi = pk.terapi;
              else if (pk.rencanaAsuhan) this.formData.tindakanTerapi = pk.rencanaAsuhan;
            }

            if (!this.formData.alasanTidakDirawat) this.formData.alasanTidakDirawat = {};
            if (!this.formData.alasanTidakDirawat.keadaanUmum && (pk.outKu || pk.ku)) {
              this.formData.alasanTidakDirawat.keadaanUmum = pk.outKu || pk.ku;
            }

            // K - P: Kondisi Keluar (Keadaan Umum, Kesadaran, TD, Nadi, Suhu, RR)
            if (!this.formData.kondisiKeluar) this.formData.kondisiKeluar = {};
            const kk = this.formData.kondisiKeluar;
            if (!kk.keadaanUmum && (pk.outKu || pk.ku)) kk.keadaanUmum = pk.outKu || pk.ku;
            if (!kk.kesadaran) {
              if (pk.outKesadaran && pk.outGcs) {
                kk.kesadaran = `${pk.outKesadaran} (${pk.outGcs})`;
              } else if (pk.outKesadaran) {
                kk.kesadaran = pk.outKesadaran;
              } else if (pk.outGcs) {
                kk.kesadaran = pk.outGcs;
              } else if (pk.gcsE || pk.gcsM || pk.gcsV) {
                kk.kesadaran = `E${pk.gcsE || ''} M${pk.gcsM || ''} V${pk.gcsV || ''}`.trim();
              }
            }
            if (!kk.td && (pk.outTd || pk.td)) kk.td = pk.outTd || pk.td;
            if (!kk.nadi && (pk.outNadi || pk.nadi)) kk.nadi = pk.outNadi || pk.nadi;
            if (!kk.suhu && (pk.outSuhu || pk.suhu)) kk.suhu = pk.outSuhu || pk.suhu;
            if (!kk.rr && (pk.outNafas || pk.rr)) kk.rr = pk.outNafas || pk.rr;
            if (!kk.nyeri && pk.nyeri !== undefined && pk.nyeri !== null && pk.nyeri !== "") kk.nyeri = String(pk.nyeri);

            // G, H, I, J: Tindak Lanjut
            if (!this.formData.tindakLanjut) this.formData.tindakLanjut = {};
            const tl = this.formData.tindakLanjut;
            if (!tl.tipe && pk.tl) {
              if (pk.tl === "APS") {
                tl.tipe = "APS";
              } else if (pk.tl === "Pulang") {
                tl.tipe = "Persetujuan";
              } else if (pk.tl === "Dirujuk") {
                tl.tipe = "Rujuk";
              } else if (pk.tl === "Meninggal") {
                tl.tipe = "Meninggal";
              } else if (pk.tl === "Kontrol") {
                tl.tipe = "Kontrol";
              }
            }

            // G: Alasan menolak rawat inap
            if (!tl.alasanAps && (pk.tlAlasanAps || (pk.tl === "APS" ? pk.tlDetail : ""))) {
              tl.alasanAps = pk.tlAlasanAps || pk.tlDetail;
            }

            // H: Jam pulang persetujuan
            if (!tl.jamPersetujuan && (pk.tlJamPersetujuan || (pk.tl === "Pulang" ? pk.tlDetail : "") || pk.outPukul)) {
              tl.jamPersetujuan = pk.tlJamPersetujuan || (pk.tl === "Pulang" ? pk.tlDetail : "") || (pk.outPukul ? pk.outPukul.substring(0, 5) : "");
            }

            // I: Kontrol tanggal
            if (!tl.kontrolTgl && (pk.tlKontrolTgl || (pk.tl === "Kontrol" ? pk.tlDetail : ""))) {
              tl.kontrolTgl = pk.tlKontrolTgl || pk.tlDetail;
            }

            // J: Kontrol ke
            if (!tl.kontrolKe && pk.tlKontrolKe) {
              tl.kontrolKe = pk.tlKontrolKe;
            }

            if (!tl.rujukKe && (pk.tlRujukKe || (pk.tl === "Dirujuk" ? pk.tlDetail : ""))) {
              tl.rujukKe = pk.tlRujukKe || pk.tlDetail;
            }

            // Y: TTD & Nama Pasien/Keluarga
            if (!this.formData.namaPasienKeluarga && pk.namaKeluarga) {
              this.formData.namaPasienKeluarga = pk.namaKeluarga;
            }
            if (!this.formData.sigKeluarga && pk.sigKeluarga && pk.sigKeluarga.length > 500) {
              this.formData.sigKeluarga = pk.sigKeluarga;
            }

            // Q: TTD & Nama Dokter
            if (!this.formData.namaDokter && pk.namaDokter) {
              this.formData.namaDokter = pk.namaDokter;
            }
            if (!this.formData.sigDokter && pk.sigDokter && pk.sigDokter.length > 500) {
              this.formData.sigDokter = pk.sigDokter;
            }
          }
          this.fetchTriaseIfEmpty();
        },
        error: () => {
          this.fetchTriaseIfEmpty();
        }
      });
    }

    fetchTriaseIfEmpty() {
      const toDatetimeLocal = (dateStr, timeStr) => {
        if (!dateStr && !timeStr) return "";
        let d = "";
        let t = "00:00";
        if (dateStr) {
          const s = String(dateStr).trim();
          if (s.includes("T")) {
            const parts = s.split("T");
            d = parts[0];
            if (parts[1]) t = parts[1].substring(0, 5);
          } else if (s.includes(" ")) {
            const parts = s.split(" ");
            d = parts[0];
            if (parts[1]) t = parts[1].substring(0, 5);
          } else {
            d = s;
          }
        }
        if (timeStr) {
          const s = String(timeStr).trim();
          t = s.length >= 5 ? s.substring(0, 5) : s.padStart(5, "0");
        }
        if (!d) return "";
        return `${d}T${t}`;
      };

      this.http.get(i.apiUrl + "/simrsba/triase/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            const tr = res.data;
            if (!this.formData.tglJamMasuk) {
              const ptDate = this.patient?.tglMasuk || this.patient?.tglInput || this.patient?.tglCheckin;
              if (ptDate) {
                this.formData.tglJamMasuk = toDatetimeLocal(ptDate, tr.pukulPemeriksaan);
              }
            }
            if (!this.formData.keluhanUtama) {
              if (Array.isArray(tr.symptoms) && tr.symptoms.length > 0) {
                this.formData.keluhanUtama = tr.symptoms.join(", ");
              } else if (tr.situasiBerbahaya) {
                this.formData.keluhanUtama = tr.situasiBerbahaya;
              }
            }

            if (!this.formData.kondisiKeluar) this.formData.kondisiKeluar = {};
            const kk = this.formData.kondisiKeluar;
            if (!kk.td && tr.td) kk.td = tr.td;
            if (!kk.suhu && tr.suhu) kk.suhu = tr.suhu;
            if (!kk.nadi && tr.hr) kk.nadi = tr.hr;
            if (!kk.rr && tr.rr) kk.rr = tr.rr;
            if (!kk.kesadaran && (tr.gcsE || tr.gcsV || tr.gcsM)) {
              kk.kesadaran = `E${tr.gcsE || ""} V${tr.gcsV || ""} M${tr.gcsM || ""}`.trim();
            }

            if (!this.formData.sigDokter && tr.canvasImage && tr.canvasImage.length > 500) {
              this.formData.sigDokter = tr.canvasImage;
            }
            if (!this.formData.namaDokter && tr.namaDokter) {
              this.formData.namaDokter = tr.namaDokter;
            }
          }
          if (!this.formData.namaDokter && this.patient) {
            this.formData.namaDokter = this.patient.dokterDpjp || this.patient.dpjp || this.patient.namaDokter || "";
          }
          if (!this.formData.namaPasienKeluarga && this.patient) {
            this.formData.namaPasienKeluarga = this.patient.nama || "";
          }
          this.loading = false;
          this.renderUI();
        },
        error: () => {
          if (!this.formData.namaDokter && this.patient) {
            this.formData.namaDokter = this.patient.dokterDpjp || this.patient.dpjp || this.patient.namaDokter || "";
          }
          if (!this.formData.namaPasienKeluarga && this.patient) {
            this.formData.namaPasienKeluarga = this.patient.nama || "";
          }
          this.loading = false;
          this.renderUI();
        }
      });
    }

    saveData() {
        const root = document.querySelector("app-ringkasan-pulang-wrapper");
        if (root) {
          root.querySelectorAll(".input-field").forEach(el => {
            if (el.dataset.field) this.formData[el.dataset.field] = el.value;
          });
          root.querySelectorAll(".input-nested").forEach(el => {
            const parent = el.dataset.parent;
            const field = el.dataset.field;
            if (parent && field) {
              if (!this.formData[parent]) this.formData[parent] = {};
              this.formData[parent][field] = el.value;
            }
          });
          root.querySelectorAll("input[type='radio']").forEach(el => {
            const parent = el.dataset.parent;
            const field = el.dataset.field;
            if (parent && field) {
              const name = el.name;
              const checked = root.querySelector(`input[type='radio'][name='${name}']:checked`);
              if (checked) {
                if (!this.formData[parent]) this.formData[parent] = {};
                this.formData[parent][field] = checked.value;
              } else if (this.formData[parent]) {
                delete this.formData[parent][field];
              }
            }
          });
        }

        const sigDokterVal = (this.formData.sigDokter && this.formData.sigDokter.length > 500) ? this.formData.sigDokter : null;
        const sigKeluargaVal = (this.formData.sigKeluarga && this.formData.sigKeluarga.length > 500) ? this.formData.sigKeluarga : null;

        const payload = {
            noCheckin: this.noCheckin,
            noMr: this.patient?.noMr || this.patient?.norm,
            namaPasien: this.patient?.nama,
            dpjp: this.patient?.dpjp || this.patient?.dokterDpjp,
            tglInput: new Date().toISOString(),
            ...this.formData,
            canvasImage: sigDokterVal,
            sigDokter: sigDokterVal,
            sigKeluarga: sigKeluargaVal
        };

        const btn = document.getElementById("btn-save-rp");
        if(btn) { btn.disabled = true; btn.innerHTML = "Menyimpan..."; }

        this.http.post(i.apiUrl + "/simrsba/ringkasan-pulang", payload).subscribe({
            next: (res) => {
                this.toastr.success("Berhasil menyimpan Ringkasan Pulang IGD", "Sukses");
                if(btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
                this.renderUI();
            },
            error: (err) => {
                this.toastr.error("Gagal menyimpan data Ringkasan Pulang IGD", "Error");
                if(btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
            }
        });
    }

    renderUI() {
      const root = document.querySelector("app-ringkasan-pulang-wrapper");
      if (!root) return;

      if (this.loading) {
        root.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;min-height:300px;font-family:Arial;color:#888;">Memuat data...</div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const dpjp = p.dokterDpjp || p.dpjp || p.namaDokter || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => { if (!str || str.length <= maxLen) return defaultSize; return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1); };
      const fd = this.formData;
      const checkRadio = (val, match) => val === match ? "checked" : "";

      const inputContent = `
      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="${tglLahir} (${kelamin})" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="${dpjp}" disabled style="background:#e9ecef;"></div></div>
          </div>
        </div>
      </div>

      <div class="accordion mb-3" id="accordionRingkasanPulang">

        <!-- Section 1 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_rp_1">
            <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_rp_1" aria-expanded="true" aria-controls="collapse_rp_1">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-journal-medical me-2 text-secondary"></i> 1. Tanggal Pelayanan &amp; Anamnesis</span>
            </button>
          </h2>
          <div id="collapse_rp_1" class="accordion-collapse collapse show" aria-labelledby="heading_rp_1" data-bs-parent="#accordionRingkasanPulang">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2 mb-2">
                <div class="col-md-6"><div class="f-group"><label class="f-label">Tanggal &amp; Jam Masuk</label><input type="datetime-local" class="f-input input-field" data-field="tglJamMasuk" value="${fd.tglJamMasuk || ''}"></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Tanggal &amp; Jam Keluar</label><input type="datetime-local" class="f-input input-field" data-field="tglJamKeluar" value="${fd.tglJamKeluar || ''}"></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Indikasi Masuk IGD</label><textarea class="f-input input-field" data-field="indikasiMasuk" rows="2" placeholder="Indikasi masuk...">${fd.indikasiMasuk || ''}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Keluhan Utama</label><textarea class="f-input input-field" data-field="keluhanUtama" rows="2" placeholder="Keluhan utama...">${fd.keluhanUtama || ''}</textarea></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_rp_2">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_rp_2" aria-expanded="false" aria-controls="collapse_rp_2">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-clipboard2-pulse me-2 text-secondary"></i> 2. Pemeriksaan &amp; Diagnosis</span>
            </button>
          </h2>
          <div id="collapse_rp_2" class="accordion-collapse collapse" aria-labelledby="heading_rp_2" data-bs-parent="#accordionRingkasanPulang">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col-md-6"><div class="f-group"><label class="f-label">Pemeriksaan Fisik</label><textarea class="f-input input-field" data-field="pemeriksaanFisik" rows="2" placeholder="Hasil pemeriksaan fisik...">${fd.pemeriksaanFisik || ''}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Pemeriksaan Penunjang</label><textarea class="f-input input-field" data-field="pemeriksaanPenunjang" rows="2" placeholder="Lab, Radiologi, dll...">${fd.pemeriksaanPenunjang || ''}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosis Kerja</label><textarea class="f-input input-field" data-field="diagnosisKerja" rows="2" placeholder="Diagnosis kerja...">${fd.diagnosisKerja || ''}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosis Banding</label><textarea class="f-input input-field" data-field="diagnosisBanding" rows="2" placeholder="Diagnosis banding...">${fd.diagnosisBanding || ''}</textarea></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_rp_3">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_rp_3" aria-expanded="false" aria-controls="collapse_rp_3">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-capsule me-2 text-secondary"></i> 3. Tindakan, Terapi &amp; Tindak Lanjut</span>
            </button>
          </h2>
          <div id="collapse_rp_3" class="accordion-collapse collapse" aria-labelledby="heading_rp_3" data-bs-parent="#accordionRingkasanPulang">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2 mb-3">
                <div class="col-md-6"><div class="f-group"><label class="f-label">Tindakan / Terapi saat di IGD</label><textarea class="f-input input-field" data-field="tindakanTerapi" rows="2" placeholder="Tindakan dan terapi di IGD...">${fd.tindakanTerapi || ''}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Terapi Saat Pulang</label><textarea class="f-input input-field" data-field="terapiPulang" rows="2" placeholder="Obat/terapi yang dibawakan pulang...">${fd.terapiPulang || ''}</textarea></div></div>
              </div>

              <div class="f-group mb-2"><label class="f-label fw-bold">Pilihan Tindak Lanjut</label></div>
              <div class="row g-2 mb-3" style="font-size:13px;">
                <div class="col-12 p-2 border rounded bg-light">
                  <label class="fw-bold mb-1"><input type="radio" name="tindakLanjutTipe" class="input-nested" data-parent="tindakLanjut" data-field="tipe" value="APS" ${checkRadio(fd.tindakLanjut.tipe, 'APS')}> Pulang Atas Permintaan Sendiri / Menolak Rawat Inap</label>
                  <input type="text" class="f-input input-nested mt-1" data-parent="tindakLanjut" data-field="alasanAps" placeholder="Alasan menolak rawat inap..." value="${fd.tindakLanjut.alasanAps || ''}">
                </div>
                <div class="col-12 p-2 border rounded bg-light">
                  <label class="fw-bold mb-1"><input type="radio" name="tindakLanjutTipe" class="input-nested" data-parent="tindakLanjut" data-field="tipe" value="Persetujuan" ${checkRadio(fd.tindakLanjut.tipe, 'Persetujuan')}> Pulang Atas Persetujuan</label>
                  <div class="d-flex align-items-center gap-2 mt-1"><span class="small">Pada Jam:</span><input type="time" class="f-input input-nested" data-parent="tindakLanjut" data-field="jamPersetujuan" value="${fd.tindakLanjut.jamPersetujuan || ''}" style="width:160px;"></div>
                </div>
                <div class="col-12 p-2 border rounded bg-light">
                  <label class="fw-bold mb-1"><input type="radio" name="tindakLanjutTipe" class="input-nested" data-parent="tindakLanjut" data-field="tipe" value="Kontrol" ${checkRadio(fd.tindakLanjut.tipe, 'Kontrol')}> Kontrol</label>
                  <div class="row g-2 mt-1">
                    <div class="col-md-6"><input type="date" class="f-input input-nested" data-parent="tindakLanjut" data-field="kontrolTgl" value="${fd.tindakLanjut.kontrolTgl || ''}"></div>
                    <div class="col-md-6"><input type="text" class="f-input input-nested" data-parent="tindakLanjut" data-field="kontrolKe" placeholder="Ke... (Poli/RS)" value="${fd.tindakLanjut.kontrolKe || ''}"></div>
                  </div>
                </div>
                <div class="col-12 p-2 border rounded bg-light">
                  <label class="fw-bold mb-1"><input type="radio" name="tindakLanjutTipe" class="input-nested" data-parent="tindakLanjut" data-field="tipe" value="Rujuk" ${checkRadio(fd.tindakLanjut.tipe, 'Rujuk')}> Dirujuk</label>
                  <input type="text" class="f-input input-nested mt-1" data-parent="tindakLanjut" data-field="rujukKe" placeholder="Rujuk ke RS / Faskes..." value="${fd.tindakLanjut.rujukKe || ''}">
                </div>
                <div class="col-12 p-2 border rounded bg-light">
                  <label class="fw-bold mb-1"><input type="radio" name="tindakLanjutTipe" class="input-nested" data-parent="tindakLanjut" data-field="tipe" value="Meninggal" ${checkRadio(fd.tindakLanjut.tipe, 'Meninggal')}> Meninggal</label>
                  <div class="d-flex align-items-center gap-2 mt-1"><span class="small">Jam Meninggal:</span><input type="time" class="f-input input-nested" data-parent="tindakLanjut" data-field="jamMeninggal" value="${fd.tindakLanjut.jamMeninggal || ''}" style="width:160px;"></div>
                </div>
              </div>

              <div class="row g-2">
                <div class="col-md-8"><div class="f-group"><label class="f-label">Alasan Tidak Perlu Dirawat (Keadaan Umum)</label><input type="text" class="f-input input-nested" data-parent="alasanTidakDirawat" data-field="keadaanUmum" placeholder="Keadaan umum pasien..." value="${fd.alasanTidakDirawat.keadaanUmum || ''}"></div></div>
                <div class="col-md-4">
                  <div class="f-group"><label class="f-label">Tanda Kegawatan</label>
                    <div class="pt-1">
                      <label class="me-3"><input type="radio" name="tandaKegawatan" class="input-nested" data-parent="alasanTidakDirawat" data-field="tandaKegawatan" value="Ada" ${checkRadio(fd.alasanTidakDirawat.tandaKegawatan, 'Ada')}> Ada</label>
                      <label><input type="radio" name="tandaKegawatan" class="input-nested" data-parent="alasanTidakDirawat" data-field="tandaKegawatan" value="Tidak ada" ${checkRadio(fd.alasanTidakDirawat.tandaKegawatan, 'Tidak ada')}> Tidak ada</label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Section 4 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_rp_4">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_rp_4" aria-expanded="false" aria-controls="collapse_rp_4">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-box-arrow-right me-2 text-secondary"></i> 4. Edukasi, Kondisi Keluar &amp; Tanda Tangan</span>
            </button>
          </h2>
          <div id="collapse_rp_4" class="accordion-collapse collapse" aria-labelledby="heading_rp_4" data-bs-parent="#accordionRingkasanPulang">
            <div class="accordion-body bg-white p-3">
              <div class="f-group mb-2"><label class="f-label">Edukasi Kepada Pasien / Keluarga</label><textarea class="f-input input-field" data-field="edukasi" rows="2" placeholder="Edukasi yang disampaikan...">${fd.edukasi || ''}</textarea></div>
              <div class="row g-2 mb-3">
                <div class="col-md-6"><div class="f-group"><label class="f-label">Keadaan Umum Saat Keluar</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="keadaanUmum" placeholder="Baik / Sedang / Lemah" value="${fd.kondisiKeluar.keadaanUmum || ''}"></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Kesadaran Saat Keluar</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="kesadaran" placeholder="Compos Mentis / Samnolens / dll" value="${fd.kondisiKeluar.kesadaran || ''}"></div></div>
                <div class="col-md-2 col-6"><div class="f-group"><label class="f-label">TD (mmHg)</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="td" placeholder="120/80" value="${fd.kondisiKeluar.td || ''}"></div></div>
                <div class="col-md-2 col-6"><div class="f-group"><label class="f-label">Nadi (x/mnt)</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="nadi" placeholder="80" value="${fd.kondisiKeluar.nadi || ''}"></div></div>
                <div class="col-md-2 col-6"><div class="f-group"><label class="f-label">RR (x/mnt)</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="rr" placeholder="20" value="${fd.kondisiKeluar.rr || ''}"></div></div>
                <div class="col-md-3 col-6"><div class="f-group"><label class="f-label">Suhu (&deg;C)</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="suhu" placeholder="36.5" value="${fd.kondisiKeluar.suhu || ''}"></div></div>
                <div class="col-md-3 col-12"><div class="f-group"><label class="f-label">Skala Nyeri</label><input type="text" class="f-input input-nested" data-parent="kondisiKeluar" data-field="nyeri" placeholder="0 / 1-10" value="${fd.kondisiKeluar.nyeri || ''}"></div></div>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">Nama Pasien / Keluarga</label>
                    <input type="text" class="f-input input-field mb-1" data-field="namaPasienKeluarga" placeholder="Nama Pasien / Keluarga..." value="${fd.namaPasienKeluarga || ''}">
                    <div style="border:1px solid #ccc; border-radius:4px; background:#fff; position:relative; overflow:hidden;">
                      <canvas id="sig-keluarga-rp" width="400" height="150" style="display:block; width:100%; height:120px; cursor:crosshair; touch-action:none;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-keluarga-rp" style="position:absolute; top:4px; right:4px; font-size:10px; padding:1px 5px;">Hapus</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">Nama Dokter DPJP</label>
                    <input type="text" class="f-input input-field mb-1" data-field="namaDokter" placeholder="Nama Dokter..." value="${fd.namaDokter || p.dokterDpjp || p.dpjp || ''}">
                    <div style="border:1px solid #ccc; border-radius:4px; background:#fff; position:relative; overflow:hidden;">
                      <canvas id="sig-dokter-rp" width="400" height="150" style="display:block; width:100%; height:120px; cursor:crosshair; touch-action:none;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-dokter-rp" style="position:absolute; top:4px; right:4px; font-size:10px; padding:1px 5px;">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div class="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
        <button type="button" class="btn btn-outline-success surat-download-pdf-btn px-3"><i class="bi bi-file-earmark-pdf-fill me-1"></i>Simpan sebagai PDF</button>
        <button id="btn-save-rp" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix:    'rp',
        wrapperTag:  'app-ringkasan-pulang-wrapper',
        inputPaneId: 'rp-input',
        printPaneId: 'rp-print',
        printTabId:  'rp-print-tab',
        tabsClass:   'rp-tabs',
        extraCss: `.master-grid { width: 100%; border-collapse: collapse; border: 2px solid black; font-family: 'Times New Roman', Times, serif; }
.master-grid th, .master-grid td { border: 1px solid black; padding: 4px 6px; font-size: 10px !important; line-height: 1.3; vertical-align: top; }
.master-grid tr { page-break-inside: avoid; }
.inner-align { width: 100%; border-collapse: collapse; }
.inner-align td { border: none; padding: 1px; font-size: 10px !important; }
.title-row { text-align: center; font-weight: bold; font-size: 14px !important; background-color: #f2f2f2; padding: 6px !important; }
.cb { display: inline-block; width: 13px; height: 13px; border: 1px solid black; text-align: center; line-height: 11px; font-size: 11px !important; font-weight: bold; margin-right: 4px; vertical-align: middle; overflow: hidden; }
.cb-checked::after { content: "✓"; }
.rounded-meta { border: 1px solid black; border-radius: 10px; padding: 5px; width: 100%; }
.footer-id { text-align: right; font-size: 9px !important; margin-top: 5px; font-style: italic; }`,
        inputContent,
      });
      bindSuratPrintButton(root, {
        getFilename: () => buildSuratPdfFilename('RINGKASAN_PULANG_IGD', this.patient?.noMr || this.patient?.norm, this.patient?.nama)
      });

      const printTab = root.querySelector("#rp-print-tab");
      const updatePrint = () => {
          root.querySelectorAll(".input-field").forEach(el => {
              if (el.dataset.field) this.formData[el.dataset.field] = el.value;
          });
          root.querySelectorAll(".input-nested").forEach(el => {
              const parent = el.dataset.parent;
              const field = el.dataset.field;
              if (parent && field) {
                  if (!this.formData[parent]) this.formData[parent] = {};
                  this.formData[parent][field] = el.value;
              }
          });
          root.querySelectorAll("input[type='radio']").forEach(el => {
            const parent = el.dataset.parent;
            const field = el.dataset.field;
            if (parent && field) {
              const name = el.name;
              const checked = root.querySelector(`input[type='radio'][name='${name}']:checked`);
              if (checked) {
                if (!this.formData[parent]) this.formData[parent] = {};
                this.formData[parent][field] = checked.value;
              } else if (this.formData[parent]) {
                delete this.formData[parent][field];
              }
            }
          });
          this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
      };

      const makeSigPad = (canvasId, fieldName) => {
        const canvas = root.querySelector("#" + canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (this.formData[fieldName] && this.formData[fieldName].length > 500) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = this.formData[fieldName];
        }
        if (canvas._sigPadInitialized) return;
        canvas._sigPadInitialized = true;

        let drawing = false;
        let lastX = 0, lastY = 0;
        const getPos = (e) => {
          const r = canvas.getBoundingClientRect();
          const sx = canvas.width / r.width;
          const sy = canvas.height / r.height;
          if (e.touches) return [(e.touches[0].clientX - r.left) * sx, (e.touches[0].clientY - r.top) * sy];
          return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
        };
        const startDraw = (e) => { drawing = true; [lastX, lastY] = getPos(e); };
        const moveDraw = (e) => {
          if (!drawing) return;
          const [x, y] = getPos(e);
          ctx.beginPath();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 1.8;
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
            this.formData[fieldName] = canvas.toDataURL();
            updatePrint();
          }
        };
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", moveDraw);
        canvas.addEventListener("mouseup", stopDraw);
        canvas.addEventListener("mouseleave", stopDraw);
        canvas.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
        canvas.addEventListener("touchmove", (e) => { e.preventDefault(); moveDraw(e); }, { passive: false });
        canvas.addEventListener("touchend", stopDraw);

        const clearBtn = canvas.parentElement.querySelector(".sig-clear-btn");
        if (clearBtn) {
          clearBtn.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            delete this.formData[fieldName];
            updatePrint();
          });
        }
      };

      makeSigPad("sig-keluarga-rp", "sigKeluarga");
      makeSigPad("sig-dokter-rp", "sigDokter");

      const coll4 = root.querySelector('#collapse_rp_4');
      if (coll4) {
        coll4.addEventListener('shown.bs.collapse', () => {
          makeSigPad("sig-keluarga-rp", "sigKeluarga");
          makeSigPad("sig-dokter-rp", "sigDokter");
        });
      }

      const btnSave = root.querySelector("#btn-save-rp");
      if(btnSave) btnSave.addEventListener("click", () => this.saveData());

      const inputs = root.querySelectorAll(".input-field");
      inputs.forEach(el => {
          el.addEventListener("input", (e) => {
              this.formData[e.target.dataset.field] = e.target.value;
          });
      });

      const nestedInputs = root.querySelectorAll(".input-nested");
      nestedInputs.forEach(el => {
          el.addEventListener("input", (e) => {
              const parent = e.target.dataset.parent;
              const field = e.target.dataset.field;
              if (!this.formData[parent]) this.formData[parent] = {};
              this.formData[parent][field] = e.target.value;
          });
      });

      const radios = root.querySelectorAll("input[type='radio']");
      radios.forEach(el => {
        const markState = () => {
          el._wasChecked = el.checked;
        };
        el.addEventListener("pointerdown", markState);
        if (el.parentElement && el.parentElement.tagName === "LABEL") {
          el.parentElement.addEventListener("pointerdown", markState);
        }
        el.addEventListener("click", (e) => {
          const parent = el.dataset.parent;
          const field = el.dataset.field;
          if (el._wasChecked) {
            el.checked = false;
            el._wasChecked = false;
            if (parent && field && this.formData[parent]) {
              delete this.formData[parent][field];
            }
            updatePrint();
          } else {
            if (parent && field) {
              if (!this.formData[parent]) this.formData[parent] = {};
              this.formData[parent][field] = el.value;
            }
            updatePrint();
          }
        });
      });

      if (printTab) {
          printTab.addEventListener("click", updatePrint);
          printTab.addEventListener("shown.bs.tab", updatePrint);
      }
      updatePrint();
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin) {
      const printContainer = document.getElementById("rp-print-container");
      if (!printContainer) return;
      const pt = Object.assign({ noMr, nama, tglLahir, kelamin }, this.patient || {});
      printContainer.innerHTML = t.getPrintHtml(pt, this.formData);
    }

    static getPrintHtml(patient, formData) {
      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => { if (!str || str.length <= maxLen) return defaultSize; return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1); };
      const p = patient || {};
      const noMr = p.noMr || p.norm || '';
      const nama = p.nama || '';
      const tglLahir = p.tglLahir || '';
      const kelamin = p.kelamin || '';
      const fd = formData || {};
      const tl = fd.tindakLanjut || {};
      const atd = fd.alasanTidakDirawat || {};
      const kk = fd.kondisiKeluar || {};
      const cb = (val, match) => (val === match) ? 'cb cb-checked' : 'cb';
      const dpjp = p.dpjp || p.dokterDpjp || p.namaDokter || '........................................';

      return `
    <div class="surat-document">
        <table class="master-grid">
            <colgroup>
                <col style="width: 15%;">
                <col style="width: 15%;">
                <col style="width: 30%;">
                <col style="width: 13%;">
                <col style="width: 13.5%;">
                <col style="width: 13.5%;">
            </colgroup>

            <tbody>
                <tr>
                    <td colspan="6" style="padding: 5px;">
                        <table class="inner-align">
                            <tr>
                                <td style="width: 15%; text-align: center; vertical-align: middle;">
                                    <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
                                </td>
                                <td style="width: 45%; vertical-align: middle; text-align: center;">
                                    <strong style="font-size: 12px;">RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong><br>
                                    <span style="font-size: 10px;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>
                                    Barat, Banda Aceh Telp. 0651-41355,<br>
                                    0651-41470</span>
                                </td>
                                <td style="width: 40%; vertical-align: middle; padding: 2px;">
                                    <div class="rounded-meta">
                                        <table class="inner-align">
                                            <tr><td style="width: 80px;">NRM</td><td style="width:10px;">:</td><td style="font-size:${getFontSize(noMr)}px !important">${noMr}</td></tr>
                                            <tr><td>Nama</td><td>:</td><td style="font-size:${getFontSize(nama)}px !important">${nama}</td></tr>
                                            <tr><td>Tgl. Lahir</td><td>:</td><td>${tglLahir}</td></tr>
                                            <tr><td>Jenis Kelamin</td><td>:</td><td>${kelamin}</td></tr>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td colspan="6" class="title-row">
                        RINGKASAN PULANG IGD
                    </td>
                </tr>

                <tr>
                    <td colspan="3">Tanggal dan Jam masuk: ${fd.tglJamMasuk ? fd.tglJamMasuk.replace('T', ' ') : ''}</td>
                    <td colspan="3">Tanggal dan Jam keluar: ${fd.tglJamKeluar ? fd.tglJamKeluar.replace('T', ' ') : ''}</td>
                </tr>

                <tr style="height: 45px;">
                    <td colspan="6">Indikasi Masuk IGD<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.indikasiMasuk || ''}</div></td>
                </tr>

                <tr style="height: 45px;">
                    <td colspan="6">Keluhan Utama<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.keluhanUtama || ''}</div></td>
                </tr>

                <tr style="height: 75px;">
                    <td colspan="3">Pemeriksaan Fisik:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.pemeriksaanFisik || ''}</div></td>
                    <td colspan="3">Pemeriksaan Penunjang:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.pemeriksaanPenunjang || ''}</div></td>
                </tr>

                <tr style="height: 50px;">
                    <td colspan="3">Diagnosis Kerja:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.diagnosisKerja || ''}</div></td>
                    <td colspan="3">Diagnosis Banding:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.diagnosisBanding || ''}</div></td>
                </tr>

                <tr style="height: 50px;">
                    <td colspan="6">Tindakan / Terapi saat di IGD:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.tindakanTerapi || ''}</div></td>
                </tr>

                <tr>
                    <td colspan="2" style="vertical-align: top;">Pilihan Tindak Lanjut</td>
                    <td colspan="4" style="line-height: 1.6;">
                        <div><span class="${cb(tl.tipe, 'APS')}"></span> Pulang Atas Permintaan Sendiri / Menolak Rawat Inap ${tl.alasanAps ? `(Alasan: ${tl.alasanAps})` : ''}</div>
                        <div><span class="${cb(tl.tipe, 'Persetujuan')}"></span> Pulang Atas Persetujuan ${tl.jamPersetujuan ? `(Jam: ${tl.jamPersetujuan})` : ''}</div>
                        <div><span class="${cb(tl.tipe, 'Kontrol')}"></span> Kontrol ${tl.kontrolTgl || tl.kontrolKe ? `(Tgl: ${tl.kontrolTgl || '-'}, Ke: ${tl.kontrolKe || '-'})` : ''}</div>
                        <div><span class="${cb(tl.tipe, 'Rujuk')}"></span> Dirujuk ${tl.rujukKe ? `(Ke: ${tl.rujukKe})` : ''}</div>
                        <div><span class="${cb(tl.tipe, 'Meninggal')}"></span> Meninggal ${tl.jamMeninggal ? `(Jam: ${tl.jamMeninggal})` : ''}</div>
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Alasan tidak perlu dirawat</td>
                    <td colspan="4" style="line-height: 1.6;">
                        Keadaan umum : ${atd.keadaanUmum || '.......................................................'}<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tanda-tanda Kegawatan : <span class="${cb(atd.tandaKegawatan, 'Ada')}"></span> Ada &nbsp;&nbsp; <span class="${cb(atd.tandaKegawatan, 'Tidak ada')}"></span> Tidak ada<br>
                    </td>
                </tr>

                <tr style="height: 35px;">
                    <td colspan="2">Edukasi</td>
                    <td colspan="4" style="white-space:pre-wrap;">${fd.edukasi || ''}</td>
                </tr>

                <tr>
                    <td colspan="2" rowspan="5" style="vertical-align: top;">Kondisi saat keluar</td>
                    <td colspan="1">Keadaan umum</td>
                    <td colspan="3">${kk.keadaanUmum || ''}</td>
                </tr>
                <tr>
                    <td colspan="1">Kesadaran</td>
                    <td colspan="3">${kk.kesadaran || ''}</td>
                </tr>
                <tr>
                    <td colspan="1" rowspan="3" style="vertical-align: middle; font-style: italic;">Vital Sign</td>
                    <td colspan="1">TD : ${kk.td || ''}</td>
                    <td colspan="1" style="text-align: right;">mmHg</td>
                    <td colspan="1">Suhu : ${kk.suhu || ''} &deg;C</td>
                </tr>
                <tr>
                    <td colspan="1">Nadi : ${kk.nadi || ''}</td>
                    <td colspan="1" style="text-align: right;">X/Menit</td>
                    <td colspan="1">Nyeri : ${kk.nyeri || 'Tidak/ Ya, skala : .............'}</td>
                </tr>
                <tr>
                    <td colspan="1">RR : ${kk.rr || ''}</td>
                    <td colspan="1" style="text-align: right;">X/Menit</td>
                    <td colspan="1"></td>
                </tr>

                <tr style="height: 50px;">
                    <td colspan="2">Terapi Saat Pulang</td>
                    <td colspan="4" style="white-space:pre-wrap;">${fd.terapiPulang || ''}</td>
                </tr>

                <tr style="height: 140px;">
                    <td colspan="3" style="text-align: center; vertical-align: top; padding-top: 15px;">
                        Pasien/Keluarga
                        <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 5px;">
                            ${(fd.sigKeluarga && fd.sigKeluarga.length > 500) ? `<img src="${fd.sigKeluarga}" style="max-height: 55px; max-width: 100%; object-fit: contain;">` : ''}
                        </div>
                        <div style="margin-top: 5px;">( ${fd.namaPasienKeluarga || '........................................'} )</div>
                    </td>
                    <td colspan="3" style="text-align: center; vertical-align: top; padding-top: 5px;">
                        Banda Aceh, ${fd.tglJamKeluar ? fd.tglJamKeluar.split('T')[0] : '............................'}<br>
                        Dokter Penanggungjawab<br>
                        Pelayanan Kegawatdaruratan
                        <div style="height: 55px; display: flex; align-items: center; justify-content: center; margin-top: 5px;">
                            ${(fd.sigDokter && fd.sigDokter.length > 500) ? `<img src="${fd.sigDokter}" style="max-height: 50px; max-width: 100%; object-fit: contain;">` : ''}
                        </div>
                        <div style="margin-top: 2px;">( ${fd.namaDokter || dpjp} )</div>
                        <div style="font-size: 10px; margin-top: 2px;">Nama Jelas dan Gelar</div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="footer-id">RM05/Rev01/RSBHY/2022</div>
    </div>
        `;
    }
  }

  t.ɵfac = function (s) {
    return new (s || t)();
  };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-ringkasan-pulang"]],
    decls: 1,
    vars: 0,
    template: function (s, r) {
      renderTemplate(s, r);
    },
    encapsulation: 2,
  });
  return t;
})();

export { RingkasanPulangComponent };

