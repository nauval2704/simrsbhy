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
    ɵelementStart(0, "app-edukasi-poli-placeholder");
    ɵelementEnd();
  }
}

var EdukasiPoliComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.loading = true;
      this.saving = false;
      this.edukasiData = null;
      this.patient = null;
      this.canvasDataUrl = null;

      const pathParts = window.location.pathname.split("/");
      // Path is usually like /poli/input/<norm>/nocheckin/<nocheckin>/edukasi-poli/<nocheckin>
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
            this.fetchEdukasi();
          },
          error: () => {
            this.fetchEdukasi();
          },
        });
    }

    fetchEdukasi() {
      this.http.get(i.apiUrl + "/simrsba/edukasi-poli/" + this.noCheckin).subscribe({
        next: (res) => {
          if (res && res.data) {
            this.edukasiData = res.data;
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
        .post(i.apiUrl + "/simrsba/edukasi-poli", {
          noCheckin: this.noCheckin,
          noMr: this.patient?.noMr || this.patient?.norm || "",
          canvasImage: dataUrl,
        })
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.edukasiData = res.data;
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Edukasi Pasien berhasil disimpan");
          },
          error: () => {
            this.saving = false;
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan Edukasi Pasien");
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
      const root = document.querySelector("app-edukasi-poli-placeholder");
      if (!root) return;

      if (this.loading) {
        root.innerHTML =
          '<div class="d-flex justify-content-center align-items-center" style="min-height:200px"><div class="text-center"><div class="spinner-border text-primary mb-3" style="width:3rem;height:3rem;" role="status"></div><div class="text-muted fw-bold">Memuat data Edukasi...</div></div></div>';
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
<surat-canvas id="rp-surat" data-width="1248" data-height="816">
<style>
.edu-wrapper * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Times New Roman', Times, serif; }
/* Override surat-content padding so this landscape form fills the full paper area */
.surat-content { padding: 0 !important; }
.edu-wrapper { background-color: white; width: 100%; height: 100%; padding: 20px; display: flex; flex-direction: column; overflow: hidden; }
.main-border { border: 2px solid black; width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; }
.header-section { display: flex; border-bottom: 2px solid black; height: 80px; flex-shrink: 0; }
.logo-box { width: 110px; display: flex; align-items: center; justify-content: center; border-right: 1px solid black; font-size: 11px; text-align: center; flex-shrink: 0; }
.title-box { flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: center; padding: 5px; }
.title-box h3 { font-size: 16px; margin-bottom: 3px; }
.title-box p { font-size: 12px; }
.meta-box { width: 300px; padding: 5px; border-left: 1px solid black; display: flex; flex-direction: column; justify-content: center; flex-shrink: 0; }
.meta-inner { border: 1px solid black; border-radius: 8px; padding: 4px; font-size: 11px; line-height: 1.3; }
.meta-row { display: flex; }
.meta-label { width: 90px; }
.doc-title { text-align: center; font-weight: bold; font-size: 14px; padding: 6px; border-bottom: 2px solid black; flex-shrink: 0; }
.edu-table-wrap { flex: 1; overflow: hidden; }
.edu-table { width: 100%; height: 100%; border-collapse: collapse; font-size: 10px; table-layout: fixed; }
.edu-table th, .edu-table td { border: 1px solid black; padding: 3px; vertical-align: top; }
.edu-table th { text-align: center; vertical-align: middle; font-size: 9px; background-color: #f9f9f9; }
.col-no { width: 2%; text-align: center; }
.col-date { width: 5%; }
.col-time { width: 4%; }
.col-materi { width: 18%; }
.col-pemahaman { width: 10%; }
.col-metode { width: 10%; }
.col-diberikan { width: 7%; }
.col-sarana { width: 8%; }
.col-leaflet { width: 6%; }
.col-sasaran { width: 10%; }
.col-edukator { width: 10%; }
.col-eval { width: 10%; }
ul.cb-list { list-style: none; padding-left: 0; }
ul.cb-list li { margin-bottom: 2px; display: flex; align-items: flex-start; }
.cb { display: inline-block; width: 8px; height: 8px; border: 1px solid black; margin-right: 4px; margin-top: 2px; flex-shrink: 0; }
</style>

<div class="edu-wrapper">
    <div class="main-border">
        <div class="header-section">
            <div class="logo-box">
                <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:75px;object-fit:contain;" onerror="this.style.display='none'">
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

        <div class="doc-title">EDUKASI PASIEN DAN KELUARGA TERINTEGRASI RAWAT JALAN</div>

        <div class="edu-table-wrap">
        <table class="edu-table">
            <thead>
                <tr>
                    <th rowspan="2" class="col-no">NO</th>
                    <th colspan="2">WAKTU PELAKSANAAN EDUKASI</th>
                    <th rowspan="2" class="col-materi">MATERI EDUKASI</th>
                    <th rowspan="2" class="col-pemahaman">TINGKAT PEMAHAMAN AWAL SEBELUM EDUKASI</th>
                    <th rowspan="2" class="col-metode">METODE PEMBERIAN EDUKASI</th>
                    <th rowspan="2" class="col-diberikan">DIBERIKAN KEPADA</th>
                    <th rowspan="2" class="col-sarana">SARANA EDUKASI</th>
                    <th rowspan="2" class="col-leaflet">NOMOR LEAFLET</th>
                    <th rowspan="2" class="col-sasaran">SASARAN<br><br>NAMA & TTD</th>
                    <th rowspan="2" class="col-edukator">EDUKATOR<br><br>NAMA / PROFESI & TTD</th>
                    <th colspan="2">EVALUASI POST EDUKASI</th>
                </tr>
                <tr>
                    <th class="col-date">TANGGAL</th>
                    <th class="col-time">JAM</th>
                    <th class="col-eval">RE-EDUKASI</th>
                </tr>
            </thead>
            <tbody>
                <!-- Row 1 -->
                <tr>
                    <td style="text-align:center;">1</td>
                    <td></td>
                    <td></td>
                    <td>Hak dan Tanggung jawab Pasien dan Keluarga<br>(Perawat dan Bidan)</td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Leaflet</li>
                            <li><span class="cb"></span>Audiovisual</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 2 -->
                <tr>
                    <td style="text-align:center;">2</td>
                    <td></td>
                    <td></td>
                    <td>
                        Assesmen Awal Rawat Jalan (Dokter)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Hasil Assesmen</li>
                            <li><span class="cb"></span>Rencana Asuhan</li>
                            <li><span class="cb"></span>Hasil yang diharapkan</li>
                            <li><span class="cb"></span>Hasil yang tidak diharapkan</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 3 -->
                <tr>
                    <td style="text-align:center;">3</td>
                    <td></td>
                    <td></td>
                    <td>
                        Keselamatan Pasien (Perawat/Bidan)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Resiko Jatuh</li>
                            <li><span class="cb"></span>Gelang Identitas</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 4 -->
                <tr>
                    <td style="text-align:center;">4</td>
                    <td></td>
                    <td></td>
                    <td>
                        PPI (Perawat/Bidan)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Cuci Tangan</li>
                            <li><span class="cb"></span>Etika Batuk</li>
                            <li><span class="cb"></span>Limbah</li>
                            <li><span class="cb"></span>APD</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 5 -->
                <tr>
                    <td style="text-align:center;">5</td>
                    <td></td>
                    <td></td>
                    <td>
                        Tata Laksana Pelayanan (Perawat/Bidan)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Nama DPJP</li>
                            <li><span class="cb"></span>Jam Berkunjung</li>
                            <li><span class="cb"></span>Pelayanan Makanan</li>
                            <li><span class="cb"></span>Jam Visite Dokter</li>
                            <li><span class="cb"></span>Brosur Hak Pasien Diberikan</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 6 -->
                <tr>
                    <td style="text-align:center;">6</td>
                    <td></td>
                    <td></td>
                    <td>
                        Keamanan (Perawat/Bidan)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Peringatan tentang orang yang berbahaya (penipu)</li>
                            <li><span class="cb"></span>Bahaya kebakaran, dilarang merokok</li>
                            <li><span class="cb"></span>Lokasi alat darurat kebakaran atau jalur evakuasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 7 -->
                <tr>
                    <td style="text-align:center;">7</td>
                    <td></td>
                    <td></td>
                    <td>
                        Manajemen Nyeri (Perawatan Bidan)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Pengamatan keluhan nyeri</li>
                            <li><span class="cb"></span>Pengamatan & Penilaian</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 8 -->
                <tr>
                    <td style="text-align:center;">8</td>
                    <td></td>
                    <td></td>
                    <td>
                        Penggunaan Obat (Apoteker)
                        <ul class="cb-list" style="margin-top:2px;">
                            <li><span class="cb"></span>Potensi efek samping</li>
                            <li><span class="cb"></span>Potensi Interaksi Obat</li>
                            <li><span class="cb"></span>Pengunaan Obat Efektif dan Aman</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
                <!-- Row 9 -->
                <tr>
                    <td style="text-align:center; padding-bottom:15px;">9</td>
                    <td></td>
                    <td></td>
                    <td>Intruksi Pasca Rawat Jalan</td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Sudah Mengerti</li>
                            <li><span class="cb"></span>Edukasi Ulang</li>
                            <li><span class="cb"></span>Hal baru</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Wawancara</li>
                            <li><span class="cb"></span>Diskusi Kelompok</li>
                            <li><span class="cb"></span>Ceramah</li>
                            <li><span class="cb"></span>Demonstrasi</li>
                        </ul>
                    </td>
                    <td>
                        <ul class="cb-list">
                            <li><span class="cb"></span>Pasien</li>
                            <li><span class="cb"></span>Keluarga</li>
                            <li><span class="cb"></span>Lainnya</li>
                        </ul>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2">
                        <ul class="cb-list">
                            <li><span class="cb"></span>Re-edukasi</li>
                            <li><span class="cb"></span>Re-demonstrasi</li>
                            <li><span class="cb"></span>Sudah Mengerti</li>
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</div>
</surat-canvas>
`;

      root.__edukasipoli = self;

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
        selectors: [["app-edukasi-poli-placeholder"]],
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

export { EdukasiPoliComponent };
