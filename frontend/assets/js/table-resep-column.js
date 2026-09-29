(function () {
  'use strict';

  if (window.__tableResepColumnInitialized) return;
  window.__tableResepColumnInitialized = true;

  window.__SIMRS_PATIENT_CACHE__ = window.__SIMRS_PATIENT_CACHE__ || new Map();
  const patientCache = window.__SIMRS_PATIENT_CACHE__;
  const pendingLookups = new Set();

  function getApiBaseUrl() {
    return (
      (window.__APP_CONFIG__ && window.__APP_CONFIG__.apiUrl) ||
      (window.__ENV__ && window.__ENV__.apiUrl) ||
      (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822')
    ).replace(/\/$/, '');
  }

  function cleanString(val) {
    return String(val || '').trim();
  }

  function makeKey(noMr, tglInput) {
    const cleanMr = cleanString(noMr).replace(/^0+/, '') || cleanString(noMr);
    const cleanTgl = cleanString(tglInput).replace(/\s+/g, ' ');
    return `${cleanMr}__${cleanTgl}`;
  }

  // Simpan data pasien ke cache
  function registerPatientItem(item) {
    if (!item || typeof item !== 'object') return;
    const noCheckin = cleanString(item.noCheckin);
    const noMr = cleanString(item.noMr);
    const tglInput = cleanString(item.tglInput);
    const nama = cleanString(item.nama).toUpperCase();

    if (noCheckin) {
      patientCache.set(`checkin_${noCheckin}`, item);
    }
    if (noMr && tglInput) {
      patientCache.set(makeKey(noMr, tglInput), item);
      // Fallback tanpa leading zeros
      patientCache.set(`${noMr}__${tglInput}`, item);
    }
    if (noMr && nama) {
      patientCache.set(`mrnama_${noMr}_${nama}`, item);
    }
    if (noMr) {
      patientCache.set(`mr_${noMr}`, item);
    }
  }

  function registerPatientArray(data) {
    if (!Array.isArray(data)) return;
    for (let i = 0; i < data.length; i++) {
      registerPatientItem(data[i]);
    }
    scheduleTableUpdate();
  }

  // Hook global agar bisa dipanggil dari Angular atau modul lain
  window.__registerPatientData = function (data) {
    if (Array.isArray(data)) {
      registerPatientArray(data);
    } else if (data && typeof data === 'object') {
      registerPatientItem(data);
      scheduleTableUpdate();
    }
  };

  // Intercept XMLHttpRequest untuk menangkap response API pasien (IGD, POLI, RAWAT INAP)
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__reqUrl = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      try {
        const url = String(this.__reqUrl || '');
        if (
          url.includes('/simrsba/caripasienpoli') ||
          url.includes('/simrsba/caripasieninap') ||
          url.includes('/simrsba/caripasien/pelayanan') ||
          url.includes('/simrsba/caripasiennocheckin') ||
          url.includes('/simrsba/caripasiennomr') ||
          url.includes('/simrsba/caripasien/norm')
        ) {
          if (this.status === 200 && this.responseText) {
            const parsed = JSON.parse(this.responseText);
            if (Array.isArray(parsed)) {
              registerPatientArray(parsed);
            } else if (parsed && Array.isArray(parsed.data)) {
              registerPatientArray(parsed.data);
            } else if (parsed && typeof parsed === 'object') {
              registerPatientItem(parsed);
              scheduleTableUpdate();
            }
          }
        }
      } catch (err) {
        // Abaikan error parse non-JSON
      }
    });
    return origSend.apply(this, arguments);
  };

  // Cari data pasien di cache berdasarkan kombinasi atribut baris
  function findPatientInCache(noMr, tglInput, nama) {
    const key = makeKey(noMr, tglInput);
    if (patientCache.has(key)) return patientCache.get(key);

    const directKey = `${cleanString(noMr)}__${cleanString(tglInput)}`;
    if (patientCache.has(directKey)) return patientCache.get(directKey);

    const mrNamaKey = `mrnama_${cleanString(noMr)}_${cleanString(nama).toUpperCase()}`;
    if (patientCache.has(mrNamaKey)) return patientCache.get(mrNamaKey);

    const mrKey = `mr_${cleanString(noMr)}`;
    if (patientCache.has(mrKey)) return patientCache.get(mrKey);

    return null;
  }

  // Fetch data resep fallback jika baris tidak ditemukan di cache
  async function fetchMissingPatientResep(noMr, noCheckin, row) {
    const lookupKey = noCheckin ? `checkin_${noCheckin}` : `mr_${noMr}`;
    if (pendingLookups.has(lookupKey)) return;
    pendingLookups.add(lookupKey);

    try {
      const endpoint = noCheckin
        ? `${getApiBaseUrl()}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`
        : `${getApiBaseUrl()}/simrsba/caripasiennomr/${encodeURIComponent(noMr)}`;

      const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        registerPatientArray(data);
        updateTableRowResep(row);
      } else if (data && Array.isArray(data.data)) {
        registerPatientArray(data.data);
        updateTableRowResep(row);
      } else if (data && typeof data === 'object') {
        registerPatientItem(data);
        updateTableRowResep(row);
      }
    } catch (e) {
      // Abaikan error jaringan fallback
    } finally {
      pendingLookups.delete(lookupKey);
    }
  }

  function getTableColumnIndices(table) {
    const thead = table.querySelector('thead');
    if (!thead) return null;
    const ths = Array.from(thead.querySelectorAll('th'));
    if (!ths.length) return null;

    let checkinIdx = -1;
    let noRmIdx = -1;
    let namaIdx = -1;
    let dpjpIdx = -1;
    let ketIdx = -1;
    let resepIdx = -1;
    let userIdx = -1;

    ths.forEach((th, idx) => {
      const txt = th.textContent.replace(/\s+/g, ' ').trim().toUpperCase();
      if (txt === 'CHECKIN') checkinIdx = idx;
      else if (txt === 'NO.RM' || txt === 'NO. RM' || txt === 'NORM') noRmIdx = idx;
      else if (txt === 'NAMA') namaIdx = idx;
      else if (txt === 'DPJP') dpjpIdx = idx;
      else if (txt === 'KET') ketIdx = idx;
      else if (txt === 'RESEP') resepIdx = idx;
      else if (txt === 'USER') userIdx = idx;
    });

    return {
      total: ths.length,
      checkinIdx,
      noRmIdx,
      namaIdx,
      dpjpIdx,
      ketIdx,
      resepIdx,
      userIdx,
    };
  }

  // Render badge resep atau tanda '-' tanpa emoji
  function renderResepCellContent(patient) {
    if (!patient) {
      return '<span class="text-muted fw-bold">-</span>';
    }

    const hasResep = Boolean(
      patient.hasResep === true ||
      (typeof patient.jumlahResep === 'number' && patient.jumlahResep > 0) ||
      (typeof patient.jumlahObat === 'number' && patient.jumlahObat > 0)
    );

    if (hasResep) {
      const count = typeof patient.jumlahObat === 'number' && patient.jumlahObat > 0 ? patient.jumlahObat : null;
      const label = count ? `Ada (${count} Obat)` : 'Ada Resep';
      return `<span class="badge rounded-pill text-bg-success" style="font-size: 11px; padding: 4px 8px; font-weight: 600; letter-spacing: 0.02em;">${label}</span>`;
    }

    return '<span class="text-muted fw-bold">-</span>';
  }

  function updateTableRowResep(row) {
    const table = row.closest('table');
    if (!table) return;

    // Abaikan baris "Belum ada pasien"
    const colspanCell = row.querySelector('td[colspan]');
    if (colspanCell) {
      const thCount = table.querySelectorAll('thead th').length;
      if (thCount && colspanCell.colSpan !== thCount) {
        colspanCell.colSpan = thCount;
      }
      return;
    }

    const indices = getTableColumnIndices(table);
    if (!indices || indices.resepIdx === -1) return;

    // Pastikan cell RESEP ada pada posisi yang tepat
    let tdResep = row.querySelector('.col-resep');
    if (!tdResep) {
      tdResep = document.createElement('td');
      tdResep.className = 'text-center align-middle col-resep';

      // Posisi cell RESEP diletakkan tepat sebelum cell KET (atau sebelum cell USER jika KET tidak ada)
      const userCell = row.lastElementChild;
      const ketCell = userCell ? userCell.previousElementSibling : null;

      if (ketCell && indices.ketIdx !== -1) {
        row.insertBefore(tdResep, ketCell);
      } else if (userCell) {
        row.insertBefore(tdResep, userCell);
      } else {
        row.appendChild(tdResep);
      }
    }

    // Ambil data identitas pasien dari cell baris
    const children = Array.from(row.children);
    const rowCheckin = cleanString(children[indices.checkinIdx]?.textContent);
    const rowNoMr = cleanString(children[indices.noRmIdx]?.textContent);
    const rowNama = cleanString(children[indices.namaIdx]?.textContent);

    if (!rowNoMr && !rowCheckin) return;

    // Cek apakah ada data pasien di cache
    const patient = findPatientInCache(rowNoMr, rowCheckin, rowNama);
    if (patient) {
      const newHtml = renderResepCellContent(patient);
      if (tdResep.innerHTML !== newHtml) {
        tdResep.innerHTML = newHtml;
      }
    } else {
      // Tampilkan '-' sementara dan lakukan fetch latar belakang bila ada No.RM
      if (!tdResep.innerHTML) {
        tdResep.innerHTML = '<span class="text-muted fw-bold">-</span>';
      }
      fetchMissingPatientResep(rowNoMr, null, row);
    }
  }

  function enhanceTable(table) {
    // Hanya proses tabel pasien IGD, POLI, atau RAWAT INAP
    const hostEl = table.closest('app-pel-poli, app-pel-igd, app-pel-inap');
    if (!hostEl) return;

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (!thead || !tbody) return;

    const headerRow = thead.querySelector('tr');
    if (!headerRow) return;

    // Periksa apakah kolom RESEP sudah ada di thead
    let thResep = headerRow.querySelector('.th-resep');
    if (!thResep) {
      const ths = Array.from(headerRow.querySelectorAll('th'));
      const thKet = ths.find((th) => th.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === 'KET');

      thResep = document.createElement('th');
      thResep.setAttribute('scope', 'col');
      thResep.className = 'text-center th-resep align-middle';
      thResep.style.cssText = 'min-width: 90px; vertical-align: middle; text-align: center;';
      thResep.textContent = 'RESEP';

      if (thKet) {
        headerRow.insertBefore(thResep, thKet);
      } else {
        const thUser = ths.find((th) => th.textContent.replace(/\s+/g, ' ').trim().toUpperCase() === 'USER');
        if (thUser) {
          headerRow.insertBefore(thResep, thUser);
        } else {
          headerRow.appendChild(thResep);
        }
      }
    }

    // Update setiap baris di tbody
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row) => updateTableRowResep(row));
  }

  function processAllTables() {
    document.querySelectorAll('app-pel-poli table, app-pel-igd table, app-pel-inap table').forEach((table) => {
      enhanceTable(table);
    });
  }

  let updateTimer = null;
  function scheduleTableUpdate() {
    if (updateTimer) return;
    updateTimer = setTimeout(() => {
      updateTimer = null;
      processAllTables();
    }, 40);
  }

  // MutationObserver untuk memantau perubahan DOM pada tabel pasien
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (let i = 0; i < mutations.length; i++) {
      const m = mutations[i];
      if (m.type === 'childList') {
        const target = m.target;
        if (
          target.nodeName === 'TBODY' ||
          target.nodeName === 'TABLE' ||
          (target.closest && target.closest('app-pel-poli, app-pel-igd, app-pel-inap'))
        ) {
          shouldUpdate = true;
          break;
        }
      }
    }
    if (shouldUpdate) {
      scheduleTableUpdate();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Jalankan inisialisasi awal
  processAllTables();
})();
