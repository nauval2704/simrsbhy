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
    ɵelementStart(0, "app-pengkajian-awal-igd-placeholder");
    ɵelementEnd();
  }
}

var PengkajianAwalIgdComponent = (() => {
  class t {
    constructor() {
      this.http = inject(HttpClient);
      this.patient = null;
      this.loading = true;
      this.canvasDataUrl = null;

      const pathParts = window.location.pathname.split("/");
      this.noCheckin = pathParts[pathParts.length - 1];
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
        .get(i.apiUrl + "/simrsba/pengkajian-awal-igd/" + this.noCheckin)
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
        .post(i.apiUrl + "/simrsba/pengkajian-awal-igd", payload)
        .subscribe({
          next: () => {
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Pengkajian Awal IGD berhasil disimpan");
          },
          error: () => {
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan Pengkajian Awal IGD");
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
      const root = document.querySelector("app-pengkajian-awal-igd-placeholder");
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
      
      const tglMasukRaw = p.tglInput || "-";
      let tglMasukDate = "-";
      let tglMasukTime = "";
      if (tglMasukRaw !== "-" && tglMasukRaw.length >= 10) {
        tglMasukDate = tglMasukRaw.substring(0, 10);
        tglMasukTime = tglMasukRaw.substring(11);
      } else if (tglMasukRaw !== "-") {
        tglMasukDate = tglMasukRaw;
      }

      const self = this;

      if (!document.getElementById("surat-css-link")) {
        const link = document.createElement("link");
        link.id = "surat-css-link";
        link.rel = "stylesheet";
        link.href = "assets/surat.css";
        document.head.appendChild(link);
      }

      const htmlContent = `
<style>
    /* Scoped IGD Styles */
    #igd-pengkajian-awal .surat-document {
        padding: 0 !important;
        background-color: transparent !important;
        box-shadow: none !important;
    }
    .page {
        width: 816px;
        height: 1248px;
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.8);
        padding: 30px 40px;
        position: relative;
        display: flex;
        flex-direction: column;
        margin: 0 auto;
    }

    /* 6-Column Unified Flat Grid */
    table.master-grid {
        width: 100%;
        border-collapse: collapse;
        font-size: 11.5px;
        border: 1px solid black;
        table-layout: fixed;
    }

    table.master-grid > tbody > tr > td,
    table.master-grid > tbody > tr > th {
        border: 1px solid black;
        padding: 4px 6px;
        vertical-align: top;
        line-height: 1.4;
    }

    table.master-grid th {
        font-weight: normal; /* Override default th bold if needed */
    }

    /* Borderless alignment layout helper tables */
    table.inner-align {
        width: 100%;
        border-collapse: collapse;
    }

    table.inner-align td {
        border: none;
        padding: 1px 2px;
        vertical-align: top;
    }

    .placeholder-box {
        background-color: #e9ecef;
        border: 1px dashed #6c757d;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #495057;
        font-weight: bold;
        text-align: center;
        margin: 5px auto;
    }

    .rounded-meta {
        border: 1px solid black;
        border-radius: 8px;
        padding: 4px 8px;
        width: 100%;
    }

    .cb {
        display: inline-block;
        width: 10px;
        height: 10px;
        border: 1px solid black;
        margin-right: 4px;
        background-color: white;
        vertical-align: middle;
    }

    .footer-id {
        position: absolute;
        bottom: 25px;
        right: 40px;
        font-size: 10px;
        font-family: Arial, sans-serif;
    }

    /* Specific Shading for Title */
    .title-row {
        background-color: #e0e0e0;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        padding: 6px;
    }
</style>
<div id="igd-pengkajian-awal">
<surat-canvas ${this.canvasDataUrl ? `initial-data="${this.canvasDataUrl.replace(/"/g, '&quot;')}"` : ""}>

<!-- ================= PAGE 1 (PENGKAJIAN AWAL IGD P1) ================= -->
<div class="page">
    <table class="master-grid">
        <!-- 6 Columns Definition: 36% | 7% | 7% | 36% | 7% | 7% -->
        <colgroup>
            <col style="width: 36%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
            <col style="width: 36%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
        </colgroup>

        <tbody>
            <!-- HEADER -->
            <tr>
                <td colspan="6" style="padding: 5px;">
                    <table class="inner-align">
                        <tr>
                            <td style="width: 15%; text-align: center; vertical-align: middle;">
                                <img src="assets/img/1.png" style="max-width: 70px; max-height: 70px; object-fit: contain;" alt="Logo">
                            </td>
                            <td style="width: 45%; vertical-align: middle; text-align: center;">
                                <strong style="font-size: 12px;">RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong><br>
                                <span style="font-size: 10px;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>
                                Barat. Banda Aceh Telp. 0651-41355,<br>
                                0651-41470</span>
                            </td>
                            <td style="width: 40%; vertical-align: middle; padding: 5px;">
                                <div class="rounded-meta">
                                    <table class="inner-align">
                                        <tr><td style="width: 80px;">NRM</td><td>: ${noMr}</td></tr>
                                        <tr><td>Nama</td><td>: ${nama}</td></tr>
                                        <tr><td>Tgl. Lahir</td><td>: ${tglLahir}</td></tr>
                                        <tr><td>Jenis Kelamin</td><td>: ${kelamin}</td></tr>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- TITLE -->
            <tr>
                <td colspan="6" class="title-row">
                    PENGKAJIAN AWAL IGD
                </td>
            </tr>

            <!-- TANGGAL / JAM / ASAL -->
            <tr>
                <td colspan="2">Tanggal : ${tglMasukDate}</td>
                <td colspan="1">Jam : ${tglMasukTime}</td>
                <td colspan="3">
                    Asal Pasien : &nbsp; <span class="cb"></span> Umum <br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="cb"></span> Rujukan dari : ............................
                </td>
            </tr>

            <!-- KELUHAN & PENGOBATAN -->
            <tr>
                <td colspan="3" style="height: 65px;">
                    <strong>KELUHAN UTAMA: (Auto/Allo Anamnesis)</strong>
                </td>
                <td colspan="3">
                    <strong>RIWAYAT PENGOBATAN : (*perawat)</strong><br><br>
                    Riwayat Alergi Obat : <span class="cb"></span> Tidak &nbsp; <span class="cb"></span> Ya, Nama obat :
                </td>
            </tr>

            <!-- RIWAYAT PENYAKIT SEKARANG -->
            <tr>
                <td colspan="6" style="height: 110px;">
                    <strong>RIWAYAT PENYAKIT SEKARANG</strong>
                </td>
            </tr>

            <!-- RIWAYAT PENYAKIT DAHULU -->
            <tr>
                <td colspan="6" style="height: 70px;">
                    <strong>RIWAYAT PENYAKIT DAHULU</strong>
                </td>
            </tr>

            <!-- VITALS & PSIKOSOSIAL -->
            <tr>
                <td colspan="3" style="height: 90px;">
                    <strong>TANDA-TANDA VITAL (*perawat)</strong><br>
                    Keadaan Umum : <br>
                    <table class="inner-align" style="margin-top: 2px;">
                        <tr>
                            <td style="width: 50%;">Tekanan darah : ............ mmHg</td>
                            <td style="width: 50%;">Suhu &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ............ &deg;C</td>
                        </tr>
                        <tr>
                            <td>Nadi &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: ............ x/Menit</td>
                            <td>Pernapasan &nbsp;&nbsp;: ............ x/Menit</td>
                        </tr>
                        <tr>
                            <td>Berat Badan &nbsp;&nbsp;&nbsp;: ............ Kg</td>
                            <td>GCS : E ........ M ........ V ........</td>
                        </tr>
                    </table>
                </td>
                <td colspan="3">
                    <strong>RIWAYAT PSIKO-SOSIO-BUDAYA-SPIRITUAL DAN<br>EKONOMI : (*perawat)</strong>
                </td>
            </tr>

            <!-- REPRODUKSI -->
            <tr>
                <td colspan="6">
                    <strong>RIWAYAT REPRODUKSI WANITA (*perawat)</strong><br>
                    Haid terakhir : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Hamil &nbsp;&nbsp; : <span class="cb"></span> Tidak, &nbsp; <span class="cb"></span> Ya, Umur Kehamilan : ..........Minggu<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; G ....... P ....... A .......
                </td>
            </tr>

            <!-- PEMERIKSAAN FISIK -->
            <tr>
                <td colspan="6" style="height: 200px;">
                    <strong>PEMERIKSAAN FISIK :</strong><br>
                    Keterangan: (Tulis yang positif)<br>
                    <table class="inner-align" style="margin-top: 10px;">
                        <tr>
                            <td style="width: 40%;"></td>
                            <td colspan="2" style="width: 60%; text-align: center;">
                                <img src="assets/img/anatomi (front & back).jpg" style="max-height: 160px; object-fit: contain;" alt="Anatomi">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- STATUS FUNGSIONAL -->
            <tr>
                <td colspan="2" style="text-align: center;">
                    <strong>STATUS FUNGSIONAL</strong><br>(*perawat)
                </td>
                <td colspan="4" style="vertical-align: middle;">
                    <span class="cb"></span> mandiri &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="cb"></span> Intermiten &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="cb"></span> Ketergantungan Total
                </td>
            </tr>

            <!-- SKRINING NYERI / PENUNJANG -->
            <tr>
                <td colspan="3" style="height: 100px;">
                    <strong>SKRINING NYERI : (*diisi oleh perawat)</strong><br>
                    <table class="inner-align" style="margin-top: 5px;">
                        <tr>
                            <td style="width: 65%; text-align: center;">
                                <div style="font-weight: bold; font-size: 9px; margin-bottom: 2px;">PAIN MEASUREMENT SCALE</div>
                                <img src="assets/img/pain measurement.png" style="max-width: 100%; max-height: 50px; object-fit: contain;" alt="Skala Nyeri">
                            </td>
                            <td style="width: 35%; padding-left: 10px; vertical-align: top;">
                                Skala nyeri:
                            </td>
                        </tr>
                    </table>
                </td>
                <td colspan="3">
                    <strong>PEMERIKSAAN PENUNJANG :</strong>
                </td>
            </tr>

            <!-- SKRINING GIZI HEADERS -->
            <tr style="background-color: #f2f2f2;">
                <td colspan="3"><strong>SKRINING GIZI ANAK (usia 1 bulan-18 tahun) (*perawat)</strong></td>
                <td colspan="3"><strong>SKRINING GIZI DEWASA (*perawat)</strong></td>
            </tr>

            <!-- PARAMETER & SKOR COLUMNS -->
            <tr style="text-align: center; background-color: #f9f9f9;">
                <td rowspan="2" style="vertical-align: middle;">PARAMETER</td>
                <td colspan="2">SKOR</td>
                <td rowspan="2" style="vertical-align: middle;">PARAMETER</td>
                <td colspan="2">SKOR</td>
            </tr>
            <tr style="text-align: center; background-color: #f9f9f9;">
                <td>Ya</td>
                <td>Tidak</td>
                <td>Ya</td>
                <td>Tidak</td>
            </tr>

            <!-- GIZI ROW 1 -->
            <tr>
                <td>1. &nbsp; Apakah pasien tampak kurus</td>
                <td style="text-align: center;"><span class="cb"></span> 1</td>
                <td style="text-align: center;"><span class="cb"></span> 0</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <!-- GIZI ROW 2 -->
            <tr>
                <td>2. &nbsp; Apakah terdapat penurunan BB selama satu bulan<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir?</td>
                <td style="text-align: center;"><span class="cb"></span> 2</td>
                <td style="text-align: center;"><span class="cb"></span> 0</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer-id">RM04/Rev02/RSBHY/2022</div>
</div>

<!-- ================= PAGE 2 (PENGKAJIAN AWAL IGD P2) ================= -->
<div class="page">
    <table class="master-grid">
        <colgroup>
            <col style="width: 36%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
            <col style="width: 36%;">
            <col style="width: 7%;">
            <col style="width: 7%;">
        </colgroup>

        <tbody>
            <!-- GIZI ROW 3 (Continued from P1) -->
            <tr>
                <td>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Berdasarkan penilaian obyektif data BB bila ada atau<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;penilaian subyektif orang tua pasien<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Untuk bayi kurang 1 tahun BB tidak naik selama 3<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bulan terakhir
                </td>
                <td style="text-align: center;"></td>
                <td style="text-align: center;"></td>
                <td>
                    1. &nbsp; Apakah pasien mengalami penurunan<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;berat badan yang tidak direncanakan /<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tidak diinginkan dalam 6 bulan<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir
                </td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 2</td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 0</td>
            </tr>

            <!-- GIZI ROW 4 -->
            <tr>
                <td>
                    3. &nbsp; Apakah terdapat salah satu dari kondisi berikut?<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Diare lebih 5 kali perhari dalam seminggu terakhir<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Asupan makanan berkurang selama 1 minggu<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;terakhir
                </td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 1</td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 0</td>
                <td>
                    2. &nbsp; Apakah asupan makan pasien<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;berkurang karena penurunan nafsu<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;makan / kesulitan menerima<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;makanan?
                </td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 1</td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 0</td>
            </tr>

            <!-- GIZI ROW 5 -->
            <tr>
                <td>
                    4. &nbsp; Apakah terdapat penyakit atau keadaan<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Yang menyebabkan pasien berisiko mengalami<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;malnutrisi? (penyakit diare kronis, HIV, PJB, hepatum,<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ginjal, stoma, dan lain-lain<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sebutkan.......................................................................)
                </td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 2</td>
                <td style="text-align: center; vertical-align: middle;"><span class="cb"></span> 0</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>

            <!-- GIZI ROW 6: TOTAL SKOR -->
            <tr style="text-align: center; background-color: #f9f9f9;">
                <td>TOTAL SKOR</td>
                <td></td>
                <td></td>
                <td>TOTAL SKOR</td>
                <td></td>
                <td></td>
            </tr>

            <!-- DIAGNOSIS KERJA / SKRINING JATUH -->
            <tr>
                <td colspan="3" style="height: 60px;">
                    <strong>DIAGNOSIS KERJA :</strong>
                </td>
                <td colspan="3">
                    <strong>SKRINING JATUH : (*perawat)</strong><br>
                    <span class="cb"></span> Tidak Berisiko<br>
                    <span class="cb"></span> Risiko Rendah<br>
                    <span class="cb"></span> Risiko Tinggi
                </td>
            </tr>

            <!-- PERMASALAHAN MEDIS -->
            <tr>
                <td colspan="6" style="height: 60px;">
                    <strong>PERMASALAHAN MEDIS/INDIKASI RAWAT :</strong>
                </td>
            </tr>

            <!-- DIAGNOSA KEPERAWATAN -->
            <tr>
                <td colspan="6" style="height: 60px;">
                    <strong>DIAGNOSA KEPERAWATAN : (*perawat)</strong>
                </td>
            </tr>

            <!-- TERAPI DAN TINDAKAN -->
            <tr>
                <td colspan="6" style="height: 140px;">
                    <strong>TERAPI DAN TINDAKAN</strong>
                </td>
            </tr>

            <!-- TINDAK LANJUT -->
            <tr>
                <td colspan="6" style="height: 170px;">
                    <strong>TINDAK LANJUT :</strong><br>
                    <span class="cb"></span> Pulang Atas Permintaan Sendiri atau menolak rawat inap.<br>
                    &nbsp;&nbsp;&nbsp; Alasan menolak rawat inap ........................................................................................................................................<br>
                    <span class="cb"></span> Pulang Atas persetujuan, pada jam: .........................................................................................................................<br>
                    <span class="cb"></span> Kontrol tanggal: .......................................................................................... Ke: .....................................................<br>
                    <span class="cb"></span> Dirujuk ke .................................................................................................... Meninggal<br>
                    <span class="cb"></span> Rawat Inap, Indikasi :<br>
                    <table class="inner-align" style="margin-left: 15px; width: 300px;">
                        <tr>
                            <td><span class="cb"></span> preventif</td>
                            <td><span class="cb"></span> rehabilitatif</td>
                        </tr>
                        <tr>
                            <td><span class="cb"></span> paliatif</td>
                            <td><span class="cb"></span> kuratif</td>
                        </tr>
                    </table>
                    <span class="cb"></span> Rencana asuhan yang akan diberikan:.....................................................................................................................<br>
                    &nbsp;&nbsp;&nbsp; Hasil yang diharapkan..............................................................................................................................................
                </td>
            </tr>

            <!-- KONDISI KELUAR IGD -->
            <tr style="background-color: #f2f2f2;">
                <td colspan="6">
                    <strong>KONDISI SAAT KELUAR IGD (*perawat)</strong>
                </td>
            </tr>

            <!-- VITALS KELUAR (Split 3 Cols / 3 Cols) -->
            <tr>
                <td colspan="3">
                    <table class="inner-align" style="line-height: 1.6;">
                        <tr><td style="width: 100px;">Keadaan Umum</td><td style="width: 10px;">:</td><td></td></tr>
                        <tr><td>Kesadaran</td><td>:</td><td></td></tr>
                        <tr><td>GCS</td><td>:</td><td></td></tr>
                        <tr><td>Tekanan Darah</td><td>:</td><td>........................ mmHg</td></tr>
                    </table>
                </td>
                <td colspan="3">
                    <table class="inner-align" style="line-height: 1.6;">
                        <tr><td style="width: 120px;">Frekuensi Tanda Vital</td><td style="width: 10px;">:</td><td>........................ mmHg</td></tr>
                        <tr><td>Suhu</td><td>:</td><td>........................ &deg;C</td></tr>
                        <tr><td>Nadi</td><td>:</td><td>........................ x/Menit</td></tr>
                        <tr><td>Nafas</td><td>:</td><td></td></tr>
                    </table>
                </td>
            </tr>

            <!-- TANDA TANGAN -->
            <tr>
                <td colspan="6" style="height: 160px; border-bottom: none; position: relative;">
                    <div style="position: absolute; right: 15px; top: 10px;">
                        Tgl. ................. Pukul: ...............
                    </div>
                    <table class="inner-align" style="margin-top: 30px; text-align: center;">
                        <tr>
                            <td style="width: 33%;">Keluarga Pasien</td>
                            <td style="width: 34%;">Perawat/Bidan</td>
                            <td style="width: 33%;">Dokter</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 70px;">( ........................................ )</td>
                            <td style="padding-top: 70px;">( ........................................ )</td>
                            <td style="padding-top: 70px;">( ........................................ )</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    
    <div class="footer-id">RM04/Rev02/RSBHY/2022</div>
</div>
        </surat-canvas>
</div>
      `;

      root.innerHTML = htmlContent;

      const surat = root.querySelector("surat-canvas");
      if (surat) {
        surat.addEventListener("save", (e) => {
          this.handleSubmit(e.detail.canvasData);
        });
        if (this.canvasDataUrl) {
          surat.canvasDataUrl = this.canvasDataUrl;
        }
      }
    }
  }

  t.ɵfac = function (s) {
    return new (s || t)();
  };
  t.ɵcmp = ɵcmp({
    type: t,
    selectors: [["app-pengkajian-awal-igd-placeholder"]],
    decls: 1,
    vars: 0,
    template: renderTemplate,
    encapsulation: 2,
  });
  return t;
})();

export { PengkajianAwalIgdComponent };
