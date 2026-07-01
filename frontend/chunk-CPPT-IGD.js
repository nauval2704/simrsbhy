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
    ɵelementStart(0, "app-cppt-igd-placeholder");
    ɵelementEnd();
  }
}

var CpptIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.loading = true;
      this.saving = false;
      this.cpptData = null;
      this.patient = null;
      this.canvasDataUrl = null;

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[5];
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
            "/simrsba/caripasien/pelayanan/IGD/nocheckin/" +
            this.noCheckin,
        )
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) this.patient = res[0];
            this.fetchCppt();
          },
          error: () => {
            this.fetchCppt();
          },
        });
    }

    fetchCppt() {
      this.http.get(i.apiUrl + "/simrsba/cppt-igd/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.cpptData = res.data;
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
        .post(i.apiUrl + "/simrsba/cppt-igd", {
          noCheckin: this.noCheckin,
          canvasImage: dataUrl,
        })
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.cpptData = res.data;
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "CPPT IGD berhasil disimpan");
          },
          error: () => {
            this.saving = false;
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan CPPT IGD");
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
      const root = document.querySelector("app-cppt-igd-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-danger mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data CPPT IGD...</div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || "-";
      const nama = p.nama || "-";
      const tglLahir = p.tglLahir || "-";
      const kelamin = p.kelamin || "-";

      const getFontSize = (str, maxLen = 16, defaultSize = 10, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        return Math.max(minSize, defaultSize * (maxLen / str.length)).toFixed(
          1,
        );
      };

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "assets/surat.css";
        document.head.appendChild(link);
      }

      const self = this;

      root.innerHTML = `
<surat-canvas id="rp-surat">
<style>
.main-border {
    border: 2px solid black;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Times New Roman', Times, serif;
}
.main-border * {
    font-size: 11px !important;
    line-height: 1.3 !important;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
.header-section {
    display: flex;
    border-bottom: 2px solid black;
    height: 90px;
}
.logo-box {
    width: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid black;
    font-size: 11px !important;
    text-align: center;
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
    font-size: 13px !important;
    font-weight: bold;
    margin-bottom: 2px;
}
.title-box p {
    font-size: 11px !important;
}
.meta-box {
    width: 250px;
    padding: 5px;
    border-left: 1px solid black;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.meta-inner {
    border: 1px solid black;
    border-radius: 6px;
    padding: 4px;
}
.meta-row {
    display: flex;
}
.meta-label {
    width: 80px;
}
.cppt-title {
    text-align: center;
    font-weight: bold;
    font-size: 13px !important;
    padding: 6px;
    border-bottom: 2px solid black;
}
.cppt-table {
    width: 100%;
    border-collapse: collapse;
    flex: 1;
    table-layout: fixed;
}
.cppt-table th, .cppt-table td {
    border-right: 1px solid black;
    text-align: center;
    vertical-align: middle;
    padding: 4px;
    box-sizing: border-box;
}
.cppt-table th:last-child, .cppt-table td:last-child {
    border-right: none;
}
.cppt-table thead tr {
    border-bottom: 2px solid black;
}
.cppt-table td {
    vertical-align: top;
}
.cppt-table .body-row td {
    height: 600px;
}
.desc-text {
    font-weight: normal;
    font-size: 10px !important;
    margin-top: 3px;
    text-align: center;
}
</style>

<div class="main-border">
    <div class="header-section">
        <div class="logo-box">
            <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
        </div>
        <div class="title-box">
            <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
            <p>Jln. Cut Nyak Dhien No. 23 Lamteumen Barat,<br>Banda Aceh Telp. 0651-41355, 0651-41470</p>
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

    <div class="cppt-title">CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (CPPT)</div>

    <table class="cppt-table">
        <colgroup>
            <col style="width:8%">
            <col style="width:9%">
            <col style="width:44%">
            <col style="width:25%">
            <col style="width:14%">
        </colgroup>
        <thead>
            <tr>
                <th>Tgl/<br>Jam</th>
                <th>Profesi/<br>Bagian</th>
                <th>
                    <div style="font-weight:bold !important;">Hasil Pemeriksaan, Analisa, Rencana, dan Penata Laksanaan Pasien</div>
                    <div class="desc-text">(Diisi Oleh Dokter/Apoteker Dengan Format SOAP, Perawat/Bidan/ Keterampilan Fisik/Keteknesian Medis/ Dengan Format SBAR, Dan Dietisien Dengan Format ADIME)</div>
                </th>
                <th>
                    <div style="font-weight:bold !important;">Intruksi Tenaga Kesehatan</div>
                    <div class="desc-text">(Intruksi Penatalaksanaan pasien dituliskan dengan rincian yang jelas)</div>
                </th>
                <th>
                    <div style="font-weight:bold !important;">Verifikasi Dpjp</div>
                    <div class="desc-text">(Bubuhkan Stempel, Nama, Tanda Tangan)</div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="body-row">
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</surat-canvas>`;

      root.__cpptIgd = self;

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
