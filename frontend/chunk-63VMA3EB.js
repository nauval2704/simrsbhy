import {
    a as K,
    b as f
} from "./chunk-P4PAYY2C.js";
import {
    a as U,
    b as z
} from "./chunk-IDDMCM5J.js";
import {
    a as H
} from "./chunk-QG5PCDO6.js";
import {
    a as $
} from "./chunk-YIQM4CGR.js";
import {
    a as ee
} from "./chunk-FUXXJWDL.js";
import {
    a as D
} from "./chunk-IVTVBFQS.js";
import {
    b as j,
    c as x,
    e as A,
    f as O,
    g as G,
    i as F,
    l as B,
    o as Q,
    p as q,
    y as R
} from "./chunk-NKLTBXW5.js";
import "./chunk-W7XVFZVJ.js";
import {
    h as X,
    i as T,
    j as Y,
    m as V,
    s as u
} from "./chunk-CFNDTNZN.js";
import {
    Ac as I,
    Bc as N,
    Cc as J,
    Da as P,
    Db as d,
    Ea as L,
    Ec as a,
    Fc as y,
    Gc as M,
    Kb as g,
    Qc as C,
    Sc as _,
    Tc as S,
    Zb as l,
    g as Z,
    gc as n,
    hc as o,
    ic as m,
    mc as k,
    qb as s,
    ra as v,
    sc as c,
    tc as h
} from "./chunk-UYVTZL26.js";

function ne(t, p) {
    if (t & 1 && (n(0, "tr")(1, "td"), a(2), o(), n(3, "td", 15), a(4), o(), n(5, "td", 15), a(6), o()()), t & 2) {
        let r = p.$implicit,
            i = p.index;
        s(2), M("", i + 1, "."), s(2), y(r._id.jenisPasien), s(2), y(r.jumlah)
    }
}

function oe(t, p) {
    if (t & 1) {
        let r = k();
        n(0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "button", 4), m(4, "i", 5), a(5, " Print "), o(), n(6, "button", 6), c("click", function() {
            P(r);
            let e = h();
            return L(e.exportexcel())
        }), m(7, "i", 7), a(8, " Export "), o()(), n(9, "div", 8)(10, "div", 9)(11, "div", 10)(12, "table", 11)(13, "thead", 12)(14, "tr")(15, "th", 13), a(16, "NO."), o(), n(17, "th", 13), a(18, "JENIS PASIEN"), o(), n(19, "th", 13), a(20, "JUMLAH"), o()()(), n(21, "tbody"), g(22, ne, 7, 3, "tr", 14), _(23, "async"), o()()()()()()()
    }
    if (t & 2) {
        let r = h();
        s(3), l("useExistingCss", !0), s(19), l("ngForOf", S(23, 2, r.dataItems$))
    }
}
var w = (() => {
    class t {
        constructor() {
            this.fileName = "rekapJenisPasien.xlsx"
        }
        ngOnInit() {}
        exportexcel() {
            let r = document.getElementById("rekapFaktur-table"),
                i = f.table_to_sheet(r),
                e = f.book_new();
            f.book_append_sheet(e, i, "Sheet1"), K(e, this.fileName)
        }
        static {
            this.\u0275fac = function(i) {
                return new(i || t)
            }
        }
        static {
            this.\u0275cmp = d({
                type: t,
                selectors: [
                    ["app-list-jenis-pasien"]
                ],
                inputs: {
                    dataItems$: [0, "data", "dataItems$"]
                },
                decls: 2,
                vars: 3,
                consts: [
                    ["class", "card mb-2 shadow-sm", 4, "ngIf"],
                    [1, "card", "mb-2", "shadow-sm"],
                    [1, "card-body"],
                    ["role", "group", "aria-label", "Basic outlined example", 1, "btn-group", "mb-2"],
                    ["type", "button", "printSectionId", "print-rekap-faktur", "ngxPrint", "", 1, "btn", "btn-success", 3, "useExistingCss"],
                    [1, "bi", "bi-printer"],
                    ["type", "button", 1, "btn", "btn-success", 3, "click"],
                    [1, "bi", "bi-filetype-xlsx"],
                    ["id", "print-rekap-faktur"],
                    ["id", "rekapFaktur-table"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-hover", "table-striped", "table-sm"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [4, "ngFor", "ngForOf"],
                    [1, "text-nowrap"]
                ],
                template: function(i, e) {
                    i & 1 && (g(0, oe, 24, 4, "div", 0), _(1, "async")), i & 2 && l("ngIf", S(1, 1, e.dataItems$))
                },
                dependencies: [u, T, Y, V, z, U],
                encapsulation: 2
            })
        }
    }
    return t
})();
var E = Z(ee());
var W = (t, p) => ({
        "is-invalid": t,
        "is-valid": p
    }),
    Ce = (() => {
        class t {
            constructor() {
                this.laporanForm = new G({
                    start: new F((0, E.default)().format("YYYY-MM-DD"), [x.required]),
                    end: new F((0, E.default)().format("YYYY-MM-DD"), [x.required])
                }), this.homeService = v(H), this.route = v($), this.title = this.route.url.pipe(D()).subscribe(r => {
                    this.homeService.titleComponent.set(r[0].path.replace(/-/g, " "))
                })
            }
            ngOnInit() {}
            onSubmit() {
                this.dataLaporan$ = this.homeService.laporanJenisPasien(this.laporanForm.value.start, this.laporanForm.value.end)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || t)
                }
            }
            static {
                this.\u0275cmp = d({
                    type: t,
                    selectors: [
                        ["app-laporan-jenis-pasien"]
                    ],
                    viewQuery: function(i, e) {
                        if (i & 1 && I(w, 7), i & 2) {
                            let b;
                            N(b = J()) && (e.child = b.first)
                        }
                    },
                    decls: 18,
                    vars: 10,
                    consts: [
                        [1, "row", "mb-2"],
                        [1, "col-lg-6"],
                        [1, "card", "shadow-sm"],
                        [1, "card-body"],
                        [3, "submit", "formGroup"],
                        [1, "form-group", "mb-2", "row"],
                        ["for", "start", 1, "col-lg-3", "col-form-label", "fw-bold"],
                        [1, "col-lg-9"],
                        ["type", "date", "formControlName", "start", "id", "start", 1, "form-control", 3, "ngClass"],
                        ["for", "end", 1, "col-lg-3", "col-form-label", "fw-bold"],
                        ["type", "date", "formControlName", "end", "id", "end", 1, "form-control", 3, "ngClass"],
                        ["type", "submit", 1, "btn", "btn-primary", "my-2", 3, "disabled"],
                        [3, "data"]
                    ],
                    template: function(i, e) {
                        i & 1 && (n(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "form", 4), c("submit", function() {
                            return e.onSubmit()
                        }), n(5, "div", 5)(6, "label", 6), a(7, "Tgl. Mulai"), o(), n(8, "div", 7), m(9, "input", 8), o()(), n(10, "div", 5)(11, "label", 9), a(12, "Tgl. Akhir"), o(), n(13, "div", 7), m(14, "input", 10), o()(), n(15, "button", 11), a(16, " Submit "), o()()()()()(), m(17, "app-list-jenis-pasien", 12)), i & 2 && (s(4), l("formGroup", e.laporanForm), s(5), l("ngClass", C(4, W, e.laporanForm.controls.start.invalid && e.laporanForm.controls.start.touched, e.laporanForm.controls.start.valid)), s(5), l("ngClass", C(7, W, e.laporanForm.controls.end.invalid && e.laporanForm.controls.end.touched, e.laporanForm.controls.end.valid)), s(3), l("data", e.dataLaporan$))
                    },
                    dependencies: [u, X, R, B, j, A, O, Q, q, w],
                    encapsulation: 2
                })
            }
        }
        return t
    })();
export {
    Ce as LaporanJenisPasienComponent
};