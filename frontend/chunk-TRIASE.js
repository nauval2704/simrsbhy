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
    ɵelementStart(0, "app-triase-placeholder");
    ɵelementEnd();
  }
}

var TriaseComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.loading = true;
      this.saving = false;
      this.syncing = false;
      this.triaseData = null;
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
            this.fetchTriase();
          },
          error: () => {
            this.fetchTriase();
          },
        });
    }

    fetchTriase() {
      this.http.get(i.apiUrl + "/simrsba/triase/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.triaseData = res.data;
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
        .post(i.apiUrl + "/simrsba/triase", {
          noCheckin: this.noCheckin,
          canvasImage: dataUrl,
        })
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.triaseData = res.data;
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Triase berhasil disimpan");
            this.updateSyncButton();
          },
          error: () => {
            this.saving = false;
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan triase");
          },
        });
    }

    handleSync() {
      this.syncing = true;
      const btn = document.getElementById("triase-sync-btn");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-1"></span> Mengirim...';
      }
      this.http
        .post(i.apiUrl + "/simrsba/triase/sync-satusehat", {
          noCheckin: this.noCheckin,
          patientIhsNumber: "",
        })
        .subscribe({
          next: () => {
            this.syncing = false;
            if (this.triaseData) this.triaseData.satusehatSynced = true;
            if (btn) {
              btn.disabled = false;
              btn.innerHTML =
                '<i class="bi bi-cloud-check-fill me-1"></i> Sudah Tersinkron';
              btn.classList.remove("btn-outline-primary");
              btn.classList.add("btn-success");
            }
            this.showToast("success", "Sync SATUSEHAT berhasil");
          },
          error: (err) => {
            this.syncing = false;
            if (btn) {
              btn.disabled = false;
              btn.innerHTML =
                '<i class="bi bi-cloud-arrow-up me-1"></i> Sync SATUSEHAT';
            }
            this.showToast(
              "warning",
              err.error?.message || "Gagal sync ke SATUSEHAT",
            );
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

    updateSyncButton() {
      const container = document.getElementById("triase-sync-container");
      if (!container || !this.triaseData) return;
      if (this.triaseData.satusehatSynced) {
        container.innerHTML =
          '<button class="btn btn-success btn-sm" disabled><i class="bi bi-cloud-check-fill me-1"></i> Sudah Tersinkron</button>';
      } else {
        container.innerHTML =
          '<button id="triase-sync-btn" class="btn btn-outline-primary btn-sm" onclick="document.querySelector(\'app-triase-placeholder\').__triase.handleSync()"><i class="bi bi-cloud-arrow-up me-1"></i> Sync SATUSEHAT</button>';
      }
    }

    renderView() {
      const root = document.querySelector("app-triase-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-danger mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data triase...</div></div></div>';
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
.t-border{border:2px solid black;display:flex;flex-direction:column;flex:1;overflow:hidden;font-family:'Times New Roman',Times,serif;}
.t-border *{font-size:11px !important;line-height:1.3 !important;box-sizing:border-box;margin:0;padding:0;}
.t-border h3{font-size:13px !important;font-weight:bold;}
.t-row{display:flex;border-bottom:1px solid black;}
.t-row:last-child{border-bottom:none;}
.t-col{padding:3px 4px;border-right:1px solid black;}
.t-col:last-child{border-right:none;}
.t-f1{flex:1;}.t-f2{flex:2;}
.t-sq{display:inline-block;width:7px;height:7px;border:1px solid black;margin-right:3px;flex-shrink:0;vertical-align:middle;}
.t-level{font-weight:bold !important;padding:3px 4px;border-bottom:1px solid black;}
.t-arrow{text-align:center;padding:1px 0;border-bottom:1px solid black;}
.t-vgrid{display:grid;grid-template-columns:1fr 1fr 1fr;width:100%;gap:2px;}
.t-cbox{width:20px;height:10px;display:inline-block;border:1px solid black;}
.t-red{background-color:#f44336;}.t-yellow{background-color:#ffeb3b;}.t-green{background-color:#4caf50;}.t-blk{background-color:#212121;}
.t-white{color:white !important;}
.t-border ul{list-style:none;padding-left:2px !important;}
.t-border li{margin-bottom:1px !important;display:flex;align-items:flex-start;}
.t-footer{text-align:right;padding:3px 0 0 0;font-weight:bold;}
</style>

<div class="t-border">

  <div class="t-row" style="height:80px;border-bottom:2px solid black;flex-shrink:0;">
    <div class="t-col" style="width:100px;display:flex;align-items:center;justify-content:center;">
      <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
    </div>
    <div class="t-col" style="flex:1;text-align:center;display:flex;flex-direction:column;justify-content:center;">
      <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
      <p style="margin-top:3px;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>Barat, Banda Aceh Telp. 0651-41355, 0651-41470</p>
    </div>
    <div class="t-col" style="width:240px;display:flex;flex-direction:column;justify-content:center;">
      <div style="border:1px solid black;border-radius:6px;padding:4px;">
        <div style="display:flex;"><div style="width:75px;">NRM</div><div style="font-size:${getFontSize(noMr)}px !important">: ${noMr}</div></div>
        <div style="display:flex;"><div style="width:75px;">Nama</div><div style="font-size:${getFontSize(nama)}px !important">: ${nama}</div></div>
        <div style="display:flex;"><div style="width:75px;">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
        <div style="display:flex;"><div style="width:75px;">Jenis Kelamin</div><div>: ${kelamin}</div></div>
      </div>
    </div>
  </div>

  <div style="text-align:center;font-weight:bold !important;font-size:13px !important;padding:4px;border-bottom:2px solid black;text-transform:uppercase;flex-shrink:0;">FORMULIR TRIASE GAWAT DARURAT</div>

  <div class="t-row" style="font-weight:bold;flex-shrink:0;">
    <div class="t-col" style="width:45%;">
      <div>LABEL TRIASE (pilih salah satu hasil triase (√))</div>
      <div style="display:flex;gap:12px;margin-top:4px;align-items:center;">
        <span class="t-sq"></span><span class="t-cbox t-red"></span>
        <span class="t-sq"></span><span class="t-cbox t-yellow"></span>
        <span class="t-sq"></span><span class="t-cbox t-green"></span>
        <span class="t-sq"></span><span class="t-cbox t-blk"></span>
      </div>
      <div style="margin-top:4px;">Pukul pemeriksaan : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; WIB</div>
    </div>
    <div class="t-col" style="width:55%;display:flex;align-items:center;">
      <div class="t-vgrid" style="width:100%;">
        <div>TD :</div><div>Suhu :</div><div>CGS : E&nbsp;&nbsp;&nbsp; V&nbsp;&nbsp;&nbsp; M</div>
        <div>HR :</div><div>SPO2:</div><div></div>
        <div>RR :</div><div></div><div></div>
      </div>
    </div>
  </div>

  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
    <div class="t-col t-f1">AIRWAY</div>
    <div class="t-col t-f1">BREATHING</div>
    <div class="t-col t-f1">CIRCULATION</div>
    <div class="t-col t-f1">DISABILITY</div>
    <div class="t-col t-f1">PREDIKSI PENUNJANG</div>
  </div>
  <div class="t-row" style="flex-shrink:0;">
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Terintubasi</li><li><span class="t-sq"></span>Sumbatan</li><li><span class="t-sq"></span>Ancaman</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Apnoe</li><li><span class="t-sq"></span>Ventilator</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Henti Jantung</li><li><span class="t-sq"></span>Nadi Tak Teraba</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Tidak Respon</li><li><span class="t-sq"></span>Kejang</li><li><span class="t-sq"></span>GCS &lt;8</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Kompleks</li><li><span class="t-sq"></span>≥ 2</li></ul></div>
  </div>

  <div class="t-level t-red t-white">LEVEL 1 : RESUSITASI (RED ZONE)</div>
  <div class="t-arrow">↓ Tidak</div>

  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
    <div class="t-col t-f1">AIRWAY</div>
    <div class="t-col t-f1">BREATHING</div>
    <div class="t-col t-f1">CIRCULATION</div>
    <div class="t-col t-f1">DISABILITY</div>
    <div class="t-col t-f2">PREDIKSI PENUNJANG</div>
  </div>
  <div class="t-row" style="flex-shrink:0;">
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Ancaman</li><li><span class="t-sq"></span>Bebas</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Takipnue</li><li><span class="t-sq"></span>Bradipnue</li><li><span class="t-sq"></span>SPO2 &lt;92</li><li><span class="t-sq"></span>Dangkal</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Nadi Terasa Lemah</li><li><span class="t-sq"></span>Akral Dingin</li><li><span class="t-sq"></span>Bradikardi</li><li><span class="t-sq"></span>Takikardi</li><li><span class="t-sq"></span>CRT &gt;2 detik</li><li><span class="t-sq"></span>Turgor Kulit Jelek</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Respon Dengan Rangsangan Nyeri</li><li><span class="t-sq"></span>Gelisah</li><li><span class="t-sq"></span>GCS : &gt; 8 &gt; 15</li><li><span class="t-sq"></span>GCS : 15</li></ul></div>
    <div class="t-col t-f2"><ul><li><span class="t-sq"></span>Kompleks</li><li><span class="t-sq"></span>≥ 2</li><li style="margin-top:3px !important;">Catatan Khusus:</li><li><span class="t-sq"></span>Nyeri Berat</li><li><span class="t-sq"></span>Situasi Berbahaya :</li></ul></div>
  </div>

  <div class="t-row" style="justify-content:center;padding:3px 4px;font-weight:bold;flex-shrink:0;">
    Keterangan Termasuk level 2 apabila peringatan yang ada menimbulkan / berkaitan dengan kondisi yang berisiko tinggi memburuk pada pasien
  </div>

  <div class="t-level t-red t-white">LEVEL 2 : EMERGENSI (RED ZONE)</div>
  <div class="t-arrow">↓ Tidak</div>

  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
    <div class="t-col t-f1">AIRWAY</div>
    <div class="t-col t-f1">BREATHING</div>
    <div class="t-col t-f1">CIRCULATION</div>
    <div class="t-col t-f1">DISABILITY</div>
    <div class="t-col t-f1">PREDIKSI PENUNJANG</div>
  </div>
  <div class="t-row" style="flex-shrink:0;">
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Bebas</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Spontan</li><li><span class="t-sq"></span>Normal</li><li><span class="t-sq"></span>Takipnue</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Nadi Teraba Berat</li><li><span class="t-sq"></span>Nadi Teraba Lemah</li><li><span class="t-sq"></span>Akral Hangat</li><li><span class="t-sq"></span>Turgor Sedang</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>GCS 15</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>≥ 2</li></ul></div>
  </div>

  <div class="t-level t-yellow">LEVEL 3 : URGENT (YELLOW ZONE)</div>
  <div class="t-arrow">↓ Tidak</div>

  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
    <div class="t-col t-f1">AIRWAY</div>
    <div class="t-col t-f1">BREATHING</div>
    <div class="t-col t-f1">CIRCULATION</div>
    <div class="t-col t-f1">DISABILITY</div>
    <div class="t-col t-f1">PREDIKSI PENUNJANG</div>
    <div class="t-col t-f1">PREDIKSI SDM</div>
  </div>
  <div class="t-row" style="flex-shrink:0;">
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Bebas</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Spontan</li><li><span class="t-sq"></span>Normal</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Nadi Teraba Berat</li><li><span class="t-sq"></span>Akral Hangat</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Sadar</li><li><span class="t-sq"></span>GCS 15</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>≥ 2</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Spesialis / dr. Umum</li></ul></div>
  </div>

  <div class="t-level t-green t-white">LEVEL 4 : NON URGENT (GREEN ZONE)</div>
  <div class="t-arrow">↓ Tidak</div>

  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
    <div class="t-col t-f1">AIRWAY</div>
    <div class="t-col t-f1">BREATHING</div>
    <div class="t-col t-f1">CIRCULATION</div>
    <div class="t-col t-f1">DISABILITY</div>
    <div class="t-col t-f1">PREDIKSI PENUNJANG</div>
    <div class="t-col t-f1">PREDIKSI SDM</div>
  </div>
  <div class="t-row" style="flex-shrink:0;">
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Bebas</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Spontan</li><li><span class="t-sq"></span>Normal</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Nadi Teraba Berat</li><li><span class="t-sq"></span>Akral Hangat</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Sadar</li><li><span class="t-sq"></span>GCS 15</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>Tidak Ada</li></ul></div>
    <div class="t-col t-f1"><ul><li><span class="t-sq"></span>dr. Umum</li></ul></div>
  </div>

  <div class="t-level t-green t-white">LEVEL 5 : FALSE EMERGENCY</div>

  <div class="t-row" style="padding:4px;min-height:65px;flex-shrink:0;">DOA</div>

  <div class="t-row" style="min-height:80px;flex-shrink:0;">
    <div class="t-col" style="width:33.33%;padding:4px;display:flex;flex-direction:column;justify-content:space-between;">
      <div>Konsul</div>
      <div>( &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; )</div>
    </div>
    <div class="t-col" style="width:66.67%;padding:4px;border-right:none;display:flex;align-items:center;justify-content:center;">
      <div>Petugas Triase</div>
    </div>
  </div>

  <div class="t-row" style="flex-grow:1;border-bottom:none;">
    <div class="t-col" style="width:33.33%;padding:4px;">
      <ul>
        <li><span class="t-sq"></span>Ruang Resusitasi IGD</li>
        <li><span class="t-sq"></span>Ruang Ponek</li>
        <li><span class="t-sq"></span>Ruang Observasi</li>
      </ul>
    </div>
    <div class="t-col" style="width:66.67%;padding:0;display:flex;border-right:none;">
      <div style="width:50%;border-right:1px solid black;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px;">
        <div>TTD Dokter</div>
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;">
          <div style="border-bottom:1px solid black;width:80%;margin-top:40px;"></div>
          <div style="margin-top:3px;">Nama Jelas dan Gelar</div>
        </div>
      </div>
      <div style="width:50%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:6px;">
        <div>TTD Perawat</div>
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;">
          <div style="border-bottom:1px solid black;width:80%;margin-top:40px;"></div>
          <div style="margin-top:3px;">Nama Jelas dan Gelar</div>
        </div>
      </div>
    </div>
  </div>

</div>
<div class="t-footer">RM03/RSBHY/2022</div>
<div class="d-print-none" style="position:absolute;bottom:-40px;right:0;">
  <div id="triase-sync-container"></div>
</div>
</surat-canvas>`;

      root.__triase = self;

      const surat = root.querySelector("surat-canvas");
      if (surat) {
        surat.addEventListener("save", (e) => {
          self.handleSave(e.detail.canvasData);
        });
        if (self.canvasDataUrl) surat.canvasDataUrl = self.canvasDataUrl;
      }

      this.updateSyncButton();
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-triase-placeholder"]],
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

export { TriaseComponent };
