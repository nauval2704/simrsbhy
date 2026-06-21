import {
    a as v
} from "./chunk-UI7HE65P.js";
import {
    b as x
} from "./chunk-KT4J7VG7.js";
import {
    k as _
} from "./chunk-QJBCP6KK.js";
import {
    Db as h,
    Ec as o,
    Fc as u,
    Kb as c,
    cc as m,
    gc as n,
    hc as a,
    ic as f,
    qb as s,
    ra as d,
    tc as p
} from "./chunk-UYVTZL26.js";

function S(t, r) {
    if (t & 1 && (n(0, "tr")(1, "td"), o(2), a(), n(3, "td"), o(4), a()()), t & 2) {
        let e, i, l = p(2);
        s(2), u((e = l.satusehatService.dataIhsPatient()) == null ? null : e.name[0].text), s(2), u((i = l.satusehatService.dataIhsPatient()) == null ? null : i.id)
    }
}

function P(t, r) {
    t & 1 && (n(0, "tr")(1, "td", 5), o(2, " Data FHIR tidak ditemukan!. Pasien belum terdaftar di FHIR. "), a()())
}

function C(t, r) {
    if (t & 1 && (n(0, "div", 1)(1, "table", 2)(2, "thead", 3)(3, "tr")(4, "th", 4), o(5, "Nama"), a(), n(6, "th", 4), o(7, "No. IHS"), a()()(), n(8, "tbody"), c(9, S, 5, 2, "tr")(10, P, 3, 0, "tr"), a()()()), t & 2) {
        let e, i = p();
        s(9), m((e = i.satusehatService.dataIhsPatient()) != null && e.name ? 9 : 10)
    }
}

function I(t, r) {
    t & 1 && f(0, "app-loading")
}
var H = (() => {
    class t {
        constructor() {
            this.satusehatService = d(x), this.toastr = d(_), this.isLoading = !0, this.getIhsPatient = this.satusehatService.dataIhsPatient()?.name ? this.isLoading = !1 : this.satusehatService.getIhsPatient({
                nik: this.satusehatService.selectedPatient()?.nik
            }).subscribe({
                next: e => {
                    if (this.toastr.success("Patient IHS Number: " + e.data.entry[0]?.resource.id, "Success"), this.satusehatService.dataIhsPatient.set(e.data.entry[0]?.resource), !this.satusehatService.dataIhsPatient()) {
                        this.toastr.error("Data FHIR tidak ditemukan!. Pasien belum terdaftar di FHIR.");
                        return
                    }
                },
                error: () => {},
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        ngOnInit() {}
        static {
            this.\u0275fac = function(i) {
                return new(i || t)
            }
        }
        static {
            this.\u0275cmp = h({
                type: t,
                selectors: [
                    ["app-detail-patient"]
                ],
                decls: 4,
                vars: 1,
                consts: [
                    [1, "h4"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-sm", "mb-3"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    ["colspan", "2", 1, "table-danger", "text-center"]
                ],
                template: function(i, l) {
                    i & 1 && (n(0, "span", 0), o(1, "Patient"), a(), c(2, C, 11, 1, "div", 1)(3, I, 1, 0, "app-loading")), i & 2 && (s(2), m(l.isLoading ? 3 : 2))
                },
                dependencies: [v],
                encapsulation: 2
            })
        }
    }
    return t
})();
export {
    H as a
};