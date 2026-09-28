// diupdate oleh irwansyah tanggal 2026-09-26 - awal fitur tab surat keterangan penyakit kronis
(function () {
  const tabId = 'farmasi-tab-from-kronis';
  const letterId = 'from-kronis-letter';
  let doctorSignatureData = '';
  let doctorSignatureReady = Promise.resolve();
  let chronicBillingItems = [];
  let checkinServiceUnit = '';
  let checkinPatientData = {};

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal helper data dan keamanan konten surat kronis
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]);
  }

  function readSidebarValue(selector) {
    return document.querySelector(selector)?.textContent?.trim() || '';
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal helper noCheckin dan konfigurasi API surat kronis
  function getNoCheckin() {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const farmasiIndex = pathParts.findIndex((part) => part.toLowerCase() === 'farmasi');
    const checkinNode = document.querySelector('#spd-noCheckin, #noCheckin, [data-no-checkin]');
    const domNoCheckin = checkinNode?.value || checkinNode?.getAttribute('data-no-checkin') || checkinNode?.textContent || '';
    return params.get('nocheckin') || params.get('noCheckin') ||
      (farmasiIndex >= 0 ? pathParts[farmasiIndex + 1] : '') ||
      String(domNoCheckin).trim().match(/\d{3,}/)?.[0] || String(domNoCheckin).trim();
  }

  function getApiBaseUrl() {
    const configuredUrl = window.__APP_CONFIG__?.apiUrl || window.__ENV__?.apiUrl ||
      (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
    return configuredUrl.replace(/\/$/, '');
  }

  function getUnitName(unit) {
    if (typeof unit === 'string' || typeof unit === 'number') return String(unit).trim();
    if (!unit || typeof unit !== 'object') return '';
    return String(unit.nama || unit.name || unit.namaPoli || unit.namapoli || unit.namaRuangan || unit.label || unit.value || '').trim();
  }

  async function loadCheckinServiceUnit() {
    const noCheckin = getNoCheckin();
    if (!noCheckin) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) return;
      const payload = await response.json();
      const checkin = (Array.isArray(payload) ? payload : payload?.data || [])[0] || {};
      const jenisPelayanan = String(checkin.jnsPelayanan || '').trim().toLowerCase();
      const selectedUnit = jenisPelayanan === 'r.jalan'
        ? getUnitName(checkin.poli)
        : jenisPelayanan === 'r.inap'
          ? getUnitName(checkin.ruangan)
          : '';
      // diupdate oleh irwansyah tanggal 2026-09-26 - awal menyimpan data peserta terbaru dari check-in
      checkinPatientData = {
        nama: checkin.nama || '',
        nomorBPJS: checkin.noKartu || '',
        nomorSEP: checkin.noSep || checkin.noSEP || '',
        diagnosis: checkin.diagnosa || checkin.diagnosis || '',
        dokter: checkin.dpjp || checkin.dokter || '',
      };
      Object.entries(checkinPatientData).forEach(([fieldName, fieldValue]) => {
        const input = document.querySelector(`[data-kronis-field="${fieldName === 'nama' ? 'namaPasien' : fieldName}"]`);
        if (input && fieldValue) input.value = fieldValue;
      });
      // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menyimpan data peserta terbaru dari check-in
      if (selectedUnit) {
        checkinServiceUnit = selectedUnit;
        // diupdate oleh irwansyah tanggal 2026-09-26 - awal mengisi Poli/UPL ke form berdasarkan rawatan
        const poliInput = document.querySelector('[data-kronis-field="poli"]');
        if (poliInput) poliInput.value = selectedUnit;
        // diupdate oleh irwansyah tanggal 2026-09-26 - akhir mengisi Poli/UPL ke form berdasarkan rawatan
        document.dispatchEvent(new CustomEvent('simrs:kronis-checkin-unit-updated', {
          detail: { poli: selectedUnit, jnsPelayanan: checkin.jnsPelayanan },
        }));
      }
      document.dispatchEvent(new CustomEvent('simrs:kronis-participant-updated', {
        detail: { participant: checkinPatientData },
      }));
    } catch (error) {
      console.error('Gagal mengambil Poli/UPL dari data check-in:', error);
    }
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir helper noCheckin dan konfigurasi API surat kronis

  function getToday() {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }

  function getPatientData() {
    return {
      nama: checkinPatientData.nama || readSidebarValue('#spd-nama'),
      nomorBPJS: checkinPatientData.nomorBPJS || readSidebarValue('#spd-noKartu'),
      diagnosis: checkinPatientData.diagnosis || readSidebarValue('#spd-diagnosa'),
      dokter: checkinPatientData.dokter || readSidebarValue('#spd-dpjp'),
      nomorSEP: checkinPatientData.nomorSEP || document.querySelector('#spd-noSEP, #noSEP, [data-no-sep]')?.textContent?.trim() || '',
      poli: checkinServiceUnit || document.querySelector('[data-kronis-field="poli"]')?.value || document.querySelector('.unit-layanan, #unitLayanan, #spd-poli')?.textContent?.trim() || '',
    };
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir helper data dan keamanan konten surat kronis

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal template hasil cetak surat kronis
  function buildLetter(data) {
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal pengisian nilai surat tanpa field entrian dokter dan obat
    const automaticValues = {
      namaDokter: data.dokter,
      poli: data.poli,
      rumahSakit: 'Rumah Sakit Bhayangkara',
    };
    const value = (name) => document.querySelector(`[data-kronis-field="${name}"]`)?.value?.trim() || automaticValues[name] || '';
    const field = (name) => escapeHtml(value(name) || '....................................................');
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir pengisian nilai surat tanpa field entrian dokter dan obat
    const sepValue = value('nomorSEP');
    const sepBoxes = Array.from({ length: 18 }, (_, index) =>
      `<span>${escapeHtml(sepValue[index] || '')}</span>`
    ).join('');
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal menyiapkan logo BPJS untuk surat permohonan
    const bpjsLogoUrl = new URL('assets/img/logoBpjs.png', document.baseURI).href;
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menyiapkan logo BPJS untuk surat permohonan
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal format uraian obat dari billing dan placeholder kosong
    const medicineList = chronicBillingItems.length
      ? chronicBillingItems.map((item) => `<li>${escapeHtml([item.nama, item.frekuensi, item.takaran].filter(Boolean).join(' '))}</li>`).join('')
      : '<li>....................................</li><li>....................................</li><li>....................................</li>';
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir format uraian obat dari billing dan placeholder kosong

    return `
      <article class="kronis-letter kronis-letter--certificate">
        <h1>SURAT KETERANGAN PENDERITA PENYAKIT KRONIS</h1>
        <p>Dokter yang bertanda tangan di bawah ini:</p>
        <table class="kronis-letter__identity">
          <tbody>
            <tr><th>Nama</th><td>: ${field('namaDokter')}</td></tr>
            <tr><th>Poli / UPL</th><td>: ${field('poli')}</td></tr>
            <tr><th>Rumah Sakit</th><td>: ${field('rumahSakit')}</td></tr>
          </tbody>
        </table>
        <p>Dengan ini menerangkan bahwa:</p>
        <table class="kronis-letter__identity">
          <tbody>
            <tr><th>Nama</th><td>: ${field('namaPasien')}</td></tr>
            <tr><th>No Peserta BPJS</th><td>: ${field('nomorBPJS')}</td></tr>
            <tr><th>No SEP</th><td>: <span class="kronis-letter__sep-boxes">${sepBoxes}</span></td></tr>
            <tr><th>Diagnosa</th><td>: ${field('diagnosis')}</td></tr>
          </tbody>
        </table>
        <p>Uraian Obat Kronis :</p>
        <ol class="kronis-letter__medicines">${medicineList}</ol>
        <p>Benar adalah penderita penyakit kronis, dan kami mohon kepada Instalasi Farmasi RS Bhayangkara agar dapat memberikan obat untuk pemakaian selama 30 hari.</p>
        <p>Demikian kami sampaikan, atas kerja samanya diucapkan terima kasih.</p>
        <footer class="kronis-letter__signer">
          <p>Banda Aceh, ${escapeHtml(getToday())}</p>
          <p>Dokter,</p>
          <div class="kronis-signature-pad">
            <canvas class="kronis-signature-pad__canvas" width="520" height="130" aria-label="Canvas tanda tangan dokter"></canvas>
            <span class="kronis-signature-pad__placeholder">Tanda tangan di sini</span>
          </div>
          <strong>${field('namaDokter')}</strong>
        </footer>
      </article>
      <article class="kronis-letter kronis-letter--request">
        <!-- diupdate oleh irwansyah tanggal 2026-09-26 - awal menambahkan logo BPJS di sisi kiri surat permohonan -->
        <img class="kronis-letter__bpjs-logo" src="${bpjsLogoUrl}" alt="BPJS Kesehatan">
        <!-- diupdate oleh irwansyah tanggal 2026-09-26 - akhir menambahkan logo BPJS di sisi kiri surat permohonan -->
        <h1>SURAT PERMOHONAN PEMBERIAN OBAT</h1>
        <p>Mohon kepada Instalasi Farmasi RS Bhayangkara Banda Aceh untuk memberikan obat sesuai tersebut di atas, untuk kebutuhan 30 hari dan tagihan terhadap obat tersebut menjadi tanggung jawab BPJS Kesehatan Kantor Cabang Banda Aceh.</p>
        <footer class="kronis-letter__signer kronis-letter__bpjs-signer">
          <p>Mengetahui,</p>
          <p>Petugas BPJS Center</p>
          <div class="kronis-letter__signature-space"></div>
          <strong>(....................................)</strong>
        </footer>
      </article>
    `;
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir template hasil cetak surat kronis

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal inisialisasi canvas tanda tangan dokter
  function initializeDoctorSignature(container, savedSignature = '') {
    const canvas = container.querySelector('.kronis-signature-pad__canvas');
    const placeholder = container.querySelector('.kronis-signature-pad__placeholder');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const setPlaceholder = (isVisible) => {
      if (placeholder) placeholder.hidden = !isVisible;
      canvas.dataset.empty = String(isVisible);
    };
    const loadSavedSignature = () => {
      if (!savedSignature) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        setPlaceholder(true);
        doctorSignatureReady = Promise.resolve();
        return;
      }
      doctorSignatureReady = new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          setPlaceholder(false);
          resolve();
        };
        image.onerror = resolve;
        image.src = savedSignature;
      });
    };

    loadSavedSignature();
    let drawing = false;
    let hasDrawn = Boolean(savedSignature);
    const getPoint = (event) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height),
      };
    };
    canvas.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      drawing = true;
      const point = getPoint(event);
      context.beginPath();
      context.moveTo(point.x, point.y);
      context.lineWidth = 2.4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#142b3a';
      if (!hasDrawn) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        hasDrawn = true;
        setPlaceholder(false);
      }
      context.beginPath();
      context.arc(point.x, point.y, 1.4, 0, Math.PI * 2);
      context.fillStyle = '#142b3a';
      context.fill();
      context.beginPath();
      context.moveTo(point.x, point.y);
      doctorSignatureData = canvas.toDataURL('image/png');
    });
    canvas.addEventListener('pointermove', (event) => {
      if (!drawing) return;
      const point = getPoint(event);
      context.lineTo(point.x, point.y);
      context.stroke();
      doctorSignatureData = canvas.toDataURL('image/png');
    });
    const stopDrawing = () => {
      if (!drawing) return;
      drawing = false;
      doctorSignatureData = canvas.toDataURL('image/png');
    };
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir inisialisasi canvas tanda tangan dokter

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal helper ekspor PDF dan Word
  function getLetterStyles() {
    return `
      @page{size:A4;margin:8mm 12mm}
      body{font-family:Arial,sans-serif;color:#111;font-size:12pt;line-height:1.55}
      .kronis-letter{box-sizing:border-box;width:100%;min-height:0;padding:0;background:#fff;color:#111;font:12pt/1.45 Arial,sans-serif}
      .kronis-letter h1{margin:0 0 16pt;text-align:center;font-size:14pt;text-decoration:underline}
      .kronis-letter p{margin:0 0 8pt}
      .kronis-letter__identity{border-collapse:collapse;margin:0 0 10pt}
      .kronis-letter__identity th{text-align:left;font-weight:400;padding-right:14pt;white-space:nowrap}
      .kronis-signature-pad{position:relative;width:190pt;height:68pt;margin:12pt auto 0}
      .kronis-signature-pad__canvas{display:block;width:100%;height:100%;touch-action:none}
      .kronis-signature-pad__placeholder{position:absolute;inset:0;display:grid;place-items:center;color:#89949b;font:italic 10pt Arial,sans-serif;pointer-events:none}
      .kronis-letter__signer{display:flex;flex-direction:column;align-items:center;width:42%;margin:30pt 0 0 auto;text-align:center}
      .kronis-letter__signer p{margin:0}
      .kronis-letter__signer strong{text-decoration:underline}
      .kronis-letter__sep-boxes{display:inline-grid;grid-template-columns:repeat(18,15pt);vertical-align:middle}
      .kronis-letter__sep-boxes span{height:16pt;border:1px solid #111;text-align:center;line-height:15pt}
      .kronis-letter__medicines{padding-left:22pt;margin:0 0 14pt}
      .kronis-letter--request{break-before:page;page-break-before:always}
      .kronis-letter__signature-space{height:80pt}
      .kronis-letter__bpjs-signer{margin-top:58pt}
      /* diupdate oleh irwansyah tanggal 2026-09-26 - awal gaya logo BPJS pada dokumen PDF */
      .kronis-letter__bpjs-logo{display:block;width:125px;height:auto;margin:0 0 8pt;object-fit:contain}
      /* diupdate oleh irwansyah tanggal 2026-09-26 - akhir gaya logo BPJS pada dokumen PDF */
    `;
  }

  function getExportFilename() {
    const name = document.querySelector('[data-kronis-field="namaPasien"]')?.value?.trim() || 'pasien';
    const safeName = name.normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-|-$/g, '');
    return `surat-kronis-${safeName || 'pasien'}`;
  }

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal builder OpenXML untuk file Word DOCX
  function escapeWordXml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    })[character]);
  }

  function makeWordParagraph(text, options = {}) {
    const paragraphProperties = [
      options.align ? `<w:jc w:val="${options.align}"/>` : '',
      options.pageBreakBefore ? '<w:pageBreakBefore/>' : '',
      options.after ? `<w:spacing w:after="${options.after}"/>` : '',
    ].filter(Boolean).join('');
    const runProperties = [
      options.bold ? '<w:b/>' : '',
      options.underline ? '<w:u w:val="single"/>' : '',
      options.size ? `<w:sz w:val="${options.size}"/>` : '',
    ].filter(Boolean).join('');
    const safeText = escapeWordXml(text);
    return `<w:p>${paragraphProperties ? `<w:pPr>${paragraphProperties}</w:pPr>` : ''}<w:r>${runProperties ? `<w:rPr>${runProperties}</w:rPr>` : ''}<w:t xml:space="preserve">${safeText}</w:t></w:r></w:p>`;
  }

  function makeWordSignatureParagraph() {
    return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="1737360" cy="622300"/><wp:docPr id="1" name="Tanda tangan dokter"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="Tanda tangan dokter"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="1737360" cy="622300"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
  }

  function buildWordDocumentXml(letter, hasSignature) {
    const paragraphs = [];
    const articles = [...letter.querySelectorAll('.kronis-letter')];
    articles.forEach((article, articleIndex) => {
      if (articleIndex > 0) paragraphs.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      [...article.children].forEach((element) => {
        if (element.matches('h1')) {
          paragraphs.push(makeWordParagraph(element.textContent.trim(), { align: 'center', bold: true, underline: true, size: 28, after: 320 }));
        } else if (element.matches('p')) {
          paragraphs.push(makeWordParagraph(element.textContent.trim(), { after: 160 }));
        } else if (element.matches('table')) {
          const rows = [...element.querySelectorAll('tr')].map((row) => {
            const cells = [...row.children].map((cell) => `<w:tc><w:tcPr><w:tcW w:w="4500" w:type="dxa"/></w:tcPr>${makeWordParagraph(cell.textContent.trim())}</w:tc>`).join('');
            return `<w:tr>${cells}</w:tr>`;
          }).join('');
          paragraphs.push(`<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="2200"/><w:gridCol w:w="6800"/></w:tblGrid>${rows}</w:tbl>`);
        } else if (element.matches('ol')) {
          [...element.querySelectorAll('li')].forEach((item, index) => {
            paragraphs.push(makeWordParagraph(`${index + 1}. ${item.textContent.trim()}`, { after: 100 }));
          });
        } else if (element.matches('footer')) {
          [...element.children].forEach((footerChild) => {
            if (footerChild.matches('p')) {
              paragraphs.push(makeWordParagraph(footerChild.textContent.trim(), { align: 'center' }));
            } else if (footerChild.matches('.kronis-signature-pad')) {
              paragraphs.push(hasSignature
                ? makeWordSignatureParagraph()
                : makeWordParagraph('Tanda tangan di sini', { align: 'center' }));
            } else if (footerChild.matches('strong')) {
              paragraphs.push(makeWordParagraph(footerChild.textContent.trim(), { align: 'center', bold: true, underline: true }));
            }
          });
        }
      });
    });

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${paragraphs.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="450" w:right="680" w:bottom="570" w:left="680"/></w:sectPr></w:body></w:document>`;
  }

  async function exportWord(letter) {
    await doctorSignatureReady;
    if (!window.JSZip) {
      window.alert('Library pembuat DOCX belum tersedia. Muat ulang halaman lalu coba kembali.');
      return;
    }

    const signatureCanvas = letter.querySelector('.kronis-signature-pad__canvas');
    const hasSignature = Boolean(signatureCanvas && signatureCanvas.dataset.empty !== 'true');
    const zip = new window.JSZip();
    zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
    zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
    zip.file('word/document.xml', buildWordDocumentXml(letter, hasSignature));

    if (hasSignature) {
      zip.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/doctor-signature.png"/></Relationships>');
      const base64Signature = signatureCanvas.toDataURL('image/png').split(',')[1];
      zip.file('word/media/doctor-signature.png', base64Signature, { base64: true });
    }

    const wordFile = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const fileUrl = URL.createObjectURL(wordFile);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = `${getExportFilename()}.docx`;
    downloadLink.click();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir builder OpenXML untuk file Word DOCX

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal ekspor PDF dengan mode unduh atau pratinjau
  async function exportPdf(letter, previewWindow = null) {
    await doctorSignatureReady;
    if (!window.html2pdf) {
      if (previewWindow) previewWindow.close();
      window.print();
      return;
    }

    const pdfWorker = window.html2pdf()
      .set({
        // diupdate oleh irwansyah tanggal 2026-09-26 - awal menghapus ruang kosong atas di setiap halaman PDF
        margin: [0, 12, 6, 12],
        // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menghapus ruang kosong atas di setiap halaman PDF
        filename: `${getExportFilename()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      })
      .from(letter);

    // diupdate oleh irwansyah tanggal 2026-09-26 - awal menampilkan PDF langsung pada tab pratinjau Cetak
    if (previewWindow) {
      const pdfBlob = await pdfWorker.outputPdf('blob');
      const previewUrl = URL.createObjectURL(pdfBlob);
      previewWindow.location.href = previewUrl;
      return;
    }
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menampilkan PDF langsung pada tab pratinjau Cetak

    await pdfWorker.save();
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir ekspor PDF dengan mode unduh atau pratinjau
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir helper ekspor PDF dan Word

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal pemasangan tab dan pratinjau surat kronis
  function installTab() {
    const kronisPane = document.querySelector('#farmasi-tab-obat-kronis');
    const tabsNav = document.querySelector('.farmasi-input-tabs');
    const tabContent = kronisPane?.parentElement;
    if (!kronisPane || !tabsNav || !tabContent || document.getElementById(tabId)) return;

    const kronisNavItem = tabsNav.querySelector('[data-bs-target="#farmasi-tab-obat-kronis"]')?.closest('.nav-item');
    if (!kronisNavItem) return;

    const newNavItem = document.createElement('li');
    newNavItem.className = 'nav-item';
    newNavItem.setAttribute('role', 'presentation');
    newNavItem.innerHTML = '<button class="nav-link" id="farmasi-tab-from-kronis-button" type="button" role="tab" data-bs-toggle="tab" data-bs-target="#farmasi-tab-from-kronis" aria-controls="farmasi-tab-from-kronis" aria-selected="false">Form  Kronis</button>';
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal meminta data billing saat tab Form Kronis diklik
    newNavItem.querySelector('button')?.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('simrs:load-kronis-billing-for-letter'));
      // diupdate oleh irwansyah tanggal 2026-09-26 - awal meminta autoload peserta saat tab Form Kronis diklik
      document.dispatchEvent(new CustomEvent('simrs:load-kronis-participant-data'));
      // diupdate oleh irwansyah tanggal 2026-09-26 - akhir meminta autoload peserta saat tab Form Kronis diklik
    });
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir meminta data billing saat tab Form Kronis diklik
    kronisNavItem.insertAdjacentElement('afterend', newNavItem);

    const patient = getPatientData();
    const pane = document.createElement('div');
    pane.id = tabId;
    pane.className = 'tab-pane fade';
    pane.setAttribute('role', 'tabpanel');
    pane.setAttribute('aria-labelledby', 'farmasi-tab-from-kronis-button');
    pane.innerHTML = `
      <style>
        /* diupdate oleh irwansyah tanggal 2026-09-26 - awal gaya form entrian dan hasil cetak */
        .from-kronis-panel{max-width:1050px;margin:20px auto;padding:22px;background:#fff;border:1px solid #d9e0e6;border-radius:8px}
        .from-kronis-panel__heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid #e2e7eb}
        .from-kronis-panel__heading-copy{flex:1}
        .from-kronis-panel__heading h2{margin:0 0 4px;font-size:20px;font-weight:700;color:#183448}
        .from-kronis-panel__heading p{margin:0;color:#647481;font-size:13px}
        .from-kronis-group{margin:0 0 18px;padding:0;border:0}
        .from-kronis-group legend{float:none;width:auto;margin:0 0 10px;padding:0;color:#315a70;font-size:14px;font-weight:700}
        .from-kronis-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 18px}
        .from-kronis-field{display:grid;gap:5px;color:#374a58;font-size:13px;font-weight:600}
        .from-kronis-field input{width:100%;min-height:40px;padding:8px 10px;border:1px solid #cbd5dc;border-radius:5px;background:#fff;color:#172b3a;font:400 14px Arial,sans-serif}
        .from-kronis-field input:focus{border-color:#377b9a;outline:3px solid #dceef5}
        .from-kronis-field--wide{grid-column:1/-1}
        .from-kronis-actions{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}
        .from-kronis-actions .btn{display:inline-flex;align-items:center;gap:7px}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - awal mengembalikan scroll Form Kronis ke halaman */
        #farmasi-tab-from-kronis{height:auto;min-height:0;overflow:visible;overscroll-behavior:auto;scrollbar-gutter:auto}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - akhir mengembalikan scroll Form Kronis ke halaman */
        .kronis-letter{max-width:900px;margin:0 auto;padding:8px 34px;background:#fff;color:#111;font:14px/1.45 Arial,sans-serif}
        .kronis-letter h1{margin:0 0 18px;text-align:center;font-size:16px;text-decoration:underline}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - awal tampilan logo BPJS pada surat permohonan */
        .kronis-letter__bpjs-logo{display:block;width:125px;height:auto;margin:0 0 8px;object-fit:contain}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - akhir tampilan logo BPJS pada surat permohonan */
        .kronis-letter__identity{border-collapse:collapse;margin:8px 0 12px}
        .kronis-letter__identity th{text-align:left;font-weight:400;padding-right:14px;white-space:nowrap}
        .kronis-signature-pad{position:relative;width:230px;height:84px;margin:14px auto 0}
        .kronis-signature-pad__canvas{display:block;width:100%;height:100%;touch-action:none;cursor:crosshair}
        .kronis-signature-pad__placeholder{position:absolute;inset:0;display:grid;place-items:center;color:#89949b;font:italic 13px Arial,sans-serif;pointer-events:none}
        .kronis-signature-pad__placeholder[hidden]{display:none}
        .kronis-letter__signer{display:flex;flex-direction:column;align-items:center;width:42%;margin:34px 0 0 auto;text-align:center}
        .kronis-letter__signer p{margin:0}
        .kronis-letter__signer strong{text-decoration:underline}
        .kronis-letter__sep-boxes{display:inline-grid;grid-template-columns:repeat(18,1.25em);vertical-align:middle}
        .kronis-letter__sep-boxes span{height:1.35em;border:1px solid #111;text-align:center;line-height:1.25em}
        .kronis-letter__medicines{padding-left:22px}
        .kronis-letter__signature-space{height:100px}
        .kronis-letter--request{break-before:page;page-break-before:always}
        .kronis-letter__bpjs-signer{margin-top:78px}
        @media(max-width:640px){.from-kronis-panel{padding:16px}.from-kronis-panel__heading{flex-direction:column}.from-kronis-controls{grid-template-columns:1fr}.from-kronis-field--wide{grid-column:auto}.from-kronis-actions{justify-content:flex-start}.kronis-letter{padding:8px 14px}.kronis-letter__signer{width:55%}}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - awal merapatkan header surat ke isi saat cetak */
        @page{size:A4;margin:2mm 10mm 6mm}
        @media print{body *{visibility:hidden!important}#farmasi-tab-from-kronis{display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important}.kronis-letter,.kronis-letter *{visibility:visible!important}.kronis-letter{position:relative;width:100%;max-width:none;min-height:0!important;margin:0!important;padding:0!important;box-shadow:none}.kronis-letter h1{margin-top:0!important;margin-bottom:6px!important;padding-top:0!important}.kronis-letter--request{break-before:page;page-break-before:always}}
        /* diupdate oleh irwansyah tanggal 2026-09-26 - akhir merapatkan header surat ke isi saat cetak */
        /* diupdate oleh irwansyah tanggal 2026-09-26 - akhir gaya form entrian dan hasil cetak */
      </style>
      <section class="from-kronis-panel">
        <header class="from-kronis-panel__heading">
          <div class="from-kronis-panel__heading-copy">
            <h2>Form Kronis</h2>
            <p>Lengkapi data peserta sebelum mengunduh atau mencetak surat.</p>
          </div>
          <div class="from-kronis-actions" aria-label="Aksi dokumen">
            <!-- diupdate oleh irwansyah tanggal 2026-09-26 - awal tombol hapus tanda tangan dokter -->
            <button type="button" class="btn btn-outline-secondary" data-kronis-action="clear-signature"><i class="bi bi-eraser"></i> Hapus TTD</button>
            <!-- diupdate oleh irwansyah tanggal 2026-09-26 - akhir tombol hapus tanda tangan dokter -->
            <button type="button" class="btn btn-outline-danger" data-kronis-action="pdf"><i class="bi bi-file-earmark-pdf"></i> PDF</button>
            <button type="button" class="btn btn-outline-primary" data-kronis-action="word"><i class="bi bi-file-earmark-word"></i> Word</button>
            <button type="button" class="btn btn-primary" data-kronis-action="print"><i class="bi bi-printer"></i> Cetak</button>
          </div>
        </header>
        <!-- diupdate oleh irwansyah tanggal 2026-09-26 - awal form entrian hanya memuat data peserta -->
        <fieldset class="from-kronis-group">
          <legend>Data Peserta</legend>
          <div class="from-kronis-controls">
            <label class="from-kronis-field">Nama Pasien<input data-kronis-field="namaPasien" value="${escapeHtml(patient.nama)}"></label>
            <label class="from-kronis-field">No Peserta BPJS<input data-kronis-field="nomorBPJS" value="${escapeHtml(patient.nomorBPJS)}"></label>
            <label class="from-kronis-field">No SEP<input data-kronis-field="nomorSEP" value="${escapeHtml(patient.nomorSEP)}" maxlength="18" inputmode="numeric"></label>
            <label class="from-kronis-field">Diagnosa<input data-kronis-field="diagnosis" value="${escapeHtml(patient.diagnosis)}"></label>
          </div>
        </fieldset>
        <!-- diupdate oleh irwansyah tanggal 2026-09-26 - akhir form entrian kronis tanpa field dokter dan uraian obat -->
      </section>
      <div id="${letterId}"></div>
    `;
    tabContent.appendChild(pane);

    const refreshLetter = () => {
      pane.querySelector(`#${letterId}`).innerHTML = buildLetter(getPatientData());
      initializeDoctorSignature(pane.querySelector(`#${letterId}`), doctorSignatureData);
    };
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal menerima perubahan billing obat kronis
    document.addEventListener('simrs:kronis-billing-updated', (event) => {
      chronicBillingItems = Array.isArray(event.detail?.items) ? event.detail.items : [];
      refreshLetter();
    });
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menerima perubahan billing obat kronis
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal memuat Poli/UPL berdasarkan jenis pelayanan check-in
    document.addEventListener('simrs:kronis-checkin-unit-updated', refreshLetter);
    loadCheckinServiceUnit().then(refreshLetter);
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir memuat Poli/UPL berdasarkan jenis pelayanan check-in
    // diupdate oleh irwansyah tanggal 2026-09-26 - awal memuat ulang data peserta saat tab Form Kronis dibuka
    document.addEventListener('simrs:load-kronis-participant-data', () => {
      loadCheckinServiceUnit().then(refreshLetter);
    });
    document.addEventListener('simrs:kronis-participant-updated', refreshLetter);
    // diupdate oleh irwansyah tanggal 2026-09-26 - akhir memuat ulang data peserta saat tab Form Kronis dibuka
    pane.addEventListener('input', refreshLetter);
    pane.addEventListener('click', async (event) => {
      const action = event.target.closest('[data-kronis-action]')?.dataset.kronisAction;
      const letter = pane.querySelector(`#${letterId}`);
      if (!action || !letter) return;

      // diupdate oleh irwansyah tanggal 2026-09-26 - awal menghapus state tanda tangan dan menampilkan placeholder
      if (action === 'clear-signature') {
        doctorSignatureData = '';
        doctorSignatureReady = Promise.resolve();
        refreshLetter();
        return;
      }
      // diupdate oleh irwansyah tanggal 2026-09-26 - akhir menghapus state tanda tangan dan menampilkan placeholder

      if (action === 'print') {
        // diupdate oleh irwansyah tanggal 2026-09-26 - awal tombol Cetak membuka hasil PDF untuk pratinjau
        const previewWindow = window.open('about:blank', '_blank');
        if (!previewWindow) {
          window.alert('Izinkan pop-up untuk menampilkan pratinjau PDF.');
          return;
        }
        refreshLetter();
        exportPdf(letter, previewWindow);
        // diupdate oleh irwansyah tanggal 2026-09-26 - akhir tombol Cetak membuka hasil PDF untuk pratinjau
      }
      if (action === 'pdf') {
        refreshLetter();
        exportPdf(letter);
      }
      if (action === 'word') {
        refreshLetter();
        exportWord(letter);
      }
    });
    refreshLetter();
  }
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir pemasangan tab dan pratinjau surat kronis

  // diupdate oleh irwansyah tanggal 2026-09-26 - awal deteksi tab Farmasi yang dirender dinamis
  const observer = new MutationObserver(installTab);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  installTab();
  // diupdate oleh irwansyah tanggal 2026-09-26 - akhir deteksi tab Farmasi yang dirender dinamis
})();
// diupdate oleh irwansyah tanggal 2026-09-26 - akhir fitur tab surat keterangan penyakit kronis