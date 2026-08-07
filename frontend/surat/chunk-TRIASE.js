import { a as i } from "../chunk-W7XVFZVJ.js";
import { y as HttpClient } from "../chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  ra as inject,
} from "../chunk-UYVTZL26.js";
import "./chunk-SURAT-CANVAS.js";
import { getStandardGridCSS, createSuratShell, createAutoPageSurat, bindSuratPrintButton, hospitalHeaderDiv } from "./chunk-SURAT-LAYOUT.js";

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

    handleSave() {
      this.saving = true;
      const btn = document.getElementById("btn-save-triase");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "Menyimpan...";
      }

      const sigDokter = document.getElementById("sig-dokter");
      const sigPerawat = document.getElementById("sig-perawat");

      const payload = {
        noCheckin: this.noCheckin,
        canvasImage: sigDokter ? sigDokter.toDataURL() : null,
        canvasImagePerawat: sigPerawat ? sigPerawat.toDataURL() : null,
        namaDokter: document.getElementById("f-namaDokter")?.value || "",
        namaPerawat: document.getElementById("f-namaPerawat")?.value || "",
        td: document.getElementById("f-td")?.value || "",
        suhu: document.getElementById("f-suhu")?.value || "",
        hr: document.getElementById("f-hr")?.value || "",
        rr: document.getElementById("f-rr")?.value || "",
        spo2: document.getElementById("f-spo2")?.value || "",
        gcsE: document.getElementById("f-gcsE")?.value || "",
        gcsV: document.getElementById("f-gcsV")?.value || "",
        gcsM: document.getElementById("f-gcsM")?.value || "",
        triageColor: document.getElementById("f-triageColor")?.value || "",
        triageLevel:
          document.getElementById("f-triageColor")?.selectedOptions[0]?.text ||
          "",
        symptoms: Array.from(
          document.querySelectorAll(".f-symptom:checked"),
        ).map((cb) => cb.value),
        situasiBerbahaya: document.getElementById("f-situasiBerbahaya")?.value || "",
        doaDetail: document.getElementById("f-doaDetail")?.value || "",
        konsul: document.getElementById("f-konsul")?.value || "",
      };

      this.http.post(i.apiUrl + "/simrsba/triase", payload).subscribe({
        next: (res) => {
          this.saving = false;
          this.triaseData = res.data;
          const b = document.getElementById("btn-save-triase");
          if (b) {
            b.disabled = false;
            b.innerHTML = '<i class="bi bi-check-circle"></i> Tersimpan!';
            setTimeout(
              () => (b.innerHTML = '<i class="bi bi-save"></i> Simpan Triase'),
              2000,
            );
          }
          const sigDokterEl = document.getElementById("sig-dokter");
          const sigPerawatEl = document.getElementById("sig-perawat");
          const previewDokter = document.getElementById("p-sig-dokter");
          const previewPerawat = document.getElementById("p-sig-perawat");
          if (sigDokterEl && previewDokter) {
            const img = document.createElement("img");
            img.src = sigDokterEl.toDataURL();
            img.style.cssText =
              "max-width:100%;max-height:48px;object-fit:contain;";
            previewDokter.innerHTML = "";
            previewDokter.appendChild(img);
          }
          if (sigPerawatEl && previewPerawat) {
            const img = document.createElement("img");
            img.src = sigPerawatEl.toDataURL();
            img.style.cssText =
              "max-width:100%;max-height:48px;object-fit:contain;";
            previewPerawat.innerHTML = "";
            previewPerawat.appendChild(img);
          }
          this.showToast("success", "Triase berhasil disimpan");
        },
        error: () => {
          this.saving = false;
          const b = document.getElementById("btn-save-triase");
          if (b) {
            b.disabled = false;
            b.innerHTML = '<i class="bi bi-save"></i> Simpan Triase';
          }
          this.showToast("danger", "Gagal menyimpan triase");
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
      const dpjp = p.dokterDpjp || p.dpjp || p.namaDokter || p.dokter || "";

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
        link.href = "surat/surat.css";
        document.head.appendChild(link);
      }

      const self = this;

      root.innerHTML = createSuratShell({
        idPrefix: 'triase',
        wrapperTag: 'app-triase-placeholder',
        inputPaneId: 'triase-input',
        printPaneId: 'triase-print',
        printTabId: 'triase-print-tab',
        tabsClass: 'triase-tabs',
        extraCss: `
#accordionTriase .accordion-item { box-shadow: none !important; border-color: #dee2e6 !important; }
#accordionTriase .accordion-button { box-shadow: none !important; }
#accordionTriase .accordion-button:not(.collapsed) { background-color: #f8f9fa !important; color: #212529 !important; box-shadow: none !important; }
#accordionTriase .accordion-button:focus { border-color: #ced4da !important; box-shadow: none !important; }
`,
        inputContent: `
<style>
.sig-wrap{border:1px solid #dee2e6;border-radius:6px;background:#fafafa;position:relative;overflow:hidden;}
.sig-wrap canvas{display:block;width:100%;cursor:crosshair;touch-action:none;}
.sig-clear-btn{position:absolute;top:5px;right:5px;font-size:11px;padding:2px 7px;}
.t-border{border:2px solid black; border-top:none; display:flex;flex-direction:column;flex:1;overflow:hidden;font-family:'Times New Roman',Times,serif; background:white;}
.t-border *{font-size:11px !important;line-height:1.3 !important;box-sizing:border-box;margin:0;padding:0;}
.t-border h3{font-size:13px !important;font-weight:bold;}
.t-row{display:flex;border-bottom:1px solid black; break-inside: avoid; page-break-inside: avoid;}
.t-row:last-child{border-bottom:none;}
.t-col{padding:6px 4px;border-right:1px solid black;}
.t-col:last-child{border-right:none;}
.t-f1{flex:1;}.t-f2{flex:2;}
.t-sq{display:inline-block;width:14px;height:14px;border:1px solid black;margin-right:4px;flex-shrink:0;vertical-align:middle;text-align:center;line-height:14px;font-size:14px !important;font-weight:bold;overflow:visible;}
.t-level{font-weight:bold !important;padding:6px 4px;border-bottom:1px solid black;}
.t-arrow{text-align:center;padding:2px 0;border-bottom:1px solid black;}
.t-vgrid{display:grid;grid-template-columns:1fr 1fr 1fr;width:100%;gap:2px;}
.t-cbox{width:20px;height:10px;display:inline-block;border:1px solid black;}
.t-red{background-color:#f44336;}.t-yellow{background-color:#ffeb3b;}.t-green{background-color:#4caf50;}.t-blk{background-color:#212121;}
.t-white{color:white !important;}
.t-border ul{list-style:none;padding-left:2px !important;}
.t-border li{margin-bottom:3px !important;display:flex;align-items:flex-start;}
.t-footer{text-align:right;padding:3px 0 0 0;font-weight:bold;}
.p-val{font-weight:bold;min-width:12px;display:inline-block;border-bottom:1px dotted #999;padding:0 2px;}
</style>
      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark"><i class="bi bi-person-badge me-1"></i> Data Pasien</div>
        <div class="card-body pt-2 pb-2">
          <div class="row g-2">
            <div class="col-md-3"><div class="f-group"><label class="f-label">No. RM</label><input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Nama Pasien</label><input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">Tgl. Lahir / Gender</label><input type="text" class="f-input" value="${tglLahir} (${kelamin})" disabled style="background:#e9ecef;"></div></div>
            <div class="col-md-3"><div class="f-group"><label class="f-label">DPJP</label><input type="text" class="f-input" value="${p.dokterDpjp || p.dpjp || '-'}" disabled style="background:#e9ecef;"></div></div>
          </div>
        </div>
      </div>

      <div class="card border mb-3">
        <div class="card-header bg-light py-2 fw-bold text-dark d-flex align-items-center justify-content-between">
          <span><i class="bi bi-tag-fill me-2 text-danger"></i> Label Triase Pasien</span>
          <span class="badge bg-secondary text-white fw-normal" style="font-size: 11px;">Pilihan Utama Triase</span>
        </div>
        <div class="card-body p-3 bg-white">
          <div class="row align-items-center">
            <div class="col-md-3">
              <label for="f-triageColor" class="form-label small fw-bold text-dark mb-0">Hasil Label Triase :</label>
            </div>
            <div class="col-md-6">
              <select id="f-triageColor" class="form-select form-select-sm fw-semibold border-secondary">
                <option value="">-- Pilih Level Triase --</option>
                <option value="red" data-label="Level 1">Level 1 - Resusitasi (Merah)</option>
                <option value="red" data-label="Level 2">Level 2 - Emergensi (Merah)</option>
                <option value="yellow" data-label="Level 3">Level 3 - Urgent (Kuning)</option>
                <option value="green" data-label="Level 4">Level 4 - Non Urgent (Hijau)</option>
                <option value="green" data-label="Level 5">Level 5 - False Emergency / DOA (Hijau)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="accordion mb-3" id="accordionTriase">

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_1">
            <button class="accordion-button py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_1" aria-expanded="true" aria-controls="collapse_t_1">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-heart-pulse me-2 text-secondary"></i> 1. Tanda-Tanda Vital &amp; GCS</span>
            </button>
          </h2>
          <div id="collapse_t_1" class="accordion-collapse collapse show" aria-labelledby="heading_t_1" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="row g-3 mb-3">
                <div class="col-md-3">
                  <label class="form-label small fw-semibold mb-1">Tekanan Darah (TD)</label>
                  <div class="input-group input-group-sm mb-2"><span class="input-group-text">TD</span><input type="text" id="f-td" class="form-control" placeholder="120/80"></div>
                </div>
                <div class="col-md-5">
                  <div class="row g-2 mb-2">
                    <div class="col-3"><label class="form-label small fw-semibold mb-1">Suhu (°C)</label><input type="text" id="f-suhu" class="form-control form-control-sm" placeholder="36.5"></div>
                    <div class="col-3"><label class="form-label small fw-semibold mb-1">SPO2 (%)</label><input type="text" id="f-spo2" class="form-control form-control-sm" placeholder="98"></div>
                    <div class="col-3"><label class="form-label small fw-semibold mb-1">HR (bpm)</label><input type="text" id="f-hr" class="form-control form-control-sm" placeholder="80"></div>
                    <div class="col-3"><label class="form-label small fw-semibold mb-1">RR (x/m)</label><input type="text" id="f-rr" class="form-control form-control-sm" placeholder="20"></div>
                  </div>
                </div>
                <div class="col-md-4">
                  <p class="small fw-bold mb-1 text-secondary">GCS</p>
                  <div class="row g-2">
                    <div class="col-4"><label class="form-label small fw-semibold mb-1 text-center d-block">Eye (E)</label><input type="number" id="f-gcsE" class="form-control form-control-sm text-center" min="1" max="4" placeholder="1-4"></div>
                    <div class="col-4"><label class="form-label small fw-semibold mb-1 text-center d-block">Verbal (V)</label><input type="number" id="f-gcsV" class="form-control form-control-sm text-center" min="1" max="5" placeholder="1-5"></div>
                    <div class="col-4"><label class="form-label small fw-semibold mb-1 text-center d-block">Motor (M)</label><input type="number" id="f-gcsM" class="form-control form-control-sm text-center" min="1" max="6" placeholder="1-6"></div>
                  </div>
                </div>
              </div>

              <div class="row g-2">
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">AIRWAY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Terintubasi" id="l1_s1"><label class="form-check-label small" for="l1_s1">Terintubasi</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Sumbatan" id="l1_s2"><label class="form-check-label small" for="l1_s2">Sumbatan</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Ancaman" id="l1_s3"><label class="form-check-label small" for="l1_s3">Ancaman</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">BREATHING</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Apnoe" id="l1_s4"><label class="form-check-label small" for="l1_s4">Apnoe</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Ventilator" id="l1_s5"><label class="form-check-label small" for="l1_s5">Ventilator</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">CIRCULATION</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Henti Jantung" id="l1_s6"><label class="form-check-label small" for="l1_s6">Henti Jantung</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Nadi Tak Teraba" id="l1_s7"><label class="form-check-label small" for="l1_s7">Nadi Tak Teraba</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">DISABILITY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Tidak Respon" id="l1_s8"><label class="form-check-label small" for="l1_s8">Tidak Respon</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Kejang" id="l1_s9"><label class="form-check-label small" for="l1_s9">Kejang</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_GCS <8" id="l1_s10"><label class="form-check-label small" for="l1_s10">GCS &lt;8</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI PENUNJANG</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Kompleks" id="l1_s11"><label class="form-check-label small" for="l1_s11">Kompleks</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_≥ 2" id="l1_s12"><label class="form-check-label small" for="l1_s12">≥ 2</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_2">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_2" aria-expanded="false" aria-controls="collapse_t_2">
              <span class="fw-bold text-danger" style="font-size:13px;"><i class="bi bi-exclamation-octagon me-2"></i> 2. Level 1 : Resusitasi (Red Zone)</span>
            </button>
          </h2>
          <div id="collapse_t_2" class="accordion-collapse collapse" aria-labelledby="heading_t_2" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">AIRWAY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Ancaman_R" id="l2_s1"><label class="form-check-label small" for="l2_s1">Ancaman</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Bebas_R" id="l2_s2"><label class="form-check-label small" for="l2_s2">Bebas</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">BREATHING</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Takipnue_R" id="l2_s3"><label class="form-check-label small" for="l2_s3">Takipnue</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Bradipnue_R" id="l2_s4"><label class="form-check-label small" for="l2_s4">Bradipnue</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_SPO2 <92_R" id="l2_s5"><label class="form-check-label small" for="l2_s5">SPO2 &lt;92</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Dangkal_R" id="l2_s6"><label class="form-check-label small" for="l2_s6">Dangkal</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">CIRCULATION</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Nadi Terasa Lemah_R" id="l2_s7"><label class="form-check-label small" for="l2_s7">Nadi Terasa Lemah</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Akral Dingin_R" id="l2_s8"><label class="form-check-label small" for="l2_s8">Akral Dingin</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Bradikardi_R" id="l2_s9"><label class="form-check-label small" for="l2_s9">Bradikardi</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Takikardi_R" id="l2_s10"><label class="form-check-label small" for="l2_s10">Takikardi</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_CRT >2 detik_R" id="l2_s11"><label class="form-check-label small" for="l2_s11">CRT &gt;2 detik</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Turgor Kulit Jelek_R" id="l2_s12"><label class="form-check-label small" for="l2_s12">Turgor Kulit Jelek</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">DISABILITY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Respon Dengan Rangsangan Nyeri_R" id="l2_s13"><label class="form-check-label small" for="l2_s13">Respon Nyeri</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Gelisah_R" id="l2_s14"><label class="form-check-label small" for="l2_s14">Gelisah</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_GCS : > 8 > 15_R" id="l2_s15"><label class="form-check-label small" for="l2_s15">GCS : &gt; 8 &gt; 15</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_GCS : 15_R" id="l2_s16"><label class="form-check-label small" for="l2_s16">GCS : 15</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI PENUNJANG</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Kompleks_R" id="l2_s17"><label class="form-check-label small" for="l2_s17">Kompleks</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_≥ 2_R" id="l2_s18"><label class="form-check-label small" for="l2_s18">≥ 2</label></div>
                  <p class="small fw-bold mt-2 mb-1 text-secondary">Catatan Khusus</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L1_Nyeri Berat_R" id="l2_s19"><label class="form-check-label small" for="l2_s19">Nyeri Berat</label></div>
                  <div class="form-check mb-1">
                    <input class="form-check-input f-symptom" type="checkbox" value="L1_Situasi Berbahaya :_R" id="l2_s20">
                    <label class="form-check-label small" for="l2_s20">Situasi Berbahaya :</label>
                    <input type="text" id="f-situasiBerbahaya" class="form-control form-control-sm mt-1" style="font-size:11px;" placeholder="Tuliskan situasi berbahaya...">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_3">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_3" aria-expanded="false" aria-controls="collapse_t_3">
              <span class="fw-bold text-danger" style="font-size:13px;"><i class="bi bi-exclamation-triangle me-2"></i> 3. Level 2 : Emergensi (Red Zone)</span>
            </button>
          </h2>
          <div id="collapse_t_3" class="accordion-collapse collapse" aria-labelledby="heading_t_3" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="alert alert-danger py-1 px-2 mb-2 small fw-bold">Keterangan: Termasuk level 2 apabila peringatan yang ada menimbulkan / berkaitan dengan kondisi yang berisiko tinggi memburuk pada pasien</div>
              <div class="row g-2">
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">AIRWAY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Bebas" id="l3_s1"><label class="form-check-label small" for="l3_s1">Bebas</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">BREATHING</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Spontan" id="l3_s2"><label class="form-check-label small" for="l3_s2">Spontan</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Normal" id="l3_s3"><label class="form-check-label small" for="l3_s3">Normal</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Takipnue" id="l3_s4"><label class="form-check-label small" for="l3_s4">Takipnue</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">CIRCULATION</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Nadi Teraba Berat" id="l3_s5"><label class="form-check-label small" for="l3_s5">Nadi Teraba Berat</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Nadi Teraba Lemah" id="l3_s6"><label class="form-check-label small" for="l3_s6">Nadi Teraba Lemah</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Akral Hangat" id="l3_s7"><label class="form-check-label small" for="l3_s7">Akral Hangat</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_Turgor Sedang" id="l3_s8"><label class="form-check-label small" for="l3_s8">Turgor Sedang</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">DISABILITY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_GCS 15" id="l3_s9"><label class="form-check-label small" for="l3_s9">GCS 15</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI PENUNJANG</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L2_≥ 2" id="l3_s10"><label class="form-check-label small" for="l3_s10">≥ 2</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_4">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_4" aria-expanded="false" aria-controls="collapse_t_4">
              <span class="fw-bold text-warning" style="font-size:13px;"><i class="bi bi-clock-history me-2"></i> 4. Level 3 : Urgent (Yellow Zone)</span>
            </button>
          </h2>
          <div id="collapse_t_4" class="accordion-collapse collapse" aria-labelledby="heading_t_4" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">AIRWAY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Bebas" id="l4_s1"><label class="form-check-label small" for="l4_s1">Bebas</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">BREATHING</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Spontan" id="l4_s2"><label class="form-check-label small" for="l4_s2">Spontan</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Normal" id="l4_s3"><label class="form-check-label small" for="l4_s3">Normal</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">CIRCULATION</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Nadi Teraba Berat" id="l4_s4"><label class="form-check-label small" for="l4_s4">Nadi Teraba Berat</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Akral Hangat" id="l4_s5"><label class="form-check-label small" for="l4_s5">Akral Hangat</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">DISABILITY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Sadar" id="l4_s6"><label class="form-check-label small" for="l4_s6">Sadar</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_GCS 15" id="l4_s7"><label class="form-check-label small" for="l4_s7">GCS 15</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI PENUNJANG</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_≥ 2" id="l4_s8"><label class="form-check-label small" for="l4_s8">≥ 2</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI SDM</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L3_Spesialis / dr. Umum" id="l4_s9"><label class="form-check-label small" for="l4_s9">Spesialis / dr. Umum</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_5">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_5" aria-expanded="false" aria-controls="collapse_t_5">
              <span class="fw-bold text-success" style="font-size:13px;"><i class="bi bi-check-circle me-2"></i> 5. Level 4 : Non Urgent (Green Zone)</span>
            </button>
          </h2>
          <div id="collapse_t_5" class="accordion-collapse collapse" aria-labelledby="heading_t_5" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="row g-2">
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">AIRWAY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Bebas" id="l5_s1"><label class="form-check-label small" for="l5_s1">Bebas</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">BREATHING</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Spontan" id="l5_s2"><label class="form-check-label small" for="l5_s2">Spontan</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Normal" id="l5_s3"><label class="form-check-label small" for="l5_s3">Normal</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">CIRCULATION</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Nadi Teraba Berat" id="l5_s4"><label class="form-check-label small" for="l5_s4">Nadi Teraba Berat</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Akral Hangat" id="l5_s5"><label class="form-check-label small" for="l5_s5">Akral Hangat</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">DISABILITY</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Sadar" id="l5_s6"><label class="form-check-label small" for="l5_s6">Sadar</label></div>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_GCS 15" id="l5_s7"><label class="form-check-label small" for="l5_s7">GCS 15</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI PENUNJANG</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_Tidak Ada" id="l5_s8"><label class="form-check-label small" for="l5_s8">Tidak Ada</label></div>
                </div>
                <div class="col">
                  <p class="small fw-bold mb-1 text-secondary border-bottom pb-1">PREDIKSI SDM</p>
                  <div class="form-check mb-1"><input class="form-check-input f-symptom" type="checkbox" value="L4_dr. Umum" id="l5_s9"><label class="form-check-label small" for="l5_s9">dr. Umum</label></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_6">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_6" aria-expanded="false" aria-controls="collapse_t_6">
              <span class="fw-bold text-success" style="font-size:13px;"><i class="bi bi-shield-check me-2"></i> 6. Level 5 : False Emergency</span>
            </button>
          </h2>
          <div id="collapse_t_6" class="accordion-collapse collapse" aria-labelledby="heading_t_6" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="border rounded p-3" style="background-color: #ffebee; border-color: #ef5350 !important;">
                <div class="form-check mb-2">
                  <input class="form-check-input f-symptom" type="checkbox" value="L5_DOA" id="l5_doa">
                  <label class="form-check-label small fw-bold text-danger" for="l5_doa">DOA (Dead on Arrival)</label>
                </div>
                <div class="mt-2">
                  <label class="form-label small text-muted mb-1 fw-semibold d-block">Catatan / Keterangan DOA:</label>
                  <textarea id="f-doaDetail" class="form-control form-control-sm" rows="3" placeholder="Tuliskan keterangan detail DOA (misal: waktu kematian, kondisi saat tiba, dll)..." style="font-size:12px;"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="accordion-item mb-2 border rounded">
          <h2 class="accordion-header" id="heading_t_7">
            <button class="accordion-button collapsed py-2 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_t_7" aria-expanded="false" aria-controls="collapse_t_7">
              <span class="fw-bold text-dark" style="font-size:13px;"><i class="bi bi-pencil-square me-2 text-secondary"></i> 7. Konsul, Ruang Tujuan &amp; Tanda Tangan</span>
            </button>
          </h2>
          <div id="collapse_t_7" class="accordion-collapse collapse" aria-labelledby="heading_t_7" data-bs-parent="#accordionTriase">
            <div class="accordion-body bg-white p-3">
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="border rounded p-3 bg-light">
                    <span class="fw-bold small d-block mb-2 text-dark"><i class="bi bi-hospital me-1"></i>KONSUL &amp; RUANG TUJUAN</span>
                    <div class="mb-2">
                      <label class="form-label small fw-semibold mb-1">Konsul Dokter / Spesialis</label>
                      <input type="text" id="f-konsul" class="form-control form-control-sm" placeholder="Tuliskan konsul (misal: dr. Sp.B)...">
                    </div>
                    <div class="form-check mb-1">
                      <input class="form-check-input f-symptom" type="checkbox" value="Ruang Resusitasi IGD" id="r_resusitasi">
                      <label class="form-check-label small" for="r_resusitasi">Ruang Resusitasi IGD</label>
                    </div>
                    <div class="form-check mb-1">
                      <input class="form-check-input f-symptom" type="checkbox" value="Ruang Ponek" id="r_ponek">
                      <label class="form-check-label small" for="r_ponek">Ruang Ponek</label>
                    </div>
                    <div class="form-check mb-1">
                      <input class="form-check-input f-symptom" type="checkbox" value="Ruang Observasi" id="r_observasi">
                      <label class="form-check-label small" for="r_observasi">Ruang Observasi</label>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">TTD Dokter Triage (DPJP)</label>
                    <input type="text" id="f-namaDokter" class="form-control form-control-sm mb-1" value="${this.triaseData?.namaDokter || dpjp || ''}" placeholder="Nama Dokter Triage (DPJP)...">
                    <div class="sig-wrap mb-1">
                      <canvas id="sig-dokter" width="500" height="150" style="height:110px;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-dokter">Hapus</button>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="border rounded p-2 bg-light">
                    <label class="form-label small fw-semibold mb-1">TTD Perawat Triage</label>
                    <input type="text" id="f-namaPerawat" class="form-control form-control-sm mb-1" placeholder="Nama Perawat Triage...">
                    <div class="sig-wrap mb-1">
                      <canvas id="sig-perawat" width="500" height="150" style="height:110px;"></canvas>
                      <button type="button" class="btn btn-sm btn-outline-secondary sig-clear-btn" data-target="sig-perawat">Hapus</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="d-flex justify-content-end mt-3 border-top pt-3">
        <button id="btn-save-triase" class="btn btn-primary px-4"><i class="bi bi-save me-1"></i>Simpan Triase</button>
      </div>`
      });
      bindSuratPrintButton(root);

      const makeSigPad = (id) => {
        const canvas = document.getElementById(id);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#000000";
        let drawing = false;
        let lastX = 0,
          lastY = 0;
        const getPos = (e) => {
          const r = canvas.getBoundingClientRect();
          const sx = canvas.width / r.width;
          const sy = canvas.height / r.height;
          if (e.touches)
            return [
              (e.touches[0].clientX - r.left) * sx,
              (e.touches[0].clientY - r.top) * sy,
            ];
          return [(e.clientX - r.left) * sx, (e.clientY - r.top) * sy];
        };
        canvas.addEventListener("mousedown", (e) => {
          drawing = true;
          [lastX, lastY] = getPos(e);
        });
        canvas.addEventListener("mousemove", (e) => {
          if (!drawing) return;
          const [x, y] = getPos(e);
          ctx.beginPath();
          ctx.moveTo(lastX, lastY);
          ctx.lineTo(x, y);
          ctx.stroke();
          [lastX, lastY] = [x, y];
        });
        canvas.addEventListener("mouseup", () => (drawing = false));
        canvas.addEventListener("mouseleave", () => (drawing = false));
        canvas.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            drawing = true;
            [lastX, lastY] = getPos(e);
          },
          { passive: false },
        );
        canvas.addEventListener(
          "touchmove",
          (e) => {
            e.preventDefault();
            if (!drawing) return;
            const [x, y] = getPos(e);
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            [lastX, lastY] = [x, y];
          },
          { passive: false },
        );
        canvas.addEventListener("touchend", () => (drawing = false));
      };

      makeSigPad("sig-dokter");
      makeSigPad("sig-perawat");

      if (self.canvasDataUrl) {
        const canvas = document.getElementById("sig-dokter");
        if (canvas) {
          const img = new Image();
          img.onload = () =>
            canvas
              .getContext("2d")
              .drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = self.canvasDataUrl;
        }
      }

      if (self.triaseData?.canvasImagePerawat) {
        const canvas = document.getElementById("sig-perawat");
        if (canvas) {
          const img = new Image();
          img.onload = () =>
            canvas
              .getContext("2d")
              .drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = self.triaseData.canvasImagePerawat;
        }
      }

      document.querySelectorAll(".sig-clear-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-target");
          const c = document.getElementById(targetId);
          if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height);
          const previewId =
            targetId === "sig-dokter" ? "p-sig-dokter" : "p-sig-perawat";
          const p = document.getElementById(previewId);
          if (p) p.innerHTML = "";
        });
      });

      document
        .getElementById("btn-save-triase")
        ?.addEventListener("click", () => {
          self.handleSave();
        });
const printTab = root.querySelector('#triase-print-tab');
      if (printTab) {
          printTab.addEventListener('click', () => {
              const printContainer = document.getElementById('triase-print-container');
              if (!printContainer) return;

              const bodyHtml = `
                <div class="t-border" style="flex: 1; border: 2px solid black; border-top: none; display: flex; flex-direction: column; font-family: 'Times New Roman', Times, serif; background: white;">

                  <div class="t-row" style="font-weight:bold;flex-shrink:0;">
                    <div class="t-col" style="width:45%;">
                      <div>LABEL TRIASE (pilih salah satu hasil triase (√))</div>
                      <div style="display:flex;gap:12px;margin-top:4px;align-items:center;">
                        <span class="t-sq p-triageColor-red"></span><span class="t-cbox t-red"></span>
                        <span class="t-sq p-triageColor-yellow"></span><span class="t-cbox t-yellow"></span>
                        <span class="t-sq p-triageColor-green"></span><span class="t-cbox t-green"></span>
                        <span class="t-sq p-triageColor-black"></span><span class="t-cbox t-blk"></span>
                      </div>
                      <div style="margin-top:4px;">Pukul pemeriksaan : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; WIB</div>
                    </div>
                    <div class="t-col" style="width:55%;display:flex;align-items:center;">
                      <div class="t-vgrid" style="width:100%;">
                        <div>TD : <span class="p-val" id="p-td"></span></div><div>Suhu : <span class="p-val" id="p-suhu"></span></div><div>GCS : E<span class="p-val" id="p-gcsE"></span> V<span class="p-val" id="p-gcsV"></span> M<span class="p-val" id="p-gcsM"></span></div>
                        <div>HR : <span class="p-val" id="p-hr"></span></div><div>SPO2 : <span class="p-val" id="p-spo2"></span></div><div></div>
                        <div>RR : <span class="p-val" id="p-rr"></span></div><div></div><div></div>
                      </div>
                    </div>
                  </div>

                  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
                    <div class="t-col t-f1">AIRWAY</div><div class="t-col t-f1">BREATHING</div><div class="t-col t-f1">CIRCULATION</div><div class="t-col t-f1">DISABILITY</div><div class="t-col t-f1">PREDIKSI PENUNJANG</div>
                  </div>
                  <div class="t-row" style="flex-shrink:0;">
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Terintubasi"></span>Terintubasi</li><li><span class="t-sq p-symptom" data-val="L1_Sumbatan"></span>Sumbatan</li><li><span class="t-sq p-symptom" data-val="L1_Ancaman"></span>Ancaman</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Apnoe"></span>Apnoe</li><li><span class="t-sq p-symptom" data-val="L1_Ventilator"></span>Ventilator</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Henti Jantung"></span>Henti Jantung</li><li><span class="t-sq p-symptom" data-val="L1_Nadi Tak Teraba"></span>Nadi Tak Teraba</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Tidak Respon"></span>Tidak Respon</li><li><span class="t-sq p-symptom" data-val="L1_Kejang"></span>Kejang</li><li><span class="t-sq p-symptom" data-val="L1_GCS <8"></span>GCS &lt;8</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Kompleks"></span>Kompleks</li><li><span class="t-sq p-symptom" data-val="L1_≥ 2"></span>≥ 2</li></ul></div>
                  </div>

                  <div class="t-level t-red t-white">LEVEL 1 : RESUSITASI (RED ZONE)</div>
                  <div class="t-arrow">↓ Tidak</div>

                  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
                    <div class="t-col t-f1">AIRWAY</div><div class="t-col t-f1">BREATHING</div><div class="t-col t-f1">CIRCULATION</div><div class="t-col t-f1">DISABILITY</div><div class="t-col t-f2">PREDIKSI PENUNJANG</div>
                  </div>
                  <div class="t-row" style="flex-shrink:0;">
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Ancaman_R"></span>Ancaman</li><li><span class="t-sq p-symptom" data-val="L1_Bebas_R"></span>Bebas</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Takipnue_R"></span>Takipnue</li><li><span class="t-sq p-symptom" data-val="L1_Bradipnue_R"></span>Bradipnue</li><li><span class="t-sq p-symptom" data-val="L1_SPO2 <92_R"></span>SPO2 &lt;92</li><li><span class="t-sq p-symptom" data-val="L1_Dangkal_R"></span>Dangkal</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Nadi Terasa Lemah_R"></span>Nadi Terasa Lemah</li><li><span class="t-sq p-symptom" data-val="L1_Akral Dingin_R"></span>Akral Dingin</li><li><span class="t-sq p-symptom" data-val="L1_Bradikardi_R"></span>Bradikardi</li><li><span class="t-sq p-symptom" data-val="L1_Takikardi_R"></span>Takikardi</li><li><span class="t-sq p-symptom" data-val="L1_CRT >2 detik_R"></span>CRT &gt;2 detik</li><li><span class="t-sq p-symptom" data-val="L1_Turgor Kulit Jelek_R"></span>Turgor Kulit Jelek</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L1_Respon Dengan Rangsangan Nyeri_R"></span>Respon Dengan Rangsangan Nyeri</li><li><span class="t-sq p-symptom" data-val="L1_Gelisah_R"></span>Gelisah</li><li><span class="t-sq p-symptom" data-val="L1_GCS : > 8 > 15_R"></span>GCS : &gt; 8 &gt; 15</li><li><span class="t-sq p-symptom" data-val="L1_GCS : 15_R"></span>GCS : 15</li></ul></div>
                    <div class="t-col t-f2"><ul><li><span class="t-sq p-symptom" data-val="L1_Kompleks_R"></span>Kompleks</li><li><span class="t-sq p-symptom" data-val="L1_≥ 2_R"></span>≥ 2</li><li style="margin-top:3px !important;">Catatan Khusus:</li><li><span class="t-sq p-symptom" data-val="L1_Nyeri Berat_R"></span>Nyeri Berat</li><li><span class="t-sq p-symptom" data-val="L1_Situasi Berbahaya :_R"></span>Situasi Berbahaya : <span class="p-val" id="p-situasiBerbahaya"></span></li></ul></div>
                  </div>

                  <div class="t-row" style="justify-content:center;padding:3px 4px;font-weight:bold;flex-shrink:0;">
                    Keterangan Termasuk level 2 apabila peringatan yang ada menimbulkan / berkaitan dengan kondisi yang berisiko tinggi memburuk pada pasien
                  </div>

                  <div class="t-level t-red t-white">LEVEL 2 : EMERGENSI (RED ZONE)</div>
                  <div class="t-arrow">↓ Tidak</div>

                  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
                    <div class="t-col t-f1">AIRWAY</div><div class="t-col t-f1">BREATHING</div><div class="t-col t-f1">CIRCULATION</div><div class="t-col t-f1">DISABILITY</div><div class="t-col t-f1">PREDIKSI PENUNJANG</div>
                  </div>
                  <div class="t-row" style="flex-shrink:0;">
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L2_Bebas"></span>Bebas</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L2_Spontan"></span>Spontan</li><li><span class="t-sq p-symptom" data-val="L2_Normal"></span>Normal</li><li><span class="t-sq p-symptom" data-val="L2_Takipnue"></span>Takipnue</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L2_Nadi Teraba Berat"></span>Nadi Teraba Berat</li><li><span class="t-sq p-symptom" data-val="L2_Nadi Teraba Lemah"></span>Nadi Teraba Lemah</li><li><span class="t-sq p-symptom" data-val="L2_Akral Hangat"></span>Akral Hangat</li><li><span class="t-sq p-symptom" data-val="L2_Turgor Sedang"></span>Turgor Sedang</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L2_GCS 15"></span>GCS 15</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L2_≥ 2"></span>≥ 2</li></ul></div>
                  </div>

                  <div class="t-level t-yellow">LEVEL 3 : URGENT (YELLOW ZONE)</div>
                  <div class="t-arrow">↓ Tidak</div>

                  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
                    <div class="t-col t-f1">AIRWAY</div><div class="t-col t-f1">BREATHING</div><div class="t-col t-f1">CIRCULATION</div><div class="t-col t-f1">DISABILITY</div><div class="t-col t-f1">PREDIKSI PENUNJANG</div><div class="t-col t-f1">PREDIKSI SDM</div>
                  </div>
                  <div class="t-row" style="flex-shrink:0;">
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_Bebas"></span>Bebas</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_Spontan"></span>Spontan</li><li><span class="t-sq p-symptom" data-val="L3_Normal"></span>Normal</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_Nadi Teraba Berat"></span>Nadi Teraba Berat</li><li><span class="t-sq p-symptom" data-val="L3_Akral Hangat"></span>Akral Hangat</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_Sadar"></span>Sadar</li><li><span class="t-sq p-symptom" data-val="L3_GCS 15"></span>GCS 15</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_≥ 2"></span>≥ 2</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L3_Spesialis / dr. Umum"></span>Spesialis / dr. Umum</li></ul></div>
                  </div>

                  <div class="t-level t-green t-white">LEVEL 4 : NON URGENT (GREEN ZONE)</div>
                  <div class="t-arrow">↓ Tidak</div>

                  <div class="t-row" style="font-weight:bold;text-align:center;flex-shrink:0;">
                    <div class="t-col t-f1">AIRWAY</div><div class="t-col t-f1">BREATHING</div><div class="t-col t-f1">CIRCULATION</div><div class="t-col t-f1">DISABILITY</div><div class="t-col t-f1">PREDIKSI PENUNJANG</div><div class="t-col t-f1">PREDIKSI SDM</div>
                  </div>
                  <div class="t-row" style="flex-shrink:0;">
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_Bebas"></span>Bebas</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_Spontan"></span>Spontan</li><li><span class="t-sq p-symptom" data-val="L4_Normal"></span>Normal</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_Nadi Teraba Berat"></span>Nadi Teraba Berat</li><li><span class="t-sq p-symptom" data-val="L4_Akral Hangat"></span>Akral Hangat</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_Sadar"></span>Sadar</li><li><span class="t-sq p-symptom" data-val="L4_GCS 15"></span>GCS 15</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_Tidak Ada"></span>Tidak Ada</li></ul></div>
                    <div class="t-col t-f1"><ul><li><span class="t-sq p-symptom" data-val="L4_dr. Umum"></span>dr. Umum</li></ul></div>
                  </div>

                  <div class="t-level t-green t-white">LEVEL 5 : FALSE EMERGENCY</div>
                  <div class="t-row" style="flex-shrink:0; min-height:60px; padding:6px 8px;">
                    <div class="t-col" style="width:100%; border:none;">
                      <div style="font-weight:bold; margin-bottom:4px;">
                        <span class="t-sq p-symptom" data-val="L5_DOA"></span> DOA (Dead on Arrival)
                      </div>
                      <div style="padding-left:18px; font-size:11px; white-space:pre-wrap; min-height:30px;" id="p-doaDetail"></div>
                    </div>
                  </div>

                  <div class="t-row" style="flex-shrink:0;">
                    <!-- Left Column: Konsul & Ruang -->
                    <div class="t-col" style="width:38%; padding:6px; font-size:11px;">
                      <div style="font-weight:bold; margin-bottom:2px;">Konsul</div>
                      <div style="margin-bottom:8px;">( <span id="p-konsul" style="display:inline-block; min-width:180px;">.............................................</span> )</div>
                      <div style="margin-top:6px; line-height:1.6;">
                        <div><span class="t-sq p-symptom" data-val="Ruang Resusitasi IGD"></span> Ruang Resusitasi IGD</div>
                        <div><span class="t-sq p-symptom" data-val="Ruang Ponek"></span> Ruang Ponek</div>
                        <div><span class="t-sq p-symptom" data-val="Ruang Observasi"></span> Ruang Observasi</div>
                      </div>
                    </div>

                    <!-- Right Column: Petugas Triase (Dokter & Perawat) -->
                    <div class="t-col" style="width:62%; display:flex; flex-direction:column; padding:0; border-right:none;">
                      <div style="text-align:right; font-weight:bold; padding:4px 8px; font-size:11px; border-bottom:1px solid black;">
                        Petugas Triase
                      </div>
                      <div style="display:flex; flex:1;">
                        <!-- TTD Dokter -->
                        <div style="width:50%; border-right:1px solid black; padding:6px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
                          <div style="font-weight:bold; font-size:11px;">TTD Dokter</div>
                          <div id="p-sig-dokter" style="height:55px; display:flex; align-items:center; justify-content:center;"></div>
                          <div>
                            <div style="text-decoration:underline; font-weight:bold; font-size:11px;" id="p-namaDokter">.....................................</div>
                            <div style="font-size:9px; color:#555; margin-top:2px;">Nama Jelas dan Gelar</div>
                          </div>
                        </div>
                        <!-- TTD Perawat -->
                        <div style="width:50%; padding:6px; text-align:center; display:flex; flex-direction:column; justify-content:space-between;">
                          <div style="font-weight:bold; font-size:11px;">TTD Perawat</div>
                          <div id="p-sig-perawat" style="height:55px; display:flex; align-items:center; justify-content:center;"></div>
                          <div>
                            <div style="text-decoration:underline; font-weight:bold; font-size:11px;" id="p-namaPerawat">.....................................</div>
                            <div style="font-size:9px; color:#555; margin-top:2px;">Nama Jelas dan Gelar</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              `;

              printContainer.innerHTML = createAutoPageSurat({
                  headerHtml: hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize, 'FORMULIR TRIASE GAWAT DARURAT'),
                  bodyHtml: bodyHtml,
                  footerHtml: '',
                  footerLabelCode: 'RM03/Rev02/RSBHY/2022'
              });
              syncToPreview();
            });
          }

const syncToPreview = () => {
        const getVal = (id) => document.getElementById(id)?.value || "";
        const setText = (id, text) => {
          const el = document.getElementById(id);
          if (el) el.innerText = text;
        };
        setText("p-td", getVal("f-td"));
        setText("p-suhu", getVal("f-suhu"));
        setText("p-hr", getVal("f-hr"));
        setText("p-rr", getVal("f-rr"));
        setText("p-spo2", getVal("f-spo2"));
        setText("p-gcsE", getVal("f-gcsE"));
        setText("p-gcsV", getVal("f-gcsV"));
        setText("p-gcsM", getVal("f-gcsM"));
        const defaultDpjp = self.patient?.dokterDpjp || self.patient?.dpjp || self.patient?.namaDokter || self.patient?.dokter || "";
        setText("p-namaDokter", getVal("f-namaDokter") || defaultDpjp || ".....................................");
        setText("p-namaPerawat", getVal("f-namaPerawat") || ".....................................");
        setText("p-situasiBerbahaya", getVal("f-situasiBerbahaya"));
        setText("p-doaDetail", getVal("f-doaDetail"));
        setText("p-konsul", getVal("f-konsul") || ".....................................");
        ["red", "yellow", "green", "black"].forEach((c) => {
          const el = document.querySelector(".p-triageColor-" + c);
          if (el) el.innerHTML = getVal("f-triageColor") === c ? "✓" : "";
        });
        const checked = Array.from(
          document.querySelectorAll(".f-symptom:checked"),
        ).map((cb) => cb.value);
        document.querySelectorAll(".p-symptom").forEach((el) => {
          const dataVal = el.getAttribute("data-val");
          el.innerHTML = (dataVal && checked.includes(dataVal)) ? "✓" : "";
        });
        const sigDokterEl = document.getElementById("sig-dokter");
        const sigPerawatEl = document.getElementById("sig-perawat");
        const previewDokter = document.getElementById("p-sig-dokter");
        const previewPerawat = document.getElementById("p-sig-perawat");
        if (sigDokterEl && previewDokter) {
          try {
            const dataUrl = sigDokterEl.toDataURL();
            if (dataUrl && dataUrl.length > 100) {
              const img = document.createElement("img");
              img.src = dataUrl;
              img.style.cssText = "max-width:100%;max-height:48px;object-fit:contain;";
              previewDokter.innerHTML = "";
              previewDokter.appendChild(img);
            }
          } catch(e) {}
        }
        if (sigPerawatEl && previewPerawat) {
          try {
            const dataUrl = sigPerawatEl.toDataURL();
            if (dataUrl && dataUrl.length > 100) {
              const img = document.createElement("img");
              img.src = dataUrl;
              img.style.cssText = "max-width:100%;max-height:48px;object-fit:contain;";
              previewPerawat.innerHTML = "";
              previewPerawat.appendChild(img);
            }
          } catch(e) {}
        }
      };

      document
        .querySelectorAll("#triase-input input, #triase-input select, #triase-input textarea")
        .forEach((inp) => {
          inp.addEventListener("input", syncToPreview);
          inp.addEventListener("change", syncToPreview);
        });

      if (self.triaseData) {
        const d = self.triaseData;
        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val) el.value = val;
        };
        setVal("f-td", d.td);
        setVal("f-suhu", d.suhu);
        setVal("f-hr", d.hr);
        setVal("f-rr", d.rr);
        setVal("f-spo2", d.spo2);
        setVal("f-gcsE", d.gcsE);
        setVal("f-gcsV", d.gcsV);
        setVal("f-gcsM", d.gcsM);
        setVal("f-triageColor", d.triageColor);
        setVal("f-namaDokter", d.namaDokter || defaultDpjp);
        setVal("f-namaPerawat", d.namaPerawat);
        setVal("f-situasiBerbahaya", d.situasiBerbahaya);
        setVal("f-doaDetail", d.doaDetail);
        setVal("f-konsul", d.konsul);
        if (d.symptoms && Array.isArray(d.symptoms)) {
          document.querySelectorAll(".f-symptom").forEach((cb) => {
            if (d.symptoms.includes(cb.value)) cb.checked = true;
          });
        }
        if (d.canvasImage) {
          const pd = document.getElementById("p-sig-dokter");
          if (pd) {
            const img = document.createElement("img");
            img.src = d.canvasImage;
            img.style.cssText =
              "max-width:100%;max-height:48px;object-fit:contain;";
            pd.innerHTML = "";
            pd.appendChild(img);
          }
          const cd = document.getElementById("sig-dokter");
          if (cd) {
            const ctx = cd.getContext("2d");
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, cd.width, cd.height);
            img.src = d.canvasImage;
          }
        }
        if (d.canvasImagePerawat) {
          const pp = document.getElementById("p-sig-perawat");
          if (pp) {
            const img = document.createElement("img");
            img.src = d.canvasImagePerawat;
            img.style.cssText =
              "max-width:100%;max-height:48px;object-fit:contain;";
            pp.innerHTML = "";
            pp.appendChild(img);
          }
          const cp = document.getElementById("sig-perawat");
          if (cp) {
            const ctx = cp.getContext("2d");
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, cp.width, cp.height);
            img.src = d.canvasImagePerawat;
          }
        }
      }
      syncToPreview();
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
