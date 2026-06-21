import {
    a as e
} from "./chunk-W7XVFZVJ.js";
import {
    y as o
} from "./chunk-CFNDTNZN.js";
import {
    l as s,
    la as n,
    qa as p
} from "./chunk-UYVTZL26.js";
var f = (() => {
    class i {
        constructor(t) {
            this.http = t, this.onLoadNotif$ = new s
        }
        getNotif() {
            let t = e.apiUrl + "/farmasi/getnotif";
            return this.http.get(t)
        }
        getLaporanApotekItemsByDate(t, r) {
            let a = e.apiUrl + "/farmasi/laporan/apotek/start/" + t + "/end/" + r;
            return this.http.get(a)
        }
        getLaporanIgdItemsByDate(t, r) {
            let a = e.apiUrl + "/farmasi/laporan/igd/start/" + t + "/end/" + r;
            return this.http.get(a)
        }
        getLaporanInapItemsByDate(t, r) {
            let a = e.apiUrl + "/farmasi/laporan/inap/start/" + t + "/end/" + r;
            return this.http.get(a)
        }
        getRequestGudang(t, r, a) {
            let l = e.apiUrl + "/farmasi/request/gudang/start/" + t + "/end/" + r + "/from/" + a;
            return this.http.get(l)
        }
        getStockApotek() {
            let t = e.apiUrl + "/farmasi/stock/apotek";
            return this.http.get(t)
        }
        tambahResep(t) {
            let r = e.apiUrl + "/farmasi/add/resep";
            return this.http.post(r, t)
        }
        editResep(t) {
            let r = e.apiUrl + "/farmasi/billing/edit/total";
            return this.http.post(r, t)
        }
        getDataResepByNoCheckin(t) {
            let r = e.apiUrl + "/farmasi/resep";
            return this.http.post(r, t)
        }
        getBillingFarmasi(t) {
            let r = e.apiUrl + "/farmasi/billing";
            return this.http.post(r, t)
        }
        printObat(t) {
            let r = e.apiUrl + "/farmasi/print/obat";
            return this.http.post(r, t)
        }
        deleteResep(t) {
            let r = e.apiUrl + "/farmasi/delete/resep";
            return this.http.post(r, t)
        }
        deleteObatResep(t) {
            let r = e.apiUrl + "/farmasi/delete/obat/resep";
            return this.http.post(r, t)
        }
        inputResep(t) {
            let r = e.apiUrl + "/farmasi/input/resep";
            return this.http.post(r, t)
        }
        inputResepRacikan(t) {
            let r = e.apiUrl + "/farmasi/input/resep/racikan";
            return this.http.post(r, t)
        }
        getResepByNoCheckin(t) {
            let r = e.apiUrl + "/farmasi/resep";
            return this.http.post(r, {
                noCheckin: t
            })
        }
        detailResep(t) {
            let r = e.apiUrl + "/farmasi/detail/resep";
            return this.http.post(r, {
                _id: t
            })
        }
        getRincianFarmasi(t) {
            let r = e.apiUrl + "/farmasi/rincian/" + t;
            return this.http.get(r)
        }
        carPasienByNoCheckin(t) {
            let r = e.apiUrl + "/simrsba/caripasiennocheckin/" + t;
            return this.http.get(r)
        }
        getStockIgd() {
            let t = e.apiUrl + "/farmasi/stock/igd";
            return this.http.get(t)
        }
        getStockInap() {
            let t = e.apiUrl + "/farmasi/stock/inap";
            return this.http.get(t)
        }
        deleteRincianFarmasi(t) {
            let r = e.apiUrl + "/farmasi/delete/rincian";
            return this.http.post(r, t)
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || i)(p(o))
            }
        }
        static {
            this.\u0275prov = n({
                token: i,
                factory: i.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return i
})();
export {
    f as a
};