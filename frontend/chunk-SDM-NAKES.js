import { a as i } from "./chunk-W7XVFZVJ.js";
import {
  Db as f,
  gc as n,
  hc as oe,
  Ec as p,
} from "./chunk-UYVTZL26.js";

var SdmNakesComponent = (() => {
  class t {
    constructor() {
      this.nakesList = [];
    }
    ngOnInit() {
      setTimeout(() => {
        this.renderUI();
        this.loadData();
      }, 50);
    }
    loadData() {
      const host = document.querySelector('app-sdm-nakes');
      if (!host) return;
      let token = '';
      try {
        const rawAccess = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (rawAccess) {
          try { token = JSON.parse(rawAccess); } catch (e) { token = rawAccess; }
        }
        if (!token) {
          const rawUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
          if (rawUser) {
            const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
            token = parsed.idToken || parsed.token || parsed.id || '';
          }
        }
        if (!token) {
          token = localStorage.getItem('idToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || '';
        }
      } catch (e) {}

      const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
      fetch(apiUrl + '/simrsba/listnakesuser', {
        headers: { 'x-token': token, 'Authorization': 'Bearer ' + token }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            this.nakesList = data.data || [];
            this.renderTable();
          }
        })
        .catch(err => console.error(err));
    }
    renderUI() {
      const host = document.querySelector('app-sdm-nakes');
      if (!host) return;
      host.innerHTML = `
        <div class="card shadow-sm border rounded">
          <div class="card-header fw-bold text-white d-flex justify-content-between align-items-center" style="background-color: #4b3c08; border-bottom: 1px solid #362b05;">
            <span style="font-size: 1.05rem;">Data Nakes & Akun User SIMRS</span>
            <button class="btn btn-warning btn-sm fw-bold text-dark" id="btn-open-modal-nk" style="background-color: #ffc107; border-color: #ffc107;">+ Tambah Nakes & Link User</button>
          </div>
          <div class="card-body p-3">
            <div class="mb-3">
              <input type="text" id="nk-search" class="form-control form-control-sm" placeholder="Search" style="border-radius: 4px; padding: 6px 12px;" />
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle border mb-0" style="border-collapse: collapse; width: 100%;">
                <thead>
                  <tr style="background-color: #1f2328; color: #ffffff; text-transform: uppercase; font-size: 0.85rem; font-weight: bold;">
                    <th class="py-2 px-3 text-start" style="width: 110px; background-color: #1f2328; color: #fff;">HAK AKSES</th>
                    <th class="py-2 px-2 text-center" style="width: 45px; background-color: #1f2328; color: #fff;">#</th>
                    <th class="py-2 px-3" style="background-color: #1f2328; color: #fff;">USERNAME</th>
                    <th class="py-2 px-3" style="background-color: #1f2328; color: #fff;">NAMA</th>
                    <th class="py-2 px-3" style="background-color: #1f2328; color: #fff;">ROLE</th>
                    <th class="py-2 px-3" style="background-color: #1f2328; color: #fff;">KODE DPJP</th>
                    <th class="py-2 px-3" style="background-color: #1f2328; color: #fff;">KATEGORI</th>
                  </tr>
                </thead>
                <tbody id="nk-table-body" style="font-size: 0.9rem;">
                  <tr><td colspan="7" class="text-center text-muted py-4">Memuat data Nakes & User...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Pendaftaran & Linking Nakes -->
        <div class="modal fade" id="modal-tambah-nakes" tabindex="-1" style="display: none; background: rgba(0,0,0,0.5); z-index: 1050;">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header text-white" style="background-color: #4b3c08;">
                <h5 class="modal-title fw-bold m-0" style="font-size: 1.05rem;">Form Pendaftaran & Linking Akun Nakes</h5>
                <button type="button" class="btn-close btn-close-white btn-close-modal-nk" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <!-- Mode Switcher Tabs -->
                <div class="d-flex border-bottom mb-4">
                  <button class="btn btn-warning text-dark me-2 fw-bold btn-nk-tab" id="tab-btn-new-nk" style="border-radius: 4px;">Buat Akun & Nakes Baru</button>
                  <button class="btn btn-outline-secondary text-dark fw-bold btn-nk-tab" id="tab-btn-link-nk" style="border-radius: 4px;">Pilih dari Akun Terdaftar</button>
                </div>

                <!-- Mode 1: Form Buat Akun Baru -->
                <form id="form-nk-new" class="nk-form-pane">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Nama Lengkap Dokter / Nakes</label>
                      <input type="text" id="nk-new-nama" class="form-control form-control-sm" placeholder="Contoh: dr. Rina Sabrina" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Email (Username Otomatis)</label>
                      <input type="email" id="nk-new-email" class="form-control form-control-sm" placeholder="Contoh: rina.sabrina@simrs.id" required />
                      <div class="form-text small text-muted">Username handle: <strong id="nk-new-user-preview" class="text-primary">-</strong></div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Password</label>
                      <input type="password" id="nk-new-password" class="form-control form-control-sm" placeholder="Password akun" required />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Role Hak Akses</label>
                      <select id="nk-new-role" class="form-select form-select-sm">
                        <option value="ROLE_IGD">ROLE_IGD (Dokter / Petugas IGD)</option>
                        <option value="ROLE_POLI" selected>ROLE_POLI (Dokter / Petugas Poliklinik)</option>
                        <option value="ROLE_INAP">ROLE_INAP (Dokter / Petugas Rawat Inap)</option>
                        <option value="ROLE_SDM">ROLE_SDM (Sumber Daya Manusia)</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN (Administrator)</option>
                        <option value="ROLE_APOTEK">ROLE_APOTEK (Farmasi / Apotek Utama)</option>
                        <option value="ROLE_GUDANG">ROLE_GUDANG (Gudang Farmasi Central)</option>
                        <option value="ROLE_DEPO_IGD">ROLE_DEPO_IGD (Depo Farmasi IGD)</option>
                        <option value="ROLE_DEPO_INAP">ROLE_DEPO_INAP (Depo Farmasi Rawat Inap)</option>
                        <option value="ROLE_LAB">ROLE_LAB (Laboratorium)</option>
                        <option value="ROLE_RADIOLOGI">ROLE_RADIOLOGI (Radiologi)</option>
                        <option value="ROLE_KEUANGAN">ROLE_KEUANGAN (Keuangan)</option>
                        <option value="ROLE_BILLING">ROLE_BILLING (Kasir / Billing)</option>
                        <option value="ROLE_REG">ROLE_REG (Pendaftaran / Admisi)</option>
                        <option value="ROLE_USER">ROLE_USER (User Umum)</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Kode DPJP (BPJS)</label>
                      <input type="text" id="nk-new-kodedpjp" class="form-control form-control-sm" placeholder="Opsional (Contoh: 260142)" />
                    </div>
                  </div>
                  <div class="mt-4 text-end">
                    <button type="button" class="btn btn-secondary btn-sm me-2 btn-close-modal-nk">Batal</button>
                    <button type="submit" class="btn btn-success btn-sm fw-bold">Simpan & Daftarkan Akun</button>
                  </div>
                </form>

                <!-- Mode 2: Form Link Akun Terdaftar -->
                <form id="form-nk-link" class="nk-form-pane" style="display: none;">
                  <div class="row g-3">
                    <div class="col-md-12">
                      <label class="form-label fw-bold small">Cari & Pilih Akun User Terdaftar (Unlinked)</label>
                      <input type="text" id="nk-link-search-user" class="form-control form-control-sm mb-2" placeholder="Ketik nama atau username untuk mencari..." />
                      <select id="nk-link-select-user" class="form-select form-select-sm" required>
                        <option value="">-- Memuat daftar user unlinked... --</option>
                      </select>
                      <div class="form-text small text-muted">Ketik pada kotak pencarian di atas untuk memfilter daftar akun user.</div>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Nama Nakes (Otomatis / Edit)</label>
                      <input type="text" id="nk-link-nama" class="form-control form-control-sm" placeholder="Nama Nakes" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Kode DPJP (BPJS)</label>
                      <input type="text" id="nk-link-kodedpjp" class="form-control form-control-sm" placeholder="Opsional (Contoh: 260142)" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Role Hak Akses</label>
                      <select id="nk-link-role" class="form-select form-select-sm">
                        <option value="ROLE_IGD">ROLE_IGD (Dokter / Petugas IGD)</option>
                        <option value="ROLE_POLI" selected>ROLE_POLI (Dokter / Petugas Poliklinik)</option>
                        <option value="ROLE_INAP">ROLE_INAP (Dokter / Petugas Rawat Inap)</option>
                        <option value="ROLE_SDM">ROLE_SDM (Sumber Daya Manusia)</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN (Administrator)</option>
                        <option value="ROLE_APOTEK">ROLE_APOTEK (Farmasi / Apotek Utama)</option>
                        <option value="ROLE_GUDANG">ROLE_GUDANG (Gudang Farmasi Central)</option>
                        <option value="ROLE_DEPO_IGD">ROLE_DEPO_IGD (Depo Farmasi IGD)</option>
                        <option value="ROLE_DEPO_INAP">ROLE_DEPO_INAP (Depo Farmasi Rawat Inap)</option>
                        <option value="ROLE_LAB">ROLE_LAB (Laboratorium)</option>
                        <option value="ROLE_RADIOLOGI">ROLE_RADIOLOGI (Radiologi)</option>
                        <option value="ROLE_KEUANGAN">ROLE_KEUANGAN (Keuangan)</option>
                        <option value="ROLE_BILLING">ROLE_BILLING (Kasir / Billing)</option>
                        <option value="ROLE_REG">ROLE_REG (Pendaftaran / Admisi)</option>
                        <option value="ROLE_USER">ROLE_USER (User Umum)</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Kategori Nakes</label>
                      <select id="nk-link-kategori" class="form-select form-select-sm">
                        <option value="DOKTER" selected>DOKTER</option>
                        <option value="PERAWAT">PERAWAT</option>
                        <option value="STAF">STAF</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 text-end">
                    <button type="button" class="btn btn-secondary btn-sm me-2 btn-close-modal-nk">Batal</button>
                    <button type="submit" class="btn btn-warning btn-sm fw-bold text-dark" style="background-color: #ffc107; border-color: #ffc107;">Link Akun User ke Nakes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- Modal Edit Data Nakes & Akun -->
        <div class="modal fade" id="modal-edit-nakes" tabindex="-1" style="display: none; background: rgba(0,0,0,0.5); z-index: 1050;">
          <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg">
              <div class="modal-header text-white" style="background-color: #4b3c08;">
                <h5 class="modal-title fw-bold m-0" style="font-size: 1.05rem;">Edit Data Nakes & Akun User</h5>
                <button type="button" class="btn-close btn-close-white btn-close-modal-edit-nk" aria-label="Close"></button>
              </div>
              <div class="modal-body p-4">
                <form id="form-nk-edit">
                  <input type="hidden" id="nk-edit-userid" />
                  <input type="hidden" id="nk-edit-nakesid" />
                  <input type="hidden" id="nk-edit-username" />
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Nama Lengkap Dokter / Nakes</label>
                      <input type="text" id="nk-edit-nama" class="form-control form-control-sm" required />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label fw-bold small">Email / Username</label>
                      <input type="email" id="nk-edit-email" class="form-control form-control-sm" placeholder="Contoh: rina.sabrina@simrs.id" />
                      <div class="form-text small text-muted">Username aktif: <strong id="nk-edit-user-display" class="text-primary">-</strong></div>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Password Baru (Opsional)</label>
                      <input type="password" id="nk-edit-password" class="form-control form-control-sm" placeholder="Kosongkan jika tak diubah" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Role Hak Akses</label>
                      <select id="nk-edit-role" class="form-select form-select-sm">
                        <option value="ROLE_IGD">ROLE_IGD (Dokter / Petugas IGD)</option>
                        <option value="ROLE_POLI">ROLE_POLI (Dokter / Petugas Poliklinik)</option>
                        <option value="ROLE_INAP">ROLE_INAP (Dokter / Petugas Rawat Inap)</option>
                        <option value="ROLE_SDM">ROLE_SDM (Sumber Daya Manusia)</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN (Administrator)</option>
                        <option value="ROLE_APOTEK">ROLE_APOTEK (Farmasi / Apotek Utama)</option>
                        <option value="ROLE_GUDANG">ROLE_GUDANG (Gudang Farmasi Central)</option>
                        <option value="ROLE_DEPO_IGD">ROLE_DEPO_IGD (Depo Farmasi IGD)</option>
                        <option value="ROLE_DEPO_INAP">ROLE_DEPO_INAP (Depo Farmasi Rawat Inap)</option>
                        <option value="ROLE_LAB">ROLE_LAB (Laboratorium)</option>
                        <option value="ROLE_RADIOLOGI">ROLE_RADIOLOGI (Radiologi)</option>
                        <option value="ROLE_KEUANGAN">ROLE_KEUANGAN (Keuangan)</option>
                        <option value="ROLE_BILLING">ROLE_BILLING (Kasir / Billing)</option>
                        <option value="ROLE_REG">ROLE_REG (Pendaftaran / Admisi)</option>
                        <option value="ROLE_USER">ROLE_USER (User Umum)</option>
                      </select>
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Kode DPJP (BPJS)</label>
                      <input type="text" id="nk-edit-kodedpjp" class="form-control form-control-sm" placeholder="Opsional (Contoh: 260142)" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label fw-bold small">Kategori Nakes</label>
                      <select id="nk-edit-kategori" class="form-select form-select-sm">
                        <option value="DOKTER">DOKTER</option>
                        <option value="PERAWAT">PERAWAT</option>
                        <option value="STAF">STAF</option>
                      </select>
                    </div>
                  </div>
                  <div class="mt-4 text-end">
                    <button type="button" class="btn btn-secondary btn-sm me-2 btn-close-modal-edit-nk">Batal</button>
                    <button type="submit" class="btn btn-warning btn-sm fw-bold text-dark" style="background-color: #ffc107; border-color: #ffc107;">Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;

      const modal = host.querySelector('#modal-tambah-nakes');
      const modalEdit = host.querySelector('#modal-edit-nakes');
      const openModalBtn = host.querySelector('#btn-open-modal-nk');
      const searchInput = host.querySelector('#nk-search');
      const tabNewBtn = host.querySelector('#tab-btn-new-nk');
      const tabLinkBtn = host.querySelector('#tab-btn-link-nk');
      const formNew = host.querySelector('#form-nk-new');
      const formLink = host.querySelector('#form-nk-link');
      const formEdit = host.querySelector('#form-nk-edit');
      const newEmailInput = host.querySelector('#nk-new-email');
      const newUserPreview = host.querySelector('#nk-new-user-preview');
      const linkSelectUser = host.querySelector('#nk-link-select-user');
      const linkSearchInput = host.querySelector('#nk-link-search-user');
      let unlinkedUsersCache = [];

      const openModal = () => {
        modal.style.display = 'block';
        modal.classList.add('show');
        loadUnlinkedUsers();
      };

      const closeModal = () => {
        modal.style.display = 'none';
        modal.classList.remove('show');
      };

      const closeEditModal = () => {
        modalEdit.style.display = 'none';
        modalEdit.classList.remove('show');
      };

      if (openModalBtn) openModalBtn.onclick = openModal;
      host.querySelectorAll('.btn-close-modal-nk').forEach(btn => btn.onclick = closeModal);
      host.querySelectorAll('.btn-close-modal-edit-nk').forEach(btn => btn.onclick = closeEditModal);

      if (tabNewBtn && tabLinkBtn) {
        tabNewBtn.onclick = () => {
          tabNewBtn.className = 'btn btn-warning text-dark me-2 fw-bold btn-nk-tab';
          tabLinkBtn.className = 'btn btn-outline-secondary text-dark fw-bold btn-nk-tab';
          formNew.style.display = 'block';
          formLink.style.display = 'none';
        };
        tabLinkBtn.onclick = () => {
          tabLinkBtn.className = 'btn btn-warning text-dark me-2 fw-bold btn-nk-tab';
          tabNewBtn.className = 'btn btn-outline-secondary text-dark me-2 fw-bold btn-nk-tab';
          formLink.style.display = 'block';
          formNew.style.display = 'none';
          loadUnlinkedUsers();
        };
      }

      if (newEmailInput) {
        newEmailInput.oninput = () => {
          const val = newEmailInput.value.trim().toLowerCase();
          newUserPreview.textContent = val || '-';
        };
      }

      const renderUnlinkedOptions = (filterText = '') => {
        const term = filterText.toLowerCase().trim();
        const filtered = unlinkedUsersCache.filter(u => {
          if (!term) return true;
          const nama = (u.nama || '').toLowerCase();
          const username = (u.username || '').toLowerCase();
          const role = (u.role || '').toLowerCase();
          return nama.includes(term) || username.includes(term) || role.includes(term);
        });

        if (filtered.length === 0) {
          linkSelectUser.innerHTML = '<option value="">-- Tidak ada user unlinked cocok --</option>';
          return;
        }

        linkSelectUser.innerHTML = '<option value="">-- Pilih Akun User (' + filtered.length + ' akun) --</option>' +
          filtered.map(u => `<option value="${u._id}">[${u.username}] ${u.nama} (${u.role || 'ROLE_USER'})</option>`).join('');
      };

      const getHeaders = (extra = {}) => {
        let token = '';
        try {
          const rawAccess = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
          if (rawAccess) {
            try { token = JSON.parse(rawAccess); } catch (e) { token = rawAccess; }
          }
          if (!token) {
            const rawUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
            if (rawUser) {
              const parsed = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
              token = parsed.idToken || parsed.token || parsed.id || '';
            }
          }
          if (!token) {
            token = localStorage.getItem('idToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || '';
          }
        } catch (e) {}
        return Object.assign({ 'Content-Type': 'application/json', 'x-token': token, 'Authorization': 'Bearer ' + token }, extra);
      };

      const loadUnlinkedUsers = () => {
        const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
        fetch(apiUrl + '/simrsba/unlinkedusers', { headers: getHeaders() })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'success') {
              unlinkedUsersCache = res.data || [];
              if (linkSearchInput) linkSearchInput.value = '';
              renderUnlinkedOptions();
            }
          })
          .catch(err => console.error(err));
      };

      if (linkSearchInput) {
        linkSearchInput.oninput = (e) => {
          renderUnlinkedOptions(e.target.value);
        };
      }

      if (linkSelectUser) {
        linkSelectUser.onchange = () => {
          const selectedId = linkSelectUser.value;
          const user = unlinkedUsersCache.find(u => String(u._id) === selectedId);
          if (user) {
            host.querySelector('#nk-link-nama').value = user.nama || '';
            if (user.role) host.querySelector('#nk-link-role').value = user.role;
            if (user.kodedpjp) host.querySelector('#nk-link-kodedpjp').value = user.kodedpjp;
          }
        };
      }

      if (formNew) {
        formNew.onsubmit = (e) => {
          e.preventDefault();
          const payload = {
            nama: host.querySelector('#nk-new-nama').value.trim(),
            email: newEmailInput.value.trim(),
            password: host.querySelector('#nk-new-password').value,
            role: host.querySelector('#nk-new-role').value,
            kodedpjp: host.querySelector('#nk-new-kodedpjp').value.trim(),
            kategori: "DOKTER",
          };

          const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
          fetch(apiUrl + '/simrsba/createnakesuser', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'success') {
              alert('Nakes & Akun User Berhasil Didaftarkan!\nUsername: ' + res.data.username);
              closeModal();
              formNew.reset();
              newUserPreview.textContent = '-';
              this.loadData();
            } else {
              alert('Gagal: ' + res.message);
            }
          })
          .catch(err => alert('Error: ' + err.message));
        };
      }

      if (formLink) {
        formLink.onsubmit = (e) => {
          e.preventDefault();
          const selectedId = linkSelectUser.value;
          if (!selectedId) {
            alert('Pilih akun user terdaftar.');
            return;
          }
          const payload = {
            userId: selectedId,
            nama: host.querySelector('#nk-link-nama').value.trim(),
            role: host.querySelector('#nk-link-role').value,
            kodedpjp: host.querySelector('#nk-link-kodedpjp').value.trim(),
            kategori: host.querySelector('#nk-link-kategori').value,
          };

          const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
          fetch(apiUrl + '/simrsba/createnakesuser', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'success') {
              alert('Berhasil Link Akun User ke Data Nakes!\nUsername: ' + res.data.username);
              closeModal();
              formLink.reset();
              this.loadData();
            } else {
              alert('Gagal: ' + res.message);
            }
          })
          .catch(err => alert('Error: ' + err.message));
        };
      }

      if (formEdit) {
        formEdit.onsubmit = (e) => {
          e.preventDefault();
          const payload = {
            userId: host.querySelector('#nk-edit-userid').value,
            nakesId: host.querySelector('#nk-edit-nakesid').value,
            username: host.querySelector('#nk-edit-username').value,
            nama: host.querySelector('#nk-edit-nama').value.trim(),
            email: host.querySelector('#nk-edit-email').value.trim(),
            password: host.querySelector('#nk-edit-password').value,
            role: host.querySelector('#nk-edit-role').value,
            kodedpjp: host.querySelector('#nk-edit-kodedpjp').value.trim(),
            kategori: host.querySelector('#nk-edit-kategori').value,
          };

          const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
          fetch(apiUrl + '/simrsba/updatenakesuser', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'success') {
              alert('Data Nakes & Akun User Berhasil Diperbarui!');
              closeEditModal();
              formEdit.reset();
              this.loadData();
            } else {
              alert('Gagal: ' + res.message);
            }
          })
          .catch(err => alert('Error: ' + err.message));
        };
      }

      if (searchInput) {
        searchInput.oninput = (e) => {
          this.renderTable(e.target.value.toLowerCase());
        };
      }
    }

    renderTable(filterTerm = '') {
      const host = document.querySelector('app-sdm-nakes');
      if (!host) return;
      const tbody = host.querySelector('#nk-table-body');
      if (!tbody) return;

      const filtered = this.nakesList.filter(item => {
        const name = (item.nama || '').toLowerCase();
        const user = (item.username || '').toLowerCase();
        const role = (item.role || '').toLowerCase();
        const dpjp = (item.kodedpjp || '').toLowerCase();
        return name.includes(filterTerm) || user.includes(filterTerm) || role.includes(filterTerm) || dpjp.includes(filterTerm);
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Tidak ada data Nakes ditemukan</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map((item, idx) => `
        <tr style="border-bottom: 1px solid #e9ecef;">
          <td class="text-start py-2 px-3">
            <div class="dropdown position-relative">
              <button class="btn btn-warning btn-sm dropdown-toggle fw-bold text-dark py-1 px-2 nk-action-btn" type="button" style="background-color: #ffc107; border-color: #ffc107; font-size: 0.78rem; border-radius: 4px; box-shadow: none;">
                Actions
              </button>
              <div class="dropdown-menu shadow border-0 nk-action-menu" style="display: none; position: absolute; z-index: 1050; min-width: 170px; font-size: 0.85rem;">
                <a class="dropdown-item text-dark fw-bold btn-edit-nk" href="javascript:void(0)" data-item="${encodeURIComponent(JSON.stringify(item))}">Edit Akun & Nakes</a>
                <div class="dropdown-divider my-1"></div>
                <a class="dropdown-item text-danger fw-bold btn-delete-nk" href="javascript:void(0)" data-username="${item.username || ''}" data-nakesid="${item.nakesId || ''}" data-nama="${item.nama || ''}">Hapus Akun & Nakes</a>
              </div>
            </div>
          </td>
          <td class="text-center fw-bold py-2 px-2">${idx + 1}.</td>
          <td class="text-lowercase py-2 px-3" style="color: #495057;">${item.username || item.email || '-'}</td>
          <td class="fw-bold text-uppercase py-2 px-3" style="color: #212529;">${item.nama || '-'}</td>
          <td class="text-uppercase py-2 px-3" style="color: #6c757d; font-size: 0.85rem;">${item.role || 'ROLE_USER'}</td>
          <td class="py-2 px-3"><code>${item.kodedpjp || '-'}</code></td>
          <td class="py-2 px-3" style="color: #495057;">${item.kategori || 'DOKTER'}</td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.nk-action-btn').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          const menu = btn.nextElementSibling;
          const isOpen = menu.style.display === 'block';
          tbody.querySelectorAll('.nk-action-menu').forEach(m => m.style.display = 'none');
          if (!isOpen) menu.style.display = 'block';
        };
      });

      tbody.querySelectorAll('.btn-edit-nk').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const encoded = btn.getAttribute('data-item');
          try {
            const item = JSON.parse(decodeURIComponent(encoded));
            const modalEdit = host.querySelector('#modal-edit-nakes');
            host.querySelector('#nk-edit-userid').value = item._id || '';
            host.querySelector('#nk-edit-nakesid').value = item.nakesId || '';
            host.querySelector('#nk-edit-username').value = item.username || '';
            host.querySelector('#nk-edit-nama').value = item.nama || '';
            const activeUser = item.email || item.username || '';
            host.querySelector('#nk-edit-email').value = activeUser;
            host.querySelector('#nk-edit-user-display').textContent = activeUser || '-';
            host.querySelector('#nk-edit-password').value = '';
            if (item.role) host.querySelector('#nk-edit-role').value = item.role;
            host.querySelector('#nk-edit-kodedpjp').value = item.kodedpjp || '';
            if (item.kategori) host.querySelector('#nk-edit-kategori').value = item.kategori;

            modalEdit.style.display = 'block';
            modalEdit.classList.add('show');
          } catch (err) {
            console.error(err);
          }
        };
      });

      document.addEventListener('click', () => {
        tbody.querySelectorAll('.nk-action-menu').forEach(m => m.style.display = 'none');
      }, { once: true });

      tbody.querySelectorAll('.btn-delete-nk').forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const username = btn.getAttribute('data-username');
          const nakesId = btn.getAttribute('data-nakesid');
          const nama = btn.getAttribute('data-nama');
          if (confirm(`Hapus Nakes & Akun "${nama}" (${username || nakesId})?`)) {
            const apiUrl = i.apiUrl || (window.location.hostname === 'localhost' ? 'http://localhost:1822' : 'http://36.66.36.106:1822');
            fetch(apiUrl + '/simrsba/deletenakesuser', {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ username, nakesId, nama })
            })
            .then(res => res.json())
            .then(() => this.loadData())
            .catch(err => alert('Error: ' + err.message));
          }
        };
      });
    }

    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = f({
        type: t,
        selectors: [["app-sdm-nakes"]],
        decls: 1,
        vars: 0,
        template: function (a, o) {
          if (a & 1) {
            n(0, "div");
            oe();
          }
        },
        encapsulation: 2,
      });
    }
  }
  return t;
})();

export { SdmNakesComponent };
