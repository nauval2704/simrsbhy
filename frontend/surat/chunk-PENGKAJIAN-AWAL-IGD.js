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
import { createSuratShell, bindSuratPrintButton, hospitalHeaderRow, hospitalHeaderDiv, signatureFooterRows, suratDocumentWrapper, createAutoPageSurat, createMultiPageSurat, footerLabel, showSuccessToast, showErrorAlert } from "./chunk-SURAT-LAYOUT.js";

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
          this.loading = false;
          this.renderUI();
        },
        error: (err) => {
          console.error("Error fetching draft", err);
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

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-journal-medical me-1"></i> Anamnesis &amp; Riwayat</div>
        <div class="card-body pt-2 pb-2">
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

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-heart-pulse me-1"></i> Tanda Vital, Fisik, Psikososial</div>
        <div class="card-body pt-2 pb-2">
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
              <div style="position:relative; width:360px; height:180px; border:1px solid #ccc; border-radius:6px; background:#fff; overflow:hidden; margin:0 auto;">
                <canvas id="canvas-anatomi-input" width="360" height="180" style="display:block; cursor:crosshair; touch-action:none;"></canvas>
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

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-shield-check me-1"></i> Skrining</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">Status Fungsional</label><select class="f-input form-data-input" data-field="fungsional"><option value="Mandiri" ${getVal('fungsional') === 'Mandiri' ? 'selected' : ''}>Mandiri</option><option value="Intermiten" ${getVal('fungsional') === 'Intermiten' ? 'selected' : ''}>Intermiten</option><option value="Ketergantungan Total" ${getVal('fungsional') === 'Ketergantungan Total' ? 'selected' : ''}>Ketergantungan Total</option></select></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Skala Nyeri (0-10)</label><input type="number" class="f-input form-data-input" data-field="nyeri" value="${getVal('nyeri')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Skrining Jatuh</label><select class="f-input form-data-input" data-field="jatuh"><option value="Tidak Berisiko" ${getVal('jatuh') === 'Tidak Berisiko' ? 'selected' : ''}>Tidak Berisiko</option><option value="Risiko Rendah" ${getVal('jatuh') === 'Risiko Rendah' ? 'selected' : ''}>Risiko Rendah</option><option value="Risiko Tinggi" ${getVal('jatuh') === 'Risiko Tinggi' ? 'selected' : ''}>Risiko Tinggi</option></select></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Pemeriksaan Penunjang</label><input type="text" class="f-input form-data-input" data-field="penunjang" value="${getVal('penunjang')}"></div></div>
            <div class="col-12"><hr class="my-1"></div>
            <div class="col-md-6">
              <span class="fw-bold small text-secondary">Skrining Gizi Anak</span>
              <div class="f-group mt-1"><label class="f-label">Tampak Kurus?</label><label class="f-radio-label"><input type="radio" name="giziA1" class="form-data-input" data-field="giziA1" value="1" ${getVal('giziA1') === '1' ? 'checked' : ''}> Ya (1)</label><label class="f-radio-label"><input type="radio" name="giziA1" class="form-data-input" data-field="giziA1" value="0" ${getVal('giziA1') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
              <div class="f-group"><label class="f-label">Penurunan BB 1 bulan terakhir?</label><label class="f-radio-label"><input type="radio" name="giziA2" class="form-data-input" data-field="giziA2" value="2" ${getVal('giziA2') === '2' ? 'checked' : ''}> Ya (2)</label><label class="f-radio-label"><input type="radio" name="giziA2" class="form-data-input" data-field="giziA2" value="0" ${getVal('giziA2') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
            </div>
            <div class="col-md-6">
              <span class="fw-bold small text-secondary">Skrining Gizi Dewasa</span>
              <div class="f-group mt-1"><label class="f-label">Penurunan BB tidak diinginkan?</label><label class="f-radio-label"><input type="radio" name="giziD1" class="form-data-input" data-field="giziD1" value="2" ${getVal('giziD1') === '2' ? 'checked' : ''}> Ya (2)</label><label class="f-radio-label"><input type="radio" name="giziD1" class="form-data-input" data-field="giziD1" value="0" ${getVal('giziD1') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
              <div class="f-group"><label class="f-label">Asupan makan berkurang?</label><label class="f-radio-label"><input type="radio" name="giziD2" class="form-data-input" data-field="giziD2" value="1" ${getVal('giziD2') === '1' ? 'checked' : ''}> Ya (1)</label><label class="f-radio-label"><input type="radio" name="giziD2" class="form-data-input" data-field="giziD2" value="0" ${getVal('giziD2') === '0' ? 'checked' : ''}> Tidak (0)</label></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-clipboard2-check me-1"></i> Diagnosa &amp; Tindak Lanjut</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosis Kerja</label><textarea class="f-input form-data-input" data-field="diagnosisKerja" rows="2">${getVal('diagnosisKerja')}</textarea></div></div>
            <div class="col-md-6"><div class="f-group"><label class="f-label">Permasalahan Medis/Indikasi Rawat</label><textarea class="f-input form-data-input" data-field="permasalahanMedis" rows="2">${getVal('permasalahanMedis')}</textarea></div></div>
            <div class="col-md-6"><div class="f-group"><label class="f-label">Diagnosa Keperawatan</label><textarea class="f-input form-data-input" data-field="diagnosaKeperawatan" rows="2">${getVal('diagnosaKeperawatan')}</textarea></div></div>
            <div class="col-md-6"><div class="f-group"><label class="f-label">Terapi &amp; Tindakan</label><textarea class="f-input form-data-input" data-field="terapi" rows="2">${getVal('terapi')}</textarea></div></div>
            <div class="col-12"><hr class="my-1"></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tindak Lanjut</label><select class="f-input form-data-input" data-field="tl"><option value="" ${getVal('tl') === '' ? 'selected' : ''}>-Pilih-</option><option value="APS" ${getVal('tl') === 'APS' ? 'selected' : ''}>APS</option><option value="Pulang" ${getVal('tl') === 'Pulang' ? 'selected' : ''}>Pulang</option><option value="Dirujuk" ${getVal('tl') === 'Dirujuk' ? 'selected' : ''}>Dirujuk</option><option value="Meninggal" ${getVal('tl') === 'Meninggal' ? 'selected' : ''}>Meninggal</option><option value="Rawat Inap" ${getVal('tl') === 'Rawat Inap' ? 'selected' : ''}>Rawat Inap</option></select></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Detail TL (Alasan/Jam/Ke)</label><input type="text" class="f-input form-data-input" data-field="tlDetail" value="${getVal('tlDetail')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Indikasi Inap (Preventif/dll)</label><input type="text" class="f-input form-data-input" data-field="inapIndikasi" value="${getVal('inapIndikasi')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Rencana Asuhan</label><input type="text" class="f-input form-data-input" data-field="rencanaAsuhan" value="${getVal('rencanaAsuhan')}"></div></div>
          </div>
        </div>
      </div>

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-box-arrow-up-right me-1"></i> Kondisi Keluar IGD</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl Keluar</label><input type="date" class="f-input form-data-input" data-field="outTgl" value="${getVal('outTgl')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Pukul</label><input type="time" class="f-input form-data-input" data-field="outPukul" value="${getVal('outPukul')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Keadaan Umum</label><input type="text" class="f-input form-data-input" data-field="outKu" value="${getVal('outKu')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Kesadaran</label><input type="text" class="f-input form-data-input" data-field="outKesadaran" value="${getVal('outKesadaran')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">GCS</label><input type="text" class="f-input form-data-input" data-field="outGcs" value="${getVal('outGcs')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tekanan Darah</label><input type="text" class="f-input form-data-input" data-field="outTd" value="${getVal('outTd')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Frekuensi Nadi</label><input type="text" class="f-input form-data-input" data-field="outNadi" value="${getVal('outNadi')}"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Suhu</label><input type="text" class="f-input form-data-input" data-field="outSuhu" value="${getVal('outSuhu')}"></div></div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <div class="card border">
            <div class="card-header bg-light border-0 py-2">
              <span class="fw-bold text-dark small">TTD &amp; Nama Keluarga Pasien</span>
            </div>
            <div class="card-body p-2">
              <div class="mb-2">
                <label class="form-label small fw-semibold mb-1">Nama Keluarga Pasien</label>
                <input type="text" class="f-input form-data-input" data-field="namaKeluarga" value="${getVal('namaKeluarga')}" placeholder="Nama Pasien / Keluarga...">
              </div>
              <div style="border:1px solid #dee2e6; border-radius:6px; background:#fafafa; position:relative; overflow:hidden;">
                <canvas id="sig-keluarga-igd" width="600" height="200" style="display:block; width:100%; height:160px; cursor:crosshair; touch-action:none;"></canvas>
                <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-keluarga-igd" style="position:absolute; top:4px; right:4px; font-size:11px; padding:2px 7px;">Hapus</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border">
            <div class="card-header bg-light border-0 py-2">
              <span class="fw-bold text-dark small">TTD &amp; Nama Perawat / Bidan</span>
            </div>
            <div class="card-body p-2">
              <div class="mb-2">
                <label class="form-label small fw-semibold mb-1">Nama Perawat / Bidan</label>
                <input type="text" class="f-input form-data-input" data-field="namaPerawat" value="${getVal('namaPerawat')}" placeholder="Nama Perawat / Bidan...">
              </div>
              <div style="border:1px solid #dee2e6; border-radius:6px; background:#fafafa; position:relative; overflow:hidden;">
                <canvas id="sig-perawat-igd" width="600" height="200" style="display:block; width:100%; height:160px; cursor:crosshair; touch-action:none;"></canvas>
                <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-perawat-igd" style="position:absolute; top:4px; right:4px; font-size:11px; padding:2px 7px;">Hapus</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border">
            <div class="card-header bg-light border-0 py-2">
              <span class="fw-bold text-dark small">TTD &amp; Nama Dokter</span>
            </div>
            <div class="card-body p-2">
              <div class="mb-2">
                <label class="form-label small fw-semibold mb-1">Nama Dokter</label>
                <input type="text" class="f-input form-data-input" data-field="namaDokter" value="${getVal('namaDokter')}" placeholder="Nama Dokter...">
              </div>
              <div style="border:1px solid #dee2e6; border-radius:6px; background:#fafafa; position:relative; overflow:hidden;">
                <canvas id="sig-dokter-igd" width="600" height="200" style="display:block; width:100%; height:160px; cursor:crosshair; touch-action:none;"></canvas>
                <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-dokter-igd" style="position:absolute; top:4px; right:4px; font-size:11px; padding:2px 7px;">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end mt-3 border-top pt-3">
        <button id="btn-save-pengkajian" class="btn btn-primary btn-lg shadow-sm px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
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
`,
        inputContent,
      });
      bindSuratPrintButton(root);

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
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
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

      const printTab = root.querySelector("#pengkajian-print-tab");
      if (printTab) {
        printTab.addEventListener("click", () => {
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
        });
      }
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, getFontSize) {
      const printContainer = document.getElementById("pengkajian-print-container");
      if (!printContainer) return;
        
      const fd = this.formData;
      const getVal = (field) => fd[field] || "";
      const cb = (field, val) => (fd[field] === val) ? 'cb' : '';
        
      const giziATotal = (parseInt(fd.giziA1) || 0) + (parseInt(fd.giziA2) || 0) + (parseInt(fd.giziA3) || 0) + (parseInt(fd.giziA4) || 0);
      const giziDTotal = (parseInt(fd.giziD1) || 0) + (parseInt(fd.giziD2) || 0);

      // Helper: checkbox square, filled if field === val
      const sq = (field, val) => `<span class="t-sq ${cb(field, val)}"></span>`;

      const page1Html = `
        <div class="t-border" style="border-top:none;">

          <!-- ROW: Tanggal / Jam / Asal Pasien -->
          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col" style="flex:2;">Tanggal : ${getVal('tglMasukDate') || new Date().toISOString().split('T')[0]}</div>
            <div class="t-col" style="flex:1;">Jam : ${getVal('tglMasukTime') || new Date().toTimeString().slice(0,5)}</div>
            <div class="t-col" style="flex:3;">
              Asal Pasien : &nbsp; ${sq('asalPasien','Umum')} Umum<br>
              <div style="padding-left:90px;">${sq('asalPasien','Rujukan')} Rujukan dari : ${getVal('rujukanDari')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:65px;">
              <strong>KELUHAN UTAMA: (Auto/Allo Anamnesis)</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:85px; overflow:hidden;">${getVal('keluhanUtama')}</div>
            </div>
            <div class="t-col t-f1">
              <strong>RIWAYAT PENGOBATAN : (*perawat)</strong>
              <div style="white-space:pre-wrap; margin-bottom:4px; max-height:85px; overflow:hidden;">${getVal('riwayatPengobatan')}</div>
              Riwayat Alergi Obat : ${sq('alergiObat','Tidak')} Tidak &nbsp; ${sq('alergiObat','Ya')} Ya, Nama obat : ${getVal('namaObatAlergi')}
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:110px;">
              <strong>RIWAYAT PENYAKIT SEKARANG</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:140px; overflow:hidden;">${getVal('riwayatPenyakitSekarang')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:70px;">
              <strong>RIWAYAT PENYAKIT DAHULU</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:90px; overflow:hidden;">${getVal('riwayatPenyakitDahulu')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:90px;">
              <strong>TANDA-TANDA VITAL (*perawat)</strong><br>
              Keadaan Umum : ${getVal('ku')}<br>
              <div style="display:grid; grid-template-columns:1fr 1fr; margin-top:2px; row-gap:1px;">
                <div>Tekanan darah : ${getVal('td') || '............'} mmHg</div>
                <div>Suhu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${getVal('suhu') || '............'} &deg;C</div>
                <div>Nadi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ${getVal('nadi') || '............'} x/Menit</div>
                <div>Pernapasan&nbsp;&nbsp;: ${getVal('rr') || '............'} x/Menit</div>
                <div>Berat Badan&nbsp;&nbsp;&nbsp;: ${getVal('bb') || '............'} Kg</div>
                <div>GCS : E ${getVal('gcsE') || '........'} M ${getVal('gcsM') || '........'} V ${getVal('gcsV') || '........'}</div>
              </div>
            </div>
            <div class="t-col t-f1">
              <strong>RIWAYAT PSIKO-SOSIO-BUDAYA-SPIRITUAL DAN<br>EKONOMI : (*perawat)</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:75px; overflow:hidden;">${getVal('psikososial')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1">
              <strong>RIWAYAT REPRODUKSI WANITA (*perawat)</strong><br>
              Haid terakhir : ${getVal('haid') || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}
              &nbsp; Hamil : ${sq('hamil','Tidak')} Tidak, &nbsp; ${sq('hamil','Ya')} Ya, Umur Kehamilan : ${getVal('umurHamil') || '..........'}Minggu<br>
              <div style="padding-left:370px;">G ${getVal('g') || '.......'} P ${getVal('p') || '.......'} A ${getVal('a') || '.......'}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0; min-height:200px;">
            <div class="t-col t-f1" style="display:flex; flex-direction:row; gap:10px;">
              <div style="flex:2;">
                <strong>PEMERIKSAAN FISIK :</strong><br>
                Keterangan: (Tulis yang positif)<br>
                <div style="white-space:pre-wrap; margin-top:4px; min-height:40px; max-height:130px; overflow:hidden;">${getVal('fisik')}</div>
              </div>
              <div style="flex:1; display:flex; align-items:center; justify-content:center;">
                <img src="${getVal('canvasAnatomi') || 'assets/img/anatomi (front &amp; back).jpg'}" style="max-height:160px; max-width:100%; object-fit:contain;" alt="Anatomi">
              </div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col" style="flex:2; text-align:center;">
              <strong>STATUS FUNGSIONAL</strong><br>(*perawat)
            </div>
            <div class="t-col" style="flex:4; display:flex; align-items:center; gap:30px; padding:6px 15px;">
              <div>${sq('fungsional','Mandiri')} Mandiri</div>
              <div>${sq('fungsional','Intermiten')} Intermiten</div>
              <div>${sq('fungsional','Ketergantungan Total')} Ketergantungan Total</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0; min-height:100px;">
            <div class="t-col t-f1">
              <strong>SKRINING NYERI : (*diisi oleh perawat)</strong><br>
              <div style="display:flex; align-items:center; margin-top:5px;">
                <div style="flex:2; text-align:center;">
                  <div style="font-weight:bold; font-size:9px !important; margin-bottom:2px;">PAIN MEASUREMENT SCALE</div>
                  <img src="assets/img/pain measurement.png" style="max-width:100%; max-height:50px; object-fit:contain;" alt="Skala Nyeri">
                </div>
                <div style="flex:1; padding-left:10px;">
                  Skala nyeri: <span style="font-size:18px !important; color:red; font-weight:bold;">${getVal('nyeri')}</span>
                </div>
              </div>
            </div>
            <div class="t-col t-f1">
              <strong>PEMERIKSAAN PENUNJANG :</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:80px; overflow:hidden;">${getVal('penunjang')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0; background-color:#f2f2f2; font-weight:bold;">
            <div class="t-col t-f1">SKRINING GIZI ANAK (usia 1 bulan-18 tahun) (*perawat)</div>
            <div class="t-col t-f1">SKRINING GIZI DEWASA (*perawat)</div>
          </div>
          <div class="t-row" style="flex-shrink:0; align-items:stretch;">

            <div class="t-col t-f1" style="padding:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div class="t-inner-row" style="background-color:#f9f9f9; text-align:center; font-weight:bold;">
                  <div class="t-inner-col" style="flex:3;">PARAMETER</div>
                  <div class="t-inner-col" style="flex:1;">Ya</div>
                  <div class="t-inner-col" style="flex:1;">Tidak</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">1. &nbsp; Apakah pasien tampak kurus</div>
                  <div class="t-inner-col" style="flex:1; text-align:center;">${sq('giziA1','1')} 1</div>
                  <div class="t-inner-col" style="flex:1; text-align:center;">${sq('giziA1','0')} 0</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">
                    2. &nbsp; Apakah terdapat penurunan BB selama 1 bulan terakhir?<br>
                    &nbsp;&nbsp;&nbsp;- Berdasarkan penilaian obyektif/subyektif orang tua<br>
                    &nbsp;&nbsp;&nbsp;- Bayi &lt;1 thn BB tidak naik 3 bln terakhir
                  </div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA2','2')} 2</div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA2','0')} 0</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">
                    3. &nbsp; Apakah terdapat salah satu kondisi berikut?<br>
                    &nbsp;&nbsp;&nbsp;- Diare &gt;5x/hari atau asupan makanan berkurang 1 mgg
                  </div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA3','1')} 1</div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA3','0')} 0</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">
                    4. &nbsp; Apakah terdapat penyakit/keadaan berisiko malnutrisi?<br>
                    &nbsp;&nbsp;&nbsp;(diare kronis, HIV, PJB, ginjal, stoma, dll)
                  </div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA4','2')} 2</div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziA4','0')} 0</div>
                </div>
              </div>
              <div class="t-inner-row" style="background-color:#f9f9f9; font-weight:bold; text-align:center; border-top:1px solid black;">
                <div class="t-inner-col" style="flex:3;">TOTAL SKOR</div>
                <div class="t-inner-col" style="flex:2; font-size:14px !important;">${giziATotal}</div>
              </div>
            </div>

            <div class="t-col t-f1" style="padding:0; display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div class="t-inner-row" style="background-color:#f9f9f9; text-align:center; font-weight:bold;">
                  <div class="t-inner-col" style="flex:3;">PARAMETER</div>
                  <div class="t-inner-col" style="flex:1;">Ya</div>
                  <div class="t-inner-col" style="flex:1;">Tidak</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">
                    1. &nbsp; Apakah pasien mengalami penurunan berat badan<br>
                    &nbsp;&nbsp;&nbsp;tidak direncanakan/diinginkan 6 bulan terakhir?
                  </div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziD1','2')} 2</div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziD1','0')} 0</div>
                </div>
                <div class="t-inner-row">
                  <div class="t-inner-col" style="flex:3;">
                    2. &nbsp; Apakah asupan makan pasien berkurang karena<br>
                    &nbsp;&nbsp;&nbsp;penurunan nafsu makan / kesulitan menerima makanan?
                  </div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziD2','1')} 1</div>
                  <div class="t-inner-col" style="flex:1; text-align:center; vertical-align:middle;">${sq('giziD2','0')} 0</div>
                </div>
              </div>
              <div class="t-inner-row" style="background-color:#f9f9f9; font-weight:bold; text-align:center; border-top:1px solid black;">
                <div class="t-inner-col" style="flex:3;">TOTAL SKOR</div>
                <div class="t-inner-col" style="flex:2; font-size:14px !important;">${giziDTotal}</div>
              </div>
            </div>

          </div>

        </div>
      `;

      const page2Html = `
        <div class="t-border" style="border-top:2px solid black;">

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:60px;">
              <strong>DIAGNOSIS KERJA :</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:75px; overflow:hidden;">${getVal('diagnosisKerja')}</div>
            </div>
            <div class="t-col t-f1">
              <strong>SKRINING JATUH : (*perawat)</strong><br>
              <div style="margin-top:2px; line-height:1.7;">
                ${sq('jatuh','Tidak Berisiko')} Tidak Berisiko<br>
                ${sq('jatuh','Risiko Rendah')} Risiko Rendah<br>
                ${sq('jatuh','Risiko Tinggi')} Risiko Tinggi
              </div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:60px;">
              <strong>PERMASALAHAN MEDIS/INDIKASI RAWAT :</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:75px; overflow:hidden;">${getVal('permasalahanMedis')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:60px;">
              <strong>DIAGNOSA KEPERAWATAN : (*perawat)</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:75px; overflow:hidden;">${getVal('diagnosaKeperawatan')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:140px;">
              <strong>TERAPI DAN TINDAKAN</strong>
              <div style="white-space:pre-wrap; margin-top:2px; max-height:160px; overflow:hidden;">${getVal('terapi')}</div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1" style="min-height:170px;">
              <strong>TINDAK LANJUT :</strong><br>
              <div style="margin-top:2px; line-height:1.6;">
                ${sq('tl','APS')} Pulang Atas Permintaan Sendiri atau menolak rawat inap.<br>
                <div style="padding-left:20px;">Alasan menolak rawat inap ........................................................................................................................................</div>
                ${sq('tl','Pulang')} Pulang Atas persetujuan, pada jam: ${getVal('tl') === 'Pulang' ? getVal('tlDetail') : '.........................................................................................................................'}<br>
                ${sq('tl','Kontrol')} Kontrol tanggal: ..........................................................................................  Ke: .....................................................<br>
                ${sq('tl','Dirujuk')} Dirujuk ke ...................................................................................................&nbsp;&nbsp;&nbsp;&nbsp; ${sq('tl','Meninggal')} Meninggal<br>
                ${sq('tl','Rawat Inap')} Rawat Inap, Indikasi :<br>
                <div style="display:grid; grid-template-columns:1fr 1fr; width:300px; margin-left:15px; row-gap:1px;">
                  <div>${sq('','')}&nbsp;preventif</div><div>${sq('','')}&nbsp;rehabilitatif</div>
                  <div>${sq('','')}&nbsp;paliatif</div><div>${sq('','')}&nbsp;kuratif</div>
                </div>
                ${sq('','')}&nbsp;Rencana asuhan yang akan diberikan:.....................................................................................................................<br>
                <div style="padding-left:20px;">Hasil yang diharapkan..............................................................................................................................................</div>
              </div>
            </div>
          </div>

          <div class="t-level">KONDISI SAAT KELUAR IGD (*perawat)</div>

          <div class="t-row" style="flex-shrink:0;">
            <div class="t-col t-f1">
              <div style="display:flex; line-height:1.7;"><div style="width:110px;">Keadaan Umum</div><div style="width:10px;">:</div><div>${getVal('outKu')}</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:110px;">Kesadaran</div><div style="width:10px;">:</div><div>${getVal('outKesadaran')}</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:110px;">GCS</div><div style="width:10px;">:</div><div>${getVal('outGcs')}</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:110px;">Tekanan Darah</div><div style="width:10px;">:</div><div>${getVal('outTd') || '........................'} mmHg</div></div>
            </div>
            <div class="t-col t-f1">
              <div style="display:flex; line-height:1.7;"><div style="width:140px;">Frekuensi Tanda Vital</div><div style="width:10px;">:</div><div>${getVal('outNadi') || '........................'} mmHg</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:140px;">Suhu</div><div style="width:10px;">:</div><div>${getVal('outSuhu') || '........................'} &deg;C</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:140px;">Nadi</div><div style="width:10px;">:</div><div>${getVal('outNadi') || '........................'} x/Menit</div></div>
              <div style="display:flex; line-height:1.7;"><div style="width:140px;">Nafas</div><div style="width:10px;">:</div><div>${getVal('outNafas') || '........................'} x/Menit</div></div>
            </div>
          </div>

          <div class="t-row" style="flex-shrink:0; height:160px; position:relative;">
            <div style="position:absolute; right:10px; top:8px; font-size:11px !important;">
              Tgl. ${getVal('outTgl') || '.................'} Pukul: ${getVal('outPukul') || '...............'}
            </div>
            <div class="t-col t-f1" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; padding:15px 10px 10px; border-right:none;">
              <div>Keluarga Pasien</div>
              <div style="height:55px; display:flex; align-items:center; justify-content:center;">
                ${getVal('sigKeluarga') ? `<img src="${getVal('sigKeluarga')}" style="max-height:50px; max-width:100%; object-fit:contain;">` : ''}
              </div>
              <div>( &nbsp;${getVal('namaKeluarga') || '........................................'}&nbsp; )</div>
            </div>
            <div class="t-col t-f1" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; padding:15px 10px 10px; border-right:none;">
              <div>Perawat/Bidan</div>
              <div style="height:55px; display:flex; align-items:center; justify-content:center;">
                ${getVal('sigPerawat') ? `<img src="${getVal('sigPerawat')}" style="max-height:50px; max-width:100%; object-fit:contain;">` : ''}
              </div>
              <div>( &nbsp;${getVal('namaPerawat') || '........................................'}&nbsp; )</div>
            </div>
            <div class="t-col t-f1" style="text-align:center; display:flex; flex-direction:column; justify-content:space-between; padding:15px 10px 10px; border-right:none;">
              <div>Dokter</div>
              <div style="height:55px; display:flex; align-items:center; justify-content:center;">
                ${getVal('sigDokter') ? `<img src="${getVal('sigDokter')}" style="max-height:50px; max-width:100%; object-fit:contain;">` : ''}
              </div>
              <div>( &nbsp;${getVal('namaDokter') || '........................................'}&nbsp; )</div>
            </div>
          </div>

        </div>
      `;

      printContainer.innerHTML = createMultiPageSurat([
        {
          headerHtml: hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize, 'PENGKAJIAN AWAL IGD'),
          bodyHtml: page1Html
        },
        {
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
