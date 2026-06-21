import {
    a as W
} from "./chunk-LP3CUFG4.js";
import {
    a as Z
} from "./chunk-G2DQ3SJM.js";
import {
    f as oe,
    l as re
} from "./chunk-JD6JIJOO.js";
import {
    a as ce
} from "./chunk-FUXXJWDL.js";
import {
    s as Ee,
    y as z,
    z as Q
} from "./chunk-QGNVLNC6.js";
import {
    a as ne
} from "./chunk-IVTVBFQS.js";
import {
    a as V
} from "./chunk-UI7HE65P.js";
import {
    b as P,
    c as p,
    e as D,
    f as ve,
    i as y,
    k as R,
    l as Se,
    m as q,
    o as _e,
    p as Ce,
    q as X,
    r as J,
    s as j,
    t as le,
    v as ke,
    x as K,
    y as ye
} from "./chunk-NKLTBXW5.js";
import {
    k as T
} from "./chunk-QJBCP6KK.js";
import {
    h as he,
    q as be,
    r as fe,
    s as A
} from "./chunk-CFNDTNZN.js";
import {
    Da as x,
    Db as M,
    Dc as ge,
    Ea as L,
    Ec as n,
    Fc as h,
    Gc as C,
    H as $,
    Kb as O,
    Kc as v,
    Lc as S,
    Mc as _,
    N as Y,
    Qc as k,
    R as ee,
    Sc as ie,
    Tc as ae,
    Zb as u,
    cc as F,
    dc as te,
    ec as w,
    fc as B,
    g as ue,
    gc as i,
    hc as a,
    ic as b,
    mc as I,
    qb as r,
    ra as c,
    sc as f,
    tc as g,
    wc as N,
    x as U,
    yb as G,
    zb as H
} from "./chunk-UYVTZL26.js";

function Te(o, s) {
    if (o & 1 && (i(0, "tr")(1, "td"), n(2), a(), i(3, "td", 17), n(4), a(), i(5, "td"), n(6), a(), i(7, "td"), n(8), a(), i(9, "td", 17), n(10), a()()), o & 2) {
        let t = s.$implicit,
            l = s.$index;
        r(2), C("", l + 1, "."), r(2), h(t.noFaktur), r(2), h(t.nama), r(2), h(t.satuan), r(2), h(t.jumlah)
    }
}

function we(o, s) {
    o & 1 && (i(0, "tr")(1, "td", 18), n(2, "No Data!."), a()())
}
var st = (() => {
    class o {
        constructor() {
            this.gudangService = c(W), this.modalService = c(Ee), this.toastr = c(T), this.listItems = [], this.getItems("OBAT")
        }
        getItems(t) {
            this.gudangService.listObatLuarByKategori(t).subscribe({
                next: l => {
                    if (l.status === "error") {
                        this.listItems = [];
                        return
                    }
                    this.listItems = l
                },
                error: l => {
                    this.toastr.error(l.message)
                }
            })
        }
        static {
            this.\u0275fac = function(l) {
                return new(l || o)
            }
        }
        static {
            this.\u0275cmp = M({
                type: o,
                selectors: [
                    ["app-list-obat-luar"]
                ],
                decls: 38,
                vars: 1,
                consts: [
                    ["kategori", ""],
                    [1, "card"],
                    [1, "card-body"],
                    [1, "row"],
                    [1, "col"],
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    [1, "row", "mb-2"],
                    [1, "d-flex", "justify-content-between", "align-items-center"],
                    [1, "col-6"],
                    ["aria-label", "Default select example", 1, "form-select", 3, "change"],
                    ["value", "OBAT"],
                    ["value", "BHP"],
                    ["value", "ALKES"],
                    [1, "table-responsive"],
                    [1, "table", "table-hover", "table-striped", "table-sm"],
                    ["scope", "col"],
                    [1, "table-group-divider", "text-danger"],
                    [1, "text-end"],
                    ["colspan", "11", 1, "text-center", "fw-bold"]
                ],
                template: function(l, e) {
                    if (l & 1) {
                        let m = I();
                        i(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5), n(5, " List Stock Luar "), a()()(), i(6, "div", 6)(7, "div", 4)(8, "div", 7)(9, "div", 8)(10, "select", 9, 0), f("change", function() {
                            x(m);
                            let Oe = ge(11);
                            return L(e.getItems(Oe.value))
                        }), i(12, "option", 10), n(13, "OBAT"), a(), i(14, "option", 11), n(15, "BHP"), a(), i(16, "option", 12), n(17, "ALKES"), a()()()()()(), i(18, "div", 6)(19, "div", 4)(20, "div", 13)(21, "table", 14)(22, "thead")(23, "tr")(24, "th", 15), n(25, "#"), a(), i(26, "th", 15), n(27, "NO.FAKTUR"), a(), i(28, "th", 15), n(29, "NAMA"), a(), i(30, "th", 15), n(31, "SATUAN"), a(), i(32, "th", 15), n(33, "JUMLAH"), a()()(), i(34, "tbody", 16), w(35, Te, 11, 5, "tr", null, te, !1, we, 3, 0, "tr"), a()()()()()()()
                    }
                    l & 2 && (r(35), B(e.listItems))
                },
                dependencies: [K, J, j],
                encapsulation: 2
            })
        }
    }
    return o
})();
var de = (o, s) => s._id,
    E = (o, s) => ({
        "is-invalid": o,
        "is-valid": s
    });

function Ne(o, s) {
    if (o & 1 && (i(0, "option", 15), ie(1, "json"), n(2), a()), o & 2) {
        let t = s.$implicit;
        N("value", ae(1, 2, t)), r(2), h(t.nama)
    }
}

function Ie(o, s) {
    o & 1 && (i(0, "option", 14), n(1, "No Data!."), a())
}

function Ae(o, s) {
    if (o & 1 && (i(0, "option", 15), n(1), a()), o & 2) {
        let t = s.$implicit;
        N("value", t.nama), r(), h(t.nama)
    }
}

function Pe(o, s) {
    o & 1 && (i(0, "option", 14), n(1, "No Data!."), a())
}

function De(o, s) {
    if (o & 1 && (i(0, "option", 15), n(1), a()), o & 2) {
        let t = s.$implicit;
        N("value", t.nama), r(), h(t.nama)
    }
}

function Je(o, s) {
    o & 1 && (i(0, "option", 14), n(1, "No Data!."), a())
}

function je(o, s) {
    if (o & 1 && (i(0, "option", 15), n(1), a()), o & 2) {
        let t = s.$implicit;
        N("value", t.nama), r(), h(t.nama)
    }
}

function Ke(o, s) {
    o & 1 && (i(0, "option", 14), n(1, "No Data!."), a())
}

function Ve(o, s) {
    if (o & 1 && (i(0, "button", 40), n(1, " Submit "), a()), o & 2) {
        let t = g();
        u("disabled", !t.inputForm.valid)
    }
}

function We(o, s) {
    o & 1 && b(0, "app-loading")
}
var _t = (() => {
    class o {
        constructor() {
            this.gudangService = c(W), this.toastr = c(T), this.fb = c(ke), this.inputForm = this.fb.group({
                noFaktur: new y("", [p.required, p.minLength(3)]),
                tglFaktur: new y("", [p.required]),
                distributor: new y("", [p.required]),
                batch: new y("", [p.required, p.minLength(3)]),
                nama: new y("", [p.required, p.minLength(3)]),
                expired: new y("", [p.required]),
                satuan: new y("", [p.required, p.minLength(3)]),
                kategori: new y("", [p.required]),
                jenis: new y("", [p.required, p.minLength(3)]),
                jumlah: new y(0, [p.required, p.min(1)]),
                hargaBeli: new y(0, [p.required, p.min(1)]),
                hargaSatuan: new y(0, [p.required, p.min(1)]),
                hargaJualBPJS: new y(0, [p.required, p.min(1)]),
                hargaJualYANKES: new y(0, [p.required, p.min(1)])
            }), this.isLoading = !1, this.dataDistributor = [], this.dataKategori = [], this.dataSatuan = [], this.dataJenisSediaan = [], this.dataObat = [], this.dataMargin = null, this.searchNama = t => t.pipe(Y(200), U(l => l === "" ? [] : this.dataObat.filter(e => e.nama.toLowerCase().indexOf(l.toLowerCase()) > -1).slice(0, 10))), this.formatter = t => t.nama
        }
        ngOnInit() {
            this.gudangService.getDistributor().subscribe(t => {
                this.dataDistributor = t
            }), this.gudangService.getKategori().subscribe(t => {
                this.dataKategori = t
            }), this.gudangService.getSatuan().subscribe(t => {
                this.dataSatuan = t
            }), this.gudangService.getJenisSediaan().subscribe(t => {
                this.dataJenisSediaan = t
            }), this.getDataMargin()
        }
        getDataItem() {
            this.inputForm.patchValue({
                nama: ""
            });
            let t = this.inputForm.value.kategori;
            t && this.gudangService.getDaftarItems(t).subscribe({
                next: l => {
                    this.dataObat = l
                },
                error: l => {}
            })
        }
        getDataMargin() {
            this.gudangService.getMargin("").subscribe({
                next: t => {
                    this.dataMargin = t.data
                },
                error: t => {
                    this.toastr.error(t, "Error", {})
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
            let t = null;
            this.inputForm.getRawValue().distributor && (t = JSON.parse(this.inputForm.getRawValue().distributor));
            let l = {
                noFaktur: this.inputForm.value.noFaktur,
                tglFaktur: this.inputForm.value.tglFaktur,
                distributor: t._id,
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
            this.gudangService.inputObatLuar(l).subscribe({
                next: e => {
                    this.toastr.success(this.inputForm.value.kategori + " berhasil di tambahkan"), this.inputForm.reset(), this.isLoading = !1
                },
                error: e => {
                    this.toastr.error(e, "Error"), this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(l) {
                return new(l || o)
            }
        }
        static {
            this.\u0275cmp = M({
                type: o,
                selectors: [
                    ["app-input-obat-luar"]
                ],
                decls: 110,
                vars: 68,
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
                template: function(l, e) {
                    l & 1 && (i(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4), n(5, " Input Stock Luar "), a()(), i(6, "div", 2)(7, "div", 3)(8, "form", 5), f("submit", function() {
                        return e.onSubmit()
                    }), i(9, "div", 6)(10, "label", 7), n(11, "NO.FAKTUR"), a(), i(12, "div", 8), b(13, "input", 9), a()(), i(14, "div", 6)(15, "label", 10), n(16, "TGL.FAKTUR"), a(), i(17, "div", 8), b(18, "input", 11), a()(), i(19, "div", 6)(20, "label", 12), n(21, "DISTRIBUTOR"), a(), i(22, "div", 8)(23, "select", 13)(24, "option", 14), n(25, "-- Pilih --"), a(), w(26, Ne, 3, 4, "option", 15, de, !1, Ie, 2, 0, "option", 14), a()()(), i(29, "div", 6)(30, "label", 16), n(31, "KATEGORI"), a(), i(32, "div", 8)(33, "select", 17), f("change", function() {
                        return e.getDataItem()
                    }), i(34, "option", 14), n(35, "-- Pilih --"), a(), w(36, Ae, 2, 2, "option", 15, de, !1, Pe, 2, 0, "option", 14), a()()(), i(39, "div", 6)(40, "label", 18), n(41, "NO.BATCH"), a(), i(42, "div", 8), b(43, "input", 19), a()(), i(44, "div", 6)(45, "label", 18), n(46, "NAMA"), a(), i(47, "div", 8), b(48, "input", 20), a()(), i(49, "div", 6)(50, "label", 21), n(51, "TGL.EXPIRED"), a(), i(52, "div", 8), b(53, "input", 22), a()(), i(54, "div", 6)(55, "label", 23), n(56, "SATUAN"), a(), i(57, "div", 8)(58, "select", 24)(59, "option", 14), n(60, "-- Pilih --"), a(), w(61, De, 2, 2, "option", 15, de, !1, Je, 2, 0, "option", 14), a()()(), i(64, "div", 6)(65, "label", 25), n(66, "JENIS SEDIAAN"), a(), i(67, "div", 8)(68, "select", 26)(69, "option", 14), n(70, "-- Pilih --"), a(), w(71, je, 2, 2, "option", 15, de, !1, Ke, 2, 0, "option", 14), a()()(), i(74, "div", 6)(75, "label", 27), n(76, "JUMLAH SATUAN"), a(), i(77, "div", 8)(78, "input", 28), f("keyup", function() {
                        return e.calculateHargaJual()
                    }), a()()(), i(79, "div", 6)(80, "label", 29), n(81, "HARGA TOTAL + PPN"), a(), i(82, "div", 8)(83, "input", 30), f("keyup", function() {
                        return e.calculateHargaJual()
                    }), a()()(), i(84, "div", 6)(85, "label", 31), n(86, "HARGA / TAB"), a(), i(87, "div", 8), b(88, "input", 32), a()(), i(89, "div", 6)(90, "label", 33), n(91, "HARGA JUAL BPJS/YANKES"), a(), i(92, "div", 8)(93, "div", 34), b(94, "input", 35), i(95, "span", 36), n(96), a()()()(), i(97, "div", 6)(98, "label", 37), n(99, "HARGA JUAL UMUM"), a(), i(100, "div", 8)(101, "div", 34), b(102, "input", 38), i(103, "span", 36), n(104), a()()()(), i(105, "div", 6), b(106, "div", 39), i(107, "div", 8), O(108, Ve, 2, 1, "button", 40)(109, We, 1, 0, "app-loading"), a()()()()()()()()), l & 2 && (r(8), u("formGroup", e.inputForm), r(5), u("ngClass", k(26, E, e.inputForm.controls.noFaktur.invalid && e.inputForm.controls.noFaktur.touched, e.inputForm.controls.noFaktur.valid)), r(5), u("ngClass", k(29, E, e.inputForm.controls.tglFaktur.invalid && e.inputForm.controls.tglFaktur.touched, e.inputForm.controls.tglFaktur.valid)), r(5), u("ngClass", k(32, E, e.inputForm.controls.distributor.invalid && e.inputForm.controls.distributor.touched, e.inputForm.controls.distributor.valid)), r(3), B(e.dataDistributor), r(7), u("ngClass", k(35, E, e.inputForm.controls.kategori.invalid && e.inputForm.controls.kategori.touched, e.inputForm.controls.kategori.valid)), r(3), B(e.dataKategori), r(7), u("ngClass", k(38, E, e.inputForm.controls.batch.invalid && e.inputForm.controls.batch.touched, e.inputForm.controls.batch.valid)), r(5), u("ngClass", k(41, E, e.inputForm.controls.nama.invalid && e.inputForm.controls.nama.touched, e.inputForm.controls.nama.valid))("ngbTypeahead", e.searchNama)("inputFormatter", e.formatter)("resultFormatter", e.formatter)("editable", !1), r(5), u("ngClass", k(44, E, e.inputForm.controls.expired.invalid && e.inputForm.controls.expired.touched, e.inputForm.controls.expired.valid)), r(5), u("ngClass", k(47, E, e.inputForm.controls.satuan.invalid && e.inputForm.controls.satuan.touched, e.inputForm.controls.satuan.valid)), r(3), B(e.dataSatuan), r(7), u("ngClass", k(50, E, e.inputForm.controls.jenis.invalid && e.inputForm.controls.jenis.touched, e.inputForm.controls.jenis.valid)), r(3), B(e.dataJenisSediaan), r(7), u("ngClass", k(53, E, e.inputForm.controls.jumlah.invalid && e.inputForm.controls.jumlah.touched, e.inputForm.controls.jumlah.valid)), r(5), u("ngClass", k(56, E, e.inputForm.controls.hargaBeli.invalid && e.inputForm.controls.hargaBeli.touched, e.inputForm.controls.hargaBeli.valid)), r(5), u("ngClass", k(59, E, e.inputForm.controls.hargaSatuan.invalid && e.inputForm.controls.hargaSatuan.touched, e.inputForm.controls.hargaSatuan.valid)), r(6), u("ngClass", k(62, E, e.inputForm.controls.hargaJualBPJS.invalid && e.inputForm.controls.hargaJualBPJS.touched, e.inputForm.controls.hargaJualBPJS.valid)), r(2), C("(Margin: ", e.dataMargin == null ? null : e.dataMargin.marginBpjsYankes, "%)"), r(6), u("ngClass", k(65, E, e.inputForm.controls.hargaJualYANKES.invalid && e.inputForm.controls.hargaJualYANKES.touched, e.inputForm.controls.hargaJualYANKES.valid)), r(2), C("(Margin: ", e.dataMargin == null ? null : e.dataMargin.marginUmum, "%)"), r(4), F(e.isLoading ? 109 : 108))
                },
                dependencies: [ye, Se, J, j, P, q, X, D, ve, _e, Ce, Q, z, A, he, be, V],
                encapsulation: 2
            })
        }
    }
    return o
})();
var xe = ue(ce());

function Ue(o, s) {
    if (o & 1 && (i(0, "tr")(1, "td", 11), n(2), a(), i(3, "td"), n(4), a(), i(5, "td", 12), n(6), a(), i(7, "td"), n(8), a(), i(9, "td", 12), n(10), ie(11, "number"), a(), i(12, "td"), n(13), a(), i(14, "td"), n(15), a(), i(16, "td"), n(17), a()()), o & 2) {
        let t = s.$implicit,
            l = s.$index;
        r(2), C("", l + 1, "."), r(2), h(t.dataObat.nama), r(2), h(t.dataObat.noFaktur), r(2), h(t.dataDistributor.nama), r(2), h(ae(11, 8, t.quantity)), r(3), h(t.keterangan), r(2), h(t.action), r(2), h(t.user)
    }
}

function Ye(o, s) {
    o & 1 && (i(0, "tr", 10)(1, "td", 13), n(2, "No Data!."), a()())
}

function Ge(o, s) {
    if (o & 1 && (i(0, "div", 6)(1, "table", 7)(2, "thead", 8)(3, "tr")(4, "th", 9), n(5, "No"), a(), i(6, "th", 9), n(7, "Nama"), a(), i(8, "th", 9), n(9, "Faktur"), a(), i(10, "th", 9), n(11, "Distributor"), a(), i(12, "th", 9), n(13, "Jumlah"), a(), i(14, "th", 9), n(15, "Keterangan"), a(), i(16, "th", 9), n(17, "Action"), a(), i(18, "th", 9), n(19, "User"), a()()(), i(20, "tbody"), w(21, Ue, 18, 10, "tr", null, te, !1, Ye, 3, 0, "tr", 10), a()()()), o & 2) {
        let t = g();
        r(21), B(t.apotekService.dataLogs())
    }
}

function He(o, s) {
    o & 1 && b(0, "app-loading")
}
var pe = (() => {
    class o {
        constructor() {
            this.tanggal = (0, xe.default)().format("YYYY-MM-DD"), this.apotekService = c(Z), this.toastr = c(T), this.isLoading = !1, this.depo = H("")
        }
        ngOnInit() {
            this.getLogsObat()
        }
        getLogsObat() {
            this.isLoading = !0, this.apotekService.getLogsObat(this.tanggal, this.depo()).subscribe({
                next: t => {
                    t && this.apotekService.dataLogs.set(t.data)
                },
                error: t => {
                    this.toastr.error(t.message)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(l) {
                return new(l || o)
            }
        }
        static {
            this.\u0275cmp = M({
                type: o,
                selectors: [
                    ["app-logs"]
                ],
                inputs: {
                    depo: [1, "depo"]
                },
                outputs: {
                    depo: "depoChange"
                },
                decls: 10,
                vars: 2,
                consts: [
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    [1, "mb-3"],
                    [1, "row"],
                    [1, "col-md-6"],
                    ["for", "tanggal", 1, "form-label"],
                    ["id", "tanggal", "type", "date", 1, "form-control", 3, "ngModelChange", "change", "ngModel"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-danger", "text-center"],
                    ["scope", "row"],
                    [1, "text-end"],
                    ["scope", "row", "colspan", "8"]
                ],
                template: function(l, e) {
                    l & 1 && (i(0, "div", 0), n(1, "Logs"), a(), i(2, "div", 1)(3, "div", 2)(4, "div", 3)(5, "label", 4), n(6, "Tanggal"), a(), i(7, "input", 5), _("ngModelChange", function(d) {
                        return S(e.tanggal, d) || (e.tanggal = d), d
                    }), f("change", function() {
                        return e.getLogsObat()
                    }), a()()()(), O(8, Ge, 24, 1, "div", 6)(9, He, 1, 0, "app-loading")), l & 2 && (r(7), v("ngModel", e.tanggal), r(), F(e.isLoading ? 9 : 8))
                },
                dependencies: [K, P, D, R, V, A, fe],
                encapsulation: 2
            })
        }
    }
    return o
})();
var Le = ue(ce());

function Re(o, s) {
    if (o & 1) {
        let t = I();
        i(0, "div", 7)(1, "label", 18), n(2), a(), i(3, "input", 19), _("ngModelChange", function(e) {
            x(t);
            let m = g(2);
            return S(m.model, e) || (m.model = e), L(e)
        }), a()()
    }
    if (o & 2) {
        let t = g(2);
        r(2), C("Search ", t.kategori(), ""), r(), v("ngModel", t.model), u("ngbTypeahead", t.search)("inputFormatter", t.formatter1)("resultFormatter", t.formatter)("editable", !1)
    }
}

function qe(o, s) {
    if (o & 1 && (i(0, "div", 7)(1, "div", 20)(2, "strong"), n(3, "Perhatian!!"), a(), n(4), a()()), o & 2) {
        let t = g(2);
        r(4), C(" Tidak ada stock ", t.kategori(), ". ")
    }
}

function Xe(o, s) {
    if (o & 1 && O(0, Re, 4, 6, "div", 7)(1, qe, 5, 1, "div", 7), o & 2) {
        let t = g();
        F(t.dataStock ? 0 : 1)
    }
}

function ze(o, s) {
    o & 1 && (i(0, "div", 7), b(1, "app-loading"), a())
}

function Qe(o, s) {
    if (o & 1) {
        let t = I();
        i(0, "div", 21)(1, "label", 22), n(2, "Jumlah"), a(), i(3, "input", 23), _("ngModelChange", function(e) {
            x(t);
            let m = g();
            return S(m.jumlah, e) || (m.jumlah = e), L(e)
        }), a()(), i(4, "div", 7)(5, "label", 24), n(6, "Keterangan"), a(), i(7, "input", 25), _("ngModelChange", function(e) {
            x(t);
            let m = g();
            return S(m.keterangan, e) || (m.keterangan = e), L(e)
        }), a()()
    }
    if (o & 2) {
        let t = g();
        r(3), v("ngModel", t.jumlah), r(4), v("ngModel", t.keterangan)
    }
}
var Yt = (() => {
    class o {
        constructor() {
            this.apotekService = c(Z), this.gudangService = c(W), this.toastr = c(T), this.isLoading = !1, this.depo = H(""), this.kategori = G("OBAT"), this.stock = G(""), this.dataStock = [], this.jumlah = 1, this.keterangan = "", this.store = c(oe), this.userSelector = this.store.select(re).pipe(ne()).subscribe(t => {
                this.currentUser = t
            }), this.formatter = t => t.nama + " | Stock: " + t.jumlah.toLocaleString() + " | Harga: " + t.hargaJualYANKES.toLocaleString() + " | Faktur: " + t.noFaktur + " | Distributor: " + t.dataDistributor[0]?.nama, this.formatter1 = t => t.nama, this.search = t => t.pipe(Y(200), ee(), $(l => l.length >= 2), U(l => this.dataStock.filter(e => new RegExp(l, "mi").test(e.nama)).slice(0, 10)))
        }
        initValue() {
            this.jumlah = 1, this.keterangan = ""
        }
        getDataObat(t, l) {
            if (this.model = null, this.isLoading = !0, this.getLogsObat(), t === "") {
                this.isLoading = !1;
                return
            }
            let e;
            switch (t) {
                case "apotek":
                    e = this.apotekService.getStockApotekByKategori(l);
                    break;
                case "inap":
                    e = this.apotekService.getStockInapkByKategori(l);
                    break;
                case "igd":
                    e = this.apotekService.getStockIgdkByKategori(l);
                    break;
                case "gudang":
                    e = this.apotekService.getStockGudangkByKategori(l);
                    break;
                case "luar":
                    e = this.gudangService.listObatLuarByKategori(l);
                    break;
                default:
                    break
            }
            e && e.subscribe({
                next: m => {
                    this.dataStock = m
                },
                error: m => {
                    this.toastr.error(m)
                },
                complete: () => {
                    this.initValue(), this.isLoading = !1
                }
            })
        }
        getLogsObat() {
            this.isLoading = !0, this.apotekService.getLogsObat((0, Le.default)().format("YYYY-MM-DD"), this.stock()).subscribe({
                next: t => {
                    this.apotekService.dataLogs.set(t.data)
                },
                error: t => {
                    this.toastr.error(t.message)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        onSubmit() {
            this.isLoading = !0;
            let t = this.stock();
            this.getServiceMethod(t).subscribe({
                next: e => {
                    this.toastr.success(e.message)
                },
                error: e => {},
                complete: () => {
                    this.getDataObat(this.stock(), this.kategori()), this.getLogsObat()
                }
            })
        }
        getServiceMethod(t) {
            return {
                igd: this.apotekService.pengambilanObatIgd,
                inap: this.apotekService.pengambilanObatInap,
                apotek: this.apotekService.pengambilanObatApotek,
                gudang: this.apotekService.pengambilanObatGudang,
                luar: this.apotekService.pengambilanObatLuar
            } [t].bind(this.apotekService)(t, this.model._id, this.jumlah, this.keterangan, this.currentUser.nama)
        }
        static {
            this.\u0275fac = function(l) {
                return new(l || o)
            }
        }
        static {
            this.\u0275cmp = M({
                type: o,
                selectors: [
                    ["app-pengambilan-obat-bebas"]
                ],
                inputs: {
                    depo: [1, "depo"]
                },
                outputs: {
                    depo: "depoChange"
                },
                decls: 40,
                vars: 8,
                consts: [
                    [1, "card"],
                    [1, "card-header", "text-bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "row"],
                    [1, "col"],
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    [1, "col-md-6"],
                    [1, "mb-3"],
                    ["for", "kategori", 1, "form-label"],
                    ["name", "kategori", "id", "kategori", 1, "form-select", 3, "ngModelChange", "change", "ngModel"],
                    ["value", ""],
                    ["value", "luar"],
                    [3, "value"],
                    ["value", "OBAT"],
                    ["value", "BHP"],
                    ["value", "ALKES"],
                    ["type", "button", "name", "submit", "id", "submit", 1, "btn", "btn-primary", "w-100", 3, "click", "disabled"],
                    [3, "depoChange", "depo"],
                    ["for", "typeahead-prevent-manual-entry", 1, "form-label"],
                    ["id", "typeahead-prevent-manual-entry", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel", "ngbTypeahead", "inputFormatter", "resultFormatter", "editable"],
                    ["role", "alert", 1, "alert", "alert-danger"],
                    [1, "cmb-3"],
                    ["for", "jumlah", 1, "form-label"],
                    ["id", "jumlah", "type", "number", "min", "1", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["for", "keterangan", 1, "form-label"],
                    ["id", "keterangan", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel"]
                ],
                template: function(l, e) {
                    l & 1 && (i(0, "div", 0)(1, "div", 1), n(2, "Pengambilan Obat Bebas"), a(), i(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5), n(7, " Stock "), a()(), i(8, "div", 3)(9, "div", 6)(10, "div", 3)(11, "div", 7)(12, "label", 8), n(13, "Stock"), a(), i(14, "select", 9), _("ngModelChange", function(d) {
                        return S(e.stock, d) || (e.stock = d), d
                    }), f("change", function() {
                        return e.getDataObat(e.stock(), e.kategori())
                    }), i(15, "option", 10), n(16, "-- Pilih --"), a(), i(17, "option", 11), n(18, "stock obat luar"), a(), i(19, "option", 12), n(20), a()()(), i(21, "div", 7)(22, "label", 8), n(23, "Kategori"), a(), i(24, "select", 9), _("ngModelChange", function(d) {
                        return S(e.kategori, d) || (e.kategori = d), d
                    }), f("change", function() {
                        return e.getDataObat(e.stock(), e.kategori())
                    }), i(25, "option", 13), n(26, "OBAT"), a(), i(27, "option", 14), n(28, "BHP"), a(), i(29, "option", 15), n(30, "ALKES"), a()()(), O(31, Xe, 2, 1)(32, ze, 2, 0, "div", 7)(33, Qe, 8, 2), i(34, "div", 7)(35, "button", 16), f("click", function() {
                        return e.onSubmit()
                    }), n(36, " Submit "), a()()()()()(), i(37, "div", 3)(38, "div", 4)(39, "app-logs", 17), _("depoChange", function(d) {
                        return S(e.depo, d) || (e.depo = d), d
                    }), a()()()()()), l & 2 && (r(14), v("ngModel", e.stock), r(5), N("value", e.depo()), r(), C("stock ", e.depo(), ""), r(4), v("ngModel", e.kategori), r(7), F(e.isLoading ? 32 : 31), r(2), F(e.model ? 33 : -1), r(2), u("disabled", !e.model || e.isLoading || !e.keterangan), r(4), v("depo", e.depo))
                },
                dependencies: [K, J, j, P, q, X, D, le, R, A, V, Q, z, pe],
                encapsulation: 2
            })
        }
    }
    return o
})();
var Me = ue(ce());

function Ze(o, s) {
    if (o & 1) {
        let t = I();
        i(0, "div", 7)(1, "label", 18), n(2), a(), i(3, "input", 19), _("ngModelChange", function(e) {
            x(t);
            let m = g(2);
            return S(m.model, e) || (m.model = e), L(e)
        }), a()()
    }
    if (o & 2) {
        let t = g(2);
        r(2), C("Search ", t.kategori(), ""), r(), v("ngModel", t.model), u("ngbTypeahead", t.search)("inputFormatter", t.formatter1)("resultFormatter", t.formatter)("editable", !1)
    }
}

function $e(o, s) {
    if (o & 1 && (i(0, "div", 7)(1, "div", 20)(2, "strong"), n(3, "Perhatian!!"), a(), n(4), a()()), o & 2) {
        let t = g(2);
        r(4), C(" Tidak ada stock ", t.kategori(), ". ")
    }
}

function et(o, s) {
    if (o & 1 && O(0, Ze, 4, 6, "div", 7)(1, $e, 5, 1, "div", 7), o & 2) {
        let t = g();
        F(t.dataStock ? 0 : 1)
    }
}

function tt(o, s) {
    o & 1 && (i(0, "div", 7), b(1, "app-loading"), a())
}

function it(o, s) {
    if (o & 1) {
        let t = I();
        i(0, "div", 21)(1, "label", 22), n(2, "Jumlah"), a(), i(3, "input", 23), _("ngModelChange", function(e) {
            x(t);
            let m = g();
            return S(m.jumlah, e) || (m.jumlah = e), L(e)
        }), a()(), i(4, "div", 7)(5, "label", 24), n(6, "Keterangan"), a(), i(7, "input", 25), _("ngModelChange", function(e) {
            x(t);
            let m = g();
            return S(m.keterangan, e) || (m.keterangan = e), L(e)
        }), a()()
    }
    if (o & 2) {
        let t = g();
        r(3), v("ngModel", t.jumlah), r(4), v("ngModel", t.keterangan)
    }
}
var ri = (() => {
    class o {
        constructor() {
            this.apotekService = c(Z), this.gudangService = c(W), this.toastr = c(T), this.isLoading = !1, this.depo = H(""), this.kategori = G("OBAT"), this.stock = G(""), this.dataStock = [], this.jumlah = 1, this.keterangan = "", this.store = c(oe), this.userSelector = this.store.select(re).pipe(ne()).subscribe(t => {
                this.currentUser = t
            }), this.formatter = t => t.nama + " | Stock: " + t.jumlah.toLocaleString() + " | Harga: " + t.hargaJualYANKES.toLocaleString() + " | Faktur: " + t.noFaktur + " | Distributor: " + t.dataDistributor[0]?.nama, this.formatter1 = t => t.nama, this.search = t => t.pipe(Y(200), ee(), $(l => l.length >= 2), U(l => this.dataStock.filter(e => new RegExp(l, "mi").test(e.nama)).slice(0, 10)))
        }
        initValue() {
            this.jumlah = 1, this.keterangan = ""
        }
        getDataObat(t, l) {
            if (this.model = null, this.isLoading = !0, this.getLogsObat(), t === "") {
                this.isLoading = !1;
                return
            }
            let e;
            switch (t) {
                case "apotek":
                    e = this.apotekService.getStockApotekByKategori(l);
                    break;
                case "inap":
                    e = this.apotekService.getStockInapkByKategori(l);
                    break;
                case "igd":
                    e = this.apotekService.getStockIgdkByKategori(l);
                    break;
                case "gudang":
                    e = this.apotekService.getStockGudangkByKategori(l);
                    break;
                case "luar":
                    e = this.gudangService.listObatLuarByKategori(l);
                    break;
                default:
                    break
            }
            e && e.subscribe({
                next: m => {
                    this.dataStock = m
                },
                error: m => {
                    this.toastr.error(m)
                },
                complete: () => {
                    this.initValue(), this.isLoading = !1
                }
            })
        }
        getLogsObat() {
            this.isLoading = !0, this.apotekService.getLogsObat((0, Me.default)().format("YYYY-MM-DD"), this.stock()).subscribe({
                next: t => {
                    this.apotekService.dataLogs.set(t.data)
                },
                error: t => {
                    this.toastr.error(t.message)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        onSubmit() {
            this.isLoading = !0;
            let t = this.stock();
            this.getServiceMethod(t).subscribe({
                next: e => {
                    this.toastr.success(e.message)
                },
                error: e => {},
                complete: () => {
                    this.getDataObat(this.stock(), this.kategori()), this.getLogsObat()
                }
            })
        }
        getServiceMethod(t) {
            return {
                igd: this.apotekService.penambahanObatIgd,
                inap: this.apotekService.penambahanObatInap,
                apotek: this.apotekService.penambahanObatApotek,
                gudang: this.apotekService.penambahanObatGudang,
                luar: this.apotekService.penambahanObatLuar
            } [t].bind(this.apotekService)(t, this.model._id, this.jumlah, this.keterangan, this.currentUser.nama)
        }
        static {
            this.\u0275fac = function(l) {
                return new(l || o)
            }
        }
        static {
            this.\u0275cmp = M({
                type: o,
                selectors: [
                    ["app-penambahan-obat-bebas"]
                ],
                inputs: {
                    depo: [1, "depo"]
                },
                outputs: {
                    depo: "depoChange"
                },
                decls: 40,
                vars: 8,
                consts: [
                    [1, "card"],
                    [1, "card-header", "text-bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "row"],
                    [1, "col"],
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    [1, "col-md-6"],
                    [1, "mb-3"],
                    ["for", "kategori", 1, "form-label"],
                    ["name", "kategori", "id", "kategori", 1, "form-select", 3, "ngModelChange", "change", "ngModel"],
                    ["value", ""],
                    ["value", "luar"],
                    [3, "value"],
                    ["value", "OBAT"],
                    ["value", "BHP"],
                    ["value", "ALKES"],
                    ["type", "button", "name", "submit", "id", "submit", 1, "btn", "btn-primary", "w-100", 3, "click", "disabled"],
                    [3, "depoChange", "depo"],
                    ["for", "typeahead-prevent-manual-entry", 1, "form-label"],
                    ["id", "typeahead-prevent-manual-entry", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel", "ngbTypeahead", "inputFormatter", "resultFormatter", "editable"],
                    ["role", "alert", 1, "alert", "alert-danger"],
                    [1, "cmb-3"],
                    ["for", "jumlah", 1, "form-label"],
                    ["id", "jumlah", "type", "number", "min", "1", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["for", "keterangan", 1, "form-label"],
                    ["id", "keterangan", "type", "text", 1, "form-control", 3, "ngModelChange", "ngModel"]
                ],
                template: function(l, e) {
                    l & 1 && (i(0, "div", 0)(1, "div", 1), n(2, "Penambahan Obat Bebas"), a(), i(3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "div", 5), n(7, " Stock "), a()(), i(8, "div", 3)(9, "div", 6)(10, "div", 3)(11, "div", 7)(12, "label", 8), n(13, "Stock"), a(), i(14, "select", 9), _("ngModelChange", function(d) {
                        return S(e.stock, d) || (e.stock = d), d
                    }), f("change", function() {
                        return e.getDataObat(e.stock(), e.kategori())
                    }), i(15, "option", 10), n(16, "-- Pilih --"), a(), i(17, "option", 11), n(18, "stock obat luar"), a(), i(19, "option", 12), n(20), a()()(), i(21, "div", 7)(22, "label", 8), n(23, "Kategori"), a(), i(24, "select", 9), _("ngModelChange", function(d) {
                        return S(e.kategori, d) || (e.kategori = d), d
                    }), f("change", function() {
                        return e.getDataObat(e.stock(), e.kategori())
                    }), i(25, "option", 13), n(26, "OBAT"), a(), i(27, "option", 14), n(28, "BHP"), a(), i(29, "option", 15), n(30, "ALKES"), a()()(), O(31, et, 2, 1)(32, tt, 2, 0, "div", 7)(33, it, 8, 2), i(34, "div", 7)(35, "button", 16), f("click", function() {
                        return e.onSubmit()
                    }), n(36, " Submit "), a()()()()()(), i(37, "div", 3)(38, "div", 4)(39, "app-logs", 17), _("depoChange", function(d) {
                        return S(e.depo, d) || (e.depo = d), d
                    }), a()()()()()), l & 2 && (r(14), v("ngModel", e.stock), r(5), N("value", e.depo()), r(), C("stock ", e.depo(), ""), r(4), v("ngModel", e.kategori), r(7), F(e.isLoading ? 32 : 31), r(2), F(e.model ? 33 : -1), r(2), u("disabled", !e.model || e.isLoading || !e.keterangan), r(4), v("depo", e.depo))
                },
                dependencies: [K, J, j, P, q, X, D, le, R, A, V, Q, z, pe],
                encapsulation: 2
            })
        }
    }
    return o
})();
export {
    Yt as a, ri as b, st as c, _t as d
};