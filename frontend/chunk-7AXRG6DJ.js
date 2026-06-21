import {
    a as It,
    b as Dt,
    c as Nt,
    d as wt
} from "./chunk-TQRSAJWM.js";
import {
    a as Gt
} from "./chunk-3U4BDL6E.js";
import {
    a as y
} from "./chunk-LP3CUFG4.js";
import "./chunk-G2DQ3SJM.js";
import {
    a as Et
} from "./chunk-3PS2FIME.js";
import "./chunk-JD6JIJOO.js";
import {
    a as Ct,
    b as Ft
} from "./chunk-IDDMCM5J.js";
import {
    d as ht,
    h as X
} from "./chunk-YIQM4CGR.js";
import {
    a as xt
} from "./chunk-XOBW5QCM.js";
import {
    a as yt
} from "./chunk-FUXXJWDL.js";
import {
    r as St,
    s as _t
} from "./chunk-QGNVLNC6.js";
import "./chunk-IVTVBFQS.js";
import "./chunk-UI7HE65P.js";
import {
    b as N,
    c as p,
    e as w,
    f as G,
    g as k,
    i as u,
    k as vt,
    l as M,
    m as at,
    o as L,
    p as T,
    r as R,
    s as P,
    x as bt,
    y as A
} from "./chunk-NKLTBXW5.js";
import {
    k as E
} from "./chunk-QJBCP6KK.js";
import "./chunk-W7XVFZVJ.js";
import {
    h as gt,
    i as F,
    j as q,
    m as D,
    r as ft,
    s as h
} from "./chunk-CFNDTNZN.js";
import {
    Ac as dt,
    Bc as pt,
    Cc as ut,
    Da as Z,
    Db as c,
    Ea as tt,
    Eb as it,
    Ec as r,
    Fc as S,
    Gc as x,
    Kb as f,
    Kc as H,
    La as et,
    Lc as W,
    Mc as Q,
    Qc as ot,
    Sc as _,
    Tc as C,
    Uc as ct,
    Zb as s,
    fa as rt,
    g as st,
    gc as e,
    hc as i,
    ic as d,
    jc as U,
    kc as Y,
    ma as z,
    mc as nt,
    qb as m,
    rb as v,
    sc as g,
    tc as B,
    wc as O,
    x as lt
} from "./chunk-UYVTZL26.js";

function ie(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td"), r(8), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama), m(2), S(t.satuan), m(2), S(t.jenis)
    }
}
var kt = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-daftar-alkes"]
                ],
                inputs: {
                    dataList$: [0, "data", "dataList$"]
                },
                decls: 19,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Alkes"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i(), e(12, "th", 5), r(13, "Satuan"), i(), e(14, "th", 5), r(15, "Jenis"), i()()(), e(16, "tbody", 6), f(17, ie, 9, 4, "tr", 7), _(18, "async"), i()()()()()), a & 2 && (m(17), s("ngForOf", C(18, 1, o.dataList$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();

function ne(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function ae(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}
var Mt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.itemsForm = new k({
                nama: new u("", [p.required]),
                satuan: new u("", [p.required]),
                jenis: new u("", [p.required])
            }), this.dataListJenisSediaan$ = [], this.dataListSatuan$ = []
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataItems$ = this.gudangService.getDaftarItems("ALKES"), this.gudangService.getJenisSediaan().subscribe(t => {
                this.dataListJenisSediaan$ = t
            }), this.gudangService.getSatuan().subscribe(t => {
                this.dataListSatuan$ = t
            })
        }
        validateSatuan() {
            let t = this.dataListSatuan$.filter(a => a.nama == this.itemsForm.value.satuan);
            if (t) {
                this.itemsForm.patchValue({
                    satuan: t[0]?.nama
                });
                return
            }
        }
        validateJenisSediaan() {
            let t = this.dataListJenisSediaan$.filter(a => a.nama == this.itemsForm.value.jenis);
            if (t) {
                this.itemsForm.patchValue({
                    jenis: t[0]?.nama
                });
                return
            }
        }
        onSubmit() {
            this.gudangService.addDaftarItems({
                nama: this.itemsForm.value.nama,
                satuan: this.itemsForm.value.satuan,
                jenis: this.itemsForm.value.jenis
            }, "ALKES").subscribe({
                next: t => {
                    this.itemsForm.reset(), this.initialValues(), this.toastr.success("Alkes berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-daftar-alkes"]
                ],
                decls: 27,
                vars: 5,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "text", "list", "listSatuan", "formControlName", "satuan", 1, "form-control", 3, "change"],
                    ["id", "listSatuan"],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    ["type", "text", "list", "listJenisSediaan", "formControlName", "jenis", 1, "form-control", 3, "change"],
                    ["id", "listJenisSediaan"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"],
                    [3, "value"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Daftar Alkes"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "div", 4)(11, "label", 5), r(12, "Satuan"), i(), e(13, "div", 6)(14, "input", 8), g("change", function() {
                        return o.validateSatuan()
                    }), i(), e(15, "datalist", 9), f(16, ne, 1, 1, "option", 10), i()()(), e(17, "div", 4)(18, "label", 5), r(19, "Jenis Sediaan"), i(), e(20, "div", 6)(21, "input", 11), g("change", function() {
                        return o.validateJenisSediaan()
                    }), i(), e(22, "datalist", 12), f(23, ae, 1, 1, "option", 10), i()()(), e(24, "button", 13), r(25, " Submit "), i()()()(), d(26, "app-list-daftar-alkes", 14)), a & 2 && (m(4), s("formGroup", o.itemsForm), m(12), s("ngForOf", o.dataListSatuan$), m(7), s("ngForOf", o.dataListJenisSediaan$), m(), s("disabled", !o.itemsForm.valid), m(2), s("data", o.dataItems$))
                },
                dependencies: [h, F, A, M, R, P, N, w, G, L, T, kt],
                encapsulation: 2
            })
        }
    }
    return n
})();

function re(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td"), r(8), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama), m(2), S(t.satuan), m(2), S(t.jenis)
    }
}
var Lt = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-daftar-bhp"]
                ],
                inputs: {
                    dataList$: [0, "data", "dataList$"]
                },
                decls: 19,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List BHP"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i(), e(12, "th", 5), r(13, "Satuan"), i(), e(14, "th", 5), r(15, "Jenis"), i()()(), e(16, "tbody", 6), f(17, re, 9, 4, "tr", 7), _(18, "async"), i()()()()()), a & 2 && (m(17), s("ngForOf", C(18, 1, o.dataList$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();

function oe(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function me(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}
var Tt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.itemsForm = new k({
                nama: new u("", [p.required]),
                satuan: new u("", [p.required]),
                jenis: new u("", [p.required])
            }), this.dataListJenisSediaan$ = [], this.dataListSatuan$ = []
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataItems$ = this.gudangService.getDaftarItems("BHP"), this.gudangService.getJenisSediaan().subscribe(t => {
                this.dataListJenisSediaan$ = t
            }), this.gudangService.getSatuan().subscribe(t => {
                this.dataListSatuan$ = t
            })
        }
        validateSatuan() {
            let t = this.dataListSatuan$.filter(a => a.nama == this.itemsForm.value.satuan);
            if (t) {
                this.itemsForm.patchValue({
                    satuan: t[0]?.nama
                });
                return
            }
        }
        validateJenisSediaan() {
            let t = this.dataListJenisSediaan$.filter(a => a.nama == this.itemsForm.value.jenis);
            if (t) {
                this.itemsForm.patchValue({
                    jenis: t[0]?.nama
                });
                return
            }
        }
        onSubmit() {
            this.gudangService.addDaftarItems({
                nama: this.itemsForm.value.nama,
                satuan: this.itemsForm.value.satuan,
                jenis: this.itemsForm.value.jenis
            }, "BHP").subscribe({
                next: t => {
                    this.itemsForm.reset(), this.initialValues(), this.toastr.success("BHP berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-daftar-bhp"]
                ],
                decls: 27,
                vars: 5,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "text", "list", "listSatuan", "formControlName", "satuan", 1, "form-control", 3, "change"],
                    ["id", "listSatuan"],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    ["type", "text", "list", "listJenisSediaan", "formControlName", "jenis", 1, "form-control", 3, "change"],
                    ["id", "listJenisSediaan"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"],
                    [3, "value"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Daftar BHP"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "div", 4)(11, "label", 5), r(12, "Satuan"), i(), e(13, "div", 6)(14, "input", 8), g("change", function() {
                        return o.validateSatuan()
                    }), i(), e(15, "datalist", 9), f(16, oe, 1, 1, "option", 10), i()()(), e(17, "div", 4)(18, "label", 5), r(19, "Jenis Sediaan"), i(), e(20, "div", 6)(21, "input", 11), g("change", function() {
                        return o.validateJenisSediaan()
                    }), i(), e(22, "datalist", 12), f(23, me, 1, 1, "option", 10), i()()(), e(24, "button", 13), r(25, " Submit "), i()()()(), d(26, "app-list-daftar-bhp", 14)), a & 2 && (m(4), s("formGroup", o.itemsForm), m(12), s("ngForOf", o.dataListSatuan$), m(7), s("ngForOf", o.dataListJenisSediaan$), m(), s("disabled", !o.itemsForm.valid), m(2), s("data", o.dataItems$))
                },
                dependencies: [h, F, A, M, R, P, N, w, G, L, T, Lt],
                encapsulation: 2
            })
        }
    }
    return n
})();

function se(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 14), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td"), r(8), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama), m(2), S(t.satuan), m(2), S(t.jenis)
    }
}

function le(n, l) {
    if (n & 1 && (U(0), f(1, se, 9, 4, "tr", 13), _(2, "filter"), Y()), n & 2) {
        let t = l.ngIf,
            a = B();
        m(), s("ngForOf", ct(2, 1, t, a.searchText))
    }
}
var At = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-daftar-obat"]
                ],
                inputs: {
                    dataList$: [0, "data", "dataList$"]
                },
                decls: 23,
                vars: 4,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "input-group", "mb-3"],
                    ["type", "text", "placeholder", "Search", "aria-label", "Username", "aria-describedby", "basic-addon1", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["id", "basic-addon1", 1, "input-group-text"],
                    [1, "bi", "bi-search"],
                    [1, "table-responsive"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngIf"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Obat"), i(), e(3, "div", 2)(4, "div", 3)(5, "input", 4), Q("ngModelChange", function(J) {
                        return W(o.searchText, J) || (o.searchText = J), J
                    }), i(), e(6, "span", 5), d(7, "i", 6), i()(), e(8, "div", 7)(9, "table", 8)(10, "thead", 9)(11, "tr")(12, "th", 10), r(13, "#"), i(), e(14, "th", 10), r(15, "Nama"), i(), e(16, "th", 10), r(17, "Satuan"), i(), e(18, "th", 10), r(19, "Jenis"), i()()(), e(20, "tbody", 11), f(21, le, 3, 4, "ng-container", 12), _(22, "async"), i()()()()()), a & 2 && (m(5), H("ngModel", o.searchText), m(16), s("ngIf", C(22, 2, o.dataList$)))
                },
                dependencies: [h, F, q, D, bt, N, w, vt, xt],
                encapsulation: 2
            })
        }
    }
    return n
})();

function de(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function pe(n, l) {
    if (n & 1 && d(0, "option", 15), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}
var Ot = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.itemsForm = new k({
                nama: new u("", [p.required]),
                satuan: new u("", [p.required]),
                jenis: new u("", [p.required])
            }), this.dataListJenisSediaan$ = [], this.dataListSatuan$ = []
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataItems$ = this.gudangService.getDaftarItems("OBAT"), this.gudangService.getJenisSediaan().subscribe(t => {
                this.dataListJenisSediaan$ = t
            }), this.gudangService.getSatuan().subscribe(t => {
                this.dataListSatuan$ = t
            })
        }
        validateSatuan() {
            let t = this.dataListSatuan$.filter(a => a.nama == this.itemsForm.value.satuan);
            if (t) {
                this.itemsForm.patchValue({
                    satuan: t[0]?.nama
                });
                return
            }
        }
        validateJenisSediaan() {
            let t = this.dataListJenisSediaan$.filter(a => a.nama == this.itemsForm.value.jenis);
            if (t) {
                this.itemsForm.patchValue({
                    jenis: t[0]?.nama
                });
                return
            }
        }
        onSubmit() {
            this.gudangService.addDaftarItems({
                nama: this.itemsForm.value.nama,
                satuan: this.itemsForm.value.satuan,
                jenis: this.itemsForm.value.jenis
            }, "OBAT").subscribe({
                next: t => {
                    this.itemsForm.reset(), this.initialValues(), this.toastr.success("Obat berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-daftar-obat"]
                ],
                decls: 27,
                vars: 5,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "text", "list", "listSatuan", "formControlName", "satuan", 1, "form-control", 3, "change"],
                    ["id", "listSatuan"],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    ["type", "text", "list", "listJenisSediaan", "formControlName", "jenis", 1, "form-control", 3, "change"],
                    ["id", "listJenisSediaan"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"],
                    [3, "value"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Daftar Obat"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "div", 4)(11, "label", 5), r(12, "Satuan"), i(), e(13, "div", 6)(14, "input", 8), g("change", function() {
                        return o.validateSatuan()
                    }), i(), e(15, "datalist", 9), f(16, de, 1, 1, "option", 10), i()()(), e(17, "div", 4)(18, "label", 5), r(19, "Jenis Sediaan"), i(), e(20, "div", 6)(21, "input", 11), g("change", function() {
                        return o.validateJenisSediaan()
                    }), i(), e(22, "datalist", 12), f(23, pe, 1, 1, "option", 10), i()()(), e(24, "button", 13), r(25, " Submit "), i()()()(), d(26, "app-list-daftar-obat", 14)), a & 2 && (m(4), s("formGroup", o.itemsForm), m(12), s("ngForOf", o.dataListSatuan$), m(7), s("ngForOf", o.dataListJenisSediaan$), m(), s("disabled", !o.itemsForm.valid), m(2), s("data", o.dataItems$))
                },
                dependencies: [h, F, A, M, R, P, N, w, G, L, T, At],
                encapsulation: 2
            })
        }
    }
    return n
})();

function ue(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td"), r(8), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama), m(2), S(t.alamat), m(2), S(t.telp)
    }
}
var $t = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-distributor"]
                ],
                inputs: {
                    dataDistributor$: [0, "data", "dataDistributor$"]
                },
                decls: 19,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Distributor"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i(), e(12, "th", 5), r(13, "Alamat"), i(), e(14, "th", 5), r(15, "Telp"), i()()(), e(16, "tbody", 6), f(17, ue, 9, 4, "tr", 7), _(18, "async"), i()()()()()), a & 2 && (m(17), s("ngForOf", C(18, 1, o.dataDistributor$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Jt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.distributorForm = new k({
                nama: new u("", [p.required]),
                alamat: new u("", [p.required]),
                telp: new u("", [p.required])
            })
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataDistributor$ = this.gudangService.getDistributor()
        }
        onSubmit() {
            this.gudangService.addDistributor({
                nama: this.distributorForm.value.nama,
                alamat: this.distributorForm.value.alamat,
                telp: this.distributorForm.value.telp
            }).subscribe({
                next: t => {
                    this.distributorForm.reset(), this.initialValues(), this.toastr.success("Distributor berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-distributor"]
                ],
                decls: 23,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["for", "inputPassword", 1, "col-sm-2", "col-form-label"],
                    ["type", "text", "formControlName", "alamat", 1, "form-control"],
                    ["type", "text", "formControlName", "telp", 1, "form-control"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Input Distributor"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "div", 4)(11, "label", 8), r(12, "Alamat"), i(), e(13, "div", 6), d(14, "input", 9), i()(), e(15, "div", 4)(16, "label", 8), r(17, "Telp"), i(), e(18, "div", 6), d(19, "input", 10), i()(), e(20, "button", 11), r(21, " Submit "), i()()()(), d(22, "app-list-distributor", 12)), a & 2 && (m(4), s("formGroup", o.distributorForm), m(16), s("disabled", !o.distributorForm.valid), m(2), s("data", o.dataDistributor$))
                },
                dependencies: [h, A, M, N, w, G, L, T, $t],
                encapsulation: 2
            })
        }
    }
    return n
})();
var jt = st(yt());
var Bt = st(yt());

function ce(n, l) {
    if (n & 1) {
        let t = nt();
        e(0, "tr")(1, "td", 7)(2, "button", 10), g("click", function() {
            let o = Z(t).$implicit,
                b = B(2);
            return tt(b.onDel(o, o.distributor))
        }), i()(), e(3, "td")(4, "div", 11), r(5), i()(), e(6, "td", 12), r(7), i(), e(8, "td", 12), r(9), i(), e(10, "td"), r(11), i(), e(12, "td", 13), r(13), _(14, "number"), i(), e(15, "td", 13), r(16), _(17, "number"), i(), e(18, "td", 13), r(19), _(20, "number"), i(), e(21, "td", 13), r(22), _(23, "number"), i(), e(24, "td", 13), r(25), _(26, "number"), i()()
    }
    if (n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(5), x("", a + 1, "."), m(2), S(t.noFaktur), m(2), S(t.tglFaktur), m(2), S(t._id.nama), m(2), S(C(14, 9, t.jumlah)), m(3), S(C(17, 11, t.hargaBeli)), m(3), S(C(20, 13, t.hargaSatuan)), m(3), S(C(23, 15, t.hargaJualBPJS)), m(3), S(C(26, 17, t.hargaJualYANKES))
    }
}

function ge(n, l) {
    if (n & 1 && (e(0, "div", 1)(1, "div", 2)(2, "button", 3), d(3, "i", 4), r(4, " Print "), i(), U(5), e(6, "div", 5)(7, "table", 6)(8, "thead")(9, "tr"), d(10, "th", 7), e(11, "th", 8), r(12, "NO."), i(), e(13, "th", 8), r(14, "NO. FAKTUR"), i(), e(15, "th", 8), r(16, "TGL. FAKTUR"), i(), e(17, "th", 8), r(18, "NAMA OBAT"), i(), e(19, "th", 8), r(20, "JUMLAH / BOX"), i(), e(21, "th", 8), r(22, "HARGA / BOX + PPN"), i(), e(23, "th", 8), r(24, "HARGA / TAB"), i(), e(25, "th", 8), r(26, "HARGA JUAL BPJS / YANKES"), i(), e(27, "th", 8), r(28, "HARGA JUAL UMUM"), i()()(), e(29, "tbody"), f(30, ce, 27, 19, "tr", 9), i()()(), Y(), i()()), n & 2) {
        let t = l.ngIf;
        m(2), s("useExistingCss", !0), m(28), s("ngForOf", t)
    }
}
var mt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.today = (0, Bt.default)().format("YYYY-MM-DD"), this.onDelete = new et
        }
        ngOnInit() {
            this.getItems(this.tglFaktur)
        }
        getItems(t) {
            this.dataItems$ = this.gudangService.getItemsByTanggalFaktur({
                tglFaktur: t
            })
        }
        onDel(t, a) {
            this.onDelete.emit({
                data: t,
                distributor: a
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-faktur"]
                ],
                inputs: {
                    noFaktur: "noFaktur",
                    tglFaktur: "tglFaktur",
                    dataDistributor$: "dataDistributor$"
                },
                outputs: {
                    onDelete: "onDelete"
                },
                decls: 2,
                vars: 3,
                consts: [
                    ["class", "card mb-2", 4, "ngIf"],
                    [1, "card", "mb-2"],
                    [1, "card-body"],
                    ["type", "button", "printSectionId", "print-section", "ngxPrint", "", 1, "btn", "btn-outline-primary", "mb-2", 3, "useExistingCss"],
                    [1, "bi", "bi-printer"],
                    ["id", "print-section", 1, "table-responsive"],
                    [1, "table", "table-bordered", "table-sm", "align-middle", "d-print-table"],
                    [1, "d-print-none"],
                    ["scope", "col"],
                    [4, "ngFor", "ngForOf"],
                    ["type", "button", "aria-label", "Close", 1, "btn-close", "d-print-none", 3, "click"],
                    [1, "d-flex", "align-items-around"],
                    [1, "text-nowrap"],
                    [1, "text-end"]
                ],
                template: function(a, o) {
                    a & 1 && (f(0, ge, 31, 2, "div", 0), _(1, "async")), a & 2 && s("ngIf", C(1, 1, o.dataItems$))
                },
                dependencies: [h, F, q, D, ft, Ft, Ct],
                encapsulation: 2
            })
        }
    }
    return n
})();

function fe(n, l) {
    if (n & 1 && d(0, "option", 28), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function he(n, l) {
    if (n & 1 && d(0, "option", 28), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function ve(n, l) {
    if (n & 1 && d(0, "option", 28), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function be(n, l) {
    if (n & 1 && d(0, "option", 28), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function Se(n, l) {
    if (n & 1 && (e(0, "div", 6)(1, "label", 10), r(2, "SATUAN"), i(), e(3, "div", 8), d(4, "input", 29), e(5, "datalist", 30), f(6, be, 1, 1, "option", 14), i()()()), n & 2) {
        let t = B();
        m(6), s("ngForOf", t.dataListSatuan$)
    }
}

function _e(n, l) {
    if (n & 1 && d(0, "option", 28), n & 2) {
        let t = l.$implicit;
        O("value", t.nama)
    }
}

function Ce(n, l) {
    if (n & 1 && (e(0, "div", 6)(1, "label", 10), r(2, "JENIS SEDIAAN"), i(), e(3, "div", 8), d(4, "input", 31), e(5, "datalist", 32), f(6, _e, 1, 1, "option", 14), i()()()), n & 2) {
        let t = B();
        m(6), s("ngForOf", t.dataListJenisSediaan$)
    }
}

function Fe(n, l) {
    n & 1 && (e(0, "div", 6)(1, "label", 10), r(2, "HARGA / TAB"), i(), e(3, "div", 8), d(4, "input", 33), i()())
}

function ye(n, l) {
    if (n & 1 && (e(0, "div", 6)(1, "label", 10), r(2, "HARGA JUAL BPJS/YANKES"), i(), e(3, "div", 8)(4, "div", 34), d(5, "input", 35), e(6, "span", 36), r(7), i()()()()), n & 2) {
        let t = B();
        m(7), x("(Margin: ", t.dataMargin.marginBpjsYankes, "%)")
    }
}

function Ee(n, l) {
    if (n & 1 && (e(0, "div", 6)(1, "label", 10), r(2, "HARGA JUAL UMUM"), i(), e(3, "div", 37)(4, "div", 34), d(5, "input", 38), e(6, "span", 36), r(7), i()()()()), n & 2) {
        let t = B();
        m(7), x("(Margin: ", t.dataMargin.marginUmum, "%)")
    }
}
var Vt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.today = (0, jt.default)().format("YYYY-MM-DD"), this.inputForm = new k({
                noFaktur: new u("", [p.required]),
                tglFaktur: new u(this.today, [p.required]),
                distributor: new u("", [p.required, p.minLength(3)]),
                idDistributor: new u("", [p.required, p.minLength(3)]),
                batch: new u(""),
                nama: new u("", [p.required, p.minLength(3)]),
                expired: new u("", [p.required]),
                satuan: new u("", [p.required, p.minLength(3)]),
                kategori: new u("", [p.required, p.minLength(3)]),
                jenis: new u("", [p.required, p.minLength(3)]),
                jumlah: new u(0, [p.required, p.min(1)]),
                hargaBeli: new u(0, [p.required, p.min(1)]),
                hargaSatuan: new u(0, [p.required, p.min(1)]),
                hargaJualBPJS: new u(0, [p.required, p.min(1)]),
                hargaJualYANKES: new u(0, [p.required, p.min(1)])
            }), this.dataListDistributor$ = [], this.dataListJenisSediaan$ = [], this.dataListSatuan$ = [], this.dataListKategori$ = [], this.dataDistributor = [], this.dataListItems$ = [], this.isLoading = !1
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.gudangService.getDistributor().subscribe(t => {
                this.dataListDistributor$ = t
            }), this.gudangService.getJenisSediaan().subscribe(t => {
                this.dataListJenisSediaan$ = t
            }), this.gudangService.getSatuan().subscribe(t => {
                this.dataListSatuan$ = t
            }), this.gudangService.getKategori().subscribe(t => {
                this.dataListKategori$ = t
            }), this.getDataMargin(), this.tglFaktur = this.inputForm.value.tglFaktur, this.child.getItems(this.inputForm.value.tglFaktur)
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
        validateDistributor() {
            let t = this.dataListDistributor$.filter(a => a.nama == this.inputForm.value.distributor);
            if (t) {
                if (this.inputForm.patchValue({
                        distributor: t[0]?.nama,
                        idDistributor: t[0]?._id
                    }), !this.inputForm.value.idDistributor) return;
                this.gudangService.getDistributorById(this.inputForm.value.idDistributor).subscribe(a => {
                    this.dataDistributor = a
                }), this.noFaktur = this.inputForm.value.noFaktur, this.tglFaktur = this.inputForm.value.tglFaktur, this.child.getItems(this.inputForm.value.tglFaktur);
                return
            }
        }
        validateSatuan() {
            let t = this.dataListSatuan$.filter(a => a.nama == this.inputForm.value.satuan);
            if (t) {
                this.inputForm.patchValue({
                    satuan: t[0]?.nama
                });
                return
            }
        }
        validateItems() {
            let t = this.dataListItems$.filter(a => a.nama == this.inputForm.value.nama);
            if (t) {
                this.inputForm.patchValue({
                    nama: t[0]?.nama,
                    satuan: t[0]?.satuan,
                    jenis: t[0]?.jenis
                });
                return
            }
        }
        validateKategori() {
            this.resetForm();
            let t = this.dataListKategori$.filter(a => a.nama == this.inputForm.value.kategori);
            if (t) {
                if (this.inputForm.patchValue({
                        kategori: t[0]?.nama
                    }), this.namaKategori = t[0]?.nama, this.namaKategori == "OBAT") {
                    this.gudangService.getDaftarItems("OBAT").subscribe(a => {
                        this.dataListItems$ = a
                    });
                    return
                }
                if (this.namaKategori == "BHP") {
                    this.gudangService.getDaftarItems("BHP").subscribe(a => {
                        this.dataListItems$ = a
                    });
                    return
                }
                if (this.namaKategori == "ALKES") {
                    this.gudangService.getDaftarItems("ALKES").subscribe(a => {
                        this.dataListItems$ = a
                    });
                    return
                }
                return
            }
        }
        validateJenisSediaan() {
            let t = this.dataListJenisSediaan$.filter(a => a.nama == this.inputForm.value.jenis);
            if (t) {
                this.inputForm.patchValue({
                    jenis: t[0]?.nama
                });
                return
            }
        }
        calculateHargaJual() {
            this.inputForm.patchValue({
                hargaSatuan: Math.ceil(this.inputForm.value.hargaBeli / this.inputForm.value.jumlah)
            }), this.inputForm.patchValue({
                hargaJualBPJS: Math.ceil(this.inputForm.value.hargaSatuan + this.inputForm.value.hargaSatuan * this.dataMargin.marginBpjsYankes / 100),
                hargaJualYANKES: Math.ceil(this.inputForm.value.hargaSatuan + this.inputForm.value.hargaSatuan * this.dataMargin.marginUmum / 100)
            })
        }
        resetForm() {
            this.inputForm.get("batch").reset(), this.inputForm.get("nama").reset(), this.inputForm.get("expired").reset(), this.inputForm.get("satuan").reset(), this.inputForm.get("jenis").reset(), this.inputForm.get("jumlah").reset(0), this.inputForm.get("hargaBeli").reset(0), this.inputForm.get("hargaSatuan").reset(0), this.inputForm.get("hargaJualBPJS").reset(0), this.inputForm.get("hargaJualYANKES").reset(0)
        }
        onSubmit() {
            this.isLoading = !0, this.gudangService.inputFaktur({
                noFaktur: this.inputForm.value.noFaktur,
                tglFaktur: this.inputForm.value.tglFaktur,
                distributor: this.inputForm.value.idDistributor,
                kategori: this.inputForm.value.kategori,
                batch: this.inputForm.value.batch,
                nama: this.inputForm.value.nama,
                expired: this.inputForm.value.expired,
                satuan: this.inputForm.value.satuan,
                jenis: this.inputForm.value.jenis,
                jumlah: this.inputForm.value.jumlah,
                hargaBeli: this.inputForm.value.hargaBeli,
                hargaSatuan: this.inputForm.value.hargaSatuan,
                hargaJualBPJS: this.inputForm.value.hargaJualBPJS,
                hargaJualYANKES: this.inputForm.value.hargaJualYANKES
            }).subscribe({
                next: t => {
                    this.resetForm(), this.initialValues(), this.child.getItems(this.inputForm.value.tglFaktur), this.toastr.success(this.inputForm.value.kategori + " berhasil di tambahkan", "Success"), this.isLoading = !1
                },
                error: t => {
                    this.toastr.error(t, "Error"), this.isLoading = !1
                }
            })
        }
        onDelete(t) {
            this.gudangService.deleteInputBarang(t).subscribe({
                next: a => {
                    this.toastr.success("Barang berhasil di hapus", "Success")
                },
                error: a => {
                    this.toastr.error(a.error.message, "Error")
                },
                complete: () => {
                    this.child.getItems(this.inputForm.value.tglFaktur)
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-input"]
                ],
                viewQuery: function(a, o) {
                    if (a & 1 && dt(mt, 7), a & 2) {
                        let b;
                        pt(b = ut()) && (o.child = b.first)
                    }
                },
                decls: 73,
                vars: 12,
                consts: [
                    [1, "row"],
                    [1, "col"],
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-3", "col-form-label"],
                    [1, "col-sm-9"],
                    ["type", "text", "formControlName", "noFaktur", 1, "form-control", 3, "change"],
                    ["for", "inputPassword", 1, "col-sm-3", "col-form-label"],
                    ["type", "date", "formControlName", "tglFaktur", 1, "form-control", 3, "change"],
                    ["type", "text", "list", "listDistributor", "formControlName", "distributor", 1, "form-control", 3, "change"],
                    ["id", "listDistributor"],
                    [3, "value", 4, "ngFor", "ngForOf"],
                    [1, "mb-2", "row", "d-none"],
                    ["type", "text", "formControlName", "idDistributor", 1, "form-control"],
                    ["type", "text", "list", "listKategori", "formControlName", "kategori", 1, "form-control", 3, "change"],
                    ["id", "listKategori"],
                    ["type", "text", "formControlName", "batch", 1, "form-control"],
                    ["type", "text", "list", "listItems", "formControlName", "nama", 1, "form-control", 3, "change"],
                    ["id", "listItems"],
                    ["type", "date", "formControlName", "expired", 1, "form-control"],
                    ["class", "mb-2 row", 4, "ngIf"],
                    ["type", "number", "formControlName", "jumlah", 1, "form-control", 3, "change"],
                    ["type", "number", "formControlName", "hargaBeli", 1, "form-control", 3, "change"],
                    ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"],
                    [3, "onDelete", "tglFaktur"],
                    [3, "value"],
                    ["type", "text", "list", "listSatuan", "formControlName", "satuan", "readonly", "", 1, "form-control-plaintext"],
                    ["id", "listSatuan"],
                    ["type", "text", "list", "listJenisSediaan", "formControlName", "jenis", "readonly", "", 1, "form-control-plaintext"],
                    ["id", "listJenisSediaan"],
                    ["type", "number", "formControlName", "hargaSatuan", "readonly", "", 1, "form-control-plaintext"],
                    [1, "input-group"],
                    ["type", "number", "formControlName", "hargaJualBPJS", "readonly", "", 1, "form-control"],
                    ["id", "basic-addon2", "routerLink", "/farmasi/gudang/margin", 1, "input-group-text", 2, "cursor", "pointer"],
                    [1, "col-md-9"],
                    ["type", "number", "formControlName", "hargaJualYANKES", "readonly", "", 1, "form-control"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3), r(4, "Input Barang"), i(), e(5, "div", 4)(6, "form", 5), g("submit", function() {
                        return o.onSubmit()
                    }), e(7, "div", 6)(8, "label", 7), r(9, "NO. FAKTUR"), i(), e(10, "div", 8)(11, "input", 9), g("change", function() {
                        return o.validateDistributor()
                    }), i()()(), e(12, "div", 6)(13, "label", 10), r(14, "TGL. FAKTUR"), i(), e(15, "div", 8)(16, "input", 11), g("change", function() {
                        return o.validateDistributor()
                    }), i()()(), e(17, "div", 6)(18, "label", 10), r(19, "DISTRIBUTOR"), i(), e(20, "div", 8)(21, "input", 12), g("change", function() {
                        return o.validateDistributor()
                    }), i(), e(22, "datalist", 13), f(23, fe, 1, 1, "option", 14), i()()(), e(24, "div", 15)(25, "label", 10), r(26, "ID Distributor"), i(), e(27, "div", 8), d(28, "input", 16), i()(), e(29, "div", 6)(30, "label", 10), r(31, "KATEGORI"), i(), e(32, "div", 8)(33, "input", 17), g("change", function() {
                        return o.validateKategori()
                    }), i(), e(34, "datalist", 18), f(35, he, 1, 1, "option", 14), i()()(), e(36, "div", 6)(37, "label", 10), r(38, "NO. BATCH"), i(), e(39, "div", 8), d(40, "input", 19), i()(), e(41, "div", 6)(42, "label", 10), r(43), i(), e(44, "div", 8)(45, "input", 20), g("change", function() {
                        return o.validateItems()
                    }), i(), e(46, "datalist", 21), f(47, ve, 1, 1, "option", 14), i()()(), e(48, "div", 6)(49, "label", 10), r(50, "EXPIRED DATE"), i(), e(51, "div", 8), d(52, "input", 22), i()(), f(53, Se, 7, 1, "div", 23)(54, Ce, 7, 1, "div", 23), e(55, "div", 6)(56, "label", 10), r(57, "SATUAN"), i(), e(58, "div", 8)(59, "input", 24), g("change", function() {
                        return o.calculateHargaJual()
                    }), i()()(), e(60, "div", 6)(61, "label", 10), r(62, "HARGA TOTAL + PPN "), i(), e(63, "div", 8)(64, "input", 25), g("change", function() {
                        return o.calculateHargaJual()
                    }), i()()(), f(65, Fe, 5, 0, "div", 23)(66, ye, 8, 1, "div", 23)(67, Ee, 8, 1, "div", 23), e(68, "button", 26), r(69, " Add "), i()()()()()(), e(70, "div", 0)(71, "div", 1)(72, "app-list-faktur", 27), g("onDelete", function(J) {
                        return o.onDelete(J)
                    }), i()()()), a & 2 && (m(6), s("formGroup", o.inputForm), m(17), s("ngForOf", o.dataListDistributor$), m(12), s("ngForOf", o.dataListKategori$), m(8), x("NAMA ", o.namaKategori, ""), m(4), s("ngForOf", o.dataListItems$), m(6), s("ngIf", o.inputForm.value.satuan), m(), s("ngIf", o.inputForm.value.jenis), m(11), s("ngIf", o.inputForm.value.hargaSatuan), m(), s("ngIf", o.inputForm.value.hargaJualBPJS), m(), s("ngIf", o.inputForm.value.hargaJualYANKES), m(), s("disabled", !o.inputForm.valid || o.isLoading), m(4), s("tglFaktur", o.tglFaktur))
                },
                dependencies: [h, F, q, A, M, R, P, N, at, w, G, L, T, mt, X, ht],
                encapsulation: 2
            })
        }
    }
    return n
})();

function xe(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama)
    }
}
var qt = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-jenis-sediaan"]
                ],
                inputs: {
                    dataJenisSediaan$: [0, "data", "dataJenisSediaan$"]
                },
                decls: 15,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Jenis Sediaan"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i()()(), e(12, "tbody", 6), f(13, xe, 5, 2, "tr", 7), _(14, "async"), i()()()()()), a & 2 && (m(13), s("ngForOf", C(14, 1, o.dataJenisSediaan$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Kt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.jenisSediaanForm = new k({
                nama: new u("", [p.required])
            })
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataJenisSediaan$ = this.gudangService.getJenisSediaan()
        }
        onSubmit() {
            this.gudangService.addJenisSediaan({
                nama: this.jenisSediaanForm.value.nama
            }).subscribe({
                next: t => {
                    this.jenisSediaanForm.reset(), this.initialValues(), this.toastr.success("Jenis Sediaan berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-jenis-sediaan"]
                ],
                decls: 13,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Input Jenis Sediaan"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "button", 8), r(11, " Submit "), i()()()(), d(12, "app-list-jenis-sediaan", 9)), a & 2 && (m(4), s("formGroup", o.jenisSediaanForm), m(6), s("disabled", !o.jenisSediaanForm.valid), m(2), s("data", o.dataJenisSediaan$))
                },
                dependencies: [h, A, M, N, w, G, L, T, qt],
                encapsulation: 2
            })
        }
    }
    return n
})();

function Ie(n, l) {
    n & 1 && (U(0), e(1, "div", 0)(2, "div", 1), r(3, "List Karyawan"), i(), e(4, "div", 2), d(5, "app-kop-surat-bawah"), i()(), Y())
}
var Rt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.itemsForm = new k({
                namaKarumkit: new u("", [p.required]),
                noKarumkit: new u("", [p.required]),
                namaKafarmasi: new u("", [p.required]),
                noKafarmasi: new u("", [p.required]),
                namaApoteker: new u("", [p.required]),
                noApoteker: new u("", [p.required])
            })
        }
        ngOnInit() {
            this.intialValues()
        }
        intialValues() {
            this.dataEmployee$ = this.gudangService.getDataEmployee("").pipe(rt(t => {
                this.itemsForm.patchValue(t.data)
            }))
        }
        onSubmit() {
            this.dataEmployee$ = this.gudangService.updateDataEmployee(this.itemsForm.value).pipe(lt(t => t = t.data), rt(() => this.toastr.success("Data Berhasil di Update", "Success")))
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-karyawan"]
                ],
                decls: 47,
                vars: 5,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "namaKarumkit", 1, "form-control"],
                    ["type", "text", "formControlName", "noKarumkit", 1, "form-control"],
                    ["type", "text", "formControlName", "namaKafarmasi", 1, "form-control"],
                    ["type", "text", "formControlName", "noKafarmasi", 1, "form-control"],
                    ["type", "text", "formControlName", "namaApoteker", 1, "form-control"],
                    ["type", "text", "formControlName", "noApoteker", 1, "form-control"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [4, "ngIf"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Data Karyawan"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "h4"), r(6, "Karumkit"), i(), e(7, "div", 4)(8, "label", 5), r(9, "Nama"), i(), e(10, "div", 6), d(11, "input", 7), i()(), e(12, "div", 4)(13, "label", 5), r(14, "No.Reg"), i(), e(15, "div", 6), d(16, "input", 8), i()(), d(17, "hr"), e(18, "h4"), r(19, "Ka.Intalasi Farmasi"), i(), e(20, "div", 4)(21, "label", 5), r(22, "Nama"), i(), e(23, "div", 6), d(24, "input", 9), i()(), e(25, "div", 4)(26, "label", 5), r(27, "No.Reg"), i(), e(28, "div", 6), d(29, "input", 10), i()(), d(30, "hr"), e(31, "h4"), r(32, "Apoteker"), i(), e(33, "div", 4)(34, "label", 5), r(35, "Nama"), i(), e(36, "div", 6), d(37, "input", 11), i()(), e(38, "div", 4)(39, "label", 5), r(40, "No.Reg"), i(), e(41, "div", 6), d(42, "input", 12), i()(), e(43, "button", 13), r(44, " Submit "), i()()()(), f(45, Ie, 6, 0, "ng-container", 14), _(46, "async")), a & 2 && (m(4), s("formGroup", o.itemsForm), m(39), s("disabled", !o.itemsForm.valid), m(2), s("ngIf", C(46, 3, o.dataEmployee$)))
                },
                dependencies: [h, q, D, A, M, N, w, G, L, T, Gt],
                encapsulation: 2
            })
        }
    }
    return n
})();

function De(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama)
    }
}
var Pt = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-kategori"]
                ],
                inputs: {
                    dataList$: [0, "data", "dataList$"]
                },
                decls: 15,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Kategori"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i()()(), e(12, "tbody", 6), f(13, De, 5, 2, "tr", 7), _(14, "async"), i()()()()()), a & 2 && (m(13), s("ngForOf", C(14, 1, o.dataList$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Ut = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.itemsForm = new k({
                nama: new u("", [p.required])
            })
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataItems$ = this.gudangService.getKategori()
        }
        onSubmit() {
            this.gudangService.addKategori({
                nama: this.itemsForm.value.nama
            }).subscribe({
                next: () => {
                    this.itemsForm.reset(), this.initialValues(), this.toastr.success("Kategori berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-kategori"]
                ],
                decls: 13,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Input Kategori"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "button", 8), r(11, " Submit "), i()()()(), d(12, "app-list-kategori", 9)), a & 2 && (m(4), s("formGroup", o.itemsForm), m(6), s("disabled", !o.itemsForm.valid), m(2), s("data", o.dataItems$))
                },
                dependencies: [h, A, M, N, w, G, L, T, Pt],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Yt = (() => {
    class n {
        constructor(t, a, o, b) {
            this.activeModal = t, this.gudangService = a, this.toastr = o, this.farmasiService = b, this.resetDataRequest = new et
        }
        ngOnInit() {}
        onSelesai(t) {
            this.activeModal.dismiss(), this.gudangService.updateRequestGudangSelesai(t).subscribe({
                next: a => {
                    this.toastr.success("Request Gudang Selesai", "Success"), this.resetDataRequest.emit(), this.activeModal.dismiss()
                },
                error: a => {
                    this.toastr.error(a, "Error"), this.activeModal.dismiss()
                },
                complete: () => {
                    this.farmasiService.onLoadNotif$.next()
                }
            })
        }
        onBatal(t) {
            this.activeModal.dismiss(), this.gudangService.updateRequestGudangBatal({
                id: t
            }).subscribe({
                next: a => {
                    this.toastr.warning("Request Gudang berhasil di batalkan", "Success"), this.resetDataRequest.emit(), this.activeModal.dismiss()
                },
                error: a => {
                    this.toastr.error(a, "Error"), this.activeModal.dismiss()
                },
                complete: () => {
                    this.farmasiService.onLoadNotif$.next()
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(St), v(y), v(E), v(Et))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-update-request-apotek"]
                ],
                inputs: {
                    data: "data"
                },
                outputs: {
                    resetDataRequest: "resetDataRequest"
                },
                decls: 14,
                vars: 0,
                consts: [
                    [1, "modal-header", "bg-warning"],
                    [1, "modal-title"],
                    [1, "bi", "bi-exclamation-circle"],
                    ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"],
                    [1, "modal-body"],
                    ["role", "group", "aria-label", "Basic mixed styles example", 1, "btn-group", "w-100"],
                    ["type", "button", 1, "btn", "btn-success", 3, "click"],
                    ["type", "button", 1, "btn", "btn-danger", 3, "click"],
                    [1, "modal-footer"],
                    ["type", "button", 1, "btn", "btn-outline-dark", 3, "click"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "h4", 1), d(2, "i", 2), r(3, " Konfirmasi "), i(), e(4, "button", 3), g("click", function() {
                        return o.activeModal.dismiss("Cross click")
                    }), i()(), e(5, "div", 4)(6, "div", 5)(7, "button", 6), g("click", function() {
                        return o.onSelesai(o.data)
                    }), r(8, " Selesai "), i(), e(9, "button", 7), g("click", function() {
                        return o.onBatal(o.data._id)
                    }), r(10, " Batal "), i()()(), e(11, "div", 8)(12, "button", 9), g("click", function() {
                        return o.activeModal.close("Close click")
                    }), r(13, " Close "), i()())
                },
                dependencies: [h],
                encapsulation: 2
            })
        }
    }
    return n
})();

function we(n, l) {
    if (n & 1 && (e(0, "tr", 12)(1, "th", 9), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td", 13), r(8), i(), e(9, "td"), r(10), i(), e(11, "td", 14), r(12), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.distributor), m(2), S(t.noFaktur), m(2), S(t.nama), m(2), S(t.kategori), m(2), S(t.jumlah)
    }
}

function Ge(n, l) {
    if (n & 1) {
        let t = nt();
        e(0, "tr", 8), g("click", function() {
            let o = Z(t).$implicit,
                b = B();
            return tt(b.onConfirm(o))
        }), e(1, "th", 9), r(2), i(), e(3, "td"), r(4), i(), e(5, "td"), r(6), i(), e(7, "td")(8, "table", 10)(9, "tbody"), f(10, we, 13, 6, "tr", 11), i()()()()
    }
    if (n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.createdAt), m(2), S(t.from), m(4), s("ngForOf", t.items)
    }
}
var Ht = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.modalService = a, this.dataUpdate = null, this.isUpdate = !1
        }
        ngOnInit() {
            this.initValues()
        }
        onConfirm(t) {
            this.isUpdate = !0;
            let a = this.modalService.open(Yt);
            a.componentInstance.data = t, a.componentInstance.resetDataRequest.subscribe(() => {
                this.initValues()
            })
        }
        initValues() {
            this.dataRequest$ = this.gudangService.getRequestGudang()
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(_t))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-request-apotek"]
                ],
                decls: 19,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm", "table-hover", "align-middle"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    ["style", "cursor: pointer", 3, "click", 4, "ngFor", "ngForOf"],
                    [2, "cursor", "pointer", 3, "click"],
                    ["scope", "row"],
                    [1, "table", "table-borderless", "table-sm", "mt-3"],
                    ["class", "text-center", "style", "cursor: pointer", 4, "ngFor", "ngForOf"],
                    [1, "text-center", 2, "cursor", "pointer"],
                    [1, "text-start", "text-nowrap"],
                    [1, "text-end"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Request Apotek"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Tanggal"), i(), e(12, "th", 5), r(13, "Dari"), i(), e(14, "th", 5), r(15, "Request"), i()()(), e(16, "tbody", 6), f(17, Ge, 11, 4, "tr", 7), _(18, "async"), i()()()()()), a & 2 && (m(17), s("ngForOf", C(18, 1, o.dataRequest$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();

function ke(n, l) {
    if (n & 1 && (e(0, "tr")(1, "th", 8), r(2), i(), e(3, "td"), r(4), i()()), n & 2) {
        let t = l.$implicit,
            a = l.index;
        m(2), x("", a + 1, "."), m(2), S(t.nama)
    }
}
var Wt = (() => {
    class n {
        constructor() {}
        ngOnInit() {}
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-list-satuan"]
                ],
                inputs: {
                    dataSatuan$: [0, "data", "dataSatuan$"]
                },
                decls: 15,
                vars: 3,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "table", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [4, "ngFor", "ngForOf"],
                    ["scope", "row"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "List Jenis Sediaan"), i(), e(3, "div", 2)(4, "div")(5, "table", 3)(6, "thead", 4)(7, "tr")(8, "th", 5), r(9, "#"), i(), e(10, "th", 5), r(11, "Nama"), i()()(), e(12, "tbody", 6), f(13, ke, 5, 2, "tr", 7), _(14, "async"), i()()()()()), a & 2 && (m(13), s("ngForOf", C(14, 1, o.dataSatuan$)))
                },
                dependencies: [h, F, D],
                encapsulation: 2
            })
        }
    }
    return n
})();

function Me(n, l) {
    if (n & 1 && d(0, "app-list-satuan", 10), n & 2) {
        let t = B();
        s("data", t.dataSatuan$)
    }
}
var Qt = (() => {
    class n {
        constructor(t, a) {
            this.gudangService = t, this.toastr = a, this.satuanForm = new k({
                nama: new u("", [p.required])
            })
        }
        ngOnInit() {
            this.initialValues()
        }
        initialValues() {
            this.dataSatuan$ = this.gudangService.getSatuan()
        }
        onSubmit() {
            this.gudangService.addSatuan({
                nama: this.satuanForm.value.nama
            }).subscribe({
                next: t => {
                    this.satuanForm.reset(), this.initialValues(), this.toastr.success("Satuan berhasil di tambahkan", "Success")
                },
                error: t => {
                    this.toastr.error(t, "Error")
                }
            })
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)(v(y), v(E))
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-satuan"]
                ],
                decls: 14,
                vars: 5,
                consts: [
                    [1, "card", "mb-2"],
                    [1, "card-header", "bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "mb-2", "row"],
                    ["for", "staticEmail", 1, "col-sm-2", "col-form-label"],
                    [1, "col-sm-10"],
                    ["type", "text", "formControlName", "nama", 1, "form-control"],
                    ["type", "submit", 1, "btn", "btn-primary", 3, "disabled"],
                    [3, "data", 4, "ngIf"],
                    [3, "data"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "div", 0)(1, "div", 1), r(2, "Input Jenis Sediaan"), i(), e(3, "div", 2)(4, "form", 3), g("submit", function() {
                        return o.onSubmit()
                    }), e(5, "div", 4)(6, "label", 5), r(7, "Nama"), i(), e(8, "div", 6), d(9, "input", 7), i()(), e(10, "button", 8), r(11, " Submit "), i()()()(), f(12, Me, 1, 1, "app-list-satuan", 9), _(13, "async")), a & 2 && (m(4), s("formGroup", o.satuanForm), m(6), s("disabled", !o.satuanForm.valid), m(2), s("ngIf", C(13, 3, o.dataSatuan$)))
                },
                dependencies: [h, q, D, A, M, N, w, G, L, T, Wt],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Xt = (n, l) => ({
        "is-invalid": n,
        "is-valid": l
    }),
    zt = (() => {
        class n {
            constructor(t, a) {
                this.gudangService = t, this.toastr = a, this.marginForm = new k({
                    marginBpjsYankes: new u(0, [p.required]),
                    marginUmum: new u(0, [p.required])
                })
            }
            ngOnInit() {
                this.initialValues()
            }
            initialValues() {
                this.gudangService.getMargin(this.marginForm.value).subscribe({
                    next: t => {
                        this.marginForm.patchValue({
                            marginBpjsYankes: t.data?.marginBpjsYankes,
                            marginUmum: t.data?.marginUmum
                        })
                    },
                    error: t => {
                        this.toastr.error(t, "Error", {})
                    },
                    complete: () => {}
                })
            }
            onSave() {
                this.gudangService.updateMargin(this.marginForm.value).subscribe({
                    next: () => {},
                    error: t => {
                        this.toastr.error(t, "Error", {})
                    },
                    complete: () => {
                        this.toastr.success("Margin Harga berhasil di simpan", "Success", {})
                    }
                })
            }
            static {
                this.\u0275fac = function(a) {
                    return new(a || n)(v(y), v(E))
                }
            }
            static {
                this.\u0275cmp = c({
                    type: n,
                    selectors: [
                        ["app-gudang-margin"]
                    ],
                    decls: 24,
                    vars: 9,
                    consts: [
                        [1, "row"],
                        [1, "col"],
                        [1, "card"],
                        [1, "card-header", "text-bg-warning", "fw-bold"],
                        [1, "card-body"],
                        [3, "ngSubmit", "formGroup"],
                        [1, "mb-3"],
                        ["for", "exampleFormControlInput1", 1, "form-label"],
                        [1, "input-group"],
                        ["type", "number", "id", "exampleFormControlInput1", "placeholder", "name@example.com", "formControlName", "marginBpjsYankes", 1, "form-control", 3, "ngClass"],
                        ["id", "basic-addon2", 1, "input-group-text"],
                        ["for", "exampleFormControlTextarea1", 1, "form-label"],
                        ["type", "number", "id", "exampleFormControlInput1", "placeholder", "name@example.com", "formControlName", "marginUmum", 1, "form-control", 3, "ngClass"],
                        ["type", "submit", 1, "btn", "btn-primary", "w-100"]
                    ],
                    template: function(a, o) {
                        a & 1 && (e(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3), r(4, "Margin Harga"), i(), e(5, "div", 4)(6, "form", 5), g("ngSubmit", function() {
                            return o.onSave()
                        }), e(7, "div", 6)(8, "label", 7), r(9, "Margin Harga BPJS / YANKES/YANKESTU"), i(), e(10, "div", 8), d(11, "input", 9), e(12, "span", 10), r(13, "%"), i()()(), e(14, "div", 6)(15, "label", 11), r(16, "Margin Harga Umum/Jasa Raharja/Lain-lain"), i(), e(17, "div", 8), d(18, "input", 12), e(19, "span", 10), r(20, "%"), i()()(), e(21, "div", 6)(22, "button", 13), r(23, "Save"), i()()()()()()()), a & 2 && (m(6), s("formGroup", o.marginForm), m(5), s("ngClass", ot(3, Xt, o.marginForm.controls.marginBpjsYankes.invalid && o.marginForm.controls.marginBpjsYankes.touched, o.marginForm.controls.marginBpjsYankes.valid)), m(7), s("ngClass", ot(6, Xt, o.marginForm.controls.marginUmum.invalid && o.marginForm.controls.marginUmum.touched, o.marginForm.controls.marginUmum.valid)))
                    },
                    dependencies: [h, gt, A, M, N, at, w, G, L, T],
                    encapsulation: 2
                })
            }
        }
        return n
    })();
var Zt = (() => {
    class n {
        constructor() {
            this.depo = "gudang"
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-pengambilan-obat"]
                ],
                decls: 1,
                vars: 1,
                consts: [
                    [3, "depoChange", "depo"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "app-pengambilan-obat-bebas", 0), Q("depoChange", function(J) {
                        return W(o.depo, J) || (o.depo = J), J
                    }), i()), a & 2 && H("depo", o.depo)
                },
                dependencies: [It],
                encapsulation: 2
            })
        }
    }
    return n
})();
var te = (() => {
    class n {
        constructor() {
            this.depo = "gudang"
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275cmp = c({
                type: n,
                selectors: [
                    ["app-gudang-penambahan-obat"]
                ],
                decls: 1,
                vars: 1,
                consts: [
                    [3, "depoChange", "depo"]
                ],
                template: function(a, o) {
                    a & 1 && (e(0, "app-penambahan-obat-bebas", 0), Q("depoChange", function(J) {
                        return W(o.depo, J) || (o.depo = J), J
                    }), i()), a & 2 && H("depo", o.depo)
                },
                dependencies: [Dt],
                encapsulation: 2
            })
        }
    }
    return n
})();
var Le = [{
        path: "",
        redirectTo: "input-obat-luar",
        pathMatch: "full"
    }, {
        path: "input",
        component: Vt
    }, {
        path: "distributor",
        component: Jt
    }, {
        path: "jenisSediaan",
        component: Kt
    }, {
        path: "satuan",
        component: Qt
    }, {
        path: "kategori",
        component: Ut
    }, {
        path: "daftar-obat",
        component: Ot
    }, {
        path: "daftar-bhp",
        component: Tt
    }, {
        path: "daftar-alkes",
        component: Mt
    }, {
        path: "request-apotek",
        component: Ht
    }, {
        path: "karyawan",
        component: Rt
    }, {
        path: "margin",
        component: zt
    }, {
        path: "pengambilan-obat",
        component: Zt
    }, {
        path: "penambahan-obat",
        component: te
    }, {
        path: "stock-obat-luar",
        component: Nt
    }, {
        path: "input-obat-luar",
        component: wt
    }],
    ee = (() => {
        class n {
            static {
                this.\u0275fac = function(a) {
                    return new(a || n)
                }
            }
            static {
                this.\u0275mod = it({
                    type: n
                })
            }
            static {
                this.\u0275inj = z({
                    imports: [X.forChild(Le), X]
                })
            }
        }
        return n
    })();
var In = (() => {
    class n {
        static {
            this.\u0275fac = function(a) {
                return new(a || n)
            }
        }
        static {
            this.\u0275mod = it({
                type: n
            })
        }
        static {
            this.\u0275inj = z({
                imports: [h, ee]
            })
        }
    }
    return n
})();
export {
    In as GudangModuleModule
};