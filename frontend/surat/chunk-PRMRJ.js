import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { getStandardGridCSS, createSuratShell, createAutoPageSurat, bindSuratPrintButton, hospitalHeaderDiv } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-prmrj-placeholder");
    ɵelementEnd();
  }
}

var PrmrjComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.loading = true;
      this.saving = false;
      this.prmrjData = null;
      this.patient = null;
      this.formData = {
        entries: []
      };

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() {
      this.renderView();
    }

    fetchPatient() {
      this.http
        .get(
          i.apiUrl +
            "/simrsba/caripasienpolinocheckin/" +
            this.noCheckin,
        )
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) this.patient = res[0];
            this.fetchPrmrj();
          },
          error: () => {
            this.fetchPrmrj();
          },
        });
    }

    fetchPrmrj() {
      this.http.get(i.apiUrl + "/simrsba/prmrj/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.prmrjData = res.data;
            if (res.data.formData) {
              this.formData = Object.assign({ entries: [] }, res.data.formData);
            } else if (res.data.entries) {
              this.formData.entries = res.data.entries;
            }
          }
          this.loading = false;
          this.renderView();
        },
        error: () => {
          this.loading = false;
          this.renderView();
        },
      });
    }

    handleSave() {
      this.saving = true;
      const btn = document.getElementById("btn-save-prmrj");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        formData: this.formData,
        entries: this.formData.entries || []
      };

      this.http.post(i.apiUrl + "/simrsba/prmrj", payload).subscribe({
        next: (res) => {
          this.saving = false;
          this.prmrjData = res.data;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
            }, 2000);
          }
          this.showToast("success", "PRMRJ berhasil disimpan");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
          }
          this.showToast("danger", "Gagal menyimpan PRMRJ");
        },
      });
    }

    showToast(type, message) {
      const toast = document.createElement("div");
      toast.style.cssText =
        "position:fixed;top:20px;right:20px;z-index:99999;min-width:320px;";
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

    renderView() {
      const root = document.querySelector("app-prmrj-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data PRMRJ...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const dpjp = p.dokterDpjp || p.dpjp || p.namaDokter || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1);
      };

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "surat/surat.css";
        document.head.appendChild(link);
      }

      const self = this;

      if (!this.formData.entries) this.formData.entries = [];

      let entriesHtml = "";
      if (this.formData.entries.length > 0) {
        this.formData.entries.forEach((e, idx) => {
          entriesHtml += `
          <div class="py-3 px-2 ${idx > 0 ? 'border-top' : ''}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold text-dark small"><i class="bi bi-journal-text me-1"></i> Entri PRMRJ #${idx + 1}</span>
              <button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-idx="${idx}">
                <i class="bi bi-trash me-1"></i>Hapus Baris
              </button>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-md-3">
                <label class="f-label">Tanggal Entry</label>
                <input type="date" class="f-input form-data-input" data-idx="${idx}" data-field="tglDate" value="${e.tglDate || ''}">
              </div>
              <div class="col-md-3">
                <label class="f-label">Jam Entry</label>
                <input type="time" class="f-input form-data-input" data-idx="${idx}" data-field="tglTime" value="${e.tglTime || ''}">
              </div>
              <div class="col-md-6">
                <label class="f-label">Dokter / Spesialis (DR.SP)</label>
                <input type="text" class="f-input form-data-input" data-idx="${idx}" data-field="drSp" value="${e.drSp || dpjp}" placeholder="Nama Dokter / Spesialis...">
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-md-4">
                <label class="f-label">Uraian Klinis Penting</label>
                <textarea class="f-input form-data-input" data-idx="${idx}" data-field="uraianKlinis" rows="2" placeholder="Uraian klinis penting...">${e.uraianKlinis || ''}</textarea>
              </div>
              <div class="col-md-4">
                <label class="f-label">Diagnosis</label>
                <textarea class="f-input form-data-input" data-idx="${idx}" data-field="diagnosis" rows="2" placeholder="Diagnosis...">${e.diagnosis || ''}</textarea>
              </div>
              <div class="col-md-4">
                <label class="f-label">Rencana Penting</label>
                <textarea class="f-input form-data-input" data-idx="${idx}" data-field="rencanaPenting" rows="2" placeholder="Rencana penting...">${e.rencanaPenting || ''}</textarea>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-md-12">
                <label class="f-label">Keterangan / Paraf</label>
                <input type="text" class="f-input form-data-input" data-idx="${idx}" data-field="ket" value="${e.ket || ''}" placeholder="Keterangan / Paraf...">
              </div>
            </div>
          </div>`;
        });
      } else {
        entriesHtml = `<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri PRMRJ. Silakan klik "+ Tambah Baris PRMRJ" untuk memulai.</div>`;
      }

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

      <div class="accordion mb-3" id="accordionPrmrj">

        <!-- Section 1 -->
        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_prmrj_1">
            <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_prmrj_1" aria-expanded="true" aria-controls="collapse_prmrj_1">
              <span class="fw-bold text-dark d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">
                <span><i class="bi bi-journal-text me-2 text-secondary"></i> 1. Entri Profil Ringkas Rawat Jalan (PRMRJ)</span>
              </span>
            </button>
          </h2>
          <div id="collapse_prmrj_1" class="accordion-collapse collapse show" aria-labelledby="heading_prmrj_1" data-bs-parent="#accordionPrmrj">
            <div class="accordion-body bg-white p-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="small text-muted">Daftar riwayat profil ringkas rawat jalan pasien</span>
                <button type="button" class="btn btn-sm btn-primary" id="btn-add-prmrj"><i class="bi bi-plus-lg me-1"></i>Tambah Baris PRMRJ</button>
              </div>
              <div id="prmrj-entries-container">
                ${entriesHtml}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="d-flex justify-content-end mt-3 border-top pt-3">
        <button type="button" id="btn-save-prmrj" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'prmrj',
        wrapperTag: 'app-prmrj-placeholder',
        inputPaneId: 'prmrj-input',
        printPaneId: 'prmrj-print',
        printTabId: 'prmrj-print-tab',
        tabsClass: 'prmrj-tabs',
        extraCss: `#accordionPrmrj .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }
#accordionPrmrj .accordion-button { box-shadow: none !important; }
#accordionPrmrj .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }
#accordionPrmrj .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
.prmrj-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; flex: 1; height: 100%; table-layout: fixed; }
.prmrj-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }
.prmrj-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }
.prmrj-table tbody td:first-child { border-left: none !important; }
.prmrj-table tbody td:last-child { border-right: none !important; }
.prmrj-table tbody tr:last-child td { border-bottom: none !important; }`,
        inputContent,
      });

      bindSuratPrintButton(root);

      // Event listeners for inputs
      root.addEventListener("input", (ev) => {
        const target = ev.target;
        if (target.classList.contains("form-data-input")) {
          const idx = parseInt(target.getAttribute("data-idx"));
          const field = target.getAttribute("data-field");
          if (!isNaN(idx) && field && self.formData.entries[idx]) {
            self.formData.entries[idx][field] = target.value;
          }
        }
      });

      // Event listener for add row
      const btnAdd = root.querySelector("#btn-add-prmrj");
      if (btnAdd) {
        btnAdd.onclick = () => {
          const today = new Date();
          const tglDate = today.toISOString().split("T")[0];
          const tglTime = today.toTimeString().split(" ")[0].substring(0, 5);
          self.formData.entries.push({
            tglDate,
            tglTime,
            drSp: dpjp,
            uraianKlinis: "",
            diagnosis: "",
            rencanaPenting: "",
            ket: ""
          });
          self.renderView();
        };
      }

      // Event listener for remove row
      root.querySelectorAll(".btn-remove-entry").forEach((btn) => {
        btn.onclick = (e) => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx)) {
            self.formData.entries.splice(idx, 1);
            self.renderView();
          }
        };
      });

      // Event listener for save button
      const btnSave = root.querySelector("#btn-save-prmrj");
      if (btnSave) {
        btnSave.onclick = () => {
          self.handleSave();
        };
      }

      const printTab = root.querySelector("#prmrj-print-tab");
      const updatePrint = () => {
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }
      updatePrint();
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
      const printContainer = document.getElementById("prmrj-print-container");
      if (!printContainer) return;

      let rowsHtml = "";
      const entries = this.formData.entries || [];
      entries.forEach((e, idx) => {
        const tglJam = (e.tglDate || e.tglTime) ? `${e.tglDate || ''}<br>${e.tglTime || ''}` : '-';
        rowsHtml += `
        <tr>
            <td style="text-align:center; padding:6px 4px;">${idx + 1}</td>
            <td style="text-align:center; padding:6px 4px;">${tglJam}</td>
            <td style="padding:6px 6px;">${e.drSp || '-'}</td>
            <td style="white-space:pre-wrap; padding:6px 6px;">${e.uraianKlinis || '-'}</td>
            <td style="white-space:pre-wrap; padding:6px 6px;">${e.diagnosis || '-'}</td>
            <td style="white-space:pre-wrap; padding:6px 6px;">${e.rencanaPenting || '-'}</td>
            <td style="text-align:center; padding:6px 4px;">${e.ket || '-'}</td>
        </tr>`;
      });

      // Expanding filler row to stretch table 100% to bottom of Folio/F4 page
      rowsHtml += `
      <tr style="height:100%;">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
      </tr>`;

      printContainer.innerHTML = `
      <div class="surat-document" style="display:flex; flex-direction:column; height:1247px;">
          ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin)}

          <div style="border:2px solid black; font-family:'Times New Roman',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0; margin-top:10px;">
              <div style="text-align:center; font-weight:bold; font-size:14px !important; padding:8px; border-bottom:2px solid black; background-color:#e6e6e6;">
                  PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLIKLINIK
              </div>

              <table class="prmrj-table" style="border:none; border-top:1px solid black; flex:1;">
                <colgroup>
                    <col style="width:5%">
                    <col style="width:12%">
                    <col style="width:15%">
                    <col style="width:28%">
                    <col style="width:18%">
                    <col style="width:17%">
                    <col style="width:5%">
                </colgroup>
                <thead>
                    <tr>
                        <th style="border-left:none;">NO</th>
                        <th>TGL/JAM</th>
                        <th>DR.SP</th>
                        <th>URAIAN KLINIS PENTING</th>
                        <th>DIAGNOSIS</th>
                        <th>RENCANA PENTING</th>
                        <th style="border-right:none;">KET</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
              </table>
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
        selectors: [["app-prmrj-placeholder"]],
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

export { PrmrjComponent };
