import { a as i } from "./chunk-W7XVFZVJ.js";
import { y as m } from "./chunk-CFNDTNZN.js";
import {
  Db as ɵcmp,
  gc as ɵelementStart,
  hc as ɵelementEnd,
  Ec as ɵtext,
  ra as inject
} from "./chunk-UYVTZL26.js";

function renderTemplate(t, s) {
  if (t & 1) {
    ɵelementStart(0, "app-rad-detail-wrapper");
    ɵelementEnd();
  }
}

var RadDetailComponent = (() => {
  class t {
    constructor() {
      this.http = inject(m);
      this.patient = null;
      this.orders = [];
      this.loadingPatient = true;
      this.loadingOrders = true;
      this.saving = false;
      this.syncSatuSehat = false;
      
      const pathParts = window.location.pathname.split('/');
      this.noMr = pathParts[3];
      this.noCheckin = pathParts[5];
    }

    ngOnInit() {
      this.fetchPatientData();
      this.fetchOrders();
    }

    ngAfterViewInit() {
      this.renderView();
    }

    fetchPatientData() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            if (res && res.length > 0) {
              this.patient = res[0];
            }
            this.loadingPatient = false;
            this.renderView();
          },
          error: () => {
            this.loadingPatient = false;
            this.renderView();
          }
        });
    }

    fetchOrders() {
      this.http
        .get(i.apiUrl + "/simrsba/getrincian/RADIOLOGI/" + this.noCheckin)
        .subscribe({
          next: (res) => {
            this.orders = Array.isArray(res) ? res : [];
            this.loadingOrders = false;
            this.renderView();
          },
          error: () => {
            this.loadingOrders = false;
            this.renderView();
          }
        });
    }

    gatherData() {
      const root = document.querySelector("app-rad-detail-wrapper");
      if (!root) return null;

      const expertise = root.querySelector('#rad-expertise')?.value || '';
      const radiologi = [];

      this.orders.forEach((o, idx) => {
        const val = root.querySelector('#rad-val-' + idx)?.value || '';
        if (expertise || val) {
          radiologi.push({
            examCode: o.noTarif || "24648-8",
            examName: o.nama || o.namaKategori || "Radiology Report",
            impression: expertise || val || "Tidak ada kesimpulan",
            doctorInCharge: ""
          });
        }
      });

      // Add a single entry just for expertise if no values were provided
      if (radiologi.length === 0 && expertise) {
        radiologi.push({
          examCode: "24648-8",
          examName: "General Radiology Report",
          impression: expertise,
          doctorInCharge: ""
        });
      }

      return {
        noCheckin: this.noCheckin,
        patientIhsNumber: this.patient?.userData?.[0]?.ihsNumber || '',
        radiologi: radiologi,
        syncSatuSehat: this.syncSatuSehat
      };
    }

    saveRad(sync) {
      this.syncSatuSehat = sync;
      const data = this.gatherData();
      if (!data) return;

      this.saving = true;
      this.renderView();

      this.http
        .post(i.apiUrl + "/simrsba/rad/save", data)
        .subscribe({
          next: (res) => {
            this.saving = false;
            this.showToast('success', res.message || 'Hasil Radiologi berhasil disimpan');
            if (res.data?.checkin) {
              this.patient = res.data.checkin;
            }
            this.renderView();
          },
          error: (err) => {
            this.saving = false;
            this.showToast('danger', err.error?.message || 'Gagal menyimpan hasil Radiologi');
            this.renderView();
          }
        });
    }

    showToast(type, message) {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;min-width:320px;';
      toast.innerHTML = '<div class="alert alert-' + type + ' shadow d-flex align-items-center gap-2 py-2">' +
        '<i class="bi bi-' + (type === 'success' ? 'check-circle-fill' : type === 'warning' ? 'exclamation-triangle-fill' : 'x-circle-fill') + ' fs-5"></i>' +
        '<div>' + message + '</div>' +
        '<button class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>' +
        '</div>';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 4000);
    }

    renderView() {
      const root = document.querySelector("app-rad-detail-wrapper");
      if (!root) return;

      if (this.loadingPatient || this.loadingOrders) {
        root.innerHTML = '<div class="container mt-5"><div class="d-flex justify-content-center align-items-center h-100"><div class="spinner-grow text-danger m-1" role="status"></div><div class="spinner-grow text-warning m-1" role="status"></div><div class="spinner-grow text-success m-1" role="status"></div><div class="spinner-grow text-primary m-1" role="status"></div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || this.noMr || '-';
      const noCheckin = p.noCheckin || this.noCheckin || '-';
      let nama = p.nama || '-';
      if (p.userData && p.userData.length > 0) nama = p.userData[0].nama || nama;
      let kelamin = p.kelamin || '-';
      if (p.userData && p.userData.length > 0) kelamin = p.userData[0].sex || kelamin;
      const cabar = p.cabar || '-';
      const tglCheckin = p.tglCheckin || '-';
      let tglLahir = p.tglLahir || '-';
      if (p.userData && p.userData.length > 0) tglLahir = p.userData[0].tgllahir || tglLahir;
      let nik = p.nik || '-';
      if (p.userData && p.userData.length > 0) nik = p.userData[0].nik || nik;
      let noBpjs = p.noKartu || p.noBpjs || '-';
      if (p.userData && p.userData.length > 0) noBpjs = p.userData[0].nobpjs || noBpjs;
      const dpjp = p.dokterDpjp || p.dpjp || '-';

      const existingRad = p.radiologi || [];
      const hasSynced = existingRad.length > 0 && p.satusehatIds?.length > 0;
      
      let existingExpertise = '';
      if (existingRad.length > 0) {
        existingExpertise = existingRad[0].impression || '';
      }

      let orderRows = '';
      if (this.orders.length === 0) {
        orderRows = '<tr><td colspan="6" class="text-center text-muted py-3 fw-bold">Tidak ada rincian order radiologi.</td></tr>';
      } else {
        this.orders.forEach((o, idx) => {
          const testName = o.nama || o.namaKategori || 'Test';
          const existingResult = existingRad.find(r => r.examName === testName)?.impression || '';
          const statusBadge = existingResult || existingExpertise ? '<span class="badge bg-success">DONE</span>' : '<span class="badge bg-warning text-dark">PENDING</span>';
          
          orderRows += `
            <tr>
              <td class="align-middle">${idx + 1}.</td>
              <td class="align-middle">${o.tglInput || '-'}</td>
              <td class="fw-bold align-middle">${testName}</td>
              <td class="align-middle">
                <input type="text" id="rad-val-${idx}" class="form-control form-control-sm" placeholder="Catatan singkat (opsional)" value="${existingResult}">
              </td>
              <td class="align-middle text-center">${statusBadge}</td>
            </tr>
          `;
        });
      }

      root.__rad = this;
      
      const saveBtnText = this.saving && !this.syncSatuSehat ? '<span class="spinner-border spinner-border-sm me-1"></span> Menyimpan...' : '<i class="bi bi-save me-2"></i> Simpan Hasil';
      const syncBtnText = this.saving && this.syncSatuSehat ? '<span class="spinner-border spinner-border-sm me-1"></span> Mengirim...' : '<i class="bi bi-cloud-arrow-up me-2"></i> Simpan & Sync SATUSEHAT';

      root.innerHTML = `
        <div class="container-fluid mt-3">
          <div class="row">
            <!-- LEFT SIDEBAR -->
            <div class="col-md-4 col-lg-3 mb-2 d-print-none">
              <div class="card g-0 small mb-1">
                 <div class="card-header text-center bg-success text-light">
                    <img src="assets/img/avatar.jpeg" width="200" height="200" alt="..." class="img-fluid rounded-circle">
                    <h6 class="text-uppercase text-light fw-bold lh-1 my-2">${nama}</h6>
                    <span class="text-warning fw-bold h4">${cabar}</span>
                 </div>
                 <div class="card-body lh-1">
                    <div class="table-responsive">
                       <table class="table table-sm">
                          <tbody>
                             <tr><th scope="row" class="text-end">No. Checkin</th><td>${noCheckin}</td></tr>
                             <tr><th scope="row" class="text-end">Tgl. Checkin</th><td>${tglCheckin}</td></tr>
                             <tr><th scope="row" class="text-end">No.RM</th><td>${noMr}</td></tr>
                             <tr><th scope="row" class="text-end">Tgl.Lahir</th><td>${tglLahir}</td></tr>
                             <tr><th scope="row" class="text-end">J.Kelamin</th><td>${kelamin}</td></tr>
                             <tr><th scope="row" class="text-end">NIK</th><td>${nik}</td></tr>
                             <tr><th scope="row" class="text-end">No. BPJS</th><td>${noBpjs}</td></tr>
                             <tr><th scope="row" class="text-end">DPJP</th><td colspan="2">${dpjp}</td></tr>
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
              <div class="list-group list-group-sm">
                 <button class="list-group-item list-group-item-action text-primary active" aria-current="true"><i class="bi bi-file-earmark-medical-fill me-2"></i> Input Pemeriksaan Radiologi</button>
                 <button class="list-group-item list-group-item-action text-danger" onclick="window.history.pushState(null, '', '/radiologi'); window.dispatchEvent(new Event('popstate'));"><i class="bi bi-arrow-left-circle me-2"></i> Kembali ke Antrean</button>
              </div>
            </div>

            <!-- RIGHT CONTENT -->
            <div class="col-md-8 col-lg-9">
              <div class="card">
                 <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover table-sm mb-0">
                         <thead>
                             <tr>
                                <th>#</th>
                                <th>TGL ORDER</th>
                                <th>NAMA PEMERIKSAAN</th>
                                <th>HASIL (NILAI)</th>
                                <th class="text-center">STATUS</th>
                             </tr>
                         </thead>
                         <tbody>
                            ${orderRows}
                         </tbody>
                      </table>
                    </div>
                 </div>
              </div>

              <!-- INPUT FORM -->
              <div class="card mt-3">
                 <div class="card-header fw-bold d-flex justify-content-between align-items-center">
                    <span>Form Input Hasil Radiologi</span>
                    ${hasSynced ? '<span class="badge bg-success"><i class="bi bi-cloud-check-fill me-1"></i> Tersinkron SATUSEHAT</span>' : ''}
                 </div>
                 <div class="card-body">
                    
                    <div class="mb-3">
                       <label class="form-label fw-bold text-muted">Ekspertise Radiologi</label>
                       <textarea id="rad-expertise" class="form-control" rows="5" placeholder="Ketik ekspertise / bacaan radiologi di sini...">${existingExpertise}</textarea>
                    </div>
                    
                    <hr>
                    <div class="d-flex justify-content-end gap-2">
                       <button class="btn btn-outline-success px-4 fw-bold" onclick="document.querySelector('app-rad-detail-wrapper').__rad.saveRad(false)" ${this.saving ? 'disabled' : ''}>
                          ${saveBtnText}
                       </button>
                       <button class="btn btn-primary px-4 fw-bold" onclick="document.querySelector('app-rad-detail-wrapper').__rad.saveRad(true)" ${this.saving ? 'disabled' : ''}>
                          ${syncBtnText}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    static {
      this.ɵfac = function(a) {
        return new(a || t)();
      };
    }
    static {
      this.ɵcmp = ɵcmp({
        type: t,
        selectors: [["app-rad-detail-index"]],
        decls: 1,
        vars: 0,
        template: renderTemplate,
        encapsulation: 2,
        standalone: true
      });
    }
  }
  return t;
})();
export { RadDetailComponent };
