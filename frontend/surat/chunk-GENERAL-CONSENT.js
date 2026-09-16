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
import {
  createSuratShell,
  bindSuratPrintButton,
  hospitalHeaderRow,
  signatureFooterRows,
  createMultiPageSurat,
  footerLabel
} from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-general-consent-placeholder");
    _elementEnd();
  }
}

export var GeneralConsentComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.toastr = inject(ToastrService);
      if (typeof window !== "undefined") window.__toastr = this.toastr;
      this.patient = null;
      this.loading = true;
      this.saving = false;

      this.formData = {
        namaWali: "",
        tglLahirWali: "",
        alamatWali: "",
        telpWali: "",
        hubunganWali: "Pasien",
        preAdmisi: "Tidak ada",
        keluarga1: "",
        hubungan1: "",
        keluarga2: "",
        hubungan2: "",
        keluarga3: "",
        hubungan3: "",
        aksesPenjenguk: "Mengizinkan",
        catatanPenjenguk: "",
        tglConsent: new Date().toISOString().split("T")[0],
        namaPetugas: "",
        namaTtdPasien: "",
        fileKtp: "",
        filesKtp: [],
        sigPetugas: null,
        sigPasien: null
      };

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      this.noCheckin = pathParts[pathParts.length - 1] || "";
    }

    ngOnInit() {
      this.fetchPatient();
    }

    fetchPatient() {
      const isPoli = window.location.pathname.includes("/poli/");
      const isInap = window.location.pathname.includes("/inap/");

      let primaryUrl = i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin;
      let fallbackUrl = i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin;

      if (isPoli) {
        primaryUrl = i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin;
        fallbackUrl = i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin;
      } else if (isInap) {
        primaryUrl = i.apiUrl + "/simrsba/caripasien/pelayanan/INAP/nocheckin/" + this.noCheckin;
        fallbackUrl = i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin;
      }

      this.http.get(primaryUrl).subscribe({
        next: (res) => {
          if (res && res.length > 0) {
            this.patient = res[0];
            this.fetchDraft();
          } else {
            this.fetchPatientFallback(fallbackUrl);
          }
        },
        error: () => {
          this.fetchPatientFallback(fallbackUrl);
        }
      });
    }

    fetchPatientFallback(targetUrl) {
      const url = targetUrl || (i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin);
      this.http.get(url).subscribe({
        next: (res) => {
          if (res && res.length > 0) this.patient = res[0];
          this.fetchDraft();
        },
        error: () => {
          this.fetchDraft();
        }
      });
    }

    fetchDraft() {
      this.http.get(i.apiUrl + "/simrsba/general-consent/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            let raw = res.data.data || res.data;
            while (raw && raw.data && typeof raw.data === "object") {
              raw = Object.assign({}, raw.data, raw);
              delete raw.data;
            }
            delete raw._id;
            delete raw.__v;
            delete raw.createdAt;
            delete raw.updatedAt;
            this.formData = Object.assign(this.formData, raw);
            if (Array.isArray(this.formData.filesKtp) && this.formData.filesKtp.filter(Boolean).length > 0) {
              this.formData.filesKtp = this.formData.filesKtp.filter(Boolean);
            } else if (this.formData.fileKtp) {
              this.formData.filesKtp = [this.formData.fileKtp];
            } else {
              this.formData.filesKtp = [];
            }
            this.formData.fileKtp = this.formData.filesKtp[0] || "";
          }
          this.initDefaults();
          this.loading = false;
          this.renderUI();
        },
        error: () => {
          this.initDefaults();
          this.loading = false;
          this.renderUI();
        }
      });
    }

    initDefaults() {
      if (!this.formData.namaWali && this.patient) {
        this.formData.namaWali = this.patient.nama || "";
        this.formData.tglLahirWali = this.patient.tglLahir || this.patient.tanggal_lahir || "";
        this.formData.alamatWali = this.patient.alamat || "";
        this.formData.telpWali = this.patient.noHp || this.patient.noTelp || "";
      }
      if (!this.formData.namaPetugas && this.patient) {
        this.formData.namaPetugas = this.patient.namaDokter || this.patient.dpjp || "";
      }
      if (!this.formData.namaTtdPasien) {
        this.formData.namaTtdPasien = this.formData.namaWali || (this.patient ? this.patient.nama : "") || "";
      }
    }

    handleSave() {
      this.saving = true;
      const btn = document.getElementById("btn-save-general-consent");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncFromDOM();

      const formCopy = Object.assign({}, this.formData);
      delete formCopy.data;
      delete formCopy._id;
      delete formCopy.__v;

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        user: "Petugas",
        tglInput: new Date().toLocaleString(),
        data: formCopy
      };

      this.http.post(i.apiUrl + "/simrsba/general-consent", payload).subscribe({
        next: (res) => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan General Consent';
            }, 2000);
          }
          this.toastr.success("Formulir Persetujuan Umum (General Consent) berhasil disimpan", "Sukses");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan General Consent';
          }
          this.toastr.error("Gagal menyimpan General Consent", "Error");
        }
      });
    }

    syncFromDOM() {
      const root = document.querySelector("app-general-consent-placeholder");
      if (!root) return;

      const getValue = (id) => {
        const el = root.querySelector("#" + id);
        return el ? el.value : "";
      };

      this.formData.namaWali = getValue("gc-namaWali");
      this.formData.tglLahirWali = getValue("gc-tglLahirWali");
      this.formData.alamatWali = getValue("gc-alamatWali");
      this.formData.telpWali = getValue("gc-telpWali");
      this.formData.hubunganWali = getValue("gc-hubunganWali");
      this.formData.preAdmisi = getValue("gc-preAdmisi");

      this.formData.keluarga1 = getValue("gc-keluarga1");
      this.formData.hubungan1 = getValue("gc-hubungan1");
      this.formData.keluarga2 = getValue("gc-keluarga2");
      this.formData.hubungan2 = getValue("gc-hubungan2");
      this.formData.keluarga3 = getValue("gc-keluarga3");
      this.formData.hubungan3 = getValue("gc-hubungan3");

      this.formData.aksesPenjenguk = getValue("gc-aksesPenjenguk");
      this.formData.catatanPenjenguk = getValue("gc-catatanPenjenguk");
      this.formData.tglConsent = getValue("gc-tglConsent");
      this.formData.namaPetugas = getValue("gc-namaPetugas");
      this.formData.namaTtdPasien = getValue("gc-namaTtdPasien") || this.formData.namaWali;
    }

    renderUI() {
      const root = document.querySelector("app-general-consent-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:250px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat Formulir General Consent...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const d = this.formData;

      const inputContent = `
        <div class="card border mb-3">
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

        <div class="accordion mb-3" id="accGeneralConsent">
          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_gc_1">
              <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_gc_1" aria-expanded="true">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-person-fill me-2 text-secondary"></i> 1. Identitas Pasien / Wali Penanggung Jawab</span>
              </button>
            </h2>
            <div id="collapse_gc_1" class="accordion-collapse collapse show" data-bs-parent="#accGeneralConsent">
              <div class="accordion-body bg-white p-3">
                <div class="row g-2 mb-2">
                  <div class="col-md-4"><label class="f-label">Nama Lengkap</label><input type="text" id="gc-namaWali" class="f-input" value="${d.namaWali || ''}" placeholder="Nama Pasien / Wali..."></div>
                  <div class="col-md-3"><label class="f-label">Tanggal Lahir</label><input type="date" id="gc-tglLahirWali" class="f-input" value="${d.tglLahirWali || ''}"></div>
                  <div class="col-md-3"><label class="f-label">No. Telepon / HP</label><input type="text" id="gc-telpWali" class="f-input" value="${d.telpWali || ''}" placeholder="0812..."></div>
                  <div class="col-md-2">
                    <label class="f-label">Selaku</label>
                    <select id="gc-hubunganWali" class="form-select form-select-sm">
                      <option value="Pasien" ${d.hubunganWali === "Pasien" ? "selected" : ""}>Pasien Sendiri</option>
                      <option value="Suami" ${d.hubunganWali === "Suami" ? "selected" : ""}>Suami</option>
                      <option value="Istri" ${d.hubunganWali === "Istri" ? "selected" : ""}>Istri</option>
                      <option value="Anak" ${d.hubunganWali === "Anak" ? "selected" : ""}>Anak</option>
                      <option value="Orang Tua" ${d.hubunganWali === "Orang Tua" ? "selected" : ""}>Orang Tua</option>
                      <option value="Wali" ${d.hubunganWali === "Wali" ? "selected" : ""}>Wali</option>
                    </select>
                  </div>
                </div>
                <div class="row g-2">
                  <div class="col-md-12"><label class="f-label">Alamat Lengkap</label><input type="text" id="gc-alamatWali" class="f-input" value="${d.alamatWali || ''}" placeholder="Alamat lengkap..."></div>
                </div>
                <div class="row g-2 mt-2">
                  <div class="col-md-12">
                    <label class="f-label">Foto / Berkas KTP Pasien / Wali</label>
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <input type="file" id="gc-input-ktp" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.bmp,.gif" multiple class="d-none">
                      <button type="button" class="btn btn-sm btn-outline-primary" id="gc-btn-upload-ktp">
                        <i class="bi bi-cloud-arrow-up me-1"></i>Pilih / Tambah Foto / Berkas KTP
                      </button>
                      <span id="gc-ktp-status" class="small text-muted"></span>
                    </div>
                    <div class="form-text text-muted mb-2" style="font-size:11px;">
                      Mendukung banyak file sekaligus (Multiple Files). Format: Semua format gambar (JPG, JPEG, PNG, WEBP, GIF, BMP) &amp; Berkas Dokumen PDF.
                    </div>
                    <div id="gc-ktp-preview-container" class="d-flex flex-wrap gap-2" style="${(d.filesKtp && d.filesKtp.length > 0) ? '' : 'display:none;'}">
                      ${this.renderKtpItemsHtml(d.filesKtp || [])}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_gc_2">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_gc_2">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-shield-check me-2 text-secondary"></i> 2. I. Pre Admisi (Keyakinan, Kepercayaan &amp; Budaya)</span>
              </button>
            </h2>
            <div id="collapse_gc_2" class="accordion-collapse collapse" data-bs-parent="#accGeneralConsent">
              <div class="accordion-body bg-white p-3">
                <label class="f-label mb-2">Keyakinan, Kepercayaan, dan Budaya Pasien tentang:</label>
                <select id="gc-preAdmisi" class="form-select form-select-sm mb-2">
                  <option value="Tidak ada" ${d.preAdmisi === "Tidak ada" ? "selected" : ""}>Tidak ada (Normal)</option>
                  <option value="Menolak melakukan transfusi darah" ${d.preAdmisi === "Menolak melakukan transfusi darah" ? "selected" : ""}>Menolak melakukan transfusi darah</option>
                  <option value="Vegetarian" ${d.preAdmisi === "Vegetarian" ? "selected" : ""}>Vegetarian</option>
                  <option value="Menolak obat dengan kecurigaan mengandung unsur babi" ${d.preAdmisi === "Menolak obat dengan kecurigaan mengandung unsur babi" ? "selected" : ""}>Menolak obat dengan kecurigaan mengandung unsur babi</option>
                  <option value="Tidak dirawat diruangan dengan angka tertentu" ${d.preAdmisi === "Tidak dirawat diruangan dengan angka tertentu" ? "selected" : ""}>Tidak dirawat diruangan dengan angka tertentu</option>
                </select>
              </div>
            </div>
          </div>

          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_gc_3">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_gc_3">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-lock me-2 text-secondary"></i> 3. III. Pelepasan Informasi &amp; Privasi Keluarga</span>
              </button>
            </h2>
            <div id="collapse_gc_3" class="accordion-collapse collapse" data-bs-parent="#accGeneralConsent">
              <div class="accordion-body bg-white p-3">
                <p class="small fw-semibold text-muted mb-2">Memberikan wewenang kepada RS Bhayangkara untuk memberikan informasi tentang diagnosis &amp; pengobatan kepada keluarga:</p>
                <div class="row g-2 mb-2">
                  <div class="col-md-4"><label class="f-label">Anggota Keluarga 1</label><input type="text" id="gc-keluarga1" class="f-input" value="${d.keluarga1 || ''}" placeholder="Nama anggota keluarga 1..."></div>
                  <div class="col-md-2"><label class="f-label">Hubungan</label><input type="text" id="gc-hubungan1" class="f-input" value="${d.hubungan1 || ''}" placeholder="Suami/Istri/Anak..."></div>
                  <div class="col-md-4"><label class="f-label">Anggota Keluarga 2</label><input type="text" id="gc-keluarga2" class="f-input" value="${d.keluarga2 || ''}" placeholder="Nama anggota keluarga 2..."></div>
                  <div class="col-md-2"><label class="f-label">Hubungan</label><input type="text" id="gc-hubungan2" class="f-input" value="${d.hubungan2 || ''}" placeholder="Orang tua/Saudara..."></div>
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-md-4"><label class="f-label">Anggota Keluarga 3</label><input type="text" id="gc-keluarga3" class="f-input" value="${d.keluarga3 || ''}" placeholder="Nama anggota keluarga 3..."></div>
                  <div class="col-md-2"><label class="f-label">Hubungan</label><input type="text" id="gc-hubungan3" class="f-input" value="${d.hubungan3 || ''}" placeholder="Hubungan..."></div>
                </div>
                <hr>
                <div class="row g-2">
                  <div class="col-md-3">
                    <label class="f-label">Akses Penjenguk</label>
                    <select id="gc-aksesPenjenguk" class="form-select form-select-sm">
                      <option value="Mengizinkan" ${d.aksesPenjenguk === "Mengizinkan" ? "selected" : ""}>Mengizinkan Keluarga/Tamu</option>
                      <option value="Tidak Mengizinkan" ${d.aksesPenjenguk === "Tidak Mengizinkan" ? "selected" : ""}>Tidak Mengizinkan (Kecuali yang diizinkan)</option>
                    </select>
                  </div>
                  <div class="col-md-9">
                    <label class="f-label">Catatan Khusus Penjenguk (Jika Ada)</label>
                    <input type="text" id="gc-catatanPenjenguk" class="f-input" value="${d.catatanPenjenguk || ''}" placeholder="Sebutkan nama/profesi jika ada permintaan khusus privasi...">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion-item mb-2 border rounded">
            <h2 class="accordion-header" id="heading_gc_4">
              <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_gc_4">
                <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-pencil-square me-2 text-secondary"></i> 4. Verifikasi &amp; Tanda Tangan</span>
              </button>
            </h2>
            <div id="collapse_gc_4" class="accordion-collapse collapse" data-bs-parent="#accGeneralConsent">
              <div class="accordion-body bg-white p-3">
                <div class="row g-3 mb-3">
                  <div class="col-md-4">
                    <label class="f-label">Tanggal Persetujuan</label>
                    <input type="date" id="gc-tglConsent" class="f-input mb-2" value="${d.tglConsent || ''}">
                  </div>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="border rounded p-2 bg-light">
                      <label class="f-label mb-1">Yang Menjelaskan (Petugas RS)</label>
                      <input type="text" id="gc-namaPetugas" class="f-input mb-2" value="${d.namaPetugas || ''}" placeholder="Nama Petugas RS...">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small fw-bold">TTD Petugas:</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-gc-petugas" style="font-size:10px;padding:1px 6px;">Hapus</button>
                      </div>
                      <canvas id="sig-gc-petugas" width="500" height="150" style="height:110px;border:1px solid #ccc;background:#fff;width:100%;border-radius:4px;"></canvas>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="border rounded p-2 bg-light">
                      <label class="f-label mb-1">Pasien / Penanggung Jawab</label>
                      <input type="text" id="gc-namaTtdPasien" class="f-input mb-2" value="${d.namaTtdPasien || d.namaWali || ''}" placeholder="Nama Pasien / Penanggung Jawab...">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="small fw-bold">TTD Pasien / Wali:</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-gc-pasien" style="font-size:10px;padding:1px 6px;">Hapus</button>
                      </div>
                      <canvas id="sig-gc-pasien" width="500" height="150" style="height:110px;border:1px solid #ccc;background:#fff;width:100%;border-radius:4px;"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3 border-top pt-3">
          <button id="btn-save-general-consent" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan General Consent</button>
        </div>
      `;

      root.innerHTML = createSuratShell({
        idPrefix: 'general-consent',
        wrapperTag: 'app-general-consent-placeholder',
        inputPaneId: 'gc-input-pane',
        printPaneId: 'gc-print-pane',
        printTabId: 'gc-print-tab',
        tabsClass: 'gc-tabs',
        inputContent: inputContent
      });

      bindSuratPrintButton(root);

      root.querySelector("#btn-save-general-consent")?.addEventListener("click", () => this.handleSave());

      root.querySelector("#gc-namaWali")?.addEventListener("input", (e) => {
        const ttdInput = root.querySelector("#gc-namaTtdPasien");
        if (ttdInput && !ttdInput.dataset.manual) {
          ttdInput.value = e.target.value;
        }
      });
      root.querySelector("#gc-namaTtdPasien")?.addEventListener("input", (e) => {
        e.target.dataset.manual = "true";
      });

      const btnUploadKtp = root.querySelector("#gc-btn-upload-ktp");
      const inputKtp = root.querySelector("#gc-input-ktp");
      const ktpStatus = root.querySelector("#gc-ktp-status");

      if (btnUploadKtp && inputKtp) {
        btnUploadKtp.addEventListener("click", () => inputKtp.click());
      }

      this.bindKtpPreviewEvents(root);

      if (inputKtp) {
        inputKtp.addEventListener("change", async (e) => {
          const files = Array.from(e.target.files || []);
          if (files.length === 0) return;

          if (btnUploadKtp) {
            btnUploadKtp.disabled = true;
            btnUploadKtp.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Mengunggah...';
          }

          let uploadedCount = 0;
          let failedCount = 0;

          for (let idx = 0; idx < files.length; idx++) {
            const file = files[idx];
            if (ktpStatus) {
              ktpStatus.textContent = `Mengunggah ${idx + 1} dari ${files.length} file...`;
            }

            try {
              const base64Data = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              });

              const payload = {
                fileKtp: base64Data,
                fileName: file.name,
                noCheckin: this.noCheckin,
                noMr: this.patient?.noMr || this.patient?.norm || "",
                tglCheckin: this.patient?.tglCheckin || this.patient?.tglInput || "",
                existingFiles: this.formData.filesKtp || []
              };

              await new Promise((resolve) => {
                this.http.post(i.apiUrl + "/simrsba/general-consent/upload-ktp", payload).subscribe({
                  next: (res) => {
                    if (res && res.data) {
                      if (Array.isArray(res.data.filesKtp) && res.data.filesKtp.length > 0) {
                        this.formData.filesKtp = [...res.data.filesKtp];
                      } else if (res.data.url) {
                        if (!this.formData.filesKtp) this.formData.filesKtp = [];
                        if (!this.formData.filesKtp.includes(res.data.url)) {
                          this.formData.filesKtp.push(res.data.url);
                        }
                      }
                      this.formData.fileKtp = (this.formData.filesKtp && this.formData.filesKtp[0]) || (res.data && res.data.url) || "";
                      uploadedCount++;
                      this.refreshKtpPreviews();
                    }
                    resolve();
                  },
                  error: () => {
                    failedCount++;
                    resolve();
                  }
                });
              });
            } catch (err) {
              failedCount++;
            }
          }

          if (btnUploadKtp) {
            btnUploadKtp.disabled = false;
            btnUploadKtp.innerHTML = '<i class="bi bi-cloud-arrow-up me-1"></i>Pilih / Tambah Foto / Berkas KTP';
          }
          if (ktpStatus) ktpStatus.textContent = "";
          inputKtp.value = "";

          this.refreshKtpPreviews();

          if (uploadedCount > 0 && failedCount === 0) {
            this.toastr.success(`${uploadedCount} berkas KTP berhasil diunggah`, "Sukses");
          } else if (uploadedCount > 0 && failedCount > 0) {
            this.toastr.warning(`${uploadedCount} berkas berhasil diunggah, ${failedCount} gagal`, "Peringatan");
          } else {
            this.toastr.error("Gagal mengunggah berkas KTP", "Error");
          }
        });
      }

      this.initCanvas("sig-gc-petugas", "sigPetugas");
      this.initCanvas("sig-gc-pasien", "sigPasien");

      const accCollapse4 = root.querySelector("#collapse_gc_4");
      if (accCollapse4) {
        accCollapse4.addEventListener("shown.bs.collapse", () => {
          this.initCanvas("sig-gc-petugas", "sigPetugas");
          this.initCanvas("sig-gc-pasien", "sigPasien");
        });
      }

      const printTab = root.querySelector("#gc-print-tab");
      const updatePrint = () => {
        this.syncFromDOM();
        this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
      };
      if (printTab) {
        printTab.addEventListener("click", updatePrint);
        printTab.addEventListener("shown.bs.tab", updatePrint);
      }

      this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
    }

    renderKtpItemsHtml(files) {
      if (!files || !Array.isArray(files) || files.length === 0) return "";
      return files.map((fileUrl, index) => {
        const fullUrl = fileUrl.startsWith("http") ? fileUrl : (i.apiUrl + fileUrl);
        const cleanPath = fileUrl.split("?")[0].toLowerCase();
        const isPdf = cleanPath.endsWith(".pdf");
        const rawName = fileUrl.split("/").pop().split("?")[0];
        const fileName = rawName || `Berkas KTP ${index + 1}`;
        if (isPdf) {
          return `
            <div class="border rounded p-2 bg-light d-flex align-items-center gap-2 position-relative gc-ktp-item gc-ktp-pdf-item shadow-sm" data-url="${fullUrl}" style="min-width:220px;max-width:300px;background:#f8f9fa;cursor:pointer;" title="Klik untuk membuka berkas PDF">
              <i class="bi bi-file-earmark-pdf-fill text-danger fs-2 flex-shrink-0"></i>
              <div class="overflow-hidden flex-grow-1">
                <div class="small fw-semibold text-truncate" title="${fileName}" style="font-size:12px;">${fileName}</div>
                <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mt-1 text-decoration-none d-inline-flex align-items-center" style="font-size:10px;padding:2px 6px;">
                  <i class="bi bi-box-arrow-up-right me-1"></i>Buka PDF
                </a>
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger gc-btn-del-file flex-shrink-0 ms-1" data-url="${fileUrl}" title="Hapus berkas PDF ini" style="padding:2px 7px;">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          `;
        } else {
          return `
            <div class="border rounded p-1 bg-white position-relative d-inline-block text-center gc-ktp-item shadow-sm" style="width:130px;">
              <div class="gc-ktp-preview-img-wrapper" data-src="${fullUrl}" style="position:relative;cursor:pointer;height:95px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;background:#f1f1f1;" title="Klik untuk memperbesar foto">
                <img src="${fullUrl}" class="gc-ktp-img-preview" style="max-height:95px;max-width:100%;object-fit:cover;" alt="KTP">
                <div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);color:#fff;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;font-size:11px;font-weight:500;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                  <i class="bi bi-zoom-in me-1"></i>Perbesar
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-1 px-1">
                <span class="text-truncate text-muted" style="font-size:10px;max-width:80px;" title="${fileName}">${fileName}</span>
                <button type="button" class="btn btn-xs btn-outline-danger gc-btn-del-file" data-url="${fileUrl}" title="Hapus foto ini" style="padding:0 4px;font-size:11px;line-height:1.2;">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          `;
        }
      }).join("");
    }

    refreshKtpPreviews(root) {
      const container = (root && root.querySelector ? root.querySelector("#gc-ktp-preview-container") : null) || document.getElementById("gc-ktp-preview-container");
      if (!container) return;
      const files = (this.formData && Array.isArray(this.formData.filesKtp)) ? this.formData.filesKtp.filter(Boolean) : [];
      if (files.length === 0) {
        container.innerHTML = "";
        container.style.display = "none";
      } else {
        container.innerHTML = this.renderKtpItemsHtml(files);
        container.style.display = "flex";
      }
      this.bindKtpPreviewEvents(container);
    }

    bindKtpPreviewEvents(scope) {
      const host = scope || document.getElementById("gc-ktp-preview-container") || document;
      host.querySelectorAll(".gc-btn-del-file").forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetUrl = btn.getAttribute("data-url");
          if (!targetUrl) return;
          btn.disabled = true;
          btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
          this.http.post(i.apiUrl + "/simrsba/general-consent/delete-ktp", {
            noCheckin: this.noCheckin,
            fileUrl: targetUrl
          }).subscribe({
            next: (res) => {
              if (res && res.data && Array.isArray(res.data.filesKtp)) {
                this.formData.filesKtp = [...res.data.filesKtp];
              } else {
                this.formData.filesKtp = (this.formData.filesKtp || []).filter((u) => u !== targetUrl);
              }
              this.formData.fileKtp = (this.formData.filesKtp && this.formData.filesKtp[0]) || "";
              this.refreshKtpPreviews();
              this.toastr.success("Berkas KTP berhasil dihapus", "Sukses");
            },
            error: () => {
              btn.disabled = false;
              btn.innerHTML = '<i class="bi bi-trash"></i>';
              this.toastr.error("Gagal menghapus berkas KTP dari server", "Error");
            }
          });
        };
      });

      host.querySelectorAll(".gc-ktp-pdf-item").forEach((card) => {
        card.onclick = (e) => {
          if (e.target.closest(".gc-btn-del-file") || e.target.closest("a")) return;
          const url = card.getAttribute("data-url");
          if (url) window.open(url, "_blank");
        };
      });

      host.querySelectorAll(".gc-ktp-preview-img-wrapper").forEach((wrapper) => {
        wrapper.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const src = wrapper.getAttribute("data-src") || wrapper.querySelector("img")?.src;
          if (src) this.openLightbox(src);
        };
      });
    }

    openLightbox(src) {
      const existing = document.getElementById("gc-ktp-lightbox");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "gc-ktp-lightbox";
      overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;backdrop-filter:blur(3px);";

      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.innerHTML = "&times;";
      closeBtn.title = "Tutup (Esc)";
      closeBtn.style.cssText = "position:absolute;top:15px;right:25px;background:none;border:none;color:#ffffff;font-size:42px;font-weight:300;line-height:1;cursor:pointer;padding:0 10px;z-index:1000000;opacity:0.85;transition:opacity 0.2s;";
      closeBtn.onmouseover = () => { closeBtn.style.opacity = "1"; };
      closeBtn.onmouseout = () => { closeBtn.style.opacity = "0.85"; };

      const fullImg = document.createElement("img");
      fullImg.src = src;
      fullImg.alt = "KTP Fullscreen";
      fullImg.style.cssText = "max-width:92vw;max-height:90vh;object-fit:contain;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.9);cursor:default;";
      fullImg.addEventListener("click", (ev) => ev.stopPropagation());

      const closeLightbox = () => {
        window.removeEventListener("keydown", onKeyDown);
        overlay.remove();
      };

      const onKeyDown = (ev) => {
        if (ev.key === "Escape" || ev.keyCode === 27) {
          closeLightbox();
        }
      };

      closeBtn.addEventListener("click", closeLightbox);
      overlay.addEventListener("click", closeLightbox);
      window.addEventListener("keydown", onKeyDown);

      overlay.appendChild(closeBtn);
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
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
      const container = document.getElementById("general-consent-print-container");
      if (!container) return;

      const d = this.formData;
      const getCheck = (val, target) => val === target ? "✓" : "&nbsp;&nbsp;";

      const headerHtml = `
        <table class="pap-master-grid" style="border-bottom:none;">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
          </tbody>
        </table>
      `;

      const page1Body = `
        <table class="pap-master-grid">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 12px; padding: 6px;">
                FORMULIR PERSETUJUAN UMUM (GENERAL CONSENT)<br>UNTUK MENERIMA PELAYANAN KESEHATAN
              </td>
            </tr>

            <tr>
              <td colspan="6" style="font-style: italic; text-align: center; background-color: #fafafa; font-size:11px;">
                Pasien dan/atau Wali Harus Membaca, Memahami dan Mengisi Informasi Berikut:
              </td>
            </tr>

            <tr>
              <td colspan="6">
                Yang bertanda tangan dibawah ini:<br>
                <table class="pap-inner-align" style="margin-top: 4px; line-height: 1.8;">
                  <tr><td style="width: 120px;">Nama</td><td style="width: 10px;">:</td><td style="font-weight:bold;">${d.namaWali || '....................................................'}</td></tr>
                  <tr><td>Tanggal Lahir</td><td>:</td><td>${d.tglLahirWali || '....................................................'}</td></tr>
                  <tr><td>Alamat</td><td>:</td><td>${d.alamatWali || '....................................................'}</td></tr>
                  <tr><td>No. Telp/HP</td><td>:</td><td>${d.telpWali || '....................................................'}</td></tr>
                </table>
                <br>
                Selaku Pasien/Wali dengan menyatakan persetujuan : <strong>( ${d.hubunganWali || 'Pasien'} )</strong>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">I. PRE ADMISI</div>
                Keyakinan, kepercayaan, dan budaya tentang: <em>(lingkari/pilih salah satu saja)</em>
                <ol type="a" style="padding-left: 20px; margin-top: 4px;">
                  <li>[ ${getCheck(d.preAdmisi, "Menolak melakukan transfusi darah")} ] Menolak melakukan transfusi darah</li>
                  <li>[ ${getCheck(d.preAdmisi, "Vegetarian")} ] Vegetarian</li>
                  <li>[ ${getCheck(d.preAdmisi, "Menolak obat dengan kecurigaan mengandung unsur babi")} ] Menolak obat dengan kecurigaan mengandung unsur babi</li>
                  <li>[ ${getCheck(d.preAdmisi, "Tidak dirawat diruangan dengan angka tertentu")} ] Tidak dirawat diruangan dengan angka tertentu</li>
                  <li>[ ${getCheck(d.preAdmisi, "Tidak ada")} ] Tidak ada</li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">II. PERSETUJUAN UNTUK PERAWATAN DAN PENGOBATAN</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya menyetujui untuk perawatan di Rumah Sakit Bhayangkara sebagai pasien rawat jalan atau rawat inap terhadap kebutuhan medis.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Pengobatan dapat meliputi pemeriksaan x-ray/radiology, tes darah, perawatan rutin, dan prosedur seperti cairan infus anti-suntikan dan evaluasi (contohnya wawancara dan pemeriksaan fisik).</li>
                  <li style="margin-bottom:4px;text-align:justify;">Persetujuan yang saya berikan tidak termasuk persetujuan untuk prosedur/tindakan invasif (misalnya, operasi) atau tindakan yang mempunyai resiko tinggi.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Jika saya memutuskan untuk menghentikan perawatan medis untuk diri saya sendiri, Saya memahami dan menyadari Rumah Sakit Bhayangkara atau dokter tidak bertanggung jawab atas hasil yang mungkin terjadi saya bersedia menandatangani formulir dan surat berterima kasih menyatakan penolakan Tindakan.</li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">III. PERSETUJUAN PELEPASAN INFORMASI DAN PRIVASI</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya memahami informasi yang ada di dalam diri saya, termasuk Diagnosis hasil laboratorium dan hasil tes diagnostik yang akan digunakan untuk perawatan medis, Rumah Sakit Bhayangkara akan menjamin kerahasiaannya.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya memberikan wewenang kepada RS Bhayangkara untuk memberikan informasi tentang diagnosis, hasil pelayanan dan pengobatan yang diperlukan untuk memproses klaim asuransi/perusahaan dan/atau lembaga pemerintah/BPJS.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya memberikan wewenang kepada RS Bhayangkara untuk memberikan informasi tentang diagnosis, hasil pelayanan dan pengobatan saya kepada anggota keluarga saya kepada:
                    <br>1. <strong>${d.keluarga1 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan1 || '..................'}</strong>)
                    <br>2. <strong>${d.keluarga2 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan2 || '..................'}</strong>)
                    <br>3. <strong>${d.keluarga3 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan3 || '..................'}</strong>)
                  </li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya <strong>${d.aksesPenjenguk || 'mengizinkan'}</strong> RS Bhayangkara memberi akses bagi keluarga atau orang-orang untuk menjenguk/memenuhi saya. <em>${d.catatanPenjenguk ? `(Catatan: ${d.catatanPenjenguk})` : ''}</em></li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">IV. INFORMASI RAWAT INAP</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya sudah diberi informasi untuk tidak diperkenankan membawa barang-barang berharga ke ruangan rawat inap jika ada anggota keluarga atau teman harus diizinkan membawa pulang atau dengan persetujuan oleh RS Bhayangkara jika barang tersebut tetap dibawa ke lingkungan RS Bhayangkara oleh saya atau pihak manapun, maka RS Bhayangkara tidak bertanggung jawab atas kehilangan, kerusakan atau pencurian atas barang tersebut.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Bila tidak ada anggota keluarga, Rumah Sakit menyediakan tempat penitipan barang milik pasien di tempat resmi yang telah disediakan oleh RS.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya telah menerima informasi tentang peraturan yang diberlakukan oleh Rumah Sakit dan saya beserta keluarga bersedia untuk mematuhinya, termasuk akan mematuhi: jam berkunjung pasien sesuai dengan aturan di rumah sakit.</li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const page2Body = `
        <table class="pap-master-grid">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">V. PENGAJUAN KELUHAN</div>
                <p style="text-align: justify; margin-bottom: 6px;">
                  Saya dengan ini menyatakan bahwa saya telah menerima informasi dan telah mengerti tata cara pengajuan dan tindak lanjut bila ada keluhan saya sebagai pasien pelayanan yang diberikan. Saya setuju untuk mengikuti tata cara pengeluhan sesuai dengan prosedur yang ada. RS Bhayangkara tidak wajib menindak-lanjuti keluhan saya apabila tidak diajukan dengan prosedur yang berlaku, dan tidak wajib untuk bertanggung jawab atas setiap kerugian dalam bentuk apapun yang timbul dari atau sehubungan dengan keluhan yang tidak diajukan sesuai prosedur.
                </p>
                <p style="text-align: justify;">
                  Mendukung hal tersebut, saya bersedia untuk selalu memakai tanda pengenal khusus yang diberikan oleh Rumah Sakit, dan demi keamanan seluruh pasien setiap keluarga dan siapapun yang akan mengunjungi saya di luar jam berkunjung, bersedia diminta/diperiksa Identitasnya dan memakai identitas yang diberikan oleh pihak Rumah Sakit.
                </p>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">VI. INFORMASI BIAYA</div>
                Saya memahami tentang informasi biaya pengobatan atau biaya tindakan yang dijelaskan oleh petugas Rumah Sakit Bhayangkara.
              </td>
            </tr>

            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 12px; padding: 6px;">
                PERSETUJUAN UMUM UNTUK TINDAKAN KEDOKTERAN
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <ol type="1" style="padding-left: 20px;">
                  <li style="margin-bottom:6px;">
                    <strong>PERSETUJUAN ASUHAN KESEHATAN</strong>
                    <p style="margin-top: 2px; text-align:justify;">Saya menyadari bahwa tindakan kedokteran adalah berisiko, meliputi tindakan medis berupa preventif, diagnostik, terapeutik atau rehabilitatif yang dilakukan oleh dokter atau dokter gigi terhadap Pasien.</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya menyetujui segala pelayanan medis di RS Bhayangkara sebagaimana sesuai dengan keadaan medis saya selama mendapatkan pelayanan medis (kecuali yang membutuhkan persetujuan khusus/tertulis).</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya dengan ini menyetujui kembali kepada RS Bhayangkara, dalam memberikan pelayanan medis, pemeriksaan fisik, yang dapat dilakukan oleh dokter atau perawat, dan melakukan prosedur diagnostik, atau terapi dan tatalaksana sesuai pertimbangan dokter yang diperlukan atau disarankan pada pelayanan medis untuk saya. Hal ini mencakup seluruh pemeriksaan dan prosedur diagnostik rutin, termasuk namun tidak terbatas pada x-ray, pemberian dan atau tindakan kedokteran serta penyuntikan (intramuskular, intravena dan prosedur invasif lainnya) produk farmasi dan obat-obatan, pemasangan alat medis, dan pengambilan darah untuk pemeriksaan laboratorium atau pemeriksaan patologi yang dibutuhkan untuk pengobatan medis saya.</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya mempercayakan kepada semua tenaga kesehatan rumah sakit untuk memberikan perawatan, diagnostik dan terapi kepada saya sebagai pasien rawat inap maupun rawat jalan atau Instalasi Gawat Darurat (IGD), termasuk semua pemeriksaan penunjang, yang dibutuhkan untuk pengobatan dan tindakan yang diperlukan.</p>
                  </li>
                  <li style="margin-bottom:6px;">
                    <strong>KEJADIAN TIDAK TERDUGA/DIHARAPKAN</strong>
                    <p style="margin-top: 2px; text-align:justify;">Saya mengerti dan menyadari bahwa dalam tindakan kedokteran dapat terjadi adanya kejadian tidak terduga/diharapkan (unanticipated outcome) yang merupakan efek samping dari tindakan kedokteran yang tidak dapat diduga sebelumnya (termasuk antara lain, namun tidak terbatas pada Steven Johnson Syndrome dan syok anafilaktik).</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya mengerti bahwa hasil asuhan dan pengobatan termasuk kejadian yang tidak terduga/diharapkan akan diberitahukan kepada saya dan keluarga oleh Dokter Penanggung Jawab Pasien (DPJP).</p>
                  </li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="text-align: center; font-weight: bold; background-color: #fafafa; padding: 8px;">
                SAYA TELAH DIJELASKAN, MEMBACA, MEMAHAMI, dan SEPENUHNYA SETUJU terhadap pernyataan tersebut diatas.
              </td>
            </tr>

            <tr>
              <td colspan="6" style="padding-top: 15px; padding-bottom: 15px;">
                <table class="pap-inner-align">
                  <tr>
                    <td style="width: 50%;"></td>
                    <td style="width: 50%; text-align: center;">
                      Banda Aceh, <strong>${d.tglConsent || '................................'}</strong>
                    </td>
                  </tr>
                  <tr style="height: 90px;">
                    <td style="text-align: center; vertical-align: top; padding-top: 5px;">
                      <div>Yang menjelaskan (Petugas RS):</div>
                      <div style="height:60px;display:flex;align-items:center;justify-content:center;">
                        ${d.sigPetugas ? `<img src="${d.sigPetugas}" style="max-height:55px;">` : '<br><br>'}
                      </div>
                      <div>( <strong>${d.namaPetugas || '........................................'}</strong> )</div>
                    </td>
                    <td style="text-align: center; vertical-align: top; padding-top: 5px;">
                      <div>Pasien / Penanggung Jawab:</div>
                      <div style="height:60px;display:flex;align-items:center;justify-content:center;">
                        ${d.sigPasien ? `<img src="${d.sigPasien}" style="max-height:55px;">` : '<br><br>'}
                      </div>
                      <div>( <strong>${d.namaTtdPasien || d.namaWali || '........................................'}</strong> )</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const pages = [
        { headerHtml: headerHtml, bodyHtml: page1Body },
        { headerHtml: '', bodyHtml: page2Body }
      ];

      container.innerHTML = createMultiPageSurat(pages, 'RM01/Rev02/RSBHY/2026');
    }

    static getPrintHtml(patient, formData) {
      const p = patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || p.namaPasien || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";
      const d = formData || {};
      const getCheck = (val, target) => val === target ? "✓" : "&nbsp;&nbsp;";

      const headerHtml = `
        <table class="pap-master-grid" style="border-bottom:none;">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
          </tbody>
        </table>
      `;

      const page1Body = `
        <table class="pap-master-grid">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 12px; padding: 6px;">
                FORMULIR PERSETUJUAN UMUM (GENERAL CONSENT)<br>UNTUK MENERIMA PELAYANAN KESEHATAN
              </td>
            </tr>

            <tr>
              <td colspan="6" style="font-style: italic; text-align: center; background-color: #fafafa; font-size:11px;">
                Pasien dan/atau Wali Harus Membaca, Memahami dan Mengisi Informasi Berikut:
              </td>
            </tr>

            <tr>
              <td colspan="6">
                Yang bertanda tangan dibawah ini:<br>
                <table class="pap-inner-align" style="margin-top: 4px; line-height: 1.8;">
                  <tr><td style="width: 120px;">Nama</td><td style="width: 10px;">:</td><td style="font-weight:bold;">${d.namaWali || '....................................................'}</td></tr>
                  <tr><td>Tanggal Lahir</td><td>:</td><td>${d.tglLahirWali || '....................................................'}</td></tr>
                  <tr><td>Alamat</td><td>:</td><td>${d.alamatWali || '....................................................'}</td></tr>
                  <tr><td>No. Telp/HP</td><td>:</td><td>${d.telpWali || '....................................................'}</td></tr>
                </table>
                <br>
                Selaku Pasien/Wali dengan menyatakan persetujuan : <strong>( ${d.hubunganWali || 'Pasien'} )</strong>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">I. PRE ADMISI</div>
                Keyakinan, kepercayaan, dan budaya tentang: <em>(lingkari/pilih salah satu saja)</em>
                <ol type="a" style="padding-left: 20px; margin-top: 4px;">
                  <li>[ ${getCheck(d.preAdmisi, "Menolak melakukan transfusi darah")} ] Menolak melakukan transfusi darah</li>
                  <li>[ ${getCheck(d.preAdmisi, "Vegetarian")} ] Vegetarian</li>
                  <li>[ ${getCheck(d.preAdmisi, "Menolak obat dengan kecurigaan mengandung unsur babi")} ] Menolak obat dengan kecurigaan mengandung unsur babi</li>
                  <li>[ ${getCheck(d.preAdmisi, "Tidak dirawat diruangan dengan angka tertentu")} ] Tidak dirawat diruangan dengan angka tertentu</li>
                  <li>[ ${getCheck(d.preAdmisi, "Tidak ada")} ] Tidak ada</li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">II. PERSETUJUAN UNTUK PERAWATAN DAN PENGOBATAN</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya menyetujui untuk perawatan di Rumah Sakit Bhayangkara sebagai pasien rawat jalan atau rawat inap terhadap kebutuhan medis.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Pengobatan dapat meliputi pemeriksaan x-ray/radiology, tes darah, perawatan rutin, dan prosedur seperti cairan infus anti-suntikan dan evaluasi (contohnya wawancara dan pemeriksaan fisik).</li>
                  <li style="margin-bottom:4px;text-align:justify;">Persetujuan yang saya berikan tidak termasuk persetujuan untuk prosedur/tindakan invasif (misalnya, operasi) atau tindakan yang mempunyai resiko tinggi.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Jika saya memutuskan untuk menghentikan perawatan medis untuk diri saya sendiri, Saya memahami dan menyadari Rumah Sakit Bhayangkara atau dokter tidak bertanggung jawab atas hasil yang mungkin terjadi saya bersedia menandatangani formulir dan surat berterima kasih menyatakan penolakan Tindakan.</li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">III. PERSETUJUAN PELEPASAN INFORMASI DAN PRIVASI</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya memahami informasi yang ada di dalam diri saya, termasuk Diagnosis hasil laboratorium dan hasil tes diagnostik yang akan digunakan untuk perawatan medis, Rumah Sakit Bhayangkara akan menjamin kerahasiaannya.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya memberikan wewenang kepada RS Bhayangkara untuk memberikan informasi tentang diagnosis, hasil pelayanan dan pengobatan yang diperlukan untuk memproses klaim asuransi/perusahaan dan/atau lembaga pemerintah/BPJS.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya memberikan wewenang kepada RS Bhayangkara untuk memberikan informasi tentang diagnosis, hasil pelayanan dan pengobatan saya kepada anggota keluarga saya kepada:
                    <br>1. <strong>${d.keluarga1 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan1 || '..................'}</strong>)
                    <br>2. <strong>${d.keluarga2 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan2 || '..................'}</strong>)
                    <br>3. <strong>${d.keluarga3 || '....................................................'}</strong> (hubungan: <strong>${d.hubungan3 || '..................'}</strong>)
                  </li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya <strong>${d.aksesPenjenguk || 'mengizinkan'}</strong> RS Bhayangkara memberi akses bagi keluarga atau orang-orang untuk menjenguk/memenuhi saya. <em>${d.catatanPenjenguk ? `(Catatan: ${d.catatanPenjenguk})` : ''}</em></li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">IV. INFORMASI RAWAT INAP</div>
                <ol type="a" style="padding-left: 20px;">
                  <li style="margin-bottom:4px;text-align:justify;">Saya sudah diberi informasi untuk tidak diperkenankan membawa barang-barang berharga ke ruangan rawat inap jika ada anggota keluarga atau teman harus diizinkan membawa pulang atau dengan persetujuan oleh RS Bhayangkara jika barang tersebut tetap dibawa ke lingkungan RS Bhayangkara oleh saya atau pihak manapun, maka RS Bhayangkara tidak bertanggung jawab atas kehilangan, kerusakan atau pencurian atas barang tersebut.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Bila tidak ada anggota keluarga, Rumah Sakit menyediakan tempat penitipan barang milik pasien di tempat resmi yang telah disediakan oleh RS.</li>
                  <li style="margin-bottom:4px;text-align:justify;">Saya telah menerima informasi tentang peraturan yang diberlakukan oleh Rumah Sakit dan saya beserta keluarga bersedia untuk mematuhinya, termasuk akan mematuhi: jam berkunjung pasien sesuai dengan aturan di rumah sakit.</li>
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const page2Body = `
        <table class="pap-master-grid">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">V. PENGAJUAN KELUHAN</div>
                <p style="text-align: justify; margin-bottom: 6px;">
                  Saya dengan ini menyatakan bahwa saya telah menerima informasi dan telah mengerti tata cara pengajuan dan tindak lanjut bila ada keluhan saya sebagai pasien pelayanan yang diberikan. Saya setuju untuk mengikuti tata cara pengeluhan sesuai dengan prosedur yang ada. RS Bhayangkara tidak wajib menindak-lanjuti keluhan saya apabila tidak diajukan dengan prosedur yang berlaku, dan tidak wajib untuk bertanggung jawab atas setiap kerugian dalam bentuk apapun yang timbul dari atau sehubungan dengan keluhan yang tidak diajukan sesuai prosedur.
                </p>
                <p style="text-align: justify;">
                  Mendukung hal tersebut, saya bersedia untuk selalu memakai tanda pengenal khusus yang diberikan oleh Rumah Sakit, dan demi keamanan seluruh pasien setiap keluarga dan siapapun yang akan mengunjungi saya di luar jam berkunjung, bersedia diminta/diperiksa Identitasnya dan memakai identitas yang diberikan oleh pihak Rumah Sakit.
                </p>
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <div style="font-weight:bold;text-transform:uppercase;margin-bottom:3px;">VI. INFORMASI BIAYA</div>
                Saya memahami tentang informasi biaya pengobatan atau biaya tindakan yang dijelaskan oleh petugas Rumah Sakit Bhayangkara.
              </td>
            </tr>

            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 12px; padding: 6px;">
                PERSETUJUAN UMUM UNTUK TINDAKAN KEDOKTERAN
              </td>
            </tr>

            <tr>
              <td colspan="6">
                <ol type="1" style="padding-left: 20px;">
                  <li style="margin-bottom:6px;">
                    <strong>PERSETUJUAN ASUHAN KESEHATAN</strong>
                    <p style="margin-top: 2px; text-align:justify;">Saya menyadari bahwa tindakan kedokteran adalah berisiko, meliputi tindakan medis berupa preventif, diagnostik, terapeutik atau rehabilitatif yang dilakukan oleh dokter atau dokter gigi terhadap Pasien.</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya menyetujui segala pelayanan medis di RS Bhayangkara sebagaimana sesuai dengan keadaan medis saya selama mendapatkan pelayanan medis (kecuali yang membutuhkan persetujuan khusus/tertulis).</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya dengan ini menyetujui kembali kepada RS Bhayangkara, dalam memberikan pelayanan medis, pemeriksaan fisik, yang dapat dilakukan oleh dokter atau perawat, dan melakukan prosedur diagnostik, atau terapi dan tatalaksana sesuai pertimbangan dokter yang diperlukan atau disarankan pada pelayanan medis untuk saya. Hal ini mencakup seluruh pemeriksaan dan prosedur diagnostik rutin, termasuk namun tidak terbatas pada x-ray, pemberian dan atau tindakan kedokteran serta penyuntikan (intramuskular, intravena dan prosedur invasif lainnya) produk farmasi dan obat-obatan, pemasangan alat medis, dan pengambilan darah untuk pemeriksaan laboratorium atau pemeriksaan patologi yang dibutuhkan untuk pengobatan medis saya.</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya mempercayakan kepada semua tenaga kesehatan rumah sakit untuk memberikan perawatan, diagnostik dan terapi kepada saya sebagai pasien rawat inap maupun rawat jalan atau Instalasi Gawat Darurat (IGD), termasuk semua pemeriksaan penunjang, yang dibutuhkan untuk pengobatan dan tindakan yang diperlukan.</p>
                  </li>
                  <li style="margin-bottom:6px;">
                    <strong>KEJADIAN TIDAK TERDUGA/DIHARAPKAN</strong>
                    <p style="margin-top: 2px; text-align:justify;">Saya mengerti dan menyadari bahwa dalam tindakan kedokteran dapat terjadi adanya kejadian tidak terduga/diharapkan (unanticipated outcome) yang merupakan efek samping dari tindakan kedokteran yang tidak dapat diduga sebelumnya (termasuk antara lain, namun tidak terbatas pada Steven Johnson Syndrome dan syok anafilaktik).</p>
                    <p style="margin-top: 2px; text-align:justify;">Saya mengerti bahwa hasil asuhan dan pengobatan termasuk kejadian yang tidak terduga/diharapkan akan diberitahukan kepada saya dan keluarga oleh Dokter Penanggung Jawab Pasien (DPJP).</p>
                  </li>
                </ol>
              </td>
            </tr>

            <tr>
              <td colspan="6" style="text-align: center; font-weight: bold; background-color: #fafafa; padding: 8px;">
                SAYA TELAH DIJELASKAN, MEMBACA, MEMAHAMI, dan SEPENUHNYA SETUJU terhadap pernyataan tersebut diatas.
              </td>
            </tr>

            <tr>
              <td colspan="6" style="padding-top: 15px; padding-bottom: 15px;">
                <table class="pap-inner-align">
                  <tr>
                    <td style="width: 50%;"></td>
                    <td style="width: 50%; text-align: center;">
                      Banda Aceh, <strong>${d.tglConsent || '................................'}</strong>
                    </td>
                  </tr>
                  <tr style="height: 90px;">
                    <td style="text-align: center; vertical-align: top; padding-top: 5px;">
                      <div>Yang menjelaskan (Petugas RS):</div>
                      <div style="height:60px;display:flex;align-items:center;justify-content:center;">
                        ${d.sigPetugas ? `<img src="${d.sigPetugas}" style="max-height:55px;">` : '<br><br>'}
                      </div>
                      <div>( <strong>${d.namaPetugas || '........................................'}</strong> )</div>
                    </td>
                    <td style="text-align: center; vertical-align: top; padding-top: 5px;">
                      <div>Pasien / Penanggung Jawab:</div>
                      <div style="height:60px;display:flex;align-items:center;justify-content:center;">
                        ${d.sigPasien ? `<img src="${d.sigPasien}" style="max-height:55px;">` : '<br><br>'}
                      </div>
                      <div>( <strong>${d.namaTtdPasien || d.namaWali || '........................................'}</strong> )</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const pages = [
        { headerHtml: headerHtml, bodyHtml: page1Body },
        { headerHtml: '', bodyHtml: page2Body }
      ];

      return createMultiPageSurat(pages, 'RM01/Rev02/RSBHY/2026');
    }
  }

  t.ɵfac = function(f) { return new (f || t)(); };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-general-consent-placeholder"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2
  });

  return t;
})();
