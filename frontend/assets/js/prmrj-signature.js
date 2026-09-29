// Gunakan tanda tangan PRMRJ sebagai default bersama hanya untuk kunjungan rawat jalan dengan DPJP yang cocok.
(function () {
  const signatureRequests = new Map();
  const signatureVersions = new Map();
  const publishedSignatures = new Map();
  const signatureRefreshTimes = new Map();
  let signatureRefreshTimer = 0;
  let signatureRefreshCheckin = '';
  let signatureRefreshEventsBound = false;

  function refreshVisiblePatientSignature() {
    if (document.visibilityState === 'hidden' || !signatureRefreshCheckin) return;
    window.getPrmrjDefaultSignature(signatureRefreshCheckin, true).catch((error) => {
      console.error('Gagal memperbarui tanda tangan PRMRJ:', error);
    });
  }

  function publishLatestSignature(noCheckin, signature) {
    if (!signature || publishedSignatures.get(noCheckin) === signature) return;
    publishedSignatures.set(noCheckin, signature);
    document.dispatchEvent(new CustomEvent('simrs:prmrj-signature-updated', {
      detail: { noCheckin, signature },
    }));
  }

  function startSignatureRefresh(noCheckin) {
    if (!noCheckin) return;
    signatureRefreshCheckin = noCheckin;
    if (!signatureRefreshEventsBound) {
      document.addEventListener('visibilitychange', refreshVisiblePatientSignature);
      window.addEventListener('focus', refreshVisiblePatientSignature);
      signatureRefreshEventsBound = true;
    }
    if (signatureRefreshTimer) window.clearInterval(signatureRefreshTimer);
    signatureRefreshTimer = window.setInterval(refreshVisiblePatientSignature, 15000);
  }

  function getApiBaseUrl() {
    const configuredUrl = window.__APP_CONFIG__?.apiUrl || window.__ENV__?.apiUrl;
    return (configuredUrl || (window.location.hostname === 'localhost'
      ? 'http://localhost:1822'
      : 'http://36.66.36.106:1822')).replace(/\/$/, '');
  }

  function normalizeDoctorName(value) {
    return String(value || '')
      // Nama dokter PRMRJ kadang memiliki gelar spesialis setelah koma, sementara DPJP check-in tidak.
      .replace(/,\s*(?:sp|m|s)\.?\s*[\s\S]*$/i, '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('id-ID')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function hasVisibleInk(imageData) {
    const pixels = imageData.data;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] > 15 && (pixels[index] < 245 || pixels[index + 1] < 245 || pixels[index + 2] < 245)) {
        return true;
      }
    }
    return false;
  }

  function isNonEmptySignature(signature) {
    if (typeof signature !== 'string' || !signature.startsWith('data:image/')) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth || image.width;
        canvas.height = image.naturalHeight || image.height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context || !canvas.width || !canvas.height) {
          resolve(false);
          return;
        }
        context.drawImage(image, 0, 0);
        resolve(hasVisibleInk(context.getImageData(0, 0, canvas.width, canvas.height)));
      };
      image.onerror = () => resolve(false);
      image.src = signature;
    });
  }

  async function loadDefaultSignature(noCheckin) {
    if (!noCheckin) return null;

    const apiBaseUrl = getApiBaseUrl();
    const [patientResponse, prmrjResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/simrsba/caripasiennocheckin/${encodeURIComponent(noCheckin)}`, { cache: 'no-store' }),
      fetch(`${apiBaseUrl}/simrsba/prmrj/${encodeURIComponent(noCheckin)}`, { cache: 'no-store' }),
    ]);
    if (!patientResponse.ok) throw new Error(`Gagal mengambil data pasien (${patientResponse.status})`);
    if (!prmrjResponse.ok) throw new Error(`Gagal mengambil data PRMRJ (${prmrjResponse.status})`);

    const [patientPayload, prmrjPayload] = await Promise.all([
      patientResponse.json(),
      prmrjResponse.json(),
    ]);
    const patients = Array.isArray(patientPayload)
      ? patientPayload
      : Array.isArray(patientPayload?.data)
        ? patientPayload.data
        : [];
    const patient = patients.find((item) => String(item?.noCheckin ?? '') === String(noCheckin));
    if (String(patient?.jnsPelayanan || '').trim().toLocaleLowerCase('id-ID') !== 'r.jalan') {
      return null;
    }

    const dpjp = normalizeDoctorName(
      patient.dokterDpjp || patient.dpjp || patient.namaDokter || patient.dokter,
    );
    if (!dpjp) return null;

    const prmrj = prmrjPayload?.data;
    const entries = Array.isArray(prmrj?.formData?.entries)
      ? prmrj.formData.entries
      : Array.isArray(prmrj?.entries)
        ? prmrj.entries
        : [];
    const matchingEntries = entries
      .map((entry, index) => {
        const entryDate = entry?.updatedAt || entry?.updated_at || entry?.createdAt ||
          entry?.created_at || entry?.tglJam || entry?.tglDate || '';
        const timestamp = Date.parse(String(entryDate).replace(' ', 'T')) || 0;
        return { entry, index, timestamp };
      })
      .filter(({ entry }) =>
        normalizeDoctorName(entry?.drSp) === dpjp &&
        typeof entry?.parafImg === 'string' &&
        entry.parafImg.trim() !== ''
      )
      // Utamakan tanggal tanda tangan terbaru, lalu check-in aktif bila tanggalnya sama.
      .sort((left, right) =>
        right.timestamp - left.timestamp ||
        Number(String(right.entry?.noCheckin ?? '') === String(noCheckin)) -
          Number(String(left.entry?.noCheckin ?? '') === String(noCheckin)) ||
        right.index - left.index
      );

    for (const { entry } of matchingEntries) {
      if (await isNonEmptySignature(entry.parafImg)) return entry.parafImg;
    }
    return null;
  }

  // Tipiskan satu lapis piksel tanda tangan pada salinan export, tanpa mengubah canvas asli.
  function createThinSignatureExportDataUrl(sourceCanvas) {
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width;
    exportCanvas.height = height;
    const context = exportCanvas.getContext('2d', { willReadFrequently: true });
    if (!context || !width || !height) {
      throw new Error('Canvas export tanda tangan tidak tersedia.');
    }

    context.drawImage(sourceCanvas, 0, 0);
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    const ink = new Uint8Array(width * height);
    const removed = new Uint8Array(width * height);
    for (let index = 0; index < ink.length; index += 1) {
      const pixel = index * 4;
      ink[index] = pixels[pixel + 3] > 16 &&
        (pixels[pixel] < 220 || pixels[pixel + 1] < 220 || pixels[pixel + 2] < 220) ? 1 : 0;
    }

    // Satu iterasi Zhang-Suen mengurangi pinggiran tinta sambil mempertahankan bentuk goresan.
    for (let phase = 0; phase < 2; phase += 1) {
      removed.fill(0);
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const index = y * width + x;
          if (!ink[index]) continue;
          const neighbors = [
            ink[index - width],
            ink[index - width + 1],
            ink[index + 1],
            ink[index + width + 1],
            ink[index + width],
            ink[index + width - 1],
            ink[index - 1],
            ink[index - width - 1],
          ];
          const neighborCount = neighbors.reduce((total, value) => total + value, 0);
          if (neighborCount < 2 || neighborCount > 6) continue;
          let transitions = 0;
          for (let neighbor = 0; neighbor < neighbors.length; neighbor += 1) {
            if (!neighbors[neighbor] && neighbors[(neighbor + 1) % neighbors.length]) transitions += 1;
          }
          if (transitions !== 1) continue;
          const [north, , east, , south, , west] = neighbors;
          if (phase === 0
            ? north * east * south !== 0 || east * south * west !== 0
            : north * east * west !== 0 || north * south * west !== 0) continue;
          removed[index] = 1;
        }
      }
      for (let index = 0; index < ink.length; index += 1) {
        if (!removed[index]) continue;
        ink[index] = 0;
        const pixel = index * 4;
        if (pixels[pixel + 3] === 255) {
          pixels[pixel] = 255;
          pixels[pixel + 1] = 255;
          pixels[pixel + 2] = 255;
        } else {
          pixels[pixel + 3] = 0;
        }
      }
    }

    context.putImageData(imageData, 0, 0);
    return exportCanvas.toDataURL('image/png');
  }

  // Cache per check-in mencegah tiap canvas mengulang permintaan pasien dan PRMRJ yang sama.
  window.getPrmrjDefaultSignature = function (noCheckin, refresh = false) {
    const key = String(noCheckin || '');
    startSignatureRefresh(key);
    // Tab yang dibuka ulang mengambil tanda tangan PRMRJ terbaru, bukan hanya hasil cache awal halaman.
    const lastRefresh = signatureRefreshTimes.get(key) || 0;
    if (refresh && signatureRequests.has(key) && Date.now() - lastRefresh < 5000) {
      return signatureRequests.get(key);
    }
    if (refresh) signatureRequests.delete(key);
    if (!signatureRequests.has(key)) {
      const version = (signatureVersions.get(key) || 0) + 1;
      signatureVersions.set(key, version);
      if (refresh) signatureRefreshTimes.set(key, Date.now());
      const request = loadDefaultSignature(key).then((signature) => {
        if (signatureVersions.get(key) === version) publishLatestSignature(key, signature);
        return signature;
      });
      signatureRequests.set(key, request);
    }
    return signatureRequests.get(key);
  };
  window.createThinSignatureExportDataUrl = createThinSignatureExportDataUrl;
})();
