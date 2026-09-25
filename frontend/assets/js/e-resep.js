(function () {
  // START CUSTOM: E-Resep report module
  function safeText(value, fallback) {
    if (value === null || value === undefined || value === '') return fallback;
    return String(value).trim() || fallback;
  }

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal format tanggal Indonesia untuk footer e-resep
  function getIndonesianToday() {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir format tanggal Indonesia untuk footer e-resep

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal format tanggal dan jam cetak e-resep
  function getIndonesianPrintDateTime() {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date());
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir format tanggal dan jam cetak e-resep

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
      kronis: candidate.kronis === true || candidate.kronis === 'true',
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
            : payload?.data && typeof payload.data === 'object'
              ? [payload.data]
              : payload && typeof payload === 'object'
                ? [payload]
                : [];

    const items = [];
    documents.forEach((resep) => {
      const arr = Array.isArray(resep?.obat)
        ? resep.obat
        : Array.isArray(resep?.items)
          ? resep.items
          : Array.isArray(resep?.data)
            ? resep.data
            : resep?.obat && typeof resep.obat === 'object'
              ? [resep.obat]
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
    if (Array.isArray(window.__ERESPEP_ITEMS__) && window.__ERESPEP_ITEMS__.length) {
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

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal peringkasan obat berdasarkan nama yang sama
  function summarizeItemsByName(items) {
    const grouped = new Map();
    items.forEach((item) => {
      const name = item.namaObat || 'Obat tidak bernama';
      const existing = grouped.get(name);
      if (existing) {
        existing.jumlahObat += Number(item.jumlahObat) || 0;
        if (existing.satuanObat !== item.satuanObat) existing.satuanObat = 'beragam';
        const aturan = item.aturanPakai && !existing.aturanPakai.includes(item.aturanPakai)
          ? `${existing.aturanPakai} / ${item.aturanPakai}`
          : existing.aturanPakai;
        existing.aturanPakai = aturan;
        return;
      }
      grouped.set(name, {
        ...item,
        jumlahObat: Number(item.jumlahObat) || 0,
      });
    });
    return Array.from(grouped.values()).map((item, index) => ({
      ...item,
      nomor: index + 1,
    }));
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir peringkasan obat berdasarkan nama yang sama

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan mode pengelompokan tabel obat
  function renderGroupedTables(items, mode = 'jenis') {
    const groups = mode === 'nama'
      ? [{ title: 'Obat Berdasarkan Nama', items: summarizeItemsByName(items) }]
      : [
        { title: 'Obat Kronis', items: items.filter((item) => item.kronis === true) },
        { title: 'Obat Non-Kronis', items: items.filter((item) => item.kronis !== true) },
      ];

    return groups.filter((group) => group.items.length).map((group) => `
      <div class="mb-3">
        <div class="fw-bold bg-light border px-2 py-1">${group.title}</div>
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
          <tbody>${renderTable(group.items)}</tbody>
        </table>
      </div>
    `).join('');
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan mode pengelompokan tabel obat

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
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan waktu cetak pada download e-resep
      ['Tgl cetak', getIndonesianPrintDateTime()],
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan waktu cetak pada download e-resep
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
    // diupdate oleh irwansyah tanggal 2026-09-23 - awal perbaikan agar tanda tangan ikut tersimpan pada pdf
    const sourceSignature = element && element.querySelector ? element.querySelector('#e-resep-dpjp-signature') : null;
    const clonedSignature = reportClone && reportClone.querySelector ? reportClone.querySelector('#e-resep-dpjp-signature') : null;
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal menghapus placeholder dari hasil e-resep
    let hasSignature = false;
    try {
      hasSignature = Boolean(localStorage.getItem(getDpjpSignatureStorageKey()));
    } catch (error) {
      hasSignature = false;
    }
    if (sourceSignature && clonedSignature && sourceSignature.toDataURL && hasSignature) {
      const signatureImage = document.createElement('img');
      signatureImage.src = sourceSignature.toDataURL('image/png');
      signatureImage.alt = 'Tanda tangan dokter DPJP';
      signatureImage.style.width = '100%';
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal mengecilkan tanda tangan pada hasil e-resep
      signatureImage.style.maxWidth = '320px';
      signatureImage.style.height = '110px';
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir mengecilkan tanda tangan pada hasil e-resep
      signatureImage.style.objectFit = 'contain';
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal penghapusan border tanda tangan pada hasil export
      signatureImage.style.border = '0';
      signatureImage.style.borderRadius = '0';
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penghapusan border tanda tangan pada hasil export
      clonedSignature.replaceWith(signatureImage);
    } else if (clonedSignature) {
      clonedSignature.remove();
    }
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menghapus placeholder dari hasil e-resep
    // diupdate oleh irwansyah tanggal 2026-09-23 - akhir perbaikan agar tanda tangan ikut tersimpan pada pdf
    if (reportClone && reportClone.querySelector) {
      const toolbar = reportClone.querySelector('.e-resep-toolbar');
      if (toolbar) {
        // diupdate oleh irwansyah tanggal 2026-09-23 - awal menghapus seluruh tombol dari hasil PDF
        toolbar.querySelectorAll('.btn-group').forEach((actions) => actions.remove());
        // diupdate oleh irwansyah tanggal 2026-09-23 - akhir menghapus seluruh tombol dari hasil PDF
      }
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal penghapusan tombol hapus tanda tangan dari pdf
      reportClone.querySelector('[data-action="clear-signature"]')?.remove();
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal memastikan tanggal cetak tampil pada hasil e-resep
      const printDate = reportClone.querySelector('[data-print-date]');
      if (printDate) printDate.textContent = `Tgl cetak: ${getIndonesianPrintDateTime()}`;
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir memastikan tanggal cetak tampil pada hasil e-resep
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penghapusan tombol hapus tanda tangan dari pdf
    }

    if (window.html2pdf) {
      window.html2pdf()
        .set({
          // diupdate oleh irwansyah tanggal 2026-09-23 - awal menaikkan posisi konten PDF e-resep
          margin: [0.08, 0.3, 0.2, 0.3],
          // diupdate oleh irwansyah tanggal 2026-09-23 - akhir menaikkan posisi konten PDF e-resep
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

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan signature pad dokter dpjp
  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan penyimpanan tanda tangan dokter dpjp
  function getDpjpSignatureStorageKey() {
    const noCheckin = getCurrentNoCheckin() || 'default';
    return `e-resep-dpjp-signature-${noCheckin}`;
  }

  function saveDpjpSignature(canvas) {
    try {
      localStorage.setItem(getDpjpSignatureStorageKey(), canvas.toDataURL('image/png'));
    } catch (error) {
      // Penyimpanan lokal dapat ditolak oleh mode private browser.
    }
  }

  function restoreDpjpSignature(canvas, context) {
    try {
      const signatureData = localStorage.getItem(getDpjpSignatureStorageKey());
      if (!signatureData) return;

      const signatureImage = new Image();
      signatureImage.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(signatureImage, 0, 0, canvas.width, canvas.height);
      };
      signatureImage.src = signatureData;
    } catch (error) {
      // Penyimpanan lokal dapat tidak tersedia pada browser tertentu.
    }
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan penyimpanan tanda tangan dokter dpjp

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal placeholder tanda tangan e-resep
  function drawSignaturePlaceholder(canvas, context) {
    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#9ca3af';
    context.font = '16px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Tanda tangan di sini', canvas.width / 2, canvas.height / 2);
    context.restore();
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir placeholder tanda tangan e-resep

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal perubahan dpjp
  function initDpjpSignature(report) {
    const canvas = report.querySelector('#e-resep-dpjp-signature');
    const clearButton = report.querySelector('[data-action="clear-signature"]');
    if (!canvas || !clearButton) return;

    const context = canvas.getContext('2d');
    let isDrawing = false;
    let hasDrawn = false;

    const getPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      const source = event.touches?.[0] || event;
      return {
        x: source.clientX - rect.left,
        y: source.clientY - rect.top,
      };
    };

    const startDrawing = (event) => {
      event.preventDefault();
      context.clearRect(0, 0, canvas.width, canvas.height);
      isDrawing = true;
      hasDrawn = false;
      const point = getPoint(event);
      context.beginPath();
      context.moveTo(point.x, point.y);
    };

    const draw = (event) => {
      if (!isDrawing) return;
      event.preventDefault();
      hasDrawn = true;
      const point = getPoint(event);
      context.lineTo(point.x, point.y);
      context.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
      context.closePath();
      if (hasDrawn) saveDpjpSignature(canvas);
      else drawSignaturePlaceholder(canvas, context);
    };

    context.strokeStyle = '#111827';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    restoreDpjpSignature(canvas, context);
    try {
      if (!localStorage.getItem(getDpjpSignatureStorageKey())) drawSignaturePlaceholder(canvas, context);
    } catch (error) {
      drawSignaturePlaceholder(canvas, context);
    }
    clearButton.addEventListener('click', () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      try {
        localStorage.removeItem(getDpjpSignatureStorageKey());
      } catch (error) {
        console.warn('Failed to clear signature from localStorage:', error); 
      }
      drawSignaturePlaceholder(canvas, context);
    });
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir perubahan event tanda tangan dokter dpjp
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan signature pad dokter dpjp

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan header rumah sakit e-resep
  function buildEResepHospitalHeader() {
    const logoUrl = new URL('assets/img/logorsba.png', document.baseURI).href;
    const rightLogoUrl = new URL('assets/img/bygkara1.png', document.baseURI).href;
    return `
      <div class="e-resep-hospital-header" style="display:flex;align-items:center;gap:16px;border-bottom:2px solid #000;padding:0 0 10px;margin-bottom:12px;text-align:center;">
        <img src="${logoUrl}" alt="Logo RS Bhayangkara" style="width:58px;height:76px;object-fit:contain;flex:0 0 auto;">
        <div style="flex:1;line-height:1.25;">
          <div style="font-size:18px;font-weight:700;">KEPOLISIAN NEGARA REPUBLIK INDONESIA DAERAH ACEH </div>
           <div style="font-size:18px;font-weight:700;">RUMAH SAKIT BHAYANGKARA BANDA ACEH </div>
          <div style="font-size:12px;">Jln. Cut Nyak Dhien No.23 Lamteumen Barat - Banda Aceh</div>
          <div style="font-size:12px;">Telp (0651) 41470 - 41355, Fax. (0651) 41253</div>
           <div style="font-size:12px;">Email: bhayangkara_bandara_banda_aceh@yahoo.co.id</div>
        </div>
        <img src="${rightLogoUrl}" alt="Logo Bhayangkara" style="width:58px;height:76px;object-fit:contain;flex:0 0 auto;">
      </div>
    `;
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan header rumah sakit e-resep

  function renderEResep() {
    const host = document.querySelector('#farmasi-tab-eresept');
    if (!host || host.dataset.eResepReady === 'true') return;

    const patient = getPatientMeta();
    const items = Array.isArray(window.__ERESPEP_ITEMS__) && window.__ERESPEP_ITEMS__.length
      ? window.__ERESPEP_ITEMS__.map((item, index) => normalizeItem(item, index))
      : getItems();

    host.dataset.eResepReady = 'true';
    host.innerHTML = `
      <!-- diupdate oleh irwansyah tanggal 2026-09-23 - awal menaikkan posisi konten cetak e-resep -->
      <div id="e-resep-report" class="border rounded bg-white" style="font-size:14px;padding:4px 16px 16px;">
        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - awal pemasangan header rumah sakit e-resep -->
        ${buildEResepHospitalHeader()}
        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - akhir pemasangan header rumah sakit e-resep -->
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 e-resep-toolbar" data-print-hide="true">
          <div>
            <h5 class="mb-1 fw-bold text-dark">E-Resep</h5>
            <small class="text-muted">Ringkasan resep pasien</small>
          </div>
          <!-- diupdate oleh irwansyah tanggal 2026-09-23 - akhir menaikkan posisi konten cetak e-resep -->
          <!-- diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan tombol pengelompokan e-resep -->
          <div class="btn-group me-3" role="group" aria-label="Pengelompokan e resep">
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="group-name">
              Group by Nama Obat
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" data-action="group-type">
              Group by Jenis Obat
              <small class="d-block" style="font-size:10px;line-height:1;">Kronis / Non Kronis</small>
            </button>
          </div>
          <!-- diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan tombol pengelompokan e-resep -->
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

        <div class="table-responsive" id="e-resep-items-container">
          ${items.length ? `
            ${renderGroupedTables(items)}
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

        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - awal pengembalian tanda tangan dan nama dokter -->
        <div class="row mt-4 pt-3 border-top e-resep-dpjp-signature">
          <div class="col-md-6 offset-md-6 text-center">
            <div class="mt-2">Banda Aceh, ${getIndonesianToday()}</div>
            <canvas id="e-resep-dpjp-signature" width="420" height="150" class="bg-white w-100" style="touch-action:none;max-width:420px;border:0;"></canvas>
            <button type="button" class="btn btn-sm btn-outline-secondary mt-2" data-action="clear-signature" data-print-hide="true">Hapus Tanda Tangan</button>
            <div class="mt-2 fw-bold">${patient.dokter}</div>
          </div>
        </div>
        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - awal penambahan footer waktu cetak e-resep -->
        <div class="text-start text-muted mt-3" data-print-date>Tgl cetak: ${getIndonesianPrintDateTime()}</div>
        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - akhir penambahan footer waktu cetak e-resep -->
        <!-- diupdate oleh irwansyah tanggal 2026-09-23 - akhir pengembalian tanda tangan dan nama dokter -->
      </div>
    `;

    const report = host.querySelector('#e-resep-report');
    if (!report) return;

    // diupdate oleh irwansyah tanggal 2026-09-23 - awal inisialisasi form tanda tangan dokter dpjp
    initDpjpSignature(report);
    // diupdate oleh irwansyah tanggal 2026-09-23 - akhir inisialisasi form tanda tangan dokter dpjp

    const hideOnPrint = () => {
      if (report.querySelectorAll) {
        report.querySelectorAll('[data-print-hide="true"]').forEach((el) => {
          if (el.classList && el.classList.contains('e-resep-toolbar')) {
            // diupdate oleh irwansyah tanggal 2026-09-23 - awal menyembunyikan seluruh tombol saat cetak
            el.querySelectorAll('.btn-group').forEach((actions) => { actions.style.display = 'none'; });
            // diupdate oleh irwansyah tanggal 2026-09-23 - akhir menyembunyikan seluruh tombol saat cetak
            const title = el.querySelector('div:first-child');
            if (title) title.style.display = 'block';
            return;
          }
          el.style.display = 'none';
        });
      }
    };

    // diupdate oleh irwansyah tanggal 2026-09-23 - awal pemulihan tombol aksi setelah cetak
    const restoreAfterPrint = () => {
      report.querySelectorAll('[data-print-hide="true"]').forEach((el) => {
        el.style.display = '';
        el.querySelectorAll?.('.btn-group').forEach((actions) => { actions.style.display = ''; });
      });
    };
    // diupdate oleh irwansyah tanggal 2026-09-23 - akhir pemulihan tombol aksi setelah cetak

    host.querySelector('[data-action="pdf"]').addEventListener('click', function () {
      exportPdf(report);
    });

    host.querySelector('[data-action="excel"]').addEventListener('click', function () {
      // diupdate oleh irwansyah tanggal 2026-09-23 - awal menyembunyikan tombol saat download Excel e-resep
      const toolbar = report.querySelector('.e-resep-toolbar');
      toolbar?.querySelectorAll('.btn-group').forEach((actions) => { actions.style.display = 'none'; });
      makeExcelFile(items, patient);
      window.setTimeout(() => {
        toolbar?.querySelectorAll('.btn-group').forEach((actions) => { actions.style.display = ''; });
      }, 1000);
      // diupdate oleh irwansyah tanggal 2026-09-23 - akhir menyembunyikan tombol saat download Excel e-resep
    });

    // diupdate oleh irwansyah tanggal 2026-09-23 - awal pengaktifan tombol group by nama dan jenis obat
    const groupedItemsContainer = host.querySelector('#e-resep-items-container');
    const setGrouping = (mode, button) => {
      if (!groupedItemsContainer || !items.length) return;
      groupedItemsContainer.innerHTML = renderGroupedTables(items, mode);
      host.querySelectorAll('[data-action="group-name"], [data-action="group-type"]').forEach((groupButton) => {
        groupButton.classList.remove('active');
      });
      button.classList.add('active');
    };

    host.querySelector('[data-action="group-name"]').addEventListener('click', function () {
      setGrouping('nama', this);
    });

    host.querySelector('[data-action="group-type"]').addEventListener('click', function () {
      setGrouping('jenis', this);
    });

    host.querySelector('[data-action="group-type"]').classList.add('active');
    // diupdate oleh irwansyah tanggal 2026-09-23 - akhir pengaktifan tombol group by nama dan jenis obat

    host.querySelector('[data-action="print"]').addEventListener('click', function () {
      hideOnPrint();
      window.addEventListener('afterprint', restoreAfterPrint, { once: true });
      setTimeout(() => {
        exportPdf(report);
        setTimeout(restoreAfterPrint, 1000);
      }, 30);
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
    const observer = new MutationObserver(() => {
      const currentTab = document.querySelector('#farmasi-tab-eresept');
      if (currentTab && currentTab.dataset.eResepReady !== 'true') {
        trigger(false);
      }
    });
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
