(function () {
  'use strict';

  if (window.__billingFormInitialized) return;
  window.__billingFormInitialized = true;

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal menyimpan urutan baris dan mode group billing farmasi
  const billingRowSnapshots = new WeakMap();
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menyimpan urutan baris dan mode group billing farmasi

  const billingStyle = document.createElement('style');
  billingStyle.textContent = `
    app-pel-igd-checkout table,
    app-pel-poli-checkout table,
    app-pel-inap-checkout table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    app-pel-igd-checkout table tbody td,
    app-pel-poli-checkout table tbody td,
    app-pel-inap-checkout table tbody td {
      padding: .65rem .75rem;
      border-bottom: 1px solid #e8edf1;
      color: #314554;
      line-height: 1.45;
      text-align: justify;
      vertical-align: middle;
    }
    app-pel-igd-checkout table thead th,
    app-pel-poli-checkout table thead th,
    app-pel-inap-checkout table thead th {
      padding: .75rem;
      border-bottom: 2px solid #b8c8d6;
      background: linear-gradient(135deg, #eef5f9, #e3edf3);
      color: #29485d;
      font-size: .76rem;
      font-weight: 700;
      letter-spacing: .04em;
      text-align: justify;
      text-transform: uppercase;
      vertical-align: middle;
    }
    app-pel-igd-checkout table tbody tr:hover,
    app-pel-poli-checkout table tbody tr:hover,
    app-pel-inap-checkout table tbody tr:hover {
      background: #f8fbfd;
    }
    app-pel-igd-checkout table tbody tr:last-child td,
    app-pel-poli-checkout table tbody tr:last-child td,
    app-pel-inap-checkout table tbody tr:last-child td {
      border-bottom: 0;
    }
    app-pel-igd-checkout table tbody td:first-child,
    app-pel-poli-checkout table tbody td:first-child,
    app-pel-inap-checkout table tbody td:first-child {
      color: #29485d;
      font-weight: 600;
    }
    app-pel-igd-checkout table td:last-child,
    app-pel-igd-checkout table th:last-child,
    app-pel-poli-checkout table td:last-child,
    app-pel-poli-checkout table th:last-child,
    app-pel-inap-checkout table td:last-child,
    app-pel-inap-checkout table th:last-child {
      width: 1%;
      padding-right: 0 !important;
      text-align: right !important;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    app-pel-igd-checkout table tr:last-child td,
    app-pel-poli-checkout table tr:last-child td,
    app-pel-inap-checkout table tr:last-child td {
      border-top: 2px solid #9ccdb1;
      background: #e8f7ef;
      color: #155b3b;
      font-weight: 700;
    }
    app-list-rincian-farmasi table,
    .billing-service-table {
      width: 100%;
      table-layout: auto;
      margin: 0 0 1rem;
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
      border: 1px solid #dce3ea;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 3px 12px rgba(31, 45, 61, .06);
      color: #263746;
      font-size: .9rem;
    }
    app-list-rincian-farmasi table thead th,
    .billing-service-table thead th {
      padding: .7rem .75rem;
      border-bottom: 2px solid #b8c8d6;
      background: linear-gradient(135deg, #eef5f9, #e3edf3);
      color: #29485d;
      font-size: .76rem;
      font-weight: 700;
      letter-spacing: .04em;
      text-transform: uppercase;
      vertical-align: middle;
    }
    app-list-rincian-farmasi table tbody td,
    .billing-service-table tbody td {
      padding: .62rem .75rem;
      border-bottom: 1px solid #edf1f4;
      vertical-align: middle;
    }
    app-list-rincian-farmasi table tbody tr:not(.billing-medicine-group):not(.billing-group-subtotal):not(.billing-total-farmasi):hover,
    .billing-service-table tbody tr:hover {
      background: #f8fbfd;
    }
    app-list-rincian-farmasi table tbody tr:last-child td,
    .billing-service-table tbody tr:last-child td {
      border-bottom: 0;
    }
    app-list-rincian-farmasi .billing-medicine-group td {
      padding: .58rem .75rem;
      border-top: 1px solid #cbd9e3;
      border-bottom: 1px solid #cbd9e3;
      background: #eaf3f8 !important;
      color: #1f5878;
      font-size: .78rem;
      letter-spacing: .05em;
      text-transform: uppercase;
    }
    app-list-rincian-farmasi .billing-group-subtotal td {
      padding-top: .7rem;
      padding-bottom: .7rem;
      background: #fafcfd;
      color: #000;
      font-size: .84rem;
      font-weight: 700;
      border-bottom: 1px solid #dce5eb;
    }
    app-list-rincian-farmasi .billing-total-farmasi td {
      padding-top: .85rem;
      padding-bottom: .85rem;
      background: linear-gradient(135deg, #e8f7ef, #dff2e9);
      color: #155b3b;
      font-size: .94rem;
      border-top: 2px solid #9ccdb1;
      border-bottom: 0;
    }
    app-list-rincian-farmasi .billing-chronic-row td {
      background: #fffdf7;
    }
    app-list-rincian-farmasi .billing-chronic-row td:nth-child(3),
    app-list-rincian-farmasi table tbody td:nth-child(4),
    app-list-rincian-farmasi table tbody td:nth-child(5) {
      font-variant-numeric: tabular-nums;
    }
    app-list-rincian-farmasi table th:nth-child(5),
    app-list-rincian-farmasi table td:nth-child(5),
    .billing-service-table th:last-child,
    .billing-service-table td:last-child {
      width: 1% !important;
      padding-right: 0 !important;
      text-align: right !important;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    app-list-rincian-farmasi table th:nth-child(6),
    app-list-rincian-farmasi table td:nth-child(6) {
      display: none;
    }
    app-list-rincian-farmasi .billing-group-subtotal td:nth-child(5),
    app-list-rincian-farmasi .billing-total-farmasi td:nth-child(5) {
      width: 1% !important;
      padding-right: 0 !important;
      text-align: right !important;
      white-space: nowrap;
    }
    app-list-rincian-farmasi .billing-group-subtotal td:last-child,
    app-list-rincian-farmasi .billing-total-farmasi td:last-child {
      width: 1% !important;
      padding-right: 0 !important;
      text-align: right !important;
      white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    @media (max-width: 768px) {
      app-list-rincian-farmasi table {
        font-size: .82rem;
      }
      app-list-rincian-farmasi table thead th,
      app-list-rincian-farmasi table tbody td {
        padding: .5rem .45rem;
      }
    }
  `;
  document.head.appendChild(billingStyle);

  function getApiBaseUrl() {
    const configuredUrl = window.__APP_CONFIG__?.apiUrl || window.__ENV__?.apiUrl;
    return (configuredUrl || (window.location.hostname === 'localhost'
      ? 'http://localhost:1822'
      : 'http://36.66.36.106:1822')).replace(/\/$/, '');
  }

  function getNoCheckin(host) {
    const params = new URLSearchParams(window.location.search);
    const fromParams = params.get('nocheckin') || params.get('noCheckin') || params.get('checkin');
    if (fromParams) return fromParams;

    const fromHost = host?.noCheckin || host?.getAttribute('noCheckin') || host?.getAttribute('nocheckin');
    if (fromHost) return String(fromHost);

    const node = document.querySelector('[data-no-checkin], #noCheckin, #spd-noCheckin');
    const fromDom = node?.value || node?.getAttribute('data-no-checkin') || node?.textContent;
    if (fromDom && String(fromDom).trim() && String(fromDom).trim() !== '-') {
      return String(fromDom).trim().match(/\d{3,}/)?.[0] || String(fromDom).trim();
    }

    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const namedIndex = pathParts.findIndex((part) => part.toLowerCase() === 'nocheckin');
    if (namedIndex >= 0 && pathParts[namedIndex + 1]) return pathParts[namedIndex + 1];
    return pathParts.find((part) => /^\d{4,}$/.test(part)) || '';
  }

  function isChronic(item) {
    return item?.kronis === true || item?.kronis === 'true' ||
      item?.kronis === 1 || item?.kronis === '1';
  }

  function getItems(payload) {
    const documents = Array.isArray(payload?.data) ? payload.data :
      Array.isArray(payload) ? payload : [];
    return documents.flatMap((document) => Array.isArray(document?.obat) ? document.obat : []);
  }

  function getName(item) {
    const value = item?.nama || item?.namaObat || item?.namaobat || item?.obat;
    return Array.isArray(value) ? value.join(', ') : String(value || '').trim();
  }

  function getNumber(...values) {
    const value = values.find((candidate) => candidate !== null && candidate !== undefined);
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function formatNumber(value) {
    return getNumber(value).toLocaleString('id-ID');
  }

  function createCell(text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    if (className) cell.className = className;
    return cell;
  }

  function createGroupHeader(title) {
    const row = document.createElement('tr');
    row.className = 'billing-medicine-group';
    const cell = createCell(title);
    cell.colSpan = 6;
    cell.className = 'fw-bold bg-light';
    row.appendChild(cell);
    return row;
  }

  function parseDisplayedAmount(value) {
    const digits = String(value || '').replace(/[^\d-]/g, '');
    const amount = Number(digits);
    return Number.isFinite(amount) ? amount : 0;
  }

  function addSummaryRow(tbody, label, amount, className, before) {
    const row = document.createElement('tr');
    row.className = className;
    const labelCell = createCell(label);
    labelCell.colSpan = 4;
    labelCell.className = 'text-end fw-bold';
    row.appendChild(labelCell);
    row.appendChild(createCell(`Rp. ${formatNumber(amount)}`, 'text-end fw-bold'));
    tbody.insertBefore(row, before);
    return row;
  }

  function updateTotalRow(totalRow, amount) {
    if (!totalRow) return;
    totalRow.replaceChildren();
    totalRow.classList.add('billing-total-farmasi');
    const labelCell = createCell('TOTAL FARMASI');
    labelCell.colSpan = 4;
    labelCell.className = 'text-end fw-bold';
    totalRow.appendChild(labelCell);
    totalRow.appendChild(createCell(`Rp. ${formatNumber(amount)}`, 'text-end fw-bold'));
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal menghitung grand total dari subtotal semua rincian
  function getRenderedBillingGrandTotal(parent) {
    const sectionTables = Array.from(parent.querySelectorAll('table')).filter((table) => {
      const heading = table.querySelector('thead')?.textContent?.replace(/\s+/g, ' ').trim().toUpperCase() || '';
      return heading.includes('RINCIAN');
    });
    let grandTotal = 0;
    let foundSectionTotal = false;

    sectionTables.forEach((table) => {
      const rows = Array.from(table.querySelectorAll('tbody tr'));
      // Tabel layanan memiliki subtotal pada baris terakhir dengan dua sel; baris detail punya lebih banyak kolom.
      const totalRow = rows.slice().reverse().find((row) => {
        const cells = row.querySelectorAll(':scope > td');
        const isGrandTotalRow = Array.from(cells).some(
          (cell) => cell.textContent.trim().toUpperCase() === 'TOTAL',
        );
        return cells.length === 2 && !isGrandTotalRow;
      });
      const amountCell = totalRow?.querySelector(':scope > td:last-child');
      if (!amountCell) return;
      grandTotal += parseDisplayedAmount(amountCell.textContent);
      foundSectionTotal = true;
    });

    // Jika tabel Rincian Pelayanan tidak ditemukan karena struktur berbeda, baca subtotal eksplisitnya dari tabel layanan.
    if (!foundSectionTotal) {
      const serviceTotal = Array.from(parent.querySelectorAll('tr')).find((row) =>
        /SUBTOTAL|TOTAL/i.test(row.textContent) && row.querySelectorAll(':scope > td').length === 2,
      );
      if (serviceTotal) {
        grandTotal += parseDisplayedAmount(serviceTotal.querySelector(':scope > td:last-child')?.textContent);
        foundSectionTotal = true;
      }
    }

    return foundSectionTotal ? grandTotal : null;
  }

  function updateParentBillingTotal(host) {
    const parent = host.closest('app-pel-igd-rincian, app-pel-poli-rincian, app-pel-inap-rincian');
    if (!parent) return;

    const totalLabel = Array.from(parent.querySelectorAll('tr td[colspan="4"].h6'))
      .find((cell) => cell.textContent.trim().toUpperCase() === 'TOTAL');
    const totalCell = totalLabel?.parentElement?.querySelector('td:last-child');
    if (!totalCell) return;

    let totalState = parent.__billingGrandTotalState;
    if (!totalState) {
      totalState = { rendered: null, updating: false, observer: null };
      parent.__billingGrandTotalState = totalState;

      // Hitung ulang setelah Angular memuat/memperbarui subtotal layanan apa pun.
      totalState.observer = new MutationObserver(() => {
        if (!totalState.updating) renderParentGrandTotal(parent, totalState);
      });
      totalState.observer.observe(parent, { childList: true, characterData: true, subtree: true });
    }

    renderParentGrandTotal(parent, totalState);
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal menulis grand total keseluruhan dari tabel rincian aktual
  function renderParentGrandTotal(parent, totalState) {
    const totalLabel = Array.from(parent.querySelectorAll('tr td[colspan="4"].h6'))
      .find((cell) => cell.textContent.trim().toUpperCase() === 'TOTAL');
    const totalCell = totalLabel?.parentElement?.querySelector('td:last-child');
    if (!totalCell) return;
    totalCell.style.fontWeight = '700';
    const grandTotal = getRenderedBillingGrandTotal(parent);
    if (grandTotal === null) return;
    if (totalState.rendered === grandTotal && parseDisplayedAmount(totalCell.textContent) === grandTotal) return;

    totalState.updating = true;
    totalCell.textContent = `Rp. ${formatNumber(grandTotal)}`;
    totalState.rendered = grandTotal;
    totalCell.dataset.billingRenderedTotal = String(grandTotal);
    queueMicrotask(() => { totalState.updating = false; });
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menulis grand total keseluruhan dari tabel rincian aktual
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menghitung grand total dari subtotal semua rincian

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal kontrol grouping dan ekspor billing farmasi
  function getBillingReportRoot(host) {
    return host.closest('app-pel-igd-rincian, app-pel-poli-rincian, app-pel-inap-rincian') || host;
  }

  function getBillingExportClone(host) {
    const reportRoot = getBillingReportRoot(host);
    const reportContainer = reportRoot.querySelector(':scope > .container') || reportRoot;
    const clone = reportContainer.cloneNode(true);
    clone.querySelectorAll('.billing-controls-toolbar').forEach((toolbar) => toolbar.remove());
    clone.classList.add('billing-export-document');
    clone.querySelector('.row.justify-content-center')?.classList.add('billing-export-header');
    clone.querySelectorAll('.billing-export-header h6, .billing-export-header h4, .billing-export-header p')
      .forEach((element) => {
        const fontSize = element.matches('h4') ? '18px' : element.matches('h6') ? '15px' : '12px';
        element.style.setProperty('font-size', fontSize, 'important');
        element.style.setProperty('line-height', '1.35', 'important');
      });
    clone.querySelectorAll('tr').forEach((row) => {
      const isSummaryRow = row.classList.contains('billing-group-subtotal') ||
        row.classList.contains('billing-total-farmasi') ||
        Array.from(row.children).some((cell) => /^(?:SUBTOTAL.*|TOTAL(?: FARMASI)?)$/i.test(cell.textContent.trim()));
      if (isSummaryRow) row.classList.add('billing-export-summary-row');
    });
    const exportStyle = document.createElement('style');
    exportStyle.textContent = '.billing-export-document,.billing-export-document *{font-size:10px!important;line-height:1.25!important}.billing-export-document th,.billing-export-document td{padding:3px!important}.billing-export-document .billing-export-summary-row td{font-weight:700!important}.billing-export-document .billing-export-header h6{font-size:15px!important;line-height:1.35!important}.billing-export-document .billing-export-header h4{font-size:18px!important;line-height:1.35!important}.billing-export-document .billing-export-header p{font-size:12px!important;line-height:1.35!important}';
    clone.prepend(exportStyle);
    return clone;
  }

  function downloadBillingWord(host) {
    if (!window.JSZip) {
      window.alert('Library pembuat DOCX belum tersedia. Muat ulang halaman lalu coba kembali.');
      return;
    }
    const clone = getBillingExportClone(host);
    const headerParagraphs = [...clone.querySelectorAll('.billing-export-header h6, .billing-export-header h4, .billing-export-header p')]
      .map((element) => {
        const text = element.textContent.trim().replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character]);
        const size = element.matches('h4') ? 36 : element.matches('h6') ? 30 : 24;
        return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
      }).join('');
    const rows = [...clone.querySelectorAll('tr')].map((row) => {
      const bold = row.classList.contains('billing-export-summary-row') ? '<w:b/>' : '';
      const cells = [...row.children].map((cell) => `<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr>${bold}<w:sz w:val="18"/><w:szCs w:val="18"/></w:rPr><w:t xml:space="preserve">${String(cell.textContent || '').trim().replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[character])}</w:t></w:r></w:p></w:tc>`).join('');
      return `<w:tr>${cells}</w:tr>`;
    }).join('');
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${headerParagraphs}<w:p><w:r><w:rPr><w:b/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t>Billing Keseluruhan</w:t></w:r></w:p><w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>${rows}</w:tbl><w:sectPr><w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/><w:pgMar w:top="500" w:right="500" w:bottom="500" w:left="500"/></w:sectPr></w:body></w:document>`;
    const zip = new window.JSZip();
    zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    zip.file('word/document.xml', documentXml);
    zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing-keseluruhan-${getNoCheckin(host) || 'pasien'}.docx`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal membuat PDF untuk unduh atau pratinjau
  async function exportBillingPdf(host, previewWindow = null) {
    const clone = getBillingExportClone(host);
    if (!window.html2pdf) {
      if (previewWindow) previewWindow.close();
      printBillingDocument(host);
      return;
    }

    const pdfWorker = window.html2pdf()
      .set({
        margin: [8, 8, 8, 8],
        filename: `billing-keseluruhan-${getNoCheckin(host) || 'pasien'}.pdf`,
        image: { type: 'jpeg', quality: 0.96 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(clone);

    // diupdate oleh irwansyah tanggal 2026-09-26 - awal menampilkan PDF langsung untuk aksi Cetak
    if (previewWindow) {
      const pdfBlob = await pdfWorker.outputPdf('blob');
      previewWindow.location.href = URL.createObjectURL(pdfBlob);
      return;
    }
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menampilkan PDF langsung untuk aksi Cetak

    await pdfWorker.save();
  }

  function printBillingDocument(host) {
    const clone = getBillingExportClone(host);
    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) return;
    const stylesheets = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .map((link) => `<link rel="stylesheet" href="${link.href}">`).join('');
    printWindow.document.write(`<!doctype html><html><head><title>Billing Keseluruhan</title>${stylesheets}<style>@page{size:A4 portrait;margin:8mm}body{font:12px Arial,sans-serif}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:5px}</style></head><body>${clone.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); printWindow.close(); };
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal menjadikan Cetak sebagai pratinjau PDF billing keseluruhan
  function printBilling(host) {
    const previewWindow = window.open('about:blank', '_blank');
    if (!previewWindow) {
      window.alert('Izinkan pop-up untuk menampilkan pratinjau PDF billing.');
      return;
    }
    exportBillingPdf(host, previewWindow);
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menjadikan Cetak sebagai pratinjau PDF billing keseluruhan

  function applyBillingGrouping(host, mode) {
    const table = host.querySelector('table');
    const tbody = table?.querySelector('tbody');
    const snapshot = tbody && billingRowSnapshots.get(tbody);
    if (!tbody || !snapshot) return;
    const headers = snapshot.filter((row) => row.classList.contains('billing-medicine-group'));
    const subtotals = snapshot.filter((row) => row.classList.contains('billing-group-subtotal'));
    const totalRow = snapshot.find((row) => row.classList.contains('billing-total-farmasi'));
    const medicineRows = snapshot.filter((row) =>
      !row.classList.contains('billing-medicine-group') &&
      !row.classList.contains('billing-group-subtotal') &&
      !row.classList.contains('billing-total-farmasi'),
    );
    let rows;

    if (mode === 'nama') {
      const groups = new Map();
      medicineRows.forEach((row) => {
        const name = row.children[2]?.textContent.replace(/\s+/g, ' ').trim() || 'Nama tidak tersedia';
        const key = name.toLocaleLowerCase('id');
        if (!groups.has(key)) groups.set(key, { name, quantity: 0, amount: 0, row });
        const group = groups.get(key);
        group.quantity += parseDisplayedAmount(row.children[3]?.textContent);
        group.amount += parseDisplayedAmount(row.children[4]?.textContent);
      });
      rows = Array.from(groups.values())
        .sort((left, right) => left.name.localeCompare(right.name, 'id'))
        .map((group, index) => {
          const row = group.row.cloneNode(true);
          if (row.children[0]) row.children[0].textContent = '';
          if (row.children[1]) row.children[1].textContent = String(index + 1);
          if (row.children[3]) row.children[3].textContent = formatNumber(group.quantity);
          if (row.children[4]) row.children[4].textContent = `Rp. ${formatNumber(group.amount)}`;
          return row;
        });
    } else {
      const nonChronicHeader = headers.find((row) => row.textContent.toUpperCase().includes('NON-KRONIS'));
      const chronicHeader = headers.find((row) => row.textContent.toUpperCase().includes('KRONIS') && !row.textContent.toUpperCase().includes('NON-KRONIS'));
      const nonChronicSubtotal = subtotals.find((row) => row.textContent.toUpperCase().includes('NON-KRONIS'));
      const chronicSubtotal = subtotals.find((row) => row.textContent.toUpperCase().includes('KRONIS') && !row.textContent.toUpperCase().includes('NON-KRONIS'));
      const nonChronicRows = medicineRows.filter((row) => !row.classList.contains('billing-chronic-row'));
      const chronicRows = medicineRows.filter((row) => row.classList.contains('billing-chronic-row'));
      rows = [
        ...(nonChronicHeader ? [nonChronicHeader] : []),
        ...nonChronicRows,
        ...(nonChronicSubtotal ? [nonChronicSubtotal] : []),
        ...(chronicHeader ? [chronicHeader] : []),
        ...chronicRows,
        ...(chronicSubtotal ? [chronicSubtotal] : []),
      ];
    }

    if (totalRow) rows.push(totalRow);
    tbody.replaceChildren(...rows);
    getBillingReportRoot(host).querySelectorAll('[data-billing-group]').forEach((button) => button.classList.toggle('active', button.dataset.billingGroup === mode));
    host.dataset.billingGrouping = mode;
  }

  function ensureBillingToolbar(host, tbody) {
    const reportRoot = getBillingReportRoot(host);
    if (reportRoot.querySelector('.billing-controls-toolbar')) return;
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal memasang toolbar billing di kanan atas
    const toolbar = document.createElement('div');
    toolbar.className = 'billing-controls-toolbar d-flex justify-content-end align-items-center flex-wrap gap-2 mb-2';
    toolbar.innerHTML = `
      <div class="btn-group btn-group-sm" role="group" aria-label="Pengelompokan billing">
        <button type="button" class="btn btn-outline-secondary" data-billing-group="nama">Group by Nama</button>
        <button type="button" class="btn btn-outline-secondary d-inline-flex flex-column align-items-center" data-billing-group="jenis" aria-label="Group by Jenis Obat (Kronis/Non Kronis)">Group by Jenis Obat<span class="small">(Kronis / Non Kronis)</span></button>
      </div>
      <div class="btn-group btn-group-sm" role="group" aria-label="Ekspor billing">
        <button type="button" class="btn btn-outline-danger" data-billing-export="pdf">PDF</button>
        <button type="button" class="btn btn-outline-primary" data-billing-export="word">Word</button>
        <button type="button" class="btn btn-primary" data-billing-export="print">Cetak</button>
      </div>`;
    // Tempatkan toolbar sebelum kontainer/header agar semua bagian laporan berada di bawah kontrol.
    const reportContainer = reportRoot.querySelector(':scope > .container');
    reportRoot.insertBefore(toolbar, reportContainer || reportRoot.firstChild);
    toolbar.querySelector('[data-billing-group="nama"]').addEventListener('click', () => applyBillingGrouping(host, 'nama'));
    toolbar.querySelector('[data-billing-group="jenis"]').addEventListener('click', () => applyBillingGrouping(host, 'jenis'));
    toolbar.querySelector('[data-billing-export="pdf"]').addEventListener('click', () => exportBillingPdf(host));
    toolbar.querySelector('[data-billing-export="word"]').addEventListener('click', () => downloadBillingWord(host));
    toolbar.querySelector('[data-billing-export="print"]').addEventListener('click', () => printBilling(host));
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir memasang toolbar billing di kanan atas
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir kontrol grouping dan ekspor billing farmasi

  function renderBillingGroups(host, chronicItems) {
    const table = host.querySelector('table');
    const tbody = table?.querySelector('tbody');
    if (!tbody || tbody.dataset.billingGroupsReady === 'true') return;

    const rows = Array.from(tbody.children);
    let totalRow = rows.find((row) => row.querySelector('td[colspan="5"]')) || null;
    const nonChronicSubtotal = totalRow
      ? Array.from(totalRow.querySelectorAll('td'))
        .map((cell) => parseDisplayedAmount(cell.textContent))
        .reduce((sum, amount) => Math.max(sum, amount), 0)
      : 0;
    if (!totalRow) {
      totalRow = addSummaryRow(tbody, 'TOTAL FARMASI', 0, 'billing-total-farmasi', null);
    }
    const nonChronicHeader = createGroupHeader('OBAT NON-KRONIS');
    tbody.insertBefore(nonChronicHeader, rows[0] || totalRow);
    addSummaryRow(tbody, 'SUBTOTAL OBAT NON-KRONIS', nonChronicSubtotal, 'billing-group-subtotal', totalRow);

    let chronicSubtotal = 0;
    if (chronicItems.length) {
      const chronicHeader = createGroupHeader('OBAT KRONIS');
      const grouped = new Map();
      chronicItems.forEach((item) => {
        const name = getName(item) || 'Obat kronis';
        const quantity = getNumber(item?.jumlah, item?.count, item?.qty, item?.quantity);
        // diupdate oleh irwansyah tanggal 2026-09-26 - awal menyamakan harga obat kronis dengan tab billing kronis
        const price = getNumber(item?.hargaSatuan);
        const key = `${name}|${price}`;
        const current = grouped.get(key) || { name, quantity: 0, subtotal: 0 };
        current.quantity += quantity;
        current.subtotal += price * quantity;
        grouped.set(key, current);
      });
      // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menyamakan harga obat kronis dengan tab billing kronis

      const chronicRows = Array.from(grouped.values()).map((item, index) => {
        const row = document.createElement('tr');
        row.className = 'billing-chronic-row';
        row.appendChild(createCell(''));
        row.appendChild(createCell(String(index + 1)));
        row.appendChild(createCell(item.name));
        row.appendChild(createCell(formatNumber(item.quantity), 'text-end'));
        row.appendChild(createCell(formatNumber(item.subtotal), 'text-end'));
        return row;
      });
      chronicSubtotal = Array.from(grouped.values())
        .reduce((sum, item) => sum + item.subtotal, 0);

      const insertionPoint = totalRow || null;
      tbody.insertBefore(chronicHeader, insertionPoint);
      chronicRows.forEach((row) => tbody.insertBefore(row, insertionPoint));
      addSummaryRow(tbody, 'SUBTOTAL OBAT KRONIS', chronicSubtotal, 'billing-group-subtotal', insertionPoint);
    }

    if (totalRow) updateTotalRow(totalRow, nonChronicSubtotal + chronicSubtotal);
    else addSummaryRow(tbody, 'TOTAL FARMASI', nonChronicSubtotal + chronicSubtotal, 'billing-total-farmasi', null);
    updateParentBillingTotal(host);

    tbody.dataset.billingGroupsReady = 'true';
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal menyimpan susunan awal tabel dan menampilkan toolbar billing
    billingRowSnapshots.set(tbody, Array.from(tbody.children));
    ensureBillingToolbar(host, tbody);
    applyBillingGrouping(host, 'jenis');
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menyimpan susunan awal tabel dan menampilkan toolbar billing
  }

  function markServiceTables() {
    document.querySelectorAll(
      'app-pel-igd-checkout table, app-pel-poli-checkout table, app-pel-inap-checkout table',
    ).forEach((table) => {
      const heading = table.querySelector('thead')?.textContent?.replace(/\s+/g, ' ').trim().toUpperCase() || '';
      if (heading.includes('LAB') || heading.includes('PELAYANAN POLI') || heading.includes('RADIOLOGI')) {
        table.classList.add('billing-service-table');
      }
    });
  }

  async function enhanceBilling(host) {
    const noCheckin = getNoCheckin(host);
    if (!noCheckin) return;

    const response = await fetch(`${getApiBaseUrl()}/farmasi/print/obat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noCheckin }),
    });
    if (!response.ok) throw new Error(`Gagal mengambil resep farmasi (${response.status})`);

    const chronicItems = getItems(await response.json()).filter(isChronic);
    renderBillingGroups(host, chronicItems);
  }

  function scanBilling() {
    markServiceTables();
    document.querySelectorAll('app-list-rincian-farmasi').forEach((host) => {
      const tbody = host.querySelector('tbody');
      if (tbody?.dataset.billingGroupsReady === 'true' || host.dataset.billingGroupsLoading === 'true') return;
      host.dataset.billingGroupsLoading = 'true';
      enhanceBilling(host)
        .catch((error) => console.error('Gagal mengelompokkan billing farmasi:', error))
        .finally(() => { delete host.dataset.billingGroupsLoading; });
    });
  }

  new MutationObserver(scanBilling).observe(document.body, { childList: true, subtree: true });
  scanBilling();
})();
