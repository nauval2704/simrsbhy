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

  function showForm() {
    const target = document.querySelector('#farmasi-tab-obat-kronis');
    if (target) {
      mountForm();
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

  async function loadCurrentResep() {
    const { noCheckin, idPrmrj } = getPageContext();
    if (!noCheckin) return;

    try {
      const response = await fetch(`${getBaseUrl()}/farmasi/resep`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ noCheckin, idPrmrj: idPrmrj || undefined }),
      });
      if (!response.ok) throw new Error(`Gagal memuat resep (${response.status})`);
      const responseData = await response.json();
      const recipes = Array.isArray(responseData) ? responseData : responseData.data;
      const recipeList = Array.isArray(recipes) ? recipes : [];
      currentResep = recipeList.find((recipe) =>
        String(recipe.noCheckin) === String(noCheckin) &&
        (!idPrmrj || String(recipe.idPrmrj || '') === String(idPrmrj))
      ) || null;
      renderChronicTable();
    } catch (error) {
      console.error('Gagal mengambil data resep obat kronis:', error);
    }
  }

  function getSelectedStock() {
    const searchInput = document.querySelector('#obat-kronis-search');
    const stockItems = JSON.parse(searchInput?.dataset.stockItems || '[]');
    return stockItems.find((item) => item.nama === searchInput?.value);
  }

  function renderChronicTable() {
    const tbody = document.querySelector('#obat-kronis-table-body');
    if (!tbody) return;

    const chronicItems = (currentResep?.obat || []).filter((item) => item.kronis === true);
    if (chronicItems.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Belum ada obat kronis.</td></tr>';
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
          <button type="button" class="btn btn-sm btn-danger text-white delete-kronis-btn">Hapus</button>
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
  }

  async function submitChronic() {
    const inputType = document.querySelector('#obat-kronis-input-type')?.value;
    const stockSelect = document.querySelector('#obat-kronis-stock');
    const searchInput = document.querySelector('#obat-kronis-search');
    const qtyInput = document.querySelector('#obat-kronis-qty');
    const selectedStock = getSelectedStock();
    const { idPrmrj } = getPageContext();

    if (!currentResep || !selectedStock || !stockSelect?.value || !qtyInput?.value) {
      window.Swal?.fire({
        title: 'Data belum lengkap',
        text: currentResep
          ? 'Pilih stock dan obat terlebih dahulu.'
          : 'Data resep pasien belum tersedia. Silakan tunggu sebentar lalu coba lagi.',
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

  function confirmDelete(button) {
    const doDelete = () => {
      button.closest('tr')?.remove();
    };

    if (window.Swal && typeof window.Swal.fire === 'function') {
      window.Swal.fire({
        title: 'Hapus data?',
        text: 'Data obat kronis yang dipilih akan dihapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          doDelete();
        }
      });
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      doDelete();
    }
  }

  function mountForm() {
    const target = document.querySelector('#farmasi-tab-obat-kronis');
    if (!target) return;
    if (target.dataset.formReady === 'true') return;

    target.dataset.formReady = 'true';
    target.innerHTML = `
      <div class="obat-kronis-form-wrapper">
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
    `;
    bindStockChange();
    renderChronicTable();
    document.querySelector('#obat-kronis-submit')?.addEventListener('click', () => {
      submitChronic().catch((error) => {
        console.error('Gagal submit obat kronis:', error);
        window.Swal?.fire({ title: 'Gagal', text: 'Obat kronis gagal ditambahkan.', icon: 'error' });
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
        confirmDelete(this);
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
