function getOrCreateToastContainer() {
  let container = document.getElementById("custom-surat-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "custom-surat-toast-container";
    container.style.cssText = "position:fixed; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none;";
    document.body.appendChild(container);
  }
  return container;
}

export function showSuccessToast(title = 'Berhasil disimpan!') {
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
    return;
  }
  const container = getOrCreateToastContainer();
  const toast = document.createElement("div");
  toast.className = "custom-surat-toast";
  toast.style.cssText = "pointer-events:auto; background:#198754; color:#fff; padding:12px 20px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.2); font-family:sans-serif; font-size:14px; font-weight:600; display:flex; align-items:center; gap:10px; transition:all 0.3s ease; transform:translateY(-10px); opacity:0;";
  toast.innerHTML = `<i class="bi bi-check-circle-fill" style="font-size:18px;"></i><span>${title}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export function showErrorAlert(title = 'Gagal menyimpan data!') {
  if (typeof window !== 'undefined' && window.Swal) {
    window.Swal.fire({
      icon: 'error',
      title: 'Perhatian',
      text: title,
      confirmButtonColor: '#dc3545'
    });
    return;
  }
  const container = getOrCreateToastContainer();
  const toast = document.createElement("div");
  toast.className = "custom-surat-toast";
  toast.style.cssText = "pointer-events:auto; background:#dc3545; color:#fff; padding:12px 20px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.2); font-family:sans-serif; font-size:14px; font-weight:600; display:flex; align-items:center; gap:10px; transition:all 0.3s ease; transform:translateY(-10px); opacity:0;";
  toast.innerHTML = `<i class="bi bi-exclamation-triangle-fill" style="font-size:18px;"></i><span>${title}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
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
@media print{.no-print{display:none !important;}}
@page{size: 215.9mm 330.2mm; margin: 0;}
@page surat-landscape { size: 330.2mm 215.9mm; margin: 0; }
@media print{
  body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
  app-header, app-footer, app-sidebar, app-administrator-sidebar, simrs-patient-sidebar, .simrs-sidebar-col, .sidebar, .main-sidebar, #sidebar, #sidebar-wrapper, aside, header, footer, nav, .navbar, .surat-toolbar, .pap-tabs, .cppt-tabs, .tr-tabs, .rp-tabs, .fpo-tabs, .nav-tabs, .no-print, .d-print-none, .modal { display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; opacity: 0 !important; overflow: hidden !important; position: absolute !important; left: -9999px !important; }
  .tab-pane:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .card:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .alert:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .tab-content > *:not(:has(.surat-document)):not(:has(.surat-document-landscape)):not(:has(.surat-page)):not(:has(.surat-page-landscape)), .f-group, .form-group, .form-control, .form-select { display: none !important; }
  html, body, app-root, app-pasien-details, .content-wrapper, .container-fluid, .container, .main-content, .card:has(.surat-document), .card:has(.surat-document-landscape), .card:has(.surat-page), .card:has(.surat-page-landscape), .card-body:has(.surat-document), .card-body:has(.surat-document-landscape), .card-body:has(.surat-page), .card-body:has(.surat-page-landscape), .tab-content:has(.surat-document), .tab-content:has(.surat-page), .tab-pane:has(.surat-document), .tab-pane:has(.surat-document-landscape), .tab-pane:has(.surat-page), .tab-pane:has(.surat-page-landscape), .row, [class*="col-"]:not(.simrs-sidebar-col) { width: 100% !important; max-width: 100% !important; height: auto !important; min-height: 0 !important; max-height: none !important; overflow: visible !important; position: static !important; padding: 0 !important; margin: 0 !important; float: none !important; display: block !important; box-sizing: border-box !important; }
  .surat-print-bg { background: transparent !important; padding: 0 !important; margin: 0 !important; width: 100% !important; display: block !important; box-sizing: border-box !important; }
  .surat-document, .surat-page {box-sizing:border-box !important;width:215.9mm !important;max-width:215.9mm !important;padding: 6mm !important;overflow:hidden !important;page-break-inside:avoid !important;break-inside:avoid !important;height:330.2mm !important;box-shadow:none !important;margin:0 auto !important;page-break-after:always;break-after:page;}
  .surat-document-landscape, .surat-page-landscape {box-sizing:border-box !important;width:330.2mm !important;max-width:330.2mm !important;padding: 6mm !important;overflow:hidden !important;page-break-inside:avoid !important;break-inside:avoid !important;height:215.9mm !important;box-shadow:none !important;margin:0 auto !important;page-break-after:always;break-after:page;page:surat-landscape;}
  .surat-document:last-child, .surat-page:last-child, .surat-document-landscape:last-child, .surat-page-landscape:last-child {page-break-after:auto;}
  .pap-master-grid, table.master-grid, table.t-border, table.fpo-table, table.pap-inner-align, table { width: 100% !important; max-width: 100% !important; margin: 0 auto !important; box-sizing: border-box !important; }
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

<ul class="nav nav-tabs mb-3 ${tabsClass}" role="tablist">
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
       style="padding:20px;background:#fff;border:1px solid #ddd;border-top:none;border-radius:0 0 5px 5px;">
    ${inputContent}
  </div>

  <div class="tab-pane fade" id="${printPaneId}" role="tabpanel">
    <div class="mb-3 no-print text-start mt-3">
      <button class="btn btn-primary surat-print-btn">
        <i class="bi bi-printer me-1"></i>Cetak / PDF
      </button>
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
  const docHeight = isLandscape ? '215.9mm' : '330.2mm';

  styleEl.innerHTML = `
    @page {
      size: ${pageSize} !important;
      margin: 0mm !important;
    }
    @media print {
      @page {
        size: ${pageSize} !important;
        margin: 0mm !important;
      }
      html, body {
        width: ${docWidth} !important;
        height: ${docHeight} !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .surat-document, .surat-page {
        width: 215.9mm !important;
        height: 330.2mm !important;
        max-width: 215.9mm !important;
        max-height: 330.2mm !important;
        margin: 0 !important;
        padding: 5mm !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
      }
      .surat-document-landscape, .surat-page-landscape {
        width: 330.2mm !important;
        height: 215.9mm !important;
        max-width: 330.2mm !important;
        max-height: 215.9mm !important;
        margin: 0 !important;
        padding: 5mm !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
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

export function bindSuratPrintButton(root) {
  const btn = root.querySelector('.surat-print-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const isLandscape = !!root.querySelector('.surat-document-landscape, .surat-page-landscape');
      forceChromePrintStyles(isLandscape);
      const printTabTrigger = root.querySelector('.nav-link[id*="print"], button[id*="print"]');
      if (printTabTrigger && window.bootstrap && window.bootstrap.Tab) {
        try {
          const bsTab = window.bootstrap.Tab.getOrCreateInstance(printTabTrigger);
          bsTab.show();
        } catch (e) {}
      }
      window.print();
    });
  }
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
