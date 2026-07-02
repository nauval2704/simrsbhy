import { a as i } from "./chunk-W7XVFZVJ.js";
import { y as HttpClient } from "./chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "./chunk-UYVTZL26.js";
import "./chunk-SURAT-CANVAS.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-pemberian-obat-igd-wrapper");
    ɵelementEnd();
  }
}

var PemberianObatIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.patient = null;
      this.loading = true;
      this.canvasDataUrl = null;

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
            this.loading = false;
            this.fetchDraft();
          },
          error: () => {
            this.loading = false;
            this.renderView();
          },
        });
    }

    fetchDraft() {
      this.http
        .get(i.apiUrl + "/simrsba/pemberian-obat-igd/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.data && res.data.canvasImage) {
              this.canvasDataUrl = res.data.canvasImage;
            }
            this.renderView();
          },
          error: () => {
            this.renderView();
          },
        });
    }

    handleSubmit(dataUrl) {
      const payload = {
        noCheckin: this.noCheckin,
        noMr: this.patient?.noMr || this.patient?.norm || "",
        namaPasien: this.patient?.nama || "",
        dpjp: this.patient?.dokterDpjp || this.patient?.dpjp || "",
        canvasImage: dataUrl,
      };

      const surat = document.querySelector("surat-canvas");

      this.http
        .post(i.apiUrl + "/simrsba/pemberian-obat-igd", payload)
        .subscribe({
          next: () => {
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Formulir Pemberian Obat berhasil disimpan");
          },
          error: () => {
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan Formulir Pemberian Obat");
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

    renderView() {
      const root = document.querySelector("app-pemberian-obat-igd-wrapper");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div style="display:flex;justify-content:center;align-items:center;min-height:300px;font-family:Arial;color:#888;">Memuat data pasien...</div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || "-";
      const kelamin = p.kelamin || "-";
      const tglMasuk = p.tglInput || "-";
      const ruang = p.ruangan || p.poli || "IGD";
      const dpjp = p.dokterDpjp || p.dpjp || "-";
      const diagnosa = p.diagnosa || "-";

      const self = this;

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "assets/surat.css";
        document.head.appendChild(link);
      }

      root.innerHTML = `
<style>
    /* Add internal specific styles for this form */
    .fpo-main-border {
        border: 2px solid black;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .fpo-header-section {
        display: flex;
        border-bottom: 2px solid black;
        height: 95px;
    }
    .fpo-logo-box {
        width: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-right: 1px solid black;
        padding: 5px;
    }
    .fpo-logo-box img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    .fpo-title-box {
        flex: 1.1;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 5px;
        border-right: 1px solid black;
    }
    .fpo-title-box h3 {
        font-size: 15px;
        font-weight: bold;
        margin-bottom: 2px;
        line-height: 1.2;
    }
    .fpo-title-box p {
        font-size: 10.5px;
        line-height: 1.3;
    }
    .fpo-doc-title-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5px;
        border-right: 1px solid black;
        background-color: #f9f9f9;
    }
    .fpo-doc-title-container h2 {
        font-size: 16px;
        font-weight: bold;
        letter-spacing: 0.5px;
        margin: 0;
    }
    .fpo-meta-box {
        width: 280px;
        padding: 6px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .fpo-meta-inner {
        border: 1px solid black;
        border-radius: 8px;
        padding: 5px;
        font-size: 11px;
        line-height: 1.3;
        background-color: white;
    }
    .fpo-meta-row { display: flex; }
    .fpo-meta-label { width: 75px; font-weight: bold; }
    .fpo-admission-context {
        display: flex;
        justify-content: space-between;
        padding: 8px;
        border-bottom: 2px solid black;
        font-size: 12px;
        background-color: #fafafa;
    }
    .fpo-context-col {
        width: 32%;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .fpo-context-row {
        display: flex;
    }
    .fpo-context-label {
        width: 110px;
    }
    .fpo-context-value {
        flex: 1;
        border-bottom: 1px dotted black;
    }
    .fpo-table {
        width: 100%;
        border-collapse: collapse;
        flex: 1;
    }
    .fpo-table th, .fpo-table td {
        border: 1px solid black;
        padding: 2px;
        vertical-align: middle;
        font-size: 10px;
    }
    .fpo-table th {
        text-align: center;
        font-weight: bold;
        background-color: #f2f2f2;
    }
    .fpo-col-no { width: 3%; text-align: center; font-size: 11px; }
    .fpo-col-nama-obat { width: 25%; font-size: 11px; padding-left: 6px; }
    .fpo-col-time-slot { width: 3%; text-align: center; font-size: 9px; font-weight: bold; background-color: #fafafa; }
    .fpo-med-row td {
        height: 40px;
    }
    .fpo-form-identifier {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        margin-top: 5px;
        font-family: Arial, sans-serif;
        color: #333;
    }
</style>
<surat-canvas id="rp-surat" data-width="1248" data-height="816">
    <div class="fpo-main-border">
        <!-- Header Module -->
        <div class="fpo-header-section">
            <div class="fpo-logo-box">
                <img src="assets/img/1.png" alt="Logo RS Bhayangkara" onerror="this.style.display='none'">
            </div>
            <div class="fpo-title-box">
                <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
                <p>Jln. Cut Nyak Dhien No. 23 Lamteumen Barat,<br>Banda Aceh Telp. 0651-41355, 0651-41470</p>
            </div>
            <div class="fpo-doc-title-container">
                <h2>FORMULIR PEMBERIAN OBAT</h2>
            </div>
            <div class="fpo-meta-box">
                <div class="fpo-meta-inner">
                    <div class="fpo-meta-row"><div class="fpo-meta-label">NRM</div><div>: ${noMr}</div></div>
                    <div class="fpo-meta-row"><div class="fpo-meta-label">Nama</div><div>: ${nama}</div></div>
                    <div class="fpo-meta-row"><div class="fpo-meta-label">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
                    <div class="fpo-meta-row"><div class="fpo-meta-label">Jenis Kelamin</div><div>: ${kelamin}</div></div>
                </div>
            </div>
        </div>

        <!-- Admission & Treatment Metadata -->
        <div class="fpo-admission-context">
            <div class="fpo-context-col">
                <div class="fpo-context-row"><div class="fpo-context-label">Nama Pasien</div><div>: &nbsp;</div><div class="fpo-context-value">${nama}</div></div>
                <div class="fpo-context-row"><div class="fpo-context-label">Tanggal Masuk</div><div>: &nbsp;</div><div class="fpo-context-value">${tglMasuk}</div></div>
                <div class="fpo-context-row"><div class="fpo-context-label">Ruang / Kamar</div><div>: &nbsp;</div><div class="fpo-context-value">${ruang}</div></div>
            </div>
            <div class="fpo-context-col">
                <div class="fpo-context-row"><div class="fpo-context-label">No. Rekam Medis</div><div>: &nbsp;</div><div class="fpo-context-value">${noMr}</div></div>
                <div class="fpo-context-row"><div class="fpo-context-label">DPJP</div><div>: &nbsp;</div><div class="fpo-context-value">${dpjp}</div></div>
                <div class="fpo-context-row"><div class="fpo-context-label">Diagnosa</div><div>: &nbsp;</div><div class="fpo-context-value">${diagnosa}</div></div>
            </div>
            <div class="fpo-context-col" style="width: 25%; border: 1px dashed #bbb; padding: 4px; background: white; justify-content: center; align-items: center; display: flex; font-size: 11px;">
                <center style="color:#555; font-style:italic;">Tempel Label Identitas Pasien<br>Jika Tersedia</center>
            </div>
        </div>

        <!-- Schedule Medication Matrix Grid -->
        <table class="fpo-table">
            <thead>
                <tr>
                    <th rowspan="2" class="fpo-col-no">No.</th>
                    <th rowspan="2" class="fpo-col-nama-obat">NAMA OBAT ORAL / TOPIKAL</th>
                    <th colspan="4">TANGGAL: ________________</th>
                    <th colspan="4">TANGGAL: ________________</th>
                    <th colspan="4">TANGGAL: ________________</th>
                    <th colspan="4">TANGGAL: ________________</th>
                    <th colspan="4">TANGGAL: ________________</th>
                    <th colspan="4">TANGGAL: ________________</th>
                </tr>
                <tr>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                    <th class="fpo-col-time-slot">PG</th><th class="fpo-col-time-slot">SI</th><th class="fpo-col-time-slot">SO</th><th class="fpo-col-time-slot">ML</th>
                </tr>
            </thead>
            <tbody>
                <tr class="fpo-med-row"><td style="text-align:center;">1</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">2</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">3</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">4</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">5</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">6</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">7</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">8</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">9</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">10</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">11</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">12</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                <tr class="fpo-med-row"><td style="text-align:center;">13</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            </tbody>
        </table>
    </div>
    
    <div class="fpo-form-identifier">
        <div>RM014/ReV01/RSBHY/2022</div>
        <div>(1)</div>
    </div>
</surat-canvas>`;

      const surat = root.querySelector("surat-canvas");
      if (surat) {
        surat.addEventListener("save", (e) => {
          self.handleSubmit(e.detail.canvasData);
        });
        if (self.canvasDataUrl) {
          surat.canvasDataUrl = self.canvasDataUrl;
        }
      }
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-pemberian-obat-igd-wrapper"]],
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

export { PemberianObatIgdComponent };
