import {
    d as O,
    e as P,
    h as E
} from "./chunk-YIQM4CGR.js";
import {
    c as L,
    k as F
} from "./chunk-QGNVLNC6.js";
import "./chunk-IVTVBFQS.js";
import "./chunk-NKLTBXW5.js";
import {
    j as w,
    m as S,
    s as y
} from "./chunk-CFNDTNZN.js";
import {
    Da as m,
    Db as _,
    Ea as u,
    Ec as g,
    Fc as k,
    Kb as b,
    Oc as c,
    Sc as I,
    Tc as M,
    Yb as v,
    Zb as n,
    gc as e,
    hc as l,
    ic as i,
    jc as h,
    kc as C,
    mc as x,
    qb as t,
    sc as f,
    tc as s
} from "./chunk-UYVTZL26.js";
var R = () => ["igd/input/IGD"],
    N = () => ["igd/request-gudang"],
    q = () => ["igd/pengambilan-obat"],
    D = () => ["igd/penambahan-obat"],
    T = () => ["igd/stock-obat-luar"],
    V = () => ["igd/input-obat-luar"],
    G = () => ["laporan/rekap-request-gudang"],
    j = () => ["laporan/laporan-igd"];

function A(a, d) {
    a & 1 && i(0, "i", 17)
}

function $(a, d) {
    a & 1 && i(0, "i", 14)
}

function z(a, d) {
    if (a & 1) {
        let o = x();
        h(0), e(1, "div", 2)(2, "li", 3), f("click", function() {
            m(o);
            let p = s();
            return u(p.statusIgd = !p.statusIgd)
        }), e(3, "div", 4)(4, "div"), i(5, "i", 5), g(6, " DEPO IGD "), l(), e(7, "div"), b(8, A, 1, 0, "i", 6)(9, $, 1, 0, "i", 7), l()()(), e(10, "div", 8, 0), f("ngbCollapseChange", function(p) {
            m(o);
            let B = s();
            return u(B.statusIgd = p)
        }), e(12, "a", 9), i(13, "i", 10), e(14, "span"), g(15, " Input Barang "), l()(), e(16, "a", 9), i(17, "i", 11), e(18, "span"), g(19, " Request Barang"), l()(), e(20, "a", 9), i(21, "i", 12), e(22, "span"), g(23, " Pengambilan Obat Bebas"), l()(), e(24, "a", 9), i(25, "i", 13), e(26, "span"), g(27, " Penambahan Obat Bebas"), l()(), e(28, "a", 9), i(29, "i", 14), e(30, "span"), g(31, " Stock Obat Bebas"), l()(), e(32, "a", 9), i(33, "i", 14), e(34, "span"), g(35, " Input Stock Obat Bebas"), l()(), e(36, "a", 9), i(37, "i", 15), e(38, "span"), g(39, " Rekap Request barang "), e(40, "span", 16), g(41), l()()(), e(42, "a", 9), i(43, "i", 15), e(44, "span"), g(45, " Laporan Depo Igd "), l()()()(), C()
    }
    if (a & 2) {
        let o = d.ngIf,
            r = s();
        t(2), v("aria-expanded", !r.statusIgd), t(6), n("ngIf", r.statusIgd), t(), n("ngIf", !r.statusIgd), t(), n("ngbCollapse", !r.statusIgd), t(2), n("routerLink", c(13, R)), t(4), n("routerLink", c(14, N)), t(4), n("routerLink", c(15, q)), t(4), n("routerLink", c(16, D)), t(4), n("routerLink", c(17, T)), t(4), n("routerLink", c(18, V)), t(4), n("routerLink", c(19, G)), t(5), k(!(o == null || o.data == null) && o.data.notifReqGudang ? o == null || o.data == null ? null : o.data.notifReqGudang : null), t(), n("routerLink", c(20, j))
    }
}
var Y = (() => {
    class a {
        constructor() {
            this.statusIgd = !1
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || a)
            }
        }
        static {
            this.\u0275cmp = _({
                type: a,
                selectors: [
                    ["app-menu-igd"]
                ],
                inputs: {
                    dataNotif$: [0, "data", "dataNotif$"]
                },
                decls: 2,
                vars: 3,
                consts: [
                    ["collapse", "ngbCollapse"],
                    [4, "ngIf"],
                    [1, "list-group"],
                    ["aria-controls", "collapseExample", 1, "list-group-item", "text-bg-warning", "fw-bold", 2, "cursor", "pointer", 3, "click"],
                    [1, "d-flex", "justify-content-between"],
                    [1, "bi", "bi-bookmark-star"],
                    ["class", "bi bi-chevron-down", 4, "ngIf"],
                    ["class", "bi bi-chevron-right", 4, "ngIf"],
                    [3, "ngbCollapseChange", "ngbCollapse"],
                    ["routerLinkActive", "active", 1, "list-group-item", "list-group-item-action", 3, "routerLink"],
                    [1, "bi", "bi-box-seam"],
                    [1, "bi", "bi-arrow-up-right", "text-danger"],
                    [1, "bi", "bi-dash-lg"],
                    [1, "bi", "bi-plus-lg"],
                    [1, "bi", "bi-chevron-right"],
                    [1, "bi", "bi-journal-medical"],
                    [1, "badge", "text-bg-warning", "float-end"],
                    [1, "bi", "bi-chevron-down"]
                ],
                template: function(r, p) {
                    r & 1 && (b(0, z, 46, 21, "ng-container", 1), I(1, "async")), r & 2 && n("ngIf", M(1, 1, p.dataNotif$))
                },
                dependencies: [y, w, S, E, O, P, F, L],
                styles: [`body[_ngcontent-%COMP%]{min-height:100vh;min-height:-webkit-fill-available}html[_ngcontent-%COMP%]{height:-webkit-fill-available}main[_ngcontent-%COMP%]{height:100vh;height:-webkit-fill-available;max-height:100vh;overflow-x:auto;overflow-y:hidden}.dropdown-toggle[_ngcontent-%COMP%]{outline:0}.btn-toggle[_ngcontent-%COMP%]{padding:.25rem .5rem;font-weight:600;color:#000000a6;background-color:transparent}.btn-toggle[_ngcontent-%COMP%]:hover, .btn-toggle[_ngcontent-%COMP%]:focus{color:#000000d9;background-color:#fff3cd}.btn-toggle[_ngcontent-%COMP%]:before{width:1.25em;line-height:0;content:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");transition:transform .35s ease;transform-origin:.5em 50%}.btn-toggle[aria-expanded=true][_ngcontent-%COMP%]{color:#000000d9}.btn-toggle[aria-expanded=true][_ngcontent-%COMP%]:before{transform:rotate(90deg)}.btn-toggle-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:.1875rem .5rem;margin-top:.125rem;margin-left:1.25rem}.btn-toggle-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .btn-toggle-nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:focus{background-color:#fff3cd}.scrollarea[_ngcontent-%COMP%]{overflow-y:auto}`]
            })
        }
    }
    return a
})();
export {
    Y as MenuIgdComponent
};