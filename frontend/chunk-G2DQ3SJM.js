import {
    a as r
} from "./chunk-W7XVFZVJ.js";
import {
    y as h
} from "./chunk-CFNDTNZN.js";
import {
    la as i,
    qa as u,
    yb as l
} from "./chunk-UYVTZL26.js";
var b = (() => {
    class s {
        constructor(t) {
            this.http = t, this.dataLogs = l([])
        }
        getStockApotekByKategori(t) {
            let a = r.apiUrl + "/apotek/stock/" + t;
            return this.http.get(a)
        }
        getStockInapkByKategori(t) {
            let a = r.apiUrl + "/apotek/stock/inap/" + t;
            return this.http.get(a)
        }
        getStockIgdkByKategori(t) {
            let a = r.apiUrl + "/apotek/stock/igd/" + t;
            return this.http.get(a)
        }
        getStockGudangkByKategori(t) {
            let a = r.apiUrl + "/apotek/stock/gudang/" + t;
            return this.http.get(a)
        }
        getLogsObat(t, a) {
            let e = r.apiUrl + "/apotek/logsobat";
            return this.http.post(e, {
                tanggal: t,
                depo: a
            })
        }
        pengambilanObatIgd(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/ambil/igd";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        penambahanObatIgd(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/tambah/igd";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        pengambilanObatInap(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/ambil/inap";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        penambahanObatInap(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/tambah/inap";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        pengambilanObatApotek(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/ambil/apotek";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        penambahanObatApotek(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/tambah/apotek";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        pengambilanObatGudang(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/ambil/gudang";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        penambahanObatGudang(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/tambah/gudang";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        pengambilanObatLuar(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/ambil/luar";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        penambahanObatLuar(t, a, e, p, o) {
            let n = r.apiUrl + "/apotek/tambah/luar";
            return this.http.post(n, {
                depo: t,
                id: a,
                jumlah: e,
                keterangan: p,
                user: o
            })
        }
        addRequestApotek(t) {
            let a = r.apiUrl + "/apotek/request/apotek/igd";
            return this.http.post(a, t)
        }
        getIgdRequestApotek(t, a) {
            let e = r.apiUrl + "/apotek/request/apotek/start/" + t + "/end/" + a;
            return this.http.get(e)
        }
        getRequestApotek() {
            let t = r.apiUrl + "/apotek/request/apotek";
            return this.http.get(t)
        }
        updateRequestApotekBatal(t) {
            let a = r.apiUrl + "/apotek/request/batal";
            return this.http.post(a, t)
        }
        updateRequestApotekSelesai(t) {
            let a = r.apiUrl + "/apotek/request/selesai";
            return this.http.post(a, t)
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || s)(u(h))
            }
        }
        static {
            this.\u0275prov = i({
                token: s,
                factory: s.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return s
})();
export {
    b as a
};