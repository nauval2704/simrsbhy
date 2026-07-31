import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
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
  footerLabel,
  showSuccessToast,
  showErrorAlert
} from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-tata-tertib-ranap-placeholder");
    _elementEnd();
  }
}

export var SimrsTataTertibRanap = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.patient = null;
      this.loading = true;
      this.saving = false;

      this.formData = {
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        namaPetugas: "",
        namaPasienAtauPJ: "",
        ttdPetugas: null,
        ttdPasien: null
      };

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1] || pathParts[5];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    fetchPatient() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin)
        .subscribe({
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
      this.http.get(i.apiUrl + "/simrsba/tata-tertib-ranap/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.formData = Object.assign(this.formData, res.data);
          } else {
            this.initDefaults();
          }
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
      if (!this.formData.namaPasienAtauPJ && this.patient) {
        this.formData.namaPasienAtauPJ = this.patient.nama || "";
      }
      if (!this.formData.namaPetugas && this.patient) {
        this.formData.namaPetugas = this.patient.namaDokter || this.patient.dpjp || "";
      }
    }

    handleSave() {
      this.saving = true;
      const btn = document.getElementById("btn-save-tata-tertib");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Menyimpan...';
      }

      this.syncFromDOM();

      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        tanggal: this.formData.tanggal,
        namaPetugas: this.formData.namaPetugas,
        namaPasienAtauPJ: this.formData.namaPasienAtauPJ,
        ttdPetugas: this.formData.ttdPetugas,
        ttdPasien: this.formData.ttdPasien
      };

      this.http.post(i.apiUrl + "/simrsba/tata-tertib-ranap", payload).subscribe({
        next: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Tersimpan!';
            setTimeout(() => {
              btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Peraturan &amp; Tata Tertib';
            }, 2000);
          }
          showSuccessToast("Peraturan & Tata Tertib Pasien Rawat Inap berhasil disimpan");
        },
        error: () => {
          this.saving = false;
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save me-1"></i>Simpan Peraturan &amp; Tata Tertib';
          }
          showErrorAlert("Gagal menyimpan Peraturan & Tata Tertib");
        }
      });
    }

    syncFromDOM() {
      const root = document.querySelector("app-tata-tertib-ranap-placeholder");
      if (!root) return;

      const getValue = (id) => {
        const el = root.querySelector("#" + id);
        return el ? el.value : "";
      };

      this.formData.tanggal = getValue("ttb-tanggal") || this.formData.tanggal;
      this.formData.namaPetugas = getValue("ttb-namaPetugas");
      this.formData.namaPasienAtauPJ = getValue("ttb-namaPasienAtauPJ");
    }

    renderUI() {
      const root = document.querySelector("app-tata-tertib-ranap-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:250px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat Peraturan &amp; Tata Tertib Pasien Rawat Inap...</div></div></div>';
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

        <div class="card border mb-3">
          <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-pencil-square me-2"></i> Data Pernyataan &amp; Verifikasi Tata Tertib</div>
          <div class="card-body py-3">
            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="f-label">Tanggal Pernyataan</label>
                <input type="text" id="ttb-tanggal" class="f-input" value="${d.tanggal || ''}">
              </div>
              <div class="col-md-4">
                <label class="f-label">Yang Menjelaskan (Petugas RS)</label>
                <input type="text" id="ttb-namaPetugas" class="f-input" value="${d.namaPetugas || ''}" placeholder="Nama Petugas RS...">
              </div>
              <div class="col-md-4">
                <label class="f-label">Pasien / Penanggung Jawab</label>
                <input type="text" id="ttb-namaPasienAtauPJ" class="f-input" value="${d.namaPasienAtauPJ || ''}" placeholder="Nama Pasien / PJ...">
              </div>
            </div>

            <div class="row g-3">
              <div class="col-md-6">
                <div class="border rounded p-2 bg-light">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small fw-bold">TTD Yang Menjelaskan (Petugas RS):</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-ttb-petugas" style="font-size:10px;padding:1px 6px;">Hapus</button>
                  </div>
                  <canvas id="sig-ttb-petugas" width="500" height="150" style="height:110px;border:1px solid #ccc;background:#fff;width:100%;border-radius:4px;"></canvas>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border rounded p-2 bg-light">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="small fw-bold">TTD Pasien / Penanggung Jawab:</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-ttb-pasien" style="font-size:10px;padding:1px 6px;">Hapus</button>
                  </div>
                  <canvas id="sig-ttb-pasien" width="500" height="150" style="height:110px;border:1px solid #ccc;background:#fff;width:100%;border-radius:4px;"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3 border-top pt-3">
          <button id="btn-save-tata-tertib" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Peraturan &amp; Tata Tertib</button>
        </div>
      `;

      root.innerHTML = createSuratShell({
        idPrefix: 'tata-tertib-ranap',
        wrapperTag: 'app-tata-tertib-ranap-placeholder',
        inputPaneId: 'ttb-input-pane',
        printPaneId: 'ttb-print-pane',
        printTabId: 'ttb-print-tab',
        tabsClass: 'ttb-tabs',
        inputContent: inputContent
      });

      bindSuratPrintButton(root);

      root.querySelector("#btn-save-tata-tertib")?.addEventListener("click", () => this.handleSave());

      this.initCanvas("sig-ttb-petugas", "ttdPetugas");
      this.initCanvas("sig-ttb-pasien", "ttdPasien");

      const printTab = root.querySelector("#ttb-print-tab");
      if (printTab) {
        printTab.addEventListener("click", () => {
          this.syncFromDOM();
          this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
        });
      }

      this.renderPrintLayout(noMr, nama, tglLahir, kelamin);
    }

    initCanvas(id, fieldKey) {
      const canvas = document.getElementById(id);
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000";

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

      canvas.addEventListener("touchstart", start, { passive: true });
      canvas.addEventListener("touchmove", move, { passive: true });
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
      const container = document.getElementById("ttb-print-pane");
      if (!container) return;

      const d = this.formData;

      const bodyHtml = `
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
            <!-- HEADER INSTITUSI -->
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}

            <!-- JUDUL FORMULIR -->
            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 12px; padding: 5px; letter-spacing: 0.5px;">
                PERATURAN &amp; TATA TERTIB PASIEN RAWAT INAP<br>RUMAH SAKIT BHAYANGKARA BANDA ACEH
              </td>
            </tr>

            <!-- 2-COLUMN LAYOUT CONTENT BLOCK -->
            <tr>
              <!-- LEFT COLUMN (SEKSI A & B) -->
              <td colspan="3" style="width: 50%; vertical-align: top; padding: 5px 7px;">
                <!-- SEKSI A: KETENTUAN UMUM -->
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 5px; border-left: 3px solid #333;">A. KETENTUAN UMUM</div>
                <ol style="padding-left: 16px; margin: 0 0 6px 0; font-size: 10px;">
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien yang akan dirawat inap wajib membuat surat pernyataan kesediaan mematuhi peraturan dan bersedia membayar biaya perawatan jika bukan peserta jaminan.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Semua pasien rawat inap harus melampirkan Surat Pengantar Rawat dari dokter saat mendaftar di TPP (Tempat Pendaftaran Pasien) Rawat Inap.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Kelengkapan administrasi untuk pembuatan Surat Jaminan harus sesuai aturan dari masing-masing penyelenggara asuransi.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Kelengkapan administrasi tersebut diserahkan ke loket pengurusan jaminan rawat inap RS Bhayangkara Banda Aceh.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Waktu pembuatan jaminan bagi peserta adalah 3×24 jam.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pengurusan jaminan akan dihentikan jika pasien yang bersangkutan meninggal dunia, atau ada kepentingan kesehatan lain dari Rumah Sakit.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien dengan tanggungan perawatan kelas III yang ingin dirawat di kelas lebih tinggi, akan dikenakan tarif sesuai selisih biaya perawatan kelas tersebut.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Ketentuan lain yang berkaitan dengan pelayanan kesehatan.</li>
                </ol>

                <!-- SEKSI B: PELAYANAN -->
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 5px; border-left: 3px solid #333;">B. PELAYANAN</div>
                <ol style="padding-left: 16px; margin: 0; font-size: 10px;">
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien berhak mendapatkan informasi lengkap tentang penyakit/diagnosis, jenis penyakit, sifat penyakit, potensi komplikasi, perkiraan hasil pengobatan, pemeriksaan medis, tindakan medis yang akan dilakukan, efek samping pengobatan, serta saran selama masa perawatan; serta mendapatkan pelayanan dan perawatan yang sopan sesuai standar profesi tenaga medis.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien berhak memilih dokter (khusus VVIP, VIP) dan kelas perawatan sesuai keinginan, dengan mengikuti peraturan yang berlaku di rumah sakit.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien wajib memberikan informasi yang jujur dan lengkap mengenai penyakit yang diderita kepada dokter yang merawat.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien wajib mematuhi semua petunjuk dan saran dokter serta perawat/bidan yang merawatnya.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien wajib menghormati privasi dokter, perawat, dan tenaga kesehatan lain yang merawatnya.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien bersedia memberikan data medis kepada pihak ketiga hanya untuk keperluan pengurusan jaminan kesehatan atau kepentingan rumah sakit.</li>
                </ol>
              </td>

              <!-- RIGHT COLUMN (SEKSI C & D) -->
              <td colspan="3" style="width: 50%; vertical-align: top; padding: 5px 7px;">
                <!-- SEKSI C: CARA BERKUNJUNG -->
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 5px; border-left: 3px solid #333;">C. CARA BERKUNJUNG</div>
                <ol style="padding-left: 16px; margin: 0 0 6px 0; font-size: 10px;">
                  <li style="margin-bottom: 2px; text-align: justify;">Waktu kunjungan:
                    <ul style="list-style-type: disc; padding-left: 14px; margin-top: 1px; margin-bottom: 1px;">
                      <li>Senin – Minggu: Pukul 10.00 – 21.00 WIB</li>
                      <li>Pagi: 10.00 – 16.00 WIB</li>
                      <li>Sore/malam: 18.00 – 21.00 WIB</li>
                      <li>Kunjungan malam berakhir pukul 21.00 WIB</li>
                    </ul>
                  </li>
                  <li style="margin-bottom: 2px; text-align: justify;">Maksimal 2 orang pengunjung boleh menemani pasien setiap saat.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang masuk ruangan rawat jika:
                    <ul style="list-style-type: disc; padding-left: 14px; margin-top: 1px; margin-bottom: 1px;">
                      <li>Ruangan sedang dibersihkan</li>
                      <li>Dokter sedang memeriksa pasien</li>
                      <li>Perawat sedang memberikan pelayanan medis</li>
                    </ul>
                  </li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien hanya boleh didampingi/dijemput maksimal 1 orang; harus mendapat izin dari dokter atau kepala ruangan.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang merokok di seluruh area rumah sakit.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang membuang sampah sembarangan.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang mengubah tata letak fasilitas rumah sakit tanpa izin.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang meletakkan barang di jendela atau pagar rumah sakit.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang menunggu di luar ruangan rawat inap.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang tidur, memasang tikar/ambal, atau duduk di koridor rumah sakit.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang membuang sisa makanan atau air cucian di kamar pasien.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang membawa anak usia di bawah 2 tahun ke ruangan rawat inap.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Dilarang membawa barang yang tidak diperlukan seperti rice cooker, radio, kulkas, alat portabel, setrika, alat fisioterapi pribadi, dan lain-lain.</li>
                </ol>

                <!-- SEKSI D: KETENTUAN KHUSUS -->
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 5px; border-left: 3px solid #333;">D. KETENTUAN KHUSUS</div>
                <ol style="padding-left: 16px; margin: 0; font-size: 10px;">
                  <li style="margin-bottom: 2px; text-align: justify;">Ruangan rawat Insentif: keluarga tidak boleh berada di dalam ruangan, kecuali diizinkan secara khusus.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Pasien yang ingin pulang atas permintaan sendiri harus menandatangani formulir yang telah disediakan.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Jika dokter mengizinkan pulang, administrasi harus diselesaikan paling lambat pukul 12.00 WIB pada hari yang sama.</li>
                  <li style="margin-bottom: 2px; text-align: justify;">Rumah Sakit Bhayangkara Banda Aceh tidak bertanggung jawab atas kehilangan barang milik pasien atau keluarga selama perawatan.</li>
                </ol>
              </td>
            </tr>

            <!-- VERIFIKASI PERNYATAAN -->
            <tr>
              <td colspan="6" style="text-align: center; font-style: italic; background-color: #fafafa; padding: 6px; font-size: 10.5px;">
                Saya telah diberitahu, membaca, memahami, dan sepenuhnya menyetujui semua peraturan dan ketentuan yang tercantum di atas.
              </td>
            </tr>

            <!-- TANDA TANGAN -->
            <tr>
              <td colspan="6" style="padding-top: 10px; padding-bottom: 15px;">
                <table class="pap-inner-align">
                  <tr>
                    <td style="width: 50%;"></td>
                    <td style="width: 50%; text-align: center; font-size: 11px;">
                      Banda Aceh, ${d.tanggal || '........................................'}
                    </td>
                  </tr>
                  <tr style="height: 85px;">
                    <td style="text-align: center; vertical-align: top; padding-top: 5px; font-size: 11px;">
                      Yang Menjelaskan<br>
                      <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
                        ${d.ttdPetugas ? `<img src="${d.ttdPetugas}" style="max-height: 48px;" alt="TTD Petugas">` : '<br><br>'}
                      </div>
                      ( <strong>${d.namaPetugas || '........................................'}</strong> )
                    </td>
                    <td style="text-align: center; vertical-align: top; padding-top: 5px; font-size: 11px;">
                      Pasien / Penanggung Jawab<br>
                      <div style="height: 50px; display: flex; align-items: center; justify-content: center;">
                        ${d.ttdPasien ? `<img src="${d.ttdPasien}" style="max-height: 48px;" alt="TTD Pasien">` : '<br><br>'}
                      </div>
                      ( <strong>${d.namaPasienAtauPJ || '........................................'}</strong> )
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      container.innerHTML = `
        <div class="surat-print-bg">
          <div class="surat-document">
            ${bodyHtml}
            ${footerLabel('RM03/Rev01/RSBHY/2026')}
          </div>
        </div>
      `;
    }
  }

  t.ɵfac = function(f) { return new (f || t)(); };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-tata-tertib-ranap-placeholder"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2
  });

  return t;
})();
