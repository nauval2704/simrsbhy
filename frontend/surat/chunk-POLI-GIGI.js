import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import "./chunk-SURAT-CANVAS.js";

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
      this.loading = true;
      this.saving = false;
      this.gigiData = null;
      this.patient = null;
      this.canvasDataUrl = null;

      const pathParts = window.location.pathname.split("/");
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
      this.http.get(i.apiUrl + "/simrsba/poli-gigi/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.gigiData = res.data;
            if (res.data.canvasImage) this.canvasDataUrl = res.data.canvasImage;
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

    handleSave(dataUrl) {
      this.saving = true;
      const surat = document.querySelector("surat-canvas");
      this.http
        .post(i.apiUrl + "/simrsba/poli-gigi", {
          noCheckin: this.noCheckin,
          noMr: this.patient?.noMr || this.patient?.norm || "",
          canvasImage: dataUrl,
        })
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.gigiData = res.data;
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "PRMRJ Poli Gigi berhasil disimpan");
          },
          error: () => {
            this.saving = false;
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan PRMRJ Poli Gigi");
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
      const root = document.querySelector("app-poli-gigi-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || "-";
      const kelamin = p.kelamin || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 11, minSize = 8) => {
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

      root.innerHTML = `
<surat-canvas id="rp-surat" data-width="1248" data-height="816">
<style>
.gigi-wrapper * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; }
.surat-content { padding: 0 !important; }
.gigi-wrapper { background-color: white; width: 100%; height: 100%; padding: 20px; display: flex; flex-direction: column; overflow: hidden; }

.main-border {
    border: 2px solid black;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.header-section {
    display: flex;
    border-bottom: 2px solid black;
    height: 95px;
    flex-shrink: 0;
}

.logo-box {
    width: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid black;
    padding: 5px;
    flex-shrink: 0;
}

.logo-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.title-box {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px;
}

.title-box h3 {
    font-size: 16px;
    margin-bottom: 3px;
    line-height: 1.2;
}

.title-box p {
    font-size: 11px;
    line-height: 1.3;
}

.meta-box {
    width: 350px;
    padding: 5px;
    border-left: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
}

.meta-inner {
    border: 1px solid black;
    border-radius: 8px;
    padding: 6px;
    font-size: 11px;
    line-height: 1.4;
}

.meta-row { 
    display: flex; 
}

.meta-label { 
    width: 90px; 
}

.doc-title {
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    padding: 8px;
    border-bottom: 2px solid black;
    background-color: #f5f5f5;
    letter-spacing: 0.5px;
    flex-shrink: 0;
}

.gigi-table-wrap {
    flex: 1;
    overflow: hidden;
}

.gigi-table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    font-size: 12px;
    table-layout: fixed;
}

.gigi-table th, .gigi-table td {
    border: 1px solid black;
    padding: 6px;
    vertical-align: top;
}

.gigi-table th {
    text-align: center;
    vertical-align: middle;
    font-size: 11px;
    background-color: #f9f9f9;
    font-weight: bold;
    height: 35px;
}

.col-no { width: 4%; text-align: center; }
.col-waktu { width: 12%; }
.col-gigi { width: 10%; text-align: center; }
.col-keluhan { width: 30%; }
.col-tindakan { width: 28%; }
.col-paraf { width: 8%; text-align: center; }
.col-icd { width: 8%; text-align: center; }
</style>

<div class="gigi-wrapper">
    <div class="main-border">
        <!-- Header Section -->
        <div class="header-section">
            <div class="logo-box">
                <img src="assets/img/1.png" alt="Logo RS Bhayangkara" onerror="this.style.display='none'">
            </div>
            <div class="title-box">
                <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
                <p>Jl. Cut Nyak Dhien No. 23 Lamteumen Barat,<br>Banda Aceh Telp. 0651-41355, 0651-41470</p>
            </div>
            <div class="meta-box">
                <div class="meta-inner">
                    <div class="meta-row"><div class="meta-label">NRM</div><div style="font-size:${getFontSize(noMr)}px !important">: ${noMr}</div></div>
                    <div class="meta-row"><div class="meta-label">Nama</div><div style="font-size:${getFontSize(nama)}px !important">: ${nama}</div></div>
                    <div class="meta-row"><div class="meta-label">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
                    <div class="meta-row"><div class="meta-label">Jenis Kelamin</div><div>: ${kelamin}</div></div>
                </div>
            </div>
        </div>

        <!-- Document Title -->
        <div class="doc-title">PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLI GIGI</div>

        <!-- PRMRJ Table Data Structure -->
        <div class="gigi-table-wrap">
            <table class="gigi-table">
                <thead>
                    <tr>
                        <th class="col-no">NO</th>
                        <th class="col-waktu">TGL / JAM</th>
                        <th class="col-gigi">GIGI</th>
                        <th class="col-keluhan">KELUHAN / DIAGNOSA</th>
                        <th class="col-tindakan">PENGOBATAN DAN TINDAKAN</th>
                        <th class="col-icd">KODE ICD 10</th>
                        <th class="col-paraf">PARAF</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1 -->
                    <tr>
                        <td style="text-align:center;">1</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 2 -->
                    <tr>
                        <td style="text-align:center;">2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 3 -->
                    <tr>
                        <td style="text-align:center;">3</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 4 -->
                    <tr>
                        <td style="text-align:center;">4</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 5 -->
                    <tr>
                        <td style="text-align:center;">5</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 6 -->
                    <tr>
                        <td style="text-align:center;">6</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 7 -->
                    <tr>
                        <td style="text-align:center;">7</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 8 -->
                    <tr>
                        <td style="text-align:center;">8</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <!-- Row 9 -->
                    <tr>
                        <td style="text-align:center;">9</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</surat-canvas>
`;

      root.__poligigi = self;

      const surat = root.querySelector("surat-canvas");
      if (surat) {
        surat.addEventListener("save", (e) => {
          self.handleSave(e.detail.canvasData);
        });
        if (self.canvasDataUrl) surat.canvasDataUrl = self.canvasDataUrl;
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
