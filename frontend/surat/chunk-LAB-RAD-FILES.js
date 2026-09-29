import { a as i } from "../chunk-W7XVFZVJ.js";

function getBaseApi() {
  if (typeof i !== "undefined" && i.apiUrl) return i.apiUrl;
  if (typeof window !== "undefined" && window.location) {
    return window.location.protocol + "//" + window.location.hostname + ":1822";
  }
  return "http://localhost:1822";
}

function showToast(type, message) {
  if (typeof window !== "undefined" && window.__toastr) {
    if (type === "success") window.__toastr.success(message, "Sukses");
    else if (type === "warning") window.__toastr.warning(message, "Peringatan");
    else window.__toastr.error(message, "Error");
    return;
  }
  const toast = document.createElement("div");
  toast.style.cssText = "position:fixed;top:20px;right:20px;z-index:999999;min-width:300px;";
  toast.innerHTML = `
    <div class="alert alert-${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'success'} shadow-lg d-flex align-items-center gap-2 py-2 px-3">
      <i class="bi bi-${type === 'success' ? 'check-circle-fill' : type === 'warning' ? 'exclamation-triangle-fill' : 'x-circle-fill'} fs-5"></i>
      <div>${message}</div>
      <button class="btn-close ms-auto" onclick="this.closest('div.alert').parentElement.remove()"></button>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
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

function renderFileCardsHtml(files) {
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
        <div class="border rounded p-2 bg-light d-flex align-items-center gap-2 position-relative simrs-file-item simrs-file-pdf-item shadow-sm" data-url="${fullUrl}" style="min-width:220px;max-width:320px;background:#f8f9fa;cursor:pointer;" title="Klik untuk membuka dokumen PDF">
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
    <div class="lampiran-section mt-4 pt-3 border-top" style="page-break-inside:avoid;">
      <div style="font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#222;margin-bottom:10px;">
        <i class="bi bi-images me-1"></i> Lampiran Berkas / Foto Citra Hasil:
      </div>
  `;

  if (images.length > 0) {
    html += `<div style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:12px;">`;
    images.forEach((img) => {
      html += `
        <div style="border:1px solid #ccc;border-radius:4px;padding:4px;background:#fff;text-align:center;">
          <img src="${img.url}" style="max-height:220px;max-width:320px;object-fit:contain;display:block;margin:0 auto;border-radius:2px;" alt="${img.name}" />
          <div style="font-size:10px;color:#666;margin-top:4px;max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${img.name}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  if (pdfs.length > 0) {
    html += `<div style="font-size:11.5px;color:#333;"><strong>Dokumen PDF Terlampir:</strong> `;
    html += pdfs.map((p) => `<span class="badge bg-light text-dark border me-1">${p.name}</span>`).join(" ");
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

export function initLabRadTabsAndFiles(options) {
  const {
    root,
    type, // 'LAB' | 'RADIOLOGI'
    noCheckin,
    noMr,
    initialFiles = [],
    onRenderPrint,
    onFilesChanged
  } = options;

  if (!root) return;

  const isLab = (type || "").toUpperCase() === "LAB";
  const uploadApiEndpoint = isLab ? "/simrsba/lab/upload-file" : "/simrsba/radiologi/upload-file";
  const deleteApiEndpoint = isLab ? "/simrsba/lab/delete-file" : "/simrsba/radiologi/delete-file";
  const labelTitle = isLab ? "Upload Berkas & Foto Hasil Laboratorium" : "Upload Foto Rontgen / Citra Radiologi & Dokumen";
  const labelBtn = isLab ? "Pilih / Tambah Berkas / Foto Lab" : "Pilih / Tambah Foto Rontgen / Berkas Radiologi";
  const tabPrefix = isLab ? "lab" : "rad";

  let currentFiles = Array.isArray(initialFiles) ? [...initialFiles.filter(Boolean)] : [];

  // 1. Setup Tab Navigation at top of root
  let tabNav = root.querySelector(`#simrs-${tabPrefix}-tab-nav`);
  if (!tabNav) {
    tabNav = document.createElement("div");
    tabNav.id = `simrs-${tabPrefix}-tab-nav`;
    tabNav.className = "mb-3 d-print-none";
    tabNav.innerHTML = `
      <ul class="nav nav-tabs surat-tabs" role="tablist" style="border-bottom: 2px solid #dee2e6;">
        <li class="nav-item" role="presentation">
          <button type="button" class="nav-link active fw-bold px-4" id="${tabPrefix}-tab-btn-input" style="font-size:14px;">
            <i class="bi bi-pencil-square me-1"></i>Input Data
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button type="button" class="nav-link fw-bold px-4" id="${tabPrefix}-tab-btn-print" style="font-size:14px;">
            <i class="bi bi-printer me-1"></i>Print Preview
          </button>
        </li>
      </ul>
    `;
    root.prepend(tabNav);
  }

  // 2. Identify Angular Input Container (the row/card containing search and order items)
  // We locate the card inside root that is NOT our upload or print container
  let angularInputEl = null;
  const cards = root.querySelectorAll(".card");
  for (let c of cards) {
    if (c.id !== `simrs-${tabPrefix}-upload-card` && c.id !== `${tabPrefix}-print-container`) {
      angularInputEl = c;
      break;
    }
  }

  // 3. Setup File Upload Section inside Input view (after angular input card)
  let uploadCard = root.querySelector(`#simrs-${tabPrefix}-upload-card`);
  if (!uploadCard) {
    uploadCard = document.createElement("div");
    uploadCard.id = `simrs-${tabPrefix}-upload-card`;
    uploadCard.className = "card mt-3 shadow-sm border";
    uploadCard.innerHTML = `
      <div class="card-header bg-light d-flex justify-content-between align-items-center py-2">
        <span class="fw-bold text-dark" style="font-size:13px;">
          <i class="bi bi-paperclip me-1 text-primary"></i>${labelTitle}
        </span>
        <span id="${tabPrefix}-upload-status" class="small text-muted fw-semibold"></span>
      </div>
      <div class="card-body py-3">
        <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
          <input type="file" id="${tabPrefix}-input-files" accept="image/*,application/pdf,.pdf,.jpg,.jpeg,.png,.webp,.bmp,.gif" multiple class="d-none">
          <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="${tabPrefix}-btn-choose-files">
            <i class="bi bi-cloud-arrow-up me-1"></i>${labelBtn}
          </button>
          <span class="text-muted small">
            Mendukung banyak file sekaligus (Multiple Files). Format: Foto (JPG, PNG, WEBP, GIF, BMP) &amp; Berkas PDF.
          </span>
        </div>
        <div id="${tabPrefix}-files-preview-container" class="d-flex flex-wrap gap-2 pt-2" style="${currentFiles.length > 0 ? '' : 'display:none;'}">
          ${renderFileCardsHtml(currentFiles)}
        </div>
      </div>
    `;

    if (angularInputEl && angularInputEl.parentElement) {
      angularInputEl.insertAdjacentElement("afterend", uploadCard);
    } else {
      root.appendChild(uploadCard);
    }
  }

  // 4. Setup Print Container
  let printContainer = root.querySelector(`#${tabPrefix}-print-container`);
  if (!printContainer) {
    printContainer = document.createElement("div");
    printContainer.id = `${tabPrefix}-print-container`;
    printContainer.className = "mt-2";
    printContainer.style.display = "none";
    root.appendChild(printContainer);
  }

  // Helper to refresh previews and bind events
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
          showToast("success", "Berkas berhasil dihapus");
          if (typeof onFilesChanged === "function") onFilesChanged(currentFiles);
        } catch (err) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-trash"></i>';
          showToast("danger", "Gagal menghapus berkas dari server");
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
    previewBox.querySelectorAll(".simrs-preview-img-wrapper").forEach((wrapper) => {
      wrapper.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = wrapper.getAttribute("data-src") || wrapper.querySelector("img")?.src;
        if (src) openFileLightbox(src);
      };
    });
  };

  refreshPreviews();

  // Bind choose files button & input change
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

      if (uploadedCount > 0 && failedCount === 0) {
        showToast("success", `${uploadedCount} berkas berhasil diunggah`);
      } else if (uploadedCount > 0 && failedCount > 0) {
        showToast("warning", `${uploadedCount} berkas berhasil diunggah, ${failedCount} gagal`);
      } else {
        showToast("danger", "Gagal mengunggah berkas");
      }
    };
  }

  // 5. Setup Tab Switching
  const tabBtnInput = root.querySelector(`#${tabPrefix}-tab-btn-input`);
  const tabBtnPrint = root.querySelector(`#${tabPrefix}-tab-btn-print`);

  const switchTab = (tab) => {
    // Re-query in case Angular created/updated cards
    let currentInputCard = null;
    const allCards = root.querySelectorAll(".card");
    for (let c of allCards) {
      if (c.id !== `simrs-${tabPrefix}-upload-card` && c.id !== `${tabPrefix}-print-container`) {
        currentInputCard = c;
        break;
      }
    }

    if (tab === "input") {
      if (currentInputCard) currentInputCard.style.display = "";
      if (uploadCard) uploadCard.style.display = "";
      if (printContainer) printContainer.style.display = "none";
      if (tabBtnInput) tabBtnInput.classList.add("active");
      if (tabBtnPrint) tabBtnPrint.classList.remove("active");
    } else {
      if (currentInputCard) currentInputCard.style.display = "none";
      if (uploadCard) uploadCard.style.display = "none";
      if (printContainer) printContainer.style.display = "block";
      if (tabBtnPrint) tabBtnPrint.classList.add("active");
      if (tabBtnInput) tabBtnInput.classList.remove("active");

      // Trigger print render callback with latest files
      if (typeof onRenderPrint === "function") {
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

  return {
    getFiles: () => currentFiles,
    setFiles: (f) => {
      currentFiles = Array.isArray(f) ? [...f.filter(Boolean)] : [];
      refreshPreviews();
    },
    refreshPreviews,
    switchTab
  };
}
