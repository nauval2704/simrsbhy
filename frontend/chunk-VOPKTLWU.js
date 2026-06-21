import {
    a as f
} from "./chunk-UI7HE65P.js";
import {
    b as I
} from "./chunk-KT4J7VG7.js";
import {
    k as C
} from "./chunk-QJBCP6KK.js";
import {
    Da as c,
    Db as h,
    Ea as m,
    Ec as i,
    Fc as r,
    Kb as u,
    cc as p,
    gc as t,
    hc as e,
    ic as S,
    mc as v,
    qb as a,
    ra as d,
    sc as x,
    tc as E
} from "./chunk-UYVTZL26.js";

function g(o, b) {
    if (o & 1) {
        let l = v();
        t(0, "button", 4), x("click", function() {
            c(l);
            let n = E();
            return m(n.onCreate())
        }), i(1, ` Create
`), e()
    }
}

function _(o, b) {
    o & 1 && S(0, "app-loading")
}
var w = (() => {
    class o {
        constructor() {
            this.satusehatService = d(I), this.toastr = d(C), this.isLoading = !1, this.classCode = this.satusehatService.getClassCode(this.satusehatService.routerInfo().pelayanan), this.className = this.satusehatService.getClassName(this.satusehatService.routerInfo().pelayanan), this.statusEncounter = "arrived"
        }
        onCreate() {
            this.isLoading = !0;
            let l = {
                noCheckin: this.satusehatService.selectedPatient().noCheckin,
                class: {
                    code: this.classCode,
                    name: this.className
                },
                patient: {
                    ihsNumber: this.satusehatService.dataIhsPatient().id,
                    name: this.satusehatService.dataIhsPatient().name[0].text
                },
                practitioner: {
                    ihsNumber: this.satusehatService.dataIhsPractitioner().id,
                    name: this.satusehatService.dataIhsPractitioner().name[0].text
                },
                tglCheckin: this.satusehatService.selectedPatient().tglInput,
                location: {
                    id: this.satusehatService.dataLocation().id,
                    nama: this.satusehatService.dataLocation().description
                },
                status: this.statusEncounter
            };
            this.satusehatService.createEncounter(l).subscribe({
                next: s => {
                    this.satusehatService.handleSuccessResponse(s, "Encounter")
                },
                error: s => {
                    this.satusehatService.handleErrorResponse(s)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(s) {
                return new(s || o)
            }
        }
        static {
            this.\u0275cmp = h({
                type: o,
                selectors: [
                    ["app-create-encounter"]
                ],
                decls: 61,
                vars: 9,
                consts: [
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "align-middle"],
                    ["scope", "row"],
                    ["type", "button", 1, "btn", "btn-primary"],
                    ["type", "button", 1, "btn", "btn-primary", 3, "click"]
                ],
                template: function(s, n) {
                    s & 1 && (t(0, "div", 0)(1, "table", 1)(2, "tbody")(3, "tr")(4, "th", 2), i(5, "Identifier"), e(), t(6, "td"), i(7, ":"), e(), t(8, "td"), i(9), e()(), t(10, "tr")(11, "th", 2), i(12, "Class Code"), e(), t(13, "td"), i(14, ":"), e(), t(15, "td"), i(16), e()(), t(17, "tr")(18, "th", 2), i(19, "Class"), e(), t(20, "td"), i(21, ":"), e(), t(22, "td"), i(23), e()(), t(24, "tr")(25, "th", 2), i(26, "Patient"), e(), t(27, "td"), i(28, ":"), e(), t(29, "td"), i(30), e()(), t(31, "tr")(32, "th", 2), i(33, "Practitioner"), e(), t(34, "td"), i(35, ":"), e(), t(36, "td"), i(37), e()(), t(38, "tr")(39, "th", 2), i(40, "Tanggal Masuk"), e(), t(41, "td"), i(42, ":"), e(), t(43, "td"), i(44), e()(), t(45, "tr")(46, "th", 2), i(47, "Location"), e(), t(48, "td"), i(49, ":"), e(), t(50, "td"), i(51), e()(), t(52, "tr")(53, "th", 2), i(54, "Status"), e(), t(55, "td"), i(56, ":"), e(), t(57, "td"), i(58), e()()()()(), u(59, g, 2, 0, "button", 3)(60, _, 1, 0, "app-loading")), s & 2 && (a(9), r(n.satusehatService.selectedPatient().noCheckin), a(7), r(n.classCode), a(7), r(n.className), a(7), r(n.satusehatService.dataIhsPatient().name[0].text), a(7), r(n.satusehatService.dataIhsPractitioner().name[0].text), a(7), r(n.satusehatService.selectedPatient().tglInput), a(7), r(n.satusehatService.dataLocation().description), a(7), r(n.statusEncounter), a(), p(n.isLoading ? 60 : 59))
                },
                dependencies: [f],
                encapsulation: 2
            })
        }
    }
    return o
})();
export {
    w as a
};