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
import { createSuratShell, bindSuratPrintButton, hospitalHeaderDiv, showSuccessToast, showErrorAlert } from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-cppt-igd-placeholder");
    _elementEnd();
  }
}

var CpptIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.formData = {
          entries: []
      };

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
      this.http.get(i.apiUrl + "/simrsba/cppt-igd/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.formData = res.data;
            if(!this.formData.entries) this.formData.entries = [];
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
      const root = document.querySelector("app-cppt-igd-placeholder");
      if (!root) return;
      root.querySelectorAll(".form-data-input").forEach((el) => {
        const idx = parseInt(el.dataset.idx);
        const field = el.dataset.field;
        if (!isNaN(idx) && field && this.formData.entries && this.formData.entries[idx]) {
          this.formData.entries[idx][field] = el.value;

          const ent = this.formData.entries[idx];

          // Synthesize tglJam from tglDate & tglTime
          if (field === 'tglDate' || field === 'tglTime') {
            let dStr = "";
            if (ent.tglDate) {
              const parts = ent.tglDate.split("-");
              if (parts.length === 3) dStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
              else dStr = ent.tglDate;
            }
            ent.tglJam = `${dStr} ${ent.tglTime || ''}`.trim();
          }

          if (field === 's' || field === 'o' || field === 'a' || field === 'p') {
            const parts = [];
            if (ent.s) parts.push(`S: ${ent.s}`);
            if (ent.o) parts.push(`O: ${ent.o}`);
            if (ent.a) parts.push(`A: ${ent.a}`);
            if (ent.p) parts.push(`P: ${ent.p}`);
            if (parts.length > 0) {
              ent.soap = parts.join('\n');
            }
          }
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
            ...this.formData
        };

        const btn = document.getElementById("btn-save-cppt");
        if(btn) { btn.disabled = true; btn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Menyimpan...'; }

        this.http.post(i.apiUrl + "/simrsba/cppt-igd", payload).subscribe({
            next: (res) => {
                this.toastr.success("Berhasil menyimpan CPPT IGD", "Sukses");
                if(btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
                this.renderUI();
            },
            error: (err) => {
                this.toastr.error("Gagal menyimpan data CPPT IGD", "Error");
                if(btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data'; }
            }
        });
    }

    addEntry() {
        this.syncEntriesFromDOM();
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');

        const dateISO = `${yyyy}-${mm}-${dd}`;
        const timeISO = `${hh}:${min}`;
        const formattedTglJam = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
        const defaultDpjp = this.patient?.dpjp || "";

        this.formData.entries.push({
            tglDate: dateISO,
            tglTime: timeISO,
            tglJam: formattedTglJam,
            ppa: defaultDpjp,
            profesi: "Dokter",
            s: "", o: "", a: "", p: "",
            soap: "",
            instruksi: "",
            verifikasi: defaultDpjp
        });
        this.renderUI();
    }

    removeEntry(idx) {
        showConfirmDialog("Hapus baris CPPT ini?", () => {
            this.syncEntriesFromDOM();
            this.formData.entries.splice(idx, 1);
            this.renderUI();
        });
    }

    renderUI() {
      const root = document.querySelector("app-cppt-igd-placeholder");
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
      const dpjp = p.dpjp || p.nama_dokter || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1);
      };

      let entriesHtml = "";
      this.formData.entries.forEach((e, idx) => {
          entriesHtml += `
          <div class="py-3 px-2 ${idx > 0 ? 'border-top' : ''}">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold text-dark small"><i class="bi bi-journal-text me-1"></i> Entri CPPT #${idx + 1}</span>
              <button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-idx="${idx}">
                <i class="bi bi-trash me-1"></i>Hapus Baris
              </button>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-md-2">
                <label class="f-label">Tanggal Entry</label>
                <input type="date" class="f-input form-data-input" data-idx="${idx}" data-field="tglDate" value="${e.tglDate || ''}">
              </div>
              <div class="col-md-2">
                <label class="f-label">Jam Entry</label>
                <input type="time" class="f-input form-data-input" data-idx="${idx}" data-field="tglTime" value="${e.tglTime || ''}">
              </div>
              <div class="col-md-3">
                <label class="f-label" style="font-size:11px;">Profesi / Bagian</label>
                <select class="f-input form-data-input" style="font-size:12px;" data-idx="${idx}" data-field="profesi">
                  <option value="Dokter" ${e.profesi === 'Dokter' ? 'selected' : ''}>Dokter</option>
                  <option value="Perawat" ${e.profesi === 'Perawat' ? 'selected' : ''}>Perawat</option>
                  <option value="Bidan" ${e.profesi === 'Bidan' ? 'selected' : ''}>Bidan</option>
                  <option value="Apoteker" ${e.profesi === 'Apoteker' ? 'selected' : ''}>Apoteker</option>
                  <option value="Dietisien" ${e.profesi === 'Dietisien' ? 'selected' : ''}>Dietisien / Gizi</option>
                </select>
              </div>
              <div class="col-md-5">
                <label class="f-label" style="font-size:11px;">Nama PPA (Petugas)</label>
                <input type="text" class="f-input form-data-input" style="font-size:12px;" data-idx="${idx}" data-field="ppa" value="${e.ppa || dpjp}" placeholder="Nama PPA / Dokter / Perawat...">
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-12">
                <label class="f-label text-dark" style="font-size:11px;">Subjektif (S)</label>
                <textarea class="f-input form-data-input" style="font-size:11px;" data-idx="${idx}" data-field="s" rows="2" placeholder="Anamnesis / Keluhan Utama / Riwayat Penyakit...">${e.s || ''}</textarea>
              </div>
              <div class="col-12">
                <label class="f-label text-dark" style="font-size:11px;">Objektif (O)</label>
                <textarea class="f-input form-data-input" style="font-size:11px;" data-idx="${idx}" data-field="o" rows="2" placeholder="Pemeriksaan Fisik &amp; Vital (TTV, GCS, Ku...)...">${e.o || ''}</textarea>
              </div>
              <div class="col-12">
                <label class="f-label text-dark" style="font-size:11px;">Asesmen (A)</label>
                <textarea class="f-input form-data-input" style="font-size:11px;" data-idx="${idx}" data-field="a" rows="2" placeholder="Diagnosis Kerja / Masalah Medis / Keperawatan...">${e.a || ''}</textarea>
              </div>
              <div class="col-12">
                <label class="f-label text-dark" style="font-size:11px;">Planning (P)</label>
                <textarea class="f-input form-data-input" style="font-size:11px;" data-idx="${idx}" data-field="p" rows="2" placeholder="Rencana Asuhan / Terapi / Tindakan...">${e.p || ''}</textarea>
              </div>
            </div>

            <div class="row g-2 mb-2">
              <div class="col-12">
                <label class="f-label" style="font-size:11px;">Instruksi PPA (Penatalaksanaan Pasien)</label>
                <textarea class="f-input form-data-input" style="font-size:11px;" data-idx="${idx}" data-field="instruksi" rows="2" placeholder="Instruksi penatalaksanaan pasien...">${e.instruksi || ''}</textarea>
              </div>
            </div>

            <div class="row g-2">
              <div class="col-md-4">
                <label class="f-label" style="font-size:11px;">Nama DPJP / Verifikator</label>
                <input type="text" class="f-input form-data-input mb-1" style="font-size:12px;" data-idx="${idx}" data-field="verifikasi" value="${e.verifikasi || dpjp}" placeholder="Nama Verifikator / DPJP...">
                <div class="small text-muted" style="font-size:10px;">*Nama DPJP/Petugas yang memverifikasi entri ini.</div>
              </div>
              <div class="col-md-8">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <label class="f-label mb-0" style="font-size:11px;">TTD &amp; Paraf Signature Box</label>
                  <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-cppt-btn" data-idx="${idx}" style="font-size:10px; padding:1px 7px;">
                    <i class="bi bi-eraser me-1"></i>Hapus TTD
                  </button>
                </div>
                <div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden;">
                  <canvas id="sig-cppt-${idx}" class="cppt-sig-canvas" data-idx="${idx}" width="600" height="180" style="display:block; width:100%; height:150px; cursor:crosshair; touch-action:none;"></canvas>
                </div>
              </div>
            </div>
          </div>
          `;
      });

      if(this.formData.entries.length === 0) {
          entriesHtml = `<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri CPPT. Silakan klik "+ Tambah Baris CPPT" untuk memulai.</div>`;
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

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center">
          <span class="fw-bold text-dark"><i class="bi bi-journal-text me-1"></i> Catatan Perkembangan Pasien Terintegrasi (CPPT)</span>
          <button type="button" class="btn btn-primary" id="btn-add-entry"><i class="bi bi-plus-lg me-1"></i>Tambah Baris CPPT</button>
        </div>
        <div class="card-body p-3">
          <div id="entries-container">
            ${entriesHtml}
          </div>
          <div class="d-flex justify-content-end mt-3 border-top pt-3">
            <button type="button" id="btn-save-cppt" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
          </div>
        </div>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix:    'cppt',
        wrapperTag:  'app-cppt-igd-placeholder',
        inputPaneId: 'cppt-input',
        printPaneId: 'cppt-print',
        printTabId:  'cppt-print-tab',
        tabsClass:   'cppt-tabs',
        extraCss: `.cppt-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; flex: 1; height: 100%; }
.cppt-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; }
.cppt-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }
.cppt-table tbody tr:last-child td { border-bottom: 1px solid black !important; }
.desc-text { font-size: 9px !important; font-weight: normal !important; text-align: center; margin-top: 2px; }`,
        inputContent,
      });
      bindSuratPrintButton(root);

      const btnSave = root.querySelector("#btn-save-cppt");
      if(btnSave) btnSave.addEventListener("click", () => this.saveData());

      const btnAdd = root.querySelector("#btn-add-entry");
      if(btnAdd) btnAdd.addEventListener("click", () => this.addEntry());

      const btnRemoves = root.querySelectorAll(".btn-remove-entry");
      btnRemoves.forEach(el => {
        el.addEventListener("click", (e) => {
          const btn = e.target.closest('.btn-remove-entry');
          if(btn) this.removeEntry(parseInt(btn.dataset.idx));
        });
      });

      // Bind signature canvases
      root.querySelectorAll(".cppt-sig-canvas").forEach((canvas) => {
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

      root.querySelectorAll(".sig-clear-cppt-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.idx);
          const canvas = root.querySelector("#sig-cppt-" + idx);
          if (canvas && !isNaN(idx) && this.formData.entries[idx]) {
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            delete this.formData.entries[idx].ttd;
          }
        });
      });
      
      const printTab = root.querySelector("#cppt-print-tab");
      const updatePrint = () => {
        this.syncEntriesFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      // Pre-render print layout immediately
      updatePrint();
    }
    
    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
        const printContainer = document.getElementById("cppt-print-container");
        if (!printContainer) return;
        
        let rowsHtml = "";
        const entries = this.formData.entries || [];
        entries.forEach((e) => {
          rowsHtml += `
          <tr>
              <td style="text-align:center; padding: 6px 4px;">${e.tglJam || ''}</td>
              <td style="text-align:center; padding: 6px 4px;">${e.profesi || ''}<br><br><b>${e.ppa || ''}</b></td>
              <td style="white-space:pre-wrap; padding: 6px 6px;">${e.soap || ''}</td>
              <td style="white-space:pre-wrap; padding: 6px 6px;">${e.instruksi || ''}</td>
              <td style="text-align:center; vertical-align:bottom; padding: 6px 4px;">
                  ${e.ttd ? `<img src="${e.ttd}" style="max-height:50px; max-width:90%; display:block; margin:2px auto;">` : ''}
                  <div style="font-weight:bold; font-size:10px;">${e.verifikasi || ''}</div>
              </td>
          </tr>`;
        });

        // Expanding row to stretch table 100% to bottom of Folio/A4 page
        rowsHtml += `
        <tr style="height:100%;">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;

        printContainer.innerHTML = `
      <div class="surat-document" style="display:flex; flex-direction:column; min-height:100%;">
            ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin)}

            <div style="border:2px solid black; font-family:'Times New Roman',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0;">
                <div style="text-align:center; font-weight:bold; font-size:14px !important; padding:8px; border-bottom:2px solid black; background-color:#e6e6e6;">
                    CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)<br>RAWAT JALAN / IGD
                </div>

                <table class="cppt-table" style="border:none; border-top:1px solid black; flex:1;">
                  <colgroup>
                      <col style="width:10%">
                      <col style="width:12%">
                      <col style="width:42%">
                      <col style="width:22%">
                      <col style="width:14%">
                  </colgroup>
                  <thead>
                      <tr>
                          <th style="border-left:none;">Tgl/<br>Jam</th>
                          <th>Profesi/<br>Bagian</th>
                          <th>
                              <div style="font-weight:bold !important;">Hasil Pemeriksaan, Analisa, Rencana, dan Penata Laksanaan Pasien</div>
                              <div class="desc-text">(Diisi Oleh Dokter/Apoteker Dengan Format SOAP, Perawat/Bidan/ Keterampilan Fisik/Keteknesian Medis/ Dengan Format SBAR, Dan Dietisien Dengan Format ADIME)</div>
                          </th>
                          <th>
                              <div style="font-weight:bold !important;">Intruksi Tenaga Kesehatan</div>
                              <div class="desc-text">(Intruksi Penatalaksanaan pasien dituliskan dengan rincian yang jelas)</div>
                          </th>
                          <th style="border-right:none;">
                              <div style="font-weight:bold !important;">Verifikasi<br>DPJP</div>
                              <div class="desc-text">(Ttd, Nama Terang, Tgl & Jam)</div>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      ${rowsHtml}
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
    selectors: [["app-cppt-igd-placeholder"]],
    decls: 1,
    vars: 0,
    template: function (s, r) {
      renderTemplate(s, r);
    },
    encapsulation: 2,
  });
  return t;
})();

export { CpptIgdComponent };
