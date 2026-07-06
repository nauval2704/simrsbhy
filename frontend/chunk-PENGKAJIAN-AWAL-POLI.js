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
    ɵelementStart(0, "app-pengkajian-awal-poli-placeholder");
    ɵelementEnd();
  }
}

var PengkajianAwalPoliComponent = (() => {
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
            "/simrsba/caripasienpolinocheckin/" +
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
        .get(i.apiUrl + "/simrsba/pengkajian-awal-poli/" + this.noCheckin)
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
        .post(i.apiUrl + "/simrsba/pengkajian-awal-poli", payload)
        .subscribe({
          next: () => {
            if (surat) surat.setSubmitSuccess();
            this.showToast("success", "Pengkajian Awal berhasil disimpan");
          },
          error: () => {
            if (surat) surat.resetSubmitButton();
            this.showToast("danger", "Gagal menyimpan Pengkajian Awal");
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
      const root = document.querySelector("app-pengkajian-awal-poli-placeholder");
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

      root.innerHTML = `
<style>
    .pap-page {
        width: 100%;
        height: 100%;
        padding: 35px;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .pap-master-grid {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        border: 1px solid black;
        table-layout: fixed;
    }
    .pap-master-grid > tbody > tr > td {
        border: 1px solid black;
        padding: 5px 7px;
        vertical-align: top;
        line-height: 1.4;
    }
    .pap-inner-align {
        width: 100%;
        border-collapse: collapse;
    }
    .pap-inner-align td {
        border: none;
        padding: 1px 2px;
        vertical-align: top;
    }
    .pap-rounded-meta-box {
        border: 1px solid black;
        border-radius: 10px;
        padding: 5px;
        width: 100%;
    }
    .pap-cb {
        font-size: 13px;
        line-height: 1;
        margin-right: 3px;
        vertical-align: middle;
    }
    .pap-footer-label {
        position: absolute;
        bottom: 25px;
        right: 35px;
        font-size: 8px;
        font-style: italic;
    }
</style>
<surat-canvas id="rp-surat" data-width="816" data-height="1248">
    <div class="pap-page">
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
                <tr>
                    <td colspan="1" style="text-align: center; vertical-align: middle;">
                        <img src="assets/img/1.png" style="max-width: 75px; max-height: 75px; object-fit: contain;" alt="Logo">
                    </td>
                    <td colspan="3" style="vertical-align: middle; padding-left: 10px;">
                        <strong>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong><br>
                        Jl. Cut Nyak Dhien No. 23<br>
                        Lamteumen Barat, Banda Aceh<br>
                        Telp. 0651-41355, 0651-41470
                    </td>
                    <td colspan="2" style="vertical-align: middle;">
                        <div class="pap-rounded-meta-box">
                            <table class="pap-inner-align">
                                <tr><td style="width: 65px;">NRM</td><td style="width: 10px;">:</td><td>${noMr}</td></tr>
                                <tr><td>Nama</td><td>:</td><td>${nama}</td></tr>
                                <tr><td>Tgl Lahir</td><td>:</td><td>${tglLahir}</td></tr>
                                <tr><td>Jenis Kelamin</td><td>:</td><td>${kelamin}</td></tr>
                            </table>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="text-align: center; padding: 6px; font-weight: bold; font-size: 12px;">
                        PENGKAJIAN AWAL PASIEN TERINTEGRASI<br>POLIKLINIK RAWAT JALAN
                    </td>
                </tr>
                <tr style="height: 75px;">
                    <td colspan="2">Tanggal : ${tglMasukDate}</td>
                    <td colspan="1">Jam : ${tglMasukTime}</td>
                    <td colspan="3">
                        Asal Pasien : <br>
                        <table class="pap-inner-align" style="margin-top: 2px;">
                            <tr>
                                <td style="width: 50%;"><span class="pap-cb">&#9744;</span> Umum</td>
                                <td style="width: 50%;"><span class="pap-cb">&#9744;</span> yankes</td>
                            </tr>
                            <tr>
                                <td><span class="pap-cb">&#9744;</span> BPJS</td>
                                <td><span class="pap-cb">&#9744;</span> Mandiri</td>
                            </tr>
                            <tr>
                                <td><span class="pap-cb">&#9744;</span> JKN</td>
                                <td><span class="pap-cb">&#9744;</span> Lainnya .......</td>
                            </tr>
                            <tr>
                                <td><span class="pap-cb">&#9744;</span> Asuransi</td>
                                <td></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="height: 130px;">
                    <td colspan="3">
                        <strong>KELUHAN UTAMA: (Auto/Allo Anamnesis)</strong>
                    </td>
                    <td colspan="3">
                        <strong>RIWAYAT PENGOBATAN : (perawat)</strong><br><br>
                        Alergi Obat :<br>
                        <span class="pap-cb">&#9744;</span> Tidak<br>
                        <span class="pap-cb">&#9744;</span> Ya, Nama obat :
                    </td>
                </tr>
                <tr style="height: 85px;">
                    <td colspan="6"><strong>RIWAYAT PENYAKIT SEKARANG :</strong></td>
                </tr>
                <tr style="height: 85px;">
                    <td colspan="6"><strong>RIWAYAT PENYAKIT DAHULU :</strong></td>
                </tr>
                <tr style="height: 190px;">
                    <td colspan="3">
                        <strong>TANDA-TANDA VITAL (perawat)</strong><br><br>
                        <table class="pap-inner-align" style="line-height: 1.7;">
                            <tr><td style="width: 85px;">Kedaian Umum</td><td style="width: 10px;">:</td><td></td><td></td></tr>
                            <tr><td>Tekanan darah</td><td>:</td><td></td><td style="width: 45px;">mmHg</td></tr>
                            <tr><td>Nadi</td><td>:</td><td></td><td>x/Menit</td></tr>
                            <tr><td>Suhu</td><td>:</td><td></td><td>&deg;C</td></tr>
                            <tr><td>Pernapasan</td><td>:</td><td></td><td>x/Menit</td></tr>
                            <tr><td>Berat Badan</td><td>:</td><td></td><td>Kg</td></tr>
                        </table>
                        <div style="margin-top: 5px;">CGS : E ...... M ...... V ......</div>
                    </td>
                    <td colspan="3">
                        <strong>RIWAYAT PSIKO-SOSIO-BUDAYA-SPIRITUAL DAN EKONOMI : (perawat)</strong>
                    </td>
                </tr>
                <tr style="height: 100px;">
                    <td colspan="3">
                        <strong>RIWAYAT REPRODUKSI WANITA (perawat)</strong><br><br>
                        Haid terakhir : <br><br>
                        Hamil : <span class="pap-cb">&#9744;</span> Tidak &nbsp; <span class="pap-cb">&#9744;</span> Ya, Umur Kehamilan : <br>
                        ........ Minggu
                    </td>
                    <td colspan="3">
                        <strong>PEMERIKSAAN PENUNJANG :</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="height: 250px;">
                        <strong>PEMERIKSAAN FISIK :</strong><br>
                        Keterangan : (Tulis yang positif)<br>
                        <table class="pap-inner-align" style="margin-top: 15px;">
                            <tr>
                                <td style="width: 30%;"></td>
                                <td colspan="2" style="width: 70%; text-align: center;">
                                    <img src="assets/img/anatomi (front & back).jpg" style="max-height: 160px; object-fit: contain;" alt="Anatomi">
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pap-footer-label">005/RMBHY/2026</div>
    </div>

    <div class="pap-page" style="margin-top: 20px;">
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
                <tr>
                    <td colspan="2"><strong>STATUS FUNGSIONAL</strong></td>
                    <td colspan="4">
                        <span class="pap-cb">&#9744;</span> Mandiri &emsp; <span class="pap-cb">&#9744;</span> Intermiten &emsp; <span class="pap-cb">&#9744;</span> Ketergantungan Total
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <strong>PENILAIAN NYERI (diisi oleh perawat)</strong><br><br>
                        Nyeri : ( &nbsp; ) tidak &nbsp; ( &nbsp; ) ya<br>
                        Faktor-faktor pemicu : ...........................................................<br>
                        Faktor-faktor mengurang : ......................................................<br>
                        Frekuensi : .......................................................................... x/hari
                    </td>
                    <td colspan="3">
                        Lokasi : ................................................................................<br><br>
                        Menjalar : .............................................................................<br><br>
                        Lama nyeri : .........................................................................<br>
                        ...........................................................................................
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <strong>SKRINING NYERI (diisi oleh perawat)</strong><br><br>
                        <center style="font-weight: bold; margin-bottom: 5px;">PAIN MEASUREMENT SCALE</center>
                        <table class="pap-inner-align">
                            <tr>
                                <td style="width: 60%;">
                                    <img src="assets/img/pain measurement.png" style="max-width: 100%; max-height: 75px; object-fit: contain;" alt="Skala Nyeri">
                                </td>
                                <td style="width: 40%; vertical-align: middle; text-align: center;">
                                    <strong>Skala nyeri:</strong>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td colspan="3">
                        P : .........................................................................................<br><br>
                        Q : .........................................................................................<br><br>
                        R : .........................................................................................<br><br>
                        S : .........................................................................................<br><br>
                        T : .........................................................................................
                    </td>
                </tr>
                <tr>
                    <td colspan="3"><strong>SKRINING GIZI ANAK (usia 1 bulan - 18 tahun) *(perawat)</strong></td>
                    <td colspan="3"><strong>SKRINING GIZI DEWASA (perawat)</strong></td>
                </tr>
                <tr>
                    <th rowspan="2">PARAMETER</th>
                    <th colspan="2">SKOR</th>
                    <th rowspan="2">PARAMETER</th>
                    <th colspan="2">SKOR</th>
                </tr>
                <tr>
                    <th style="text-align: center; font-weight: bold;">YA</th>
                    <th style="text-align: center; font-weight: bold;">TIDAK</th>
                    <th style="text-align: center; font-weight: bold;">YA</th>
                    <th style="text-align: center; font-weight: bold;">TIDAK</th>
                </tr>
                <tr>
                    <td>1. Apakah pasien tampak kurus?</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 1</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                    <td>1. Apakah pasien mengalami penurunan berat badan yang tidak direncanakan / tidak diinginkan dalam 6 bulan terakhir?</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 2</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                </tr>
                <tr>
                    <td>
                        2. Apakah terdapat penurunan BB selama satu bulan terakhir?<br>
                        - Berdasarkan penilaian obyektif data BB bila ada atau penilaian subyektif orang tua pasien<br>
                        - Untuk bayi kurang 1 tahun BB tidak naik selama 3 bulan terakhir
                    </td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 2</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                    <td>2. Apakah asupan makan pasien berkurang karena penurunan nafsu makan / kesulitan menerima makanan?</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 2</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                </tr>
                <tr>
                    <td>
                        3. Apakah terdapat salah satu dari kondisi berikut?<br>
                        - Diare lebih 5 kali perhari dalam seminggu terakhir<br>
                        - Asupan makanan berkurang selama 1 minggu terakhir
                    </td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 1</td>
                    <td style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                    <td style="font-weight: bold; vertical-align: middle;">TOTAL SKOR</td>
                    <td style="border: 1px solid black;"></td>
                    <td style="border: 1px solid black;"></td>
                </tr>
                <tr>
                    <td rowspan="2">
                        4. Apakah terdapat penyakit atau keadaan yang menyebabkan pasien berisiko mengalami malnutrisi? (penyakit diare kronis, HIV, PJB, hepatum, ginjal, stoma, dan lain-lain)
                    </td>
                    <td rowspan="2" style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 2</td>
                    <td rowspan="2" style="text-align: center; vertical-align: middle;"><span class="pap-cb">&#9744;</span> 0</td>
                    <td colspan="3" rowspan="2" style="font-size: 10.5px; line-height: 1.35; padding: 6px;">
                        <strong>PASIEN DENGAN DIAGNOSIS KHUSUS :</strong><br>
                        Diabetes Melitus, kemoterapi, hemodialisa, Bedah digestif, imunitas dan lain-lain. Sebutkan :<br>
                        ....................................................................................................................<br><br>
                        Bila skor &gt; 2 and atau pasien dengan diagnosis/kondisi khusus dilanjutkan dengan asesmen gizi dietisien.
                    </td>
                </tr>
                <tr>
                </tr>
                <tr>
                    <td style="font-weight: bold;">TOTAL SKOR</td>
                    <td></td>
                    <td></td>
                    <td colspan="3" style="background-color: #ffffff; border-top: none;"></td>
                </tr>
                <tr style="height: 75px;">
                    <td colspan="6"><strong>DIAGNOSIS KERJA :</strong></td>
                </tr>
                <tr style="height: 75px;">
                    <td colspan="6"><strong>PERMASALAHAN MEDIS :</strong></td>
                </tr>
                <tr style="height: 75px;">
                    <td colspan="6"><strong>DIAGNOSA KEPERAWATAN (perawat) :</strong></td>
                </tr>
            </tbody>
        </table>
        <div class="pap-footer-label">005/RMBHY/2026</div>
    </div>

    <div class="pap-page" style="margin-top: 20px;">
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
                <tr style="height: 150px;">
                    <td colspan="6"><strong>TERAPI DAN TINDAKAN</strong></td>
                </tr>
                <tr>
                    <td colspan="6" style="padding-bottom: 15px;">
                        <strong>TINDAK LANJUT</strong><br><br>
                        <span class="pap-cb">&#9744;</span> Kontrol tanggal : ............................................................................ Ke : ....................................<br>
                        <table class="pap-inner-align" style="margin-top: 4px;">
                            <tr>
                                <td style="width: 55%;">
                                    <span class="pap-cb">&#9744;</span> Dirujuk ke : ...............................................................................................
                                    <div style="padding-left: 15px; margin-top: 4px; line-height: 1.6;">
                                        <span class="pap-cb">&#9744;</span> preventif<br>
                                        <span class="pap-cb">&#9744;</span> kuratif<br>
                                        <span class="pap-cb">&#9744;</span> rehabilitatif<br>
                                        <span class="pap-cb">&#9744;</span> paliatif
                                    </div>
                                </td>
                                <td style="width: 42%; padding-top: 2px;">
                                    <span class="pap-cb">&#9744;</span> Rawat inap, Indikasi :
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="border-bottom: none; padding-bottom: 0;">
                        <strong>KONDISI SAAT KELUAR POLIKLINIK (perawat)</strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="3" style="border-top: none; border-right: 1px solid black;">
                        <table class="pap-inner-align" style="line-height: 1.8;">
                            <tr><td style="width: 100px;">Keadaan Umum</td><td style="width: 10px;">:</td><td></td><td style="width: 40px;"></td></tr>
                            <tr><td>Kesadaran</td><td>:</td><td></td><td></td></tr>
                            <tr><td>GCS</td><td>:</td><td></td><td></td></tr>
                            <tr><td>Tekanan Darah</td><td>:</td><td></td><td>mmHg</td></tr>
                        </table>
                    </td>
                    <td colspan="3" style="border-top: none;">
                        <table class="pap-inner-align" style="line-height: 1.8;">
                            <tr><td style="width: 90px;">Tanda vital</td><td style="width: 10px;">:</td><td></td><td style="width: 55px;">mmHg</td></tr>
                            <tr><td>Suhu</td><td>:</td><td></td><td>&deg;C</td></tr>
                            <tr><td>Nadi</td><td>:</td><td></td><td>x/Menit</td></tr>
                            <tr><td>Nafas</td><td>:</td><td></td><td></td></tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="6" style="border-bottom: none; padding-top: 8px;">
                        <table class="pap-inner-align">
                            <tr>
                                <td></td>
                                <td style="text-align: right; font-size: 11px; padding-right: 15px;">
                                    Tgl : ........................ &nbsp;&nbsp;&nbsp;&nbsp; Pukul : ........................
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr style="height: 160px;">
                    <td colspan="2" style="border-top: none; border-right: none; text-align: center; vertical-align: top; padding-top: 5px;">
                        <div style="margin-bottom: 75px;">Keluarnya Pasien</div>
                        <div>(&nbsp;........................................&nbsp;)</div>
                    </td>
                    <td colspan="2" style="border-top: none; border-left: none; border-right: none; text-align: center; vertical-align: top; padding-top: 5px;">
                        <div style="margin-bottom: 75px;">Perawat/Bidan</div>
                        <div>(&nbsp;........................................&nbsp;)</div>
                    </td>
                    <td colspan="2" style="border-top: none; border-left: none; text-align: center; vertical-align: top; padding-top: 5px;">
                        <div style="margin-bottom: 75px;">Dokter</div>
                        <div>(&nbsp;........................................&nbsp;)</div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pap-footer-label">005/RMBHY/2026</div>
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
        selectors: [["app-pengkajian-awal-poli-placeholder"]],
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

export { PengkajianAwalPoliComponent };
