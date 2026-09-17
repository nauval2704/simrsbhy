import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import { k as ToastrService } from "../chunk-QJBCP6KK.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import {
  getStandardGridCSS,
  hospitalHeaderDiv,
  createSuratShell,
  bindSuratPrintButton,
  buildSuratPdfFilename,
  showSuccessToast,
  showErrorAlert
} from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-pengkajian-awal-gigi-placeholder");
    ɵelementEnd();
  }
}

var PengkajianAwalGigiComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      this.patient = null;
      this.loading = true;
      this.saving = false;
      this.draftData = null;
      this.formData = {};

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      this.noCheckin = pathParts[pathParts.length - 1] || "";
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() {
      this.renderView();
    }

    fetchPatient() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.patient = res[0];
            }
            this.fetchDraft();
          },
          error: () => {
            this.fetchDraft();
          },
        });
    }

    fetchDraft() {
      this.http
        .get(i.apiUrl + "/simrsba/pengkajian-awal-gigi/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.data) {
              this.draftData = res.data.formData || res.data;
              this.formData = Object.assign({}, this.draftData);
            }
            if (!this.draftData || Object.keys(this.draftData).length === 0) {
              this.fetchPoliFallback();
            } else {
              this.loading = false;
              this.renderView();
            }
          },
          error: () => {
            this.fetchPoliFallback();
          },
        });
    }

    fetchPoliFallback() {
      this.http
        .get(i.apiUrl + "/simrsba/pengkajian-awal-poli/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            const pk = res?.data?.formData || res?.data || {};
            if (!this.formData) this.formData = {};
            if (!this.formData.keluhanUtama && pk.keluhanUtama) this.formData.keluhanUtama = pk.keluhanUtama;
            if (!this.formData.td && pk.td) this.formData.td = pk.td;
            if (!this.formData.rr && pk.rr) this.formData.rr = pk.rr;
            if (!this.formData.bb && pk.bb) this.formData.bb = pk.bb;
            if (!this.formData.nadi && pk.nadi) this.formData.nadi = pk.nadi;
            if (!this.formData.suhu && pk.suhu) this.formData.suhu = pk.suhu;

            const dpjp = this.patient?.dokterDpjp || this.patient?.dpjp || this.patient?.namaDokter || "";
            if (!this.formData.drg_nama && dpjp) this.formData.drg_nama = dpjp;
            if (!this.formData.tgl_pemeriksaan) {
              const today = new Date();
              this.formData.tgl_pemeriksaan = today.toISOString().split("T")[0];
            }
            this.loading = false;
            this.renderView();
          },
          error: () => {
            const dpjp = this.patient?.dokterDpjp || this.patient?.dpjp || this.patient?.namaDokter || "";
            if (!this.formData.drg_nama && dpjp) this.formData.drg_nama = dpjp;
            if (!this.formData.tgl_pemeriksaan) {
              const today = new Date();
              this.formData.tgl_pemeriksaan = today.toISOString().split("T")[0];
            }
            this.loading = false;
            this.renderView();
          }
        });
    }

    syncFormDataFromDOM() {
      const root = document.querySelector("app-pengkajian-awal-gigi-placeholder");
      if (!root) return;

      root.querySelectorAll("input[data-field], textarea[data-field], select[data-field]").forEach((el) => {
        const field = el.getAttribute("data-field");
        if (!field) return;

        if (el.type === "checkbox") {
          this.formData[field] = el.checked ? (el.value || "1") : "";
        } else if (el.type === "radio") {
          if (el.checked) {
            this.formData[field] = el.value;
          }
        } else {
          this.formData[field] = el.value;
        }
      });

      const canvas = root.querySelector("#gigi-signature-pad");
      if (canvas && !this.isCanvasBlank(canvas)) {
        this.formData.ttdImage = canvas.toDataURL("image/png");
      }
    }

    isCanvasBlank(canvas) {
      if (!canvas) return true;
      const blank = document.createElement("canvas");
      blank.width = canvas.width;
      blank.height = canvas.height;
      return canvas.toDataURL() === blank.toDataURL();
    }

    handleSubmit() {
      this.saving = true;
      const root = document.querySelector("app-pengkajian-awal-gigi-placeholder");
      const btn = (root && root.querySelector("#btn-save-gigi")) || document.getElementById("btn-save-gigi");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncFormDataFromDOM();

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        namaPasien: this.patient?.nama || "",
        dpjp: this.formData.drg_nama || this.patient?.dokterDpjp || this.patient?.dpjp || "",
        formData: this.formData,
        canvasImage: this.formData.ttdImage || null,
        tglInput: new Date().toLocaleString("id-ID"),
        user: "Dokter Gigi"
      };

      this.http.post(i.apiUrl + "/simrsba/pengkajian-awal-gigi", payload).subscribe({
        next: (res) => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
            }, 2000);
          }
          showSuccessToast("Pengkajian Awal Poli Gigi berhasil disimpan!");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Data';
          }
          showErrorAlert("Gagal menyimpan Pengkajian Awal Poli Gigi");
        }
      });
    }

    renderView() {
      const root = document.querySelector("app-pengkajian-awal-gigi-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML = '<div class="d-flex justify-content-center align-items-center" style="min-height:220px;"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;"></div><div class="text-muted fw-bold">Memuat Pengkajian Awal Poli Gigi...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const fd = this.formData || {};

      const v = (key, def = "") => (fd[key] !== undefined && fd[key] !== null ? String(fd[key]) : def);

      const keluhanItems = [
        { no: 1, label: "Penyakit Jantung", key: "jantung" },
        { no: 2, label: "Penyakit Diabetes Melitus", key: "dm" },
        { no: 3, label: "Penyakit Haemophilia", key: "haemophilia" },
        { no: 4, label: "Penyakit Hepatitis", key: "hepatitis" },
        { no: 5, label: "Penyakit Gastritis", key: "gastritis" },
        { no: 6, label: "Penyakit Lainnya", key: "lainnya", hasKet: true },
        { no: 7, label: "Alergi terhadap obat", key: "alergi_obat", hasKet: true },
        { no: 8, label: "Alergi terhadap makanan", key: "alergi_makanan", hasKet: true }
      ];

      const keluhanRowsHtml = keluhanItems.map((item) => {
        const dKey = "keluhan_dewasa_" + item.key;
        const aKey = "keluhan_anak_" + item.key;
        const dKetKey = "keluhan_dewasa_" + item.key + "_ket";
        const aKetKey = "keluhan_anak_" + item.key + "_ket";
        const dVal = v(dKey, "");
        const aVal = v(aKey, "");
        return `
          <tr>
            <td class="text-center fw-bold">${item.no}</td>
            <td>
              <div>${item.label}</div>
              ${item.hasKet ? `<input type="text" class="f-input mt-1" data-field="${dKetKey}" value="${v(dKetKey)}" placeholder="Keterangan...">` : ""}
            </td>
            <td>
              <select class="f-input" data-field="${dKey}">
                <option value="" ${dVal === "" ? "selected" : ""}>- (Kosong)</option>
                <option value="tidak_ada" ${dVal === "tidak_ada" ? "selected" : ""}>Tidak Ada</option>
                <option value="ada" ${dVal === "ada" ? "selected" : ""}>Ada</option>
              </select>
            </td>
            <td class="text-center fw-bold">${item.no}</td>
            <td>
              <div>${item.label}</div>
              ${item.hasKet ? `<input type="text" class="f-input mt-1" data-field="${aKetKey}" value="${v(aKetKey)}" placeholder="Keterangan...">` : ""}
            </td>
            <td>
              <select class="f-input" data-field="${aKey}">
                <option value="" ${aVal === "" ? "selected" : ""}>- (Kosong)</option>
                <option value="tidak_ada" ${aVal === "tidak_ada" ? "selected" : ""}>Tidak Ada</option>
                <option value="ada" ${aVal === "ada" ? "selected" : ""}>Ada</option>
              </select>
            </td>
          </tr>
        `;
      }).join("");

      const selectYaTidak = (key, defaultVal = "") => {
        const curr = v(key, defaultVal);
        return `
          <select class="f-input" data-field="${key}" style="max-width:130px;">
            <option value="" ${curr === "" ? "selected" : ""}>- (Kosong)</option>
            <option value="tidak" ${curr === "tidak" ? "selected" : ""}>TIDAK</option>
            <option value="ya" ${curr === "ya" ? "selected" : ""}>YA</option>
          </select>
        `;
      };

      const upperTeeth = [
        { rNum: "11 [51]", rKey: "t_11", lNum: "[61] 21", lKey: "t_21" },
        { rNum: "12 [52]", rKey: "t_12", lNum: "[62] 22", lKey: "t_22" },
        { rNum: "13 [53]", rKey: "t_13", lNum: "[63] 23", lKey: "t_23" },
        { rNum: "14 [54]", rKey: "t_14", lNum: "[64] 24", lKey: "t_24" },
        { rNum: "15 [55]", rKey: "t_15", lNum: "[65] 25", lKey: "t_25" },
        { rNum: "16", rKey: "t_16", lNum: "26", lKey: "t_26" },
        { rNum: "17", rKey: "t_17", lNum: "27", lKey: "t_27" },
        { rNum: "18", rKey: "t_18", lNum: "28", lKey: "t_28" }
      ];

      const lowerTeeth = [
        { rNum: "48", rKey: "t_48", lNum: "38", lKey: "t_38" },
        { rNum: "47", rKey: "t_47", lNum: "37", lKey: "t_37" },
        { rNum: "46", rKey: "t_46", lNum: "36", lKey: "t_36" },
        { rNum: "45 [85]", rKey: "t_45", lNum: "[75] 35", lKey: "t_35" },
        { rNum: "44 [84]", rKey: "t_44", lNum: "[74] 34", lKey: "t_34" },
        { rNum: "43 [83]", rKey: "t_43", lNum: "[73] 33", lKey: "t_33" },
        { rNum: "42 [82]", rKey: "t_42", lNum: "[72] 32", lKey: "t_32" },
        { rNum: "41 [81]", rKey: "t_41", lNum: "[71] 31", lKey: "t_31" }
      ];

      const renderToothInputs = (list) => {
        return list.map((item) => {
          return `
            <tr>
              <td style="width:18%; font-weight:bold; vertical-align:middle; text-align:left;">${item.rNum}</td>
              <td style="width:32%;">
                <input type="text" class="f-input" data-field="${item.rKey}" value="${v(item.rKey)}" placeholder="Kondisi...">
              </td>
              <td style="width:32%;">
                <input type="text" class="f-input" data-field="${item.lKey}" value="${v(item.lKey)}" placeholder="Kondisi...">
              </td>
              <td style="width:18%; font-weight:bold; text-align:right; vertical-align:middle;">${item.lNum}</td>
            </tr>
          `;
        }).join("");
      };

      const inputContent = `
        <!-- DATA PASIEN BANNER (POLI THEME) -->
        <div class="card border mb-3">
          <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center">
            <span class="fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</span>
            <button type="button" class="btn btn-xs btn-outline-secondary py-0 px-2" id="btn-empty-all-selects" title="Kosongkan semua dropdown isian" style="font-size:12px;">
              <i class="bi bi-eraser me-1"></i>Kosongkan Semua Pilihan (Select)
            </button>
          </div>
          <div class="card-body pt-2 pb-2">
            <div class="row g-2">
              <div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;"></div></div>
              <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;"></div></div>
              <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="${tglLahir} (${kelamin})" disabled style="background:#e9ecef;"></div></div>
              <div class="col-md-3"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="${p.dokterDpjp || p.dpjp || '-'}" disabled style="background:#e9ecef;"></div></div>
            </div>
          </div>
        </div>

        <div class="accordion mb-3" id="accordionGigi">

          <!-- 1. PEMERIKSAAN & TANDA VITAL -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_1">
              <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_1" aria-expanded="true" aria-controls="collapse_sec_1">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-journal-medical me-2 text-secondary"></i> 1. Pemeriksaan &amp; Tanda Vital</span>
              </button>
            </h2>
            <div id="collapse_sec_1" class="accordion-collapse collapse show" aria-labelledby="heading_sec_1" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="row g-2 mb-2">
                  <div class="col-md-12">
                    <label class="f-label">Keluhan Utama</label>
                    <textarea class="f-input" rows="2" data-field="keluhanUtama" placeholder="Keluhan utama pasien...">${v("keluhanUtama")}</textarea>
                  </div>
                </div>
                <div class="row g-2">
                  <div class="col-md-4 col-sm-6">
                    <label class="f-label">Tekanan Darah (mmHg)</label>
                    <input type="text" class="f-input" data-field="td" value="${v("td")}" placeholder="120/80">
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <label class="f-label">Pernafasan (x/Menit)</label>
                    <input type="text" class="f-input" data-field="rr" value="${v("rr")}" placeholder="20">
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <label class="f-label">Berat Badan (Kg)</label>
                    <input type="text" class="f-input" data-field="bb" value="${v("bb")}" placeholder="60">
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <label class="f-label">Nadi (x/Menit)</label>
                    <input type="text" class="f-input" data-field="nadi" value="${v("nadi")}" placeholder="80">
                  </div>
                  <div class="col-md-2 col-sm-6">
                    <label class="f-label">Suhu (&deg;C)</label>
                    <input type="text" class="f-input" data-field="suhu" value="${v("suhu")}" placeholder="36.5">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. KELUHAN UMUM -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_2">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_2" aria-expanded="false" aria-controls="collapse_sec_2">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-list-check me-2 text-secondary"></i> 2. Keluhan Umum (Dewasa &amp; Anak)</span>
              </button>
            </h2>
            <div id="collapse_sec_2" class="accordion-collapse collapse" aria-labelledby="heading_sec_2" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">

                <!-- Quick Action Buttons for Adult / Children -->
                <div class="d-flex flex-wrap gap-2 mb-3 p-2 bg-light border rounded align-items-center">
                  <span class="small fw-bold text-secondary me-1"><i class="bi bi-lightning-charge me-1"></i>Aksi Cepat:</span>
                  <button type="button" class="btn btn-sm btn-outline-primary py-1" id="btn-mode-dewasa" title="Set Dewasa = Tidak Ada, Anak = Kosong">
                    <i class="bi bi-person-fill me-1"></i>Pasien Dewasa (Kosongkan Anak)
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-info py-1" id="btn-mode-anak" title="Set Anak = Tidak Ada, Dewasa = Kosong">
                    <i class="bi bi-emoji-smile-fill me-1"></i>Pasien Anak (Kosongkan Dewasa)
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary py-1" id="btn-empty-anak">
                    <i class="bi bi-eraser me-1"></i>Kosongkan Anak Saja
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-secondary py-1" id="btn-empty-dewasa">
                    <i class="bi bi-eraser me-1"></i>Kosongkan Dewasa Saja
                  </button>
                  <button type="button" class="btn btn-sm btn-outline-danger py-1" id="btn-empty-keluhan-all">
                    <i class="bi bi-x-circle me-1"></i>Kosongkan Semua
                  </button>
                </div>

                <div class="table-responsive">
                  <table class="table table-bordered table-sm align-middle mb-0" style="font-size:12px;">
                    <thead class="table-light text-center">
                      <tr>
                        <th style="width:4%;">NO</th>
                        <th style="width:26%; text-align:left;">DEWASA</th>
                        <th style="width:20%;">STATUS</th>
                        <th style="width:4%;">NO</th>
                        <th style="width:26%; text-align:left;">ANAK</th>
                        <th style="width:20%;">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${keluhanRowsHtml}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. RIWAYAT KESEHATAN UMUM -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_3">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_3" aria-expanded="false" aria-controls="collapse_sec_3">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-heart-pulse me-2 text-secondary"></i> 3. Riwayat Kesehatan Umum</span>
              </button>
            </h2>
            <div id="collapse_sec_3" class="accordion-collapse collapse" aria-labelledby="heading_sec_3" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <button type="button" class="btn btn-sm btn-outline-secondary py-1" id="btn-empty-sec3">
                    <i class="bi bi-eraser me-1"></i>Kosongkan Bagian Ini
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table table-bordered table-sm align-middle mb-0" style="font-size:12px;">
                    <thead class="table-light">
                      <tr>
                        <th style="width:80%; text-align:left;">PERTANYAAN</th>
                        <th style="width:20%; text-align:center;">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1. Pasien merasa dalam keadaan sehat</td>
                        <td class="text-center">${selectYaTidak("rw_sehat")}</td>
                      </tr>
                      <tr>
                        <td>
                          <div>2. Selama 5 tahun terakhir ini, pasien pernah dinyatakan mengalami penyakit serius, menjalani operasi atau dirawat inap di rumah sakit ?</div>
                          <div class="mt-1 d-flex align-items-center gap-2">
                            <span class="small text-muted">Jika YA, tulis nama penyakitnya:</span>
                            <input type="text" class="f-input" data-field="rw_serius_op_nama" value="${v("rw_serius_op_nama")}" placeholder="Nama penyakit / operasi...">
                          </div>
                        </td>
                        <td class="text-center">${selectYaTidak("rw_serius_op")}</td>
                      </tr>
                      <tr>
                        <td>3. Pasien mempunyai kelainan pembekuan darah</td>
                        <td class="text-center">${selectYaTidak("rw_pembekuan_darah")}</td>
                      </tr>
                      <tr>
                        <td>
                          <div>4. Pasien mempunyai reaksi alergi terhadap hal-hal sebagai berikut :</div>
                          <div class="row g-2 mt-1">
                            <div class="col-md-6 d-flex justify-content-between align-items-center border-bottom pb-1">
                              <span>- Makanan</span>
                              ${selectYaTidak("rw_alergi_makanan")}
                            </div>
                            <div class="col-md-6 d-flex justify-content-between align-items-center border-bottom pb-1">
                              <span>- Obat-obatan</span>
                              ${selectYaTidak("rw_alergi_obat")}
                            </div>
                            <div class="col-md-6 d-flex justify-content-between align-items-center border-bottom pb-1">
                              <span>- Obat yang disuntik (obat bius)</span>
                              ${selectYaTidak("rw_alergi_bius")}
                            </div>
                            <div class="col-md-6 d-flex justify-content-between align-items-center border-bottom pb-1">
                              <span>- Cuaca dan lainnya</span>
                              ${selectYaTidak("rw_alergi_cuaca")}
                            </div>
                          </div>
                        </td>
                        <td class="text-center text-muted small align-middle">(Pilihan di samping)</td>
                      </tr>
                      <tr>
                        <td>
                          <div>5. Pasien sedang dalam perawatan / mengonsumsi obat yang diresepkan / tidak diresepkan oleh dokter / dokter gigi</div>
                          <div class="mt-1">
                            <input type="text" class="f-input" data-field="rw_konsumsi_obat_ket" value="${v("rw_konsumsi_obat_ket")}" placeholder="Tuliskan nama obat bila ada...">
                          </div>
                        </td>
                        <td class="text-center">${selectYaTidak("rw_konsumsi_obat")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- 4. RIWAYAT KESEHATAN GIGI & KEBIASAAN -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_4">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_4" aria-expanded="false" aria-controls="collapse_sec_4">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-shield-check me-2 text-secondary"></i> 4. Riwayat Kesehatan Gigi &amp; Kebiasaan (Perawat)</span>
              </button>
            </h2>
            <div id="collapse_sec_4" class="accordion-collapse collapse" aria-labelledby="heading_sec_4" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <button type="button" class="btn btn-sm btn-outline-secondary py-1" id="btn-empty-sec4">
                    <i class="bi bi-eraser me-1"></i>Kosongkan Bagian Ini
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table table-bordered table-sm align-middle mb-0" style="font-size:12px;">
                    <thead class="table-light">
                      <tr>
                        <th style="width:80%; text-align:left;">PERTANYAAN / KEBIASAAN</th>
                        <th style="width:20%; text-align:center;">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1. Pasien pernah dirawat gigi sebelumnya</td>
                        <td class="text-center">${selectYaTidak("rw_gigi_pernah_rawat")}</td>
                      </tr>
                      <tr>
                        <td>2. Jika sudah pernah dirawat sebelumnya, apakah pengalaman perawatannya tidak memuaskan / menjadi cemas / takut diperiksa ulang</td>
                        <td class="text-center">${selectYaTidak("rw_gigi_cemas")}</td>
                      </tr>
                      <tr>
                        <td>3. Pasien mengetahui bagaimana cara memelihara Kesehatan gigi dan mulut yang baik dan benar</td>
                        <td class="text-center">${selectYaTidak("rw_gigi_tahu_cara")}</td>
                      </tr>
                      <tr>
                        <td>4. Pasien menyikat gigi sebanyak 2 kali sehari atau lebih dan waktunya adalah sesudah makan dan sebelum tidur</td>
                        <td class="text-center">${selectYaTidak("rw_gigi_sikat")}</td>
                      </tr>
                      <tr>
                        <td>5. Pasien menjaga Kesehatan gigi dengan mengurangi makanan yang lengket dan manis-manis serta memperbanyak makanan buah-buahan</td>
                        <td class="text-center">${selectYaTidak("rw_gigi_jaga_makan")}</td>
                      </tr>
                      <tr class="table-light">
                        <th colspan="2" class="fw-bold text-dark">Pasien mempunyai kebiasaan sebagai berikut :</th>
                      </tr>
                      <tr>
                        <td class="ps-4">- Minum teh / kopi</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_kopi")}</td>
                      </tr>
                      <tr>
                        <td class="ps-4">- Minum beralkohol</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_alkohol")}</td>
                      </tr>
                      <tr>
                        <td class="ps-4">- Minuman bersoda</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_soda")}</td>
                      </tr>
                      <tr>
                        <td class="ps-4">- Merokok</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_merokok")}</td>
                      </tr>
                      <tr>
                        <td class="ps-4">- Mengunyah satu sisi</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_satu_sisi")}</td>
                      </tr>
                      <tr>
                        <td class="ps-4">- Mengunyah sirih / tembakau</td>
                        <td class="text-center">${selectYaTidak("kebiasaan_sirih")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. PEMERIKSAAN OBYEKTIF -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_5">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_5" aria-expanded="false" aria-controls="collapse_sec_5">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-eye me-2 text-secondary"></i> 5. Pemeriksaan Obyektif (Ekstra &amp; Intra Oral)</span>
              </button>
            </h2>
            <div id="collapse_sec_5" class="accordion-collapse collapse" aria-labelledby="heading_sec_5" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="fw-bold mb-2">A. Pemeriksaan Ekstra Oral</div>
                <div class="row g-2 mb-3">
                  <div class="col-md-6">
                    <label class="f-label">1. Muka</label>
                    <input type="text" class="f-input" data-field="obj_muka" value="${v("obj_muka", "Simetris")}" placeholder="Keterangan muka...">
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">2. Kelenjar Lymphe</label>
                    <input type="text" class="f-input" data-field="obj_kelenjar_lymphe" value="${v("obj_kelenjar_lymphe", "Tidak teraba / normal")}" placeholder="Kelenjar lymphe...">
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold">B. Pemeriksaan Intra Oral (Jaringan Lunak Mulut)</span>
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-outline-success py-0" id="btn-set-all-normal-intra" style="font-size:11px;">
                      <i class="bi bi-check-all me-1"></i>Set Semua Normal
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-secondary py-0" id="btn-empty-sec5" style="font-size:11px;">
                      <i class="bi bi-eraser me-1"></i>Kosongkan Semua
                    </button>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-bordered table-sm align-middle mb-0" style="font-size:12px;">
                    <thead class="table-light">
                      <tr>
                        <th style="width:25%; text-align:left;">JARINGAN LUNAK</th>
                        <th style="width:25%;">STATUS</th>
                        <th style="width:50%; text-align:left;">KETERANGAN KELAINAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${[
                        { label: "Bibir", key: "obj_bibir" },
                        { label: "Ludah", key: "obj_ludah" },
                        { label: "Mukosa Bukal", key: "obj_mukosa_bukal" },
                        { label: "Mukosa Palatinal", key: "obj_mukosa_palatinal" },
                        { label: "Gingiva", key: "obj_gingiva" },
                        { label: "Lidah", key: "obj_lidah" },
                        { label: "Dasar Mulut", key: "obj_dasar_mulut" },
                        { label: "Palatum Keras", key: "obj_palatum_keras" },
                        { label: "Palatum Lunak", key: "obj_palatum_lunak" },
                        { label: "Pharynx", key: "obj_pharynx" }
                      ].map(item => {
                        const statusVal = v(item.key, "");
                        const ketKey = item.key + "_ket";
                        return `
                          <tr>
                            <td class="fw-bold">- ${item.label}</td>
                            <td>
                              <select class="f-input" data-field="${item.key}">
                                <option value="" ${statusVal === "" ? "selected" : ""}>- (Kosong)</option>
                                <option value="normal" ${statusVal === "normal" ? "selected" : ""}>Normal</option>
                                <option value="kelainan" ${statusVal === "kelainan" ? "selected" : ""}>Ada Kelainan</option>
                              </select>
                            </td>
                            <td>
                              <input type="text" class="f-input" data-field="${ketKey}" value="${v(ketKey)}" placeholder="Deskripsi jika ada kelainan...">
                            </td>
                          </tr>
                        `;
                      }).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. ODONTOGRAM -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_6">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_6" aria-expanded="false" aria-controls="collapse_sec_6">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-grid-3x3-gap me-2 text-secondary"></i> 6. Odontogram &amp; Pemeriksaan Tambahan</span>
              </button>
            </h2>
            <div id="collapse_sec_6" class="accordion-collapse collapse" aria-labelledby="heading_sec_6" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="mb-2 fw-bold text-dark">TABEL GIGI ATAS (UPPER TEETH)</div>
                <div class="table-responsive mb-3">
                  <table class="table table-bordered table-sm align-middle text-center mb-0" style="font-size:12px;">
                    <thead class="table-light">
                      <tr>
                        <th style="width:18%; text-align:left;">KANAN (R)</th>
                        <th style="width:32%; text-align:left;">KONDISI / DIAGNOSIS KANAN</th>
                        <th style="width:32%; text-align:left;">KONDISI / DIAGNOSIS KIRI</th>
                        <th style="width:18%; text-align:right;">KIRI (L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderToothInputs(upperTeeth)}
                    </tbody>
                  </table>
                </div>

                <!-- SKEMA GIGI IMAGE DISPLAY -->
                <div class="text-center my-3 p-2 border rounded bg-white" style="text-align:center;">
                  <div class="fw-bold mb-2 text-primary small"><i class="bi bi-image me-1"></i> SKEMA DIAGRAM ODONTOGRAM</div>
                  <img src="assets/img/gigi.jpg" alt="Skema Odontogram Gigi" style="max-width:100%; max-height:240px; object-fit:contain; border:1px solid #ddd; border-radius:4px; padding:4px; background:#fff; display:inline-block;">
                </div>

                <div class="mb-2 fw-bold text-dark">TABEL GIGI BAWAH (LOWER TEETH)</div>
                <div class="table-responsive mb-3">
                  <table class="table table-bordered table-sm align-middle text-center mb-0" style="font-size:12px;">
                    <thead class="table-light">
                      <tr>
                        <th style="width:18%; text-align:left;">KANAN (R)</th>
                        <th style="width:32%; text-align:left;">KONDISI / DIAGNOSIS KANAN</th>
                        <th style="width:32%; text-align:left;">KONDISI / DIAGNOSIS KIRI</th>
                        <th style="width:18%; text-align:right;">KIRI (L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${renderToothInputs(lowerTeeth)}
                    </tbody>
                  </table>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4 mb-2">
                  <span class="fw-bold">Pemeriksaan Tambahan Lainnya</span>
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary py-0" id="btn-empty-sec6" style="font-size:11px;">
                      <i class="bi bi-eraser me-1"></i>Kosongkan Tambahan
                    </button>
                  </div>
                </div>
                <div class="row g-2">
                  <div class="col-md-6">
                    <label class="f-label">Occlusi</label>
                    <select class="f-input" data-field="occlusi">
                      <option value="" ${v("occlusi") === "" ? "selected" : ""}>- (Kosong)</option>
                      <option value="Normal Bite" ${v("occlusi") === "Normal Bite" ? "selected" : ""}>Normal Bite</option>
                      <option value="Cross Bite" ${v("occlusi") === "Cross Bite" ? "selected" : ""}>Cross Bite</option>
                      <option value="Steep Bite" ${v("occlusi") === "Steep Bite" ? "selected" : ""}>Steep Bite</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Torus Palatinus</label>
                    <select class="f-input" data-field="torus_palatinus">
                      <option value="" ${v("torus_palatinus") === "" ? "selected" : ""}>- (Kosong)</option>
                      <option value="Tidak Ada" ${v("torus_palatinus") === "Tidak Ada" ? "selected" : ""}>Tidak Ada</option>
                      <option value="Kecil" ${v("torus_palatinus") === "Kecil" ? "selected" : ""}>Kecil</option>
                      <option value="Sedang" ${v("torus_palatinus") === "Sedang" ? "selected" : ""}>Sedang</option>
                      <option value="Besar" ${v("torus_palatinus") === "Besar" ? "selected" : ""}>Besar</option>
                      <option value="Multiple" ${v("torus_palatinus") === "Multiple" ? "selected" : ""}>Multiple</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Torus Mandibularis</label>
                    <select class="f-input" data-field="torus_mandibularis">
                      <option value="" ${v("torus_mandibularis") === "" ? "selected" : ""}>- (Kosong)</option>
                      <option value="Tidak ada" ${v("torus_mandibularis") === "Tidak ada" ? "selected" : ""}>Tidak ada</option>
                      <option value="sisi kiri" ${v("torus_mandibularis") === "sisi kiri" ? "selected" : ""}>sisi kiri</option>
                      <option value="sisi kanan" ${v("torus_mandibularis") === "sisi kanan" ? "selected" : ""}>sisi kanan</option>
                      <option value="kedua sisi" ${v("torus_mandibularis") === "kedua sisi" ? "selected" : ""}>kedua sisi</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Palatum</label>
                    <select class="f-input" data-field="palatum">
                      <option value="" ${v("palatum") === "" ? "selected" : ""}>- (Kosong)</option>
                      <option value="Sedang" ${v("palatum") === "Sedang" ? "selected" : ""}>Sedang</option>
                      <option value="Dalam" ${v("palatum") === "Dalam" ? "selected" : ""}>Dalam</option>
                      <option value="Rendah" ${v("palatum") === "Rendah" ? "selected" : ""}>Rendah</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Diastema</label>
                    <div class="d-flex gap-2">
                      <select class="f-input" style="max-width:130px;" data-field="diastema">
                        <option value="" ${v("diastema") === "" ? "selected" : ""}>- (Kosong)</option>
                        <option value="Tidak Ada" ${v("diastema") === "Tidak Ada" ? "selected" : ""}>Tidak Ada</option>
                        <option value="Ada" ${v("diastema") === "Ada" ? "selected" : ""}>Ada</option>
                      </select>
                      <input type="text" class="f-input" data-field="diastema_ket" value="${v("diastema_ket")}" placeholder="Dimana dan berapa lebarnya...">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Gigi Anomali</label>
                    <div class="d-flex gap-2">
                      <select class="f-input" style="max-width:130px;" data-field="gigi_anomali">
                        <option value="" ${v("gigi_anomali") === "" ? "selected" : ""}>- (Kosong)</option>
                        <option value="Tidak Ada" ${v("gigi_anomali") === "Tidak Ada" ? "selected" : ""}>Tidak Ada</option>
                        <option value="Ada" ${v("gigi_anomali") === "Ada" ? "selected" : ""}>Ada</option>
                      </select>
                      <input type="text" class="f-input" data-field="gigi_anomali_ket" value="${v("gigi_anomali_ket")}" placeholder="Gigi yang mana, dan bentuknya...">
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label class="f-label">Lain-lain</label>
                    <input type="text" class="f-input" data-field="lain_lain" value="${v("lain_lain")}" placeholder="Hal-hal yang tidak tercakup diatas...">
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Jumlah photo yang diambil (digital/intraoral)</label>
                    <input type="text" class="f-input" data-field="jumlah_photo" value="${v("jumlah_photo")}" placeholder="misal: 2 photo">
                  </div>
                  <div class="col-md-6">
                    <label class="f-label">Jumlah rontgen photo yang diambil (Dental/PA/OPG/Ceph)</label>
                    <input type="text" class="f-input" data-field="jumlah_rontgen" value="${v("jumlah_rontgen")}" placeholder="misal: 1 foto OPG">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 7. PEMERIKSA & TANDA TANGAN -->
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_sec_7">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_sec_7" aria-expanded="false" aria-controls="collapse_sec_7">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-pen me-2 text-secondary"></i> 7. Dokter Pemeriksa &amp; Tanda Tangan</span>
              </button>
            </h2>
            <div id="collapse_sec_7" class="accordion-collapse collapse" aria-labelledby="heading_sec_7" data-bs-parent="#accordionGigi">
              <div class="accordion-body bg-white p-3">
                <div class="row g-3">
                  <div class="col-md-5">
                    <div class="mb-3">
                      <label class="f-label" style="font-weight:600; font-size:12.5px; color:#212529;"><i class="bi bi-person-badge me-1"></i>Nama Dokter Gigi Pemeriksa</label>
                      <input type="text" class="f-input" data-field="drg_nama" value="${v("drg_nama", p.dokterDpjp || p.dpjp || p.namaDokter || "")}" placeholder="drg. Nama Dokter Gigi...">
                    </div>
                    <div class="mb-2">
                      <label class="f-label" style="font-weight:600; font-size:12.5px; color:#212529;"><i class="bi bi-calendar-event me-1"></i>Tanggal Pemeriksaan</label>
                      <input type="date" class="f-input" data-field="tgl_pemeriksaan" value="${v("tgl_pemeriksaan")}">
                    </div>
                  </div>
                  <div class="col-md-7">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <label class="f-label mb-0" style="font-weight:600; font-size:12.5px; color:#212529;">
                        <i class="bi bi-pen me-1"></i>TTD &amp; Paraf Signature Box
                      </label>
                      <div>
                        <button type="button" class="btn btn-sm btn-outline-primary me-1" id="btn-use-saved-sig" style="font-size:11px; padding:2px 8px;">
                          <i class="bi bi-person-check me-1"></i>Gunakan TTD Saya
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="btn-clear-signature" style="font-size:11px; padding:2px 8px;">
                          <i class="bi bi-eraser me-1"></i>Hapus TTD
                        </button>
                      </div>
                    </div>
                    <div style="border:1px solid #ced4da; border-radius:6px; background:#ffffff; overflow:hidden; position:relative;">
                      <canvas id="gigi-signature-pad" width="600" height="180" style="display:block; width:100%; height:135px; cursor:crosshair; touch-action:none; position:relative; z-index:2; background:transparent;"></canvas>
                      <div style="position:absolute; bottom:25px; left:20px; right:20px; border-bottom:1px dashed #cbd5e1; height:1px; pointer-events:none; z-index:1;"></div>
                      <div style="position:absolute; bottom:6px; right:12px; font-size:10px; color:#94a3b8; pointer-events:none; z-index:1;">
                        <i class="bi bi-pen me-1"></i>Tanda Tangan Di Sini
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ACTION BUTTONS BOTTOM (POLI THEME) -->
        <div class="d-flex justify-content-end gap-2 mt-3 border-top pt-3">
          <button type="button" class="btn btn-outline-success surat-download-pdf-btn px-3"><i class="bi bi-file-earmark-pdf-fill me-1"></i>Simpan sebagai PDF</button>
          <button type="button" id="btn-save-gigi" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Data</button>
        </div>
      `;

      const extraCss = `
        .gigi-print-container { width:100%; display:flex; flex-direction:column; align-items:center; }
        .gigi-page { box-sizing:border-box !important; width:215.9mm !important; min-height:355.6mm !important; padding:12mm 15mm !important; margin:0 auto 20px auto !important; background:#fff; border:1px solid #ccc; box-shadow:0 0 10px rgba(0,0,0,0.1); font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:1.4; color:#000; position:relative; text-align:left !important; }
        .gigi-page * { text-align:left; box-sizing:border-box; }
        .gigi-page .text-center, .gigi-page th.text-center, .gigi-page td.text-center { text-align:center !important; }
        .gigi-page .text-end, .gigi-page th.text-end, .gigi-page td.text-end { text-align:right !important; }
        @media print {
          .gigi-page { width:100% !important; min-height:100% !important; padding:10mm 15mm !important; margin:0 !important; border:none !important; box-shadow:none !important; page-break-after:always !important; break-after:page !important; text-align:left !important; }
          .gigi-page:last-child { page-break-after:avoid !important; break-after:avoid !important; }
        }
        .gigi-data-table { width:100%; border-collapse:collapse; margin-bottom:12px; }
        .gigi-data-table th, .gigi-data-table td { border:1px solid #000; padding:4px 6px; font-size:11.5px; text-align:left; }
        .gigi-data-table th { background:#f2f2f2; font-weight:bold; }
        .gigi-vital-table { width:100%; border-collapse:collapse; margin:6px 0 12px 0; }
        .gigi-vital-table td { border:none; padding:4px 2px; font-size:12px; text-align:left; }
        .gigi-field-table { width:100%; border-collapse:collapse; margin:3px 0; }
        .gigi-field-table td { border:none; padding:3px 0; vertical-align:top; font-size:12px; text-align:left; }
        .gigi-odonto-table { width:100%; border-collapse:collapse; margin:4px 0; }
        .gigi-odonto-table td { border:1px solid #000; height:20px; padding:2px 6px; font-size:11px; vertical-align:middle; text-align:left; }
        .gigi-sub-item { padding-left:22px !important; text-align:left !important; }
        .gigi-dotted-line { display:inline-block; border-bottom:1px dotted #000; min-height:14px; text-align:left; }
      `;

      root.innerHTML = createSuratShell({
        idPrefix: 'pengkajian-awal-gigi',
        wrapperTag: 'app-pengkajian-awal-gigi-placeholder',
        inputPaneId: 'gigi-input-pane',
        printPaneId: 'gigi-print-pane',
        printTabId: 'gigi-print-tab',
        tabsClass: 'gigi-tabs',
        extraCss: extraCss,
        inputContent: inputContent,
        printContent: '<div id="gigi-print-container" class="gigi-print-container"></div>'
      });

      // Signature canvas setup
      const canvas = root.querySelector("#gigi-signature-pad");
      if (canvas) {
        const ctx = canvas.getContext("2d");
        let isDrawing = false;
        let lastX = 0, lastY = 0;

        const getPos = (ev) => {
          const r = canvas.getBoundingClientRect();
          const sx = canvas.width / r.width;
          const sy = canvas.height / r.height;
          if (ev.touches && ev.touches[0]) {
            return [(ev.touches[0].clientX - r.left) * sx, (ev.touches[0].clientY - r.top) * sy];
          }
          return [(ev.clientX - r.left) * sx, (ev.clientY - r.top) * sy];
        };

        const startDraw = (ev) => {
          isDrawing = true;
          [lastX, lastY] = getPos(ev);
        };

        const moveDraw = (ev) => {
          if (!isDrawing) return;
          const [x, y] = getPos(ev);
          ctx.beginPath();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          [lastX, lastY] = [x, y];
        };

        const stopDraw = () => {
          if (isDrawing) {
            isDrawing = false;
            this.formData.ttdImage = canvas.toDataURL("image/png");
          }
        };

        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", moveDraw);
        canvas.addEventListener("mouseup", stopDraw);
        canvas.addEventListener("mouseleave", stopDraw);
        canvas.addEventListener("touchstart", (ev) => { ev.preventDefault(); startDraw(ev); }, { passive: false });
        canvas.addEventListener("touchmove", (ev) => { ev.preventDefault(); moveDraw(ev); }, { passive: false });
        canvas.addEventListener("touchend", stopDraw);

        const btnUseSavedSig = root.querySelector("#btn-use-saved-sig");
        if (btnUseSavedSig) {
          btnUseSavedSig.addEventListener("click", () => {
            const savedSig = localStorage.getItem("signatureImage") || localStorage.getItem("userSignature") || "";
            if (!savedSig) {
              showErrorAlert("Belum ada TTD tersimpan di profil/browser Anda.");
              return;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              this.formData.ttdImage = canvas.toDataURL("image/png");
            };
            img.src = savedSig;
          });
        }

        const btnClear = root.querySelector("#btn-clear-signature");
        if (btnClear) {
          btnClear.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.formData.ttdImage = null;
          };
        }

        // Restore saved signature if exists
        if (this.formData.ttdImage) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = this.formData.ttdImage;
        }
      }

      // Quick action helper event listeners
      const btnModeDewasa = root.querySelector("#btn-mode-dewasa");
      if (btnModeDewasa) {
        btnModeDewasa.onclick = () => {
          keluhanItems.forEach(item => {
            const elD = root.querySelector(`select[data-field="keluhan_dewasa_${item.key}"]`);
            if (elD && !elD.value) elD.value = "tidak_ada";
            const elA = root.querySelector(`select[data-field="keluhan_anak_${item.key}"]`);
            if (elA) elA.value = "";
            const elAKet = root.querySelector(`input[data-field="keluhan_anak_${item.key}_ket"]`);
            if (elAKet) elAKet.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnModeAnak = root.querySelector("#btn-mode-anak");
      if (btnModeAnak) {
        btnModeAnak.onclick = () => {
          keluhanItems.forEach(item => {
            const elA = root.querySelector(`select[data-field="keluhan_anak_${item.key}"]`);
            if (elA && !elA.value) elA.value = "tidak_ada";
            const elD = root.querySelector(`select[data-field="keluhan_dewasa_${item.key}"]`);
            if (elD) elD.value = "";
            const elDKet = root.querySelector(`input[data-field="keluhan_dewasa_${item.key}_ket"]`);
            if (elDKet) elDKet.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptyAnak = root.querySelector("#btn-empty-anak");
      if (btnEmptyAnak) {
        btnEmptyAnak.onclick = () => {
          keluhanItems.forEach(item => {
            const elA = root.querySelector(`select[data-field="keluhan_anak_${item.key}"]`);
            if (elA) elA.value = "";
            const elAKet = root.querySelector(`input[data-field="keluhan_anak_${item.key}_ket"]`);
            if (elAKet) elAKet.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptyDewasa = root.querySelector("#btn-empty-dewasa");
      if (btnEmptyDewasa) {
        btnEmptyDewasa.onclick = () => {
          keluhanItems.forEach(item => {
            const elD = root.querySelector(`select[data-field="keluhan_dewasa_${item.key}"]`);
            if (elD) elD.value = "";
            const elDKet = root.querySelector(`input[data-field="keluhan_dewasa_${item.key}_ket"]`);
            if (elDKet) elDKet.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptyKeluhanAll = root.querySelector("#btn-empty-keluhan-all");
      if (btnEmptyKeluhanAll) {
        btnEmptyKeluhanAll.onclick = () => {
          keluhanItems.forEach(item => {
            const elD = root.querySelector(`select[data-field="keluhan_dewasa_${item.key}"]`);
            if (elD) elD.value = "";
            const elDKet = root.querySelector(`input[data-field="keluhan_dewasa_${item.key}_ket"]`);
            if (elDKet) elDKet.value = "";
            const elA = root.querySelector(`select[data-field="keluhan_anak_${item.key}"]`);
            if (elA) elA.value = "";
            const elAKet = root.querySelector(`input[data-field="keluhan_anak_${item.key}_ket"]`);
            if (elAKet) elAKet.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptySec3 = root.querySelector("#btn-empty-sec3");
      if (btnEmptySec3) {
        btnEmptySec3.onclick = () => {
          [
            "rw_sehat", "rw_serius_op", "rw_pembekuan_darah",
            "rw_alergi_makanan", "rw_alergi_obat", "rw_alergi_bius", "rw_alergi_cuaca",
            "rw_konsumsi_obat"
          ].forEach(f => {
            const sel = root.querySelector(`select[data-field="${f}"]`);
            if (sel) sel.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptySec4 = root.querySelector("#btn-empty-sec4");
      if (btnEmptySec4) {
        btnEmptySec4.onclick = () => {
          [
            "rw_gigi_pernah_rawat", "rw_gigi_cemas", "rw_gigi_tahu_cara", "rw_gigi_sikat",
            "rw_gigi_jaga_makan", "kebiasaan_kopi", "kebiasaan_alkohol", "kebiasaan_soda",
            "kebiasaan_merokok", "kebiasaan_satu_sisi", "kebiasaan_sirih"
          ].forEach(f => {
            const sel = root.querySelector(`select[data-field="${f}"]`);
            if (sel) sel.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnSetAllNormalIntra = root.querySelector("#btn-set-all-normal-intra");
      if (btnSetAllNormalIntra) {
        btnSetAllNormalIntra.onclick = () => {
          [
            "obj_bibir", "obj_ludah", "obj_mukosa_bukal", "obj_mukosa_palatinal",
            "obj_gingiva", "obj_lidah", "obj_dasar_mulut", "obj_palatum_keras",
            "obj_palatum_lunak", "obj_pharynx"
          ].forEach(f => {
            const sel = root.querySelector(`select[data-field="${f}"]`);
            if (sel) sel.value = "normal";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptySec5 = root.querySelector("#btn-empty-sec5");
      if (btnEmptySec5) {
        btnEmptySec5.onclick = () => {
          [
            "obj_bibir", "obj_ludah", "obj_mukosa_bukal", "obj_mukosa_palatinal",
            "obj_gingiva", "obj_lidah", "obj_dasar_mulut", "obj_palatum_keras",
            "obj_palatum_lunak", "obj_pharynx"
          ].forEach(f => {
            const sel = root.querySelector(`select[data-field="${f}"]`);
            if (sel) sel.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptySec6 = root.querySelector("#btn-empty-sec6");
      if (btnEmptySec6) {
        btnEmptySec6.onclick = () => {
          ["occlusi", "torus_palatinus", "torus_mandibularis", "palatum", "diastema", "gigi_anomali"].forEach(f => {
            const sel = root.querySelector(`select[data-field="${f}"]`);
            if (sel) sel.value = "";
          });
          this.syncFormDataFromDOM();
        };
      }

      const btnEmptyAllSelects = root.querySelector("#btn-empty-all-selects");
      if (btnEmptyAllSelects) {
        btnEmptyAllSelects.onclick = () => {
          root.querySelectorAll("select[data-field]").forEach(s => s.value = "");
          this.syncFormDataFromDOM();
        };
      }

      // Save button handler
      const btnSave = root.querySelector("#btn-save-gigi");
      if (btnSave) btnSave.onclick = () => this.handleSubmit();

      // Print tab & PDF setup
      const printTab = root.querySelector("#gigi-print-tab");
      const updatePrint = () => {
        this.syncFormDataFromDOM();
        const container = root.querySelector("#gigi-print-container");
        if (container) {
          container.innerHTML = t.getPrintHtml(this.patient || { noMr, nama, tglLahir, kelamin }, this.formData);
        }
      };

      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      const pdfFilename = buildSuratPdfFilename('PENGKAJIAN_AWAL_POLI_GIGI', this.patient?.noMr || noMr, this.patient?.nama || nama);
      bindSuratPrintButton(root, pdfFilename, {
        pageOrientation: 'portrait',
        unit: 'mm',
        format: [215.9, 355.6]
      });

      updatePrint();
    }

    static getPrintHtml(patient, formData) {
      const p = patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const fd = formData || {};

      const v = (key, def = "-") => (fd[key] !== undefined && fd[key] !== null && String(fd[key]).trim() !== "" ? String(fd[key]).trim() : def);

      const statusText = (key) => {
        const val = fd[key];
        if (val === "ada") return '<span style="color:#d9534f; font-weight:bold;">Ada</span>';
        if (val === "tidak_ada") return "Tidak ada";
        return "-";
      };

      const statusWithKet = (key, ketKey) => {
        const st = statusText(key);
        const ket = v(ketKey, "");
        if (ket && ket !== "-") return `${st} (${ket})`;
        return st;
      };

      const checkYaTidak = (key) => {
        const val = fd[key];
        const isYa = val === "ya";
        const isTidak = val === "tidak";
        return {
          ya: isYa ? '<span style="font-weight:bold; font-size:13px;">&#10003;</span>' : '',
          tidak: isTidak ? '<span style="font-weight:bold; font-size:13px;">&#10003;</span>' : ''
        };
      };

      const formatYaTidakPrint = (key) => {
        const val = fd[key];
        if (val === "ya") return '<strong style="color:#d9534f;">YA</strong>';
        if (val === "tidak") return '<strong>TIDAK</strong>';
        return '-';
      };

      const normalOrKelainan = (key, ketKey) => {
        const val = fd[key];
        const ket = v(ketKey, "");
        if (val === "normal") return "Normal";
        if (val === "kelainan") return `<span style="color:#d9534f; font-weight:bold;">Ada Kelainan</span>${ket && ket !== "-" ? ` : ${ket}` : ""}`;
        return "-";
      };

      const keluhanList = [
        { no: 1, label: "Penyakit Jantung", key: "jantung" },
        { no: 2, label: "Penyakit Diabetes Melitus", key: "dm" },
        { no: 3, label: "Penyakit Haemophilia", key: "haemophilia" },
        { no: 4, label: "Penyakit Hepatitis", key: "hepatitis" },
        { no: 5, label: "Penyakit Gastritis", key: "gastritis" },
        { no: 6, label: "Penyakit Lainnya", key: "lainnya", hasKet: true },
        { no: 7, label: "Alergi terhadap obat", key: "alergi_obat", hasKet: true },
        { no: 8, label: "Alergi terhadap makanan", key: "alergi_makanan", hasKet: true }
      ];

      const keluhanPrintRows = keluhanList.map(item => {
        const dKey = "keluhan_dewasa_" + item.key;
        const aKey = "keluhan_anak_" + item.key;
        const dKetKey = dKey + "_ket";
        const aKetKey = aKey + "_ket";
        return `
          <tr>
            <td style="text-align:center; font-weight:bold;">${item.no}</td>
            <td style="text-align:left;">${item.label}</td>
            <td style="text-align:center;">${statusWithKet(dKey, dKetKey)}</td>
            <td style="text-align:center; font-weight:bold;">${item.no}</td>
            <td style="text-align:left;">${item.label}</td>
            <td style="text-align:center;">${statusWithKet(aKey, aKetKey)}</td>
          </tr>
        `;
      }).join("");

      const upperTeethPrint = [
        { rNum: "11 [51]", rKey: "t_11", lNum: "[61] 21", lKey: "t_21" },
        { rNum: "12 [52]", rKey: "t_12", lNum: "[62] 22", lKey: "t_22" },
        { rNum: "13 [53]", rKey: "t_13", lNum: "[63] 23", lKey: "t_23" },
        { rNum: "14 [54]", rKey: "t_14", lNum: "[64] 24", lKey: "t_24" },
        { rNum: "15 [55]", rKey: "t_15", lNum: "[65] 25", lKey: "t_25" },
        { rNum: "16", rKey: "t_16", lNum: "26", lKey: "t_26" },
        { rNum: "17", rKey: "t_17", lNum: "27", lKey: "t_27" },
        { rNum: "18", rKey: "t_18", lNum: "28", lKey: "t_28" }
      ].map(t => `
        <tr>
          <td style="width:14%; font-weight:bold; text-align:left;">${t.rNum}</td>
          <td style="width:36%; text-align:left;">${v(t.rKey, "")}</td>
          <td style="width:36%; text-align:left;">${v(t.lKey, "")}</td>
          <td style="width:14%; text-align:right; font-weight:bold;">${t.lNum}</td>
        </tr>
      `).join("");

      const lowerTeethPrint = [
        { rNum: "48", rKey: "t_48", lNum: "38", lKey: "t_38" },
        { rNum: "47", rKey: "t_47", lNum: "37", lKey: "t_37" },
        { rNum: "46", rKey: "t_46", lNum: "36", lKey: "t_36" },
        { rNum: "45 [85]", rKey: "t_45", lNum: "[75] 35", lKey: "t_35" },
        { rNum: "44 [84]", rKey: "t_44", lNum: "[74] 34", lKey: "t_34" },
        { rNum: "43 [83]", rKey: "t_43", lNum: "[73] 33", lKey: "t_33" },
        { rNum: "42 [82]", rKey: "t_42", lNum: "[72] 32", lKey: "t_32" },
        { rNum: "41 [81]", rKey: "t_41", lNum: "[71] 31", lKey: "t_31" }
      ].map(t => `
        <tr>
          <td style="width:14%; font-weight:bold; text-align:left;">${t.rNum}</td>
          <td style="width:36%; text-align:left;">${v(t.rKey, "")}</td>
          <td style="width:36%; text-align:left;">${v(t.lKey, "")}</td>
          <td style="width:14%; text-align:right; font-weight:bold;">${t.lNum}</td>
        </tr>
      `).join("");

      const ttdImgHtml = fd.ttdImage ? `<img src="${fd.ttdImage}" style="height:55px; max-height:60px; max-width:180px; object-fit:contain; display:block; margin:2px auto;">` : '<div style="height:55px;"></div>';

      return `
        <!-- PAGE 1 -->
        <div class="gigi-page">
          ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, (s)=>11, 'PENGKAJIAN AWAL RAWAT JALAN POLI GIGI')}

          <div style="font-weight:bold; margin:14px 0 6px 0; font-size:13px; text-transform:uppercase; text-align:left;">PEMERIKSAAN</div>
          <div style="margin:4px 0 12px 0; text-align:left;">
            Keluhan Utama : <span class="gigi-dotted-line" style="width:84%; font-weight:bold;">&nbsp;${v("keluhanUtama")}&nbsp;</span>
          </div>

          <div style="font-weight:bold; margin:12px 0 6px 0; font-size:13px; text-transform:uppercase; text-align:left;">Tanda Vital (perawat)</div>
          <table class="gigi-vital-table">
            <tr>
              <td style="width:33%; text-align:left;">TD : <span class="gigi-dotted-line" style="width:90px; text-align:center;">&nbsp;${v("td")}&nbsp;</span> mmHg</td>
              <td style="width:33%; text-align:left;">RR : <span class="gigi-dotted-line" style="width:85px; text-align:center;">&nbsp;${v("rr")}&nbsp;</span> x/menit</td>
              <td style="width:34%; text-align:left;">Berat Badan : <span class="gigi-dotted-line" style="width:75px; text-align:center;">&nbsp;${v("bb")}&nbsp;</span> Kg</td>
            </tr>
            <tr>
              <td style="text-align:left;">Nadi : <span class="gigi-dotted-line" style="width:80px; text-align:center;">&nbsp;${v("nadi")}&nbsp;</span> x/menit</td>
              <td style="text-align:left;">Suhu : <span class="gigi-dotted-line" style="width:75px; text-align:center;">&nbsp;${v("suhu")}&nbsp;</span> &deg;C</td>
              <td></td>
            </tr>
          </table>

          <div style="font-weight:bold; margin:14px 0 6px 0; font-size:13px; text-transform:uppercase; text-align:left;">Keluhan Umum</div>
          <table class="gigi-data-table">
            <thead>
              <tr>
                <th style="width:6%; text-align:center;">NO</th>
                <th style="width:26%; text-align:left;">DEWASA</th>
                <th style="width:18%; text-align:center;">STATUS</th>
                <th style="width:6%; text-align:center;">NO</th>
                <th style="width:26%; text-align:left;">ANAK</th>
                <th style="width:18%; text-align:center;">STATUS</th>
              </tr>
            </thead>
            <tbody>
              ${keluhanPrintRows}
            </tbody>
          </table>
        </div>

        <!-- PAGE 2 -->
        <div class="gigi-page">
          ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, (s)=>11, 'PENGKAJIAN AWAL RAWAT JALAN POLI GIGI (Lanjutan)')}

          <table class="gigi-data-table" style="margin-top:12px;">
            <thead>
              <tr>
                <th style="width:80%; text-align:left;">RIWAYAT KESEHATAN UMUM</th>
                <th style="width:10%; text-align:center;">YA</th>
                <th style="width:10%; text-align:center;">TIDAK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align:left;">Pasien merasa dalam keadaan sehat</td>
                <td style="text-align:center;">${checkYaTidak("rw_sehat").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_sehat").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">
                  Selama 5 tahun terakhir ini, pasien pernah dinyatakan mengalami penyakit serius, menjalani operasi atau dirawat inap di rumah sakit ? JIKA YA&hellip;&hellip;.<br>
                  Tulis nama penyakitnya : <span class="gigi-dotted-line" style="width:70%; font-weight:bold;">&nbsp;${v("rw_serius_op_nama", "-")}&nbsp;</span>
                </td>
                <td style="text-align:center;">${checkYaTidak("rw_serius_op").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_serius_op").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien mempunyai kelainan pembekuan darah</td>
                <td style="text-align:center;">${checkYaTidak("rw_pembekuan_darah").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_pembekuan_darah").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">
                  Pasien mempunyai reaksi alergi terhadap hal-hal sebagai berikut :<br>
                  - Makanan : ${formatYaTidakPrint("rw_alergi_makanan")}<br>
                  - Obat-obatan : ${formatYaTidakPrint("rw_alergi_obat")}<br>
                  - Obat yang disuntik (obat bius) : ${formatYaTidakPrint("rw_alergi_bius")}<br>
                  - Cuaca dan lainnya : ${formatYaTidakPrint("rw_alergi_cuaca")}
                </td>
                <td style="text-align:center; vertical-align:middle;">-</td>
                <td style="text-align:center; vertical-align:middle;">-</td>
              </tr>
              <tr>
                <td style="text-align:left;">
                  Pasien sedang dalam perawatan / mengonsumsi obat yang diresepkan / tidak diresepkan oleh dokter / dokter gigi<br>
                  ${v("rw_konsumsi_obat_ket") && v("rw_konsumsi_obat_ket") !== "-" ? `Nama obat: <strong>${v("rw_konsumsi_obat_ket")}</strong>` : ""}
                </td>
                <td style="text-align:center;">${checkYaTidak("rw_konsumsi_obat").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_konsumsi_obat").tidak}</td>
              </tr>
              <tr style="background:#f2f2f2;">
                <th colspan="3" style="text-align:left; padding:4px 6px;">RIWAYAT KESEHATAN GIGI (perawat)</th>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien pernah dirawat gigi sebelumnya</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_pernah_rawat").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_pernah_rawat").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Jika sudah pernah dirawat sebelumnya, apakah pengalaman perawatannya tidak memuaskan / menjadi cemas / takut diperiksa ulang</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_cemas").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_cemas").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien mengetahui bagaimana cara memelihara Kesehatan gigi dan mulut yang baik dan benar</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_tahu_cara").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_tahu_cara").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien menyikat gigi sebanyak 2 kali sehari atau lebih dan waktunya adalah sesudah makan dan sebelum tidur</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_sikat").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_sikat").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien menjaga Kesehatan gigi dengan mengurangi makanan yang lengket dan manis-manis serta memperbanyak makanan buah-buahan</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_jaga_makan").ya}</td>
                <td style="text-align:center;">${checkYaTidak("rw_gigi_jaga_makan").tidak}</td>
              </tr>
              <tr>
                <td style="text-align:left;">Pasien mempunyai kebiasaan sebagai berikut :</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Minum teh / kopi</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_kopi").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_kopi").tidak}</td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Minum beralkohol</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_alkohol").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_alkohol").tidak}</td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Minuman bersoda</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_soda").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_soda").tidak}</td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Merokok</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_merokok").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_merokok").tidak}</td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Mengunyah satu sisi</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_satu_sisi").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_satu_sisi").tidak}</td>
              </tr>
              <tr>
                <td class="gigi-sub-item">- Mengunyah sirih / tembakau</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_sirih").ya}</td>
                <td style="text-align:center;">${checkYaTidak("kebiasaan_sirih").tidak}</td>
              </tr>
            </tbody>
          </table>

          <div style="font-weight:bold; margin:14px 0 6px 0; font-size:13px; text-transform:uppercase; text-align:left;">PEMERIKSAAN OBYEKTIF</div>
          <div style="margin-left:4px; text-align:left;">
            <strong style="text-align:left;">A. Pemeriksaan Ekstra Oral</strong>
            <table class="gigi-field-table" style="margin-left:15px; width:calc(100% - 15px);">
              <tr>
                <td style="width:140px; text-align:left;">1. Muka</td>
                <td style="width:20px; text-align:center;">:</td>
                <td style="text-align:left;"><span class="gigi-dotted-line" style="width:95%;">&nbsp;${v("obj_muka")}&nbsp;</span></td>
              </tr>
              <tr>
                <td style="text-align:left;">2. Kelenjar Lymphe</td>
                <td style="width:20px; text-align:center;">:</td>
                <td style="text-align:left;"><span class="gigi-dotted-line" style="width:95%;">&nbsp;${v("obj_kelenjar_lymphe")}&nbsp;</span></td>
              </tr>
            </table>

            <strong style="margin-top:6px; display:block; text-align:left;">B. Pemeriksaan Intra Oral</strong>
            <div style="margin-left:15px; margin-top:4px; text-align:left;">
              <strong style="text-align:left;">1. Jaringan Lunak Mulut</strong>
              <table class="gigi-field-table" style="margin-left:15px; width:calc(100% - 15px);">
                <tr>
                  <td style="width:180px; text-align:left;">- Bibir</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_bibir", "obj_bibir_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Ludah</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_ludah", "obj_ludah_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Mukosa Bukal</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_mukosa_bukal", "obj_mukosa_bukal_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Mukosa Palatinal</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_mukosa_palatinal", "obj_mukosa_palatinal_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Gingiva</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_gingiva", "obj_gingiva_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Lidah</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_lidah", "obj_lidah_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Dasar Mulut</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_dasar_mulut", "obj_dasar_mulut_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Palatum Keras</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_palatum_keras", "obj_palatum_keras_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Palatum Lunak</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_palatum_lunak", "obj_palatum_lunak_ket")}</td>
                </tr>
                <tr>
                  <td style="text-align:left;">- Pharynx</td>
                  <td style="width:20px; text-align:center;">:</td>
                  <td style="text-align:left;">${normalOrKelainan("obj_pharynx", "obj_pharynx_ket")}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>

        <!-- PAGE 3 -->
        <div class="gigi-page">
          ${hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, (s)=>11, 'ODONTOGRAM & PEMERIKSAAN GIGI')}

          <div style="font-weight:bold; margin:10px 0 6px 0; font-size:13px; text-transform:uppercase; text-align:left;">ODONTOGRAM</div>

          <!-- Upper Teeth Table -->
          <table class="gigi-odonto-table">
            ${upperTeethPrint}
          </table>

          <!-- Odontogram Chart Image -->
          <div style="width:100%; text-align:center; margin:8px 0;">
            <img src="assets/img/gigi.jpg" alt="Skema Odontogram Gigi" style="max-width:100%; max-height:190px; object-fit:contain; display:block; margin:0 auto;">
          </div>

          <!-- Lower Teeth Table -->
          <table class="gigi-odonto-table">
            ${lowerTeethPrint}
          </table>

          <!-- Additional Findings -->
          <table class="gigi-field-table" style="margin-top:8px;">
            <tr>
              <td style="width:235px; text-align:left;">Occlusi</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("occlusi", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Torus Palatinus</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("torus_palatinus", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Torus Mandibularis</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("torus_mandibularis", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Palatum</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("palatum", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Diastema</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("diastema", "-")}${v("diastema_ket") && v("diastema_ket") !== "-" ? ` : ${v("diastema_ket")}` : ""}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Gigi Anomali</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("gigi_anomali", "-")}${v("gigi_anomali_ket") && v("gigi_anomali_ket") !== "-" ? ` : ${v("gigi_anomali_ket")}` : ""}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Lain-lain</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("lain_lain", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Jumlah photo yang diambil (digital/intraoral)</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("jumlah_photo", "-")}</td>
            </tr>
            <tr>
              <td style="text-align:left;">Jumlah rontgen photo yang diambil</td>
              <td style="width:20px; text-align:center;">:</td>
              <td style="text-align:left;">${v("jumlah_rontgen", "-")}</td>
            </tr>
          </table>

          <!-- Signature Section -->
          <div style="margin-top:14px; width:100%; display:flex; justify-content:flex-end;">
            <div style="width:240px; text-align:center;">
              <div>Banda Aceh, ${v("tgl_pemeriksaan", new Date().toLocaleDateString("id-ID"))}</div>
              <div style="margin-top:2px;">Dokter Gigi Yang Memeriksa</div>
              <div style="margin:4px 0; min-height:55px;">
                ${ttdImgHtml}
              </div>
              <div style="font-weight:bold; text-decoration:underline;">( ${v("drg_nama", "........................................")} )</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  t.ɵfac = function (r) {
    return new (r || t)();
  };

  t.ɵcmp = ɵcmp({
    type: t,
    selectors: [["app-pengkajian-awal-gigi"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2,
  });

  return t;
})();

export { PengkajianAwalGigiComponent };
