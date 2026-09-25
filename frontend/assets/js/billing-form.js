(function () {
  'use strict';

  if (window.__billingFormInitialized) return;
  window.__billingFormInitialized = true;

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

  function addGroupHeader(tbody, title) {
    const row = document.createElement('tr');
    row.className = 'billing-medicine-group';
    const cell = createCell(title);
    cell.colSpan = 6;
    cell.className = 'fw-bold bg-light';
    row.appendChild(cell);
    tbody.appendChild(row);
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
    const labelCell = createCell('TOTAL FARMASI');
    labelCell.colSpan = 4;
    labelCell.className = 'text-end fw-bold';
    totalRow.appendChild(labelCell);
    totalRow.appendChild(createCell(`Rp. ${formatNumber(amount)}`, 'text-end fw-bold'));
  }

  function renderBillingGroups(host, chronicItems) {
    const table = host.querySelector('table');
    const tbody = table?.querySelector('tbody');
    if (!tbody || tbody.dataset.billingGroupsReady === 'true') return;
    if (!chronicItems.length) {
      tbody.dataset.billingGroupsReady = 'true';
      return;
    }

    const rows = Array.from(tbody.children);
    const totalRow = rows.find((row) => row.querySelector('td[colspan="5"]')) || null;
    const nonChronicSubtotal = totalRow
      ? Array.from(totalRow.querySelectorAll('td'))
        .map((cell) => parseDisplayedAmount(cell.textContent))
        .reduce((sum, amount) => Math.max(sum, amount), 0)
      : 0;
    const nonChronicHeader = addGroupHeader(tbody, 'OBAT NON-KRONIS');
    tbody.insertBefore(nonChronicHeader, rows[0] || null);
    addSummaryRow(tbody, 'SUBTOTAL OBAT NON-KRONIS', nonChronicSubtotal, 'billing-group-subtotal', totalRow);

    if (chronicItems.length) {
      const chronicHeader = document.createElement('tr');
      chronicHeader.className = 'billing-medicine-group';
      const headerCell = createCell('OBAT KRONIS');
      headerCell.colSpan = 5;
      headerCell.className = 'fw-bold bg-light';
      chronicHeader.appendChild(headerCell);

      const grouped = new Map();
      chronicItems.forEach((item) => {
        const name = getName(item) || 'Obat kronis';
        const quantity = getNumber(item?.jumlah, item?.count, item?.qty, item?.quantity);
        const price = getNumber(item?.hargaJualBPJS, item?.hargaJualYANKES, item?.harga);
        const key = `${name}|${price}`;
        const current = grouped.get(key) || { name, quantity: 0, subtotal: 0 };
        current.quantity += quantity;
        current.subtotal += item?.jenis === 'RACIKAN' ? price : price * quantity;
        grouped.set(key, current);
      });

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
      const chronicSubtotal = Array.from(grouped.values())
        .reduce((sum, item) => sum + item.subtotal, 0);

      const insertionPoint = totalRow || null;
      tbody.insertBefore(chronicHeader, insertionPoint);
      chronicRows.forEach((row) => tbody.insertBefore(row, insertionPoint));
      addSummaryRow(tbody, 'SUBTOTAL OBAT KRONIS', chronicSubtotal, 'billing-group-subtotal', insertionPoint);
      if (totalRow) updateTotalRow(totalRow, nonChronicSubtotal + chronicSubtotal);
      else addSummaryRow(tbody, 'TOTAL FARMASI', chronicSubtotal, 'billing-total-farmasi', insertionPoint);
    }

    tbody.dataset.billingGroupsReady = 'true';
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
