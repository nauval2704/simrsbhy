let TriaseComponent = null;
let PengkajianAwalIgdComponent = null;
let RingkasanPulangComponent = null;
let PrmrjComponent = null;
let PoliGigiComponent = null;
let PengkajianAwalPoliComponent = null;
let loadHtml2Pdf = null;
let buildSuratPdfFilename = null;
let getStandardGridCSS = null;
let apiUrl = "";

async function loadDependencies() {
  if (!loadHtml2Pdf) {
    const modLayout = await import("./chunk-SURAT-LAYOUT.js");
    loadHtml2Pdf = modLayout.loadHtml2Pdf;
    buildSuratPdfFilename = modLayout.buildSuratPdfFilename;
    getStandardGridCSS = modLayout.getStandardGridCSS;
  }
  if (!TriaseComponent) {
    const modTriase = await import("./chunk-TRIASE.js");
    TriaseComponent = modTriase.TriaseComponent;
  }
  if (!PengkajianAwalIgdComponent) {
    const modIgd = await import("./chunk-PENGKAJIAN-AWAL-IGD.js");
    PengkajianAwalIgdComponent = modIgd.PengkajianAwalIgdComponent;
  }
  if (!RingkasanPulangComponent) {
    const modRp = await import("./chunk-RINGKASAN-PULANG.js");
    RingkasanPulangComponent = modRp.RingkasanPulangComponent;
  }
  if (!PrmrjComponent) {
    const modPrmrj = await import("./chunk-PRMRJ.js");
    PrmrjComponent = modPrmrj.PrmrjComponent;
  }
  if (!PoliGigiComponent) {
    const modGigi = await import("./chunk-POLI-GIGI.js");
    PoliGigiComponent = modGigi.PoliGigiComponent;
  }
  if (!PengkajianAwalPoliComponent) {
    const modPoli = await import("./chunk-PENGKAJIAN-AWAL-POLI.js");
    PengkajianAwalPoliComponent = modPoli.PengkajianAwalPoliComponent;
  }
  if (!apiUrl) {
    try {
      const modEnv = await import("../chunk-W7XVFZVJ.js");
      if (modEnv && modEnv.a && modEnv.a.apiUrl) apiUrl = modEnv.a.apiUrl;
    } catch (e) {}
    if (!apiUrl) apiUrl = "http://36.66.36.106:1822";
  }
}

async function ensureJSZip() {
  if (window.JSZip) return window.JSZip;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "assets/js/jszip.min.js";
    s.onload = () => resolve(window.JSZip);
    s.onerror = () => reject(new Error("Gagal memuat jszip.min.js"));
    document.head.appendChild(s);
  });
}

function saveBlobAs(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

function cleanFilename(str) {
  return String(str || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "_");
}

function showModal(modalEl) {
  modalEl.style.cssText = "display:block !important; position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:100050 !important; overflow-x:hidden !important; overflow-y:auto !important; background:rgba(0,0,0,0.55);";
  modalEl.classList.add("show");
  document.body.classList.add("modal-open");
}

function hideModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = "none";
  modalEl.classList.remove("show");
  document.body.classList.remove("modal-open");
}

class SimrsMassDownloader {
  constructor() {
    this.initNetworkInterceptor();
  }

  initNetworkInterceptor() {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
      this._url = url;
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
      this.addEventListener("load", () => {
        if (this._url && this._url.includes("/simrsba/caripasien")) {
          try {
            const json = JSON.parse(this.responseText);
            if (Array.isArray(json)) {
              window._simrsCurrentPatientList = json;
            } else if (json && Array.isArray(json.data)) {
              window._simrsCurrentPatientList = json.data;
            }
          } catch (e) {}
        }
      });
      return origSend.apply(this, arguments);
    };
  }

  getModalElement() {
    let el = document.getElementById("simrs-mass-downloader-modal");
    if (!el) {
      el = document.createElement("div");
      el.id = "simrs-mass-downloader-modal";
      el.className = "modal fade";
      el.tabIndex = -1;
      el.setAttribute("aria-hidden", "true");
      el.style.cssText = "display:none; position:fixed !important; top:0 !important; left:0 !important; width:100vw !important; height:100vh !important; z-index:100050 !important; overflow-x:hidden !important; overflow-y:auto !important; background:rgba(0,0,0,0.55);";
      el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg" style="margin:2rem auto; max-width:780px; width:92%;">
          <div class="modal-content shadow-lg border-0" style="background:#fff !important; width:100% !important; max-width:100% !important; margin:0 !important; padding:0 !important; border-radius:10px !important; overflow:hidden !important;">
            <div class="modal-header bg-primary text-white py-3 px-4" style="border-bottom:1px solid #dee2e6;">
              <h5 class="modal-title fw-bold d-flex align-items-center mb-0" style="color:#fff !important;">
                <i class="bi bi-file-earmark-zip-fill me-2 fs-4"></i>
                <span>Unduh Berkas Rekam Medis Pasien</span>
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" style="filter: brightness(0) invert(1);"></button>
            </div>
            <div class="modal-body p-4" id="simrs-mass-modal-body">
              <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2 text-muted fw-semibold">Memeriksa berkas rekam medis...</div>
              </div>
            </div>
            <div class="modal-footer bg-light py-2 px-4" id="simrs-mass-modal-footer">
              <button type="button" class="btn btn-secondary px-3" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      `;
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-bs-dismiss='modal']") || e.target.classList.contains("btn-close") || e.target === el) {
          hideModal(el);
        }
      });
      document.body.appendChild(el);
    }
    return el;
  }

  async open(patient, moduleType = "IGD") {
    await loadDependencies();

    const modalEl = this.getModalElement();
    const modalBody = modalEl.querySelector("#simrs-mass-modal-body");
    const modalFooter = modalEl.querySelector("#simrs-mass-modal-footer");

    modalBody.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="mt-2 text-muted fw-semibold">Memeriksa kelengkapan berkas...</div>
      </div>
    `;
    modalFooter.innerHTML = `<button type="button" class="btn btn-secondary px-3" data-bs-dismiss="modal">Tutup</button>`;

    showModal(modalEl);

    let pObj = patient;
    if (typeof pObj === "string") {
      pObj = { noCheckin: patient };
    }
    pObj = pObj || {};

    let noMr = String(pObj.noMr || pObj.norm || "").trim();
    let noCheckin = String(pObj.noCheckin || pObj.nocheckin || "").trim();
    let namaPasien = pObj.nama || pObj.namaPasien || "";

    const baseApi = apiUrl || "http://36.66.36.106:1822";

    if (!noCheckin && noMr) {
      try {
        const resRiwayat = await fetch(`${baseApi}/simrsba/riwayat/${encodeURIComponent(noMr)}`);
        if (resRiwayat.ok) {
          const listRiwayat = await resRiwayat.json();
          if (Array.isArray(listRiwayat) && listRiwayat.length > 0) {
            noCheckin = listRiwayat[0].noCheckin || "";
            if (!namaPasien) namaPasien = listRiwayat[0].nama || "";
          }
        }
      } catch (err) {}
    }

    if (!noMr && noCheckin) {
      try {
        const resPt = await fetch(`${baseApi}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`);
        if (resPt.ok) {
          const ptData = await resPt.json();
          const pFound = Array.isArray(ptData) ? ptData[0] : (ptData.data || ptData);
          if (pFound) {
            if (!noMr) noMr = pFound.noMr || pFound.norm || "";
            if (!namaPasien) namaPasien = pFound.nama || "";
          }
        }
      } catch (e) {}
    }

    const poliStr = (pObj.poli || "").toUpperCase();
    const isPoliGigi = moduleType === "POLI" && (poliStr.includes("GIGI") || (pObj.poliNama || "").toUpperCase().includes("GIGI"));

    const docDefinitions = [];
    if (moduleType === "POLI") {
      if (isPoliGigi) {
        docDefinitions.push({
          id: "poli-gigi",
          title: "PRMRJ Poli Gigi",
          filename: `PRMRJ_POLI_GIGI_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
          endpoint: `${baseApi}/simrsba/poli-gigi/${encodeURIComponent(noMr)}`,
          checkFilled: (data) => data && Array.isArray(data.entries) && data.entries.length > 0,
          render: (pt, data) => PoliGigiComponent.getPrintHtml(pt, data)
        });
      } else {
        docDefinitions.push({
          id: "pengkajian-awal-poli",
          title: "Pengkajian Awal Poliklinik Rawat Jalan",
          filename: `PENGKAJIAN_AWAL_POLI_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
          endpoint: `${baseApi}/simrsba/pengkajian-awal-poli/${encodeURIComponent(noCheckin)}`,
          checkFilled: (data) => data && (data.keluhanUtama || data.td || data.diagnosaMedis || data.tglMasukDate),
          render: (pt, data) => PengkajianAwalPoliComponent.getPrintHtml(pt, data)
        });
        docDefinitions.push({
          id: "prmrj",
          title: "PRMRJ (Profil Ringkas Medis Rawat Jalan)",
          filename: `PRMRJ_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
          endpoint: `${baseApi}/simrsba/prmrj/${encodeURIComponent(noMr)}`,
          checkFilled: (data) => data && Array.isArray(data.entries) && data.entries.length > 0,
          render: (pt, data) => PrmrjComponent.getPrintHtml(pt, data)
        });
      }
    } else {
      docDefinitions.push({
        id: "triase",
        title: "Formulir Triase Gawat Darurat",
        filename: `TRIASE_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
        endpoint: `${baseApi}/simrsba/triase/${encodeURIComponent(noCheckin)}`,
        checkFilled: (data) => data && (data.triageColor || data.td || data.suhu || data.canvasImage || data.pukulPemeriksaan || data.keluhan),
        render: (pt, data) => TriaseComponent.getPrintHtml(pt, data)
      });
      docDefinitions.push({
        id: "pengkajian-awal-igd",
        title: "Pengkajian Awal IGD",
        filename: `PENGKAJIAN_AWAL_IGD_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
        endpoint: `${baseApi}/simrsba/pengkajian-awal-igd/${encodeURIComponent(noCheckin)}`,
        checkFilled: (data) => data && (data.keluhanUtama || data.td || data.diagnosa || data.diagnosisKerja || data.anamnesis || data.tglMasukDate || data.canvasAnatomi),
        render: (pt, data) => PengkajianAwalIgdComponent.getPrintHtml(pt, data)
      });
      docDefinitions.push({
        id: "ringkasan-pulang",
        title: "Ringkasan Pulang IGD",
        filename: `RINGKASAN_PULANG_IGD_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
        endpoint: `${baseApi}/simrsba/ringkasan-pulang/${encodeURIComponent(noCheckin)}`,
        checkFilled: (data) => data && (data.keluhanUtama || data.indikasiMasuk || data.diagnosisKerja || data.tglJamMasuk || data.terapiPulang),
        render: (pt, data) => RingkasanPulangComponent.getPrintHtml(pt, data)
      });
      docDefinitions.push({
        id: "prmrj",
        title: "PRMRJ (Profil Ringkas Medis Rawat Jalan)",
        filename: `PRMRJ_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.pdf`,
        endpoint: `${baseApi}/simrsba/prmrj/${encodeURIComponent(noMr)}`,
        checkFilled: (data) => data && Array.isArray(data.entries) && data.entries.length > 0,
        render: (pt, data) => PrmrjComponent.getPrintHtml(pt, data)
      });
    }

    const results = await Promise.all(
      docDefinitions.map(async (doc) => {
        try {
          const res = await fetch(doc.endpoint);
          if (!res.ok) return { ...doc, isFilled: false, data: null };
          const json = await res.json();
          const docData = json.data || (json._id ? json : null);
          const filled = Boolean(doc.checkFilled(docData));
          return { ...doc, isFilled: filled, data: docData };
        } catch (err) {
          return { ...doc, isFilled: false, data: null };
        }
      })
    );

    const filledDocs = results.filter((d) => d.isFilled);
    const filledCount = filledDocs.length;

    let itemsHtml = "";
    results.forEach((r, idx) => {
      const isChecked = r.isFilled ? "checked" : "";
      const isDisabled = r.isFilled ? "" : "disabled";
      const badge = r.isFilled
        ? `<span class="badge bg-success"><i class="bi bi-check2 me-1"></i>Terisi</span>`
        : `<span class="badge bg-secondary">Belum Diisi</span>`;
      const textClass = r.isFilled ? "fw-bold text-dark" : "text-muted text-decoration-line-through";

      itemsHtml += `
        <li class="list-group-item d-flex justify-content-between align-items-center py-3">
          <div class="form-check d-flex align-items-center gap-2 m-0">
            <input class="form-check-input mass-doc-item" type="checkbox" value="${idx}" id="chk-doc-${idx}" ${isChecked} ${isDisabled}>
            <label class="form-check-label ${textClass} ms-1" for="chk-doc-${idx}">
              ${r.title}
            </label>
          </div>
          <div>${badge}</div>
        </li>
      `;
    });

    const infoPatientHtml = `
      <div class="card bg-light border-0 mb-3">
        <div class="card-body p-3">
          <div class="row g-2">
            <div class="col-sm-6">
              <span class="text-muted small">Nama Pasien:</span>
              <div class="fw-bold fs-6">${namaPasien || "-"}</div>
            </div>
            <div class="col-sm-3">
              <span class="text-muted small">No. RM:</span>
              <div class="fw-bold fs-6">${noMr || "-"}</div>
            </div>
            <div class="col-sm-3">
              <span class="text-muted small">Unit:</span>
              <div class="fw-bold fs-6">${moduleType}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (filledCount === 0) {
      modalBody.innerHTML = `
        ${infoPatientHtml}
        <div class="alert alert-warning d-flex align-items-center mb-0 py-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
          <div>
            <strong>Belum ada dokumen yang terisi</strong> untuk kunjungan pasien ini.
            <div class="small text-muted mt-1">Silakan isi formulir rekam medis terlebih dahulu sebelum mengunduh berkas.</div>
          </div>
        </div>
        <ul class="list-group mt-3">${itemsHtml}</ul>
      `;
      modalFooter.innerHTML = `<button type="button" class="btn btn-secondary px-3" data-bs-dismiss="modal">Tutup</button>`;
      return;
    }

    modalBody.innerHTML = `
      ${infoPatientHtml}
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="fw-semibold text-muted small">DOKUMEN TERSEDIA (${filledCount} DARI ${results.length})</span>
        <div class="small">
          <a href="javascript:void(0)" id="btn-select-all-mass" class="text-decoration-none me-2">Pilih Semua</a>
          <a href="javascript:void(0)" id="btn-deselect-all-mass" class="text-decoration-none text-muted">Batal Pilih</a>
        </div>
      </div>
      <ul class="list-group mb-3">${itemsHtml}</ul>
      <div class="p-3 bg-light rounded-3 border">
        <div class="fw-semibold small text-muted mb-2">FORMAT UNDUHAN:</div>
        <div class="d-flex gap-4">
          <div class="form-check">
            <input class="form-check-input" type="radio" name="mass-download-format" id="fmt-zip" value="zip" checked>
            <label class="form-check-label fw-bold" for="fmt-zip">
              <i class="bi bi-file-earmark-zip text-primary me-1"></i> Paket ZIP (.zip)
              <div class="small text-muted fw-normal">Semua dokumen dibundel dalam 1 file ZIP</div>
            </label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="mass-download-format" id="fmt-pdf" value="pdf">
            <label class="form-check-label fw-bold" for="fmt-pdf">
              <i class="bi bi-file-earmark-pdf text-danger me-1"></i> File Terpisah (.pdf)
              <div class="small text-muted fw-normal">Masing-masing file PDF diunduh berurutan</div>
            </label>
          </div>
        </div>
      </div>
      <div id="mass-download-progress-box" class="mt-3 d-none">
        <div class="progress mb-2" style="height: 10px;">
          <div id="mass-download-progressbar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%"></div>
        </div>
        <div id="mass-download-status-text" class="small text-muted text-center">Memproses...</div>
      </div>
    `;

    modalFooter.innerHTML = `
      <button type="button" class="btn btn-secondary px-3" data-bs-dismiss="modal">Batal</button>
      <button type="button" id="btn-exec-mass-download" class="btn btn-primary px-4 fw-bold">
        <i class="bi bi-cloud-arrow-down-fill me-1"></i> Unduh Dokumen Terpilih
      </button>
    `;

    const btnSelectAll = modalBody.querySelector("#btn-select-all-mass");
    const btnDeselectAll = modalBody.querySelector("#btn-deselect-all-mass");
    if (btnSelectAll) {
      btnSelectAll.addEventListener("click", () => {
        modalBody.querySelectorAll(".mass-doc-item:not([disabled])").forEach((chk) => (chk.checked = true));
      });
    }
    if (btnDeselectAll) {
      btnDeselectAll.addEventListener("click", () => {
        modalBody.querySelectorAll(".mass-doc-item:not([disabled])").forEach((chk) => (chk.checked = false));
      });
    }

    const execBtn = modalFooter.querySelector("#btn-exec-mass-download");
    if (execBtn) {
      execBtn.addEventListener("click", async () => {
        const checkedIndices = Array.from(modalBody.querySelectorAll(".mass-doc-item:checked")).map((chk) => parseInt(chk.value, 10));
        if (checkedIndices.length === 0) {
          alert("Pilih setidaknya 1 dokumen yang ingin diunduh!");
          return;
        }

        const selectedDocs = checkedIndices.map((idx) => results[idx]);
        const isZip = modalBody.querySelector("#fmt-zip").checked;

        execBtn.disabled = true;
        const progressBox = modalBody.querySelector("#mass-download-progress-box");
        const progressBar = modalBody.querySelector("#mass-download-progressbar");
        const statusText = modalBody.querySelector("#mass-download-status-text");
        progressBox.classList.remove("d-none");

        try {
          await loadHtml2Pdf();
          let zip = null;
          if (isZip) {
            const JSZip = await ensureJSZip();
            zip = new JSZip();
          }

          let renderHost = document.getElementById("simrs-mass-render-host");
          if (!renderHost) {
            renderHost = document.createElement("div");
            renderHost.id = "simrs-mass-render-host";
            renderHost.style.cssText = "position:fixed; left:-9999px; top:0; width:215.9mm; background:white; z-index:-9999;";
            document.body.appendChild(renderHost);
          }

          const allSuratCss = `
            ${getStandardGridCSS ? getStandardGridCSS() : ''}
            .master-grid { width: 100%; border-collapse: collapse; border: 2px solid black; font-family: 'Times New Roman', Times, serif; }
            .master-grid th, .master-grid td { border: 1px solid black; padding: 4px 6px; font-size: 10px !important; line-height: 1.3; vertical-align: top; }
            .master-grid tr { page-break-inside: avoid; }
            .inner-align { width: 100%; border-collapse: collapse; }
            .inner-align td { border: none; padding: 1px; font-size: 10px !important; }
            .title-row { text-align: center; font-weight: bold; font-size: 14px !important; background-color: #f2f2f2; padding: 6px !important; }
            .cb { display: inline-block; width: 13px; height: 13px; border: 1px solid black; text-align: center; line-height: 11px; font-size: 11px !important; font-weight: bold; margin-right: 4px; vertical-align: middle; overflow: hidden; }
            .cb-checked::after { content: "✓"; }
            .rounded-meta { border: 1px solid black; border-radius: 10px; padding: 5px; width: 100%; }
            .footer-id { text-align: right; font-size: 9px !important; margin-top: 5px; font-style: italic; }
            .t-border{box-sizing:border-box; width:100%; border:2px solid black; border-top:none; display:flex;flex-direction:column;flex:1;font-family:'Times New Roman',Times,serif; background:white;}
            .t-border *{font-size:11px !important;line-height:1.25 !important;box-sizing:border-box;margin:0;padding:0;}
            .t-border h3{font-size:13px !important;font-weight:bold;}
            .t-row{display:flex;border-bottom:1px solid black; break-inside: avoid; page-break-inside: avoid;}
            .t-inner-row{display:flex;border-bottom:1px solid black;}
            .t-inner-row:last-child{border-bottom:none;}
            .t-inner-col{box-sizing:border-box;padding:3px 4px;border-right:1px solid black;}
            .t-inner-col:last-child{border-right:none;}
            .t-row:last-child{border-bottom:none;}
            .t-col{box-sizing:border-box; padding:4px;border-right:1px solid black;}
            .t-col:last-child{border-right:none;}
            .t-f1{flex:1;}.t-f2{flex:2;}.t-f3{flex:3;}.t-f4{flex:4;}
            .t-sq{display:inline-block;width:13px;height:13px;border:1px solid black;margin-right:4px;flex-shrink:0;vertical-align:middle;text-align:center;line-height:11px;font-size:11px !important;font-weight:bold;overflow:hidden;}
            .t-level{font-weight:bold !important;padding:4px;border-bottom:1px solid black;background-color:#f2f2f2;text-align:center;}
            .t-sq.cb::after { content: "✓"; font-size: 11px !important; line-height: 11px; display: block; text-align: center; }
            .t-arrow{text-align:center;padding:2px 0;border-bottom:1px solid black;}
            .t-vgrid{display:grid;grid-template-columns:1fr 1fr 1fr;width:100%;gap:2px;}
            .t-cbox{width:20px;height:10px;display:inline-block;border:1px solid black;}
            .t-red{background-color:#f44336;}.t-yellow{background-color:#ffeb3b;}.t-green{background-color:#4caf50;}.t-blk{background-color:#212121;}
            .t-white{color:white !important;}
            .p-val{font-weight:bold;min-width:12px;display:inline-block;border-bottom:1px dotted #999;padding:0 2px;}
            .prmrj-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; flex: 1; height: 100%; table-layout: fixed; }
            .prmrj-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }
            .prmrj-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }
            .prmrj-table tbody td:first-child { border-left: none !important; }
            .prmrj-table tbody td:last-child { border-right: none !important; }
            .prmrj-table tbody tr:last-child td { border-bottom: none !important; }
            .gigi-table { width: 100%; border-collapse: collapse; font-family: 'Times New Roman', Times, serif; flex: 1; height: 100%; table-layout: fixed; }
            .gigi-table th { border: 1px solid black; padding: 5px 4px; vertical-align: middle; font-size: 11px !important; text-align: center; background-color: #f2f2f2; font-weight: bold; }
            .gigi-table tbody td { border-top: none !important; border-bottom: none !important; border-left: 1px solid black !important; border-right: 1px solid black !important; padding: 6px 6px; vertical-align: top; font-size: 11px !important; }
            .gigi-table tbody td:first-child { border-left: none !important; }
            .gigi-table tbody td:last-child { border-right: none !important; }
            .gigi-table tbody tr:last-child td { border-bottom: none !important; }
          `;

          const patientPayload = {
            noMr: noMr,
            norm: noMr,
            nama: namaPasien,
            namaPasien: namaPasien,
            tglLahir: pObj.tglLahir || "",
            kelamin: pObj.kelamin || "",
            dokterDpjp: pObj.dokterDpjp || pObj.dpjp || pObj.namaDokter || "",
            dpjp: pObj.dokterDpjp || pObj.dpjp || pObj.namaDokter || "",
            tglInput: pObj.tglInput || pObj.tglMasuk || "",
            tglMasuk: pObj.tglInput || pObj.tglMasuk || "",
            poli: pObj.poli || "",
            poliNama: pObj.poliNama || ""
          };

          for (let i = 0; i < selectedDocs.length; i++) {
            const doc = selectedDocs[i];
            const percent = Math.round(((i) / selectedDocs.length) * 100);
            progressBar.style.width = `${percent}%`;
            statusText.textContent = `Memproses (${i + 1}/${selectedDocs.length}): ${doc.title}...`;

            const fullHtml = doc.render(patientPayload, doc.data);
            renderHost.innerHTML = `<style>${allSuratCss}</style>` + fullHtml;

            const opt = {
              margin: [0, 0, 0, 0],
              filename: doc.filename,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, logging: false },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
              pagebreak: { mode: ["css", "legacy"] }
            };

            const pdfBlob = await window.html2pdf().set(opt).from(renderHost).outputPdf("blob");

            if (isZip) {
              zip.file(doc.filename, pdfBlob);
            } else {
              saveBlobAs(pdfBlob, doc.filename);
              await new Promise((r) => setTimeout(r, 600));
            }
          }

          progressBar.style.width = "100%";
          if (isZip) {
            statusText.textContent = "Mengompres berkas ke dalam ZIP...";
            const zipFilename = `DOKUMEN_${cleanFilename(noMr)}_${cleanFilename(namaPasien)}.zip`;
            const zipBlob = await zip.generateAsync({ type: "blob" });
            saveBlobAs(zipBlob, zipFilename);
          }

          statusText.innerHTML = '<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i> Pengunduhan berkas selesai!</span>';
          execBtn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Selesai';
          execBtn.classList.replace("btn-primary", "btn-success");

          setTimeout(() => {
            hideModal(modalEl);
          }, 2000);
        } catch (err) {
          statusText.innerHTML = `<span class="text-danger fw-bold"><i class="bi bi-exclamation-triangle-fill me-1"></i> Gagal: ${err.message}</span>`;
          execBtn.disabled = false;
        }
      });
    }
  }
}

const massDownloaderInstance = new SimrsMassDownloader();
window.SimrsMassDownloader = massDownloaderInstance;

export { SimrsMassDownloader };
