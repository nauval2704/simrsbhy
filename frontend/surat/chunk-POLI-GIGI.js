import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { c as Router } from "../chunk-YIQM4CGR.js";
import { getStandardGridCSS, createSuratShell, createAutoPageSurat, bindSuratPrintButton, hospitalHeaderDiv, buildSuratPdfFilename } from "./chunk-SURAT-LAYOUT.js";

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
      try {
        this.router = inject(Router);
      } catch (e) {
        this.router = null;
      }
      this.loading = true;
      this.saving = false;
      this.gigiData = null;
      this.patient = null;

      this.formData = {
        entries: []
      };

      const pathParts = window.location.pathname.split("/").filter(Boolean);
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
      const lookupKey = this.patient?.noMr || this.noCheckin;
      this.http.get(i.apiUrl + "/simrsba/poli-gigi/" + lookupKey).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.gigiData = res.data;
            if (res.data.formData && res.data.formData.entries) {
              this.formData = Object.assign({ entries: [] }, res.data.formData);
            } else if (res.data.entries) {
              this.formData.entries = res.data.entries;
            }
          }
          this.fetchPengkajianIfEmpty();
        },
        error: () => {
          this.fetchPengkajianIfEmpty();
        },
      });
    }

    fetchPengkajianIfEmpty() {
      this.http.get(i.apiUrl + "/simrsba/pengkajian-awal-poli/" + this.noCheckin).subscribe({
        next: (res) => {
          const pkData = res?.data?.formData || res?.data || {};
          const dpjp = this.patient?.dokterDpjp || this.patient?.dpjp || this.patient?.namaDokter || "";
          const tglMasukStr = String(this.patient?.tglMasuk || "").split(" ")[0];
          const today = new Date();
          const todayDateStr = today.toISOString().split("T")[0];
          const todayTimeStr = today.toTimeString().split(" ")[0].substring(0, 5);

          if (!this.formData.entries || this.formData.entries.length === 0) {
            this.formData.entries = [{
              noCheckin: this.noCheckin,
              tglDate: tglMasukStr || todayDateStr,
              tglTime: todayTimeStr,
              gigi: "",
              icd10: "",
              keluhan: pkData.keluhanUtama || pkData.diagnosisKerja || "",
              uraianKlinis: pkData.keluhanUtama || pkData.diagnosisKerja || "",
              tindakan: "",
              rencanaPenting: "",
              parafName: dpjp,
              drSp: dpjp,
              ttd: null,
              parafImg: null
            }];
          } else {
            const hasCurrentCheckin = this.formData.entries.some(e => e.noCheckin === this.noCheckin);
            const hasSameDayAndDoctor = this.formData.entries.some(e => e.tglDate === (tglMasukStr || todayDateStr) && (e.parafName === dpjp || e.drSp === dpjp));

            if (!hasCurrentCheckin && !hasSameDayAndDoctor) {
              this.formData.entries.push({
                noCheckin: this.noCheckin,
                tglDate: tglMasukStr || todayDateStr,
                tglTime: todayTimeStr,
                gigi: "",
                icd10: "",
                keluhan: pkData.keluhanUtama || pkData.diagnosisKerja || "",
                uraianKlinis: pkData.keluhanUtama || pkData.diagnosisKerja || "",
                tindakan: "",
                rencanaPenting: "",
                parafName: dpjp,
                drSp: dpjp,
                ttd: null,
                parafImg: null
              });
            } else if (hasCurrentCheckin) {
              const currentEntry = this.formData.entries.find(e => e.noCheckin === this.noCheckin);
              if (currentEntry) {
                if (!currentEntry.parafName && dpjp) currentEntry.parafName = dpjp;
                if (!currentEntry.drSp && dpjp) currentEntry.drSp = dpjp;
                if (!currentEntry.keluhan && (pkData.keluhanUtama || pkData.diagnosisKerja)) currentEntry.keluhan = pkData.keluhanUtama || pkData.diagnosisKerja;
                if (!currentEntry.uraianKlinis && (pkData.keluhanUtama || pkData.diagnosisKerja)) currentEntry.uraianKlinis = pkData.keluhanUtama || pkData.diagnosisKerja;
              }
            }
          }
          this.loading = false;
          this.renderView();

          if (this.formData.entries) {
            this.formData.entries.forEach((e, idx) => {
              if (!e.rencanaPenting && !e.tindakan) {
                this.fetchAndPopulateObat(idx, false, false);
              }
            });
          }
        },
        error: () => {
          this.loading = false;
          this.renderView();
        }
      });
    }

    fetchAndPopulateObat(idx, force = false, showToast = false) {
      const entry = this.formData.entries ? this.formData.entries[idx] : null;
      if (!entry) return;
      const targetCheckin = entry.noCheckin || this.noCheckin;
      if (!targetCheckin) return;

      if (!force && entry.rencanaPenting && entry.rencanaPenting.trim().length > 0) {
        return;
      }

      this.http.get(i.apiUrl + "/simrsba/farmasi-obat/" + targetCheckin).subscribe({
        next: (res) => {
          if (res && res.data && res.data.text) {
            this.setRencanaObat(idx, res.data.text, showToast);
          } else {
            this.fallbackFetchObat(idx, targetCheckin, showToast);
          }
        },
        error: () => {
          this.fallbackFetchObat(idx, targetCheckin, showToast);
        }
      });
    }

    fallbackFetchObat(idx, targetCheckin, showToast = false) {
      this.http.post(i.apiUrl + "/farmasi/resep", { noCheckin: targetCheckin }).subscribe({
        next: (resepRes) => {
          const resepDocs = resepRes?.data || [];
          this.http.get(i.apiUrl + "/simrsba/getrincian/FARMASI/" + targetCheckin).subscribe({
            next: (rincianRes) => {
              const rincianItems = Array.isArray(rincianRes) ? rincianRes : (rincianRes?.data || []);
              const formatted = this.formatObatText(resepDocs, rincianItems);
              if (formatted) this.setRencanaObat(idx, formatted, showToast);
              else if (showToast) showSuccessToast("Belum ada obat/BMHP terinput di farmasi");
            },
            error: () => {
              const formatted = this.formatObatText(resepDocs, []);
              if (formatted) this.setRencanaObat(idx, formatted, showToast);
              else if (showToast) showSuccessToast("Belum ada obat/BMHP terinput di farmasi");
            }
          });
        },
        error: () => {
          this.http.get(i.apiUrl + "/simrsba/getrincian/FARMASI/" + targetCheckin).subscribe({
            next: (rincianRes) => {
              const rincianItems = Array.isArray(rincianRes) ? rincianRes : (rincianRes?.data || []);
              const formatted = this.formatObatText([], rincianItems);
              if (formatted) this.setRencanaObat(idx, formatted, showToast);
              else if (showToast) showSuccessToast("Belum ada obat/BMHP terinput di farmasi");
            },
            error: () => {
              if (showToast) showErrorAlert("Gagal mengambil data obat dari farmasi");
            }
          });
        }
      });
    }

    formatObatText(resepDocs, rincianItems) {
      const lines = [];
      const seen = new Set();

      if (Array.isArray(resepDocs)) {
        for (const doc of resepDocs) {
          const obatList = doc.obat || [];
          for (const o of obatList) {
            if (!o || !o.nama) continue;
            const key = o.nama.trim().toUpperCase();
            if (seen.has(key)) continue;
            seen.add(key);

            let line = o.nama.trim();
            const qtyStr = o.jumlah ? `${o.jumlah} ${o.satuan || ''}`.trim() : (o.satuan || '');
            if (qtyStr) line += ` (${qtyStr})`;

            const details = [o.takaran, o.jam, o.kapan, o.deskripsi]
              .filter(d => d && typeof d === 'string' && d.trim().length > 0 && d.trim() !== '-')
              .join(' ');
            if (details) line += ` - ${details}`;

            lines.push(line);
          }
        }
      }

      if (Array.isArray(rincianItems)) {
        for (const r of rincianItems) {
          if (!r || !r.nama) continue;
          const key = r.nama.trim().toUpperCase();
          if (seen.has(key)) continue;
          seen.add(key);

          let line = r.nama.trim();
          const qtyStr = r.qty ? `${r.qty} ${r.satuan || ''}`.trim() : (r.satuan || '');
          if (qtyStr) line += ` (${qtyStr})`;
          lines.push(line);
        }
      }

      return lines.map((m, i) => `${i + 1}. ${m}`).join('\n');
    }

    setRencanaObat(idx, text, showToast = false, force = false) {
      if (!this.formData.entries || !this.formData.entries[idx] || !text) return;
      const current = (this.formData.entries[idx].rencanaPenting || '').trim();

      if (!force && current.length > 0) {
        const firstLine = text.trim().split('\n')[0];
        if (current.includes(firstLine)) return;
        const combined = current + '\n\n' + text;
        this.formData.entries[idx].rencanaPenting = combined;
        this.formData.entries[idx].tindakan = combined;
      } else {
        this.formData.entries[idx].rencanaPenting = text;
        this.formData.entries[idx].tindakan = text;
      }

      const root = document.querySelector("app-poli-gigi-placeholder");
      if (root) {
        const textarea = root.querySelector(`textarea[data-idx="${idx}"][data-field="rencanaPenting"]`);
        if (textarea) {
          textarea.value = this.formData.entries[idx].rencanaPenting;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
      if (showToast) {
        showSuccessToast("Data obat berhasil disinkronkan ke Rencana Penting!");
      }
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
        noCheckin: this.noCheckin,
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
      if (!root || !this.formData.entries) return;
      root.querySelectorAll(".form-data-input").forEach((input) => {
        const idx = parseInt(input.getAttribute("data-idx"));
        const field = input.getAttribute("data-field");
        if (!isNaN(idx) && field && this.formData.entries[idx]) {
          this.formData.entries[idx][field] = input.value;
          if (field === "uraianKlinis") this.formData.entries[idx].keluhan = input.value;
          if (field === "rencanaPenting") this.formData.entries[idx].tindakan = input.value;
          if (field === "drSp") this.formData.entries[idx].parafName = input.value;
          if (field === "icd10") this.formData.entries[idx].diagnosis = input.value;
        }
      });
    }

    navigateToFarmasi(targetCheckin) {
      this.syncEntriesFromDOM();
      const checkin = targetCheckin || this.noCheckin;

      if (checkin === this.noCheckin) {
        const sidebarFarmasi = document.querySelector('simrs-patient-sidebar a[data-path="farmasi"]');
        if (sidebarFarmasi) {
          sidebarFarmasi.click();
          return;
        }
      }

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const currentNorm = (pathParts[0] === "poli" && pathParts[1] === "input") 
        ? pathParts[2] 
        : (this.patient?.noMr || this.patient?.norm || "");
      const currentParentCheckin = (pathParts[3] === "nocheckin") 
        ? pathParts[4] 
        : this.noCheckin;
      const targetUrl = `/poli/input/${currentNorm}/nocheckin/${currentParentCheckin}/farmasi/${checkin}`;

      if (this.router && typeof this.router.navigateByUrl === "function") {
        this.router.navigateByUrl(targetUrl);
        return;
      }

      const sidebar = document.querySelector("simrs-patient-sidebar");
      if (sidebar && sidebar._router && typeof sidebar._router.navigateByUrl === "function") {
        sidebar._router.navigateByUrl(targetUrl);
        return;
      }

      window.location.href = targetUrl;
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
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data PRMRJ Poli Gigi...</div></div></div>';
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

      const isEntryFilled = (e) => {
        if (!e) return false;
        return !!(
          (e.uraianKlinis && e.uraianKlinis.trim()) ||
          (e.keluhan && e.keluhan.trim()) ||
          (e.icd10 && e.icd10.trim()) ||
          (e.diagnosis && e.diagnosis.trim()) ||
          (e.rencanaPenting && e.rencanaPenting.trim()) ||
          (e.tindakan && e.tindakan.trim()) ||
          (e.icd9 && e.icd9.trim()) ||
          (e.ket && e.ket.trim()) ||
          (e.gigi && e.gigi.trim()) ||
          (e.parafImg || e.ttd)
        );
      };

      let defaultOpenIdx = this.formData.entries.findIndex(e => e.noCheckin === this.noCheckin);
      if (defaultOpenIdx === -1) {
        defaultOpenIdx = this.formData.entries.length - 1;
      }

      let entriesHtml = "";
      if (this.formData.entries.length > 0) {
        const pathParts = window.location.pathname.split("/").filter(Boolean);
        const currentNorm = (pathParts[0] === "poli" && pathParts[1] === "input") 
          ? pathParts[2] 
          : (this.patient?.noMr || this.patient?.norm || "");
        const currentParentCheckin = (pathParts[3] === "nocheckin") 
          ? pathParts[4] 
          : this.noCheckin;

        this.formData.entries.forEach((e, idx) => {
          const isExpanded = (idx === defaultOpenIdx);
          const entryCheckin = e.noCheckin || this.noCheckin;
          const farmasiUrl = `/poli/input/${currentNorm}/nocheckin/${currentParentCheckin}/farmasi/${entryCheckin}`;
          const filled = isEntryFilled(e);
          const headerBgStyle = filled 
            ? 'background-color: #e53935 !important; color: #ffffff !important;' 
            : 'background-color: #ffffff; color: #212529;';
          const headerTextClass = filled ? 'fw-bold text-white' : 'fw-semibold text-dark';
          const chevColor = filled ? 'text-white' : 'text-secondary';
          const iconHtml = filled ? '' : '<i class="bi bi-file-earmark-text me-2 text-secondary"></i> ';

          entriesHtml += `
          <div class="card border mb-3 entry-card shadow-none" data-idx="${idx}" style="border-color: #dee2e6; border-radius: 6px; overflow: hidden;">
            <div class="card-header py-2 px-3 d-flex justify-content-between align-items-center border-bottom entry-header-toggle" data-idx="${idx}" style="cursor: pointer; ${headerBgStyle}">
              <span class="${headerTextClass} d-flex align-items-center" style="font-size: 13px;">
                ${iconHtml}Entri PRMRJ #${idx + 1}
              </span>
              <i class="bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} ${chevColor} entry-chevron" data-idx="${idx}"></i>
            </div>
            <div class="card-body p-3 entry-body ${isExpanded ? '' : 'd-none'}" id="entry-body-${idx}">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted" style="font-size: 12px;">Detail entri PRMRJ ke-${idx + 1}</span>
                ${this.formData.entries.length > 1 ? `
                <button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry py-1 px-2 d-flex align-items-center gap-1" data-idx="${idx}" style="font-size: 11.5px;">
                  <i class="bi bi-trash"></i> Hapus Baris
                </button>` : ''}
              </div>

              <!-- Row 1: Tanggal Entry, Jam Entry, Dokter / Spesialis (DR.SP) -->
              <div class="row g-2 mb-3">
                <div class="col-md-3">
                  <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Tanggal Entry</label>
                  <input type="date" class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="tglDate" value="${e.tglDate || ''}" style="border: 1px solid #ced4da; border-radius: 4px; padding: 5px 8px; font-size: 12.5px;">
                </div>
                <div class="col-md-3">
                  <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Jam Entry</label>
                  <input type="time" class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="tglTime" value="${e.tglTime || ''}" style="border: 1px solid #ced4da; border-radius: 4px; padding: 5px 8px; font-size: 12.5px;">
                </div>
                <div class="col-md-6">
                  <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Dokter / Spesialis (DR.SP)</label>
                  <input type="text" class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="drSp" value="${e.drSp || e.parafName || dpjp}" placeholder="Nama dokter..." style="border: 1px solid #ced4da; border-radius: 4px; padding: 5px 8px; font-size: 12.5px; background: #fff;">
                </div>
              </div>

              <!-- Row 2: Uraian Klinis Penting & ICD 10 (Diagnosis) -->
              <div class="row g-2 mb-3">
                <div class="col-md-6">
                  <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Uraian Klinis Penting</label>
                  <textarea class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="uraianKlinis" rows="3" placeholder="Uraian klinis penting..." style="border: 1px solid #ced4da; border-radius: 4px; padding: 6px 8px; font-size: 12.5px; resize: vertical;">${e.uraianKlinis || e.keluhan || ''}</textarea>
                </div>
                <div class="col-md-6">
                  <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">ICD 10 (Diagnosis)</label>
                  <div class="position-relative">
                    <input type="text" class="form-control form-control-sm form-data-input icd10-input" data-idx="${idx}" data-field="icd10" value="${e.icd10 || e.diagnosis || ''}" placeholder="Ketik kode ICD-10 atau nama... (min. 3 karakter)" autocomplete="off" style="border: 1px solid #ced4da; border-radius: 4px; padding: 6px 8px; font-size: 12.5px; width: 100%;">
                    <div id="icd10-dropdown-${idx}" class="icd-dropdown-menu shadow border rounded bg-white position-absolute w-100 mt-1 d-none" style="z-index: 1060; max-height: 220px; overflow-y: auto; left: 0; right: 0;"></div>
                  </div>
                </div>
              </div>

              <!-- Row 3: Rencana Penting with Input Obat / BMHP on right -->
              <div class="row g-2 mb-3">
                <div class="col-12">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <label class="f-label mb-0" style="font-weight: 600; font-size: 12.5px; color: #212529;">Rencana Penting</label>
                    <a href="${farmasiUrl}" class="btn btn-sm btn-outline-primary btn-input-obat py-1 px-2 d-flex align-items-center gap-1" data-idx="${idx}" style="font-size: 11.5px;">
                      <i class="bi bi-box-arrow-up-right"></i> Input Obat / BMHP
                    </a>
                  </div>
                  <textarea class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="rencanaPenting" rows="3" placeholder="Rencana penting..." style="border: 1px solid #ced4da; border-radius: 4px; padding: 6px 8px; font-size: 12.5px; resize: vertical; width: 100%;">${e.rencanaPenting || e.tindakan || ''}</textarea>
                </div>
              </div>

              <!-- Row 4: Kode ICD-9 & Keterangan on left, Paraf / TTD Signature Box on right -->
              <div class="row g-2 mb-2">
                <div class="col-md-6">
                  <div class="mb-2 position-relative">
                    <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Kode ICD-9 (Autocomplete)</label>
                    <div class="position-relative">
                      <input type="text" class="form-control form-control-sm form-data-input icd9-input" data-idx="${idx}" data-field="icd9" value="${e.icd9 || ''}" placeholder="Ketik kode ICD-9 atau nama... (min. 3 karakter)" autocomplete="off" style="border: 1px solid #ced4da; border-radius: 4px; padding: 6px 8px; font-size: 12.5px; width: 100%;">
                      <div id="icd9-dropdown-${idx}" class="icd-dropdown-menu shadow border rounded bg-white position-absolute w-100 mt-1 d-none" style="z-index: 1060; max-height: 220px; overflow-y: auto; left: 0; right: 0;"></div>
                    </div>
                  </div>
                  <div>
                    <label class="f-label" style="font-weight: 600; font-size: 12.5px; color: #212529; margin-bottom: 4px; display: block;">Keterangan / Catatan</label>
                    <input type="text" class="form-control form-control-sm form-data-input" data-idx="${idx}" data-field="ket" value="${e.ket || ''}" placeholder="Keterangan..." style="border: 1px solid #ced4da; border-radius: 4px; padding: 6px 8px; font-size: 12.5px; width: 100%;">
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="d-flex align-items-center justify-content-between mb-1">
                    <label class="f-label mb-0" style="font-weight: 600; font-size: 12.5px; color: #212529;">
                      <i class="bi bi-pen me-1"></i>Paraf / TTD Signature Box
                    </label>
                    <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-prmrj-btn py-0 px-2" data-idx="${idx}" style="font-size: 11px;">
                      <i class="bi bi-eraser me-1"></i>Hapus TTD
                    </button>
                  </div>
                  <div style="border: 1px solid #ced4da; border-radius: 4px; background: #fafafa; overflow: hidden;">
                    <canvas id="sig-gigi-${idx}" class="gigi-sig-canvas" data-idx="${idx}" width="420" height="180" style="display: block; width: 100%; height: 115px; cursor: crosshair; touch-action: none;"></canvas>
                  </div>
                </div>
              </div>

            </div>
          </div>`;
        });
      } else {
        entriesHtml = `<div class="alert alert-info py-3 text-center my-2" style="font-size:13px;"><i class="bi bi-info-circle me-2"></i>Belum ada entri PRMRJ Poli Gigi. Silakan klik "+ Tambah Baris PRMRJ" untuk memulai.</div>`;
      }

      const inputContent = `
      <div class="card border mb-3 shadow-none" style="border-color: #dee2e6; border-radius: 6px; overflow: hidden;">
        <div class="card-header bg-white py-2 px-3 d-flex justify-content-between align-items-center border-bottom" style="cursor: pointer;" id="header-main-gigi">
          <span class="fw-semibold text-dark d-flex align-items-center" style="font-size: 13.5px;">
            <i class="bi bi-card-checklist me-2 text-secondary"></i> 1. Entri Profil Ringkas Rawat Jalan (PRMRJ)
          </span>
          <i class="bi bi-chevron-up text-primary fs-6" id="chevron-main-gigi"></i>
        </div>
        <div class="card-body p-3 bg-white" id="body-main-gigi">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="text-muted" style="font-size: 12.5px;">Daftar riwayat profil ringkas rawat jalan pasien</span>
            <button type="button" class="btn btn-sm btn-primary px-3 d-flex align-items-center gap-1" id="btn-add-gigi" style="font-size: 12px; font-weight: 500;">
              <i class="bi bi-plus-lg"></i> Tambah Baris PRMRJ
            </button>
          </div>

          <div id="gigi-entries-container">
            ${entriesHtml}
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end align-items-center gap-2 mt-3 pt-3 border-top">
        <button type="button" class="btn btn-outline-success surat-download-pdf-btn px-3">
          <i class="bi bi-file-earmark-pdf-fill me-1"></i>Simpan sebagai PDF
        </button>
        <button type="button" id="btn-save-poli-gigi" class="btn btn-primary px-4">
          <i class="bi bi-save me-1"></i>Simpan Data
        </button>
      </div>`;

      root.innerHTML = createSuratShell({
        idPrefix: 'poli-gigi',
        wrapperTag: 'app-poli-gigi-placeholder',
        inputPaneId: 'poli-gigi-input',
        printPaneId: 'poli-gigi-print',
        printTabId: 'poli-gigi-print-tab',
        tabsClass: 'poli-gigi-tabs',
        extraCss: `
.prmrj-bar-filled {
  background-color: #e53935 !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 13.5px !important;
  padding: 10px 18px !important;
  border-radius: 4px !important;
  margin-bottom: 8px !important;
  cursor: pointer !important;
  user-select: none !important;
  display: flex !important;
  align-items: center !important;
  transition: opacity 0.15s ease !important;
}
.prmrj-bar-filled:hover {
  opacity: 0.92;
}

.prmrj-bar-unfilled {
  background-color: #ffffff !important;
  color: #212529 !important;
  font-weight: 600 !important;
  font-size: 13.5px !important;
  padding: 9px 16px !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 4px !important;
  margin-bottom: 8px !important;
  cursor: pointer !important;
  user-select: none !important;
  display: flex !important;
  align-items: center !important;
}
.prmrj-bar-unfilled:hover {
  background-color: #f9fafb !important;
}

.icd-dropdown-menu {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}
.icd-option-item {
  padding: 7px 12px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  font-size: 12px;
}
.icd-option-item:hover {
  background-color: #f1f5f9 !important;
}

.gigi-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Times New Roman', Times, serif;
  flex: 1;
  height: 100%;
  table-layout: fixed;
}
.gigi-table th {
  border: 1px solid black;
  padding: 5px 4px;
  vertical-align: middle;
  font-size: 11px !important;
  text-align: center;
  background-color: #f2f2f2;
  font-weight: bold;
}
.gigi-table tbody td {
  border-top: none !important;
  border-bottom: none !important;
  border-left: 1px solid black !important;
  border-right: 1px solid black !important;
  padding: 6px 6px;
  vertical-align: top;
  font-size: 11px !important;
}
.gigi-table tbody td:first-child { border-left: none !important; }
.gigi-table tbody td:last-child { border-right: none !important; }
.gigi-table tbody tr:last-child td { border-bottom: none !important; }`,
        inputContent,
      });

      bindSuratPrintButton(root, {
        getFilename: () => buildSuratPdfFilename('PRMRJ_POLI_GIGI', this.patient?.noMr || this.patient?.norm, this.patient?.nama)
      });

      const updatePrint = () => {
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize);
      };

      const updateHeaderColor = (idx) => {
        const header = root.querySelector(`.entry-header-toggle[data-idx="${idx}"]`);
        if (!header || !self.formData.entries[idx]) return;
        const filled = isEntryFilled(self.formData.entries[idx]);
        const body = root.querySelector("#entry-body-" + idx);
        const isExpanded = body ? !body.classList.contains("d-none") : true;
        const chevClass = isExpanded ? 'bi-chevron-up' : 'bi-chevron-down';
        if (filled) {
          header.style.setProperty("background-color", "#e53935", "important");
          header.style.setProperty("color", "#ffffff", "important");
          header.classList.remove("bg-white");
          header.innerHTML = `
            <span class="fw-bold text-white d-flex align-items-center" style="font-size: 13px;">
              Entri PRMRJ #${idx + 1}
            </span>
            <i class="bi ${chevClass} text-white entry-chevron" data-idx="${idx}"></i>
          `;
        } else {
          header.style.removeProperty("background-color");
          header.style.removeProperty("color");
          header.style.backgroundColor = "#ffffff";
          header.style.color = "#212529";
          header.classList.add("bg-white");
          header.innerHTML = `
            <span class="fw-semibold text-dark d-flex align-items-center" style="font-size: 13px;">
              <i class="bi bi-file-earmark-text me-2 text-secondary"></i> Entri PRMRJ #${idx + 1}
            </span>
            <i class="bi ${chevClass} text-secondary entry-chevron" data-idx="${idx}"></i>
          `;
        }
      };

      // Toggle Main Card
      const mainHdr = root.querySelector("#header-main-gigi");
      if (mainHdr) {
        mainHdr.onclick = () => {
          const mainBody = root.querySelector("#body-main-gigi");
          const mainChev = root.querySelector("#chevron-main-gigi");
          if (mainBody) {
            mainBody.classList.toggle("d-none");
            if (mainChev) {
              if (mainBody.classList.contains("d-none")) {
                mainChev.classList.remove("bi-chevron-up");
                mainChev.classList.add("bi-chevron-down");
              } else {
                mainChev.classList.remove("bi-chevron-down");
                mainChev.classList.add("bi-chevron-up");
              }
            }
          }
        };
      }

      // Toggle Entry
      root.querySelectorAll(".entry-header-toggle").forEach((header) => {
        header.onclick = (ev) => {
          if (ev.target.closest("button") || ev.target.closest(".btn")) return;
          const idx = header.getAttribute("data-idx");
          const body = root.querySelector("#entry-body-" + idx);
          const chev = header.querySelector(".entry-chevron");
          if (body) {
            body.classList.toggle("d-none");
            if (chev) {
              if (body.classList.contains("d-none")) {
                chev.classList.remove("bi-chevron-up");
                chev.classList.add("bi-chevron-down");
              } else {
                chev.classList.remove("bi-chevron-down");
                chev.classList.add("bi-chevron-up");
              }
            }
          }
        };
      });

      // ICD-10 Live Autocomplete
      let icd10Timer = null;
      root.querySelectorAll(".icd10-input").forEach((input) => {
        const idx = parseInt(input.getAttribute("data-idx"));
        const dropdown = root.querySelector("#icd10-dropdown-" + idx);
        if (!dropdown) return;

        input.addEventListener("input", () => {
          const q = input.value.trim();
          clearTimeout(icd10Timer);
          if (q.length < 2) {
            dropdown.classList.add("d-none");
            dropdown.innerHTML = "";
            return;
          }
          icd10Timer = setTimeout(() => {
            self.http.get(i.apiUrl + "/simrsba/referensi/icd10?q=" + encodeURIComponent(q)).subscribe({
              next: (res) => {
                const list = res?.data || [];
                if (list.length === 0) {
                  dropdown.innerHTML = '<div class="p-2 text-muted small text-center"><i class="bi bi-info-circle me-1"></i>Tidak ada hasil ICD-10</div>';
                  dropdown.classList.remove("d-none");
                  return;
                }
                dropdown.innerHTML = list.map(item => `
                  <div class="icd-option-item" data-display="${item.display}">
                    <span class="badge bg-danger me-1" style="font-size:11px;">${item.kode}</span>
                    <span class="text-dark">${item.deskripsi}</span>
                  </div>
                `).join("");
                dropdown.classList.remove("d-none");

                dropdown.querySelectorAll(".icd-option-item").forEach(opt => {
                  opt.onclick = () => {
                    const val = opt.getAttribute("data-display");
                    input.value = val;
                    if (self.formData.entries[idx]) {
                      self.formData.entries[idx].icd10 = val;
                      self.formData.entries[idx].diagnosis = val;
                    }
                    dropdown.classList.add("d-none");
                    dropdown.innerHTML = "";
                    updateHeaderColor(idx);
                    updatePrint();
                  };
                });
              },
              error: () => {
                dropdown.classList.add("d-none");
              }
            });
          }, 200);
        });
      });

      // ICD-9 Live Autocomplete
      let icd9Timer = null;
      root.querySelectorAll(".icd9-input").forEach((input) => {
        const idx = parseInt(input.getAttribute("data-idx"));
        const dropdown = root.querySelector("#icd9-dropdown-" + idx);
        if (!dropdown) return;

        input.addEventListener("input", () => {
          const q = input.value.trim();
          clearTimeout(icd9Timer);
          if (q.length < 2) {
            dropdown.classList.add("d-none");
            dropdown.innerHTML = "";
            return;
          }
          icd9Timer = setTimeout(() => {
            self.http.get(i.apiUrl + "/simrsba/referensi/icd9?q=" + encodeURIComponent(q)).subscribe({
              next: (res) => {
                const list = res?.data || [];
                if (list.length === 0) {
                  dropdown.innerHTML = '<div class="p-2 text-muted small text-center"><i class="bi bi-info-circle me-1"></i>Tidak ada hasil ICD-9</div>';
                  dropdown.classList.remove("d-none");
                  return;
                }
                dropdown.innerHTML = list.map(item => `
                  <div class="icd-option-item" data-display="${item.display}">
                    <span class="badge bg-primary me-1" style="font-size:11px;">${item.kode}</span>
                    <span class="text-dark">${item.deskripsi}</span>
                  </div>
                `).join("");
                dropdown.classList.remove("d-none");

                dropdown.querySelectorAll(".icd-option-item").forEach(opt => {
                  opt.onclick = () => {
                    const val = opt.getAttribute("data-display");
                    input.value = val;
                    if (self.formData.entries[idx]) {
                      self.formData.entries[idx].icd9 = val;
                    }
                    dropdown.classList.add("d-none");
                    dropdown.innerHTML = "";
                    updateHeaderColor(idx);
                    updatePrint();
                  };
                });
              },
              error: () => {
                dropdown.classList.add("d-none");
              }
            });
          }, 200);
        });
      });

      // Close dropdowns on outside click
      document.addEventListener("click", (ev) => {
        if (!ev.target.closest(".position-relative")) {
          root.querySelectorAll(".icd-dropdown-menu").forEach(dd => dd.classList.add("d-none"));
        }
      });

      function trimGigiCanvas(c) {
        const ctx = c.getContext("2d");
        const imgData = ctx.getImageData(0, 0, c.width, c.height);
        const d = imgData.data;
        let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
        let found = false;
        for (let y = 0; y < c.height; y++) {
          for (let x = 0; x < c.width; x++) {
            if (d[(y * c.width + x) * 4 + 3] > 15) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              found = true;
            }
          }
        }
        if (!found) return null;
        const pad = 6;
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(c.width, maxX + pad);
        maxY = Math.min(c.height, maxY + pad);
        const w = maxX - minX;
        const h = maxY - minY;
        const trimmed = document.createElement("canvas");
        trimmed.width = w;
        trimmed.height = h;
        trimmed.getContext("2d").drawImage(c, minX, minY, w, h, 0, 0, w, h);
        return trimmed.toDataURL();
      }

      root.querySelectorAll(".gigi-sig-canvas").forEach((canvas) => {
        const idx = parseInt(canvas.getAttribute("data-idx"));
        if (isNaN(idx)) return;
        const ctx = canvas.getContext("2d");
        const existingSig = self.formData.entries[idx]?.parafImg || self.formData.entries[idx]?.ttd;
        if (existingSig) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const trimmed = trimGigiCanvas(canvas);
            if (trimmed) {
              self.formData.entries[idx].parafImg = trimmed;
              self.formData.entries[idx].ttd = trimmed;
            }
          };
          img.src = existingSig;
        }

        let drawing = false;
        let lastX = 0, lastY = 0;
        const getPos = (ev) => {
          const r = canvas.getBoundingClientRect();
          const sx = canvas.width / r.width;
          const sy = canvas.height / r.height;
          if (ev.touches && ev.touches[0]) {
            return { x: (ev.touches[0].clientX - r.left) * sx, y: (ev.touches[0].clientY - r.top) * sy };
          }
          return { x: (ev.clientX - r.left) * sx, y: (ev.clientY - r.top) * sy };
        };

        const saveSig = () => {
          if (self.formData.entries[idx]) {
            const trimmed = trimGigiCanvas(canvas);
            const dataUrl = trimmed || canvas.toDataURL();
            self.formData.entries[idx].parafImg = dataUrl;
            self.formData.entries[idx].ttd = dataUrl;
            updateHeaderColor(idx);
            updatePrint();
          }
        };

        const start = (ev) => {
          drawing = true;
          const pos = getPos(ev);
          lastX = pos.x; lastY = pos.y;
          if (ev.type === 'touchstart') ev.preventDefault();
        };

        const move = (ev) => {
          if (!drawing) return;
          const pos = getPos(ev);
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(pos.x, pos.y);
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 5.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
          lastX = pos.x; lastY = pos.y;
          saveSig();
          if (ev.type === 'touchmove') ev.preventDefault();
        };

        const stop = () => {
          if (drawing) {
            drawing = false;
            saveSig();
          }
        };

        canvas.addEventListener("mousedown", start);
        canvas.addEventListener("mousemove", move);
        canvas.addEventListener("mouseup", stop);
        canvas.addEventListener("mouseleave", stop);
        canvas.addEventListener("touchstart", start, { passive: false });
        canvas.addEventListener("touchmove", move, { passive: false });
        canvas.addEventListener("touchend", stop);
      });

      root.querySelectorAll(".sig-clear-prmrj-btn").forEach((btn) => {
        btn.onclick = () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx) && self.formData.entries[idx]) {
            self.formData.entries[idx].parafImg = null;
            self.formData.entries[idx].ttd = null;
            const canvas = root.querySelector("#sig-gigi-" + idx);
            if (canvas) {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            updateHeaderColor(idx);
            updatePrint();
          }
        };
      });

      root.addEventListener("input", (ev) => {
        const target = ev.target;
        if (target.classList.contains("form-data-input")) {
          const idx = parseInt(target.getAttribute("data-idx"));
          const field = target.getAttribute("data-field");
          if (!isNaN(idx) && field && self.formData.entries[idx]) {
            self.formData.entries[idx][field] = target.value;
            if (field === "uraianKlinis") self.formData.entries[idx].keluhan = target.value;
            if (field === "rencanaPenting") self.formData.entries[idx].tindakan = target.value;
            if (field === "drSp") self.formData.entries[idx].parafName = target.value;
            if (field === "icd10" && !self.formData.entries[idx].diagnosis) {
              self.formData.entries[idx].diagnosis = target.value;
            }
            updateHeaderColor(idx);
            updatePrint();
          }
        }
      });

      root.querySelectorAll(".btn-input-obat").forEach((btn) => {
        btn.onclick = (ev) => {
          if (ev) ev.preventDefault();
          const idx = parseInt(btn.getAttribute("data-idx"));
          const entry = self.formData.entries ? self.formData.entries[idx] : null;
          self.navigateToFarmasi(entry?.noCheckin || self.noCheckin);
        };
      });

      const btnAdd = root.querySelector("#btn-add-gigi");
      if (btnAdd) {
        btnAdd.onclick = () => {
          const today = new Date();
          const tglDate = today.toISOString().split("T")[0];
          const tglTime = today.toTimeString().split(" ")[0].substring(0, 5);
          self.formData.entries.push({
            noCheckin: self.noCheckin,
            tglDate,
            tglTime,
            drSp: dpjp,
            parafName: dpjp,
            uraianKlinis: "",
            keluhan: "",
            diagnosis: "",
            icd10: "",
            rencanaPenting: "",
            tindakan: "",
            icd9: "",
            ket: "",
            parafImg: null,
            ttd: null
          });
          self.renderView();
          const newIdx = self.formData.entries.length - 1;
          self.fetchAndPopulateObat(newIdx, false, false);
        };
      }

      root.querySelectorAll(".btn-remove-entry").forEach((btn) => {
        btn.onclick = () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx)) {
            self.formData.entries.splice(idx, 1);
            self.renderView();
          }
        };
      });

      const btnSave = root.querySelector("#btn-save-poli-gigi");
      if (btnSave) {
        btnSave.onclick = () => {
          self.handleSave();
        };
      }

      const printTab = root.querySelector("#poli-gigi-print-tab");
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }
      updatePrint();
    }

    static getPrintHtml(patient, formData) {
      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => { if (!str || str.length <= maxLen) return defaultSize; return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(1); };
      const p = patient || {};
      const noMr = p.noMr || p.norm || '';
      const nama = p.nama || '';
      const tglLahir = p.tglLahir || '';
      const kelamin = p.kelamin || '';
      const fd = formData || {};
      const isFilled = (e) => {
        if (!e) return false;
        return !!(
          (e.uraianKlinis && e.uraianKlinis.trim()) ||
          (e.keluhan && e.keluhan.trim()) ||
          (e.icd10 && e.icd10.trim()) ||
          (e.diagnosis && e.diagnosis.trim()) ||
          (e.rencanaPenting && e.rencanaPenting.trim()) ||
          (e.tindakan && e.tindakan.trim()) ||
          (e.gigi && e.gigi.trim()) ||
          (e.parafImg || e.ttd)
        );
      };

      const rawEntries = fd.entries || [];
      const entries = (rawEntries.length > 1) 
        ? rawEntries.filter(e => isFilled(e)) 
        : rawEntries;
      const effectiveEntries = entries.length > 0 ? entries : rawEntries;

      const ROWS_PER_PAGE = 8;
      const chunks = [];
      if (effectiveEntries.length === 0) {
        chunks.push([]);
      } else {
        for (let i = 0; i < effectiveEntries.length; i += ROWS_PER_PAGE) {
          chunks.push(effectiveEntries.slice(i, i + ROWS_PER_PAGE));
        }
      }

      const totalPages = chunks.length;
      let pagesHtml = "";

      chunks.forEach((chunk, pageIdx) => {
        let rowsHtml = "";
        chunk.forEach((e, idx) => {
          const globalIdx = pageIdx * ROWS_PER_PAGE + idx + 1;
          const tglStr = (e.tglDate || e.tglKunjungan || '').trim();
          const jamStr = (e.tglTime || '').trim();
          const tglJamDisplay = (tglStr || jamStr) 
            ? (tglStr + (jamStr ? '<br>' + jamStr : '')) 
            : '-';

          let gigiDisplay = e.gigi || '';
          if (!gigiDisplay) {
            const ketText = (e.ket || '').trim();
            if (/^[1-4][1-8]$/.test(ketText) || /^\d{1,2}(?:\s*,\s*\d{1,2})*$/.test(ketText)) {
              gigiDisplay = ketText;
            } else {
              const allText = (e.uraianKlinis || '') + ' ' + (e.keluhan || '') + ' ' + (e.ket || '') + ' ' + (e.rencanaPenting || '');
              const m1 = allText.match(/(?:gigi|diagnosa|regio|elemen)\s*([1-4][1-8]|\d{1,2})/i);
              if (m1) {
                gigiDisplay = m1[1];
              } else {
                const m2 = allText.match(/\b([1-4][1-8])\b/);
                if (m2) gigiDisplay = m2[1];
              }
            }
          }

          const keluhanDiag = e.uraianKlinis || e.keluhan || '-';
          const pengobatanTindakan = e.rencanaPenting || e.tindakan || '-';
          const kodeIcd10 = e.icd10 || e.diagnosis || '-';
          const parafImgSrc = e.ttd || e.parafImg;
          let drName = (e.drSp || e.parafName || '').trim();
          if (drName.includes('\n')) {
            const parts = drName.split('\n').map(s => s.trim()).filter(Boolean);
            const titled = parts.find(p => /drg|dr|sp\./i.test(p));
            drName = titled || parts[0];
          }

          rowsHtml += '<tr>' +
              '<td style="text-align:center; padding: 6px 4px;">' + globalIdx + '</td>' +
              '<td style="text-align:center; padding: 6px 4px; font-size:10px;">' + tglJamDisplay + '</td>' +
              '<td style="text-align:center; padding: 6px 4px;">' + (gigiDisplay || '-') + '</td>' +
              '<td style="white-space:pre-wrap; padding: 6px 6px;">' + keluhanDiag + '</td>' +
              '<td style="white-space:pre-wrap; padding: 6px 6px;">' + pengobatanTindakan + '</td>' +
              '<td style="text-align:center; padding: 6px 4px;">' + kodeIcd10 + '</td>' +
              '<td style="text-align:center; vertical-align:middle; padding: 4px 2px;">' +
                  (parafImgSrc ? '<img src="' + parafImgSrc + '" style="height:50px; max-height:55px; max-width:95%; object-fit:contain; display:block; margin:2px auto;">' : '') +
                  (drName ? '<div style="font-weight:bold; font-size:10.5px; margin-top:2px;">' + drName + '</div>' : '') +
              '</td>' +
          '</tr>';
        });

        rowsHtml += '<tr style="height:100%;">' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
        '</tr>';

        const titleText = totalPages > 1
          ? 'PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLI GIGI - LEMBAR ' + (pageIdx + 1) + ' DARI ' + totalPages
          : 'PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLI GIGI';

        pagesHtml += '<div class="surat-document" style="display:flex; flex-direction:column; height:1247px; page-break-after:always;">' +
            hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize, titleText) +
            '<div style="border:2px solid black; font-family:\'Times New Roman\',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0; margin-top:10px;">' +
                '<table class="gigi-table" style="border:none; border-top:1px solid black; flex:1;">' +
                  '<colgroup>' +
                      '<col style="width:4%">' +
                      '<col style="width:11%">' +
                      '<col style="width:10%">' +
                      '<col style="width:28%">' +
                      '<col style="width:26%">' +
                      '<col style="width:8%">' +
                      '<col style="width:13%">' +
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
      });

      return pagesHtml;
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
      const printContainer = document.getElementById("poli-gigi-print-container");
      if (!printContainer) return;
      printContainer.innerHTML = t.getPrintHtml(this.patient || { noMr, nama, tglLahir, kelamin, dpjp }, this.formData);
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
