import {
    a as E
} from "./chunk-IVTVBFQS.js";
import {
    a as V
} from "./chunk-UI7HE65P.js";
import {
    b as v
} from "./chunk-KT4J7VG7.js";
import {
    k as w
} from "./chunk-QJBCP6KK.js";
import {
    s as D
} from "./chunk-CFNDTNZN.js";
import {
    Da as h,
    Db as C,
    Ea as _,
    Ec as a,
    Fc as p,
    Gc as T,
    Kb as f,
    N as g,
    R as I,
    cc as m,
    dc as k,
    ec as y,
    fc as L,
    gc as n,
    hc as r,
    ic as P,
    mc as x,
    qb as c,
    ra as u,
    sc as S,
    tc as d
} from "./chunk-UYVTZL26.js";

function H(t, l) {
    if (t & 1) {
        let e = x();
        n(0, "div", 1)(1, "table", 2)(2, "thead", 3)(3, "tr")(4, "th", 4), a(5, "Nama"), r(), n(6, "th", 4), a(7, "No. IHS"), r()()(), n(8, "tbody")(9, "tr")(10, "td"), a(11), r(), n(12, "td"), a(13), r()()()()(), n(14, "div", 5)(15, "button", 6), S("click", function() {
            h(e);
            let o = d();
            return _(o.satusehatService.dataIhsPractitioner.set(null))
        }), a(16, " Reset "), r()()
    }
    if (t & 2) {
        let e = d();
        c(11), p(e.satusehatService.dataIhsPractitioner().name[0].text), c(2), p(e.satusehatService.dataIhsPractitioner().id)
    }
}

function M(t, l) {
    t & 1 && (n(0, "div", 0), a(1, ` Data FHIR tidak ditemukan!. Pasien belum terdaftar di FHIR.
`), r())
}
var F = (() => {
    class t {
        constructor() {
            this.satusehatService = u(v)
        }
        static {
            this.\u0275fac = function(i) {
                return new(i || t)
            }
        }
        static {
            this.\u0275cmp = C({
                type: t,
                selectors: [
                    ["app-detail-practitioner"]
                ],
                decls: 2,
                vars: 1,
                consts: [
                    ["role", "alert", 1, "alert", "alert-danger"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-sm", "mb-2"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "d-flex", "justify-content-end", "align-items-center"],
                    ["type", "button", 1, "btn", "btn-danger", 3, "click"]
                ],
                template: function(i, o) {
                    if (i & 1 && f(0, H, 17, 2)(1, M, 2, 0, "div", 0), i & 2) {
                        let s;
                        m((s = o.satusehatService.dataIhsPractitioner()) != null && s.name ? 0 : 1)
                    }
                },
                encapsulation: 2
            })
        }
    }
    return t
})();

function R(t, l) {
    if (t & 1) {
        let e = x();
        n(0, "div", 1)(1, "div", 3)(2, "input", 4), S("keyup", function(o) {
            h(e);
            let s = d();
            return _(s.onSearchTextChange(o.target.value))
        }), r()()()
    }
}

function $(t, l) {
    if (t & 1) {
        let e = x();
        n(0, "tr")(1, "td"), a(2), r(), n(3, "td"), a(4), r(), n(5, "td"), a(6), r(), n(7, "td")(8, "button", 9), S("click", function() {
            let o = h(e).$implicit,
                s = d(2);
            return _(s.selectPractitioner(o))
        }), a(9, " Pilih "), r()()()
    }
    if (t & 2) {
        let e = l.$implicit,
            i = l.$index;
        c(2), T("", i + 1, "."), c(2), p(e.nik), c(2), p(e.nama)
    }
}

function j(t, l) {
    t & 1 && (n(0, "tr", 8)(1, "td", 10), a(2, "Data tidak ditemukan."), r()())
}

function A(t, l) {
    if (t & 1 && (n(0, "div", 2)(1, "table", 5)(2, "thead", 6)(3, "tr")(4, "th", 7), a(5, "NO."), r(), n(6, "th", 7), a(7, "NIK"), r(), n(8, "th", 7), a(9, "NAMA"), r(), n(10, "th", 7), a(11, "ACTION"), r()()(), n(12, "tbody"), y(13, $, 10, 3, "tr", null, k), f(15, j, 3, 0, "tr", 8), r()()()), t & 2) {
        let e = d();
        c(13), L(e.listPractitioner), c(2), m(e.listPractitioner.length === 0 ? 15 : -1)
    }
}

function B(t, l) {
    t & 1 && P(0, "app-loading")
}

function O(t, l) {
    t & 1 && P(0, "app-detail-practitioner")
}
var it = (() => {
    class t {
        constructor() {
            this.satuSehatService = u(v), this.toastr = u(w), this.listPractitioner = [], this.isLoading = !1, this.getListPractitioner = this.satuSehatService.dataIhsPractitioner()?.name ?? this.satuSehatService.getListPractitioner().pipe(E()).subscribe({
                next: e => {
                    this.listPractitioner = e.data
                },
                error: () => {}
            })
        }
        onSearchTextChange(e) {
            if (this.isLoading = !0, e.length > 3) {
                this.satuSehatService.getIhsPractitionerByTerm(e).pipe(g(300), I()).subscribe({
                    next: i => {
                        this.listPractitioner = i.data
                    },
                    error: i => {},
                    complete: () => {
                        this.isLoading = !1
                    }
                });
                return
            }
            this.listPractitioner = [], this.isLoading = !1
        }
        selectPractitioner(e) {
            this.isLoading = !0, this.satuSehatService.getIhsPractitioner({
                nik: e.nik
            }).subscribe({
                next: i => {
                    if (this.toastr.success("Practitioner IHS Number: " + i.data.entry[0]?.resource.id, "Success"), this.satuSehatService.dataIhsPractitioner.set(i.data.entry[0]?.resource), !this.satuSehatService.dataIhsPractitioner()) {
                        this.toastr.error("Data FHIR tidak ditemukan!. Practitioner belum terdaftar di FHIR.");
                        return
                    }
                },
                error: i => this.toastr.error(i),
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(i) {
                return new(i || t)
            }
        }
        static {
            this.\u0275cmp = C({
                type: t,
                selectors: [
                    ["app-list-practitioner"]
                ],
                decls: 6,
                vars: 2,
                consts: [
                    [1, "h4"],
                    [1, "row", "mb-2"],
                    [1, "table-responsive", "rounded"],
                    [1, "col-lg-6"],
                    ["type", "text", "id", "searchPractitioner", "aria-describedby", "searchDPractitioner", "placeholder", "search Practitioner", 1, "form-control", 3, "keyup"],
                    [1, "table", "table-sm", "align-middle"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "table-danger"],
                    ["type", "button ", 1, "btn", "btn-primary", "btn-sm", 3, "click"],
                    ["colspan", "4", 1, "text-center"]
                ],
                template: function(i, o) {
                    if (i & 1 && (n(0, "span", 0), a(1, "Practitioner"), r(), f(2, R, 3, 0, "div", 1)(3, A, 16, 1, "div", 2)(4, B, 1, 0, "app-loading")(5, O, 1, 0, "app-detail-practitioner")), i & 2) {
                        let s, b;
                        c(2), m((s = o.satuSehatService.dataIhsPractitioner()) != null && s.name ? -1 : 2), c(), m(!((b = o.satuSehatService.dataIhsPractitioner()) != null && b.name) && !o.isLoading ? 3 : o.isLoading ? 4 : 5)
                    }
                },
                dependencies: [D, F, V],
                encapsulation: 2
            })
        }
    }
    return t
})();
export {
    it as a
};