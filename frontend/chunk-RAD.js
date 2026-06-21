import { a as i } from "./chunk-W7XVFZVJ.js";
import { y as m } from "./chunk-CFNDTNZN.js";
import {
  Db as f,
  gc as n,
  hc as o,
  Ec as p,
  ra as D,
} from "./chunk-UYVTZL26.js";

var ze = (() => {
  class t {
    constructor() {
      this.http = D(m);
      this.patients = [];
      this.loading = true;
      this.error = false;
    }
    ngOnInit() {
      this.http
        .get(i.apiUrl + "/simrsba/caripasien/pelayanan/INSTALASI GAWAT DARURAT")
        .subscribe({
          next: (a) => {
            var allPatients = Array.isArray(a) ? a : [];
            if (allPatients.length === 0) {
              this.patients = [];
              this.loading = false;
              this.renderTable();
              return;
            }
            var checked = 0;
            var result = [];
            allPatients.forEach((pt) => {
              if (!pt.noCheckin) {
                checked++;
                if (checked === allPatients.length) {
                  this.patients = result;
                  this.loading = false;
                  this.renderTable();
                }
                return;
              }
              this.http
                .get(i.apiUrl + "/simrsba/getrincian/RADIOLOGI/" + pt.noCheckin)
                .subscribe({
                  next: (rincian) => {
                    var items = Array.isArray(rincian) ? rincian : [];
                    if (items.length > 0) {
                      result.push(pt);
                    }
                    checked++;
                    if (checked === allPatients.length) {
                      this.patients = result;
                      this.loading = false;
                      this.renderTable();
                    }
                  },
                  error: () => {
                    checked++;
                    if (checked === allPatients.length) {
                      this.patients = result;
                      this.loading = false;
                      this.renderTable();
                    }
                  },
                });
            });
          },
          error: () => {
            this.loading = false;
            this.error = true;
            this.renderTable();
          },
        });
    }
    ngAfterViewInit() {
      this.renderTable();
    }
    renderTable() {
      const root = document.querySelector("app-radiologi-index");
      if (!root) return;
      if (this.loading) {
        root.innerHTML =
          '<div class="container mt-5"><div class="d-flex justify-content-center align-items-center h-100"><div class="spinner-grow text-danger m-1" role="status"></div><div class="spinner-grow text-warning m-1" role="status"></div><div class="spinner-grow text-success m-1" role="status"></div><div class="spinner-grow text-primary m-1" role="status"></div></div></div>';
        return;
      }
      if (this.error) {
        root.innerHTML =
          '<div class="container-fluid mt-3"><div class="alert alert-danger m-3">Gagal memuat data dari server. Periksa koneksi ke backend.</div></div>';
        return;
      }
      let rows = "";
      if (this.patients.length === 0) {
        rows =
          '<tr><td colspan="12" class="text-center text-muted py-3 fw-bold">Tidak ada antrean radiologi dari IGD saat ini.</td></tr>';
      } else {
        this.patients.forEach((p, idx) => {
          let btn = `<div class="dropdown"><button class="btn btn-warning btn-sm dropdown-toggle w-100" onclick="var m=this.nextElementSibling,r=this.getBoundingClientRect();m.style.top=r.bottom+'px';m.style.left=r.left+'px';m.classList.toggle('show')">Actions</button><div class="dropdown-menu shadow" style="position:fixed;z-index:9999;min-width:180px;"><button class="dropdown-item" onclick="window.history.pushState(null,'','/radiologi/input/${p.noMr}/nocheckin/${p.noCheckin}');window.dispatchEvent(new Event('popstate'));"><i class="bi bi-chevron-right me-2"></i> Input Radiologi</button></div></div>`;
          let encounterBadge =
            '<span class="badge rounded-pill text-bg-danger">NO ENCOUNTER</span>';
          rows +=
            "<tr>" +
            '<td class="text-center align-middle" style="width: 100px;">' +
            btn +
            "</td>" +
            '<td class="text-center align-middle"><b>' +
            (idx + 1) +
            ".</b></td>" +
            '<td class="align-middle">' +
            (p.tglInput || "-") +
            "</td>" +
            '<td class="align-middle text-center">' +
            encounterBadge +
            "</td>" +
            '<td class="align-middle">' +
            (p.noMr || "-") +
            "</td>" +
            '<td class="align-middle text-uppercase"><b>' +
            (p.nama || "-") +
            "</b></td>" +
            '<td class="align-middle text-uppercase">' +
            (p.kelamin || "-") +
            "</td>" +
            '<td class="align-middle text-uppercase">' +
            (p.jnsPeserta || "-") +
            "</td>" +
            '<td class="align-middle text-uppercase">' +
            (p.penjamin || "-") +
            "</td>" +
            '<td class="align-middle text-uppercase">' +
            (p.dpjp || "-") +
            "</td>" +
            '<td class="align-middle text-uppercase"></td>' +
            '<td class="align-middle text-uppercase">' +
            (p.user || "-") +
            "</td>" +
            "</tr>";
        });
      }
      root.innerHTML =
        '<div class="container-fluid mt-3">' +
        '<div class="card mb-2">' +
        '<div class="card-header bg-warning fw-bold text-dark">RADIOLOGI</div>' +
        '<div class="card-body">' +
        '<div class="row justify-content-center mb-2"><div class="col"><div class="input-group"><input type="text" placeholder="Search Pasien" class="form-control" onkeyup="var q=this.value.toLowerCase(),rs=this.closest(\'.card-body\').querySelectorAll(\'tbody tr\');rs.forEach(r=>{r.style.display=r.innerText.toLowerCase().includes(q)?\'\':\'none\'})"></div></div></div>' +
        '<div class="table-responsive mt-2 rounded">' +
        '<table class="table table-hover table-sm text-nowrap">' +
        '<thead class="table-dark">' +
        "<tr>" +
        '<th scope="col" class="text-center"></th>' +
        '<th scope="col" class="text-center">#</th>' +
        '<th scope="col">CHECKIN</th>' +
        '<th scope="col" class="text-center">ENCOUNTER</th>' +
        '<th scope="col">NO.RM</th>' +
        '<th scope="col">NAMA</th>' +
        '<th scope="col">KELAMIN</th>' +
        '<th scope="col">JENIS</th>' +
        '<th scope="col">PASIEN</th>' +
        '<th scope="col">DPJP</th>' +
        '<th scope="col">KET</th>' +
        '<th scope="col">USER</th>' +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        rows +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";

      if (!window.dropdownListenerAdded) {
        document.addEventListener("click", function (e) {
          if (!e.target.matches(".dropdown-toggle")) {
            document
              .querySelectorAll(".dropdown-menu.show")
              .forEach((m) => m.classList.remove("show"));
          }
        });
        window.dropdownListenerAdded = true;
      }
    }
    static {
      this.ɵfac = function (a) {
        return new (a || t)();
      };
    }
    static {
      this.ɵcmp = f({
        type: t,
        selectors: [["app-radiologi-index"]],
        decls: 2,
        vars: 0,
        consts: [
          [1, "container-fluid", "mt-3"],
          [1, "d-flex", "justify-content-center", "mt-5"],
          [1, "spinner-border", "text-warning"],
        ],
        template: function (a, ctx) {
          a & 1 && (n(0, "div", 0), p(1, "Memuat data radiologi IGD..."), o());
        },
        encapsulation: 2,
      });
    }
  }
  return t;
})();

export { ze as RadiologiIndexComponent };
