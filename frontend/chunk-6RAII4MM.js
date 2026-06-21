import {
    a as b
} from "./chunk-HSMKNQVK.js";
import {
    b as _,
    c as F,
    e as O,
    f as T,
    g as k,
    i as m,
    l as A,
    o as I,
    p as D,
    q as G,
    r as V,
    s as M,
    y as R
} from "./chunk-NKLTBXW5.js";
import {
    b as B
} from "./chunk-KT4J7VG7.js";
import {
    k as K
} from "./chunk-QJBCP6KK.js";
import "./chunk-W7XVFZVJ.js";
import {
    h as E,
    s as w
} from "./chunk-CFNDTNZN.js";
import {
    Db as z,
    Ec as o,
    Fc as N,
    Qc as l,
    Zb as a,
    ec as y,
    fc as h,
    gc as i,
    hc as t,
    ic as r,
    qb as n,
    ra as f,
    sc as C,
    wc as S
} from "./chunk-UYVTZL26.js";
var q = (s, p) => p.nama,
    d = (s, p) => ({
        "is-invalid": s,
        "is-valid": p
    });

function P(s, p) {
    if (s & 1 && (i(0, "option", 9), o(1), t()), s & 2) {
        let c = p.$implicit;
        S("value", c.nama), n(), N(c.nama)
    }
}

function $(s, p) {
    s & 1 && (i(0, "option", 10), o(1, "-"), t())
}
var x = (() => {
    class s {
        constructor() {
            this.satusehatService = f(B), this.toastr = f(K), this.divisi = b, this.organizationForm = new k({
                name: new m("", [F.required]),
                identifierName: new m({
                    value: "",
                    disabled: !0
                }, [F.required]),
                phone: new m({
                    value: "+62651-41470",
                    disabled: !0
                }),
                email: new m({
                    value: "bhayangkara88@gmail.com",
                    disabled: !0
                }),
                url: new m({
                    value: "rsbhayangkaraaceh.com",
                    disabled: !0
                }),
                line: new m({
                    value: "Jl. Cut Nyak Dhien No. 23, Lamteumen Barat Banda Aceh",
                    disabled: !0
                }),
                kota: new m({
                    value: "Banda Aceh",
                    disabled: !0
                }),
                postalCode: new m({
                    value: "23232",
                    disabled: !0
                }),
                country: new m({
                    value: "ID",
                    disabled: !0
                }),
                province: new m({
                    value: "11",
                    disabled: !0
                }),
                city: new m({
                    value: "1171",
                    disabled: !0
                }),
                district: new m({
                    value: "1171011",
                    disabled: !0
                }),
                village: new m({
                    value: "1171011006",
                    disabled: !0
                })
            })
        }
        getIdentifierName(c) {
            let u = c.split(",").map(v => v.trim()),
                e = b.filter(v => u.every(g => v.nama.includes(g)));
            this.organizationForm.patchValue({
                identifierName: e[0].identifierName
            })
        }
        onSubmit() {
            this.satusehatService.createOrganization(this.organizationForm.getRawValue()).subscribe(c => this.satusehatService.handleSuccessResponse(c, "Organization"), c => this.satusehatService.handleErrorResponse(c))
        }
        static {
            this.\u0275fac = function(u) {
                return new(u || s)
            }
        }
        static {
            this.\u0275cmp = z({
                type: s,
                selectors: [
                    ["app-create-organization"]
                ],
                decls: 80,
                vars: 55,
                consts: [
                    [1, "card"],
                    [1, "card-header", "text-bg-warning", "fw-bold"],
                    [1, "card-body"],
                    [3, "submit", "formGroup"],
                    [1, "row", "mb-3"],
                    ["for", "name", 1, "col-3", "col-form-label"],
                    [1, "col-9"],
                    ["aria-label", "Default select example", "id", "name", "formControlName", "name", 1, "form-select", 3, "change", "ngClass"],
                    ["value", ""],
                    [3, "value"],
                    ["value", "-"],
                    ["for", "identifierName", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "identifierName", "formControlName", "identifierName", 1, "form-control", 3, "ngClass"],
                    ["for", "phone", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "phone", "formControlName", "phone", 1, "form-control", 3, "ngClass"],
                    ["for", "email", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "email", "formControlName", "email", 1, "form-control", 3, "ngClass"],
                    ["for", "url", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "url", "formControlName", "url", 1, "form-control", 3, "ngClass"],
                    ["for", "line", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "line", "formControlName", "line", 1, "form-control", 3, "ngClass"],
                    ["for", "kota", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "kota", "formControlName", "kota", 1, "form-control", 3, "ngClass"],
                    ["for", "postalCode", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "postalCode", "formControlName", "postalCode", 1, "form-control", 3, "ngClass"],
                    ["for", "country", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "country", "formControlName", "country", 1, "form-control", 3, "ngClass"],
                    ["for", "province", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "province", "formControlName", "province", 1, "form-control", 3, "ngClass"],
                    ["for", "city", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "city", "formControlName", "city", 1, "form-control", 3, "ngClass"],
                    ["for", "district", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "district", "formControlName", "district", 1, "form-control", 3, "ngClass"],
                    ["for", "village", 1, "col-3", "col-form-label"],
                    ["type", "text", "id", "village", "formControlName", "village", 1, "form-control", 3, "ngClass"],
                    [1, "col-3", "col-form-label"],
                    ["type", "submit", 1, "btn", "btn-primary", "w-100", 3, "disabled"]
                ],
                template: function(u, e) {
                    u & 1 && (i(0, "div", 0)(1, "div", 1), o(2, "Create Organization"), t(), i(3, "div", 2)(4, "form", 3), C("submit", function() {
                        return e.onSubmit()
                    }), i(5, "div", 4)(6, "label", 5), o(7, "Nama"), t(), i(8, "div", 6)(9, "select", 7), C("change", function(g) {
                        return e.getIdentifierName(g.target.value)
                    }), i(10, "option", 8), o(11, "- Pilih -"), t(), y(12, P, 2, 2, "option", 9, q, !1, $, 2, 0, "option", 10), t()()(), i(15, "div", 4)(16, "label", 11), o(17, "Identifier Name"), t(), i(18, "div", 6), r(19, "input", 12), t()(), i(20, "div", 4)(21, "label", 13), o(22, "Telp"), t(), i(23, "div", 6), r(24, "input", 14), t()(), i(25, "div", 4)(26, "label", 15), o(27, "Email"), t(), i(28, "div", 6), r(29, "input", 16), t()(), i(30, "div", 4)(31, "label", 17), o(32, "Website"), t(), i(33, "div", 6), r(34, "input", 18), t()(), i(35, "div", 4)(36, "label", 19), o(37, "Alamat"), t(), i(38, "div", 6), r(39, "input", 20), t()(), i(40, "div", 4)(41, "label", 21), o(42, "Kota"), t(), i(43, "div", 6), r(44, "input", 22), t()(), i(45, "div", 4)(46, "label", 23), o(47, "Kodepos"), t(), i(48, "div", 6), r(49, "input", 24), t()(), i(50, "div", 4)(51, "label", 25), o(52, "Negara"), t(), i(53, "div", 6), r(54, "input", 26), t()(), i(55, "div", 4)(56, "label", 27), o(57, "Provinsi"), t(), i(58, "div", 6), r(59, "input", 28), t()(), i(60, "div", 4)(61, "label", 29), o(62, "Kabupaten"), t(), i(63, "div", 6), r(64, "input", 30), t()(), i(65, "div", 4)(66, "label", 31), o(67, "Kecamatan"), t(), i(68, "div", 6), r(69, "input", 32), t()(), i(70, "div", 4)(71, "label", 33), o(72, "Desa"), t(), i(73, "div", 6), r(74, "input", 34), t()(), i(75, "div", 4)(76, "div", 35)(77, "button", 36), o(78, " Create "), t()(), r(79, "div", 6), t()()()()), u & 2 && (n(4), a("formGroup", e.organizationForm), n(5), a("ngClass", l(16, d, e.organizationForm.controls.name.invalid && e.organizationForm.controls.name.touched, e.organizationForm.controls.name.valid)), n(3), h(e.divisi), n(7), a("ngClass", l(19, d, e.organizationForm.controls.identifierName.invalid && e.organizationForm.controls.identifierName.touched, e.organizationForm.controls.identifierName.valid)), n(5), a("ngClass", l(22, d, e.organizationForm.controls.phone.invalid && e.organizationForm.controls.phone.touched, e.organizationForm.controls.phone.valid)), n(5), a("ngClass", l(25, d, e.organizationForm.controls.email.invalid && e.organizationForm.controls.email.touched, e.organizationForm.controls.email.valid)), n(5), a("ngClass", l(28, d, e.organizationForm.controls.url.invalid && e.organizationForm.controls.url.touched, e.organizationForm.controls.url.valid)), n(5), a("ngClass", l(31, d, e.organizationForm.controls.line.invalid && e.organizationForm.controls.line.touched, e.organizationForm.controls.line.valid)), n(5), a("ngClass", l(34, d, e.organizationForm.controls.kota.invalid && e.organizationForm.controls.kota.touched, e.organizationForm.controls.kota.valid)), n(5), a("ngClass", l(37, d, e.organizationForm.controls.postalCode.invalid && e.organizationForm.controls.postalCode.touched, e.organizationForm.controls.postalCode.valid)), n(5), a("ngClass", l(40, d, e.organizationForm.controls.country.invalid && e.organizationForm.controls.country.touched, e.organizationForm.controls.country.valid)), n(5), a("ngClass", l(43, d, e.organizationForm.controls.province.invalid && e.organizationForm.controls.province.touched, e.organizationForm.controls.province.valid)), n(5), a("ngClass", l(46, d, e.organizationForm.controls.city.invalid && e.organizationForm.controls.city.touched, e.organizationForm.controls.city.valid)), n(5), a("ngClass", l(49, d, e.organizationForm.controls.district.invalid && e.organizationForm.controls.district.touched, e.organizationForm.controls.district.valid)), n(5), a("ngClass", l(52, d, e.organizationForm.controls.village.invalid && e.organizationForm.controls.village.touched, e.organizationForm.controls.village.valid)), n(3), a("disabled", !e.organizationForm.valid))
                },
                dependencies: [w, E, R, A, V, M, _, G, O, T, I, D],
                encapsulation: 2
            })
        }
    }
    return s
})();
export {
    x as CreateOrganizationComponent
};