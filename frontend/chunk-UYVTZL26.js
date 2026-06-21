var th = Object.create;
var or = Object.defineProperty,
    nh = Object.defineProperties,
    rh = Object.getOwnPropertyDescriptor,
    oh = Object.getOwnPropertyDescriptors,
    ih = Object.getOwnPropertyNames,
    rr = Object.getOwnPropertySymbols,
    sh = Object.getPrototypeOf,
    Wo = Object.prototype.hasOwnProperty,
    rl = Object.prototype.propertyIsEnumerable;
var nl = (e, t, n) => t in e ? or(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: n
    }) : e[t] = n,
    ue = (e, t) => {
        for (var n in t ||= {}) Wo.call(t, n) && nl(e, n, t[n]);
        if (rr)
            for (var n of rr(t)) rl.call(t, n) && nl(e, n, t[n]);
        return e
    },
    de = (e, t) => nh(e, oh(t));
var Ww = (e => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, {
    get: (t, n) => (typeof require < "u" ? require : t)[n]
}) : e)(function(e) {
    if (typeof require < "u") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + e + '" is not supported')
});
var zw = (e, t) => {
    var n = {};
    for (var r in e) Wo.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
    if (e != null && rr)
        for (var r of rr(e)) t.indexOf(r) < 0 && rl.call(e, r) && (n[r] = e[r]);
    return n
};
var Gw = (e, t) => () => (t || e((t = {
        exports: {}
    }).exports, t), t.exports),
    Qw = (e, t) => {
        for (var n in t) or(e, n, {
            get: t[n],
            enumerable: !0
        })
    },
    ah = (e, t, n, r) => {
        if (t && typeof t == "object" || typeof t == "function")
            for (let o of ih(t)) !Wo.call(e, o) && o !== n && or(e, o, {
                get: () => t[o],
                enumerable: !(r = rh(t, o)) || r.enumerable
            });
        return e
    };
var Zw = (e, t, n) => (n = e != null ? th(sh(e)) : {}, ah(t || !e || !e.__esModule ? or(n, "default", {
    value: e,
    enumerable: !0
}) : n, e));
var ch = (e, t, n) => new Promise((r, o) => {
    var i = c => {
            try {
                a(n.next(c))
            } catch (l) {
                o(l)
            }
        },
        s = c => {
            try {
                a(n.throw(c))
            } catch (l) {
                o(l)
            }
        },
        a = c => c.done ? r(c.value) : Promise.resolve(c.value).then(i, s);
    a((n = n.apply(e, t)).next())
});

function Le(e) {
    return typeof e == "function"
}
var zo = !1,
    ne = {
        Promise: void 0,
        set useDeprecatedSynchronousErrorHandling(e) {
            if (e) {
                let t = new Error;
                console.warn(`DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: 
` + t.stack)
            } else zo && console.log("RxJS: Back to a better error behavior. Thank you. <3");
            zo = e
        },
        get useDeprecatedSynchronousErrorHandling() {
            return zo
        }
    };

function Fe(e) {
    setTimeout(() => {
        throw e
    }, 0)
}
var At = {
    closed: !0,
    next(e) {},
    error(e) {
        if (ne.useDeprecatedSynchronousErrorHandling) throw e;
        Fe(e)
    },
    complete() {}
};
var Z = Array.isArray || (e => e && typeof e.length == "number");

function kt(e) {
    return e !== null && typeof e == "object"
}
var lh = (() => {
        function e(t) {
            return Error.call(this), this.message = t ? `${t.length} errors occurred during unsubscription:
${t.map((n,r)=>`${r+1}) ${n.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = t, this
        }
        return e.prototype = Object.create(Error.prototype), e
    })(),
    yn = lh;
var x = class e {
    constructor(t) {
        this.closed = !1, this._parentOrParents = null, this._subscriptions = null, t && (this._ctorUnsubscribe = !0, this._unsubscribe = t)
    }
    unsubscribe() {
        let t;
        if (this.closed) return;
        let {
            _parentOrParents: n,
            _ctorUnsubscribe: r,
            _unsubscribe: o,
            _subscriptions: i
        } = this;
        if (this.closed = !0, this._parentOrParents = null, this._subscriptions = null, n instanceof e) n.remove(this);
        else if (n !== null)
            for (let s = 0; s < n.length; ++s) n[s].remove(this);
        if (Le(o)) {
            r && (this._unsubscribe = void 0);
            try {
                o.call(this)
            } catch (s) {
                t = s instanceof yn ? ol(s.errors) : [s]
            }
        }
        if (Z(i)) {
            let s = -1,
                a = i.length;
            for (; ++s < a;) {
                let c = i[s];
                if (kt(c)) try {
                    c.unsubscribe()
                } catch (l) {
                    t = t || [], l instanceof yn ? t = t.concat(ol(l.errors)) : t.push(l)
                }
            }
        }
        if (t) throw new yn(t)
    }
    add(t) {
        let n = t;
        if (!t) return e.EMPTY;
        switch (typeof t) {
            case "function":
                n = new e(t);
            case "object":
                if (n === this || n.closed || typeof n.unsubscribe != "function") return n;
                if (this.closed) return n.unsubscribe(), n;
                if (!(n instanceof e)) {
                    let i = n;
                    n = new e, n._subscriptions = [i]
                }
                break;
            default:
                throw new Error("unrecognized teardown " + t + " added to Subscription.")
        }
        let {
            _parentOrParents: r
        } = n;
        if (r === null) n._parentOrParents = this;
        else if (r instanceof e) {
            if (r === this) return n;
            n._parentOrParents = [r, this]
        } else if (r.indexOf(this) === -1) r.push(this);
        else return n;
        let o = this._subscriptions;
        return o === null ? this._subscriptions = [n] : o.push(n), n
    }
    remove(t) {
        let n = this._subscriptions;
        if (n) {
            let r = n.indexOf(t);
            r !== -1 && n.splice(r, 1)
        }
    }
};
x.EMPTY = function(e) {
    return e.closed = !0, e
}(new x);

function ol(e) {
    return e.reduce((t, n) => t.concat(n instanceof yn ? n.errors : n), [])
}
var ut = typeof Symbol == "function" ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();
var g = class e extends x {
        constructor(t, n, r) {
            switch (super(), this.syncErrorValue = null, this.syncErrorThrown = !1, this.syncErrorThrowable = !1, this.isStopped = !1, arguments.length) {
                case 0:
                    this.destination = At;
                    break;
                case 1:
                    if (!t) {
                        this.destination = At;
                        break
                    }
                    if (typeof t == "object") {
                        t instanceof e ? (this.syncErrorThrowable = t.syncErrorThrowable, this.destination = t, t.add(this)) : (this.syncErrorThrowable = !0, this.destination = new ir(this, t));
                        break
                    }
                default:
                    this.syncErrorThrowable = !0, this.destination = new ir(this, t, n, r);
                    break
            }
        } [ut]() {
            return this
        }
        static create(t, n, r) {
            let o = new e(t, n, r);
            return o.syncErrorThrowable = !1, o
        }
        next(t) {
            this.isStopped || this._next(t)
        }
        error(t) {
            this.isStopped || (this.isStopped = !0, this._error(t))
        }
        complete() {
            this.isStopped || (this.isStopped = !0, this._complete())
        }
        unsubscribe() {
            this.closed || (this.isStopped = !0, super.unsubscribe())
        }
        _next(t) {
            this.destination.next(t)
        }
        _error(t) {
            this.destination.error(t), this.unsubscribe()
        }
        _complete() {
            this.destination.complete(), this.unsubscribe()
        }
        _unsubscribeAndRecycle() {
            let {
                _parentOrParents: t
            } = this;
            return this._parentOrParents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parentOrParents = t, this
        }
    },
    ir = class extends g {
        constructor(t, n, r, o) {
            super(), this._parentSubscriber = t;
            let i, s = this;
            Le(n) ? i = n : n && (i = n.next, r = n.error, o = n.complete, n !== At && (s = Object.create(n), Le(s.unsubscribe) && this.add(s.unsubscribe.bind(s)), s.unsubscribe = this.unsubscribe.bind(this))), this._context = s, this._next = i, this._error = r, this._complete = o
        }
        next(t) {
            if (!this.isStopped && this._next) {
                let {
                    _parentSubscriber: n
                } = this;
                !ne.useDeprecatedSynchronousErrorHandling || !n.syncErrorThrowable ? this.__tryOrUnsub(this._next, t) : this.__tryOrSetError(n, this._next, t) && this.unsubscribe()
            }
        }
        error(t) {
            if (!this.isStopped) {
                let {
                    _parentSubscriber: n
                } = this, {
                    useDeprecatedSynchronousErrorHandling: r
                } = ne;
                if (this._error) !r || !n.syncErrorThrowable ? (this.__tryOrUnsub(this._error, t), this.unsubscribe()) : (this.__tryOrSetError(n, this._error, t), this.unsubscribe());
                else if (n.syncErrorThrowable) r ? (n.syncErrorValue = t, n.syncErrorThrown = !0) : Fe(t), this.unsubscribe();
                else {
                    if (this.unsubscribe(), r) throw t;
                    Fe(t)
                }
            }
        }
        complete() {
            if (!this.isStopped) {
                let {
                    _parentSubscriber: t
                } = this;
                if (this._complete) {
                    let n = () => this._complete.call(this._context);
                    !ne.useDeprecatedSynchronousErrorHandling || !t.syncErrorThrowable ? (this.__tryOrUnsub(n), this.unsubscribe()) : (this.__tryOrSetError(t, n), this.unsubscribe())
                } else this.unsubscribe()
            }
        }
        __tryOrUnsub(t, n) {
            try {
                t.call(this._context, n)
            } catch (r) {
                if (this.unsubscribe(), ne.useDeprecatedSynchronousErrorHandling) throw r;
                Fe(r)
            }
        }
        __tryOrSetError(t, n, r) {
            if (!ne.useDeprecatedSynchronousErrorHandling) throw new Error("bad call");
            try {
                n.call(this._context, r)
            } catch (o) {
                return ne.useDeprecatedSynchronousErrorHandling ? (t.syncErrorValue = o, t.syncErrorThrown = !0, !0) : (Fe(o), !0)
            }
            return !1
        }
        _unsubscribe() {
            let {
                _parentSubscriber: t
            } = this;
            this._context = null, this._parentSubscriber = null, t.unsubscribe()
        }
    };
var sr = class extends x {
    constructor(t, n) {
        super()
    }
    schedule(t, n = 0) {
        return this
    }
};
var Ot = class extends sr {
    constructor(t, n) {
        super(t, n), this.scheduler = t, this.work = n, this.pending = !1
    }
    schedule(t, n = 0) {
        if (this.closed) return this;
        this.state = t;
        let r = this.id,
            o = this.scheduler;
        return r != null && (this.id = this.recycleAsyncId(o, r, n)), this.pending = !0, this.delay = n, this.id = this.id || this.requestAsyncId(o, this.id, n), this
    }
    requestAsyncId(t, n, r = 0) {
        return setInterval(t.flush.bind(t, this), r)
    }
    recycleAsyncId(t, n, r = 0) {
        if (r !== null && this.delay === r && this.pending === !1) return n;
        clearInterval(n)
    }
    execute(t, n) {
        if (this.closed) return new Error("executing a cancelled action");
        this.pending = !1;
        let r = this._execute(t, n);
        if (r) return r;
        this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
    }
    _execute(t, n) {
        let r = !1,
            o;
        try {
            this.work(t)
        } catch (i) {
            r = !0, o = !!i && i || new Error(i)
        }
        if (r) return this.unsubscribe(), o
    }
    _unsubscribe() {
        let t = this.id,
            n = this.scheduler,
            r = n.actions,
            o = r.indexOf(this);
        this.work = null, this.state = null, this.pending = !1, this.scheduler = null, o !== -1 && r.splice(o, 1), t != null && (this.id = this.recycleAsyncId(n, t, null)), this.delay = null
    }
};
var Go = (() => {
    class e {
        constructor(n, r = e.now) {
            this.SchedulerAction = n, this.now = r
        }
        schedule(n, r = 0, o) {
            return new this.SchedulerAction(this, n).schedule(o, r)
        }
    }
    return e.now = () => Date.now(), e
})();
var Pt = class e extends Go {
    constructor(t, n = Go.now) {
        super(t, () => e.delegate && e.delegate !== this ? e.delegate.now() : n()), this.actions = [], this.active = !1, this.scheduled = void 0
    }
    schedule(t, n = 0, r) {
        return e.delegate && e.delegate !== this ? e.delegate.schedule(t, n, r) : super.schedule(t, n, r)
    }
    flush(t) {
        let {
            actions: n
        } = this;
        if (this.active) {
            n.push(t);
            return
        }
        let r;
        this.active = !0;
        do
            if (r = t.execute(t.state, t.delay)) break; while (t = n.shift());
        if (this.active = !1, r) {
            for (; t = n.shift();) t.unsubscribe();
            throw r
        }
    }
};
var uh = new Pt(Ot),
    Lt = uh;

function dh(e, t = Lt) {
    return n => n.lift(new Qo(e, t))
}
var Qo = class {
        constructor(t, n) {
            this.dueTime = t, this.scheduler = n
        }
        call(t, n) {
            return n.subscribe(new Zo(t, this.dueTime, this.scheduler))
        }
    },
    Zo = class extends g {
        constructor(t, n, r) {
            super(t), this.dueTime = n, this.scheduler = r, this.debouncedSubscription = null, this.lastValue = null, this.hasValue = !1
        }
        _next(t) {
            this.clearDebounce(), this.lastValue = t, this.hasValue = !0, this.add(this.debouncedSubscription = this.scheduler.schedule(fh, this.dueTime, this))
        }
        _complete() {
            this.debouncedNext(), this.destination.complete()
        }
        debouncedNext() {
            if (this.clearDebounce(), this.hasValue) {
                let {
                    lastValue: t
                } = this;
                this.lastValue = null, this.hasValue = !1, this.destination.next(t)
            }
        }
        clearDebounce() {
            let t = this.debouncedSubscription;
            t !== null && (this.remove(t), t.unsubscribe(), this.debouncedSubscription = null)
        }
    };

function fh(e) {
    e.debouncedNext()
}

function ph(e, t) {
    return n => n.lift(new Yo(e, t))
}
var Yo = class {
        constructor(t, n) {
            this.compare = t, this.keySelector = n
        }
        call(t, n) {
            return n.subscribe(new Jo(t, this.compare, this.keySelector))
        }
    },
    Jo = class extends g {
        constructor(t, n, r) {
            super(t), this.keySelector = r, this.hasKey = !1, typeof n == "function" && (this.compare = n)
        }
        compare(t, n) {
            return t === n
        }
        _next(t) {
            let n;
            try {
                let {
                    keySelector: o
                } = this;
                n = o ? o(t) : t
            } catch (o) {
                return this.destination.error(o)
            }
            let r = !1;
            if (this.hasKey) try {
                let {
                    compare: o
                } = this;
                r = o(this.key, n)
            } catch (o) {
                return this.destination.error(o)
            } else this.hasKey = !0;
            r || (this.key = n, this.destination.next(t))
        }
    };

function il(e) {
    for (; e;) {
        let {
            closed: t,
            destination: n,
            isStopped: r
        } = e;
        if (t || r) return !1;
        n && n instanceof g ? e = n : e = null
    }
    return !0
}

function sl(e, t, n) {
    if (e) {
        if (e instanceof g) return e;
        if (e[ut]) return e[ut]()
    }
    return !e && !t && !n ? new g(At) : new g(e, t, n)
}
var Ne = typeof Symbol == "function" && Symbol.observable || "@@observable";

function Ze(e) {
    return e
}

function hh(...e) {
    return Ko(e)
}

function Ko(e) {
    return e.length === 0 ? Ze : e.length === 1 ? e[0] : function(n) {
        return e.reduce((r, o) => o(r), n)
    }
}
var b = (() => {
    class e {
        constructor(n) {
            this._isScalar = !1, n && (this._subscribe = n)
        }
        lift(n) {
            let r = new e;
            return r.source = this, r.operator = n, r
        }
        subscribe(n, r, o) {
            let {
                operator: i
            } = this, s = sl(n, r, o);
            if (i ? s.add(i.call(s, this.source)) : s.add(this.source || ne.useDeprecatedSynchronousErrorHandling && !s.syncErrorThrowable ? this._subscribe(s) : this._trySubscribe(s)), ne.useDeprecatedSynchronousErrorHandling && s.syncErrorThrowable && (s.syncErrorThrowable = !1, s.syncErrorThrown)) throw s.syncErrorValue;
            return s
        }
        _trySubscribe(n) {
            try {
                return this._subscribe(n)
            } catch (r) {
                ne.useDeprecatedSynchronousErrorHandling && (n.syncErrorThrown = !0, n.syncErrorValue = r), il(n) ? n.error(r) : console.warn(r)
            }
        }
        forEach(n, r) {
            return r = al(r), new r((o, i) => {
                let s;
                s = this.subscribe(a => {
                    try {
                        n(a)
                    } catch (c) {
                        i(c), s && s.unsubscribe()
                    }
                }, i, o)
            })
        }
        _subscribe(n) {
            let {
                source: r
            } = this;
            return r && r.subscribe(n)
        } [Ne]() {
            return this
        }
        pipe(...n) {
            return n.length === 0 ? this : Ko(n)(this)
        }
        toPromise(n) {
            return n = al(n), new n((r, o) => {
                let i;
                this.subscribe(s => i = s, s => o(s), () => r(i))
            })
        }
    }
    return e.create = t => new e(t), e
})();

function al(e) {
    if (e || (e = ne.Promise || Promise), !e) throw new Error("no Promise impl found");
    return e
}
var ar = e => t => {
    for (let n = 0, r = e.length; n < r && !t.closed; n++) t.next(e[n]);
    t.complete()
};
var cl = e => t => (e.then(n => {
    t.closed || (t.next(n), t.complete())
}, n => t.error(n)).then(null, Fe), t);

function gh() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator
}
var fe = gh();
var ll = e => t => {
    let n = e[fe]();
    do {
        let r;
        try {
            r = n.next()
        } catch (o) {
            return t.error(o), t
        }
        if (r.done) {
            t.complete();
            break
        }
        if (t.next(r.value), t.closed) break
    } while (!0);
    return typeof n.return == "function" && t.add(() => {
        n.return && n.return()
    }), t
};
var ul = e => t => {
    let n = e[Ne]();
    if (typeof n.subscribe != "function") throw new TypeError("Provided object does not correctly implement Symbol.observable");
    return n.subscribe(t)
};
var cr = e => e && typeof e.length == "number" && typeof e != "function";

function lr(e) {
    return !!e && typeof e.subscribe != "function" && typeof e.then == "function"
}
var Ft = e => {
    if (e && typeof e[Ne] == "function") return ul(e);
    if (cr(e)) return ar(e);
    if (lr(e)) return cl(e);
    if (e && typeof e[fe] == "function") return ll(e);
    {
        let n = `You provided ${kt(e)?"an invalid object":`'${e}'`} where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.`;
        throw new TypeError(n)
    }
};
var re = class extends g {
    constructor(t) {
        super(), this.parent = t
    }
    _next(t) {
        this.parent.notifyNext(t)
    }
    _error(t) {
        this.parent.notifyError(t), this.unsubscribe()
    }
    _complete() {
        this.parent.notifyComplete(), this.unsubscribe()
    }
};
var oe = class extends g {
    notifyNext(t) {
        this.destination.next(t)
    }
    notifyError(t) {
        this.destination.error(t)
    }
    notifyComplete() {
        this.destination.complete()
    }
};

function me(e, t) {
    if (t.closed) return;
    if (e instanceof b) return e.subscribe(t);
    let n;
    try {
        n = Ft(e)(t)
    } catch (r) {
        t.error(r)
    }
    return n
}

function Xo(e) {
    return !Z(e) && e - parseFloat(e) + 1 >= 0
}

function Ie(e) {
    return e && typeof e.schedule == "function"
}

function mh(e = 0, t, n) {
    let r = -1;
    return Xo(t) ? r = Number(t) < 1 && 1 || Number(t) : Ie(t) && (n = t), Ie(n) || (n = Lt), new b(o => {
        let i = Xo(e) ? e : +e - n.now();
        return n.schedule(yh, i, {
            index: 0,
            period: r,
            subscriber: o
        })
    })
}

function yh(e) {
    let {
        index: t,
        period: n,
        subscriber: r
    } = e;
    if (r.next(t), !r.closed) {
        if (n === -1) return r.complete();
        e.index = t + 1, this.schedule(e, n)
    }
}
var ur = class extends g {
    constructor(t, n, r) {
        super(), this.parent = t, this.outerValue = n, this.outerIndex = r, this.index = 0
    }
    _next(t) {
        this.parent.notifyNext(this.outerValue, t, this.outerIndex, this.index++, this)
    }
    _error(t) {
        this.parent.notifyError(t, this), this.unsubscribe()
    }
    _complete() {
        this.parent.notifyComplete(this), this.unsubscribe()
    }
};

function Vt(e, t, n, r, o = new ur(e, n, r)) {
    if (!o.closed) return t instanceof b ? t.subscribe(o) : Ft(t)(o)
}
var Ye = class extends g {
    notifyNext(t, n, r, o, i) {
        this.destination.next(n)
    }
    notifyError(t, n) {
        this.destination.error(t)
    }
    notifyComplete(t) {
        this.destination.complete()
    }
};

function vh(e) {
    return function(n) {
        let r = new ei(e),
            o = n.lift(r);
        return r.caught = o
    }
}
var ei = class {
        constructor(t) {
            this.selector = t
        }
        call(t, n) {
            return n.subscribe(new ti(t, this.selector, this.caught))
        }
    },
    ti = class extends oe {
        constructor(t, n, r) {
            super(t), this.selector = n, this.caught = r
        }
        error(t) {
            if (!this.isStopped) {
                let n;
                try {
                    n = this.selector(t, this.caught)
                } catch (i) {
                    super.error(i);
                    return
                }
                this._unsubscribeAndRecycle();
                let r = new re(this);
                this.add(r);
                let o = me(n, r);
                o !== r && this.add(o)
            }
        }
    };

function jt(e, t) {
    return new b(n => {
        let r = new x,
            o = 0;
        return r.add(t.schedule(function() {
            if (o === e.length) {
                n.complete();
                return
            }
            n.next(e[o++]), n.closed || r.add(this.schedule())
        })), r
    })
}

function xe(e, t) {
    return t ? jt(e, t) : new b(ar(e))
}
var dl = {};

function Ih(...e) {
    let t, n;
    return Ie(e[e.length - 1]) && (n = e.pop()), typeof e[e.length - 1] == "function" && (t = e.pop()), e.length === 1 && Z(e[0]) && (e = e[0]), xe(e, n).lift(new ni(t))
}
var ni = class {
        constructor(t) {
            this.resultSelector = t
        }
        call(t, n) {
            return n.subscribe(new ri(t, this.resultSelector))
        }
    },
    ri = class extends Ye {
        constructor(t, n) {
            super(t), this.resultSelector = n, this.active = 0, this.values = [], this.observables = []
        }
        _next(t) {
            this.values.push(dl), this.observables.push(t)
        }
        _complete() {
            let t = this.observables,
                n = t.length;
            if (n === 0) this.destination.complete();
            else {
                this.active = n, this.toRespond = n;
                for (let r = 0; r < n; r++) {
                    let o = t[r];
                    this.add(Vt(this, o, void 0, r))
                }
            }
        }
        notifyComplete(t) {
            (this.active -= 1) === 0 && this.destination.complete()
        }
        notifyNext(t, n, r) {
            let o = this.values,
                i = o[r],
                s = this.toRespond ? i === dl ? --this.toRespond : this.toRespond : 0;
            o[r] = n, s === 0 && (this.resultSelector ? this._tryResultSelector(o) : this.destination.next(o.slice()))
        }
        _tryResultSelector(t) {
            let n;
            try {
                n = this.resultSelector.apply(this, t)
            } catch (r) {
                this.destination.error(r);
                return
            }
            this.destination.next(n)
        }
    };

function fl(e, t) {
    return new b(n => {
        let r = new x;
        return r.add(t.schedule(() => {
            let o = e[Ne]();
            r.add(o.subscribe({
                next(i) {
                    r.add(t.schedule(() => n.next(i)))
                },
                error(i) {
                    r.add(t.schedule(() => n.error(i)))
                },
                complete() {
                    r.add(t.schedule(() => n.complete()))
                }
            }))
        })), r
    })
}

function pl(e, t) {
    return new b(n => {
        let r = new x;
        return r.add(t.schedule(() => e.then(o => {
            r.add(t.schedule(() => {
                n.next(o), r.add(t.schedule(() => n.complete()))
            }))
        }, o => {
            r.add(t.schedule(() => n.error(o)))
        }))), r
    })
}

function hl(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new b(n => {
        let r = new x,
            o;
        return r.add(() => {
            o && typeof o.return == "function" && o.return()
        }), r.add(t.schedule(() => {
            o = e[fe](), r.add(t.schedule(function() {
                if (n.closed) return;
                let i, s;
                try {
                    let a = o.next();
                    i = a.value, s = a.done
                } catch (a) {
                    n.error(a);
                    return
                }
                s ? n.complete() : (n.next(i), this.schedule())
            }))
        })), r
    })
}

function gl(e) {
    return e && typeof e[Ne] == "function"
}

function ml(e) {
    return e && typeof e[fe] == "function"
}

function yl(e, t) {
    if (e != null) {
        if (gl(e)) return fl(e, t);
        if (lr(e)) return pl(e, t);
        if (cr(e)) return jt(e, t);
        if (ml(e) || typeof e == "string") return hl(e, t)
    }
    throw new TypeError((e !== null && typeof e || e) + " is not observable")
}

function Ee(e, t) {
    return t ? yl(e, t) : e instanceof b ? e : new b(Ft(e))
}

function dt(...e) {
    let t = e[e.length - 1];
    return Ie(t) ? (e.pop(), jt(e, t)) : xe(e)
}

function Y(e, t) {
    return function(r) {
        if (typeof e != "function") throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
        return r.lift(new oi(e, t))
    }
}
var oi = class {
        constructor(t, n) {
            this.project = t, this.thisArg = n
        }
        call(t, n) {
            return n.subscribe(new ii(t, this.project, this.thisArg))
        }
    },
    ii = class extends g {
        constructor(t, n, r) {
            super(t), this.project = n, this.count = 0, this.thisArg = r || this
        }
        _next(t) {
            let n;
            try {
                n = this.project.call(this.thisArg, t, this.count++)
            } catch (r) {
                this.destination.error(r);
                return
            }
            this.destination.next(n)
        }
    };

function Ht(e, t, n = Number.POSITIVE_INFINITY) {
    return typeof t == "function" ? r => r.pipe(Ht((o, i) => Ee(e(o, i)).pipe(Y((s, a) => t(o, s, i, a))), n)) : (typeof t == "number" && (n = t), r => r.lift(new si(e, n)))
}
var si = class {
        constructor(t, n = Number.POSITIVE_INFINITY) {
            this.project = t, this.concurrent = n
        }
        call(t, n) {
            return n.subscribe(new ai(t, this.project, this.concurrent))
        }
    },
    ai = class extends oe {
        constructor(t, n, r = Number.POSITIVE_INFINITY) {
            super(t), this.project = n, this.concurrent = r, this.hasCompleted = !1, this.buffer = [], this.active = 0, this.index = 0
        }
        _next(t) {
            this.active < this.concurrent ? this._tryNext(t) : this.buffer.push(t)
        }
        _tryNext(t) {
            let n, r = this.index++;
            try {
                n = this.project(t, r)
            } catch (o) {
                this.destination.error(o);
                return
            }
            this.active++, this._innerSub(n)
        }
        _innerSub(t) {
            let n = new re(this),
                r = this.destination;
            r.add(n);
            let o = me(t, n);
            o !== n && r.add(o)
        }
        _complete() {
            this.hasCompleted = !0, this.active === 0 && this.buffer.length === 0 && this.destination.complete(), this.unsubscribe()
        }
        notifyNext(t) {
            this.destination.next(t)
        }
        notifyComplete() {
            let t = this.buffer;
            this.active--, t.length > 0 ? this._next(t.shift()) : this.active === 0 && this.hasCompleted && this.destination.complete()
        }
    };

function vn(e = Number.POSITIVE_INFINITY) {
    return Ht(Ze, e)
}

function vl() {
    return vn(1)
}

function Bt(...e) {
    return vl()(dt(...e))
}

function Eh(e, t) {
    return Ht(e, t, 1)
}

function In(e = null) {
    return t => t.lift(new ci(e))
}
var ci = class {
        constructor(t) {
            this.defaultValue = t
        }
        call(t, n) {
            return n.subscribe(new li(t, this.defaultValue))
        }
    },
    li = class extends g {
        constructor(t, n) {
            super(t), this.defaultValue = n, this.isEmpty = !0
        }
        _next(t) {
            this.isEmpty = !1, this.destination.next(t)
        }
        _complete() {
            this.isEmpty && this.destination.next(this.defaultValue), this.destination.complete()
        }
    };

function Il(e) {
    return e instanceof Date && !isNaN(+e)
}
var El = new b(e => e.complete());

function Je(e) {
    return e ? bh(e) : El
}

function bh(e) {
    return new b(t => e.schedule(() => t.complete()))
}

function ui(e, t) {
    return t ? new b(n => t.schedule(wh, 0, {
        error: e,
        subscriber: n
    })) : new b(n => n.error(e))
}

function wh({
    error: e,
    subscriber: t
}) {
    t.error(e)
}
var q = class e {
    constructor(t, n, r) {
        this.kind = t, this.value = n, this.error = r, this.hasValue = t === "N"
    }
    observe(t) {
        switch (this.kind) {
            case "N":
                return t.next && t.next(this.value);
            case "E":
                return t.error && t.error(this.error);
            case "C":
                return t.complete && t.complete()
        }
    }
    do(t, n, r) {
        switch (this.kind) {
            case "N":
                return t && t(this.value);
            case "E":
                return n && n(this.error);
            case "C":
                return r && r()
        }
    }
    accept(t, n, r) {
        return t && typeof t.next == "function" ? this.observe(t) : this.do(t, n, r)
    }
    toObservable() {
        switch (this.kind) {
            case "N":
                return dt(this.value);
            case "E":
                return ui(this.error);
            case "C":
                return Je()
        }
        throw new Error("unexpected notification kind value")
    }
    static
    createNext(t) {
        return typeof t < "u" ? new e("N", t) : e.undefinedValueNotification
    }
    static createError(t) {
        return new e("E", void 0, t)
    }
    static createComplete() {
        return e.completeNotification
    }
};
q.completeNotification = new q("C");
q.undefinedValueNotification = new q("N", void 0);

function Dh(e, t = Lt) {
    let r = Il(e) ? +e - t.now() : Math.abs(e);
    return o => o.lift(new di(r, t))
}
var di = class {
        constructor(t, n) {
            this.delay = t, this.scheduler = n
        }
        call(t, n) {
            return n.subscribe(new fi(t, this.delay, this.scheduler))
        }
    },
    fi = class e extends g {
        constructor(t, n, r) {
            super(t), this.delay = n, this.scheduler = r, this.queue = [], this.active = !1, this.errored = !1
        }
        static dispatch(t) {
            let n = t.source,
                r = n.queue,
                o = t.scheduler,
                i = t.destination;
            for (; r.length > 0 && r[0].time - o.now() <= 0;) r.shift().notification.observe(i);
            if (r.length > 0) {
                let s = Math.max(0, r[0].time - o.now());
                this.schedule(t, s)
            } else this.unsubscribe(), n.active = !1
        }
        _schedule(t) {
            this.active = !0, this.destination.add(t.schedule(e.dispatch, this.delay, {
                source: this,
                destination: this.destination,
                scheduler: t
            }))
        }
        scheduleNotification(t) {
            if (this.errored === !0) return;
            let n = this.scheduler,
                r = new pi(n.now() + this.delay, t);
            this.queue.push(r), this.active === !1 && this._schedule(n)
        }
        _next(t) {
            this.scheduleNotification(q.createNext(t))
        }
        _error(t) {
            this.errored = !0, this.queue = [], this.destination.error(t), this.unsubscribe()
        }
        _complete() {
            this.scheduleNotification(q.createComplete()), this.unsubscribe()
        }
    },
    pi = class {
        constructor(t, n) {
            this.time = t, this.notification = n
        }
    };

function Ch() {
    return function(t) {
        return t.lift(new hi)
    }
}
var hi = class {
        call(t, n) {
            return n.subscribe(new gi(t))
        }
    },
    gi = class extends g {
        constructor(t) {
            super(t)
        }
        _next(t) {
            t.observe(this.destination)
        }
    };
var Mh = (() => {
        function e() {
            return Error.call(this), this.message = "argument out of range", this.name = "ArgumentOutOfRangeError", this
        }
        return e.prototype = Object.create(Error.prototype), e
    })(),
    dr = Mh;

function En(e, t) {
    return function(r) {
        return r.lift(new mi(e, t))
    }
}
var mi = class {
        constructor(t, n) {
            this.predicate = t, this.thisArg = n
        }
        call(t, n) {
            return n.subscribe(new yi(t, this.predicate, this.thisArg))
        }
    },
    yi = class extends g {
        constructor(t, n, r) {
            super(t), this.predicate = n, this.thisArg = r, this.count = 0
        }
        _next(t) {
            let n;
            try {
                n = this.predicate.call(this.thisArg, t, this.count++)
            } catch (r) {
                this.destination.error(r);
                return
            }
            n && this.destination.next(t)
        }
    };
var _h = (() => {
        function e() {
            return Error.call(this), this.message = "no elements in sequence", this.name = "EmptyError", this
        }
        return e.prototype = Object.create(Error.prototype), e
    })(),
    ft = _h;

function fr(e = Nh) {
    return t => t.lift(new vi(e))
}
var vi = class {
        constructor(t) {
            this.errorFactory = t
        }
        call(t, n) {
            return n.subscribe(new Ii(t, this.errorFactory))
        }
    },
    Ii = class extends g {
        constructor(t, n) {
            super(t), this.errorFactory = n, this.hasValue = !1
        }
        _next(t) {
            this.hasValue = !0, this.destination.next(t)
        }
        _complete() {
            if (this.hasValue) return this.destination.complete();
            {
                let t;
                try {
                    t = this.errorFactory()
                } catch (n) {
                    t = n
                }
                this.destination.error(t)
            }
        }
    };

function Nh() {
    return new ft
}

function wi(e) {
    return t => e === 0 ? Je() : t.lift(new Ei(e))
}
var Ei = class {
        constructor(t) {
            if (this.total = t, this.total < 0) throw new dr
        }
        call(t, n) {
            return n.subscribe(new bi(t, this.total))
        }
    },
    bi = class extends g {
        constructor(t, n) {
            super(t), this.total = n, this.count = 0
        }
        _next(t) {
            let n = this.total,
                r = ++this.count;
            r <= n && (this.destination.next(t), r === n && (this.destination.complete(), this.unsubscribe()))
        }
    };

function xh(...e) {
    return t => Bt(t, dt(...e))
}

function bl(e, t) {
    return t ? n => n.pipe(bl((r, o) => Ee(e(r, o)).pipe(Y((i, s) => t(r, i, o, s))))) : n => n.lift(new Di(e))
}
var Di = class {
        constructor(t) {
            this.project = t
        }
        call(t, n) {
            return n.subscribe(new Ci(t, this.project))
        }
    },
    Ci = class extends oe {
        constructor(t, n) {
            super(t), this.project = n, this.hasSubscription = !1, this.hasCompleted = !1, this.index = 0
        }
        _next(t) {
            this.hasSubscription || this.tryNext(t)
        }
        tryNext(t) {
            let n, r = this.index++;
            try {
                n = this.project(t, r)
            } catch (o) {
                this.destination.error(o);
                return
            }
            this.hasSubscription = !0, this._innerSub(n)
        }
        _innerSub(t) {
            let n = new re(this),
                r = this.destination;
            r.add(n);
            let o = me(t, n);
            o !== n && r.add(o)
        }
        _complete() {
            this.hasCompleted = !0, this.hasSubscription || this.destination.complete(), this.unsubscribe()
        }
        notifyNext(t) {
            this.destination.next(t)
        }
        notifyError(t) {
            this.destination.error(t)
        }
        notifyComplete() {
            this.hasSubscription = !1, this.hasCompleted && this.destination.complete()
        }
    };

function Th(e) {
    return t => t.lift(new Mi(e))
}
var Mi = class {
        constructor(t) {
            this.callback = t
        }
        call(t, n) {
            return n.subscribe(new _i(t, this.callback))
        }
    },
    _i = class extends g {
        constructor(t, n) {
            super(t), this.add(new x(n))
        }
    };

function Sh(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? En((o, i) => e(o, i, r)) : Ze, wi(1), n ? In(t) : fr(() => new ft))
}
var Rh = (() => {
        function e() {
            return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this
        }
        return e.prototype = Object.create(Error.prototype), e
    })(),
    Ke = Rh;
var pr = class extends x {
    constructor(t, n) {
        super(), this.subject = t, this.subscriber = n, this.closed = !1
    }
    unsubscribe() {
        if (this.closed) return;
        this.closed = !0;
        let t = this.subject,
            n = t.observers;
        if (this.subject = null, !n || n.length === 0 || t.isStopped || t.closed) return;
        let r = n.indexOf(this.subscriber);
        r !== -1 && n.splice(r, 1)
    }
};
var bn = class extends g {
        constructor(t) {
            super(t), this.destination = t
        }
    },
    Te = (() => {
        class e extends b {
            constructor() {
                super(), this.observers = [], this.closed = !1, this.isStopped = !1, this.hasError = !1, this.thrownError = null
            } [ut]() {
                return new bn(this)
            }
            lift(n) {
                let r = new hr(this, this);
                return r.operator = n, r
            }
            next(n) {
                if (this.closed) throw new Ke;
                if (!this.isStopped) {
                    let {
                        observers: r
                    } = this, o = r.length, i = r.slice();
                    for (let s = 0; s < o; s++) i[s].next(n)
                }
            }
            error(n) {
                if (this.closed) throw new Ke;
                this.hasError = !0, this.thrownError = n, this.isStopped = !0;
                let {
                    observers: r
                } = this, o = r.length, i = r.slice();
                for (let s = 0; s < o; s++) i[s].error(n);
                this.observers.length = 0
            }
            complete() {
                if (this.closed) throw new Ke;
                this.isStopped = !0;
                let {
                    observers: n
                } = this, r = n.length, o = n.slice();
                for (let i = 0; i < r; i++) o[i].complete();
                this.observers.length = 0
            }
            unsubscribe() {
                this.isStopped = !0, this.closed = !0, this.observers = null
            }
            _trySubscribe(n) {
                if (this.closed) throw new Ke;
                return super._trySubscribe(n)
            }
            _subscribe(n) {
                if (this.closed) throw new Ke;
                return this.hasError ? (n.error(this.thrownError), x.EMPTY) : this.isStopped ? (n.complete(), x.EMPTY) : (this.observers.push(n), new pr(this, n))
            }
            asObservable() {
                let n = new b;
                return n.source = this, n
            }
        }
        return e.create = (t, n) => new hr(t, n), e
    })(),
    hr = class extends Te {
        constructor(t, n) {
            super(), this.destination = t, this.source = n
        }
        next(t) {
            let {
                destination: n
            } = this;
            n && n.next && n.next(t)
        }
        error(t) {
            let {
                destination: n
            } = this;
            n && n.error && this.destination.error(t)
        }
        complete() {
            let {
                destination: t
            } = this;
            t && t.complete && this.destination.complete()
        }
        _subscribe(t) {
            let {
                source: n
            } = this;
            return n ? this.source.subscribe(t) : x.EMPTY
        }
    };

function Ah(e, t, n, r) {
    return o => o.lift(new Ni(e, t, n, r))
}
var Ni = class {
        constructor(t, n, r, o) {
            this.keySelector = t, this.elementSelector = n, this.durationSelector = r, this.subjectSelector = o
        }
        call(t, n) {
            return n.subscribe(new xi(t, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector))
        }
    },
    xi = class extends g {
        constructor(t, n, r, o, i) {
            super(t), this.keySelector = n, this.elementSelector = r, this.durationSelector = o, this.subjectSelector = i, this.groups = null, this.attemptedToUnsubscribe = !1, this.count = 0
        }
        _next(t) {
            let n;
            try {
                n = this.keySelector(t)
            } catch (r) {
                this.error(r);
                return
            }
            this._group(t, n)
        }
        _group(t, n) {
            let r = this.groups;
            r || (r = this.groups = new Map);
            let o = r.get(n),
                i;
            if (this.elementSelector) try {
                i = this.elementSelector(t)
            } catch (s) {
                this.error(s)
            } else i = t;
            if (!o) {
                o = this.subjectSelector ? this.subjectSelector() : new Te, r.set(n, o);
                let s = new gr(n, o, this);
                if (this.destination.next(s), this.durationSelector) {
                    let a;
                    try {
                        a = this.durationSelector(new gr(n, o))
                    } catch (c) {
                        this.error(c);
                        return
                    }
                    this.add(a.subscribe(new Ti(n, o, this)))
                }
            }
            o.closed || o.next(i)
        }
        _error(t) {
            let n = this.groups;
            n && (n.forEach((r, o) => {
                r.error(t)
            }), n.clear()), this.destination.error(t)
        }
        _complete() {
            let t = this.groups;
            t && (t.forEach((n, r) => {
                n.complete()
            }), t.clear()), this.destination.complete()
        }
        removeGroup(t) {
            this.groups.delete(t)
        }
        unsubscribe() {
            this.closed || (this.attemptedToUnsubscribe = !0, this.count === 0 && super.unsubscribe())
        }
    },
    Ti = class extends g {
        constructor(t, n, r) {
            super(n), this.key = t, this.group = n, this.parent = r
        }
        _next(t) {
            this.complete()
        }
        _unsubscribe() {
            let {
                parent: t,
                key: n
            } = this;
            this.key = this.parent = null, t && t.removeGroup(n)
        }
    },
    gr = class extends b {
        constructor(t, n, r) {
            super(), this.key = t, this.groupSubject = n, this.refCountSubscription = r
        }
        _subscribe(t) {
            let n = new x,
                {
                    refCountSubscription: r,
                    groupSubject: o
                } = this;
            return r && !r.closed && n.add(new Si(r)), n.add(o.subscribe(t)), n
        }
    },
    Si = class extends x {
        constructor(t) {
            super(), this.parent = t, t.count++
        }
        unsubscribe() {
            let t = this.parent;
            !t.closed && !this.closed && (super.unsubscribe(), t.count -= 1, t.count === 0 && t.attemptedToUnsubscribe && t.unsubscribe())
        }
    };

function kh() {
    return function(t) {
        return t.lift(new Ri)
    }
}
var Ri = class {
        call(t, n) {
            return n.subscribe(new Ai(t))
        }
    },
    Ai = class extends g {
        _next(t) {}
    };

function Pi(e) {
    return function(n) {
        return e === 0 ? Je() : n.lift(new ki(e))
    }
}
var ki = class {
        constructor(t) {
            if (this.total = t, this.total < 0) throw new dr
        }
        call(t, n) {
            return n.subscribe(new Oi(t, this.total))
        }
    },
    Oi = class extends g {
        constructor(t, n) {
            super(t), this.total = n, this.ring = new Array, this.count = 0
        }
        _next(t) {
            let n = this.ring,
                r = this.total,
                o = this.count++;
            if (n.length < r) n.push(t);
            else {
                let i = o % r;
                n[i] = t
            }
        }
        _complete() {
            let t = this.destination,
                n = this.count;
            if (n > 0) {
                let r = this.count >= this.total ? this.total : this.count,
                    o = this.ring;
                for (let i = 0; i < r; i++) {
                    let s = n++ % r;
                    t.next(o[s])
                }
            }
            t.complete()
        }
    };

function Oh(e, t) {
    let n = arguments.length >= 2;
    return r => r.pipe(e ? En((o, i) => e(o, i, r)) : Ze, Pi(1), n ? In(t) : fr(() => new ft))
}

function Ph(e) {
    return t => t.lift(new Li(e))
}
var Li = class {
        constructor(t) {
            this.value = t
        }
        call(t, n) {
            return n.subscribe(new Fi(t, this.value))
        }
    },
    Fi = class extends g {
        constructor(t, n) {
            super(t), this.value = n
        }
        _next(t) {
            this.destination.next(this.value)
        }
    };

function Lh() {
    return function(t) {
        return t.lift(new Vi)
    }
}
var Vi = class {
        call(t, n) {
            return n.subscribe(new ji(t))
        }
    },
    ji = class extends g {
        constructor(t) {
            super(t)
        }
        _next(t) {
            this.destination.next(q.createNext(t))
        }
        _error(t) {
            let n = this.destination;
            n.next(q.createError(t)), n.complete()
        }
        _complete() {
            let t = this.destination;
            t.next(q.createComplete()), t.complete()
        }
    };

function Fh(e, t) {
    let n = !1;
    return arguments.length >= 2 && (n = !0),
        function(o) {
            return o.lift(new Hi(e, t, n))
        }
}
var Hi = class {
        constructor(t, n, r = !1) {
            this.accumulator = t, this.seed = n, this.hasSeed = r
        }
        call(t, n) {
            return n.subscribe(new Bi(t, this.accumulator, this.seed, this.hasSeed))
        }
    },
    Bi = class extends g {
        constructor(t, n, r, o) {
            super(t), this.accumulator = n, this._seed = r, this.hasSeed = o, this.index = 0
        }
        get seed() {
            return this._seed
        }
        set seed(t) {
            this.hasSeed = !0, this._seed = t
        }
        _next(t) {
            if (!this.hasSeed) this.seed = t, this.destination.next(t);
            else return this._tryNext(t)
        }
        _tryNext(t) {
            let n = this.index++,
                r;
            try {
                r = this.accumulator(this.seed, t, n)
            } catch (o) {
                this.destination.error(o)
            }
            this.seed = r, this.destination.next(r)
        }
    };

function Vh(...e) {
    let t = Number.POSITIVE_INFINITY,
        n = null,
        r = e[e.length - 1];
    return Ie(r) ? (n = e.pop(), e.length > 1 && typeof e[e.length - 1] == "number" && (t = e.pop())) : typeof r == "number" && (t = e.pop()), n === null && e.length === 1 && e[0] instanceof b ? e[0] : vn(t)(xe(e, n))
}

function qi() {
    return function(t) {
        return t.lift(new $i(t))
    }
}
var $i = class {
        constructor(t) {
            this.connectable = t
        }
        call(t, n) {
            let {
                connectable: r
            } = this;
            r._refCount++;
            let o = new Ui(t, r),
                i = n.subscribe(o);
            return o.closed || (o.connection = r.connect()), i
        }
    },
    Ui = class extends g {
        constructor(t, n) {
            super(t), this.connectable = n
        }
        _unsubscribe() {
            let {
                connectable: t
            } = this;
            if (!t) {
                this.connection = null;
                return
            }
            this.connectable = null;
            let n = t._refCount;
            if (n <= 0) {
                this.connection = null;
                return
            }
            if (t._refCount = n - 1, n > 1) {
                this.connection = null;
                return
            }
            let {
                connection: r
            } = this, o = t._connection;
            this.connection = null, o && (!r || o === r) && o.unsubscribe()
        }
    };
var mr = class extends b {
        constructor(t, n) {
            super(), this.source = t, this.subjectFactory = n, this._refCount = 0, this._isComplete = !1
        }
        _subscribe(t) {
            return this.getSubject().subscribe(t)
        }
        getSubject() {
            let t = this._subject;
            return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject
        }
        connect() {
            let t = this._connection;
            return t || (this._isComplete = !1, t = this._connection = new x, t.add(this.source.subscribe(new Wi(this.getSubject(), this))), t.closed && (this._connection = null, t = x.EMPTY)), t
        }
        refCount() {
            return qi()(this)
        }
    },
    TN = (() => {
        let e = mr.prototype;
        return {
            operator: {
                value: null
            },
            _refCount: {
                value: 0,
                writable: !0
            },
            _subject: {
                value: null,
                writable: !0
            },
            _connection: {
                value: null,
                writable: !0
            },
            _subscribe: {
                value: e._subscribe
            },
            _isComplete: {
                value: e._isComplete,
                writable: !0
            },
            getSubject: {
                value: e.getSubject
            },
            connect: {
                value: e.connect
            },
            refCount: {
                value: e.refCount
            }
        }
    })(),
    Wi = class extends bn {
        constructor(t, n) {
            super(t), this.connectable = n
        }
        _error(t) {
            this._unsubscribe(), super._error(t)
        }
        _complete() {
            this.connectable._isComplete = !0, this._unsubscribe(), super._complete()
        }
        _unsubscribe() {
            let t = this.connectable;
            if (t) {
                this.connectable = null;
                let n = t._connection;
                t._refCount = 0, t._subject = null, t._connection = null, n && n.unsubscribe()
            }
        }
    };

function jh(e, t = 0) {
    return function(r) {
        return r.lift(new zi(e, t))
    }
}
var zi = class {
        constructor(t, n = 0) {
            this.scheduler = t, this.delay = n
        }
        call(t, n) {
            return n.subscribe(new Gi(t, this.scheduler, this.delay))
        }
    },
    Gi = class e extends g {
        constructor(t, n, r = 0) {
            super(t), this.scheduler = n, this.delay = r
        }
        static dispatch(t) {
            let {
                notification: n,
                destination: r
            } = t;
            n.observe(r), this.unsubscribe()
        }
        scheduleMessage(t) {
            this.destination.add(this.scheduler.schedule(e.dispatch, this.delay, new Qi(t, this.destination)))
        }
        _next(t) {
            this.scheduleMessage(q.createNext(t))
        }
        _error(t) {
            this.scheduleMessage(q.createError(t)), this.unsubscribe()
        }
        _complete() {
            this.scheduleMessage(q.createComplete()), this.unsubscribe()
        }
    },
    Qi = class {
        constructor(t, n) {
            this.notification = t, this.destination = n
        }
    };

function Hh(...e) {
    let t = e.length;
    if (t === 0) throw new Error("list of properties cannot be empty.");
    return n => Y(Bh(e, t))(n)
}

function Bh(e, t) {
    return r => {
        let o = r;
        for (let i = 0; i < t; i++) {
            let s = o?.[e[i]];
            if (s !== void 0) o = s;
            else return
        }
        return o
    }
}
var wn = class extends Te {
    constructor(t) {
        super(), this._value = t
    }
    get value() {
        return this.getValue()
    }
    _subscribe(t) {
        let n = super._subscribe(t);
        return n && !n.closed && t.next(this._value), n
    }
    getValue() {
        if (this.hasError) throw this.thrownError;
        if (this.closed) throw new Ke;
        return this._value
    }
    next(t) {
        super.next(this._value = t)
    }
};
var yr = class extends Ot {
    constructor(t, n) {
        super(t, n), this.scheduler = t, this.work = n
    }
    schedule(t, n = 0) {
        return n > 0 ? super.schedule(t, n) : (this.delay = n, this.state = t, this.scheduler.flush(this), this)
    }
    execute(t, n) {
        return n > 0 || this.closed ? super.execute(t, n) : this._execute(t, n)
    }
    requestAsyncId(t, n, r = 0) {
        return r !== null && r > 0 || r === null && this.delay > 0 ? super.requestAsyncId(t, n, r) : t.flush(this)
    }
};
var vr = class extends Pt {};
var $h = new vr(yr);

function Uh(...e) {
    if (e.length === 1)
        if (Z(e[0])) e = e[0];
        else return e[0];
    return xe(e, void 0).lift(new Zi)
}
var Zi = class {
        call(t, n) {
            return n.subscribe(new Yi(t))
        }
    },
    Yi = class extends Ye {
        constructor(t) {
            super(t), this.hasFirst = !1, this.observables = [], this.subscriptions = []
        }
        _next(t) {
            this.observables.push(t)
        }
        _complete() {
            let t = this.observables,
                n = t.length;
            if (n === 0) this.destination.complete();
            else {
                for (let r = 0; r < n && !this.hasFirst; r++) {
                    let o = t[r],
                        i = Vt(this, o, void 0, r);
                    this.subscriptions && this.subscriptions.push(i), this.add(i)
                }
                this.observables = null
            }
        }
        notifyNext(t, n, r) {
            if (!this.hasFirst) {
                this.hasFirst = !0;
                for (let o = 0; o < this.subscriptions.length; o++)
                    if (o !== r) {
                        let i = this.subscriptions[o];
                        i.unsubscribe(), this.remove(i)
                    } this.subscriptions = null
            }
            this.destination.next(n)
        }
    };

function qh(...e) {
    let t = e[e.length - 1];
    return Ie(t) ? (e.pop(), n => Bt(e, n, t)) : n => Bt(e, n)
}

function wl(e, t) {
    return typeof t == "function" ? n => n.pipe(wl((r, o) => Ee(e(r, o)).pipe(Y((i, s) => t(r, i, o, s))))) : n => n.lift(new Ji(e))
}
var Ji = class {
        constructor(t) {
            this.project = t
        }
        call(t, n) {
            return n.subscribe(new Ki(t, this.project))
        }
    },
    Ki = class extends oe {
        constructor(t, n) {
            super(t), this.project = n, this.index = 0
        }
        _next(t) {
            let n, r = this.index++;
            try {
                n = this.project(t, r)
            } catch (o) {
                this.destination.error(o);
                return
            }
            this._innerSub(n)
        }
        _innerSub(t) {
            let n = this.innerSubscription;
            n && n.unsubscribe();
            let r = new re(this),
                o = this.destination;
            o.add(r), this.innerSubscription = me(t, r), this.innerSubscription !== r && o.add(this.innerSubscription)
        }
        _complete() {
            let {
                innerSubscription: t
            } = this;
            (!t || t.closed) && super._complete(), this.unsubscribe()
        }
        _unsubscribe() {
            this.innerSubscription = void 0
        }
        notifyComplete() {
            this.innerSubscription = void 0, this.isStopped && super._complete()
        }
        notifyNext(t) {
            this.destination.next(t)
        }
    };

function Wh(e) {
    return t => t.lift(new Xi(e))
}
var Xi = class {
        constructor(t) {
            this.notifier = t
        }
        call(t, n) {
            let r = new es(t),
                o = me(this.notifier, new re(r));
            return o && !r.seenValue ? (r.add(o), n.subscribe(r)) : r
        }
    },
    es = class extends oe {
        constructor(t) {
            super(t), this.seenValue = !1
        }
        notifyNext() {
            this.seenValue = !0, this.complete()
        }
        notifyComplete() {}
    };

function Ve() {}

function zh(e, t, n) {
    return function(o) {
        return o.lift(new ts(e, t, n))
    }
}
var ts = class {
        constructor(t, n, r) {
            this.nextOrObserver = t, this.error = n, this.complete = r
        }
        call(t, n) {
            return n.subscribe(new ns(t, this.nextOrObserver, this.error, this.complete))
        }
    },
    ns = class extends g {
        constructor(t, n, r, o) {
            super(t), this._tapNext = Ve, this._tapError = Ve, this._tapComplete = Ve, this._tapError = r || Ve, this._tapComplete = o || Ve, Le(n) ? (this._context = this, this._tapNext = n) : n && (this._context = n, this._tapNext = n.next || Ve, this._tapError = n.error || Ve, this._tapComplete = n.complete || Ve)
        }
        _next(t) {
            try {
                this._tapNext.call(this._context, t)
            } catch (n) {
                this.destination.error(n);
                return
            }
            this.destination.next(t)
        }
        _error(t) {
            try {
                this._tapError.call(this._context, t)
            } catch (n) {
                this.destination.error(n);
                return
            }
            this.destination.error(t)
        }
        _complete() {
            try {
                this._tapComplete.call(this._context)
            } catch (t) {
                this.destination.error(t);
                return
            }
            return this.destination.complete()
        }
    };

function Gh(e) {
    return new b(t => {
        let n;
        try {
            n = e()
        } catch (o) {
            t.error(o);
            return
        }
        return (n ? Ee(n) : Je()).subscribe(t)
    })
}

function Qh(...e) {
    return t => {
        let n;
        typeof e[e.length - 1] == "function" && (n = e.pop());
        let r = e;
        return t.lift(new rs(r, n))
    }
}
var rs = class {
        constructor(t, n) {
            this.observables = t, this.project = n
        }
        call(t, n) {
            return n.subscribe(new os(t, this.observables, this.project))
        }
    },
    os = class extends Ye {
        constructor(t, n, r) {
            super(t), this.observables = n, this.project = r, this.toRespond = [];
            let o = n.length;
            this.values = new Array(o);
            for (let i = 0; i < o; i++) this.toRespond.push(i);
            for (let i = 0; i < o; i++) {
                let s = n[i];
                this.add(Vt(this, s, void 0, i))
            }
        }
        notifyNext(t, n, r) {
            this.values[r] = n;
            let o = this.toRespond;
            if (o.length > 0) {
                let i = o.indexOf(r);
                i !== -1 && o.splice(i, 1)
            }
        }
        notifyComplete() {}
        _next(t) {
            if (this.toRespond.length === 0) {
                let n = [t, ...this.values];
                this.project ? this._tryProject(n) : this.destination.next(n)
            }
        }
        _tryProject(t) {
            let n;
            try {
                n = this.project.apply(this, t)
            } catch (r) {
                this.destination.error(r);
                return
            }
            this.destination.next(n)
        }
    };

function Zh(...e) {
    let t = e[e.length - 1];
    return typeof t == "function" && e.pop(), xe(e, void 0).lift(new is(t))
}
var is = class {
        constructor(t) {
            this.resultSelector = t
        }
        call(t, n) {
            return n.subscribe(new ss(t, this.resultSelector))
        }
    },
    ss = class extends g {
        constructor(t, n, r = Object.create(null)) {
            super(t), this.resultSelector = n, this.iterators = [], this.active = 0, this.resultSelector = typeof n == "function" ? n : void 0
        }
        _next(t) {
            let n = this.iterators;
            Z(t) ? n.push(new cs(t)) : typeof t[fe] == "function" ? n.push(new as(t[fe]())) : n.push(new ls(this.destination, this, t))
        }
        _complete() {
            let t = this.iterators,
                n = t.length;
            if (this.unsubscribe(), n === 0) {
                this.destination.complete();
                return
            }
            this.active = n;
            for (let r = 0; r < n; r++) {
                let o = t[r];
                o.stillUnsubscribed ? this.destination.add(o.subscribe()) : this.active--
            }
        }
        notifyInactive() {
            this.active--, this.active === 0 && this.destination.complete()
        }
        checkIterators() {
            let t = this.iterators,
                n = t.length,
                r = this.destination;
            for (let s = 0; s < n; s++) {
                let a = t[s];
                if (typeof a.hasValue == "function" && !a.hasValue()) return
            }
            let o = !1,
                i = [];
            for (let s = 0; s < n; s++) {
                let a = t[s],
                    c = a.next();
                if (a.hasCompleted() && (o = !0), c.done) {
                    r.complete();
                    return
                }
                i.push(c.value)
            }
            this.resultSelector ? this._tryresultSelector(i) : r.next(i), o && r.complete()
        }
        _tryresultSelector(t) {
            let n;
            try {
                n = this.resultSelector.apply(this, t)
            } catch (r) {
                this.destination.error(r);
                return
            }
            this.destination.next(n)
        }
    },
    as = class {
        constructor(t) {
            this.iterator = t, this.nextResult = t.next()
        }
        hasValue() {
            return !0
        }
        next() {
            let t = this.nextResult;
            return this.nextResult = this.iterator.next(), t
        }
        hasCompleted() {
            let t = this.nextResult;
            return !!(t && t.done)
        }
    },
    cs = class {
        constructor(t) {
            this.array = t, this.index = 0, this.length = 0, this.length = t.length
        } [fe]() {
            return this
        }
        next(t) {
            let n = this.index++,
                r = this.array;
            return n < this.length ? {
                value: r[n],
                done: !1
            } : {
                value: null,
                done: !0
            }
        }
        hasValue() {
            return this.array.length > this.index
        }
        hasCompleted() {
            return this.array.length === this.index
        }
    },
    ls = class extends oe {
        constructor(t, n, r) {
            super(t), this.parent = n, this.observable = r, this.stillUnsubscribed = !0, this.buffer = [], this.isComplete = !1
        } [fe]() {
            return this
        }
        next() {
            let t = this.buffer;
            return t.length === 0 && this.isComplete ? {
                value: null,
                done: !0
            } : {
                value: t.shift(),
                done: !1
            }
        }
        hasValue() {
            return this.buffer.length > 0
        }
        hasCompleted() {
            return this.buffer.length === 0 && this.isComplete
        }
        notifyComplete() {
            this.buffer.length > 0 ? (this.isComplete = !0, this.parent.notifyInactive()) : this.destination.complete()
        }
        notifyNext(t) {
            this.buffer.push(t), this.parent.checkIterators()
        }
        subscribe() {
            return me(this.observable, new re(this))
        }
    };

function hs(e, t) {
    return Object.is(e, t)
}
var j = null,
    Dn = !1,
    gs = 1,
    J = Symbol("SIGNAL");

function _(e) {
    let t = j;
    return j = e, t
}

function Dl() {
    return j
}

function Yh() {
    return Dn
}
var pt = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: !1,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: !1,
    consumerIsAlwaysLive: !1,
    producerMustRecompute: () => !1,
    producerRecomputeValue: () => {},
    consumerMarkedDirty: () => {},
    consumerOnSignalRead: () => {}
};

function Mn(e) {
    if (Dn) throw new Error("");
    if (j === null) return;
    j.consumerOnSignalRead(e);
    let t = j.nextProducerIndex++;
    if (br(j), t < j.producerNode.length && j.producerNode[t] !== e && Cn(j)) {
        let n = j.producerNode[t];
        Er(n, j.producerIndexOfThis[t])
    }
    j.producerNode[t] !== e && (j.producerNode[t] = e, j.producerIndexOfThis[t] = Cn(j) ? Nl(e, j, t) : 0), j.producerLastReadVersion[t] = e.version
}

function Jh() {
    gs++
}

function ms(e) {
    if (!(Cn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === gs)) {
        if (!e.producerMustRecompute(e) && !Nn(e)) {
            fs(e);
            return
        }
        e.producerRecomputeValue(e), fs(e)
    }
}

function Cl(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = Dn;
    Dn = !0;
    try {
        for (let n of e.liveConsumerNode) n.dirty || _l(n)
    } finally {
        Dn = t
    }
}

function Ml() {
    return j?.consumerAllowSignalWrites !== !1
}

function _l(e) {
    e.dirty = !0, Cl(e), e.consumerMarkedDirty?.(e)
}

function fs(e) {
    e.dirty = !1, e.lastCleanEpoch = gs
}

function $t(e) {
    return e && (e.nextProducerIndex = 0), _(e)
}

function _n(e, t) {
    if (_(t), !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
        if (Cn(e))
            for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) Er(e.producerNode[n], e.producerIndexOfThis[n]);
        for (; e.producerNode.length > e.nextProducerIndex;) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop()
    }
}

function Nn(e) {
    br(e);
    for (let t = 0; t < e.producerNode.length; t++) {
        let n = e.producerNode[t],
            r = e.producerLastReadVersion[t];
        if (r !== n.version || (ms(n), r !== n.version)) return !0
    }
    return !1
}

function Ut(e) {
    if (br(e), Cn(e))
        for (let t = 0; t < e.producerNode.length; t++) Er(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}

function Nl(e, t, n) {
    if (xl(e), e.liveConsumerNode.length === 0 && Tl(e))
        for (let r = 0; r < e.producerNode.length; r++) e.producerIndexOfThis[r] = Nl(e.producerNode[r], e, r);
    return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1
}

function Er(e, t) {
    if (xl(e), e.liveConsumerNode.length === 1 && Tl(e))
        for (let r = 0; r < e.producerNode.length; r++) Er(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
        let r = e.liveConsumerIndexOfThis[t],
            o = e.liveConsumerNode[t];
        br(o), o.producerIndexOfThis[r] = t
    }
}

function Cn(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}

function br(e) {
    e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= []
}

function xl(e) {
    e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= []
}

function Tl(e) {
    return e.producerNode !== void 0
}

function Sl(e) {
    let t = Object.create(Kh);
    t.computation = e;
    let n = () => {
        if (ms(t), Mn(t), t.value === Ir) throw t.error;
        return t.value
    };
    return n[J] = t, n
}
var us = Symbol("UNSET"),
    ds = Symbol("COMPUTING"),
    Ir = Symbol("ERRORED"),
    Kh = de(ue({}, pt), {
        value: us,
        dirty: !0,
        error: null,
        equal: hs,
        producerMustRecompute(e) {
            return e.value === us || e.value === ds
        },
        producerRecomputeValue(e) {
            if (e.value === ds) throw new Error("Detected cycle in computations.");
            let t = e.value;
            e.value = ds;
            let n = $t(e),
                r;
            try {
                r = e.computation()
            } catch (o) {
                r = Ir, e.error = o
            } finally {
                _n(e, n)
            }
            if (t !== us && t !== Ir && r !== Ir && e.equal(t, r)) {
                e.value = t;
                return
            }
            e.value = r, e.version++
        }
    });

function Xh() {
    throw new Error
}
var Rl = Xh;

function Al() {
    Rl()
}

function kl(e) {
    Rl = e
}
var eg = null;

function Ol(e) {
    let t = Object.create(ys);
    t.value = e;
    let n = () => (Mn(t), t.value);
    return n[J] = t, n
}

function xn(e, t) {
    Ml() || Al(), e.equal(e.value, t) || (e.value = t, tg(e))
}

function Pl(e, t) {
    Ml() || Al(), xn(e, t(e.value))
}
var ys = de(ue({}, pt), {
    equal: hs,
    value: void 0
});

function tg(e) {
    e.version++, Jh(), Cl(e), eg?.()
}

function Ll(e, t, n) {
    let r = Object.create(ng);
    n && (r.consumerAllowSignalWrites = !0), r.fn = e, r.schedule = t;
    let o = c => {
        r.cleanupFn = c
    };

    function i(c) {
        return c.fn === null && c.schedule === null
    }

    function s(c) {
        i(c) || (Ut(c), c.cleanupFn(), c.fn = null, c.schedule = null, c.cleanupFn = ps)
    }
    let a = () => {
        if (r.fn === null) return;
        if (Yh()) throw new Error("Schedulers cannot synchronously execute watches while scheduling.");
        if (r.dirty = !1, r.hasRun && !Nn(r)) return;
        r.hasRun = !0;
        let c = $t(r);
        try {
            r.cleanupFn(), r.cleanupFn = ps, r.fn(o)
        } finally {
            _n(r, c)
        }
    };
    return r.ref = {
        notify: () => _l(r),
        run: a,
        cleanup: () => r.cleanupFn(),
        destroy: () => s(r),
        [J]: r
    }, r.ref
}
var ps = () => {},
    ng = de(ue({}, pt), {
        consumerIsAlwaysLive: !0,
        consumerAllowSignalWrites: !1,
        consumerMarkedDirty: e => {
            e.schedule !== null && e.schedule(e.ref)
        },
        hasRun: !1,
        cleanupFn: ps
    });

function rg(e) {
    return !!e && (e instanceof b || typeof e.lift == "function" && typeof e.subscribe == "function")
}

function og(...e) {
    if (e.length === 1) {
        let t = e[0];
        if (Z(t)) return wr(t, null);
        if (kt(t) && Object.getPrototypeOf(t) === Object.prototype) {
            let n = Object.keys(t);
            return wr(n.map(r => t[r]), n)
        }
    }
    if (typeof e[e.length - 1] == "function") {
        let t = e.pop();
        return e = e.length === 1 && Z(e[0]) ? e[0] : e, wr(e, null).pipe(Y(n => t(...n)))
    }
    return wr(e, null)
}

function wr(e, t) {
    return new b(n => {
        let r = e.length;
        if (r === 0) {
            n.complete();
            return
        }
        let o = new Array(r),
            i = 0,
            s = 0;
        for (let a = 0; a < r; a++) {
            let c = Ee(e[a]),
                l = !1;
            n.add(c.subscribe({
                next: u => {
                    l || (l = !0, s++), o[a] = u
                },
                error: u => n.error(u),
                complete: () => {
                    i++, (i === r || !l) && (s === r && n.next(t ? t.reduce((u, d, p) => (u[d] = o[p], u), {}) : o), n.complete())
                }
            }))
        }
    })
}

function Fl(e, t, n, r) {
    return Le(n) && (r = n, n = void 0), r ? Fl(e, t, n).pipe(Y(o => Z(o) ? r(...o) : r(o))) : new b(o => {
        function i(s) {
            arguments.length > 1 ? o.next(Array.prototype.slice.call(arguments)) : o.next(s)
        }
        Vl(e, t, i, o, n)
    })
}

function Vl(e, t, n, r, o) {
    let i;
    if (ag(e)) {
        let s = e;
        e.addEventListener(t, n, o), i = () => s.removeEventListener(t, n, o)
    } else if (sg(e)) {
        let s = e;
        e.on(t, n), i = () => s.off(t, n)
    } else if (ig(e)) {
        let s = e;
        e.addListener(t, n), i = () => s.removeListener(t, n)
    } else if (e && e.length)
        for (let s = 0, a = e.length; s < a; s++) Vl(e[s], t, n, r, o);
    else throw new TypeError("Invalid event target");
    r.add(i)
}

function ig(e) {
    return e && typeof e.addListener == "function" && typeof e.removeListener == "function"
}

function sg(e) {
    return e && typeof e.on == "function" && typeof e.off == "function"
}

function ag(e) {
    return e && typeof e.addEventListener == "function" && typeof e.removeEventListener == "function"
}
var Vu = "https://g.co/ng/security#xss",
    C = class extends Error {
        code;
        constructor(t, n) {
            super(cg(t, n)), this.code = t
        }
    };

function cg(e, t) {
    return `${`NG0${Math.abs(e)}`}${t?": "+t:""}`
}
var yo = Symbol("InputSignalNode#UNSET"),
    ju = de(ue({}, ys), {
        transformFn: void 0,
        applyValueToInputSignal(e, t) {
            xn(e, t)
        }
    });

function Hu(e, t) {
    let n = Object.create(ju);
    n.value = e, n.transformFn = t?.transform;

    function r() {
        if (Mn(n), n.value === yo) throw new C(-950, !1);
        return n.value
    }
    return r[J] = n, r
}

function zn(e) {
    return {
        toString: e
    }.toString()
}
var Dr = "__parameters__";

function lg(e) {
    return function(...n) {
        if (e) {
            let r = e(...n);
            for (let o in r) this[o] = r[o]
        }
    }
}

function ic(e, t, n) {
    return zn(() => {
        let r = lg(t);

        function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            let s = new o(...i);
            return a.annotation = s, a;

            function a(c, l, u) {
                let d = c.hasOwnProperty(Dr) ? c[Dr] : Object.defineProperty(c, Dr, {
                    value: []
                })[Dr];
                for (; d.length <= u;) d.push(null);
                return (d[u] = d[u] || []).push(s), c
            }
        }
        return n && (o.prototype = Object.create(n.prototype)), o.prototype.ngMetadataName = e, o.annotationCls = o, o
    })
}
var et = globalThis;

function k(e) {
    for (let t in e)
        if (e[t] === k) return t;
    throw Error("Could not find renamed property on target object.")
}

function ug(e, t) {
    for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n])
}

function pe(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return "[" + e.map(pe).join(", ") + "]";
    if (e == null) return "" + e;
    if (e.overriddenName) return `${e.overriddenName}`;
    if (e.name) return `${e.name}`;
    let t = e.toString();
    if (t == null) return "" + t;
    let n = t.indexOf(`
`);
    return n === -1 ? t : t.substring(0, n)
}

function Os(e, t) {
    return e == null || e === "" ? t === null ? "" : t : t == null || t === "" ? e : e + " " + t
}
var dg = k({
    __forward_ref__: k
});

function Bu(e) {
    return e.__forward_ref__ = Bu, e.toString = function() {
        return pe(this())
    }, e
}

function W(e) {
    return $u(e) ? e() : e
}

function $u(e) {
    return typeof e == "function" && e.hasOwnProperty(dg) && e.__forward_ref__ === Bu
}

function fg(e, t, n) {
    e != t && pg(n, e, t, "==")
}

function pg(e, t, n, r) {
    throw new Error(`ASSERTION ERROR: ${e}` + (r == null ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`))
}

function P(e) {
    return {
        token: e.token,
        providedIn: e.providedIn || null,
        factory: e.factory,
        value: void 0
    }
}

function hg(e) {
    return {
        providers: e.providers || [],
        imports: e.imports || []
    }
}

function vo(e) {
    return jl(e, Uu) || jl(e, qu)
}

function zT(e) {
    return vo(e) !== null
}

function jl(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null
}

function gg(e) {
    let t = e && (e[Uu] || e[qu]);
    return t || null
}

function Hl(e) {
    return e && (e.hasOwnProperty(Bl) || e.hasOwnProperty(mg)) ? e[Bl] : null
}
var Uu = k({
        \u0275prov: k
    }),
    Bl = k({
        \u0275inj: k
    }),
    qu = k({
        ngInjectableDef: k
    }),
    mg = k({
        ngInjectorDef: k
    }),
    T = class {
        _desc;
        ngMetadataName = "InjectionToken";
        \u0275prov;
        constructor(t, n) {
            this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = P({
                token: this,
                providedIn: n.providedIn || "root",
                factory: n.factory
            }))
        }
        get multi() {
            return this
        }
        toString() {
            return `InjectionToken ${this._desc}`
        }
    };

function Wu(e) {
    return e && !!e.\u0275providers
}
var yg = k({
        \u0275cmp: k
    }),
    vg = k({
        \u0275dir: k
    }),
    Ig = k({
        \u0275pipe: k
    }),
    Eg = k({
        \u0275mod: k
    }),
    jr = k({
        \u0275fac: k
    }),
    kn = k({
        __NG_ELEMENT_ID__: k
    }),
    $l = k({
        __NG_ENV_ID__: k
    });

function ae(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e)
}

function bg(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : ae(e)
}

function wg(e, t) {
    let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
    throw new C(-200, e)
}

function sc(e, t) {
    throw new C(-201, !1)
}
var N = function(e) {
        return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e
    }(N || {}),
    Ps;

function zu() {
    return Ps
}

function ie(e) {
    let t = Ps;
    return Ps = e, t
}

function Gu(e, t, n) {
    let r = vo(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & N.Optional) return null;
    if (t !== void 0) return t;
    sc(e, "Injector")
}
var Dg = {},
    Pn = Dg,
    Ls = "__NG_DI_FLAG__",
    Hr = "ngTempTokenPath",
    Cg = "ngTokenPath",
    Mg = /\n/gm,
    _g = "\u0275",
    Ul = "__source",
    Qt;

function Ng() {
    return Qt
}

function Xe(e) {
    let t = Qt;
    return Qt = e, t
}

function xg(e, t = N.Default) {
    if (Qt === void 0) throw new C(-203, !1);
    return Qt === null ? Gu(e, void 0, t) : Qt.get(e, t & N.Optional ? null : void 0, t)
}

function ye(e, t = N.Default) {
    return (zu() || xg)(W(e), t)
}

function D(e, t = N.Default) {
    return ye(e, Io(t))
}

function Io(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}

function Fs(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
        let r = W(e[n]);
        if (Array.isArray(r)) {
            if (r.length === 0) throw new C(900, !1);
            let o, i = N.Default;
            for (let s = 0; s < r.length; s++) {
                let a = r[s],
                    c = Tg(a);
                typeof c == "number" ? c === -1 ? o = a.token : i |= c : o = a
            }
            t.push(ye(o, i))
        } else t.push(ye(r))
    }
    return t
}

function ac(e, t) {
    return e[Ls] = t, e.prototype[Ls] = t, e
}

function Tg(e) {
    return e[Ls]
}

function Sg(e, t, n, r) {
    let o = e[Hr];
    throw t[Ul] && o.unshift(t[Ul]), e.message = Rg(`
` + e.message, o, n, r), e[Cg] = o, e[Hr] = null, e
}

function Rg(e, t, n, r = null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == _g ? e.slice(2) : e;
    let o = pe(t);
    if (Array.isArray(t)) o = t.map(pe).join(" -> ");
    else if (typeof t == "object") {
        let i = [];
        for (let s in t)
            if (t.hasOwnProperty(s)) {
                let a = t[s];
                i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : pe(a)))
            } o = `{${i.join(", ")}}`
    }
    return `${n}${r?"("+r+")":""}[${o}]: ${e.replace(Mg,`
  `)}`
}
var GT = ac(ic("Inject", e => ({
        token: e
    })), -1),
    Qu = ac(ic("Optional"), 8);
var Zu = ac(ic("SkipSelf"), 4);

function mt(e, t) {
    let n = e.hasOwnProperty(jr);
    return n ? e[jr] : null
}

function Ag(e, t, n) {
    if (e.length !== t.length) return !1;
    for (let r = 0; r < e.length; r++) {
        let o = e[r],
            i = t[r];
        if (n && (o = n(o), i = n(i)), i !== o) return !1
    }
    return !0
}

function kg(e) {
    return e.flat(Number.POSITIVE_INFINITY)
}

function cc(e, t) {
    e.forEach(n => Array.isArray(n) ? cc(n, t) : t(n))
}

function Yu(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n)
}

function Br(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}

function Og(e, t) {
    let n = [];
    for (let r = 0; r < e; r++) n.push(t);
    return n
}

function ql(e, t, n) {
    let r = e.length - n;
    for (; t < r;) e[t] = e[t + n], t++;
    for (; n--;) e.pop()
}

function Ju(e, t, n, r) {
    let o = e.length;
    if (o == t) e.push(n, r);
    else if (o === 1) e.push(r, e[0]), e[0] = n;
    else {
        for (o--, e.push(e[o - 1], e[o]); o > t;) {
            let i = o - 2;
            e[o] = e[i], o--
        }
        e[t] = n, e[t + 1] = r
    }
}

function Eo(e, t, n) {
    let r = Gn(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r, Ju(e, r, t, n)), r
}

function vs(e, t) {
    let n = Gn(e, t);
    if (n >= 0) return e[n | 1]
}

function Gn(e, t) {
    return Pg(e, t, 1)
}

function Pg(e, t, n) {
    let r = 0,
        o = e.length >> n;
    for (; o !== r;) {
        let i = r + (o - r >> 1),
            s = e[i << n];
        if (t === s) return i << n;
        s > t ? o = i : r = i + 1
    }
    return ~(o << n)
}
var He = {},
    K = [],
    $r = new T(""),
    Ku = new T("", -1),
    Xu = new T(""),
    Ur = class {
        get(t, n = Pn) {
            if (n === Pn) {
                let r = new Error(`NullInjectorError: No provider for ${pe(t)}!`);
                throw r.name = "NullInjectorError", r
            }
            return n
        }
    };

function ed(e, t) {
    let n = e[Eg] || null;
    if (!n && t === !0) throw new Error(`Type ${pe(e)} does not have '\u0275mod' property.`);
    return n
}

function Ae(e) {
    return e[yg] || null
}

function bo(e) {
    return e[vg] || null
}

function lc(e) {
    return e[Ig] || null
}

function Lg(e) {
    let t = Ae(e) || bo(e) || lc(e);
    return t !== null ? t.standalone : !1
}

function QT(e) {
    return {
        \u0275providers: e
    }
}

function Fg(...e) {
    return {
        \u0275providers: uc(!0, e),
        \u0275fromNgModule: !0
    }
}

function uc(e, ...t) {
    let n = [],
        r = new Set,
        o, i = s => {
            n.push(s)
        };
    return cc(t, s => {
        let a = s;
        Vs(a, i, [], r) && (o ||= [], o.push(a))
    }), o !== void 0 && td(o, i), n
}

function td(e, t) {
    for (let n = 0; n < e.length; n++) {
        let {
            ngModule: r,
            providers: o
        } = e[n];
        dc(o, i => {
            t(i, r)
        })
    }
}

function Vs(e, t, n, r) {
    if (e = W(e), !e) return !1;
    let o = null,
        i = Hl(e),
        s = !i && Ae(e);
    if (!i && !s) {
        let c = e.ngModule;
        if (i = Hl(c), i) o = c;
        else return !1
    } else {
        if (s && !s.standalone) return !1;
        o = e
    }
    let a = r.has(o);
    if (s) {
        if (a) return !1;
        if (r.add(o), s.dependencies) {
            let c = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
            for (let l of c) Vs(l, t, n, r)
        }
    } else if (i) {
        if (i.imports != null && !a) {
            r.add(o);
            let l;
            try {
                cc(i.imports, u => {
                    Vs(u, t, n, r) && (l ||= [], l.push(u))
                })
            } finally {}
            l !== void 0 && td(l, t)
        }
        if (!a) {
            let l = mt(o) || (() => new o);
            t({
                provide: o,
                useFactory: l,
                deps: K
            }, o), t({
                provide: Xu,
                useValue: o,
                multi: !0
            }, o), t({
                provide: $r,
                useValue: () => ye(o),
                multi: !0
            }, o)
        }
        let c = i.providers;
        if (c != null && !a) {
            let l = e;
            dc(c, u => {
                t(u, l)
            })
        }
    } else return !1;
    return o !== e && e.providers !== void 0
}

function dc(e, t) {
    for (let n of e) Wu(n) && (n = n.\u0275providers), Array.isArray(n) ? dc(n, t) : t(n)
}
var Vg = k({
    provide: String,
    useValue: k
});

function nd(e) {
    return e !== null && typeof e == "object" && Vg in e
}

function jg(e) {
    return !!(e && e.useExisting)
}

function Hg(e) {
    return !!(e && e.useFactory)
}

function Kt(e) {
    return typeof e == "function"
}

function Bg(e) {
    return !!e.useClass
}
var rd = new T(""),
    Sr = {},
    $g = {},
    Is;

function wo() {
    return Is === void 0 && (Is = new Ur), Is
}
var Be = class {},
    Ln = class extends Be {
        parent;
        source;
        scopes;
        records = new Map;
        _ngOnDestroyHooks = new Set;
        _onDestroyHooks = [];
        get destroyed() {
            return this._destroyed
        }
        _destroyed = !1;
        injectorDefTypes;
        constructor(t, n, r, o) {
            super(), this.parent = n, this.source = r, this.scopes = o, Hs(t, s => this.processProvider(s)), this.records.set(Ku, qt(void 0, this)), o.has("environment") && this.records.set(Be, qt(void 0, this));
            let i = this.records.get(rd);
            i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Xu, K, N.Self))
        }
        destroy() {
            Sn(this), this._destroyed = !0;
            let t = _(null);
            try {
                for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
                let n = this._onDestroyHooks;
                this._onDestroyHooks = [];
                for (let r of n) r()
            } finally {
                this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), _(t)
            }
        }
        onDestroy(t) {
            return Sn(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
        }
        runInContext(t) {
            Sn(this);
            let n = Xe(this),
                r = ie(void 0),
                o;
            try {
                return t()
            } finally {
                Xe(n), ie(r)
            }
        }
        get(t, n = Pn, r = N.Default) {
            if (Sn(this), t.hasOwnProperty($l)) return t[$l](this);
            r = Io(r);
            let o, i = Xe(this),
                s = ie(void 0);
            try {
                if (!(r & N.SkipSelf)) {
                    let c = this.records.get(t);
                    if (c === void 0) {
                        let l = Gg(t) && vo(t);
                        l && this.injectableDefInScope(l) ? c = qt(js(t), Sr) : c = null, this.records.set(t, c)
                    }
                    if (c != null) return this.hydrate(t, c)
                }
                let a = r & N.Self ? wo() : this.parent;
                return n = r & N.Optional && n === Pn ? null : n, a.get(t, n)
            } catch (a) {
                if (a.name === "NullInjectorError") {
                    if ((a[Hr] = a[Hr] || []).unshift(pe(t)), i) throw a;
                    return Sg(a, t, "R3InjectorError", this.source)
                } else throw a
            } finally {
                ie(s), Xe(i)
            }
        }
        resolveInjectorInitializers() {
            let t = _(null),
                n = Xe(this),
                r = ie(void 0),
                o;
            try {
                let i = this.get($r, K, N.Self);
                for (let s of i) s()
            } finally {
                Xe(n), ie(r), _(t)
            }
        }
        toString() {
            let t = [],
                n = this.records;
            for (let r of n.keys()) t.push(pe(r));
            return `R3Injector[${t.join(", ")}]`
        }
        processProvider(t) {
            t = W(t);
            let n = Kt(t) ? t : W(t && t.provide),
                r = qg(t);
            if (!Kt(t) && t.multi === !0) {
                let o = this.records.get(n);
                o || (o = qt(void 0, Sr, !0), o.factory = () => Fs(o.multi), this.records.set(n, o)), n = t, o.multi.push(t)
            }
            this.records.set(n, r)
        }
        hydrate(t, n) {
            let r = _(null);
            try {
                return n.value === Sr && (n.value = $g, n.value = n.factory()), typeof n.value == "object" && n.value && zg(n.value) && this._ngOnDestroyHooks.add(n.value), n.value
            } finally {
                _(r)
            }
        }
        injectableDefInScope(t) {
            if (!t.providedIn) return !1;
            let n = W(t.providedIn);
            return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n)
        }
        removeOnDestroy(t) {
            let n = this._onDestroyHooks.indexOf(t);
            n !== -1 && this._onDestroyHooks.splice(n, 1)
        }
    };

function js(e) {
    let t = vo(e),
        n = t !== null ? t.factory : mt(e);
    if (n !== null) return n;
    if (e instanceof T) throw new C(204, !1);
    if (e instanceof Function) return Ug(e);
    throw new C(204, !1)
}

function Ug(e) {
    if (e.length > 0) throw new C(204, !1);
    let n = gg(e);
    return n !== null ? () => n.factory(e) : () => new e
}

function qg(e) {
    if (nd(e)) return qt(void 0, e.useValue);
    {
        let t = od(e);
        return qt(t, Sr)
    }
}

function od(e, t, n) {
    let r;
    if (Kt(e)) {
        let o = W(e);
        return mt(o) || js(o)
    } else if (nd(e)) r = () => W(e.useValue);
    else if (Hg(e)) r = () => e.useFactory(...Fs(e.deps || []));
    else if (jg(e)) r = () => ye(W(e.useExisting));
    else {
        let o = W(e && (e.useClass || e.provide));
        if (Wg(e)) r = () => new o(...Fs(e.deps));
        else return mt(o) || js(o)
    }
    return r
}

function Sn(e) {
    if (e.destroyed) throw new C(205, !1)
}

function qt(e, t, n = !1) {
    return {
        factory: e,
        value: t,
        multi: n ? [] : void 0
    }
}

function Wg(e) {
    return !!e.deps
}

function zg(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
}

function Gg(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof T
}

function Hs(e, t) {
    for (let n of e) Array.isArray(n) ? Hs(n, t) : n && Wu(n) ? Hs(n.\u0275providers, t) : t(n)
}

function id(e, t) {
    e instanceof Ln && Sn(e);
    let n, r = Xe(e),
        o = ie(void 0);
    try {
        return t()
    } finally {
        Xe(r), ie(o)
    }
}

function sd() {
    return zu() !== void 0 || Ng() != null
}

function Do(e) {
    if (!sd()) throw new C(-203, !1)
}

function Qg(e) {
    return typeof e == "function"
}
var Oe = 0,
    v = 1,
    I = 2,
    z = 3,
    De = 4,
    ee = 5,
    Xt = 6,
    qr = 7,
    G = 8,
    ge = 9,
    $e = 10,
    R = 11,
    Fn = 12,
    Wl = 13,
    an = 14,
    ce = 15,
    yt = 16,
    Wt = 17,
    Ue = 18,
    Co = 19,
    ad = 20,
    rt = 21,
    Rr = 22,
    vt = 23,
    he = 24,
    O = 25,
    fc = 1,
    Wr = 6,
    It = 7,
    zr = 8,
    en = 9,
    Q = 10,
    Gr = function(e) {
        return e[e.None = 0] = "None", e[e.HasTransplantedViews = 2] = "HasTransplantedViews", e
    }(Gr || {});

function ot(e) {
    return Array.isArray(e) && typeof e[fc] == "object"
}

function Ge(e) {
    return Array.isArray(e) && e[fc] === !0
}

function pc(e) {
    return (e.flags & 4) !== 0
}

function Mo(e) {
    return e.componentOffset > -1
}

function _o(e) {
    return (e.flags & 1) === 1
}

function qe(e) {
    return !!e.template
}

function Bs(e) {
    return (e[I] & 512) !== 0
}

function Zg(e) {
    return (e[I] & 256) === 256
}
var $s = class {
    previousValue;
    currentValue;
    firstChange;
    constructor(t, n, r) {
        this.previousValue = t, this.currentValue = n, this.firstChange = r
    }
    isFirstChange() {
        return this.firstChange
    }
};

function cd(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r
}
var ZT = (() => {
    let e = () => ld;
    return e.ngInherit = !0, e
})();

function ld(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = Jg), Yg
}

function Yg() {
    let e = dd(this),
        t = e?.current;
    if (t) {
        let n = e.previous;
        if (n === He) e.previous = t;
        else
            for (let r in t) n[r] = t[r];
        e.current = null, this.ngOnChanges(t)
    }
}

function Jg(e, t, n, r, o) {
    let i = this.declaredInputs[r],
        s = dd(e) || Kg(e, {
            previous: He,
            current: null
        }),
        a = s.current || (s.current = {}),
        c = s.previous,
        l = c[i];
    a[i] = new $s(l && l.currentValue, n, c === He), cd(e, t, o, n)
}
var ud = "__ngSimpleChanges__";

function dd(e) {
    return e[ud] || null
}

function Kg(e, t) {
    return e[ud] = t
}
var zl = null;
var Se = function(e, t, n) {
        zl?.(e, t, n)
    },
    fd = "svg",
    Xg = "math";

function Ce(e) {
    for (; Array.isArray(e);) e = e[Oe];
    return e
}

function em(e) {
    for (; Array.isArray(e);) {
        if (typeof e[fc] == "object") return e;
        e = e[Oe]
    }
    return null
}

function pd(e, t) {
    return Ce(t[e])
}

function ve(e, t) {
    return Ce(t[e.index])
}

function Qn(e, t) {
    return e.data[t]
}

function hc(e, t) {
    return e[t]
}

function ct(e, t) {
    let n = t[e];
    return ot(n) ? n : n[Oe]
}

function tm(e) {
    return (e[I] & 4) === 4
}

function gc(e) {
    return (e[I] & 128) === 128
}

function nm(e) {
    return Ge(e[z])
}

function Me(e, t) {
    return t == null ? null : e[t]
}

function hd(e) {
    e[Wt] = 0
}

function mc(e) {
    e[I] & 1024 || (e[I] |= 1024, gc(e) && Zn(e))
}

function rm(e, t) {
    for (; e > 0;) t = t[an], e--;
    return t
}

function No(e) {
    return !!(e[I] & 9216 || e[he]?.dirty)
}

function Us(e) {
    e[$e].changeDetectionScheduler?.notify(9), e[I] & 64 && (e[I] |= 1024), No(e) && Zn(e)
}

function Zn(e) {
    e[$e].changeDetectionScheduler?.notify(0);
    let t = Et(e);
    for (; t !== null && !(t[I] & 8192 || (t[I] |= 8192, !gc(t)));) t = Et(t)
}

function yc(e, t) {
    if ((e[I] & 256) === 256) throw new C(911, !1);
    e[rt] === null && (e[rt] = []), e[rt].push(t)
}

function gd(e, t) {
    if (e[rt] === null) return;
    let n = e[rt].indexOf(t);
    n !== -1 && e[rt].splice(n, 1)
}

function Et(e) {
    let t = e[z];
    return Ge(t) ? t[z] : t
}
var w = {
    lFrame: Md(null),
    bindingsEnabled: !0,
    skipHydrationRootTNode: null
};
var qs = !1;

function om() {
    return w.lFrame.elementDepthCount
}

function im() {
    w.lFrame.elementDepthCount++
}

function sm() {
    w.lFrame.elementDepthCount--
}

function md() {
    return w.bindingsEnabled
}

function yd() {
    return w.skipHydrationRootTNode !== null
}

function am(e) {
    return w.skipHydrationRootTNode === e
}

function cm() {
    w.skipHydrationRootTNode = null
}

function y() {
    return w.lFrame.lView
}

function A() {
    return w.lFrame.tView
}

function YT(e) {
    return w.lFrame.contextLView = e, e[G]
}

function JT(e) {
    return w.lFrame.contextLView = null, e
}

function F() {
    let e = vd();
    for (; e !== null && e.type === 64;) e = e.parent;
    return e
}

function vd() {
    return w.lFrame.currentTNode
}

function Vn() {
    let e = w.lFrame,
        t = e.currentTNode;
    return e.isParent ? t : t.parent
}

function ke(e, t) {
    let n = w.lFrame;
    n.currentTNode = e, n.isParent = t
}

function vc() {
    return w.lFrame.isParent
}

function Ic() {
    w.lFrame.isParent = !1
}

function lm() {
    return w.lFrame.contextLView
}

function Id() {
    return qs
}

function Qr(e) {
    let t = qs;
    return qs = e, t
}

function cn() {
    let e = w.lFrame,
        t = e.bindingRootIndex;
    return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t
}

function Ec() {
    return w.lFrame.bindingIndex
}

function um(e) {
    return w.lFrame.bindingIndex = e
}

function lt() {
    return w.lFrame.bindingIndex++
}

function Yn(e) {
    let t = w.lFrame,
        n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e, n
}

function dm() {
    return w.lFrame.inI18n
}

function Ed(e) {
    w.lFrame.inI18n = e
}

function fm(e, t) {
    let n = w.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, Ws(t)
}

function pm() {
    return w.lFrame.currentDirectiveIndex
}

function Ws(e) {
    w.lFrame.currentDirectiveIndex = e
}

function bd(e) {
    let t = w.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t]
}

function wd() {
    return w.lFrame.currentQueryIndex
}

function bc(e) {
    w.lFrame.currentQueryIndex = e
}

function hm(e) {
    let t = e[v];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[ee] : null
}

function Dd(e, t, n) {
    if (n & N.SkipSelf) {
        let o = t,
            i = e;
        for (; o = o.parent, o === null && !(n & N.Host);)
            if (o = hm(i), o === null || (i = i[an], o.type & 10)) break;
        if (o === null) return !1;
        t = o, e = i
    }
    let r = w.lFrame = Cd();
    return r.currentTNode = t, r.lView = e, !0
}

function wc(e) {
    let t = Cd(),
        n = e[v];
    w.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1
}

function Cd() {
    let e = w.lFrame,
        t = e === null ? null : e.child;
    return t === null ? Md(e) : t
}

function Md(e) {
    let t = {
        currentTNode: null,
        isParent: !0,
        lView: null,
        tView: null,
        selectedIndex: -1,
        contextLView: null,
        elementDepthCount: 0,
        currentNamespace: null,
        currentDirectiveIndex: -1,
        bindingRootIndex: -1,
        bindingIndex: -1,
        currentQueryIndex: 0,
        parent: e,
        child: null,
        inI18n: !1
    };
    return e !== null && (e.child = t), t
}

function _d() {
    let e = w.lFrame;
    return w.lFrame = e.parent, e.currentTNode = null, e.lView = null, e
}
var Nd = _d;

function Dc() {
    let e = _d();
    e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0
}

function gm(e) {
    return (w.lFrame.contextLView = rm(e, w.lFrame.contextLView))[G]
}

function _e() {
    return w.lFrame.selectedIndex
}

function bt(e) {
    w.lFrame.selectedIndex = e
}

function St() {
    let e = w.lFrame;
    return Qn(e.tView, e.selectedIndex)
}

function KT() {
    w.lFrame.currentNamespace = fd
}

function mm() {
    return w.lFrame.currentNamespace
}
var xd = !0;

function Jn() {
    return xd
}

function Kn(e) {
    xd = e
}

function ym(e, t, n) {
    let {
        ngOnChanges: r,
        ngOnInit: o,
        ngDoCheck: i
    } = t.type.prototype;
    if (r) {
        let s = ld(t);
        (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s)
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i))
}

function xo(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
        let i = e.data[n].type.prototype,
            {
                ngAfterContentInit: s,
                ngAfterContentChecked: a,
                ngAfterViewInit: c,
                ngAfterViewChecked: l,
                ngOnDestroy: u
            } = i;
        s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), c && (e.viewHooks ??= []).push(-n, c), l && ((e.viewHooks ??= []).push(n, l), (e.viewCheckHooks ??= []).push(n, l)), u != null && (e.destroyHooks ??= []).push(n, u)
    }
}

function Ar(e, t, n) {
    Td(e, t, 3, n)
}

function kr(e, t, n, r) {
    (e[I] & 3) === n && Td(e, t, n, r)
}

function Es(e, t) {
    let n = e[I];
    (n & 3) === t && (n &= 16383, n += 1, e[I] = n)
}

function Td(e, t, n, r) {
    let o = r !== void 0 ? e[Wt] & 65535 : 0,
        i = r ?? -1,
        s = t.length - 1,
        a = 0;
    for (let c = o; c < s; c++)
        if (typeof t[c + 1] == "number") {
            if (a = t[c], r != null && a >= r) break
        } else t[c] < 0 && (e[Wt] += 65536), (a < i || i == -1) && (vm(e, n, t, c), e[Wt] = (e[Wt] & 4294901760) + c + 2), c++
}

function Gl(e, t) {
    Se(4, e, t);
    let n = _(null);
    try {
        t.call(e)
    } finally {
        _(n), Se(5, e, t)
    }
}

function vm(e, t, n, r) {
    let o = n[r] < 0,
        i = n[r + 1],
        s = o ? -n[r] : n[r],
        a = e[s];
    o ? e[I] >> 14 < e[Wt] >> 16 && (e[I] & 3) === t && (e[I] += 16384, Gl(a, i)) : Gl(a, i)
}
var Zt = -1,
    wt = class {
        factory;
        injectImpl;
        resolving = !1;
        canSeeViewProviders;
        multi;
        componentProviders;
        index;
        providerFactory;
        constructor(t, n, r) {
            this.factory = t, this.canSeeViewProviders = n, this.injectImpl = r
        }
    };

function Im(e) {
    return e instanceof wt
}

function Em(e) {
    return (e.flags & 8) !== 0
}

function bm(e) {
    return (e.flags & 16) !== 0
}

function zs(e, t, n) {
    let r = 0;
    for (; r < n.length;) {
        let o = n[r];
        if (typeof o == "number") {
            if (o !== 0) break;
            r++;
            let i = n[r++],
                s = n[r++],
                a = n[r++];
            e.setAttribute(t, s, a, i)
        } else {
            let i = o,
                s = n[++r];
            wm(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
        }
    }
    return r
}

function Sd(e) {
    return e === 3 || e === 4 || e === 6
}

function wm(e) {
    return e.charCodeAt(0) === 64
}

function jn(e, t) {
    if (!(t === null || t.length === 0))
        if (e === null || e.length === 0) e = t.slice();
        else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
                let o = t[r];
                typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? Ql(e, n, o, null, t[++r]) : Ql(e, n, o, null, null))
            }
        } return e
}

function Ql(e, t, n, r, o) {
    let i = 0,
        s = e.length;
    if (t === -1) s = -1;
    else
        for (; i < e.length;) {
            let a = e[i++];
            if (typeof a == "number") {
                if (a === t) {
                    s = -1;
                    break
                } else if (a > t) {
                    s = i - 1;
                    break
                }
            }
        }
    for (; i < e.length;) {
        let a = e[i];
        if (typeof a == "number") break;
        if (a === n) {
            if (r === null) {
                o !== null && (e[i + 1] = o);
                return
            } else if (r === e[i + 1]) {
                e[i + 2] = o;
                return
            }
        }
        i++, r !== null && i++, o !== null && i++
    }
    s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), r !== null && e.splice(i++, 0, r), o !== null && e.splice(i++, 0, o)
}
var bs = {},
    Yt = class {
        injector;
        parentInjector;
        constructor(t, n) {
            this.injector = t, this.parentInjector = n
        }
        get(t, n, r) {
            r = Io(r);
            let o = this.injector.get(t, bs, r);
            return o !== bs || n === bs ? o : this.parentInjector.get(t, n, r)
        }
    };

function Rd(e) {
    return e !== Zt
}

function Zr(e) {
    return e & 32767
}

function Dm(e) {
    return e >> 16
}

function Yr(e, t) {
    let n = Dm(e),
        r = t;
    for (; n > 0;) r = r[an], n--;
    return r
}
var Gs = !0;

function Jr(e) {
    let t = Gs;
    return Gs = e, t
}
var Cm = 256,
    Ad = Cm - 1,
    kd = 5,
    Mm = 0,
    Re = {};

function _m(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(kn) && (r = n[kn]), r == null && (r = n[kn] = Mm++);
    let o = r & Ad,
        i = 1 << o;
    t.data[e + (o >> kd)] |= i
}

function Kr(e, t) {
    let n = Od(e, t);
    if (n !== -1) return n;
    let r = t[v];
    r.firstCreatePass && (e.injectorIndex = t.length, ws(r.data, e), ws(t, null), ws(r.blueprint, null));
    let o = Cc(e, t),
        i = e.injectorIndex;
    if (Rd(o)) {
        let s = Zr(o),
            a = Yr(o, t),
            c = a[v].data;
        for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | c[s + l]
    }
    return t[i + 8] = o, i
}

function ws(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}

function Od(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex
}

function Cc(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0,
        r = null,
        o = t;
    for (; o !== null;) {
        if (r = jd(o), r === null) return Zt;
        if (n++, o = o[an], r.injectorIndex !== -1) return r.injectorIndex | n << 16
    }
    return Zt
}

function Qs(e, t, n) {
    _m(e, t, n)
}

function Nm(e, t) {
    if (t === "class") return e.classes;
    if (t === "style") return e.styles;
    let n = e.attrs;
    if (n) {
        let r = n.length,
            o = 0;
        for (; o < r;) {
            let i = n[o];
            if (Sd(i)) break;
            if (i === 0) o = o + 2;
            else if (typeof i == "number")
                for (o++; o < r && typeof n[o] == "string";) o++;
            else {
                if (i === t) return n[o + 1];
                o = o + 2
            }
        }
    }
    return null
}

function Pd(e, t, n) {
    if (n & N.Optional || e !== void 0) return e;
    sc(t, "NodeInjector")
}

function Ld(e, t, n, r) {
    if (n & N.Optional && r === void 0 && (r = null), !(n & (N.Self | N.Host))) {
        let o = e[ge],
            i = ie(void 0);
        try {
            return o ? o.get(t, r, n & N.Optional) : Gu(t, r, n & N.Optional)
        } finally {
            ie(i)
        }
    }
    return Pd(r, t, n)
}

function Fd(e, t, n, r = N.Default, o) {
    if (e !== null) {
        if (t[I] & 2048 && !(r & N.Self)) {
            let s = Rm(e, t, n, r, Re);
            if (s !== Re) return s
        }
        let i = Vd(e, t, n, r, Re);
        if (i !== Re) return i
    }
    return Ld(t, n, r, o)
}

function Vd(e, t, n, r, o) {
    let i = Tm(n);
    if (typeof i == "function") {
        if (!Dd(t, e, r)) return r & N.Host ? Pd(o, n, r) : Ld(t, n, r, o);
        try {
            let s;
            if (s = i(r), s == null && !(r & N.Optional)) sc(n);
            else return s
        } finally {
            Nd()
        }
    } else if (typeof i == "number") {
        let s = null,
            a = Od(e, t),
            c = Zt,
            l = r & N.Host ? t[ce][ee] : null;
        for ((a === -1 || r & N.SkipSelf) && (c = a === -1 ? Cc(e, t) : t[a + 8], c === Zt || !Yl(r, !1) ? a = -1 : (s = t[v], a = Zr(c), t = Yr(c, t))); a !== -1;) {
            let u = t[v];
            if (Zl(i, a, u.data)) {
                let d = xm(a, t, n, s, r, l);
                if (d !== Re) return d
            }
            c = t[a + 8], c !== Zt && Yl(r, t[v].data[a + 8] === l) && Zl(i, a, t) ? (s = u, a = Zr(c), t = Yr(c, t)) : a = -1
        }
    }
    return o
}

function xm(e, t, n, r, o, i) {
    let s = t[v],
        a = s.data[e + 8],
        c = r == null ? Mo(a) && Gs : r != s && (a.type & 3) !== 0,
        l = o & N.Host && i === a,
        u = Or(a, s, n, c, l);
    return u !== null ? Dt(t, s, u, a) : Re
}

function Or(e, t, n, r, o) {
    let i = e.providerIndexes,
        s = t.data,
        a = i & 1048575,
        c = e.directiveStart,
        l = e.directiveEnd,
        u = i >> 20,
        d = r ? a : a + u,
        p = o ? a + u : l;
    for (let f = d; f < p; f++) {
        let h = s[f];
        if (f < c && n === h || f >= c && h.type === n) return f
    }
    if (o) {
        let f = s[c];
        if (f && qe(f) && f.type === n) return c
    }
    return null
}

function Dt(e, t, n, r) {
    let o = e[n],
        i = t.data;
    if (Im(o)) {
        let s = o;
        s.resolving && wg(bg(i[n]));
        let a = Jr(s.canSeeViewProviders);
        s.resolving = !0;
        let c, l = s.injectImpl ? ie(s.injectImpl) : null,
            u = Dd(e, r, N.Default);
        try {
            o = e[n] = s.factory(void 0, i, e, r), t.firstCreatePass && n >= r.directiveStart && ym(n, i[n], t)
        } finally {
            l !== null && ie(l), Jr(a), s.resolving = !1, Nd()
        }
    }
    return o
}

function Tm(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(kn) ? e[kn] : void 0;
    return typeof t == "number" ? t >= 0 ? t & Ad : Sm : t
}

function Zl(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> kd)] & r)
}

function Yl(e, t) {
    return !(e & N.Self) && !(e & N.Host && t)
}
var gt = class {
    _tNode;
    _lView;
    constructor(t, n) {
        this._tNode = t, this._lView = n
    }
    get(t, n, r) {
        return Fd(this._tNode, this._lView, t, Io(r), n)
    }
};

function Sm() {
    return new gt(F(), y())
}

function XT(e) {
    return zn(() => {
        let t = e.prototype.constructor,
            n = t[jr] || Zs(t),
            r = Object.prototype,
            o = Object.getPrototypeOf(e.prototype).constructor;
        for (; o && o !== r;) {
            let i = o[jr] || Zs(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o)
        }
        return i => new i
    })
}

function Zs(e) {
    return $u(e) ? () => {
        let t = Zs(W(e));
        return t && t()
    } : mt(e)
}

function Rm(e, t, n, r, o) {
    let i = e,
        s = t;
    for (; i !== null && s !== null && s[I] & 2048 && !(s[I] & 512);) {
        let a = Vd(i, s, n, r | N.Self, Re);
        if (a !== Re) return a;
        let c = i.parent;
        if (!c) {
            let l = s[ad];
            if (l) {
                let u = l.get(n, Re, r);
                if (u !== Re) return u
            }
            c = jd(s), s = s[an]
        }
        i = c
    }
    return o
}

function jd(e) {
    let t = e[v],
        n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[ee] : null
}

function eS(e) {
    return Nm(F(), e)
}

function Jl(e, t = null, n = null, r) {
    let o = Hd(e, t, n, r);
    return o.resolveInjectorInitializers(), o
}

function Hd(e, t = null, n = null, r, o = new Set) {
    let i = [n || K, Fg(e)];
    return r = r || (typeof e == "object" ? void 0 : pe(e)), new Ln(i, t || wo(), r || null, o)
}
var We = class e {
    static THROW_IF_NOT_FOUND = Pn;
    static NULL = new Ur;
    static create(t, n) {
        if (Array.isArray(t)) return Jl({
            name: ""
        }, n, t, "");
        {
            let r = t.name ?? "";
            return Jl({
                name: r
            }, t.parent, t.providers, r)
        }
    }
    static \u0275prov = P({
        token: e,
        providedIn: "any",
        factory: () => ye(Ku)
    });
    static __NG_ELEMENT_ID__ = -1
};
var Am = new T("");
Am.__NG_ELEMENT_ID__ = e => {
    let t = F();
    if (t === null) throw new C(204, !1);
    if (t.type & 2) return t.value;
    if (e & N.Optional) return null;
    throw new C(204, !1)
};
var Bd = !1,
    ln = (() => {
        class e {
            static __NG_ELEMENT_ID__ = km;
            static __NG_ENV_ID__ = n => n
        }
        return e
    })(),
    Xr = class extends ln {
        _lView;
        constructor(t) {
            super(), this._lView = t
        }
        onDestroy(t) {
            return yc(this._lView, t), () => gd(this._lView, t)
        }
    };

function km() {
    return new Xr(y())
}
var Ct = class {},
    $d = new T("", {
        providedIn: "root",
        factory: () => !1
    });
var Ud = new T(""),
    qd = new T(""),
    un = (() => {
        class e {
            taskId = 0;
            pendingTasks = new Set;
            get _hasPendingTasks() {
                return this.hasPendingTasks.value
            }
            hasPendingTasks = new wn(!1);
            add() {
                this._hasPendingTasks || this.hasPendingTasks.next(!0);
                let n = this.taskId++;
                return this.pendingTasks.add(n), n
            }
            has(n) {
                return this.pendingTasks.has(n)
            }
            remove(n) {
                this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(!1)
            }
            ngOnDestroy() {
                this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(!1)
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })();
var Ys = class extends Te {
        __isAsync;
        destroyRef = void 0;
        pendingTasks = void 0;
        constructor(t = !1) {
            super(), this.__isAsync = t, sd() && (this.destroyRef = D(ln, {
                optional: !0
            }) ?? void 0, this.pendingTasks = D(un, {
                optional: !0
            }) ?? void 0)
        }
        emit(t) {
            let n = _(null);
            try {
                super.next(t)
            } finally {
                _(n)
            }
        }
        subscribe(t, n, r) {
            let o = t,
                i = n || (() => null),
                s = r;
            if (t && typeof t == "object") {
                let c = t;
                o = c.next?.bind(c), i = c.error?.bind(c), s = c.complete?.bind(c)
            }
            this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s)));
            let a = super.subscribe({
                next: o,
                error: i,
                complete: s
            });
            return t instanceof x && t.add(a), a
        }
        wrapInTimeout(t) {
            return n => {
                let r = this.pendingTasks?.add();
                setTimeout(() => {
                    t(n), r !== void 0 && this.pendingTasks?.remove(r)
                })
            }
        }
    },
    tt = Ys;

function Hn(...e) {}

function Wd(e) {
    let t, n;

    function r() {
        e = Hn;
        try {
            n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t)
        } catch {}
    }
    return t = setTimeout(() => {
        e(), r()
    }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
        e(), r()
    })), () => r()
}

function Kl(e) {
    return queueMicrotask(() => e()), () => {
        e = Hn
    }
}
var Mc = "isAngularZone",
    eo = Mc + "_ID",
    Om = 0,
    X = class e {
        hasPendingMacrotasks = !1;
        hasPendingMicrotasks = !1;
        isStable = !0;
        onUnstable = new tt(!1);
        onMicrotaskEmpty = new tt(!1);
        onStable = new tt(!1);
        onError = new tt(!1);
        constructor(t) {
            let {
                enableLongStackTrace: n = !1,
                shouldCoalesceEventChangeDetection: r = !1,
                shouldCoalesceRunChangeDetection: o = !1,
                scheduleInRootZone: i = Bd
            } = t;
            if (typeof Zone > "u") throw new C(908, !1);
            Zone.assertZonePatched();
            let s = this;
            s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec)), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = !1, s.scheduleInRootZone = i, Fm(s)
        }
        static isInAngularZone() {
            return typeof Zone < "u" && Zone.current.get(Mc) === !0
        }
        static assertInAngularZone() {
            if (!e.isInAngularZone()) throw new C(909, !1)
        }
        static assertNotInAngularZone() {
            if (e.isInAngularZone()) throw new C(909, !1)
        }
        run(t, n, r) {
            return this._inner.run(t, n, r)
        }
        runTask(t, n, r, o) {
            let i = this._inner,
                s = i.scheduleEventTask("NgZoneEvent: " + o, t, Pm, Hn, Hn);
            try {
                return i.runTask(s, n, r)
            } finally {
                i.cancelTask(s)
            }
        }
        runGuarded(t, n, r) {
            return this._inner.runGuarded(t, n, r)
        }
        runOutsideAngular(t) {
            return this._outer.run(t)
        }
    },
    Pm = {};

function _c(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable) try {
        e._nesting++, e.onMicrotaskEmpty.emit(null)
    } finally {
        if (e._nesting--, !e.hasPendingMicrotasks) try {
            e.runOutsideAngular(() => e.onStable.emit(null))
        } finally {
            e.isStable = !0
        }
    }
}

function Lm(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = !0;

    function t() {
        Wd(() => {
            e.callbackScheduled = !1, Js(e), e.isCheckStableRunning = !0, _c(e), e.isCheckStableRunning = !1
        })
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
        t()
    }) : e._outer.run(() => {
        t()
    }), Js(e)
}

function Fm(e) {
    let t = () => {
            Lm(e)
        },
        n = Om++;
    e._inner = e._inner.fork({
        name: "angular",
        properties: {
            [Mc]: !0,
            [eo]: n,
            [eo + n]: !0
        },
        onInvokeTask: (r, o, i, s, a, c) => {
            if (Vm(c)) return r.invokeTask(i, s, a, c);
            try {
                return Xl(e), r.invokeTask(i, s, a, c)
            } finally {
                (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), eu(e)
            }
        },
        onInvoke: (r, o, i, s, a, c, l) => {
            try {
                return Xl(e), r.invoke(i, s, a, c, l)
            } finally {
                e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !jm(c) && t(), eu(e)
            }
        },
        onHasTask: (r, o, i, s) => {
            r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, Js(e), _c(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask))
        },
        onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1)
    })
}

function Js(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === !0 ? e.hasPendingMicrotasks = !0 : e.hasPendingMicrotasks = !1
}

function Xl(e) {
    e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null))
}

function eu(e) {
    e._nesting--, _c(e)
}
var Ks = class {
    hasPendingMicrotasks = !1;
    hasPendingMacrotasks = !1;
    isStable = !0;
    onUnstable = new tt;
    onMicrotaskEmpty = new tt;
    onStable = new tt;
    onError = new tt;
    run(t, n, r) {
        return t.apply(n, r)
    }
    runGuarded(t, n, r) {
        return t.apply(n, r)
    }
    runOutsideAngular(t) {
        return t()
    }
    runTask(t, n, r, o) {
        return t.apply(n, r)
    }
};

function Vm(e) {
    return zd(e, "__ignore_ng_zone__")
}

function jm(e) {
    return zd(e, "__scheduler_tick__")
}

function zd(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0
}
var it = class {
        _console = console;
        handleError(t) {
            this._console.error("ERROR", t)
        }
    },
    Hm = new T("", {
        providedIn: "root",
        factory: () => {
            let e = D(X),
                t = D(it);
            return n => e.runOutsideAngular(() => t.handleError(n))
        }
    }),
    Xs = class {
        destroyed = !1;
        listeners = null;
        errorHandler = D(it, {
            optional: !0
        });
        destroyRef = D(ln);
        constructor() {
            this.destroyRef.onDestroy(() => {
                this.destroyed = !0, this.listeners = null
            })
        }
        subscribe(t) {
            if (this.destroyed) throw new C(953, !1);
            return (this.listeners ??= []).push(t), {
                unsubscribe: () => {
                    let n = this.listeners?.indexOf(t);
                    n !== void 0 && n !== -1 && this.listeners?.splice(n, 1)
                }
            }
        }
        emit(t) {
            if (this.destroyed) throw new C(953, !1);
            if (this.listeners === null) return;
            let n = _(null);
            try {
                for (let r of this.listeners) try {
                    r(t)
                } catch (o) {
                    this.errorHandler?.handleError(o)
                }
            } finally {
                _(n)
            }
        }
    };

function tu(e, t) {
    return Hu(e, t)
}

function Bm(e) {
    return Hu(yo, e)
}
var tS = (tu.required = Bm, tu);

function $m() {
    return dn(F(), y())
}

function dn(e, t) {
    return new To(ve(e, t))
}
var To = (() => {
    class e {
        nativeElement;
        constructor(n) {
            this.nativeElement = n
        }
        static __NG_ELEMENT_ID__ = $m
    }
    return e
})();

function Um(e) {
    return e instanceof To ? e.nativeElement : e
}

function qm() {
    return this._results[Symbol.iterator]()
}
var ea = class {
    _emitDistinctChangesOnly;
    dirty = !0;
    _onDirty = void 0;
    _results = [];
    _changesDetected = !1;
    _changes = void 0;
    length = 0;
    first = void 0;
    last = void 0;
    get changes() {
        return this._changes ??= new Te
    }
    constructor(t = !1) {
        this._emitDistinctChangesOnly = t
    }
    get(t) {
        return this._results[t]
    }
    map(t) {
        return this._results.map(t)
    }
    filter(t) {
        return this._results.filter(t)
    }
    find(t) {
        return this._results.find(t)
    }
    reduce(t, n) {
        return this._results.reduce(t, n)
    }
    forEach(t) {
        this._results.forEach(t)
    }
    some(t) {
        return this._results.some(t)
    }
    toArray() {
        return this._results.slice()
    }
    toString() {
        return this._results.toString()
    }
    reset(t, n) {
        this.dirty = !1;
        let r = kg(t);
        (this._changesDetected = !Ag(this._results, r, n)) && (this._results = r, this.length = r.length, this.last = r[this.length - 1], this.first = r[0])
    }
    notifyOnChanges() {
        this._changes !== void 0 && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.next(this)
    }
    onDirty(t) {
        this._onDirty = t
    }
    setDirty() {
        this.dirty = !0, this._onDirty?.()
    }
    destroy() {
        this._changes !== void 0 && (this._changes.complete(), this._changes.unsubscribe())
    } [Symbol.iterator] = qm
};

function Gd(e) {
    return (e.flags & 128) === 128
}
var Qd = function(e) {
        return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e
    }(Qd || {}),
    Zd = new Map,
    Wm = 0;

function zm() {
    return Wm++
}

function Gm(e) {
    Zd.set(e[Co], e)
}

function ta(e) {
    Zd.delete(e[Co])
}
var nu = "__ngContext__";

function st(e, t) {
    ot(t) ? (e[nu] = t[Co], Gm(t)) : e[nu] = t
}

function Yd(e) {
    return Kd(e[Fn])
}

function Jd(e) {
    return Kd(e[De])
}

function Kd(e) {
    for (; e !== null && !Ge(e);) e = e[De];
    return e
}
var na;

function nS(e) {
    na = e
}

function Nc() {
    if (na !== void 0) return na;
    if (typeof document < "u") return document;
    throw new C(210, !1)
}
var rS = new T("", {
        providedIn: "root",
        factory: () => Qm
    }),
    Qm = "ng",
    Zm = new T(""),
    oS = new T("", {
        providedIn: "platform",
        factory: () => "unknown"
    });
var iS = new T(""),
    sS = new T("", {
        providedIn: "root",
        factory: () => Nc().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
    }),
    Ym = {
        breakpoints: [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        placeholderResolution: 30,
        disableImageSizeWarning: !1,
        disableImageLazyLoadWarning: !1
    },
    aS = new T("", {
        providedIn: "root",
        factory: () => Ym
    });
var Jm = "h",
    Km = "b";
var Xm = "di",
    Xd = "s";
var ef = !1,
    ey = new T("", {
        providedIn: "root",
        factory: () => ef
    });
var ty = new T("");
var xc = function(e) {
        return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e
    }(xc || {}),
    So = new T(""),
    ru = new Set;

function Pe(e) {
    ru.has(e) || (ru.add(e), performance?.mark?.("mark_feature_usage", {
        detail: {
            feature: e
        }
    }))
}
var zt = function(e) {
        return e[e.EarlyRead = 0] = "EarlyRead", e[e.Write = 1] = "Write", e[e.MixedReadWrite = 2] = "MixedReadWrite", e[e.Read = 3] = "Read", e
    }(zt || {}),
    tf = (() => {
        class e {
            impl = null;
            execute() {
                this.impl?.execute()
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    ny = [zt.EarlyRead, zt.Write, zt.MixedReadWrite, zt.Read],
    ry = (() => {
        class e {
            ngZone = D(X);
            scheduler = D(Ct);
            errorHandler = D(it, {
                optional: !0
            });
            sequences = new Set;
            deferredRegistrations = new Set;
            executing = !1;
            constructor() {
                D(So, {
                    optional: !0
                })
            }
            execute() {
                this.executing = !0;
                for (let n of ny)
                    for (let r of this.sequences)
                        if (!(r.erroredOrDestroyed || !r.hooks[n])) try {
                            r.pipelinedValue = this.ngZone.runOutsideAngular(() => this.maybeTrace(() => r.hooks[n](r.pipelinedValue), r.snapshot))
                        } catch (o) {
                            r.erroredOrDestroyed = !0, this.errorHandler?.handleError(o)
                        }
                this.executing = !1;
                for (let n of this.sequences) n.afterRun(), n.once && (this.sequences.delete(n), n.destroy());
                for (let n of this.deferredRegistrations) this.sequences.add(n);
                this.deferredRegistrations.size > 0 && this.scheduler.notify(8), this.deferredRegistrations.clear()
            }
            register(n) {
                this.executing ? this.deferredRegistrations.add(n) : (this.sequences.add(n), this.scheduler.notify(7))
            }
            unregister(n) {
                this.executing && this.sequences.has(n) ? (n.erroredOrDestroyed = !0, n.pipelinedValue = void 0, n.once = !0) : (this.sequences.delete(n), this.deferredRegistrations.delete(n))
            }
            maybeTrace(n, r) {
                return r ? r.run(xc.AFTER_NEXT_RENDER, n) : n()
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    ra = class {
        impl;
        hooks;
        once;
        snapshot;
        erroredOrDestroyed = !1;
        pipelinedValue = void 0;
        unregisterOnDestroy;
        constructor(t, n, r, o, i = null) {
            this.impl = t, this.hooks = n, this.once = r, this.snapshot = i, this.unregisterOnDestroy = o?.onDestroy(() => this.destroy())
        }
        afterRun() {
            this.erroredOrDestroyed = !1, this.pipelinedValue = void 0, this.snapshot?.dispose(), this.snapshot = null
        }
        destroy() {
            this.impl.unregister(this), this.unregisterOnDestroy?.()
        }
    };

function oy(e, t) {
    !t?.injector && Do(oy);
    let n = t?.injector ?? D(We);
    return Pe("NgAfterRender"), nf(e, n, t, !1)
}

function iy(e, t) {
    !t?.injector && Do(iy);
    let n = t?.injector ?? D(We);
    return Pe("NgAfterNextRender"), nf(e, n, t, !0)
}

function sy(e, t) {
    if (e instanceof Function) {
        let n = [void 0, void 0, void 0, void 0];
        return n[t] = e, n
    } else return [e.earlyRead, e.write, e.mixedReadWrite, e.read]
}

function nf(e, t, n, r) {
    let o = t.get(tf);
    o.impl ??= t.get(ry);
    let i = t.get(So, null, {
            optional: !0
        }),
        s = n?.phase ?? zt.MixedReadWrite,
        a = n?.manualCleanup !== !0 ? t.get(ln) : null,
        c = new ra(o.impl, sy(e, s), r, a, i?.snapshot(null));
    return o.impl.register(c), c
}
var se = function(e) {
        return e[e.NOT_STARTED = 0] = "NOT_STARTED", e[e.IN_PROGRESS = 1] = "IN_PROGRESS", e[e.COMPLETE = 2] = "COMPLETE", e[e.FAILED = 3] = "FAILED", e
    }(se || {}),
    ou = 0,
    ay = 1,
    L = function(e) {
        return e[e.Placeholder = 0] = "Placeholder", e[e.Loading = 1] = "Loading", e[e.Complete = 2] = "Complete", e[e.Error = 3] = "Error", e
    }(L || {}),
    rf = function(e) {
        return e[e.Initial = -1] = "Initial", e
    }(rf || {}),
    Jt = 0,
    Tc = 1,
    Rn = 2,
    Cr = 3,
    cy = 4,
    ly = 5,
    uy = 6,
    dy = 7,
    Ds = 8,
    fy = 9,
    of = function(e) {
        return e[e.Manual = 0] = "Manual", e[e.Playthrough = 1] = "Playthrough", e
    }(of || {});

function sf(e, t, n) {
    let r = cf(e);
    t[r] === null && (t[r] = []), t[r].push(n)
}

function Pr(e, t) {
    let n = cf(e),
        r = t[n];
    if (r !== null) {
        for (let o of r) o();
        t[n] = null
    }
}

function af(e) {
    Pr(1, e), Pr(0, e), Pr(2, e)
}

function cf(e) {
    let t = cy;
    return e === 1 ? t = ly : e === 2 && (t = fy), t
}

function Ro(e) {
    return e + 1
}

function Xn(e, t) {
    let n = e[v],
        r = Ro(t.index);
    return e[r]
}

function py(e, t, n) {
    let r = e[v],
        o = Ro(t);
    e[o] = n
}

function fn(e, t) {
    let n = Ro(t.index);
    return e.data[n]
}

function hy(e, t, n) {
    let r = Ro(t);
    e.data[r] = n
}

function gy(e, t, n) {
    let r = t[v],
        o = fn(r, n);
    switch (e) {
        case L.Complete:
            return o.primaryTmplIndex;
        case L.Loading:
            return o.loadingTmplIndex;
        case L.Error:
            return o.errorTmplIndex;
        case L.Placeholder:
            return o.placeholderTmplIndex;
        default:
            return null
    }
}

function oa(e, t) {
    return t === L.Placeholder ? e.placeholderBlockConfig?.[ou] ?? null : t === L.Loading ? e.loadingBlockConfig?.[ou] ?? null : null
}

function lf(e) {
    return e.loadingBlockConfig?.[ay] ?? null
}

function iu(e, t) {
    if (!e || e.length === 0) return t;
    let n = new Set(e);
    for (let r of t) n.add(r);
    return e.length === n.size ? e : Array.from(n)
}

function my(e, t) {
    let n = t.primaryTmplIndex + O;
    return Qn(e, n)
}
var yy = new T("");
var vy = () => null;

function Sc(e, t, n = !1) {
    return vy(e, t, n)
}

function Iy(e) {
    return e.get(ty, !1, {
        optional: !0
    })
}
var Bn = function(e) {
        return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e
    }(Bn || {}),
    Mr;

function Ey() {
    if (Mr === void 0 && (Mr = null, et.trustedTypes)) try {
        Mr = et.trustedTypes.createPolicy("angular", {
            createHTML: e => e,
            createScript: e => e,
            createScriptURL: e => e
        })
    } catch {}
    return Mr
}

function Ao(e) {
    return Ey()?.createHTML(e) || e
}
var _r;

function uf() {
    if (_r === void 0 && (_r = null, et.trustedTypes)) try {
        _r = et.trustedTypes.createPolicy("angular#unsafe-bypass", {
            createHTML: e => e,
            createScript: e => e,
            createScriptURL: e => e
        })
    } catch {}
    return _r
}

function su(e) {
    return uf()?.createHTML(e) || e
}

function au(e) {
    return uf()?.createScriptURL(e) || e
}
var ze = class {
        changingThisBreaksApplicationSecurity;
        constructor(t) {
            this.changingThisBreaksApplicationSecurity = t
        }
        toString() {
            return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Vu})`
        }
    },
    ia = class extends ze {
        getTypeName() {
            return "HTML"
        }
    },
    sa = class extends ze {
        getTypeName() {
            return "Style"
        }
    },
    aa = class extends ze {
        getTypeName() {
            return "Script"
        }
    },
    ca = class extends ze {
        getTypeName() {
            return "URL"
        }
    },
    la = class extends ze {
        getTypeName() {
            return "ResourceURL"
        }
    };

function er(e) {
    return e instanceof ze ? e.changingThisBreaksApplicationSecurity : e
}

function Rc(e, t) {
    let n = by(e);
    if (n != null && n !== t) {
        if (n === "ResourceURL" && t === "URL") return !0;
        throw new Error(`Required a safe ${t}, got a ${n} (see ${Vu})`)
    }
    return n === t
}

function by(e) {
    return e instanceof ze && e.getTypeName() || null
}

function cS(e) {
    return new ia(e)
}

function lS(e) {
    return new sa(e)
}

function uS(e) {
    return new aa(e)
}

function dS(e) {
    return new ca(e)
}

function fS(e) {
    return new la(e)
}

function df(e) {
    let t = new da(e);
    return wy() ? new ua(t) : t
}
var ua = class {
        inertDocumentHelper;
        constructor(t) {
            this.inertDocumentHelper = t
        }
        getInertBodyElement(t) {
            t = "<body><remove></remove>" + t;
            try {
                let n = new window.DOMParser().parseFromString(Ao(t), "text/html").body;
                return n === null ? this.inertDocumentHelper.getInertBodyElement(t) : (n.firstChild?.remove(), n)
            } catch {
                return null
            }
        }
    },
    da = class {
        defaultDoc;
        inertDocument;
        constructor(t) {
            this.defaultDoc = t, this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert")
        }
        getInertBodyElement(t) {
            let n = this.inertDocument.createElement("template");
            return n.innerHTML = Ao(t), n
        }
    };

function wy() {
    try {
        return !!new window.DOMParser().parseFromString(Ao(""), "text/html")
    } catch {
        return !1
    }
}
var Dy = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;

function Ac(e) {
    return e = String(e), e.match(Dy) ? e : "unsafe:" + e
}

function Qe(e) {
    let t = {};
    for (let n of e.split(",")) t[n] = !0;
    return t
}

function tr(...e) {
    let t = {};
    for (let n of e)
        for (let r in n) n.hasOwnProperty(r) && (t[r] = !0);
    return t
}
var ff = Qe("area,br,col,hr,img,wbr"),
    pf = Qe("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
    hf = Qe("rp,rt"),
    Cy = tr(hf, pf),
    My = tr(pf, Qe("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")),
    _y = tr(hf, Qe("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")),
    fa = tr(ff, My, _y, Cy),
    kc = Qe("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
    Ny = Qe("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"),
    xy = Qe("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"),
    gf = tr(kc, Ny, xy),
    Ty = Qe("script,style,template"),
    pa = class {
        sanitizedSomething = !1;
        buf = [];
        sanitizeChildren(t) {
            let n = t.firstChild,
                r = !0,
                o = [];
            for (; n;) {
                if (n.nodeType === Node.ELEMENT_NODE ? r = this.startElement(n) : n.nodeType === Node.TEXT_NODE ? this.chars(n.nodeValue) : this.sanitizedSomething = !0, r && n.firstChild) {
                    o.push(n), n = Ay(n);
                    continue
                }
                for (; n;) {
                    n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                    let i = Ry(n);
                    if (i) {
                        n = i;
                        break
                    }
                    n = o.pop()
                }
            }
            return this.buf.join("")
        }
        startElement(t) {
            let n = cu(t).toLowerCase();
            if (!fa.hasOwnProperty(n)) return this.sanitizedSomething = !0, !Ty.hasOwnProperty(n);
            this.buf.push("<"), this.buf.push(n);
            let r = t.attributes;
            for (let o = 0; o < r.length; o++) {
                let i = r.item(o),
                    s = i.name,
                    a = s.toLowerCase();
                if (!gf.hasOwnProperty(a)) {
                    this.sanitizedSomething = !0;
                    continue
                }
                let c = i.value;
                kc[a] && (c = Ac(c)), this.buf.push(" ", s, '="', lu(c), '"')
            }
            return this.buf.push(">"), !0
        }
        endElement(t) {
            let n = cu(t).toLowerCase();
            fa.hasOwnProperty(n) && !ff.hasOwnProperty(n) && (this.buf.push("</"), this.buf.push(n), this.buf.push(">"))
        }
        chars(t) {
            this.buf.push(lu(t))
        }
    };

function Sy(e, t) {
    return (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY) !== Node.DOCUMENT_POSITION_CONTAINED_BY
}

function Ry(e) {
    let t = e.nextSibling;
    if (t && e !== t.previousSibling) throw mf(t);
    return t
}

function Ay(e) {
    let t = e.firstChild;
    if (t && Sy(e, t)) throw mf(t);
    return t
}

function cu(e) {
    let t = e.nodeName;
    return typeof t == "string" ? t : "FORM"
}

function mf(e) {
    return new Error(`Failed to sanitize html because the element is clobbered: ${e.outerHTML}`)
}
var ky = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
    Oy = /([^\#-~ |!])/g;

function lu(e) {
    return e.replace(/&/g, "&amp;").replace(ky, function(t) {
        let n = t.charCodeAt(0),
            r = t.charCodeAt(1);
        return "&#" + ((n - 55296) * 1024 + (r - 56320) + 65536) + ";"
    }).replace(Oy, function(t) {
        return "&#" + t.charCodeAt(0) + ";"
    }).replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
var Nr;

function Py(e, t) {
    let n = null;
    try {
        Nr = Nr || df(e);
        let r = t ? String(t) : "";
        n = Nr.getInertBodyElement(r);
        let o = 5,
            i = r;
        do {
            if (o === 0) throw new Error("Failed to sanitize html because the input is unstable");
            o--, r = i, i = n.innerHTML, n = Nr.getInertBodyElement(r)
        } while (r !== i);
        let a = new pa().sanitizeChildren(ha(n) || n);
        return Ao(a)
    } finally {
        if (n) {
            let r = ha(n) || n;
            for (; r.firstChild;) r.firstChild.remove()
        }
    }
}

function ha(e) {
    return "content" in e && Ly(e) ? e.content : null
}

function Ly(e) {
    return e.nodeType === Node.ELEMENT_NODE && e.nodeName === "TEMPLATE"
}
var ko = function(e) {
    return e[e.NONE = 0] = "NONE", e[e.HTML = 1] = "HTML", e[e.STYLE = 2] = "STYLE", e[e.SCRIPT = 3] = "SCRIPT", e[e.URL = 4] = "URL", e[e.RESOURCE_URL = 5] = "RESOURCE_URL", e
}(ko || {});

function pS(e) {
    let t = Oc();
    return t ? su(t.sanitize(ko.HTML, e) || "") : Rc(e, "HTML") ? su(er(e)) : Py(Nc(), ae(e))
}

function Fy(e) {
    let t = Oc();
    return t ? t.sanitize(ko.URL, e) || "" : Rc(e, "URL") ? er(e) : Ac(ae(e))
}

function Vy(e) {
    let t = Oc();
    if (t) return au(t.sanitize(ko.RESOURCE_URL, e) || "");
    if (Rc(e, "ResourceURL")) return au(er(e));
    throw new C(904, !1)
}

function jy(e, t) {
    return t === "src" && (e === "embed" || e === "frame" || e === "iframe" || e === "media" || e === "script") || t === "href" && (e === "base" || e === "link") ? Vy : Fy
}

function hS(e, t, n) {
    return jy(t, n)(e)
}

function Oc() {
    let e = y();
    return e && e[$e].sanitizer
}
var Hy = /^>|^->|<!--|-->|--!>|<!-$/g,
    By = /(<|>)/g,
    $y = "\u200B$1\u200B";

function Uy(e) {
    return e.replace(Hy, t => t.replace(By, $y))
}

function gS(e) {
    return e.ownerDocument.defaultView
}

function yf(e) {
    return e instanceof Function ? e() : e
}
var at = function(e) {
        return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e
    }(at || {}),
    ga = function(e) {
        return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e
    }(ga || {}),
    ma;

function Pc(e, t) {
    return ma(e, t)
}

function qy(e) {
    ma === void 0 && (ma = e())
}

function Gt(e, t, n, r, o) {
    if (r != null) {
        let i, s = !1;
        Ge(r) ? i = r : ot(r) && (s = !0, r = r[Oe]);
        let a = Ce(r);
        e === 0 && n !== null ? o == null ? Cf(t, n, a) : tn(t, n, a, o || null, !0) : e === 1 && n !== null ? tn(t, n, a, o || null, !0) : e === 2 ? Xy(t, a, s) : e === 3 && t.destroyNode(a), i != null && tv(t, e, i, n, o)
    }
}

function vf(e, t) {
    return e.createText(t)
}

function Wy(e, t, n) {
    e.setValue(t, n)
}

function If(e, t) {
    return e.createComment(Uy(t))
}

function Lc(e, t, n) {
    return e.createElement(t, n)
}

function zy(e, t) {
    Ef(e, t), t[Oe] = null, t[ee] = null
}

function Gy(e, t, n, r, o, i) {
    r[Oe] = o, r[ee] = t, Lo(e, r, n, 1, o, i)
}

function Ef(e, t) {
    t[$e].changeDetectionScheduler?.notify(10), Lo(e, t, t[R], 2, null, null)
}

function Qy(e) {
    let t = e[Fn];
    if (!t) return Cs(e[v], e);
    for (; t;) {
        let n = null;
        if (ot(t)) n = t[Fn];
        else {
            let r = t[Q];
            r && (n = r)
        }
        if (!n) {
            for (; t && !t[De] && t !== e;) ot(t) && Cs(t[v], t), t = t[z];
            t === null && (t = e), ot(t) && Cs(t[v], t), n = t && t[De]
        }
        t = n
    }
}

function Zy(e, t, n, r) {
    let o = Q + r,
        i = n.length;
    r > 0 && (n[o - 1][De] = t), r < i - Q ? (t[De] = n[o], Yu(n, Q + r, t)) : (n.push(t), t[De] = null), t[z] = n;
    let s = t[yt];
    s !== null && n !== s && bf(s, t);
    let a = t[Ue];
    a !== null && a.insertView(e), Us(t), t[I] |= 128
}

function bf(e, t) {
    let n = e[en],
        r = t[z];
    if (ot(r)) e[I] |= Gr.HasTransplantedViews;
    else {
        let o = r[z][ce];
        t[ce] !== o && (e[I] |= Gr.HasTransplantedViews)
    }
    n === null ? e[en] = [t] : n.push(t)
}

function Fc(e, t) {
    let n = e[en],
        r = n.indexOf(t);
    n.splice(r, 1)
}

function $n(e, t) {
    if (e.length <= Q) return;
    let n = Q + t,
        r = e[n];
    if (r) {
        let o = r[yt];
        o !== null && o !== e && Fc(o, r), t > 0 && (e[n - 1][De] = r[De]);
        let i = Br(e, Q + t);
        zy(r[v], r);
        let s = i[Ue];
        s !== null && s.detachView(i[v]), r[z] = null, r[De] = null, r[I] &= -129
    }
    return r
}

function Oo(e, t) {
    if (!(t[I] & 256)) {
        let n = t[R];
        n.destroyNode && Lo(e, t, n, 3, null, null), Qy(t)
    }
}

function Cs(e, t) {
    if (t[I] & 256) return;
    let n = _(null);
    try {
        t[I] &= -129, t[I] |= 256, t[he] && Ut(t[he]), Jy(e, t), Yy(e, t), t[v].type === 1 && t[R].destroy();
        let r = t[yt];
        if (r !== null && Ge(t[z])) {
            r !== t[z] && Fc(r, t);
            let o = t[Ue];
            o !== null && o.detachView(e)
        }
        ta(t)
    } finally {
        _(n)
    }
}

function Yy(e, t) {
    let n = e.cleanup,
        r = t[qr];
    if (n !== null)
        for (let s = 0; s < n.length - 1; s += 2)
            if (typeof n[s] == "string") {
                let a = n[s + 3];
                a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2
            } else {
                let a = r[n[s + 1]];
                n[s].call(a)
            } r !== null && (t[qr] = null);
    let o = t[rt];
    if (o !== null) {
        t[rt] = null;
        for (let s = 0; s < o.length; s++) {
            let a = o[s];
            a()
        }
    }
    let i = t[vt];
    if (i !== null) {
        t[vt] = null;
        for (let s of i) s.destroy()
    }
}

function Jy(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null)
        for (let r = 0; r < n.length; r += 2) {
            let o = t[n[r]];
            if (!(o instanceof wt)) {
                let i = n[r + 1];
                if (Array.isArray(i))
                    for (let s = 0; s < i.length; s += 2) {
                        let a = o[i[s]],
                            c = i[s + 1];
                        Se(4, a, c);
                        try {
                            c.call(a)
                        } finally {
                            Se(5, a, c)
                        }
                    } else {
                        Se(4, o, i);
                        try {
                            i.call(o)
                        } finally {
                            Se(5, o, i)
                        }
                    }
            }
        }
}

function wf(e, t, n) {
    return Df(e, t.parent, n)
}

function Df(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168;) t = r, r = t.parent;
    if (r === null) return n[Oe];
    {
        let {
            componentOffset: o
        } = r;
        if (o > -1) {
            let {
                encapsulation: i
            } = e.data[r.directiveStart + o];
            if (i === Bn.None || i === Bn.Emulated) return null
        }
        return ve(r, n)
    }
}

function tn(e, t, n, r, o) {
    e.insertBefore(t, n, r, o)
}

function Cf(e, t, n) {
    e.appendChild(t, n)
}

function uu(e, t, n, r, o) {
    r !== null ? tn(e, t, n, r, o) : Cf(e, t, n)
}

function Mf(e, t) {
    return e.parentNode(t)
}

function Ky(e, t) {
    return e.nextSibling(t)
}

function _f(e, t, n) {
    return xf(e, t, n)
}

function Nf(e, t, n) {
    return e.type & 40 ? ve(e, n) : null
}
var xf = Nf,
    ya;

function Tf(e, t) {
    xf = e, ya = t
}

function Po(e, t, n, r) {
    let o = wf(e, r, t),
        i = t[R],
        s = r.parent || t[ee],
        a = _f(s, r, t);
    if (o != null)
        if (Array.isArray(n))
            for (let c = 0; c < n.length; c++) uu(i, o, n[c], a, !1);
        else uu(i, o, n, a, !1);
    ya !== void 0 && ya(i, r, t, n, o)
}

function An(e, t) {
    if (t !== null) {
        let n = t.type;
        if (n & 3) return ve(t, e);
        if (n & 4) return va(-1, e[t.index]);
        if (n & 8) {
            let r = t.child;
            if (r !== null) return An(e, r);
            {
                let o = e[t.index];
                return Ge(o) ? va(-1, o) : Ce(o)
            }
        } else {
            if (n & 128) return An(e, t.next);
            if (n & 32) return Pc(t, e)() || Ce(e[t.index]);
            {
                let r = Sf(e, t);
                if (r !== null) {
                    if (Array.isArray(r)) return r[0];
                    let o = Et(e[ce]);
                    return An(o, r)
                } else return An(e, t.next)
            }
        }
    }
    return null
}

function Sf(e, t) {
    if (t !== null) {
        let r = e[ce][ee],
            o = t.projection;
        return r.projection[o]
    }
    return null
}

function va(e, t) {
    let n = Q + e + 1;
    if (n < t.length) {
        let r = t[n],
            o = r[v].firstChild;
        if (o !== null) return An(r, o)
    }
    return t[It]
}

function Xy(e, t, n) {
    e.removeChild(null, t, n)
}

function Vc(e, t, n, r, o, i, s) {
    for (; n != null;) {
        if (n.type === 128) {
            n = n.next;
            continue
        }
        let a = r[n.index],
            c = n.type;
        if (s && t === 0 && (a && st(Ce(a), r), n.flags |= 2), (n.flags & 32) !== 32)
            if (c & 8) Vc(e, t, n.child, r, o, i, !1), Gt(t, e, o, a, i);
            else if (c & 32) {
            let l = Pc(n, r),
                u;
            for (; u = l();) Gt(t, e, o, u, i);
            Gt(t, e, o, a, i)
        } else c & 16 ? Rf(e, t, r, n, o, i) : Gt(t, e, o, a, i);
        n = s ? n.projectionNext : n.next
    }
}

function Lo(e, t, n, r, o, i) {
    Vc(n, r, e.firstChild, t, o, i, !1)
}

function ev(e, t, n) {
    let r = t[R],
        o = wf(e, n, t),
        i = n.parent || t[ee],
        s = _f(i, n, t);
    Rf(r, 0, t, n, o, s)
}

function Rf(e, t, n, r, o, i) {
    let s = n[ce],
        c = s[ee].projection[r.projection];
    if (Array.isArray(c))
        for (let l = 0; l < c.length; l++) {
            let u = c[l];
            Gt(t, e, o, u, i)
        } else {
            let l = c,
                u = s[z];
            Gd(r) && (l.flags |= 128), Vc(e, t, l, u, o, i, !0)
        }
}

function tv(e, t, n, r, o) {
    let i = n[It],
        s = Ce(n);
    i !== s && Gt(t, e, r, i, o);
    for (let a = Q; a < n.length; a++) {
        let c = n[a];
        Lo(c[v], c, e, t, r, i)
    }
}

function nv(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
        let i = r.indexOf("-") === -1 ? void 0 : ga.DashCase;
        o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10), i |= ga.Important), e.setStyle(n, r, o, i))
    }
}

function rv(e, t, n) {
    e.setAttribute(t, "style", n)
}

function Af(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
}

function kf(e, t, n) {
    let {
        mergedAttrs: r,
        classes: o,
        styles: i
    } = n;
    r !== null && zs(e, t, r), o !== null && Af(e, t, o), i !== null && rv(e, t, i)
}

function ov(e, t, n) {
    let r = e.length;
    for (;;) {
        let o = e.indexOf(t, n);
        if (o === -1) return o;
        if (o === 0 || e.charCodeAt(o - 1) <= 32) {
            let i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o
        }
        n = o + 1
    }
}
var Of = "ng-template";

function iv(e, t, n, r) {
    let o = 0;
    if (r) {
        for (; o < t.length && typeof t[o] == "string"; o += 2)
            if (t[o] === "class" && ov(t[o + 1].toLowerCase(), n, 0) !== -1) return !0
    } else if (jc(e)) return !1;
    if (o = t.indexOf(1, o), o > -1) {
        let i;
        for (; ++o < t.length && typeof(i = t[o]) == "string";)
            if (i.toLowerCase() === n) return !0
    }
    return !1
}

function jc(e) {
    return e.type === 4 && e.value !== Of
}

function sv(e, t, n) {
    let r = e.type === 4 && !n ? Of : e.value;
    return t === r
}

function av(e, t, n) {
    let r = 4,
        o = e.attrs,
        i = o !== null ? uv(o) : 0,
        s = !1;
    for (let a = 0; a < t.length; a++) {
        let c = t[a];
        if (typeof c == "number") {
            if (!s && !be(r) && !be(c)) return !1;
            if (s && be(c)) continue;
            s = !1, r = c | r & 1;
            continue
        }
        if (!s)
            if (r & 4) {
                if (r = 2 | r & 1, c !== "" && !sv(e, c, n) || c === "" && t.length === 1) {
                    if (be(r)) return !1;
                    s = !0
                }
            } else if (r & 8) {
            if (o === null || !iv(e, o, c, n)) {
                if (be(r)) return !1;
                s = !0
            }
        } else {
            let l = t[++a],
                u = cv(c, o, jc(e), n);
            if (u === -1) {
                if (be(r)) return !1;
                s = !0;
                continue
            }
            if (l !== "") {
                let d;
                if (u > i ? d = "" : d = o[u + 1].toLowerCase(), r & 2 && l !== d) {
                    if (be(r)) return !1;
                    s = !0
                }
            }
        }
    }
    return be(r) || s
}

function be(e) {
    return (e & 1) === 0
}

function cv(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
        let i = !1;
        for (; o < t.length;) {
            let s = t[o];
            if (s === e) return o;
            if (s === 3 || s === 6) i = !0;
            else if (s === 1 || s === 2) {
                let a = t[++o];
                for (; typeof a == "string";) a = t[++o];
                continue
            } else {
                if (s === 4) break;
                if (s === 0) {
                    o += 4;
                    continue
                }
            }
            o += i ? 1 : 2
        }
        return -1
    } else return dv(t, e)
}

function Pf(e, t, n = !1) {
    for (let r = 0; r < t.length; r++)
        if (av(e, t[r], n)) return !0;
    return !1
}

function lv(e) {
    let t = e.attrs;
    if (t != null) {
        let n = t.indexOf(5);
        if (!(n & 1)) return t[n + 1]
    }
    return null
}

function uv(e) {
    for (let t = 0; t < e.length; t++) {
        let n = e[t];
        if (Sd(n)) return t
    }
    return e.length
}

function dv(e, t) {
    let n = e.indexOf(4);
    if (n > -1)
        for (n++; n < e.length;) {
            let r = e[n];
            if (typeof r == "number") return -1;
            if (r === t) return n;
            n++
        }
    return -1
}

function fv(e, t) {
    e: for (let n = 0; n < t.length; n++) {
        let r = t[n];
        if (e.length === r.length) {
            for (let o = 0; o < e.length; o++)
                if (e[o] !== r[o]) continue e;
            return !0
        }
    }
    return !1
}

function du(e, t) {
    return e ? ":not(" + t.trim() + ")" : t
}

function pv(e) {
    let t = e[0],
        n = 1,
        r = 2,
        o = "",
        i = !1;
    for (; n < e.length;) {
        let s = e[n];
        if (typeof s == "string")
            if (r & 2) {
                let a = e[++n];
                o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
            } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
        else o !== "" && !be(s) && (t += du(i, o), o = ""), r = s, i = i || !be(r);
        n++
    }
    return o !== "" && (t += du(i, o)), t
}

function hv(e) {
    return e.map(pv).join(",")
}

function gv(e) {
    let t = [],
        n = [],
        r = 1,
        o = 2;
    for (; r < e.length;) {
        let i = e[r];
        if (typeof i == "string") o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
        else {
            if (!be(o)) break;
            o = i
        }
        r++
    }
    return {
        attrs: t,
        classes: n
    }
}
var H = {};

function mS(e = 1) {
    Lf(A(), y(), _e() + e, !1)
}

function Lf(e, t, n, r) {
    if (!r)
        if ((t[I] & 3) === 3) {
            let i = e.preOrderCheckHooks;
            i !== null && Ar(t, i, n)
        } else {
            let i = e.preOrderHooks;
            i !== null && kr(t, i, 0, n)
        } bt(n)
}

function Fo(e, t = N.Default) {
    let n = y();
    if (n === null) return ye(e, t);
    let r = F();
    return Fd(r, n, W(e), t)
}

function yS() {
    let e = "invalid";
    throw new Error(e)
}

function Ff(e, t, n, r, o, i) {
    let s = _(null);
    try {
        let a = null;
        o & at.SignalBased && (a = t[r][J]), a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)), o & at.HasDecoratorInputTransform && (i = e.inputTransforms[r].call(t, i)), e.setInput !== null ? e.setInput(t, a, i, n, r) : cd(t, a, r, i)
    } finally {
        _(s)
    }
}

function mv(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            if (o < 0) bt(~o);
            else {
                let i = o,
                    s = n[++r],
                    a = n[++r];
                fm(s, i);
                let c = t[i];
                a(2, c)
            }
        }
    } finally {
        bt(-1)
    }
}

function Vo(e, t, n, r, o, i, s, a, c, l, u) {
    let d = t.blueprint.slice();
    return d[Oe] = o, d[I] = r | 4 | 128 | 8 | 64 | 1024, (l !== null || e && e[I] & 2048) && (d[I] |= 2048), hd(d), d[z] = d[an] = e, d[G] = n, d[$e] = s || e && e[$e], d[R] = a || e && e[R], d[ge] = c || e && e[ge] || null, d[ee] = i, d[Co] = zm(), d[Xt] = u, d[ad] = l, d[ce] = t.type == 2 ? e[ce] : d, d
}

function pn(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = Hc(e, t, n, r, o), dm() && (i.flags |= 32);
    else if (i.type & 64) {
        i.type = n, i.value = r, i.attrs = o;
        let s = Vn();
        i.injectorIndex = s === null ? -1 : s.injectorIndex
    }
    return ke(i, !0), i
}

function Hc(e, t, n, r, o) {
    let i = vd(),
        s = vc(),
        a = s ? i : i && i.parent,
        c = e.data[t] = wv(e, a, n, t, r, o);
    return e.firstChild === null && (e.firstChild = c), i !== null && (s ? i.child == null && c.parent !== null && (i.child = c) : i.next === null && (i.next = c, c.prev = i)), c
}

function nr(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o
}

function Vf(e, t, n, r, o) {
    let i = _e(),
        s = r & 2;
    try {
        bt(-1), s && t.length > O && Lf(e, t, O, !1), Se(s ? 2 : 0, o), n(r, o)
    } finally {
        bt(i), Se(s ? 3 : 1, o)
    }
}

function Bc(e, t, n) {
    if (pc(t)) {
        let r = _(null);
        try {
            let o = t.directiveStart,
                i = t.directiveEnd;
            for (let s = o; s < i; s++) {
                let a = e.data[s];
                if (a.contentQueries) {
                    let c = n[s];
                    a.contentQueries(1, c, s)
                }
            }
        } finally {
            _(r)
        }
    }
}

function $c(e, t, n) {
    md() && (xv(e, t, n, ve(n, t)), (n.flags & 64) === 64 && Bf(e, t, n))
}

function Uc(e, t, n = ve) {
    let r = t.localNames;
    if (r !== null) {
        let o = t.index + 1;
        for (let i = 0; i < r.length; i += 2) {
            let s = r[i + 1],
                a = s === -1 ? n(t, e) : e[s];
            e[o++] = a
        }
    }
}

function jf(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = qc(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
}

function qc(e, t, n, r, o, i, s, a, c, l, u) {
    let d = O + r,
        p = d + o,
        f = yv(d, p),
        h = typeof l == "function" ? l() : l;
    return f[v] = {
        type: e,
        blueprint: f,
        template: n,
        queries: null,
        viewQuery: a,
        declTNode: t,
        data: f.slice().fill(null, d),
        bindingStartIndex: d,
        expandoStartIndex: p,
        hostBindingOpCodes: null,
        firstCreatePass: !0,
        firstUpdatePass: !0,
        staticViewQueries: !1,
        staticContentQueries: !1,
        preOrderHooks: null,
        preOrderCheckHooks: null,
        contentHooks: null,
        contentCheckHooks: null,
        viewHooks: null,
        viewCheckHooks: null,
        destroyHooks: null,
        cleanup: null,
        contentQueries: null,
        components: null,
        directiveRegistry: typeof i == "function" ? i() : i,
        pipeRegistry: typeof s == "function" ? s() : s,
        firstChild: null,
        schemas: c,
        consts: h,
        incompleteFirstPass: !1,
        ssrId: u
    }
}

function yv(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : H);
    return n
}

function vv(e, t, n, r) {
    let i = r.get(ey, ef) || n === Bn.ShadowDom,
        s = e.selectRootElement(t, i);
    return Iv(s), s
}

function Iv(e) {
    Ev(e)
}
var Ev = () => null;

function bv(e, t, n, r) {
    let o = Wf(t);
    o.push(n), e.firstCreatePass && zf(e).push(r, o.length - 1)
}

function wv(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1,
        a = 0;
    return yd() && (a |= 128), {
        type: n,
        index: r,
        insertBeforeIndex: null,
        injectorIndex: s,
        directiveStart: -1,
        directiveEnd: -1,
        directiveStylingLast: -1,
        componentOffset: -1,
        propertyBindings: null,
        flags: a,
        providerIndexes: 0,
        value: o,
        attrs: i,
        mergedAttrs: null,
        localNames: null,
        initialInputs: void 0,
        inputs: null,
        outputs: null,
        tView: null,
        next: null,
        prev: null,
        projectionNext: null,
        child: null,
        parent: t,
        projection: null,
        styles: null,
        stylesWithoutHost: null,
        residualStyles: void 0,
        classes: null,
        classesWithoutHost: null,
        residualClasses: void 0,
        classBindings: 0,
        styleBindings: 0
    }
}

function fu(e, t, n, r, o) {
    for (let i in t) {
        if (!t.hasOwnProperty(i)) continue;
        let s = t[i];
        if (s === void 0) continue;
        r ??= {};
        let a, c = at.None;
        Array.isArray(s) ? (a = s[0], c = s[1]) : a = s;
        let l = i;
        if (o !== null) {
            if (!o.hasOwnProperty(i)) continue;
            l = o[i]
        }
        e === 0 ? pu(r, n, l, a, c) : pu(r, n, l, a)
    }
    return r
}

function pu(e, t, n, r, o) {
    let i;
    e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : i = e[n] = [t, r], o !== void 0 && i.push(o)
}

function Dv(e, t, n) {
    let r = t.directiveStart,
        o = t.directiveEnd,
        i = e.data,
        s = t.attrs,
        a = [],
        c = null,
        l = null;
    for (let u = r; u < o; u++) {
        let d = i[u],
            p = n ? n.get(d) : null,
            f = p ? p.inputs : null,
            h = p ? p.outputs : null;
        c = fu(0, d.inputs, u, c, f), l = fu(1, d.outputs, u, l, h);
        let m = c !== null && s !== null && !jc(t) ? jv(c, u, s) : null;
        a.push(m)
    }
    c !== null && (c.hasOwnProperty("class") && (t.flags |= 8), c.hasOwnProperty("style") && (t.flags |= 16)), t.initialInputs = a, t.inputs = c, t.outputs = l
}

function Cv(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e
}

function hn(e, t, n, r, o, i, s, a) {
    let c = ve(t, n),
        l = t.inputs,
        u;
    !a && l != null && (u = l[r]) ? (zc(e, n, u, r, o), Mo(t) && Mv(n, t.index)) : t.type & 3 ? (r = Cv(r), o = s != null ? s(o, t.value || "", r) : o, i.setProperty(c, r, o)) : t.type & 12
}

function Mv(e, t) {
    let n = ct(t, e);
    n[I] & 16 || (n[I] |= 64)
}

function Wc(e, t, n, r) {
    if (md()) {
        let o = r === null ? null : {
                "": -1
            },
            i = Sv(e, n),
            s, a;
        i === null ? s = a = null : [s, a] = i, s !== null && Hf(e, t, n, s, o, a), o && Rv(n, r, o)
    }
    n.mergedAttrs = jn(n.mergedAttrs, n.attrs)
}

function Hf(e, t, n, r, o, i) {
    for (let l = 0; l < r.length; l++) Qs(Kr(n, t), e, r[l].type);
    kv(n, e.data.length, r.length);
    for (let l = 0; l < r.length; l++) {
        let u = r[l];
        u.providersResolver && u.providersResolver(u)
    }
    let s = !1,
        a = !1,
        c = nr(e, t, r.length, null);
    for (let l = 0; l < r.length; l++) {
        let u = r[l];
        n.mergedAttrs = jn(n.mergedAttrs, u.hostAttrs), Ov(e, n, t, c, u), Av(c, u, o), u.contentQueries !== null && (n.flags |= 4), (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) && (n.flags |= 64);
        let d = u.type.prototype;
        !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), s = !0), !a && (d.ngOnChanges || d.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), a = !0), c++
    }
    Dv(e, n, i)
}

function _v(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
        let s = e.hostBindingOpCodes;
        s === null && (s = e.hostBindingOpCodes = []);
        let a = ~t.index;
        Nv(s) != a && s.push(a), s.push(n, r, i)
    }
}

function Nv(e) {
    let t = e.length;
    for (; t > 0;) {
        let n = e[--t];
        if (typeof n == "number" && n < 0) return n
    }
    return 0
}

function xv(e, t, n, r) {
    let o = n.directiveStart,
        i = n.directiveEnd;
    Mo(n) && Pv(t, n, e.data[o + n.componentOffset]), e.firstCreatePass || Kr(n, t), st(r, t);
    let s = n.initialInputs;
    for (let a = o; a < i; a++) {
        let c = e.data[a],
            l = Dt(t, e, a, n);
        if (st(l, t), s !== null && Vv(t, a - o, l, c, n, s), qe(c)) {
            let u = ct(n.index, t);
            u[G] = Dt(t, e, a, n)
        }
    }
}

function Bf(e, t, n) {
    let r = n.directiveStart,
        o = n.directiveEnd,
        i = n.index,
        s = pm();
    try {
        bt(i);
        for (let a = r; a < o; a++) {
            let c = e.data[a],
                l = t[a];
            Ws(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && Tv(c, l)
        }
    } finally {
        bt(-1), Ws(s)
    }
}

function Tv(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t)
}

function Sv(e, t) {
    let n = e.directiveRegistry,
        r = null,
        o = null;
    if (n)
        for (let i = 0; i < n.length; i++) {
            let s = n[i];
            if (Pf(t, s.selectors, !1))
                if (r || (r = []), qe(s))
                    if (s.findHostDirectiveDefs !== null) {
                        let a = [];
                        o = o || new Map, s.findHostDirectiveDefs(s, a, o), r.unshift(...a, s);
                        let c = a.length;
                        Ia(e, t, c)
                    } else r.unshift(s), Ia(e, t, 0);
            else o = o || new Map, s.findHostDirectiveDefs?.(s, r, o), r.push(s)
        }
    return r === null ? null : [r, o]
}

function Ia(e, t, n) {
    t.componentOffset = n, (e.components ??= []).push(t.index)
}

function Rv(e, t, n) {
    if (t) {
        let r = e.localNames = [];
        for (let o = 0; o < t.length; o += 2) {
            let i = n[t[o + 1]];
            if (i == null) throw new C(-301, !1);
            r.push(t[o], i)
        }
    }
}

function Av(e, t, n) {
    if (n) {
        if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
        qe(t) && (n[""] = e)
    }
}

function kv(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t
}

function Ov(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = mt(o.type, !0)),
        s = new wt(i, qe(o), Fo);
    e.blueprint[r] = s, n[r] = s, _v(e, t, r, nr(e, n, o.hostVars, H), o)
}

function $f(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t
}

function Pv(e, t, n) {
    let r = ve(t, e),
        o = jf(n),
        i = e[$e].rendererFactory,
        s = jo(e, Vo(e, o, null, $f(n), r, t, null, i.createRenderer(r, n), null, null, null));
    e[t.index] = s
}

function Lv(e, t, n, r, o, i) {
    let s = ve(e, t);
    Fv(t[R], s, i, e.value, n, r, o)
}

function Fv(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
        let a = s == null ? ae(i) : s(i, r || "", o);
        e.setAttribute(t, o, a, n)
    }
}

function Vv(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null)
        for (let a = 0; a < s.length;) {
            let c = s[a++],
                l = s[a++],
                u = s[a++],
                d = s[a++];
            Ff(r, n, c, l, u, d)
        }
}

function jv(e, t, n) {
    let r = null,
        o = 0;
    for (; o < n.length;) {
        let i = n[o];
        if (i === 0) {
            o += 4;
            continue
        } else if (i === 5) {
            o += 2;
            continue
        }
        if (typeof i == "number") break;
        if (e.hasOwnProperty(i)) {
            r === null && (r = []);
            let s = e[i];
            for (let a = 0; a < s.length; a += 3)
                if (s[a] === t) {
                    r.push(i, s[a + 1], s[a + 2], n[o + 1]);
                    break
                }
        }
        o += 2
    }
    return r
}

function Uf(e, t, n, r) {
    return [e, !0, 0, t, null, r, null, n, null, null]
}

function qf(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
        let r = _(null);
        try {
            for (let o = 0; o < n.length; o += 2) {
                let i = n[o],
                    s = n[o + 1];
                if (s !== -1) {
                    let a = e.data[s];
                    bc(i), a.contentQueries(2, t[s], s)
                }
            }
        } finally {
            _(r)
        }
    }
}

function jo(e, t) {
    return e[Fn] ? e[Wl][De] = t : e[Fn] = t, e[Wl] = t, t
}

function Ea(e, t, n) {
    bc(0);
    let r = _(null);
    try {
        t(e, n)
    } finally {
        _(r)
    }
}

function Wf(e) {
    return e[qr] ??= []
}

function zf(e) {
    return e.cleanup ??= []
}

function Hv(e, t, n) {
    return (e === null || qe(e)) && (n = em(n[t.index])), n[R]
}

function Ho(e, t) {
    let n = e[ge],
        r = n ? n.get(it, null) : null;
    r && r.handleError(t)
}

function zc(e, t, n, r, o) {
    for (let i = 0; i < n.length;) {
        let s = n[i++],
            a = n[i++],
            c = n[i++],
            l = t[s],
            u = e.data[s];
        Ff(u, l, r, a, c, o)
    }
}

function Bo(e, t, n) {
    let r = pd(t, e);
    Wy(e[R], r, n)
}

function Bv(e, t) {
    let n = ct(t, e),
        r = n[v];
    $v(r, n);
    let o = n[Oe];
    o !== null && n[Xt] === null && (n[Xt] = Sc(o, n[ge])), Gc(r, n, n[G])
}

function $v(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}

function Gc(e, t, n) {
    wc(t);
    try {
        let r = e.viewQuery;
        r !== null && Ea(1, r, n);
        let o = e.template;
        o !== null && Vf(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), t[Ue]?.finishViewCreation(e), e.staticContentQueries && qf(e, t), e.staticViewQueries && Ea(2, e.viewQuery, n);
        let i = e.components;
        i !== null && Uv(t, i)
    } catch (r) {
        throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), r
    } finally {
        t[I] &= -5, Dc()
    }
}

function Uv(e, t) {
    for (let n = 0; n < t.length; n++) Bv(e, t[n])
}

function gn(e, t, n, r) {
    let o = _(null);
    try {
        let i = t.tView,
            a = e[I] & 4096 ? 4096 : 16,
            c = Vo(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null),
            l = e[t.index];
        c[yt] = l;
        let u = e[Ue];
        return u !== null && (c[Ue] = u.createEmbeddedView(i)), Gc(i, c, n), c
    } finally {
        _(o)
    }
}

function Gf(e, t) {
    let n = Q + t;
    if (n < e.length) return e[n]
}

function Mt(e, t) {
    return !t || t.firstChild === null || Gd(e)
}

function mn(e, t, n, r = !0) {
    let o = t[v];
    if (Zy(o, t, e, n), r) {
        let s = va(n, e),
            a = t[R],
            c = Mf(a, e[It]);
        c !== null && Gy(o, e[ee], a, t, c, s)
    }
    let i = t[Xt];
    i !== null && i.firstChild !== null && (i.firstChild = null)
}

function Qc(e, t) {
    let n = $n(e, t);
    return n !== void 0 && Oo(n[v], n), n
}

function to(e, t, n, r, o = !1) {
    for (; n !== null;) {
        if (n.type === 128) {
            n = o ? n.projectionNext : n.next;
            continue
        }
        let i = t[n.index];
        i !== null && r.push(Ce(i)), Ge(i) && qv(i, r);
        let s = n.type;
        if (s & 8) to(e, t, n.child, r);
        else if (s & 32) {
            let a = Pc(n, t),
                c;
            for (; c = a();) r.push(c)
        } else if (s & 16) {
            let a = Sf(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
                let c = Et(t[ce]);
                to(c[v], c, a, r, !0)
            }
        }
        n = o ? n.projectionNext : n.next
    }
    return r
}

function qv(e, t) {
    for (let n = Q; n < e.length; n++) {
        let r = e[n],
            o = r[v].firstChild;
        o !== null && to(r[v], r, o, t)
    }
    e[It] !== e[Oe] && t.push(e[It])
}
var Qf = [];

function Wv(e) {
    return e[he] ?? zv(e)
}

function zv(e) {
    let t = Qf.pop() ?? Object.create(Qv);
    return t.lView = e, t
}

function Gv(e) {
    e.lView[he] !== e && (e.lView = null, Qf.push(e))
}
var Qv = de(ue({}, pt), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: e => {
        Zn(e.lView)
    },
    consumerOnSignalRead() {
        this.lView[he] = this
    }
});

function Zv(e) {
    let t = e[he] ?? Object.create(Yv);
    return t.lView = e, t
}
var Yv = de(ue({}, pt), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: e => {
        let t = Et(e.lView);
        for (; t && !Zf(t[v]);) t = Et(t);
        t && mc(t)
    },
    consumerOnSignalRead() {
        this.lView[he] = this
    }
});

function Zf(e) {
    return e.type !== 2
}

function Yf(e) {
    if (e[vt] === null) return;
    let t = !0;
    for (; t;) {
        let n = !1;
        for (let r of e[vt]) r.dirty && (n = !0, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
        t = n && !!(e[I] & 8192)
    }
}
var Jv = 100;

function Jf(e, t = !0, n = 0) {
    let o = e[$e].rendererFactory,
        i = !1;
    i || o.begin?.();
    try {
        Kv(e, n)
    } catch (s) {
        throw t && Ho(e, s), s
    } finally {
        i || o.end?.()
    }
}

function Kv(e, t) {
    let n = Id();
    try {
        Qr(!0), ba(e, t);
        let r = 0;
        for (; No(e);) {
            if (r === Jv) throw new C(103, !1);
            r++, ba(e, 1)
        }
    } finally {
        Qr(n)
    }
}

function Xv(e, t, n, r) {
    let o = t[I];
    if ((o & 256) === 256) return;
    let i = !1,
        s = !1;
    wc(t);
    let a = !0,
        c = null,
        l = null;
    i || (Zf(e) ? (l = Wv(t), c = $t(l)) : Dl() === null ? (a = !1, l = Zv(t), c = $t(l)) : t[he] && (Ut(t[he]), t[he] = null));
    try {
        hd(t), um(e.bindingStartIndex), n !== null && Vf(e, t, n, 2, r);
        let u = (o & 3) === 3;
        if (!i)
            if (u) {
                let f = e.preOrderCheckHooks;
                f !== null && Ar(t, f, null)
            } else {
                let f = e.preOrderHooks;
                f !== null && kr(t, f, 0, null), Es(t, 0)
            } if (s || eI(t), Yf(t), Kf(t, 0), e.contentQueries !== null && qf(e, t), !i)
            if (u) {
                let f = e.contentCheckHooks;
                f !== null && Ar(t, f)
            } else {
                let f = e.contentHooks;
                f !== null && kr(t, f, 1), Es(t, 1)
            } mv(e, t);
        let d = e.components;
        d !== null && ep(t, d, 0);
        let p = e.viewQuery;
        if (p !== null && Ea(2, p, r), !i)
            if (u) {
                let f = e.viewCheckHooks;
                f !== null && Ar(t, f)
            } else {
                let f = e.viewHooks;
                f !== null && kr(t, f, 2), Es(t, 2)
            } if (e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Rr]) {
            for (let f of t[Rr]) f();
            t[Rr] = null
        }
        i || (t[I] &= -73)
    } catch (u) {
        throw i || Zn(t), u
    } finally {
        l !== null && (_n(l, c), a && Gv(l)), Dc()
    }
}

function Kf(e, t) {
    for (let n = Yd(e); n !== null; n = Jd(n))
        for (let r = Q; r < n.length; r++) {
            let o = n[r];
            Xf(o, t)
        }
}

function eI(e) {
    for (let t = Yd(e); t !== null; t = Jd(t)) {
        if (!(t[I] & Gr.HasTransplantedViews)) continue;
        let n = t[en];
        for (let r = 0; r < n.length; r++) {
            let o = n[r];
            mc(o)
        }
    }
}

function tI(e, t, n) {
    let r = ct(t, e);
    Xf(r, n)
}

function Xf(e, t) {
    gc(e) && ba(e, t)
}

function ba(e, t) {
    let r = e[v],
        o = e[I],
        i = e[he],
        s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0), s ||= !!(o & 1024), s ||= !!(i?.dirty && Nn(i)), s ||= !1, i && (i.dirty = !1), e[I] &= -9217, s) Xv(r, e, r.template, e[G]);
    else if (o & 8192) {
        Yf(e), Kf(e, 1);
        let a = r.components;
        a !== null && ep(e, a, 1)
    }
}

function ep(e, t, n) {
    for (let r = 0; r < t.length; r++) tI(e, t[r], n)
}

function $o(e, t) {
    let n = Id() ? 64 : 1088;
    for (e[$e].changeDetectionScheduler?.notify(t); e;) {
        e[I] |= n;
        let r = Et(e);
        if (Bs(e) && !r) return e;
        e = r
    }
    return null
}
var _t = class {
        _lView;
        _cdRefInjectingView;
        notifyErrorHandler;
        _appRef = null;
        _attachedToViewContainer = !1;
        get rootNodes() {
            let t = this._lView,
                n = t[v];
            return to(n, t, n.firstChild, [])
        }
        constructor(t, n, r = !0) {
            this._lView = t, this._cdRefInjectingView = n, this.notifyErrorHandler = r
        }
        get context() {
            return this._lView[G]
        }
        get dirty() {
            return !!(this._lView[I] & 9280) || !!this._lView[he]?.dirty
        }
        set context(t) {
            this._lView[G] = t
        }
        get destroyed() {
            return (this._lView[I] & 256) === 256
        }
        destroy() {
            if (this._appRef) this._appRef.detachView(this);
            else if (this._attachedToViewContainer) {
                let t = this._lView[z];
                if (Ge(t)) {
                    let n = t[zr],
                        r = n ? n.indexOf(this) : -1;
                    r > -1 && ($n(t, r), Br(n, r))
                }
                this._attachedToViewContainer = !1
            }
            Oo(this._lView[v], this._lView)
        }
        onDestroy(t) {
            yc(this._lView, t)
        }
        markForCheck() {
            $o(this._cdRefInjectingView || this._lView, 4)
        }
        markForRefresh() {
            mc(this._cdRefInjectingView || this._lView)
        }
        detach() {
            this._lView[I] &= -129
        }
        reattach() {
            Us(this._lView), this._lView[I] |= 128
        }
        detectChanges() {
            this._lView[I] |= 1024, Jf(this._lView, this.notifyErrorHandler)
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
            if (this._appRef) throw new C(902, !1);
            this._attachedToViewContainer = !0
        }
        detachFromAppRef() {
            this._appRef = null;
            let t = Bs(this._lView),
                n = this._lView[yt];
            n !== null && !t && Fc(n, this._lView), Ef(this._lView[v], this._lView)
        }
        attachToAppRef(t) {
            if (this._attachedToViewContainer) throw new C(902, !1);
            this._appRef = t;
            let n = Bs(this._lView),
                r = this._lView[yt];
            r !== null && !n && bf(r, this._lView), Us(this._lView)
        }
    },
    no = (() => {
        class e {
            static __NG_ELEMENT_ID__ = oI
        }
        return e
    })(),
    nI = no,
    rI = class extends nI {
        _declarationLView;
        _declarationTContainer;
        elementRef;
        constructor(t, n, r) {
            super(), this._declarationLView = t, this._declarationTContainer = n, this.elementRef = r
        }
        get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null
        }
        createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n)
        }
        createEmbeddedViewImpl(t, n, r) {
            let o = gn(this._declarationLView, this._declarationTContainer, t, {
                embeddedViewInjector: n,
                dehydratedView: r
            });
            return new _t(o)
        }
    };

function oI() {
    return Uo(F(), y())
}

function Uo(e, t) {
    return e.type & 4 ? new rI(t, e, dn(e, t)) : null
}

function tp(e, t, n) {
    let r = t.insertBeforeIndex,
        o = Array.isArray(r) ? r[0] : r;
    return o === null ? Nf(e, t, n) : Ce(n[o])
}

function np(e, t, n, r, o) {
    let i = t.insertBeforeIndex;
    if (Array.isArray(i)) {
        let s = r,
            a = null;
        if (t.type & 3 || (a = s, s = o), s !== null && t.componentOffset === -1)
            for (let c = 1; c < i.length; c++) {
                let l = n[i[c]];
                tn(e, s, l, a, !1)
            }
    }
}

function rp(e, t) {
    if (e.push(t), e.length > 1)
        for (let n = e.length - 2; n >= 0; n--) {
            let r = e[n];
            op(r) || iI(r, t) && sI(r) === null && aI(r, t.index)
        }
}

function op(e) {
    return !(e.type & 64)
}

function iI(e, t) {
    return op(t) || e.index > t.index
}

function sI(e) {
    let t = e.insertBeforeIndex;
    return Array.isArray(t) ? t[0] : t
}

function aI(e, t) {
    let n = e.insertBeforeIndex;
    Array.isArray(n) ? n[0] = t : (Tf(tp, np), e.insertBeforeIndex = t)
}

function cI(e, t, n) {
    let r = e.data[t];
    r === null ? e.data[t] = n : r.value = n
}

function lI(e, t) {
    let n = e.insertBeforeIndex;
    n === null ? (Tf(tp, np), n = e.insertBeforeIndex = [null, t]) : (fg(Array.isArray(n), !0, "Expecting array here"), n.push(t))
}

function uI(e, t, n) {
    let r = Hc(e, n, 64, null, null);
    return rp(t, r), r
}

function dI(e, t) {
    let n = t[e.currentCaseLViewIndex];
    return n === null ? n : n < 0 ? ~n : n
}

function fI(e, t, n) {
    return e | t << 17 | n << 1
}

function pI(e) {
    return e === -1
}

function ip(e, t, n) {
    e.index = 0;
    let r = dI(t, n);
    r !== null ? e.removes = t.remove[r] : e.removes = K
}

function wa(e) {
    if (e.index < e.removes.length) {
        let t = e.removes[e.index++];
        if (t > 0) return e.lView[t];
        {
            e.stack.push(e.index, e.removes);
            let n = ~t,
                r = e.lView[v].data[n];
            return ip(e, r, e.lView), wa(e)
        }
    } else return e.stack.length === 0 ? null : (e.removes = e.stack.pop(), e.index = e.stack.pop(), wa(e))
}

function hI() {
    let e = {
        stack: [],
        index: -1
    };

    function t(n, r) {
        for (e.lView = r; e.stack.length;) e.stack.pop();
        return ip(e, n.value, r), wa.bind(null, e)
    }
    return t
}
var IS = new RegExp(`^(\\d+)*(${Km}|${Jm})*(.*)`);
var gI = () => {};

function mI(e, t, n, r) {
    gI(e, t, n, r)
}
var yI = () => null;

function nn(e, t) {
    return yI(e, t)
}
var Da = class {},
    ro = class {},
    Ca = class {
        resolveComponentFactory(t) {
            throw Error(`No component factory found for ${pe(t)}.`)
        }
    },
    rn = class {
        static NULL = new Ca
    },
    oo = class {},
    ES = (() => {
        class e {
            destroyNode = null;
            static __NG_ELEMENT_ID__ = () => vI()
        }
        return e
    })();

function vI() {
    let e = y(),
        t = F(),
        n = ct(t.index, e);
    return (ot(n) ? n : e)[R]
}
var II = (() => {
    class e {
        static \u0275prov = P({
            token: e,
            providedIn: "root",
            factory: () => null
        })
    }
    return e
})();

function io(e, t, n) {
    let r = n ? e.styles : null,
        o = n ? e.classes : null,
        i = 0;
    if (t !== null)
        for (let s = 0; s < t.length; s++) {
            let a = t[s];
            if (typeof a == "number") i = a;
            else if (i == 1) o = Os(o, a);
            else if (i == 2) {
                let c = a,
                    l = t[++s];
                r = Os(r, c + ": " + l + ";")
            }
        }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o
}
var so = class extends rn {
    ngModule;
    constructor(t) {
        super(), this.ngModule = t
    }
    resolveComponentFactory(t) {
        let n = Ae(t);
        return new Nt(n, this.ngModule)
    }
};

function hu(e, t) {
    let n = [];
    for (let r in e) {
        if (!e.hasOwnProperty(r)) continue;
        let o = e[r];
        if (o === void 0) continue;
        let i = Array.isArray(o),
            s = i ? o[0] : o,
            a = i ? o[1] : at.None;
        t ? n.push({
            propName: s,
            templateName: r,
            isSignal: (a & at.SignalBased) !== 0
        }) : n.push({
            propName: s,
            templateName: r
        })
    }
    return n
}

function EI(e) {
    let t = e.toLowerCase();
    return t === "svg" ? fd : t === "math" ? Xg : null
}
var Nt = class extends ro {
        componentDef;
        ngModule;
        selector;
        componentType;
        ngContentSelectors;
        isBoundToModule;
        get inputs() {
            let t = this.componentDef,
                n = t.inputTransforms,
                r = hu(t.inputs, !0);
            if (n !== null)
                for (let o of r) n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
            return r
        }
        get outputs() {
            return hu(this.componentDef.outputs, !1)
        }
        constructor(t, n) {
            super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = hv(t.selectors), this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : [], this.isBoundToModule = !!n
        }
        create(t, n, r, o) {
            let i = _(null);
            try {
                o = o || this.ngModule;
                let s = o instanceof Be ? o : o?.injector;
                s && this.componentDef.getStandaloneInjector !== null && (s = this.componentDef.getStandaloneInjector(s) || s);
                let a = s ? new Yt(t, s) : t,
                    c = a.get(oo, null);
                if (c === null) throw new C(407, !1);
                let l = a.get(II, null),
                    u = a.get(Ct, null),
                    d = {
                        rendererFactory: c,
                        sanitizer: l,
                        changeDetectionScheduler: u
                    },
                    p = c.createRenderer(null, this.componentDef),
                    f = this.componentDef.selectors[0][0] || "div",
                    h = r ? vv(p, r, this.componentDef.encapsulation, a) : Lc(p, f, EI(f)),
                    m = 512;
                this.componentDef.signals ? m |= 4096 : this.componentDef.onPush || (m |= 16);
                let M = null;
                h !== null && (M = Sc(h, a, !0));
                let E = qc(0, null, null, 1, 0, null, null, null, null, null, null),
                    S = Vo(null, E, null, m, null, null, d, p, a, null, M);
                wc(S);
                let B, V, $ = null;
                try {
                    let U = this.componentDef,
                        te, Rt = null;
                    U.findHostDirectiveDefs ? (te = [], Rt = new Map, U.findHostDirectiveDefs(U, te, Rt), te.push(U)) : te = [U];
                    let tl = bI(S, h);
                    $ = wI(tl, h, U, te, S, d, p), V = Qn(E, O), h && MI(p, U, h, r), n !== void 0 && _I(V, this.ngContentSelectors, n), B = CI($, U, te, Rt, S, [NI]), Gc(E, S, null)
                } catch (U) {
                    throw $ !== null && ta($), ta(S), U
                } finally {
                    Dc()
                }
                return new Ma(this.componentType, B, dn(V, S), S, V)
            } finally {
                _(i)
            }
        }
    },
    Ma = class extends Da {
        location;
        _rootLView;
        _tNode;
        instance;
        hostView;
        changeDetectorRef;
        componentType;
        previousInputValues = null;
        constructor(t, n, r, o, i) {
            super(), this.location = r, this._rootLView = o, this._tNode = i, this.instance = n, this.hostView = this.changeDetectorRef = new _t(o, void 0, !1), this.componentType = t
        }
        setInput(t, n) {
            let r = this._tNode.inputs,
                o;
            if (r !== null && (o = r[t])) {
                if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
                let i = this._rootLView;
                zc(i[v], i, o, t, n), this.previousInputValues.set(t, n);
                let s = ct(this._tNode.index, i);
                $o(s, 1)
            }
        }
        get injector() {
            return new gt(this._tNode, this._rootLView)
        }
        destroy() {
            this.hostView.destroy()
        }
        onDestroy(t) {
            this.hostView.onDestroy(t)
        }
    };

function bI(e, t) {
    let n = e[v],
        r = O;
    return e[r] = t, pn(n, r, 2, "#host", null)
}

function wI(e, t, n, r, o, i, s) {
    let a = o[v];
    DI(r, e, t, s);
    let c = null;
    t !== null && (c = Sc(t, o[ge]));
    let l = i.rendererFactory.createRenderer(t, n),
        u = Vo(o, jf(n), null, $f(n), o[e.index], e, i, l, null, null, c);
    return a.firstCreatePass && Ia(a, e, r.length - 1), jo(o, u), o[e.index] = u
}

function DI(e, t, n, r) {
    for (let o of e) t.mergedAttrs = jn(t.mergedAttrs, o.hostAttrs);
    t.mergedAttrs !== null && (io(t, t.mergedAttrs, !0), n !== null && kf(r, n, t))
}

function CI(e, t, n, r, o, i) {
    let s = F(),
        a = o[v],
        c = ve(s, o);
    Hf(a, o, s, n, null, r);
    for (let u = 0; u < n.length; u++) {
        let d = s.directiveStart + u,
            p = Dt(o, a, d, s);
        st(p, o)
    }
    Bf(a, o, s), c && st(c, o);
    let l = Dt(o, a, s.directiveStart + s.componentOffset, s);
    if (e[G] = o[G] = l, i !== null)
        for (let u of i) u(l, t);
    return Bc(a, s, o), l
}

function MI(e, t, n, r) {
    if (r) zs(e, n, ["ng-version", "19.0.5"]);
    else {
        let {
            attrs: o,
            classes: i
        } = gv(t.selectors[0]);
        o && zs(e, n, o), i && i.length > 0 && Af(e, n, i.join(" "))
    }
}

function _I(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
        let i = n[o];
        r.push(i != null && i.length ? Array.from(i) : null)
    }
}

function NI() {
    let e = F();
    xo(y()[v], e)
}
var Zc = (() => {
    class e {
        static __NG_ELEMENT_ID__ = xI
    }
    return e
})();

function xI() {
    let e = F();
    return ap(e, y())
}
var TI = Zc,
    sp = class extends TI {
        _lContainer;
        _hostTNode;
        _hostLView;
        constructor(t, n, r) {
            super(), this._lContainer = t, this._hostTNode = n, this._hostLView = r
        }
        get element() {
            return dn(this._hostTNode, this._hostLView)
        }
        get injector() {
            return new gt(this._hostTNode, this._hostLView)
        }
        get parentInjector() {
            let t = Cc(this._hostTNode, this._hostLView);
            if (Rd(t)) {
                let n = Yr(t, this._hostLView),
                    r = Zr(t),
                    o = n[v].data[r + 8];
                return new gt(o, n)
            } else return new gt(null, this._hostLView)
        }
        clear() {
            for (; this.length > 0;) this.remove(this.length - 1)
        }
        get(t) {
            let n = gu(this._lContainer);
            return n !== null && n[t] || null
        }
        get length() {
            return this._lContainer.length - Q
        }
        createEmbeddedView(t, n, r) {
            let o, i;
            typeof r == "number" ? o = r : r != null && (o = r.index, i = r.injector);
            let s = nn(this._lContainer, t.ssrId),
                a = t.createEmbeddedViewImpl(n || {}, i, s);
            return this.insertImpl(a, o, Mt(this._hostTNode, s)), a
        }
        createComponent(t, n, r, o, i) {
            let s = t && !Qg(t),
                a;
            if (s) a = n;
            else {
                let h = n || {};
                a = h.index, r = h.injector, o = h.projectableNodes, i = h.environmentInjector || h.ngModuleRef
            }
            let c = s ? t : new Nt(Ae(t)),
                l = r || this.parentInjector;
            if (!i && c.ngModule == null) {
                let m = (s ? l : this.parentInjector).get(Be, null);
                m && (i = m)
            }
            let u = Ae(c.componentType ?? {}),
                d = nn(this._lContainer, u?.id ?? null),
                p = d?.firstChild ?? null,
                f = c.create(l, o, p, i);
            return this.insertImpl(f.hostView, a, Mt(this._hostTNode, d)), f
        }
        insert(t, n) {
            return this.insertImpl(t, n, !0)
        }
        insertImpl(t, n, r) {
            let o = t._lView;
            if (nm(o)) {
                let a = this.indexOf(t);
                if (a !== -1) this.detach(a);
                else {
                    let c = o[z],
                        l = new sp(c, c[ee], c[z]);
                    l.detach(l.indexOf(t))
                }
            }
            let i = this._adjustIndex(n),
                s = this._lContainer;
            return mn(s, o, i, r), t.attachToViewContainerRef(), Yu(Ms(s), i, t), t
        }
        move(t, n) {
            return this.insert(t, n)
        }
        indexOf(t) {
            let n = gu(this._lContainer);
            return n !== null ? n.indexOf(t) : -1
        }
        remove(t) {
            let n = this._adjustIndex(t, -1),
                r = $n(this._lContainer, n);
            r && (Br(Ms(this._lContainer), n), Oo(r[v], r))
        }
        detach(t) {
            let n = this._adjustIndex(t, -1),
                r = $n(this._lContainer, n);
            return r && Br(Ms(this._lContainer), n) != null ? new _t(r) : null
        }
        _adjustIndex(t, n = 0) {
            return t ?? this.length + n
        }
    };

function gu(e) {
    return e[zr]
}

function Ms(e) {
    return e[zr] || (e[zr] = [])
}

function ap(e, t) {
    let n, r = t[e.index];
    return Ge(r) ? n = r : (n = Uf(r, t, null, e), t[e.index] = n, jo(t, n)), RI(n, t, e, r), new sp(n, e, t)
}

function SI(e, t) {
    let n = e[R],
        r = n.createComment(""),
        o = ve(t, e),
        i = Mf(n, o);
    return tn(n, i, r, Ky(n, o), !1), r
}
var RI = kI,
    AI = () => !1;

function cp(e, t, n) {
    return AI(e, t, n)
}

function kI(e, t, n, r) {
    if (e[It]) return;
    let o;
    n.type & 8 ? o = Ce(r) : o = SI(t, n), e[It] = o
}
var _a = class e {
        queryList;
        matches = null;
        constructor(t) {
            this.queryList = t
        }
        clone() {
            return new e(this.queryList)
        }
        setDirty() {
            this.queryList.setDirty()
        }
    },
    Na = class e {
        queries;
        constructor(t = []) {
            this.queries = t
        }
        createEmbeddedView(t) {
            let n = t.queries;
            if (n !== null) {
                let r = t.contentQueries !== null ? t.contentQueries[0] : n.length,
                    o = [];
                for (let i = 0; i < r; i++) {
                    let s = n.getByIndex(i),
                        a = this.queries[s.indexInDeclarationView];
                    o.push(a.clone())
                }
                return new e(o)
            }
            return null
        }
        insertView(t) {
            this.dirtyQueriesWithMatches(t)
        }
        detachView(t) {
            this.dirtyQueriesWithMatches(t)
        }
        finishViewCreation(t) {
            this.dirtyQueriesWithMatches(t)
        }
        dirtyQueriesWithMatches(t) {
            for (let n = 0; n < this.queries.length; n++) Yc(t, n).matches !== null && this.queries[n].setDirty()
        }
    },
    ao = class {
        flags;
        read;
        predicate;
        constructor(t, n, r = null) {
            this.flags = n, this.read = r, typeof t == "string" ? this.predicate = BI(t) : this.predicate = t
        }
    },
    xa = class e {
        queries;
        constructor(t = []) {
            this.queries = t
        }
        elementStart(t, n) {
            for (let r = 0; r < this.queries.length; r++) this.queries[r].elementStart(t, n)
        }
        elementEnd(t) {
            for (let n = 0; n < this.queries.length; n++) this.queries[n].elementEnd(t)
        }
        embeddedTView(t) {
            let n = null;
            for (let r = 0; r < this.length; r++) {
                let o = n !== null ? n.length : 0,
                    i = this.getByIndex(r).embeddedTView(t, o);
                i && (i.indexInDeclarationView = r, n !== null ? n.push(i) : n = [i])
            }
            return n !== null ? new e(n) : null
        }
        template(t, n) {
            for (let r = 0; r < this.queries.length; r++) this.queries[r].template(t, n)
        }
        getByIndex(t) {
            return this.queries[t]
        }
        get length() {
            return this.queries.length
        }
        track(t) {
            this.queries.push(t)
        }
    },
    Ta = class e {
        metadata;
        matches = null;
        indexInDeclarationView = -1;
        crossesNgTemplate = !1;
        _declarationNodeIndex;
        _appliesToNextNode = !0;
        constructor(t, n = -1) {
            this.metadata = t, this._declarationNodeIndex = n
        }
        elementStart(t, n) {
            this.isApplyingToNode(n) && this.matchTNode(t, n)
        }
        elementEnd(t) {
            this._declarationNodeIndex === t.index && (this._appliesToNextNode = !1)
        }
        template(t, n) {
            this.elementStart(t, n)
        }
        embeddedTView(t, n) {
            return this.isApplyingToNode(t) ? (this.crossesNgTemplate = !0, this.addMatch(-t.index, n), new e(this.metadata)) : null
        }
        isApplyingToNode(t) {
            if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
                let n = this._declarationNodeIndex,
                    r = t.parent;
                for (; r !== null && r.type & 8 && r.index !== n;) r = r.parent;
                return n === (r !== null ? r.index : -1)
            }
            return this._appliesToNextNode
        }
        matchTNode(t, n) {
            let r = this.metadata.predicate;
            if (Array.isArray(r))
                for (let o = 0; o < r.length; o++) {
                    let i = r[o];
                    this.matchTNodeWithReadOption(t, n, OI(n, i)), this.matchTNodeWithReadOption(t, n, Or(n, t, i, !1, !1))
                } else r === no ? n.type & 4 && this.matchTNodeWithReadOption(t, n, -1) : this.matchTNodeWithReadOption(t, n, Or(n, t, r, !1, !1))
        }
        matchTNodeWithReadOption(t, n, r) {
            if (r !== null) {
                let o = this.metadata.read;
                if (o !== null)
                    if (o === To || o === Zc || o === no && n.type & 4) this.addMatch(n.index, -2);
                    else {
                        let i = Or(n, t, o, !1, !1);
                        i !== null && this.addMatch(n.index, i)
                    }
                else this.addMatch(n.index, r)
            }
        }
        addMatch(t, n) {
            this.matches === null ? this.matches = [t, n] : this.matches.push(t, n)
        }
    };

function OI(e, t) {
    let n = e.localNames;
    if (n !== null) {
        for (let r = 0; r < n.length; r += 2)
            if (n[r] === t) return n[r + 1]
    }
    return null
}

function PI(e, t) {
    return e.type & 11 ? dn(e, t) : e.type & 4 ? Uo(e, t) : null
}

function LI(e, t, n, r) {
    return n === -1 ? PI(t, e) : n === -2 ? FI(e, t, r) : Dt(e, e[v], n, t)
}

function FI(e, t, n) {
    if (n === To) return dn(t, e);
    if (n === no) return Uo(t, e);
    if (n === Zc) return ap(t, e)
}

function lp(e, t, n, r) {
    let o = t[Ue].queries[r];
    if (o.matches === null) {
        let i = e.data,
            s = n.matches,
            a = [];
        for (let c = 0; s !== null && c < s.length; c += 2) {
            let l = s[c];
            if (l < 0) a.push(null);
            else {
                let u = i[l];
                a.push(LI(t, u, s[c + 1], n.metadata.read))
            }
        }
        o.matches = a
    }
    return o.matches
}

function Sa(e, t, n, r) {
    let o = e.queries.getByIndex(n),
        i = o.matches;
    if (i !== null) {
        let s = lp(e, t, o, n);
        for (let a = 0; a < i.length; a += 2) {
            let c = i[a];
            if (c > 0) r.push(s[a / 2]);
            else {
                let l = i[a + 1],
                    u = t[-c];
                for (let d = Q; d < u.length; d++) {
                    let p = u[d];
                    p[yt] === p[z] && Sa(p[v], p, l, r)
                }
                if (u[en] !== null) {
                    let d = u[en];
                    for (let p = 0; p < d.length; p++) {
                        let f = d[p];
                        Sa(f[v], f, l, r)
                    }
                }
            }
        }
    }
    return r
}

function VI(e, t) {
    return e[Ue].queries[t].queryList
}

function up(e, t, n) {
    let r = new ea((n & 4) === 4);
    return bv(e, t, r, r.destroy), (t[Ue] ??= new Na).queries.push(new _a(r)) - 1
}

function jI(e, t, n) {
    let r = A();
    return r.firstCreatePass && (dp(r, new ao(e, t, n), -1), (t & 2) === 2 && (r.staticViewQueries = !0)), up(r, y(), t)
}

function HI(e, t, n, r) {
    let o = A();
    if (o.firstCreatePass) {
        let i = F();
        dp(o, new ao(t, n, r), i.index), $I(o, e), (n & 2) === 2 && (o.staticContentQueries = !0)
    }
    return up(o, y(), n)
}

function BI(e) {
    return e.split(",").map(t => t.trim())
}

function dp(e, t, n) {
    e.queries === null && (e.queries = new xa), e.queries.track(new Ta(t, n))
}

function $I(e, t) {
    let n = e.contentQueries || (e.contentQueries = []),
        r = n.length ? n[n.length - 1] : -1;
    t !== r && n.push(e.queries.length - 1, t)
}

function Yc(e, t) {
    return e.queries.getByIndex(t)
}

function UI(e, t) {
    let n = e[v],
        r = Yc(n, t);
    return r.crossesNgTemplate ? Sa(n, e, t, []) : lp(n, e, r, t)
}

function qI(e) {
    return typeof e == "function" && e[J] !== void 0
}

function wS(e, t) {
    Pe("NgSignals");
    let n = Ol(e),
        r = n[J];
    return t?.equal && (r.equal = t.equal), n.set = o => xn(r, o), n.update = o => Pl(r, o), n.asReadonly = fp.bind(n), n
}

function fp() {
    let e = this[J];
    if (e.readonlyFn === void 0) {
        let t = () => this();
        t[J] = e, e.readonlyFn = t
    }
    return e.readonlyFn
}

function pp(e) {
    return qI(e) && typeof e.set == "function"
}

function hp(e, t) {
    let n = Object.create(ju),
        r = new Xs;
    n.value = e;

    function o() {
        return Mn(n), mu(n.value), n.value
    }
    return o[J] = n, o.asReadonly = fp.bind(o), o.set = i => {
        n.equal(n.value, i) || (xn(n, i), r.emit(i))
    }, o.update = i => {
        mu(n.value), o.set(i(n.value))
    }, o.subscribe = r.subscribe.bind(r), o.destroyRef = r.destroyRef, o
}

function mu(e) {
    if (e === yo) throw new C(952, !1)
}

function yu(e, t) {
    return hp(e, t)
}

function WI(e) {
    return hp(yo, e)
}
var DS = (yu.required = WI, yu);
var xt = class {},
    Ra = class {};
var Aa = class extends xt {
        ngModuleType;
        _parent;
        _bootstrapComponents = [];
        _r3Injector;
        instance;
        destroyCbs = [];
        componentFactoryResolver = new so(this);
        constructor(t, n, r, o = !0) {
            super(), this.ngModuleType = t, this._parent = n;
            let i = ed(t);
            this._bootstrapComponents = yf(i.bootstrap), this._r3Injector = Hd(t, n, [{
                provide: xt,
                useValue: this
            }, {
                provide: rn,
                useValue: this.componentFactoryResolver
            }, ...r], pe(t), new Set(["environment"])), o && this.resolveInjectorInitializers()
        }
        resolveInjectorInitializers() {
            this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(this.ngModuleType)
        }
        get injector() {
            return this._r3Injector
        }
        destroy() {
            let t = this._r3Injector;
            !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
        }
        onDestroy(t) {
            this.destroyCbs.push(t)
        }
    },
    ka = class extends Ra {
        moduleType;
        constructor(t) {
            super(), this.moduleType = t
        }
        create(t) {
            return new Aa(this.moduleType, t, [])
        }
    };
var co = class extends xt {
    injector;
    componentFactoryResolver = new so(this);
    instance = null;
    constructor(t) {
        super();
        let n = new Ln([...t.providers, {
            provide: xt,
            useValue: this
        }, {
            provide: rn,
            useValue: this.componentFactoryResolver
        }], t.parent || wo(), t.debugName, new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers()
    }
    destroy() {
        this.injector.destroy()
    }
    onDestroy(t) {
        this.injector.onDestroy(t)
    }
};

function gp(e, t, n = null) {
    return new co({
        providers: e,
        parent: t,
        debugName: n,
        runEnvironmentInitializers: !0
    }).injector
}
var zI = (() => {
    class e {
        _injector;
        cachedInjectors = new Map;
        constructor(n) {
            this._injector = n
        }
        getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n)) {
                let r = uc(!1, n.type),
                    o = r.length > 0 ? gp([r], this._injector, `Standalone[${n.type.name}]`) : null;
                this.cachedInjectors.set(n, o)
            }
            return this.cachedInjectors.get(n)
        }
        ngOnDestroy() {
            try {
                for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
            } finally {
                this.cachedInjectors.clear()
            }
        }
        static \u0275prov = P({
            token: e,
            providedIn: "environment",
            factory: () => new e(ye(Be))
        })
    }
    return e
})();

function CS(e) {
    return zn(() => {
        let t = mp(e),
            n = de(ue({}, t), {
                decls: e.decls,
                vars: e.vars,
                template: e.template,
                consts: e.consts || null,
                ngContentSelectors: e.ngContentSelectors,
                onPush: e.changeDetection === Qd.OnPush,
                directiveDefs: null,
                pipeDefs: null,
                dependencies: t.standalone && e.dependencies || null,
                getStandaloneInjector: t.standalone ? o => o.get(zI).getOrCreateStandaloneInjector(n) : null,
                getExternalStyles: null,
                signals: e.signals ?? !1,
                data: e.data || {},
                encapsulation: e.encapsulation || Bn.Emulated,
                styles: e.styles || K,
                _: null,
                schemas: e.schemas || null,
                tView: null,
                id: ""
            });
        t.standalone && Pe("NgStandalone"), yp(n);
        let r = e.dependencies;
        return n.directiveDefs = Iu(r, !1), n.pipeDefs = Iu(r, !0), n.id = YI(n), n
    })
}

function GI(e) {
    return Ae(e) || bo(e)
}

function QI(e) {
    return e !== null
}

function ZI(e) {
    return zn(() => ({
        type: e.type,
        bootstrap: e.bootstrap || K,
        declarations: e.declarations || K,
        imports: e.imports || K,
        exports: e.exports || K,
        transitiveCompileScopes: null,
        schemas: e.schemas || null,
        id: e.id || null
    }))
}

function vu(e, t) {
    if (e == null) return He;
    let n = {};
    for (let r in e)
        if (e.hasOwnProperty(r)) {
            let o = e[r],
                i, s, a = at.None;
            Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ?? i) : (i = o, s = o), t ? (n[i] = a !== at.None ? [r, a] : r, t[i] = s) : n[i] = r
        } return n
}

function MS(e) {
    return zn(() => {
        let t = mp(e);
        return yp(t), t
    })
}

function _S(e) {
    return {
        type: e.type,
        name: e.name,
        factory: null,
        pure: e.pure !== !1,
        standalone: e.standalone ?? !0,
        onDestroy: e.type.prototype.ngOnDestroy || null
    }
}

function mp(e) {
    let t = {};
    return {
        type: e.type,
        providersResolver: null,
        factory: null,
        hostBindings: e.hostBindings || null,
        hostVars: e.hostVars || 0,
        hostAttrs: e.hostAttrs || null,
        contentQueries: e.contentQueries || null,
        declaredInputs: t,
        inputTransforms: null,
        inputConfig: e.inputs || He,
        exportAs: e.exportAs || null,
        standalone: e.standalone ?? !0,
        signals: e.signals === !0,
        selectors: e.selectors || K,
        viewQuery: e.viewQuery || null,
        features: e.features || null,
        setInput: null,
        findHostDirectiveDefs: null,
        hostDirectives: null,
        inputs: vu(e.inputs, t),
        outputs: vu(e.outputs),
        debugInfo: null
    }
}

function yp(e) {
    e.features?.forEach(t => t(e))
}

function Iu(e, t) {
    if (!e) return null;
    let n = t ? lc : GI;
    return () => (typeof e == "function" ? e() : e).map(r => n(r)).filter(QI)
}

function YI(e) {
    let t = 0,
        n = typeof e.consts == "function" ? "" : e.consts,
        r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t
}

function JI(e) {
    return Object.getPrototypeOf(e.prototype).constructor
}

function KI(e) {
    let t = JI(e.type),
        n = !0,
        r = [e];
    for (; t;) {
        let o;
        if (qe(e)) o = t.\u0275cmp || t.\u0275dir;
        else {
            if (t.\u0275cmp) throw new C(903, !1);
            o = t.\u0275dir
        }
        if (o) {
            if (n) {
                r.push(o);
                let s = e;
                s.inputs = xr(e.inputs), s.inputTransforms = xr(e.inputTransforms), s.declaredInputs = xr(e.declaredInputs), s.outputs = xr(e.outputs);
                let a = o.hostBindings;
                a && rE(e, a);
                let c = o.viewQuery,
                    l = o.contentQueries;
                if (c && tE(e, c), l && nE(e, l), XI(e, o), ug(e.outputs, o.outputs), qe(o) && o.data.animation) {
                    let u = e.data;
                    u.animation = (u.animation || []).concat(o.data.animation)
                }
            }
            let i = o.features;
            if (i)
                for (let s = 0; s < i.length; s++) {
                    let a = i[s];
                    a && a.ngInherit && a(e), a === KI && (n = !1)
                }
        }
        t = Object.getPrototypeOf(t)
    }
    eE(r)
}

function XI(e, t) {
    for (let n in t.inputs) {
        if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
        let r = t.inputs[n];
        if (r !== void 0 && (e.inputs[n] = r, e.declaredInputs[n] = t.declaredInputs[n], t.inputTransforms !== null)) {
            let o = Array.isArray(r) ? r[0] : r;
            if (!t.inputTransforms.hasOwnProperty(o)) continue;
            e.inputTransforms ??= {}, e.inputTransforms[o] = t.inputTransforms[o]
        }
    }
}

function eE(e) {
    let t = 0,
        n = null;
    for (let r = e.length - 1; r >= 0; r--) {
        let o = e[r];
        o.hostVars = t += o.hostVars, o.hostAttrs = jn(o.hostAttrs, n = jn(n, o.hostAttrs))
    }
}

function xr(e) {
    return e === He ? {} : e === K ? [] : e
}

function tE(e, t) {
    let n = e.viewQuery;
    n ? e.viewQuery = (r, o) => {
        t(r, o), n(r, o)
    } : e.viewQuery = t
}

function nE(e, t) {
    let n = e.contentQueries;
    n ? e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i)
    } : e.contentQueries = t
}

function rE(e, t) {
    let n = e.hostBindings;
    n ? e.hostBindings = (r, o) => {
        t(r, o), n(r, o)
    } : e.hostBindings = t
}

function NS(e) {
    let t = n => {
        let r = Array.isArray(e);
        n.hostDirectives === null ? (n.findHostDirectiveDefs = vp, n.hostDirectives = r ? e.map(Oa) : [e]) : r ? n.hostDirectives.unshift(...e.map(Oa)) : n.hostDirectives.unshift(e)
    };
    return t.ngInherit = !0, t
}

function vp(e, t, n) {
    if (e.hostDirectives !== null)
        for (let r of e.hostDirectives)
            if (typeof r == "function") {
                let o = r();
                for (let i of o) Eu(Oa(i), t, n)
            } else Eu(r, t, n)
}

function Eu(e, t, n) {
    let r = bo(e.directive);
    oE(r.declaredInputs, e.inputs), vp(r, t, n), n.set(r, e), t.push(r)
}

function Oa(e) {
    return typeof e == "function" ? {
        directive: W(e),
        inputs: He,
        outputs: He
    } : {
        directive: W(e.directive),
        inputs: bu(e.inputs),
        outputs: bu(e.outputs)
    }
}

function bu(e) {
    if (e === void 0 || e.length === 0) return He;
    let t = {};
    for (let n = 0; n < e.length; n += 2) t[e[n]] = e[n + 1];
    return t
}

function oE(e, t) {
    for (let n in t)
        if (t.hasOwnProperty(n)) {
            let r = t[n],
                o = e[n];
            e[r] = o
        }
}

function xS(e) {
    let t = e.inputConfig,
        n = {};
    for (let r in t)
        if (t.hasOwnProperty(r)) {
            let o = t[r];
            Array.isArray(o) && o[3] && (n[r] = o[3])
        } e.inputTransforms = n
}

function Ip(e) {
    return Jc(e) ? Array.isArray(e) || !(e instanceof Map) && Symbol.iterator in e : !1
}

function iE(e, t) {
    if (Array.isArray(e))
        for (let n = 0; n < e.length; n++) t(e[n]);
    else {
        let n = e[Symbol.iterator](),
            r;
        for (; !(r = n.next()).done;) t(r.value)
    }
}

function Jc(e) {
    return e !== null && (typeof e == "function" || typeof e == "object")
}

function qo(e, t, n) {
    return e[t] = n
}

function sE(e, t) {
    return e[t]
}

function le(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? !1 : (e[t] = n, !0)
}

function Un(e, t, n, r) {
    let o = le(e, t, n);
    return le(e, t + 1, r) || o
}

function Ep(e, t, n, r, o) {
    let i = Un(e, t, n, r);
    return le(e, t + 2, o) || i
}

function aE(e, t, n, r, o, i) {
    let s = Un(e, t, n, r);
    return Un(e, t + 2, o, i) || s
}

function cE(e) {
    return (e.flags & 32) === 32
}

function lE(e, t, n, r, o, i, s, a, c) {
    let l = t.consts,
        u = pn(t, e, 4, s || null, a || null);
    Wc(t, n, u, Me(l, c)), xo(t, u);
    let d = u.tView = qc(2, u, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, l, null);
    return t.queries !== null && (t.queries.template(t, u), d.queries = t.queries.embeddedTView(u)), u
}

function qn(e, t, n, r, o, i, s, a, c, l) {
    let u = n + O,
        d = t.firstCreatePass ? lE(u, t, e, r, o, i, s, a, c) : t.data[u];
    ke(d, !1);
    let p = dE(t, e, d, n);
    Jn() && Po(t, e, p, d), st(p, e);
    let f = Uf(p, e, p, d);
    return e[u] = f, jo(e, f), cp(f, d, e), _o(d) && $c(t, e, d), c != null && Uc(e, d, l), d
}

function uE(e, t, n, r, o, i, s, a) {
    let c = y(),
        l = A(),
        u = Me(l.consts, i);
    return qn(c, l, e, t, n, r, o, u, s, a), uE
}
var dE = fE;

function fE(e, t, n, r) {
    return Kn(!0), t[R].createComment("")
}

function pE(e, t) {
    let n = t.get(mE),
        r = () => n.remove(e);
    return n.add(e), r
}
var hE = () => typeof requestIdleCallback < "u" ? requestIdleCallback : setTimeout,
    gE = () => typeof requestIdleCallback < "u" ? cancelIdleCallback : clearTimeout,
    mE = (() => {
        class e {
            executingCallbacks = !1;
            idleId = null;
            current = new Set;
            deferred = new Set;
            ngZone = D(X);
            requestIdleCallbackFn = hE().bind(globalThis);
            cancelIdleCallbackFn = gE().bind(globalThis);
            add(n) {
                (this.executingCallbacks ? this.deferred : this.current).add(n), this.idleId === null && this.scheduleIdleCallback()
            }
            remove(n) {
                let {
                    current: r,
                    deferred: o
                } = this;
                r.delete(n), o.delete(n), r.size === 0 && o.size === 0 && this.cancelIdleCallback()
            }
            scheduleIdleCallback() {
                let n = () => {
                    this.cancelIdleCallback(), this.executingCallbacks = !0;
                    for (let r of this.current) r();
                    if (this.current.clear(), this.executingCallbacks = !1, this.deferred.size > 0) {
                        for (let r of this.deferred) this.current.add(r);
                        this.deferred.clear(), this.scheduleIdleCallback()
                    }
                };
                this.idleId = this.requestIdleCallbackFn(() => this.ngZone.run(n))
            }
            cancelIdleCallback() {
                this.idleId !== null && (this.cancelIdleCallbackFn(this.idleId), this.idleId = null)
            }
            ngOnDestroy() {
                this.cancelIdleCallback(), this.current.clear(), this.deferred.clear()
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })();

function yE(e, t, n) {
    let r = n.get(vE),
        o = () => r.remove(t);
    return r.add(e, t), o
}
var vE = (() => {
        class e {
            executingCallbacks = !1;
            timeoutId = null;
            invokeTimerAt = null;
            current = [];
            deferred = [];
            add(n, r) {
                let o = this.executingCallbacks ? this.deferred : this.current;
                this.addToQueue(o, Date.now() + n, r), this.scheduleTimer()
            }
            remove(n) {
                let {
                    current: r,
                    deferred: o
                } = this;
                this.removeFromQueue(r, n) === -1 && this.removeFromQueue(o, n), r.length === 0 && o.length === 0 && this.clearTimeout()
            }
            addToQueue(n, r, o) {
                let i = n.length;
                for (let s = 0; s < n.length; s += 2)
                    if (n[s] > r) {
                        i = s;
                        break
                    } Ju(n, i, r, o)
            }
            removeFromQueue(n, r) {
                let o = -1;
                for (let i = 0; i < n.length; i += 2)
                    if (n[i + 1] === r) {
                        o = i;
                        break
                    } return o > -1 && ql(n, o, 2), o
            }
            scheduleTimer() {
                let n = () => {
                    this.clearTimeout(), this.executingCallbacks = !0;
                    let o = [...this.current],
                        i = Date.now();
                    for (let a = 0; a < o.length; a += 2) {
                        let c = o[a],
                            l = o[a + 1];
                        if (c <= i) l();
                        else break
                    }
                    let s = -1;
                    for (let a = 0; a < this.current.length && this.current[a] <= i; a += 2) s = a + 1;
                    if (s >= 0 && ql(this.current, 0, s + 1), this.executingCallbacks = !1, this.deferred.length > 0) {
                        for (let a = 0; a < this.deferred.length; a += 2) {
                            let c = this.deferred[a],
                                l = this.deferred[a + 1];
                            this.addToQueue(this.current, c, l)
                        }
                        this.deferred.length = 0
                    }
                    this.scheduleTimer()
                };
                if (this.current.length > 0) {
                    let o = Date.now(),
                        i = this.current[0];
                    if (this.timeoutId === null || this.invokeTimerAt && this.invokeTimerAt - i > 16) {
                        this.clearTimeout();
                        let s = Math.max(i - o, 16);
                        this.invokeTimerAt = i, this.timeoutId = setTimeout(n, s)
                    }
                }
            }
            clearTimeout() {
                this.timeoutId !== null && (clearTimeout(this.timeoutId), this.timeoutId = null)
            }
            ngOnDestroy() {
                this.clearTimeout(), this.current.length = 0, this.deferred.length = 0
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    IE = (() => {
        class e {
            cachedInjectors = new Map;
            getOrCreateInjector(n, r, o, i) {
                if (!this.cachedInjectors.has(n)) {
                    let s = o.length > 0 ? gp(o, r, i) : null;
                    this.cachedInjectors.set(n, s)
                }
                return this.cachedInjectors.get(n)
            }
            ngOnDestroy() {
                try {
                    for (let n of this.cachedInjectors.values()) n !== null && n.destroy()
                } finally {
                    this.cachedInjectors.clear()
                }
            }
            static \u0275prov = P({
                token: e,
                providedIn: "environment",
                factory: () => new e
            })
        }
        return e
    })();
var EE = new T("");

function _s(e, t, n) {
    return e.get(IE).getOrCreateInjector(t, e, n, "")
}

function bE(e, t, n) {
    if (e instanceof Yt) {
        let o = e.injector,
            i = e.parentInjector,
            s = _s(i, t, n);
        return new Yt(o, s)
    }
    let r = e.get(Be);
    if (r !== e) {
        let o = _s(r, t, n);
        return new Yt(e, o)
    }
    return _s(e, t, n)
}

function nt(e, t, n, r = !1) {
    let o = n[z],
        i = o[v];
    if (Zg(o)) return;
    let s = Xn(o, t),
        a = s[Tc],
        c = s[dy];
    if (!(c !== null && e < c) && Du(a, e) && Du(s[Jt] ?? -1, e)) {
        let l = fn(i, t),
            d = !r && !0 && (lf(l) !== null || oa(l, L.Loading) !== null || oa(l, L.Placeholder)) ? Pa : bp;
        try {
            d(e, s, n, t, o)
        } catch (p) {
            Ho(o, p)
        }
    }
}

function wE(e, t) {
    return e[Wr]?.find(n => n.data[Xd] === t[Tc]) ?? null
}

function bp(e, t, n, r, o) {
    let i = gy(e, o, r);
    if (i !== null) {
        t[Tc] = e;
        let s = o[v],
            a = i + O,
            c = Qn(s, a),
            l = 0;
        Qc(n, l);
        let u;
        if (e === L.Complete) {
            let f = fn(s, r),
                h = f.providers;
            h && h.length > 0 && (u = bE(o[ge], f, h))
        }
        let d = wE(n, t);
        n[Wr] = null;
        let p = gn(o, c, null, {
            injector: u,
            dehydratedView: d
        });
        if (mn(n, p, l, Mt(c, d)), $o(p, 2), (e === L.Complete || e === L.Error) && Array.isArray(t[Ds])) {
            for (let f of t[Ds]) f();
            t[Ds] = null
        }
    }
}

function DE(e, t, n, r, o) {
    let i = Date.now(),
        s = o[v],
        a = fn(s, r);
    if (t[Rn] === null || t[Rn] <= i) {
        t[Rn] = null;
        let c = lf(a),
            l = t[Cr] !== null;
        if (e === L.Loading && c !== null && !l) {
            t[Jt] = e;
            let u = wu(c, t, r, n, o);
            t[Cr] = u
        } else {
            e > L.Loading && l && (t[Cr](), t[Cr] = null, t[Jt] = null), bp(e, t, n, r, o);
            let u = oa(a, e);
            u !== null && (t[Rn] = i + u, wu(u, t, r, n, o))
        }
    } else t[Jt] = e
}

function wu(e, t, n, r, o) {
    return yE(e, () => {
        let s = t[Jt];
        t[Rn] = null, t[Jt] = null, s !== null && nt(s, n, r)
    }, o[ge])
}

function Du(e, t) {
    return e < t
}

function CE(e, t) {
    let n = e[t.index];
    nt(L.Placeholder, t, n)
}

function Cu(e, t, n) {
    e.loadingPromise.then(() => {
        e.loadingState === se.COMPLETE ? nt(L.Complete, t, n) : e.loadingState === se.FAILED && nt(L.Error, t, n)
    })
}
var Pa = null;

function TS(e, t, n, r) {
    let o = e.consts;
    n != null && (t.placeholderBlockConfig = Me(o, n)), r != null && (t.loadingBlockConfig = Me(o, r)), Pa === null && (Pa = DE)
}
var SS = (() => {
    class e {
        log(n) {
            console.log(n)
        }
        warn(n) {
            console.warn(n)
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = P({
            token: e,
            factory: e.\u0275fac,
            providedIn: "platform"
        })
    }
    return e
})();
var ME = new T(""),
    _E = new T(""),
    RS = (() => {
        class e {
            _ngZone;
            registry;
            _isZoneStable = !0;
            _callbacks = [];
            taskTrackingZone = null;
            constructor(n, r, o) {
                this._ngZone = n, this.registry = r, Kc || (xE(o), o.addToWindow(r)), this._watchAngularEvents(), n.run(() => {
                    this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone")
                })
            }
            _watchAngularEvents() {
                this._ngZone.onUnstable.subscribe({
                    next: () => {
                        this._isZoneStable = !1
                    }
                }), this._ngZone.runOutsideAngular(() => {
                    this._ngZone.onStable.subscribe({
                        next: () => {
                            X.assertNotInAngularZone(), queueMicrotask(() => {
                                this._isZoneStable = !0, this._runCallbacksIfReady()
                            })
                        }
                    })
                })
            }
            isStable() {
                return this._isZoneStable && !this._ngZone.hasPendingMacrotasks
            }
            _runCallbacksIfReady() {
                if (this.isStable()) queueMicrotask(() => {
                    for (; this._callbacks.length !== 0;) {
                        let n = this._callbacks.pop();
                        clearTimeout(n.timeoutId), n.doneCb()
                    }
                });
                else {
                    let n = this.getPendingTasks();
                    this._callbacks = this._callbacks.filter(r => r.updateCb && r.updateCb(n) ? (clearTimeout(r.timeoutId), !1) : !0)
                }
            }
            getPendingTasks() {
                return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(n => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data
                })) : []
            }
            addCallback(n, r, o) {
                let i = -1;
                r && r > 0 && (i = setTimeout(() => {
                    this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n()
                }, r)), this._callbacks.push({
                    doneCb: n,
                    timeoutId: i,
                    updateCb: o
                })
            }
            whenStable(n, r, o) {
                if (o && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
                this.addCallback(n, r, o), this._runCallbacksIfReady()
            }
            registerApplication(n) {
                this.registry.registerApplication(n, this)
            }
            unregisterApplication(n) {
                this.registry.unregisterApplication(n)
            }
            findProviders(n, r, o) {
                return []
            }
            static \u0275fac = function(r) {
                return new(r || e)(ye(X), ye(NE), ye(_E))
            };
            static \u0275prov = P({
                token: e,
                factory: e.\u0275fac
            })
        }
        return e
    })(),
    NE = (() => {
        class e {
            _applications = new Map;
            registerApplication(n, r) {
                this._applications.set(n, r)
            }
            unregisterApplication(n) {
                this._applications.delete(n)
            }
            unregisterAllApplications() {
                this._applications.clear()
            }
            getTestability(n) {
                return this._applications.get(n) || null
            }
            getAllTestabilities() {
                return Array.from(this._applications.values())
            }
            getAllRootElements() {
                return Array.from(this._applications.keys())
            }
            findTestabilityInTree(n, r = !0) {
                return Kc?.findTestabilityInTree(this, n, r) ?? null
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = P({
                token: e,
                factory: e.\u0275fac,
                providedIn: "platform"
            })
        }
        return e
    })();

function xE(e) {
    Kc = e
}
var Kc;

function wp(e) {
    return !!e && typeof e.then == "function"
}

function TE(e) {
    return !!e && typeof e.subscribe == "function"
}
var SE = new T("");
var Dp = (() => {
        class e {
            resolve;
            reject;
            initialized = !1;
            done = !1;
            donePromise = new Promise((n, r) => {
                this.resolve = n, this.reject = r
            });
            appInits = D(SE, {
                optional: !0
            }) ?? [];
            injector = D(We);
            constructor() {}
            runInitializers() {
                if (this.initialized) return;
                let n = [];
                for (let o of this.appInits) {
                    let i = id(this.injector, o);
                    if (wp(i)) n.push(i);
                    else if (TE(i)) {
                        let s = new Promise((a, c) => {
                            i.subscribe({
                                complete: a,
                                error: c
                            })
                        });
                        n.push(s)
                    }
                }
                let r = () => {
                    this.done = !0, this.resolve()
                };
                Promise.all(n).then(() => {
                    r()
                }).catch(o => {
                    this.reject(o)
                }), n.length === 0 && r(), this.initialized = !0
            }
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = P({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })(),
    Cp = (() => {
        class e {
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new lo
            })
        }
        return e
    })(),
    lo = class {
        queuedEffectCount = 0;
        queues = new Map;
        schedule(t) {
            this.enqueue(t)
        }
        enqueue(t) {
            let n = t.zone;
            this.queues.has(n) || this.queues.set(n, new Set);
            let r = this.queues.get(n);
            r.has(t) || (this.queuedEffectCount++, r.add(t))
        }
        flush() {
            for (; this.queuedEffectCount > 0;)
                for (let [t, n] of this.queues) t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n))
        }
        flushQueue(t) {
            for (let n of t) t.delete(n), this.queuedEffectCount--, n.run()
        }
    },
    RE = new T("");

function AE() {
    kl(() => {
        throw new C(600, !1)
    })
}

function kE(e) {
    return e.isBoundToModule
}
var OE = 10;

function PE(e, t, n) {
    try {
        let r = n();
        return wp(r) ? r.catch(o => {
            throw t.runOutsideAngular(() => e.handleError(o)), o
        }) : r
    } catch (r) {
        throw t.runOutsideAngular(() => e.handleError(r)), r
    }
}
var on = (() => {
    class e {
        _runningTick = !1;
        _destroyed = !1;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = D(Hm);
        afterRenderManager = D(tf);
        zonelessEnabled = D($d);
        rootEffectScheduler = D(Cp);
        dirtyFlags = 0;
        deferredDirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = new Set;
        afterTick = new Te;
        get allViews() {
            return [...this.externalTestViews.keys(), ...this._views]
        }
        get destroyed() {
            return this._destroyed
        }
        componentTypes = [];
        components = [];
        isStable = D(un).hasPendingTasks.pipe(Y(n => !n));
        constructor() {
            D(So, {
                optional: !0
            })
        }
        whenStable() {
            let n;
            return new Promise(r => {
                n = this.isStable.subscribe({
                    next: o => {
                        o && r()
                    }
                })
            }).finally(() => {
                n.unsubscribe()
            })
        }
        _injector = D(Be);
        _rendererFactory = null;
        get injector() {
            return this._injector
        }
        bootstrap(n, r) {
            let o = n instanceof ro;
            if (!this._injector.get(Dp).done) {
                let p = !o && Lg(n),
                    f = !1;
                throw new C(405, f)
            }
            let s;
            o ? s = n : s = this._injector.get(rn).resolveComponentFactory(n), this.componentTypes.push(s.componentType);
            let a = kE(s) ? void 0 : this._injector.get(xt),
                c = r || s.selector,
                l = s.create(We.NULL, [], c, a),
                u = l.location.nativeElement,
                d = l.injector.get(ME, null);
            return d?.registerApplication(u), l.onDestroy(() => {
                this.detachView(l.hostView), Lr(this.components, l), d?.unregisterApplication(u)
            }), this._loadComponent(l), l
        }
        tick() {
            this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick()
        }
        _tick = () => {
            if (this.tracingSnapshot !== null) {
                let r = this.tracingSnapshot;
                this.tracingSnapshot = null, r.run(xc.CHANGE_DETECTION, this._tick), r.dispose();
                return
            }
            if (this._runningTick) throw new C(101, !1);
            let n = _(null);
            try {
                this._runningTick = !0, this.synchronize()
            } catch (r) {
                this.internalErrorHandler(r)
            } finally {
                this._runningTick = !1, _(n), this.afterTick.next()
            }
        };
        synchronize() {
            this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(oo, null, {
                optional: !0
            })), this.dirtyFlags |= this.deferredDirtyFlags, this.deferredDirtyFlags = 0;
            let n = 0;
            for (; this.dirtyFlags !== 0 && n++ < OE;) this.synchronizeOnce()
        }
        synchronizeOnce() {
            if (this.dirtyFlags |= this.deferredDirtyFlags, this.deferredDirtyFlags = 0, this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()), this.dirtyFlags & 7) {
                let n = !!(this.dirtyFlags & 1);
                this.dirtyFlags &= -8, this.dirtyFlags |= 8;
                for (let {
                        _lView: r,
                        notifyErrorHandler: o
                    }
                    of this.allViews) LE(r, o, n, this.zonelessEnabled);
                if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return
            } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
            this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews()
        }
        syncDirtyFlagsWithViews() {
            if (this.allViews.some(({
                    _lView: n
                }) => No(n))) {
                this.dirtyFlags |= 2;
                return
            } else this.dirtyFlags &= -8
        }
        attachView(n) {
            let r = n;
            this._views.push(r), r.attachToAppRef(this)
        }
        detachView(n) {
            let r = n;
            Lr(this._views, r), r.detachFromAppRef()
        }
        _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(RE, []).forEach(o => o(n))
        }
        ngOnDestroy() {
            if (!this._destroyed) try {
                this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy())
            } finally {
                this._destroyed = !0, this._views = [], this._destroyListeners = []
            }
        }
        onDestroy(n) {
            return this._destroyListeners.push(n), () => Lr(this._destroyListeners, n)
        }
        destroy() {
            if (this._destroyed) throw new C(406, !1);
            let n = this._injector;
            n.destroy && !n.destroyed && n.destroy()
        }
        get viewCount() {
            return this._views.length
        }
        warnIfDestroyed() {}
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = P({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function Lr(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1)
}

function LE(e, t, n, r) {
    if (!n && !No(e)) return;
    Jf(e, t, n && !r ? 0 : 1)
}

function FE(e) {
    let t = y(),
        n = F();
    if (CE(t, n), !Mp(0, t)) return;
    let r = t[ge],
        o = Xn(t, n),
        i = e(() => jE(0, t, n), r);
    sf(0, o, i)
}

function VE(e, t, n) {
    let r = t[ge],
        o = t[v];
    if (e.loadingState !== se.NOT_STARTED) return e.loadingPromise ?? Promise.resolve();
    let i = Xn(t, n),
        s = my(o, e);
    e.loadingState = se.IN_PROGRESS, Pr(1, i);
    let a = e.dependencyResolverFn,
        c = r.get(un),
        l = c.add();
    return a ? (e.loadingPromise = Promise.allSettled(a()).then(u => {
        let d = !1,
            p = [],
            f = [];
        for (let h of u)
            if (h.status === "fulfilled") {
                let m = h.value,
                    M = Ae(m) || bo(m);
                if (M) p.push(M);
                else {
                    let E = lc(m);
                    E && f.push(E)
                }
            } else {
                d = !0;
                break
            } if (e.loadingPromise = null, c.remove(l), d) {
            if (e.loadingState = se.FAILED, e.errorTmplIndex === null) {
                let h = "",
                    m = new C(750, !1);
                Ho(t, m)
            }
        } else {
            e.loadingState = se.COMPLETE;
            let h = s.tView;
            if (p.length > 0) {
                h.directiveRegistry = iu(h.directiveRegistry, p);
                let m = p.map(E => E.type),
                    M = uc(!1, ...m);
                e.providers = M
            }
            f.length > 0 && (h.pipeRegistry = iu(h.pipeRegistry, f))
        }
    }), e.loadingPromise) : (e.loadingPromise = Promise.resolve().then(() => {
        e.loadingPromise = null, e.loadingState = se.COMPLETE, c.remove(l)
    }), e.loadingPromise)
}

function Mp(e, t) {
    return t[ge].get(EE, null, {
        optional: !0
    })?.behavior !== of.Manual
}

function jE(e, t, n) {
    let r = t[v],
        o = t[n.index];
    if (!Mp(e, t)) return;
    let i = Xn(t, n),
        s = fn(r, n);
    switch (af(i), s.loadingState) {
        case se.NOT_STARTED:
            nt(L.Loading, n, o), VE(s, t, n), s.loadingState === se.IN_PROGRESS && Cu(s, n, o);
            break;
        case se.IN_PROGRESS:
            nt(L.Loading, n, o), Cu(s, n, o);
            break;
        case se.COMPLETE:
            nt(L.Complete, n, o);
            break;
        case se.FAILED:
            nt(L.Error, n, o);
            break;
        default:
    }
}

function HE(e, t, n) {
    return e === 0 ? Mu(t, n) : e === 2 ? !Mu(t, n) : !0
}

function Mu(e, t) {
    let n = e[ge],
        r = fn(e[v], t),
        o = Iy(n),
        i = r.flags !== null && (r.flags & 1) === 1,
        a = Xn(e, t)[uy] !== null;
    return !(i && a && o)
}

function AS(e, t, n, r, o, i, s, a, c, l) {
    let u = y(),
        d = A(),
        p = e + O,
        f = qn(u, d, e, null, 0, 0),
        h = u[ge];
    if (d.firstCreatePass) {
        Pe("NgDefer");
        let $ = {
            primaryTmplIndex: t,
            loadingTmplIndex: r ?? null,
            placeholderTmplIndex: o ?? null,
            errorTmplIndex: i ?? null,
            placeholderBlockConfig: null,
            loadingBlockConfig: null,
            dependencyResolverFn: n ?? null,
            loadingState: se.NOT_STARTED,
            loadingPromise: null,
            providers: null,
            hydrateTriggers: null,
            prefetchTriggers: null,
            flags: l ?? 0
        };
        c?.(d, $, a, s), hy(d, p, $)
    }
    let m = u[p];
    cp(m, f, u);
    let M = null,
        E = null;
    if (m[Wr]?.length > 0) {
        let $ = m[Wr][0].data;
        E = $[Xm] ?? null, M = $[Xd]
    }
    let S = [null, rf.Initial, null, null, null, null, E, M, null, null];
    py(u, p, S);
    let B = null;
    E !== null && (B = h.get(yy), B.add(E, {
        lView: u,
        tNode: f,
        lContainer: m
    }));
    let V = () => {
        af(S), E !== null && B?.cleanup([E])
    };
    sf(0, S, () => gd(u, V)), yc(u, V)
}

function kS() {
    let e = y(),
        t = F();
    HE(0, e, t) && FE(pE)
}

function BE(e, t, n, r) {
    let o = y(),
        i = lt();
    if (le(o, i, t)) {
        let s = A(),
            a = St();
        Lv(a, o, e, t, n, r)
    }
    return BE
}

function Xc(e, t, n, r) {
    return le(e, lt(), n) ? t + ae(n) + r : H
}

function _p(e, t, n, r, o, i) {
    let s = Ec(),
        a = Un(e, s, n, o);
    return Yn(2), a ? t + ae(n) + r + ae(o) + i : H
}

function $E(e, t, n, r, o, i, s, a) {
    let c = Ec(),
        l = Ep(e, c, n, o, s);
    return Yn(3), l ? t + ae(n) + r + ae(o) + i + ae(s) + a : H
}

function UE(e, t, n, r, o, i, s, a, c, l) {
    let u = Ec(),
        d = aE(e, u, n, o, s, c);
    return Yn(4), d ? t + ae(n) + r + ae(o) + i + ae(s) + a + ae(c) + l : H
}

function Tr(e, t) {
    return e << 17 | t << 2
}

function Tt(e) {
    return e >> 17 & 32767
}

function qE(e) {
    return (e & 2) == 2
}

function WE(e, t) {
    return e & 131071 | t << 17
}

function La(e) {
    return e | 2
}

function sn(e) {
    return (e & 131068) >> 2
}

function Ns(e, t) {
    return e & -131069 | t << 2
}

function zE(e) {
    return (e & 1) === 1
}

function Fa(e) {
    return e | 1
}

function GE(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings,
        a = Tt(s),
        c = sn(s);
    e[r] = n;
    let l = !1,
        u;
    if (Array.isArray(n)) {
        let d = n;
        u = d[1], (u === null || Gn(d, u) > 0) && (l = !0)
    } else u = n;
    if (o)
        if (c !== 0) {
            let p = Tt(e[a + 1]);
            e[r + 1] = Tr(p, a), p !== 0 && (e[p + 1] = Ns(e[p + 1], r)), e[a + 1] = WE(e[a + 1], r)
        } else e[r + 1] = Tr(a, 0), a !== 0 && (e[a + 1] = Ns(e[a + 1], r)), a = r;
    else e[r + 1] = Tr(c, 0), a === 0 ? a = r : e[c + 1] = Ns(e[c + 1], r), c = r;
    l && (e[r + 1] = La(e[r + 1])), _u(e, u, r, !0), _u(e, u, r, !1), QE(t, u, e, r, i), s = Tr(a, c), i ? t.classBindings = s : t.styleBindings = s
}

function QE(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && Gn(i, t) >= 0 && (n[r + 1] = Fa(n[r + 1]))
}

function _u(e, t, n, r) {
    let o = e[n + 1],
        i = t === null,
        s = r ? Tt(o) : sn(o),
        a = !1;
    for (; s !== 0 && (a === !1 || i);) {
        let c = e[s],
            l = e[s + 1];
        ZE(c, t) && (a = !0, e[s + 1] = r ? Fa(l) : La(l)), s = r ? Tt(l) : sn(l)
    }
    a && (e[n + 1] = r ? La(o) : Fa(o))
}

function ZE(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? !0 : Array.isArray(e) && typeof t == "string" ? Gn(e, t) >= 0 : !1
}
var we = {
    textEnd: 0,
    key: 0,
    keyEnd: 0,
    value: 0,
    valueEnd: 0
};

function YE(e) {
    return e.substring(we.key, we.keyEnd)
}

function JE(e) {
    return KE(e), Np(e, xp(e, 0, we.textEnd))
}

function Np(e, t) {
    let n = we.textEnd;
    return n === t ? -1 : (t = we.keyEnd = XE(e, we.key = t, n), xp(e, t, n))
}

function KE(e) {
    we.key = 0, we.keyEnd = 0, we.value = 0, we.valueEnd = 0, we.textEnd = e.length
}

function xp(e, t, n) {
    for (; t < n && e.charCodeAt(t) <= 32;) t++;
    return t
}

function XE(e, t, n) {
    for (; t < n && e.charCodeAt(t) > 32;) t++;
    return t
}

function eb(e, t, n) {
    let r = y(),
        o = lt();
    if (le(r, o, t)) {
        let i = A(),
            s = St();
        hn(i, s, r, e, t, r[R], n, !1)
    }
    return eb
}

function Va(e, t, n, r, o) {
    let i = t.inputs,
        s = o ? "class" : "style";
    zc(e, n, i[s], s, r)
}

function tb(e, t, n) {
    return Sp(e, t, n, !1), tb
}

function nb(e, t) {
    return Sp(e, t, null, !0), nb
}

function OS(e) {
    Rp(cb, Tp, e, !0)
}

function Tp(e, t) {
    for (let n = JE(t); n >= 0; n = Np(t, n)) Eo(e, YE(t), !0)
}

function Sp(e, t, n, r) {
    let o = y(),
        i = A(),
        s = Yn(2);
    if (i.firstUpdatePass && kp(i, e, s, r), t !== H && le(o, s, t)) {
        let a = i.data[_e()];
        Op(i, a, o, o[R], e, o[s + 1] = ub(t, n), r, s)
    }
}

function Rp(e, t, n, r) {
    let o = A(),
        i = Yn(2);
    o.firstUpdatePass && kp(o, null, i, r);
    let s = y();
    if (n !== H && le(s, i, n)) {
        let a = o.data[_e()];
        if (Pp(a, r) && !Ap(o, i)) {
            let c = r ? a.classesWithoutHost : a.stylesWithoutHost;
            c !== null && (n = Os(c, n || "")), Va(o, a, s, n, r)
        } else lb(o, a, s, s[R], s[i + 1], s[i + 1] = ab(e, t, n), r, i)
    }
}

function Ap(e, t) {
    return t >= e.expandoStartIndex
}

function kp(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
        let i = o[_e()],
            s = Ap(e, n);
        Pp(i, r) && t === null && !s && (t = !1), t = rb(o, i, t, r), GE(o, i, t, n, s, r)
    }
}

function rb(e, t, n, r) {
    let o = bd(e),
        i = r ? t.residualClasses : t.residualStyles;
    if (o === null)(r ? t.classBindings : t.styleBindings) === 0 && (n = xs(null, e, t, n, r), n = Wn(n, t.attrs, r), i = null);
    else {
        let s = t.directiveStylingLast;
        if (s === -1 || e[s] !== o)
            if (n = xs(o, e, t, n, r), i === null) {
                let c = ob(e, t, r);
                c !== void 0 && Array.isArray(c) && (c = xs(null, e, t, c[1], r), c = Wn(c, t.attrs, r), ib(e, t, r, c))
            } else i = sb(e, t, r)
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i), n
}

function ob(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (sn(r) !== 0) return e[Tt(r)]
}

function ib(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[Tt(o)] = r
}

function sb(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
        let s = e[i].hostAttrs;
        r = Wn(r, s, n)
    }
    return Wn(r, t.attrs, n)
}

function xs(e, t, n, r, o) {
    let i = null,
        s = n.directiveEnd,
        a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], r = Wn(r, i.hostAttrs, o), i !== e);) a++;
    return e !== null && (n.directiveStylingLast = a), r
}

function Wn(e, t, n) {
    let r = n ? 1 : 2,
        o = -1;
    if (t !== null)
        for (let i = 0; i < t.length; i++) {
            let s = t[i];
            typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), Eo(e, s, n ? !0 : t[++i]))
        }
    return e === void 0 ? null : e
}

function ab(e, t, n) {
    if (n == null || n === "") return K;
    let r = [],
        o = er(n);
    if (Array.isArray(o))
        for (let i = 0; i < o.length; i++) e(r, o[i], !0);
    else if (typeof o == "object")
        for (let i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
    else typeof o == "string" && t(r, o);
    return r
}

function cb(e, t, n) {
    let r = String(t);
    r !== "" && !r.includes(" ") && Eo(e, r, n)
}

function lb(e, t, n, r, o, i, s, a) {
    o === H && (o = K);
    let c = 0,
        l = 0,
        u = 0 < o.length ? o[0] : null,
        d = 0 < i.length ? i[0] : null;
    for (; u !== null || d !== null;) {
        let p = c < o.length ? o[c + 1] : void 0,
            f = l < i.length ? i[l + 1] : void 0,
            h = null,
            m;
        u === d ? (c += 2, l += 2, p !== f && (h = d, m = f)) : d === null || u !== null && u < d ? (c += 2, h = u) : (l += 2, h = d, m = f), h !== null && Op(e, t, n, r, h, m, s, a), u = c < o.length ? o[c] : null, d = l < i.length ? i[l] : null
    }
}

function Op(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let c = e.data,
        l = c[a + 1],
        u = zE(l) ? Nu(c, t, n, o, sn(l), s) : void 0;
    if (!uo(u)) {
        uo(i) || qE(l) && (i = Nu(c, null, n, o, a, s));
        let d = pd(_e(), n);
        nv(r, s, d, o, i)
    }
}

function Nu(e, t, n, r, o, i) {
    let s = t === null,
        a;
    for (; o > 0;) {
        let c = e[o],
            l = Array.isArray(c),
            u = l ? c[1] : c,
            d = u === null,
            p = n[o + 1];
        p === H && (p = d ? K : void 0);
        let f = d ? vs(p, r) : u === r ? p : void 0;
        if (l && !uo(f) && (f = vs(c, r)), uo(f) && (a = f, s)) return a;
        let h = e[o + 1];
        o = s ? Tt(h) : sn(h)
    }
    if (t !== null) {
        let c = i ? t.residualClasses : t.residualStyles;
        c != null && (a = vs(c, r))
    }
    return a
}

function uo(e) {
    return e !== void 0
}

function ub(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = pe(er(e)))), e
}

function Pp(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0
}

function PS(e, t, n) {
    let r = y(),
        o = Xc(r, e, t, n);
    Rp(Eo, Tp, o, !0)
}
var ja = class {
    destroy(t) {}
    updateValue(t, n) {}
    swap(t, n) {
        let r = Math.min(t, n),
            o = Math.max(t, n),
            i = this.detach(o);
        if (o - r > 1) {
            let s = this.detach(r);
            this.attach(r, i), this.attach(o, s)
        } else this.attach(r, i)
    }
    move(t, n) {
        this.attach(n, this.detach(t))
    }
};

function Ts(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0
}

function db(e, t, n) {
    let r, o, i = 0,
        s = e.length - 1,
        a = void 0;
    if (Array.isArray(t)) {
        let c = t.length - 1;
        for (; i <= s && i <= c;) {
            let l = e.at(i),
                u = t[i],
                d = Ts(i, l, i, u, n);
            if (d !== 0) {
                d < 0 && e.updateValue(i, u), i++;
                continue
            }
            let p = e.at(s),
                f = t[c],
                h = Ts(s, p, c, f, n);
            if (h !== 0) {
                h < 0 && e.updateValue(s, f), s--, c--;
                continue
            }
            let m = n(i, l),
                M = n(s, p),
                E = n(i, u);
            if (Object.is(E, M)) {
                let S = n(c, f);
                Object.is(S, m) ? (e.swap(i, s), e.updateValue(s, f), c--, s--) : e.move(s, i), e.updateValue(i, u), i++;
                continue
            }
            if (r ??= new fo, o ??= Tu(e, i, s, n), Ha(e, r, i, E)) e.updateValue(i, u), i++, s++;
            else if (o.has(E)) r.set(m, e.detach(i)), s--;
            else {
                let S = e.create(i, t[i]);
                e.attach(i, S), i++, s++
            }
        }
        for (; i <= c;) xu(e, r, n, i, t[i]), i++
    } else if (t != null) {
        let c = t[Symbol.iterator](),
            l = c.next();
        for (; !l.done && i <= s;) {
            let u = e.at(i),
                d = l.value,
                p = Ts(i, u, i, d, n);
            if (p !== 0) p < 0 && e.updateValue(i, d), i++, l = c.next();
            else {
                r ??= new fo, o ??= Tu(e, i, s, n);
                let f = n(i, d);
                if (Ha(e, r, i, f)) e.updateValue(i, d), i++, s++, l = c.next();
                else if (!o.has(f)) e.attach(i, e.create(i, d)), i++, s++, l = c.next();
                else {
                    let h = n(i, u);
                    r.set(h, e.detach(i)), s--
                }
            }
        }
        for (; !l.done;) xu(e, r, n, e.length, l.value), l = c.next()
    }
    for (; i <= s;) e.destroy(e.detach(s--));
    r?.forEach(c => {
        e.destroy(c)
    })
}

function Ha(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), !0) : !1
}

function xu(e, t, n, r, o) {
    if (Ha(e, t, r, n(r, o))) e.updateValue(r, o);
    else {
        let i = e.create(r, o);
        e.attach(r, i)
    }
}

function Tu(e, t, n, r) {
    let o = new Set;
    for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
    return o
}
var fo = class {
    kvMap = new Map;
    _vMap = void 0;
    has(t) {
        return this.kvMap.has(t)
    }
    delete(t) {
        if (!this.has(t)) return !1;
        let n = this.kvMap.get(t);
        return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), !0
    }
    get(t) {
        return this.kvMap.get(t)
    }
    set(t, n) {
        if (this.kvMap.has(t)) {
            let r = this.kvMap.get(t);
            this._vMap === void 0 && (this._vMap = new Map);
            let o = this._vMap;
            for (; o.has(r);) r = o.get(r);
            o.set(r, n)
        } else this.kvMap.set(t, n)
    }
    forEach(t) {
        for (let [n, r] of this.kvMap)
            if (t(r, n), this._vMap !== void 0) {
                let o = this._vMap;
                for (; o.has(r);) r = o.get(r), t(r, n)
            }
    }
};

function LS(e, t) {
    Pe("NgControlFlow");
    let n = y(),
        r = lt(),
        o = n[r] !== H ? n[r] : -1,
        i = o !== -1 ? po(n, O + o) : void 0,
        s = 0;
    if (le(n, r, e)) {
        let a = _(null);
        try {
            if (i !== void 0 && Qc(i, s), e !== -1) {
                let c = O + e,
                    l = po(n, c),
                    u = qa(n[v], c),
                    d = nn(l, u.tView.ssrId),
                    p = gn(n, u, t, {
                        dehydratedView: d
                    });
                mn(l, p, s, Mt(u, d))
            }
        } finally {
            _(a)
        }
    } else if (i !== void 0) {
        let a = Gf(i, s);
        a !== void 0 && (a[G] = t)
    }
}
var Ba = class {
    lContainer;
    $implicit;
    $index;
    constructor(t, n, r) {
        this.lContainer = t, this.$implicit = n, this.$index = r
    }
    get $count() {
        return this.lContainer.length - Q
    }
};

function FS(e) {
    return e
}
var $a = class {
    hasEmptyBlock;
    trackByFn;
    liveCollection;
    constructor(t, n, r) {
        this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = r
    }
};

function VS(e, t, n, r, o, i, s, a, c, l, u, d, p) {
    Pe("NgControlFlow");
    let f = y(),
        h = A(),
        m = c !== void 0,
        M = y(),
        E = a ? s.bind(M[ce][G]) : s,
        S = new $a(m, E);
    M[O + e] = S, qn(f, h, e + 1, t, n, r, o, Me(h.consts, i)), m && qn(f, h, e + 2, c, l, u, d, Me(h.consts, p))
}
var Ua = class extends ja {
    lContainer;
    hostLView;
    templateTNode;
    operationsCounter = void 0;
    needsIndexUpdate = !1;
    constructor(t, n, r) {
        super(), this.lContainer = t, this.hostLView = n, this.templateTNode = r
    }
    get length() {
        return this.lContainer.length - Q
    }
    at(t) {
        return this.getLView(t)[G].$implicit
    }
    attach(t, n) {
        let r = n[Xt];
        this.needsIndexUpdate ||= t !== this.length, mn(this.lContainer, n, t, Mt(this.templateTNode, r))
    }
    detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1, fb(this.lContainer, t)
    }
    create(t, n) {
        let r = nn(this.lContainer, this.templateTNode.tView.ssrId),
            o = gn(this.hostLView, this.templateTNode, new Ba(this.lContainer, n, t), {
                dehydratedView: r
            });
        return this.operationsCounter?.recordCreate(), o
    }
    destroy(t) {
        Oo(t[v], t), this.operationsCounter?.recordDestroy()
    }
    updateValue(t, n) {
        this.getLView(t)[G].$implicit = n
    }
    reset() {
        this.needsIndexUpdate = !1, this.operationsCounter?.reset()
    }
    updateIndexes() {
        if (this.needsIndexUpdate)
            for (let t = 0; t < this.length; t++) this.getLView(t)[G].$index = t
    }
    getLView(t) {
        return pb(this.lContainer, t)
    }
};

function jS(e) {
    let t = _(null),
        n = _e();
    try {
        let r = y(),
            o = r[v],
            i = r[n],
            s = n + 1,
            a = po(r, s);
        if (i.liveCollection === void 0) {
            let l = qa(o, s);
            i.liveCollection = new Ua(a, r, l)
        } else i.liveCollection.reset();
        let c = i.liveCollection;
        if (db(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock) {
            let l = lt(),
                u = c.length === 0;
            if (le(r, l, u)) {
                let d = n + 2,
                    p = po(r, d);
                if (u) {
                    let f = qa(o, d),
                        h = nn(p, f.tView.ssrId),
                        m = gn(r, f, void 0, {
                            dehydratedView: h
                        });
                    mn(p, m, 0, Mt(f, h))
                } else Qc(p, 0)
            }
        }
    } finally {
        _(t)
    }
}

function po(e, t) {
    return e[t]
}

function fb(e, t) {
    return $n(e, t)
}

function pb(e, t) {
    return Gf(e, t)
}

function qa(e, t) {
    return Qn(e, t)
}

function hb(e, t, n, r, o, i) {
    let s = t.consts,
        a = Me(s, o),
        c = pn(t, e, 2, r, a);
    return Wc(t, n, c, Me(s, i)), c.attrs !== null && io(c, c.attrs, !1), c.mergedAttrs !== null && io(c, c.mergedAttrs, !0), t.queries !== null && t.queries.elementStart(t, c), c
}

function Lp(e, t, n, r) {
    let o = y(),
        i = A(),
        s = O + e,
        a = o[R],
        c = i.firstCreatePass ? hb(s, i, o, t, n, r) : i.data[s],
        l = mb(i, o, c, a, t, e);
    o[s] = l;
    let u = _o(c);
    return ke(c, !0), kf(a, l, c), !cE(c) && Jn() && Po(i, o, l, c), om() === 0 && st(l, o), im(), u && ($c(i, o, c), Bc(i, c, o)), r !== null && Uc(o, c), Lp
}

function Fp() {
    let e = F();
    vc() ? Ic() : (e = e.parent, ke(e, !1));
    let t = e;
    am(t) && cm(), sm();
    let n = A();
    return n.firstCreatePass && (xo(n, e), pc(e) && n.queries.elementEnd(e)), t.classesWithoutHost != null && Em(t) && Va(n, t, y(), t.classesWithoutHost, !0), t.stylesWithoutHost != null && bm(t) && Va(n, t, y(), t.stylesWithoutHost, !1), Fp
}

function gb(e, t, n, r) {
    return Lp(e, t, n, r), Fp(), gb
}
var mb = (e, t, n, r, o, i) => (Kn(!0), Lc(r, o, mm()));

function yb(e, t, n, r, o) {
    let i = t.consts,
        s = Me(i, r),
        a = pn(t, e, 8, "ng-container", s);
    s !== null && io(a, s, !0);
    let c = Me(i, o);
    return Wc(t, n, a, c), t.queries !== null && t.queries.elementStart(t, a), a
}

function Vp(e, t, n) {
    let r = y(),
        o = A(),
        i = e + O,
        s = o.firstCreatePass ? yb(i, o, r, t, n) : o.data[i];
    ke(s, !0);
    let a = Ib(o, r, s, e);
    return r[i] = a, Jn() && Po(o, r, a, s), st(a, r), _o(s) && ($c(o, r, s), Bc(o, s, r)), n != null && Uc(r, s), Vp
}

function jp() {
    let e = F(),
        t = A();
    return vc() ? Ic() : (e = e.parent, ke(e, !1)), t.firstCreatePass && (xo(t, e), pc(e) && t.queries.elementEnd(e)), jp
}

function vb(e, t, n) {
    return Vp(e, t, n), jp(), vb
}
var Ib = (e, t, n, r) => (Kn(!0), If(t[R], ""));

function HS() {
    return y()
}

function Eb(e, t, n) {
    let r = y(),
        o = lt();
    if (le(r, o, t)) {
        let i = A(),
            s = St();
        hn(i, s, r, e, t, r[R], n, !0)
    }
    return Eb
}

function bb(e, t, n) {
    let r = y(),
        o = lt();
    if (le(r, o, t)) {
        let i = A(),
            s = St(),
            a = bd(i.data),
            c = Hv(a, s, r);
        hn(i, s, r, e, t, c, n, !0)
    }
    return bb
}
var ht = void 0;

function wb(e) {
    let t = e,
        n = Math.floor(Math.abs(e)),
        r = e.toString().replace(/^[^.]*\.?/, "").length;
    return n === 1 && r === 0 ? 1 : 5
}
var Db = ["en", [
            ["a", "p"],
            ["AM", "PM"], ht
        ],
        [
            ["AM", "PM"], ht, ht
        ],
        [
            ["S", "M", "T", "W", "T", "F", "S"],
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
        ], ht, [
            ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        ], ht, [
            ["B", "A"],
            ["BC", "AD"],
            ["Before Christ", "Anno Domini"]
        ], 0, [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", ht, "{1} 'at' {0}", ht],
        [".", ",", ";", "%", "+", "-", "E", "\xD7", "\u2030", "\u221E", "NaN", ":"],
        ["#,##0.###", "#,##0%", "\xA4#,##0.00", "#E0"], "USD", "$", "US Dollar", {}, "ltr", wb
    ],
    Ss = {};

function BS(e) {
    let t = Mb(e),
        n = Su(t);
    if (n) return n;
    let r = t.split("-")[0];
    if (n = Su(r), n) return n;
    if (r === "en") return Db;
    throw new C(701, !1)
}

function Su(e) {
    return e in Ss || (Ss[e] = et.ng && et.ng.common && et.ng.common.locales && et.ng.common.locales[e]), Ss[e]
}
var Cb = function(e) {
    return e[e.LocaleId = 0] = "LocaleId", e[e.DayPeriodsFormat = 1] = "DayPeriodsFormat", e[e.DayPeriodsStandalone = 2] = "DayPeriodsStandalone", e[e.DaysFormat = 3] = "DaysFormat", e[e.DaysStandalone = 4] = "DaysStandalone", e[e.MonthsFormat = 5] = "MonthsFormat", e[e.MonthsStandalone = 6] = "MonthsStandalone", e[e.Eras = 7] = "Eras", e[e.FirstDayOfWeek = 8] = "FirstDayOfWeek", e[e.WeekendRange = 9] = "WeekendRange", e[e.DateFormat = 10] = "DateFormat", e[e.TimeFormat = 11] = "TimeFormat", e[e.DateTimeFormat = 12] = "DateTimeFormat", e[e.NumberSymbols = 13] = "NumberSymbols", e[e.NumberFormats = 14] = "NumberFormats", e[e.CurrencyCode = 15] = "CurrencyCode", e[e.CurrencySymbol = 16] = "CurrencySymbol", e[e.CurrencyName = 17] = "CurrencyName", e[e.Currencies = 18] = "Currencies", e[e.Directionality = 19] = "Directionality", e[e.PluralCase = 20] = "PluralCase", e[e.ExtraData = 21] = "ExtraData", e
}(Cb || {});

function Mb(e) {
    return e.toLowerCase().replace(/_/g, "-")
}
var ho = "en-US";
var _b = {
        marker: "element"
    },
    Nb = {
        marker: "ICU"
    },
    je = function(e) {
        return e[e.SHIFT = 2] = "SHIFT", e[e.APPEND_EAGERLY = 1] = "APPEND_EAGERLY", e[e.COMMENT = 2] = "COMMENT", e
    }(je || {}),
    xb = ho;

function Tb(e) {
    typeof e == "string" && (xb = e.toLowerCase().replace(/_/g, "-"))
}

function Sb(e, t, n) {
    let r = e[R];
    switch (n) {
        case Node.COMMENT_NODE:
            return If(r, t);
        case Node.TEXT_NODE:
            return vf(r, t);
        case Node.ELEMENT_NODE:
            return Lc(r, t, null)
    }
}
var Rb = (e, t, n, r) => (Kn(!0), Sb(e, n, r));

function Ab(e, t, n, r) {
    let o = e[R];
    for (let i = 0; i < t.length; i++) {
        let s = t[i++],
            a = t[i],
            c = (s & je.COMMENT) === je.COMMENT,
            l = (s & je.APPEND_EAGERLY) === je.APPEND_EAGERLY,
            u = s >>> je.SHIFT,
            d = e[u],
            p = !1;
        d === null && (d = e[u] = Rb(e, u, a, c ? Node.COMMENT_NODE : Node.TEXT_NODE), p = Jn()), l && n !== null && p && tn(o, n, d, r, !1)
    }
}
var go = /�(\d+):?\d*�/gi;
var kb = /�(\d+)�/,
    Hp = /^\s*(�\d+:?\d*�)\s*,\s*(select|plural)\s*,/,
    On = "\uFFFD",
    Ob = /�\/?\*(\d+:\d+)�/gi,
    Pb = /�(\/?[#*]\d+):?\d*�/gi,
    Lb = /\uE500/g;

function Fb(e) {
    return e.replace(Lb, " ")
}

function Vb(e, t, n, r, o, i) {
    let s = Vn(),
        a = [],
        c = [],
        l = [
            []
        ],
        u = [
            []
        ];
    o = Hb(o, i);
    let d = Fb(o).split(Pb);
    for (let p = 0; p < d.length; p++) {
        let f = d[p];
        if (p & 1) {
            let h = f.charCodeAt(0) === 47,
                m = f.charCodeAt(h ? 1 : 0),
                M = O + Number.parseInt(f.substring(h ? 2 : 1));
            if (h) l.shift(), u.shift(), ke(Vn(), !1);
            else {
                let E = uI(e, l[0], M);
                l.unshift([]), ke(E, !0);
                let S = {
                    kind: 2,
                    index: M,
                    children: [],
                    type: m === 35 ? 0 : 1
                };
                u[0].push(S), u.unshift(S.children)
            }
        } else {
            let h = Wa(f);
            for (let m = 0; m < h.length; m++) {
                let M = h[m];
                if (m & 1) {
                    let E = M;
                    if (typeof E != "object") throw new Error(`Unable to parse ICU expression in "${o}" message.`);
                    let B = Bp(e, s, l[0], n, a, "", !0).index;
                    Up(u[0], e, n, c, t, E, B)
                } else {
                    let E = M;
                    E !== "" && jb(u[0], e, s, l[0], a, c, n, E)
                }
            }
        }
    }
    e.data[r] = {
        create: a,
        update: c,
        ast: u[0],
        parentTNodeIndex: t
    }
}

function Bp(e, t, n, r, o, i, s) {
    let a = nr(e, r, 1, null),
        c = a << je.SHIFT,
        l = Vn();
    t === l && (l = null), l === null && (c |= je.APPEND_EAGERLY), s && (c |= je.COMMENT, qy(hI)), o.push(c, i === null ? "" : i);
    let u = Hc(e, a, s ? 32 : 1, i === null ? "" : i, null);
    rp(n, u);
    let d = u.index;
    return ke(u, !1), l !== null && t !== l && lI(l, d), u
}

function jb(e, t, n, r, o, i, s, a) {
    let c = a.match(go),
        u = Bp(t, n, r, s, o, c ? null : a, !1).index;
    c && Fr(i, a, u, null, 0, null), e.push({
        kind: 0,
        index: u
    })
}

function Fr(e, t, n, r, o, i) {
    let s = e.length,
        a = s + 1;
    e.push(null, null);
    let c = s + 2,
        l = t.split(go),
        u = 0;
    for (let d = 0; d < l.length; d++) {
        let p = l[d];
        if (d & 1) {
            let f = o + parseInt(p, 10);
            e.push(-1 - f), u = u | $p(f)
        } else p !== "" && e.push(p)
    }
    return e.push(n << 2 | (r ? 1 : 0)), r && e.push(r, i), e[s] = u, e[a] = e.length - c, u
}

function $p(e) {
    return 1 << Math.min(e, 31)
}

function Ru(e) {
    let t, n = "",
        r = 0,
        o = !1,
        i;
    for (;
        (t = Ob.exec(e)) !== null;) o ? t[0] === `${On}/*${i}${On}` && (r = t.index, o = !1) : (n += e.substring(r, t.index + t[0].length), i = t[1], o = !0);
    return n += e.slice(r), n
}

function Hb(e, t) {
    if (pI(t)) return Ru(e);
    {
        let n = e.indexOf(`:${t}${On}`) + 2 + t.toString().length,
            r = e.search(new RegExp(`${On}\\/\\*\\d+:${t}${On}`));
        return Ru(e.substring(n, r))
    }
}

function Up(e, t, n, r, o, i, s) {
    let a = 0,
        c = {
            type: i.type,
            currentCaseLViewIndex: nr(t, n, 1, null),
            anchorIdx: s,
            cases: [],
            create: [],
            remove: [],
            update: []
        };
    qb(r, i, s), cI(t, s, c);
    let l = i.values,
        u = [];
    for (let d = 0; d < l.length; d++) {
        let p = l[d],
            f = [];
        for (let m = 0; m < p.length; m++) {
            let M = p[m];
            if (typeof M != "string") {
                let E = f.push(M) - 1;
                p[m] = `<!--\uFFFD${E}\uFFFD-->`
            }
        }
        let h = [];
        u.push(h), a = $b(h, t, c, n, r, o, i.cases[d], p.join(""), f) | a
    }
    a && Wb(r, a, s), e.push({
        kind: 3,
        index: s,
        cases: u,
        currentCaseLViewIndex: c.currentCaseLViewIndex
    })
}

function Bb(e) {
    let t = [],
        n = [],
        r = 1,
        o = 0;
    e = e.replace(Hp, function(s, a, c) {
        return c === "select" ? r = 0 : r = 1, o = parseInt(a.slice(1), 10), ""
    });
    let i = Wa(e);
    for (let s = 0; s < i.length;) {
        let a = i[s++].trim();
        r === 1 && (a = a.replace(/\s*(?:=)?(\w+)\s*/, "$1")), a.length && t.push(a);
        let c = Wa(i[s++]);
        t.length > n.length && n.push(c)
    }
    return {
        type: r,
        mainBinding: o,
        cases: t,
        values: n
    }
}

function Wa(e) {
    if (!e) return [];
    let t = 0,
        n = [],
        r = [],
        o = /[{}]/g;
    o.lastIndex = 0;
    let i;
    for (; i = o.exec(e);) {
        let a = i.index;
        if (i[0] == "}") {
            if (n.pop(), n.length == 0) {
                let c = e.substring(t, a);
                Hp.test(c) ? r.push(Bb(c)) : r.push(c), t = a + 1
            }
        } else {
            if (n.length == 0) {
                let c = e.substring(t, a);
                r.push(c), t = a + 1
            }
            n.push("{")
        }
    }
    let s = e.substring(t);
    return r.push(s), r
}

function $b(e, t, n, r, o, i, s, a, c) {
    let l = [],
        u = [],
        d = [];
    n.cases.push(s), n.create.push(l), n.remove.push(u), n.update.push(d);
    let f = df(Nc()).getInertBodyElement(a),
        h = ha(f) || f;
    return h ? qp(e, t, n, r, o, l, u, d, h, i, c, 0) : 0
}

function qp(e, t, n, r, o, i, s, a, c, l, u, d) {
    let p = 0,
        f = c.firstChild;
    for (; f;) {
        let h = nr(t, r, 1, null);
        switch (f.nodeType) {
            case Node.ELEMENT_NODE:
                let m = f,
                    M = m.tagName.toLowerCase();
                if (fa.hasOwnProperty(M)) {
                    Rs(i, _b, M, l, h), t.data[h] = M;
                    let V = m.attributes;
                    for (let U = 0; U < V.length; U++) {
                        let te = V.item(U),
                            Rt = te.name.toLowerCase();
                        !!te.value.match(go) ? gf.hasOwnProperty(Rt) && (kc[Rt] ? Fr(a, te.value, h, te.name, 0, Ac) : Fr(a, te.value, h, te.name, 0, null)) : zb(i, h, te)
                    }
                    let $ = {
                        kind: 1,
                        index: h,
                        children: []
                    };
                    e.push($), p = qp($.children, t, n, r, o, i, s, a, f, h, u, d + 1) | p, Au(s, h, d)
                }
                break;
            case Node.TEXT_NODE:
                let E = f.textContent || "",
                    S = E.match(go);
                Rs(i, null, S ? "" : E, l, h), Au(s, h, d), S && (p = Fr(a, E, h, null, 0, null) | p), e.push({
                    kind: 0,
                    index: h
                });
                break;
            case Node.COMMENT_NODE:
                let B = kb.exec(f.textContent || "");
                if (B) {
                    let V = parseInt(B[1], 10),
                        $ = u[V];
                    Rs(i, Nb, "", l, h), Up(e, t, r, o, l, $, h), Ub(s, h, d)
                }
                break
        }
        f = f.nextSibling
    }
    return p
}

function Au(e, t, n) {
    n === 0 && e.push(t)
}

function Ub(e, t, n) {
    n === 0 && (e.push(~t), e.push(t))
}

function qb(e, t, n) {
    e.push($p(t.mainBinding), 2, -1 - t.mainBinding, n << 2 | 2)
}

function Wb(e, t, n) {
    e.push(t, 1, n << 2 | 3)
}

function Rs(e, t, n, r, o) {
    t !== null && e.push(t), e.push(n, o, fI(0, r, o))
}

function zb(e, t, n) {
    e.push(t << 1 | 1, n.name, n.value)
}

function Gb(e, t, n = -1) {
    let r = A(),
        o = y(),
        i = O + e,
        s = Me(r.consts, t),
        a = Vn();
    if (r.firstCreatePass && Vb(r, a === null ? 0 : a.index, o, i, s, n), r.type === 2) {
        let p = o[ce];
        p[I] |= 32
    } else o[I] |= 32;
    let c = r.data[i],
        l = a === o[ee] ? null : a,
        u = Df(r, l, o),
        d = a && a.type & 8 ? o[a.index] : null;
    mI(o, i, a, n), Ab(o, c.create, u, d), Ed(!0)
}

function Qb() {
    Ed(!1)
}

function $S(e, t, n) {
    Gb(e, t, n), Qb()
}
var Zb = (e, t, n) => {};

function Yb(e, t, n, r) {
    let o = y(),
        i = A(),
        s = F();
    return Wp(i, o, o[R], s, e, t, r), Yb
}

function Jb(e, t, n, r) {
    let o = e.cleanup;
    if (o != null)
        for (let i = 0; i < o.length - 1; i += 2) {
            let s = o[i];
            if (s === n && o[i + 1] === r) {
                let a = t[qr],
                    c = o[i + 2];
                return a.length > c ? a[c] : null
            }
            typeof s == "string" && (i += 2)
        }
    return null
}

function Wp(e, t, n, r, o, i, s) {
    let a = _o(r),
        l = e.firstCreatePass && zf(e),
        u = t[G],
        d = Wf(t),
        p = !0;
    if (r.type & 3 || s) {
        let m = ve(r, t),
            M = s ? s(m) : m,
            E = d.length,
            S = s ? V => s(Ce(V[r.index])) : r.index,
            B = null;
        if (!s && a && (B = Jb(e, t, o, r.index)), B !== null) {
            let V = B.__ngLastListenerFn__ || B;
            V.__ngNextListenerFn__ = i, B.__ngLastListenerFn__ = i, p = !1
        } else {
            i = Ou(r, t, u, i), Zb(m, o, i);
            let V = n.listen(M, o, i);
            d.push(i, V), l && l.push(o, S, E, E + 1)
        }
    } else i = Ou(r, t, u, i);
    let f = r.outputs,
        h;
    if (p && f !== null && (h = f[o])) {
        let m = h.length;
        if (m)
            for (let M = 0; M < m; M += 2) {
                let E = h[M],
                    S = h[M + 1],
                    $ = t[E][S].subscribe(i),
                    U = d.length;
                d.push(i, $), l && l.push(o, r.index, U, -(U + 1))
            }
    }
}

function ku(e, t, n, r) {
    let o = _(null);
    try {
        return Se(6, t, n), n(r) !== !1
    } catch (i) {
        return Ho(e, i), !1
    } finally {
        Se(7, t, n), _(o)
    }
}

function Ou(e, t, n, r) {
    return function o(i) {
        if (i === Function) return r;
        let s = e.componentOffset > -1 ? ct(e.index, t) : t;
        $o(s, 5);
        let a = ku(t, n, r, i),
            c = o.__ngNextListenerFn__;
        for (; c;) a = ku(t, n, c, i) && a, c = c.__ngNextListenerFn__;
        return a
    }
}

function US(e = 1) {
    return gm(e)
}

function Kb(e, t) {
    let n = null,
        r = lv(e);
    for (let o = 0; o < t.length; o++) {
        let i = t[o];
        if (i === "*") {
            n = o;
            continue
        }
        if (r === null ? Pf(e, i, !0) : fv(r, i)) return o
    }
    return n
}

function qS(e) {
    let t = y()[ce][ee];
    if (!t.projection) {
        let n = e ? e.length : 1,
            r = t.projection = Og(n, null),
            o = r.slice(),
            i = t.child;
        for (; i !== null;) {
            if (i.type !== 128) {
                let s = e ? Kb(i, e) : 0;
                s !== null && (o[s] ? o[s].projectionNext = i : r[s] = i, o[s] = i)
            }
            i = i.next
        }
    }
}

function WS(e, t = 0, n, r, o, i) {
    let s = y(),
        a = A(),
        c = r ? e + 1 : null;
    c !== null && qn(s, a, c, r, o, i, null, n);
    let l = pn(a, O + e, 16, null, n || null);
    l.projection === null && (l.projection = t), Ic();
    let d = !s[Xt] || yd();
    s[ce][ee].projection[l.projection] === null && c !== null ? Xb(s, a, c) : d && (l.flags & 32) !== 32 && ev(a, s, l)
}

function Xb(e, t, n) {
    let r = O + n,
        o = t.data[r],
        i = e[r],
        s = nn(i, o.tView.ssrId),
        a = gn(e, o, void 0, {
            dehydratedView: s
        });
    mn(i, a, 0, Mt(o, s))
}

function ew(e, t, n) {
    return zp(e, "", t, "", n), ew
}

function zp(e, t, n, r, o) {
    let i = y(),
        s = Xc(i, t, n, r);
    if (s !== H) {
        let a = A(),
            c = St();
        hn(a, c, i, e, s, i[R], o, !1)
    }
    return zp
}

function tw(e, t, n, r, o, i, s) {
    let a = y(),
        c = _p(a, t, n, r, o, i);
    if (c !== H) {
        let l = A(),
            u = St();
        hn(l, u, a, e, c, a[R], s, !1)
    }
    return tw
}

function zS(e, t, n, r) {
    HI(e, t, n, r)
}

function GS(e, t, n) {
    jI(e, t, n)
}

function QS(e) {
    let t = y(),
        n = A(),
        r = wd();
    bc(r + 1);
    let o = Yc(n, r);
    if (e.dirty && tm(t) === ((o.metadata.flags & 2) === 2)) {
        if (o.matches === null) e.reset([]);
        else {
            let i = UI(t, r);
            e.reset(i, Um), e.notifyOnChanges()
        }
        return !0
    }
    return !1
}

function ZS() {
    return VI(y(), wd())
}

function nw(e, t, n, r) {
    n >= e.data.length && (e.data[n] = null, e.blueprint[n] = null), t[n] = r
}

function YS(e) {
    let t = lm();
    return hc(t, O + e)
}

function JS(e, t = "") {
    let n = y(),
        r = A(),
        o = e + O,
        i = r.firstCreatePass ? pn(r, o, 1, t, null) : r.data[o],
        s = rw(r, n, i, t, e);
    n[o] = s, Jn() && Po(r, n, s, i), ke(i, !1)
}
var rw = (e, t, n, r, o) => (Kn(!0), vf(t[R], r));

function ow(e) {
    return Gp("", e, ""), ow
}

function Gp(e, t, n) {
    let r = y(),
        o = Xc(r, e, t, n);
    return o !== H && Bo(r, _e(), o), Gp
}

function iw(e, t, n, r, o) {
    let i = y(),
        s = _p(i, e, t, n, r, o);
    return s !== H && Bo(i, _e(), s), iw
}

function sw(e, t, n, r, o, i, s) {
    let a = y(),
        c = $E(a, e, t, n, r, o, i, s);
    return c !== H && Bo(a, _e(), c), sw
}

function aw(e, t, n, r, o, i, s, a, c) {
    let l = y(),
        u = UE(l, e, t, n, r, o, i, s, a, c);
    return u !== H && Bo(l, _e(), u), aw
}

function cw(e, t, n) {
    pp(t) && (t = t());
    let r = y(),
        o = lt();
    if (le(r, o, t)) {
        let i = A(),
            s = St();
        hn(i, s, r, e, t, r[R], n, !1)
    }
    return cw
}

function KS(e, t) {
    let n = pp(e);
    return n && e.set(t), n
}

function lw(e, t) {
    let n = y(),
        r = A(),
        o = F();
    return Wp(r, n, n[R], o, e, t), lw
}

function uw(e, t, n) {
    let r = A();
    if (r.firstCreatePass) {
        let o = qe(e);
        za(n, r.data, r.blueprint, o, !0), za(t, r.data, r.blueprint, o, !1)
    }
}

function za(e, t, n, r, o) {
    if (e = W(e), Array.isArray(e))
        for (let i = 0; i < e.length; i++) za(e[i], t, n, r, o);
    else {
        let i = A(),
            s = y(),
            a = F(),
            c = Kt(e) ? e : W(e.provide),
            l = od(e),
            u = a.providerIndexes & 1048575,
            d = a.directiveStart,
            p = a.providerIndexes >> 20;
        if (Kt(e) || !e.multi) {
            let f = new wt(l, o, Fo),
                h = ks(c, t, o ? u : u + p, d);
            h === -1 ? (Qs(Kr(a, s), i, c), As(i, e, t.length), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(f), s.push(f)) : (n[h] = f, s[h] = f)
        } else {
            let f = ks(c, t, u + p, d),
                h = ks(c, t, u, u + p),
                m = f >= 0 && n[f],
                M = h >= 0 && n[h];
            if (o && !M || !o && !m) {
                Qs(Kr(a, s), i, c);
                let E = pw(o ? fw : dw, n.length, o, r, l);
                !o && M && (n[h].providerFactory = E), As(i, e, t.length, 0), t.push(c), a.directiveStart++, a.directiveEnd++, o && (a.providerIndexes += 1048576), n.push(E), s.push(E)
            } else {
                let E = Qp(n[o ? h : f], l, !o && r);
                As(i, e, f > -1 ? f : h, E)
            }!o && r && M && n[h].componentProviders++
        }
    }
}

function As(e, t, n, r) {
    let o = Kt(t),
        i = Bg(t);
    if (o || i) {
        let c = (i ? W(t.useClass) : t).prototype.ngOnDestroy;
        if (c) {
            let l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
                let u = l.indexOf(n);
                u === -1 ? l.push(n, [r, c]) : l[u + 1].push(r, c)
            } else l.push(n, c)
        }
    }
}

function Qp(e, t, n) {
    return n && e.componentProviders++, e.multi.push(t) - 1
}

function ks(e, t, n, r) {
    for (let o = n; o < r; o++)
        if (t[o] === e) return o;
    return -1
}

function dw(e, t, n, r) {
    return Ga(this.multi, [])
}

function fw(e, t, n, r) {
    let o = this.multi,
        i;
    if (this.providerFactory) {
        let s = this.providerFactory.componentProviders,
            a = Dt(n, n[v], this.providerFactory.index, r);
        i = a.slice(0, s), Ga(o, i);
        for (let c = s; c < a.length; c++) i.push(a[c])
    } else i = [], Ga(o, i);
    return i
}

function Ga(e, t) {
    for (let n = 0; n < e.length; n++) {
        let r = e[n];
        t.push(r())
    }
    return t
}

function pw(e, t, n, r, o) {
    let i = new wt(e, n, Fo);
    return i.multi = [], i.index = t, i.componentProviders = 0, Qp(i, o, r && !n), i
}

function XS(e, t = []) {
    return n => {
        n.providersResolver = (r, o) => uw(r, o ? o(e) : e, t)
    }
}

function eR(e, t, n) {
    let r = cn() + e,
        o = y();
    return o[r] === H ? qo(o, r, n ? t.call(n) : t()) : sE(o, r)
}

function tR(e, t, n, r) {
    return Zp(y(), cn(), e, t, n, r)
}

function nR(e, t, n, r, o) {
    return Yp(y(), cn(), e, t, n, r, o)
}

function rR(e, t, n, r, o, i) {
    return hw(y(), cn(), e, t, n, r, o, i)
}

function el(e, t) {
    let n = e[t];
    return n === H ? void 0 : n
}

function Zp(e, t, n, r, o, i) {
    let s = t + n;
    return le(e, s, o) ? qo(e, s + 1, i ? r.call(i, o) : r(o)) : el(e, s + 1)
}

function Yp(e, t, n, r, o, i, s) {
    let a = t + n;
    return Un(e, a, o, i) ? qo(e, a + 2, s ? r.call(s, o, i) : r(o, i)) : el(e, a + 2)
}

function hw(e, t, n, r, o, i, s, a) {
    let c = t + n;
    return Ep(e, c, o, i, s) ? qo(e, c + 3, a ? r.call(a, o, i, s) : r(o, i, s)) : el(e, c + 3)
}

function oR(e, t) {
    let n = A(),
        r, o = e + O;
    n.firstCreatePass ? (r = gw(t, n.pipeRegistry), n.data[o] = r, r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy)) : r = n.data[o];
    let i = r.factory || (r.factory = mt(r.type, !0)),
        s, a = ie(Fo);
    try {
        let c = Jr(!1),
            l = i();
        return Jr(c), nw(n, y(), o, l), l
    } finally {
        ie(a)
    }
}

function gw(e, t) {
    if (t)
        for (let n = t.length - 1; n >= 0; n--) {
            let r = t[n];
            if (e === r.name) return r
        }
}

function iR(e, t, n) {
    let r = e + O,
        o = y(),
        i = hc(o, r);
    return Jp(o, r) ? Zp(o, cn(), t, i.transform, n, i) : i.transform(n)
}

function sR(e, t, n, r) {
    let o = e + O,
        i = y(),
        s = hc(i, o);
    return Jp(i, o) ? Yp(i, cn(), t, s.transform, n, r, s) : s.transform(n, r)
}

function Jp(e, t) {
    return e[v].data[t].pure
}

function aR(e, t) {
    return Uo(e, t)
}
var Qa = class {
        ngModuleFactory;
        componentFactories;
        constructor(t, n) {
            this.ngModuleFactory = t, this.componentFactories = n
        }
    },
    cR = (() => {
        class e {
            compileModuleSync(n) {
                return new ka(n)
            }
            compileModuleAsync(n) {
                return Promise.resolve(this.compileModuleSync(n))
            }
            compileModuleAndAllComponentsSync(n) {
                let r = this.compileModuleSync(n),
                    o = ed(n),
                    i = yf(o.declarations).reduce((s, a) => {
                        let c = Ae(a);
                        return c && s.push(new Nt(c)), s
                    }, []);
                return new Qa(r, i)
            }
            compileModuleAndAllComponentsAsync(n) {
                return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
            static \u0275fac = function(r) {
                return new(r || e)
            };
            static \u0275prov = P({
                token: e,
                factory: e.\u0275fac,
                providedIn: "root"
            })
        }
        return e
    })();
var mw = (() => {
    class e {
        zone = D(X);
        changeDetectionScheduler = D(Ct);
        applicationRef = D(on);
        _onMicrotaskEmptySubscription;
        initialize() {
            this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                next: () => {
                    this.changeDetectionScheduler.runningTick || this.zone.run(() => {
                        this.applicationRef.tick()
                    })
                }
            }))
        }
        ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe()
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = P({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function yw({
    ngZoneFactory: e,
    ignoreChangesOutsideZone: t,
    scheduleInRootZone: n
}) {
    return e ??= () => new X(de(ue({}, vw()), {
        scheduleInRootZone: n
    })), [{
        provide: X,
        useFactory: e
    }, {
        provide: $r,
        multi: !0,
        useFactory: () => {
            let r = D(mw, {
                optional: !0
            });
            return () => r.initialize()
        }
    }, {
        provide: $r,
        multi: !0,
        useFactory: () => {
            let r = D(Iw);
            return () => {
                r.initialize()
            }
        }
    }, t === !0 ? {
        provide: Ud,
        useValue: !0
    } : [], {
        provide: qd,
        useValue: n ?? Bd
    }]
}

function vw(e) {
    return {
        enableLongStackTrace: !1,
        shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
        shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1
    }
}
var Iw = (() => {
    class e {
        subscription = new x;
        initialized = !1;
        zone = D(X);
        pendingTasks = D(un);
        initialize() {
            if (this.initialized) return;
            this.initialized = !0;
            let n = null;
            !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
                this.subscription.add(this.zone.onStable.subscribe(() => {
                    X.assertNotInAngularZone(), queueMicrotask(() => {
                        n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null)
                    })
                }))
            }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
                X.assertInAngularZone(), n ??= this.pendingTasks.add()
            }))
        }
        ngOnDestroy() {
            this.subscription.unsubscribe()
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = P({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();
var Ew = (() => {
    class e {
        appRef = D(on);
        taskService = D(un);
        ngZone = D(X);
        zonelessEnabled = D($d);
        tracing = D(So, {
            optional: !0
        });
        disableScheduling = D(Ud, {
            optional: !0
        }) ?? !1;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{
            data: {
                __scheduler_tick__: !0
            }
        }];
        subscriptions = new x;
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(eo) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (D(qd, {
            optional: !0
        }) ?? !1);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = !1;
        runningTick = !1;
        pendingRenderTaskId = null;
        constructor() {
            this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
                this.runningTick || this.cleanup()
            })), this.disableScheduling ||= !this.zonelessEnabled && (this.ngZone instanceof Ks || !this.zoneIsDefined)
        }
        notify(n) {
            if (!this.zonelessEnabled && n === 5) return;
            let r = !1;
            switch (n) {
                case 0: {
                    this.appRef.dirtyFlags |= 2;
                    break
                }
                case 3:
                case 2:
                case 4:
                case 5:
                case 1: {
                    this.appRef.dirtyFlags |= 4;
                    break
                }
                case 8: {
                    this.appRef.deferredDirtyFlags |= 8;
                    break
                }
                case 6: {
                    this.appRef.dirtyFlags |= 2, r = !0;
                    break
                }
                case 13: {
                    this.appRef.dirtyFlags |= 16, r = !0;
                    break
                }
                case 14: {
                    this.appRef.dirtyFlags |= 2, r = !0;
                    break
                }
                case 12: {
                    r = !0;
                    break
                }
                case 10:
                case 9:
                case 7:
                case 11:
                default:
                    this.appRef.dirtyFlags |= 8
            }
            if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick(r)) return;
            let o = this.useMicrotaskScheduler ? Kl : Wd;
            this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()))
        }
        shouldScheduleTick(n) {
            return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(eo + this.angularZoneId))
        }
        tick() {
            if (this.runningTick || this.appRef.destroyed) return;
            if (this.appRef.dirtyFlags === 0) {
                this.cleanup();
                return
            }!this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
            let n = this.taskService.add();
            try {
                this.ngZone.run(() => {
                    this.runningTick = !0, this.appRef._tick()
                }, void 0, this.schedulerTickApplyArgs)
            } catch (r) {
                throw this.taskService.remove(n), r
            } finally {
                this.cleanup()
            }
            this.useMicrotaskScheduler = !0, Kl(() => {
                this.useMicrotaskScheduler = !1, this.taskService.remove(n)
            })
        }
        ngOnDestroy() {
            this.subscriptions.unsubscribe(), this.cleanup()
        }
        cleanup() {
            if (this.runningTick = !1, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
                let n = this.pendingRenderTaskId;
                this.pendingRenderTaskId = null, this.taskService.remove(n)
            }
        }
        static \u0275fac = function(r) {
            return new(r || e)
        };
        static \u0275prov = P({
            token: e,
            factory: e.\u0275fac,
            providedIn: "root"
        })
    }
    return e
})();

function bw() {
    return typeof $localize < "u" && $localize.locale || ho
}
var Kp = new T("", {
    providedIn: "root",
    factory: () => D(Kp, N.Optional | N.SkipSelf) || bw()
});
var Za = new T(""),
    ww = new T("");

function Tn(e) {
    return !e.moduleRef
}

function Dw(e) {
    let t = Tn(e) ? e.r3Injector : e.moduleRef.injector,
        n = t.get(X);
    return n.run(() => {
        Tn(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
        let r = t.get(it, null),
            o;
        if (n.runOutsideAngular(() => {
                o = n.onError.subscribe({
                    next: i => {
                        r.handleError(i)
                    }
                })
            }), Tn(e)) {
            let i = () => t.destroy(),
                s = e.platformInjector.get(Za);
            s.add(i), t.onDestroy(() => {
                o.unsubscribe(), s.delete(i)
            })
        } else {
            let i = () => e.moduleRef.destroy(),
                s = e.platformInjector.get(Za);
            s.add(i), e.moduleRef.onDestroy(() => {
                Lr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i)
            })
        }
        return PE(r, n, () => {
            let i = t.get(Dp);
            return i.runInitializers(), i.donePromise.then(() => {
                let s = t.get(Kp, ho);
                if (Tb(s || ho), !t.get(ww, !0)) return Tn(e) ? t.get(on) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
                if (Tn(e)) {
                    let c = t.get(on);
                    return e.rootComponent !== void 0 && c.bootstrap(e.rootComponent), c
                } else return Cw(e.moduleRef, e.allPlatformModules), e.moduleRef
            })
        })
    })
}

function Cw(e, t) {
    let n = e.injector.get(on);
    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach(r => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new C(-403, !1);
    t.push(e)
}
var Vr = null;

function Mw(e = [], t) {
    return We.create({
        name: t,
        providers: [{
            provide: rd,
            useValue: "platform"
        }, {
            provide: Za,
            useValue: new Set([() => Vr = null])
        }, ...e]
    })
}

function _w(e = []) {
    if (Vr) return Vr;
    let t = Mw(e);
    return Vr = t, AE(), Nw(t), t
}

function Nw(e) {
    let t = e.get(Zm, null);
    id(e, () => {
        t?.forEach(n => n())
    })
}

function lR() {
    return !1
}
var xw = (() => {
    class e {
        static __NG_ELEMENT_ID__ = Tw
    }
    return e
})();

function Tw(e) {
    return Sw(F(), y(), (e & 16) === 16)
}

function Sw(e, t, n) {
    if (Mo(e) && !n) {
        let r = ct(e.index, t);
        return new _t(r, r)
    } else if (e.type & 175) {
        let r = t[ce];
        return new _t(r, t)
    }
    return null
}
var Ya = class {
        constructor() {}
        supports(t) {
            return Ip(t)
        }
        create(t) {
            return new Ja(t)
        }
    },
    Rw = (e, t) => t,
    Ja = class {
        length = 0;
        collection;
        _linkedRecords = null;
        _unlinkedRecords = null;
        _previousItHead = null;
        _itHead = null;
        _itTail = null;
        _additionsHead = null;
        _additionsTail = null;
        _movesHead = null;
        _movesTail = null;
        _removalsHead = null;
        _removalsTail = null;
        _identityChangesHead = null;
        _identityChangesTail = null;
        _trackByFn;
        constructor(t) {
            this._trackByFn = t || Rw
        }
        forEachItem(t) {
            let n;
            for (n = this._itHead; n !== null; n = n._next) t(n)
        }
        forEachOperation(t) {
            let n = this._itHead,
                r = this._removalsHead,
                o = 0,
                i = null;
            for (; n || r;) {
                let s = !r || n && n.currentIndex < Pu(r, o, i) ? n : r,
                    a = Pu(s, o, i),
                    c = s.currentIndex;
                if (s === r) o--, r = r._nextRemoved;
                else if (n = n._next, s.previousIndex == null) o++;
                else {
                    i || (i = []);
                    let l = a - o,
                        u = c - o;
                    if (l != u) {
                        for (let p = 0; p < l; p++) {
                            let f = p < i.length ? i[p] : i[p] = 0,
                                h = f + p;
                            u <= h && h < l && (i[p] = f + 1)
                        }
                        let d = s.previousIndex;
                        i[d] = u - l
                    }
                }
                a !== c && t(s, a, c)
            }
        }
        forEachPreviousItem(t) {
            let n;
            for (n = this._previousItHead; n !== null; n = n._nextPrevious) t(n)
        }
        forEachAddedItem(t) {
            let n;
            for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n)
        }
        forEachMovedItem(t) {
            let n;
            for (n = this._movesHead; n !== null; n = n._nextMoved) t(n)
        }
        forEachRemovedItem(t) {
            let n;
            for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n)
        }
        forEachIdentityChange(t) {
            let n;
            for (n = this._identityChangesHead; n !== null; n = n._nextIdentityChange) t(n)
        }
        diff(t) {
            if (t == null && (t = []), !Ip(t)) throw new C(900, !1);
            return this.check(t) ? this : null
        }
        onDestroy() {}
        check(t) {
            this._reset();
            let n = this._itHead,
                r = !1,
                o, i, s;
            if (Array.isArray(t)) {
                this.length = t.length;
                for (let a = 0; a < this.length; a++) i = t[a], s = this._trackByFn(a, i), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, i, s, a), r = !0) : (r && (n = this._verifyReinsertion(n, i, s, a)), Object.is(n.item, i) || this._addIdentityChange(n, i)), n = n._next
            } else o = 0, iE(t, a => {
                s = this._trackByFn(o, a), n === null || !Object.is(n.trackById, s) ? (n = this._mismatch(n, a, s, o), r = !0) : (r && (n = this._verifyReinsertion(n, a, s, o)), Object.is(n.item, a) || this._addIdentityChange(n, a)), n = n._next, o++
            }), this.length = o;
            return this._truncate(n), this.collection = t, this.isDirty
        }
        get isDirty() {
            return this._additionsHead !== null || this._movesHead !== null || this._removalsHead !== null || this._identityChangesHead !== null
        }
        _reset() {
            if (this.isDirty) {
                let t;
                for (t = this._previousItHead = this._itHead; t !== null; t = t._next) t._nextPrevious = t._next;
                for (t = this._additionsHead; t !== null; t = t._nextAdded) t.previousIndex = t.currentIndex;
                for (this._additionsHead = this._additionsTail = null, t = this._movesHead; t !== null; t = t._nextMoved) t.previousIndex = t.currentIndex;
                this._movesHead = this._movesTail = null, this._removalsHead = this._removalsTail = null, this._identityChangesHead = this._identityChangesTail = null
            }
        }
        _mismatch(t, n, r, o) {
            let i;
            return t === null ? i = this._itTail : (i = t._prev, this._remove(t)), t = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._reinsertAfter(t, i, o)) : (t = this._linkedRecords === null ? null : this._linkedRecords.get(r, o), t !== null ? (Object.is(t.item, n) || this._addIdentityChange(t, n), this._moveAfter(t, i, o)) : t = this._addAfter(new Ka(n, r), i, o)), t
        }
        _verifyReinsertion(t, n, r, o) {
            let i = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(r, null);
            return i !== null ? t = this._reinsertAfter(i, t._prev, o) : t.currentIndex != o && (t.currentIndex = o, this._addToMoves(t, o)), t
        }
        _truncate(t) {
            for (; t !== null;) {
                let n = t._next;
                this._addToRemovals(this._unlink(t)), t = n
            }
            this._unlinkedRecords !== null && this._unlinkedRecords.clear(), this._additionsTail !== null && (this._additionsTail._nextAdded = null), this._movesTail !== null && (this._movesTail._nextMoved = null), this._itTail !== null && (this._itTail._next = null), this._removalsTail !== null && (this._removalsTail._nextRemoved = null), this._identityChangesTail !== null && (this._identityChangesTail._nextIdentityChange = null)
        }
        _reinsertAfter(t, n, r) {
            this._unlinkedRecords !== null && this._unlinkedRecords.remove(t);
            let o = t._prevRemoved,
                i = t._nextRemoved;
            return o === null ? this._removalsHead = i : o._nextRemoved = i, i === null ? this._removalsTail = o : i._prevRemoved = o, this._insertAfter(t, n, r), this._addToMoves(t, r), t
        }
        _moveAfter(t, n, r) {
            return this._unlink(t), this._insertAfter(t, n, r), this._addToMoves(t, r), t
        }
        _addAfter(t, n, r) {
            return this._insertAfter(t, n, r), this._additionsTail === null ? this._additionsTail = this._additionsHead = t : this._additionsTail = this._additionsTail._nextAdded = t, t
        }
        _insertAfter(t, n, r) {
            let o = n === null ? this._itHead : n._next;
            return t._next = o, t._prev = n, o === null ? this._itTail = t : o._prev = t, n === null ? this._itHead = t : n._next = t, this._linkedRecords === null && (this._linkedRecords = new mo), this._linkedRecords.put(t), t.currentIndex = r, t
        }
        _remove(t) {
            return this._addToRemovals(this._unlink(t))
        }
        _unlink(t) {
            this._linkedRecords !== null && this._linkedRecords.remove(t);
            let n = t._prev,
                r = t._next;
            return n === null ? this._itHead = r : n._next = r, r === null ? this._itTail = n : r._prev = n, t
        }
        _addToMoves(t, n) {
            return t.previousIndex === n || (this._movesTail === null ? this._movesTail = this._movesHead = t : this._movesTail = this._movesTail._nextMoved = t), t
        }
        _addToRemovals(t) {
            return this._unlinkedRecords === null && (this._unlinkedRecords = new mo), this._unlinkedRecords.put(t), t.currentIndex = null, t._nextRemoved = null, this._removalsTail === null ? (this._removalsTail = this._removalsHead = t, t._prevRemoved = null) : (t._prevRemoved = this._removalsTail, this._removalsTail = this._removalsTail._nextRemoved = t), t
        }
        _addIdentityChange(t, n) {
            return t.item = n, this._identityChangesTail === null ? this._identityChangesTail = this._identityChangesHead = t : this._identityChangesTail = this._identityChangesTail._nextIdentityChange = t, t
        }
    },
    Ka = class {
        item;
        trackById;
        currentIndex = null;
        previousIndex = null;
        _nextPrevious = null;
        _prev = null;
        _next = null;
        _prevDup = null;
        _nextDup = null;
        _prevRemoved = null;
        _nextRemoved = null;
        _nextAdded = null;
        _nextMoved = null;
        _nextIdentityChange = null;
        constructor(t, n) {
            this.item = t, this.trackById = n
        }
    },
    Xa = class {
        _head = null;
        _tail = null;
        add(t) {
            this._head === null ? (this._head = this._tail = t, t._nextDup = null, t._prevDup = null) : (this._tail._nextDup = t, t._prevDup = this._tail, t._nextDup = null, this._tail = t)
        }
        get(t, n) {
            let r;
            for (r = this._head; r !== null; r = r._nextDup)
                if ((n === null || n <= r.currentIndex) && Object.is(r.trackById, t)) return r;
            return null
        }
        remove(t) {
            let n = t._prevDup,
                r = t._nextDup;
            return n === null ? this._head = r : n._nextDup = r, r === null ? this._tail = n : r._prevDup = n, this._head === null
        }
    },
    mo = class {
        map = new Map;
        put(t) {
            let n = t.trackById,
                r = this.map.get(n);
            r || (r = new Xa, this.map.set(n, r)), r.add(t)
        }
        get(t, n) {
            let r = t,
                o = this.map.get(r);
            return o ? o.get(t, n) : null
        }
        remove(t) {
            let n = t.trackById;
            return this.map.get(n).remove(t) && this.map.delete(n), t
        }
        get isEmpty() {
            return this.map.size === 0
        }
        clear() {
            this.map.clear()
        }
    };

function Pu(e, t, n) {
    let r = e.previousIndex;
    if (r === null) return r;
    let o = 0;
    return n && r < n.length && (o = n[r]), r + t + o
}
var ec = class {
        constructor() {}
        supports(t) {
            return t instanceof Map || Jc(t)
        }
        create() {
            return new tc
        }
    },
    tc = class {
        _records = new Map;
        _mapHead = null;
        _appendAfter = null;
        _previousMapHead = null;
        _changesHead = null;
        _changesTail = null;
        _additionsHead = null;
        _additionsTail = null;
        _removalsHead = null;
        _removalsTail = null;
        get isDirty() {
            return this._additionsHead !== null || this._changesHead !== null || this._removalsHead !== null
        }
        forEachItem(t) {
            let n;
            for (n = this._mapHead; n !== null; n = n._next) t(n)
        }
        forEachPreviousItem(t) {
            let n;
            for (n = this._previousMapHead; n !== null; n = n._nextPrevious) t(n)
        }
        forEachChangedItem(t) {
            let n;
            for (n = this._changesHead; n !== null; n = n._nextChanged) t(n)
        }
        forEachAddedItem(t) {
            let n;
            for (n = this._additionsHead; n !== null; n = n._nextAdded) t(n)
        }
        forEachRemovedItem(t) {
            let n;
            for (n = this._removalsHead; n !== null; n = n._nextRemoved) t(n)
        }
        diff(t) {
            if (!t) t = new Map;
            else if (!(t instanceof Map || Jc(t))) throw new C(900, !1);
            return this.check(t) ? this : null
        }
        onDestroy() {}
        check(t) {
            this._reset();
            let n = this._mapHead;
            if (this._appendAfter = null, this._forEach(t, (r, o) => {
                    if (n && n.key === o) this._maybeAddToChanges(n, r), this._appendAfter = n, n = n._next;
                    else {
                        let i = this._getOrCreateRecordForKey(o, r);
                        n = this._insertBeforeOrAppend(n, i)
                    }
                }), n) {
                n._prev && (n._prev._next = null), this._removalsHead = n;
                for (let r = n; r !== null; r = r._nextRemoved) r === this._mapHead && (this._mapHead = null), this._records.delete(r.key), r._nextRemoved = r._next, r.previousValue = r.currentValue, r.currentValue = null, r._prev = null, r._next = null
            }
            return this._changesTail && (this._changesTail._nextChanged = null), this._additionsTail && (this._additionsTail._nextAdded = null), this.isDirty
        }
        _insertBeforeOrAppend(t, n) {
            if (t) {
                let r = t._prev;
                return n._next = t, n._prev = r, t._prev = n, r && (r._next = n), t === this._mapHead && (this._mapHead = n), this._appendAfter = t, t
            }
            return this._appendAfter ? (this._appendAfter._next = n, n._prev = this._appendAfter) : this._mapHead = n, this._appendAfter = n, null
        }
        _getOrCreateRecordForKey(t, n) {
            if (this._records.has(t)) {
                let o = this._records.get(t);
                this._maybeAddToChanges(o, n);
                let i = o._prev,
                    s = o._next;
                return i && (i._next = s), s && (s._prev = i), o._next = null, o._prev = null, o
            }
            let r = new nc(t);
            return this._records.set(t, r), r.currentValue = n, this._addToAdditions(r), r
        }
        _reset() {
            if (this.isDirty) {
                let t;
                for (this._previousMapHead = this._mapHead, t = this._previousMapHead; t !== null; t = t._next) t._nextPrevious = t._next;
                for (t = this._changesHead; t !== null; t = t._nextChanged) t.previousValue = t.currentValue;
                for (t = this._additionsHead; t != null; t = t._nextAdded) t.previousValue = t.currentValue;
                this._changesHead = this._changesTail = null, this._additionsHead = this._additionsTail = null, this._removalsHead = null
            }
        }
        _maybeAddToChanges(t, n) {
            Object.is(n, t.currentValue) || (t.previousValue = t.currentValue, t.currentValue = n, this._addToChanges(t))
        }
        _addToAdditions(t) {
            this._additionsHead === null ? this._additionsHead = this._additionsTail = t : (this._additionsTail._nextAdded = t, this._additionsTail = t)
        }
        _addToChanges(t) {
            this._changesHead === null ? this._changesHead = this._changesTail = t : (this._changesTail._nextChanged = t, this._changesTail = t)
        }
        _forEach(t, n) {
            t instanceof Map ? t.forEach(n) : Object.keys(t).forEach(r => n(t[r], r))
        }
    },
    nc = class {
        key;
        previousValue = null;
        currentValue = null;
        _nextPrevious = null;
        _next = null;
        _prev = null;
        _nextAdded = null;
        _nextRemoved = null;
        _nextChanged = null;
        constructor(t) {
            this.key = t
        }
    };

function Lu() {
    return new Aw([new Ya])
}
var Aw = (() => {
    class e {
        factories;
        static \u0275prov = P({
            token: e,
            providedIn: "root",
            factory: Lu
        });
        constructor(n) {
            this.factories = n
        }
        static create(n, r) {
            if (r != null) {
                let o = r.factories.slice();
                n = n.concat(o)
            }
            return new e(n)
        }
        static extend(n) {
            return {
                provide: e,
                useFactory: r => e.create(n, r || Lu()),
                deps: [
                    [e, new Zu, new Qu]
                ]
            }
        }
        find(n) {
            let r = this.factories.find(o => o.supports(n));
            if (r != null) return r;
            throw new C(901, !1)
        }
    }
    return e
})();

function Fu() {
    return new kw([new ec])
}
var kw = (() => {
    class e {
        static \u0275prov = P({
            token: e,
            providedIn: "root",
            factory: Fu
        });
        factories;
        constructor(n) {
            this.factories = n
        }
        static create(n, r) {
            if (r) {
                let o = r.factories.slice();
                n = n.concat(o)
            }
            return new e(n)
        }
        static extend(n) {
            return {
                provide: e,
                useFactory: r => e.create(n, r || Fu()),
                deps: [
                    [e, new Zu, new Qu]
                ]
            }
        }
        find(n) {
            let r = this.factories.find(o => o.supports(n));
            if (r) return r;
            throw new C(901, !1)
        }
    }
    return e
})();
var uR = (() => {
    class e {
        constructor(n) {}
        static \u0275fac = function(r) {
            return new(r || e)(ye(on))
        };
        static \u0275mod = ZI({
            type: e
        });
        static \u0275inj = hg({})
    }
    return e
})();

function dR(e) {
    try {
        let {
            rootComponent: t,
            appProviders: n,
            platformProviders: r
        } = e, o = _w(r), i = [yw({}), {
            provide: Ct,
            useExisting: Ew
        }, ...n || []], s = new co({
            providers: i,
            parent: o,
            debugName: "",
            runEnvironmentInitializers: !1
        });
        return Dw({
            r3Injector: s.injector,
            platformInjector: o,
            rootComponent: t
        })
    } catch (t) {
        return Promise.reject(t)
    }
}

function fR(e) {
    return typeof e == "boolean" ? e : e != null && e !== "false"
}

function pR(e, t = NaN) {
    return !isNaN(parseFloat(e)) && !isNaN(Number(e)) ? Number(e) : t
}

function hR(e, t) {
    Pe("NgSignals");
    let n = Sl(e);
    return t?.equal && (n[J].equal = t.equal), n
}

function gR(e) {
    let t = _(null);
    try {
        return e()
    } finally {
        _(t)
    }
}
var Xp = (() => {
    class e {
        view;
        node;
        constructor(n, r) {
            this.view = n, this.node = r
        }
        static __NG_ELEMENT_ID__ = Ow
    }
    return e
})();

function Ow() {
    return new Xp(y(), F())
}
var Pw = !1,
    Lw = (() => {
        class e extends lo {
            pendingTasks = D(un);
            taskId = null;
            schedule(n) {
                super.schedule(n), this.taskId === null && (this.taskId = this.pendingTasks.add(), queueMicrotask(() => this.flush()))
            }
            flush() {
                try {
                    super.flush()
                } finally {
                    this.taskId !== null && (this.pendingTasks.remove(this.taskId), this.taskId = null)
                }
            }
            static \u0275prov = P({
                token: e,
                providedIn: "root",
                factory: () => new e
            })
        }
        return e
    })(),
    rc = class {
        scheduler;
        effectFn;
        zone;
        injector;
        unregisterOnDestroy;
        watcher;
        constructor(t, n, r, o, i, s) {
            this.scheduler = t, this.effectFn = n, this.zone = r, this.injector = i, this.watcher = Ll(a => this.runEffect(a), () => this.schedule(), s), this.unregisterOnDestroy = o?.onDestroy(() => this.destroy())
        }
        runEffect(t) {
            try {
                this.effectFn(t)
            } catch (n) {
                this.injector.get(it, null, {
                    optional: !0
                })?.handleError(n)
            }
        }
        run() {
            this.watcher.run()
        }
        schedule() {
            this.scheduler.schedule(this)
        }
        destroy() {
            this.watcher.destroy(), this.unregisterOnDestroy?.()
        }
    };

function Fw() {}

function Vw(e, t) {
    Pe("NgSignals"), !t?.injector && Do(Fw);
    let n = t?.injector ?? D(We),
        r = t?.manualCleanup !== !0 ? n.get(ln) : null,
        o = new rc(n.get(Lw), e, typeof Zone > "u" ? null : Zone.current, r, n, t?.allowSignalWrites ?? !1),
        i = n.get(xw, null, {
            optional: !0
        });
    return !i || !(i._lView[I] & 8) ? o.watcher.notify() : (i._lView[Rr] ??= []).push(o.watcher.notify), o
}
var jw = Pw;
var oc = class {
    [J];
    constructor(t) {
        this[J] = t
    }
    destroy() {
        this[J].destroy()
    }
};

function Hw(e, t) {
    if (jw) return Vw(e, t);
    Pe("NgSignals"), !t?.injector && Do(Hw);
    let n = t?.injector ?? D(We),
        r = t?.manualCleanup !== !0 ? n.get(ln) : null,
        o, i = n.get(Xp, null, {
            optional: !0
        }),
        s = n.get(Ct);
    return i !== null && !t?.forceRoot ? (o = Uw(i.view, s, e), r instanceof Xr && r._lView === i.view && (r = null)) : o = qw(e, n.get(Cp), s), o.injector = n, r !== null && (o.onDestroyFn = r.onDestroy(() => o.destroy())), new oc(o)
}
var eh = de(ue({}, pt), {
        consumerIsAlwaysLive: !0,
        consumerAllowSignalWrites: !0,
        dirty: !0,
        hasRun: !1,
        cleanupFns: void 0,
        zone: null,
        onDestroyFn: Hn,
        run() {
            if (this.dirty = !1, this.hasRun && !Nn(this)) return;
            this.hasRun = !0;
            let e = r => (this.cleanupFns ??= []).push(r),
                t = $t(this),
                n = Qr(!1);
            try {
                this.maybeCleanup(), this.fn(e)
            } finally {
                Qr(n), _n(this, t)
            }
        },
        maybeCleanup() {
            if (this.cleanupFns?.length) try {
                for (; this.cleanupFns.length;) this.cleanupFns.pop()()
            } finally {
                this.cleanupFns = []
            }
        }
    }),
    Bw = de(ue({}, eh), {
        consumerMarkedDirty() {
            this.scheduler.schedule(this), this.notifier.notify(13)
        },
        destroy() {
            Ut(this), this.onDestroyFn(), this.maybeCleanup()
        }
    }),
    $w = de(ue({}, eh), {
        consumerMarkedDirty() {
            this.view[I] |= 8192, Zn(this.view), this.notifier.notify(14)
        },
        destroy() {
            Ut(this), this.onDestroyFn(), this.maybeCleanup(), this.view[vt]?.delete(this)
        }
    });

function Uw(e, t, n) {
    let r = Object.create($w);
    return r.view = e, r.zone = typeof Zone < "u" ? Zone.current : null, r.notifier = t, r.fn = n, e[vt] ??= new Set, e[vt].add(r), r.consumerMarkedDirty(r), r
}

function qw(e, t, n) {
    let r = Object.create(Bw);
    return r.fn = e, r.scheduler = t, r.notifier = n, r.zone = typeof Zone < "u" ? Zone.current : null, r.scheduler.schedule(r), r.notifier.notify(13), r
}

function mR(e, t) {
    let n = Ae(e),
        r = t.elementInjector || wo();
    return new Nt(n).create(r, t.projectableNodes, t.hostElement, t.environmentInjector)
}

function yR(e) {
    let t = Ae(e);
    if (!t) return null;
    let n = new Nt(t);
    return {
        get selector() {
            return n.selector
        },
        get type() {
            return n.componentType
        },
        get inputs() {
            return n.inputs
        },
        get outputs() {
            return n.outputs
        },
        get ngContentSelectors() {
            return n.ngContentSelectors
        },
        get isStandalone() {
            return t.standalone
        },
        get isSignal() {
            return t.signals
        }
    }
}
export {
    ue as a, de as b, Ww as c, zw as d, Gw as e, Qw as f, Zw as g, ch as h, x as i, hh as j, b as k, Te as l, qi as m, mr as n, Ah as o, wn as p, $h as q, El as r, dt as s, ui as t, jh as u, rg as v, ft as w, Y as x, Ih as y, Ee as z, Ht as A, vn as B, Bt as C, Gh as D, og as E, Fl as F, Vh as G, En as H, Uh as I, mh as J, Zh as K, vh as L, Eh as M, dh as N, In as O, Dh as P, Ch as Q, ph as R, wi as S, xh as T, bl as U, Th as V, Sh as W, kh as X, Pi as Y, Oh as Z, Ph as _, Lh as $, Fh as aa, Hh as ba, qh as ca, wl as da, Wh as ea, zh as fa, Qh as ga, C as ha, et as ia, pe as ja, Bu as ka, P as la, hg as ma, zT as na, T as oa, N as pa, ye as qa, D as ra, GT as sa, Qu as ta, Zu as ua, $r as va, QT as wa, Fg as xa, rd as ya, Be as za, id as Aa, Do as Ba, ZT as Ca, YT as Da, JT as Ea, KT as Fa, XT as Ga, eS as Ha, We as Ia, ln as Ja, un as Ka, tt as La, X as Ma, it as Na, tS as Oa, To as Pa, nS as Qa, rS as Ra, Zm as Sa, oS as Ta, iS as Ua, sS as Va, Ym as Wa, aS as Xa, Pe as Ya, zt as Za, oy as _a, iy as $a, Bn as ab, er as bb, Rc as cb, cS as db, lS as eb, uS as fb, dS as gb, fS as hb, Ac as ib, Py as jb, ko as kb, pS as lb, Vy as mb, hS as nb, gS as ob, ga as pb, mS as qb, Fo as rb, yS as sb, no as tb, rn as ub, oo as vb, ES as wb, Zc as xb, wS as yb, DS as zb, xt as Ab, Ra as Bb, gp as Cb, CS as Db, ZI as Eb, MS as Fb, _S as Gb, KI as Hb, NS as Ib, xS as Jb, uE as Kb, TS as Lb, SS as Mb, ME as Nb, _E as Ob, RS as Pb, NE as Qb, wp as Rb, TE as Sb, SE as Tb, RE as Ub, on as Vb, AS as Wb, kS as Xb, BE as Yb, eb as Zb, tb as _b, nb as $b, OS as ac, PS as bc, LS as cc, FS as dc, VS as ec, jS as fc, Lp as gc, Fp as hc, gb as ic, Vp as jc, jp as kc, vb as lc, HS as mc, Eb as nc, bb as oc, BS as pc, Cb as qc, $S as rc, Yb as sc, US as tc, qS as uc, WS as vc, ew as wc, zp as xc, tw as yc, zS as zc, GS as Ac, QS as Bc, ZS as Cc, YS as Dc, JS as Ec, ow as Fc, Gp as Gc, iw as Hc, sw as Ic, aw as Jc, cw as Kc, KS as Lc, lw as Mc, XS as Nc, eR as Oc, tR as Pc, nR as Qc, rR as Rc, oR as Sc, iR as Tc, sR as Uc, aR as Vc, cR as Wc, Kp as Xc, lR as Yc, xw as Zc, Aw as _c, kw as $c, uR as ad, dR as bd, fR as cd, pR as dd, hR as ed, gR as fd, Hw as gd, mR as hd, yR as id
};