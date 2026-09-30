import { a as i } from "../chunk-W7XVFZVJ.js";
import {
  getStandardGridCSS,
  hospitalHeaderRow,
  footerLabel,
  forceChromePrintStyles,
  downloadSuratAsPdf,
  buildSuratPdfFilename,
  showSuccessToast,
  showErrorAlert
} from "./chunk-SURAT-LAYOUT.js";

function getBaseApi() {
  if (typeof i !== "undefined" && i.apiUrl) return i.apiUrl;
  if (typeof window !== "undefined" && window.location) {
    return window.location.protocol + "//" + window.location.hostname + ":1822";
  }
  return "http://localhost:1822";
}

function showLocalToast(type, message) {
  if (typeof window !== "undefined" && window.__toastr) {
    if (type === "success") window.__toastr.success(message, "Sukses");
    else if (type === "warning") window.__toastr.warning(message, "Peringatan");
    else window.__toastr.error(message, "Error");
    return;
  }
  if (type === "success") showSuccessToast(message);
  else showErrorAlert(message);
}

function openFileLightbox(src) {
  const existing = document.getElementById("simrs-file-lightbox");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "simrs-file-lightbox";
  overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;cursor:zoom-out;backdrop-filter:blur(3px);";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.innerHTML = '<i class="bi bi-x-lg"></i> Tutup';
  closeBtn.className = "btn btn-sm btn-light position-fixed";
  closeBtn.style.cssText = "top:18px;right:22px;z-index:1000000;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.4);";
  closeBtn.onclick = (e) => { e.stopPropagation(); overlay.remove(); };

  const img = document.createElement("img");
  img.src = src;
  img.style.cssText = "max-height:92vh;max-width:92vw;object-fit:contain;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,0.7);cursor:default;";
  img.onclick = (e) => e.stopPropagation();

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  overlay.onclick = () => overlay.remove();

  const escHandler = (e) => {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
  document.body.appendChild(overlay);
}

export function renderFileCardsHtml(files) {
  if (!files || !Array.isArray(files) || files.length === 0) return "";
  const baseApi = getBaseApi();

  return files.map((fileUrl, index) => {
    const fullUrl = fileUrl.startsWith("http") ? fileUrl : (baseApi + fileUrl);
    const cleanPath = fileUrl.split("?")[0].toLowerCase();
    const isPdf = cleanPath.endsWith(".pdf");
    const rawName = fileUrl.split("/").pop().split("?")[0];
    const fileName = rawName || `Berkas ${index + 1}`;

    if (isPdf) {
      return `
        <div class="border rounded p-2 bg-light d-flex align-items-center gap-2 position-relative simrs-file-item simrs-file-pdf-item shadow-sm" data-url="${fullUrl}" style="min-width:220px;max-width:300px;background:#f8f9fa;cursor:pointer;" title="Klik untuk membuka dokumen PDF">
          <i class="bi bi-file-earmark-pdf-fill text-danger fs-2 flex-shrink-0"></i>
          <div class="overflow-hidden flex-grow-1">
            <div class="small fw-semibold text-truncate" title="${fileName}" style="font-size:12px;">${fileName}</div>
            <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 mt-1 text-decoration-none d-inline-flex align-items-center" style="font-size:10px;padding:2px 6px;">
              <i class="bi bi-box-arrow-up-right me-1"></i>Buka PDF
            </a>
          </div>
          <button type="button" class="btn btn-sm btn-outline-danger simrs-btn-del-file flex-shrink-0 ms-1" data-url="${fileUrl}" title="Hapus berkas PDF ini" style="padding:2px 7px;">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
    } else {
      return `
        <div class="border rounded p-1 bg-white position-relative d-inline-block text-center simrs-file-item shadow-sm" style="width:130px;">
          <div class="simrs-preview-img-wrapper" data-src="${fullUrl}" style="position:relative;cursor:pointer;height:95px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;background:#f1f1f1;" title="Klik untuk memperbesar foto">
            <img src="${fullUrl}" class="simrs-img-thumb" style="max-height:95px;max-width:100%;object-fit:cover;" alt="Foto">
            <div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);color:#fff;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;font-size:11px;font-weight:500;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
              <i class="bi bi-zoom-in me-1"></i>Perbesar
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-1 px-1">
            <span class="text-truncate text-muted" style="font-size:10px;max-width:80px;" title="${fileName}">${fileName}</span>
            <button type="button" class="btn btn-xs btn-outline-danger simrs-btn-del-file" data-url="${fileUrl}" title="Hapus foto ini" style="padding:0 4px;font-size:11px;line-height:1.2;">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `;
    }
  }).join("");
}

export function renderLampiranFilesPrintHtml(files) {
  if (!files || !Array.isArray(files) || files.length === 0) return "";
  const baseApi = getBaseApi();
  const images = [];
  const pdfs = [];

  files.forEach((f) => {
    if (!f) return;
    const clean = f.split("?")[0].toLowerCase();
    const fullUrl = f.startsWith("http") ? f : (baseApi + f);
    if (clean.endsWith(".pdf")) {
      pdfs.push({ url: fullUrl, name: f.split("/").pop().split("?")[0] });
    } else {
      images.push({ url: fullUrl, name: f.split("/").pop().split("?")[0] });
    }
  });

  if (images.length === 0 && pdfs.length === 0) return "";

  let html = `
    <div class="lampiran-section" style="page-break-inside:avoid;">
      <div style="font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#222;margin-bottom:12px;">
        <i class="bi bi-images me-1"></i> Lampiran Berkas / Foto Citra Hasil:
      </div>
  `;

  if (images.length > 0) {
    html += `<div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:14px;justify-content:flex-start;">`;
    images.forEach((img) => {
      html += `
        <div style="border:1px solid #bbb;border-radius:4px;padding:6px;background:#fff;text-align:center;">
          <img src="${img.url}" style="max-height:260px;max-width:340px;object-fit:contain;display:block;margin:0 auto;border-radius:2px;" alt="${img.name}" />
          <div style="font-size:10.5px;color:#333;margin-top:5px;max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:bold;">${img.name}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (pdfs.length > 0) {
    html += `<div style="font-size:11.5px;color:#333;margin-top:10px;"><strong>Dokumen PDF Terlampir:</strong> `;
    html += pdfs.map((p) => `<span class="badge bg-light text-dark border me-1">${p.name}</span>`).join(" ");
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

export function renderLabPrintDocument(params) {
  const {
    noCheckin = "-",
    noMr = "-",
    nama = "-",
    tglLahir = "-",
    kelamin = "-",
    tglCheckin = "-",
    ruangan = "LABORATORIUM",
    dpjp = "-",
    labNamaPetugas = "-",
    labNamaDokter = "-",
    labSigPetugasImg = "",
    labSigDokterImg = "",
    testsHtml = "",
    files = []
  } = params;

  const tglFormatted = tglCheckin ? tglCheckin.split(" ")[0] : "-";
  const jamFormatted = (tglCheckin && tglCheckin.split(" ")[1]) || "-";

  const rowCount = (testsHtml.match(/<tr/gi) || []).length;
  let unfilledHeight = 340;
  if (rowCount >= 9) unfilledHeight = 120;
  else if (rowCount >= 5) unfilledHeight = 220;

  let page1 = `
    <div class="surat-document" style="box-sizing:border-box !important; padding:6mm !important; width:816px !important; min-height:1247px !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); position:relative; text-align:left; display:flex; flex-direction:column; font-family:'Times New Roman',Times,serif; font-size:11px;">
      <table class="pap-master-grid" style="border-bottom:none;">
        <colgroup>
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
        </colgroup>
        <tbody>
          ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
        </tbody>
      </table>
      <table class="pap-master-grid">
        <tbody>
          <tr>
            <td colspan="6" style="background-color:#e0e0e0; text-align:center; font-weight:bold; font-size:12.5px; padding:6px; letter-spacing:0.5px;">
              HASIL PEMERIKSAAN LABORATORIUM
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding:5px 8px; vertical-align:top;">
              <table class="pap-inner-align">
                <tr><td style="width:115px;">No. Registrasi / Lab</td><td style="width:10px;">:</td><td style="font-weight:600;">${noCheckin}</td></tr>
                <tr><td>Tanggal Registrasi</td><td>:</td><td>${tglFormatted}</td></tr>
                <tr><td>Jam Pemeriksaan</td><td>:</td><td>${jamFormatted}</td></tr>
              </table>
            </td>
            <td colspan="3" style="padding:5px 8px; vertical-align:top;">
              <table class="pap-inner-align">
                <tr><td style="width:115px;">Ruangan / Unit</td><td style="width:10px;">:</td><td>${ruangan}</td></tr>
                <tr><td>Dokter Pengirim</td><td>:</td><td style="font-weight:600;">${dpjp}</td></tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
        <colgroup>
          <col style="width: 38%;">
          <col style="width: 22%;">
          <col style="width: 18%;">
          <col style="width: 22%;">
        </colgroup>
        <thead>
          <tr style="background:#f2f2f2; text-align:center; font-weight:bold;">
            <th style="border:1px solid black; padding:5px 6px; text-align:left;">Jenis Pemeriksaan</th>
            <th style="border:1px solid black; padding:5px 6px; text-align:center;">Hasil</th>
            <th style="border:1px solid black; padding:5px 6px; text-align:center;">Satuan</th>
            <th style="border:1px solid black; padding:5px 6px; text-align:center;">Nilai Rujukan</th>
          </tr>
        </thead>
        <tbody>
          ${testsHtml}
          <tr style="height:${unfilledHeight}px;">
            <td style="border:1px solid black; vertical-align:top;"></td>
            <td style="border:1px solid black; vertical-align:top;"></td>
            <td style="border:1px solid black; vertical-align:top;"></td>
            <td style="border:1px solid black; vertical-align:top;"></td>
          </tr>
        </tbody>
      </table>
      <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
        <tbody>
          <tr style="height:130px;">
            <td colspan="3" style="text-align:center; vertical-align:top; padding:8px 10px; width:50%; border-right:1px solid black;">
              <div style="font-weight:bold; font-size:11.5px; margin-bottom:4px;">Pemeriksa Laboratorium</div>
              <div style="height:60px; display:flex; align-items:center; justify-content:center;">
                ${labSigPetugasImg || '<div style="height:50px;"></div>'}
              </div>
              <div style="font-weight:bold; font-size:11.5px; margin-top:4px;">( ${labNamaPetugas} )</div>
            </td>
            <td colspan="3" style="text-align:center; vertical-align:top; padding:8px 10px; width:50%;">
              <div style="font-weight:bold; font-size:11.5px; margin-bottom:4px;">Dokter Penanggung Jawab</div>
              <div style="height:60px; display:flex; align-items:center; justify-content:center;">
                ${labSigDokterImg || '<div style="height:50px;"></div>'}
              </div>
              <div style="font-weight:bold; font-size:11.5px; margin-top:4px;">( ${labNamaDokter} )</div>
            </td>
          </tr>
        </tbody>
      </table>
      ${footerLabel('RM.LAB/RSBHY/2026')}
    </div>
  `;

  let page2 = "";
  const validFiles = Array.isArray(files) ? files.filter(Boolean) : [];
  if (validFiles.length > 0) {
    page2 = `
      <div class="surat-document" style="box-sizing:border-box !important; padding:6mm !important; width:816px !important; min-height:1247px !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); position:relative; text-align:left; display:flex; flex-direction:column; font-family:'Times New Roman',Times,serif; font-size:11px;">
        <table class="pap-master-grid" style="border-bottom:none;">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
          </tbody>
        </table>
        <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
          <tbody>
            <tr>
              <td colspan="6" style="background-color:#e0e0e0; text-align:center; font-weight:bold; font-size:12.5px; padding:6px; letter-spacing:0.5px;">
                LAMPIRAN BERKAS / HASIL PEMERIKSAAN LABORATORIUM
              </td>
            </tr>
            <tr>
              <td colspan="6" style="padding:15px; vertical-align:top;">
                ${renderLampiranFilesPrintHtml(validFiles)}
              </td>
            </tr>
          </tbody>
        </table>
        ${footerLabel('RM.LAB/RSBHY/2026')}
      </div>
    `;
  }

  return page1 + page2;
}

export function renderRadiologiPrintDocument(params) {
  const {
    noCheckin = "-",
    noMr = "-",
    nama = "-",
    tglLahir = "-",
    kelamin = "-",
    tglCheckin = "-",
    ruangan = "RADIOLOGI",
    dpjp = "-",
    radNamaPetugas = "-",
    radNamaDokter = "-",
    radSigPetugasImg = "",
    radSigDokterImg = "",
    testsHtml = "",
    expertiseText = "",
    files = []
  } = params;

  const tglFormatted = tglCheckin ? tglCheckin.split(" ")[0] : "-";
  const jamFormatted = (tglCheckin && tglCheckin.split(" ")[1]) || "-";

  const rowCount = (testsHtml.match(/<tr/gi) || []).length;
  let unfilledBoxHeight = 380;
  if (rowCount >= 5) unfilledBoxHeight = 280;
  else if (rowCount >= 3) unfilledBoxHeight = 330;

  let page1 = `
    <div class="surat-document" style="box-sizing:border-box !important; padding:6mm !important; width:816px !important; min-height:1247px !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); position:relative; text-align:left; display:flex; flex-direction:column; font-family:'Times New Roman',Times,serif; font-size:11px;">
      <table class="pap-master-grid" style="border-bottom:none;">
        <colgroup>
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
          <col style="width: 16.66%;">
        </colgroup>
        <tbody>
          ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
        </tbody>
      </table>
      <table class="pap-master-grid">
        <tbody>
          <tr>
            <td colspan="6" style="background-color:#e0e0e0; text-align:center; font-weight:bold; font-size:12.5px; padding:6px; letter-spacing:0.5px;">
              HASIL PEMERIKSAAN RADIOLOGI
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding:5px 8px; vertical-align:top;">
              <table class="pap-inner-align">
                <tr><td style="width:115px;">No. Registrasi / Rad</td><td style="width:10px;">:</td><td style="font-weight:600;">${noCheckin}</td></tr>
                <tr><td>Tanggal Registrasi</td><td>:</td><td>${tglFormatted}</td></tr>
                <tr><td>Jam Pemeriksaan</td><td>:</td><td>${jamFormatted}</td></tr>
              </table>
            </td>
            <td colspan="3" style="padding:5px 8px; vertical-align:top;">
              <table class="pap-inner-align">
                <tr><td style="width:115px;">Ruangan / Unit</td><td style="width:10px;">:</td><td>${ruangan}</td></tr>
                <tr><td>Dokter Pengirim</td><td>:</td><td style="font-weight:600;">${dpjp}</td></tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
        <thead>
          <tr style="background:#f2f2f2; text-align:left; font-weight:bold;">
            <th style="border:1px solid black; padding:5px 6px;">Pemeriksaan</th>
          </tr>
        </thead>
        <tbody>
          ${testsHtml}
        </tbody>
      </table>
      <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
        <tbody>
          <tr>
            <td style="padding:5px 8px; background:#f9f9f9; font-weight:bold; border-bottom:1px solid black;">
              Hasil Ekspertise / Catatan Klinis :
            </td>
          </tr>
          <tr>
            <td style="padding:10px 12px; height:${unfilledBoxHeight}px; vertical-align:top; white-space:pre-wrap; font-family:'Times New Roman',Times,serif; font-size:12px; line-height:1.6;">
              ${expertiseText || ''}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
        <tbody>
          <tr style="height:130px;">
            <td colspan="3" style="text-align:center; vertical-align:top; padding:8px 10px; width:50%; border-right:1px solid black;">
              <div style="font-weight:bold; font-size:11.5px; margin-bottom:4px;">Radiografer / Petugas</div>
              <div style="height:60px; display:flex; align-items:center; justify-content:center;">
                ${radSigPetugasImg || '<div style="height:50px;"></div>'}
              </div>
              <div style="font-weight:bold; font-size:11.5px; margin-top:4px;">( ${radNamaPetugas} )</div>
            </td>
            <td colspan="3" style="text-align:center; vertical-align:top; padding:8px 10px; width:50%;">
              <div style="font-weight:bold; font-size:11.5px; margin-bottom:4px;">Dokter Spesialis Radiologi</div>
              <div style="height:60px; display:flex; align-items:center; justify-content:center;">
                ${radSigDokterImg || '<div style="height:50px;"></div>'}
              </div>
              <div style="font-weight:bold; font-size:11.5px; margin-top:4px;">( ${radNamaDokter} )</div>
            </td>
          </tr>
        </tbody>
      </table>
      ${footerLabel('RM.RAD/RSBHY/2026')}
    </div>
  `;

  let page2 = "";
  const validFiles = Array.isArray(files) ? files.filter(Boolean) : [];
  if (validFiles.length > 0) {
    page2 = `
      <div class="surat-document" style="box-sizing:border-box !important; padding:6mm !important; width:816px !important; min-height:1247px !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); position:relative; text-align:left; display:flex; flex-direction:column; font-family:'Times New Roman',Times,serif; font-size:11px;">
        <table class="pap-master-grid" style="border-bottom:none;">
          <colgroup>
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
            <col style="width: 16.66%;">
          </colgroup>
          <tbody>
            ${hospitalHeaderRow(noMr, nama, tglLahir, kelamin)}
          </tbody>
        </table>
        <table class="pap-master-grid" style="border-top:none; margin-top:-1px;">
          <tbody>
            <tr>
              <td colspan="6" style="background-color:#e0e0e0; text-align:center; font-weight:bold; font-size:12.5px; padding:6px; letter-spacing:0.5px;">
                LAMPIRAN FOTO RONTGEN / CITRA HASIL RADIOLOGI
              </td>
            </tr>
            <tr>
              <td colspan="6" style="padding:15px; vertical-align:top;">
                ${renderLampiranFilesPrintHtml(validFiles)}
              </td>
            </tr>
          </tbody>
        </table>
        ${footerLabel('RM.RAD/RSBHY/2026')}
      </div>
    `;
  }

  return page1 + page2;
}

export function initLabRadTabsAndFiles(options) {
  const {
    root,
    type, // 'LAB' | 'RADIOLOGI'
    noCheckin,
    noMr,
    nama = "",
    initialFiles = [],
    onRenderPrint,
    onFilesChanged
  } = options;

  if (!root) return;

  const isLab = (type || "").toUpperCase() === "LAB";
  const uploadApiEndpoint = isLab ? "/simrsba/lab/upload-file" : "/simrsba/radiologi/upload-file";
  const deleteApiEndpoint = isLab ? "/simrsba/lab/delete-file" : "/simrsba/radiologi/delete-file";
  const labelTitle = isLab ? "Foto / Berkas Hasil Laboratorium" : "Foto Rontgen / Citra Radiologi & Dokumen";
  const labelBtn = isLab ? "Pilih / Tambah Berkas / Foto Lab" : "Pilih / Tambah Foto Rontgen / Berkas Radiologi";
  const tabPrefix = isLab ? "lab" : "rad";

  let currentFiles = Array.isArray(initialFiles) ? [...initialFiles.filter(Boolean)] : [];

  // Check if wrapper already exists
  let wrapper = root.querySelector(`#simrs-${tabPrefix}-tab-wrapper`);
  let inputPane = root.querySelector(`#${tabPrefix}-input-pane`);
  let printPane = root.querySelector(`#${tabPrefix}-print-pane`);
  let printContainer = root.querySelector(`#${tabPrefix}-print-container`);

  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = `simrs-${tabPrefix}-tab-wrapper`;
    wrapper.className = `simrs-${tabPrefix}-container mb-4`;

    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      .surat-tabs .nav-link { font-weight: 600; color: #555; font-size: 13px; }
      .surat-tabs .nav-link.active { color: #dc3545 !important; border-bottom: 2px solid #dc3545 !important; font-weight: bold; background: #fff !important; }
      .surat-tabs .nav-link:hover { color: #dc3545; }
      #${tabPrefix}-input-pane .card { border: none !important; box-shadow: none !important; background: transparent !important; }
      #${tabPrefix}-input-pane .card-body { padding: 0 !important; }
      ${getStandardGridCSS()}
    `;
    wrapper.appendChild(styleEl);

    // Tab Navigation
    const tabNav = document.createElement("ul");
    tabNav.className = "nav nav-tabs surat-tabs d-print-none";
    tabNav.setAttribute("role", "tablist");
    tabNav.style.marginBottom = "0";
    tabNav.innerHTML = `
      <li class="nav-item" role="presentation">
        <button type="button" class="nav-link active" id="${tabPrefix}-tab-btn-input" role="tab">
          <i class="bi bi-pencil-square me-1"></i>Input Data
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button type="button" class="nav-link" id="${tabPrefix}-tab-btn-print" role="tab">
          <i class="bi bi-printer me-1"></i>Print Preview
        </button>
      </li>
    `;
    wrapper.appendChild(tabNav);

    // Tab Content Container
    const tabContent = document.createElement("div");
    tabContent.className = "tab-content";
    tabContent.id = `simrs-${tabPrefix}-tab-content`;

    // Input Pane
    inputPane = document.createElement("div");
    inputPane.className = "tab-pane fade show active";
    inputPane.id = `${tabPrefix}-input-pane`;
    inputPane.setAttribute("role", "tabpanel");
    inputPane.style.cssText = "padding:15px;background:#fff;border:1px solid #dee2e6;border-top:none;border-radius:0 0 5px 5px;";

    // Print Pane
    printPane = document.createElement("div");
    printPane.className = "tab-pane fade";
    printPane.id = `${tabPrefix}-print-pane`;
    printPane.setAttribute("role", "tabpanel");
    printPane.style.display = "none";
    printPane.innerHTML = `
      <div class="surat-print-toolbar mb-3 no-print d-flex flex-wrap align-items-center justify-content-between p-2 bg-white border rounded shadow-sm mt-3" style="position:sticky; top:0; z-index:50; gap:10px;">
        <div class="d-flex gap-2 align-items-center">
          <button type="button" class="btn btn-sm btn-success surat-download-pdf-btn d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold" style="font-size:13px;">
            <i class="bi bi-file-earmark-pdf-fill"></i><span>Simpan sebagai PDF</span>
          </button>
          <button type="button" class="btn btn-sm btn-primary surat-print-btn d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold" style="font-size:13px;">
            <i class="bi bi-printer"></i><span>Cetak</span>
          </button>
        </div>
      </div>
      <div class="surat-print-bg" id="${tabPrefix}-print-container"></div>
    `;

    tabContent.appendChild(inputPane);
    tabContent.appendChild(printPane);
    wrapper.appendChild(tabContent);

    // Move existing children of root (Angular form elements) into inputPane
    const existingChildren = Array.from(root.childNodes);
    existingChildren.forEach((child) => {
      inputPane.appendChild(child);
    });

    // Create file upload section inside inputPane
    const uploadSection = document.createElement("div");
    uploadSection.id = `simrs-${tabPrefix}-upload-section`;
    uploadSection.className = "mt-4 pt-3 border-top";
    uploadSection.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <label class="fw-bold mb-0 text-dark" style="font-size:13px;">
          <i class="bi bi-paperclip me-1 text-danger"></i>${labelTitle}
        </label>
        <span id="${tabPrefix}-upload-status" class="small text-muted fw-semibold"></span>
      </div>
      <div class="d-flex align-items-center flex-wrap gap-2 mb-1">
        <input type="file" id="${tabPrefix}-input-files" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.bmp,.gif" multiple class="d-none">
        <button type="button" class="btn btn-sm btn-outline-primary" id="${tabPrefix}-btn-choose-files">
          <i class="bi bi-cloud-arrow-up me-1"></i>${labelBtn}
        </button>
        <span class="text-muted small" style="font-size:11px;">
          Mendukung banyak file sekaligus (Multiple Files). Format: Foto (JPG, PNG, WEBP, GIF, BMP) &amp; Berkas PDF.
        </span>
      </div>
      <div id="${tabPrefix}-files-preview-container" class="d-flex flex-wrap gap-2 pt-2" style="${currentFiles.length > 0 ? '' : 'display:none;'}">
        ${renderFileCardsHtml(currentFiles)}
      </div>
    `;
    inputPane.appendChild(uploadSection);

    root.appendChild(wrapper);
    printContainer = printPane.querySelector(`#${tabPrefix}-print-container`);
  } else {
    // If wrapper already exists, locate elements
    printContainer = wrapper.querySelector(`#${tabPrefix}-print-container`);
    inputPane = wrapper.querySelector(`#${tabPrefix}-input-pane`);
    printPane = wrapper.querySelector(`#${tabPrefix}-print-pane`);
  }

  // Refresh Previews and bind delete / lightbox / pdf events
  const refreshPreviews = () => {
    const previewBox = root.querySelector(`#${tabPrefix}-files-preview-container`);
    if (!previewBox) return;

    if (currentFiles.length === 0) {
      previewBox.innerHTML = "";
      previewBox.style.display = "none";
    } else {
      previewBox.innerHTML = renderFileCardsHtml(currentFiles);
      previewBox.style.display = "flex";
    }

    // Bind delete events
    previewBox.querySelectorAll(".simrs-btn-del-file").forEach((btn) => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetUrl = btn.getAttribute("data-url");
        if (!targetUrl) return;

        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        try {
          const res = await fetch(getBaseApi() + deleteApiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ noCheckin, fileUrl: targetUrl })
          });
          const json = await res.json();
          if (json && json.data && (Array.isArray(json.data.filesLab) || Array.isArray(json.data.filesRadiologi))) {
            currentFiles = isLab ? [...json.data.filesLab] : [...json.data.filesRadiologi];
          } else {
            currentFiles = currentFiles.filter((u) => u !== targetUrl);
          }
          refreshPreviews();
          showLocalToast("success", "Berkas berhasil dihapus");
          if (typeof onFilesChanged === "function") onFilesChanged(currentFiles);
          if (typeof onRenderPrint === "function" && printContainer) {
            onRenderPrint(printContainer, currentFiles);
          }
        } catch (err) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-trash"></i>';
          showLocalToast("danger", "Gagal menghapus berkas dari server");
        }
      };
    });

    // Bind PDF click events
    previewBox.querySelectorAll(".simrs-file-pdf-item").forEach((card) => {
      card.onclick = (e) => {
        if (e.target.closest(".simrs-btn-del-file") || e.target.closest("a")) return;
        const url = card.getAttribute("data-url");
        if (url) window.open(url, "_blank");
      };
    });

    // Bind Image preview click for Lightbox
    previewBox.querySelectorAll(".simrs-preview-img-wrapper").forEach((wrapperEl) => {
      wrapperEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = wrapperEl.getAttribute("data-src") || wrapperEl.querySelector("img")?.src;
        if (src) openFileLightbox(src);
      };
    });
  };

  refreshPreviews();

  // File upload input change
  const btnChoose = root.querySelector(`#${tabPrefix}-btn-choose-files`);
  const inputFiles = root.querySelector(`#${tabPrefix}-input-files`);
  const statusEl = root.querySelector(`#${tabPrefix}-upload-status`);

  if (btnChoose && inputFiles) {
    btnChoose.onclick = () => inputFiles.click();

    inputFiles.onchange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      btnChoose.disabled = true;
      btnChoose.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Mengunggah...';

      let uploadedCount = 0;
      let failedCount = 0;

      for (let idx = 0; idx < files.length; idx++) {
        const file = files[idx];
        if (statusEl) {
          statusEl.textContent = `Mengunggah ${idx + 1} dari ${files.length} file...`;
        }

        try {
          const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const payload = {
            file: base64Data,
            fileLab: base64Data,
            fileRad: base64Data,
            fileName: file.name,
            noCheckin: noCheckin,
            noMr: noMr || "",
            existingFiles: currentFiles
          };

          const res = await fetch(getBaseApi() + uploadApiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          if (json && json.data) {
            const returnedList = isLab ? json.data.filesLab : json.data.filesRadiologi;
            if (Array.isArray(returnedList) && returnedList.length > 0) {
              currentFiles = [...returnedList];
            } else if (json.data.url) {
              if (!currentFiles.includes(json.data.url)) {
                currentFiles.push(json.data.url);
              }
            }
            uploadedCount++;
            refreshPreviews();
          } else {
            failedCount++;
          }
        } catch (err) {
          failedCount++;
        }
      }

      btnChoose.disabled = false;
      btnChoose.innerHTML = `<i class="bi bi-cloud-arrow-up me-1"></i>${labelBtn}`;
      if (statusEl) statusEl.textContent = "";
      inputFiles.value = "";

      refreshPreviews();
      if (typeof onFilesChanged === "function") onFilesChanged(currentFiles);
      if (typeof onRenderPrint === "function" && printContainer) {
        onRenderPrint(printContainer, currentFiles);
      }

      if (uploadedCount > 0 && failedCount === 0) {
        showLocalToast("success", `${uploadedCount} berkas berhasil diunggah`);
      } else if (uploadedCount > 0 && failedCount > 0) {
        showLocalToast("warning", `${uploadedCount} berkas berhasil diunggah, ${failedCount} gagal`);
      } else {
        showLocalToast("danger", "Gagal mengunggah berkas");
      }
    };
  }

  // Print toolbar handlers
  const printBtn = root.querySelector(".surat-print-btn");
  if (printBtn) {
    printBtn.onclick = (e) => {
      e.preventDefault();
      forceChromePrintStyles(false);
      window.print();
    };
  }

  const downloadPdfBtn = root.querySelector(".surat-download-pdf-btn");
  if (downloadPdfBtn) {
    downloadPdfBtn.onclick = async (e) => {
      e.preventDefault();
      if (!printContainer) return;
      const origHtml = downloadPdfBtn.innerHTML;
      downloadPdfBtn.disabled = true;
      downloadPdfBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Mengunduh PDF...';
      const filename = buildSuratPdfFilename(isLab ? "HASIL_LAB" : "HASIL_RADIOLOGI", noMr, nama || "");
      try {
        await downloadSuratAsPdf(printContainer, filename, false);
        showSuccessToast("PDF berhasil diunduh: " + filename);
      } catch (err) {
        showErrorAlert("Gagal mengunduh PDF, silakan gunakan tombol Cetak");
      } finally {
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.innerHTML = origHtml;
      }
    };
  }

  // Tab switching
  const tabBtnInput = root.querySelector(`#${tabPrefix}-tab-btn-input`);
  const tabBtnPrint = root.querySelector(`#${tabPrefix}-tab-btn-print`);

  const switchTab = (tab) => {
    if (tab === "input") {
      if (inputPane) {
        inputPane.style.display = "block";
        inputPane.classList.add("show", "active");
      }
      if (printPane) {
        printPane.style.display = "none";
        printPane.classList.remove("show", "active");
      }
      if (tabBtnInput) tabBtnInput.classList.add("active");
      if (tabBtnPrint) tabBtnPrint.classList.remove("active");
    } else {
      if (inputPane) {
        inputPane.style.display = "none";
        inputPane.classList.remove("show", "active");
      }
      if (printPane) {
        printPane.style.display = "block";
        printPane.classList.add("show", "active");
      }
      if (tabBtnPrint) tabBtnPrint.classList.add("active");
      if (tabBtnInput) tabBtnInput.classList.remove("active");

      if (typeof onRenderPrint === "function" && printContainer) {
        onRenderPrint(printContainer, currentFiles);
      }
    }
  };

  if (tabBtnInput) {
    tabBtnInput.onclick = (e) => {
      e.preventDefault();
      switchTab("input");
    };
  }

  if (tabBtnPrint) {
    tabBtnPrint.onclick = (e) => {
      e.preventDefault();
      switchTab("print");
    };
  }

  // Initial render of print document so it's ready for print preview & Ctrl+P
  if (typeof onRenderPrint === "function" && printContainer) {
    onRenderPrint(printContainer, currentFiles);
  }

  return {
    getFiles: () => currentFiles,
    setFiles: (f) => {
      currentFiles = Array.isArray(f) ? [...f.filter(Boolean)] : [];
      refreshPreviews();
      if (typeof onRenderPrint === "function" && printContainer) {
        onRenderPrint(printContainer, currentFiles);
      }
    },
    refreshPreviews,
    switchTab
  };
}
