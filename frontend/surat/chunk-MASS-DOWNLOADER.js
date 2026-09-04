let TriaseComponent = null;
let PengkajianAwalIgdComponent = null;
let RingkasanPulangComponent = null;
let PrmrjComponent = null;
let PoliGigiComponent = null;
let PengkajianAwalPoliComponent = null;
let loadHtml2Pdf = null;
let buildSuratPdfFilename = null;
let apiUrl = "";

async function loadDependencies() {
  if (!loadHtml2Pdf) {
    const modLayout = await import("./chunk-SURAT-LAYOUT.js");
    loadHtml2Pdf = modLayout.loadHtml2Pdf;
    buildSuratPdfFilename = modLayout.buildSuratPdfFilename;
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

class SimrsMassDownloader {
  constructor() {
    this.initNetworkInterceptor();
    this.initDropdownObserver();
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

  initDropdownObserver() {
    let lastClickedPatient = null;
    let lastModule = "IGD";

    document.addEventListener("mousedown", (e) => {
      const btn = e.target.closest("button[ngbdropdowntoggle], .btn-warning, button.dropdown-toggle");
      if (!btn) return;
      const tr = btn.closest("tr");
      if (!tr) return;

      const cells = tr.querySelectorAll("td, th");
      let foundNoMr = "";
      cells.forEach((c) => {
        const txt = c.textContent.trim();
        if (/^\d{6,}$/.test(txt) || /^\d{2}-\d{2}-\d{2}$/.test(txt)) {
          if (!foundNoMr) foundNoMr = txt;
        }
      });

      let pt = (window._simrsCurrentPatientList || []).find((p) => p.noMr === foundNoMr);
      if (!pt) {
        pt = {
          noMr: foundNoMr,
          nama: cells[5]?.textContent.trim() || cells[4]?.textContent.trim() || "",
          kelamin: cells[6]?.textContent.trim() || cells[5]?.textContent.trim() || "",
          dpjp: cells[9]?.textContent.trim() || ""
        };
      }
      lastClickedPatient = pt;
      lastModule = window.location.pathname.includes("/poli") ? "POLI" : "IGD";
    }, true);

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          let menuEl = null;
          if (node.matches && (node.matches(".dropdown-menu") || node.matches("[ngbdropdownmenu]"))) {
            menuEl = node;
          } else if (node.querySelector) {
            menuEl = node.querySelector(".dropdown-menu, [ngbdropdownmenu]");
          }

          if (menuEl && !menuEl.querySelector(".btn-action-unduh-dokumen")) {
            const hasCetakBilling = Array.from(menuEl.querySelectorAll("button, a")).some((b) => b.textContent.includes("Cetak Billing"));
            const hasPrintGelang = Array.from(menuEl.querySelectorAll("button, a")).some((b) => b.textContent.includes("Print Gelang"));
            if (hasCetakBilling || hasPrintGelang) {
              const btn = document.createElement("button");
              btn.type = "button";
              btn.className = "dropdown-item text-primary fw-bold btn-action-unduh-dokumen border-top mt-1 pt-2";
              btn.innerHTML = '<i class="bi bi-file-earmark-zip-fill text-primary me-2"></i>Unduh Dokumen Terisi';
              const pData = lastClickedPatient;
              const pMod = lastModule;
              btn.addEventListener("click", (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                this.open(pData, pMod);
              });
              menuEl.appendChild(btn);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  getModalElement() {
    let el = document.getElementById("simrs-mass-downloader-modal");
    if (!el) {
      el = document.createElement("div");
      el.id = "simrs-mass-downloader-modal";
      el.className = "modal fade";
      el.tabIndex = -1;
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content shadow-lg border-0">
            <div class="modal-header bg-primary text-white py-3">
              <h5 class="modal-title fw-bold d-flex align-items-center">
                <i class="bi bi-file-earmark-zip-fill me-2 fs-4"></i>
                <span>Unduh Berkas Rekam Medis Pasien</span>
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
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

    let bsModal = null;
    if (window.bootstrap && window.bootstrap.Modal) {
      bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    } else {
      modalEl.classList.add("show");
      modalEl.style.display = "block";
      document.body.classList.add("modal-open");
    }

    const noMr = String(patient?.noMr || patient?.norm || "").trim();
    let noCheckin = String(patient?.noCheckin || patient?.nocheckin || "").trim();
    let namaPasien = patient?.nama || patient?.namaPasien || "";

    const baseApi = apiUrl || "";

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

    const poliStr = (patient?.poli || "").toUpperCase();
    const isPoliGigi = moduleType === "POLI" && (poliStr.includes("GIGI") || (patient?.poliNama || "").toUpperCase().includes("GIGI"));

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

          for (let i = 0; i < selectedDocs.length; i++) {
            const doc = selectedDocs[i];
            const percent = Math.round(((i) / selectedDocs.length) * 100);
            progressBar.style.width = `${percent}%`;
            statusText.textContent = `Memproses (${i + 1}/${selectedDocs.length}): ${doc.title}...`;

            const fullHtml = doc.render(patient, doc.data);
            renderHost.innerHTML = fullHtml;

            const opt = {
              margin: [10, 10, 10, 10],
              filename: doc.filename,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2, useCORS: true, logging: false },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            const pdfBlob = await window.html2pdf().set(opt).from(renderHost).outputPdf("blob");

            if (isZip) {
              zip.file(doc.filename, pdfBlob);
            } else {
              saveBlobAs(pdfBlob, doc.filename);
              await new Promise((r) => setTimeout(r, 400));
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
            if (bsModal) {
              bsModal.hide();
            } else {
              modalEl.classList.remove("show");
              modalEl.style.display = "none";
              document.body.classList.remove("modal-open");
            }
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
