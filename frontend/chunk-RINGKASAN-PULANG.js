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
    ɵelementStart(0, "app-ringkasan-pulang-wrapper");
    ɵelementEnd();
  }
}

var RingkasanPulangComponent = (() => {
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

    ngAfterViewInit() {}

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
        .get(i.apiUrl + "/simrsba/ringkasan-pulang/" + this.noCheckin)
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
        .post(i.apiUrl + "/simrsba/ringkasan-pulang", payload)
        .subscribe({
          next: () => {
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Ringkasan Pulang berhasil disimpan");
          },
          error: () => {
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan Ringkasan Pulang");
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
      const root = document.querySelector("app-ringkasan-pulang-wrapper");
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

      const getFontSize = (str, maxLen = 16, defaultSize = 11, minSize = 7) => {
        if (!str || str.length <= maxLen) return defaultSize;
        const ratio = maxLen / str.length;
        return Math.max(minSize, defaultSize * ratio).toFixed(1);
      };

      const self = this;

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "assets/surat.css";
        document.head.appendChild(link);
      }

      root.innerHTML = `
<surat-canvas id="rp-surat">
      <div class="surat-border">

        <div class="surat-header">
          <div class="surat-header-logo">
            <img src="assets/img/1.png" alt="Logo" onerror="this.style.display='none'">
          </div>
          <div class="surat-header-title">
            <h3>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</h3>
            <p>Jln. Cut Nyak Dhien No. 23 Lamteumen Barat<br>Banda Aceh Telp. 0651-41355, 0651-41470</p>
          </div>
          <div class="surat-header-meta">
            <div class="surat-meta-inner">
              <div class="surat-meta-row"><div class="surat-meta-label">NRM</div><div style="font-size: ${getFontSize(noMr)}px">: ${noMr}</div></div>
              <div class="surat-meta-row"><div class="surat-meta-label">Nama</div><div style="font-size: ${getFontSize(nama)}px">: ${nama}</div></div>
              <div class="surat-meta-row"><div class="surat-meta-label">Tgl. Lahir</div><div style="font-size: ${getFontSize(tglLahir)}px">: ${tglLahir}</div></div>
              <div class="surat-meta-row"><div class="surat-meta-label">Jenis Kelamin</div><div style="font-size: ${getFontSize(kelamin)}px">: ${kelamin}</div></div>
            </div>
          </div>
        </div>

        <div class="surat-title-bar">RINGKASAN PULANG IGD</div>

        <div class="surat-row-fixed">
          <div class="surat-col w-50">Tanggal dan Jam masuk:</div>
          <div class="surat-col w-50">Tanggal dan Jam keluar:</div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Indikasi Masuk IGD</div>
          <div class="surat-col w-70"></div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Keluhan Utama</div>
          <div class="surat-col w-70"></div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-50">Pemeriksaan Fisik:</div>
          <div class="surat-col w-50">Pemeriksaan Penunjang:</div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Diagnosis Kerja</div>
          <div class="surat-col w-70"></div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-50">Tindakan / Terapi saat di IGD:</div>
          <div class="surat-col w-50">Diagnosis Banding</div>
        </div>

        <div class="surat-row flex-2">
          <div class="surat-col w-30">Tindak Lanjut</div>
          <div class="surat-col w-70">
            <ul class="surat-checkbox-list">
              <li><span class="surat-square"></span> Pulang Atas Permintaan Sendiri / Menolak rawat inap</li>
              <li>&nbsp;&nbsp;&nbsp;Alasan <span class="surat-dline" style="width:200px;"></span></li>
              <li><span class="surat-square"></span> Pulang Atas Persetujuan, jam <span class="surat-dline" style="width:100px;"></span></li>
              <li><span class="surat-square"></span> Kontrol Tgl <span class="surat-dline" style="width:100px;"></span> Ke <span class="surat-dline" style="width:100px;"></span></li>
              <li><span class="surat-square"></span> Dirujuk ke <span class="surat-dline" style="width:180px;"></span></li>
              <li><span class="surat-square"></span> Meninggal, pukul <span class="surat-dline" style="width:80px;"></span></li>
            </ul>
          </div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Alasan tidak perlu dirawat</div>
          <div class="surat-col w-70">
            <ul class="surat-checkbox-list">
              <li><span class="surat-square"></span> Keadaan umum: <span class="surat-dline" style="width:180px;"></span></li>
              <li>Tanda Kegawatan: <span class="surat-square"></span> Ada &nbsp;<span class="surat-square"></span> Tidak ada</li>
            </ul>
          </div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Edukasi</div>
          <div class="surat-col w-70"></div>
        </div>

        <div class="surat-row flex-2">
          <div class="surat-col w-30 vcenter">Kondisi saat keluar</div>
          <div class="surat-col w-70 flex-col" style="padding:0;">
            <div class="surat-row-fixed"><div class="surat-col w-100">Keadaan umum</div></div>
            <div class="surat-row-fixed"><div class="surat-col w-100">Kesadaran</div></div>
            <div style="display:flex;flex:1;">
              <div class="surat-col" style="width:25%;">Vital Sign</div>
              <div class="surat-col" style="width:35%;">
                TD &nbsp;: <br><br>Nadi: <br><br>RR &nbsp;:
              </div>
              <div class="surat-col" style="width:40%;border-right:none;">
                Suhu: <br><br>Nyeri:
              </div>
            </div>
          </div>
        </div>

        <div class="surat-row flex-1">
          <div class="surat-col w-30">Terapi Saat Pulang</div>
          <div class="surat-col w-70"></div>
        </div>

        <div class="surat-signature-row">
          <div class="surat-sig-block">
            <div style="font-weight:bold;">Pasien / Keluarga</div>
            <div class="surat-sig-line"></div>
          </div>
          <div class="surat-sig-block">
            <div>
              Banda Aceh, ....................................<br>
              <strong>Dokter Penanggungjawab<br>Pelayanan Kegawatdaruratan</strong>
            </div>
            <div class="surat-sig-line"></div>
            <div>Nama Jelas dan Gelar</div>
          </div>
        </div>

      </div>
      <div class="surat-footer">RM05/Rev01/RSBHY/2022</div>
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
        selectors: [["app-ringkasan-pulang-wrapper"]],
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

export { RingkasanPulangComponent };
