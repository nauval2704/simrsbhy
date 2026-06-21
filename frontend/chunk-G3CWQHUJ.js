import {
    f as K,
    l as U
} from "./chunk-JD6JIJOO.js";
import {
    a as E
} from "./chunk-DWKIKMYD.js";
import {
    r as L,
    s as O
} from "./chunk-QGNVLNC6.js";
import {
    a as H
} from "./chunk-IVTVBFQS.js";
import {
    b as z,
    c,
    d as Q,
    e as W,
    f as X,
    i as S,
    l as Z,
    o as ee,
    p as te,
    q as ne,
    r as ie,
    s as ae,
    v as oe,
    y as re
} from "./chunk-NKLTBXW5.js";
import {
    k as le
} from "./chunk-QJBCP6KK.js";
import "./chunk-W7XVFZVJ.js";
import {
    h as Y,
    r as w,
    s as D
} from "./chunk-CFNDTNZN.js";
import {
    Da as P,
    Db as F,
    Ea as M,
    Ec as a,
    Fb as $,
    Fc as h,
    Gc as g,
    Kb as R,
    Pa as V,
    Qc as f,
    Sc as v,
    Tc as _,
    Zb as b,
    cc as N,
    dc as I,
    ec as T,
    fc as y,
    gc as e,
    hc as t,
    ic as d,
    mc as q,
    qb as l,
    ra as u,
    rb as B,
    sc as m,
    tc as x,
    wb as G,
    yb as j
} from "./chunk-UYVTZL26.js";
var se = (() => {
    class o {
        constructor(i, r, n) {
            this.el = i, this.renderer = r, this.control = n, this.regex = new RegExp(/^\d+$/)
        }
        onInputChange(i) {
            let r = i.target.value.replace(/,/g, "");
            this.regex.test(r) || r === "" ? (this.control.control?.setValue(r), this.formatInput(r)) : i.preventDefault()
        }
        onBlur() {
            this.formatInput(this.control.control?.value)
        }
        formatInput(i) {
            if (i != null) {
                let r = i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.renderer.setProperty(this.el.nativeElement, "value", r)
            }
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || o)(B(V), B(G), B(Q))
            }
        }
        static {
            this.\u0275dir = $({
                type: o,
                selectors: [
                    ["", "appThousandSeparator", ""]
                ],
                hostBindings: function(r, n) {
                    r & 1 && m("input", function(k) {
                        return n.onInputChange(k)
                    })("blur", function() {
                        return n.onBlur()
                    })
                }
            })
        }
    }
    return o
})();

function be(o, p) {
    if (o & 1 && (e(0, "th", 13), a(1), t()), o & 2) {
        let i = x(2).$index;
        l(), h(i + 1)
    }
}

function ge(o, p) {
    o & 1 && d(0, "th", 13)
}

function fe(o, p) {
    if (o & 1 && (a(0), v(1, "number")), o & 2) {
        let i = x().$implicit;
        g(" ", _(1, 1, i.hargaJualBPJS), " ")
    }
}

function ve(o, p) {
    if (o & 1 && (a(0), v(1, "number")), o & 2) {
        let i = x().$implicit;
        g(" ", _(1, 1, i.hargaJualYANKES), " ")
    }
}

function _e(o, p) {
    if (o & 1 && (a(0), v(1, "number")), o & 2) {
        let i = x().$implicit;
        g(" ", _(1, 1, i.hargaJualBPJS * i.jumlah), " ")
    }
}

function Se(o, p) {
    if (o & 1 && (a(0), v(1, "number")), o & 2) {
        let i = x().$implicit;
        g(" ", _(1, 1, i.hargaJualYANKES * i.jumlah), " ")
    }
}

function Ce(o, p) {
    if (o & 1 && (e(0, "tr"), R(1, be, 2, 1, "th", 13)(2, ge, 1, 0, "th", 13), e(3, "th", 13), a(4), t(), e(5, "td"), a(6), t(), e(7, "td", 14), a(8), v(9, "number"), t(), e(10, "td", 14), R(11, fe, 2, 3)(12, ve, 2, 3), t(), e(13, "td", 14), R(14, _e, 2, 3)(15, Se, 2, 3), t()()), o & 2) {
        let i = p.$implicit,
            r = p.$index,
            n = x(2);
        l(), N(r === 0 ? 1 : 2), l(3), g("", r + 1, "."), l(2), h(i.nama), l(2), h(_(9, 6, i.jumlah)), l(3), N(n.keuanganService.selectedPasien().cabar === "BPJS" ? 11 : 12), l(3), N(n.keuanganService.selectedPasien().cabar === "BPJS" ? 14 : 15)
    }
}

function ke(o, p) {
    if (o & 1 && T(0, Ce, 16, 8, "tr", null, I), o & 2) {
        let i = p.$implicit;
        y(i.obat)
    }
}

function xe(o, p) {
    o & 1 && (e(0, "tr")(1, "th", 15), a(2, "No Data!."), t()())
}
var ce = (() => {
    class o {
        constructor() {
            this.keuanganService = u(E), this.activeModal = u(L)
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || o)
            }
        }
        static {
            this.\u0275cmp = F({
                type: o,
                selectors: [
                    ["app-list-obat-checkin"]
                ],
                decls: 35,
                vars: 4,
                consts: [
                    [1, "modal-header"],
                    [1, "modal-title"],
                    ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"],
                    [1, "modal-body"],
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "table-striped", "table-hover"],
                    ["scope", "col"],
                    ["scope", "col", 1, "text-end"],
                    [1, "table-group-divider"],
                    ["scope", "row", "colspan", "5", 1, "text-end"],
                    ["scope", "row", 1, "text-end"],
                    [1, "modal-footer"],
                    ["type", "button", 1, "btn", "btn-outline-dark", 3, "click"],
                    ["scope", "row"],
                    [1, "text-end"],
                    ["scope", "row", "colspan", "6", 1, "text-center"]
                ],
                template: function(r, n) {
                    if (r & 1 && (e(0, "div", 0)(1, "h4", 1), a(2, "Obat"), t(), e(3, "button", 2), m("click", function() {
                            return n.activeModal.dismiss("Cross click")
                        }), t()(), e(4, "div", 3)(5, "div", 4)(6, "table", 5)(7, "thead")(8, "tr")(9, "th", 6), a(10, "Resep"), t(), e(11, "th", 6), a(12, "#"), t(), e(13, "th", 6), a(14, "NAMA"), t(), e(15, "th", 7), a(16, "QTY"), t(), e(17, "th", 7), a(18, "HARGA"), t(), e(19, "th", 7), a(20, "TOTAL"), t()()(), e(21, "tbody", 8), T(22, ke, 2, 0, null, null, I, !1, xe, 3, 0, "tr"), t(), e(25, "tfoot")(26, "tr")(27, "th", 9), a(28, "GRAND TOTAL"), t(), e(29, "th", 10), a(30), v(31, "number"), t()()()()()(), e(32, "div", 11)(33, "button", 12), m("click", function() {
                            return n.activeModal.close("Close click")
                        }), a(34, " Close "), t()()), r & 2) {
                        let s, k;
                        l(22), y((s = n.keuanganService.selectedPasien()) == null ? null : s.dataFarmasi), l(8), g(" ", _(31, 2, (k = n.keuanganService.calculateGrandTotalObat((k = n.keuanganService.selectedPasien()) == null ? null : k.dataFarmasi)) !== null && k !== void 0 ? k : "0"), " ")
                    }
                },
                dependencies: [D, w],
                encapsulation: 2
            })
        }
    }
    return o
})();

function Fe(o, p) {
    if (o & 1 && (e(0, "tr")(1, "th", 13), a(2), t(), e(3, "td"), a(4), t(), e(5, "td", 14), a(6), v(7, "number"), t(), e(8, "td", 14), a(9), v(10, "number"), t(), e(11, "td", 14), a(12), v(13, "number"), t()()), o & 2) {
        let i = p.$implicit,
            r = p.$index;
        l(2), g("", r + 1, "."), l(2), h(i.tarifDetails == null ? null : i.tarifDetails.nama), l(2), h(_(7, 5, i.qty)), l(3), g(" ", _(10, 7, i.tarifDetails == null ? null : i.tarifDetails.harga), " "), l(3), g(" ", _(13, 9, (i.tarifDetails == null ? null : i.tarifDetails.harga) * i.qty), " ")
    }
}

function Ee(o, p) {
    o & 1 && (e(0, "tr")(1, "th", 15), a(2, "No Data!."), t()())
}
var pe = (() => {
    class o {
        constructor() {
            this.keuanganService = u(E), this.activeModal = u(L)
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || o)
            }
        }
        static {
            this.\u0275cmp = F({
                type: o,
                selectors: [
                    ["app-list-rincian-checkin"]
                ],
                inputs: {
                    keterangan: "keterangan"
                },
                decls: 33,
                vars: 5,
                consts: [
                    [1, "modal-header"],
                    [1, "modal-title"],
                    ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"],
                    [1, "modal-body"],
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "table-striped", "table-hover"],
                    ["scope", "col"],
                    ["scope", "col", 1, "text-end"],
                    [1, "table-group-divider"],
                    ["scope", "row", "colspan", "4", 1, "text-end"],
                    ["scope", "row", 1, "text-end"],
                    [1, "modal-footer"],
                    ["type", "button", 1, "btn", "btn-outline-dark", 3, "click"],
                    ["scope", "row"],
                    [1, "text-end"],
                    ["scope", "row", "colspan", "5", 1, "text-center"]
                ],
                template: function(r, n) {
                    if (r & 1 && (e(0, "div", 0)(1, "h4", 1), a(2), t(), e(3, "button", 2), m("click", function() {
                            return n.activeModal.dismiss("Cross click")
                        }), t()(), e(4, "div", 3)(5, "div", 4)(6, "table", 5)(7, "thead")(8, "tr")(9, "th", 6), a(10, "#"), t(), e(11, "th", 6), a(12, "NAMA"), t(), e(13, "th", 7), a(14, "QTY"), t(), e(15, "th", 7), a(16, "HARGA"), t(), e(17, "th", 7), a(18, "TOTAL"), t()()(), e(19, "tbody", 8), T(20, Fe, 14, 11, "tr", null, I, !1, Ee, 3, 0, "tr"), t(), e(23, "tfoot")(24, "tr")(25, "th", 9), a(26, "GRAND TOTAL"), t(), e(27, "th", 10), a(28), v(29, "number"), t()()()()()(), e(30, "div", 11)(31, "button", 12), m("click", function() {
                            return n.activeModal.close("Close click")
                        }), a(32, " Close "), t()()), r & 2) {
                        let s;
                        l(2), h(n.keterangan), l(18), y(n.keuanganService.getFilteredRincian(n.keterangan)), l(8), g(" ", _(29, 3, (s = n.keuanganService.calculateGrandTotalRincian(n.keuanganService.getFilteredRincian(n.keterangan))) !== null && s !== void 0 ? s : "0"), " ")
                    }
                },
                dependencies: [D, w],
                encapsulation: 2
            })
        }
    }
    return o
})();
var C = (o, p) => ({
        "is-invalid": o,
        "is-valid": p
    }),
    de = (() => {
        class o {
            constructor() {
                this.keuanganService = u(E), this.activeModal = u(L), this.fb = u(oe), this.dataLab = this.keuanganService.selectedPasien().dataRincian.filter(i => i.tarifDetails?.pelayanan === "LAB"), this.dataRadiologi = this.keuanganService.selectedPasien().dataRincian.filter(i => i.tarifDetails?.pelayanan === "RADIOLOGI"), this.sigBhp = j("0"), this.sigBruto = j("0"), this.inputForm = this.fb.group({
                    adm: new S("", [c.required, c.minLength(1)]),
                    dpjp: new S("", [c.required, c.minLength(1)]),
                    obat: new S({
                        value: this.keuanganService.calculateGrandTotalObat(this.keuanganService.selectedPasien().dataFarmasi).toLocaleString(),
                        disabled: !0
                    }, [c.required, c.minLength(1)]),
                    lab: new S({
                        value: this.keuanganService.calculateGrandTotalRincian(this.dataLab).toLocaleString(),
                        disabled: !0
                    }, [c.required, c.minLength(1)]),
                    radiologi: new S({
                        value: this.keuanganService.calculateGrandTotalRincian(this.dataRadiologi).toLocaleString(),
                        disabled: !0
                    }, [c.required, c.minLength(1)]),
                    ekg: new S("", [c.required, c.minLength(1)]),
                    bhp: new S({
                        value: this.sigBhp(),
                        disabled: !0
                    }, [c.required, c.minLength(1)]),
                    inacbgs: new S("", [c.required, c.minLength(1)]),
                    bruto: new S({
                        value: this.sigBruto(),
                        disabled: !0
                    }, [c.required, c.minLength(1)]),
                    percentage: new S("", [c.required, c.minLength(1)]),
                    jasa: new S({
                        value: "",
                        disabled: !0
                    }, [c.required, c.minLength(1)])
                }), this.toastr = u(le), this.modalService = u(O), this.initBhp = this.calculateBhp(), this.initBruto = this.calculateJumlahBruto(), this.isLoading = !1, this.store = u(K), this.userSelector = this.store.select(U).pipe(H()).subscribe(i => {
                    this.currentUser = i
                })
            }
            openObat() {
                let i = this.modalService.open(ce, {
                    centered: !1,
                    backdrop: "static",
                    size: "lg"
                })
            }
            openRincian(i) {
                let r = this.modalService.open(pe, {
                    centered: !1,
                    backdrop: "static",
                    size: "lg"
                });
                r.componentInstance.keterangan = i
            }
            calculateBhp() {
                let i = parseInt(this.inputForm.getRawValue().adm.replace(/,/g, ""), 10),
                    r = parseInt(this.inputForm.getRawValue().dpjp.replace(/,/g, ""), 10),
                    n = parseInt(this.inputForm.getRawValue().obat.replace(/,/g, ""), 10),
                    s = parseInt(this.inputForm.getRawValue().lab.replace(/,/g, ""), 10),
                    k = parseInt(this.inputForm.getRawValue().radiologi.replace(/,/g, ""), 10),
                    ue = parseInt(this.inputForm.getRawValue().ekg.replace(/,/g, ""), 10),
                    J = i + r + n + s + k + ue;
                if (Number.isNaN(J)) {
                    this.inputForm.patchValue({
                        bhp: ""
                    });
                    return
                }
                this.sigBhp.set(J.toLocaleString()), this.inputForm.patchValue({
                    bhp: this.sigBhp()
                })
            }
            calculateJumlahBruto() {
                let i = parseInt(this.inputForm.getRawValue().bhp.replace(/,/g, ""), 10),
                    n = parseInt(this.inputForm.getRawValue().inacbgs.replace(/,/g, ""), 10) - i;
                if (Number.isNaN(n)) {
                    this.inputForm.patchValue({
                        bruto: ""
                    });
                    return
                }
                this.sigBruto.set(n.toLocaleString()), this.inputForm.patchValue({
                    bruto: this.sigBruto()
                }), this.calculateJasa()
            }
            calculateJasa() {
                if (!this.inputForm.getRawValue().percentage || !this.inputForm.getRawValue().bruto) {
                    this.inputForm.patchValue({
                        jasa: ""
                    });
                    return
                }
                let i = parseInt(this.inputForm.getRawValue().percentage),
                    r = parseInt(this.sigBruto().replace(/,/g, ""), 10),
                    n = i / 100 * r;
                if (Number.isNaN(n)) {
                    this.inputForm.patchValue({
                        jasa: ""
                    });
                    return
                }
                this.inputForm.patchValue({
                    jasa: n.toLocaleString()
                })
            }
            convertToNumber(i) {
                return parseInt(i.replace(/,/g, ""), 10)
            }
            onSubmit() {
                let i = this.inputForm.getRawValue(),
                    r = Object.keys(i).reduce((n, s) => (n[s] = this.convertToNumber(i[s]), n), {});
                r.noCheckin = this.keuanganService.selectedPasien().noCheckin, r.namaDpjp = this.keuanganService.selectedPasien().dpjp, r.nama = this.keuanganService.selectedPasien().nama, r.tglInput = this.keuanganService.selectedPasien().tglInput, r.tglOut = this.keuanganService.selectedPasien().tglOut, r.user = this.currentUser.nama, this.isLoading = !0, this.keuanganService.createJasaDokter(r).subscribe({
                    next: n => {
                        this.keuanganService.listJasaDokter().push(...n.data), this.keuanganService.updateListFilteredPasien(n), this.toastr.success(n.message), this.activeModal.close()
                    },
                    error: n => {
                        this.toastr.error(n.message)
                    },
                    complete: () => {
                        this.isLoading = !1
                    }
                })
            }
            static {
                this.\u0275fac = function(r) {
                    return new(r || o)
                }
            }
            static {
                this.\u0275cmp = F({
                    type: o,
                    selectors: [
                        ["app-jasa-dokter-input"]
                    ],
                    decls: 104,
                    vars: 46,
                    consts: [
                        [1, "modal-header"],
                        [1, "modal-title"],
                        ["type", "button", "aria-label", "Close", 1, "btn-close", 3, "click"],
                        [1, "modal-body"],
                        ["autocomplete", "off", 3, "ngSubmit", "formGroup"],
                        [1, "row", "mb-2"],
                        ["for", "adm", 1, "col-sm-4", "col-form-label"],
                        [1, "col-sm-4"],
                        ["type", "text", "id", "adm", "name", "adm", "formControlName", "adm", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "adm", 1, "col-form-label", "text-danger"],
                        ["for", "dpjp", 1, "col-sm-4", "col-form-label"],
                        ["type", "text", "id", "dpjp", "name", "dpjp", "formControlName", "dpjp", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "dpjp", 1, "col-form-label", "text-danger"],
                        ["for", "obat", 1, "col-sm-4", "col-form-label"],
                        [1, "input-group"],
                        ["type", "button", "id", "button-addon2", 1, "btn", "btn-outline-secondary", 3, "click"],
                        [1, "bi", "bi-search"],
                        ["type", "text", "id", "obat", "name", "obat", "formControlName", "obat", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "obat", 1, "col-form-label", "text-danger"],
                        ["for", "lab", 1, "col-sm-4", "col-form-label"],
                        ["type", "text", "id", "lab", "name", "lab", "formControlName", "lab", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "lab", 1, "col-form-label", "text-danger"],
                        ["for", "radiologi", 1, "col-sm-4", "col-form-label"],
                        ["type", "text", "id", "radiologi", "name", "radiologi", "formControlName", "radiologi", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "radiologi", 1, "col-form-label", "text-danger"],
                        ["for", "ekg", 1, "col-sm-4", "col-form-label"],
                        ["type", "text", "id", "ekg", "name", "ekg", "formControlName", "ekg", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "ekg", 1, "col-form-label", "text-danger"],
                        ["for", "bhp", 1, "col-sm-4", "col-form-label"],
                        ["for", "bhp", 1, "col-form-label", "text-danger"],
                        ["type", "text", "id", "bhp", "name", "bhp", "formControlName", "bhp", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "ngClass"],
                        ["for", "inacbgs", 1, "col-sm-4", "col-form-label"],
                        ["type", "text", "id", "inacbgs", "name", "inacbgs", "formControlName", "inacbgs", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "change", "ngClass"],
                        ["for", "inacbgs", 1, "col-form-label", "text-danger"],
                        ["for", "bruto", 1, "col-sm-4", "col-form-label"],
                        ["for", "bruto", 1, "col-form-label", "text-primary"],
                        ["type", "text", "id", "bruto", "name", "bruto", "formControlName", "bruto", "appThousandSeparator", "", 1, "form-control", "text-end", 3, "ngClass"],
                        [1, "row", "mb-3"],
                        ["for", "percentage", 1, "col-sm-4", "col-form-label"],
                        [1, "col-sm-8"],
                        [1, "row"],
                        [1, "col"],
                        ["aria-label", "Default select example", "name", "percentage", "formControlName", "percentage", 1, "form-select", "mb-2", 3, "change", "ngClass"],
                        ["value", ""],
                        ["value", "35"],
                        ["value", "60"],
                        [1, "col-sm-6"],
                        ["for", "jasa", 1, "col-form-label", "text-danger"],
                        ["type", "text", "id", "jasa", "name", "jasa", "formControlName", "jasa", "appThousandSeparator", "", 1, "form-control", "text-end", "fw-bold", 3, "ngClass"],
                        ["for", "submit", 1, "col-sm-4", "col-form-label"],
                        ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"],
                        [1, "modal-footer"],
                        ["type", "button", 1, "btn", "btn-outline-dark", 3, "click"]
                    ],
                    template: function(r, n) {
                        r & 1 && (e(0, "div", 0)(1, "h4", 1), a(2, "Jasa Dokter"), t(), e(3, "button", 2), m("click", function() {
                            return n.activeModal.dismiss("Cross click")
                        }), t()(), e(4, "div", 3)(5, "form", 4), m("ngSubmit", function() {
                            return n.onSubmit()
                        }), e(6, "div", 5)(7, "label", 6), a(8, "ADM"), t(), e(9, "div", 7)(10, "input", 8), m("change", function() {
                            return n.calculateBhp()
                        }), t()(), e(11, "div", 7), d(12, "label", 9), t()(), e(13, "div", 5)(14, "label", 10), a(15, "DPJP"), t(), e(16, "div", 7)(17, "input", 11), m("change", function() {
                            return n.calculateBhp()
                        }), t()(), e(18, "div", 7), d(19, "label", 12), t()(), e(20, "div", 5)(21, "label", 13), a(22, "OBAT"), t(), e(23, "div", 7)(24, "div", 14)(25, "button", 15), m("click", function() {
                            return n.openObat()
                        }), d(26, "i", 16), t(), e(27, "input", 17), m("change", function() {
                            return n.calculateBhp()
                        }), t()()(), e(28, "div", 7), d(29, "label", 18), t()(), e(30, "div", 5)(31, "label", 19), a(32, "LAB"), t(), e(33, "div", 7)(34, "div", 14)(35, "button", 15), m("click", function() {
                            return n.openRincian("LAB")
                        }), d(36, "i", 16), t(), e(37, "input", 20), m("change", function() {
                            return n.calculateBhp()
                        }), t()()(), e(38, "div", 7), d(39, "label", 21), t()(), e(40, "div", 5)(41, "label", 22), a(42, "RADIOLOGI"), t(), e(43, "div", 7)(44, "div", 14)(45, "button", 15), m("click", function() {
                            return n.openRincian("RADIOLOGI")
                        }), d(46, "i", 16), t(), e(47, "input", 23), m("change", function() {
                            return n.calculateBhp()
                        }), t()()(), e(48, "div", 7), d(49, "label", 24), t()(), e(50, "div", 5)(51, "label", 25), a(52, "EKG"), t(), e(53, "div", 7)(54, "input", 26), m("change", function() {
                            return n.calculateBhp()
                        }), t()(), e(55, "div", 7), d(56, "label", 27), t()(), e(57, "div", 5), d(58, "label", 28), e(59, "div", 7)(60, "label", 29), a(61, "BHP TOTAL"), t()(), e(62, "div", 7), d(63, "input", 30), t()(), e(64, "div", 5)(65, "label", 31), a(66, "TARIF INACBGS"), t(), e(67, "div", 7)(68, "input", 32), m("change", function() {
                            return n.calculateJumlahBruto()
                        }), t()(), e(69, "div", 7), d(70, "label", 33), t()(), e(71, "div", 5), d(72, "label", 34), e(73, "div", 7)(74, "label", 35), a(75, "JUMLAH BRUTO"), t()(), e(76, "div", 7), d(77, "input", 36), t()(), e(78, "div", 37)(79, "label", 38), a(80, "JASA"), t(), e(81, "div", 39)(82, "div", 40)(83, "div", 41)(84, "select", 42), m("change", function() {
                            return n.calculateJasa()
                        }), e(85, "option", 43), a(86, "-- Pilih --"), t(), e(87, "option", 44), a(88, "RS 65%, DOKTER SPESIALIS 35%"), t(), e(89, "option", 45), a(90, "RS 40%, DOKTER SPESIALIS 60%"), t()()()(), e(91, "div", 40)(92, "div", 46), d(93, "label", 47), t(), e(94, "div", 46), d(95, "input", 48), t()()()(), e(96, "div", 5), d(97, "label", 49), e(98, "div", 39)(99, "button", 50), a(100, " Submit "), t()()()()(), e(101, "div", 51)(102, "button", 52), m("click", function() {
                            return n.activeModal.close("Close click")
                        }), a(103, " Close "), t()()), r & 2 && (l(5), b("formGroup", n.inputForm), l(5), b("ngClass", f(13, C, n.inputForm.controls.adm.invalid && n.inputForm.controls.adm.touched, n.inputForm.controls.adm.valid)), l(7), b("ngClass", f(16, C, n.inputForm.controls.dpjp.invalid && n.inputForm.controls.dpjp.touched, n.inputForm.controls.dpjp.valid)), l(10), b("ngClass", f(19, C, n.inputForm.controls.obat.invalid && n.inputForm.controls.obat.touched, n.inputForm.controls.obat.valid)), l(10), b("ngClass", f(22, C, n.inputForm.controls.lab.invalid && n.inputForm.controls.lab.touched, n.inputForm.controls.lab.valid)), l(10), b("ngClass", f(25, C, n.inputForm.controls.radiologi.invalid && n.inputForm.controls.radiologi.touched, n.inputForm.controls.radiologi.valid)), l(7), b("ngClass", f(28, C, n.inputForm.controls.ekg.invalid && n.inputForm.controls.ekg.touched, n.inputForm.controls.ekg.valid)), l(9), b("ngClass", f(31, C, n.inputForm.controls.bhp.invalid && n.inputForm.controls.bhp.touched, n.inputForm.controls.bhp.valid)), l(5), b("ngClass", f(34, C, n.inputForm.controls.inacbgs.invalid && n.inputForm.controls.inacbgs.touched, n.inputForm.controls.inacbgs.valid)), l(9), b("ngClass", f(37, C, n.inputForm.controls.bruto.invalid && n.inputForm.controls.bruto.touched, n.inputForm.controls.bruto.valid)), l(7), b("ngClass", f(40, C, n.inputForm.controls.percentage.invalid && n.inputForm.controls.percentage.touched, n.inputForm.controls.percentage.valid)), l(11), b("ngClass", f(43, C, n.inputForm.controls.jasa.invalid && n.inputForm.controls.jasa.touched, n.inputForm.controls.jasa.valid)), l(4), b("disabled", !n.inputForm.valid))
                    },
                    dependencies: [D, Y, se, re, Z, ie, ae, z, ne, W, X, ee, te],
                    encapsulation: 2
                })
            }
        }
        return o
    })();

function Ie(o, p) {
    if (o & 1) {
        let i = q();
        e(0, "tr", 7), m("click", function() {
            let n = P(i).$implicit,
                s = x();
            return M(s.open(n))
        }), e(1, "th", 8), a(2), t(), e(3, "td"), a(4), t(), e(5, "td"), a(6), t(), e(7, "td"), a(8), t(), e(9, "td"), a(10), t(), e(11, "td"), a(12), t(), e(13, "td"), a(14), t()()
    }
    if (o & 2) {
        let i = p.$implicit,
            r = p.$index;
        l(2), g("", r + 1, "."), l(2), h(i.noCheckin), l(2), h(i.dpjp), l(2), h(i.nama), l(2), h(i.tglInput), l(2), h(i.tglOut), l(2), h(i.noMr)
    }
}

function Te(o, p) {
    o & 1 && (e(0, "tr")(1, "th", 9), a(2, "No Data!."), t()())
}
var lt = (() => {
    class o {
        constructor() {
            this.keuanganService = u(E), this.modalService = u(O)
        }
        open(i) {
            this.keuanganService.selectedPasien.set(i);
            let r = this.modalService.open(de, {
                centered: !1,
                backdrop: "static",
                size: "lg"
            })
        }
        static {
            this.\u0275fac = function(r) {
                return new(r || o)
            }
        }
        static {
            this.\u0275cmp = F({
                type: o,
                selectors: [
                    ["app-list-filtered-pasien"]
                ],
                decls: 26,
                vars: 1,
                consts: [
                    [1, "card"],
                    [1, "card-body"],
                    [1, "h4", "pb-2", "mb-4", "text-danger", "border-bottom", "border-danger"],
                    [1, "table-responsive"],
                    [1, "table", "table-sm", "table-striped", "table-hover"],
                    ["scope", "col"],
                    [1, "table-group-divider"],
                    [3, "click"],
                    ["scope", "row"],
                    ["scope", "row", "colspan", "8", 1, "text-center"]
                ],
                template: function(r, n) {
                    r & 1 && (e(0, "div", 0)(1, "div", 1)(2, "div", 2), a(3, " Pasien "), t(), e(4, "div", 3)(5, "table", 4)(6, "thead")(7, "tr")(8, "th", 5), a(9, "#"), t(), e(10, "th", 5), a(11, "ID"), t(), e(12, "th", 5), a(13, "DPJP"), t(), e(14, "th", 5), a(15, "NAMA"), t(), e(16, "th", 5), a(17, "CHECKIN"), t(), e(18, "th", 5), a(19, "CHECKOUT"), t(), e(20, "th", 5), a(21, "NORM"), t()()(), e(22, "tbody", 6), T(23, Ie, 15, 7, "tr", null, I, !1, Te, 3, 0, "tr"), t()()()()()), r & 2 && (l(23), y(n.keuanganService.listFilteredPasien() || null))
                },
                styles: ["tr[_ngcontent-%COMP%]{cursor:pointer}"]
            })
        }
    }
    return o
})();
export {
    lt as ListFilteredPasienComponent
};