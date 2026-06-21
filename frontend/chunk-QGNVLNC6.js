import {
    a as Oi
} from "./chunk-IVTVBFQS.js";
import {
    a as Mn
} from "./chunk-NKLTBXW5.js";
import {
    b as be,
    l as Ai
} from "./chunk-CFNDTNZN.js";
import {
    $a as Ue,
    $b as G,
    A as un,
    Ac as Tn,
    Bc as Z,
    Ca as Tt,
    Cc as X,
    Da as xe,
    Db as Be,
    Dc as Me,
    Ea as ke,
    Eb as P,
    Ec as Ot,
    F as K,
    Fb as N,
    Fc as qt,
    Ga as mn,
    H as Ee,
    Hb as bn,
    I as gi,
    Ia as ie,
    Ib as yn,
    J as hn,
    Ja as vn,
    K as Dt,
    Kb as ae,
    La as O,
    Ma as me,
    Nc as Ti,
    P as pn,
    Pa as de,
    Pc as Mi,
    Qc as Zt,
    Rc as Xt,
    S as wt,
    T as fn,
    V as _n,
    Vb as Yt,
    Vc as Oe,
    Yb as ne,
    Za as Se,
    Zb as ve,
    Zc as At,
    _a as yi,
    a as yt,
    ac as Te,
    b as _i,
    cc as We,
    da as mi,
    dc as Kt,
    ea as H,
    ec as Qt,
    f as Io,
    fa as St,
    fc as Jt,
    ga as zt,
    gc as Q,
    hc as J,
    hd as Ye,
    ic as Dn,
    jc as wn,
    k as ln,
    ka as vi,
    kc as Sn,
    l as k,
    la as W,
    ma as B,
    mc as ze,
    nc as Pe,
    oa as gn,
    p as cn,
    qb as A,
    r as dn,
    ra as u,
    rc as Mt,
    s as st,
    sc as le,
    tb as ue,
    tc as w,
    uc as wi,
    vc as Si,
    x as je,
    xb as Di,
    za as bi,
    zc as oe
} from "./chunk-UYVTZL26.js";
var ls = {};
Io(ls, {
    afterMain: () => En,
    afterRead: () => Nn,
    afterWrite: () => Bn,
    applyStyles: () => at,
    arrow: () => ct,
    auto: () => Nt,
    basePlacements: () => Ae,
    beforeMain: () => Cn,
    beforeRead: () => On,
    beforeWrite: () => xn,
    bottom: () => I,
    clippingParents: () => Ni,
    computeStyles: () => dt,
    createPopper: () => Un,
    createPopperBase: () => jn,
    createPopperLite: () => si,
    detectOverflow: () => te,
    end: () => Ie,
    eventListeners: () => ut,
    flip: () => ft,
    hide: () => oi,
    left: () => C,
    main: () => Rn,
    modifierPhases: () => Ri,
    offset: () => _t,
    placements: () => Rt,
    popper: () => Ke,
    popperGenerator: () => it,
    popperOffsets: () => gt,
    preventOverflow: () => mt,
    read: () => An,
    reference: () => Ci,
    right: () => x,
    start: () => we,
    top: () => T,
    variationPlacements: () => ei,
    viewport: () => Ct,
    write: () => kn
});
var T = "top",
    I = "bottom",
    x = "right",
    C = "left",
    Nt = "auto",
    Ae = [T, I, x, C],
    we = "start",
    Ie = "end",
    Ni = "clippingParents",
    Ct = "viewport",
    Ke = "popper",
    Ci = "reference",
    ei = Ae.reduce(function(e, o) {
        return e.concat([o + "-" + we, o + "-" + Ie])
    }, []),
    Rt = [].concat(Ae, [Nt]).reduce(function(e, o) {
        return e.concat([o, o + "-" + we, o + "-" + Ie])
    }, []),
    On = "beforeRead",
    An = "read",
    Nn = "afterRead",
    Cn = "beforeMain",
    Rn = "main",
    En = "afterMain",
    xn = "beforeWrite",
    kn = "write",
    Bn = "afterWrite",
    Ri = [On, An, Nn, Cn, Rn, En, xn, kn, Bn];

function L(e) {
    return e ? (e.nodeName || "").toLowerCase() : null
}

function S(e) {
    if (e == null) return window;
    if (e.toString() !== "[object Window]") {
        var o = e.ownerDocument;
        return o && o.defaultView || window
    }
    return e
}

function he(e) {
    var o = S(e).Element;
    return e instanceof o || e instanceof Element
}

function V(e) {
    var o = S(e).HTMLElement;
    return e instanceof o || e instanceof HTMLElement
}

function rt(e) {
    if (typeof ShadowRoot > "u") return !1;
    var o = S(e).ShadowRoot;
    return e instanceof o || e instanceof ShadowRoot
}

function Fo(e) {
    var o = e.state;
    Object.keys(o.elements).forEach(function(t) {
        var i = o.styles[t] || {},
            n = o.attributes[t] || {},
            s = o.elements[t];
        !V(s) || !L(s) || (Object.assign(s.style, i), Object.keys(n).forEach(function(r) {
            var l = n[r];
            l === !1 ? s.removeAttribute(r) : s.setAttribute(r, l === !0 ? "" : l)
        }))
    })
}

function Ho(e) {
    var o = e.state,
        t = {
            popper: {
                position: o.options.strategy,
                left: "0",
                top: "0",
                margin: "0"
            },
            arrow: {
                position: "absolute"
            },
            reference: {}
        };
    return Object.assign(o.elements.popper.style, t.popper), o.styles = t, o.elements.arrow && Object.assign(o.elements.arrow.style, t.arrow),
        function() {
            Object.keys(o.elements).forEach(function(i) {
                var n = o.elements[i],
                    s = o.attributes[i] || {},
                    r = Object.keys(o.styles.hasOwnProperty(i) ? o.styles[i] : t[i]),
                    l = r.reduce(function(a, d) {
                        return a[d] = "", a
                    }, {});
                !V(n) || !L(n) || (Object.assign(n.style, l), Object.keys(s).forEach(function(a) {
                    n.removeAttribute(a)
                }))
            })
        }
}
var at = {
    name: "applyStyles",
    enabled: !0,
    phase: "write",
    fn: Fo,
    effect: Ho,
    requires: ["computeStyles"]
};

function j(e) {
    return e.split("-")[0]
}
var ye = Math.max,
    Qe = Math.min,
    Ne = Math.round;

function lt() {
    var e = navigator.userAgentData;
    return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(o) {
        return o.brand + "/" + o.version
    }).join(" ") : navigator.userAgent
}

function Et() {
    return !/^((?!chrome|android).)*safari/i.test(lt())
}

function pe(e, o, t) {
    o === void 0 && (o = !1), t === void 0 && (t = !1);
    var i = e.getBoundingClientRect(),
        n = 1,
        s = 1;
    o && V(e) && (n = e.offsetWidth > 0 && Ne(i.width) / e.offsetWidth || 1, s = e.offsetHeight > 0 && Ne(i.height) / e.offsetHeight || 1);
    var r = he(e) ? S(e) : window,
        l = r.visualViewport,
        a = !Et() && t,
        d = (i.left + (a && l ? l.offsetLeft : 0)) / n,
        c = (i.top + (a && l ? l.offsetTop : 0)) / s,
        p = i.width / n,
        f = i.height / s;
    return {
        width: p,
        height: f,
        top: c,
        right: d + p,
        bottom: c + f,
        left: d,
        x: d,
        y: c
    }
}

function Je(e) {
    var o = pe(e),
        t = e.offsetWidth,
        i = e.offsetHeight;
    return Math.abs(o.width - t) <= 1 && (t = o.width), Math.abs(o.height - i) <= 1 && (i = o.height), {
        x: e.offsetLeft,
        y: e.offsetTop,
        width: t,
        height: i
    }
}

function xt(e, o) {
    var t = o.getRootNode && o.getRootNode();
    if (e.contains(o)) return !0;
    if (t && rt(t)) {
        var i = o;
        do {
            if (i && e.isSameNode(i)) return !0;
            i = i.parentNode || i.host
        } while (i)
    }
    return !1
}

function ee(e) {
    return S(e).getComputedStyle(e)
}

function Ei(e) {
    return ["table", "td", "th"].indexOf(L(e)) >= 0
}

function z(e) {
    return ((he(e) ? e.ownerDocument : e.document) || window.document).documentElement
}

function Ce(e) {
    return L(e) === "html" ? e : e.assignedSlot || e.parentNode || (rt(e) ? e.host : null) || z(e)
}

function Pn(e) {
    return !V(e) || ee(e).position === "fixed" ? null : e.offsetParent
}

function Go(e) {
    var o = /firefox/i.test(lt()),
        t = /Trident/i.test(lt());
    if (t && V(e)) {
        var i = ee(e);
        if (i.position === "fixed") return null
    }
    var n = Ce(e);
    for (rt(n) && (n = n.host); V(n) && ["html", "body"].indexOf(L(n)) < 0;) {
        var s = ee(n);
        if (s.transform !== "none" || s.perspective !== "none" || s.contain === "paint" || ["transform", "perspective"].indexOf(s.willChange) !== -1 || o && s.willChange === "filter" || o && s.filter && s.filter !== "none") return n;
        n = n.parentNode
    }
    return null
}

function De(e) {
    for (var o = S(e), t = Pn(e); t && Ei(t) && ee(t).position === "static";) t = Pn(t);
    return t && (L(t) === "html" || L(t) === "body" && ee(t).position === "static") ? o : t || Go(e) || o
}

function qe(e) {
    return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y"
}

function Ze(e, o, t) {
    return ye(e, Qe(o, t))
}

function In(e, o, t) {
    var i = Ze(e, o, t);
    return i > t ? t : i
}

function kt() {
    return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
}

function Bt(e) {
    return Object.assign({}, kt(), e)
}

function Pt(e, o) {
    return o.reduce(function(t, i) {
        return t[i] = e, t
    }, {})
}
var Vo = function(o, t) {
    return o = typeof o == "function" ? o(Object.assign({}, t.rects, {
        placement: t.placement
    })) : o, Bt(typeof o != "number" ? o : Pt(o, Ae))
};

function $o(e) {
    var o, t = e.state,
        i = e.name,
        n = e.options,
        s = t.elements.arrow,
        r = t.modifiersData.popperOffsets,
        l = j(t.placement),
        a = qe(l),
        d = [C, x].indexOf(l) >= 0,
        c = d ? "height" : "width";
    if (!(!s || !r)) {
        var p = Vo(n.padding, t),
            f = Je(s),
            h = a === "y" ? T : C,
            D = a === "y" ? I : x,
            m = t.rects.reference[c] + t.rects.reference[a] - r[a] - t.rects.popper[c],
            g = r[a] - t.rects.reference[a],
            y = De(s),
            R = y ? a === "y" ? y.clientHeight || 0 : y.clientWidth || 0 : 0,
            E = m / 2 - g / 2,
            _ = p[h],
            v = R - f[c] - p[D],
            b = R / 2 - f[c] / 2 + E,
            M = Ze(_, b, v),
            U = a;
        t.modifiersData[i] = (o = {}, o[U] = M, o.centerOffset = M - b, o)
    }
}

function Lo(e) {
    var o = e.state,
        t = e.options,
        i = t.element,
        n = i === void 0 ? "[data-popper-arrow]" : i;
    n != null && (typeof n == "string" && (n = o.elements.popper.querySelector(n), !n) || xt(o.elements.popper, n) && (o.elements.arrow = n))
}
var ct = {
    name: "arrow",
    enabled: !0,
    phase: "main",
    fn: $o,
    effect: Lo,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"]
};

function fe(e) {
    return e.split("-")[1]
}
var jo = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto"
};

function Uo(e, o) {
    var t = e.x,
        i = e.y,
        n = o.devicePixelRatio || 1;
    return {
        x: Ne(t * n) / n || 0,
        y: Ne(i * n) / n || 0
    }
}

function Fn(e) {
    var o, t = e.popper,
        i = e.popperRect,
        n = e.placement,
        s = e.variation,
        r = e.offsets,
        l = e.position,
        a = e.gpuAcceleration,
        d = e.adaptive,
        c = e.roundOffsets,
        p = e.isFixed,
        f = r.x,
        h = f === void 0 ? 0 : f,
        D = r.y,
        m = D === void 0 ? 0 : D,
        g = typeof c == "function" ? c({
            x: h,
            y: m
        }) : {
            x: h,
            y: m
        };
    h = g.x, m = g.y;
    var y = r.hasOwnProperty("x"),
        R = r.hasOwnProperty("y"),
        E = C,
        _ = T,
        v = window;
    if (d) {
        var b = De(t),
            M = "clientHeight",
            U = "clientWidth";
        if (b === S(t) && (b = z(t), ee(b).position !== "static" && l === "absolute" && (M = "scrollHeight", U = "scrollWidth")), b = b, n === T || (n === C || n === x) && s === Ie) {
            _ = I;
            var $ = p && b === v && v.visualViewport ? v.visualViewport.height : b[M];
            m -= $ - i.height, m *= a ? 1 : -1
        }
        if (n === C || (n === T || n === I) && s === Ie) {
            E = x;
            var F = p && b === v && v.visualViewport ? v.visualViewport.width : b[U];
            h -= F - i.width, h *= a ? 1 : -1
        }
    }
    var Y = Object.assign({
            position: l
        }, d && jo),
        _e = c === !0 ? Uo({
            x: h,
            y: m
        }, S(t)) : {
            x: h,
            y: m
        };
    if (h = _e.x, m = _e.y, a) {
        var q;
        return Object.assign({}, Y, (q = {}, q[_] = R ? "0" : "", q[E] = y ? "0" : "", q.transform = (v.devicePixelRatio || 1) <= 1 ? "translate(" + h + "px, " + m + "px)" : "translate3d(" + h + "px, " + m + "px, 0)", q))
    }
    return Object.assign({}, Y, (o = {}, o[_] = R ? m + "px" : "", o[E] = y ? h + "px" : "", o.transform = "", o))
}

function Wo(e) {
    var o = e.state,
        t = e.options,
        i = t.gpuAcceleration,
        n = i === void 0 ? !0 : i,
        s = t.adaptive,
        r = s === void 0 ? !0 : s,
        l = t.roundOffsets,
        a = l === void 0 ? !0 : l,
        d = {
            placement: j(o.placement),
            variation: fe(o.placement),
            popper: o.elements.popper,
            popperRect: o.rects.popper,
            gpuAcceleration: n,
            isFixed: o.options.strategy === "fixed"
        };
    o.modifiersData.popperOffsets != null && (o.styles.popper = Object.assign({}, o.styles.popper, Fn(Object.assign({}, d, {
        offsets: o.modifiersData.popperOffsets,
        position: o.options.strategy,
        adaptive: r,
        roundOffsets: a
    })))), o.modifiersData.arrow != null && (o.styles.arrow = Object.assign({}, o.styles.arrow, Fn(Object.assign({}, d, {
        offsets: o.modifiersData.arrow,
        position: "absolute",
        adaptive: !1,
        roundOffsets: a
    })))), o.attributes.popper = Object.assign({}, o.attributes.popper, {
        "data-popper-placement": o.placement
    })
}
var dt = {
    name: "computeStyles",
    enabled: !0,
    phase: "beforeWrite",
    fn: Wo,
    data: {}
};
var ti = {
    passive: !0
};

function zo(e) {
    var o = e.state,
        t = e.instance,
        i = e.options,
        n = i.scroll,
        s = n === void 0 ? !0 : n,
        r = i.resize,
        l = r === void 0 ? !0 : r,
        a = S(o.elements.popper),
        d = [].concat(o.scrollParents.reference, o.scrollParents.popper);
    return s && d.forEach(function(c) {
            c.addEventListener("scroll", t.update, ti)
        }), l && a.addEventListener("resize", t.update, ti),
        function() {
            s && d.forEach(function(c) {
                c.removeEventListener("scroll", t.update, ti)
            }), l && a.removeEventListener("resize", t.update, ti)
        }
}
var ut = {
    name: "eventListeners",
    enabled: !0,
    phase: "write",
    fn: function() {},
    effect: zo,
    data: {}
};
var Yo = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
};

function ht(e) {
    return e.replace(/left|right|bottom|top/g, function(o) {
        return Yo[o]
    })
}
var Ko = {
    start: "end",
    end: "start"
};

function ii(e) {
    return e.replace(/start|end/g, function(o) {
        return Ko[o]
    })
}

function Xe(e) {
    var o = S(e),
        t = o.pageXOffset,
        i = o.pageYOffset;
    return {
        scrollLeft: t,
        scrollTop: i
    }
}

function et(e) {
    return pe(z(e)).left + Xe(e).scrollLeft
}

function xi(e, o) {
    var t = S(e),
        i = z(e),
        n = t.visualViewport,
        s = i.clientWidth,
        r = i.clientHeight,
        l = 0,
        a = 0;
    if (n) {
        s = n.width, r = n.height;
        var d = Et();
        (d || !d && o === "fixed") && (l = n.offsetLeft, a = n.offsetTop)
    }
    return {
        width: s,
        height: r,
        x: l + et(e),
        y: a
    }
}

function ki(e) {
    var o, t = z(e),
        i = Xe(e),
        n = (o = e.ownerDocument) == null ? void 0 : o.body,
        s = ye(t.scrollWidth, t.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0),
        r = ye(t.scrollHeight, t.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0),
        l = -i.scrollLeft + et(e),
        a = -i.scrollTop;
    return ee(n || t).direction === "rtl" && (l += ye(t.clientWidth, n ? n.clientWidth : 0) - s), {
        width: s,
        height: r,
        x: l,
        y: a
    }
}

function tt(e) {
    var o = ee(e),
        t = o.overflow,
        i = o.overflowX,
        n = o.overflowY;
    return /auto|scroll|overlay|hidden/.test(t + n + i)
}

function ni(e) {
    return ["html", "body", "#document"].indexOf(L(e)) >= 0 ? e.ownerDocument.body : V(e) && tt(e) ? e : ni(Ce(e))
}

function Fe(e, o) {
    var t;
    o === void 0 && (o = []);
    var i = ni(e),
        n = i === ((t = e.ownerDocument) == null ? void 0 : t.body),
        s = S(i),
        r = n ? [s].concat(s.visualViewport || [], tt(i) ? i : []) : i,
        l = o.concat(r);
    return n ? l : l.concat(Fe(Ce(r)))
}

function pt(e) {
    return Object.assign({}, e, {
        left: e.x,
        top: e.y,
        right: e.x + e.width,
        bottom: e.y + e.height
    })
}

function Qo(e, o) {
    var t = pe(e, !1, o === "fixed");
    return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t
}

function Hn(e, o, t) {
    return o === Ct ? pt(xi(e, t)) : he(o) ? Qo(o, t) : pt(ki(z(e)))
}

function Jo(e) {
    var o = Fe(Ce(e)),
        t = ["absolute", "fixed"].indexOf(ee(e).position) >= 0,
        i = t && V(e) ? De(e) : e;
    return he(i) ? o.filter(function(n) {
        return he(n) && xt(n, i) && L(n) !== "body"
    }) : []
}

function Bi(e, o, t, i) {
    var n = o === "clippingParents" ? Jo(e) : [].concat(o),
        s = [].concat(n, [t]),
        r = s[0],
        l = s.reduce(function(a, d) {
            var c = Hn(e, d, i);
            return a.top = ye(c.top, a.top), a.right = Qe(c.right, a.right), a.bottom = Qe(c.bottom, a.bottom), a.left = ye(c.left, a.left), a
        }, Hn(e, r, i));
    return l.width = l.right - l.left, l.height = l.bottom - l.top, l.x = l.left, l.y = l.top, l
}

function It(e) {
    var o = e.reference,
        t = e.element,
        i = e.placement,
        n = i ? j(i) : null,
        s = i ? fe(i) : null,
        r = o.x + o.width / 2 - t.width / 2,
        l = o.y + o.height / 2 - t.height / 2,
        a;
    switch (n) {
        case T:
            a = {
                x: r,
                y: o.y - t.height
            };
            break;
        case I:
            a = {
                x: r,
                y: o.y + o.height
            };
            break;
        case x:
            a = {
                x: o.x + o.width,
                y: l
            };
            break;
        case C:
            a = {
                x: o.x - t.width,
                y: l
            };
            break;
        default:
            a = {
                x: o.x,
                y: o.y
            }
    }
    var d = n ? qe(n) : null;
    if (d != null) {
        var c = d === "y" ? "height" : "width";
        switch (s) {
            case we:
                a[d] = a[d] - (o[c] / 2 - t[c] / 2);
                break;
            case Ie:
                a[d] = a[d] + (o[c] / 2 - t[c] / 2);
                break;
            default:
        }
    }
    return a
}

function te(e, o) {
    o === void 0 && (o = {});
    var t = o,
        i = t.placement,
        n = i === void 0 ? e.placement : i,
        s = t.strategy,
        r = s === void 0 ? e.strategy : s,
        l = t.boundary,
        a = l === void 0 ? Ni : l,
        d = t.rootBoundary,
        c = d === void 0 ? Ct : d,
        p = t.elementContext,
        f = p === void 0 ? Ke : p,
        h = t.altBoundary,
        D = h === void 0 ? !1 : h,
        m = t.padding,
        g = m === void 0 ? 0 : m,
        y = Bt(typeof g != "number" ? g : Pt(g, Ae)),
        R = f === Ke ? Ci : Ke,
        E = e.rects.popper,
        _ = e.elements[D ? R : f],
        v = Bi(he(_) ? _ : _.contextElement || z(e.elements.popper), a, c, r),
        b = pe(e.elements.reference),
        M = It({
            reference: b,
            element: E,
            strategy: "absolute",
            placement: n
        }),
        U = pt(Object.assign({}, E, M)),
        $ = f === Ke ? U : b,
        F = {
            top: v.top - $.top + y.top,
            bottom: $.bottom - v.bottom + y.bottom,
            left: v.left - $.left + y.left,
            right: $.right - v.right + y.right
        },
        Y = e.modifiersData.offset;
    if (f === Ke && Y) {
        var _e = Y[n];
        Object.keys(F).forEach(function(q) {
            var He = [x, I].indexOf(q) >= 0 ? 1 : -1,
                Ge = [T, I].indexOf(q) >= 0 ? "y" : "x";
            F[q] += _e[Ge] * He
        })
    }
    return F
}

function Pi(e, o) {
    o === void 0 && (o = {});
    var t = o,
        i = t.placement,
        n = t.boundary,
        s = t.rootBoundary,
        r = t.padding,
        l = t.flipVariations,
        a = t.allowedAutoPlacements,
        d = a === void 0 ? Rt : a,
        c = fe(i),
        p = c ? l ? ei : ei.filter(function(D) {
            return fe(D) === c
        }) : Ae,
        f = p.filter(function(D) {
            return d.indexOf(D) >= 0
        });
    f.length === 0 && (f = p);
    var h = f.reduce(function(D, m) {
        return D[m] = te(e, {
            placement: m,
            boundary: n,
            rootBoundary: s,
            padding: r
        })[j(m)], D
    }, {});
    return Object.keys(h).sort(function(D, m) {
        return h[D] - h[m]
    })
}

function qo(e) {
    if (j(e) === Nt) return [];
    var o = ht(e);
    return [ii(e), o, ii(o)]
}

function Zo(e) {
    var o = e.state,
        t = e.options,
        i = e.name;
    if (!o.modifiersData[i]._skip) {
        for (var n = t.mainAxis, s = n === void 0 ? !0 : n, r = t.altAxis, l = r === void 0 ? !0 : r, a = t.fallbackPlacements, d = t.padding, c = t.boundary, p = t.rootBoundary, f = t.altBoundary, h = t.flipVariations, D = h === void 0 ? !0 : h, m = t.allowedAutoPlacements, g = o.options.placement, y = j(g), R = y === g, E = a || (R || !D ? [ht(g)] : qo(g)), _ = [g].concat(E).reduce(function(ot, Re) {
                return ot.concat(j(Re) === Nt ? Pi(o, {
                    placement: Re,
                    boundary: c,
                    rootBoundary: p,
                    padding: d,
                    flipVariations: D,
                    allowedAutoPlacements: m
                }) : Re)
            }, []), v = o.rects.reference, b = o.rects.popper, M = new Map, U = !0, $ = _[0], F = 0; F < _.length; F++) {
            var Y = _[F],
                _e = j(Y),
                q = fe(Y) === we,
                He = [T, I].indexOf(_e) >= 0,
                Ge = He ? "width" : "height",
                re = te(o, {
                    placement: Y,
                    boundary: c,
                    rootBoundary: p,
                    altBoundary: f,
                    padding: d
                }),
                ge = He ? q ? x : C : q ? I : T;
            v[Ge] > b[Ge] && (ge = ht(ge));
            var $t = ht(ge),
                Ve = [];
            if (s && Ve.push(re[_e] <= 0), l && Ve.push(re[ge] <= 0, re[$t] <= 0), Ve.every(function(ot) {
                    return ot
                })) {
                $ = Y, U = !1;
                break
            }
            M.set(Y, Ve)
        }
        if (U)
            for (var Lt = D ? 3 : 1, ui = function(Re) {
                    var bt = _.find(function(Ut) {
                        var $e = M.get(Ut);
                        if ($e) return $e.slice(0, Re).every(function(hi) {
                            return hi
                        })
                    });
                    if (bt) return $ = bt, "break"
                }, vt = Lt; vt > 0; vt--) {
                var jt = ui(vt);
                if (jt === "break") break
            }
        o.placement !== $ && (o.modifiersData[i]._skip = !0, o.placement = $, o.reset = !0)
    }
}
var ft = {
    name: "flip",
    enabled: !0,
    phase: "main",
    fn: Zo,
    requiresIfExists: ["offset"],
    data: {
        _skip: !1
    }
};

function Gn(e, o, t) {
    return t === void 0 && (t = {
        x: 0,
        y: 0
    }), {
        top: e.top - o.height - t.y,
        right: e.right - o.width + t.x,
        bottom: e.bottom - o.height + t.y,
        left: e.left - o.width - t.x
    }
}

function Vn(e) {
    return [T, x, I, C].some(function(o) {
        return e[o] >= 0
    })
}

function Xo(e) {
    var o = e.state,
        t = e.name,
        i = o.rects.reference,
        n = o.rects.popper,
        s = o.modifiersData.preventOverflow,
        r = te(o, {
            elementContext: "reference"
        }),
        l = te(o, {
            altBoundary: !0
        }),
        a = Gn(r, i),
        d = Gn(l, n, s),
        c = Vn(a),
        p = Vn(d);
    o.modifiersData[t] = {
        referenceClippingOffsets: a,
        popperEscapeOffsets: d,
        isReferenceHidden: c,
        hasPopperEscaped: p
    }, o.attributes.popper = Object.assign({}, o.attributes.popper, {
        "data-popper-reference-hidden": c,
        "data-popper-escaped": p
    })
}
var oi = {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: Xo
};

function es(e, o, t) {
    var i = j(e),
        n = [C, T].indexOf(i) >= 0 ? -1 : 1,
        s = typeof t == "function" ? t(Object.assign({}, o, {
            placement: e
        })) : t,
        r = s[0],
        l = s[1];
    return r = r || 0, l = (l || 0) * n, [C, x].indexOf(i) >= 0 ? {
        x: l,
        y: r
    } : {
        x: r,
        y: l
    }
}

function ts(e) {
    var o = e.state,
        t = e.options,
        i = e.name,
        n = t.offset,
        s = n === void 0 ? [0, 0] : n,
        r = Rt.reduce(function(c, p) {
            return c[p] = es(p, o.rects, s), c
        }, {}),
        l = r[o.placement],
        a = l.x,
        d = l.y;
    o.modifiersData.popperOffsets != null && (o.modifiersData.popperOffsets.x += a, o.modifiersData.popperOffsets.y += d), o.modifiersData[i] = r
}
var _t = {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: ts
};

function is(e) {
    var o = e.state,
        t = e.name;
    o.modifiersData[t] = It({
        reference: o.rects.reference,
        element: o.rects.popper,
        strategy: "absolute",
        placement: o.placement
    })
}
var gt = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: is,
    data: {}
};

function Ii(e) {
    return e === "x" ? "y" : "x"
}

function ns(e) {
    var o = e.state,
        t = e.options,
        i = e.name,
        n = t.mainAxis,
        s = n === void 0 ? !0 : n,
        r = t.altAxis,
        l = r === void 0 ? !1 : r,
        a = t.boundary,
        d = t.rootBoundary,
        c = t.altBoundary,
        p = t.padding,
        f = t.tether,
        h = f === void 0 ? !0 : f,
        D = t.tetherOffset,
        m = D === void 0 ? 0 : D,
        g = te(o, {
            boundary: a,
            rootBoundary: d,
            padding: p,
            altBoundary: c
        }),
        y = j(o.placement),
        R = fe(o.placement),
        E = !R,
        _ = qe(y),
        v = Ii(_),
        b = o.modifiersData.popperOffsets,
        M = o.rects.reference,
        U = o.rects.popper,
        $ = typeof m == "function" ? m(Object.assign({}, o.rects, {
            placement: o.placement
        })) : m,
        F = typeof $ == "number" ? {
            mainAxis: $,
            altAxis: $
        } : Object.assign({
            mainAxis: 0,
            altAxis: 0
        }, $),
        Y = o.modifiersData.offset ? o.modifiersData.offset[o.placement] : null,
        _e = {
            x: 0,
            y: 0
        };
    if (b) {
        if (s) {
            var q, He = _ === "y" ? T : C,
                Ge = _ === "y" ? I : x,
                re = _ === "y" ? "height" : "width",
                ge = b[_],
                $t = ge + g[He],
                Ve = ge - g[Ge],
                Lt = h ? -U[re] / 2 : 0,
                ui = R === we ? M[re] : U[re],
                vt = R === we ? -U[re] : -M[re],
                jt = o.elements.arrow,
                ot = h && jt ? Je(jt) : {
                    width: 0,
                    height: 0
                },
                Re = o.modifiersData["arrow#persistent"] ? o.modifiersData["arrow#persistent"].padding : kt(),
                bt = Re[He],
                Ut = Re[Ge],
                $e = Ze(0, M[re], ot[re]),
                hi = E ? M[re] / 2 - Lt - $e - bt - F.mainAxis : ui - $e - bt - F.mainAxis,
                Ro = E ? -M[re] / 2 + Lt + $e + Ut + F.mainAxis : vt + $e + Ut + F.mainAxis,
                pi = o.elements.arrow && De(o.elements.arrow),
                Eo = pi ? _ === "y" ? pi.clientTop || 0 : pi.clientLeft || 0 : 0,
                Zi = (q = Y?.[_]) != null ? q : 0,
                xo = ge + hi - Zi - Eo,
                ko = ge + Ro - Zi,
                Xi = Ze(h ? Qe($t, xo) : $t, ge, h ? ye(Ve, ko) : Ve);
            b[_] = Xi, _e[_] = Xi - ge
        }
        if (l) {
            var en, Bo = _ === "x" ? T : C,
                Po = _ === "x" ? I : x,
                Le = b[v],
                Wt = v === "y" ? "height" : "width",
                tn = Le + g[Bo],
                nn = Le - g[Po],
                fi = [T, C].indexOf(y) !== -1,
                on = (en = Y?.[v]) != null ? en : 0,
                sn = fi ? tn : Le - M[Wt] - U[Wt] - on + F.altAxis,
                rn = fi ? Le + M[Wt] + U[Wt] - on - F.altAxis : nn,
                an = h && fi ? In(sn, Le, rn) : Ze(h ? sn : tn, Le, h ? rn : nn);
            b[v] = an, _e[v] = an - Le
        }
        o.modifiersData[i] = _e
    }
}
var mt = {
    name: "preventOverflow",
    enabled: !0,
    phase: "main",
    fn: ns,
    requiresIfExists: ["offset"]
};

function Fi(e) {
    return {
        scrollLeft: e.scrollLeft,
        scrollTop: e.scrollTop
    }
}

function Hi(e) {
    return e === S(e) || !V(e) ? Xe(e) : Fi(e)
}

function os(e) {
    var o = e.getBoundingClientRect(),
        t = Ne(o.width) / e.offsetWidth || 1,
        i = Ne(o.height) / e.offsetHeight || 1;
    return t !== 1 || i !== 1
}

function Gi(e, o, t) {
    t === void 0 && (t = !1);
    var i = V(o),
        n = V(o) && os(o),
        s = z(o),
        r = pe(e, n, t),
        l = {
            scrollLeft: 0,
            scrollTop: 0
        },
        a = {
            x: 0,
            y: 0
        };
    return (i || !i && !t) && ((L(o) !== "body" || tt(s)) && (l = Hi(o)), V(o) ? (a = pe(o, !0), a.x += o.clientLeft, a.y += o.clientTop) : s && (a.x = et(s))), {
        x: r.left + l.scrollLeft - a.x,
        y: r.top + l.scrollTop - a.y,
        width: r.width,
        height: r.height
    }
}

function ss(e) {
    var o = new Map,
        t = new Set,
        i = [];
    e.forEach(function(s) {
        o.set(s.name, s)
    });

    function n(s) {
        t.add(s.name);
        var r = [].concat(s.requires || [], s.requiresIfExists || []);
        r.forEach(function(l) {
            if (!t.has(l)) {
                var a = o.get(l);
                a && n(a)
            }
        }), i.push(s)
    }
    return e.forEach(function(s) {
        t.has(s.name) || n(s)
    }), i
}

function Vi(e) {
    var o = ss(e);
    return Ri.reduce(function(t, i) {
        return t.concat(o.filter(function(n) {
            return n.phase === i
        }))
    }, [])
}

function $i(e) {
    var o;
    return function() {
        return o || (o = new Promise(function(t) {
            Promise.resolve().then(function() {
                o = void 0, t(e())
            })
        })), o
    }
}

function Li(e) {
    var o = e.reduce(function(t, i) {
        var n = t[i.name];
        return t[i.name] = n ? Object.assign({}, n, i, {
            options: Object.assign({}, n.options, i.options),
            data: Object.assign({}, n.data, i.data)
        }) : i, t
    }, {});
    return Object.keys(o).map(function(t) {
        return o[t]
    })
}
var $n = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute"
};

function Ln() {
    for (var e = arguments.length, o = new Array(e), t = 0; t < e; t++) o[t] = arguments[t];
    return !o.some(function(i) {
        return !(i && typeof i.getBoundingClientRect == "function")
    })
}

function it(e) {
    e === void 0 && (e = {});
    var o = e,
        t = o.defaultModifiers,
        i = t === void 0 ? [] : t,
        n = o.defaultOptions,
        s = n === void 0 ? $n : n;
    return function(l, a, d) {
        d === void 0 && (d = s);
        var c = {
                placement: "bottom",
                orderedModifiers: [],
                options: Object.assign({}, $n, s),
                modifiersData: {},
                elements: {
                    reference: l,
                    popper: a
                },
                attributes: {},
                styles: {}
            },
            p = [],
            f = !1,
            h = {
                state: c,
                setOptions: function(y) {
                    var R = typeof y == "function" ? y(c.options) : y;
                    m(), c.options = Object.assign({}, s, c.options, R), c.scrollParents = {
                        reference: he(l) ? Fe(l) : l.contextElement ? Fe(l.contextElement) : [],
                        popper: Fe(a)
                    };
                    var E = Vi(Li([].concat(i, c.options.modifiers)));
                    return c.orderedModifiers = E.filter(function(_) {
                        return _.enabled
                    }), D(), h.update()
                },
                forceUpdate: function() {
                    if (!f) {
                        var y = c.elements,
                            R = y.reference,
                            E = y.popper;
                        if (Ln(R, E)) {
                            c.rects = {
                                reference: Gi(R, De(E), c.options.strategy === "fixed"),
                                popper: Je(E)
                            }, c.reset = !1, c.placement = c.options.placement, c.orderedModifiers.forEach(function(F) {
                                return c.modifiersData[F.name] = Object.assign({}, F.data)
                            });
                            for (var _ = 0; _ < c.orderedModifiers.length; _++) {
                                if (c.reset === !0) {
                                    c.reset = !1, _ = -1;
                                    continue
                                }
                                var v = c.orderedModifiers[_],
                                    b = v.fn,
                                    M = v.options,
                                    U = M === void 0 ? {} : M,
                                    $ = v.name;
                                typeof b == "function" && (c = b({
                                    state: c,
                                    options: U,
                                    name: $,
                                    instance: h
                                }) || c)
                            }
                        }
                    }
                },
                update: $i(function() {
                    return new Promise(function(g) {
                        h.forceUpdate(), g(c)
                    })
                }),
                destroy: function() {
                    m(), f = !0
                }
            };
        if (!Ln(l, a)) return h;
        h.setOptions(d).then(function(g) {
            !f && d.onFirstUpdate && d.onFirstUpdate(g)
        });

        function D() {
            c.orderedModifiers.forEach(function(g) {
                var y = g.name,
                    R = g.options,
                    E = R === void 0 ? {} : R,
                    _ = g.effect;
                if (typeof _ == "function") {
                    var v = _({
                            state: c,
                            name: y,
                            instance: h,
                            options: E
                        }),
                        b = function() {};
                    p.push(v || b)
                }
            })
        }

        function m() {
            p.forEach(function(g) {
                return g()
            }), p = []
        }
        return h
    }
}
var jn = it();
var rs = [ut, gt, dt, at],
    si = it({
        defaultModifiers: rs
    });
var as = [ut, gt, dt, at, _t, ft, mt, ct, oi],
    Un = it({
        defaultModifiers: as
    });
var Zn = ["*"];
var cs = ["dialog"];
var ds = (e, o, t) => ({
        $implicit: e,
        pages: o,
        disabled: t
    }),
    us = e => ({
        disabled: !0,
        currentPage: e
    }),
    hs = (e, o, t) => ({
        disabled: e,
        $implicit: o,
        currentPage: t
    }),
    Ki = (e, o) => ({
        disabled: e,
        currentPage: o
    }),
    ps = e => ({
        disabled: e
    });

function fs(e, o) {
    e & 1 && (Q(0, "span", 13), Mt(1, 7), J())
}

function _s(e, o) {
    e & 1 && (Q(0, "span", 13), Mt(1, 8), J())
}

function gs(e, o) {
    e & 1 && (Q(0, "span", 13), Mt(1, 9), J())
}

function ms(e, o) {
    e & 1 && (Q(0, "span", 13), Mt(1, 10), J())
}

function vs(e, o) {
    e & 1 && Ot(0, "...")
}

function bs(e, o) {
    if (e & 1 && Ot(0), e & 2) {
        let t = o.$implicit;
        qt(t)
    }
}

function ys(e, o) {}

function Ds(e, o) {
    if (e & 1 && (Q(0, "a", 16), ae(1, ys, 0, 0, "ng-template", 12), J()), e & 2) {
        let t = w(2).$implicit,
            i = w(),
            n = Me(9);
        A(), ve("ngTemplateOutlet", (i.tplEllipsis == null ? null : i.tplEllipsis.templateRef) || n)("ngTemplateOutletContext", Mi(2, us, t))
    }
}

function ws(e, o) {}

function Ss(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "a", 18), le("click", function(n) {
            xe(t);
            let s = w().$implicit;
            return w(2).selectPage(s), ke(n.preventDefault())
        }), ae(1, ws, 0, 0, "ng-template", 12), J()
    }
    if (e & 2) {
        let t = w().$implicit,
            i = w(),
            n = i.$implicit,
            s = i.disabled,
            r = w(),
            l = Me(11);
        ne("tabindex", s ? "-1" : null)("aria-disabled", s ? "true" : null), A(), ve("ngTemplateOutlet", (r.tplNumber == null ? null : r.tplNumber.templateRef) || l)("ngTemplateOutletContext", Xt(4, hs, s, t, n))
    }
}

function Ts(e, o) {
    if (e & 1 && (Q(0, "li", 15), ae(1, Ds, 2, 4, "a", 16)(2, Ss, 2, 8, "a", 17), J()), e & 2) {
        let t = o.$implicit,
            i = w(),
            n = i.$implicit,
            s = i.disabled,
            r = w();
        G("active", t === n)("disabled", r.isEllipsis(t) || s), ne("aria-current", t === n ? "page" : null), A(), We(r.isEllipsis(t) ? 1 : 2)
    }
}

function Ms(e, o) {
    if (e & 1 && Qt(0, Ts, 3, 6, "li", 14, Kt), e & 2) {
        let t = o.pages;
        Jt(t)
    }
}

function Os(e, o) {}

function As(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "li", 15)(1, "a", 19), le("click", function(n) {
            return xe(t), w().selectPage(1), ke(n.preventDefault())
        }), ae(2, Os, 0, 0, "ng-template", 12), J()()
    }
    if (e & 2) {
        let t = w(),
            i = Me(1);
        G("disabled", t.previousDisabled()), A(), ne("tabindex", t.previousDisabled() ? "-1" : null)("aria-disabled", t.previousDisabled() ? "true" : null), A(), ve("ngTemplateOutlet", (t.tplFirst == null ? null : t.tplFirst.templateRef) || i)("ngTemplateOutletContext", Zt(6, Ki, t.previousDisabled(), t.page))
    }
}

function Ns(e, o) {}

function Cs(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "li", 15)(1, "a", 20), le("click", function(n) {
            xe(t);
            let s = w();
            return s.selectPage(s.page - 1), ke(n.preventDefault())
        }), ae(2, Ns, 0, 0, "ng-template", 12), J()()
    }
    if (e & 2) {
        let t = w(),
            i = Me(3);
        G("disabled", t.previousDisabled()), A(), ne("tabindex", t.previousDisabled() ? "-1" : null)("aria-disabled", t.previousDisabled() ? "true" : null), A(), ve("ngTemplateOutlet", (t.tplPrevious == null ? null : t.tplPrevious.templateRef) || i)("ngTemplateOutletContext", Mi(6, ps, t.previousDisabled()))
    }
}

function Rs(e, o) {}

function Es(e, o) {}

function xs(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "li", 15)(1, "a", 21), le("click", function(n) {
            xe(t);
            let s = w();
            return s.selectPage(s.page + 1), ke(n.preventDefault())
        }), ae(2, Es, 0, 0, "ng-template", 12), J()()
    }
    if (e & 2) {
        let t = w(),
            i = Me(5);
        G("disabled", t.nextDisabled()), A(), ne("tabindex", t.nextDisabled() ? "-1" : null)("aria-disabled", t.nextDisabled() ? "true" : null), A(), ve("ngTemplateOutlet", (t.tplNext == null ? null : t.tplNext.templateRef) || i)("ngTemplateOutletContext", Zt(6, Ki, t.nextDisabled(), t.page))
    }
}

function ks(e, o) {}

function Bs(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "li", 15)(1, "a", 22), le("click", function(n) {
            xe(t);
            let s = w();
            return s.selectPage(s.pageCount), ke(n.preventDefault())
        }), ae(2, ks, 0, 0, "ng-template", 12), J()()
    }
    if (e & 2) {
        let t = w(),
            i = Me(7);
        G("disabled", t.nextDisabled()), A(), ne("tabindex", t.nextDisabled() ? "-1" : null)("aria-disabled", t.nextDisabled() ? "true" : null), A(), ve("ngTemplateOutlet", (t.tplLast == null ? null : t.tplLast.templateRef) || i)("ngTemplateOutletContext", Zt(6, Ki, t.nextDisabled(), t.page))
    }
}

function Ps(e, o) {
    if (e & 1 && (Q(0, "span"), Ot(1), J()), e & 2) {
        let t = w().$implicit,
            i = w();
        Te(i.highlightClass), A(), qt(t)
    }
}

function Is(e, o) {
    if (e & 1 && (wn(0), Ot(1), Sn()), e & 2) {
        let t = w().$implicit;
        A(), qt(t)
    }
}

function Fs(e, o) {
    if (e & 1 && ae(0, Ps, 2, 4, "span", 0)(1, Is, 2, 1, "ng-container"), e & 2) {
        let t = o.$index;
        We(t % 2 !== 0 ? 0 : 1)
    }
}
var Hs = (e, o, t) => ({
    result: e,
    term: o,
    formatter: t
});

function Gs(e, o) {
    if (e & 1 && Dn(0, "ngb-highlight", 2), e & 2) {
        let t = o.result,
            i = o.term,
            n = o.formatter;
        ve("result", n(t))("term", i)
    }
}

function Vs(e, o) {}

function $s(e, o) {
    if (e & 1) {
        let t = ze();
        Q(0, "button", 3), le("mouseenter", function() {
            let n = xe(t).$index,
                s = w();
            return ke(s.markActive(n))
        })("click", function() {
            let n = xe(t).$implicit,
                s = w();
            return ke(s.select(n))
        }), ae(1, Vs, 0, 0, "ng-template", 4), J()
    }
    if (e & 2) {
        let t = o.$implicit,
            i = o.$index,
            n = w(),
            s = Me(1);
        G("active", i === n.activeIdx), ve("id", n.id + "-" + i), A(), ve("ngTemplateOutlet", n.resultTemplate || s)("ngTemplateOutletContext", Xt(5, Hs, t, n.term, n.formatter))
    }
}
var Xn = {
        animation: !0,
        transitionTimerDelayMs: 5
    },
    Ht = (() => {
        class e {
            constructor() {
                this.animation = Xn.animation
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Ls = (() => {
        class e {
            constructor() {
                this._ngbConfig = u(Ht), this.closeOthers = !1, this.destroyOnHide = !0
            }
            get animation() {
                return this._animation ?? this._ngbConfig.animation
            }
            set animation(t) {
                this._animation = t
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })();

function js(e) {
    let {
        transitionDelay: o,
        transitionDuration: t
    } = window.getComputedStyle(e), i = parseFloat(o), n = parseFloat(t);
    return (i + n) * 1e3
}

function Us(e) {
    return parseInt(`${e}`, 10)
}

function Ft(e) {
    return e != null ? `${e}` : ""
}

function Ws(e, o, t = 0) {
    return Math.max(Math.min(e, o), t)
}

function di(e) {
    return typeof e == "string"
}

function Wn(e) {
    return !isNaN(Us(e))
}

function nt(e) {
    return e != null
}

function eo(e) {
    return e && e.then
}

function zs(e) {
    return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
}

function Ys(e, o) {
    return !o || typeof e.closest > "u" ? null : e.closest(o)
}

function Gt(e) {
    return (e || document.body).getBoundingClientRect()
}

function Ks(e) {
    return o => new ln(t => {
        let i = r => e.run(() => t.next(r)),
            n = r => e.run(() => t.error(r)),
            s = () => e.run(() => t.complete());
        return o.subscribe({
            next: i,
            error: n,
            complete: s
        })
    })
}

function zn(e) {
    return e.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function to(e = document) {
    let o = e?.activeElement;
    return o ? o.shadowRoot ? to(o.shadowRoot) : o : null
}
var Qs = () => {},
    {
        transitionTimerDelayMs: Js
    } = Xn,
    ri = new Map,
    se = (e, o, t, i) => {
        let n = i.context || {},
            s = ri.get(o);
        if (s) switch (i.runningTransition) {
            case "continue":
                return dn;
            case "stop":
                e.run(() => s.transition$.complete()), n = Object.assign(s.context, n), ri.delete(o)
        }
        let r = t(o, i.animation, n) || Qs;
        if (!i.animation || window.getComputedStyle(o).transitionProperty === "none") return e.run(() => r()), st(void 0).pipe(Ks(e));
        let l = new k,
            a = new k,
            d = l.pipe(fn(!0));
        ri.set(o, {
            transition$: l,
            complete: () => {
                a.next(), a.complete()
            },
            context: n
        });
        let c = js(o);
        return e.runOutsideAngular(() => {
            let p = K(o, "transitionend").pipe(H(d), Ee(({
                    target: h
                }) => h === o)),
                f = hn(c + Js).pipe(H(d));
            gi(f, p, a).pipe(H(d)).subscribe(() => {
                ri.delete(o), e.run(() => {
                    r(), l.next(), l.complete()
                })
            })
        }), l.asObservable()
    };

function qs(e, o) {
    if (typeof navigator > "u") return "0px";
    let {
        classList: t
    } = e, i = t.contains("show");
    i || t.add("show"), e.style[o] = "";
    let n = e.getBoundingClientRect()[o] + "px";
    return i || t.remove("show"), n
}
var Zs = (e, o, t) => {
        let {
            direction: i,
            maxSize: n,
            dimension: s
        } = t, {
            classList: r
        } = e;

        function l() {
            r.add("collapse"), i === "show" ? r.add("show") : r.remove("show")
        }
        if (!o) {
            l();
            return
        }
        return n || (n = qs(e, s), t.maxSize = n, e.style[s] = i !== "show" ? n : "0px", r.remove("collapse", "collapsing", "show"), Gt(e), r.add("collapsing")), e.style[s] = i === "show" ? n : "0px", () => {
            l(), r.remove("collapsing"), e.style[s] = ""
        }
    },
    Xs = (() => {
        class e {
            constructor() {
                this._ngbConfig = u(Ht), this.horizontal = !1
            }
            get animation() {
                return this._animation ?? this._ngbConfig.animation
            }
            set animation(t) {
                this._animation = t
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Yn = (() => {
        class e {
            constructor() {
                this._config = u(Xs), this._element = u(de), this._zone = u(me), this.animation = this._config.animation, this._afterInit = !1, this._isCollapsed = !1, this.ngbCollapseChange = new O, this.horizontal = this._config.horizontal, this.shown = new O, this.hidden = new O
            }
            set collapsed(t) {
                this._isCollapsed !== t && (this._isCollapsed = t, this._afterInit && this._runTransitionWithEvents(t, this.animation))
            }
            ngOnInit() {
                this._runTransition(this._isCollapsed, !1), this._afterInit = !0
            }
            toggle(t = this._isCollapsed) {
                this.collapsed = !t, this.ngbCollapseChange.next(this._isCollapsed)
            }
            _runTransition(t, i) {
                return se(this._zone, this._element.nativeElement, Zs, {
                    animation: i,
                    runningTransition: "stop",
                    context: {
                        direction: t ? "hide" : "show",
                        dimension: this.horizontal ? "width" : "height"
                    }
                })
            }
            _runTransitionWithEvents(t, i) {
                this._runTransition(t, i).subscribe(() => {
                    t ? this.hidden.emit() : this.shown.emit()
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbCollapse", ""]
                    ],
                    hostVars: 2,
                    hostBindings: function(i, n) {
                        i & 2 && G("collapse-horizontal", n.horizontal)
                    },
                    inputs: {
                        animation: "animation",
                        collapsed: [0, "ngbCollapse", "collapsed"],
                        horizontal: "horizontal"
                    },
                    outputs: {
                        ngbCollapseChange: "ngbCollapseChange",
                        shown: "shown",
                        hidden: "hidden"
                    },
                    exportAs: ["ngbCollapse"]
                })
            }
        }
        return e
    })(),
    er = 0,
    Uu = (() => {
        class e {
            constructor() {
                this._vcr = u(Di), this._element = u(de).nativeElement, this._item = u(Vt), this._viewRef = null
            }
            ngAfterContentChecked() {
                this._bodyTpl && (this._item._shouldBeInDOM ? this._createViewIfNotExists() : this._destroyViewIfExists())
            }
            ngOnDestroy() {
                this._destroyViewIfExists()
            }
            _destroyViewIfExists() {
                this._viewRef?.destroy(), this._viewRef = null
            }
            _createViewIfNotExists() {
                if (!this._viewRef) {
                    this._viewRef = this._vcr.createEmbeddedView(this._bodyTpl), this._viewRef.detectChanges();
                    for (let t of this._viewRef.rootNodes) this._element.appendChild(t)
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordionBody", ""]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && oe(s, ue, 7), i & 2) {
                            let r;
                            Z(r = X()) && (n._bodyTpl = r.first)
                        }
                    },
                    hostAttrs: [1, "accordion-body"]
                })
            }
        }
        return e
    })(),
    tr = (() => {
        class e {
            constructor() {
                this.item = u(Vt), this.ngbCollapse = u(Yn)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordionCollapse", ""]
                    ],
                    hostAttrs: ["role", "region", 1, "accordion-collapse"],
                    hostVars: 2,
                    hostBindings: function(i, n) {
                        i & 2 && (Pe("id", n.item.collapseId), ne("aria-labelledby", n.item.toggleId))
                    },
                    exportAs: ["ngbAccordionCollapse"],
                    features: [yn([Yn])]
                })
            }
        }
        return e
    })(),
    Wu = (() => {
        class e {
            constructor() {
                this.item = u(Vt), this.accordion = u(io)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordionToggle", ""]
                    ],
                    hostVars: 5,
                    hostBindings: function(i, n) {
                        i & 1 && le("click", function() {
                            return !n.item.disabled && n.accordion.toggle(n.item.id)
                        }), i & 2 && (Pe("id", n.item.toggleId), ne("aria-controls", n.item.collapseId)("aria-expanded", !n.item.collapsed), G("collapsed", n.item.collapsed))
                    }
                })
            }
        }
        return e
    })();
var zu = (() => {
        class e {
            constructor() {
                this.item = u(Vt)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordionHeader", ""]
                    ],
                    hostAttrs: ["role", "heading", 1, "accordion-header"],
                    hostVars: 2,
                    hostBindings: function(i, n) {
                        i & 2 && G("collapsed", n.item.collapsed)
                    }
                })
            }
        }
        return e
    })(),
    Vt = (() => {
        class e {
            constructor() {
                this._accordion = u(io), this._cd = u(At), this._destroyRef = u(vn), this._collapsed = !0, this._id = `ngb-accordion-item-${er++}`, this._collapseAnimationRunning = !1, this.disabled = !1, this.show = new O, this.shown = new O, this.hide = new O, this.hidden = new O
            }
            set id(t) {
                di(t) && t !== "" && (this._id = t)
            }
            set destroyOnHide(t) {
                this._destroyOnHide = t
            }
            get destroyOnHide() {
                return this._destroyOnHide === void 0 ? this._accordion.destroyOnHide : this._destroyOnHide
            }
            set collapsed(t) {
                t ? this.collapse() : this.expand()
            }
            get collapsed() {
                return this._collapsed
            }
            get id() {
                return `${this._id}`
            }
            get toggleId() {
                return `${this.id}-toggle`
            }
            get collapseId() {
                return `${this.id}-collapse`
            }
            get _shouldBeInDOM() {
                return !this.collapsed || this._collapseAnimationRunning || !this.destroyOnHide
            }
            ngAfterContentInit() {
                let {
                    ngbCollapse: t
                } = this._collapse;
                t.animation = !1, t.collapsed = this.collapsed, t.animation = this._accordion.animation, t.hidden.pipe(Oi(this._destroyRef)).subscribe(() => {
                    this._collapseAnimationRunning = !1, this.hidden.emit(), this._accordion.hidden.emit(this.id)
                }), t.shown.pipe(Oi(this._destroyRef)).subscribe(() => {
                    this.shown.emit(), this._accordion.shown.emit(this.id)
                })
            }
            toggle() {
                this.collapsed = !this.collapsed
            }
            expand() {
                if (this.collapsed) {
                    if (!this._accordion._ensureCanExpand(this)) return;
                    this._collapsed = !1, this._cd.markForCheck(), this._cd.detectChanges(), this.show.emit(), this._accordion.show.emit(this.id), this._collapse.ngbCollapse.animation = this._accordion.animation, this._collapse.ngbCollapse.collapsed = !1
                }
            }
            collapse() {
                this.collapsed || (this._collapsed = !0, this._collapseAnimationRunning = !0, this._cd.markForCheck(), this.hide.emit(), this._accordion.hide.emit(this.id), this._collapse.ngbCollapse.animation = this._accordion.animation, this._collapse.ngbCollapse.collapsed = !0)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordionItem", ""]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && oe(s, tr, 7), i & 2) {
                            let r;
                            Z(r = X()) && (n._collapse = r.first)
                        }
                    },
                    hostAttrs: [1, "accordion-item"],
                    hostVars: 1,
                    hostBindings: function(i, n) {
                        i & 2 && Pe("id", n.id)
                    },
                    inputs: {
                        id: [0, "ngbAccordionItem", "id"],
                        destroyOnHide: "destroyOnHide",
                        disabled: "disabled",
                        collapsed: "collapsed"
                    },
                    outputs: {
                        show: "show",
                        shown: "shown",
                        hide: "hide",
                        hidden: "hidden"
                    },
                    exportAs: ["ngbAccordionItem"]
                })
            }
        }
        return e
    })(),
    io = (() => {
        class e {
            constructor() {
                this._config = u(Ls), this._anItemWasAlreadyExpandedDuringInitialisation = !1, this.animation = this._config.animation, this.closeOthers = this._config.closeOthers, this.destroyOnHide = this._config.destroyOnHide, this.show = new O, this.shown = new O, this.hide = new O, this.hidden = new O
            }
            toggle(t) {
                this._getItem(t)?.toggle()
            }
            expand(t) {
                this._getItem(t)?.expand()
            }
            expandAll() {
                this._items && (this.closeOthers ? this._items.find(t => !t.collapsed) || this._items.first.expand() : this._items.forEach(t => t.expand()))
            }
            collapse(t) {
                this._getItem(t)?.collapse()
            }
            collapseAll() {
                this._items?.forEach(t => t.collapse())
            }
            isExpanded(t) {
                let i = this._getItem(t);
                return i ? !i.collapsed : !1
            }
            _ensureCanExpand(t) {
                return this.closeOthers ? this._items ? (this._items.find(i => !i.collapsed && t !== i)?.collapse(), !0) : this._anItemWasAlreadyExpandedDuringInitialisation ? !1 : (this._anItemWasAlreadyExpandedDuringInitialisation = !0, !0) : !0
            }
            _getItem(t) {
                return this._items?.find(i => i.id === t)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbAccordion", ""]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && oe(s, Vt, 4), i & 2) {
                            let r;
                            Z(r = X()) && (n._items = r)
                        }
                    },
                    hostAttrs: [1, "accordion"],
                    inputs: {
                        animation: "animation",
                        closeOthers: "closeOthers",
                        destroyOnHide: "destroyOnHide"
                    },
                    outputs: {
                        show: "show",
                        shown: "shown",
                        hide: "hide",
                        hidden: "hidden"
                    },
                    exportAs: ["ngbAccordion"]
                })
            }
        }
        return e
    })();
var no = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var oo = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var so = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    ro = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })();
var ai = (e, o) => o ? o.some(t => t.contains(e)) : !1,
    Kn = (e, o) => !o || Ys(e, o) != null,
    ir = (() => {
        let e = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2,
            o = () => /Android/.test(navigator.userAgent);
        return typeof navigator < "u" ? !!navigator.userAgent && (e() || o()) : !1
    })(),
    nr = e => ir ? () => setTimeout(() => e(), 100) : e;

function ao(e, o, t, i, n, s, r, l) {
    t && e.runOutsideAngular(nr(() => {
        let a = f => {
                let h = f.target;
                return f.button === 2 || ai(h, r) ? !1 : t === "inside" ? ai(h, s) && Kn(h, l) : t === "outside" ? !ai(h, s) : Kn(h, l) || !ai(h, s)
            },
            d = K(o, "keydown").pipe(H(n), Ee(f => f.key === "Escape"), St(f => f.preventDefault())),
            c = K(o, "mousedown").pipe(je(a), H(n)),
            p = K(o, "mouseup").pipe(zt(c), Ee(([f, h]) => h), pn(0), H(n));
        gi([d.pipe(je(f => 0)), p.pipe(je(f => 1))]).subscribe(f => e.run(() => i(f)))
    }))
}
var lo = ["a[href]", "button:not([disabled])", 'input:not([disabled]):not([type="hidden"])', "select:not([disabled])", "textarea:not([disabled])", "[contenteditable]", '[tabindex]:not([tabindex="-1"])'].join(", ");

function Qi(e) {
    let o = Array.from(e.querySelectorAll(lo)).filter(t => t.tabIndex !== -1);
    return [o[0], o[o.length - 1]]
}
var co = (e, o, t, i = !1) => {
        e.runOutsideAngular(() => {
            let n = K(o, "focusin").pipe(H(t), je(s => s.target));
            K(o, "keydown").pipe(H(t), Ee(s => s.key === "Tab"), zt(n)).subscribe(([s, r]) => {
                let [l, a] = Qi(o);
                (r === l || r === o) && s.shiftKey && (a.focus(), s.preventDefault()), r === a && !s.shiftKey && (l.focus(), s.preventDefault())
            }), i && K(o, "click").pipe(H(t), zt(n), je(s => s[1])).subscribe(s => s.focus())
        })
    },
    or = (() => {
        class e {
            constructor() {
                this._element = u(be).documentElement
            }
            isRTL() {
                return (this._element.getAttribute("dir") || "").toLowerCase() === "rtl"
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    sr = /\s+/,
    rr = /  +/gi,
    ar = {
        top: ["top"],
        bottom: ["bottom"],
        start: ["left", "right"],
        left: ["left"],
        end: ["right", "left"],
        right: ["right"],
        "top-start": ["top-start", "top-end"],
        "top-left": ["top-start"],
        "top-end": ["top-end", "top-start"],
        "top-right": ["top-end"],
        "bottom-start": ["bottom-start", "bottom-end"],
        "bottom-left": ["bottom-start"],
        "bottom-end": ["bottom-end", "bottom-start"],
        "bottom-right": ["bottom-end"],
        "start-top": ["left-start", "right-start"],
        "left-top": ["left-start"],
        "start-bottom": ["left-end", "right-end"],
        "left-bottom": ["left-end"],
        "end-top": ["right-start", "left-start"],
        "right-top": ["right-start"],
        "end-bottom": ["right-end", "left-end"],
        "right-bottom": ["right-end"]
    };

function lr(e, o) {
    let [t, i] = ar[e];
    return o && i || t
}
var cr = /^left/,
    dr = /^right/,
    ur = /^start/,
    hr = /^end/;

function pr(e, o) {
    let [t, i] = o.split("-"), n = t.replace(cr, "start").replace(dr, "end"), s = [n];
    if (i) {
        let r = i;
        (t === "left" || t === "right") && (r = r.replace(ur, "top").replace(hr, "bottom")), s.push(`${n}-${r}`)
    }
    return e && (s = s.map(r => `${e}-${r}`)), s.join(" ")
}

function Qn({
    placement: e,
    baseClass: o
}, t) {
    let i = Array.isArray(e) ? e : e.split(sr),
        n = ["top", "bottom", "start", "end", "top-start", "top-end", "bottom-start", "bottom-end", "start-top", "start-bottom", "end-top", "end-bottom"],
        s = i.findIndex(d => d === "auto");
    s >= 0 && n.forEach(function(d) {
        i.find(c => c.search("^" + d) !== -1) == null && i.splice(s++, 1, d)
    });
    let r = i.map(d => lr(d, t.isRTL()));
    return {
        placement: r.shift(),
        modifiers: [{
            name: "bootstrapClasses",
            enabled: !!o,
            phase: "write",
            fn({
                state: d
            }) {
                let c = new RegExp(o + "(-[a-z]+)*", "gi"),
                    p = d.elements.popper,
                    f = d.placement,
                    h = p.className;
                h = h.replace(c, ""), h += ` ${pr(o,f)}`, h = h.trim().replace(rr, " "), p.className = h
            }
        }, ft, mt, ct, {
            enabled: !0,
            name: "flip",
            options: {
                fallbackPlacements: r
            }
        }, {
            enabled: !0,
            name: "preventOverflow",
            phase: "main",
            fn: function() {}
        }]
    }
}

function Jn(e) {
    return e
}

function uo() {
    let e = u(or),
        o = null;
    return {
        createPopper(t) {
            if (!o) {
                let n = (t.updatePopperOptions || Jn)(Qn(t, e));
                o = si(t.hostElement, t.targetElement, n)
            }
        },
        update() {
            o && o.update()
        },
        setOptions(t) {
            if (o) {
                let n = (t.updatePopperOptions || Jn)(Qn(t, e));
                o.setOptions(n)
            }
        },
        destroy() {
            o && (o.destroy(), o = null)
        }
    }
}

function ho(e) {
    return o => (o.modifiers.push(_t, {
        name: "offset",
        options: {
            offset: () => e
        }
    }), o)
}
var Yu = new Date(1882, 10, 12),
    Ku = new Date(2174, 10, 25);
var Qu = 1e3 * 60 * 60 * 24;
var Ji = 1080,
    fr = 24 * Ji,
    _r = 12 * Ji + 793,
    Ju = 29 * fr + _r,
    qu = 11 * Ji + 204;
var po = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    gr = (() => {
        class e {
            constructor() {
                this.autoClose = !0, this.placement = ["bottom-start", "bottom-end", "top-start", "top-end"], this.popperOptions = t => t, this.container = null
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    fo = (() => {
        class e {
            constructor() {
                this._disabled = !1, this.nativeElement = u(de).nativeElement, this.tabindex = 0
            }
            set disabled(t) {
                this._disabled = t === "" || t === !0
            }
            get disabled() {
                return this._disabled
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbDropdownItem", ""]
                    ],
                    hostAttrs: [1, "dropdown-item"],
                    hostVars: 3,
                    hostBindings: function(i, n) {
                        i & 2 && (Pe("tabIndex", n.disabled ? -1 : n.tabindex), G("disabled", n.disabled))
                    },
                    inputs: {
                        tabindex: "tabindex",
                        disabled: "disabled"
                    }
                })
            }
        }
        return e
    })(),
    Zu = (() => {
        class e {
            constructor() {
                this.item = u(fo)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["button", "ngbDropdownItem", ""]
                    ],
                    hostVars: 1,
                    hostBindings: function(i, n) {
                        i & 2 && Pe("disabled", n.item.disabled)
                    }
                })
            }
        }
        return e
    })(),
    mr = (() => {
        class e {
            constructor() {
                this.dropdown = u(_o), this.nativeElement = u(de).nativeElement
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbDropdownMenu", ""]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && oe(s, fo, 4), i & 2) {
                            let r;
                            Z(r = X()) && (n.menuItems = r)
                        }
                    },
                    hostAttrs: [1, "dropdown-menu"],
                    hostVars: 2,
                    hostBindings: function(i, n) {
                        i & 1 && le("keydown.ArrowUp", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.ArrowDown", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Home", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.End", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Enter", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Space", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Tab", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Shift.Tab", function(r) {
                            return n.dropdown.onKeyDown(r)
                        }), i & 2 && G("show", n.dropdown.isOpen())
                    }
                })
            }
        }
        return e
    })(),
    ji = (() => {
        class e {
            constructor() {
                this.dropdown = u(_o), this.nativeElement = u(de).nativeElement
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbDropdownAnchor", ""]
                    ],
                    hostAttrs: [1, "dropdown-toggle"],
                    hostVars: 3,
                    hostBindings: function(i, n) {
                        i & 2 && (ne("aria-expanded", n.dropdown.isOpen()), G("show", n.dropdown.isOpen()))
                    }
                })
            }
        }
        return e
    })(),
    Xu = (() => {
        class e extends ji {
            static {
                this.\u0275fac = (() => {
                    let t;
                    return function(n) {
                        return (t || (t = mn(e)))(n || e)
                    }
                })()
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbDropdownToggle", ""]
                    ],
                    hostAttrs: [1, "dropdown-toggle"],
                    hostVars: 3,
                    hostBindings: function(i, n) {
                        i & 1 && le("click", function() {
                            return n.dropdown.toggle()
                        })("keydown.ArrowUp", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.ArrowDown", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Home", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.End", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Tab", function(r) {
                            return n.dropdown.onKeyDown(r)
                        })("keydown.Shift.Tab", function(r) {
                            return n.dropdown.onKeyDown(r)
                        }), i & 2 && (ne("aria-expanded", n.dropdown.isOpen()), G("show", n.dropdown.isOpen()))
                    },
                    features: [Ti([{
                        provide: ji,
                        useExisting: vi(() => e)
                    }]), bn]
                })
            }
        }
        return e
    })(),
    _o = (() => {
        class e {
            constructor() {
                this._changeDetector = u(At), this._config = u(gr), this._document = u(be), this._injector = u(ie), this._ngZone = u(me), this._nativeElement = u(de).nativeElement, this._destroyCloseHandlers$ = new k, this._bodyContainer = null, this._positioning = uo(), this.autoClose = this._config.autoClose, this._open = !1, this.placement = this._config.placement, this.popperOptions = this._config.popperOptions, this.container = this._config.container, this.openChange = new O
            }
            ngOnInit() {
                this.display || (this.display = this._nativeElement.closest(".navbar") ? "static" : "dynamic")
            }
            ngAfterContentInit() {
                Ue(() => {
                    this._applyPlacementClasses(), this._open && this._setCloseHandlers()
                }, {
                    phase: Se.Write,
                    injector: this._injector
                })
            }
            ngOnChanges(t) {
                if (t.container && this._open && this._applyContainer(this.container), t.placement && !t.placement.firstChange && (this._positioning.setOptions({
                        hostElement: this._anchor.nativeElement,
                        targetElement: this._bodyContainer || this._menu.nativeElement,
                        placement: this.placement
                    }), this._applyPlacementClasses()), t.dropdownClass) {
                    let {
                        currentValue: i,
                        previousValue: n
                    } = t.dropdownClass;
                    this._applyCustomDropdownClass(i, n)
                }
                t.autoClose && this._open && (this.autoClose = t.autoClose.currentValue, this._setCloseHandlers())
            }
            isOpen() {
                return this._open
            }
            open() {
                this._open || (this._open = !0, this._applyContainer(this.container), this.openChange.emit(!0), this._setCloseHandlers(), this._anchor && (this._anchor.nativeElement.focus(), this.display === "dynamic" && this._ngZone.runOutsideAngular(() => {
                    this._positioning.createPopper({
                        hostElement: this._anchor.nativeElement,
                        targetElement: this._bodyContainer || this._menu.nativeElement,
                        placement: this.placement,
                        updatePopperOptions: t => this.popperOptions(ho([0, 2])(t))
                    }), this._applyPlacementClasses(), this._afterRenderRef = yi(() => {
                        this._positionMenu()
                    }, {
                        phase: Se.Write,
                        injector: this._injector
                    })
                })))
            }
            _setCloseHandlers() {
                this._destroyCloseHandlers$.next(), ao(this._ngZone, this._document, this.autoClose, t => {
                    this.close(), t === 0 && this._anchor.nativeElement.focus()
                }, this._destroyCloseHandlers$, this._menu ? [this._menu.nativeElement] : [], this._anchor ? [this._anchor.nativeElement] : [], ".dropdown-item,.dropdown-divider")
            }
            close() {
                this._open && (this._open = !1, this._resetContainer(), this._positioning.destroy(), this._afterRenderRef?.destroy(), this._destroyCloseHandlers$.next(), this.openChange.emit(!1), this._changeDetector.markForCheck())
            }
            toggle() {
                this.isOpen() ? this.close() : this.open()
            }
            ngOnDestroy() {
                this.close()
            }
            onKeyDown(t) {
                let {
                    key: i
                } = t, n = this._getMenuElements(), s = -1, r = null, l = this._isEventFromToggle(t);
                if (!l && n.length && n.forEach((a, d) => {
                        a.contains(t.target) && (r = a), a === to(this._document) && (s = d)
                    }), i === " " || i === "Enter") {
                    r && (this.autoClose === !0 || this.autoClose === "inside") && K(r, "click").pipe(wt(1)).subscribe(() => this.close());
                    return
                }
                if (i === "Tab") {
                    if (t.target && this.isOpen() && this.autoClose)
                        if (this._anchor.nativeElement === t.target) {
                            this.container === "body" && !t.shiftKey ? (this._menu.nativeElement.setAttribute("tabindex", "0"), this._menu.nativeElement.focus(), this._menu.nativeElement.removeAttribute("tabindex")) : t.shiftKey && this.close();
                            return
                        } else if (this.container === "body") {
                        let a = this._menu.nativeElement.querySelectorAll(lo);
                        t.shiftKey && t.target === a[0] ? (this._anchor.nativeElement.focus(), t.preventDefault()) : !t.shiftKey && t.target === a[a.length - 1] && (this._anchor.nativeElement.focus(), this.close())
                    } else K(t.target, "focusout").pipe(wt(1)).subscribe(({
                        relatedTarget: a
                    }) => {
                        this._nativeElement.contains(a) || this.close()
                    });
                    return
                }
                if (l || r) {
                    if (this.open(), n.length) {
                        switch (i) {
                            case "ArrowDown":
                                s = Math.min(s + 1, n.length - 1);
                                break;
                            case "ArrowUp":
                                if (this._isDropup() && s === -1) {
                                    s = n.length - 1;
                                    break
                                }
                                s = Math.max(s - 1, 0);
                                break;
                            case "Home":
                                s = 0;
                                break;
                            case "End":
                                s = n.length - 1;
                                break
                        }
                        n[s].focus()
                    }
                    t.preventDefault()
                }
            }
            _isDropup() {
                return this._nativeElement.classList.contains("dropup")
            }
            _isEventFromToggle(t) {
                return this._anchor.nativeElement.contains(t.target)
            }
            _getMenuElements() {
                return this._menu ? this._menu.menuItems.filter(({
                    disabled: t
                }) => !t).map(({
                    nativeElement: t
                }) => t) : []
            }
            _positionMenu() {
                let t = this._menu;
                this.isOpen() && t && (this.display === "dynamic" ? (this._positioning.update(), this._applyPlacementClasses()) : this._applyPlacementClasses(this._getFirstPlacement(this.placement)))
            }
            _getFirstPlacement(t) {
                return Array.isArray(t) ? t[0] : t.split(" ")[0]
            }
            _resetContainer() {
                this._menu && this._nativeElement.appendChild(this._menu.nativeElement), this._bodyContainer && (this._document.body.removeChild(this._bodyContainer), this._bodyContainer = null)
            }
            _applyContainer(t = null) {
                if (this._resetContainer(), t === "body") {
                    let i = this._menu.nativeElement,
                        n = this._bodyContainer = this._bodyContainer || this._document.createElement("div");
                    n.style.position = "absolute", i.style.position = "static", n.style.zIndex = "1055", n.appendChild(i), this._document.body.appendChild(n)
                }
                this._applyCustomDropdownClass(this.dropdownClass)
            }
            _applyCustomDropdownClass(t, i) {
                let n = this.container === "body" ? this._bodyContainer : this._nativeElement;
                n && (i && n.classList.remove(i), t && n.classList.add(t))
            }
            _applyPlacementClasses(t) {
                if (this._menu) {
                    t || (t = this._getFirstPlacement(this.placement)), this._nativeElement.classList.remove("dropup", "dropdown"), this.display === "static" ? this._menu.nativeElement.setAttribute("data-bs-popper", "static") : this._menu.nativeElement.removeAttribute("data-bs-popper");
                    let i = t.search("^top") !== -1 ? "dropup" : "dropdown";
                    this._nativeElement.classList.add(i), this._bodyContainer && (this._bodyContainer.classList.remove("dropup", "dropdown"), this._bodyContainer.classList.add(i))
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["", "ngbDropdown", ""]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && (oe(s, mr, 5), oe(s, ji, 5)), i & 2) {
                            let r;
                            Z(r = X()) && (n._menu = r.first), Z(r = X()) && (n._anchor = r.first)
                        }
                    },
                    hostVars: 2,
                    hostBindings: function(i, n) {
                        i & 2 && G("show", n.isOpen())
                    },
                    inputs: {
                        autoClose: "autoClose",
                        dropdownClass: "dropdownClass",
                        _open: [0, "open", "_open"],
                        placement: "placement",
                        popperOptions: "popperOptions",
                        container: "container",
                        display: "display"
                    },
                    outputs: {
                        openChange: "openChange"
                    },
                    exportAs: ["ngbDropdown"],
                    features: [Tt]
                })
            }
        }
        return e
    })();
var go = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    vr = (() => {
        class e {
            constructor() {
                this._ngbConfig = u(Ht), this.backdrop = !0, this.fullscreen = !1, this.keyboard = !0
            }
            get animation() {
                return this._animation ?? this._ngbConfig.animation
            }
            set animation(t) {
                this._animation = t
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    ce = class {
        constructor(o, t, i) {
            this.nodes = o, this.viewRef = t, this.componentRef = i
        }
    },
    Ui = class {
        constructor(o) {
            this._componentType = o, this._windowRef = null, this._contentRef = null, this._document = u(be), this._applicationRef = u(Yt), this._injector = u(ie), this._viewContainerRef = u(Di), this._ngZone = u(me)
        }
        open(o, t, i = !1) {
            this._windowRef || (this._contentRef = this._getContentRef(o, t), this._windowRef = this._viewContainerRef.createComponent(this._componentType, {
                injector: this._injector,
                projectableNodes: this._contentRef.nodes
            }));
            let {
                nativeElement: n
            } = this._windowRef.location, s = new k;
            Ue(() => {
                s.next(), s.complete()
            }, {
                injector: this._injector,
                phase: Se.MixedReadWrite
            });
            let r = s.pipe(un(() => se(this._ngZone, n, ({
                classList: l
            }) => l.add("show"), {
                animation: i,
                runningTransition: "continue"
            })));
            return {
                windowRef: this._windowRef,
                transition$: r
            }
        }
        close(o = !1) {
            return this._windowRef ? se(this._ngZone, this._windowRef.location.nativeElement, ({
                classList: t
            }) => t.remove("show"), {
                animation: o,
                runningTransition: "stop"
            }).pipe(St(() => {
                this._windowRef?.destroy(), this._contentRef?.viewRef?.destroy(), this._windowRef = null, this._contentRef = null
            })) : st(void 0)
        }
        _getContentRef(o, t) {
            if (o)
                if (o instanceof ue) {
                    let i = o.createEmbeddedView(t);
                    return this._applicationRef.attachView(i), new ce([i.rootNodes], i)
                } else return new ce([
                    [this._document.createTextNode(`${o}`)]
                ]);
            else return new ce([])
        }
    },
    mo = (() => {
        class e {
            constructor() {
                this._document = u(be)
            }
            hide() {
                let t = Math.abs(window.innerWidth - this._document.documentElement.clientWidth),
                    i = this._document.body,
                    n = i.style,
                    {
                        overflow: s,
                        paddingRight: r
                    } = n;
                if (t > 0) {
                    let l = parseFloat(window.getComputedStyle(i).paddingRight);
                    n.paddingRight = `${l+t}px`
                }
                return n.overflow = "hidden", () => {
                    t > 0 && (n.paddingRight = r), n.overflow = s
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    br = (() => {
        class e {
            constructor() {
                this._nativeElement = u(de).nativeElement, this._zone = u(me), this._injector = u(ie)
            }
            ngOnInit() {
                Ue(() => se(this._zone, this._nativeElement, (t, i) => {
                    i && Gt(t), t.classList.add("show")
                }, {
                    animation: this.animation,
                    runningTransition: "continue"
                }), {
                    injector: this._injector,
                    phase: Se.MixedReadWrite
                })
            }
            hide() {
                return se(this._zone, this._nativeElement, ({
                    classList: t
                }) => t.remove("show"), {
                    animation: this.animation,
                    runningTransition: "stop"
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-modal-backdrop"]
                    ],
                    hostAttrs: [2, "z-index", "1055"],
                    hostVars: 6,
                    hostBindings: function(i, n) {
                        i & 2 && (Te("modal-backdrop" + (n.backdropClass ? " " + n.backdropClass : "")), G("show", !n.animation)("fade", n.animation))
                    },
                    inputs: {
                        animation: "animation",
                        backdropClass: "backdropClass"
                    },
                    decls: 0,
                    vars: 0,
                    template: function(i, n) {},
                    encapsulation: 2
                })
            }
        }
        return e
    })(),
    li = class {
        update(o) {}
        close(o) {}
        dismiss(o) {}
    },
    yr = ["animation", "ariaLabelledBy", "ariaDescribedBy", "backdrop", "centered", "fullscreen", "keyboard", "scrollable", "size", "windowClass", "modalDialogClass"],
    Dr = ["animation", "backdropClass"],
    Wi = class {
        _applyWindowOptions(o, t) {
            yr.forEach(i => {
                nt(t[i]) && (o[i] = t[i])
            })
        }
        _applyBackdropOptions(o, t) {
            Dr.forEach(i => {
                nt(t[i]) && (o[i] = t[i])
            })
        }
        update(o) {
            this._applyWindowOptions(this._windowCmptRef.instance, o), this._backdropCmptRef && this._backdropCmptRef.instance && this._applyBackdropOptions(this._backdropCmptRef.instance, o)
        }
        get componentInstance() {
            if (this._contentRef && this._contentRef.componentRef) return this._contentRef.componentRef.instance
        }
        get closed() {
            return this._closed.asObservable().pipe(H(this._hidden))
        }
        get dismissed() {
            return this._dismissed.asObservable().pipe(H(this._hidden))
        }
        get hidden() {
            return this._hidden.asObservable()
        }
        get shown() {
            return this._windowCmptRef.instance.shown.asObservable()
        }
        constructor(o, t, i, n) {
            this._windowCmptRef = o, this._contentRef = t, this._backdropCmptRef = i, this._beforeDismiss = n, this._closed = new k, this._dismissed = new k, this._hidden = new k, o.instance.dismissEvent.subscribe(s => {
                this.dismiss(s)
            }), this.result = new Promise((s, r) => {
                this._resolve = s, this._reject = r
            }), this.result.then(null, () => {})
        }
        close(o) {
            this._windowCmptRef && (this._closed.next(o), this._resolve(o), this._removeModalElements())
        }
        _dismiss(o) {
            this._dismissed.next(o), this._reject(o), this._removeModalElements()
        }
        dismiss(o) {
            if (this._windowCmptRef)
                if (!this._beforeDismiss) this._dismiss(o);
                else {
                    let t = this._beforeDismiss();
                    eo(t) ? t.then(i => {
                        i !== !1 && this._dismiss(o)
                    }, () => {}) : t !== !1 && this._dismiss(o)
                }
        }
        _removeModalElements() {
            let o = this._windowCmptRef.instance.hide(),
                t = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : st(void 0);
            o.subscribe(() => {
                let {
                    nativeElement: i
                } = this._windowCmptRef.location;
                i.parentNode.removeChild(i), this._windowCmptRef.destroy(), this._contentRef?.viewRef?.destroy(), this._windowCmptRef = null, this._contentRef = null
            }), t.subscribe(() => {
                if (this._backdropCmptRef) {
                    let {
                        nativeElement: i
                    } = this._backdropCmptRef.location;
                    i.parentNode.removeChild(i), this._backdropCmptRef.destroy(), this._backdropCmptRef = null
                }
            }), Dt(o, t).subscribe(() => {
                this._hidden.next(), this._hidden.complete()
            })
        }
    },
    zi = function(e) {
        return e[e.BACKDROP_CLICK = 0] = "BACKDROP_CLICK", e[e.ESC = 1] = "ESC", e
    }(zi || {}),
    wr = (() => {
        class e {
            constructor() {
                this._document = u(be), this._elRef = u(de), this._zone = u(me), this._injector = u(ie), this._closed$ = new k, this._elWithFocus = null, this.backdrop = !0, this.keyboard = !0, this.dismissEvent = new O, this.shown = new k, this.hidden = new k
            }
            get fullscreenClass() {
                return this.fullscreen === !0 ? " modal-fullscreen" : di(this.fullscreen) ? ` modal-fullscreen-${this.fullscreen}-down` : ""
            }
            dismiss(t) {
                this.dismissEvent.emit(t)
            }
            ngOnInit() {
                this._elWithFocus = this._document.activeElement, Ue(() => this._show(), {
                    injector: this._injector,
                    phase: Se.MixedReadWrite
                })
            }
            ngOnDestroy() {
                this._disableEventHandling()
            }
            hide() {
                let {
                    nativeElement: t
                } = this._elRef, i = {
                    animation: this.animation,
                    runningTransition: "stop"
                }, n = se(this._zone, t, () => t.classList.remove("show"), i), s = se(this._zone, this._dialogEl.nativeElement, () => {}, i), r = Dt(n, s);
                return r.subscribe(() => {
                    this.hidden.next(), this.hidden.complete()
                }), this._disableEventHandling(), this._restoreFocus(), r
            }
            _show() {
                let t = {
                        animation: this.animation,
                        runningTransition: "continue"
                    },
                    i = se(this._zone, this._elRef.nativeElement, (s, r) => {
                        r && Gt(s), s.classList.add("show")
                    }, t),
                    n = se(this._zone, this._dialogEl.nativeElement, () => {}, t);
                Dt(i, n).subscribe(() => {
                    this.shown.next(), this.shown.complete()
                }), this._enableEventHandling(), this._setFocus()
            }
            _enableEventHandling() {
                let {
                    nativeElement: t
                } = this._elRef;
                this._zone.runOutsideAngular(() => {
                    K(t, "keydown").pipe(H(this._closed$), Ee(n => n.key === "Escape")).subscribe(n => {
                        this.keyboard ? requestAnimationFrame(() => {
                            n.defaultPrevented || this._zone.run(() => this.dismiss(zi.ESC))
                        }) : this.backdrop === "static" && this._bumpBackdrop()
                    });
                    let i = !1;
                    K(this._dialogEl.nativeElement, "mousedown").pipe(H(this._closed$), St(() => i = !1), mi(() => K(t, "mouseup").pipe(H(this._closed$), wt(1))), Ee(({
                        target: n
                    }) => t === n)).subscribe(() => {
                        i = !0
                    }), K(t, "click").pipe(H(this._closed$)).subscribe(({
                        target: n
                    }) => {
                        t === n && (this.backdrop === "static" ? this._bumpBackdrop() : this.backdrop === !0 && !i && this._zone.run(() => this.dismiss(zi.BACKDROP_CLICK))), i = !1
                    })
                })
            }
            _disableEventHandling() {
                this._closed$.next()
            }
            _setFocus() {
                let {
                    nativeElement: t
                } = this._elRef;
                if (!t.contains(document.activeElement)) {
                    let i = t.querySelector("[ngbAutofocus]"),
                        n = Qi(t)[0];
                    (i || n || t).focus()
                }
            }
            _restoreFocus() {
                let t = this._document.body,
                    i = this._elWithFocus,
                    n;
                i && i.focus && t.contains(i) ? n = i : n = t, this._zone.runOutsideAngular(() => {
                    setTimeout(() => n.focus()), this._elWithFocus = null
                })
            }
            _bumpBackdrop() {
                this.backdrop === "static" && se(this._zone, this._elRef.nativeElement, ({
                    classList: t
                }) => (t.add("modal-static"), () => t.remove("modal-static")), {
                    animation: this.animation,
                    runningTransition: "continue"
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-modal-window"]
                    ],
                    viewQuery: function(i, n) {
                        if (i & 1 && Tn(cs, 7), i & 2) {
                            let s;
                            Z(s = X()) && (n._dialogEl = s.first)
                        }
                    },
                    hostAttrs: ["role", "dialog", "tabindex", "-1"],
                    hostVars: 7,
                    hostBindings: function(i, n) {
                        i & 2 && (ne("aria-modal", !0)("aria-labelledby", n.ariaLabelledBy)("aria-describedby", n.ariaDescribedBy), Te("modal d-block" + (n.windowClass ? " " + n.windowClass : "")), G("fade", n.animation))
                    },
                    inputs: {
                        animation: "animation",
                        ariaLabelledBy: "ariaLabelledBy",
                        ariaDescribedBy: "ariaDescribedBy",
                        backdrop: "backdrop",
                        centered: "centered",
                        fullscreen: "fullscreen",
                        keyboard: "keyboard",
                        scrollable: "scrollable",
                        size: "size",
                        windowClass: "windowClass",
                        modalDialogClass: "modalDialogClass"
                    },
                    outputs: {
                        dismissEvent: "dismiss"
                    },
                    ngContentSelectors: Zn,
                    decls: 4,
                    vars: 2,
                    consts: [
                        ["dialog", ""],
                        ["role", "document"],
                        [1, "modal-content"]
                    ],
                    template: function(i, n) {
                        i & 1 && (wi(), Q(0, "div", 1, 0)(2, "div", 2), Si(3), J()()), i & 2 && Te("modal-dialog" + (n.size ? " modal-" + n.size : "") + (n.centered ? " modal-dialog-centered" : "") + n.fullscreenClass + (n.scrollable ? " modal-dialog-scrollable" : "") + (n.modalDialogClass ? " " + n.modalDialogClass : ""))
                    },
                    styles: [`ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}
`],
                    encapsulation: 2
                })
            }
        }
        return e
    })(),
    Sr = (() => {
        class e {
            constructor() {
                this._applicationRef = u(Yt), this._injector = u(ie), this._environmentInjector = u(bi), this._document = u(be), this._scrollBar = u(mo), this._activeWindowCmptHasChanged = new k, this._ariaHiddenValues = new Map, this._scrollBarRestoreFn = null, this._modalRefs = [], this._windowCmpts = [], this._activeInstances = new O;
                let t = u(me);
                this._activeWindowCmptHasChanged.subscribe(() => {
                    if (this._windowCmpts.length) {
                        let i = this._windowCmpts[this._windowCmpts.length - 1];
                        co(t, i.location.nativeElement, this._activeWindowCmptHasChanged), this._revertAriaHidden(), this._setAriaHidden(i.location.nativeElement)
                    }
                })
            }
            _restoreScrollBar() {
                let t = this._scrollBarRestoreFn;
                t && (this._scrollBarRestoreFn = null, t())
            }
            _hideScrollBar() {
                this._scrollBarRestoreFn || (this._scrollBarRestoreFn = this._scrollBar.hide())
            }
            open(t, i, n) {
                let s = n.container instanceof HTMLElement ? n.container : nt(n.container) ? this._document.querySelector(n.container) : this._document.body;
                if (!s) throw new Error(`The specified modal container "${n.container||"body"}" was not found in the DOM.`);
                this._hideScrollBar();
                let r = new li;
                t = n.injector || t;
                let l = t.get(bi, null) || this._environmentInjector,
                    a = this._getContentRef(t, l, i, r, n),
                    d = n.backdrop !== !1 ? this._attachBackdrop(s) : void 0,
                    c = this._attachWindowComponent(s, a.nodes),
                    p = new Wi(c, a, d, n.beforeDismiss);
                return this._registerModalRef(p), this._registerWindowCmpt(c), p.hidden.pipe(wt(1)).subscribe(() => Promise.resolve(!0).then(() => {
                    this._modalRefs.length || (this._document.body.classList.remove("modal-open"), this._restoreScrollBar(), this._revertAriaHidden())
                })), r.close = f => {
                    p.close(f)
                }, r.dismiss = f => {
                    p.dismiss(f)
                }, r.update = f => {
                    p.update(f)
                }, p.update(n), this._modalRefs.length === 1 && this._document.body.classList.add("modal-open"), d && d.instance && d.changeDetectorRef.detectChanges(), c.changeDetectorRef.detectChanges(), p
            }
            get activeInstances() {
                return this._activeInstances
            }
            dismissAll(t) {
                this._modalRefs.forEach(i => i.dismiss(t))
            }
            hasOpenModals() {
                return this._modalRefs.length > 0
            }
            _attachBackdrop(t) {
                let i = Ye(br, {
                    environmentInjector: this._applicationRef.injector,
                    elementInjector: this._injector
                });
                return this._applicationRef.attachView(i.hostView), t.appendChild(i.location.nativeElement), i
            }
            _attachWindowComponent(t, i) {
                let n = Ye(wr, {
                    environmentInjector: this._applicationRef.injector,
                    elementInjector: this._injector,
                    projectableNodes: i
                });
                return this._applicationRef.attachView(n.hostView), t.appendChild(n.location.nativeElement), n
            }
            _getContentRef(t, i, n, s, r) {
                return n ? n instanceof ue ? this._createFromTemplateRef(n, s) : di(n) ? this._createFromString(n) : this._createFromComponent(t, i, n, s, r) : new ce([])
            }
            _createFromTemplateRef(t, i) {
                let n = {
                        $implicit: i,
                        close(r) {
                            i.close(r)
                        },
                        dismiss(r) {
                            i.dismiss(r)
                        }
                    },
                    s = t.createEmbeddedView(n);
                return this._applicationRef.attachView(s), new ce([s.rootNodes], s)
            }
            _createFromString(t) {
                let i = this._document.createTextNode(`${t}`);
                return new ce([
                    [i]
                ])
            }
            _createFromComponent(t, i, n, s, r) {
                let l = ie.create({
                        providers: [{
                            provide: li,
                            useValue: s
                        }],
                        parent: t
                    }),
                    a = Ye(n, {
                        environmentInjector: i,
                        elementInjector: l
                    }),
                    d = a.location.nativeElement;
                return r.scrollable && d.classList.add("component-host-scrollable"), this._applicationRef.attachView(a.hostView), new ce([
                    [d]
                ], a.hostView, a)
            }
            _setAriaHidden(t) {
                let i = t.parentElement;
                i && t !== this._document.body && (Array.from(i.children).forEach(n => {
                    n !== t && n.nodeName !== "SCRIPT" && (this._ariaHiddenValues.set(n, n.getAttribute("aria-hidden")), n.setAttribute("aria-hidden", "true"))
                }), this._setAriaHidden(i))
            }
            _revertAriaHidden() {
                this._ariaHiddenValues.forEach((t, i) => {
                    t ? i.setAttribute("aria-hidden", t) : i.removeAttribute("aria-hidden")
                }), this._ariaHiddenValues.clear()
            }
            _registerModalRef(t) {
                let i = () => {
                    let n = this._modalRefs.indexOf(t);
                    n > -1 && (this._modalRefs.splice(n, 1), this._activeInstances.emit(this._modalRefs))
                };
                this._modalRefs.push(t), this._activeInstances.emit(this._modalRefs), t.result.then(i, i)
            }
            _registerWindowCmpt(t) {
                this._windowCmpts.push(t), this._activeWindowCmptHasChanged.next(), t.onDestroy(() => {
                    let i = this._windowCmpts.indexOf(t);
                    i > -1 && (this._windowCmpts.splice(i, 1), this._activeWindowCmptHasChanged.next())
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Tr = (() => {
        class e {
            constructor() {
                this._injector = u(ie), this._modalStack = u(Sr), this._config = u(vr)
            }
            open(t, i = {}) {
                let n = yt(_i(yt({}, this._config), {
                    animation: this._config.animation
                }), i);
                return this._modalStack.open(this._injector, t, n)
            }
            get activeInstances() {
                return this._modalStack.activeInstances
            }
            dismissAll(t) {
                this._modalStack.dismissAll(t)
            }
            hasOpenModals() {
                return this._modalStack.hasOpenModals()
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    vo = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({
                    providers: [Tr]
                })
            }
        }
        return e
    })();
var bo = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    Mr = (() => {
        class e {
            constructor() {
                this.disabled = !1, this.boundaryLinks = !1, this.directionLinks = !0, this.ellipses = !0, this.maxSize = 0, this.pageSize = 10, this.rotate = !1
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Or = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationEllipsis", ""]
                    ]
                })
            }
        }
        return e
    })(),
    Ar = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationFirst", ""]
                    ]
                })
            }
        }
        return e
    })(),
    Nr = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationLast", ""]
                    ]
                })
            }
        }
        return e
    })(),
    Cr = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationNext", ""]
                    ]
                })
            }
        }
        return e
    })(),
    Rr = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationNumber", ""]
                    ]
                })
            }
        }
        return e
    })(),
    Er = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationPrevious", ""]
                    ]
                })
            }
        }
        return e
    })(),
    xr = (() => {
        class e {
            constructor() {
                this.templateRef = u(ue)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["ng-template", "ngbPaginationPages", ""]
                    ]
                })
            }
        }
        return e
    })(),
    eh = (() => {
        class e {
            constructor() {
                this._config = u(Mr), this.pageCount = 0, this.pages = [], this.disabled = this._config.disabled, this.boundaryLinks = this._config.boundaryLinks, this.directionLinks = this._config.directionLinks, this.ellipses = this._config.ellipses, this.rotate = this._config.rotate, this.maxSize = this._config.maxSize, this.page = 1, this.pageSize = this._config.pageSize, this.pageChange = new O(!0), this.size = this._config.size
            }
            hasPrevious() {
                return this.page > 1
            }
            hasNext() {
                return this.page < this.pageCount
            }
            nextDisabled() {
                return !this.hasNext() || this.disabled
            }
            previousDisabled() {
                return !this.hasPrevious() || this.disabled
            }
            selectPage(t) {
                this._updatePages(t)
            }
            ngOnChanges(t) {
                this._updatePages(this.page)
            }
            isEllipsis(t) {
                return t === -1
            }
            _applyEllipses(t, i) {
                this.ellipses && (t > 0 && (t > 2 ? this.pages.unshift(-1) : t === 2 && this.pages.unshift(2), this.pages.unshift(1)), i < this.pageCount && (i < this.pageCount - 2 ? this.pages.push(-1) : i === this.pageCount - 2 && this.pages.push(this.pageCount - 1), this.pages.push(this.pageCount)))
            }
            _applyRotation() {
                let t = 0,
                    i = this.pageCount,
                    n = Math.floor(this.maxSize / 2),
                    s = this.maxSize % 2 === 0 ? n - 1 : n;
                return this.page <= n ? i = this.maxSize : this.pageCount - this.page < n ? t = this.pageCount - this.maxSize : (t = this.page - n - 1, i = this.page + s), [t, i]
            }
            _applyPagination() {
                let i = (Math.ceil(this.page / this.maxSize) - 1) * this.maxSize,
                    n = i + this.maxSize;
                return [i, n]
            }
            _setPageInRange(t) {
                let i = this.page;
                this.page = Ws(t, this.pageCount, 1), this.page !== i && Wn(this.collectionSize) && this.pageChange.emit(this.page)
            }
            _updatePages(t) {
                this.pageCount = Math.ceil(this.collectionSize / this.pageSize), Wn(this.pageCount) || (this.pageCount = 0), this.pages.length = 0;
                for (let i = 1; i <= this.pageCount; i++) this.pages.push(i);
                if (this._setPageInRange(t), this.maxSize > 0 && this.pageCount > this.maxSize) {
                    let i = 0,
                        n = this.pageCount;
                    this.rotate ? [i, n] = this._applyRotation() : [i, n] = this._applyPagination(), this.pages = this.pages.slice(i, n), this._applyEllipses(i, n)
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-pagination"]
                    ],
                    contentQueries: function(i, n, s) {
                        if (i & 1 && (oe(s, Or, 5), oe(s, Ar, 5), oe(s, Nr, 5), oe(s, Cr, 5), oe(s, Rr, 5), oe(s, Er, 5), oe(s, xr, 5)), i & 2) {
                            let r;
                            Z(r = X()) && (n.tplEllipsis = r.first), Z(r = X()) && (n.tplFirst = r.first), Z(r = X()) && (n.tplLast = r.first), Z(r = X()) && (n.tplNext = r.first), Z(r = X()) && (n.tplNumber = r.first), Z(r = X()) && (n.tplPrevious = r.first), Z(r = X()) && (n.tplPages = r.first)
                        }
                    },
                    hostAttrs: ["role", "navigation"],
                    inputs: {
                        disabled: "disabled",
                        boundaryLinks: "boundaryLinks",
                        directionLinks: "directionLinks",
                        ellipses: "ellipses",
                        rotate: "rotate",
                        collectionSize: "collectionSize",
                        maxSize: "maxSize",
                        page: "page",
                        pageSize: "pageSize",
                        size: "size"
                    },
                    outputs: {
                        pageChange: "pageChange"
                    },
                    features: [Tt],
                    decls: 20,
                    vars: 12,
                    consts: () => {
                        let t;
                        t = $localize`:@@ngb.pagination.first:««`;
                        let i;
                        i = $localize`:@@ngb.pagination.previous:«`;
                        let n;
                        n = $localize`:@@ngb.pagination.next:»`;
                        let s;
                        s = $localize`:@@ngb.pagination.last:»»`;
                        let r;
                        r = $localize`:@@ngb.pagination.first-aria:First`;
                        let l;
                        l = $localize`:@@ngb.pagination.previous-aria:Previous`;
                        let a;
                        a = $localize`:@@ngb.pagination.next-aria:Next`;
                        let d;
                        return d = $localize`:@@ngb.pagination.last-aria:Last`, [
                            ["first", ""],
                            ["previous", ""],
                            ["next", ""],
                            ["last", ""],
                            ["ellipsis", ""],
                            ["defaultNumber", ""],
                            ["defaultPages", ""], t, i, n, s, [1, "page-item", 3, "disabled"],
                            [3, "ngTemplateOutlet", "ngTemplateOutletContext"],
                            ["aria-hidden", "true"],
                            [1, "page-item", 3, "active", "disabled"],
                            [1, "page-item"],
                            ["tabindex", "-1", "aria-disabled", "true", 1, "page-link"],
                            ["href", "", 1, "page-link"],
                            ["href", "", 1, "page-link", 3, "click"],
                            ["aria-label", r, "href", "", 1, "page-link", 3, "click"],
                            ["aria-label", l, "href", "", 1, "page-link", 3, "click"],
                            ["aria-label", a, "href", "", 1, "page-link", 3, "click"],
                            ["aria-label", d, "href", "", 1, "page-link", 3, "click"]
                        ]
                    },
                    template: function(i, n) {
                        if (i & 1 && (ae(0, fs, 2, 0, "ng-template", null, 0, Oe)(2, _s, 2, 0, "ng-template", null, 1, Oe)(4, gs, 2, 0, "ng-template", null, 2, Oe)(6, ms, 2, 0, "ng-template", null, 3, Oe)(8, vs, 1, 0, "ng-template", null, 4, Oe)(10, bs, 1, 1, "ng-template", null, 5, Oe)(12, Ms, 2, 0, "ng-template", null, 6, Oe), Q(14, "ul"), ae(15, As, 3, 9, "li", 11)(16, Cs, 3, 8, "li", 11)(17, Rs, 0, 0, "ng-template", 12)(18, xs, 3, 9, "li", 11)(19, Bs, 3, 9, "li", 11), J()), i & 2) {
                            let s = Me(13);
                            A(14), Te("pagination" + (n.size ? " pagination-" + n.size : "")), A(), We(n.boundaryLinks ? 15 : -1), A(), We(n.directionLinks ? 16 : -1), A(), ve("ngTemplateOutlet", (n.tplPages == null ? null : n.tplPages.templateRef) || s)("ngTemplateOutletContext", Xt(8, ds, n.page, n.pages, n.disabled)), A(), We(n.directionLinks ? 18 : -1), A(), We(n.boundaryLinks ? 19 : -1)
                        }
                    },
                    dependencies: [Ai],
                    encapsulation: 2,
                    changeDetection: 0
                })
            }
        }
        return e
    })();
var yo = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var th = (() => {
    class e {
        constructor() {
            this._ngbConfig = u(Ht), this.autoClose = !0, this.placement = "auto", this.popperOptions = t => t, this.triggers = "click", this.disablePopover = !1, this.openDelay = 0, this.closeDelay = 0
        }
        get animation() {
            return this._animation ?? this._ngbConfig.animation
        }
        set animation(t) {
            this._animation = t
        }
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275prov = W({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return e
})();
var Do = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var wo = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var So = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var To = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var Mo = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var Oo = (() => {
    class e {
        static {
            this.\u0275fac = function(i) {
                return new(i || e)
            }
        }
        static {
            this.\u0275mod = P({
                type: e
            })
        }
        static {
            this.\u0275inj = B({})
        }
    }
    return e
})();
var Ao = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    kr = (() => {
        class e {
            constructor() {
                this.highlightClass = "ngb-highlight", this.accentSensitive = !0
            }
            ngOnChanges(t) {
                !this.accentSensitive && !String.prototype.normalize && (console.warn("The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser that does not implement the `String.normalize` function. You will have to include a polyfill in your application to use this feature in the current browser."), this.accentSensitive = !0);
                let i = Ft(this.result),
                    n = Array.isArray(this.term) ? this.term : [this.term],
                    s = d => this.accentSensitive ? d : zn(d),
                    r = n.map(d => zs(s(Ft(d)))).filter(d => d),
                    l = this.accentSensitive ? i : zn(i),
                    a = r.length ? l.split(new RegExp(`(${r.join("|")})`, "gmi")) : [i];
                if (this.accentSensitive) this.parts = a;
                else {
                    let d = 0;
                    this.parts = a.map(c => i.substring(d, d += c.length))
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-highlight"]
                    ],
                    inputs: {
                        highlightClass: "highlightClass",
                        result: "result",
                        term: "term",
                        accentSensitive: "accentSensitive"
                    },
                    features: [Tt],
                    decls: 2,
                    vars: 0,
                    consts: [
                        [3, "class"]
                    ],
                    template: function(i, n) {
                        i & 1 && Qt(0, Fs, 2, 1, null, null, Kt), i & 2 && Jt(n.parts)
                    },
                    styles: [`.ngb-highlight{font-weight:700}
`],
                    encapsulation: 2,
                    changeDetection: 0
                })
            }
        }
        return e
    })(),
    Br = new gn("live announcer delay", {
        providedIn: "root",
        factory: () => 100
    });

function qn(e, o = !1) {
    let t = e.body.querySelector("#ngb-live");
    return t == null && o && (t = e.createElement("div"), t.setAttribute("id", "ngb-live"), t.setAttribute("aria-live", "polite"), t.setAttribute("aria-atomic", "true"), t.classList.add("visually-hidden"), e.body.appendChild(t)), t
}
var Pr = (() => {
        class e {
            constructor() {
                this._document = u(be), this._delay = u(Br)
            }
            ngOnDestroy() {
                let t = qn(this._document);
                t && t.parentElement.removeChild(t)
            }
            say(t) {
                let i = qn(this._document, !0),
                    n = this._delay;
                if (i != null) {
                    i.textContent = "";
                    let s = () => i.textContent = t;
                    n === null ? s() : setTimeout(s, n)
                }
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Ir = (() => {
        class e {
            constructor() {
                this.editable = !0, this.focusFirst = !0, this.selectOnExact = !1, this.showHint = !1, this.placement = ["bottom-start", "bottom-end", "top-start", "top-end"], this.popperOptions = t => t
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Fr = (() => {
        class e {
            constructor() {
                this.activeIdx = 0, this.focusFirst = !0, this.formatter = Ft, this.selectEvent = new O, this.activeChangeEvent = new O
            }
            hasActive() {
                return this.activeIdx > -1 && this.activeIdx < this.results.length
            }
            getActive() {
                return this.results[this.activeIdx]
            }
            markActive(t) {
                this.activeIdx = t, this._activeChanged()
            }
            next() {
                this.activeIdx === this.results.length - 1 ? this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1 : this.activeIdx++, this._activeChanged()
            }
            prev() {
                this.activeIdx < 0 ? this.activeIdx = this.results.length - 1 : this.activeIdx === 0 ? this.activeIdx = this.focusFirst ? this.results.length - 1 : -1 : this.activeIdx--, this._activeChanged()
            }
            resetActive() {
                this.activeIdx = this.focusFirst ? 0 : -1, this._activeChanged()
            }
            select(t) {
                this.selectEvent.emit(t)
            }
            ngOnInit() {
                this.resetActive()
            }
            _activeChanged() {
                this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + "-" + this.activeIdx : void 0)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-typeahead-window"]
                    ],
                    hostAttrs: ["role", "listbox"],
                    hostVars: 3,
                    hostBindings: function(i, n) {
                        i & 1 && le("mousedown", function(r) {
                            return r.preventDefault()
                        }), i & 2 && (Pe("id", n.id), Te("dropdown-menu show" + (n.popupClass ? " " + n.popupClass : "")))
                    },
                    inputs: {
                        id: "id",
                        focusFirst: "focusFirst",
                        results: "results",
                        term: "term",
                        formatter: "formatter",
                        resultTemplate: "resultTemplate",
                        popupClass: "popupClass"
                    },
                    outputs: {
                        selectEvent: "select",
                        activeChangeEvent: "activeChange"
                    },
                    exportAs: ["ngbTypeaheadWindow"],
                    decls: 4,
                    vars: 0,
                    consts: [
                        ["rt", ""],
                        ["type", "button", "role", "option", 1, "dropdown-item", 3, "id", "active"],
                        [3, "result", "term"],
                        ["type", "button", "role", "option", 1, "dropdown-item", 3, "mouseenter", "click", "id"],
                        [3, "ngTemplateOutlet", "ngTemplateOutletContext"]
                    ],
                    template: function(i, n) {
                        i & 1 && (ae(0, Gs, 1, 2, "ng-template", null, 0, Oe), Qt(2, $s, 2, 9, "button", 1, Kt)), i & 2 && (A(2), Jt(n.results))
                    },
                    dependencies: [kr, Ai],
                    encapsulation: 2
                })
            }
        }
        return e
    })(),
    Hr = 0,
    ih = (() => {
        class e {
            constructor() {
                this._nativeElement = u(de).nativeElement, this._config = u(Ir), this._live = u(Pr), this._document = u(be), this._ngZone = u(me), this._changeDetector = u(At), this._injector = u(ie), this._popupService = new Ui(Fr), this._positioning = uo(), this._subscription = null, this._closed$ = new k, this._inputValueBackup = null, this._inputValueForSelectOnExact = null, this._valueChanges$ = K(this._nativeElement, "input").pipe(je(t => t.target.value)), this._resubscribeTypeahead$ = new cn(null), this._windowRef = null, this.autocomplete = "off", this.container = this._config.container, this.editable = this._config.editable, this.focusFirst = this._config.focusFirst, this.selectOnExact = this._config.selectOnExact, this.showHint = this._config.showHint, this.placement = this._config.placement, this.popperOptions = this._config.popperOptions, this.selectItem = new O, this.activeDescendant = null, this.popupId = `ngb-typeahead-${Hr++}`, this._onTouched = () => {}, this._onChange = t => {}
            }
            ngOnInit() {
                this._subscribeToUserInput()
            }
            ngOnChanges({
                ngbTypeahead: t
            }) {
                t && !t.firstChange && (this._unsubscribeFromUserInput(), this._subscribeToUserInput())
            }
            ngOnDestroy() {
                this._closePopup(), this._unsubscribeFromUserInput()
            }
            registerOnChange(t) {
                this._onChange = t
            }
            registerOnTouched(t) {
                this._onTouched = t
            }
            writeValue(t) {
                this._writeInputValue(this._formatItemForInput(t)), this.showHint && (this._inputValueBackup = t)
            }
            setDisabledState(t) {
                this._nativeElement.disabled = t
            }
            dismissPopup() {
                this.isPopupOpen() && (this._resubscribeTypeahead$.next(null), this._closePopup(), this.showHint && this._inputValueBackup !== null && this._writeInputValue(this._inputValueBackup), this._changeDetector.markForCheck())
            }
            isPopupOpen() {
                return this._windowRef != null
            }
            handleBlur() {
                this._resubscribeTypeahead$.next(null), this._onTouched()
            }
            handleKeyDown(t) {
                if (this.isPopupOpen()) switch (t.key) {
                    case "ArrowDown":
                        t.preventDefault(), this._windowRef.instance.next(), this._showHint();
                        break;
                    case "ArrowUp":
                        t.preventDefault(), this._windowRef.instance.prev(), this._showHint();
                        break;
                    case "Enter":
                    case "Tab": {
                        let i = this._windowRef.instance.getActive();
                        nt(i) && (t.preventDefault(), t.stopPropagation(), this._selectResult(i)), this._closePopup();
                        break
                    }
                }
            }
            _openPopup() {
                if (!this.isPopupOpen()) {
                    this._inputValueBackup = this._nativeElement.value;
                    let {
                        windowRef: t
                    } = this._popupService.open();
                    this._windowRef = t, this._windowRef.setInput("id", this.popupId), this._windowRef.setInput("popupClass", this.popupClass), this._windowRef.instance.selectEvent.subscribe(i => this._selectResultClosePopup(i)), this._windowRef.instance.activeChangeEvent.subscribe(i => this.activeDescendant = i), this.container === "body" && (this._windowRef.location.nativeElement.style.zIndex = "1055", this._document.body.appendChild(this._windowRef.location.nativeElement)), this._changeDetector.markForCheck(), this._ngZone.runOutsideAngular(() => {
                        this._windowRef && (this._positioning.createPopper({
                            hostElement: this._nativeElement,
                            targetElement: this._windowRef.location.nativeElement,
                            placement: this.placement,
                            updatePopperOptions: i => this.popperOptions(ho([0, 2])(i))
                        }), this._afterRenderRef = yi(() => {
                            this._positioning.update()
                        }, {
                            phase: Se.MixedReadWrite,
                            injector: this._injector
                        }))
                    }), ao(this._ngZone, this._document, "outside", () => this.dismissPopup(), this._closed$, [this._nativeElement, this._windowRef.location.nativeElement])
                }
            }
            _closePopup() {
                this._popupService.close().subscribe(() => {
                    this._positioning.destroy(), this._afterRenderRef?.destroy(), this._closed$.next(), this._windowRef = null, this.activeDescendant = null
                })
            }
            _selectResult(t) {
                let i = !1;
                this.selectItem.emit({
                    item: t,
                    preventDefault: () => {
                        i = !0
                    }
                }), this._resubscribeTypeahead$.next(null), i || (this.writeValue(t), this._onChange(t))
            }
            _selectResultClosePopup(t) {
                this._selectResult(t), this._closePopup()
            }
            _showHint() {
                if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
                    let t = this._inputValueBackup.toLowerCase(),
                        i = this._formatItemForInput(this._windowRef.instance.getActive());
                    t === i.substring(0, this._inputValueBackup.length).toLowerCase() ? (this._writeInputValue(this._inputValueBackup + i.substring(this._inputValueBackup.length)), this._nativeElement.setSelectionRange.apply(this._nativeElement, [this._inputValueBackup.length, i.length])) : this._writeInputValue(i)
                }
            }
            _formatItemForInput(t) {
                return t != null && this.inputFormatter ? this.inputFormatter(t) : Ft(t)
            }
            _writeInputValue(t) {
                this._nativeElement.value = Ft(t)
            }
            _subscribeToUserInput() {
                let t = this._valueChanges$.pipe(St(i => {
                    this._inputValueBackup = this.showHint ? i : null, this._inputValueForSelectOnExact = this.selectOnExact ? i : null, this._onChange(this.editable ? i : void 0)
                }), this.ngbTypeahead ? this.ngbTypeahead : () => st([]));
                this._subscription = this._resubscribeTypeahead$.pipe(mi(() => t)).subscribe(i => {
                    !i || i.length === 0 ? this._closePopup() : this.selectOnExact && i.length === 1 && this._formatItemForInput(i[0]) === this._inputValueForSelectOnExact ? (this._selectResult(i[0]), this._closePopup()) : (this._openPopup(), this._windowRef.setInput("focusFirst", this.focusFirst), this._windowRef.setInput("results", i), this._windowRef.setInput("term", this._nativeElement.value), this.resultFormatter && this._windowRef.setInput("formatter", this.resultFormatter), this.resultTemplate && this._windowRef.setInput("resultTemplate", this.resultTemplate), this._windowRef.instance.resetActive(), this._windowRef.changeDetectorRef.detectChanges(), this._showHint());
                    let n = i ? i.length : 0;
                    this._live.say(n === 0 ? "No results available" : `${n} result${n===1?"":"s"} available`)
                })
            }
            _unsubscribeFromUserInput() {
                this._subscription && this._subscription.unsubscribe(), this._subscription = null
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275dir = N({
                    type: e,
                    selectors: [
                        ["input", "ngbTypeahead", ""]
                    ],
                    hostAttrs: ["autocapitalize", "off", "autocorrect", "off", "role", "combobox"],
                    hostVars: 7,
                    hostBindings: function(i, n) {
                        i & 1 && le("blur", function() {
                            return n.handleBlur()
                        })("keydown", function(r) {
                            return n.handleKeyDown(r)
                        }), i & 2 && (Pe("autocomplete", n.autocomplete), ne("aria-autocomplete", n.showHint ? "both" : "list")("aria-activedescendant", n.activeDescendant)("aria-owns", n.isPopupOpen() ? n.popupId : null)("aria-expanded", n.isPopupOpen()), G("open", n.isPopupOpen()))
                    },
                    inputs: {
                        autocomplete: "autocomplete",
                        container: "container",
                        editable: "editable",
                        focusFirst: "focusFirst",
                        inputFormatter: "inputFormatter",
                        ngbTypeahead: "ngbTypeahead",
                        resultFormatter: "resultFormatter",
                        resultTemplate: "resultTemplate",
                        selectOnExact: "selectOnExact",
                        showHint: "showHint",
                        placement: "placement",
                        popperOptions: "popperOptions",
                        popupClass: "popupClass"
                    },
                    outputs: {
                        selectItem: "selectItem"
                    },
                    exportAs: ["ngbTypeahead"],
                    features: [Ti([{
                        provide: Mn,
                        useExisting: vi(() => e),
                        multi: !0
                    }]), Tt]
                })
            }
        }
        return e
    })(),
    No = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    Gr = (() => {
        class e {
            constructor() {
                this._ngbConfig = u(Ht), this.backdrop = !0, this.keyboard = !0, this.position = "start", this.scroll = !1
            }
            get animation() {
                return this._animation ?? this._ngbConfig.animation
            }
            set animation(t) {
                this._animation = t
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    ci = class {
        close(o) {}
        dismiss(o) {}
    },
    Yi = class {
        get componentInstance() {
            if (this._contentRef && this._contentRef.componentRef) return this._contentRef.componentRef.instance
        }
        get closed() {
            return this._closed.asObservable().pipe(H(this._hidden))
        }
        get dismissed() {
            return this._dismissed.asObservable().pipe(H(this._hidden))
        }
        get hidden() {
            return this._hidden.asObservable()
        }
        get shown() {
            return this._panelCmptRef.instance.shown.asObservable()
        }
        constructor(o, t, i, n) {
            this._panelCmptRef = o, this._contentRef = t, this._backdropCmptRef = i, this._beforeDismiss = n, this._closed = new k, this._dismissed = new k, this._hidden = new k, o.instance.dismissEvent.subscribe(s => {
                this.dismiss(s)
            }), i && i.instance.dismissEvent.subscribe(s => {
                this.dismiss(s)
            }), this.result = new Promise((s, r) => {
                this._resolve = s, this._reject = r
            }), this.result.then(null, () => {})
        }
        close(o) {
            this._panelCmptRef && (this._closed.next(o), this._resolve(o), this._removeOffcanvasElements())
        }
        _dismiss(o) {
            this._dismissed.next(o), this._reject(o), this._removeOffcanvasElements()
        }
        dismiss(o) {
            if (this._panelCmptRef)
                if (!this._beforeDismiss) this._dismiss(o);
                else {
                    let t = this._beforeDismiss();
                    eo(t) ? t.then(i => {
                        i !== !1 && this._dismiss(o)
                    }, () => {}) : t !== !1 && this._dismiss(o)
                }
        }
        _removeOffcanvasElements() {
            let o = this._panelCmptRef.instance.hide(),
                t = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : st(void 0);
            o.subscribe(() => {
                let {
                    nativeElement: i
                } = this._panelCmptRef.location;
                i.parentNode.removeChild(i), this._panelCmptRef.destroy(), this._contentRef?.viewRef?.destroy(), this._panelCmptRef = null, this._contentRef = null
            }), t.subscribe(() => {
                if (this._backdropCmptRef) {
                    let {
                        nativeElement: i
                    } = this._backdropCmptRef.location;
                    i.parentNode.removeChild(i), this._backdropCmptRef.destroy(), this._backdropCmptRef = null
                }
            }), Dt(o, t).subscribe(() => {
                this._hidden.next(), this._hidden.complete()
            })
        }
    },
    qi = function(e) {
        return e[e.BACKDROP_CLICK = 0] = "BACKDROP_CLICK", e[e.ESC = 1] = "ESC", e
    }(qi || {}),
    Vr = (() => {
        class e {
            constructor() {
                this._nativeElement = u(de).nativeElement, this._zone = u(me), this._injector = u(ie), this.dismissEvent = new O
            }
            ngOnInit() {
                Ue(() => se(this._zone, this._nativeElement, (t, i) => {
                    i && Gt(t), t.classList.add("show")
                }, {
                    animation: this.animation,
                    runningTransition: "continue"
                }), {
                    injector: this._injector,
                    phase: Se.MixedReadWrite
                })
            }
            hide() {
                return se(this._zone, this._nativeElement, ({
                    classList: t
                }) => t.remove("show"), {
                    animation: this.animation,
                    runningTransition: "stop"
                })
            }
            dismiss() {
                this.static || this.dismissEvent.emit(qi.BACKDROP_CLICK)
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-offcanvas-backdrop"]
                    ],
                    hostVars: 6,
                    hostBindings: function(i, n) {
                        i & 1 && le("mousedown", function() {
                            return n.dismiss()
                        }), i & 2 && (Te("offcanvas-backdrop" + (n.backdropClass ? " " + n.backdropClass : "")), G("show", !n.animation)("fade", n.animation))
                    },
                    inputs: {
                        animation: "animation",
                        backdropClass: "backdropClass",
                        static: "static"
                    },
                    outputs: {
                        dismissEvent: "dismiss"
                    },
                    decls: 0,
                    vars: 0,
                    template: function(i, n) {},
                    encapsulation: 2
                })
            }
        }
        return e
    })(),
    $r = (() => {
        class e {
            constructor() {
                this._document = u(be), this._elRef = u(de), this._zone = u(me), this._injector = u(ie), this._closed$ = new k, this._elWithFocus = null, this.keyboard = !0, this.position = "start", this.dismissEvent = new O, this.shown = new k, this.hidden = new k
            }
            dismiss(t) {
                this.dismissEvent.emit(t)
            }
            ngOnInit() {
                this._elWithFocus = this._document.activeElement, Ue(() => this._show(), {
                    injector: this._injector,
                    phase: Se.MixedReadWrite
                })
            }
            ngOnDestroy() {
                this._disableEventHandling()
            }
            hide() {
                let t = {
                        animation: this.animation,
                        runningTransition: "stop"
                    },
                    i = se(this._zone, this._elRef.nativeElement, n => (n.classList.remove("showing"), n.classList.add("hiding"), () => n.classList.remove("show", "hiding")), t);
                return i.subscribe(() => {
                    this.hidden.next(), this.hidden.complete()
                }), this._disableEventHandling(), this._restoreFocus(), i
            }
            _show() {
                let t = {
                    animation: this.animation,
                    runningTransition: "continue"
                };
                se(this._zone, this._elRef.nativeElement, (n, s) => (s && Gt(n), n.classList.add("show", "showing"), () => n.classList.remove("showing")), t).subscribe(() => {
                    this.shown.next(), this.shown.complete()
                }), this._enableEventHandling(), this._setFocus()
            }
            _enableEventHandling() {
                let {
                    nativeElement: t
                } = this._elRef;
                this._zone.runOutsideAngular(() => {
                    K(t, "keydown").pipe(H(this._closed$), Ee(i => i.key === "Escape")).subscribe(i => {
                        this.keyboard && requestAnimationFrame(() => {
                            i.defaultPrevented || this._zone.run(() => this.dismiss(qi.ESC))
                        })
                    })
                })
            }
            _disableEventHandling() {
                this._closed$.next()
            }
            _setFocus() {
                let {
                    nativeElement: t
                } = this._elRef;
                if (!t.contains(document.activeElement)) {
                    let i = t.querySelector("[ngbAutofocus]"),
                        n = Qi(t)[0];
                    (i || n || t).focus()
                }
            }
            _restoreFocus() {
                let t = this._document.body,
                    i = this._elWithFocus,
                    n;
                i && i.focus && t.contains(i) ? n = i : n = t, this._zone.runOutsideAngular(() => {
                    setTimeout(() => n.focus()), this._elWithFocus = null
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275cmp = Be({
                    type: e,
                    selectors: [
                        ["ngb-offcanvas-panel"]
                    ],
                    hostAttrs: ["role", "dialog", "tabindex", "-1"],
                    hostVars: 5,
                    hostBindings: function(i, n) {
                        i & 2 && (ne("aria-modal", !0)("aria-labelledby", n.ariaLabelledBy)("aria-describedby", n.ariaDescribedBy), Te("offcanvas offcanvas-" + n.position + (n.panelClass ? " " + n.panelClass : "")))
                    },
                    inputs: {
                        animation: "animation",
                        ariaLabelledBy: "ariaLabelledBy",
                        ariaDescribedBy: "ariaDescribedBy",
                        keyboard: "keyboard",
                        panelClass: "panelClass",
                        position: "position"
                    },
                    outputs: {
                        dismissEvent: "dismiss"
                    },
                    ngContentSelectors: Zn,
                    decls: 1,
                    vars: 0,
                    template: function(i, n) {
                        i & 1 && (wi(), Si(0))
                    },
                    encapsulation: 2
                })
            }
        }
        return e
    })(),
    Lr = (() => {
        class e {
            constructor() {
                this._applicationRef = u(Yt), this._injector = u(ie), this._document = u(be), this._scrollBar = u(mo), this._activePanelCmptHasChanged = new k, this._scrollBarRestoreFn = null, this._backdropAttributes = ["animation", "backdropClass"], this._panelAttributes = ["animation", "ariaDescribedBy", "ariaLabelledBy", "keyboard", "panelClass", "position"], this._activeInstance = new O;
                let t = u(me);
                this._activePanelCmptHasChanged.subscribe(() => {
                    this._panelCmpt && co(t, this._panelCmpt.location.nativeElement, this._activePanelCmptHasChanged)
                })
            }
            _restoreScrollBar() {
                let t = this._scrollBarRestoreFn;
                t && (this._scrollBarRestoreFn = null, t())
            }
            _hideScrollBar() {
                this._scrollBarRestoreFn || (this._scrollBarRestoreFn = this._scrollBar.hide())
            }
            open(t, i, n) {
                let s = n.container instanceof HTMLElement ? n.container : nt(n.container) ? this._document.querySelector(n.container) : this._document.body;
                if (!s) throw new Error(`The specified offcanvas container "${n.container||"body"}" was not found in the DOM.`);
                n.scroll || this._hideScrollBar();
                let r = new ci,
                    l = this._getContentRef(n.injector || t, i, r),
                    a = n.backdrop !== !1 ? this._attachBackdrop(s) : void 0,
                    d = this._attachWindowComponent(s, l.nodes),
                    c = new Yi(d, l, a, n.beforeDismiss);
                return this._registerOffcanvasRef(c), this._registerPanelCmpt(d), c.hidden.pipe(_n(() => this._restoreScrollBar())).subscribe(), r.close = p => {
                    c.close(p)
                }, r.dismiss = p => {
                    c.dismiss(p)
                }, this._applyPanelOptions(d.instance, n), a && a.instance && (this._applyBackdropOptions(a.instance, n), a.changeDetectorRef.detectChanges()), d.changeDetectorRef.detectChanges(), c
            }
            get activeInstance() {
                return this._activeInstance
            }
            dismiss(t) {
                this._offcanvasRef?.dismiss(t)
            }
            hasOpenOffcanvas() {
                return !!this._offcanvasRef
            }
            _attachBackdrop(t) {
                let i = Ye(Vr, {
                    environmentInjector: this._applicationRef.injector,
                    elementInjector: this._injector
                });
                return this._applicationRef.attachView(i.hostView), t.appendChild(i.location.nativeElement), i
            }
            _attachWindowComponent(t, i) {
                let n = Ye($r, {
                    environmentInjector: this._applicationRef.injector,
                    elementInjector: this._injector,
                    projectableNodes: i
                });
                return this._applicationRef.attachView(n.hostView), t.appendChild(n.location.nativeElement), n
            }
            _applyPanelOptions(t, i) {
                this._panelAttributes.forEach(n => {
                    nt(i[n]) && (t[n] = i[n])
                })
            }
            _applyBackdropOptions(t, i) {
                this._backdropAttributes.forEach(n => {
                    nt(i[n]) && (t[n] = i[n])
                }), t.static = i.backdrop === "static"
            }
            _getContentRef(t, i, n) {
                return i ? i instanceof ue ? this._createFromTemplateRef(i, n) : di(i) ? this._createFromString(i) : this._createFromComponent(t, i, n) : new ce([])
            }
            _createFromTemplateRef(t, i) {
                let n = {
                        $implicit: i,
                        close(r) {
                            i.close(r)
                        },
                        dismiss(r) {
                            i.dismiss(r)
                        }
                    },
                    s = t.createEmbeddedView(n);
                return this._applicationRef.attachView(s), new ce([s.rootNodes], s)
            }
            _createFromString(t) {
                let i = this._document.createTextNode(`${t}`);
                return new ce([
                    [i]
                ])
            }
            _createFromComponent(t, i, n) {
                let s = ie.create({
                        providers: [{
                            provide: ci,
                            useValue: n
                        }],
                        parent: t
                    }),
                    r = Ye(i, {
                        environmentInjector: this._applicationRef.injector,
                        elementInjector: s
                    }),
                    l = r.location.nativeElement;
                return this._applicationRef.attachView(r.hostView), new ce([
                    [l]
                ], r.hostView, r)
            }
            _registerOffcanvasRef(t) {
                let i = () => {
                    this._offcanvasRef = void 0, this._activeInstance.emit(this._offcanvasRef)
                };
                this._offcanvasRef = t, this._activeInstance.emit(this._offcanvasRef), t.result.then(i, i)
            }
            _registerPanelCmpt(t) {
                this._panelCmpt = t, this._activePanelCmptHasChanged.next(), t.onDestroy(() => {
                    this._panelCmpt = void 0, this._activePanelCmptHasChanged.next()
                })
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    nh = (() => {
        class e {
            constructor() {
                this._injector = u(ie), this._offcanvasStack = u(Lr), this._config = u(Gr)
            }
            open(t, i = {}) {
                let n = yt(_i(yt({}, this._config), {
                    animation: this._config.animation
                }), i);
                return this._offcanvasStack.open(this._injector, t, n)
            }
            get activeInstance() {
                return this._offcanvasStack.activeInstance
            }
            dismiss(t) {
                this._offcanvasStack.dismiss(t)
            }
            hasOpenOffcanvas() {
                return this._offcanvasStack.hasOpenOffcanvas()
            }
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275prov = W({
                    token: e,
                    factory: e.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return e
    })(),
    Co = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({})
            }
        }
        return e
    })(),
    jr = [no, oo, so, ro, po, go, vo, bo, Co, yo, Do, wo, So, To, Mo, Oo, Ao, No],
    oh = (() => {
        class e {
            static {
                this.\u0275fac = function(i) {
                    return new(i || e)
                }
            }
            static {
                this.\u0275mod = P({
                    type: e
                })
            }
            static {
                this.\u0275inj = B({
                    imports: [jr, no, oo, so, ro, po, go, vo, bo, Co, yo, Do, wo, So, To, Mo, Oo, Ao, No]
                })
            }
        }
        return e
    })();
export {
    Un as a, ls as b, Yn as c, Uu as d, tr as e, Wu as f, zu as g, Vt as h, io as i, no as j, ro as k, fo as l, Zu as m, mr as n, Xu as o, _o as p, go as q, li as r, Tr as s, bo as t, eh as u, yo as v, th as w, Do as x, ih as y, No as z, ci as A, nh as B, oh as C
};