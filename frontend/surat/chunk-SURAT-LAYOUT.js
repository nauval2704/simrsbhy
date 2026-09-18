export function showSuccessToast(title = 'Berhasil disimpan!') {
  if (typeof window !== 'undefined' && window.__toastr) {
    window.__toastr.success(title, 'Sukses');
    return;
  }
  if (typeof window !== 'undefined' && window.toastr) {
    window.toastr.success(title, 'Sukses');
    return;
  }
  if (typeof window !== 'undefined' && window.Swal) {
    window.Swal.fire({
      icon: 'success',
      title: title,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }
}

export function showErrorAlert(title = 'Gagal menyimpan data!') {
  if (typeof window !== 'undefined' && window.__toastr) {
    window.__toastr.error(title, 'Error');
    return;
  }
  if (typeof window !== 'undefined' && window.toastr) {
    window.toastr.error(title, 'Error');
    return;
  }
  if (typeof window !== 'undefined' && window.Swal) {
    window.Swal.fire({
      icon: 'error',
      title: 'Perhatian',
      text: title,
      confirmButtonColor: '#dc3545'
    });
  }
}

export function showConfirmDialog(title, callback) {
  if (typeof window !== 'undefined' && window.Swal) {
    window.Swal.fire({
      title: title,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed && typeof callback === 'function') {
        callback();
      }
    });
    return;
  }
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.4); z-index:999999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(2px);";
  overlay.innerHTML = `
    <div style="background:#fff; border-radius:12px; padding:24px; max-width:400px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.2); text-align:center; font-family:sans-serif;">
      <div style="font-size:36px; color:#ffc107; margin-bottom:12px;"><i class="bi bi-exclamation-circle"></i></div>
      <div style="font-size:16px; font-weight:600; color:#212529; margin-bottom:20px;">${title}</div>
      <div style="display:flex; justify-content:center; gap:12px;">
        <button id="custom-confirm-btn-cancel" class="btn btn-secondary px-3">Batal</button>
        <button id="custom-confirm-btn-ok" class="btn btn-danger px-3">Ya, Lanjutkan</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector("#custom-confirm-btn-cancel").onclick = () => overlay.remove();
  overlay.querySelector("#custom-confirm-btn-ok").onclick = () => {
    overlay.remove();
    if (typeof callback === "function") callback();
  };
}

export function getStandardGridCSS() {
  return `
.pap-page{box-sizing:border-box !important;width:100% !important;height:100% !important;padding:0 !important;position:relative;display:flex;flex-direction:column;margin:0 auto !important;}
.pap-master-grid{width:100% !important;margin:0 auto !important;border-collapse:collapse;font-size:11px;border:1px solid black;table-layout:fixed;font-family:'Times New Roman',Times,serif;box-sizing:border-box !important;}
.pap-master-grid>tbody>tr>td{border:1px solid black;padding:5px 7px;vertical-align:top;line-height:1.4;}
.pap-inner-align{width:100%;border-collapse:collapse;}
.pap-inner-align td{border:none;padding:1px 2px;vertical-align:top;}
.pap-rounded-meta-box{border:1px solid black;border-radius:10px;padding:5px;width:100%;}
.pap-cb{font-size:13px;line-height:1;margin-right:3px;vertical-align:middle;}
.pap-footer-label{position:absolute;bottom:25px;right:35px;font-size:8px;font-style:italic;}
.surat-autopage-container { width:100% !important; margin:0 auto !important; border-collapse:collapse; background:#fff; font-family:'Times New Roman',Times,serif; box-sizing:border-box !important; }
.surat-autopage-container thead { display:table-header-group; }
.surat-autopage-container tfoot { display:table-footer-group; }
.surat-autopage-container tr { page-break-inside:avoid; break-inside:avoid; }
.surat-document, .surat-page { box-sizing:border-box !important; padding: 6mm !important; width:816px !important; height:1247px !important; overflow:hidden !important; position:relative !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); text-align:left; display:flex; flex-direction:column; }
.surat-document-landscape, .surat-page-landscape { box-sizing:border-box !important; padding: 6mm !important; width:1247px !important; height:816px !important; overflow:hidden !important; position:relative !important; margin:0 auto 20px auto !important; background:#fff; box-shadow:0 0 10px rgba(0,0,0,0.1); text-align:left; display:flex; flex-direction:column; }
.surat-content{position:relative !important;height:auto !important;overflow:visible !important;padding: 6mm !important;box-sizing:border-box !important;}
.surat-print-bg{padding:20px 10px;background-color:#525659;text-align:center;border-radius:4px;overflow:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.surat-exporting-pdf, .surat-exporting-pdf * { zoom: 1 !important; -moz-transform: none !important; transform: none !important; }
.html2pdf__overlay { position: fixed !important; left: 0 !important; right: 0 !important; top: 0 !important; bottom: 0 !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background-color: #ffffff !important; background: #ffffff !important; }
.html2pdf__container { position: absolute !important; left: 0 !important; right: auto !important; top: 0 !important; bottom: auto !important; margin: 0 !important; padding: 0 !important; border: none !important; box-sizing: border-box !important; background-color: #ffffff !important; background: #ffffff !important; }
.html2pdf__container #simrs-mass-render-host { position: relative !important; left: 0 !important; top: 0 !important; margin: 0 !important; padding: 0 !important; }
.surat-exporting-pdf, .surat-print-bg.surat-exporting-pdf, .surat-exporting-pdf.surat-print-bg { background: #ffffff !important; background-color: #ffffff !important; padding: 0 !important; margin: 0 !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; width: 215.9mm !important; max-width: 215.9mm !important; box-sizing: border-box !important; }
.surat-exporting-pdf.surat-landscape, .surat-print-bg.surat-exporting-pdf.surat-landscape { width: 330.2mm !important; max-width: 330.2mm !important; }
.surat-exporting-pdf .surat-document, .surat-exporting-pdf.surat-document, .surat-exporting-pdf .surat-page, .surat-exporting-pdf.surat-page { box-sizing: border-box !important; width: 215.9mm !important; max-width: 215.9mm !important; margin: 0 !important; margin-bottom: 0 !important; padding: 5mm !important; box-shadow: none !important; overflow: hidden !important; page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: always !important; break-after: page !important; }
.surat-exporting-pdf .surat-document:last-child, .surat-exporting-pdf.surat-document:last-child, .surat-exporting-pdf .surat-page:last-child, .surat-exporting-pdf.surat-page:last-child { page-break-after: avoid !important; break-after: avoid !important; }
.surat-exporting-pdf .surat-document-landscape, .surat-exporting-pdf.surat-document-landscape, .surat-exporting-pdf .surat-page-landscape, .surat-exporting-pdf.surat-page-landscape { box-sizing: border-box !important; width: 330.2mm !important; max-width: 330.2mm !important; margin: 0 !important; margin-bottom: 0 !important; padding: 5mm !important; box-shadow: none !important; overflow: hidden !important; page-break-inside: avoid !important; break-inside: avoid !important; page-break-after: always !important; break-after: page !important; }
.surat-exporting-pdf .surat-document-landscape:last-child, .surat-exporting-pdf.surat-document-landscape:last-child, .surat-exporting-pdf .surat-page-landscape:last-child, .surat-exporting-pdf.surat-page-landscape:last-child { page-break-after: avoid !important; break-after: avoid !important; }
.surat-page-hidden { display: none !important; }
.surat-exporting-pdf .surat-page-hidden { display: flex !important; }
@media print{.no-print{display:none !important;} .surat-page-hidden { display: flex !important; } .surat-pagination-bar { display: none !important; }}
@page{size: 215.9mm 330.2mm; margin: 0;}
@page surat-landscape { size: 330.2mm 215.9mm; margin: 0; }
@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .surat-page-hidden { display: flex !important; }
  .surat-pagination-bar { display: none !important; }
  app-header, app-footer, app-sidebar, app-administrator-sidebar, simrs-patient-sidebar, .simrs-sidebar-col, .sidebar, .main-sidebar, #sidebar, #sidebar-wrapper, aside, header, footer, nav, .navbar, .surat-toolbar, .pap-tabs, .cppt-tabs, .tr-tabs, .rp-tabs, .fpo-tabs, .nav-tabs, .no-print, .d-print-none, .modal { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; opacity: 0 !important; overflow: hidden !important; position: absolute !important; left: -9999px !important; }
  .tab-pane:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .card:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .alert:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .tab-content > *:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .f-group, .form-group, .form-control, .form-select { display: none !important; }
  html, body, app-root, app-pasien-details, .content-wrapper, .container-fluid, .container, .main-content, .card:has(.surat-document), .card:has(.surat-document-landscape), .card:has(.surat-page), .card:has(.surat-page-landscape), .card-body:has(.surat-document), .card-body:has(.surat-document-landscape), .card-body:has(.surat-page), .card-body:has(.surat-page-landscape), .tab-content:has(.surat-document), .tab-content:has(.surat-page), .tab-pane:has(.surat-document), .tab-pane:has(.surat-document-landscape), .tab-pane:has(.surat-page), .tab-pane:has(.surat-page-landscape), .row, [class*="col-"]:not(.simrs-sidebar-col) { width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; position: static !important; padding: 0 !important; margin: 0 !important; float: none !important; display: block !important; box-sizing: border-box !important; }
  .surat-print-bg { background: transparent !important; padding: 0 !important; margin: 0 !important; width: 100% !important; display: block !important; box-sizing: border-box !important; }
  .surat-document, .surat-page {box-sizing:border-box !important;width:215.9mm !important;max-width:215.9mm !important;padding: 5mm !important;overflow:hidden !important;page-break-inside:avoid !important;break-inside:avoid !important;box-shadow:none !important;margin:0 auto !important;page-break-after:always;break-after:page;}
  .surat-document-landscape, .surat-page-landscape {box-sizing:border-box !important;width:330.2mm !important;max-width:330.2mm !important;padding: 5mm !important;overflow:hidden !important;page-break-inside:avoid !important;break-inside:avoid !important;box-shadow:none !important;margin:0 auto !important;page-break-after:auto !important;break-after:auto !important;page:surat-landscape;}
  .surat-document:last-child, .surat-page:last-child, .surat-document-landscape:last-child, .surat-page-landscape:last-child {page-break-after:avoid !important;break-after:avoid !important;}
  .pap-master-grid, table.master-grid, table.t-border, table.fpo-table, table.pap-inner-align, table { width: 100% !important; max-width: 100% !important; margin: 0 auto !important; box-sizing: border-box !important; }
  body.simrs-printing-mass > *:not(#simrs-mass-print-host) { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; opacity: 0 !important; overflow: hidden !important; position: absolute !important; left: -9999px !important; top: -9999px !important; }
  body.simrs-printing-mass #simrs-mass-downloader-modal, body.simrs-printing-mass .modal, body.simrs-printing-mass .modal-backdrop { display: none !important; visibility: hidden !important; opacity: 0 !important; }
  body.simrs-printing-mass app-root { display: none !important; }
  body.simrs-printing-mass #simrs-mass-print-host { display: block !important; width: 100% !important; margin: 0 auto !important; padding: 0 !important; background: transparent !important; }
  #simrs-mass-print-host:not(.has-docs) { display: none !important; }
  body.simrs-printing-mass #simrs-mass-print-host .surat-document, body.simrs-printing-mass #simrs-mass-print-host .surat-page { box-sizing: border-box !important; width: 215.9mm !important; max-width: 215.9mm !important; padding: 5mm !important; margin: 0 auto !important; box-shadow: none !important; page-break-after: always !important; break-after: page !important; page-break-inside: avoid !important; break-inside: avoid !important; }
  body.simrs-printing-mass #simrs-mass-print-host .surat-document:last-child, body.simrs-printing-mass #simrs-mass-print-host .surat-page:last-child { page-break-after: avoid !important; break-after: avoid !important; }
  body.simrs-printing-mass #simrs-mass-print-host .surat-document-landscape, body.simrs-printing-mass #simrs-mass-print-host .surat-page-landscape { box-sizing: border-box !important; width: 330.2mm !important; max-width: 330.2mm !important; padding: 5mm !important; margin: 0 auto !important; box-shadow: none !important; page-break-after: always !important; break-after: page !important; page-break-inside: avoid !important; break-inside: avoid !important; page: surat-landscape !important; }
  body.simrs-printing-mass #simrs-mass-print-host .surat-document-landscape:last-child, body.simrs-printing-mass #simrs-mass-print-host .surat-page-landscape:last-child { page-break-after: avoid !important; break-after: avoid !important; }
}
`;
}

export function createSuratShell(cfg) {
  const {
    idPrefix,
    wrapperTag = '',
    inputPaneId,
    printPaneId,
    printTabId,
    tabsClass,
    extraCss = '',
    inputContent,
    printContent = '',
  } = cfg;

  return `
<style>
.${tabsClass} .nav-link{font-weight:600;color:#555;}
.${tabsClass} .nav-link.active{color:#dc3545;border-bottom-color:#dc3545;}
.f-input{border:1px solid #ccc;padding:4px;font-family:Arial;font-size:13px !important;width:100%;border-radius:3px;}
.f-group{margin-bottom:10px;}
.f-label{font-weight:bold;margin-bottom:4px;font-size:13px !important;display:block;}
${getStandardGridCSS()}
${extraCss}
</style>

<ul class="nav nav-tabs ${tabsClass}" role="tablist" style="margin-bottom:0;">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#${inputPaneId}" type="button" role="tab">
      <i class="bi bi-pencil-square me-1"></i>Input Data
    </button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#${printPaneId}" type="button" role="tab" id="${printTabId}">
      <i class="bi bi-printer me-1"></i>Print Preview
    </button>
  </li>
</ul>

<div class="tab-content">
  <div class="tab-pane fade show active" id="${inputPaneId}" role="tabpanel"
       style="padding:15px;background:#fff;border:1px solid #dee2e6;border-top:none;border-radius:0 0 5px 5px;">
    ${inputContent}
  </div>

  <div class="tab-pane fade" id="${printPaneId}" role="tabpanel">
    <div class="surat-print-toolbar mb-3 no-print d-flex flex-wrap align-items-center justify-content-between p-2 bg-white border rounded shadow-sm mt-3" style="position:sticky; top:0; z-index:50; gap:10px;">
      <div class="d-flex gap-2 align-items-center">
        <button type="button" class="btn btn-sm btn-success surat-download-pdf-btn d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold" style="font-size:13px;">
          <i class="bi bi-file-earmark-pdf-fill"></i><span>Simpan sebagai PDF</span>
        </button>
        <button type="button" class="btn btn-sm btn-primary surat-print-btn d-flex align-items-center gap-1.5 px-3 py-1.5 fw-semibold" style="font-size:13px;">
          <i class="bi bi-printer"></i><span>Cetak</span>
        </button>
      </div>
      <div class="surat-pagination-slot d-flex align-items-center gap-2" id="${idPrefix}-pagination-slot"></div>
    </div>
    <div class="surat-print-bg" id="${idPrefix}-print-container">
      ${printContent}
    </div>
  </div>
</div>
`;
}


export function forceChromePrintStyles(isLandscape = false) {
  let styleEl = document.getElementById('chrome-forced-print-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'chrome-forced-print-style';
    document.head.appendChild(styleEl);
  }
  const pageSize = isLandscape ? '330.2mm 215.9mm' : '215.9mm 330.2mm';
  const docWidth = isLandscape ? '330.2mm' : '215.9mm';

  styleEl.innerHTML = `
    @page {
      size: ${pageSize} !important;
      margin: 0mm !important;
    }
    @page surat-landscape {
      size: 330.2mm 215.9mm !important;
      margin: 0mm !important;
    }
    @media print {
      @page {
        size: ${pageSize} !important;
        margin: 0mm !important;
      }
      @page surat-landscape {
        size: 330.2mm 215.9mm !important;
        margin: 0mm !important;
      }
      html, body {
        width: ${docWidth} !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      app-root, .content-wrapper, .container-fluid, .container, .main-content, .tab-content, .tab-pane, .surat-print-bg {
        width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        overflow: visible !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .surat-print-bg {
        background: transparent !important;
        background-color: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
      .surat-document, .surat-page {
        width: 215.9mm !important;
        max-width: 215.9mm !important;
        margin: 0 auto !important;
        padding: 5mm !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
      }
      .surat-document-landscape, .surat-page-landscape {
        width: 330.2mm !important;
        max-width: 330.2mm !important;
        margin: 0 auto !important;
        padding: 5mm !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
      }
      .surat-document:last-child, .surat-page:last-child, .surat-document-landscape:last-child, .surat-page-landscape:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      .surat-page-hidden {
        display: flex !important;
      }
      .surat-pagination-bar {
        display: none !important;
      }
      body.simrs-printing-mass > *:not(#simrs-mass-print-host) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        width: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        opacity: 0 !important;
      }
      body.simrs-printing-mass #simrs-mass-downloader-modal,
      body.simrs-printing-mass .modal,
      body.simrs-printing-mass .modal-backdrop {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      body.simrs-printing-mass #simrs-mass-print-host {
        display: block !important;
        width: 100% !important;
        margin: 0 auto !important;
        padding: 0 !important;
        background: transparent !important;
      }
      body.simrs-printing-mass #simrs-mass-print-host .surat-document:last-child,
      body.simrs-printing-mass #simrs-mass-print-host .surat-page:last-child,
      body.simrs-printing-mass #simrs-mass-print-host .surat-document-landscape:last-child,
      body.simrs-printing-mass #simrs-mass-print-host .surat-page-landscape:last-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    }
  `;
}

if (typeof window !== 'undefined' && !window._suratBeforePrintBound) {
  window._suratBeforePrintBound = true;
  window.addEventListener('beforeprint', () => {
    const isLandscape = !!document.querySelector('.surat-document-landscape, .surat-page-landscape');
    forceChromePrintStyles(isLandscape);
  });
}

export function loadHtml2Pdf() {
  if (typeof window !== 'undefined' && window.html2pdf) {
    return Promise.resolve(window.html2pdf);
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "assets/js/html2pdf.bundle.min.js";
    s.onload = () => resolve(window.html2pdf);
    s.onerror = (err) => reject(err);
    document.head.appendChild(s);
  });
}

export function buildSuratPdfFilename(prefix, noMr, nama) {
  const clean = (s) => (s || '').toString().trim().replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const p = clean(prefix) || 'DOKUMEN';
  const rm = clean(noMr);
  const nm = clean(nama);
  const parts = [p];
  if (rm) parts.push(rm);
  if (nm) parts.push(nm);
  return parts.join('_') + '.pdf';
}

export async function downloadSuratAsPdf(targetElement, filename, isLandscape = false) {
  if (!targetElement) return Promise.reject(new Error("Target element not found"));

  const h2p = await loadHtml2Pdf();

  const docs = Array.from(targetElement.querySelectorAll('.surat-document, .surat-document-landscape, .surat-page, .surat-page-landscape'));
  const isTargetDoc = targetElement.classList.contains('surat-document') ||
                      targetElement.classList.contains('surat-page') ||
                      targetElement.classList.contains('surat-document-landscape') ||
                      targetElement.classList.contains('surat-page-landscape');

  const captureEl = (isTargetDoc || docs.length !== 1) ? targetElement : docs[0];

  const origTargetStyles = {
    bg: targetElement.style.background,
    bgColor: targetElement.style.backgroundColor,
    padding: targetElement.style.padding,
    margin: targetElement.style.margin,
    boxShadow: targetElement.style.boxShadow,
    borderRadius: targetElement.style.borderRadius,
    width: targetElement.style.width,
    maxWidth: targetElement.style.maxWidth,
    boxSizing: targetElement.style.boxSizing
  };

  targetElement.style.setProperty("background", "#ffffff", "important");
  targetElement.style.setProperty("background-color", "#ffffff", "important");
  targetElement.style.setProperty("padding", "0", "important");
  targetElement.style.setProperty("margin", "0", "important");
  targetElement.style.setProperty("box-shadow", "none", "important");
  targetElement.style.setProperty("border-radius", "0", "important");
  targetElement.style.setProperty("width", isLandscape ? "330.2mm" : "215.9mm", "important");
  targetElement.style.setProperty("max-width", isLandscape ? "330.2mm" : "215.9mm", "important");
  targetElement.style.setProperty("box-sizing", "border-box", "important");

  const docOrigStyles = [];
  const targetDocList = isTargetDoc ? [targetElement] : (docs.length > 0 ? docs : [targetElement]);
  const hiddenDocsForPdf = docs.filter(d => d.classList.contains('surat-page-hidden'));
  hiddenDocsForPdf.forEach(d => d.classList.remove('surat-page-hidden'));
  targetDocList.forEach((d, idx) => {
    docOrigStyles.push({
      margin: d.style.margin,
      boxShadow: d.style.boxShadow,
      width: d.style.width,
      maxWidth: d.style.maxWidth,
      padding: d.style.padding,
      zoom: d.style.zoom,
      boxSizing: d.style.boxSizing,
      pageBreakAfter: d.style.pageBreakAfter,
      breakAfter: d.style.breakAfter
    });
    d.style.setProperty("margin", "0", "important");
    d.style.setProperty("box-shadow", "none", "important");
    d.style.setProperty("box-sizing", "border-box", "important");
    d.style.setProperty("width", isLandscape ? "330.2mm" : "215.9mm", "important");
    d.style.setProperty("max-width", isLandscape ? "330.2mm" : "215.9mm", "important");
    d.style.setProperty("padding", "5mm", "important");
    d.style.setProperty("zoom", "1", "important");
    if (idx < targetDocList.length - 1) {
      d.style.setProperty("page-break-after", "always", "important");
      d.style.setProperty("break-after", "page", "important");
    } else {
      d.style.setProperty("page-break-after", "avoid", "important");
      d.style.setProperty("break-after", "avoid", "important");
    }
  });

  captureEl.classList.add("surat-exporting-pdf");
  if (isLandscape) captureEl.classList.add("surat-landscape");

  const imgs = Array.from(captureEl.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if (typeof img.decode === "function") {
        return img.decode().catch(() => {});
      }
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 800);
      });
    })
  );

  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {}
  }

  const docWidthMm = isLandscape ? 330.2 : 215.9;
  const docWidthPx = Math.round((docWidthMm / 25.4) * 96);

  const opt = {
    margin: [0, 0, 0, 0],
    filename: filename || "dokumen.pdf",
    image: { type: "jpeg", quality: 1.0 },
    html2canvas: {
      scale: 3,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      windowWidth: docWidthPx,
      backgroundColor: "#ffffff",
      letterRendering: true
    },
    jsPDF: {
      unit: "mm",
      format: isLandscape ? [330.2, 215.9] : [215.9, 330.2],
      orientation: isLandscape ? "landscape" : "portrait"
    },
    pagebreak: {
      mode: ["css", "legacy"]
    }
  };

  try {
    return await h2p().set(opt).from(captureEl).save();
  } finally {
    hiddenDocsForPdf.forEach(d => d.classList.add('surat-page-hidden'));
    captureEl.classList.remove("surat-exporting-pdf");
    if (isLandscape) captureEl.classList.remove("surat-landscape");

    targetElement.style.background = origTargetStyles.bg;
    targetElement.style.backgroundColor = origTargetStyles.bgColor;
    targetElement.style.padding = origTargetStyles.padding;
    targetElement.style.margin = origTargetStyles.margin;
    targetElement.style.boxShadow = origTargetStyles.boxShadow;
    targetElement.style.borderRadius = origTargetStyles.borderRadius;
    targetElement.style.width = origTargetStyles.width;
    targetElement.style.maxWidth = origTargetStyles.maxWidth;
    targetElement.style.boxSizing = origTargetStyles.boxSizing;

    targetDocList.forEach((d, idx) => {
      const s = docOrigStyles[idx];
      if (s) {
        d.style.margin = s.margin;
        d.style.boxShadow = s.boxShadow;
        d.style.width = s.width;
        d.style.maxWidth = s.maxWidth;
        d.style.padding = s.padding;
        d.style.zoom = s.zoom;
        d.style.boxSizing = s.boxSizing;
        d.style.pageBreakAfter = s.pageBreakAfter;
        d.style.breakAfter = s.breakAfter;
      }
    });
  }
}

export function bindSuratPrintButton(root, pdfConfig = {}) {
  const printBtn = root.querySelector('.surat-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const isLandscape = !!root.querySelector('.surat-document-landscape, .surat-page-landscape');
      forceChromePrintStyles(isLandscape);
      const printTabTrigger = root.querySelector('.nav-link[id*="print"], button[id*="print"]');
      if (printTabTrigger && window.bootstrap && window.bootstrap.Tab) {
        try {
          const bsTab = window.bootstrap.Tab.getOrCreateInstance(printTabTrigger);
          bsTab.show();
        } catch (e) {}
      }
      const hiddenDocs = Array.from(root.querySelectorAll('.surat-page-hidden'));
      hiddenDocs.forEach(el => el.classList.remove('surat-page-hidden'));
      window.print();
      setTimeout(() => {
        hiddenDocs.forEach(el => el.classList.add('surat-page-hidden'));
      }, 1000);
    });
  }

  const downloadBtns = root.querySelectorAll('.surat-download-pdf-btn');
  downloadBtns.forEach((downloadBtn) => {
    downloadBtn.addEventListener('click', () => {
      const printTabTrigger = root.querySelector('.nav-link[id*="print"], button[id*="print"]');
      if (printTabTrigger) {
        printTabTrigger.click();
        if (window.bootstrap && window.bootstrap.Tab) {
          try {
            const bsTab = window.bootstrap.Tab.getOrCreateInstance(printTabTrigger);
            bsTab.show();
          } catch (e) {}
        }
      }

      setTimeout(() => {
        const container = root.querySelector('.surat-print-bg') || root.querySelector('[id*="-print-container"]');
        if (!container) return;

        const isLandscape = !!root.querySelector('.surat-document-landscape, .surat-page-landscape');
        const filename = pdfConfig.filename || (typeof pdfConfig.getFilename === 'function' ? pdfConfig.getFilename() : 'dokumen.pdf');

        const origHtml = downloadBtn.innerHTML;
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Mengunduh PDF...';

        downloadSuratAsPdf(container, filename, isLandscape)
          .then(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i>Tersimpan!';
            showSuccessToast("PDF berhasil diunduh: " + filename);
            setTimeout(() => {
              downloadBtn.innerHTML = origHtml;
            }, 2500);
          })
          .catch(() => {
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = origHtml;
            showErrorAlert("Gagal mengunduh PDF, silakan gunakan tombol Cetak");
          });
      }, 200);
    });
  });
}


export function suratDocumentWrapper(innerHtml) {
  return `<div class="surat-document" style="width:816px;min-height:1247px;background:#fff;margin:0 auto 20px auto;padding:0;box-shadow:0 0 10px rgba(0,0,0,0.1);text-align:left;font-size:12px;font-family:'Times New Roman',Times,serif;position:relative;"><div class="pap-page">${innerHtml}</div></div>`;
}


export function hospitalHeaderTableRow(noMr, nama, tglLahir, kelamin) {
  return `
<tr>
  <td colspan="1" style="text-align:center;vertical-align:middle;">
    <img src="assets/img/1.png" style="max-width:75px;max-height:75px;object-fit:contain;" alt="Logo">
  </td>
  <td colspan="3" style="vertical-align:middle;padding-left:10px;">
    <strong>RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong><br>
    Jl. Cut Nyak Dhien No. 23<br>
    Lamteumen Barat, Banda Aceh<br>
    Telp. 0651-41355, 0651-41470
  </td>
  <td colspan="2" style="vertical-align:middle;">
    <div class="pap-rounded-meta-box">
      <table class="pap-inner-align">
        <tr><td style="width:65px;">NRM</td><td style="width:10px;">:</td><td>${noMr}</td></tr>
        <tr><td>Nama</td><td>:</td><td>${nama}</td></tr>
        <tr><td>Tgl Lahir</td><td>:</td><td>${tglLahir}</td></tr>
        <tr><td>Jenis Kelamin</td><td>:</td><td>${kelamin}</td></tr>
      </table>
    </div>
  </td>
</tr>
`;
}


export function signatureFooterRows(opts) {
  const o = opts || {};
  const label1 = o.label1 !== undefined ? o.label1 : 'Keluarnya Pasien';
  const label2 = o.label2 !== undefined ? o.label2 : 'Perawat/Bidan';
  const label3 = o.label3 !== undefined ? o.label3 : 'Dokter';
  const id1 = o.id1 !== undefined ? o.id1 : 'p-keluar-pasien';
  const id2 = o.id2 !== undefined ? o.id2 : 'p-perawat';
  const id3 = o.id3 !== undefined ? o.id3 : 'p-dokter';
  const span = o.colSpan !== undefined ? o.colSpan : 2;
  return `
<tr style="height:160px;">
  <td colspan="${span}" style="border-top:none;border-right:none;text-align:center;vertical-align:top;padding-top:5px;">
    <div style="margin-bottom:75px;">${label1}</div>
    <div>( &nbsp;<span id="${id1}"></span>&nbsp; )</div>
  </td>
  <td colspan="${span}" style="border-top:none;border-left:none;border-right:none;text-align:center;vertical-align:top;padding-top:5px;">
    <div style="margin-bottom:75px;">${label2}</div>
    <div>( &nbsp;<span id="${id2}"></span>&nbsp; )</div>
  </td>
  <td colspan="${span}" style="border-top:none;border-left:none;text-align:center;vertical-align:top;padding-top:5px;">
    <div style="margin-bottom:75px;">${label3}</div>
    <div>( &nbsp;<span id="${id3}"></span>&nbsp; )</div>
  </td>
</tr>
`;
}


export function footerLabel(code) {
  const c = code !== undefined ? code : '005/RMBHY/2026';
  return `<div class="pap-footer-label">${c}</div>`;
}


export function hospitalHeaderRow(noMr, nama, tglLahir, kelamin, getFontSize) {
  const fs = getFontSize !== undefined ? getFontSize : function(v) { return (v && v.length > 20) ? 9 : 11; };
  return `
<tr>
  <td colspan="6" style="padding:5px;">
    <table class="pap-inner-align">
      <tr>
        <td style="width:15%;text-align:center;vertical-align:middle;">
          <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
        </td>
        <td style="width:45%;vertical-align:middle;text-align:center;">
          <strong style="font-size:12px;">RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong><br>
          <span style="font-size:10px;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>Barat, Banda Aceh Telp. 0651-41355, 0651-41470</span>
        </td>
        <td style="width:40%;vertical-align:middle;padding:2px;">
          <div class="pap-rounded-meta-box">
            <table class="pap-inner-align">
              <tr><td style="width:80px;">NRM</td><td style="width:10px;">:</td><td style="font-size:${fs(noMr)}px !important">${noMr}</td></tr>
              <tr><td>Nama</td><td>:</td><td style="font-size:${fs(nama)}px !important">${nama}</td></tr>
              <tr><td>Tgl. Lahir</td><td>:</td><td>${tglLahir}</td></tr>
              <tr><td>Jenis Kelamin</td><td>:</td><td>${kelamin}</td></tr>
            </table>
          </div>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

export function hospitalHeaderDiv(noMr, nama, tglLahir, kelamin, getFontSize = (s)=>11, title = '') {
  const titleHtml = title ? `<div style="box-sizing:border-box; width:100%; text-align:center;font-weight:bold !important;font-size:14px !important;padding:6px;border:2px solid black;border-top:none;text-transform:uppercase;font-family:'Times New Roman',Times,serif;background:white;">${title}</div>` : '';
  return `
    <div style="box-sizing:border-box; width:100%; display:flex; border:2px solid black; font-family:'Times New Roman',Times,serif; background:white;">
      <div style="width:100px; padding:10px; text-align:center; display:flex; align-items:center; justify-content:center;">
        <img src="assets/img/1.png" alt="Logo" style="max-width:100%;max-height:70px;object-fit:contain;" onerror="this.style.display='none'">
      </div>
      <div style="flex:1; text-align:center; display:flex; flex-direction:column; justify-content:center; padding:10px;">
        <strong style="font-size:14px !important;">RUMAH SAKIT BHAYANGKARA<br>BANDA ACEH</strong>
        <span style="font-size:11px !important;">Jln. Cut Nyak Dhien No. 23 Lamteumen<br>Barat, Banda Aceh Telp. 0651-41355, 0651-41470</span>
      </div>
      <div style="width:240px; padding:10px; display:flex; flex-direction:column; justify-content:center;">
        <div style="border:1px solid black;border-radius:6px;padding:4px;font-size:12px !important; text-align: left;">
          <div style="display:flex;"><div style="width:75px;">NRM</div><div>: ${noMr}</div></div>
          <div style="display:flex;"><div style="width:75px;">Nama</div><div>: ${nama}</div></div>
          <div style="display:flex;"><div style="width:75px;">Tgl. Lahir</div><div>: ${tglLahir}</div></div>
          <div style="display:flex;"><div style="width:75px;">Jenis Kelamin</div><div>: ${kelamin}</div></div>
        </div>
      </div>
    </div>
    ${titleHtml}
  `;
}

export function createAutoPageSurat({ headerHtml = '', bodyHtml = '', footerHtml = '', footerLabelCode = 'RM/RSBHY/2026' }) {
  return `
    <div class="surat-document">
      <table class="surat-autopage-container">
        <thead>
          <tr>
            <td>
              ${headerHtml}
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              ${bodyHtml}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              ${footerHtml}
              <div style="height:30px;"></div>
            </td>
          </tr>
        </tfoot>
      </table>
      ${footerLabel(footerLabelCode)}
    </div>
  `;
}

export function bindSuratInputs(rootElement, formDataObject) {
    if (!rootElement || !formDataObject) return;

    const inputs = rootElement.querySelectorAll(".form-data-input");
    inputs.forEach(el => {
        el.addEventListener("input", (e) => {
            const field = e.target.dataset.field;
            if (field) formDataObject[field] = e.target.value;
        });
        el.addEventListener("change", (e) => {
            if (e.target.type === "radio" || e.target.type === "checkbox") {
                const field = e.target.dataset.field;
                if (field) formDataObject[field] = e.target.value;
            }
        });
    });

   const nestedInputs = rootElement.querySelectorAll(".input-nested");
    nestedInputs.forEach(el => {
        el.addEventListener("input", (e) => {
            const parent = e.target.dataset.parent;
            const field = e.target.dataset.field;
            if (parent && field && formDataObject[parent]) {
                formDataObject[parent][field] = e.target.value;
            }
        });
        el.addEventListener("change", (e) => {
            if (e.target.type === "radio" || e.target.type === "checkbox") {
                const parent = e.target.dataset.parent;
                const field = e.target.dataset.field;
                if (parent && field && formDataObject[parent]) {
                    formDataObject[parent][field] = e.target.value;
                }
            }
        });
    });
}

export function createMultiPageSurat(pages, footerLabelCode = 'RM/RSBHY/2026') {
  return pages.map(page => `
    <div class="surat-document" style="display: flex; flex-direction: column;">
      ${page.headerHtml ? `<div style="flex-shrink: 0;">${page.headerHtml}</div>` : ''}
      <div style="flex: 1; display: flex; flex-direction: column;">${page.bodyHtml || ''}</div>
      ${page.footerHtml ? `<div style="flex-shrink: 0;">${page.footerHtml}</div>` : ''}
      ${footerLabel(footerLabelCode)}
    </div>
  `).join('');
}

if (typeof window !== 'undefined' && !window._suratPaginationPrintHookBound) {
  window._suratPaginationPrintHookBound = true;
  let unhiddenForPrint = [];
  window.addEventListener('beforeprint', () => {
    unhiddenForPrint = Array.from(document.querySelectorAll('.surat-page-hidden'));
    unhiddenForPrint.forEach(el => el.classList.remove('surat-page-hidden'));
  });
  window.addEventListener('afterprint', () => {
    unhiddenForPrint.forEach(el => el.classList.add('surat-page-hidden'));
    unhiddenForPrint = [];
  });
}

export function setupSuratPagination(container, options = {}) {
  if (!container) return;
  const idPrefix = options.idPrefix || 'surat';
  const pages = Array.from(container.querySelectorAll('.surat-document, .surat-page, .surat-document-landscape, .surat-page-landscape'));
  const totalPages = pages.length;

  const parentPane = container.closest('.tab-pane') || container.parentElement;

  // Clean up any legacy standalone pagination bars
  if (parentPane) {
    const oldBars = parentPane.querySelectorAll(`.${idPrefix}-pagination-bar, .surat-pagination-bar`);
    oldBars.forEach((bar) => bar.remove());
  }

  // Locate the pagination slot inside the toolbar
  let slot = parentPane ? (parentPane.querySelector(`#${idPrefix}-pagination-slot`) || parentPane.querySelector('.surat-pagination-slot')) : null;

  // If slot doesn't exist yet, try to attach to the print toolbar
  if (!slot && parentPane) {
    let toolbar = parentPane.querySelector('.surat-print-toolbar') || parentPane.querySelector('.no-print:has(.surat-print-btn)');
    if (!toolbar) {
      const printBtn = parentPane.querySelector('.surat-print-btn');
      if (printBtn && printBtn.parentElement) {
        toolbar = printBtn.parentElement;
      }
    }
    if (toolbar) {
      slot = document.createElement('div');
      slot.className = 'surat-pagination-slot d-flex align-items-center gap-2 ms-auto';
      slot.id = `${idPrefix}-pagination-slot`;
      toolbar.classList.add('justify-content-between', 'align-items-center');
      toolbar.appendChild(slot);
    }
  }

  if (totalPages <= 1) {
    if (slot) slot.innerHTML = '';
    pages.forEach(p => p.classList.remove('surat-page-hidden'));
    return;
  }

  // Fallback: if no toolbar exists, build a sleek sticky unified toolbar
  if (!slot) {
    const toolbar = document.createElement('div');
    toolbar.className = `${idPrefix}-pagination-bar surat-print-toolbar no-print d-flex flex-wrap align-items-center justify-content-between p-2 mb-3 bg-white border rounded shadow-sm`;
    toolbar.style.cssText = 'position: sticky; top: 0; z-index: 50; gap: 8px;';
    slot = document.createElement('div');
    slot.className = 'surat-pagination-slot d-flex align-items-center gap-2 ms-auto';
    toolbar.appendChild(slot);
    container.parentNode.insertBefore(toolbar, container);
  }

  let currentPage = (slot._currentPage && slot._currentPage <= totalPages) ? slot._currentPage : 1;
  let viewMode = slot._viewMode || 'single';

  slot._currentPage = currentPage;
  slot._viewMode = viewMode;

  function renderBar() {
    let pillsHtml = '';
    for (let i = 1; i <= totalPages; i++) {
      const isActive = (viewMode === 'single' && i === currentPage);
      pillsHtml += `<button type="button" class="btn btn-sm ${isActive ? 'btn-primary text-white fw-bold shadow-sm' : 'btn-outline-secondary'} surat-page-pill" data-page="${i}" ${viewMode === 'all' ? 'disabled' : ''} style="min-width:28px; padding:2px 7px; font-size:11px; line-height:1.4;">${i}</button>`;
    }

    slot.innerHTML = `
      <div class="d-flex align-items-center flex-wrap gap-2">
        <!-- Compact Prev / Status / Next Control Group -->
        <div class="d-flex align-items-center bg-light border rounded px-1.5 py-0.5" style="font-size:12px;">
          <button type="button" class="btn btn-sm btn-link text-secondary p-0 px-1 prev-page-btn" ${currentPage <= 1 || viewMode === 'all' ? 'disabled style="opacity:0.3; pointer-events:none;"' : ''} title="Halaman Sebelumnya" style="text-decoration:none; line-height:1;">
            <i class="bi bi-chevron-left" style="font-size:12px;"></i>
          </button>
          <span class="px-2 text-muted" style="font-size:12px; font-weight:600; white-space:nowrap; user-select:none;">
            Hal <strong class="text-dark">${currentPage}</strong> / ${totalPages}
          </span>
          <button type="button" class="btn btn-sm btn-link text-secondary p-0 px-1 next-page-btn" ${currentPage >= totalPages || viewMode === 'all' ? 'disabled style="opacity:0.3; pointer-events:none;"' : ''} title="Halaman Berikutnya" style="text-decoration:none; line-height:1;">
            <i class="bi bi-chevron-right" style="font-size:12px;"></i>
          </button>
        </div>

        <!-- Quick Jump Pill Buttons -->
        <div class="btn-group btn-group-sm" role="group">
          ${pillsHtml}
        </div>

        <div class="vr mx-1 d-none d-sm-block" style="height:20px; opacity:0.25;"></div>

        <!-- Toggle View Mode Button -->
        <button type="button" class="btn btn-sm ${viewMode === 'all' ? 'btn-secondary text-white' : 'btn-outline-secondary'} toggle-view-btn d-flex align-items-center gap-1.5 px-2.5 py-1" style="font-size:12px; font-weight:500;" title="${viewMode === 'all' ? 'Beralih ke mode tampilan 1 halaman per lembar' : 'Tampilkan seluruh halaman berurutan ke bawah'}">
          <i class="bi ${viewMode === 'all' ? 'bi-file-earmark' : 'bi-files'}"></i>
          <span>${viewMode === 'all' ? 'Mode 1 Hal' : 'Semua Hal'}</span>
        </button>
      </div>
    `;

    pages.forEach((p, idx) => {
      if (viewMode === 'all') {
        p.classList.remove('surat-page-hidden');
      } else {
        if (idx === currentPage - 1) {
          p.classList.remove('surat-page-hidden');
        } else {
          p.classList.add('surat-page-hidden');
        }
      }
    });

    const prevBtn = slot.querySelector('.prev-page-btn');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          slot._currentPage = currentPage;
          renderBar();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }

    const nextBtn = slot.querySelector('.next-page-btn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        if (currentPage < totalPages) {
          currentPage++;
          slot._currentPage = currentPage;
          renderBar();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    }

    const pillBtns = slot.querySelectorAll('.surat-page-pill');
    pillBtns.forEach((btn) => {
      btn.onclick = () => {
        const pNum = parseInt(btn.getAttribute('data-page'), 10);
        if (pNum && pNum !== currentPage) {
          currentPage = pNum;
          slot._currentPage = currentPage;
          renderBar();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    });

    const toggleBtn = slot.querySelector('.toggle-view-btn');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        viewMode = (viewMode === 'single') ? 'all' : 'single';
        slot._viewMode = viewMode;
        renderBar();
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    }
  }

  renderBar();
}
