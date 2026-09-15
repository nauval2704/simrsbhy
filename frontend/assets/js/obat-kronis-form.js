(function () {
  const stockPaths = {
    APOTEK: 'apotek',
    IGD: 'igd',
    INAP: 'inap',
  };
  let currentResep = null;

  function getPageContext() {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const nocheckinIndex = pathParts.findIndex((part) => part.toLowerCase() === 'nocheckin');
    const farmasiIndex = pathParts.findIndex((part) => part.toLowerCase() === 'farmasi');
    const domNoCheckin = document.getElementById('spd-noCheckin') ||
      document.getElementById('noCheckin') ||
      document.querySelector('[data-no-checkin]');
    const domValue = domNoCheckin
      ? domNoCheckin.value || domNoCheckin.getAttribute('data-no-checkin') || domNoCheckin.textContent
      : '';
    const domNoCheckinValue = String(domValue || '').trim().match(/\d{3,}/)?.[0] || String(domValue || '').trim();
    return {
      noCheckin: params.get('nocheckin') || params.get('noCheckin') ||
        (nocheckinIndex >= 0 ? pathParts[nocheckinIndex + 1] : '') ||
        (farmasiIndex >= 0 ? pathParts[farmasiIndex + 1] : '') ||
        domNoCheckinValue,
      idPrmrj: params.get('idprmrj') || '',
    };
  }

  function getPatientMeta() {
    const params = new URLSearchParams(window.location.search);
    const patient = window.__ERESPEP_PATIENT__ || {};
    const readValue = (...selectors) => {
      for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (node?.textContent?.trim()) return node.textContent.trim();
      }
      return '';
    };

    return {
      nomorRM: patient.noMr || patient.nomorRM || params.get('norm') || readValue('[data-nomor-rm]', '[data-norm]', '[data-no-rm]', '#norm') || 'N/A',
      namaPasien: patient.nama || patient.namaPasien || params.get('nama') || readValue('[data-nama-pasien]', '[data-pasien-nama]', '.nama-pasien', '#namaPasien') || 'N/A',
      unitLayanan: patient.ruangan || patient.poli || patient.unitLayanan || readValue('[data-unit-layanan]', '.unit-layanan', '#unitLayanan') || params.get('unit') || 'N/A',
      jenisRawatan: patient.jnsPelayanan || patient.jenisRawatan || readValue('[data-jenis-rawatan]', '.jenis-rawatan', '#jenisRawatan') || params.get('jenisRawatan') || 'N/A',
      tglMasuk: patient.tglMasuk || patient.tglInput || readValue('[data-tgl-masuk]', '.tgl-masuk', '#tglMasuk') || params.get('tglMasuk') || 'N/A',
      dokter: patient.dokter || patient.dpjp || readValue('[data-dokter]', '.dokter', '#dokter') || params.get('dokter') || 'N/A',
    };
  }

  async function loadPatientMeta() {
    const { noCheckin } = getPageContext();
    const cachedPatient = window.__ERESPEP_PATIENT__ || {};
    const hasRealPatient = cachedPatient.nama && cachedPatient.nama !== 'N/A' && cachedPatient.noMr && cachedPatient.noMr !== 'N/A';
    if (!noCheckin || hasRealPatient) return;

    try {
      const response = await fetch(`${getBaseUrl()}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`);
      if (!response.ok) return;
      const payload = await response.json();
      const entry = (Array.isArray(payload) ? payload : payload?.data || [])[0] || {};
      const user = Array.isArray(entry.user) ? entry.user[0] || {} : {};
      const patient = {
        nama: entry.nama || user.nama || 'N/A',
        noMr: entry.noMr || user.norm || entry.noMR || 'N/A',
        ruangan: entry.ruangan || entry.poli || entry.unitLayanan || 'N/A',
        jnsPelayanan: entry.jnsPelayanan || entry.jenisPelayanan || 'N/A',
        tglMasuk: entry.tglInput || entry.tglMasuk || 'N/A',
        dokter: entry.dpjp || entry.dokter || user.dokter || 'N/A',
      };
      window.__ERESPEP_PATIENT__ = {
        ...patient,
        namaPasien: patient.nama,
        nomorRM: patient.noMr,
        unitLayanan: patient.ruangan,
        jenisRawatan: patient.jnsPelayanan,
        tglMasuk: patient.tglMasuk,
      };
      renderKronisBilling();
    } catch (error) {
      console.error('Gagal mengambil data pasien untuk billing obat kronis:', error);
    }
  }

  function getBaseUrl() {
    const configuredUrl =
      (window.__APP_CONFIG__ && window.__APP_CONFIG__.apiUrl) ||
      (window.__ENV__ && window.__ENV__.apiUrl) ||
      (window.location.hostname === 'localhost'
        ? 'http://localhost:1822'
        : 'http://36.66.36.106:1822');
    return configuredUrl.replace(/\/$/, '');
  }

  function getRequestHeaders() {
    let token = '';
    let secretKey = '';
    try {
      const rawAccessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      const rawUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      const storedUser = rawUser ? JSON.parse(rawUser) : null;
      token = rawAccessToken
        ? (() => {
            try { return JSON.parse(rawAccessToken); } catch (error) { return rawAccessToken; }
          })()
        : storedUser?.idToken || storedUser?.token || '';
      token = token || localStorage.getItem('idToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || '';
      secretKey =
        window.__APP_CONFIG__?.secretKey ||
        window.__ENV__?.secretKey ||
        localStorage.getItem('secretKey') ||
        sessionStorage.getItem('secretKey') ||
        '';
    } catch (error) {}

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-token': token,
      secretKey,
    };
  }

  function getCurrentUserName() {
    try {
      const rawUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (!rawUser) return 'system';
      const storedUser = JSON.parse(rawUser);
      return storedUser?.nama || storedUser?.name || 'system';
    } catch (error) {
      return 'system';
    }
  }

  function showForm() {
    const target = document.querySelector('#farmasi-tab-obat-kronis');
    if (target) {
      mountForm();
      loadPatientMeta();
      if (!currentResep) loadCurrentResep();
    }
  }

  async function loadStock(value) {
    const stockPath = stockPaths[value];
    const searchInput = document.querySelector('#obat-kronis-search');
    if (!stockPath || !searchInput) return;

    searchInput.disabled = true;
    searchInput.placeholder = 'Memuat stock...';

    try {
      const response = await fetch(`${getBaseUrl()}/farmasi/stock/${stockPath}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Gagal memuat stock (${response.status})`);

      const stockItems = await response.json();
      const items = Array.isArray(stockItems) ? stockItems : [];
      const datalist = document.querySelector('#obat-kronis-stock-options');
      if (datalist) {
        datalist.innerHTML = items
          .map((item) => `<option value="${escapeHtml(item.nama || '')}"></option>`)
          .join('');
      }
      searchInput.dataset.stockItems = JSON.stringify(items);
      searchInput.disabled = false;
      searchInput.placeholder = 'Cari Obat Kronis';
    } catch (error) {
      searchInput.disabled = false;
      searchInput.placeholder = 'Stock gagal dimuat';
      console.error('Gagal mengambil stock obat kronis:', error);
    }
  }

  async function ensureCurrentResep(noCheckin, idPrmrj) {
    if (!noCheckin) return null;

    // Pastikan resep aktif selalu ditemukan sebelum submit obat kronis.
    // Beberapa flow menghasilkan resep kosong atau response yang nested di data,
    // jadi kita perlu normalisasi payload dan retry lookup setelah create.
    const normalizeResepList = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (payload && typeof payload === 'object') {
        const nested = payload.data ?? payload.result ?? payload.items ?? payload.resep ?? payload.recipes;
        if (Array.isArray(nested)) return nested;
        if (payload && payload._id) return [payload];
      }
      return [];
    };

    const findMatchingResep = (recipeList) => {
      const isMatch = (recipe) =>
        String(recipe?.noCheckin ?? '') === String(noCheckin) &&
        (!idPrmrj || String(recipe?.idPrmrj ?? '') === String(idPrmrj));

      return recipeList.find(isMatch) || recipeList.find((recipe) =>
        String(recipe?.noCheckin ?? '') === String(noCheckin)
      ) || null;
    };

    try {
      const response = await fetch(`${getBaseUrl()}/farmasi/resep`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noCheckin, idPrmrj: idPrmrj || undefined }),
      });

      if (response.ok) {
        const responseData = await response.json().catch(() => null);
        const matchedResep = findMatchingResep(normalizeResepList(responseData));
        if (matchedResep) {
          currentResep = matchedResep;
          return currentResep;
        }
      }

      const createResponse = await fetch(`${getBaseUrl()}/farmasi/add/resep`, {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify({
          noCheckin,
          idPrmrj: idPrmrj || undefined,
          user: getCurrentUserName(),
        }),
      });

      if (!createResponse.ok) {
        const createError = await createResponse.json().catch(() => null);
        throw new Error(createError?.message || `Gagal membuat resep (${createResponse.status})`);
      }

      const createdPayload = await createResponse.json().catch(() => null);
      const createdRecipeList = normalizeResepList(createdPayload);
      const createdResep = findMatchingResep(createdRecipeList) ||
        (createdPayload && typeof createdPayload === 'object' && createdPayload.data && typeof createdPayload.data === 'object' && createdPayload.data._id ? createdPayload.data : null) ||
        (createdPayload && typeof createdPayload === 'object' && createdPayload._id ? createdPayload : null);

      if (createdResep) {
        currentResep = createdResep;
        return currentResep;
      }

      const retryResponse = await fetch(`${getBaseUrl()}/farmasi/resep`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noCheckin, idPrmrj: idPrmrj || undefined }),
      });

      if (retryResponse.ok) {
        const retryData = await retryResponse.json().catch(() => null);
        const retryResep = findMatchingResep(normalizeResepList(retryData));
        if (retryResep) {
          currentResep = retryResep;
          return currentResep;
        }
      }

      return null;
    } catch (error) {
      console.error('Gagal memastikan resep aktif:', error);
      currentResep = null;
      return null;
    }
  }

  async function loadCurrentResep() {
    const { noCheckin, idPrmrj } = getPageContext();
    if (!noCheckin) return;

    currentResep = null;
    currentResep = await ensureCurrentResep(noCheckin, idPrmrj);
    renderChronicTable();
  }

  function getSelectedStock() {
    const searchInput = document.querySelector('#obat-kronis-search');
    const stockItems = JSON.parse(searchInput?.dataset.stockItems || '[]');
    return stockItems.find((item) => item.nama === searchInput?.value);
  }

  function getKronisBillingRows() {
    const chronicItems = (currentResep?.obat || []).filter((item) => item.kronis === true);
    return chronicItems.map((item, index) => ({
      no: index + 1,
      nama: Array.isArray(item.nama) ? item.nama.join(', ') : item.nama || '-',
      qty: Number(item.jumlah ?? 0),
      harga: Number(item.hargaSatuan || 0),
      subtotal: Number(item.jumlah || 0) * Number(item.hargaSatuan || 0),
      tanggal: item.createdAt || '-',
      keterangan: item.deskripsi || 'Obat kronis',
    }));
  }

  function buildKronisHospitalHeader() {
    const logoUrl = new URL('assets/img/logorsba.png', document.baseURI).href;
    const rightLogoUrl = new URL('assets/img/bygkara1.png', document.baseURI).href;
    return `
      <div class="kronis-hospital-header" style="display:flex;align-items:center;gap:16px;border-bottom:2px solid #000;padding:0 0 10px;margin-bottom:12px;text-align:center;">
        <img src="${logoUrl}" alt="Logo RS Bhayangkara" style="width:58px;height:76px;object-fit:contain;flex:0 0 auto;">
        <div style="flex:1;line-height:1.25;">
          <div style="font-size:18px;font-weight:700;">RS BHAYANGKARA BANDA ACEH</div>
          <div style="font-size:12px;">Jl. Cut Nyak Dhien No.23 Lamteumen Barat - Banda Aceh</div>
          <div style="font-size:12px;">Telp (0651) 41470 - 41355, Fax. (0651) 41253</div>
        </div>
        <img src="${rightLogoUrl}" alt="Logo Bhayangkara" style="width:58px;height:76px;object-fit:contain;flex:0 0 auto;">
      </div>
    `;
  }

  function buildKronisBillingTable(rows) {
    return `
      <table class="table table-sm mb-3 align-middle" id="kronis-billing-table-export" style="border-collapse:collapse;border:1px solid #000;">
        <thead class="table-light">
          <tr>
            <th style="border:1px solid #000;">#</th>
            <th style="border:1px solid #000;">Nama Obat</th>
            <th style="border:1px solid #000;">Tgl</th>
            <th style="border:1px solid #000;">Keterangan</th>
            <th style="border:1px solid #000;">Qty</th>
            <th style="border:1px solid #000;">Harga</th>
            <th style="border:1px solid #000;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td style="border:1px solid #000;">${row.no}</td>
              <td style="border:1px solid #000;">${escapeHtml(row.nama)}</td>
              <td style="border:1px solid #000;">${escapeHtml(row.tanggal)}</td>
              <td style="border:1px solid #000;">${escapeHtml(row.keterangan)}</td>
              <td style="border:1px solid #000;">${escapeHtml(row.qty)}</td>
              <td style="border:1px solid #000;">Rp. ${row.harga.toLocaleString('id-ID')}</td>
              <td style="border:1px solid #000;">Rp. ${row.subtotal.toLocaleString('id-ID')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  function exportKronisBillingToExcel(rows) {
    const { noCheckin } = getPageContext();
    const patient = getPatientMeta();
    const logoUrl = new URL('assets/img/logorsba.png', document.baseURI).href;
    const rightLogoUrl = new URL('assets/img/bygkara1.png', document.baseURI).href;
    const tableRows = rows.map((row) => `
      <tr>
        <td>${row.no}</td><td>${escapeHtml(row.nama)}</td><td>${escapeHtml(row.tanggal)}</td>
        <td>${escapeHtml(row.keterangan)}</td><td>${row.qty}</td>
        <td>Rp. ${row.harga.toLocaleString('id-ID')}</td><td>Rp. ${row.subtotal.toLocaleString('id-ID')}</td>
      </tr>
    `).join('');
    const workbook = `<!doctype html><html><head><meta charset="UTF-8"><style>
      body{font-family:Arial,sans-serif;font-size:12px;color:#000} .report{width:100%}
      .hospital{text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px}
      .hospital{position:relative}.hospital img{width:58px;height:76px;object-fit:contain;float:left}.hospital img.right{float:right}.hospital h1{font-size:18px;margin:12px 0 4px}
      .hospital div{font-size:12px;margin:2px 0}.title{font-size:16px;font-weight:bold;margin-bottom:4px}
      .patient td{border:0;padding:3px}.patient th{text-align:left;border:0;padding:3px}
      table.billing{border-collapse:collapse;width:100%;margin-top:12px} .billing th,.billing td{border:1px solid #000;padding:5px}
      .billing th{background:#eee}.meta{margin-bottom:8px}
    </style></head><body><div class="report">
      <div class="hospital"><img src="${logoUrl}" alt="Logo RS Bhayangkara"><img class="right" src="${rightLogoUrl}" alt="Logo Bhayangkara"><h1>RS BHAYANGKARA BANDA ACEH</h1>
        <div>Jl. Cut Nyak Dhien No.23 Lamteumen Barat - Banda Aceh</div>
        <div>Telp (0651) 41470 - 41355, Fax. (0651) 41253</div>
      </div>
      <div class="title">Billing Obat Kronis</div><div class="meta">No. Checkin: ${escapeHtml(noCheckin || '-')}</div>
      <table class="patient"><tr><th>Nama Pasien</th><td>${escapeHtml(patient.namaPasien || '-')}</td><th>Jenis Rawatan</th><td>${escapeHtml(patient.jenisRawatan || '-')}</td></tr>
        <tr><th>Nomor RM</th><td>${escapeHtml(patient.nomorRM || '-')}</td><th>Tgl Masuk</th><td>${escapeHtml(patient.tglMasuk || '-')}</td></tr>
        <tr><th>Unit Layanan</th><td>${escapeHtml(patient.unitLayanan || '-')}</td><th>Dokter</th><td>${escapeHtml(patient.dokter || '-')}</td></tr></table>
      <table class="billing"><thead><tr><th>No</th><th>Nama Obat</th><th>Tgl</th><th>Keterangan</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead>
        <tbody>${tableRows}</tbody></table></div></body></html>`;

    const blob = new Blob([workbook], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `billing-obat-kronis-${(noCheckin || 'pasien')}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function getKronisBillingExportContent() {
    const host = document.querySelector('#obat-kronis-billing-content');
    if (!host) return null;

    const clone = host.cloneNode(true);
    clone.querySelector('.btn-group')?.remove();
    return clone;
  }

  function exportKronisBillingPdf() {
    const clone = getKronisBillingExportContent();
    if (!clone) return;

    const content = document.createElement('div');
    content.appendChild(clone);
    content.style.padding = '12px';

    if (window.html2pdf) {
      window.html2pdf()
        .set({
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: `billing-obat-kronis-${(getPageContext().noCheckin || 'pasien')}.pdf`,
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(content)
        .save();
      return;
    }

    printKronisBilling();
  }

  function printKronisBilling() {
    const content = getKronisBillingExportContent();
    if (!content) return;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) return;
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join('');
    printWindow.document.write(`<!doctype html><html><head><title>Billing Obat Kronis</title>${stylesheets}<style>
      @page { size: A4 portrait; margin: 0.3in; }
      body { margin: 0; padding: 12px; background: #fff; font-size: 14px; }
      #kronis-billing-export-root { width: 100%; }
    </style></head><body>${content.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  }

  function renderKronisBilling() {
    const host = document.querySelector('#obat-kronis-billing-content');
    if (!host) return;

    const { noCheckin } = getPageContext();
    const rows = getKronisBillingRows();
    const total = rows.reduce((sum, row) => sum + row.subtotal, 0);

    if (!rows.length) {
      host.innerHTML = `
        <div class="border rounded p-3 bg-light text-center text-muted">
          <div class="fw-semibold mb-2">Billing Obat Kronis</div>
          <div>Belum ada data obat kronis untuk ditagih.</div>
        </div>
      `;
      return;
    }

    const patient = getPatientMeta();

    host.innerHTML = `
      <div class="border rounded p-3 bg-white" style="font-size:14px;" id="kronis-billing-export-root">
        ${buildKronisHospitalHeader()}
        <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <div>
            <div class="fw-bold">Billing Obat Kronis</div>
            <small class="text-muted">No. Checkin: ${escapeHtml(noCheckin || '-')}</small>
          </div>
          <div class="btn-group" role="group">
            <button type="button" class="btn btn-sm btn-primary" data-kronis-action="pdf">PDF</button>
            <button type="button" class="btn btn-sm btn-success" data-kronis-action="excel">Excel</button>
            <button type="button" class="btn btn-sm btn-warning text-white fw-bold" data-kronis-action="print">Printer</button>
          </div>
        </div>

        <div class="row mb-3 g-3 kronis-billing-patient">
          <div class="col-md-6">
            <table class="table table-sm mb-0" style="border-collapse:collapse;border:0;">
              <tbody>
                <tr><th class="text-start" style="width:40%;border:0;">Nama Pasien</th><td style="border:0;">${escapeHtml(patient.namaPasien || 'N/A')}</td></tr>
                <tr><th style="border:0;">Nomor RM</th><td style="border:0;">${escapeHtml(patient.nomorRM || 'N/A')}</td></tr>
                <tr><th style="border:0;">Unit Layanan</th><td style="border:0;">${escapeHtml(patient.unitLayanan || 'N/A')}</td></tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
            <table class="table table-sm mb-0" style="border-collapse:collapse;border:0;">
              <tbody>
                <tr><th class="text-start" style="width:40%;border:0;">Jenis Rawatan</th><td style="border:0;">${escapeHtml(patient.jenisRawatan || 'N/A')}</td></tr>
                <tr><th style="border:0;">Tgl Masuk</th><td style="border:0;">${escapeHtml(patient.tglMasuk || 'N/A')}</td></tr>
                <tr><th style="border:0;">Dokter</th><td style="border:0;">${escapeHtml(patient.dokter || 'N/A')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        ${buildKronisBillingTable(rows)}

        <div class="text-end fw-bold">Total: Rp. ${total.toLocaleString('id-ID')}</div>
      </div>
    `;

    const pdfButton = host.querySelector('[data-kronis-action="pdf"]');
    const excelButton = host.querySelector('[data-kronis-action="excel"]');
    const printButton = host.querySelector('[data-kronis-action="print"]');

    pdfButton?.addEventListener('click', exportKronisBillingPdf);
    excelButton?.addEventListener('click', () => exportKronisBillingToExcel(rows));
    printButton?.addEventListener('click', printKronisBilling);
  }

  function renderChronicTable() {
    const tbody = document.querySelector('#obat-kronis-table-body');
    if (!tbody) return;

    const chronicItems = (currentResep?.obat || []).filter((item) => item.kronis === true);
    if (chronicItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Belum ada obat kronis.</td></tr>';
      renderKronisBilling();
      return;
    }

    const rows = chronicItems.map((item, index) => {
      const subtotal = Number(item.jumlah || 0) * Number(item.hargaSatuan || 0);
      return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(Array.isArray(item.nama) ? item.nama.join(', ') : item.nama || '-')}</td>
        <td>${escapeHtml(item.createdAt || '-')}</td>
        <td>${escapeHtml(item.deskripsi || 'Obat kronis')}</td>
        <td>${escapeHtml(item.jumlah ?? 0)}</td>
        <td>Rp. ${Number(item.hargaSatuan || 0).toLocaleString('id-ID')}</td>
        <td>Rp. ${subtotal.toLocaleString('id-ID')}</td>
        <td>
          <button type="button" data-id-obat="${escapeHtml(item.idObat || '')}" class="btn btn-sm btn-danger text-white delete-kronis-btn">Hapus</button>
        </td>
      </tr>
    `;
    }).join('');
    const totalSubtotal = chronicItems.reduce(
      (total, item) => total + Number(item.jumlah || 0) * Number(item.hargaSatuan || 0),
      0,
    );
    tbody.innerHTML = `${rows}
      <tr class="table-light fw-bold">
        <td colspan="6" class="text-end">Total Subtotal</td>
        <td>Rp. ${totalSubtotal.toLocaleString('id-ID')}</td>
        <td></td>
      </tr>`;
    bindDeleteButtons();
    renderKronisBilling();
  }
  // button tambah obat kronis
  async function submitChronic() {
    const inputType = document.querySelector('#obat-kronis-input-type')?.value;
    const stockSelect = document.querySelector('#obat-kronis-stock');
    const searchInput = document.querySelector('#obat-kronis-search');
    const qtyInput = document.querySelector('#obat-kronis-qty');
    const selectedStock = getSelectedStock();
    const { noCheckin, idPrmrj } = getPageContext();

    if (!noCheckin) {
      window.Swal?.fire({
        title: 'Data belum lengkap',
        text: 'Nomor check-in pasien belum tersedia. Mohon muat ulang halaman.',
        icon: 'warning',
      }) || window.alert('Nomor check-in pasien belum tersedia.');
      return;
    }

    // Jika resep belum ada, buat dulu di klik tombol tambah agar user tidak
    // harus refresh halaman untuk mendapatkan resep baru.
    if (!currentResep) {
      const created = await ensureCurrentResep(noCheckin, idPrmrj);
      if (!created) {
        throw new Error('Resep tidak ditemukan');
      }
    }

    if (!selectedStock || !stockSelect?.value || !qtyInput?.value) {
      window.Swal?.fire({
        title: 'Data belum lengkap',
        text: 'Pilih stock dan obat terlebih dahulu.',
        icon: 'warning',
      }) || window.alert('Pilih stock dan obat terlebih dahulu.');
      return;
    }

    const dataObat = {
      sumberStock: stockSelect.value,
      item: selectedStock.nama,
      jenisObat: '',
      takaran: '',
      quantity: '',
      kapan: '',
      jam: '',
      deskripsi: '',
      noFaktur: selectedStock.noFaktur || '',
      idObat: selectedStock._id,
      distributor: selectedStock.dataDistributor?.[0]?.nama || selectedStock.distributor || '',
      qty: Number(qtyInput.value),
    };
    const payload = {
      dataResep: currentResep,
      dataObat,
      idPrmrj: idPrmrj || currentResep?.idPrmrj || undefined,
      kronis: true,
    };
    const endpoint = inputType === 'RACIKAN' ? '/farmasi/input/resep/racikan' : '/farmasi/input/resep';
    if (inputType === 'RACIKAN') {
      payload.dataRacikan = [{
        nama: selectedStock.nama,
        noFaktur: selectedStock.noFaktur || '',
        distributor: selectedStock.dataDistributor?.[0]?.nama || selectedStock.distributor || '',
        qty: Number(qtyInput.value),
        idObat: selectedStock._id,
      }];
    }

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || `Gagal menambah obat (${response.status})`);
    }

    window.Swal?.fire({ title: 'Berhasil', text: 'Obat kronis berhasil ditambahkan.', icon: 'success' });
    searchInput.value = '';
    qtyInput.value = '1';
    await loadCurrentResep();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function bindStockChange() {
    const stockSelect = document.querySelector('#obat-kronis-stock');
    if (!stockSelect || stockSelect.dataset.changeReady === 'true') return;

    stockSelect.dataset.changeReady = 'true';
    stockSelect.addEventListener('change', (event) => {
      loadStock(event.target.value);
    });
  }

  async function confirmDelete(button) {
    const deleteConfirmed = window.Swal && typeof window.Swal.fire === 'function'
      ? (await window.Swal.fire({
        title: 'Hapus data?',
        text: 'Data obat kronis yang dipilih akan dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
      })).isConfirmed
      : window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!deleteConfirmed) return;

    const { noCheckin } = getPageContext();
    const idObat = button.dataset.idObat;
    if (!currentResep?._id || !idObat || !noCheckin) {
      throw new Error('Data obat kronis atau pasien tidak lengkap');
    }

    const response = await fetch(`${getBaseUrl()}/farmasi/delete/obat/kronis`, {
      method: 'POST',
      headers: getRequestHeaders(),
      body: JSON.stringify({
        idObat,
        resepId: currentResep._id,
        noCheckin,
      }),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.message || `Gagal menghapus obat (${response.status})`);
    }

    await loadCurrentResep();
    window.Swal?.fire({ title: 'Berhasil', text: 'Obat kronis berhasil dihapus.', icon: 'success' });
  }

  function mountForm() {
    const target = document.querySelector('#farmasi-tab-obat-kronis');
    if (!target) return;
    if (target.dataset.formReady === 'true') return;

    target.dataset.formReady = 'true';
    target.innerHTML = `
      <div class="obat-kronis-form-wrapper">
        <ul class="nav nav-tabs mb-3" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="obat-kronis-form-tab" data-bs-toggle="tab" data-bs-target="#obat-kronis-form-pane" type="button" role="tab" aria-controls="obat-kronis-form-pane" aria-selected="true">Form Obat Kronis</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="obat-kronis-billing-tab" data-bs-toggle="tab" data-bs-target="#obat-kronis-billing-pane" type="button" role="tab" aria-controls="obat-kronis-billing-pane" aria-selected="false">Billing Obat Kronis</button>
          </li>
        </ul>

        <div class="tab-content">
          <div class="tab-pane fade show active" id="obat-kronis-form-pane" role="tabpanel" aria-labelledby="obat-kronis-form-tab">
            <div class="row g-2 align-items-end mb-3">
              <div class="col-md-12">
                <label class="form-label small fw-semibold mb-1">Input Obat</label>
                <select id="obat-kronis-input-type" aria-label="Default select example" class="form-select mb-2 ng-valid ng-touched ng-dirty">
                  <option selected="" value="NON-RACIKAN">NON-RACIKAN</option>
                  <option value="RACIKAN">RACIKAN</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold mb-1">Pilih Stock</label>
                <select id="obat-kronis-stock" class="form-select">
                  <option value="">-- Pilih Stock --</option>
                  <option value="APOTEK" class="ng-star-inserted">STOCK APOTEK</option>
                  <option value="IGD" class="ng-star-inserted">STOCK DEPO IGD</option>
                  <option value="INAP" class="ng-star-inserted">STOCK DEPO INAP</option>
                </select>
              </div>
              <div class="col-md-5">
                <label class="form-label small fw-semibold mb-1">Cari Obat</label>
                <input id="obat-kronis-search" type="text" class="form-control" list="obat-kronis-stock-options" placeholder="Cari Obat Kronis" />
                <datalist id="obat-kronis-stock-options"></datalist>
              </div>
              <div class="col-md-2">
                <label class="form-label small fw-semibold mb-1">Qty</label>
                <input id="obat-kronis-qty" type="number" class="form-control" value="1" min="1" />
              </div>
              <div class="col-md-2 d-grid">
                <button id="obat-kronis-submit" type="button" class="btn btn-primary w-100">Tambah</button>
              </div>
            </div>

            <div class="table-responsive border rounded">
              <table class="table table-sm table-hover mb-0 align-middle">
                <thead class="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nama</th>
                    <th scope="col">Tgl</th>
                    <th scope="col">Keterangan</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Harga</th>
                    <th scope="col">Subtotal</th>
                    <th scope="col">Aksi</th>
                  </tr>
                </thead>
                <tbody id="obat-kronis-table-body">
                  <tr><td colspan="8" class="text-center text-muted">Memuat data obat kronis...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="tab-pane fade" id="obat-kronis-billing-pane" role="tabpanel" aria-labelledby="obat-kronis-billing-tab">
            <div id="obat-kronis-billing-content" class="text-muted small fst-italic">Memuat billing obat kronis...</div>
          </div>
        </div>
      </div>
    `;
    bindStockChange();
    renderChronicTable();
    document.querySelector('#obat-kronis-submit')?.addEventListener('click', () => {
      submitChronic().catch((error) => {
        console.error('Gagal submit obat kronis:', error);
        const message = error?.message || 'Obat kronis gagal ditambahkan.';
        window.Swal?.fire({ title: 'Gagal', text: message, icon: 'error' });
      });
    });
  }

  function injectStyles() {
    if (document.getElementById('obat-kronis-form-style')) return;
    const style = document.createElement('style');
    style.id = 'obat-kronis-form-style';
    style.textContent = `
      #farmasi-tab-obat-kronis {
        padding: 0.5rem 0;
      }
      .obat-kronis-form-wrapper {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        padding: 1rem;
      }
      .obat-kronis-form-wrapper .form-label {
        font-size: 0.78rem;
        margin-bottom: 0.25rem;
      }
      .obat-kronis-form-wrapper .table th,
      .obat-kronis-form-wrapper .table td {
        vertical-align: middle;
      }
      .obat-kronis-form-wrapper .btn-primary {
        background-color: #0d6efd;
        border-color: #0d6efd;
      }
    `;
    document.head.appendChild(style);
  }

  function bindDeleteButtons() {
    const buttons = document.querySelectorAll('#farmasi-tab-obat-kronis .delete-kronis-btn');
    buttons.forEach((button) => {
      button.onclick = function () {
        confirmDelete(this).catch((error) => {
          console.error('Gagal menghapus obat kronis:', error);
          window.Swal?.fire({ title: 'Gagal', text: error.message, icon: 'error' });
        });
      };
    });
  }

  function init() {
    injectStyles();
    loadCurrentResep();
    const target = document.querySelector('#farmasi-tab-obat-kronis');
    if (target) {
      mountForm();
      bindDeleteButtons();
    } else {
      const observer = new MutationObserver(() => {
        const nextTarget = document.querySelector('#farmasi-tab-obat-kronis');
        if (nextTarget) {
          showForm();
          bindDeleteButtons();
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    document.addEventListener('shown.bs.tab', (event) => {
      if (event.target && event.target.dataset.bsTarget === '#farmasi-tab-obat-kronis') {
        showForm();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
