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
    ɵelementStart(0, "app-poli-gigi-placeholder");
    ɵelementEnd();
  }
}

var PoliGigiComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.loading = true;
      this.saving = false;
      this.gigiData = null;
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
            this.fetchPoliGigi();
          },
          error: () => {
            this.fetchPoliGigi();
          },
        });
    }

    fetchPoliGigi() {
      this.http.get(i.apiUrl + "/simrsba/poli-gigi/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.gigiData = res.data;
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
      const btn = document.getElementById("btn-save-poli-gigi");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncEntriesFromDOM();

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        user: "Dokter",
        tglInput: new Date().toLocaleString(),
        formData: this.formData,
        entries: this.formData.entries || []
      };

      this.http.post(i.apiUrl + "/simrsba/poli-gigi", payload).subscribe({
        next: (res) => {
          this.saving = false;
          this.gigiData = res.data;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
            }, 2000);
          }
          this.showToast("success", "PRMRJ Poli Gigi berhasil disimpan");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
          }
          this.showToast("danger", "Gagal menyimpan PRMRJ Poli Gigi");
        },
      });
    }

    addEntry() {
      const today = new Date();
      const tglDate = today.toISOString().split("T")[0];
      const tglTime = today.toTimeString().split(" ")[0].substring(0, 5);
      const dpjp = this.patient?.dokterDpjp || this.patient?.dpjp || this.patient?.namaDokter || "Dokter Gigi";

      this.formData.entries.push({
        tglDate,
        tglTime,
        gigi: "",
        keluhan: "",
        tindakan: "",
        icd10: "",
        parafName: dpjp,
        ttd: null
      });
      this.renderView();
    }

    removeEntry(idx) {
      if (!isNaN(idx) && this.formData.entries[idx]) {
        this.formData.entries.splice(idx, 1);
        this.renderView();
      }
    }

    syncEntriesFromDOM() {
      const root = document.querySelector("app-poli-gigi-placeholder");
      if (!root) return;
      root.querySelectorAll(".form-data-input").forEach((input) => {
        const idx = parseInt(input.dataset.idx);
        const field = input.dataset.field;
        if (!isNaN(idx) && field && this.formData.entries[idx]) {
          this.formData.entries[idx][field] = input.value;
        }
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
      const root = document.querySelector("app-poli-gigi-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const dpjp = p.dokterDpjp || p.dpjp || p.namaDokter || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 11, minSize = 8) => {
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

      if (!this.formData.entries) this.formData.entries = [];

      let entriesHtml = "";
      this.formData.entries.forEach((e, idx) => {
        entriesHtml += '<div class="py-3 px-2 ' + (idx > 0 ? 'border-top' : '') + '">' +
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<span class="fw-bold text-dark small"><i class="bi bi-journal-text me-1"></i> Baris Poli Gigi #' + (idx + 1) + '</span>' +
            '<button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-idx="' + idx + '"><i class="bi bi-trash me-1"></i>Hapus Baris</button>' +
          '</div>' +
          '<div class="row g-2 mb-2">' +
            '<div class="col-md-2"><label class="f-label">Tanggal Entry</label><input type="date" class="f-input form-data-input" data-idx="' + idx + '" data-field="tglDate" value="' + (e.tglDate || '') + '"></div>' +
            '<div class="col-md-2"><label class="f-label">Jam Entry</label><input type="time" class="f-input form-data-input" data-idx="' + idx + '" data-field="tglTime" value="' + (e.tglTime || '') + '"></div>' +
            '<div class="col-md-4"><label class="f-label">Elemen Gigi</label><input type="text" class="f-input form-data-input" data-idx="' + idx + '" data-field="gigi" value="' + (e.gigi || '') + '" placeholder="misal: 11, 21, 36, 46..."></div>' +
            '<div class="col-md-4"><label class="f-label">Kode ICD-10</label><input type="text" class="f-input form-data-input" data-idx="' + idx + '" data-field="icd10" value="' + (e.icd10 || '') + '" placeholder="misal: K02.1..."></div>' +
          '</div>' +
          '<div class="row g-2 mb-2">' +
            '<div class="col-md-6"><label class="f-label text-dark">Keluhan / Diagnosa</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="keluhan" rows="3" placeholder="Keluhan utama, hasil odontogram, diagnosa gigi...">' + (e.keluhan || '') + '</textarea></div>' +
            '<div class="col-md-6"><label class="f-label text-dark">Pengobatan & Tindakan</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="tindakan" rows="3" placeholder="Tindakan penambalan, pencabutan, pembersihan, resep obat...">' + (e.tindakan || '') + '</textarea></div>' +
          '</div>' +
          '<div class="row g-2">' +
            '<div class="col-md-4"><label class="f-label">Nama Dokter Gigi / Paraf</label><input type="text" class="f-input form-data-input mb-1" style="font-size:12px;" data-idx="' + idx + '" data-field="parafName" value="' + (e.parafName || dpjp) + '" placeholder="Nama Dokter Gigi..."></div>' +
            '<div class="col-md-8">' +
              '<div class="d-flex justify-content-between align-items-center mb-1">' +
                '<label class="f-label mb-0">Paraf / TTD Signature Box</label>' +
                '<button type="button" class="btn btn-sm btn-outline-secondary sig-clear-gigi-btn" data-idx="' + idx + '" style="font-size:10px; padding:1px 7px;"><i class="bi bi-eraser me-1"></i>Hapus TTD</button>' +
              '</div>' +
              '<div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden;">' +
                '<canvas id="sig-gigi-' + idx + '" class="gigi-sig-canvas" data-idx="' + idx + '" width="600" height="180" style="display:block; width:100%; height:150px; cursor:crosshair; touch-action:none;"></canvas>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      });

      if (this.formData.entries.length === 0) {
        entriesHtml = '<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri PRMRJ Poli Gigi. Silakan klik "+ Tambah Baris Poli Gigi" untuk memulai.</div>';
      }

      const inputContent = '<div class="card border mb-3">' +
        '<div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>' +
        '<div class="card-body pt-2 pb-2">' +
          '<div class="row g-2">' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="' + noMr + '" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="' + nama + '" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="' + tglLahir + ' (' + kelamin + ')" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">DPJP / Dokter Gigi</label><input type="text" class="f-input" value="' + dpjp + '" disabled style="background:#e9ecef;"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="accordion mb-3" id="accordionPoliGigi">' +
        '<div class="accordion-item mb-2 border rounded">' +
          '<h2 class="accordion-header" id="heading_poli_gigi_1">' +
            '<button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_poli_gigi_1" aria-expanded="true" aria-controls="collapse_poli_gigi_1">' +
              '<span class="fw-bold text-dark d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">' +
                '<span><i class="bi bi-journal-text me-2 text-secondary"></i> 1. Profil Ringkas Rawat Jalan (PRMRJ) Poli Gigi</span>' +
              '</span>' +
            '</button>' +
          '</h2>' +
          '<div id="collapse_poli_gigi_1" class="accordion-collapse collapse show" aria-labelledby="heading_poli_gigi_1" data-bs-parent="#accordionPoliGigi">' +
            '<div class="accordion-body bg-white p-3">' +
              '<div class="d-flex justify-content-between align-items-center mb-3">' +
                '<span class="small text-muted">Daftar entri pemeriksaan &amp; tindakan Poli Gigi</span>' +
                '<button type="button" class="btn btn-sm btn-primary" id="btn-add-gigi"><i class="bi bi-plus-lg me-1"></i>Tambah Baris Poli Gigi</button>' +
              '</div>' +
              '<div id="gigi-entries-container">' + entriesHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="d-flex justify-content-end mt-3 border-top pt-3"><button type="button" id="btn-save-poli-gigi" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button></div>';

      const extraCssStr = '#accordionPoliGigi .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }\n' +
        '#accordionPoliGigi .accordion-button { box-shadow: none !important; }\n' +
        '#accordionPoliGigi .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }\n' +
        '#accordionPoliGigi .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }\n' +
        '.gigi-table { width: 100%; border-collapse: collapse; font-family: "Times New Roman", Times, serif; flex: 1; height: 100%; table-layout: fixed; }\n' +
        '.gigi-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }\n' +
        '.gigi-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }\n' +
        '.gigi-table tbody td:first-child { border-left: none !important; }\n' +
        '.gigi-table tbody td:last-child { border-right: none !important; }\n' +
        '.gigi-table tbody tr:last-child td { border-bottom: none !important; }';

      root.innerHTML = createSuratShell({
        idPrefix: 'poli-gigi',
        wrapperTag: 'app-poli-gigi-placeholder',
        inputPaneId: 'poli-gigi-input',
        printPaneId: 'poli-gigi-print',
        printTabId: 'poli-gigi-print-tab',
        tabsClass: 'poli-gigi-tabs',
        extraCss: extraCssStr,
        inputContent,
      });

      bindSuratPrintButton(root);

      const btnSave = root.querySelector("#btn-save-poli-gigi");
      if (btnSave) btnSave.addEventListener("click", () => this.handleSave());

      const btnAdd = root.querySelector("#btn-add-gigi");
      if (btnAdd) btnAdd.addEventListener("click", () => this.addEntry());

      const btnRemoves = root.querySelectorAll(".btn-remove-entry");
      btnRemoves.forEach(el => {
        el.addEventListener("click", (e) => {
          const btn = e.target.closest('.btn-remove-entry');
          if (btn) this.removeEntry(parseInt(btn.dataset.idx));
        });
      });

      this.initSigCanvases(root);

      root.querySelectorAll('.accordion-collapse').forEach((acc) => {
        acc.addEventListener('shown.bs.collapse', () => {
          this.initSigCanvases(root);
        });
      });

      const printTab = root.querySelector("#poli-gigi-print-tab");
      const updatePrint = () => {
        this.syncEntriesFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }
      updatePrint();
    }

    initSigCanvases(root) {
      root.querySelectorAll(".gigi-sig-canvas").forEach((canvas) => {
        const idx = parseInt(canvas.dataset.idx);
        if (isNaN(idx) || !this.formData.entries[idx]) return;
        const ctx = canvas.getContext("2d");
        const ent = this.formData.entries[idx];
        if (ent.ttd) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = ent.ttd;
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
            ent.ttd = canvas.toDataURL();
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

      root.querySelectorAll(".sig-clear-gigi-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          const canvas = root.querySelector("#sig-gigi-" + idx);
          if (canvas && !isNaN(idx) && this.formData.entries[idx]) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            delete this.formData.entries[idx].ttd;
          }
        });
      });
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
      const printContainer = document.getElementById("poli-gigi-print-container");
      if (!printContainer) return;

      let rowsHtml = "";
      const entries = this.formData.entries || [];
      entries.forEach((e, idx) => {
        const tglJamStr = (e.tglDate || e.tglTime) ? (e.tglDate + '<br>' + (e.tglTime || '')) : '-';

        rowsHtml += '<tr>' +
            '<td style="text-align:center; padding: 6px 4px;">' + (idx + 1) + '</td>' +
            '<td style="text-align:center; padding: 6px 4px;">' + tglJamStr + '</td>' +
            '<td style="text-align:center; padding: 6px 4px;">' + (e.gigi || '-') + '</td>' +
            '<td style="white-space:pre-wrap; padding: 6px 6px;">' + (e.keluhan || '-') + '</td>' +
            '<td style="white-space:pre-wrap; padding: 6px 6px;">' + (e.tindakan || '-') + '</td>' +
            '<td style="text-align:center; padding: 6px 4px;">' + (e.icd10 || '-') + '</td>' +
            '<td style="text-align:center; vertical-align:bottom; padding: 6px 4px;">' +
                (e.ttd ? '<img src="' + e.ttd + '" style="max-height:50px; max-width:90%; display:block; margin:2px auto;">' : '') +
                '<div style="font-weight:bold; font-size:10px;">' + (e.parafName || '') + '</div>' +
            '</td>' +
        '</tr>';
      });

      // Expanding filler row to stretch table 100% to bottom of page
      rowsHtml += '<tr style="height:100%;">' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
      '</tr>';

      printContainer.innerHTML = '<div class="surat-document" style="display:flex; flex-direction:column; height:1247px;">' +
          hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize, 'PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLI GIGI') +
          '<div style="border:2px solid black; font-family:\'Times New Roman\',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0; margin-top:10px;">' +
              '<table class="gigi-table" style="border:none; flex:1;">' +
                '<colgroup>' +
                    '<col style="width:4%">' +
                    '<col style="width:12%">' +
                    '<col style="width:10%">' +
                    '<col style="width:30%">' +
                    '<col style="width:28%">' +
                    '<col style="width:8%">' +
                    '<col style="width:8%">' +
                '</colgroup>' +
                '<thead>' +
                    '<tr>' +
                        '<th style="border-left:none;">NO</th>' +
                        '<th>TGL / JAM</th>' +
                        '<th>GIGI</th>' +
                        '<th>KELUHAN / DIAGNOSA</th>' +
                        '<th>PENGOBATAN DAN TINDAKAN</th>' +
                        '<th>KODE ICD 10</th>' +
                        '<th style="border-right:none;">PARAF</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>' + rowsHtml + '</tbody>' +
              '</table>' +
          '</div>' +
      '</div>';
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-poli-gigi-placeholder"]],
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

export { PoliGigiComponent };
