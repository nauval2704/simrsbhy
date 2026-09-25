(function () {
  // diupdate oleh irwansyah tanggal 2026-09-24 - awal mencegah modul dipasang berulang
  if (window.__formObatInitialized) return;
  window.__formObatInitialized = true;
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir mencegah modul dipasang berulang
  // diupdate oleh irwansyah tanggal 2026-09-23 - awal perubahan modul agar form input obat tetap menggunakan tampilan asli
  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penyimpanan modal aktif dan refresh detail obat
  const state = {
    recipes: [],
    loading: false,
    detailLoading: false,
    activeModal: null,
    openModal: null,
    selectedRecipeId: '',
    detailByRecipeId: new Map(),
    refreshTimer: null,
    modalDetails: new WeakMap(),
    renderTimers: new WeakMap(),
    renderQueued: new WeakSet(),
    rendering: new WeakSet(),
  };
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penyimpanan modal aktif dan refresh detail obat

  function getApiBaseUrl() {
    const configuredUrl = window.__APP_CONFIG__?.apiUrl || window.__ENV__?.apiUrl;
    return (configuredUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822')).replace(/\/$/, '');
  }

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal merender detail API pada semua komponen input obat
  function renderAllRecipeComponents(recipe) {
    if (!recipe?._id) return;
    document.querySelectorAll('app-input-obat').forEach((component) => {
      const owner = component.closest('.modal') || component;
      const tbody = getRecipeTable(owner);
      const expectedNames = (recipe.obat || []).map((item) => getMedicineName(item)).filter(Boolean);
      const visibleNames = Array.from(tbody?.querySelectorAll('.nama-obat-resep') || [])
        .map((cell) => cell.textContent.trim());
      if (isModalVisible(owner) && tbody && !expectedNames.every((name) => visibleNames.includes(name))) {
        renderNonChronicRows(owner, recipe);
      }
    });
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir merender detail API pada semua komponen input obat

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal memulihkan detail tersimpan setelah refresh DOM
  function renderCachedRecipeComponents() {
    const recipeId = state.selectedRecipeId;
    const detail = recipeId ? state.detailByRecipeId.get(String(recipeId)) : null;
    if (detail) renderAllRecipeComponents(detail);
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir memulihkan detail tersimpan setelah refresh DOM

  function getContext() {
    const params = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const checkinIndex = pathParts.findIndex((part) => part.toLowerCase() === 'nocheckin');
    const farmasiIndex = pathParts.findIndex((part) => part.toLowerCase() === 'farmasi');
    return {
      noCheckin: params.get('nocheckin') || params.get('noCheckin') || (checkinIndex >= 0 ? pathParts[checkinIndex + 1] : '') || (farmasiIndex >= 0 ? pathParts[farmasiIndex + 1] : ''),
      idPrmrj: params.get('idprmrj') || '',
    };
  }

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal pemfilteran obat non-kronis termasuk kronis kosong
  function isChronic(item) {
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal perlakuan obat tanpa properti kronis sebagai non-kronis
    if (!item || !Object.prototype.hasOwnProperty.call(item, 'kronis')) return false;
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir perlakuan obat tanpa properti kronis sebagai non-kronis
    return item?.kronis === true || item?.kronis === 'true' || item?.kronis === 1 || item?.kronis === '1';
  }

  function getNonChronicItems(items) {
    return Array.isArray(items) ? items.filter((item) => !isChronic(item)) : [];
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pemfilteran obat non-kronis termasuk kronis kosong

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal normalisasi nama obat resep 1
  function getMedicineName(item) {
    const nestedName = item?._id?.nama || item?._id?.namaObat || item?._id?.namaobat ||
      item?.obat?.nama || item?.obat?.namaObat || item?.obat?.namaobat ||
      item?.data?.nama || item?.data?.namaObat || item?.data?.namaobat;
    const value = item?.nama || item?.namaObat || item?.nome || item?.namaobat || nestedName;
    return Array.isArray(value) ? value.join(', ') : String(value || '').trim();
  }

  function normalizeMedicineItems(items, fallbackItems = []) {
    return getNonChronicItems(items).map((item, index) => {
      const fallback = fallbackItems[index] || {};
      const itemName = getMedicineName(item);
      const fallbackName = getMedicineName(fallback);
      return {
        ...fallback,
        ...item,
        nama: itemName || fallbackName || `Obat non-kronis ${index + 1}`,
        jumlah: item?.jumlah ?? item?.count ?? item?.qty ?? fallback?.jumlah ?? fallback?.qty,
      };
    });
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir normalisasi nama obat resep 1

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal mempertahankan seluruh item hasil detail resep
  function normalizeDetailMedicineItems(items, fallbackItems = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => {
      const fallback = fallbackItems[index] || {};
      return {
        ...item,
        nama: getMedicineName(item) || getMedicineName(fallback) || `Obat non-kronis ${index + 1}`,
        jumlah: item?.jumlah ?? item?.count ?? item?.qty ?? fallback?.jumlah ?? fallback?.qty,
      };
    });
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir mempertahankan seluruh item hasil detail resep

  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal normalisasi jumlah dan total harga obat
  function getQuantity(item) {
    const value = item?.count ?? item?.jumlah ?? item?.jumlahObat ?? item?.qty ?? item?.quantity ?? item?.jml;
    const quantity = Number(value);
    return Number.isFinite(quantity) ? quantity : 0;
  }

  function getTotalPrice(item) {
    const subtotal = item?.subtotalBPJS ?? item?.subtotalYANKES ?? item?.total ?? item?.totalHarga;
    const price = Number(subtotal);
    if (Number.isFinite(price)) return price;
    return Number(item?.hargaJualBPJS ?? item?.hargaJualYANKES ?? item?.harga ?? 0) * getQuantity(item);
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('id-ID');
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir normalisasi jumlah dan total harga obat

  function getRecipes(payload, context) {
    const recipes = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.result) ? payload.result : [];
    const exact = recipes.filter((recipe) => String(recipe?.noCheckin ?? '') === String(context.noCheckin) && (!context.idPrmrj || String(recipe?.idPrmrj ?? '') === String(context.idPrmrj)));
    return exact.length ? exact : recipes.filter((recipe) => String(recipe?.noCheckin ?? '') === String(context.noCheckin));
  }

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal normalisasi detail obat berdasarkan no checkin dan id resep
  function getRecipeDetail(payload, recipe) {
    const details = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.result)
        ? payload.result
        : Array.isArray(payload)
          ? payload
          : payload?.data && typeof payload.data === 'object'
            ? [payload.data]
            : [];
    const matchingDetail = details.find((detail) =>
      String(detail?._id ?? detail?.resepId ?? detail?.id ?? '') === String(recipe?._id ?? ''),
    ) || details[0];
    const recipeItems = getNonChronicItems(recipe?.obat);
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal menerima detail obat berbentuk array maupun satu objek
    const rawDetailItems = matchingDetail?.obat || matchingDetail?.items;
    const detailItems = Array.isArray(rawDetailItems)
      ? rawDetailItems
      : rawDetailItems && typeof rawDetailItems === 'object'
        ? [rawDetailItems]
        : [];
    if (Array.isArray(detailItems) && detailItems.length) {
      const normalizedItems = normalizeDetailMedicineItems(detailItems, recipeItems);
      return {
        ...recipe,
        ...matchingDetail,
        _id: recipe._id,
        detailFromApi: true,
        // diupdate oleh irwansyah tanggal 2026-09-24 - awal menandai item detail API sebagai non-kronis
        obat: normalizedItems.map((item) => {
          const { kronis, ...nonChronicItem } = item;
          return nonChronicItem;
        }),
        // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menandai item detail API sebagai non-kronis
      };
    }
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menerima detail obat berbentuk array maupun satu objek
    return { ...recipe, obat: normalizeMedicineItems(recipeItems) };
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir normalisasi detail obat berdasarkan no checkin dan id resep

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penentuan modal resep yang sedang dibuka
  function getOpenModal() {
    const components = [
      ...(state.openModal?.querySelectorAll?.('app-input-obat') || []),
      ...document.querySelectorAll('.modal.show app-input-obat, .modal[aria-hidden="false"] app-input-obat, app-input-obat'),
    ];
    const component = components.find((candidate) => {
      const owner = candidate.closest('.modal') || candidate;
      return owner.getAttribute('aria-hidden') !== 'true' && !owner.classList.contains('hide');
    });
    const modal = component?.closest('.modal') || component;
    if (!modal || modal.getAttribute('aria-hidden') === 'true' || modal.classList.contains('hide')) return null;
    return modal;
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penentuan modal resep yang sedang dibuka

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal pemeriksaan modal detail yang masih terlihat
  function isModalVisible(modal) {
    return Boolean(
      modal &&
      modal.getAttribute('aria-hidden') !== 'true' &&
      !modal.classList.contains('hide') &&
      (modal.matches?.('app-input-obat') || modal.querySelector('app-input-obat')),
    );
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pemeriksaan modal detail yang masih terlihat

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal pencarian tabel langsung pada komponen input obat
  function getRecipeTable(modal) {
    const component = modal?.querySelector('app-input-obat') || modal;
    const tables = Array.from(component?.querySelectorAll('table') || []);
    const listTable = tables.find((table) => {
      const tableText = table.textContent.toLowerCase();
      return tableText.includes('nama') && tableText.includes('qty') && tableText.includes('jumlah');
    });
    return modal?.querySelector('app-input-obat tbody') ||
      (listTable || tables[tables.length - 1])?.querySelector('tbody');
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pencarian tabel langsung pada komponen input obat

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal memastikan hasil API tetap terlihat setelah perubahan DOM Angular
  function keepRecipeRowsVisible(modal, recipe) {
    [0, 16, 50, 120, 250, 500].forEach((delay) => {
      window.setTimeout(() => {
        if (isModalVisible(modal)) renderNonChronicRows(modal, recipe);
      }, delay);
    });
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir memastikan hasil API tetap terlihat setelah perubahan DOM Angular

  function getRecipeForModal(modal) {
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal pencocokan resep berdasarkan id modal
    const modalRecipeId = modal.dataset.resepId ||
      modal.querySelector('[data-resep-id], [data-id-resep], input[name="resepId"], input[name="_id"]')?.value ||
      modal.querySelector('[data-resep-id], [data-id-resep]')?.getAttribute('data-resep-id') ||
      modal.querySelector('[data-id-resep]')?.getAttribute('data-id-resep');
    const selectedRecipeId = modalRecipeId || state.selectedRecipeId;
    if (selectedRecipeId) {
      const recipeById = state.recipes.find((recipe) =>
        String(recipe?._id ?? recipe?.resepId ?? recipe?.id ?? '') === String(selectedRecipeId),
      );
      if (recipeById) return recipeById;
      return { _id: selectedRecipeId, noCheckin: getContext().noCheckin, obat: [] };
    }
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pencocokan resep berdasarkan id modal
    const title = modal.querySelector('.card-header')?.textContent || '';
    const match = title.match(/RESEP\s+(\d+)/i);
    const index = match ? Number(match[1]) - 1 : -1;
    return index >= 0 ? state.recipes[index] : null;
  }

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penampilan jumlah, total, dan tombol hapus obat non-kronis
  function renderNonChronicRows(modal, recipe) {
    if (state.rendering.has(modal)) return;
    const tbody = getRecipeTable(modal);
    if (!tbody) return;
    state.rendering.add(modal);
    try {
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal menggunakan seluruh item detail API tanpa filter nama obat
    const items = (recipe?.detailFromApi ? recipe.obat : getNonChronicItems(recipe?.obat)).map((item, index) => ({
      ...item,
      nama: getMedicineName(item) || `Obat non-kronis ${index + 1}`, 
    }));
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menggunakan seluruh item detail API tanpa filter nama obat
    //console.log("render"+JSON.stringify(items));
    modal.dataset.nonChronicRowsRendered = 'true';
    const totalQuantity = items.reduce((total, item) => total + getQuantity(item), 0);
    const totalPrice = items.reduce((total, item) => total + getTotalPrice(item), 0);
    // console.log("render"+JSON.stringify(items.length));
    const rowsHtml = items.length ? items.map((item, index) => `
      <tr>
        <td>${index + 1}.</td>
        <td class="nama-obat-resep">${escapeHtml(getMedicineName(item) || '-')}</td>
        <td>${formatNumber(getQuantity(item))}</td>
        <td>${formatNumber(getTotalPrice(item))}</td>
        <td class="text-end">
          <button type="button" class="btn btn-sm btn-danger js-hapus-obat-resep" data-index="${index}">
            <i class="bi bi-trash3-fill"></i> Hapus
          </button>
        </td>
      </tr>
    `).join('') + `
      <tr class="table-light fw-bold">
        <td colspan="2" class="text-end">Total</td>
        <td>${formatNumber(totalQuantity)}</td>
        <td>${formatNumber(totalPrice)}</td>
        <td></td>
      </tr>
    ` : '<tr><td colspan="5" class="text-center text-muted">Belum ada obat non-kronis.</td></tr>';
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal pengisian langsung app-input-obat tbody
    const recipeTbody = modal.querySelector('app-input-obat tbody') || tbody;
    recipeTbody.innerHTML = rowsHtml;
    recipeTbody.hidden = false;
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pengisian langsung app-input-obat tbody
      recipeTbody.querySelectorAll('.js-hapus-obat-resep').forEach((button) => {
        button.addEventListener('click', () => deleteRecipeItem(modal, recipe, Number(button.dataset.index)));
      });
    } finally {
      state.rendering.delete(modal);
    }
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penampilan jumlah, total, dan tombol hapus obat non-kronis

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal render ulang tabel setelah Angular memperbarui modal
  function scheduleRecipeRowsRender(modal, recipe) {
    const previousTimer = state.renderTimers.get(modal);
    if (previousTimer) window.clearInterval(previousTimer);
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (!isModalVisible(modal) || attempts > 50) {
        window.clearInterval(timer);
        state.renderTimers.delete(modal);
        return;
      }
      const tbody = getRecipeTable(modal);
      const expectedNames = (recipe?.detailFromApi ? recipe.obat : getNonChronicItems(recipe?.obat))
        .map((item) => getMedicineName(item))
        .filter(Boolean);
      const visibleNames = Array.from(tbody?.querySelectorAll('.nama-obat-resep') || [])
        .map((cell) => cell.textContent.trim());
      const hasExpectedRows = expectedNames.length > 0 &&
        expectedNames.every((name) => visibleNames.includes(name));
      if (tbody && !hasExpectedRows) {
        // diupdate oleh irwansyah tanggal 2026-09-24 - awal memastikan item detail resep dipasang ke tabel
        renderNonChronicRows(modal, recipe);
        // diupdate oleh irwansyah tanggal 2026-09-24 - akhir memastikan item detail resep dipasang ke tabel
      }
    }, 100);
    state.renderTimers.set(modal, timer);
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir render ulang tabel setelah Angular memperbarui modal

  // diupdate oleh irwansyah tanggal 2026-09-24 - awal menjaga nama obat non-kronis dari penimpaan Angular
  function observeRecipeTable() {
    // Angular merender ulang isi tabel sendiri; observer global menyebabkan loop saat tbody.innerHTML berubah.
    return null;
  }
  // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menjaga nama obat non-kronis dari penimpaan Angular

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penghapusan obat resep dan pemuatan ulang data
  async function deleteRecipeItem(modal, recipe, index) {
    const item = (recipe?.obat || []).filter((entry) => !isChronic(entry))[index];
    const context = getContext();
    const nama = Array.isArray(item?.nama) ? item.nama.join(', ') : item?.nama || item?.namaobat;
    if (!context.noCheckin || !recipe?._id || !nama) return;
    try {
      const response = await fetch(`${getApiBaseUrl()}/farmasi/delete/obat/resep`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noCheckin: context.noCheckin,
          resepId: recipe._id,
          dataObat: { nama, noFaktur: item.noFaktur || '' },
        }),
      });
      if (!response.ok) throw new Error(`Gagal menghapus obat (${response.status})`);
      await loadRecipes();
      modal.dataset.resepDetailLoaded = '';
      updateOpenRecipeModal(modal);
    } catch (error) {
      console.error('Gagal menghapus obat dari resep:', error);
    }
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penghapusan obat resep dan pemuatan ulang data

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal pemuatan detail pada modal resep terpilih
  function updateOpenRecipeModal(targetModal) {
    const modal = targetModal || getOpenModal();
    if (!modal) return;
    const recipe = getRecipeForModal(modal);
    if (!recipe) return;
    const cachedDetail = state.detailByRecipeId.get(String(recipe._id));
    if (cachedDetail) {
      state.modalDetails.set(modal, cachedDetail);
      const tbody = getRecipeTable(modal);
      const expectedNames = (cachedDetail.obat || []).map((item) => getMedicineName(item)).filter(Boolean);
      const visibleNames = Array.from(tbody?.querySelectorAll('.nama-obat-resep') || [])
        .map((cell) => cell.textContent.trim());
      if (tbody && !expectedNames.every((name) => visibleNames.includes(name))) {
        renderNonChronicRows(modal, cachedDetail);
        scheduleRecipeRowsRender(modal, cachedDetail);
      }
      return;
    }
    if (modal.dataset.resepDetailLoaded === recipe._id) return;
    modal.dataset.resepId = recipe._id || '';
    loadRecipeDetail(modal, recipe);
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir pemuatan detail pada modal resep terpilih

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal penggunaan endpoint detail resep berdasarkan no checkin dan id resep
  async function loadRecipeDetail(modal, recipe) {
    const context = getContext();
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal pemuatan detail per modal tanpa memblokir modal lain
    if (!context.noCheckin || !recipe?._id || modal.dataset.resepDetailLoading === recipe._id) return;
    modal.dataset.resepDetailLoading = recipe._id;
    state.detailLoading = true;
    state.activeModal = modal;
    try {
      const response = await fetch(`${getApiBaseUrl()}/farmasi/detail/resep`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ noCheckin: context.noCheckin, _id: recipe._id, resepId: recipe._id }),
      });
      if (!response.ok) throw new Error(`Gagal mengambil detail resep (${response.status})`);
      const payload = await response.json();
      // diupdate oleh irwansyah tanggal 2026-09-24 - awal penggunaan data obat detail dan fallback resep yang sesuai
      const detail = getRecipeDetail(payload, recipe);
      // diupdate oleh irwansyah tanggal 2026-09-24 - awal menyimpan detail API berdasarkan id resep
      state.detailByRecipeId.set(String(recipe._id), detail);
      // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menyimpan detail API berdasarkan id resep
      // diupdate oleh irwansyah tanggal 2026-09-24 - awal render detail tanpa mengunci lifecycle modal
      state.modalDetails.set(modal, detail);
      if (isModalVisible(modal)) {
        modal.dataset.resepDetailLoaded = recipe._id;
        renderNonChronicRows(modal, detail);
        keepRecipeRowsVisible(modal, detail);
        scheduleRecipeRowsRender(modal, detail);
        renderAllRecipeComponents(detail);
      } else {
        window.setTimeout(() => {
          const visibleModal = getOpenModal();
          if (visibleModal) {
            state.modalDetails.set(visibleModal, detail);
            visibleModal.dataset.resepDetailLoaded = recipe._id;
            renderNonChronicRows(visibleModal, detail);
            keepRecipeRowsVisible(visibleModal, detail);
            scheduleRecipeRowsRender(visibleModal, detail);
            renderAllRecipeComponents(detail);
          }
        }, 100);
      }
      // diupdate oleh irwansyah tanggal 2026-09-24 - akhir render detail tanpa mengunci lifecycle modal
    } catch (error) {
      console.error('Gagal memuat detail obat non-kronis:', error);
    } finally {
      if (modal.dataset.resepDetailLoading === recipe._id) delete modal.dataset.resepDetailLoading;
      state.detailLoading = false;
      if (state.activeModal === modal) state.activeModal = null;
    }
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir pemuatan detail per modal tanpa memblokir modal lain
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir penggunaan endpoint detail resep berdasarkan no checkin dan id resep

  async function loadRecipes() {
    const context = getContext();
    if (!context.noCheckin || state.loading) return;
    state.loading = true;
    try {
      const response = await fetch(`${getApiBaseUrl()}/farmasi/resep`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ noCheckin: context.noCheckin, idPrmrj: context.idPrmrj || undefined }),
      });
      if (!response.ok) throw new Error(`Gagal mengambil resep (${response.status})`);
      state.recipes = getRecipes(await response.json(), context);
      updateOpenRecipeModal(state.openModal);
    } catch (error) {
      console.error('Gagal memuat obat non-kronis pada modal resep:', error);
    } finally {
      state.loading = false;
    }

  }

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal refresh setelah tombol simpan atau add list obat
  function scheduleRecipeRefresh(modal) {
    window.clearTimeout(state.refreshTimer);
    state.refreshTimer = window.setTimeout(async () => {
      await loadRecipes();
      if (modal) modal.dataset.resepDetailLoaded = '';
      updateOpenRecipeModal(modal);
    }, 500);
    window.setTimeout(async () => {
      if (state.loading) return;
      await loadRecipes();
      if (modal) modal.dataset.resepDetailLoaded = '';
      updateOpenRecipeModal(modal);
    }, 1500);
  }

  function handleRecipeAction(event) {
    const target = event.target.closest('app-input-obat form, app-input-obat button');
    if (!target) return;
    const modal = target.closest('.modal');
    if (modal) scheduleRecipeRefresh(modal);
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir refresh setelah tombol simpan atau add list obat

  // diupdate oleh irwansyah tanggal 2026-09-23 - awal perbaikan pemicu modal resep agar terbuka terlebih dahulu
  function handleModalShown(event) {
    state.openModal = event.target?.closest?.('.modal') || getOpenModal();
    window.setTimeout(() => {
      if (state.recipes.length) {
        updateOpenRecipeModal(state.openModal);
        const modal = state.openModal || getOpenModal();
        const detail = modal ? state.modalDetails.get(modal) : null;
        if (modal && detail) scheduleRecipeRowsRender(modal, detail);
      } else {
        loadRecipes();
      }
    }, 0);
  }
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir perbaikan pemicu modal resep agar terbuka terlebih dahulu

  function start() {
    // diupdate oleh irwansyah tanggal 2026-09-23 - awal pemuatan backend segera saat modal resep dibuat
    const processRecipeModal = () => {
      if (!document.querySelector('app-input-obat')) return;
      if (!state.recipes.length && !state.loading) loadRecipes();
      else updateOpenRecipeModal();
    };
    // diupdate oleh irwansyah tanggal 2026-09-23 - akhir pemuatan backend segera saat modal resep dibuat

    // diupdate oleh irwansyah tanggal 2026-09-24 - awal menyimpan id resep dari kartu yang diklik sebelum modal dibuat
    document.addEventListener('click', (event) => {
      const card = event.target.closest('app-list-resep .card.hover, app-list-resep .card');
      if (!card) return;
      const cards = Array.from(document.querySelectorAll('app-list-resep .card.hover, app-list-resep .card'));
      const index = cards.indexOf(card);
      const recipe = index >= 0 ? state.recipes[index] : null;
      const idCell = card.querySelector('tr:first-child td');
      const cardRecipeId = idCell?.textContent.trim() || '';
      // diupdate oleh irwansyah tanggal 2026-09-24 - awal memprioritaskan id resep pada kartu yang diklik
      state.selectedRecipeId = /^[a-f0-9]{24}$/i.test(cardRecipeId)
        ? cardRecipeId
        : recipe?._id || cardRecipeId;
      // diupdate oleh irwansyah tanggal 2026-09-24 - akhir memprioritaskan id resep pada kartu yang diklik
      window.setTimeout(() => {
        const modal = getOpenModal();
        if (modal) {
          if (state.recipes.length) updateOpenRecipeModal(modal);
          else loadRecipes();
        }
      }, 0);
    }, true);
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menyimpan id resep dari kartu yang diklik sebelum modal dibuat
    document.addEventListener('shown.bs.modal', handleModalShown);
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal memasang pemantau tabel obat pada modal resep
    observeRecipeTable();
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir memasang pemantau tabel obat pada modal resep
    document.addEventListener('click', handleRecipeAction, true);
    document.addEventListener('submit', handleRecipeAction, true);
    // diupdate oleh irwansyah tanggal 2026-09-24 - awal menonaktifkan observer global pemicu stack
    // Modal diproses melalui event klik, shown.bs.modal, dan timer render terbatas.
    // diupdate oleh irwansyah tanggal 2026-09-24 - akhir menonaktifkan observer global pemicu stack
    processRecipeModal();
    document.addEventListener('hidden.bs.modal', () => {
      state.activeModal = null;
      state.openModal = null;
      state.detailLoading = false;
      state.selectedRecipeId = '';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  // diupdate oleh irwansyah tanggal 2026-09-23 - akhir perubahan modul agar form input obat tetap menggunakan tampilan asli
})();
