import {
    a as M
} from "./chunk-LP3CUFG4.js";
import {
    k as _
} from "./chunk-QJBCP6KK.js";
import {
    j as g,
    m as h,
    o as y,
    p as C,
    s as K
} from "./chunk-CFNDTNZN.js";
import {
    Db as v,
    Ec as t,
    Fc as u,
    Gc as m,
    Kb as b,
    Sc as s,
    Tc as f,
    Uc as E,
    Zb as x,
    gc as i,
    hc as p,
    ic as a,
    jc as A,
    kc as S,
    qb as l,
    rb as c,
    tc as I
} from "./chunk-UYVTZL26.js";

function D(r, w) {
    if (r & 1 && (A(0), i(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "p", 4), t(5, " KA.INSTALANSI FARMASI"), a(6, "br")(7, "br")(8, "br")(9, "br")(10, "br"), i(11, "span"), t(12), p(), a(13, "br"), i(14, "span", 5), t(15), p()()()(), i(16, "div", 2)(17, "div", 3)(18, "p", 4), t(19), s(20, "date"), s(21, "uppercase"), a(22, "br"), t(23, " APOTEKER "), a(24, "br")(25, "br")(26, "br")(27, "br"), i(28, "span"), t(29), p(), a(30, "br"), i(31, "span", 6), t(32), p()()()()(), i(33, "div", 7)(34, "div", 2)(35, "div", 3)(36, "p", 4), t(37, " MENGETAHUI"), a(38, "br"), t(39, " KARUMKIT BHAYANGKARA BANDA ACEH "), a(40, "br")(41, "br")(42, "br")(43, "br"), i(44, "span"), t(45), p(), a(46, "br"), i(47, "span", 6), t(48), p()()()()(), S()), r & 2) {
        let o, n, d, e = w.ngIf,
            B = I();
        l(12), m("", (o = e == null || e.data == null ? null : e.data.namaKafarmasi) !== null && o !== void 0 ? o : "-", " "), l(3), u(e == null || e.data == null ? null : e.data.noKafarmasi), l(4), m(" BANDA ACEH, ", f(21, 10, E(20, 7, B.today, "dd MMMM YYYY")), ""), l(10), m("", (n = e == null || e.data == null ? null : e.data.namaApoteker) !== null && n !== void 0 ? n : "-", " "), l(3), u((d = e == null || e.data == null ? null : e.data.noApoteker) !== null && d !== void 0 ? d : "-"), l(13), m("", e == null || e.data == null ? null : e.data.namaKarumkit, " "), l(3), u(e == null || e.data == null ? null : e.data.noKarumkit)
    }
}
var P = (() => {
    class r {
        constructor(o, n) {
            this.gudangService = o, this.toastr = n, this.today = new Date
        }
        ngOnInit() {
            this.intialValues()
        }
        intialValues() {
            this.dataEmployee$ = this.gudangService.getDataEmployee("")
        }
        static {
            this.\u0275fac = function(n) {
                return new(n || r)(c(M), c(_))
            }
        }
        static {
            this.\u0275cmp = v({
                type: r,
                selectors: [
                    ["app-kop-surat-bawah"]
                ],
                decls: 2,
                vars: 3,
                consts: [
                    [4, "ngIf"],
                    [1, "row", "mb-4"],
                    [1, "col"],
                    [1, "text-center"],
                    [1, "lh-2", "fw-bold"],
                    [1, "border-top", "ps-4", "pe-4"],
                    [1, "border-top"],
                    [1, "row"]
                ],
                template: function(n, d) {
                    n & 1 && (b(0, D, 49, 12, "ng-container", 0), s(1, "async")), n & 2 && x("ngIf", f(1, 1, d.dataEmployee$))
                },
                dependencies: [K, g, h, y, C],
                encapsulation: 2
            })
        }
    }
    return r
})();
export {
    P as a
};