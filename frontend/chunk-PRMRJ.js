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
      this.canvasDataUrl = null;

      const pathParts = window.location.pathname.split("/");
      // Path is usually like /poli/input/<norm>/nocheckin/<nocheckin>/prmrj/<nocheckin>
      // The last part is noCheckin
      this.noCheckin = pathParts[pathParts.length - 1];
    }

    ngOnInit() {
      this.fetchPatient();
    }

    ngAfterViewInit() {
      this.renderView();
    }

    fetchPatient() {
      // First try to get it from Poli Checkin
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
      this.http.get(i.apiUrl + "/simrsba/prmrj/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.prmrjData = res.data;
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
        .post(i.apiUrl + "/simrsba/prmrj", {
          noCheckin: this.noCheckin,
          noMr: this.patient?.noMr || this.patient?.norm || "",
          canvasImage: dataUrl,
        })
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.prmrjData = res.data;
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "PRMRJ berhasil disimpan");
          },
          error: () => {
            this.saving = false;
            if (surat) surat.resetSubmitButton();
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
        link.href = "assets/surat.css";
        document.head.appendChild(link);
      }

      const self = this;

      root.innerHTML = `
<surat-canvas id="rp-surat">
<style>
.prmrj-border * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; }
.prmrj-border { border: 2px solid black; display: flex; flex-direction: column; flex: 1; overflow: hidden; padding:0; height: 1180px; width: 756px; margin: 0 auto; background: white; }
.p-header { display: flex; border-bottom: 2px solid black; height: 90px; }
.p-logo { width: 110px; display: flex; align-items: center; justify-content: center; border-right: 1px solid black; font-size: 11px; text-align: center; }
.p-title { flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 5px; }
.p-title h3 { font-size: 16px; margin-bottom: 5px; font-weight: bold; }
.p-title p { font-size: 12px; }
.p-meta { width: 260px; padding: 5px; border-left: 1px solid black; display: flex; flex-direction: column; justify-content: center; }
.p-meta-inner { border: 1px solid black; border-radius: 8px; padding: 6px; font-size: 11px; line-height: 1.4; }
.p-row { display: flex; }
.p-label { width: 85px; }
.p-cppt-title { text-align: center; font-weight: bold; font-size: 15px; padding: 8px; border-bottom: 2px solid black; }
.p-table { display: flex; flex-direction: column; flex: 1; }
.p-th { display: flex; border-bottom: 2px solid black; font-weight: bold; text-align: center; font-size: 12px; }
.p-tb { display: flex; flex: 1; }
.p-col { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8px; border-right: 1px solid black; }
.p-col-body { border-right: 1px solid black; }
.p-col:last-child, .p-col-body:last-child { border-right: none; }
.w-1 { width: 5%; }
.w-2 { width: 12%; }
.w-3 { width: 10%; }
.w-4 { width: 33%; }
.w-5 { width: 15%; }
.w-6 { width: 20%; }
.w-7 { width: 5%; }
</style>

<div class="prmrj-border" style="margin-top:30px;">
    <div class="p-header">
        <div class="p-logo">
            <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:75px;object-fit:contain;" onerror="this.style.display='none'">
        </div>
        <div class="p-title">
            <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
            <p>Jln. Cut Nyak Dhien No. 23 Lamteumen Barat,<br>Banda Aceh Telp. 0651-41355, 0651-41470</p>
        </div>
        <div class="p-meta">
            <div class="p-meta-inner">
                <div class="p-row"><div class="p-label">NRM</div><div style="font-size:${getFontSize(noMr)}px !important">: ${noMr}</div></div>
                <div class="p-row"><div class="p-label">Nama</div><div style="font-size:${getFontSize(nama)}px !important">: ${nama}</div></div>
                <div class="p-row"><div class="p-label">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
                <div class="p-row"><div class="p-label">Jenis Kelamin</div><div>: ${kelamin}</div></div>
            </div>
        </div>
    </div>

    <div class="p-cppt-title">PANDUAN PROFIL RINGKAS RAWAT JALAN (PRMRJ) POLIKLINIK</div>

    <div class="p-table">
        <div class="p-th">
            <div class="p-col w-1">NO</div>
            <div class="p-col w-2">TGL/JAM</div>
            <div class="p-col w-3">DR.SP</div>
            <div class="p-col w-4">URAIAN KLINIS PENTING</div>
            <div class="p-col w-5">DIAGNOSIS</div>
            <div class="p-col w-6">RENCANA PENTING</div>
            <div class="p-col w-7">KET</div>
        </div>
        <div class="p-tb">
            <div class="p-col-body w-1"></div>
            <div class="p-col-body w-2"></div>
            <div class="p-col-body w-3"></div>
            <div class="p-col-body w-4"></div>
            <div class="p-col-body w-5"></div>
            <div class="p-col-body w-6"></div>
            <div class="p-col-body w-7"></div>
        </div>
    </div>
</div>
</surat-canvas>
`;

      root.__prmrj = self;

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
