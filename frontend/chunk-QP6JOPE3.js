import {
    a as W
} from "./chunk-LP3CUFG4.js";
import {
    a as w
} from "./chunk-YIQM4CGR.js";
import {
    y as $,
    z as X
} from "./chunk-QGNVLNC6.js";
import {
    a as Q
} from "./chunk-UI7HE65P.js";
import {
    b as L,
    c as l,
    e as P,
    f as K,
    i as d,
    l as x,
    m as q,
    o as R,
    p as O,
    q as G,
    r as U,
    s as Y,
    v as H,
    y as V
} from "./chunk-NKLTBXW5.js";
import {
    k as z
} from "./chunk-QJBCP6KK.js";
import {
    h as M,
    q as D,
    s as j
} from "./chunk-CFNDTNZN.js";
import {
    Db as C,
    Ec as r,
    Fc as S,
    Gc as B,
    Kb as k,
    N,
    Qc as s,
    Sc as A,
    Tc as T,
    Zb as m,
    cc as I,
    ec as v,
    fc as f,
    gc as e,
    hc as i,
    ic as g,
    qb as o,
    ra as h,
    sc as F,
    tc as J,
    wc as b,
    x as y
} from "./chunk-UYVTZL26.js";
var E = (n, u) => u._id,
    c = (n, u) => ({
        "is-invalid": n,
        "is-valid": u
    });

function et(n, u) {
    if (n & 1 && (e(0, "option", 15), A(1, "json"), r(2), i()), n & 2) {
        let a = u.$implicit;
        b("value", T(1, 2, a)), o(2), S(a.nama)
    }
}

function it(n, u) {
    n & 1 && (e(0, "option", 14), r(1, "No Data!."), i())
}

function at(n, u) {
    if (n & 1 && (e(0, "option", 15), r(1), i()), n & 2) {
        let a = u.$implicit;
        b("value", a.nama), o(), S(a.nama)
    }
}

function nt(n, u) {
    n & 1 && (e(0, "option", 14), r(1, "No Data!."), i())
}

function rt(n, u) {
    if (n & 1 && (e(0, "option", 15), r(1), i()), n & 2) {
        let a = u.$implicit;
        b("value", a.nama), o(), S(a.nama)
    }
}

function ot(n, u) {
    n & 1 && (e(0, "option", 14), r(1, "No Data!."), i())
}

function lt(n, u) {
    if (n & 1 && (e(0, "option", 15), r(1), i()), n & 2) {
        let a = u.$implicit;
        b("value", a.nama), o(), S(a.nama)
    }
}

function mt(n, u) {
    n & 1 && (e(0, "option", 14), r(1, "No Data!."), i())
}

function ut(n, u) {
    if (n & 1 && (e(0, "button", 40), r(1, " Submit "), i()), n & 2) {
        let a = J();
        m("disabled", !a.inputForm.valid)
    }
}

function pt(n, u) {
    n & 1 && g(0, "app-loading")
}
var Z = (() => {
    class n {
        constructor() {
            this.gudangService = h(W), this.toastr = h(z), this.fb = h(H), this.inputForm = this.fb.group({
                noFaktur: new d("", [l.required, l.minLength(3)]),
                tglFaktur: new d("", [l.required]),
                distributor: new d("", [l.required]),
                batch: new d("", [l.required, l.minLength(3)]),
                nama: new d("", [l.required, l.minLength(3)]),
                expired: new d("", [l.required]),
                satuan: new d("", [l.required, l.minLength(3)]),
                kategori: new d("", [l.required]),
                jenis: new d("", [l.required, l.minLength(3)]),
                jumlah: new d(0, [l.required, l.min(1)]),
                hargaBeli: new d(0, [l.required, l.min(1)]),
                hargaSatuan: new d(0, [l.required, l.min(1)]),
                hargaJualBPJS: new d(0, [l.required, l.min(1)]),
                hargaJualYANKES: new d(0, [l.required, l.min(1)])
            }), this.isLoading = !1, this.dataDistributor = [], this.dataKategori = [], this.dataSatuan = [], this.dataJenisSediaan = [], this.dataObat = [], this.dataMargin = null, this.searchNama = a => a.pipe(N(200), y(p => p === "" ? [] : this.dataObat.filter(t => t.nama.toLowerCase().indexOf(p.toLowerCase()) > -1).slice(0, 10))), this.formatter = a => a.nama
        }
        ngOnInit() {
            this.gudangService.getDistributor().subscribe(a => {
                this.dataDistributor = a
            }), this.gudangService.getKategori().subscribe(a => {
                this.dataKategori = a
            }), this.gudangService.getSatuan().subscribe(a => {
                this.dataSatuan = a
            }), this.gudangService.getJenisSediaan().subscribe(a => {
                this.dataJenisSediaan = a
            }), this.getDataMargin()
        }
        getDataItem() {
            this.inputForm.patchValue({
                nama: ""
            });
            let a = this.inputForm.value.kategori;
            a && this.gudangService.getDaftarItems(a).subscribe({
                next: p => {
                    this.dataObat = p
                },
                error: p => {}
            })
        }
        getDataMargin() {
            this.gudangService.getMargin("").subscribe({
                next: a => {
                    this.dataMargin = a.data
                },
                error: a => {
                    this.toastr.error(a, "Error", {})
                },
                complete: () => {}
            })
        }
        calculateHargaJual() {
            this.inputForm.patchValue({
                hargaSatuan: Math.ceil(this.inputForm.value.hargaBeli / this.inputForm.value.jumlah)
            }), this.inputForm.patchValue({
                hargaJualBPJS: Math.ceil(this.inputForm.value.hargaSatuan + this.inputForm.value.hargaSatuan * this.dataMargin.marginBpjsYankes / 100),
                hargaJualYANKES: Math.ceil(this.inputForm.value.hargaSatuan + this.inputForm.value.hargaSatuan * this.dataMargin.marginUmum / 100)
            })
        }
        onSubmit() {
            this.isLoading = !0;
            let a = null;
            this.inputForm.getRawValue().distributor && (a = JSON.parse(this.inputForm.getRawValue().distributor));
            let p = {
                noFaktur: this.inputForm.value.noFaktur,
                tglFaktur: this.inputForm.value.tglFaktur,
                distributor: a._id,
                kategori: this.inputForm.value.kategori,
                batch: this.inputForm.value.batch,
                nama: this.inputForm.value.nama.nama,
                expired: this.inputForm.value.expired,
                satuan: this.inputForm.value.satuan,
                jenis: this.inputForm.value.jenis,
                jumlah: this.inputForm.value.jumlah,
                hargaBeli: this.inputForm.value.hargaBeli,
                hargaSatuan: this.inputForm.value.hargaSatuan,
                hargaJualBPJS: this.inputForm.value.hargaJualBPJS,
                hargaJualYANKES: this.inputForm.value.hargaJualYANKES
            };
            this.gudangService.inputBarangBhp(p, this.stock).subscribe({
                next: t => {
                    this.toastr.success(this.inputForm.value.kategori + " berhasil di tambahkan"), this.inputForm.reset(), this.isLoading = !1
                },
                error: t => {
                    this.toastr.error(t, "Error"), this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(p) {
                return new(p || n)
            }
        }
        static {
            this.\u0275cmp = C({
                type: n,
                selectors: [
                    ["app-input-barang-bhp"]
                ],
                inputs: {
                    stock: "stock"
                },
                decls: 110,
                vars: 69,
                consts: [
                    [1, "card"],
                    [1, "card-body"],
                    [1, "row"],
                    [1, "col"],
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    ["autocomplete", "off", 3, "submit", "formGroup"],
                    [1, "row", "mb-3"],
                    ["for", "noFaktur", 1, "col-md-4", "col-form-label"],
                    [1, "col-md-8"],
                    ["type", "text", "id", "noFaktur", "formControlName", "noFaktur", 1, "form-control", 3, "ngClass"],
                    ["for", "tglFaktur", 1, "col-md-4", "col-form-label"],
                    ["type", "date", "id", "tglFaktur", "formControlName", "tglFaktur", 1, "form-control", 3, "ngClass"],
                    ["for", "distributor", 1, "col-md-4", "col-form-label"],
                    ["aria-label", "Default select example", "formControlName", "distributor", 1, "form-select", 3, "ngClass"],
                    ["value", ""],
                    [3, "value"],
                    ["for", "kategori", 1, "col-md-4", "col-form-label"],
                    ["aria-label", "Default select example", "formControlName", "kategori", 1, "form-select", 3, "change", "ngClass"],
                    ["for", "batch", 1, "col-md-4", "col-form-label"],
                    ["type", "text", "id", "batch", "formControlName", "batch", 1, "form-control", 3, "ngClass"],
                    ["id", "nama", "type", "text", "formControlName", "nama", 1, "form-control", "col", 3, "ngClass", "ngbTypeahead", "inputFormatter", "resultFormatter", "editable"],
                    ["for", "expired", 1, "col-md-4", "col-form-label"],
                    ["type", "date", "id", "expired", "formControlName", "expired", 1, "form-control", 3, "ngClass"],
                    ["for", "satuan", 1, "col-md-4", "col-form-label"],
                    ["aria-label", "Default select example", "formControlName", "satuan", 1, "form-select", 3, "ngClass"],
                    ["for", "jenis", 1, "col-md-4", "col-form-label"],
                    ["aria-label", "Default select example", "formControlName", "jenis", 1, "form-select", 3, "ngClass"],
                    ["for", "jumlah", 1, "col-md-4", "col-form-label"],
                    ["type", "text", "id", "jumlah", "formControlName", "jumlah", 1, "form-control", 3, "keyup", "ngClass"],
                    ["for", "hargaBeli", 1, "col-md-4", "col-form-label"],
                    ["type", "text", "id", "hargaBeli", "formControlName", "hargaBeli", 1, "form-control", 3, "keyup", "ngClass"],
                    ["for", "hargaSatuan", 1, "col-md-4", "col-form-label"],
                    ["type", "text", "id", "hargaSatuan", "formControlName", "hargaSatuan", "readonly", "", 1, "form-control", 3, "ngClass"],
                    ["for", "hargaJualBPJS", 1, "col-md-4", "col-form-label"],
                    [1, "input-group"],
                    ["type", "number", "formControlName", "hargaJualBPJS", "readonly", "", 1, "form-control", 3, "ngClass"],
                    ["id", "basic-addon2", 1, "input-group-text"],
                    ["for", "hargaJualYANKES", 1, "col-md-4", "col-form-label"],
                    ["type", "number", "formControlName", "hargaJualYANKES", "readonly", "", 1, "form-control", 3, "ngClass"],
                    [1, "col-md-4"],
                    ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"]
                ],
                template: function(p, t) {
                    p & 1 && (e(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4), r(5), i()(), e(6, "div", 2)(7, "div", 3)(8, "form", 5), F("submit", function() {
                        return t.onSubmit()
                    }), e(9, "div", 6)(10, "label", 7), r(11, "NO.FAKTUR"), i(), e(12, "div", 8), g(13, "input", 9), i()(), e(14, "div", 6)(15, "label", 10), r(16, "TGL.FAKTUR"), i(), e(17, "div", 8), g(18, "input", 11), i()(), e(19, "div", 6)(20, "label", 12), r(21, "DISTRIBUTOR"), i(), e(22, "div", 8)(23, "select", 13)(24, "option", 14), r(25, "-- Pilih --"), i(), v(26, et, 3, 4, "option", 15, E, !1, it, 2, 0, "option", 14), i()()(), e(29, "div", 6)(30, "label", 16), r(31, "KATEGORI"), i(), e(32, "div", 8)(33, "select", 17), F("change", function() {
                        return t.getDataItem()
                    }), e(34, "option", 14), r(35, "-- Pilih --"), i(), v(36, at, 2, 2, "option", 15, E, !1, nt, 2, 0, "option", 14), i()()(), e(39, "div", 6)(40, "label", 18), r(41, "NO.BATCH"), i(), e(42, "div", 8), g(43, "input", 19), i()(), e(44, "div", 6)(45, "label", 18), r(46, "NAMA"), i(), e(47, "div", 8), g(48, "input", 20), i()(), e(49, "div", 6)(50, "label", 21), r(51, "TGL.EXPIRED"), i(), e(52, "div", 8), g(53, "input", 22), i()(), e(54, "div", 6)(55, "label", 23), r(56, "SATUAN"), i(), e(57, "div", 8)(58, "select", 24)(59, "option", 14), r(60, "-- Pilih --"), i(), v(61, rt, 2, 2, "option", 15, E, !1, ot, 2, 0, "option", 14), i()()(), e(64, "div", 6)(65, "label", 25), r(66, "JENIS SEDIAAN"), i(), e(67, "div", 8)(68, "select", 26)(69, "option", 14), r(70, "-- Pilih --"), i(), v(71, lt, 2, 2, "option", 15, E, !1, mt, 2, 0, "option", 14), i()()(), e(74, "div", 6)(75, "label", 27), r(76, "JUMLAH SATUAN"), i(), e(77, "div", 8)(78, "input", 28), F("keyup", function() {
                        return t.calculateHargaJual()
                    }), i()()(), e(79, "div", 6)(80, "label", 29), r(81, "HARGA TOTAL + PPN"), i(), e(82, "div", 8)(83, "input", 30), F("keyup", function() {
                        return t.calculateHargaJual()
                    }), i()()(), e(84, "div", 6)(85, "label", 31), r(86, "HARGA / TAB"), i(), e(87, "div", 8), g(88, "input", 32), i()(), e(89, "div", 6)(90, "label", 33), r(91, "HARGA JUAL BPJS/YANKES"), i(), e(92, "div", 8)(93, "div", 34), g(94, "input", 35), e(95, "span", 36), r(96), i()()()(), e(97, "div", 6)(98, "label", 37), r(99, "HARGA JUAL UMUM"), i(), e(100, "div", 8)(101, "div", 34), g(102, "input", 38), e(103, "span", 36), r(104), i()()()(), e(105, "div", 6), g(106, "div", 39), e(107, "div", 8), k(108, ut, 2, 1, "button", 40)(109, pt, 1, 0, "app-loading"), i()()()()()()()()), p & 2 && (o(5), B(" Input Barang ", t.stock, " "), o(3), m("formGroup", t.inputForm), o(5), m("ngClass", s(27, c, t.inputForm.controls.noFaktur.invalid && t.inputForm.controls.noFaktur.touched, t.inputForm.controls.noFaktur.valid)), o(5), m("ngClass", s(30, c, t.inputForm.controls.tglFaktur.invalid && t.inputForm.controls.tglFaktur.touched, t.inputForm.controls.tglFaktur.valid)), o(5), m("ngClass", s(33, c, t.inputForm.controls.distributor.invalid && t.inputForm.controls.distributor.touched, t.inputForm.controls.distributor.valid)), o(3), f(t.dataDistributor), o(7), m("ngClass", s(36, c, t.inputForm.controls.kategori.invalid && t.inputForm.controls.kategori.touched, t.inputForm.controls.kategori.valid)), o(3), f(t.dataKategori), o(7), m("ngClass", s(39, c, t.inputForm.controls.batch.invalid && t.inputForm.controls.batch.touched, t.inputForm.controls.batch.valid)), o(5), m("ngClass", s(42, c, t.inputForm.controls.nama.invalid && t.inputForm.controls.nama.touched, t.inputForm.controls.nama.valid))("ngbTypeahead", t.searchNama)("inputFormatter", t.formatter)("resultFormatter", t.formatter)("editable", !1), o(5), m("ngClass", s(45, c, t.inputForm.controls.expired.invalid && t.inputForm.controls.expired.touched, t.inputForm.controls.expired.valid)), o(5), m("ngClass", s(48, c, t.inputForm.controls.satuan.invalid && t.inputForm.controls.satuan.touched, t.inputForm.controls.satuan.valid)), o(3), f(t.dataSatuan), o(7), m("ngClass", s(51, c, t.inputForm.controls.jenis.invalid && t.inputForm.controls.jenis.touched, t.inputForm.controls.jenis.valid)), o(3), f(t.dataJenisSediaan), o(7), m("ngClass", s(54, c, t.inputForm.controls.jumlah.invalid && t.inputForm.controls.jumlah.touched, t.inputForm.controls.jumlah.valid)), o(5), m("ngClass", s(57, c, t.inputForm.controls.hargaBeli.invalid && t.inputForm.controls.hargaBeli.touched, t.inputForm.controls.hargaBeli.valid)), o(5), m("ngClass", s(60, c, t.inputForm.controls.hargaSatuan.invalid && t.inputForm.controls.hargaSatuan.touched, t.inputForm.controls.hargaSatuan.valid)), o(6), m("ngClass", s(63, c, t.inputForm.controls.hargaJualBPJS.invalid && t.inputForm.controls.hargaJualBPJS.touched, t.inputForm.controls.hargaJualBPJS.valid)), o(2), B("(Margin: ", t.dataMargin == null ? null : t.dataMargin.marginBpjsYankes, "%)"), o(6), m("ngClass", s(66, c, t.inputForm.controls.hargaJualYANKES.invalid && t.inputForm.controls.hargaJualYANKES.touched, t.inputForm.controls.hargaJualYANKES.valid)), o(2), B("(Margin: ", t.dataMargin == null ? null : t.dataMargin.marginUmum, "%)"), o(4), I(t.isLoading ? 109 : 108))
                },
                dependencies: [V, x, U, Y, L, q, G, P, K, R, O, X, $, j, M, D, Q],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Jt = (() => {
    class n {
        constructor() {
            this.route = h(w), this.getStock = this.route.paramMap.subscribe(a => {
                this.stock = a.get("stock")
            })
        }
        static {
            this.\u0275fac = function(p) {
                return new(p || n)
            }
        }
        static {
            this.\u0275cmp = C({
                type: n,
                selectors: [
                    ["app-input-barang-home"]
                ],
                decls: 1,
                vars: 1,
                consts: [
                    [3, "stock"]
                ],
                template: function(p, t) {
                    p & 1 && g(0, "app-input-barang-bhp", 0), p & 2 && m("stock", t.stock)
                },
                dependencies: [Z],
                encapsulation: 2
            })
        }
    }
    return n
})();
export {
    Jt as a
};