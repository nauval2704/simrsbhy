import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as _cmp,
  gc as _elementStart,
  hc as _elementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import {
  createSuratShell,
  bindSuratPrintButton,
  hospitalHeaderRow,
  showSuccessToast,
  showErrorAlert,
  buildSuratPdfFilename
} from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-pengantar-rawat-inap-placeholder");
    _elementEnd();
  }
}

export var PengantarRawatInapComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      if (typeof window !== "undefined") window.__toastr = this.toastr;
      this.patient = null;
      this.loading = true;
      this.saving = false;

      this.formData = {
        alamatTelepon: "",
        tglMasuk: "",
        tglKeluar: "",
        kamarRawat: "",
        keluhanUtama: "",
        pemeriksaanFisik: "",
        pemeriksaanLaboratorium: "",
        jalannyaPenyakit: "",
        diagnosisKerja: "",
        tindakan: "",
        terapi: "",
        tglSurat: new Date().toISOString().split("T")[0],
        namaDokter: "",
        sigDokter: null
      };

      this.rooms = [];

      const pathParts = window.location.pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
      const priIdx = pathParts.indexOf("pengantar-rawat-inap");
      if (priIdx !== -1 && pathParts[priIdx + 1]) {
        this.noCheckin = pathParts[priIdx + 1];
      } else {
        const ncIdx = pathParts.indexOf("nocheckin");
        if (ncIdx !== -1 && pathParts[ncIdx + 1]) {
          this.noCheckin = pathParts[ncIdx + 1];
        } else {
          this.noCheckin = pathParts[pathParts.length - 1] || "";
        }
      }
    }

    ngOnInit() {
      this.fetchRooms();
      this.fetchPatient();
    }

    fetchRooms() {
      this.http.get(i.apiUrl + "/simrsba/cariruang/.*").subscribe({
        next: (res) => {
          if (Array.isArray(res)) {
            this.rooms = res;
            this.updateRoomDatalist();
          }
        },
        error: (err) => {
          console.warn("Could not load rooms:", err);
        }
      });
    }

    updateRoomDatalist() {
      const datalist = document.getElementById("pri-kamar-list");
      if (datalist) {
        datalist.innerHTML = this.buildRoomOptionsHtml();
      }
    }

    buildRoomOptionsHtml() {
      if (!this.rooms || !this.rooms.length) return "";
      return this.rooms
        .map((r) => {
          const val = this.formatRoomLabel(r);
          const avail = r.tersedia !== undefined && r.tersedia !== null && r.tersedia !== "" ? ` (Tersedia: ${r.tersedia})` : "";
          return `<option value="${val}">${val}${avail}</option>`;
        })
        .join("");
    }

    formatRoomLabel(r) {
      const nama = (r.namaruang || "").trim();
      let kls = (r.kodeKelas || "").trim();
      if (/^KL[S]?1$/i.test(kls)) kls = "Kelas 1";
      else if (/^KL[S]?2$/i.test(kls)) kls = "Kelas 2";
      else if (/^KL[S]?3$/i.test(kls)) kls = "Kelas 3";

      if (!kls || nama.toLowerCase().includes(kls.toLowerCase()) || kls.toLowerCase().includes(nama.toLowerCase())) {
        return nama;
      }
      return `${nama} (${kls})`;
    }

    fetchPatient() {
      const isPoli = window.location.pathname.includes("/poli/");
      const isInap = window.location.pathname.includes("/inap/");

      let urls = [];
      if (isPoli) {
        urls = [
          i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasiennocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasien/pelayanan/INAP/nocheckin/" + this.noCheckin
        ];
      } else if (isInap) {
        urls = [
          i.apiUrl + "/simrsba/caripasien/pelayanan/INAP/nocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasiennocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin
        ];
      } else {
        urls = [
          i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasiennocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin,
          i.apiUrl + "/simrsba/caripasien/pelayanan/INAP/nocheckin/" + this.noCheckin
        ];
      }

      const tryNextUrl = (idx) => {
        if (idx >= urls.length) {
          this.fetchDraft();
          return;
        }
        this.http.get(urls[idx]).subscribe({
          next: (res) => {
            let found = null;
            if (Array.isArray(res) && res.length > 0) {
              found = res[0];
            } else if (res && res.data) {
              found = Array.isArray(res.data) ? res.data[0] : res.data;
            }
            if (found) {
              if (found.user && found.user[0]) {
                found = Object.assign({}, found.user[0], found);
              }
              this.patient = found;
              this.fetchDraft();
            } else {
              tryNextUrl(idx + 1);
            }
          },
          error: () => {
            tryNextUrl(idx + 1);
          }
        });
      };

      tryNextUrl(0);
    }

    fetchDraft() {
      this.http.get(i.apiUrl + "/simrsba/pengantar-rawat-inap/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            let raw = res.data.data || res.data;
            delete raw._id;
            delete raw.__v;
            delete raw.createdAt;
            delete raw.updatedAt;
            this.formData = Object.assign(this.formData, raw);
          }
          this.fetchAutoFillDefaults();
        },
        error: () => {
          this.fetchAutoFillDefaults();
        }
      });
    }

    fetchAutoFillDefaults() {
      const p = this.patient || {};
      if (!this.formData.alamatTelepon) {
        const alamat = p.alamat || "";
        const telp = p.noHp || p.noTelp || "";
        this.formData.alamatTelepon = [alamat, telp ? ("Telp: " + telp) : ""].filter(Boolean).join(" / ");
      }
      if (!this.formData.tglMasuk) {
        this.formData.tglMasuk = p.tglCheckin ? p.tglCheckin.split("T")[0] : (new Date().toISOString().split("T")[0]);
      }
      if (!this.formData.kamarRawat) {
        this.formData.kamarRawat = p.ruangan || p.kamar || p.cabar || "";
      }
      if (!this.formData.namaDokter) {
        this.formData.namaDokter = p.dokterDpjp || p.dpjp || p.namaDokter || "";
      }

      // If clinical fields are empty, check Pengkajian Awal IGD to auto-fill
      const needsPrefill = !this.formData.keluhanUtama && !this.formData.diagnosisKerja;
      if (needsPrefill) {
        this.http.get(i.apiUrl + "/simrsba/pengkajian-awal-igd/" + this.noCheckin).subscribe({
          next: (res) => {
            if (res && res.data) {
              const d = res.data;
              if (!this.formData.keluhanUtama && d.keluhanUtama) this.formData.keluhanUtama = d.keluhanUtama;
              if (!this.formData.pemeriksaanFisik && (d.pemeriksaanFisik || d.vitalSign)) {
                let pf = d.pemeriksaanFisik || "";
                if (d.vitalSign) {
                  const vs = d.vitalSign;
                  const vsText = `TD: ${vs.td || '-'} mmHg, HR: ${vs.nadi || '-'} x/m, RR: ${vs.rr || '-'} x/m, Suhu: ${vs.suhu || '-'} C`;
                  pf = pf ? `${vsText}\n${pf}` : vsText;
                }
                this.formData.pemeriksaanFisik = pf;
              }
              if (!this.formData.diagnosisKerja && (d.diagnosisKerja || d.diagAwal)) {
                this.formData.diagnosisKerja = d.diagnosisKerja || d.diagAwal;
              }
              if (!this.formData.terapi && (d.terapi || d.terapiTindakan)) {
                this.formData.terapi = d.terapi || d.terapiTindakan;
              }
            }
            this.loading = false;
            this.renderUI();
          },
          error: () => {
            this.loading = false;
            this.renderUI();
          }
        });
      } else {
        this.loading = false;
        this.renderUI();
      }
    }

    syncFromDOM() {
      const root = document.querySelector("app-pengantar-rawat-inap-placeholder");
      if (!root) return;

      const getValue = (id) => {
        const el = root.querySelector("#" + id);
        return el ? el.value : "";
      };

      this.formData.alamatTelepon = getValue("pri-alamatTelepon");
      this.formData.tglMasuk = getValue("pri-tglMasuk");
      this.formData.tglKeluar = getValue("pri-tglKeluar");
      this.formData.kamarRawat = getValue("pri-kamarRawat");
      this.formData.keluhanUtama = getValue("pri-keluhanUtama");
      this.formData.pemeriksaanFisik = getValue("pri-pemeriksaanFisik");
      this.formData.pemeriksaanLaboratorium = getValue("pri-pemeriksaanLaboratorium");
      this.formData.jalannyaPenyakit = getValue("pri-jalannyaPenyakit");
      this.formData.diagnosisKerja = getValue("pri-diagnosisKerja");
      this.formData.tindakan = getValue("pri-tindakan");
      this.formData.terapi = getValue("pri-terapi");
      this.formData.tglSurat = getValue("pri-tglSurat");
      this.formData.namaDokter = getValue("pri-namaDokter");
    }

    saveData() {
      this.saving = true;
      const btn = document.getElementById("btn-save-pri");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncFromDOM();

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        namaPasien: this.patient?.nama || "",
        dpjp: this.formData.namaDokter || this.patient?.dokterDpjp || this.patient?.dpjp || "",
        tglInput: new Date().toLocaleString(),
        user: "Petugas",
        data: Object.assign({}, this.formData)
      };

      this.http.post(i.apiUrl + "/simrsba/pengantar-rawat-inap", payload).subscribe({
        next: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
            }, 2000);
          }
          showSuccessToast("Surat Pengantar Rawat Inap berhasil disimpan");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
          }
          showErrorAlert("Gagal menyimpan Surat Pengantar Rawat Inap");
        }
      });
    }

    renderUI() {
      const root = document.querySelector("app-pengantar-rawat-inap-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:250px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat Surat Pengantar Rawat Inap...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const d = this.formData;

      const inputContent = `
        <div class="card border mb-3 shadow-sm">
          <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-vcard me-2"></i> Identitas Pasien</div>
          <div class="card-body py-2">
            <div class="row g-2">
              <div class="col-md-3"><label class="f-label">No. RM</label><input type="text" class="f-input bg-light" value="${noMr}" disabled></div>
              <div class="col-md-3"><label class="f-label">Nama Pasien</label><input type="text" class="f-input bg-light" value="${nama}" disabled></div>
              <div class="col-md-3"><label class="f-label">Tgl. Lahir</label><input type="text" class="f-input bg-light" value="${tglLahir}" disabled></div>
              <div class="col-md-3"><label class="f-label">Jenis Kelamin</label><input type="text" class="f-input bg-light" value="${kelamin}" disabled></div>
            </div>
          </div>
        </div>

        <div class="accordion mb-3" id="accPengantarRawatInap">
          <!-- 1. Data Administrasi -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_pri_1">
              <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_pri_1" aria-expanded="true">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-geo-alt-fill me-2 text-secondary"></i> 1. Data Administrasi Rawat Inap</span>
              </button>
            </h2>
            <div id="collapse_pri_1" class="accordion-collapse collapse show" data-bs-parent="#accPengantarRawatInap">
              <div class="accordion-body bg-white p-3">
                <div class="row g-3">
                  <div class="col-md-5">
                    <label class="f-label">Alamat / No. Telepon Pasien</label>
                    <input type="text" id="pri-alamatTelepon" class="f-input" value="${d.alamatTelepon || ''}" placeholder="Alamat lengkap dan nomor telepon...">
                  </div>
                  <div class="col-md-2">
                    <label class="f-label">Tgl Masuk</label>
                    <input type="date" id="pri-tglMasuk" class="f-input" value="${d.tglMasuk || ''}">
                  </div>
                  <div class="col-md-2">
                    <label class="f-label">Tgl Keluar (Estimasi)</label>
                    <input type="date" id="pri-tglKeluar" class="f-input" value="${d.tglKeluar || ''}">
                  </div>
                  <div class="col-md-3">
                    <label class="f-label">Kamar Rawat <span class="text-muted fw-normal" style="font-size:11px;">(Pilih / Ketik)</span></label>
                    <input type="text" id="pri-kamarRawat" list="pri-kamar-list" autocomplete="off" class="f-input" value="${d.kamarRawat || ''}" placeholder="Pilih atau ketik kamar...">
                    <datalist id="pri-kamar-list">
                      ${this.buildRoomOptionsHtml()}
                    </datalist>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. Rincian Klinis -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_pri_2">
              <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_pri_2" aria-expanded="true">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-file-medical-fill me-2 text-secondary"></i> 2. Rincian Klinis &amp; Terapi</span>
              </button>
            </h2>
            <div id="collapse_pri_2" class="accordion-collapse collapse show" data-bs-parent="#accPengantarRawatInap">
              <div class="accordion-body bg-white p-3">
                <div class="mb-3">
                  <label class="f-label">Keluhan Utama</label>
                  <textarea id="pri-keluhanUtama" class="f-input" rows="2" placeholder="Keluhan utama yang dirasakan pasien...">${d.keluhanUtama || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Pemeriksaan Fisik</label>
                  <textarea id="pri-pemeriksaanFisik" class="f-input" rows="3" placeholder="Hasil pemeriksaan fisik, tanda vital, status lokalis...">${d.pemeriksaanFisik || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Pemeriksaan Laboratorium</label>
                  <textarea id="pri-pemeriksaanLaboratorium" class="f-input" rows="2" placeholder="Hasil pemeriksaan laboratorium / penunjang yang sudah dilakukan...">${d.pemeriksaanLaboratorium || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Jalannya Penyakit Selama Perawatan</label>
                  <textarea id="pri-jalannyaPenyakit" class="f-input" rows="3" placeholder="Riwayat dan perkembangan penyakit selama perawatan di IGD/Poli...">${d.jalannyaPenyakit || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Diagnosis Kerja</label>
                  <textarea id="pri-diagnosisKerja" class="f-input" rows="2" placeholder="Diagnosis kerja / diagnosis masuk rawat inap...">${d.diagnosisKerja || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Tindakan</label>
                  <textarea id="pri-tindakan" class="f-input" rows="2" placeholder="Tindakan medis yang telah diberikan...">${d.tindakan || ''}</textarea>
                </div>
                <div class="mb-3">
                  <label class="f-label">Terapi yang Diberikan</label>
                  <textarea id="pri-terapi" class="f-input" rows="2" placeholder="Terapi obat-obatan / cairan infus yang diberikan...">${d.terapi || ''}</textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. DPJP & TTD -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_pri_3">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_pri_3">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-pencil-square me-2 text-secondary"></i> 3. Dokter Penanggung Jawab Pelayanan (DPJP)</span>
              </button>
            </h2>
            <div id="collapse_pri_3" class="accordion-collapse collapse" data-bs-parent="#accPengantarRawatInap">
              <div class="accordion-body bg-white p-3">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="f-label">Tanggal Surat</label>
                    <input type="date" id="pri-tglSurat" class="f-input mb-2" value="${d.tglSurat || ''}">
                  </div>
                  <div class="col-md-8">
                    <label class="f-label">Nama Dokter DPJP</label>
                    <input type="text" id="pri-namaDokter" class="f-input mb-2" value="${d.namaDokter || ''}" placeholder="Nama lengkap dokter DPJP...">
                  </div>
                </div>
                <div class="row mt-2">
                  <div class="col-md-6">
                    <div class="border rounded p-2 bg-light">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small fw-bold">Tanda Tangan DPJP:</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-pri-dokter" style="font-size:10px;padding:1px 6px;">Hapus</button>
                      </div>
                      <canvas id="sig-pri-dokter" width="500" height="150" style="height:120px;border:1px solid #ccc;background:#fff;width:100%;border-radius:4px;cursor:crosshair;"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
          <button type="button" class="btn btn-outline-success surat-download-pdf-btn px-3"><i class="bi bi-file-earmark-pdf-fill me-1"></i>Simpan sebagai PDF</button>
          <button id="btn-save-pri" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
        </div>
      `;

      root.innerHTML = createSuratShell({
        idPrefix: 'pri',
        wrapperTag: 'app-pengantar-rawat-inap-placeholder',
        inputPaneId: 'pri-input-pane',
        printPaneId: 'pri-print-pane',
        printTabId: 'pri-print-tab',
        tabsClass: 'pri-tabs',
        inputContent: inputContent
      });

      bindSuratPrintButton(root, {
        getFilename: () => buildSuratPdfFilename('PENGANTAR_RAWAT_INAP', noMr, nama)
      });

      root.querySelector("#btn-save-pri")?.addEventListener("click", () => this.saveData());

      this.initCanvas("sig-pri-dokter", "sigDokter");

      const accCollapse3 = root.querySelector("#collapse_pri_3");
      if (accCollapse3) {
        accCollapse3.addEventListener("shown.bs.collapse", () => {
          this.initCanvas("sig-pri-dokter", "sigDokter");
        });
      }

      const printTab = root.querySelector("#pri-print-tab");
      const updatePrint = () => {
        this.syncFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      // Also listen to inputs to auto-update
      root.querySelectorAll("input, textarea").forEach((el) => {
        const updateProp = () => {
          if (el.id) {
            const prop = el.id.replace("pri-", "");
            if (this.formData.hasOwnProperty(prop)) {
              this.formData[prop] = el.value;
            }
          }
        };
        el.addEventListener("input", updateProp);
        el.addEventListener("change", updateProp);
      });

      this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
    }

    initCanvas(id, fieldKey) {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";

      if (this.formData[fieldKey]) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        img.src = this.formData[fieldKey];
      }

      let drawing = false;
      let lastX = 0, lastY = 0;

      const getPos = (e) => {
        const r = canvas.getBoundingClientRect();
        const sx = canvas.width / r.width;
        const sy = canvas.height / r.height;
        if (e.touches)
          return [
            (e.touches[0].clientX - r.left) * sx,
            (e.touches[0].clientY - r.top) * sy,
          ];
        return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
      };

      const start = (e) => { drawing = true; [lastX, lastY] = getPos(e); };
      const move = (e) => {
        if (!drawing) return;
        const [x, y] = getPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        [lastX, lastY] = [x, y];
      };
      const stop = () => {
        if (drawing) {
          drawing = false;
          this.formData[fieldKey] = canvas.toDataURL();
        }
      };

      canvas.addEventListener("mousedown", start);
      canvas.addEventListener("mousemove", move);
      canvas.addEventListener("mouseup", stop);
      canvas.addEventListener("mouseleave", stop);

      canvas.addEventListener("touchstart", (e) => { e.preventDefault(); start(e); }, { passive: false });
      canvas.addEventListener("touchmove", (e) => { e.preventDefault(); move(e); }, { passive: false });
      canvas.addEventListener("touchend", stop);

      const clearBtn = document.querySelector(`.sig-clear-btn[data-target="${id}"]`);
      if (clearBtn) {
        clearBtn.addEventListener("click", () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          this.formData[fieldKey] = null;
        });
      }
    }

    renderPrintLayout(noMr, nama, tglLahir, kelamin) {
      const container = document.getElementById("pri-print-container");
      if (!container) return;

      const html = PengantarRawatInapComponent.getPrintHtml(
        { noMr, nama, tglLahir, kelamin, dpjp: this.formData.namaDokter },
        this.formData
      );
      container.innerHTML = html;
    }

    static getPrintHtml(patient, formData) {
      const p = patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || p.namaPasien || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const d = formData || {};
      const dpjp = d.namaDokter || p.dpjp || p.dokterDpjp || p.namaDokter || "........................................";

      const formatDateIndo = (dStr) => {
        if (!dStr) return "";
        try {
          const parts = dStr.split("-");
          if (parts.length === 3) {
            const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            const year = parts[0];
            const month = months[parseInt(parts[1], 10) - 1] || parts[1];
            const day = parseInt(parts[2], 10);
            return `${day} ${month} ${year}`;
          }
        } catch (e) {}
        return dStr;
      };

      const tglMasukFmt = formatDateIndo(d.tglMasuk);
      const tglKeluarFmt = formatDateIndo(d.tglKeluar);
      const tglSuratFmt = formatDateIndo(d.tglSurat);

      return `
      <div class="surat-document" style="font-family: Arial, Helvetica, sans-serif; font-size: 11.5px; color: #000; line-height: 1.35; padding: 6mm !important; margin: 0 auto;">
        <table class="pap-master-grid" style="width: 100%; border-collapse: collapse; border: 1.5px solid #000; font-size: 11px; table-layout: fixed;">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            <!-- 1. Header Row Standar Rumah Sakit Bhayangkara -->
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}

            <!-- 2. Title Row -->
            <tr>
              <td colspan="6" style="text-align: center; font-weight: bold; font-size: 13.5px; background-color: #f2f2f2; padding: 6px; letter-spacing: 1px; border-top: 2px solid #000; border-bottom: 2px solid #000; text-transform: uppercase;">
                PENGANTAR RAWAT INAP
              </td>
            </tr>

            <!-- 3. Administrative Meta Row -->
            <tr>
              <td colspan="3" style="width: 45%; vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">Alamat / Telepon :</div>
                <div style="min-height: 22px; font-size: 11px;">${d.alamatTelepon || '<span style="border-bottom: 1px dotted #888; display: inline-block; width: 95%; height: 16px;"></span>'}</div>
              </td>
              <td colspan="1" style="width: 18%; vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">Tgl Masuk :</div>
                <div style="min-height: 22px; font-size: 11px;">${tglMasukFmt || d.tglMasuk || '<span style="border-bottom: 1px dotted #888; display: inline-block; width: 95%; height: 16px;"></span>'}</div>
              </td>
              <td colspan="1" style="width: 18%; vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">Tgl Keluar :</div>
                <div style="min-height: 22px; font-size: 11px;">${tglKeluarFmt || d.tglKeluar || '<span style="border-bottom: 1px dotted #888; display: inline-block; width: 95%; height: 16px;"></span>'}</div>
              </td>
              <td colspan="1" style="width: 19%; vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; margin-bottom: 3px;">Kamar Rawat :</div>
                <div style="min-height: 22px; font-size: 11px;">${d.kamarRawat || '<span style="border-bottom: 1px dotted #888; display: inline-block; width: 95%; height: 16px;"></span>'}</div>
              </td>
            </tr>

            <!-- 4. Clinical Details Rows -->
            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Keluhan Utama</div>
                <div style="min-height: 38px; white-space: pre-wrap; font-size: 11px;">${d.keluhanUtama || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Pemeriksaan Fisik</div>
                <div style="min-height: 52px; white-space: pre-wrap; font-size: 11px;">${d.pemeriksaanFisik || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Pemeriksaan Laboratorium</div>
                <div style="min-height: 48px; white-space: pre-wrap; font-size: 11px;">${d.pemeriksaanLaboratorium || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Jalannya Penyakit Selama Perawatan</div>
                <div style="min-height: 52px; white-space: pre-wrap; font-size: 11px;">${d.jalannyaPenyakit || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Diagnosis Kerja</div>
                <div style="min-height: 36px; white-space: pre-wrap; font-size: 11px;">${d.diagnosisKerja || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Tindakan</div>
                <div style="min-height: 38px; white-space: pre-wrap; font-size: 11px;">${d.tindakan || ''}</div>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="vertical-align: top; padding: 6px 8px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 3px;">Terapi yang Diberikan</div>
                <div style="min-height: 42px; white-space: pre-wrap; font-size: 11px;">${d.terapi || ''}</div>
              </td>
            </tr>

            <!-- 5. Signature Area -->
            <tr>
              <td colspan="6" style="padding: 8px 12px 12px 12px; border: 1px solid #000;">
                <div style="font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Dokter Penanggung Jawab Pelayanan</div>
                <div style="display: flex; justify-content: flex-end; width: 100%;">
                  <div style="width: 290px; text-align: center; font-size: 11.5px; line-height: 1.3;">
                    Banda Aceh, <strong>${tglSuratFmt || d.tglSurat || '................................'}</strong><br>
                    Dokter Penanggung Jawab Pelayanan (DPJP)<br>
                    <div style="height: 60px; display: flex; align-items: center; justify-content: center; margin: 3px 0;">
                      ${d.sigDokter ? `<img src="${d.sigDokter}" style="max-height: 56px; max-width: 170px; object-fit: contain;">` : '<br><br>'}
                    </div>
                    ( <strong>${dpjp}</strong> )
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="text-align: right; font-size: 8px; color: #666; font-style: italic; margin-top: 4px;">
          RM.11/Rev.01/RSBHY/2026
        </div>
      </div>
      `;
    }
  }

  t.ɵfac = function(f) { return new (f || t)(); };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-pengantar-rawat-inap-placeholder"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2
  });

  return t;
})();
