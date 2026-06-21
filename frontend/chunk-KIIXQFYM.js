import {
    a as X
} from "./chunk-FUXXJWDL.js";
import {
    d as W,
    e as B,
    f as $,
    g as G,
    h as K,
    i as Z,
    j as q
} from "./chunk-QGNVLNC6.js";
import {
    a as at
} from "./chunk-IVTVBFQS.js";
import {
    a as L
} from "./chunk-UI7HE65P.js";
import {
    b as rt
} from "./chunk-HSMKNQVK.js";
import {
    b as V,
    e as Y,
    k as j,
    x as I
} from "./chunk-NKLTBXW5.js";
import {
    a as ot,
    b as f
} from "./chunk-KT4J7VG7.js";
import {
    k as M
} from "./chunk-QJBCP6KK.js";
import {
    s as R
} from "./chunk-CFNDTNZN.js";
import {
    Da as x,
    Db as g,
    Ea as E,
    Ec as n,
    Fc as S,
    Gc as C,
    Kb as h,
    Kc as w,
    Lc as P,
    Mc as A,
    N as it,
    R as nt,
    Zb as O,
    cc as p,
    dc as H,
    ec as F,
    fc as U,
    g as Q,
    gc as e,
    hc as t,
    ic as d,
    mc as b,
    qb as r,
    ra as _,
    sc as v,
    tc as u
} from "./chunk-UYVTZL26.js";

function Ct(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "div", 1)(1, "table", 2)(2, "thead", 3)(3, "tr")(4, "th", 4), n(5, "ID."), t(), e(6, "th", 4), n(7, "Location"), t()()(), e(8, "tbody")(9, "tr")(10, "td"), n(11), t(), e(12, "td"), n(13), t()()()()(), e(14, "div", 5)(15, "button", 6), v("click", function() {
            x(a);
            let l = u();
            return E(l.satuSehatService.dataLocation.set(null))
        }), n(16, " Reset "), t()()
    }
    if (i & 2) {
        let a, o, l = u();
        r(11), S((a = l.satuSehatService.dataLocation()) == null ? null : a.id), r(2), S((o = l.satuSehatService.dataLocation()) == null ? null : o.nama)
    }
}

function ft(i, s) {
    i & 1 && (e(0, "div", 0), n(1, ` Location tidak ditemukan!. Location belum terdaftar di FHIR.
`), t())
}
var lt = (() => {
    class i {
        constructor() {
            this.satuSehatService = _(f)
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-detail-location"]
                ],
                decls: 2,
                vars: 1,
                consts: [
                    ["role", "alert", 1, "alert", "alert-danger"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-sm", "mb-2"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    [1, "mb-2", "d-flex", "justify-content-end", "align-items-center"],
                    ["type", "button", 1, "btn", "btn-danger", 3, "click"]
                ],
                template: function(o, l) {
                    if (o & 1 && h(0, Ct, 17, 2)(1, ft, 2, 0, "div", 0), o & 2) {
                        let c;
                        p((c = l.satuSehatService.dataLocation()) != null && c.nama ? 0 : 1)
                    }
                },
                encapsulation: 2
            })
        }
    }
    return i
})();

function vt(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "tr")(1, "td"), n(2), t(), e(3, "td"), n(4), t(), e(5, "td"), n(6), t(), e(7, "td")(8, "button", 5), v("click", function() {
            let l = x(a).$implicit,
                c = u(2);
            return E(c.satuSehatService.dataLocation.set(l))
        }), n(9, " Pilih "), t()()()
    }
    if (i & 2) {
        let a = s.$implicit,
            o = s.$index;
        r(2), C("", o + 1, "."), r(2), S(a.id), r(2), S(a.nama)
    }
}

function xt(i, s) {
    if (i & 1 && (e(0, "div", 1)(1, "table", 2)(2, "thead", 3)(3, "tr")(4, "th", 4), n(5, "No."), t(), e(6, "th", 4), n(7, "ID."), t(), e(8, "th", 4), n(9, "Location"), t(), e(10, "th", 4), n(11, "Action"), t()()(), e(12, "tbody"), F(13, vt, 10, 3, "tr", null, H), t()()()), i & 2) {
        let a = u();
        r(13), U(a.listLocation)
    }
}

function Et(i, s) {
    i & 1 && d(0, "app-detail-location")
}
var st = (() => {
    class i {
        constructor() {
            this.satuSehatService = _(f), this.listLocation = rt.filter(a => a.info === this.satuSehatService.routerInfo().pelayanan)
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-list-location"]
                ],
                decls: 4,
                vars: 1,
                consts: [
                    [1, "h4"],
                    [1, "table-responsive", "rounded"],
                    [1, "table", "table-sm", "align-middle"],
                    [1, "table-dark"],
                    ["scope", "col"],
                    ["type", "button ", 1, "btn", "btn-primary", "btn-sm", 3, "click"]
                ],
                template: function(o, l) {
                    if (o & 1 && (e(0, "span", 0), n(1, "Location"), t(), h(2, xt, 15, 0, "div", 1)(3, Et, 1, 0, "app-detail-location")), o & 2) {
                        let c;
                        r(2), p((c = l.satuSehatService.dataLocation()) != null && c.nama ? 3 : 2)
                    }
                },
                dependencies: [lt],
                encapsulation: 2
            })
        }
    }
    return i
})();
var dt = (() => {
    class i {
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-location-home"]
                ],
                decls: 1,
                vars: 0,
                template: function(o, l) {
                    o & 1 && d(0, "app-list-location")
                },
                dependencies: [st],
                encapsulation: 2
            })
        }
    }
    return i
})();
var mt = Q(X());

function bt(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "button", 4), v("click", function() {
            x(a);
            let l = u();
            return E(l.onUpdate())
        }), n(1, ` Update
`), t()
    }
}

function yt(i, s) {
    i & 1 && d(0, "app-loading")
}
var pt = (() => {
    class i {
        constructor() {
            this.satusehatService = _(f), this.toastr = _(M), this.isLoading = !1, this.classCode = this.satusehatService.getClassCode(this.satusehatService.routerInfo().pelayanan), this.className = this.satusehatService.getClassName(this.satusehatService.routerInfo().pelayanan), this.statusEncounter = this.satusehatService.dataLocation().nama === "Ruangan Triase, Instalasi Gawat Darurat" ? "triaged" : "in-progress", this.tanggalMasuk = (0, mt.default)().format("YYYY-MM-DD HH:mm"), this.ihsNumberPatientEncounter = this.satusehatService.dataEncounter().data.subject.reference.split("/"), this.ihsNumberPatient = this.ihsNumberPatientEncounter[1], this.ihsNumberPractitionerEncounter = this.satusehatService.dataEncounter().data.participant[0].individual.reference.split("/"), this.ihsNumberPractitioner = this.ihsNumberPractitionerEncounter[1]
        }
        onUpdate() {
            this.isLoading = !0;
            let a = {
                encounterId: this.satusehatService.dataEncounter().data.id,
                noCheckin: this.satusehatService.selectedPatient().noCheckin,
                class: {
                    code: this.classCode,
                    name: this.className
                },
                patient: {
                    ihsNumber: this.ihsNumberPatient,
                    name: this.satusehatService.dataEncounter().data.subject.display
                },
                practitioner: {
                    ihsNumber: this.ihsNumberPractitioner,
                    name: this.satusehatService.dataEncounter().data.participant[0].individual.display
                },
                period: this.tanggalMasuk,
                tglArrived: this.satusehatService.dataEncounter().data.period.start,
                location: {
                    id: this.satusehatService.dataLocation().id,
                    nama: this.satusehatService.dataLocation().description
                },
                status: this.statusEncounter
            };
            this.satusehatService.updateEncounterTriase(a).subscribe({
                next: o => {
                    this.satusehatService.handleSuccessResponse(o, "Triase")
                },
                error: o => {
                    this.satusehatService.handleErrorResponse(o)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-update-encounter-inprogress"]
                ],
                decls: 6,
                vars: 2,
                consts: [
                    [1, "mb-3"],
                    ["for", "exampleFormControlInput1", 1, "form-label"],
                    ["type", "datetime-local", "id", "exampleFormControlInput1", "placeholder", "name@example.com", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["type", "button", 1, "btn", "btn-primary"],
                    ["type", "button", 1, "btn", "btn-primary", 3, "click"]
                ],
                template: function(o, l) {
                    o & 1 && (e(0, "div", 0)(1, "label", 1), n(2, "Tanggal Masuk"), t(), e(3, "input", 2), A("ngModelChange", function(m) {
                        return P(l.tanggalMasuk, m) || (l.tanggalMasuk = m), m
                    }), t()(), h(4, bt, 2, 0, "button", 3)(5, yt, 1, 0, "app-loading")), o & 2 && (r(3), w("ngModel", l.tanggalMasuk), r(), p(l.isLoading ? 5 : 4))
                },
                dependencies: [I, V, Y, j, L],
                encapsulation: 2
            })
        }
    }
    return i
})();

function Dt(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "tr")(1, "td", 8), n(2), t(), e(3, "td"), n(4), t(), e(5, "td"), n(6), t(), e(7, "td")(8, "button", 9), v("click", function() {
            let l = x(a).$implicit,
                c = u(2);
            return E(c.onPilih(l))
        }), n(9, " Pilih "), t()()()
    }
    if (i & 2) {
        let a = s.$implicit,
            o = s.$index;
        r(2), C("", o + 1, "."), r(2), S(a.kode), r(2), S(a.nama)
    }
}

function Lt(i, s) {
    if (i & 1 && (e(0, "div", 4)(1, "table", 5)(2, "thead", 6)(3, "tr")(4, "th", 7), n(5, "No."), t(), e(6, "th", 7), n(7, "Code"), t(), e(8, "th", 7), n(9, "Nama"), t(), e(10, "th", 7), n(11, "Action"), t()()(), e(12, "tbody"), F(13, Dt, 10, 3, "tr", null, H), t()()()), i & 2) {
        let a = u();
        r(13), U(a.listDiagnosa)
    }
}
var ut = (() => {
    class i {
        constructor() {
            this.satusehatService = _(f), this.dataPasienService = _(ot), this.listDiagnosa = [], this.isLoading = !1
        }
        onSearchTextChange(a) {
            if (this.isLoading = !0, a.length > 3) {
                this.dataPasienService.getDiagnosa(a).pipe(it(628), nt()).subscribe({
                    next: o => {
                        this.listDiagnosa = o.diagnosa
                    },
                    error: o => {},
                    complete: () => {
                        this.isLoading = !1
                    }
                });
                return
            }
            this.listDiagnosa = [], this.isLoading = !1
        }
        onPilih(a) {
            this.satusehatService.dataDiagnosis.set(a), this.isLoading = !1
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-list-diagnosis"]
                ],
                decls: 6,
                vars: 1,
                consts: [
                    [1, "row", "mb-3"],
                    [1, "col-lg-6"],
                    ["for", "searchDiagnosa", 1, "form-label"],
                    ["type", "text", "id", "searchDiagnosa", "aria-describedby", "searchDiagnosa", "placeholder", "search ICD 10", 1, "form-control", 3, "keyup"],
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "table-primary", "align-middle"],
                    [1, "table-light"],
                    ["scope", "col"],
                    ["scope", "row"],
                    ["type", "button", 1, "btn", "btn-sm", "btn-primary", 3, "click"]
                ],
                template: function(o, l) {
                    o & 1 && (e(0, "div", 0)(1, "div", 1)(2, "label", 2), n(3, "Diagnosis"), t(), e(4, "input", 3), v("keyup", function(m) {
                        return l.onSearchTextChange(m.target.value)
                    }), t()()(), h(5, Lt, 15, 0, "div", 4)), o & 2 && (r(5), p((l.listDiagnosa == null ? null : l.listDiagnosa.length) > 0 ? 5 : -1))
                },
                dependencies: [I],
                encapsulation: 2
            })
        }
    }
    return i
})();
var ht = Q(X());

function Tt(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "div", 5)(1, "button", 6), v("click", function() {
            x(a);
            let l = u();
            return E(l.onCreate())
        }), n(2, " Create Condition "), t(), e(3, "button", 7), v("click", function() {
            x(a);
            let l = u();
            return E(l.satuSehatService.dataDiagnosis.set(null))
        }), n(4, " Reset "), t()()
    }
}

function It(i, s) {
    i & 1 && d(0, "app-loading")
}
var _t = (() => {
    class i {
        constructor() {
            this.satuSehatService = _(f), this.isLoading = !1, this.tanggalMasuk = (0, ht.default)().format("YYYY-MM-DD HH:mm"), this.ihsNumberPatientEncounter = this.satuSehatService.dataEncounter().data.subject.reference.split("/"), this.ihsNumberPatient = this.ihsNumberPatientEncounter[1], this.ihsNumberPractitionerEncounter = this.satuSehatService.dataEncounter().data.participant[0].individual.reference.split("/"), this.ihsNumberPractitioner = this.ihsNumberPractitionerEncounter[1]
        }
        onCreate() {
            this.isLoading = !0;
            let a = {
                noCheckin: this.satuSehatService.selectedPatient()?.noCheckin,
                diagnosis: {
                    code: this.satuSehatService.dataDiagnosis().kode,
                    name: this.satuSehatService.dataDiagnosis().nama
                },
                patient: {
                    ihsNumber: this.ihsNumberPatient,
                    name: this.satuSehatService.dataEncounter().data.subject.display
                },
                encounterId: this.satuSehatService.dataEncounter().data.id,
                tglCheckin: this.tanggalMasuk,
                keterangan: this.keterangan
            };
            this.satuSehatService.createDiagnosis(a).subscribe({
                next: o => {
                    this.satuSehatService.handleSuccessResponse(o, "Condition - Diagnosis")
                },
                error: o => {
                    this.satuSehatService.handleErrorResponse(o)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-create-diagnosis"]
                ],
                decls: 33,
                vars: 5,
                consts: [
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "align-middle"],
                    ["scope", "row"],
                    ["type", "datetime-local", "id", "exampleFormControlInput1", "placeholder", "name@example.com", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["type", "text", "id", "keterangan", "aria-describedby", "keterangan", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    [1, "d-flex", "justify-content-between"],
                    ["type", "button", 1, "btn", "btn-primary", 3, "click"],
                    ["type", "button", 1, "btn", "btn-danger", 3, "click"]
                ],
                template: function(o, l) {
                    if (o & 1 && (e(0, "div", 0)(1, "table", 1)(2, "tbody")(3, "tr")(4, "th", 2), n(5, "Code"), t(), e(6, "td"), n(7, ":"), t(), e(8, "td"), n(9), t()(), e(10, "tr")(11, "th", 2), n(12, "Nama"), t(), e(13, "td"), n(14, ":"), t(), e(15, "td"), n(16), t()(), e(17, "tr")(18, "th", 2), n(19, "Tanggal Diagnosis"), t(), e(20, "td"), n(21, ":"), t(), e(22, "td")(23, "input", 3), A("ngModelChange", function(m) {
                            return P(l.tanggalMasuk, m) || (l.tanggalMasuk = m), m
                        }), t()()(), e(24, "tr")(25, "th", 2), n(26, "Keluhan"), t(), e(27, "td"), n(28, ":"), t(), e(29, "td")(30, "input", 4), A("ngModelChange", function(m) {
                            return P(l.keterangan, m) || (l.keterangan = m), m
                        }), t()()()()()(), h(31, Tt, 5, 0, "div", 5)(32, It, 1, 0, "app-loading")), o & 2) {
                        let c, m;
                        r(9), S((c = l.satuSehatService.dataDiagnosis()) == null ? null : c.kode), r(7), S((m = l.satuSehatService.dataDiagnosis()) == null ? null : m.nama), r(7), w("ngModel", l.tanggalMasuk), r(7), w("ngModel", l.keterangan), r(), p(l.isLoading ? 32 : 31)
                    }
                },
                dependencies: [I, V, Y, j, L],
                encapsulation: 2
            })
        }
    }
    return i
})();

function kt(i, s) {
    if (i & 1 && (e(0, "div", 2), n(1, "CONDITION"), t(), e(2, "div", 3)(3, "table", 4)(4, "tbody")(5, "tr")(6, "th", 5), n(7, "Condition ID"), t(), e(8, "td"), n(9, ":"), t(), e(10, "td"), n(11), t()(), e(12, "tr")(13, "th", 5), n(14, "Ref. Encounter ID"), t(), e(15, "td"), n(16, ":"), t(), e(17, "td"), n(18), t()(), e(19, "tr")(20, "th", 5), n(21, "Category"), t(), e(22, "td"), n(23, ":"), t(), e(24, "td"), n(25), t()(), e(26, "tr")(27, "th", 5), n(28, "Diagnosis Code"), t(), e(29, "td"), n(30, ":"), t(), e(31, "td"), n(32), t()(), e(33, "tr")(34, "th", 5), n(35, "Diagnosis Display"), t(), e(36, "td"), n(37, ":"), t(), e(38, "td"), n(39), t()(), e(40, "tr")(41, "th", 5), n(42, "Onset Date Time"), t(), e(43, "td"), n(44, ":"), t(), e(45, "td"), n(46), t()(), e(47, "tr")(48, "th", 5), n(49, "Recorded Time"), t(), e(50, "td"), n(51, ":"), t(), e(52, "td"), n(53), t()()()()()), i & 2) {
        let a, o, l, c, m, N, T, D = u(2);
        r(11), C(" ", (a = D.satuSehatService.dataCondition()) == null ? null : a.data.id, " "), r(7), C(" ", (o = D.satuSehatService.dataEncounter().data) == null ? null : o.id, " "), r(7), C(" ", (l = D.satuSehatService.dataCondition()) == null ? null : l.data.category[0].coding[0].display, " "), r(7), C(" ", (c = D.satuSehatService.dataCondition()) == null ? null : c.data.code.coding[0].code, " "), r(7), C(" ", (m = D.satuSehatService.dataCondition()) == null ? null : m.data.code.coding[0].display, " "), r(7), C(" ", (N = D.satuSehatService.dataCondition()) == null ? null : N.data.onsetDateTime, " "), r(7), C(" ", (T = D.satuSehatService.dataCondition()) == null ? null : T.data.recordedDate, " ")
    }
}

function Nt(i, s) {
    i & 1 && d(0, "i", 13)
}

function wt(i, s) {
    i & 1 && d(0, "i", 14)
}

function Pt(i, s) {
    if (i & 1 && (e(0, "div", 7, 0)(2, "div", 9)(3, "p", 10), d(4, "i", 11), n(5, " Diagnosis"), t(), e(6, "p", 12), h(7, Nt, 1, 0, "i", 13)(8, wt, 1, 0, "i", 14), t()(), e(9, "div", 15)(10, "div", 16), d(11, "app-list-diagnosis"), t()()()), i & 2) {
        let a, o = u(3);
        r(7), p((a = o.satuSehatService.dataDiagnosis()) != null && a.nama ? 7 : 8)
    }
}

function At(i, s) {
    i & 1 && (e(0, "div", 8, 1)(2, "div", 9)(3, "p", 10), d(4, "i", 11), n(5, " Condition - Diagnosis Awal/Masuk "), t(), e(6, "p", 12), d(7, "i", 14), t()(), e(8, "div", 15)(9, "div", 16), d(10, "app-create-diagnosis"), t()()())
}

function Ht(i, s) {
    if (i & 1 && (e(0, "div", 2), n(1, "CONDITION"), t(), e(2, "div", 6), h(3, Pt, 12, 1, "div", 7)(4, At, 11, 0, "div", 8), t()), i & 2) {
        let a = u(2);
        r(2), O("closeOthers", !0), r(), p(a.satuSehatService.dataDiagnosis() ? -1 : 3), r(), p(a.satuSehatService.dataDiagnosis() ? 4 : -1)
    }
}

function Ft(i, s) {
    if (i & 1 && h(0, kt, 54, 7)(1, Ht, 5, 3), i & 2) {
        let a = u();
        p(a.satuSehatService.dataCondition() ? 0 : 1)
    }
}

function Ut(i, s) {
    i & 1 && d(0, "app-loading")
}
var St = (() => {
    class i {
        constructor() {
            this.satuSehatService = _(f), this.toastr = _(M), this.isLoading = !0, this.getCondition = this.satuSehatService.getCondition({
                conditionId: this.satuSehatService.selectedPatient()?.conditionId
            }).pipe(at()).subscribe({
                next: a => {
                    if (a.data.issue) {
                        this.satuSehatService.handleErrorResponseDetails(a);
                        return
                    }
                    this.satuSehatService.dataCondition.set(a), this.satuSehatService.handleSuccessResponse(a, "Data Condition")
                },
                error: a => {
                    this.satuSehatService.dataCondition.set(null), this.satuSehatService.handleErrorResponse(a)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-condition-home"]
                ],
                decls: 2,
                vars: 1,
                consts: [
                    ["diagnosis", "ngbAccordionItem"],
                    ["createDiagnosis", "ngbAccordionItem"],
                    [1, "h4", "fw-bold", "mt-2"],
                    [1, "table-responsive"],
                    [1, "table", "table-striped", "table-sm", "align-middle"],
                    ["scope", "row"],
                    ["ngbAccordion", "", 3, "closeOthers"],
                    ["ngbAccordionItem", "diagnosis"],
                    ["ngbAccordionItem", "createDiagnosis"],
                    ["ngbAccordionHeader", "", "ngbAccordionToggle", "", 1, "accordion-button", "custom-header", "justify-content-between"],
                    [1, "m-0", "fw-bold"],
                    [1, "bi", "bi-chevron-right"],
                    [1, "m-0"],
                    [1, "bi", "bi-check-circle-fill", "text-success"],
                    [1, "bi", "bi-x-circle-fill", "text-danger"],
                    ["ngbAccordionCollapse", ""],
                    ["ngbAccordionBody", ""]
                ],
                template: function(o, l) {
                    o & 1 && h(0, Ft, 2, 1)(1, Ut, 1, 0, "app-loading"), o & 2 && p(l.isLoading ? 1 : 0)
                },
                dependencies: [ut, q, Z, K, G, $, W, B, _t, R, L],
                styles: [".custom-header[_ngcontent-%COMP%]{cursor:pointer}.custom-header[_ngcontent-%COMP%]:after{content:none}"]
            })
        }
    }
    return i
})();
var tt = Q(X());

function Vt(i, s) {
    if (i & 1) {
        let a = b();
        e(0, "button", 4), v("click", function() {
            x(a);
            let l = u();
            return E(l.onUpdate())
        }), n(1, ` Finished
`), t()
    }
}

function Yt(i, s) {
    i & 1 && d(0, "app-loading")
}
var gt = (() => {
    class i {
        constructor() {
            this.satusehatService = _(f), this.toastr = _(M), this.isLoading = !1, this.classCode = this.satusehatService.getClassCode(this.satusehatService.routerInfo().pelayanan), this.className = this.satusehatService.getClassName(this.satusehatService.routerInfo().pelayanan), this.statusEncounter = "finished", this.tanggalMasuk = (0, tt.default)().format("YYYY-MM-DD HH:mm"), this.ihsNumberPatientEncounter = this.satusehatService.dataEncounter()?.data.subject.reference.split("/"), this.ihsNumberPatient = this.ihsNumberPatientEncounter[1], this.ihsNumberPractitionerEncounter = this.satusehatService.dataEncounter()?.data.participant[0].individual.reference.split("/"), this.ihsNumberPractitioner = this.ihsNumberPractitionerEncounter[1], this.lastLocation = this.satusehatService.dataEncounter()?.data?.location[this.satusehatService.dataEncounter()?.data?.location?.length - 1], this.lastStatusHistoryEncounter = this.satusehatService.dataEncounter()?.data?.statusHistory
        }
        onUpdate() {
            this.isLoading = !0;
            let o = (0, tt.default)(this.tanggalMasuk, "YYYY-MM-DD HH:mm:ss").utc().format("YYYY-MM-DDTHH:mm:ssZ").toString(),
                l = this.lastStatusHistoryEncounter[this.lastStatusHistoryEncounter.length - 1],
                c = l.period.end = o,
                m = this.lastStatusHistoryEncounter.push({
                    period: {
                        start: o,
                        end: o
                    },
                    status: "finished"
                }),
                N = {
                    encounterId: this.satusehatService.dataEncounter()?.data?.id,
                    noCheckin: this.satusehatService.selectedPatient().noCheckin,
                    class: {
                        code: this.classCode,
                        name: this.className
                    },
                    patient: {
                        ihsNumber: this.ihsNumberPatient,
                        name: this.satusehatService.dataEncounter()?.data?.subject.display
                    },
                    practitioner: {
                        ihsNumber: this.ihsNumberPractitioner,
                        name: this.satusehatService.dataEncounter()?.data?.participant[0].individual.display
                    },
                    period: o,
                    tglArrived: this.satusehatService.dataEncounter()?.data?.period?.start,
                    location: {
                        reference: this.lastLocation.location.reference,
                        display: this.lastLocation.location.display,
                        start: this.lastLocation.period.start
                    },
                    diagnosis: {
                        reference: this.satusehatService.dataCondition()?.data?.id,
                        display: this.satusehatService.dataCondition()?.data?.code?.coding[0].display
                    },
                    statusHistory: this.lastStatusHistoryEncounter,
                    status: this.statusEncounter
                };
            this.satusehatService.updateEncounterFinished(N).subscribe({
                next: T => {
                    this.satusehatService.handleSuccessResponse(T, "Finished")
                },
                error: T => {
                    this.satusehatService.handleErrorResponse(T)
                },
                complete: () => {
                    this.isLoading = !1
                }
            })
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-update-encounter-finished"]
                ],
                decls: 6,
                vars: 2,
                consts: [
                    [1, "mb-3"],
                    ["for", "exampleFormControlInput1", 1, "form-label"],
                    ["type", "datetime-local", "id", "exampleFormControlInput1", "placeholder", "name@example.com", 1, "form-control", 3, "ngModelChange", "ngModel"],
                    ["type", "button", 1, "btn", "btn-primary"],
                    ["type", "button", 1, "btn", "btn-primary", 3, "click"]
                ],
                template: function(o, l) {
                    o & 1 && (e(0, "div", 0)(1, "label", 1), n(2, "Tanggal Pulang"), t(), e(3, "input", 2), A("ngModelChange", function(m) {
                        return P(l.tanggalMasuk, m) || (l.tanggalMasuk = m), m
                    }), t()(), h(4, Vt, 2, 0, "button", 3)(5, Yt, 1, 0, "app-loading")), o & 2 && (r(3), w("ngModel", l.tanggalMasuk), r(), p(l.isLoading ? 5 : 4))
                },
                dependencies: [I, V, Y, j, L],
                encapsulation: 2
            })
        }
    }
    return i
})();

function jt(i, s) {
    if (i & 1 && (e(0, "tr")(1, "th", 6), n(2, "Diagnosis"), t(), e(3, "td"), n(4, ":"), t(), e(5, "td"), n(6), t()()), i & 2) {
        let a, o = u(2);
        r(6), C(" ", (a = o.satusehatService.dataEncounter().data) == null ? null : a.diagnosis[0].condition.display, " ")
    }
}

function Ot(i, s) {
    if (i & 1 && (e(0, "tr")(1, "td"), n(2), t(), e(3, "td"), n(4), t(), e(5, "td"), n(6), t(), e(7, "td"), n(8), t()()), i & 2) {
        let a, o = s.$implicit,
            l = s.$index;
        r(2), C("", l + 1, "."), r(2), S(o.period.start), r(2), S((a = o.period.end) !== null && a !== void 0 ? a : "-"), r(2), S(o.status)
    }
}

function Rt(i, s) {
    i & 1 && d(0, "i", 16)
}

function Wt(i, s) {
    i & 1 && d(0, "i", 17)
}

function Bt(i, s) {
    i & 1 && d(0, "i", 16)
}

function $t(i, s) {
    i & 1 && d(0, "i", 17)
}

function Gt(i, s) {
    if (i & 1 && (e(0, "div", 20, 1)(2, "div", 12)(3, "p", 13), d(4, "i", 14), n(5, " Update Encounter In-Progress "), t(), e(6, "p", 15), h(7, Bt, 1, 0, "i", 16)(8, $t, 1, 0, "i", 17), t()(), e(9, "div", 18)(10, "div", 19), d(11, "app-update-encounter-inprogress"), t()()()), i & 2) {
        let a = u(3);
        r(7), p(a.satusehatService.dataLocation() ? 7 : 8)
    }
}

function Kt(i, s) {
    if (i & 1 && (e(0, "div", 3), n(1, "Masuk ke Ruang Pelayanan"), t(), e(2, "div", 10)(3, "div", 11, 0)(5, "div", 12)(6, "p", 13), d(7, "i", 14), n(8, " Location"), t(), e(9, "p", 15), h(10, Rt, 1, 0, "i", 16)(11, Wt, 1, 0, "i", 17), t()(), e(12, "div", 18)(13, "div", 19), d(14, "app-location-home"), t()()(), h(15, Gt, 12, 1, "div", 20), t()), i & 2) {
        let a, o = u(2);
        r(2), O("closeOthers", !0), r(8), p((a = o.satusehatService.dataLocation()) != null && a.nama ? 10 : 11), r(5), p(o.satusehatService.dataLocation() ? 15 : -1)
    }
}

function Zt(i, s) {
    i & 1 && d(0, "app-condition-home")
}

function qt(i, s) {
    if (i & 1 && (e(0, "div", 3), n(1, "ENCOUNTER"), t(), e(2, "div", 4)(3, "table", 5)(4, "tbody")(5, "tr")(6, "th", 6), n(7, "Encounter ID"), t(), e(8, "td"), n(9, ":"), t(), e(10, "td"), n(11), t()()(), e(12, "tbody")(13, "tr")(14, "th", 6), n(15, "Class Code"), t(), e(16, "td"), n(17, ":"), t(), e(18, "td"), n(19), t()()(), e(20, "tbody")(21, "tr")(22, "th", 6), n(23, "Class Name"), t(), e(24, "td"), n(25, ":"), t(), e(26, "td"), n(27), t()(), e(28, "tr")(29, "th", 6), n(30, "Status"), t(), e(31, "td"), n(32, ":"), t(), e(33, "td"), n(34), t()(), e(35, "tr")(36, "th", 6), n(37, "Identifier"), t(), e(38, "td"), n(39, ":"), t(), e(40, "td"), n(41), t()(), e(42, "tr")(43, "th", 6), n(44, "Location"), t(), e(45, "td"), n(46, ":"), t(), e(47, "td"), n(48), t()(), e(49, "tr")(50, "th", 6), n(51, "Patient"), t(), e(52, "td"), n(53, ":"), t(), e(54, "td"), n(55), t()(), e(56, "tr")(57, "th", 6), n(58, "Practitioner"), t(), e(59, "td"), n(60, ":"), t(), e(61, "td"), n(62), t()(), h(63, jt, 7, 1, "tr"), e(64, "tr")(65, "th", 6), n(66, "Status History"), t(), e(67, "td"), n(68, ":"), t(), e(69, "td")(70, "div", 4)(71, "table", 7)(72, "thead", 8)(73, "tr")(74, "th", 9), n(75, "No."), t(), e(76, "th", 9), n(77, "Start"), t(), e(78, "th", 9), n(79, "End"), t(), e(80, "th", 9), n(81, "Status"), t()()(), e(82, "tbody"), F(83, Ot, 9, 4, "tr", null, H), t()()()()()()()(), h(85, Kt, 16, 3)(86, Zt, 1, 0, "app-condition-home")), i & 2) {
        let a, o, l, c, m, N, T, D, z, et, J, y = u();
        r(11), S((a = y.satusehatService.dataEncounter().data) == null ? null : a.id), r(8), S((o = y.satusehatService.dataEncounter().data) == null ? null : o.class.code), r(8), S((l = y.satusehatService.dataEncounter().data) == null ? null : l.class.display), r(7), S((c = y.satusehatService.dataEncounter().data) == null ? null : c.status), r(7), C(" ", (m = y.satusehatService.dataEncounter().data) == null ? null : m.identifier[0].value, " "), r(7), C(" ", (N = y.satusehatService.dataEncounter().data) == null ? null : N.location[0].location.display, " "), r(7), S((T = y.satusehatService.dataEncounter().data) == null ? null : T.subject.display), r(7), C(" ", (D = y.satusehatService.dataEncounter().data) == null ? null : D.participant[0].individual.display, " "), r(), p(((z = y.satusehatService.dataEncounter()) == null || z.data == null ? null : z.data.status) === "finished" ? 63 : -1), r(20), U((et = y.satusehatService.dataEncounter().data) == null ? null : et.statusHistory), r(2), p(((J = y.satusehatService.dataEncounter().data) == null || J.statusHistory == null ? null : J.statusHistory.length) < 2 ? 85 : 86)
    }
}

function zt(i, s) {
    i & 1 && d(0, "app-loading")
}

function Jt(i, s) {
    i & 1 && d(0, "i", 16)
}

function Qt(i, s) {
    i & 1 && d(0, "i", 17)
}

function Xt(i, s) {
    if (i & 1 && (e(0, "div", 3), n(1, "UPDATE PULANG"), t(), e(2, "div", 10)(3, "div", 21, 2)(5, "div", 12)(6, "p", 13), d(7, "i", 14), n(8, " Encounter Finished "), t(), e(9, "p", 15), h(10, Jt, 1, 0, "i", 16)(11, Qt, 1, 0, "i", 17), t()(), e(12, "div", 18)(13, "div", 19), d(14, "app-update-encounter-finished"), t()()()()), i & 2) {
        let a = u();
        r(2), O("closeOthers", !0), r(8), p(a.satusehatService.dataLocation() ? 10 : 11)
    }
}
var li = (() => {
    class i {
        constructor() {
            this.satusehatService = _(f), this.toastr = _(M), this.isLoading = !0
        }
        static {
            this.\u0275fac = function(o) {
                return new(o || i)
            }
        }
        static {
            this.\u0275cmp = g({
                type: i,
                selectors: [
                    ["app-detail-encounter"]
                ],
                decls: 3,
                vars: 2,
                consts: [
                    ["location", "ngbAccordionItem"],
                    ["inprogress", "ngbAccordionItem"],
                    ["finished", "ngbAccordionItem"],
                    [1, "h4", "fw-bold", "mt-2"],
                    [1, "table-responsive"],
                    [1, "table", "table-striped", "table-sm", "align-middle"],
                    ["scope", "row"],
                    [1, "table", "table-primary", "table-sm", "align-middle", "mb-0"],
                    [1, "table-light"],
                    ["scope", "col"],
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
                    ["ngbAccordionItem", "inprogress"],
                    ["ngbAccordionItem", "finished"]
                ],
                template: function(o, l) {
                    if (o & 1 && h(0, qt, 87, 10)(1, zt, 1, 0, "app-loading")(2, Xt, 15, 2), o & 2) {
                        let c;
                        p(l.satusehatService.dataEncounter() ? 0 : 1), r(2), p(((c = l.satusehatService.dataEncounter()) == null || c.data == null || c.data.statusHistory == null ? null : c.data.statusHistory.length) > 1 && ((c = l.satusehatService.dataEncounter()) == null || c.data == null ? null : c.data.status) !== "finished" ? 2 : -1)
                    }
                },
                dependencies: [R, L, q, Z, K, G, $, W, B, dt, pt, St, gt],
                styles: [".custom-header[_ngcontent-%COMP%]{cursor:pointer}.custom-header[_ngcontent-%COMP%]:after{content:none}"]
            })
        }
    }
    return i
})();
export {
    st as a, dt as b, li as c
};