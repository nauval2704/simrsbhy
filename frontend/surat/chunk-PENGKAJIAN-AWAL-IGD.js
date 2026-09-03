import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as _cmp,
  gc as _elementStart,
  hc as _elementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import "./chunk-SURAT-CANVAS.js";
import { createSuratShell, bindSuratPrintButton, hospitalHeaderRow, hospitalHeaderDiv, signatureFooterRows, suratDocumentWrapper, createAutoPageSurat, createMultiPageSurat, footerLabel, showSuccessToast, showErrorAlert, buildSuratPdfFilename } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-pengkajian-awal-igd-placeholder");
    _elementEnd();
  }
}

var PengkajianAwalIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.formData = {};

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1] || pathParts[5];
    }

    ngOnInit() {
      this.fetchPatient();
    }

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
      this.http.get(i.apiUrl + "/simrsba/pengkajian-awal-igd/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.formData = res.data;
          }
          this.fetchTriaseIfEmpty();
        },
        error: () => {
          this.fetchTriaseIfEmpty();
        }
      });
    }

    fetchTriaseIfEmpty() {
      this.http.get(i.apiUrl + "/simrsba/triase/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            const tr = res.data;
            if (!this.formData.td && tr.td) this.formData.td = tr.td;
            if (!this.formData.suhu && tr.suhu) this.formData.suhu = tr.suhu;
            if (!this.formData.nadi && tr.hr) this.formData.nadi = tr.hr;
            if (!this.formData.rr && tr.rr) this.formData.rr = tr.rr;
            if (!this.formData.gcsE && tr.gcsE) this.formData.gcsE = tr.gcsE;
            if (!this.formData.gcsV && tr.gcsV) this.formData.gcsV = tr.gcsV;
            if (!this.formData.gcsM && tr.gcsM) this.formData.gcsM = tr.gcsM;

            if (!this.formData.outTd && tr.td) this.formData.outTd = tr.td;
            if (!this.formData.outSuhu && tr.suhu) this.formData.outSuhu = tr.suhu;
            if (!this.formData.outNadi && tr.hr) this.formData.outNadi = tr.hr;
            if (!this.formData.outGcs && (tr.gcsE || tr.gcsV || tr.gcsM)) {
              this.formData.outGcs = `E${tr.gcsE || ''} V${tr.gcsV || ''} M${tr.gcsM || ''}`.trim();
            }

            if (!this.formData.sigDokter && tr.canvasImage) {
              this.formData.sigDokter = tr.canvasImage;
            }
            if (!this.formData.sigPerawat && tr.canvasImagePerawat) {
              this.formData.sigPerawat = tr.canvasImagePerawat;
            }

            if (this.patient && this.patient.tglMasuk) {
              const tmStr = String(this.patient.tglMasuk);
              const parts = tmStr.split(" ");
              if (!this.formData.tglMasukDate && parts[0]) this.formData.tglMasukDate = parts[0];
              if (!this.formData.tglMasukTime && parts[1]) this.formData.tglMasukTime = parts[1].substring(0, 5);
            }
          }
          if (!this.formData.namaDokter && this.patient) {
            this.formData.namaDokter = this.patient.dokterDpjp || this.patient.dpjp || this.patient.namaDokter || "";
          }
          this.fetchRingkasanPulangIfEmpty();
        },
        error: () => {
          if (!this.formData.namaDokter && this.patient) {
            this.formData.namaDokter = this.patient.dokterDpjp || this.patient.dpjp || this.patient.namaDokter || "";
          }
          this.fetchRingkasanPulangIfEmpty();
        }
      });
    }

    fetchRingkasanPulangIfEmpty() {
      this.http.get(i.apiUrl + "/simrsba/ringkasan-pulang/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            const rp = res.data;
            if (!this.formData.keluhanUtama && rp.indikasiMasuk) {
              this.formData.keluhanUtama = rp.indikasiMasuk;
            }
            if (!this.formData.riwayatPenyakitSekarang && rp.keluhanUtama) {
              this.formData.riwayatPenyakitSekarang = rp.keluhanUtama;
            }
            if (!this.formData.pemeriksaanFisik && rp.pemeriksaanFisik) {
              this.formData.pemeriksaanFisik = rp.pemeriksaanFisik;
            }
            const kuVal = (rp.alasanTidakDirawat && rp.alasanTidakDirawat.keadaanUmum) || (rp.kondisiKeluar && rp.kondisiKeluar.ku) || "";
            if (!this.formData.ku && kuVal) {
              this.formData.ku = kuVal;
            }
            if (!this.formData.outKu && kuVal) {
              this.formData.outKu = kuVal;
            }
            const kesadaranVal = rp.kondisiKeluar && rp.kondisiKeluar.kesadaran;
            if (!this.formData.outKesadaran && kesadaranVal) {
              this.formData.outKesadaran = kesadaranVal;
            }
            if (!this.formData.diagnosisKerja && rp.diagnosisKerja) {
              this.formData.diagnosisKerja = rp.diagnosisKerja;
            }
            if (!this.formData.terapi && rp.tindakanTerapi) {
              this.formData.terapi = rp.tindakanTerapi;
            }
          }
          this.loading = false;
          this.renderUI();
        },
        error: () => {
          this.loading = false;
          this.renderUI();
        }
      });
    }

    saveData() {
      const root = document.querySelector("app-pengkajian-awal-igd-placeholder");
      if (root) {
        root.querySelectorAll(".form-data-input").forEach((el) => {
          const field = el.dataset.field;
          if (!field) return;
          if (el.type === "radio") {
            if (el.checked) this.formData[field] = el.value;
          } else {
            this.formData[field] = el.value;
          }
        });
      }
      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm,
        namaPasien: this.patient?.nama,
        dpjp: this.patient?.dpjp,
        tglInput: new Date().toISOString(),
        ...this.formData
      };

      const btn = document.getElementById("btn-save-pengkajian");
      if (btn) { btn.disabled = true; btn.innerHTML = "Menyimpan..."; }

      this.http.post(i.apiUrl + "/simrsba/pengkajian-awal-igd", payload).subscribe({
        next: (res) => {
          this.toastr.success("Berhasil menyimpan Pengkajian Awal IGD", "Sukses");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
          this.renderUI();
        },
        error: (err) => {
          this.toastr.error("Gagal menyimpan data Pengkajian Awal IGD", "Error");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
        }
      });
    }

    renderUI() {
      const root = document.querySelector("app-pengkajian-awal-igd-placeholder");
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

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1);
      };

      const fd = this.formData;
      const getVal = (field) => fd[field] || "";

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

      <div class="accordion mb-3" id="accordionIgd">

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_sec_1">
            <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_1" aria-expanded="true" aria-controls="collapse_sec_1">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-journal-medical me-2 text-secondary"></i> 1. Anamnesis &amp; Riwayat Penyakit</span>
            </button>
          </h2>
          <div id="collapse_sec_1" class="accordion-collapse collapse show" aria-labelledby="heading_sec_1" data-bs-parent="#accordionIgd">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col-md-3"><div class="f-group"><label class="f-label">Tanggal Masuk</label><input type="date" class="f-input form-data-input" data-field="tglMasukDate" value="${getVal('tglMasukDate')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Jam Masuk</label><input type="time" class="f-input form-data-input" data-field="tglMasukTime" value="${getVal('tglMasukTime')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Asal Pasien</label><select class="f-input form-data-input" data-field="asalPasien"><option value="Umum" ${getVal('asalPasien') === 'Umum' ? 'selected' : ''}>Umum</option><option value="Rujukan" ${getVal('asalPasien') === 'Rujukan' ? 'selected' : ''}>Rujukan</option></select></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Rujukan Dari</label><input type="text" class="f-input form-data-input" data-field="rujukanDari" value="${getVal('rujukanDari')}"></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Keluhan Utama</label><textarea class="f-input form-data-input" data-field="keluhanUtama" rows="2">${getVal('keluhanUtama')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Riwayat Penyakit Sekarang</label><textarea class="f-input form-data-input" data-field="riwayatPenyakitSekarang" rows="2">${getVal('riwayatPenyakitSekarang')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Riwayat Pengobatan</label><textarea class="f-input form-data-input" data-field="riwayatPengobatan" rows="2">${getVal('riwayatPengobatan')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Riwayat Penyakit Dahulu</label><textarea class="f-input form-data-input" data-field="riwayatPenyakitDahulu" rows="2">${getVal('riwayatPenyakitDahulu')}</textarea></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Alergi Obat</label><select class="f-input form-data-input" data-field="alergiObat"><option value="Tidak" ${getVal('alergiObat') === 'Tidak' ? 'selected' : ''}>Tidak</option><option value="Ya" ${getVal('alergiObat') === 'Ya' ? 'selected' : ''}>Ya</option></select></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Obat Alergi</label><input type="text" class="f-input form-data-input" data-field="namaObatAlergi" value="${getVal('namaObatAlergi')}"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_sec_2">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_2" aria-expanded="false" aria-controls="collapse_sec_2">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-heart-pulse me-2 text-secondary"></i> 2. Tanda Vital, Fisik, Psikososial &amp; Reproduksi</span>
            </button>
          </h2>
          <div id="collapse_sec_2" class="accordion-collapse collapse" aria-labelledby="heading_sec_2" data-bs-parent="#accordionIgd">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col-md-3"><div class="f-group"><label class="f-label">Keadaan Umum</label><input type="text" class="f-input form-data-input" data-field="ku" value="${getVal('ku')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Tekanan Darah (TD)</label><input type="text" class="f-input form-data-input" data-field="td" value="${getVal('td')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Nadi</label><input type="text" class="f-input form-data-input" data-field="nadi" value="${getVal('nadi')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Suhu</label><input type="text" class="f-input form-data-input" data-field="suhu" value="${getVal('suhu')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Pernafasan (RR)</label><input type="text" class="f-input form-data-input" data-field="rr" value="${getVal('rr')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Berat Badan (Kg)</label><input type="text" class="f-input form-data-input" data-field="bb" value="${getVal('bb')}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">GCS E</label><input type="number" class="f-input form-data-input" data-field="gcsE" value="${getVal('gcsE')}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">GCS M</label><input type="number" class="f-input form-data-input" data-field="gcsM" value="${getVal('gcsM')}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">GCS V</label><input type="number" class="f-input form-data-input" data-field="gcsV" value="${getVal('gcsV')}"></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Riwayat Psiko-sosio-budaya</label><textarea class="f-input form-data-input" data-field="psikososial" rows="2">${getVal('psikososial')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Pemeriksaan Fisik (Positif)</label><textarea class="f-input form-data-input" data-field="fisik" rows="2">${getVal('fisik')}</textarea></div></div>
                <div class="col-12 mt-2">
                  <label class="f-label mb-1 fw-bold">Penandaan Anatomi Tubuh (Pemeriksaan Fisik)</label>
                  <div style="position:relative; width:600px; height:300px; border:1px solid #ccc; border-radius:6px; background:#fff; overflow:hidden; margin:0 auto;">
                    <canvas id="canvas-anatomi-input" width="600" height="300" style="display:block; cursor:crosshair; touch-action:none;"></canvas>
                    <button type="button" class="btn btn-sm btn-outline-danger" id="btn-clear-anatomi" style="position:absolute; top:5px; right:5px; font-size:10px; padding:2px 6px;">Hapus Coretan</button>
                  </div>
                </div>
                <div class="col-12"><hr class="my-1"></div>
                <div class="col-md-12"><span class="fw-bold small text-secondary">Riwayat Reproduksi Wanita</span></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Haid Terakhir</label><input type="text" class="f-input form-data-input" data-field="haid" value="${getVal('haid')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Hamil</label><select class="f-input form-data-input" data-field="hamil"><option value="Tidak" ${getVal('hamil') === 'Tidak' ? 'selected' : ''}>Tidak</option><option value="Ya" ${getVal('hamil') === 'Ya' ? 'selected' : ''}>Ya</option></select></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Umur Hamil (Mgg)</label><input type="text" class="f-input form-data-input" data-field="umurHamil" value="${getVal('umurHamil')}"></div></div>
                <div class="col-md-4"><div class="d-flex gap-2"><div class="f-group"><label class="f-label">G</label><input type="text" class="f-input form-data-input" data-field="g" value="${getVal('g')}"></div><div class="f-group"><label class="f-label">P</label><input type="text" class="f-input form-data-input" data-field="p" value="${getVal('p')}"></div><div class="f-group"><label class="f-label">A</label><input type="text" class="f-input form-data-input" data-field="a" value="${getVal('a')}"></div></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_sec_3">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_3" aria-expanded="false" aria-controls="collapse_sec_3">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-shield-check me-2 text-secondary"></i> 3. Status Fungsional, Nyeri, Skrining Jatuh &amp; Gizi</span>
            </button>
          </h2>
          <div id="collapse_sec_3" class="accordion-collapse collapse" aria-labelledby="heading_sec_3" data-bs-parent="#accordionIgd">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col-md-3"><div class="f-group"><label class="f-label">Status Fungsional</label><select class="f-input form-data-input" data-field="fungsional"><option value="Mandiri" ${getVal('fungsional') === 'Mandiri' ? 'selected' : ''}>Mandiri</option><option value="Intermiten" ${getVal('fungsional') === 'Intermiten' ? 'selected' : ''}>Intermiten</option><option value="Ketergantungan Total" ${getVal('fungsional') === 'Ketergantungan Total' ? 'selected' : ''}>Ketergantungan Total</option></select></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Skala Nyeri (0-10)</label><input type="number" class="f-input form-data-input" data-field="nyeri" value="${getVal('nyeri')}"></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Skrining Jatuh</label><select class="f-input form-data-input" data-field="jatuh"><option value="Tidak Berisiko" ${getVal('jatuh') === 'Tidak Berisiko' ? 'selected' : ''}>Tidak Berisiko</option><option value="Risiko Rendah" ${getVal('jatuh') === 'Risiko Rendah' ? 'selected' : ''}>Risiko Rendah</option><option value="Risiko Tinggi" ${getVal('jatuh') === 'Risiko Tinggi' ? 'selected' : ''}>Risiko Tinggi</option></select></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Pemeriksaan Penunjang</label><input type="text" class="f-input form-data-input" data-field="penunjang" value="${getVal('penunjang')}"></div></div>
                <div class="col-12"><hr class="my-1"></div>
                <div class="col-md-6">
                  <span class="fw-bold small text-secondary">Skrining Gizi Anak (1 bln - 18 thn)</span>
                  <div class="f-group mt-1"><label class="f-label">1. Tampak Kurus?</label><label class="f-radio-label"><input type="radio" name="giziA1" class="form-data-input" data-field="giziA1" value="1" ${getVal('giziA1') === '1' ? 'checked' : ''}> Ya (1)</label><label class="f-radio-label"><input type="radio" name="giziA1" class="form-data-input" data-field="giziA1" value="0" ${getVal('giziA1') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                  <div class="f-group"><label class="f-label">2. Penurunan BB 1 bulan terakhir?</label><label class="f-radio-label"><input type="radio" name="giziA2" class="form-data-input" data-field="giziA2" value="2" ${getVal('giziA2') === '2' ? 'checked' : ''}> Ya (2)</label><label class="f-radio-label"><input type="radio" name="giziA2" class="form-data-input" data-field="giziA2" value="0" ${getVal('giziA2') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                  <div class="f-group"><label class="f-label">3. Diare >5x/hari atau asupan berkurang?</label><label class="f-radio-label"><input type="radio" name="giziA3" class="form-data-input" data-field="giziA3" value="1" ${getVal('giziA3') === '1' ? 'checked' : ''}> Ya (1)</label><label class="f-radio-label"><input type="radio" name="giziA3" class="form-data-input" data-field="giziA3" value="0" ${getVal('giziA3') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                  <div class="f-group"><label class="f-label">4. Ada penyakit berisiko malnutrisi?</label><label class="f-radio-label"><input type="radio" name="giziA4" class="form-data-input" data-field="giziA4" value="2" ${getVal('giziA4') === '2' ? 'checked' : ''}> Ya (2)</label><label class="f-radio-label"><input type="radio" name="giziA4" class="form-data-input" data-field="giziA4" value="0" ${getVal('giziA4') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                  <div class="f-group mt-1"><label class="f-label">Detail Penyakit Berisiko Malnutrisi</label><input type="text" class="f-input form-data-input" data-field="giziA4Detail" value="${getVal('giziA4Detail')}" placeholder="Diare kronis, HIV, PJB, dll"></div>
                </div>
                <div class="col-md-6">
                  <span class="fw-bold small text-secondary">Skrining Gizi Dewasa</span>
                  <div class="f-group mt-1"><label class="f-label">1. Penurunan BB tidak diinginkan (6 bln)?</label><label class="f-radio-label"><input type="radio" name="giziD1" class="form-data-input" data-field="giziD1" value="2" ${getVal('giziD1') === '2' ? 'checked' : ''}> Ya (2)</label><label class="f-radio-label"><input type="radio" name="giziD1" class="form-data-input" data-field="giziD1" value="0" ${getVal('giziD1') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                  <div class="f-group"><label class="f-label">2. Asupan makan berkurang?</label><label class="f-radio-label"><input type="radio" name="giziD2" class="form-data-input" data-field="giziD2" value="1" ${getVal('giziD2') === '1' ? 'checked' : ''}> Ya (1)</label><label class="f-radio-label"><input type="radio" name="giziD2" class="form-data-input" data-field="giziD2" value="0" ${getVal('giziD2') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_sec_4">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_4" aria-expanded="false" aria-controls="collapse_sec_4">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-clipboard2-check me-2 text-secondary"></i> 4. Diagnosa, Tindak Lanjut, Kondisi Keluar &amp; TTD</span>
            </button>
          </h2>
          <div id="collapse_sec_4" class="accordion-collapse collapse" aria-labelledby="heading_sec_4" data-bs-parent="#accordionIgd">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2 mb-3">
                <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosis Kerja</label><textarea class="f-input form-data-input" data-field="diagnosisKerja" rows="2">${getVal('diagnosisKerja')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Permasalahan Medis/Indikasi Rawat</label><textarea class="f-input form-data-input" data-field="permasalahanMedis" rows="2">${getVal('permasalahanMedis')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosa Keperawatan</label><textarea class="f-input form-data-input" data-field="diagnosaKeperawatan" rows="2">${getVal('diagnosaKeperawatan')}</textarea></div></div>
                <div class="col-md-6"><div class="f-group"><label class="f-label">Terapi &amp; Tindakan</label><textarea class="f-input form-data-input" data-field="terapi" rows="2">${getVal('terapi')}</textarea></div></div>
                <div class="col-12"><hr class="my-1"></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Tindak Lanjut</label><select class="f-input form-data-input" data-field="tl"><option value="" ${getVal('tl') === '' ? 'selected' : ''}>-Pilih-</option><option value="APS" ${getVal('tl') === 'APS' ? 'selected' : ''}>APS</option><option value="Pulang" ${getVal('tl') === 'Pulang' ? 'selected' : ''}>Pulang</option><option value="Dirujuk" ${getVal('tl') === 'Dirujuk' ? 'selected' : ''}>Dirujuk</option><option value="Meninggal" ${getVal('tl') === 'Meninggal' ? 'selected' : ''}>Meninggal</option><option value="Rawat Inap" ${getVal('tl') === 'Rawat Inap' ? 'selected' : ''}>Rawat Inap</option></select></div></div>
                <div class="col-md-3"><div class="f-group"><label class="f-label">Detail TL (Alasan/Jam/Ke)</label><input type="text" class="f-input form-data-input" data-field="tlDetail" value="${getVal('tlDetail')}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Indikasi Rawat Inap</label><select class="f-input form-data-input" data-field="inapIndikasi"><option value="" ${getVal('inapIndikasi') === '' ? 'selected' : ''}>-Pilih-</option><option value="preventif" ${getVal('inapIndikasi') === 'preventif' ? 'selected' : ''}>Preventif</option><option value="rehabilitatif" ${getVal('inapIndikasi') === 'rehabilitatif' ? 'selected' : ''}>Rehabilitatif</option><option value="paliatif" ${getVal('inapIndikasi') === 'paliatif' ? 'selected' : ''}>Paliatif</option><option value="kuratif" ${getVal('inapIndikasi') === 'kuratif' ? 'selected' : ''}>Kuratif</option></select></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Rencana Asuhan</label><input type="text" class="f-input form-data-input" data-field="rencanaAsuhan" value="${getVal('rencanaAsuhan')}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Hasil yang Diharapkan</label><input type="text" class="f-input form-data-input" data-field="hasilDiharapkan" value="${getVal('hasilDiharapkan')}"></div></div>
              </div>

              <div class="border rounded p-3 bg-light mb-3">
                <div class="fw-bold mb-2 small text-dark d-flex justify-content-between align-items-center">
                  <span><i class="bi bi-box-arrow-up-right me-1"></i> Kondisi Saat Keluar IGD</span>
                  <span class="text-muted fw-normal" style="font-size:11px;"><i class="bi bi-info-circle me-1"></i>Terhubung ke Tanda Vital Masuk (Awal)</span>
                </div>
                <div class="row g-2">
                  <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl Keluar</label><input type="date" class="f-input form-data-input" data-field="outTgl" value="${getVal('outTgl')}"></div></div>
                  <div class="col-md-3"><div class="f-group"><label class="f-label">Pukul</label><input type="time" class="f-input form-data-input" data-field="outPukul" value="${getVal('outPukul')}"></div></div>
                  <div class="col-md-3"><div class="f-group"><label class="f-label">Keadaan Umum</label><input type="text" class="f-input form-data-input" data-field="outKu" value="${getVal('outKu')}" placeholder="${getVal('ku') || 'Baik'}"></div></div>
                  <div class="col-md-3"><div class="f-group"><label class="f-label">Kesadaran</label><input type="text" class="f-input form-data-input" data-field="outKesadaran" value="${getVal('outKesadaran')}" placeholder="Compos Mentis"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">GCS</label><input type="text" class="f-input form-data-input" data-field="outGcs" value="${getVal('outGcs')}" placeholder="${(getVal('gcsE') || getVal('gcsM') || getVal('gcsV')) ? `E${getVal('gcsE')} M${getVal('gcsM')} V${getVal('gcsV')}` : '15'}"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">Tekanan Darah</label><input type="text" class="f-input form-data-input" data-field="outTd" value="${getVal('outTd')}" placeholder="Awal: ${getVal('td') || '120/80'}"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">Frekuensi Tanda Vital</label><input type="text" class="f-input form-data-input" data-field="outFreqTv" value="${getVal('outFreqTv')}" placeholder="Frekuensi TV"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">Suhu (°C)</label><input type="text" class="f-input form-data-input" data-field="outSuhu" value="${getVal('outSuhu')}" placeholder="Awal: ${getVal('suhu') || '36.5'}"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">Frekuensi Nadi</label><input type="text" class="f-input form-data-input" data-field="outNadi" value="${getVal('outNadi')}" placeholder="Awal: ${getVal('nadi') || '80'}"></div></div>
                  <div class="col-md-2"><div class="f-group"><label class="f-label">Nafas (x/Menit)</label><input type="text" class="f-input form-data-input" data-field="outNafas" value="${getVal('outNafas')}" placeholder="Awal: ${getVal('rr') || '20'}"></div></div>
                </div>
              </div>

              <div class="row g-3">
                <div class="col-md-4">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">Nama Keluarga Pasien</label>
                    <input type="text" class="f-input form-data-input mb-1" data-field="namaKeluarga" value="${getVal('namaKeluarga')}" placeholder="Nama Pasien / Keluarga...">
                    <div style="border:1px solid #ccc; border-radius:4px; background:#fff; position:relative; overflow:hidden;">
                      <canvas id="sig-keluarga-igd" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" data-target="sig-keluarga-igd" style="position:absolute; top:4px; right:4px; font-size:10px; padding:1px 5px;">Hapus</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">Nama Perawat / Bidan</label>
                    <input type="text" class="f-input form-data-input mb-1" data-field="namaPerawat" value="${getVal('namaPerawat')}" placeholder="Nama Perawat / Bidan...">
                    <div style="border:1px solid #ccc; border-radius:4px; background:#fff; position:relative; overflow:hidden;">
                      <canvas id="sig-perawat-igd" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" data-target="sig-perawat-igd" style="position:absolute; top:4px; right:4px; font-size:10px; padding:1px 5px;">Hapus</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">Nama Dokter</label>
                    <input type="text" class="f-input form-data-input mb-1" data-field="namaDokter" value="${getVal('namaDokter')}" placeholder="Nama Dokter...">
                    <div style="border:1px solid #ccc; border-radius:4px; background:#fff; position:relative; overflow:hidden;">
                      <canvas id="sig-dokter-igd" width="300" height="100" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn mt-1 py-0" data-target="sig-dokter-igd" style="position:absolute; top:4px; right:4px; font-size:10px; padding:1px 5px;">Hapus</button>
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
        <button id="btn-save-pengkajian" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'pengkajian',
        wrapperTag: 'app-pengkajian-awal-igd-placeholder',
        inputPaneId: 'pengkajian-input',
        printPaneId: 'pengkajian-print',
        printTabId: 'pengkajian-print-tab',
        tabsClass: 'pengkajian-tabs',
        extraCss: `.f-radio-label { font-size: 12px; margin-right: 15px; display: inline-flex; align-items: center; }
.f-radio-label input { margin-right: 4px; }
.t-border{box-sizing:border-box; width:100%; border:2px solid black; border-top:none; display:flex;flex-direction:column;flex:1;font-family:'Times New Roman',Times,serif; background:white;}
.t-border *{font-size:11px !important;line-height:1.25 !important;box-sizing:border-box;margin:0;padding:0;}
.t-border h3{font-size:13px !important;font-weight:bold;}
.t-row{display:flex;border-bottom:1px solid black; break-inside: avoid; page-break-inside: avoid;}
.t-inner-row{display:flex;border-bottom:1px solid black;}
.t-inner-row:last-child{border-bottom:none;}
.t-inner-col{box-sizing:border-box;padding:3px 4px;border-right:1px solid black;}
.t-inner-col:last-child{border-right:none;}
.t-row:last-child{border-bottom:none;}
.t-col{box-sizing:border-box; padding:4px;border-right:1px solid black;}
.t-col:last-child{border-right:none;}
.t-f1{flex:1;}.t-f2{flex:2;}.t-f3{flex:3;}.t-f4{flex:4;}
.t-sq{display:inline-block;width:13px;height:13px;border:1px solid black;margin-right:4px;flex-shrink:0;vertical-align:middle;text-align:center;line-height:11px;font-size:11px !important;font-weight:bold;overflow:hidden;}
.t-level{font-weight:bold !important;padding:4px;border-bottom:1px solid black;background-color:#f2f2f2;text-align:center;}
.t-sq.cb::after { content: "✓"; font-size: 11px !important; line-height: 11px; display: block; text-align: center; }
#accordionIgd .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }
#accordionIgd .accordion-button { box-shadow: none !important; }
#accordionIgd .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }
#accordionIgd .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
#accordionIgd .form-check-input:checked { background-color: #495057 !important; border-color: #495057 !important; }
#accordionIgd .form-check-input:focus { border-color: #6c757d !important; box-shadow: none !important; }
`,
        inputContent,
      });
      bindSuratPrintButton(root, {
        getFilename: () => buildSuratPdfFilename('PENGKAJIAN_AWAL_IGD', this.patient?.noMr || this.patient?.norm, this.patient?.nama)
      });

      const btnSave = root.querySelector("#btn-save-pengkajian");
      if (btnSave) btnSave.addEventListener("click", () => this.saveData());

      const inputs = root.querySelectorAll(".form-data-input");
      inputs.forEach(el => {
        const handler = (e) => {
          const field = e.target.dataset.field;
          if (!field) return;
          if (e.target.type === "radio") {
            if (e.target.checked) this.formData[field] = e.target.value;
          } else {
            this.formData[field] = e.target.value;
          }
        };
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);
      });

      const initAnatomiCanvas = () => {
        const canvasAnatomi = root.querySelector("#canvas-anatomi-input");
        if (!canvasAnatomi) return;
        const ctx = canvasAnatomi.getContext("2d");
        const bgImg = new Image();
        bgImg.crossOrigin = "anonymous";
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, canvasAnatomi.width, canvasAnatomi.height);
          if (this.formData.canvasAnatomi) {
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
          const sx = canvasAnatomi.width / r.width;
          const sy = canvasAnatomi.height / r.height;
          if (e.touches) return [(e.touches[0].clientX - r.left) * sx, (e.touches[0].clientY - r.top) * sy];
          return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
        };
        const startDraw = (e) => { drawing = true; [lastX, lastY] = getPos(e); };
        const moveDraw = (e) => {
          if (!drawing) return;
          const [x, y] = getPos(e);
          ctx.beginPath();
          ctx.strokeStyle = "#d32f2f";
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          [lastX, lastY] = [x, y];
        };
        const stopDraw = () => {
          if (drawing) {
            drawing = false;
            this.formData.canvasAnatomi = canvasAnatomi.toDataURL();
          }
        };
        canvasAnatomi.addEventListener("mousedown", startDraw);
        canvasAnatomi.addEventListener("mousemove", moveDraw);
        canvasAnatomi.addEventListener("mouseup", stopDraw);
        canvasAnatomi.addEventListener("mouseleave", stopDraw);
        canvasAnatomi.addEventListener("touchstart", (e) => { e.preventDefault(); startDraw(e); }, { passive: false });
        canvasAnatomi.addEventListener("touchmove", (e) => { e.preventDefault(); moveDraw(e); }, { passive: false });
        canvasAnatomi.addEventListener("touchend", stopDraw);

        const btnClear = root.querySelector("#btn-clear-anatomi");
        if (btnClear) {
          btnClear.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvasAnatomi.width, canvasAnatomi.height);
            ctx.drawImage(bgImg, 0, 0, canvasAnatomi.width, canvasAnatomi.height);
            delete this.formData.canvasAnatomi;
          });
        }
      };

      const makeSigPad = (id, fieldName) => {
        const canvas = root.querySelector("#" + id);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (this.formData[fieldName]) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = this.formData[fieldName];
        }
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
          });
        }
      };

      initAnatomiCanvas();
      makeSigPad("sig-keluarga-igd", "sigKeluarga");
      makeSigPad("sig-perawat-igd", "sigPerawat");
      makeSigPad("sig-dokter-igd", "sigDokter");

      root.querySelectorAll('.accordion-collapse').forEach((acc) => {
        acc.addEventListener('shown.bs.collapse', () => {
          initAnatomiCanvas();
          makeSigPad("sig-keluarga-igd", "sigKeluarga");
          makeSigPad("sig-perawat-igd", "sigPerawat");
          makeSigPad("sig-dokter-igd", "sigDokter");
        });
      });

      const printTab = root.querySelector("#pengkajian-print-tab");
      const updatePrint = () => {
        root.querySelectorAll(".form-data-input").forEach((el) => {
          const field = el.dataset.field;
          if (!field) return;
          if (el.type === "radio") {
            if (el.checked) this.formData[field] = el.value;
          } else {
            this.formData[field] = el.value;
          }
        });
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, getFontSize);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }
      updatePrint();
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, getFontSize) {
      const printContainer = document.getElementById("pengkajian-print-container");
      if (!printContainer) return;

      const fd = this.formData;
      const getVal = (field) => fd[field] || "";
      const cb = (field, val) => (fd[field] === val) ? 'cb' : '';

      const giziATotal = (parseInt(fd.giziA1) || 0) + (parseInt(fd.giziA2) || 0) + (parseInt(fd.giziA3) || 0) + (parseInt(fd.giziA4) || 0);
      const giziDTotal = (parseInt(fd.giziD1) || 0) + (parseInt(fd.giziD2) || 0);

      const sq = (field, val) => `<span class="t-sq ${cb(field, val)}"></span>`;

      const page1Html = `
        <div class="t-border" style="border-top:none;">
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col" style="flex:2; padding:4px 6px;">Tanggal : ${getVal('tglMasukDate') || new Date().toISOString().split('T')[0]}</div>
            <div class="t-col" style="flex:1; padding:4px 6px;">Jam : ${getVal('tglMasukTime') || new Date().toTimeString().slice(0,5)}</div>
            <div class="t-col" style="flex:3; padding:4px 6px;">
              <div style="display:flex; align-items:flex-start; gap:6px;">
                <span style="white-space:nowrap;">Asal Pasien :</span>
                <div>
                  <div>${sq('asalPasien','Umum')} Umum</div>
                  <div style="display:flex; align-items:center; gap:4px;">${sq('asalPasien','Rujukan')} Rujukan dari : <span>${getVal('rujukanDari') || '..............................'}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:65px; padding:4px 6px;">
              <strong>KELUHAN UTAMA: (Auto/Allo Anamnesis)</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('keluhanUtama')}</div>
            </div>
            <div class="t-col t-f1" style="padding:4px 6px; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <strong>RIWAYAT PENGOBATAN : (*perawat)</strong>
                <div style="white-space:pre-wrap; margin-top:2px;">${getVal('riwayatPengobatan')}</div>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-top:4px; flex-wrap:wrap;">
                <span>Riwayat Alergi Obat :</span>
                <span>${sq('alergiObat','Tidak')} Tidak</span>
                <span>${sq('alergiObat','Ya')} Ya, Nama obat : ${getVal('namaObatAlergi') || '...........................'}</span>
              </div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:95px; padding:4px 6px;">
              <strong>RIWAYAT PENYAKIT SEKARANG</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('riwayatPenyakitSekarang')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:60px; padding:4px 6px;">
              <strong>RIWAYAT PENYAKIT DAHULU</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('riwayatPenyakitDahulu')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:90px; padding:4px 6px;">
              <strong>TANDA-TANDA VITAL (*perawat)</strong>
              <div style="display:flex; margin-top:2px;"><div style="width:90px;">Keadaan Umum</div><div style="width:8px;">:</div><div>${getVal('ku') || '..................'}</div></div>
              <div style="display:grid; grid-template-columns:1fr 1fr; margin-top:2px; row-gap:2px;">
                <div style="display:flex;"><div style="width:90px;">Tekanan darah</div><div style="width:8px;">:</div><div>${getVal('td') || '............'} mmHg</div></div>
                <div style="display:flex;"><div style="width:90px;">Suhu</div><div style="width:8px;">:</div><div>${getVal('suhu') || '............'} &deg;C</div></div>
                <div style="display:flex;"><div style="width:90px;">Nadi</div><div style="width:8px;">:</div><div>${getVal('nadi') || '............'} x/Menit</div></div>
                <div style="display:flex;"><div style="width:90px;">Pernapasan</div><div style="width:8px;">:</div><div>${getVal('rr') || '............'} x/Menit</div></div>
                <div style="display:flex;"><div style="width:90px;">Berat Badan</div><div style="width:8px;">:</div><div>${getVal('bb') || '............'} Kg</div></div>
                <div style="display:flex;"><div style="width:90px;">GCS</div><div style="width:8px;">:</div><div>E ${getVal('gcsE') || '.....'} M ${getVal('gcsM') || '.....'} V ${getVal('gcsV') || '.....'}</div></div>
              </div>
            </div>
            <div class="t-col t-f1" style="padding:4px 6px;">
              <strong>RIWAYAT PSIKO-SOSIO-BUDAYA-SPIRITUAL DAN<br>EKONOMI : (*perawat)</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('psikososial')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="padding:4px 6px;">
              <strong>RIWAYAT REPRODUKSI WANITA (*perawat)</strong><br>
              Haid terakhir : ${getVal('haid') || '...................................................'}
              &nbsp; Hamil : ${sq('hamil','Tidak')} Tidak, &nbsp; ${sq('hamil','Ya')} Ya, Umur Kehamilan : ${getVal('umurHamil') || '..........'}Minggu<br>
              <div style="padding-left:370px; margin-top:1px;">G ${getVal('g') || '.......'} P ${getVal('p') || '.......'} A ${getVal('a') || '.......'}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0; min-height:350px;">
            <div class="t-col t-f1" style="display:flex; flex-direction:column; padding:4px 6px; position:relative;">
              <div style="flex-shrink:0; margin-bottom:2px;">
                <strong>PEMERIKSAAN FISIK :</strong><br>
                <span style="font-size:10px; font-weight:normal;">Keterangan: (Tulis yang positif)</span>
              </div>
              <div style="display:flex; flex:1; flex-direction:row; gap:10px;">
                <div style="flex:1.2; white-space:pre-wrap; font-size:10px; line-height:1.3; margin-top:2px;">${getVal('fisik')}</div>
                <div style="flex:1; display:flex; justify-content:flex-end; align-items:flex-end; padding-bottom:2px;">
                  <img src="${getVal('canvasAnatomi') || 'assets/img/anatomi (front &amp; back).jpg'}" style="max-height:330px; max-width:100%; object-fit:contain; display:block;" alt="Anatomi">
                </div>
              </div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col" style="flex:2; text-align:center; padding:5px 6px;">
              <strong>STATUS FUNGSIONAL</strong><br>(*perawat)
            </div>
            <div class="t-col" style="flex:4; display:flex; align-items:center; gap:35px; padding:5px 15px;">
              <div>${sq('fungsional','Mandiri')} Mandiri</div>
              <div>${sq('fungsional','Intermiten')} Intermiten</div>
              <div>${sq('fungsional','Ketergantungan Total')} Ketergantungan Total</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0; min-height:125px;">
            <div class="t-col t-f1" style="padding:4px 6px;">
              <strong>SKRINING NYERI : (*diisi oleh perawat)</strong><br>
              <div style="display:flex; align-items:center; margin-top:4px;">
                <div style="flex:2; text-align:center;">
                  <div style="font-weight:bold; font-size:10px !important; margin-bottom:2px;">PAIN MEASUREMENT SCALE</div>
                  <img src="assets/img/pain measurement.png" style="max-width:100%; max-height:75px; object-fit:contain;" alt="Skala Nyeri">
                </div>
                <div style="flex:1; padding-left:10px;">
                  Skala nyeri: <span style="font-size:18px !important; color:red; font-weight:bold;">${getVal('nyeri')}</span>
                </div>
              </div>
            </div>
            <div class="t-col t-f1" style="padding:4px 6px;">
              <strong>PEMERIKSAAN PENUNJANG :</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('penunjang')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0; padding:0;">
            <table style="width:100%; border-collapse:collapse; font-size:11px !important;">
              <colgroup>
                <col style="width:36%;">
                <col style="width:7%;">
                <col style="width:7%;">
                <col style="width:36%;">
                <col style="width:7%;">
                <col style="width:7%;">
              </colgroup>
              <tr style="background-color:#f2f2f2; font-weight:bold;">
                <td colspan="3" style="padding:4px 6px; border-bottom:1px solid black; border-right:2px solid black;">SKRINING GIZI ANAK (usia 1 bulan-18 tahun) (*perawat)</td>
                <td colspan="3" style="padding:4px 6px; border-bottom:1px solid black;">SKRINING GIZI DEWASA (*perawat)</td>
              </tr>
              <tr style="background-color:#f9f9f9; font-weight:bold; text-align:center;">
                <th rowspan="2" style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; text-align:left; vertical-align:middle;">PARAMETER</th>
                <th colspan="2" style="padding:2px; border-bottom:1px solid black; border-right:2px solid black;">SKOR</th>
                <th rowspan="2" style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; text-align:left; vertical-align:middle;">PARAMETER</th>
                <th colspan="2" style="padding:2px; border-bottom:1px solid black;">SKOR</th>
              </tr>
              <tr style="background-color:#f9f9f9; text-align:center;">
                <th style="padding:2px; border-bottom:1px solid black; border-right:1px solid black; width:7%;">Ya</th>
                <th style="padding:2px; border-bottom:1px solid black; border-right:2px solid black; width:7%;">Tidak</th>
                <th style="padding:2px; border-bottom:1px solid black; border-right:1px solid black; width:7%;">Ya</th>
                <th style="padding:2px; border-bottom:1px solid black; width:7%;">Tidak</th>
              </tr>
              <tr>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">1. &nbsp; Apakah pasien tampak kurus</td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziA1','1')} 1</td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:2px solid black; text-align:center; vertical-align:middle;">${sq('giziA1','0')} 0</td>
                <td style="border-bottom:1px solid black; border-right:1px solid black;"></td>
                <td style="border-bottom:1px solid black; border-right:1px solid black;"></td>
                <td style="border-bottom:1px solid black;"></td>
              </tr>
              <tr>
                <td style="padding:4px 6px; border-right:1px solid black; vertical-align:top;">2. &nbsp; Apakah terdapat penurunan BB selama satu bulan<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir?</td>
                <td style="padding:4px; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziA2','2')} 2</td>
                <td style="padding:4px; border-right:2px solid black; text-align:center; vertical-align:middle;">${sq('giziA2','0')} 0</td>
                <td style="border-right:1px solid black;"></td>
                <td style="border-right:1px solid black;"></td>
                <td></td>
              </tr>
            </table>
          </div>
        </div>
      `;

      const page2Html = `
        <div class="t-border" style="border-top:2px solid black;">
          <div class="t-row" style="flex-shrink:0; padding:0;">
            <table style="width:100%; border-collapse:collapse; font-size:11px !important;">
              <colgroup>
                <col style="width:36%;">
                <col style="width:7%;">
                <col style="width:7%;">
                <col style="width:36%;">
                <col style="width:7%;">
                <col style="width:7%;">
              </colgroup>
              <tr>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Berdasarkan penilaian obyektif data BB bila ada atau<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;penilaian subyektif orang tua pasien<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Untuk bayi kurang 1 tahun BB tidak naik selama 3<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bulan terakhir
                </td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;"></td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:2px solid black; text-align:center; vertical-align:middle;"></td>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">
                  1. &nbsp; Apakah pasien mengalami penurunan<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;berat badan yang tidak direncanakan /<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tidak diinginkan dalam 6 bulan<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir
                </td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziD1','2')} 2</td>
                <td style="padding:4px; border-bottom:1px solid black; text-align:center; vertical-align:middle;">${sq('giziD1','0')} 0</td>
              </tr>
              <tr>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">
                  3. &nbsp; Apakah terdapat salah satu dari kondisi berikut?<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Diare lebih 5 kali perhari dalam seminggu terakhir<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Asupan makanan berkurang selama 1 minggu<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir
                </td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziA3','1')} 1</td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:2px solid black; text-align:center; vertical-align:middle;">${sq('giziA3','0')} 0</td>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">
                  2. &nbsp; Apakah asupan makan pasien<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;berkurang karena penurunan nafsu<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;makan / kesulitan menerima<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;makanan?
                </td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziD2','1')} 1</td>
                <td style="padding:4px; border-bottom:1px solid black; text-align:center; vertical-align:middle;">${sq('giziD2','0')} 0</td>
              </tr>
              <tr>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black; vertical-align:top;">
                  4. &nbsp; Apakah terdapat penyakit atau keadaan<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;yang menyebabkan pasien berisiko mengalami<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;malnutrisi? (penyakit diare kronis, HIV, PJB, hepatum,<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ginjal, stoma, dan lain-lain<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sebutkan ${getVal('giziA4Detail') || '.......................................................................'})
                </td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:1px solid black; text-align:center; vertical-align:middle;">${sq('giziA4','2')} 2</td>
                <td style="padding:4px; border-bottom:1px solid black; border-right:2px solid black; text-align:center; vertical-align:middle;">${sq('giziA4','0')} 0</td>
                <td style="border-bottom:1px solid black; border-right:1px solid black;"></td>
                <td style="border-bottom:1px solid black; border-right:1px solid black;"></td>
                <td style="border-bottom:1px solid black;"></td>
              </tr>
              <tr style="text-align:center; background-color:#f9f9f9; font-weight:bold;">
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black;">TOTAL SKOR</td>
                <td colspan="2" style="padding:4px; border-bottom:1px solid black; border-right:2px solid black; font-size:12px !important;">${giziATotal}</td>
                <td style="padding:4px 6px; border-bottom:1px solid black; border-right:1px solid black;">TOTAL SKOR</td>
                <td colspan="2" style="padding:4px; border-bottom:1px solid black; font-size:12px !important;">${giziDTotal}</td>
              </tr>
            </table>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="height:60px; padding:4px 6px;">
              <strong>DIAGNOSIS KERJA :</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('diagnosisKerja')}</div>
            </div>
            <div class="t-col t-f1" style="padding:4px 6px;">
              <strong>SKRINING JATUH : (*perawat)</strong><br>
              <div style="margin-top:2px; line-height:1.6;">
                ${sq('jatuh','Tidak Berisiko')} Tidak Berisiko<br>
                ${sq('jatuh','Risiko Rendah')} Risiko Rendah<br>
                ${sq('jatuh','Risiko Tinggi')} Risiko Tinggi
              </div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="height:60px; padding:4px 6px;">
              <strong>PERMASALAHAN MEDIS/INDIKASI RAWAT :</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('permasalahanMedis')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="height:60px; padding:4px 6px;">
              <strong>DIAGNOSA KEPERAWATAN : (*perawat)</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('diagnosaKeperawatan')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="height:140px; padding:4px 6px;">
              <strong>TERAPI DAN TINDAKAN</strong>
              <div style="white-space:pre-wrap; margin-top:2px;">${getVal('terapi')}</div>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="height:170px; padding:4px 6px;">
              <strong>TINDAK LANJUT :</strong><br>
              <div style="margin-top:2px; line-height:1.5;">
                ${sq('tl','APS')} Pulang Atas Permintaan Sendiri atau menolak rawat inap.<br>
                &nbsp;&nbsp;&nbsp; Alasan menolak rawat inap : ${getVal('tl') === 'APS' ? getVal('tlDetail') : '.......................................................................................................................................'}<br>
                ${sq('tl','Pulang')} Pulang Atas persetujuan, pada jam: ${getVal('tl') === 'Pulang' ? getVal('tlDetail') : '.........................................................................................................................'}<br>
                ${sq('tl','Kontrol')} Kontrol tanggal: ${getVal('tl') === 'Kontrol' ? getVal('tlDetail') : '..........................................................................................'} Ke: .....................................................<br>
                ${sq('tl','Dirujuk')} Dirujuk ke ${getVal('tl') === 'Dirujuk' ? getVal('tlDetail') : '....................................................................................................'} &nbsp;&nbsp;&nbsp;&nbsp; ${sq('tl','Meninggal')} Meninggal<br>
                ${sq('tl','Rawat Inap')} Rawat Inap, Indikasi :<br>
                <table class="inner-align" style="margin-left:15px; width:300px;">
                  <tr>
                    <td>${sq('inapIndikasi','preventif')} preventif</td>
                    <td>${sq('inapIndikasi','rehabilitatif')} rehabilitatif</td>
                  </tr>
                  <tr>
                    <td>${sq('inapIndikasi','paliatif')} paliatif</td>
                    <td>${sq('inapIndikasi','kuratif')} kuratif</td>
                  </tr>
                </table>
                ${sq('','')}&nbsp;Rencana asuhan yang akan diberikan: ${getVal('rencanaAsuhan') || '.....................................................................................................................'}<br>
                &nbsp;&nbsp;&nbsp; Hasil yang diharapkan : ${getVal('hasilDiharapkan') || '..............................................................................................................................................'}
              </div>
            </div>
          </div>
          <div class="t-row" style="background-color:#f2f2f2; font-weight:bold; flex-shrink:0;">
            <div class="t-col t-f1" style="padding:4px 6px;">
              KONDISI SAAT KELUAR IGD (*perawat)
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="padding:4px 6px;">
              <table class="inner-align" style="line-height:1.6;">
                <tr><td style="width:100px;">Keadaan Umum</td><td style="width:10px;">:</td><td>${getVal('outKu')}</td></tr>
                <tr><td>Kesadaran</td><td>:</td><td>${getVal('outKesadaran')}</td></tr>
                <tr><td>GCS</td><td>:</td><td>${getVal('outGcs')}</td></tr>
                <tr><td>Tekanan Darah</td><td>:</td><td>${getVal('outTd') ? getVal('outTd') + ' mmHg' : '........................ mmHg'}</td></tr>
              </table>
            </div>
            <div class="t-col t-f1" style="padding:4px 6px;">
              <table class="inner-align" style="line-height:1.6;">
                <tr><td style="width:140px;">Frekuensi Tanda Vital</td><td style="width:10px;">:</td><td>${getVal('outFreqTv') || '........................ mmHg'}</td></tr>
                <tr><td>Suhu</td><td>:</td><td>${getVal('outSuhu') ? getVal('outSuhu') + ' &deg;C' : '........................ &deg;C'}</td></tr>
                <tr><td>Nadi</td><td>:</td><td>${getVal('outNadi') ? getVal('outNadi') + ' x/Menit' : '........................ x/Menit'}</td></tr>
                <tr><td>Nafas</td><td>:</td><td>${getVal('outNafas') ? getVal('outNafas') + ' x/Menit' : '........................'}</td></tr>
              </table>
            </div>
          </div>
          <div class="t-row" style="flex-shrink:0; height:160px; border-bottom:none; position:relative;">
            <div style="position:absolute; right:15px; top:8px; font-size:11px;">
              Tgl. ${getVal('outTgl') || '....................'} Pukul: ${getVal('outPukul') || '...............'}
            </div>
            <table class="inner-align" style="margin-top:25px; text-align:center; width:100%;">
              <tr>
                <td style="width:33%;">Keluarga Pasien</td>
                <td style="width:34%;">Perawat/Bidan</td>
                <td style="width:33%;">Dokter</td>
              </tr>
              <tr>
                <td style="padding-top:10px; height:70px; vertical-align:middle;">
                  ${getVal('sigKeluarga') ? `<img src="${getVal('sigKeluarga')}" style="max-height:60px; max-width:90%; object-fit:contain;">` : ''}
                </td>
                <td style="padding-top:10px; height:70px; vertical-align:middle;">
                  ${getVal('sigPerawat') ? `<img src="${getVal('sigPerawat')}" style="max-height:60px; max-width:90%; object-fit:contain;">` : ''}
                </td>
                <td style="padding-top:10px; height:70px; vertical-align:middle;">
                  ${getVal('sigDokter') ? `<img src="${getVal('sigDokter')}" style="max-height:60px; max-width:90%; object-fit:contain;">` : ''}
                </td>
              </tr>
              <tr>
                <td>( ${getVal('namaKeluarga') || '........................................'} )</td>
                <td>( ${getVal('namaPerawat') || '........................................'} )</td>
                <td>( ${getVal('namaDokter') || '........................................'} )</td>
              </tr>
            </table>
          </div>
        </div>
      `;

      printContainer.innerHTML = createMultiPageSurat([
        {
          headerHtml: hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize, 'PENGKAJIAN AWAL IGD'),
          bodyHtml: page1Html
        },
        {
          headerHtml: '',
          bodyHtml: page2Html
        }
      ], 'RM04/Rev02/RSBHY/2022');
    }
  }

  t.ɵfac = function (s) {
    return new (s || t)();
  };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-pengkajian-awal-igd-placeholder"]],
    decls: 1,
    vars: 0,
    template: function (s, r) {
      renderTemplate(s, r);
    },
    encapsulation: 2,
  });
  return t;
})();

export { PengkajianAwalIgdComponent };
