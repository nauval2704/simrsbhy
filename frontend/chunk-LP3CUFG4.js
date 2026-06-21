import {
    a as e
} from "./chunk-W7XVFZVJ.js";
import {
    y as h
} from "./chunk-CFNDTNZN.js";
import {
    L as n,
    la as g,
    qa as o,
    t as a,
    x as u
} from "./chunk-UYVTZL26.js";
var R = (() => {
    class i {
        constructor(t) {
            this.http = t
        }
        getResponseGudang(t) {
            return t.data
        }
        errorResponse(t) {
            return t
        }
        addDistributor(t) {
            let r = e.apiUrl + "/gudang/distributor";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        getDistributor() {
            let t = e.apiUrl + "/gudang/distributor";
            return this.http.get(t)
        }
        getDistributorById(t) {
            let r = e.apiUrl + "/gudang/distributor/" + t;
            return this.http.get(r)
        }
        inputFaktur(t) {
            let r = e.apiUrl + "/gudang/input";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        inputObatLuar(t) {
            let r = e.apiUrl + "/gudang/obatLuar";
            return this.http.post(r, t)
        }
        inputBarangBhp(t, r) {
            let s = e.apiUrl + "/gudang/barangBhp/" + r;
            return this.http.post(s, t)
        }
        listObatLuarByKategori(t) {
            let r = e.apiUrl + "/gudang/stock/obatLuar/" + t;
            return this.http.get(r)
        }
        getFaktur() {
            let t = e.apiUrl + "/gudang/faktur";
            return this.http.get(t)
        }
        getItemsByNoFaktur(t) {
            let r = e.apiUrl + "/gudang/list";
            return this.http.post(r, t)
        }
        getItemsByTanggalFaktur(t) {
            let r = e.apiUrl + "/gudang/list/tanggal";
            return this.http.post(r, t)
        }
        addJenisSediaan(t) {
            let r = e.apiUrl + "/gudang/jenisSediaan";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        getJenisSediaan() {
            let t = e.apiUrl + "/gudang/jenisSediaan";
            return this.http.get(t)
        }
        addSatuan(t) {
            let r = e.apiUrl + "/gudang/satuan";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        getSatuan() {
            let t = e.apiUrl + "/gudang/satuan";
            return this.http.get(t)
        }
        getFakturItemsByDate(t, r) {
            let s = e.apiUrl + "/gudang/faktur/start/" + t + "/end/" + r;
            return this.http.get(s)
        }
        getRincianHutangByDate(t, r) {
            let s = e.apiUrl + "/gudang/hutang/start/" + t + "/end/" + r;
            return this.http.get(s)
        }
        getBeritaAcaraByDate(t, r) {
            let s = e.apiUrl + "/gudang/beritaAcara/start/" + t + "/end/" + r;
            return this.http.get(s)
        }
        getLaporanGudangItemsByDate(t, r) {
            let s = e.apiUrl + "/gudang/laporan/gudang/start/" + t + "/end/" + r;
            return this.http.get(s)
        }
        getLaporanSppmItemsByDate(t, r) {
            let s = e.apiUrl + "/gudang/laporan/sppm/start/" + t + "/end/" + r;
            return this.http.get(s)
        }
        addKategori(t) {
            let r = e.apiUrl + "/gudang/kategori";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        getKategori() {
            let t = e.apiUrl + "/gudang/kategori";
            return this.http.get(t)
        }
        addDaftarItems(t, r) {
            let s = e.apiUrl + "/gudang/daftar/" + r;
            return this.http.post(s, t).pipe(u(this.getResponseGudang), n(p => a(this.errorResponse(p.error.message))))
        }
        getDaftarItems(t) {
            let r = e.apiUrl + "/gudang/daftar/" + t;
            return this.http.get(r)
        }
        addRequestGudang(t, r) {
            let s = e.apiUrl + "/gudang/request/gudang";
            return this.http.post(s, {
                data: t,
                from: r
            }).pipe(u(this.getResponseGudang), n(p => a(this.errorResponse(p.error.message))))
        }
        getRequestGudang() {
            let t = e.apiUrl + "/gudang/request/gudang";
            return this.http.get(t)
        }
        updateRequestGudangSelesai(t) {
            let r = e.apiUrl + "/gudang/request/selesai";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        updateRequestGudangBatal(t) {
            let r = e.apiUrl + "/gudang/request/batal";
            return this.http.post(r, t).pipe(u(this.getResponseGudang), n(s => a(this.errorResponse(s.error.message))))
        }
        getDaftarItemsByStock(t) {
            let r = e.apiUrl + "/gudang/stock/" + t;
            return this.http.get(r)
        }
        getDataEmployee(t) {
            let r = e.apiUrl + "/gudang/employee/list";
            return this.http.post(r, t).pipe(n(s => a(this.errorResponse(s.error.message))))
        }
        updateDataEmployee(t) {
            let r = e.apiUrl + "/gudang/employee/add";
            return this.http.post(r, t).pipe(n(s => a(this.errorResponse(s.error.message))))
        }
        deleteInputBarang(t) {
            let r = e.apiUrl + "/gudang/delete/barang";
            return this.http.post(r, t)
        }
        getMargin(t) {
            let r = e.apiUrl + "/farmasi/billing/margin";
            return this.http.post(r, t)
        }
        updateMargin(t) {
            let r = e.apiUrl + "/farmasi/billing/margin/harga";
            return this.http.post(r, t)
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || i)(o(h))
            }
        }
        static {
            this.\u0275prov = g({
                token: i,
                factory: i.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return i
})();
export {
    R as a
};