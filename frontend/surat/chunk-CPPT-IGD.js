import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as _cmp,
  gc as _elementStart,
  hc as _elementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { getStandardGridCSS, createSuratShell, createAutoPageSurat, bindSuratPrintButton, hospitalHeaderDiv } from "./chunk-SURAT-LAYOUT.js";

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
      this.loading = true;
      this.saving = false;
      this.patient = null;

      this.viewMode = "list"; // 'list' | 'form'
      this.cpptList = [];
      this.isReadOnly = false;
      this.activeCheckin = null;

      this.formData = {
        entries: []
      };

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[5] || pathParts[2];
      if (!this.noCheckin && pathParts[pathParts.length - 1]) {
        this.noCheckin = pathParts[pathParts.length - 1];
      }
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() {
      const root = document.querySelector("app-cppt-igd-placeholder");
      if (root) {
        root.addEventListener("click", (e) => {
          const btnView = e.target.closest(".btn-view-cppt");
          if (btnView) {
            const checkin = btnView.getAttribute("data-nocheckin");
            this.viewHistoricalCppt(checkin);
          }
          const btnTambah = e.target.closest(".btn-tambah-cppt");
          if (btnTambah) {
            this.tambahCppt();
          }
          const btnBack = e.target.closest(".btn-back-cppt");
          if (btnBack) {
            this.viewMode = "list";
            this.renderView();
          }
        });
      }
      this.renderView();
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
            if (res && res.length > 0) this.patient = res[0];
            if (this.patient && (this.patient.noMr || this.patient.norm)) {
              this.fetchCpptList();
              this.fetchCurrentVisitCppt();
            } else {
              this.loading = false;
              this.renderView();
            }
          },
          error: () => {
            this.loading = false;
            this.renderView();
          },
        });
    }

    fetchCpptList() {
      const noMr = this.patient.noMr || this.patient.norm;
      this.http.get(i.apiUrl + "/simrsba/cppt-igd/list/" + noMr).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.cpptList = res.data;
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

    fetchCurrentVisitCppt() {
      this.http
        .get(i.apiUrl + "/simrsba/cppt-igd/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.data) {
              if (res.data.formData) {
                this.formData = Object.assign({ entries: [] }, res.data.formData);
              } else if (res.data.entries) {
                this.formData.entries = res.data.entries;
              }
            }
          },
          error: () => {},
        });
    }

    viewHistoricalCppt(checkinId) {
      if (checkinId === this.noCheckin) {
        this.tambahCppt();
        return;
      }
      this.loading = true;
      this.activeCheckin = checkinId;
      this.renderView();
      this.http.get(i.apiUrl + "/simrsba/cppt-igd/" + checkinId).subscribe({
        next: (res) => {
          this.loading = false;
          this.isReadOnly = true;
          this.viewMode = "form";
          if (res && res.data) {
            if (res.data.formData) {
              this.formData = Object.assign({ entries: [] }, res.data.formData);
            } else if (res.data.entries) {
              this.formData.entries = res.data.entries;
            } else {
              this.formData = { entries: [] };
            }
          } else {
            this.formData = { entries: [] };
          }
          this.renderView();
        },
        error: () => {
          this.loading = false;
          this.showToast("danger", "Gagal memuat CPPT IGD");
          this.renderView();
        },
      });
    }

    tambahCppt() {
      this.activeCheckin = this.noCheckin;
      this.isReadOnly = false;
      this.viewMode = "form";
      this.renderView();
    }

    saveData() {
      if (this.isReadOnly) return;
      this.saving = true;
      const btn = document.getElementById("btn-save-cppt");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncEntriesFromDOM();

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm,
        user: "Dokter",
        tglInput: new Date().toLocaleString(),
        poliNama: "IGD",
        formData: this.formData,
        entries: this.formData.entries || []
      };

      this.http.post(i.apiUrl + "/simrsba/cppt-igd", payload).subscribe({
        next: (res) => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
            }, 2000);
          }
          this.showToast("success", "CPPT IGD berhasil disimpan");
          this.fetchCpptList();
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
          }
          this.showToast("danger", "Gagal menyimpan CPPT IGD");
        },
      });
    }

    addEntry() {
      const today = new Date();
      const tglDate = today.toISOString().split("T")[0];
      const tglTime = today.toTimeString().split(" ")[0].substring(0, 5);
      const dpjp = this.patient?.dokterDpjp || this.patient?.dpjp || this.patient?.namaDokter || "Dokter";

      this.formData.entries.push({
        tglDate,
        tglTime,
        tglJam: `${tglDate} ${tglTime}`,
        profesi: "Dokter",
        ppa: dpjp,
        s: "",
        o: "",
        a: "",
        p: "",
        instruksi: "",
        verifikasi: dpjp,
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
      const root = document.querySelector("app-cppt-igd-placeholder");
      if (!root) return;
      root.querySelectorAll(".form-data-input").forEach((input) => {
        const idx = parseInt(input.dataset.idx);
        const field = input.dataset.field;
        if (!isNaN(idx) && field && this.formData.entries[idx]) {
          this.formData.entries[idx][field] = input.value;
          if (field === 'tglDate' || field === 'tglTime') {
            const d = this.formData.entries[idx].tglDate || '';
            const t = this.formData.entries[idx].tglTime || '';
            this.formData.entries[idx].tglJam = `${d} ${t}`.trim();
          }
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
      const root = document.querySelector("app-cppt-igd-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data CPPT IGD...</div></div></div>';
        return;
      }

      if (this.viewMode === "list") {
        this.renderList(root);
      } else {
        this.renderForm(root);
      }
    }

    renderList(root) {
      const hasCurrent = (this.formData.entries && this.formData.entries.length > 0);
      const topAction = hasCurrent
        ? '<button class="btn btn-warning btn-sm btn-tambah-cppt text-nowrap"><i class="bi bi-pencil me-1"></i> Edit CPPT Saat Ini</button>'
        : '<button class="btn btn-primary btn-sm btn-tambah-cppt text-nowrap"><i class="bi bi-plus-circle me-1"></i> Tambah CPPT</button>';

      let listRows = "";
      if (this.cpptList.length === 0) {
        listRows = '<tr><td colspan="4" class="text-center text-muted py-3">Belum ada riwayat CPPT IGD</td></tr>';
      } else {
        this.cpptList.forEach((c, idx) => {
          const isCurrent = (c.noCheckin === this.noCheckin);
          listRows += '<tr>' +
            '<td class="text-center">' + (idx + 1) + '</td>' +
            '<td>' + (c.tglInput || "-") + '</td>' +
            '<td>IGD / ' + (c.noCheckin || "-") + '</td>' +
            '<td class="text-center">' +
              '<button class="btn btn-sm ' + (isCurrent ? 'btn-warning' : 'btn-primary') + ' btn-view-cppt" data-nocheckin="' + c.noCheckin + '">' +
                '<i class="bi bi-' + (isCurrent ? 'pencil' : 'eye') + '"></i> ' + (isCurrent ? 'Edit' : 'Lihat') +
              '</button>' +
            '</td>' +
          '</tr>';
        });
      }

      root.innerHTML = '<div class="card shadow-none border rounded" style="border-radius: 6px; overflow: hidden;">' +
        '<div class="card-header bg-white p-3 d-flex justify-content-between align-items-center" style="border-bottom: 1px solid #dee2e6;">' +
          '<span class="fw-bold text-dark"><i class="bi bi-journal-text me-2 text-secondary"></i> Riwayat CPPT IGD Pasien</span>' +
          '<div>' + topAction + '</div>' +
        '</div>' +
        '<div class="card-body p-0">' +
          '<div class="table-responsive">' +
            '<table class="table table-hover align-middle mb-0">' +
              '<thead style="border-bottom: 1px solid #dee2e6; font-weight: bold; text-transform: uppercase;">' +
                '<tr>' +
                  '<th class="text-center" style="width: 50px;">#</th>' +
                  '<th>TGL</th>' +
                  '<th>KETERANGAN (IGD / CHECKIN)</th>' +
                  '<th class="text-center" style="width: 120px;">AKSI</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' + listRows + '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    renderForm(root) {
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

      if (!this.formData.entries) this.formData.entries = [];

      let entriesHtml = "";
      this.formData.entries.forEach((e, idx) => {
        entriesHtml += '<div class="py-3 px-2 ' + (idx > 0 ? 'border-top' : '') + '">' +
          '<div class="d-flex justify-content-between align-items-center mb-2">' +
            '<span class="fw-bold text-dark small"><i class="bi bi-journal-text me-1"></i> Entri CPPT #' + (idx + 1) + '</span>' +
            (!this.isReadOnly ? '<button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-idx="' + idx + '"><i class="bi bi-trash me-1"></i>Hapus Baris</button>' : '') +
          '</div>' +
          '<div class="row g-2 mb-2">' +
            '<div class="col-md-2"><label class="f-label">Tanggal Entry</label><input type="date" class="f-input form-data-input" data-idx="' + idx + '" data-field="tglDate" value="' + (e.tglDate || '') + '" ' + (this.isReadOnly ? 'disabled' : '') + '></div>' +
            '<div class="col-md-2"><label class="f-label">Jam Entry</label><input type="time" class="f-input form-data-input" data-idx="' + idx + '" data-field="tglTime" value="' + (e.tglTime || '') + '" ' + (this.isReadOnly ? 'disabled' : '') + '></div>' +
            '<div class="col-md-3"><label class="f-label">Profesi / Bagian</label>' +
              '<select class="f-input form-data-input" style="font-size:12px;" data-idx="' + idx + '" data-field="profesi" ' + (this.isReadOnly ? 'disabled' : '') + '>' +
                '<option value="Dokter" ' + (e.profesi === 'Dokter' ? 'selected' : '') + '>Dokter</option>' +
                '<option value="Perawat" ' + (e.profesi === 'Perawat' ? 'selected' : '') + '>Perawat</option>' +
                '<option value="Bidan" ' + (e.profesi === 'Bidan' ? 'selected' : '') + '>Bidan</option>' +
                '<option value="Apoteker" ' + (e.profesi === 'Apoteker' ? 'selected' : '') + '>Apoteker</option>' +
                '<option value="Dietisien" ' + (e.profesi === 'Dietisien' ? 'selected' : '') + '>Dietisien / Gizi</option>' +
              '</select></div>' +
            '<div class="col-md-5"><label class="f-label">Nama PPA (Petugas)</label><input type="text" class="f-input form-data-input" style="font-size:12px;" data-idx="' + idx + '" data-field="ppa" value="' + (e.ppa || dpjp) + '" placeholder="Nama PPA / Dokter / Perawat..." ' + (this.isReadOnly ? 'disabled' : '') + '></div>' +
          '</div>' +
          '<div class="row g-2 mb-2">' +
            '<div class="col-12"><label class="f-label text-dark">Subjektif (S)</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="s" rows="2" placeholder="Anamnesis / Keluhan Utama / Riwayat Penyakit..." ' + (this.isReadOnly ? 'disabled' : '') + '>' + (e.s || '') + '</textarea></div>' +
            '<div class="col-12"><label class="f-label text-dark">Objektif (O)</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="o" rows="2" placeholder="Pemeriksaan Fisik & Vital (TTV, GCS, Ku...)..." ' + (this.isReadOnly ? 'disabled' : '') + '>' + (e.o || '') + '</textarea></div>' +
            '<div class="col-12"><label class="f-label text-dark">Asesmen (A)</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="a" rows="2" placeholder="Diagnosis Kerja / Masalah Medis / Keperawatan..." ' + (this.isReadOnly ? 'disabled' : '') + '>' + (e.a || '') + '</textarea></div>' +
            '<div class="col-12"><label class="f-label text-dark">Planning (P)</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="p" rows="2" placeholder="Rencana Asuhan / Terapi / Tindakan..." ' + (this.isReadOnly ? 'disabled' : '') + '>' + (e.p || '') + '</textarea></div>' +
          '</div>' +
          '<div class="row g-2 mb-2">' +
            '<div class="col-12"><label class="f-label">Instruksi PPA (Penatalaksanaan Pasien)</label><textarea class="f-input form-data-input" data-idx="' + idx + '" data-field="instruksi" rows="2" placeholder="Instruksi penatalaksanaan pasien..." ' + (this.isReadOnly ? 'disabled' : '') + '>' + (e.instruksi || '') + '</textarea></div>' +
          '</div>' +
          '<div class="row g-2">' +
            '<div class="col-md-4"><label class="f-label">Nama DPJP / Verifikator</label><input type="text" class="f-input form-data-input mb-1" style="font-size:12px;" data-idx="' + idx + '" data-field="verifikasi" value="' + (e.verifikasi || dpjp) + '" placeholder="Nama Verifikator / DPJP..." ' + (this.isReadOnly ? 'disabled' : '') + '></div>' +
            '<div class="col-md-8">' +
              '<div class="d-flex justify-content-between align-items-center mb-1">' +
                '<label class="f-label mb-0">TTD & Paraf Signature Box</label>' +
                (!this.isReadOnly ? '<button type="button" class="btn btn-sm btn-outline-secondary sig-clear-cppt-btn" data-idx="' + idx + '" style="font-size:10px; padding:1px 7px;"><i class="bi bi-eraser me-1"></i>Hapus TTD</button>' : '') +
              '</div>' +
              '<div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden;">' +
                '<canvas id="sig-cppt-' + idx + '" class="cppt-sig-canvas" data-idx="' + idx + '" width="600" height="180" style="display:block; width:100%; height:150px; cursor:crosshair; touch-action:none;"></canvas>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      });

      if (this.formData.entries.length === 0) {
        entriesHtml = '<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri CPPT. Silakan klik "+ Tambah Baris CPPT" untuk memulai.</div>';
      }

      const inputContent = '<div class="d-flex justify-content-between align-items-center mb-3">' +
        '<button class="btn btn-sm btn-outline-secondary btn-back-cppt"><i class="bi bi-arrow-left me-1"></i>Kembali ke Daftar History</button>' +
        (this.isReadOnly ? '<span class="badge bg-secondary">Mode Read-Only (Riwayat)</span>' : '<span class="badge bg-primary">Mode Edit CPPT</span>') +
      '</div>' +
      '<div class="card border mb-3">' +
        '<div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>' +
        '<div class="card-body pt-2 pb-2">' +
          '<div class="row g-2">' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="' + noMr + '" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="' + nama + '" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="' + tglLahir + ' (' + kelamin + ')" disabled style="background:#e9ecef;"></div></div>' +
            '<div class="col-md-3"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="' + dpjp + '" disabled style="background:#e9ecef;"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="accordion mb-3" id="accordionCppt">' +
        '<div class="accordion-item mb-2 border rounded">' +
          '<h2 class="accordion-header" id="heading_cppt_1">' +
            '<button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_cppt_1" aria-expanded="true" aria-controls="collapse_cppt_1">' +
              '<span class="fw-bold text-dark d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">' +
                '<span><i class="bi bi-journal-text me-2 text-secondary"></i> 1. Catatan Perkembangan Pasien Terintegrasi (CPPT)</span>' +
              '</span>' +
            '</button>' +
          '</h2>' +
          '<div id="collapse_cppt_1" class="accordion-collapse collapse show" aria-labelledby="heading_cppt_1" data-bs-parent="#accordionCppt">' +
            '<div class="accordion-body bg-white p-3">' +
              '<div class="d-flex justify-content-between align-items-center mb-3">' +
                '<span class="small text-muted">Daftar entri SOAP dan instruksi PPA IGD</span>' +
                (!this.isReadOnly ? '<button type="button" class="btn btn-sm btn-primary" id="btn-add-entry"><i class="bi bi-plus-lg me-1"></i>Tambah Baris CPPT</button>' : '') +
              '</div>' +
              '<div id="entries-container">' + entriesHtml + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      (!this.isReadOnly ? '<div class="d-flex justify-content-end mt-3 border-top pt-3"><button type="button" id="btn-save-cppt" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button></div>' : '');

      const extraCssStr = '#accordionCppt .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }\n' +
        '#accordionCppt .accordion-button { box-shadow: none !important; }\n' +
        '#accordionCppt .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }\n' +
        '#accordionCppt .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }\n' +
        '.cppt-table { width: 100%; border-collapse: collapse; font-family: "Times New Roman", Times, serif; flex: 1; height: 100%; table-layout: fixed; }\n' +
        '.cppt-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }\n' +
        '.cppt-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }\n' +
        '.cppt-table tbody td:first-child { border-left: none !important; }\n' +
        '.cppt-table tbody td:last-child { border-right: none !important; }\n' +
        '.cppt-table tbody tr:last-child td { border-bottom: none !important; }\n' +
        '.desc-text { font-size: 9px !important; font-weight: normal !important; text-align: center; margin-top: 2px; }';

      root.innerHTML = createSuratShell({
        idPrefix: 'cppt',
        wrapperTag: 'app-cppt-igd-placeholder',
        inputPaneId: 'cppt-input',
        printPaneId: 'cppt-print',
        printTabId: 'cppt-print-tab',
        tabsClass: 'cppt-tabs',
        extraCss: extraCssStr,
        inputContent,
      });

      bindSuratPrintButton(root);

      const btnSave = root.querySelector("#btn-save-cppt");
      if (btnSave) btnSave.addEventListener("click", () => this.saveData());

      const btnAdd = root.querySelector("#btn-add-entry");
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

      const printTab = root.querySelector("#cppt-print-tab");
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
        if (this.isReadOnly) return;
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
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
      const printContainer = document.getElementById("cppt-print-container");
      if (!printContainer) return;

      let rowsHtml = "";
      const entries = this.formData.entries || [];
      entries.forEach((e) => {
        const soapText = [
          e.s ? 'S: ' + e.s : '',
          e.o ? 'O: ' + e.o : '',
          e.a ? 'A: ' + e.a : '',
          e.p ? 'P: ' + e.p : '',
          (!e.s && !e.o && !e.a && !e.p && e.soap) ? e.soap : ''
        ].filter(Boolean).join('\n');

        const tglJamStr = e.tglJam || (e.tglDate ? (e.tglDate + '<br>' + (e.tglTime || '')) : '');

        rowsHtml += '<tr>' +
            '<td style="text-align:center; padding: 6px 4px;">' + (tglJamStr || '') + '</td>' +
            '<td style="text-align:center; padding: 6px 4px;">' + (e.profesi || '') + '<br><br><b>' + (e.ppa || '') + '</b></td>' +
            '<td style="white-space:pre-wrap; padding: 6px 6px;">' + soapText + '</td>' +
            '<td style="white-space:pre-wrap; padding: 6px 6px;">' + (e.instruksi || '') + '</td>' +
            '<td style="text-align:center; vertical-align:bottom; padding: 6px 4px;">' +
                (e.ttd ? '<img src="' + e.ttd + '" style="max-height:50px; max-width:90%; display:block; margin:2px auto;">' : '') +
                '<div style="font-weight:bold; font-size:10px;">' + (e.verifikasi || '') + '</div>' +
            '</td>' +
        '</tr>';
      });

      // Expanding filler row to stretch table 100% to bottom of Folio/F4 page
      rowsHtml += '<tr style="height:100%;">' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
      '</tr>';

      printContainer.innerHTML = '<div class="surat-document" style="display:flex; flex-direction:column; height:1247px;">' +
          hospitalHeaderDiv(noMr, nama, tglLahir, kelamin) +
          '<div style="border:2px solid black; font-family:\'Times New Roman\',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0; margin-top:10px;">' +
              '<div style="text-align:center; font-weight:bold; font-size:14px !important; padding:8px; border-bottom:2px solid black; background-color:#e6e6e6;">' +
                  'CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)<br>RAWAT JALAN / IGD' +
              '</div>' +
              '<table class="cppt-table" style="border:none; border-top:1px solid black; flex:1;">' +
                '<colgroup>' +
                    '<col style="width:10%">' +
                    '<col style="width:12%">' +
                    '<col style="width:42%">' +
                    '<col style="width:22%">' +
                    '<col style="width:14%">' +
                '</colgroup>' +
                '<thead>' +
                    '<tr>' +
                        '<th style="border-left:none;">Tgl/<br>Jam</th>' +
                        '<th>Profesi/<br>Bagian</th>' +
                        '<th>' +
                            '<div style="font-weight:bold !important;">Hasil Pemeriksaan, Analisa, Rencana, dan Penata Laksanaan Pasien</div>' +
                            '<div class="desc-text">(Diisi Oleh Dokter/Apoteker Dengan Format SOAP, Perawat/Bidan/ Keterampilan Fisik/Keteknesian Medis/ Dengan Format SBAR, Dan Dietisien Dengan Format ADIME)</div>' +
                        '</th>' +
                        '<th>' +
                            '<div style="font-weight:bold !important;">Intruksi Tenaga Kesehatan</div>' +
                            '<div class="desc-text">(Intruksi Penatalaksanaan pasien dituliskan dengan rincian yang jelas)</div>' +
                        '</th>' +
                        '<th style="border-right:none;">' +
                            '<div style="font-weight:bold !important;">Verifikasi<br>DPJP</div>' +
                            '<div class="desc-text">(Ttd, Nama Terang, Tgl & Jam)</div>' +
                        '</th>' +
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
      this.ɵcmp = _cmp({
        type: t,
        selectors: [["app-cppt-igd-placeholder"]],
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

export { CpptIgdComponent };
