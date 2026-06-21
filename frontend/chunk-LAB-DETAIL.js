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
    ɵelementStart(0, "app-lab-detail-wrapper");
    ɵelementEnd();
  }
}

var LabDetailComponent = (() => {
  class t {
    constructor() {
      this.http = inject(m);
      this.patient = null;
      this.orders = [];
      this.loadingPatient = true;
      this.loadingOrders = true;
      
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
        .get(i.apiUrl + "/simrsba/getrincian/LAB/" + this.noCheckin)
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

    renderView() {
      const root = document.querySelector("app-lab-detail-wrapper");
      if (!root) return;

      if (this.loadingPatient || this.loadingOrders) {
        root.innerHTML = '<div class="container mt-5"><div class="d-flex justify-content-center align-items-center h-100"><div class="spinner-grow text-danger m-1" role="status"></div><div class="spinner-grow text-warning m-1" role="status"></div><div class="spinner-grow text-success m-1" role="status"></div><div class="spinner-grow text-primary m-1" role="status"></div></div></div>';
        return;
      }

      const p = this.patient || {};
      const noMr = p.noMr || p.norm || this.noMr || '-';
      const noCheckin = p.noCheckin || this.noCheckin || '-';
      const nama = p.nama || '-';
      const kelamin = p.kelamin || '-';
      const cabar = p.cabar || '-';
      const tglCheckin = p.tglCheckin || '-';
      const tglLahir = p.tglLahir || '-';
      const nik = p.nik || '-';
      const noBpjs = p.noKartu || p.noBpjs || '-';
      const diagnosa = p.diagnosa || '-';
      const dpjp = p.dokterDpjp || p.dpjp || '-';

      let orderRows = '';
      if (this.orders.length === 0) {
        orderRows = '<tr><td colspan="6" class="text-center text-muted py-3 fw-bold">Tidak ada rincian order laboratorium.</td></tr>';
      } else {
        this.orders.forEach((o, idx) => {
          orderRows += `
            <tr>
              <td>${idx + 1}.</td>
              <td>${o.tglInput || '-'}</td>
              <td class="fw-bold">${o.namaKategori || '-'}</td>
              <td>${o.qty || 1}</td>
              <td class="text-end">Rp. ${o.harga?.toLocaleString() || 0}</td>
              <td><span class="badge bg-warning text-dark">PENDING</span></td>
            </tr>
          `;
        });
      }

      root.innerHTML = `
        <div class="container-fluid mt-3">
          <div class="row">
            <!-- LEFT SIDEBAR -->
            <div class="col-md-4 col-lg-3 mb-2 d-print-none">
              <div class="card g-0 small mb-1 shadow-sm">
                 <div class="card-header text-center bg-success text-light">
                    <img src="assets/img/avatar.jpeg" width="150" class="img-fluid rounded-circle mt-3 border border-3 border-light">
                    <h5 class="mt-3 text-uppercase fw-bold">${nama}</h5>
                    <div class="text-warning fw-bold mb-2">${cabar}</div>
                 </div>
                 <div class="card-body bg-light">
                    <table class="table table-sm table-borderless mb-0">
                       <tr><td class="text-end fw-bold text-muted w-50">No. Checkin</td><td class="fw-bold">${noCheckin}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">Tgl. Checkin</td><td class="fw-bold">${tglCheckin}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">No.RM</td><td class="fw-bold">${noMr}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">Tgl.Lahir</td><td class="fw-bold">${tglLahir}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">J.Kelamin</td><td class="fw-bold">${kelamin}</td></tr>
                       <tr><td colspan="2"><hr class="my-1"></td></tr>
                       <tr><td class="text-end fw-bold text-muted">NIK</td><td class="fw-bold">${nik}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">No. BPJS</td><td class="fw-bold">${noBpjs}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">Diagnosa</td><td class="fw-bold">${diagnosa}</td></tr>
                       <tr><td class="text-end fw-bold text-muted">DPJP</td><td class="fw-bold">${dpjp}</td></tr>
                    </table>
                 </div>
              </div>
              <div class="list-group shadow-sm mt-3">
                 <button class="list-group-item list-group-item-action active fw-bold border-0 bg-primary"><i class="bi bi-droplet-fill me-2"></i> Input Pemeriksaan LAB</button>
                 <button class="list-group-item list-group-item-action fw-bold border-0 text-muted" onclick="window.history.pushState(null, '', '/lab'); window.dispatchEvent(new Event('popstate'));"><i class="bi bi-arrow-left-circle me-2"></i> Kembali ke Antrean</button>
              </div>
            </div>

            <!-- RIGHT CONTENT -->
            <div class="col-md-8 col-lg-9">
              <div class="card shadow-sm border-0">
                 <div class="card-header bg-warning text-dark fw-bold border-0">
                    <i class="bi bi-card-checklist me-2"></i> Daftar Permintaan Laboratorium
                 </div>
                 <div class="card-body p-0">
                    <div class="table-responsive">
                      <table class="table table-hover table-sm mb-0">
                         <thead class="table-light text-muted">
                            <tr>
                               <th>#</th>
                               <th>TGL ORDER</th>
                               <th>NAMA PEMERIKSAAN</th>
                               <th>QTY</th>
                               <th class="text-end">HARGA</th>
                               <th>STATUS</th>
                            </tr>
                         </thead>
                         <tbody>
                            ${orderRows}
                         </tbody>
                      </table>
                    </div>
                 </div>
              </div>

              <!-- PLACEHOLDER INPUT FORM -->
              <div class="card shadow-sm border-0 mt-3">
                 <div class="card-header bg-primary text-white fw-bold border-0">
                    <i class="bi bi-pencil-square me-2"></i> Form Input Hasil
                 </div>
                 <div class="card-body bg-light">
                    <div class="alert alert-info border-0 shadow-sm">
                      <i class="bi bi-info-circle-fill me-2"></i> <strong>Mode Placeholder:</strong> Formulir ini adalah antarmuka sementara untuk memasukkan hasil laboratorium.
                    </div>
                    
                    <div class="mb-3">
                       <label class="form-label fw-bold text-muted">Catatan / Hasil Keterangan</label>
                       <textarea class="form-control border-0 shadow-sm" rows="5" placeholder="Ketik deskripsi hasil klinis pemeriksaan laboratorium di sini..."></textarea>
                    </div>
                    
                    <div class="mb-4">
                       <label class="form-label fw-bold text-muted">Upload Dokumen Hasil (Opsional)</label>
                       <input class="form-control border-0 shadow-sm" type="file" accept=".pdf,image/*">
                       <div class="form-text">Unggah file PDF atau foto hasil lab dari mesin.</div>
                    </div>
                    
                    <hr>
                    <div class="d-flex justify-content-end">
                       <button class="btn btn-primary px-5 fw-bold shadow-sm" onclick="alert('Hasil laboratorium berhasil disimpan! (Placeholder)')">
                          <i class="bi bi-save me-2"></i> Simpan Hasil LAB
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
        selectors: [["app-lab-detail-index"]],
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
export { LabDetailComponent };
