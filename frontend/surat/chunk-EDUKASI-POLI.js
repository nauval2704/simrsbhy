import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import "./chunk-SURAT-CANVAS.js";
import { createSuratShell, bindSuratPrintButton, showConfirmDialog } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-edukasi-poli-placeholder");
    ɵelementEnd();
  }
}

const EDUKASI_TOPICS = [
  { id: 1, title: "Hak dan Tanggung jawab Pasien dan Keluarga (Perawat dan Bidan)", sub: [] },
  { id: 2, title: "Assesmen Awal Rawat Jalan (Dokter)", sub: ["Hasil Assesmen", "Rencana Asuhan", "Hasil yang diharapkan", "Hasil yang tidak diharapkan"] },
  { id: 3, title: "Keselamatan Pasien (Perawat/Bidan)", sub: ["Resiko Jatuh", "Gelang Identitas"] },
  { id: 4, title: "PPI (Perawat/Bidan)", sub: ["Cuci Tangan", "Etika Batuk", "Limbah", "APD"] },
  { id: 5, title: "Tata Laksana Pelayanan (Perawat/Bidan)", sub: ["Nama DPJP", "Jam Berkunjung", "Pelayanan Makanan", "Jam Visite Dokter", "Brosur Hak Pasien Diberikan"] },
  { id: 6, title: "Keamanan (Perawat/Bidan)", sub: ["Peringatan tentang orang yang berbahaya (penipu)", "Bahaya kebakaran, dilarang merokok", "Lokasi alat darurat kebakaran atau jalur evakuasi"] },
  { id: 7, title: "Manajemen Nyeri (Perawatan Bidan)", sub: ["Pengamatan keluhan nyeri", "Pengamatan & Penilaian"] },
  { id: 8, title: "Penggunaan Obat (Apoteker)", sub: ["Potensi efek samping", "Potensi Interaksi Obat", "Pengunaan Obat Efektif dan Aman"] },
  { id: 9, title: "Intruksi Pasca Rawat Jalan", sub: [] }
];

var EdukasiPoliComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.loading = true;
      this.patient = null;
      this.formData = {
        entries: EDUKASI_TOPICS.map(topic => ({
          topicId: topic.id,
          tglDate: "",
          tglTime: "",
          tglJam: "",
          pemahaman: {},
          metode: {},
          diberikan: {},
          sarana: {},
          subItems: {},
          leaflet: "",
          sasaranNama: "",
          sasaranTtd: "",
          edukatorNama: "",
          edukatorTtd: "",
          evaluasi: {}
        }))
      };

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
            if (res && res.length > 0) this.patient = res[0];
            this.fetchEdukasi();
          },
          error: () => {
            this.fetchEdukasi();
          },
        });
    }

    fetchEdukasi() {
      this.http.get(i.apiUrl + "/simrsba/edukasi-poli/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            if (res.data.entries && Array.isArray(res.data.entries)) {
              this.formData.entries = res.data.entries;
            } else if (res.data.formData && res.data.formData.entries) {
              this.formData.entries = res.data.formData.entries;
            }
          }
          this.loading = false;
          this.renderUI();
        },
        error: () => {
          this.loading = false;
          this.renderUI();
        },
      });
    }

    syncFromDOM() {
      const root = document.querySelector("app-edukasi-poli-placeholder");
      if (!root) return;

      root.querySelectorAll(".edu-input").forEach((el) => {
        const idx = parseInt(el.dataset.idx);
        const field = el.dataset.field;
        const subfield = el.dataset.subfield;
        if (isNaN(idx) || !this.formData.entries[idx]) return;

        const ent = this.formData.entries[idx];
        if (subfield) {
          if (!ent[field]) ent[field] = {};
          if (el.type === "checkbox") {
            ent[field][subfield] = el.checked;
          } else {
            ent[field][subfield] = el.value;
          }
        } else {
          if (el.type === "checkbox") {
            ent[field] = el.checked;
          } else {
            ent[field] = el.value;
          }
        }

        // Format tglJam
        if (field === 'tglDate' || field === 'tglTime') {
          let dStr = "";
          if (ent.tglDate) {
            const parts = ent.tglDate.split("-");
            if (parts.length === 3) dStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
            else dStr = ent.tglDate;
          }
          ent.tglJam = `${dStr} ${ent.tglTime || ''}`.trim();
        }
      });
    }

    saveData() {
      this.syncFromDOM();
      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        namaPasien: this.patient?.nama,
        dpjp: this.patient?.dpjp,
        tglInput: new Date().toISOString(),
        entries: this.formData.entries
      };

      const btn = document.getElementById("btn-save-edukasi");
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Menyimpan...'; }

      this.http.post(i.apiUrl + "/simrsba/edukasi-poli", payload).subscribe({
        next: (res) => {
          this.toastr.success("Berhasil menyimpan Edukasi Pasien Poli", "Sukses");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
          this.renderUI();
        },
        error: (err) => {
          this.toastr.error("Gagal menyimpan data Edukasi Pasien Poli", "Error");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
        }
      });
    }

    renderUI() {
      const root = document.querySelector("app-edukasi-poli-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML = '<div class="d-flex justify-content-center align-items-center" style="min-height:300px;color:#888;">Memuat data...</div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const dpjp = p.dpjp || p.nama_dokter || "-";

      let rowsFormHtml = '<div class="accordion" id="accordionEdukasi">';
      EDUKASI_TOPICS.forEach((topic, idx) => {
        const ent = this.formData.entries[idx] || {};
        const pma = ent.pemahaman || {};
        const mtd = ent.metode || {};
        const dib = ent.diberikan || {};
        const srn = ent.sarana || {};
        const sub = ent.subItems || {};
        const eva = ent.evaluasi || {};

        const hasData = Boolean(
          ent.tglDate || ent.tglTime || ent.sasaranNama || ent.sasaranTtd || ent.edukatorTtd ||
          Object.values(pma).some(Boolean) || Object.values(mtd).some(Boolean) ||
          Object.values(dib).some(Boolean) || Object.values(srn).some(Boolean) ||
          Object.values(eva).some(Boolean)
        );

        const statusBadge = hasData
          ? `<span class="badge bg-success-subtle text-success border border-success me-2" style="font-size:11px;"><i class="bi bi-check-circle-fill me-1"></i>Terisi</span>`
          : `<span class="badge bg-light text-muted border me-2" style="font-size:11px;">Belum Diisi</span>`;

        let subItemsHtml = "";
        if (topic.sub && topic.sub.length > 0) {
          subItemsHtml = '<div class="mt-2 p-2 bg-light border rounded"><div class="fw-bold mb-1" style="font-size:11px;">Sub Pokok Edukasi:</div><div class="row g-2">';
          topic.sub.forEach((sItem, sIdx) => {
            const isChecked = sub[`sub_${sIdx}`] ? "checked" : "";
            subItemsHtml += `
            <div class="col-md-6">
              <div class="form-check mb-1">
                <input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="subItems" data-subfield="sub_${sIdx}" id="sub_${idx}_${sIdx}" ${isChecked}>
                <label class="form-check-label" for="sub_${idx}_${sIdx}" style="font-size:11px;">${sItem}</label>
              </div>
            </div>`;
          });
          subItemsHtml += '</div></div>';
        }

        const isFirst = idx === 0;

        rowsFormHtml += `
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_edu_${idx}">
            <button class="accordion-button ${isFirst ? '' : 'collapsed'} py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_edu_${idx}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="collapse_edu_${idx}">
              <div class="d-flex justify-content-between align-items-center w-100 me-3">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-journal-check me-2 text-secondary"></i> Topik #${topic.id}: ${topic.title}</span>
                ${statusBadge}
              </div>
            </button>
          </h2>
          <div id="collapse_edu_${idx}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="heading_edu_${idx}" data-bs-parent="#accordionEdukasi">
            <div class="accordion-body bg-white p-3">

              <div class="row g-2 mb-3">
                <div class="col-md-2">
                  <label class="f-label">Tanggal</label>
                  <input type="date" class="f-input edu-input" data-idx="${idx}" data-field="tglDate" value="${ent.tglDate || ''}">
                </div>
                <div class="col-md-2">
                  <label class="f-label">Jam</label>
                  <input type="time" class="f-input edu-input" data-idx="${idx}" data-field="tglTime" value="${ent.tglTime || ''}">
                </div>
                <div class="col-md-4">
                  <label class="f-label" style="font-size:11px;">Nama Sasaran (Pasien/Keluarga)</label>
                  <input type="text" class="f-input edu-input" style="font-size:12px;" data-idx="${idx}" data-field="sasaranNama" value="${ent.sasaranNama || ''}" placeholder="Nama Sasaran...">
                </div>
                <div class="col-md-4">
                  <label class="f-label" style="font-size:11px;">Nama Edukator / Petugas</label>
                  <input type="text" class="f-input edu-input" style="font-size:12px;" data-idx="${idx}" data-field="edukatorNama" value="${ent.edukatorNama || dpjp}" placeholder="Nama Edukator...">
                </div>
              </div>

              ${subItemsHtml}

              <div class="row g-2 my-2">
                <div class="col-md-3">
                  <label class="f-label text-dark" style="font-size:11px;">Tingkat Pemahaman Awal</label>
                  <div class="border rounded p-2 bg-light">
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="pemahaman" data-subfield="sudahMengerti" id="pma_1_${idx}" ${pma.sudahMengerti ? 'checked' : ''}><label class="form-check-label" for="pma_1_${idx}" style="font-size:11px;">Sudah Mengerti</label></div>
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="pemahaman" data-subfield="edukasiUlang" id="pma_2_${idx}" ${pma.edukasiUlang ? 'checked' : ''}><label class="form-check-label" for="pma_2_${idx}" style="font-size:11px;">Edukasi Ulang</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="pemahaman" data-subfield="halBaru" id="pma_3_${idx}" ${pma.halBaru ? 'checked' : ''}><label class="form-check-label" for="pma_3_${idx}" style="font-size:11px;">Hal Baru</label></div>
                  </div>
                </div>

                <div class="col-md-3">
                  <label class="f-label text-dark" style="font-size:11px;">Metode Edukasi</label>
                  <div class="border rounded p-2 bg-light">
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="metode" data-subfield="wawancara" id="mtd_1_${idx}" ${mtd.wawancara ? 'checked' : ''}><label class="form-check-label" for="mtd_1_${idx}" style="font-size:11px;">Wawancara</label></div>
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="metode" data-subfield="diskusi" id="mtd_2_${idx}" ${mtd.diskusi ? 'checked' : ''}><label class="form-check-label" for="mtd_2_${idx}" style="font-size:11px;">Diskusi Kelompok</label></div>
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="metode" data-subfield="ceramah" id="mtd_3_${idx}" ${mtd.ceramah ? 'checked' : ''}><label class="form-check-label" for="mtd_3_${idx}" style="font-size:11px;">Ceramah</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="metode" data-subfield="demonstrasi" id="mtd_4_${idx}" ${mtd.demonstrasi ? 'checked' : ''}><label class="form-check-label" for="mtd_4_${idx}" style="font-size:11px;">Demonstrasi</label></div>
                  </div>
                </div>

                <div class="col-md-3">
                  <label class="f-label text-dark" style="font-size:11px;">Diberikan Kepada</label>
                  <div class="border rounded p-2 bg-light">
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="diberikan" data-subfield="pasien" id="dib_1_${idx}" ${dib.pasien ? 'checked' : ''}><label class="form-check-label" for="dib_1_${idx}" style="font-size:11px;">Pasien</label></div>
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="diberikan" data-subfield="keluarga" id="dib_2_${idx}" ${dib.keluarga ? 'checked' : ''}><label class="form-check-label" for="dib_2_${idx}" style="font-size:11px;">Keluarga</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="diberikan" data-subfield="lainnya" id="dib_3_${idx}" ${dib.lainnya ? 'checked' : ''}><label class="form-check-label" for="dib_3_${idx}" style="font-size:11px;">Lainnya</label></div>
                  </div>
                </div>

                <div class="col-md-3">
                  <label class="f-label text-dark" style="font-size:11px;">Sarana Edukasi &amp; Leaflet</label>
                  <div class="border rounded p-2 bg-light mb-1">
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="sarana" data-subfield="leaflet" id="srn_1_${idx}" ${srn.leaflet ? 'checked' : ''}><label class="form-check-label" for="srn_1_${idx}" style="font-size:11px;">Leaflet</label></div>
                    <div class="form-check mb-1"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="sarana" data-subfield="audiovisual" id="srn_2_${idx}" ${srn.audiovisual ? 'checked' : ''}><label class="form-check-label" for="srn_2_${idx}" style="font-size:11px;">Audiovisual</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="sarana" data-subfield="lainnya" id="srn_3_${idx}" ${srn.lainnya ? 'checked' : ''}><label class="form-check-label" for="srn_3_${idx}" style="font-size:11px;">Lainnya</label></div>
                  </div>
                  <input type="text" class="f-input edu-input" style="font-size:11px;" data-idx="${idx}" data-field="leaflet" value="${ent.leaflet || ''}" placeholder="No. Leaflet...">
                </div>
              </div>

              <div class="row g-2 mb-2">
                <div class="col-md-6">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="f-label mb-0" style="font-size:11px;">TTD Sasaran (Pasien / Keluarga)</label>
                    <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-idx="${idx}" data-sigtype="sasaranTtd" style="font-size:10px; padding:1px 6px;"><i class="bi bi-eraser me-1"></i>Hapus TTD</button>
                  </div>
                  <div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden;">
                    <canvas id="sig-sasaran-${idx}" class="edu-sig-canvas" data-idx="${idx}" data-sigtype="sasaranTtd" width="500" height="150" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none;"></canvas>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="f-label mb-0" style="font-size:11px;">TTD Edukator / Petugas</label>
                    <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-idx="${idx}" data-sigtype="edukatorTtd" style="font-size:10px; padding:1px 6px;"><i class="bi bi-eraser me-1"></i>Hapus TTD</button>
                  </div>
                  <div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden;">
                    <canvas id="sig-edukator-${idx}" class="edu-sig-canvas" data-idx="${idx}" data-sigtype="edukatorTtd" width="500" height="150" style="display:block; width:100%; height:100px; cursor:crosshair; touch-action:none;"></canvas>
                  </div>
                </div>
              </div>

              <div class="row g-2">
                <div class="col-12">
                  <label class="f-label text-dark" style="font-size:11px;">Evaluasi Post Edukasi</label>
                  <div class="border rounded p-2 bg-light d-flex gap-4">
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="evaluasi" data-subfield="reEdukasi" id="eva_1_${idx}" ${eva.reEdukasi ? 'checked' : ''}><label class="form-check-label" for="eva_1_${idx}" style="font-size:11px;">Re-edukasi</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="evaluasi" data-subfield="reDemonstrasi" id="eva_2_${idx}" ${eva.reDemonstrasi ? 'checked' : ''}><label class="form-check-label" for="eva_2_${idx}" style="font-size:11px;">Re-demonstrasi</label></div>
                    <div class="form-check"><input class="form-check-input edu-input" type="checkbox" data-idx="${idx}" data-field="evaluasi" data-subfield="sudahMengerti" id="eva_3_${idx}" ${eva.sudahMengerti ? 'checked' : ''}><label class="form-check-label" for="eva_3_${idx}" style="font-size:11px;">Sudah Mengerti</label></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>`;
      });
      rowsFormHtml += '</div>';

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

      <div id="edukasi-container" class="mb-3">
        ${rowsFormHtml}
      </div>
      <div class="d-flex justify-content-end mt-3 border-top pt-3">
        <button type="button" id="btn-save-edukasi" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'edukasi',
        wrapperTag: 'app-edukasi-poli-placeholder',
        inputPaneId: 'edukasi-input',
        printPaneId: 'edukasi-print',
        printTabId: 'edukasi-print-tab',
        tabsClass: 'edukasi-tabs',
        extraCss: `.edu-table { width: 100%; height: 100%; border-collapse: collapse; font-size: 10px; font-family: 'Times New Roman', Times, serif; table-layout: fixed; }
.edu-table th, .edu-table td { border: 1px solid black; padding: 3px; vertical-align: top; }
.edu-table th { text-align: center; vertical-align: middle; font-size: 9px; background-color: #f9f9f9; font-weight: bold; }
.col-no { width: 2%; text-align: center; }
.col-date { width: 5%; }
.col-time { width: 4%; }
.col-materi { width: 18%; }
.col-pemahaman { width: 10%; }
.col-metode { width: 10%; }
.col-diberikan { width: 7%; }
.col-sarana { width: 8%; }
.col-leaflet { width: 6%; }
.col-sasaran { width: 10%; }
.col-edukator { width: 10%; }
.col-eval { width: 10%; }
ul.cb-list { list-style: none; padding-left: 0; margin: 0; }
ul.cb-list li { margin-bottom: 2px; display: flex; align-items: flex-start; font-size: 9px; }
.cb { display: inline-block; width: 10px; height: 10px; border: 1px solid black; margin-right: 4px; margin-top: 1px; flex-shrink: 0; text-align: center; line-height: 9px; font-size: 9px; font-weight: bold; }
.cb.checked::after { content: "✓"; }
#accordionEdukasi .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }
#accordionEdukasi .accordion-button { box-shadow: none !important; }
#accordionEdukasi .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }
#accordionEdukasi .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
#accordionEdukasi .form-check-input:checked { background-color: #495057 !important; border-color: #495057 !important; }
#accordionEdukasi .form-check-input:focus { border-color: #6c757d !important; box-shadow: none !important; }`,
        inputContent,
      });
      bindSuratPrintButton(root);

      const btnSave = root.querySelector("#btn-save-edukasi");
      if (btnSave) btnSave.addEventListener("click", () => this.saveData());

      // Bind signature canvases
      root.querySelectorAll(".edu-sig-canvas").forEach((canvas) => {
        const idx = parseInt(canvas.dataset.idx);
        const sigType = canvas.dataset.sigtype;
        if (isNaN(idx) || !this.formData.entries[idx] || !sigType) return;
        const ctx = canvas.getContext("2d");
        const ent = this.formData.entries[idx];
        if (ent[sigType]) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = ent[sigType];
        }
        let drawing = false;
        let lastX = 0, lastY = 0;
        const getPos = (ev) => {
          const r = canvas.getBoundingClientRect();
          const sx = canvas.width / r.width;
          const sy = canvas.height / r.height;
          if (ev.touches) return [(ev.touches[0].clientX - r.left) * sx, (ev.touches[0].clientY - r.top) * sy];
          return [(ev.clientX - r.left) * sx, (ev.clientY - r.top) * sy];
        };
        const startDraw = (ev) => { drawing = true; [lastX, lastY] = getPos(ev); };
        const moveDraw = (ev) => {
          if (!drawing) return;
          const [x, y] = getPos(ev);
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
            ent[sigType] = canvas.toDataURL();
          }
        };
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", moveDraw);
        canvas.addEventListener("mouseup", stopDraw);
        canvas.addEventListener("mouseleave", stopDraw);
        canvas.addEventListener("touchstart", (ev) => { ev.preventDefault(); startDraw(ev); }, { passive: false });
        canvas.addEventListener("touchmove", (ev) => { ev.preventDefault(); moveDraw(ev); }, { passive: false });
        canvas.addEventListener("touchend", stopDraw);
      });

      root.querySelectorAll(".sig-clear-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          const sigType = btn.dataset.sigtype;
          const canvas = root.querySelector(`canvas[data-idx="${idx}"][data-sigtype="${sigType}"]`);
          if (canvas && !isNaN(idx) && this.formData.entries[idx]) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            delete this.formData.entries[idx][sigType];
          }
        });
      });

      const printTab = root.querySelector("#edukasi-print-tab");
      const updatePrint = () => {
        this.syncFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      // Pre-render print layout immediately
      updatePrint();
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp) {
      const printContainer = document.getElementById("edukasi-print-container");
      if (!printContainer) return;

      let rowsPrintHtml = "";
      EDUKASI_TOPICS.forEach((topic, idx) => {
        const ent = this.formData.entries[idx] || {};
        const pma = ent.pemahaman || {};
        const mtd = ent.metode || {};
        const dib = ent.diberikan || {};
        const srn = ent.sarana || {};
        const sub = ent.subItems || {};
        const eva = ent.evaluasi || {};

        let tglStr = "";
        let jamStr = "";
        if (ent.tglDate) {
          const parts = ent.tglDate.split("-");
          if (parts.length === 3) tglStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
          else tglStr = ent.tglDate;
        }
        if (ent.tglTime) jamStr = ent.tglTime;

        let subPrintListHtml = "";
        if (topic.sub && topic.sub.length > 0) {
          subPrintListHtml = '<ul class="cb-list" style="margin-top:2px;">';
          topic.sub.forEach((sItem, sIdx) => {
            const isChecked = sub[`sub_${sIdx}`];
            subPrintListHtml += `<li><span class="cb ${isChecked ? 'checked' : ''}"></span>${sItem}</li>`;
          });
          subPrintListHtml += '</ul>';
        }

        rowsPrintHtml += `
        <tr>
          <td style="text-align:center;">${topic.id}</td>
          <td style="text-align:center;">${tglStr}</td>
          <td style="text-align:center;">${jamStr}</td>
          <td>
            ${topic.title}
            ${subPrintListHtml}
          </td>
          <td>
            <ul class="cb-list">
              <li><span class="cb ${pma.sudahMengerti ? 'checked' : ''}"></span>Sudah Mengerti</li>
              <li><span class="cb ${pma.edukasiUlang ? 'checked' : ''}"></span>Edukasi Ulang</li>
              <li><span class="cb ${pma.halBaru ? 'checked' : ''}"></span>Hal baru</li>
            </ul>
          </td>
          <td>
            <ul class="cb-list">
              <li><span class="cb ${mtd.wawancara ? 'checked' : ''}"></span>Wawancara</li>
              <li><span class="cb ${mtd.diskusi ? 'checked' : ''}"></span>Diskusi Kelompok</li>
              <li><span class="cb ${mtd.ceramah ? 'checked' : ''}"></span>Ceramah</li>
              <li><span class="cb ${mtd.demonstrasi ? 'checked' : ''}"></span>Demonstrasi</li>
            </ul>
          </td>
          <td>
            <ul class="cb-list">
              <li><span class="cb ${dib.pasien ? 'checked' : ''}"></span>Pasien</li>
              <li><span class="cb ${dib.keluarga ? 'checked' : ''}"></span>Keluarga</li>
              <li><span class="cb ${dib.lainnya ? 'checked' : ''}"></span>Lainnya</li>
            </ul>
          </td>
          <td>
            <ul class="cb-list">
              <li><span class="cb ${srn.leaflet ? 'checked' : ''}"></span>Leaflet</li>
              <li><span class="cb ${srn.audiovisual ? 'checked' : ''}"></span>Audiovisual</li>
              <li><span class="cb ${srn.lainnya ? 'checked' : ''}"></span>Lainnya</li>
            </ul>
          </td>
          <td style="text-align:center;">${ent.leaflet || ''}</td>
          <td style="text-align:center; vertical-align:bottom;">
            ${ent.sasaranTtd ? `<img src="${ent.sasaranTtd}" style="max-height:35px; max-width:90%; display:block; margin:2px auto;">` : ''}
            <div style="font-weight:bold; font-size:9px;">${ent.sasaranNama || ''}</div>
          </td>
          <td style="text-align:center; vertical-align:bottom;">
            ${ent.edukatorTtd ? `<img src="${ent.edukatorTtd}" style="max-height:35px; max-width:90%; display:block; margin:2px auto;">` : ''}
            <div style="font-weight:bold; font-size:9px;">${ent.edukatorNama || dpjp}</div>
          </td>
          <td>
            <ul class="cb-list">
              <li><span class="cb ${eva.reEdukasi ? 'checked' : ''}"></span>Re-edukasi</li>
              <li><span class="cb ${eva.reDemonstrasi ? 'checked' : ''}"></span>Re-demonstrasi</li>
              <li><span class="cb ${eva.sudahMengerti ? 'checked' : ''}"></span>Sudah Mengerti</li>
            </ul>
          </td>
        </tr>`;
      });

      printContainer.innerHTML = `
      <div class="surat-document-landscape">
        <div class="main-border" style="border:2px solid black; width:100%; height:100%; display:flex; flex-direction:column; background:#fff;">
          <div class="header-section" style="display:flex; border-bottom:2px solid black; height:80px; flex-shrink:0;">
            <div class="logo-box" style="width:110px; display:flex; align-items:center; justify-content:center; border-right:1px solid black; text-align:center; flex-shrink:0;">
              <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:75px;object-fit:contain;" onerror="this.style.display='none'">
            </div>
            <div class="title-box" style="flex:1; text-align:center; display:flex; flex-direction:column; justify-content:center; padding:5px;">
              <h3 style="font-size:16px; margin-bottom:3px; font-weight:bold;">RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
              <p style="font-size:11px;">Jln. Cut Nyak Dhien No. 23 Lamteumen Barat, Banda Aceh Telp. 0651-41355, 0651-41470</p>
            </div>
            <div class="meta-box" style="width:300px; padding:5px; border-left:1px solid black; display:flex; flex-direction:column; justify-content:center; flex-shrink:0;">
              <div class="meta-inner" style="border:1px solid black; border-radius:8px; padding:4px; font-size:11px; line-height:1.3;">
                <div style="display:flex;"><div style="width:90px;">NRM</div><div>: ${noMr}</div></div>
                <div style="display:flex;"><div style="width:90px;">Nama</div><div>: ${nama}</div></div>
                <div style="display:flex;"><div style="width:90px;">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
                <div style="display:flex;"><div style="width:90px;">Jenis Kelamin</div><div>: ${kelamin}</div></div>
              </div>
            </div>
          </div>

          <div class="doc-title" style="text-align:center; font-weight:bold; font-size:13px; padding:6px; border-bottom:2px solid black; background-color:#e6e6e6; flex-shrink:0;">
            EDUKASI PASIEN DAN KELUARGA TERINTEGRASI RAWAT JALAN
          </div>

          <div class="edu-table-wrap" style="flex:1; overflow:hidden;">
            <table class="edu-table" style="width:100%; height:100%; border-collapse:collapse; font-size:10px; table-layout:fixed; font-family:'Times New Roman',Times,serif;">
              <thead>
                <tr>
                  <th rowspan="2" class="col-no" style="width:2%;">NO</th>
                  <th colspan="2" style="width:9%;">WAKTU PELAKSANAAN EDUKASI</th>
                  <th rowspan="2" class="col-materi" style="width:18%;">MATERI EDUKASI</th>
                  <th rowspan="2" class="col-pemahaman" style="width:10%;">TINGKAT PEMAHAMAN AWAL SEBELUM EDUKASI</th>
                  <th rowspan="2" class="col-metode" style="width:10%;">METODE PEMBERIAN EDUKASI</th>
                  <th rowspan="2" class="col-diberikan" style="width:7%;">DIBERIKAN KEPADA</th>
                  <th rowspan="2" class="col-sarana" style="width:8%;">SARANA EDUKASI</th>
                  <th rowspan="2" class="col-leaflet" style="width:6%;">NOMOR LEAFLET</th>
                  <th rowspan="2" class="col-sasaran" style="width:10%;">SASARAN<br><br>NAMA &amp; TTD</th>
                  <th rowspan="2" class="col-edukator" style="width:10%;">EDUKATOR<br><br>NAMA / PROFESI &amp; TTD</th>
                  <th rowspan="2" class="col-eval" style="width:10%;">EVALUASI POST EDUKASI</th>
                </tr>
                <tr>
                  <th class="col-date" style="width:5%;">TANGGAL</th>
                  <th class="col-time" style="width:4%;">JAM</th>
                </tr>
              </thead>
              <tbody>
                ${rowsPrintHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-edukasi-poli-placeholder"]],
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

export { EdukasiPoliComponent };
