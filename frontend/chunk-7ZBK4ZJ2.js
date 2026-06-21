import {
    a as h
} from "./chunk-63L3A7ES.js";
import {
    a as y
} from "./chunk-YLD4B4D4.js";
import {
    a as S
} from "./chunk-VOPKTLWU.js";
import {
    a as v,
    c as _
} from "./chunk-KIIXQFYM.js";
import "./chunk-FUXXJWDL.js";
import "./chunk-QGNVLNC6.js";
import "./chunk-IVTVBFQS.js";
import "./chunk-UI7HE65P.js";
import "./chunk-HSMKNQVK.js";
import "./chunk-NKLTBXW5.js";
import {
    b as P
} from "./chunk-KT4J7VG7.js";
import "./chunk-QJBCP6KK.js";
import "./chunk-W7XVFZVJ.js";
import {
    s as C
} from "./chunk-CFNDTNZN.js";
import {
    Db as d,
    Ec as f,
    Kb as a,
    cc as p,
    gc as l,
    hc as r,
    ic as o,
    qb as i,
    ra as s,
    tc as u
} from "./chunk-UYVTZL26.js";

function E(t, c) {
    t & 1 && o(0, "app-detail-encounter")
}

function T(t, c) {
    t & 1 && o(0, "app-create-encounter")
}

function D(t, c) {
    if (t & 1 && (l(0, "div", 1)(1, "span", 2), f(2, "CREATE ENCOUNTER"), r()(), o(3, "app-list-location")(4, "app-detail-patient")(5, "app-list-practitioner"), a(6, T, 1, 0, "app-create-encounter")), t & 2) {
        let e = u();
        i(6), p(e.satusehatService.dataLocation() && e.satusehatService.dataIhsPatient() && e.satusehatService.dataIhsPractitioner() ? 6 : -1)
    }
}
var F = (() => {
    class t {
        constructor() {
            this.satusehatService = s(P)
        }
        static {
            this.\u0275fac = function(n) {
                return new(n || t)
            }
        }
        static {
            this.\u0275cmp = d({
                type: t,
                selectors: [
                    ["app-pelayanan-poli"]
                ],
                decls: 3,
                vars: 1,
                consts: [
                    [1, "bg-white", "rounded", "p-2"],
                    [1, "mb-3"],
                    [1, "h2", "fw-bold"]
                ],
                template: function(n, x) {
                    if (n & 1 && (l(0, "div", 0), a(1, E, 1, 0, "app-detail-encounter")(2, D, 7, 1), r()), n & 2) {
                        let m;
                        i(), p((m = x.satusehatService.selectedPatient()) != null && m.encounterId ? 1 : 2)
                    }
                },
                dependencies: [_, v, h, y, S, C],
                encapsulation: 2
            })
        }
    }
    return t
})();
export {
    F as PelayananPoliComponent
};