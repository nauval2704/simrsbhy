import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as _cmp,
  gc as _elementStart,
  hc as _elementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { createSuratShell, bindSuratPrintButton, hospitalHeaderRow, showSuccessToast, showErrorAlert } from "./chunk-SURAT-LAYOUT.js";

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
            if(!this.formData.tindakLanjut) this.formData.tindakLanjut = {};
            if(!this.formData.alasanTidakDirawat) this.formData.alasanTidakDirawat = {};
            if(!this.formData.kondisiKeluar) this.formData.kondisiKeluar = {};
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
        const payload = {
            noCheckin: this.noCheckin,
            noMr: this.patient?.noMr || this.patient?.norm,
            namaPasien: this.patient?.nama,
            dpjp: this.patient?.dpjp,
            tglInput: new Date().toISOString(),
            ...this.formData
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

      <div class="d-flex justify-content-end mt-3 border-top pt-3">
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
      bindSuratPrintButton(root);

      const makeSigPad = (canvasId, fieldName) => {
        const canvas = root.querySelector("#" + canvasId);
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

      makeSigPad("sig-keluarga-rp", "sigKeluarga");
      makeSigPad("sig-dokter-rp", "sigDokter");

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
          el.addEventListener("change", (e) => {
              if(e.target.checked) {
                  const parent = e.target.dataset.parent;
                  const field = e.target.dataset.field;
                  if (!this.formData[parent]) this.formData[parent] = {};
                  this.formData[parent][field] = e.target.value;
              }
          });
      });

      const printTab = root.querySelector("#rp-print-tab");
      if (printTab) {
          printTab.addEventListener("click", () => {
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
                  if (el.checked) {
                      const parent = el.dataset.parent;
                      const field = el.dataset.field;
                      if (parent && field) {
                          if (!this.formData[parent]) this.formData[parent] = {};
                          this.formData[parent][field] = el.value;
                      }
                  }
              });
              this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
          });
      }
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin) {
        const printContainer = document.getElementById("rp-print-container");
        if (!printContainer) return;
        
        const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => { if (!str || str.length <= maxLen) return defaultSize; return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1); };
        const fd = this.formData;
        const cb = (val, match) => (val === match) ? 'cb cb-checked' : 'cb';
        const dpjp = this.patient && this.patient.dpjp ? this.patient.dpjp : '........................................';
        
        printContainer.innerHTML = `
    <div class="surat-page">
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

                <tr>
                    <td colspan="2">Diagnosis Kerja</td>
                    <td colspan="4" style="white-space:pre-wrap;">${fd.diagnosisKerja || ''}</td>
                </tr>

                <tr style="height: 70px;">
                    <td colspan="3">Tindakan / Terapi saat di IGD:<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.tindakanTerapi || ''}</div></td>
                    <td colspan="3">Diagnosis Banding<br><div style="white-space:pre-wrap; margin-top:2px;">${fd.diagnosisBanding || ''}</div></td>
                </tr>

                <tr>
                    <td colspan="2">Tindak Lanjut</td>
                    <td colspan="4" style="line-height: 1.6;">
                        <span class="${cb(fd.tindakLanjut.tipe, 'APS')}"></span> Pulang Atas Permintaan Sendiri/ Menolak rawat inap<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Alasan menolak rawat inap karena ${fd.tindakLanjut.alasanAps || '.................................................'}<br>
                        <span class="${cb(fd.tindakLanjut.tipe, 'Persetujuan')}"></span> Pulang Atas Persetujuan, pada jam ${fd.tindakLanjut.jamPersetujuan || '...........................'}<br>
                        <span class="${cb(fd.tindakLanjut.tipe, 'Kontrol')}"></span> Kontrol Tanggal ${fd.tindakLanjut.kontrolTgl || '....................................................'} Ke ${fd.tindakLanjut.kontrolKe || '.................................................'}<br>
                        <span class="${cb(fd.tindakLanjut.tipe, 'Rujuk')}"></span> Dirujuk ke ${fd.tindakLanjut.rujukKe || '.................................................................'}<br>
                        <span class="${cb(fd.tindakLanjut.tipe, 'Meninggal')}"></span> Meninggal, pukul ${fd.tindakLanjut.jamMeninggal || '........................'} WIB
                    </td>
                </tr>

                <tr>
                    <td colspan="2">Alasan tidak perlu dirawat</td>
                    <td colspan="4" style="line-height: 1.6;">
                        Keadaan umum : ${fd.alasanTidakDirawat.keadaanUmum || '.......................................................'}<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tanda-tanda Kegawatan : <span class="${cb(fd.alasanTidakDirawat.tandaKegawatan, 'Ada')}"></span> Ada &nbsp;&nbsp; <span class="${cb(fd.alasanTidakDirawat.tandaKegawatan, 'Tidak ada')}"></span> Tidak ada<br>
                    </td>
                </tr>

                <tr style="height: 35px;">
                    <td colspan="2">Edukasi</td>
                    <td colspan="4" style="white-space:pre-wrap;">${fd.edukasi || ''}</td>
                </tr>

                <tr>
                    <td colspan="2" rowspan="5" style="vertical-align: top;">Kondisi saat keluar</td>
                    <td colspan="1">Keadaan umum</td>
                    <td colspan="3">${fd.kondisiKeluar.keadaanUmum || ''}</td>
                </tr>
                <tr>
                    <td colspan="1">Kesadaran</td>
                    <td colspan="3">${fd.kondisiKeluar.kesadaran || ''}</td>
                </tr>
                <tr>
                    <td colspan="1" rowspan="3" style="vertical-align: middle; font-style: italic;">Vital Sign</td>
                    <td colspan="1">TD : ${fd.kondisiKeluar.td || ''}</td>
                    <td colspan="1" style="text-align: right;">mmHg</td>
                    <td colspan="1">Suhu : ${fd.kondisiKeluar.suhu || ''} &deg;C</td>
                </tr>
                <tr>
                    <td colspan="1">Nadi : ${fd.kondisiKeluar.nadi || ''}</td>
                    <td colspan="1" style="text-align: right;">X/Menit</td>
                    <td colspan="1">Nyeri : ${fd.kondisiKeluar.nyeri || 'Tidak/ Ya, skala : .............'}</td>
                </tr>
                <tr>
                    <td colspan="1">RR : ${fd.kondisiKeluar.rr || ''}</td>
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
                            ${fd.sigKeluarga ? `<img src="${fd.sigKeluarga}" style="max-height: 55px; max-width: 100%; object-fit: contain;">` : ''}
                        </div>
                        <div style="margin-top: 5px;">( ${fd.namaPasienKeluarga || '........................................'} )</div>
                    </td>
                    <td colspan="3" style="text-align: center; vertical-align: top; padding-top: 5px;">
                        Banda Aceh, ${fd.tglJamKeluar ? fd.tglJamKeluar.split('T')[0] : '............................'}<br>
                        Dokter Penanggungjawab<br>
                        Pelayanan Kegawatdaruratan
                        <div style="height: 55px; display: flex; align-items: center; justify-content: center; margin-top: 5px;">
                            ${fd.sigDokter ? `<img src="${fd.sigDokter}" style="max-height: 50px; max-width: 100%; object-fit: contain;">` : ''}
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

