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
import { createSuratShell, bindSuratPrintButton, showSuccessToast, showErrorAlert, showConfirmDialog } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-pemberian-obat-igd-wrapper");
    _elementEnd();
  }
}

var PemberianObatIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.formData = {
        entries: [],
        canvasImage: null
      };

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1] || pathParts[5];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() { }

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
      this.http.get(i.apiUrl + "/simrsba/pemberian-obat-igd/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.formData = { ...this.formData, ...res.data };
            if (!this.formData.entries) this.formData.entries = [];
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

    syncEntriesFromDOM() {
      const root = document.querySelector("app-pemberian-obat-igd-wrapper");
      if (!root) return;

      // Sync 6 Dates
      for (let d = 1; d <= 6; d++) {
        const input = root.querySelector(`.input-tgl[data-tgl="${d}"]`);
        if (input) {
          this.formData[`tgl${d}`] = input.value;
        }
      }

      // Sync medication text inputs
      root.querySelectorAll(".input-entry").forEach((el) => {
        const idx = parseInt(el.dataset.index);
        const field = el.dataset.field;
        if (!isNaN(idx) && field && this.formData.entries && this.formData.entries[idx]) {
          this.formData.entries[idx][field] = el.value;
        }
      });

      // Sync checkbox matrix (PG/SI/SO/ML for dates 0..5)
      root.querySelectorAll(".check-entry").forEach((el) => {
        const idx = parseInt(el.dataset.index);
        const key = el.dataset.check;
        if (!isNaN(idx) && key && this.formData.entries && this.formData.entries[idx]) {
          if (!this.formData.entries[idx].checks) {
            this.formData.entries[idx].checks = {};
          }
          this.formData.entries[idx].checks[key] = el.checked;
        }
      });
    }

    saveData() {
      this.syncEntriesFromDOM();
      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm,
        namaPasien: this.patient?.nama,
        dpjp: this.patient?.dpjp,
        tglInput: new Date().toISOString(),
        tgl1: this.formData.tgl1 || '',
        tgl2: this.formData.tgl2 || '',
        tgl3: this.formData.tgl3 || '',
        tgl4: this.formData.tgl4 || '',
        tgl5: this.formData.tgl5 || '',
        tgl6: this.formData.tgl6 || '',
        entries: this.formData.entries
      };

      const btn = document.getElementById("btn-save-obat");
      if (btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Menyimpan...'; }

      this.http.post(i.apiUrl + "/simrsba/pemberian-obat-igd", payload).subscribe({
        next: (res) => {
          this.toastr.success("Berhasil menyimpan Pemberian Obat IGD", "Sukses");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
          this.renderUI();
        },
        error: (err) => {
          this.toastr.error("Gagal menyimpan data Pemberian Obat", "Error");
          if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
        }
      });
    }

    addEntry() {
      this.syncEntriesFromDOM();
      this.formData.entries.push({
        namaObat: "", dosis: "", rute: "", frekuensi: "", waktu: "", checks: {}
      });
      this.renderUI();
    }

    removeEntry(index) {
      showConfirmDialog("Hapus entri obat ini?", () => {
        this.syncEntriesFromDOM();
        this.formData.entries.splice(index, 1);
        this.renderUI();
      });
    }

    renderUI() {
      const root = document.querySelector("app-pemberian-obat-igd-wrapper");
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
      const dpjp = p.dokterDpjp || p.dpjp || "-";
      const ruang = p.namaRuang || p.ruang || "IGD";
      const diagnosa = p.diagnosa || p.diagnosaAwal || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1);
      };

      const dateNow = new Date();
      const tglMasuk = p.tglMasuk || p.tgl_masuk || dateNow.toLocaleDateString('id-ID');

      const fd = this.formData;

      let entriesHtml = "";
      if (fd.entries && fd.entries.length > 0) {
        fd.entries.forEach((ent, idx) => {
          if (!ent.checks) ent.checks = {};

          let checkMatrixHtml = "";
          for (let d = 0; d < 6; d++) {
            const tglVal = fd[`tgl${d + 1}`] ? fd[`tgl${d + 1}`] : `Tgl ${d + 1}`;
            checkMatrixHtml += `
              <div class="col-6 col-md-2 p-1 border-end">
                <div class="bg-light px-2 py-1 mb-1 rounded text-center border" style="font-size:10px; font-weight:bold; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${tglVal}</div>
                <div class="d-flex justify-content-around text-center" style="font-size:10px;">
                  <label class="d-flex flex-column align-items-center cursor-pointer mb-0">
                    <span style="font-size:9px; color:#666;">PG</span>
                    <input type="checkbox" class="check-entry form-check-input mt-0" data-index="${idx}" data-check="${d}_PG" ${ent.checks[`${d}_PG`] ? 'checked' : ''}>
                  </label>
                  <label class="d-flex flex-column align-items-center cursor-pointer mb-0">
                    <span style="font-size:9px; color:#666;">SI</span>
                    <input type="checkbox" class="check-entry form-check-input mt-0" data-index="${idx}" data-check="${d}_SI" ${ent.checks[`${d}_SI`] ? 'checked' : ''}>
                  </label>
                  <label class="d-flex flex-column align-items-center cursor-pointer mb-0">
                    <span style="font-size:9px; color:#666;">SO</span>
                    <input type="checkbox" class="check-entry form-check-input mt-0" data-index="${idx}" data-check="${d}_SO" ${ent.checks[`${d}_SO`] ? 'checked' : ''}>
                  </label>
                  <label class="d-flex flex-column align-items-center cursor-pointer mb-0">
                    <span style="font-size:9px; color:#666;">ML</span>
                    <input type="checkbox" class="check-entry form-check-input mt-0" data-index="${idx}" data-check="${d}_ML" ${ent.checks[`${d}_ML`] ? 'checked' : ''}>
                  </label>
                </div>
              </div>`;
          }

          entriesHtml += `
          <div class="py-3 px-2 ${idx > 0 ? 'border-top' : ''}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold text-dark small"><i class="bi bi-capsule me-1"></i> Obat #${idx + 1}</span>
              <button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-index="${idx}">
                <i class="bi bi-trash me-1"></i>Hapus Obat
              </button>
            </div>
            <div class="row g-2 mb-2">
              <div class="col-md-4">
                <label class="f-label">Nama Obat Oral / Topikal</label>
                <input type="text" class="f-input input-entry" data-index="${idx}" data-field="namaObat" value="${ent.namaObat || ''}" placeholder="Paracetamol 500mg">
              </div>
              <div class="col-md-2">
                <label class="f-label">Dosis</label>
                <input type="text" class="f-input input-entry" data-index="${idx}" data-field="dosis" value="${ent.dosis || ''}" placeholder="1 Tab / 5ml">
              </div>
              <div class="col-md-2">
                <label class="f-label">Rute</label>
                <input type="text" class="f-input input-entry" data-index="${idx}" data-field="rute" value="${ent.rute || ''}" placeholder="PO / Topikal">
              </div>
              <div class="col-md-2">
                <label class="f-label">Frekuensi</label>
                <input type="text" class="f-input input-entry" data-index="${idx}" data-field="frekuensi" value="${ent.frekuensi || ''}" placeholder="3x1">
              </div>
              <div class="col-md-2">
                <label class="f-label">Waktu / Aturan</label>
                <input type="text" class="f-input input-entry" data-index="${idx}" data-field="waktu" value="${ent.waktu || ''}" placeholder="PC / PG-SI-SO-ML">
              </div>
            </div>

            <div class="mt-2 bg-light p-2 rounded border">
              <div class="fw-bold text-secondary mb-1" style="font-size:11px;"><i class="bi bi-check2-square me-1"></i> Ceklist Pemberian (PG: Pagi, SI: Siang, SO: Sore, ML: Malam)</div>
              <div class="row g-0">
                ${checkMatrixHtml}
              </div>
            </div>
          </div>`;
        });
      } else {
        entriesHtml = `<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri obat. Klik "+ Tambah Obat" untuk memulai.</div>`;
      }

      const inputContent = `
      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-2"><div class="f-group"><label class="f-label">Gender</label><input type="text" class="f-input" value="${kelamin}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-2"><div class="f-group"><label class="f-label">Ruang</label><input type="text" class="f-input" value="${ruang}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-2"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="${dpjp}" disabled style="background:#e9ecef;"></div></div>
          </div>
        </div>
      </div>

      <div class="accordion mb-3" id="accordionPemberianObat">

        <!-- Section 1 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_po_1">
            <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_po_1" aria-expanded="true" aria-controls="collapse_po_1">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-calendar-week me-2 text-secondary"></i> 1. Tanggal Eksekusi Pemberian (6 Tanggal Kolom Cetak)</span>
            </button>
          </h2>
          <div id="collapse_po_1" class="accordion-collapse collapse show" aria-labelledby="heading_po_1" data-bs-parent="#accordionPemberianObat">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 1</label><input type="date" class="f-input input-tgl" data-tgl="1" value="${fd.tgl1 || ''}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 2</label><input type="date" class="f-input input-tgl" data-tgl="2" value="${fd.tgl2 || ''}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 3</label><input type="date" class="f-input input-tgl" data-tgl="3" value="${fd.tgl3 || ''}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 4</label><input type="date" class="f-input input-tgl" data-tgl="4" value="${fd.tgl4 || ''}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 5</label><input type="date" class="f-input input-tgl" data-tgl="5" value="${fd.tgl5 || ''}"></div></div>
                <div class="col-md-2"><div class="f-group"><label class="f-label">Tanggal 6</label><input type="date" class="f-input input-tgl" data-tgl="6" value="${fd.tgl6 || ''}"></div></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_po_2">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_po_2" aria-expanded="false" aria-controls="collapse_po_2">
              <span class="fw-bold text-dark d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">
                <span><i class="bi bi-capsule me-2 text-secondary"></i> 2. Daftar Pemberian Obat (Oral &amp; Topikal)</span>
              </span>
            </button>
          </h2>
          <div id="collapse_po_2" class="accordion-collapse collapse" aria-labelledby="heading_po_2" data-bs-parent="#accordionPemberianObat">
            <div class="accordion-body bg-white p-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="small text-muted">Daftar entri obat yang diberikan kepada pasien</span>
                <button type="button" id="btn-add-obat" class="btn btn-sm btn-primary"><i class="bi bi-plus-lg me-1"></i>Tambah Obat</button>
              </div>
              <div id="fpo-entries-container">
                ${entriesHtml}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="d-flex justify-content-end mt-3 border-top pt-3">
        <button type="button" id="btn-save-obat" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'fpo',
        wrapperTag: 'app-pemberian-obat-igd-wrapper',
        inputPaneId: 'fpo-input',
        printPaneId: 'fpo-print',
        printTabId: 'fpo-print-tab',
        tabsClass: 'fpo-tabs',
        extraCss: `#accordionPemberianObat .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }
#accordionPemberianObat .accordion-button { box-shadow: none !important; }
#accordionPemberianObat .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }
#accordionPemberianObat .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
@page { size: 330.2mm 215.9mm landscape; margin: 0; }
@media print {
  @page { size: 330.2mm 215.9mm landscape; margin: 0; }
  .surat-document-landscape { width: 330.2mm !important; max-width: 330.2mm !important; height: 215.9mm !important; padding: 5mm !important; margin: 0 auto !important; box-shadow: none !important; }
}
.t-border{border:2px solid black;display:flex;flex-direction:column;flex:1;overflow:hidden;font-family:'Times New Roman',Times,serif;background:white;}
.t-border *{font-size:11px !important;line-height:1.3 !important;box-sizing:border-box;margin:0;padding:0;}
.t-border h3{font-size:13px !important;font-weight:bold;}
.t-row{display:flex;border-bottom:1px solid black;break-inside:avoid;page-break-inside:avoid;}
.t-row:last-child{border-bottom:none;}
.t-col{padding:3px 4px;border-right:1px solid black;}
.t-col:last-child{border-right:none;}
.fpo-admission-context{display:flex;justify-content:space-between;padding:8px;border-bottom:2px solid black;font-size:12px;background-color:#fafafa;flex-shrink:0;}
.fpo-context-col{width:32%;display:flex;flex-direction:column;gap:4px;}
.fpo-context-row{display:flex;}
.fpo-context-label{width:110px;}
.fpo-context-value{font-weight:bold;}
.fpo-table{width:100%;border-collapse:collapse;table-layout:fixed;flex:1;font-family:'Times New Roman',Times,serif;}
.fpo-table th,.fpo-table td{border:1px solid black;text-align:center;vertical-align:middle;padding:3px;font-size:10.5px !important;box-sizing:border-box;}
.fpo-c-no{width:3% !important;}
.fpo-c-nama-obat{width:15% !important;}
.fpo-c-time-slot{width:2.1% !important;font-size:8px !important;}
.fpo-med-row{break-inside:avoid;page-break-inside:avoid;}
.fpo-med-row td{height:42px;}`,
        inputContent,
      });
      const printBtn = root.querySelector(".surat-print-btn");
      if (printBtn) {
        printBtn.onclick = () => {
          let printStyle = document.getElementById("landscape-print-page-style");
          if (!printStyle) {
            printStyle = document.createElement("style");
            printStyle.id = "landscape-print-page-style";
            document.head.appendChild(printStyle);
          }
          printStyle.innerHTML = "@page { size: 330.2mm 215.9mm landscape !important; margin: 0 !important; } @media print { body { width: 330.2mm !important; } .surat-document-landscape { width: 330.2mm !important; max-width: 330.2mm !important; height: 215.9mm !important; margin: 0 auto !important; padding: 5mm !important; box-shadow: none !important; } .fpo-table { width: 100% !important; table-layout: fixed !important; } .fpo-c-no { width: 3% !important; } .fpo-c-nama-obat { width: 15% !important; } .fpo-c-time-slot { width: 2.1% !important; font-size: 8px !important; } }";

          setTimeout(() => {
            window.print();
            setTimeout(() => {
              if (printStyle && printStyle.parentNode) {
                printStyle.parentNode.removeChild(printStyle);
              }
            }, 1000);
          }, 100);
        };
      }

      const btnSave = root.querySelector("#btn-save-obat");
      if (btnSave) btnSave.addEventListener("click", () => this.saveData());

      const btnAdd = root.querySelector("#btn-add-obat");
      if (btnAdd) btnAdd.addEventListener("click", () => this.addEntry());

      const btnRemoves = root.querySelectorAll(".btn-remove-entry");
      btnRemoves.forEach(el => {
        el.addEventListener("click", (e) => {
          const btn = e.target.closest('.btn-remove-entry');
          if (btn) this.removeEntry(parseInt(btn.dataset.index));
        });
      });

      const inputs = root.querySelectorAll(".input-entry");
      inputs.forEach(el => {
        const handler = (e) => {
          const idx = parseInt(e.target.dataset.index);
          const field = e.target.dataset.field;
          if (!isNaN(idx) && field && this.formData.entries && this.formData.entries[idx]) {
            this.formData.entries[idx][field] = e.target.value;
          }
        };
        el.addEventListener("input", handler);
        el.addEventListener("change", handler);
      });

      const printTab = root.querySelector("#fpo-print-tab");
      const updatePrint = () => {
        this.syncEntriesFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, tglMasuk, ruang, diagnosa, getFontSize);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      // Populate print preview container immediately
      updatePrint();
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, tglMasuk, ruang, diagnosa, getFontSize) {
      const printContainer = document.getElementById("fpo-print-container");
      if (!printContainer) return;

      const fd = this.formData;
      const formatDateStr = (str) => {
        if (!str) return "________________";
        try {
          const dt = new Date(str);
          if (isNaN(dt.getTime())) return str;
          const dd = String(dt.getDate()).padStart(2, '0');
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          return `${dd}/${mm}/${dt.getFullYear()}`;
        } catch (e) { return str; }
      };

      const tgl1Str = formatDateStr(fd.tgl1);
      const tgl2Str = formatDateStr(fd.tgl2);
      const tgl3Str = formatDateStr(fd.tgl3);
      const tgl4Str = formatDateStr(fd.tgl4);
      const tgl5Str = formatDateStr(fd.tgl5);
      const tgl6Str = formatDateStr(fd.tgl6);

      let printRowsHtml = "";
      const entries = fd.entries || [];
      for (let i = 0; i < Math.max(13, entries.length); i++) {
        const ent = entries[i] || null;
        let obatText = "";
        if (ent) {
          const lines = [];
          if (ent.namaObat) lines.push(`<b>${ent.namaObat}</b>`);
          const line2 = [];
          if (ent.dosis) line2.push(ent.dosis);
          if (ent.rute) line2.push(ent.rute);
          if (line2.length > 0) lines.push(`<span style="font-size:10px;">${line2.join(' - ')}</span>`);
          const line3 = [];
          if (ent.frekuensi) line3.push(ent.frekuensi);
          if (ent.waktu) line3.push(`(${ent.waktu})`);
          if (line3.length > 0) lines.push(`<span style="font-size:10px;">${line3.join(' ')}</span>`);

          obatText = lines.join('<br>');
        }

        let checkCells = "";
        for (let d = 0; d < 6; d++) {
          ['PG', 'SI', 'SO', 'ML'].forEach(t => {
            const isChecked = ent && ent.checks && ent.checks[`${d}_${t}`];
            checkCells += `<td style="text-align:center; font-weight:bold; font-size:11px;">${isChecked ? '✓' : ''}</td>`;
          });
        }

        printRowsHtml += `
          <tr class="fpo-med-row">
              <td style="text-align:center;">${i + 1}</td>
              <td style="text-align:left; padding: 2px 4px; line-height:1.2;">${obatText}</td>
              ${checkCells}
          </tr>
        `;
      }

      printContainer.innerHTML = `
      <div class="surat-document-landscape" style="box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div class="t-border" style="height:100%;">
            <div class="t-row" style="height:80px;border-bottom:2px solid black;flex-shrink:0;">
              <div class="t-col" style="width:100px;display:flex;align-items:center;justify-content:center;">
                <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
              </div>
              <div class="t-col" style="flex:1;text-align:center;display:flex;flex-direction:column;justify-content:center;">
                <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
                <p style="margin-top:3px;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>Barat, Banda Aceh Telp. 0651-41355, 0651-41470</p>
              </div>
              <div class="t-col" style="flex:1;display:flex;align-items:center;justify-content:center;background-color:#f9f9f9;">
                <h2 style="font-size:16px;font-weight:bold;margin:0;letter-spacing:0.5px;">FORMULIR PEMBERIAN<br>OBAT ORAL / TOPIKAL</h2>
              </div>
              <div class="t-col" style="width:280px;display:flex;flex-direction:column;justify-content:center;">
                <div style="border:1px solid black;border-radius:6px;padding:4px;background-color:white;">
                  <div style="display:flex;"><div style="width:75px;font-weight:bold;">NRM</div><div style="font-size:${getFontSize(noMr)}px !important">: ${noMr}</div></div>
                  <div style="display:flex;"><div style="width:75px;font-weight:bold;">Nama</div><div style="font-size:${getFontSize(nama)}px !important">: ${nama}</div></div>
                  <div style="display:flex;"><div style="width:75px;font-weight:bold;">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
                  <div style="display:flex;"><div style="width:75px;font-weight:bold;">Jenis Kelamin</div><div>: ${kelamin}</div></div>
                </div>
              </div>
            </div>

            <div class="fpo-admission-context">
                <div class="fpo-context-col">
                    <div class="fpo-context-row"><div class="fpo-context-label">Nama Pasien</div><div>: &nbsp;</div><div class="fpo-context-value">${nama}</div></div>
                    <div class="fpo-context-row"><div class="fpo-context-label">Tanggal Masuk</div><div>: &nbsp;</div><div class="fpo-context-value">${tglMasuk}</div></div>
                    <div class="fpo-context-row"><div class="fpo-context-label">Ruang / Kamar</div><div>: &nbsp;</div><div class="fpo-context-value">${ruang}</div></div>
                </div>
                <div class="fpo-context-col">
                    <div class="fpo-context-row"><div class="fpo-context-label">No. Rekam Medis</div><div>: &nbsp;</div><div class="fpo-context-value">${noMr}</div></div>
                    <div class="fpo-context-row"><div class="fpo-context-label">DPJP</div><div>: &nbsp;</div><div class="fpo-context-value">${dpjp}</div></div>
                    <div class="fpo-context-row"><div class="fpo-context-label">Diagnosa</div><div>: &nbsp;</div><div class="fpo-context-value">${diagnosa}</div></div>
                </div>
                <div class="fpo-context-col" style="width: 25%; border: 1px dashed #bbb; padding: 4px; background: white; justify-content: center; align-items: center; display: flex; font-size: 11px;">
                    <div style="color:#555; font-style:italic;">Tempel Label Identitas Pasien<br>Jika Tersedia</div>
                </div>
            </div>

            <table class="fpo-table">
                <thead>
                    <tr>
                        <th rowspan="2" class="fpo-c-no">No.</th>
                        <th rowspan="2" class="fpo-c-nama-obat">NAMA OBAT ORAL / TOPIKAL</th>
                        <th colspan="4">TANGGAL: ${tgl1Str}</th>
                        <th colspan="4">TANGGAL: ${tgl2Str}</th>
                        <th colspan="4">TANGGAL: ${tgl3Str}</th>
                        <th colspan="4">TANGGAL: ${tgl4Str}</th>
                        <th colspan="4">TANGGAL: ${tgl5Str}</th>
                        <th colspan="4">TANGGAL: ${tgl6Str}</th>
                    </tr>
                    <tr>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                        <th class="fpo-c-time-slot">PG</th><th class="fpo-c-time-slot">SI</th><th class="fpo-c-time-slot">SO</th><th class="fpo-c-time-slot">ML</th>
                    </tr>
                </thead>
                <tbody>
                    ${printRowsHtml}
                </tbody>
            </table>
          </div>
      </div>
        `;
    }
  }

  t.ɵfac = function (s) {
    return new (s || t)();
  };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-pemberian-obat-igd-wrapper"]],
    decls: 1,
    vars: 0,
    template: function (s, r) {
      renderTemplate(s, r);
    },
    encapsulation: 2,
    standalone: true,
  });
  return t;
})();

export { PemberianObatIgdComponent };
