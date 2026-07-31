import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
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
  createAutoPageSurat,
  footerLabel
} from "./chunk-SURAT-LAYOUT.js";

function renderTemplate(t, s) {
  if (t & 1) {
    _elementStart(0, "app-hak-kewajiban-pasien-placeholder");
    _elementEnd();
  }
}

export var HakKewajibanPasienComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.patient = null;
      this.loading = true;

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
          this.noCheckin
        )
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.patient = res[0];
            } else {
              this.fetchPatientFallback();
            }
            this.loading = false;
            this.renderUI();
          },
          error: () => {
            this.fetchPatientFallback();
          }
        });
    }

    fetchPatientFallback() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasienpolinocheckin/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) this.patient = res[0];
            this.loading = false;
            this.renderUI();
          },
          error: () => {
            this.loading = false;
            this.renderUI();
          }
        });
    }

    renderUI() {
      const root = document.querySelector("app-hak-kewajiban-pasien-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:250px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat Hak dan Kewajiban Pasien...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || p.tanggal_lahir || "-";
      const kelamin = p.kelamin || p.jenis_kelamin || "-";

      const documentBody = `
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
            <!-- HEADER INSTITUSI (STANDALONE TANPA BOX IDENTITAS PASIEN) -->
            <tr>
              <td colspan="6" style="padding: 6px;">
                <table class="pap-inner-align">
                  <tr>
                    <td style="width: 15%; text-align: center; vertical-align: middle;">
                      <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
                    </td>
                    <td style="width: 70%; vertical-align: middle; text-align: center;">
                      <strong style="font-size: 14px;">RUMAH SAKIT BHAYANGKARA BANDA ACEH</strong><br>
                      <span style="font-size: 11px;">Jln. Cut Nyak Dhien No. 23 Lamteumen Barat, Banda Aceh Telp. 0651-41355, 0651-41470</span>
                    </td>
                    <td style="width: 15%;"></td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- JUDUL FORMULIR -->
            <tr>
              <td colspan="6" style="background-color: #e0e0e0; text-align: center; font-weight: bold; font-size: 13px; padding: 6px; letter-spacing: 0.5px;">
                HAK DAN KEWAJIBAN PASIEN<br>RUMAH SAKIT BHAYANGKARA BANDA ACEH
              </td>
            </tr>

            <!-- DASAR HUKUM -->
            <tr>
              <td colspan="6" style="padding: 6px 8px;">
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 6px; border-left: 3px solid #333;">DASAR HUKUM</div>
                <div style="font-style: italic; font-size: 10.5px; margin-bottom: 2px;">
                  <strong>Hak Pasien:</strong> Berdasarkan Pasal 32 Undang-Undang No. 44 Tahun 2009 tentang Rumah Sakit
                </div>
                <div style="font-style: italic; font-size: 10.5px;">
                  <strong>Kewajiban Pasien/Keluarga:</strong> Berdasarkan Pasal 26 Peraturan Menteri Kesehatan RI No. 4 Tahun 2018 tentang Kewajiban Rumah Sakit dan Kewajiban Pasien
                </div>
              </td>
            </tr>

            <!-- HAK PASIEN -->
            <tr>
              <td colspan="6" style="padding: 6px 8px;">
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 6px; border-left: 3px solid #333;">HAK PASIEN</div>
                <ul style="list-style-type: disc; padding-left: 18px; margin: 0;">
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan informasi tentang tata tertib dan peraturan yang berlaku di rumah sakit.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan informasi mengenai hak dan kewajiban pasien.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan pelayanan yang manusiawi, adil, jujur, dan tanpa diskriminasi.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan pelayanan kesehatan bermutu sesuai standar profesi dan Standar Prosedur Operasional (SPO).</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan pelayanan yang efektif dan efisien agar terhindar dari kerugian fisik maupun materi.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mengajukan pengaduan atas kualitas pelayanan yang diterima.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Memilih dokter dan kelas perawatan sesuai keinginan dan peraturan yang berlaku.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Meminta konsultasi penyakit ke dokter lain yang memiliki Surat Ijin Praktek (SIP) baik di dalam maupun di luar rumah sakit.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan privasi dan kerahasiaan penyakit beserta seluruh data medisnya.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan informasi lengkap mengenai diagnosis, metode tindakan medis, tujuan, alternatif tindakan, risiko, komplikasi, perkiraan hasil, dan perkiraan biaya pengobatan.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Memberikan persetujuan atau menolak tindakan medis yang akan dilakukan tenaga kesehatan.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Didampingi keluarga saat berada dalam kondisi kritis.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menjalankan ibadah sesuai agama dan kepercayaan masing-masing selama tidak mengganggu pasien lain.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mendapatkan keamanan dan keselamatan selama masa perawatan.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mengajukan usul, saran, atau perbaikan atas pelayanan rumah sakit.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menolak bimbingan rohani yang tidak sesuai dengan agama dan kepercayaan yang dianut.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menggugat atau menuntut rumah sakit jika terbukti memberikan pelayanan yang tidak sesuai standar baik secara lisan, tertulis, maupun gugatan hukum.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mengeluhkan pelayanan rumah sakit yang tidak sesuai standar melalui media cetak maupun elektronik sesuai ketentuan perundang-undangan.</li>
                </ul>
              </td>
            </tr>

            <!-- KEWAJIBAN PASIEN / KELUARGA -->
            <tr>
              <td colspan="6" style="padding: 6px 8px;">
                <div style="font-weight: bold; text-transform: uppercase; margin-bottom: 4px; font-size: 11px; background-color: #fafafa; padding: 3px 6px; border-left: 3px solid #333;">KEWAJIBAN PASIEN / KELUARGA</div>
                <ul style="list-style-type: disc; padding-left: 18px; margin: 0;">
                  <li style="margin-bottom: 3px; text-align: justify;">Mematuhi seluruh peraturan yang berlaku di rumah sakit.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menggunakan fasilitas rumah sakit dengan penuh tanggung jawab.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menghormati hak pasien lain, pengunjung, serta hak tenaga kesehatan dan seluruh staf rumah sakit.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Memberikan informasi yang jujur, lengkap, dan akurat sesuai kemampuan dan pengetahuan mengenai masalah kesehatan yang dialami.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Memberikan informasi terkait kemampuan finansial dan jaminan kesehatan yang dimiliki.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Mematuhi rencana terapi yang direkomendasikan tenaga kesehatan dan telah disepakati pasien setelah mendapatkan penjelasan yang cukup serta sesuai peraturan yang berlaku.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Menerima segala konsekuensi jika secara pribadi menolak rencana terapi yang disarankan tenaga kesehatan, atau tidak mematuhi petunjuk pengobatan yang diberikan.</li>
                  <li style="margin-bottom: 3px; text-align: justify;">Memberikan imbal jasa atas pelayanan kesehatan yang diterima.</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      `;

      const printHtml = `
        <div class="surat-document">
          ${documentBody}
          ${footerLabel('RM02/Rev01/RSBHY/2026')}
        </div>
      `;

      const inputContent = `
        <div class="alert alert-info shadow-sm d-flex align-items-center mb-3">
          <i class="bi bi-info-circle-fill fs-4 me-3"></i>
          <div>
            <strong>Dokumen Komponen Hak dan Kewajiban Pasien:</strong><br>
            Dokumen ini merupakan leaflet / informasi resmi Hak &amp; Kewajiban Pasien di RS Bhayangkara Banda Aceh (tanpa box identitas pasien). Siap dilihat dan dicetak kapan saja.
          </div>
        </div>

        <div class="d-flex justify-content-end mt-3 border-top pt-3">
          <button id="btn-print-direct-hak" class="btn btn-primary px-4"><i class="bi bi-printer me-1"></i>Cetak Hak &amp; Kewajiban Pasien</button>
        </div>
      `;

      root.innerHTML = createSuratShell({
        idPrefix: 'hak-kewajiban-pasien',
        wrapperTag: 'app-hak-kewajiban-pasien-placeholder',
        inputPaneId: 'hak-input-pane',
        printPaneId: 'hak-print-pane',
        printTabId: 'hak-print-tab',
        tabsClass: 'hak-tabs',
        inputContent: inputContent,
        printContent: printHtml
      });

      bindSuratPrintButton(root);

      root.querySelector("#btn-print-direct-hak")?.addEventListener("click", () => {
        const printTab = root.querySelector("#hak-print-tab");
        if (printTab) {
          const tabObj = new bootstrap.Tab(printTab);
          tabObj.show();
          setTimeout(() => window.print(), 300);
        } else {
          window.print();
        }
      });
    }
  }

  t.ɵfac = function(f) { return new (f || t)(); };
  t.ɵcmp = _cmp({
    type: t,
    selectors: [["app-hak-kewajiban-pasien-placeholder"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2
  });

  return t;
})();
