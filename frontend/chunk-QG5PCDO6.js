import {
    a as i
} from "./chunk-W7XVFZVJ.js";
import {
    x as l,
    y as m
} from "./chunk-CFNDTNZN.js";
import {
    la as o,
    qa as h,
    x as p,
    yb as s
} from "./chunk-UYVTZL26.js";
var j = new l,
    P = (() => {
        class n {
            constructor(a) {
                this.http = a, this.titleComponent = s(""), this.listKetersediaanKamar = s([])
            }
            dashboardKunjungan() {
                return this.http.get(i.apiUrl + "/simrsba/home/dashboard/kunjungan").pipe(p(a => a))
            }
            dashboardPasienBaru() {
                return this.http.get(i.apiUrl + "/simrsba/home/dashboard/pasienbaru").pipe(p(a => a))
            }
            dashboardCancel() {
                return this.http.get(i.apiUrl + "/simrsba/home/dashboard/cancel").pipe(p(a => a))
            }
            laporanIgd(a, t, r) {
                return this.http.get(i.apiUrl + "/simrsba/laporan/igd/" + a + "/" + t + "/" + r).pipe(p(e => e))
            }
            laporanPoli(a, t, r) {
                return this.http.get(i.apiUrl + "/simrsba/laporan/poli/" + a + "/" + t + "/" + r).pipe(p(e => e))
            }
            laporanInap(a, t, r) {
                return this.http.get(i.apiUrl + "/simrsba/laporan/inap/" + a + "/" + t + "/" + r).pipe(p(e => e))
            }
            laporanDiagnosa(a, t) {
                return this.http.get(i.apiUrl + "/simrsba/laporan/diagnosa/" + a + "/" + t).pipe(p(r => r))
            }
            laporanCabar(a, t, r) {
                return this.http.get(i.apiUrl + "/simrsba/laporan/cabar/" + a + "/" + t + "/" + r).pipe(p(e => e))
            }
            graph(a) {
                return this.http.get(i.apiUrl + "/simrsba/graphPasien/" + a).pipe(p(t => t))
            }
            laporanJenisPasien(a, t) {
                let r = i.apiUrl + "/simrsba/jenis-pasien/start/" + a + "/end/" + t;
                return this.http.get(r)
            }
            static {
                this.\u0275fac = function(t) {
                    return new(t || n)(h(m))
                }
            }
            static {
                this.\u0275prov = o({
                    token: n,
                    factory: n.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return n
    })();
export {
    P as a
};