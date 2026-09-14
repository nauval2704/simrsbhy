import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import { getStandardGridCSS, createSuratShell, createAutoPageSurat, bindSuratPrintButton, hospitalHeaderDiv, buildSuratPdfFilename } from "./chunk-SURAT-LAYOUT.js";

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
      this.idPrmrjParam = (new URLSearchParams(window.location.search)).get("idprmrj") || "";
      this.noCheckin = this.resolveNoCheckin();
    }

    resolveNoCheckin() {
      const params = new URLSearchParams(window.location.search);
      const candidates = [
        params.get("nocheckin"),
        params.get("noCheckin"),
        params.get("checkin"),
        document.getElementById("spd-noCheckin")?.textContent,
        document.body?.dataset?.noCheckin,
        document.body?.getAttribute?.("data-no-checkin"),
      ];

      for (const value of candidates) {
        const normalized = (value || "").toString().trim();
        if (!normalized) continue;
        try {
          const decoded = decodeURIComponent(normalized);
          if (decoded.trim()) return decoded.trim();
        } catch (error) {
          if (normalized) return normalized;
        }
      }

      const path = window.location.pathname || "";
      const pathParts = path.split("/").filter(Boolean);
      const namedIndex = pathParts.findIndex((part) => ["nocheckin", "nocheckin", "checkin"].includes(String(part).toLowerCase()));
      if (namedIndex >= 0 && pathParts[namedIndex + 1]) {
        return decodeURIComponent(pathParts[namedIndex + 1]);
      }

      const lastPart = pathParts[pathParts.length - 1] || "";
      if (lastPart && /^\d{2,}$/.test(lastPart)) {
        return decodeURIComponent(lastPart);
      }

      return "";
    }

    makeEntryId(index = 0) {
      const rand = (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : "prmrj-" + Date.now() + "-" + index + "-" + Math.random().toString(16).slice(2);
      return rand;
    }

    ensureEntryIds() {
      if (!Array.isArray(this.formData.entries)) {
        this.formData.entries = [];
      }

      this.formData.entries.forEach((entry, index) => {
        if (!entry || typeof entry !== "object") return;
        if (!entry.id) {
          entry.id = this.makeEntryId(index);
        }
      });
    }

    ngOnInit() {
      this.fetchPatient();
      window.addEventListener('pageshow', () => {
        this.fetchObatData();
      });
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
      const lookupKey = this.patient?.noMr || this.noCheckin;
      this.http.get(i.apiUrl + "/simrsba/prmrj/" + lookupKey).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.prmrjData = res.data;
            if (res.data.formData && res.data.formData.entries) {
              this.formData = Object.assign({ entries: [] }, res.data.formData);
            } else if (res.data.entries) {
              this.formData.entries = res.data.entries;
            }
          }
          this.ensureEntryIds();
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
              id: this.makeEntryId(0),
              noCheckin: this.noCheckin,
              tglDate: tglMasukStr || todayDateStr,
              tglTime: todayTimeStr,
              drSp: dpjp,
              uraianKlinis: pkData.keluhanUtama || "",
              diagnosis: pkData.diagnosisKerja || "",
              rencanaPenting: pkData.tindakanTerapi || "",
              icd10: "",
              ket: "",
              parafImg: null
            }];
          } else {
            const hasCurrentCheckin = this.formData.entries.some(e => e.noCheckin === this.noCheckin);
            const hasSameDayAndDoctor = this.formData.entries.some(e => e.tglDate === (tglMasukStr || todayDateStr) && e.drSp === dpjp);

            if (!hasCurrentCheckin && !hasSameDayAndDoctor) {
              this.formData.entries.push({
                id: this.makeEntryId(this.formData.entries.length),
                noCheckin: this.noCheckin,
                tglDate: tglMasukStr || todayDateStr,
                tglTime: todayTimeStr,
                drSp: dpjp,
                uraianKlinis: pkData.keluhanUtama || "",
                diagnosis: pkData.diagnosisKerja || "",
                rencanaPenting: pkData.tindakanTerapi || "",
                icd10: "",
                ket: "",
                parafImg: null
              });
            } else if (hasCurrentCheckin) {
              const currentEntry = this.formData.entries.find(e => e.noCheckin === this.noCheckin);
              if (currentEntry) {
                if (!currentEntry.drSp && dpjp) currentEntry.drSp = dpjp;
                if (!currentEntry.diagnosis && pkData.diagnosisKerja) currentEntry.diagnosis = pkData.diagnosisKerja;
                if (!currentEntry.uraianKlinis && pkData.keluhanUtama) currentEntry.uraianKlinis = pkData.keluhanUtama;
                if (!currentEntry.rencanaPenting && pkData.tindakanTerapi) currentEntry.rencanaPenting = pkData.tindakanTerapi;
              }
            }
          }
          this.loading = false;
          this.renderView();
          this.fetchObatData();
        },
        error: () => {
          this.loading = false;
          this.renderView();
          this.fetchObatData();
        }
      });
    }

    fetchObatData() {
      const rawIdPrmrj = (this.idPrmrjParam || (new URLSearchParams(window.location.search)).get("idprmrj") || "").trim();
      const payload = { noCheckin: this.noCheckin };
      if (rawIdPrmrj) payload.idPrmrj = rawIdPrmrj;

      this.http.post(i.apiUrl + "/farmasi/resep", payload).subscribe({
        next: (res) => {
          const resepData = Array.isArray(res?.data) ? res.data : [];
          if (!Array.isArray(this.formData.entries) || this.formData.entries.length === 0) {
            return;
          }

          const buildObatText = (items) => {
            if (!Array.isArray(items) || items.length === 0) return "";
            const obatMap = new Map();
            items.forEach((obat) => {
              const nama = String(obat?.nama || obat?.namaobat || "").trim();
              const satuan = String(obat?.satuan || "").trim();
              const jumlah = Number(obat?.jumlah || obat?.qty || 0) || 0;
              if (!nama) return;

              const key = `${nama.toLowerCase()}|${satuan.toLowerCase()}`;
              const existing = obatMap.get(key) || { nama, satuan, jumlah: 0 };
              existing.jumlah += jumlah;
              obatMap.set(key, existing);
            });

            if (obatMap.size === 0) return "";

            return Array.from(obatMap.values())
              .map((item) => {
                const jumlahText = item.jumlah > 0 ? ` (${item.jumlah}${item.satuan ? " " + item.satuan : ""})` : "";
                return "- " + item.nama + jumlahText;
              })
              .join("\n");
          };

          const resepByIdPrmrj = new Map();
          resepData.forEach((resep) => {
            const ids = new Set();
            const topLevelId = String(resep?.idPrmrj || "").trim();
            if (topLevelId) ids.add(topLevelId);

            (Array.isArray(resep?.obat) ? resep.obat : []).forEach((obat) => {
              const itemId = String(obat?.idPrmrj || "").trim();
              if (itemId) ids.add(itemId);
            });

            ids.forEach((idPrmrj) => {
              const items = Array.isArray(resep?.obat) ? resep.obat : [];
              const currentList = resepByIdPrmrj.get(idPrmrj) || [];
              resepByIdPrmrj.set(idPrmrj, currentList.concat(items));
            });
          });

          this.formData.entries.forEach((entry) => {
            const entryId = String(entry?.id || "").trim();
            let obatText = "";

            if (entryId && resepByIdPrmrj.has(entryId)) {
              obatText = buildObatText(resepByIdPrmrj.get(entryId));
            }

            if (!obatText && !rawIdPrmrj && entry === this.formData.entries[this.formData.entries.length - 1]) {
              const fallbackItems = resepData.flatMap((resep) => Array.isArray(resep?.obat) ? resep.obat : []);
              obatText = buildObatText(fallbackItems);
            }

            if (!obatText) return;

            const nonObatText = String(entry.rencanaPenting || "")
              .split(/\n/)
              .filter((line) => !line.trim().startsWith("- "))
              .join("\n")
              .trim();

            entry.rencanaPenting = nonObatText ? (nonObatText + "\n" + obatText) : obatText;
          });

          this.renderView();
        },
        error: () => {
          // silently fail if obat data cannot be loaded
        }
      });
    }

    syncEntriesFromDOM() {
      const root = document.querySelector("app-prmrj-placeholder");
      if (!root) return;
      root.querySelectorAll(".form-data-input").forEach((input) => {
        const entryId = input.dataset.entryId;
        const field = input.dataset.field;
        const entry = this.formData.entries.find((item) => item.id === entryId);
        if (entryId && field && entry) {
          entry[field] = input.value;
        } else {
          const idx = parseInt(input.dataset.idx);
          if (!isNaN(idx) && field && this.formData.entries[idx]) {
            this.formData.entries[idx][field] = input.value;
          }
        }
      });
    }

    handleSave() {
      this.saving = true;
      const btn = document.getElementById("btn-save-prmrj");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncEntriesFromDOM();

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

    renderHistoryObatSidebar() {
      const root = document.querySelector("app-prmrj-placeholder");
      const target = root ? root.querySelector("#prmrj-history-obat-sidebar") : null;
      if (!target) return;

      target.innerHTML = `
        <div style="display: flex; justify-content: flex-end; min-height: 220px; width: 100%; height: 100%;">
          <div id="prmrj-history-obat-panel" style="display: flex; align-items: stretch; width: 52px; min-width: 52px; max-width: 332px; overflow: hidden; transition: width 0.28s ease; border:1px solid #dee2e6; border-radius:10px; background:#fff; box-shadow:0 6px 18px rgba(0,0,0,.08); height: 100%;">
            <button type="button" id="prmrj-history-obat-toggle" class="btn btn-light border-0 rounded-0 d-flex align-items-center justify-content-center" style="width:52px; min-width:52px; height:100%; min-height:220px; writing-mode: vertical-rl; transform: rotate(180deg); font-size:12px; font-weight:700; letter-spacing:0.1px; color:#212529; flex-shrink:0;">
              <span><i class="bi bi-clock-history me-2"></i>History Obat</span>
            </button>
            <div id="prmrj-history-obat-content" style="display:none; width: 280px; min-width: 280px; max-width: calc(100vw - 120px); background:#fff; border-left:1px solid #dee2e6; box-shadow: inset 0 0 0 1px rgba(222,226,230,0.2); overflow:hidden; height: 100%;">
              <div class="d-flex flex-column" style="height: 100%; overflow: hidden; background:#fff; color:#212529;">
                <div class="small fw-bold px-2 py-2 mb-0" style="background: linear-gradient(180deg, #0f5f3b 0%, #0d4d32 100%); color:#fff; border-bottom: 1px solid rgba(255,255,255,0.12);">History Pemakaian Obat Pasien</div>
                <div class="px-2 pt-2 pb-1" style="background:#fff;">
                  <input type="text" id="prmrj-history-obat-search" class="form-control form-control-sm" placeholder="Cari nama obat..." style="font-size:12px; border:1px solid #d0d7de; background:#fff; color:#212529;">
                </div>
                <div class="history-obat-list px-2 pb-2" style="flex:1; overflow-y:auto; min-height:0; background:#fff;">Memuat data...</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const panel = target.querySelector('#prmrj-history-obat-panel');
      const content = target.querySelector('#prmrj-history-obat-content');
      const toggle = target.querySelector('#prmrj-history-obat-toggle');

      toggle.addEventListener('click', () => {
        const isOpen = panel.style.width !== '52px';
        panel.style.width = isOpen ? '52px' : '332px';
        content.style.display = isOpen ? 'none' : 'block';
        content.style.width = isOpen ? '0px' : '280px';
        content.style.minWidth = isOpen ? '0px' : '280px';
      });

      const listEl = target.querySelector(".history-obat-list");
      const searchInput = target.querySelector('#prmrj-history-obat-search');
      const patientNorm = this.patient?.noMr || this.patient?.norm || this.noCheckin || "";
      let allObatItems = [];
      const pageSize = 5;
      let currentPage = 1;

      const normalizeRencanaList = (rawText = '') => {
        return String(rawText || '')
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => (line.startsWith('- ') ? line : `- ${line}`));
      };

      const syncCopiedRencanaList = (entryId, rawText) => {
        const listRoot = document.querySelector(`.rencana-penting-items[data-entry-id="${CSS.escape(String(entryId || ''))}"]`);
        if (!listRoot) return;

        const items = normalizeRencanaList(rawText).filter((line) => line.startsWith('- '));

        if (!items.length) {
          listRoot.innerHTML = '';
          listRoot.style.display = 'none';
          return;
        }

        listRoot.style.display = 'block';
        listRoot.innerHTML = items
          .map((line, idx) => {
            const lineText = line.replace(/^-\s*/, '').trim();
            return ` 
            `;
          })
          .join('');

        listRoot.querySelectorAll('.remove-rencana-item').forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            const targetEntryId = button.getAttribute('data-entry-id');
            const itemIndex = Number(button.getAttribute('data-item-index'));
            const targetEntry = this.formData.entries.find((item) => item.id === targetEntryId);
            if (!targetEntry) return;

            const allLines = String(targetEntry.rencanaPenting || '')
              .split(/\n/)
              .map((line) => line.trim())
              .filter(Boolean);

            const filteredItems = allLines.filter((_, idx) => idx !== itemIndex);
            targetEntry.rencanaPenting = filteredItems.join('\n');

            const textarea = document.querySelector(`textarea.form-data-input[data-field="rencanaPenting"][data-entry-id="${CSS.escape(String(targetEntryId || ''))}"]`);
            if (textarea) {
              textarea.value = targetEntry.rencanaPenting;
            }

            syncCopiedRencanaList(targetEntryId, targetEntry.rencanaPenting);
          });
        });
      };

      const renderHistoryObatItems = (items) => {
        const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const startIndex = (currentPage - 1) * pageSize;
        const visibleItems = items.slice(startIndex, startIndex + pageSize);

        if (!items.length) {
          listEl.innerHTML = '<div class="text-muted small">Belum ada history obat pasien.</div>';
          return;
        }

        if (!visibleItems.length) {
          listEl.innerHTML = '<div class="text-muted small">Tidak ada data pada halaman ini.</div>';
          return;
        }

        listEl.innerHTML = `
          <div>
            ${visibleItems
              .map((item, idx) => {
                const realIndex = startIndex + idx + 1;
                const nama = String(item?.nama || item?.namaobat || "").trim() || "Obat";
                const satuan = String(item?.satuan || "").trim();
                const jumlah = Number(item?.jumlah || item?.qty || 0) || 0;
                const jenis = String(item?.jenis || item?.jenisObat || "").trim();
                const createdAt = item?.createdAt ? new Date(item.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "-";
                const text = `${nama}${jumlah ? ` (${jumlah}${satuan ? " " + satuan : ""})` : ""}${jenis ? ` • ${jenis}` : ""}`;
                return `
                  <div class="border rounded p-2 mb-2 bg-light d-flex align-items-start justify-content-between gap-2">
                    <div style="min-width:0; flex:1;">
                      <div class="fw-bold small text-secondary mb-1">${realIndex}. ${createdAt}</div>
                      <div style="word-break: break-word; font-size:12px; line-height:1.5;">
                        <div><strong>Obat:</strong> ${nama}</div>
                        <div><strong>Jumlah:</strong> ${jumlah || 0}${satuan ? ` ${satuan}` : ""}</div>
                        ${jenis ? `<div><strong>Jenis:</strong> ${jenis}</div>` : ""}
                      </div>
                    </div>
                    <button type="button" class="btn btn-sm px-2 py-1 copy-history-obat" data-copy-text="${String(text).replace(/"/g, '&quot;')}" data-obat-name="${String(nama).replace(/"/g, '&quot;')}" data-obat-jumlah="${String(jumlah || 0)}" data-obat-satuan="${String(satuan).replace(/"/g, '&quot;')}" title="Copy obat" aria-label="Copy obat" style="font-size:11px; line-height:1.2; white-space:nowrap; font-weight:700; color:#fff; background:#f28c28; border:1px solid #f28c28;">
                      Copy
                    </button>
                  </div>
                `;
              })
              .join("")}
          </div>
          <div class="d-flex justify-content-between align-items-center mt-2 pt-2 border-top small" style="gap:8px; color:#495057;">
            <button type="button" class="btn btn-sm btn-light border" data-page-action="prev" ${currentPage === 1 ? 'disabled' : ''} style="font-size:11px; padding:4px 8px;">Prev</button>
            <span style="font-weight:600; color:#0d4d32; white-space:nowrap;">${pageSize} / halaman</span>
            <span style="font-weight:600; color:#0d4d32; white-space:nowrap;">Hal ${currentPage} / ${totalPages}</span>
            <button type="button" class="btn btn-sm btn-light border" data-page-action="next" ${currentPage >= totalPages ? 'disabled' : ''} style="font-size:11px; padding:4px 8px;">Next</button>
          </div>
        `;

        const pageButtons = listEl.querySelectorAll('[data-page-action]');
        pageButtons.forEach((button) => {
          button.addEventListener('click', () => {
            const action = button.getAttribute('data-page-action');
            if (action === 'prev') currentPage = Math.max(1, currentPage - 1);
            if (action === 'next') currentPage = Math.min(totalPages, currentPage + 1);
            renderHistoryObatItems(items);
          });
        });

        const copyButtons = listEl.querySelectorAll('.copy-history-obat');
        copyButtons.forEach((button) => {
          button.addEventListener('click', async () => {
            const text = button.getAttribute('data-copy-text') || '';
            const obatName = button.getAttribute('data-obat-name') || '';
            const obatJumlah = button.getAttribute('data-obat-jumlah') || '0';
            const obatSatuan = button.getAttribute('data-obat-satuan') || '';
            const jumlahValue = Number(obatJumlah) || 0;
            const listItem = `- ${obatName}${jumlahValue > 0 ? ` (${jumlahValue}${obatSatuan ? ` ${obatSatuan}` : ''})` : ''}`;

            const pickTargetEntry = () => {
              const openCollapse = document.querySelector('#prmrj-entries-accordion .accordion-collapse.show');
              if (openCollapse) {
                const collapseId = openCollapse.getAttribute('id') || '';
                const match = collapseId.match(/collapse_prmrj_entry_(.+)$/);
                if (match) {
                  const entryId = decodeURIComponent(match[1]);
                  const entry = this.formData.entries.find((item) => item.id === entryId);
                  if (entry) return entry;
                }
              }

              if (this.formData.entries && this.formData.entries.length) {
                return this.formData.entries[this.formData.entries.length - 1];
              }

              return null;
            };

            const targetEntry = pickTargetEntry();
            if (targetEntry) {
              const existingText = String(targetEntry.rencanaPenting || '').trim();
              const existingLines = existingText
                ? existingText.split(/\n/).map((line) => line.trim()).filter(Boolean)
                : [];

              const alreadyExists = existingLines.some((line) => {
                const clean = (line.startsWith('- ') ? line.replace(/^\-\s*/, '').trim() : line.trim()).toLowerCase();
                return clean.includes(obatName.trim().toLowerCase());
              });

              if (!alreadyExists) {
                const finalLines = [...existingLines, listItem];
                const finalValue = finalLines.map((line) => (line.startsWith('- ') ? line : `- ${line}`)).join('\n');
                targetEntry.rencanaPenting = finalValue;

                const matchingInput = document.querySelector(
                  `textarea.form-data-input[data-field="rencanaPenting"][data-entry-id="${CSS.escape(String(targetEntry.id || ''))}"]`
                ) || document.querySelector(
                  `textarea.form-data-input[data-field="rencanaPenting"][data-idx="${this.formData.entries.indexOf(targetEntry)}"]`
                );

                if (matchingInput) {
                  matchingInput.value = finalValue;
                }

                syncCopiedRencanaList(targetEntry.id, finalValue);
              }
            }

            try {
              await navigator.clipboard.writeText(text);
              const oldText = button.textContent;
              button.textContent = 'Copied';
              button.style.background = '#1f8f4b';
              button.style.borderColor = '#1f8f4b';
              setTimeout(() => {
                button.textContent = oldText;
                button.style.background = '#f28c28';
                button.style.borderColor = '#f28c28';
              }, 900);
            } catch (error) {
              button.title = ' copy';
              button.textContent = 'Copied';
              button.style.background = '#1f8f4b';
              button.style.borderColor = '#1f8f4b';
              setTimeout(() => {
                button.textContent = 'Copy';
                button.style.background = '#f28c28';
                button.style.borderColor = '#f28c28';
              }, 900);
            }
          });
        });
      };

      const applyHistorySearch = () => {
        const keyword = (searchInput?.value || '').trim().toLowerCase();
        currentPage = 1;
        if (!keyword) {
          renderHistoryObatItems(allObatItems);
          return;
        }

        const filtered = allObatItems.filter((item) => {
          const nama = String(item?.nama || item?.namaobat || '').trim().toLowerCase();
          return nama.includes(keyword);
        });

        renderHistoryObatItems(filtered);
      };

      searchInput?.addEventListener('input', applyHistorySearch);

      this.http.post(i.apiUrl + "/farmasi/resep", { norm: patientNorm, noCheckin: this.noCheckin }).subscribe({
        next: (res) => {
          const resepList = Array.isArray(res?.data) ? res.data : [];
          allObatItems = resepList
            .filter((resep) => Array.isArray(resep?.obat))
            .flatMap((resep) =>
              resep.obat.map((item) => ({
                ...item,
                createdAt: resep.createdAt || null,
              }))
            )
            .sort((a, b) => {
              const dateA = new Date(a.createdAt || 0).getTime();
              const dateB = new Date(b.createdAt || 0).getTime();
              return dateB - dateA;
            });

          renderHistoryObatItems(allObatItems);
        },
        error: () => {
          listEl.innerHTML = '<div class="text-danger small">Gagal memuat history obat pasien.</div>';
        }
      });
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
      const currenturl = window.location.href;
      if (!this.formData.entries) this.formData.entries = [];

      const updateRencanaPentingList = (entryId) => {
        const entry = self.formData.entries.find((item) => item.id === entryId);
        const listRoot = root.querySelector(`.rencana-penting-items[data-entry-id="${entryId}"]`);
        if (!listRoot || !entry) return;

        const lines = String(entry.rencanaPenting || '')
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .filter((line) => line.startsWith('- '));

        if (!lines.length) {
          listRoot.innerHTML = '';
          listRoot.style.display = 'none';
          return;
        }

        listRoot.style.display = 'block';
        listRoot.innerHTML = lines
          .map((line, idx) => `
            
          `)
          .join('');

        listRoot.querySelectorAll('.remove-rencana-item').forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            const targetEntryId = button.getAttribute('data-entry-id');
            const itemIndex = Number(button.getAttribute('data-item-index'));
            const targetEntry = self.formData.entries.find((item) => item.id === targetEntryId);
            if (!targetEntry) return;

            const items = String(targetEntry.rencanaPenting || '')
              .split(/\n/)
              .map((line) => line.trim())
              .filter(Boolean);

            const filteredItems = items.filter((_, idx) => idx !== itemIndex);
            targetEntry.rencanaPenting = filteredItems.join('\n');

            const textarea = root.querySelector(`textarea.form-data-input[data-field="rencanaPenting"][data-entry-id="${targetEntryId}"]`);
            if (textarea) {
              textarea.value = targetEntry.rencanaPenting;
            }

            updateRencanaPentingList(targetEntryId);
          });
        });
      };

      let entriesHtml = "";
      if (this.formData.entries.length > 0) {
        const totalEntries = this.formData.entries.length;
        this.formData.entries.forEach((e, idx) => {
          const entryId = e.id || this.makeEntryId(idx);
          e.id = entryId;
          const isLast = idx === totalEntries - 1;
          const entryClass = isLast ? '' : 'prmrj-old-entry';
          const btnClass = isLast ? 'accordion-button py-2 prmrj-entry-btn' : 'accordion-button py-2 prmrj-entry-btn collapsed';
          const expanded = isLast ? 'true' : 'false';
          const collapseClass = isLast ? 'accordion-collapse collapse show' : 'accordion-collapse collapse';
          entriesHtml += `
          <div class="accordion-item mb-2 border rounded ${entryClass}">
            <h2 class="accordion-header" id="heading_prmrj_entry_${entryId}">
              <button class="${btnClass}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_prmrj_entry_${entryId}" data-bs-parent="#prmrj-entries-accordion" aria-expanded="${expanded}" aria-controls="collapse_prmrj_entry_${entryId}">
                <span class="fw-bold d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">
                  <span><i class="bi bi-journal-text me-2 text-secondary"></i> Entri PRMRJ #${idx + 1}</span>
                </span>
              </button>
            </h2>
            <div id="collapse_prmrj_entry_${entryId}" class="${collapseClass}" data-bs-parent="#prmrj-entries-accordion" aria-labelledby="heading_prmrj_entry_${entryId}">
              <div class="accordion-body bg-white p-3" style="position:relative;">
                <div class="d-flex justify-content-between align-items-center mb-2" style="position:relative; z-index:2;">
                  <span class="small text-muted">Detail entri PRMRJ ke-${idx + 1}</span>
                  <button type="button" class="btn btn-sm btn-outline-danger btn-remove-entry" data-entry-id="${entryId}" data-idx="${idx}">
                    <i class="bi bi-trash me-1"></i>Hapus Baris
                  </button>
                </div>

                <div class="row g-2 mb-2">
                  <div class="col-md-3">
                    <label class="f-label">Tanggal Entry</label>
                    <input type="date" class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="tglDate" value="${e.tglDate || ''}">
                  </div>
                  <div class="col-md-3">
                    <label class="f-label">Jam Entry</label>
                    <input type="time" class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="tglTime" value="${e.tglTime || ''}">
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Dokter / Spesialis (DR.SP)</label>
                    <input type="text" class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="drSp" value="${e.drSp || dpjp}" placeholder="Nama Dokter / Spesialis...">
                  </div>
                </div>

                <div class="row g-2 mb-2">
                  <div class="col-md-4">
                    <label class="f-label">Uraian Klinis Penting</label>
                    <textarea class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="uraianKlinis" rows="2" placeholder="Uraian klinis penting...">${e.uraianKlinis || ''}</textarea>
                  </div>
                  <div class="col-md-8">
                    <label class="f-label">ICD 10 (Diagnosis)</label>
                    <div class="position-relative">
                      <input type="text" class="f-input form-data-input icd10-autocomplete-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="diagnosis" value="${e.diagnosis || ''}" placeholder="Ketik kode ICD-10 atau nama... (min. 3 karakter)">
                      <div class="icd10-dropdown" data-entry-id="${entryId}" data-idx="${idx}" style="display:none; position:absolute; z-index:1000; max-height:200px; overflow-y:auto; border:1px solid #ced4da; background:#fff; width:100%;"></div>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-1 gap-2 flex-wrap">
                      <label class="f-label mb-0">Rencana Penting</label>
                      <a href="poli/input/${noMr}/nocheckin/${encodeURIComponent(this.noCheckin)}/farmasi/${encodeURIComponent(this.noCheckin)}?idprmrj=${encodeURIComponent(entryId)}" class="btn btn-sm btn-outline-primary"><i class="bi bi-box-arrow-up-right me-1"></i>Input Obat / BMHP</a>
                    </div>
                    <textarea class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="rencanaPenting" rows="4" placeholder="Rencana penting...">${e.rencanaPenting || ''}</textarea>
                    <div class="rencana-penting-items mt-2" data-entry-id="${entryId}" style="display:none;"></div>
                  </div>
                </div>

                <div class="row g-2 mb-2">
                  <div class="col-md-12">
                    <label class="f-label">Kode ICD-9 (Autocomplete)</label>
                    <div class="position-relative">
                      <input type="text" class="f-input form-data-input icd9-autocomplete-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="icd9" value="${e.icd9 || ''}" placeholder="Ketik kode ICD-9 atau nama... (min. 3 karakter)">
                      <div class="icd9-dropdown" data-entry-id="${entryId}" data-idx="${idx}" style="display:none; position:absolute; z-index:1000; max-height:200px; overflow-y:auto; border:1px solid #ced4da; background:#fff; width:100%;"></div>
                    </div>
                  </div>
                </div>

                <div class="row g-2">
                  <div class="col-md-5">
                    <label class="f-label">Keterangan / Catatan</label>
                    <input type="text" class="f-input form-data-input" data-entry-id="${entryId}" data-idx="${idx}" data-field="ket" value="${e.ket || ''}" placeholder="Keterangan...">
                  </div>
                  <div class="col-md-7">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="f-label mb-0"><i class="bi bi-pen me-1"></i>Paraf / TTD Signature Box</label>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-prmrj-btn" data-entry-id="${entryId}" data-idx="${idx}" style="font-size:10px; padding:1px 7px;"><i class="bi bi-eraser me-1"></i>Hapus TTD</button>
                    </div>
                    <div style="border:1px solid #ced4da; border-radius:6px; background:#fafafa; overflow:hidden; max-width:380px;">
                      <canvas id="sig-prmrj-${entryId}" class="prmrj-sig-canvas" data-entry-id="${entryId}" data-idx="${idx}" width="400" height="180" style="display:block; width:100%; height:130px; cursor:crosshair; touch-action:none;"></canvas>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>`;
        });
      } else {
        entriesHtml = `<div class="alert alert-info py-2 text-center my-2" style="font-size:13px;">Belum ada entri PRMRJ. Silakan klik "+ Tambah Baris PRMRJ" untuk memulai.</div>`;
      }

      this.ensureEntryIds();

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

      <div style="display:flex; align-items:flex-start; gap: 12px; width:100%; min-width:0;">
        <div style="flex: 1 1 auto; min-width:0;">
          <div class="accordion mb-3" id="accordionPrmrj">
            <div class="accordion-item mb-2 border rounded">
              <h2 class="accordion-header" id="heading_prmrj_1">
                <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_prmrj_1" aria-expanded="true" aria-controls="collapse_prmrj_1">
                  <span class="fw-bold text-dark d-flex align-items-center justify-content-between w-100 me-3" style="font-size:13px;">
                    <span><i class="bi bi-journal-text me-2 text-secondary"></i> 1. Entri Profil Ringkas Rawat Jalan (PRMRJ)</span>
                  </span>
                </button>
              </h2>
              <div id="collapse_prmrj_1" class="accordion-collapse collapse show" aria-labelledby="heading_prmrj_1">
                <div class="accordion-body bg-white p-3">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small text-muted">Daftar riwayat profil ringkas rawat jalan pasien</span>
                    <button type="button" class="btn btn-sm btn-primary" id="btn-add-prmrj"><i class="bi bi-plus-lg me-1"></i>Tambah Baris PRMRJ</button>
                  </div>
                  <div id="prmrj-entries-accordion" class="accordion">
                    <div id="prmrj-entries-container" class="accordion">
                      ${entriesHtml}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="flex: 0 0 auto; min-width: 52px; max-width: 332px;">
          <div id="prmrj-history-obat-sidebar"></div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
        <button type="button" class="btn btn-outline-success surat-download-pdf-btn px-3"><i class="bi bi-file-earmark-pdf-fill me-1"></i>Simpan sebagai PDF</button>
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
#accordionPrmrj .prmrj-old-entry .prmrj-entry-btn { background-color: #dc3545 !important; color: #ffffff !important; }
#accordionPrmrj .prmrj-old-entry .prmrj-entry-btn.collapsed { background-color: #dc3545 !important; color: #ffffff !important; }
#accordionPrmrj .prmrj-old-entry .prmrj-entry-btn:not(.collapsed) { background-color: #dc3545 !important; color: #ffffff !important; }
#accordionPrmrj .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
.prmrj-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; flex: 1; height: 100%; table-layout: fixed; }
.prmrj-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }
.prmrj-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }
.prmrj-table tbody td:first-child { border-left: none !important; }
.prmrj-table tbody td:last-child { border-right: none !important; }
.prmrj-table tbody tr:last-child td { border-bottom: none !important; }`,
        inputContent,
      });

      this.renderHistoryObatSidebar();

      bindSuratPrintButton(root, {
        getFilename: () => buildSuratPdfFilename('PRMRJ', this.patient?.noMr || this.patient?.norm, this.patient?.nama)
      });

      function trimPrmrjCanvas(c) {
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

      root.querySelectorAll(".prmrj-sig-canvas").forEach((canvas) => {
        const entryId = canvas.getAttribute("data-entry-id");
        const idx = parseInt(canvas.getAttribute("data-idx"));
        const entry = self.formData.entries.find((item) => item.id === entryId) || self.formData.entries[idx];
        if (!entry) return;
        const ctx = canvas.getContext("2d");
        if (entry.parafImg) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const trimmed = trimPrmrjCanvas(canvas);
            if (trimmed) entry.parafImg = trimmed;
          };
          img.src = entry.parafImg;
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
          const entry = self.formData.entries.find((item) => item.id === entryId) || self.formData.entries[idx];
          if (entry) {
            const trimmed = trimPrmrjCanvas(canvas);
            entry.parafImg = trimmed || canvas.toDataURL();
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
          const entryId = btn.getAttribute("data-entry-id");
          const idx = parseInt(btn.getAttribute("data-idx"));
          const entry = self.formData.entries.find((item) => item.id === entryId) || self.formData.entries[idx];
          if (entry) {
            entry.parafImg = null;
            const canvas = root.querySelector("#sig-prmrj-" + encodeURIComponent(entryId));
            if (canvas) {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        };
      });

      root.addEventListener("input", (ev) => {
        const target = ev.target;
        if (target.classList.contains("form-data-input")) {
          const entryId = target.getAttribute("data-entry-id");
          const field = target.getAttribute("data-field");
          const entry = self.formData.entries.find((item) => item.id === entryId);
          if (field && entry) {
            entry[field] = target.value;
            if (field === 'rencanaPenting') {
              updateRencanaPentingList(entryId);
            }
            return;
          }
          const idx = parseInt(target.getAttribute("data-idx"));
          if (!isNaN(idx) && field && self.formData.entries[idx]) {
            self.formData.entries[idx][field] = target.value;
            if (field === 'rencanaPenting') {
              updateRencanaPentingList(self.formData.entries[idx].id || entryId);
            }
          }
        }
      });

      // ICD-10 Autocomplete functionality
      let icd10SearchTimeout = null;
      root.querySelectorAll(".icd10-autocomplete-input").forEach((input) => {
        input.addEventListener("keyup", (ev) => {
          const target = ev.target;
          const idx = parseInt(target.getAttribute("data-idx"));
          const searchTerm = target.value.trim();
          const dropdown = root.querySelector(".icd10-dropdown[data-idx='" + idx + "']");
          if (!dropdown) return;

          clearTimeout(icd10SearchTimeout);
          if (searchTerm.length < 3) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
          }

          icd10SearchTimeout = setTimeout(() => {
            self.http.get(i.apiUrl + "/vclaim/api/icd10/" + encodeURIComponent(searchTerm)).subscribe({
              next: (res) => {
                let results = [];
                if (res && res.icd10) {
                  results = res.icd10;
                } else if (res && res.data && res.data.icd10) {
                  results = res.data.icd10;
                } else if (res && res.data && Array.isArray(res.data)) {
                  results = res.data;
                } else if (res && res.result && Array.isArray(res.result)) {
                  results = res.result;
                } else if (res && Array.isArray(res)) {
                  results = res;
                }
                if (results.length > 0) {
                  let html = "";
                  results.forEach((item) => {
                    const kode = item.kode || item.code || item.id || "";
                    const nama = item.nama || item.name || item.deskripsi || item.description || item.ket || item.keterangan || item.text || item.label || "";
                    html += '<div class="icd10-result-item" data-idx="' + idx + '" data-kode="' + kode + '" data-nama="' + nama + '" style="padding:6px 10px; cursor:pointer; border-bottom:1px solid #eee;" onmouseover="this.style.backgroundColor=\'#f0f8ff\'" onmouseout="this.style.backgroundColor=\'\'">' +
                      '<div style="font-weight:bold; font-size:12px;">' + kode + '</div>' +
                      '<div style="font-size:11px; color:#555;">' + nama + '</div>' +
                      '</div>';
                  });
                  dropdown.innerHTML = html;
                  dropdown.style.display = "block";

                  dropdown.querySelectorAll(".icd10-result-item").forEach((item) => {
                    item.addEventListener("click", () => {
                      const kode = item.getAttribute("data-kode");
                      const nama = item.getAttribute("data-nama");
                      const displayText = kode + " - " + nama;
                      target.value = displayText;
                      if (self.formData.entries[idx]) {
                        const field = target.getAttribute("data-field") || "icd10";
                        self.formData.entries[idx][field] = displayText;
                      }
                      dropdown.style.display = "none";
                      dropdown.innerHTML = "";
                    });
                  });
                } else {
                  dropdown.innerHTML = '<div style="padding:6px 10px; font-size:12px; color:#999;">Tidak ditemukan</div>';
                  dropdown.style.display = "block";
                }
              },
              error: () => {
                dropdown.innerHTML = '<div style="padding:6px 10px; font-size:12px; color:#999;">Gagal mencari</div>';
                dropdown.style.display = "block";
              }
            });
          }, 500);
        });

        input.addEventListener("blur", (ev) => {
          const idx = parseInt(ev.target.getAttribute("data-idx"));
          const dropdown = root.querySelector(".icd10-dropdown[data-idx='" + idx + "']");
          if (dropdown) {
            setTimeout(() => {
              dropdown.style.display = "none";
              dropdown.innerHTML = "";
            }, 200);
          }
        });
      });

      // ICD-9 Autocomplete functionality
      let icd9SearchTimeout = null;
      root.querySelectorAll(".icd9-autocomplete-input").forEach((input) => {
        input.addEventListener("keyup", (ev) => {
          const target = ev.target;
          const idx = parseInt(target.getAttribute("data-idx"));
          const searchTerm = target.value.trim();
          const dropdown = root.querySelector(".icd9-dropdown[data-idx='" + idx + "']");
          if (!dropdown) return;

          clearTimeout(icd9SearchTimeout);
          if (searchTerm.length < 3) {
            dropdown.style.display = "none";
            dropdown.innerHTML = "";
            return;
          }

          icd9SearchTimeout = setTimeout(() => {
            self.http.get(i.apiUrl + "/vclaim/api/icd9/" + encodeURIComponent(searchTerm)).subscribe({
              next: (res) => {
                let results = [];
                if (res && res.icd9) {
                  results = res.icd9;
                } else if (res && res.data && res.data.icd9) {
                  results = res.data.icd9;
                } else if (res && res.data && Array.isArray(res.data)) {
                  results = res.data;
                } else if (res && res.result && Array.isArray(res.result)) {
                  results = res.result;
                } else if (res && Array.isArray(res)) {
                  results = res;
                }
                if (results.length > 0) {
                  let html = "";
                  results.forEach((item) => {
                    const kode = item.kode || item.code || item.id || "";
                    const nama = item.nama || item.name || item.deskripsi || item.description || item.ket || item.keterangan || item.text || item.label || "";
                    html += '<div class="icd9-result-item" data-idx="' + idx + '" data-kode="' + kode + '" data-nama="' + nama + '" style="padding:6px 10px; cursor:pointer; border-bottom:1px solid #eee;" onmouseover="this.style.backgroundColor=\'#f0f8ff\'" onmouseout="this.style.backgroundColor=\'\'">' +
                      '<div style="font-weight:bold; font-size:12px;">' + kode + '</div>' +
                      '<div style="font-size:11px; color:#555;">' + nama + '</div>' +
                      '</div>';
                  });
                  dropdown.innerHTML = html;
                  dropdown.style.display = "block";

                  dropdown.querySelectorAll(".icd9-result-item").forEach((item) => {
                    item.addEventListener("click", () => {
                      const kode = item.getAttribute("data-kode");
                      const nama = item.getAttribute("data-nama");
                      const displayText = kode + " - " + nama;
                      target.value = displayText;
                      if (self.formData.entries[idx]) {
                        const field = target.getAttribute("data-field") || "icd9";
                        self.formData.entries[idx][field] = displayText;
                      }
                      dropdown.style.display = "none";
                      dropdown.innerHTML = "";
                    });
                  });
                } else {
                  dropdown.innerHTML = '<div style="padding:6px 10px; font-size:12px; color:#999;">Tidak ditemukan</div>';
                  dropdown.style.display = "block";
                }
              },
              error: () => {
                dropdown.innerHTML = '<div style="padding:6px 10px; font-size:12px; color:#999;">Gagal mencari</div>';
                dropdown.style.display = "block";
              }
            });
          }, 500);
        });

        input.addEventListener("blur", (ev) => {
          const idx = parseInt(ev.target.getAttribute("data-idx"));
          const dropdown = root.querySelector(".icd9-dropdown[data-idx='" + idx + "']");
          if (dropdown) {
            setTimeout(() => {
              dropdown.style.display = "none";
              dropdown.innerHTML = "";
            }, 200);
          }
        });
      });

      const btnAdd = root.querySelector("#btn-add-prmrj");
      if (btnAdd) {
        btnAdd.onclick = () => {
          const today = new Date();
          const tglDate = today.toISOString().split("T")[0];
          const tglTime = today.toTimeString().split(" ")[0].substring(0, 5);
          self.formData.entries.push({
            id: self.makeEntryId(self.formData.entries.length),
            tglDate,
            tglTime,
            drSp: dpjp,
            uraianKlinis: "",
            diagnosis: "",
            rencanaPenting: "",
            icd10: "",
            ket: "",
            parafImg: null
          });
          self.renderView();
        };
      }

      root.querySelectorAll(".btn-remove-entry").forEach((btn) => {
        btn.onclick = (e) => {
          const entryId = btn.getAttribute("data-entry-id");
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (entryId) {
            self.formData.entries = self.formData.entries.filter((entry) => entry.id !== entryId);
            self.renderView();
            return;
          }
          if (!isNaN(idx)) {
            self.formData.entries.splice(idx, 1);
            self.renderView();
          }
        };
      });

      root.querySelectorAll('#prmrj-entries-container .prmrj-entry-btn').forEach((button) => {
        button.addEventListener('click', () => {
          const isExpanded = button.getAttribute('aria-expanded') === 'true';
          if (isExpanded) return;

          root.querySelectorAll('#prmrj-entries-container .prmrj-entry-btn').forEach((otherButton) => {
            if (otherButton !== button) {
              otherButton.setAttribute('aria-expanded', 'false');
              otherButton.classList.add('collapsed');
              const targetSelector = otherButton.getAttribute('data-bs-target');
              const target = targetSelector ? root.querySelector(targetSelector) : null;
              if (target) {
                target.classList.remove('show');
              }
            }
          });
        });
      });

      root.querySelectorAll('.rencana-penting-items').forEach((listRoot) => {
        const entryId = listRoot.getAttribute('data-entry-id');
        updateRencanaPentingList(entryId);
      });

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

    static getPrintHtml(patient, formData) {
      const p = patient || {};
      const noMr = p.noMr || p.norm || '';
      const nama = p.nama || '';
      const tglLahir = p.tglLahir || '';
      const kelamin = p.kelamin || '';
      const fd = formData || {};
      const entries = fd.entries || [];
      const ROWS_PER_PAGE = 8;
      const chunks = [];
      if (entries.length === 0) {
        chunks.push([]);
      } else {
        for (let i = 0; i < entries.length; i += ROWS_PER_PAGE) {
          chunks.push(entries.slice(i, i + ROWS_PER_PAGE));
        }
      }

      const totalPages = chunks.length;
      let pagesHtml = "";

      chunks.forEach((chunk, pageIdx) => {
        let rowsHtml = "";
        chunk.forEach((e, idx) => {
          const globalIdx = pageIdx * ROWS_PER_PAGE + idx + 1;
          const tglJam = (e.tglDate || e.tglTime) ? `${e.tglDate || ''}<br>${e.tglTime || ''}` : '-';
          const parafImgHtml = e.parafImg ? `<img src="${e.parafImg}" style="height:50px; max-height:55px; max-width:98%; object-fit:contain; display:block; margin:2px auto;">` : '';
          const ketText = e.ket || '';
          const ketHtml = (parafImgHtml || ketText) ? `${parafImgHtml}${ketText ? `<div>${ketText}</div>` : ''}` : '-';
          rowsHtml += `
          <tr>
              <td style="text-align:center; padding:6px 4px;">${globalIdx}</td>
              <td style="text-align:center; padding:6px 4px;">${tglJam}</td>
              <td style="text-align:center; padding:6px 4px;">${e.drSp || '-'}</td>
              <td style="white-space:pre-wrap; padding:6px 6px;">${e.uraianKlinis || '-'}</td>
              <td style="white-space:pre-wrap; padding:6px 6px;">${e.diagnosis || '-'}</td>
              <td style="white-space:pre-wrap; padding:6px 6px;">${e.icd9 || '-'}</td>
              <td style="white-space:pre-wrap; padding:6px 6px;">${e.rencanaPenting || '-'}</td>
              <td style="text-align:center; vertical-align:middle; padding:4px 2px;">
                  ${ketHtml}
              </td>
          </tr>`;
        });

        rowsHtml += `
        <tr style="height:100%;">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>`;

        const titleText = totalPages > 1
          ? `PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLIKLINIK - LEMBAR ${pageIdx + 1} DARI ${totalPages}`
          : `PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLIKLINIK`;

        pagesHtml += `
        <div class="surat-document" style="display:flex; flex-direction:column; height:1247px; page-break-after:always;">
            ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin)}

            <div style="border:2px solid black; font-family:'Times New Roman',Times,serif; flex:1; display:flex; flex-direction:column; min-height:0; margin-top:10px;">
                <div style="text-align:center; font-weight:bold; font-size:13px !important; padding:8px; border-bottom:2px solid black; background-color:#e6e6e6;">
                    ${titleText}
                </div>

                <table class="prmrj-table" style="border:none; border-top:1px solid black; flex:1;">
                   <colgroup>
                       <col style="width:4%">
                       <col style="width:10%">
                       <col style="width:12%">
                       <col style="width:20%">
                       <col style="width:14%">
                       <col style="width:10%">
                       <col style="width:14%">
                       <col style="width:16%">
                   </colgroup>
                  <thead>
                      <tr>
                          <th style="border-left:none;">NO</th>
                          <th>TGL/JAM</th>
                          <th>DR.SP</th>
                          <th>URAIAN KLINIS PENTING</th>
                           <th>DIAGNOSIS</th>
                           <th>ICD-9</th>
                           <th>RENCANA PENTING</th>
                          <th style="border-right:none;">PARAF / KET</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${rowsHtml}
                  </tbody>
                </table>
            </div>
        </div>`;
      });

      return pagesHtml;
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin, dpjp, getFontSize) {
      const printContainer = document.getElementById("prmrj-print-container");
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
