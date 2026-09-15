(function () {
  // START CUSTOM: E-Resep report module
  function safeText(value, fallback) {
    if (value === null || value === undefined || value === '') return fallback;
    return String(value).trim() || fallback;
  }

  function getApiBaseUrl() {
    return (
      (window.__APP_CONFIG__ && window.__APP_CONFIG__.apiUrl) ||
      (window.__ENV__ && window.__ENV__.apiUrl) ||
      (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822')
    );
  }

  function getCurrentNoCheckin() {
    const params = new URLSearchParams(window.location.search);
    const direct = params.get('nocheckin') || params.get('noCheckin') || params.get('checkin');
    if (direct) return direct;

    const domNoCheckin = document.getElementById('spd-noCheckin') || document.getElementById('noCheckin') || document.querySelector('[data-no-checkin]');
    const domText = domNoCheckin ? (domNoCheckin.textContent || domNoCheckin.value || domNoCheckin.getAttribute('data-no-checkin') || '') : '';
    const trimmedDomText = String(domText || '').trim();
    if (trimmedDomText && trimmedDomText !== '-' && trimmedDomText !== 'N/A') {
      const match = trimmedDomText.match(/\d{3,}/);
      if (match) return match[0];
      return trimmedDomText;
    }

    const path = window.location.pathname || '';
    const pathParts = path.split('/').filter(Boolean);
    const named = pathParts.findIndex((item) => item.toLowerCase() === 'nocheckin');
    if (named >= 0 && pathParts[named + 1]) return pathParts[named + 1].split('?')[0].split('#')[0];

    const match = path.match(/(?:\/|^)(\d{4,})(?:\/|$)/);
    if (match) return match[1];

    for (const candidate of pathParts) {
      if (/^\d{4,}$/.test(candidate)) return candidate;
    }

    const fromDom = document.body?.dataset?.noCheckin || document.body?.getAttribute?.('data-no-checkin');
    if (fromDom) return fromDom;

    return '';
  }

  function getPatientMeta() {
    const params = new URLSearchParams(window.location.search);
    const readValue = (...selectors) => {
      for (const selector of selectors) {
        const node = document.querySelector(selector);
        if (node && node.textContent && node.textContent.trim()) {
          return node.textContent.trim();
        }
      }
      return '';
    };

    const patientFromWindow = window.__ERESPEP_PATIENT__ || {};
    const fallback = {
      nomorRM: patientFromWindow.noMr || patientFromWindow.nomorRM || params.get('norm') || readValue('[data-nomor-rm]', '[data-norm]', '[data-no-rm]', '#norm') || 'N/A',
      namaPasien: patientFromWindow.nama || patientFromWindow.namaPasien || params.get('nama') || readValue('[data-nama-pasien]', '[data-pasien-nama]', '.nama-pasien', '#namaPasien') || 'N/A',
      unitLayanan: patientFromWindow.ruangan || patientFromWindow.poli || patientFromWindow.unitLayanan || readValue('[data-unit-layanan]', '.unit-layanan', '#unitLayanan') || params.get('unit') || 'Poliklinik',
      jenisRawatan: patientFromWindow.jnsPelayanan || patientFromWindow.jenisRawatan || readValue('[data-jenis-rawatan]', '.jenis-rawatan', '#jenisRawatan') || params.get('jenisRawatan') || 'Rawat Jalan',
      tglMasuk: patientFromWindow.tglMasuk || patientFromWindow.tglInput || readValue('[data-tgl-masuk]', '.tgl-masuk', '#tglMasuk') || params.get('tglMasuk') || new Date().toISOString().slice(0, 10),
      dokter: patientFromWindow.dokter || patientFromWindow.dpjp || readValue('[data-dokter]', '.dokter', '#dokter') || params.get('dokter') || 'Dokter Umum',
    };

    return {
      nomorRM: safeText(fallback.nomorRM, 'N/A'),
      namaPasien: safeText(fallback.namaPasien, 'N/A'),
      unitLayanan: safeText(fallback.unitLayanan, 'N/A'),
      jenisRawatan: safeText(fallback.jenisRawatan, 'N/A'),
      tglMasuk: safeText(fallback.tglMasuk, 'N/A'),
      dokter: safeText(fallback.dokter, 'N/A'),
    };
  }

  function normalizeItem(item, index) {
    const candidate = item || {};
    const nameFromFields = [
      candidate.namaObat,
      candidate.nama,
      candidate.nama_barang,
      candidate.obat,
      candidate.nmObat,
      candidate.title,
      candidate.namaobat,
      candidate.namaObatResep,
    ].find((value) => value && String(value).trim());

    const jenisFromFields = [
      candidate.jenisObat,
      candidate.jenis,
      candidate.kategori,
      candidate.kelompok,
      candidate.jenisObatResep,
      candidate.jenisObatResep || candidate.kategori,
    ].find((value) => value && String(value).trim()) || 'Non Racikan';

    const jumlahValue = Number(candidate.jumlahObat ?? candidate.jumlah ?? candidate.qty ?? candidate.quantity ?? candidate.jml ?? 1) || 1;
    const satuanValue = safeText(candidate.satuanObat || candidate.satuan || candidate.unit || candidate.satuanObatResep || 'tablet', 'tablet');
    const aturanValue = [
      candidate.aturanPakai,
      candidate.aturan,
      candidate.signa,
      candidate.instruksi,
      candidate.kapan,
      candidate.jam,
      candidate.deskripsi,
      candidate.takaran,
      candidate.aturanPakaiResep,
    ].filter((value) => value !== null && value !== undefined && String(value).trim() !== '').join(' / ');

    return {
      nomor: candidate.nomor ?? index + 1,
      namaObat: safeText(nameFromFields || `Obat ${index + 1}`, `Obat ${index + 1}`),
      jenisObat: safeText(jenisFromFields, 'Non Racikan'),
      jumlahObat: jumlahValue,
      satuanObat: satuanValue,
      aturanPakai: safeText(aturanValue || 'Sesuai instruksi dokter', 'Sesuai instruksi dokter'),
      kategori: safeText(candidate.kategori || candidate.kategoriObat || candidate.kelompok || 'Umum', 'Umum'),
    };
  }

  function getDefaultItems() {
    return [];
  }

  function extractResepItems(payload) {
    const documents = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.result)
            ? payload.result
            : [];

    const items = [];
    documents.forEach((resep) => {
      const arr = Array.isArray(resep?.obat)
        ? resep.obat
        : Array.isArray(resep?.items)
          ? resep.items
          : Array.isArray(resep?.data)
            ? resep.data
            : [];

      arr.forEach((item, index) => {
        if (!item || typeof item !== 'object') return;
        items.push(normalizeItem({
          ...item,
          nomor: items.length + 1,
          kategori: item.kategori || item.jenis || item.jenisObat || 'Umum',
        }, items.length));
      });
    });

    return items;
  }

  function getItems() {
    if (window.__ERESPEP_ITEMS__ && Array.isArray(window.__ERESPEP_ITEMS__)) {
      return window.__ERESPEP_ITEMS__.map((item, index) => normalizeItem(item, index));
    }

    const list = document.querySelector('#farmasi-tab-obat-bmhp .table, #farmasi-tab-obat-bmhp table, app-list-resep table');
    if (!list) return getDefaultItems();

    const rows = Array.from(list.querySelectorAll('tbody tr')).map((tr, index) => {
      const cells = Array.from(tr.querySelectorAll('td,th'));
      const text = cells.map((cell) => cell.textContent.trim());
      return normalizeItem({
        nomor: index + 1,
        namaObat: text[1] || text[0] || `Obat ${index + 1}`,
        jenisObat: text[2] || 'Non Racikan',
        jumlahObat: text[3] || 1,
        satuanObat: text[4] || 'tablet',
        aturanPakai: text[5] || 'Sesuai instruksi dokter',
      }, index);
    });

    return rows.length ? rows : getDefaultItems();
  }

  function renderTable(items) {
    return items.map((item) => `
      <tr>
        <td>${safeText(item.nomor, '-')}</td>
        <td>${safeText(item.namaObat, '-')}</td>
        <td>${safeText(item.jenisObat || item.kategori || '-', '-')}</td>
        <td>${safeText(item.jumlahObat, '-')}</td>
        <td>${safeText(item.satuanObat, '-')}</td>
        <td>${safeText(item.aturanPakai, '-')}</td>
      </tr>
    `).join('');
  }

  function sanitizeFilename(value) {
    return String(value).replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
  }

  function makeExcelFile(rows, patient) {
    const header = ['Nomor', 'Nama Obat', 'Jenis Obat', 'Jumlah Obat', 'Satuan Obat', 'Aturan Pakai'];
    const body = rows.map((item) => [
      item.nomor,
      item.namaObat,
      item.jenisObat,
      item.jumlahObat,
      item.satuanObat,
      item.aturanPakai,
    ]);

    const csvRows = [
      ['Data Pasien', '', '', '', '', ''],
      ['Nama Pasien', patient.namaPasien],
      ['Nomor RM', patient.nomorRM],
      ['Unit Layanan', patient.unitLayanan],
      ['Jenis Rawatan', patient.jenisRawatan],
      ['Tgl Masuk', patient.tglMasuk],
      ['Dokter', patient.dokter],
      [],
      header,
      ...body,
    ];

    const csv = csvRows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `e-resep-${sanitizeFilename(patient.namaPasien)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function exportPdf(element) {
    const reportClone = element && element.cloneNode ? element.cloneNode(true) : element;
    if (reportClone && reportClone.querySelector) {
      const toolbar = reportClone.querySelector('.e-resep-toolbar');
      if (toolbar) {
        const actions = toolbar.querySelector('.btn-group');
        if (actions) actions.remove();
      }
    }

    if (window.html2pdf) {
      window.html2pdf()
        .set({
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: `e-resep-${sanitizeFilename(getPatientMeta().namaPasien)}.pdf`,
          image: { type: 'jpeg', quality: 0.96 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(reportClone)
        .save();
      return;
    }

    const toolbar = element && element.querySelector ? element.querySelector('.e-resep-toolbar') : null;
    if (toolbar) toolbar.style.display = 'none';
    window.print();
  }

  function renderEResep() {
    const host = document.querySelector('#farmasi-tab-eresept');
    if (!host || host.dataset.eResepReady === 'true') return;

    const patient = getPatientMeta();
    const items = window.__ERESPEP_ITEMS__ && Array.isArray(window.__ERESPEP_ITEMS__)
      ? window.__ERESPEP_ITEMS__.map((item, index) => normalizeItem(item, index))
      : getItems();

    host.dataset.eResepReady = 'true';
    host.innerHTML = `
      <div id="e-resep-report" class="border rounded p-3 bg-white" style="font-size:14px;">
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 e-resep-toolbar" data-print-hide="true">
          <div>
            <h5 class="mb-1 fw-bold text-dark">E-Resep</h5>
            <small class="text-muted">Ringkasan resep pasien</small>
          </div>
          <div class="btn-group" role="group" aria-label="Aksi e resep">
            <button type="button" class="btn btn-sm btn-primary" data-action="pdf">PDF</button>
            <button type="button" class="btn btn-sm btn-success" data-action="excel">Excel</button>
            <button type="button" class="btn btn-sm btn-warning text-white fw-bold" data-action="print">Cetak</button>
          </div>
        </div>

        <div class="row mb-3 g-3">
          <div class="col-md-6">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="text-start" style="width: 40%;">Nama Pasien</th>
                  <td>${patient.namaPasien}</td>
                </tr>
                <tr>
                  <th>Nomor RM</th>
                  <td>${patient.nomorRM}</td>
                </tr>
                <tr>
                  <th>Unit Layanan</th>
                  <td>${patient.unitLayanan}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-md-6">
            <table class="table table-sm table-borderless mb-0">
              <tbody>
                <tr>
                  <th class="text-start" style="width: 40%;">Jenis Rawatan</th>
                  <td>${patient.jenisRawatan}</td>
                </tr>
                <tr>
                  <th>Tgl Masuk</th>
                  <td>${patient.tglMasuk}</td>
                </tr>
                <tr>
                  <th>Dokter</th>
                  <td>${patient.dokter}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="table-responsive">
          ${items.length ? `
            <table class="table table-bordered table-sm align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="text-center">Nomor</th>
                  <th>Nama Obat</th>
                  <th>Jenis Obat</th>
                  <th class="text-center">Jumlah Obat</th>
                  <th class="text-center">Satuan Obat</th>
                  <th>Aturan Pakai</th>
                </tr>
              </thead>
              <tbody>
                ${renderTable(items)}
              </tbody>
            </table>
          ` : `
            <div class="alert alert-light border mb-0">
              <div class="fw-bold mb-2">Data obat belum tersedia untuk E-Resep.</div>
              <ul class="mb-0 ps-3">
                <li>Nama obat</li>
                <li>Satuan</li>
                <li>Jumlah</li>
                <li>Jenis</li>
                <li>Kategori</li>
              </ul>
            </div>
          `}
        </div>
      </div>
    `;

    const report = host.querySelector('#e-resep-report');
    if (!report) return;

    const hideOnPrint = () => {
      if (report.querySelectorAll) {
        report.querySelectorAll('[data-print-hide="true"]').forEach((el) => {
          if (el.classList && el.classList.contains('e-resep-toolbar')) {
            const actions = el.querySelector('.btn-group');
            if (actions) actions.style.display = 'none';
            const title = el.querySelector('div:first-child');
            if (title) title.style.display = 'block';
            return;
          }
          el.style.display = 'none';
        });
      }
    };

    host.querySelector('[data-action="pdf"]').addEventListener('click', function () {
      hideOnPrint();
      exportPdf(report);
    });

    host.querySelector('[data-action="excel"]').addEventListener('click', function () {
      makeExcelFile(items, patient);
    });

    host.querySelector('[data-action="print"]').addEventListener('click', function () {
      hideOnPrint();
      setTimeout(() => exportPdf(report), 30);
    });
  }

  function syncEResepData(patient, items) {
    if (patient) {
      window.__ERESPEP_PATIENT__ = patient;
    }
    if (items) {
      window.__ERESPEP_ITEMS__ = Array.isArray(items) ? items.map((item, index) => normalizeItem(item, index)) : [];
    }

    const tab = document.querySelector('#farmasi-tab-eresept');
    if (tab) {
      tab.dataset.eResepReady = 'false';
      renderEResep();
    }
  }

  function loadEResepFromBackend() {
    const noCheckin = getCurrentNoCheckin();
    if (!noCheckin) {
      return Promise.resolve();
    }

    const apiBase = getApiBaseUrl();

    const patientPromise = fetch(`${apiBase}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`)
      .then((response) => response.json())
      .then((payload) => {
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        const entry = list[0] || {};
        const user = Array.isArray(entry.user) ? entry.user[0] || {} : {};
        const normalizedPatient = {
          nama: entry.nama || user.nama || 'N/A',
          noMr: entry.noMr || user.norm || entry.noMR || 'N/A',
          ruangan: entry.ruangan || entry.poli || entry.unitLayanan || 'N/A',
          jnsPelayanan: entry.jnsPelayanan || entry.jenisPelayanan || 'N/A',
          tglMasuk: entry.tglInput || entry.tglMasuk || new Date().toISOString().slice(0, 10),
          dokter: entry.dpjp || entry.dokter || user.dokter || 'Dokter Umum',
        };

        return {
          ...normalizedPatient,
          namaPasien: normalizedPatient.nama,
          nomorRM: normalizedPatient.noMr,
          unitLayanan: normalizedPatient.ruangan,
          jenisRawatan: normalizedPatient.jnsPelayanan,
          tglMasuk: normalizedPatient.tglMasuk,
          dokter: normalizedPatient.dokter,
        };
      })
      .catch(() => null);

    const resepPromise = fetch(`${apiBase}/farmasi/resep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noCheckin }),
    })
      .then((response) => response.json())
      .then((payload) => {
        return extractResepItems(payload);
      })
      .catch(() => []);

    return Promise.all([patientPromise, resepPromise]).then(([patient, items]) => {
      if (patient) {
        window.__ERESPEP_PATIENT__ = patient;
      }
      window.__ERESPEP_ITEMS__ = Array.isArray(items) ? items : [];
      const tab = document.querySelector('#farmasi-tab-eresept');
      if (tab) {
        tab.dataset.eResepReady = 'false';
        renderEResep();
      }
    });
  }

  window.setEResepData = syncEResepData;
  window.__ERESPEP_PATIENT__ = window.__ERESPEP_PATIENT__ || {};
  window.__ERESPEP_ITEMS__ = window.__ERESPEP_ITEMS__ || [];

  function startObserver() {
    const trigger = function (forceRefresh = false) {
      const tab = document.querySelector('#farmasi-tab-eresept');
      if (!tab) return;

      if (forceRefresh || !tab.dataset.eResepReady || tab.dataset.eResepReady === 'false') {
        tab.dataset.eResepReady = 'false';
        loadEResepFromBackend().finally(() => renderEResep());
      } else {
        renderEResep();
      }
    };

    const handleTabShown = (event) => {
      const target = event && event.target ? event.target : null;
      if (!target) return;

      const targetSelector = target.getAttribute?.('data-bs-target') || target.getAttribute?.('href') || '';
      const isEResepTab = targetSelector.includes('#farmasi-tab-eresept') || target.id === 'farmasi-tab-eresept' || target.matches?.('#farmasi-tab-eresept');
      if (isEResepTab) {
        trigger(true);
      }
    };

    document.addEventListener('shown.bs.tab', handleTabShown);
    trigger(true);
    const observer = new MutationObserver(() => trigger(false));
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
  // END CUSTOM: E-Resep report module
})();
