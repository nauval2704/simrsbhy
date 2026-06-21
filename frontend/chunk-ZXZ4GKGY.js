import {
    d as k,
    e as y,
    h as L
} from "./chunk-YIQM4CGR.js";
import {
    c as h,
    k as w
} from "./chunk-QGNVLNC6.js";
import "./chunk-IVTVBFQS.js";
import "./chunk-NKLTBXW5.js";
import {
    j as x,
    s as C
} from "./chunk-CFNDTNZN.js";
import {
    Da as m,
    Db as S,
    Ea as d,
    Ec as o,
    Kb as g,
    Oc as l,
    Yb as _,
    Zb as i,
    gc as e,
    hc as a,
    ic as n,
    mc as v,
    qb as t,
    sc as b,
    tc as u
} from "./chunk-UYVTZL26.js";
var M = () => ["gudang/distributor"],
    F = () => ["gudang/jenisSediaan"],
    I = () => ["gudang/satuan"],
    T = () => ["gudang/kategori"],
    N = () => ["gudang/margin"],
    D = () => ["gudang/daftar-obat"],
    V = () => ["gudang/daftar-bhp"],
    A = () => ["gudang/daftar-alkes"],
    R = () => ["gudang/karyawan"];

function $(r, f) {
    r & 1 && n(0, "i", 18)
}

function j(r, f) {
    r & 1 && n(0, "i", 19)
}

function H(r, f) {
    if (r & 1) {
        let p = v();
        e(0, "div", 2)(1, "li", 3), b("click", function() {
            m(p);
            let c = u();
            return d(c.statusSetting = !c.statusSetting)
        }), e(2, "div", 4)(3, "div"), n(4, "i", 5), o(5, " SETTINGS "), a(), e(6, "div"), g(7, $, 1, 0, "i", 6)(8, j, 1, 0, "i", 7), a()()(), e(9, "div", 8, 0), b("ngbCollapseChange", function(c) {
            m(p);
            let E = u();
            return d(E.statusSetting = c)
        }), e(11, "a", 9), n(12, "i", 10), e(13, "span"), o(14, " Distributor"), a()(), e(15, "a", 9), n(16, "i", 11), e(17, "span"), o(18, " Jenis Sediaan"), a()(), e(19, "a", 9), n(20, "i", 12), e(21, "span"), o(22, " Satuan"), a()(), e(23, "a", 9), n(24, "i", 13), e(25, "span"), o(26, " Kategori"), a()(), e(27, "a", 9), n(28, "i", 14), e(29, "span"), o(30, " Margin Harga"), a()(), e(31, "a", 9), n(32, "i", 15), e(33, "span"), o(34, " Daftar Obat"), a()(), e(35, "a", 9), n(36, "i", 15), e(37, "span"), o(38, " Daftar BHP"), a()(), e(39, "a", 9), n(40, "i", 15), e(41, "span"), o(42, " Daftar Alkes"), a()(), e(43, "a", 16), n(44, "i", 17), e(45, "span"), o(46, " Karyawan"), a()()()()
    }
    if (r & 2) {
        let p = u();
        t(), _("aria-expanded", !p.statusSetting), t(6), i("ngIf", p.statusSetting), t(), i("ngIf", !p.statusSetting), t(), i("ngbCollapse", !p.statusSetting), t(2), i("routerLink", l(13, M)), t(4), i("routerLink", l(14, F)), t(4), i("routerLink", l(15, I)), t(4), i("routerLink", l(16, T)), t(4), i("routerLink", l(17, N)), t(4), i("routerLink", l(18, D)), t(4), i("routerLink", l(19, V)), t(4), i("routerLink", l(20, A)), t(4), i("routerLink", l(21, R))
    }
}
var z = (() => {
    class r {
        constructor() {
            this.statusSetting = !1
        }
        static {
            this.\u0275fac = function(s) {
                return new(s || r)
            }
        }
        static {
            this.\u0275cmp = S({
                type: r,
                selectors: [
                    ["app-menu-setting"]
                ],
                inputs: {
                    dataNotif$: [0, "data", "dataNotif$"]
                },
                decls: 1,
                vars: 1,
                consts: [
                    ["collapse", "ngbCollapse"],
                    ["class", "list-group", 4, "ngIf"],
                    [1, "list-group"],
                    ["aria-controls", "collapseExample", 1, "list-group-item", "rounded-0", "text-bg-warning", "fw-bold", 2, "cursor", "pointer", 3, "click"],
                    [1, "d-flex", "justify-content-between"],
                    [1, "bi", "bi-gear"],
                    ["class", "bi bi-chevron-down", 4, "ngIf"],
                    ["class", "bi bi-chevron-right", 4, "ngIf"],
                    [3, "ngbCollapseChange", "ngbCollapse"],
                    ["routerLinkActive", "active", 1, "list-group-item", "list-group-item-action", 3, "routerLink"],
                    [1, "bi", "bi-shop"],
                    [1, "bi", "bi-droplet"],
                    [1, "bi", "bi-box-seam"],
                    [1, "bi", "bi-tag"],
                    [1, "bi", "bi-coin"],
                    [1, "bi", "bi-card-list"],
                    ["routerLinkActive", "active", 1, "list-group-item", "list-group-item-action", "rounded-bottom", 3, "routerLink"],
                    [1, "bi", "bi-people"],
                    [1, "bi", "bi-chevron-down"],
                    [1, "bi", "bi-chevron-right"]
                ],
                template: function(s, c) {
                    s & 1 && g(0, H, 47, 22, "div", 1), s & 2 && i("ngIf", c.dataNotif$)
                },
                dependencies: [C, x, L, k, y, w, h],
                encapsulation: 2
            })
        }
    }
    return r
})();
export {
    z as MenuSettingComponent
};