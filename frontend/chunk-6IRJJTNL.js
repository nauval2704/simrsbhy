import {
    a as v
} from "./chunk-C72AG5L6.js";
import {
    a as w
} from "./chunk-VOPKTLWU.js";
import {
    b as M,
    c as N
} from "./chunk-KIIXQFYM.js";
import "./chunk-FUXXJWDL.js";
import {
    d as I,
    e as S,
    f as y,
    g as E,
    h as T,
    i as A,
    j as D
} from "./chunk-QGNVLNC6.js";
import "./chunk-IVTVBFQS.js";
import "./chunk-UI7HE65P.js";
import "./chunk-HSMKNQVK.js";
import "./chunk-NKLTBXW5.js";
import {
    b as H
} from "./chunk-KT4J7VG7.js";
import "./chunk-QJBCP6KK.js";
import "./chunk-W7XVFZVJ.js";
import {
    s as b
} from "./chunk-CFNDTNZN.js";
import {
    Db as f,
    Ec as p,
    Kb as l,
    Lb as _,
    Wb as C,
    Xb as g,
    Zb as x,
    cc as d,
    gc as i,
    hc as n,
    ic as t,
    qb as r,
    ra as P,
    tc as h
} from "./chunk-UYVTZL26.js";
var j = () => [import("./chunk-PHAG6DPM.js").then(e => e.DetailPatientComponent)];

function k(e, a) {
    e & 1 && t(0, "app-detail-patient")
}

function B(e, a) {
    e & 1 && t(0, "app-placeholder")
}
var F = (() => {
    class e {
        static {
            this.\u0275fac = function(o) {
                return new(o || e)
            }
        }
        static {
            this.\u0275cmp = f({
                type: e,
                selectors: [
                    ["app-patient-home"]
                ],
                decls: 4,
                vars: 0,
                consts: [
                    [500]
                ],
                template: function(o, s) {
                    o & 1 && (l(0, k, 1, 0)(1, B, 1, 0), C(2, 0, j, null, 1, null, null, 0, _), g())
                },
                dependencies: [v],
                encapsulation: 2
            })
        }
    }
    return e
})();
var G = () => [import("./chunk-WMNHKNX5.js").then(e => e.ListPractitionerComponent)];

function K(e, a) {
    e & 1 && t(0, "app-list-practitioner")
}

function U(e, a) {
    e & 1 && t(0, "app-placeholder")
}
var L = (() => {
    class e {
        static {
            this.\u0275fac = function(o) {
                return new(o || e)
            }
        }
        static {
            this.\u0275cmp = f({
                type: e,
                selectors: [
                    ["app-practitioner-home"]
                ],
                decls: 4,
                vars: 0,
                consts: [
                    [500]
                ],
                template: function(o, s) {
                    o & 1 && (l(0, K, 1, 0)(1, U, 1, 0), C(2, 0, G, null, 1, null, null, 0, _), g())
                },
                dependencies: [v],
                encapsulation: 2
            })
        }
    }
    return e
})();

function R(e, a) {
    e & 1 && t(0, "app-detail-encounter")
}

function q(e, a) {
    e & 1 && t(0, "i", 14)
}

function z(e, a) {
    e & 1 && t(0, "i", 15)
}

function J(e, a) {
    e & 1 && t(0, "i", 14)
}

function Q(e, a) {
    e & 1 && t(0, "i", 15)
}

function V(e, a) {
    e & 1 && t(0, "i", 14)
}

function W(e, a) {
    e & 1 && t(0, "i", 15)
}

function X(e, a) {
    e & 1 && t(0, "i", 14)
}

function Y(e, a) {
    e & 1 && t(0, "i", 15)
}

function Z(e, a) {
    if (e & 1 && (i(0, "div", 20, 3)(2, "div", 10)(3, "p", 11), t(4, "i", 12), p(5, " Encounter - Masuk Kunjungan IGD "), n(), i(6, "p", 13), l(7, X, 1, 0, "i", 14)(8, Y, 1, 0, "i", 15), n()(), i(9, "div", 16)(10, "div", 17), t(11, "app-create-encounter"), n()()()), e & 2) {
        let c = h(2);
        r(7), d(c.satusehatService.dataEncounter() ? 7 : 8)
    }
}

function $(e, a) {
    if (e & 1 && (i(0, "div", 7), p(1, "Masuk Kunjungan IGD"), n(), i(2, "div", 8)(3, "div", 9, 0)(5, "div", 10)(6, "p", 11), t(7, "i", 12), p(8, " Location "), n(), i(9, "p", 13), l(10, q, 1, 0, "i", 14)(11, z, 1, 0, "i", 15), n()(), i(12, "div", 16)(13, "div", 17), t(14, "app-location-home"), n()()(), i(15, "div", 18, 1)(17, "div", 10)(18, "p", 11), t(19, "i", 12), p(20, " Patient"), n(), i(21, "p", 13), l(22, J, 1, 0, "i", 14)(23, Q, 1, 0, "i", 15), n()(), i(24, "div", 16)(25, "div", 17), t(26, "app-patient-home"), n()()(), i(27, "div", 19, 2)(29, "div", 10)(30, "p", 11), t(31, "i", 12), p(32, " Practitioner "), n(), i(33, "p", 13), l(34, V, 1, 0, "i", 14)(35, W, 1, 0, "i", 15), n()(), i(36, "div", 16)(37, "div", 17), t(38, "app-practitioner-home"), n()()(), l(39, Z, 12, 1, "div", 20), n()), e & 2) {
        let c, o, s, m, u = h();
        r(2), x("closeOthers", !0), r(8), d((c = u.satusehatService.dataLocation()) != null && c.nama ? 10 : 11), r(12), d((o = u.satusehatService.dataIhsPatient()) != null && o.name ? 22 : 23), r(12), d((s = u.satusehatService.dataIhsPractitioner()) != null && s.name ? 34 : 35), r(5), d((m = u.satusehatService.dataIhsPatient()) != null && m.name && ((m = u.satusehatService.dataIhsPractitioner()) != null && m.name) && ((m = u.satusehatService.dataLocation()) != null && m.nama) ? 39 : -1)
    }
}
var _e = (() => {
    class e {
        constructor() {
            this.satusehatService = P(H)
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || e)
            }
        }
        static {
            this.\u0275cmp = f({
                type: e,
                selectors: [
                    ["app-pelayanan-igd"]
                ],
                decls: 6,
                vars: 1,
                consts: [
                    ["location", "ngbAccordionItem"],
                    ["patient", "ngbAccordionItem"],
                    ["practiotioner", "ngbAccordionItem"],
                    ["encounter", "ngbAccordionItem"],
                    [1, "card"],
                    [1, "card-header", "text-bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [1, "h4", "fw-bold", "mt-2"],
                    ["ngbAccordion", "", 3, "closeOthers"],
                    ["ngbAccordionItem", "location"],
                    ["ngbAccordionHeader", "", "ngbAccordionToggle", "", 1, "accordion-button", "custom-header", "justify-content-between"],
                    [1, "m-0", "fw-bold"],
                    [1, "bi", "bi-chevron-right"],
                    [1, "m-0"],
                    [1, "bi", "bi-check-circle-fill", "text-success"],
                    [1, "bi", "bi-x-circle-fill", "text-danger"],
                    ["ngbAccordionCollapse", ""],
                    ["ngbAccordionBody", ""],
                    ["ngbAccordionItem", "patient"],
                    ["ngbAccordionItem", "practiotioner"],
                    ["ngbAccordionItem", "encounter"]
                ],
                template: function(o, s) {
                    if (o & 1 && (i(0, "div", 4)(1, "div", 5), p(2, "SATUSEHAT- ENCOUNTER"), n(), i(3, "div", 6), l(4, R, 1, 0, "app-detail-encounter")(5, $, 40, 5), n()()), o & 2) {
                        let m;
                        r(4), d((m = s.satusehatService.selectedPatient()) != null && m.encounterId ? 4 : 5)
                    }
                },
                dependencies: [b, D, A, T, E, y, I, S, F, L, M, N, w],
                styles: [".custom-header[_ngcontent-%COMP%]{cursor:pointer}.custom-header[_ngcontent-%COMP%]:after{content:none}"]
            })
        }
    }
    return e
})();
export {
    _e as PelayananIgdComponent
};