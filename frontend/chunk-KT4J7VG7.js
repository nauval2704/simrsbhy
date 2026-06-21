import {
    k as y
} from "./chunk-QJBCP6KK.js";
import {
    a as i
} from "./chunk-W7XVFZVJ.js";
import {
    x as v,
    y as m
} from "./chunk-CFNDTNZN.js";
import {
    L as s,
    la as O,
    qa as j,
    ra as D,
    s as u,
    t as r,
    x as o,
    yb as l
} from "./chunk-UYVTZL26.js";
var ua = new v,
    L = (() => {
        class c {
            constructor(e) {
                this.http = e
            }
            search(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/caripasien/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            searchDokter(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/caridokter/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienPelayanan(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasien/pelayanan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienIgd() {
                return this.http.get(i.apiUrl + "/simrsba/caripasien/pelayanan/INSTALASI GAWAT DARURAT").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getPasienPoli() {
                return this.http.get(i.apiUrl + "/simrsba/caripasienpoli").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getPasienInap() {
                return this.http.get(i.apiUrl + "/simrsba/caripasieninap").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getPasienIgdNorm(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/norm/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienPoliNorm(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasienpoli/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienInapNorm(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasieninap/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienIgdNoCheckin(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasien/pelayanan/IGD/nocheckin/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienPolidNoCheckin(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasienpolinocheckin/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPasienInapNoCheckin(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasieninapnocheckin/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            caripasiennocheckin(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasiennocheckin/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            updateCounter(e) {
                return this.http.get(i.apiUrl + "/simrsba/updatecounter/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataSepSimrs(e) {
                return this.http.get(i.apiUrl + "/simrsba/getDataSepSimrs/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataSepSimrsNoKartu(e) {
                return this.http.get(i.apiUrl + "/simrsba/getDataSepSimrsNoKartu/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            caripasiennokartu(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasiennokartu/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            caripasiennorujukan(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasiennorujukan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            caripasiennomr(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasiennomr/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            checkNoSep(e) {
                return this.http.get(i.apiUrl + "/simrsba/checknosep/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            caripasiennosep(e) {
                return this.http.get(i.apiUrl + "/simrsba/caripasiennosep/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            searchDPJP(e, a, t, n) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/dpjp/" + a + "/" + t + "/" + n).pipe(s(h => {
                    let p = "BACKEND SERVER DISCONNECTED!!";
                    if (!h || !h.error) return r(p);
                    switch (h.error.message) {
                        case "ERROR_CHECKPASIEN":
                            p = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            p = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(p)
                }))
            }
            getCaraPulang(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/carakeluar/").pipe(o(a => a))
            }
            getDiagnosa(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/diagnosa/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDokter(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/dokter/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            countSep(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/countSep/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            countNoRujukan(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/countNoRujukan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getFaskes(e, a) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/faskes/" + e + "/" + a).pipe(s(t => {
                    let n = "BACKEND SERVER DISCONNECTED!!";
                    if (!t || !t.error) return r(n);
                    switch (t.error.message) {
                        case "ERROR_CHECKPASIEN":
                            n = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            n = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(n)
                }))
            }
            getProcedure(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/tindakan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getObatPrb(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/obatprb/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getProgramPrb() {
                return this.http.get(i.apiUrl + "/vclaim/api/diagnosaprb").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getKelasRawat() {
                return this.http.get(i.apiUrl + "/vclaim/api/kelasrawat").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getSpesialistik() {
                return this.http.get(i.apiUrl + "/vclaim/api/spesialistik").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getCaraKeluar() {
                return this.http.get(i.apiUrl + "/vclaim/api/carakeluar").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getPropinsi() {
                return this.http.get(i.apiUrl + "/vclaim/api/propinsi").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getDatiII(e) {
                return this.http.get(i.apiUrl + "/vclaim/api/kabupaten/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getKecamatan(e) {
                return this.http.get(i.apiUrl + "/vclaim/api/kecamatan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPascaPulang() {
                return this.http.get(i.apiUrl + "/vclaim/api/pascapulang").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getRuangRawat() {
                return this.http.get(i.apiUrl + "/vclaim/api/ruangrawat").pipe(s(e => {
                    let a = "BACKEND SERVER DISCONNECTED!!";
                    if (!e || !e.error) return r(a);
                    switch (e.error.message) {
                        case "ERROR_CHECKPASIEN":
                            a = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            a = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(a)
                }))
            }
            getPoli(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/poli/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataKunjunganNoSep(e) {
                return this.http.get(i.apiUrl + "/simrsba/caridatakunjungannosep/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataKunjungan(e) {
                return this.http.get(i.apiUrl + "/simrsba/caridatakunjungan/" + e).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getPoliRujukan(e, a) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/vclaim/api/poliRujukan/kode/" + e + "/tanggal/" + a).pipe(o(t => t))
            }
            getRuang(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/cariruang/" + e).pipe(o(a => a))
            }
            getPasienBaru() {
                return this.http.get(i.apiUrl + "/simrsba/pasienbaru").pipe(o(e => e))
            }
            getPasienNorm(e) {
                return e === "" ? u([]) : this.http.get(i.apiUrl + "/simrsba/caripasien/norm/" + e).pipe(o(a => a))
            }
            insertSep(e, a, t, n, h, p, C, b, S, N, R, E, P, f, M, I, K, A, T, _, U, w, B, H, g, k, J, x, F, G, z, W, q, Q, X, Y, Z, $) {
                return this.http.post(i.apiUrl + "/simrsba/saveSep", {
                    noSep: e,
                    noKartu: a,
                    tglSep: t,
                    ppkPelayanan: n,
                    jnsPelayanan: h,
                    klsRawatHak: p,
                    klsRawatNaik: C,
                    pembiayaan: b,
                    penanggungJawab: S,
                    noMR: N,
                    asalRujukan: R,
                    tglRujukan: E,
                    noRujukan: P,
                    ppkRujukan: f,
                    catatan: M,
                    diagAwal: I,
                    tujuan: K,
                    eksekutif: A,
                    cob: T,
                    katarak: _,
                    lakaLantas: U,
                    noLP: w,
                    tglKejadian: B,
                    keterangan: H,
                    suplesi: g,
                    noSepSuplesi: k,
                    kdPropinsi: J,
                    kdKabupaten: x,
                    kdKecamatan: F,
                    tujuanKunj: G,
                    flagProcedure: z,
                    kdPenunjang: W,
                    assesmentPel: q,
                    noSurat: Q,
                    kodeDPJP: X,
                    dpjpLayan: Y,
                    noTelp: Z,
                    user: $
                }).pipe(s(V => {
                    let d = "BACKEND SERVER DISCONNECTED!!";
                    if (!V || !V.error) return r(d);
                    switch (V.error.message) {
                        case "ERROR_CHECKPASIEN":
                            d = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            d = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(d)
                }))
            }
            insertRujukan(e, a, t, n, h, p, C, b, S, N, R, E, P, f, M, I, K, A, T, _, U, w, B, H) {
                return this.http.post(i.apiUrl + "/simrsba/rujukan/insert", {
                    AsalRujukanKode: e,
                    AsalRujukanNama: a,
                    diagnosaKode: t,
                    diagnosaNama: n,
                    noRujukan: h,
                    pesertaAsuransi: p,
                    pesertaHakKelas: C,
                    pesertaJnsPeserta: b,
                    pesertaKelamin: S,
                    pesertaNama: N,
                    pesertaNoKartu: R,
                    pesertaNoMr: E,
                    pesertaTglLahir: P,
                    poliTujuanKode: f,
                    poliTujuanNama: M,
                    tglBerlakuKunjungan: I,
                    tglRencanaKunjungan: K,
                    tglRujukan: A,
                    tujuanRujukanKode: T,
                    tujuanRujukanNama: _,
                    jenisPelayanan: U,
                    catatan: w,
                    tipeRujukan: B,
                    user: H
                }).pipe(s(g => {
                    let k = "BACKEND SERVER DISCONNECTED!!";
                    if (!g || !g.error) return r(k);
                    switch (g.error.message) {
                        case "ERROR_CHECKPASIEN":
                            k = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            k = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(k)
                }))
            }
            insertPrb(e, a, t, n, h, p, C, b, S, N) {
                return this.http.post(i.apiUrl + "/vclaim/api/prb/insert", {
                    noSep: e,
                    noKartu: a,
                    alamat: t,
                    email: n,
                    programPRB: h,
                    kodeDPJP: p,
                    keterangan: C,
                    saran: b,
                    user: S,
                    obat: N
                }).pipe(s(R => {
                    let E = "BACKEND SERVER DISCONNECTED!!";
                    if (!R || !R.error) return r(E);
                    switch (R.error.message) {
                        case "ERROR_CHECKPASIEN":
                            E = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            E = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(E)
                }))
            }
            getDataRujukanLokal(e) {
                return this.http.post(i.apiUrl + "/simrsba/rujukan/lokal", {
                    noRujukan: e
                }).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataRujukanLokalKartu(e) {
                return this.http.post(i.apiUrl + "/simrsba/rujukan/lokal/kartu", {
                    noKartu: e
                }).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            checkpasien(e) {
                return this.http.post(i.apiUrl + "/simrsba/checkpasien", {
                    norm: e
                }).pipe(s(a => {
                    let t = "BACKEND SERVER DISCONNECTED!!";
                    if (!a || !a.error) return r(t);
                    switch (a.error.message) {
                        case "ERROR_CHECKPASIEN":
                            t = "Pasien Sudah Checkin, Silahkan Checkout Terlebih dahulu";
                            break;
                        case "ERROR_NORM":
                            t = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(t)
                }))
            }
            getDataKamar() {
                return this.http.get(i.apiUrl + "/vclaim/api/kamar/tersedia").pipe(o(e => e.response.list))
            }
            getDataKamarLocal() {
                return this.http.get(i.apiUrl + "/vclaim/api/kamar/local")
            }
            checkKunjungan(e) {
                return this.http.get(i.apiUrl + "/simrsba/carisuratkontrol/" + e).pipe(o(a => a))
            }
            updateRuangCheckin(e, a, t) {
                return this.http.post(i.apiUrl + "/simrsba/updateruang", {
                    namaruang: e,
                    tersedia: a,
                    tersediapriawanita: t
                }).pipe(s(n => {
                    let h = "BACKEND SERVER DISCONNECTED!!";
                    if (!n || !n.error) return r(h);
                    switch (n.error.message) {
                        case "ERROR_CHECKPASIEN":
                            h = "Pasien Sudah Terdaftar di Rawat Jalan";
                            break;
                        case "ERROR_NORM":
                            h = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(h)
                }))
            }
            updateRsonline() {
                return this.http.get(i.apiUrl + "/rsonline/fasyankes/update").pipe(o(e => e))
            }
            getRiwayat(e) {
                return this.http.get(i.apiUrl + "/simrsba/getriwayat/" + e).pipe(o(a => a))
            }
            updateIo(e, a, t) {
                return this.http.post(i.apiUrl + "/simrsba/updatetglio", {
                    noCheckin: e,
                    tglCheckin: a,
                    tglCheckout: t
                }).pipe(s(n => {
                    let h = "BACKEND SERVER DISCONNECTED!!";
                    if (!n || !n.error) return r(h);
                    switch (n.error.message) {
                        case "ERROR_CHECKPASIEN":
                            h = "Pasien Sudah Terdaftar di Rawat Jalan";
                            break;
                        case "ERROR_NORM":
                            h = "No. RM sudah terdaftar!!. Silahkan coba beberapa saat lg";
                            break
                    }
                    return r(h)
                }))
            }
            static {
                this.\u0275fac = function(a) {
                    return new(a || c)(j(m))
                }
            }
            static {
                this.\u0275prov = O({
                    token: c,
                    factory: c.\u0275fac,
                    providedIn: "root"
                })
            }
        }
        return c
    })();
var Ca = (() => {
    class c {
        constructor() {
            this.http = D(m), this.toastr = D(y), this.dataPasienService = D(L), this.apiUrl = i.apiUrl, this.listDivisi = l([]), this.selectedPatient = l(null), this.dataLocation = l(null), this.dataIhsPatient = l(null), this.dataIhsPractitioner = l(null), this.dataEncounter = l(null), this.dataDiagnosis = l(null), this.dataCondition = l(null), this.noCheckin = l(""), this.tglCheckin = l(""), this.routerInfo = l(null)
        }
        initValuesSatuSehat() {
            this.selectedPatient.set(null), this.dataLocation.set(null), this.dataIhsPatient.set(null), this.dataIhsPractitioner.set(null), this.dataEncounter.set(null), this.dataCondition.set(null), this.dataDiagnosis.set(null), this.noCheckin.set(""), this.tglCheckin.set("")
        }
        getClassName(e) {
            switch (e) {
                case "IGD":
                    return "emergency";
                case "POLI":
                    return "ambulatory";
                case "INAP":
                    return "INP";
                default:
                    return "defaultClassName"
            }
        }
        getClassCode(e) {
            switch (e) {
                case "IGD":
                    return "EMER";
                case "POLI":
                    return "AMB";
                case "INAP":
                    return "INP";
                default:
                    return "defaultClassName"
            }
        }
        addDivisi(e) {
            this.listDivisi.set(e)
        }
        createOrganization(e) {
            return this.http.post(this.apiUrl + "/satusehat/organization/create", e)
        }
        createLocation(e) {
            return this.http.post(this.apiUrl + "/satusehat/location/create", e)
        }
        getDivisi() {
            return this.http.get(this.apiUrl + "/satusehat/organization/search/partof")
        }
        getIhsPatient(e) {
            return this.http.post(this.apiUrl + "/satusehat/patient/search/nik", e)
        }
        createEncounter(e) {
            return this.http.post(this.apiUrl + "/satusehat/encounter/create", e)
        }
        updateEncounterTriase(e) {
            return this.http.post(this.apiUrl + "/satusehat/encounter/updatetriase", e)
        }
        updateEncounterFinished(e) {
            return this.http.post(this.apiUrl + "/satusehat/encounter/updatefinished", e)
        }
        createDiagnosis(e) {
            return this.http.post(this.apiUrl + "/satusehat/condition/diagnosis/create", e)
        }
        getEncounter(e) {
            return this.http.post(this.apiUrl + "/satusehat/encounter/detail", e)
        }
        getCondition(e) {
            return this.http.post(this.apiUrl + "/satusehat/condition/detail", e)
        }
        getIhsPractitioner(e) {
            return this.http.post(this.apiUrl + "/satusehat/practitioner/search/nik", e)
        }
        getIhsPractitionerByTerm(e) {
            return this.http.post(this.apiUrl + "/satusehat/practitioner/list/search", {
                term: e
            })
        }
        getListPractitioner() {
            return this.http.get(this.apiUrl + "/satusehat/practitioner/list")
        }
        getSelectedPatient() {
            this.dataPasienService.getPasienIgdNoCheckin(this.selectedPatient().noCheckin).subscribe({
                next: e => {
                    this.dataLocation.set(null), this.selectedPatient.set(e[0])
                },
                error: () => {},
                complete: () => {}
            })
        }
        handleSuccessResponse(e, a) {
            if (e.data?.issue?.length > 0) {
                this.handleErrorResponseDetails(e);
                return
            }
            if (a === "Encounter") {
                this.getSelectedPatient(), this.dataEncounter.set(e), this.toastr.success(a + " berhasil di create", "Success", {});
                return
            }
            if (a === "Condition - Diagnosis") {
                this.getSelectedPatient(), this.dataCondition.set(e), this.toastr.success(a + " berhasil di create", "Success", {});
                return
            }
            if (a === "Triase" || a === "Finished") {
                this.getSelectedPatient(), this.dataEncounter.set(e), this.toastr.success("Encounter berhasil di update", "Success", {});
                return
            }
            if (a === "Data Encounter" || a === "Data Condition") {
                this.toastr.success(a + " Successfully loaded!.", "Success", {});
                return
            }
            this.toastr.success(a + " berhasil di create", "Success", {})
        }
        handleErrorResponseDetails(e) {
            if (e.data?.issue[0]?.details?.text === "Invalid query") return;
            let a = e.data?.issue[0]?.details?.text;
            this.toastr.error(a, "Error", {})
        }
        handleErrorResponse(e) {
            e && this.toastr.error("UNKNOWN ERROR, please contact administrator", "Error", {})
        }
        static {
            this.\u0275fac = function(a) {
                return new(a || c)
            }
        }
        static {
            this.\u0275prov = O({
                token: c,
                factory: c.\u0275fac,
                providedIn: "root"
            })
        }
    }
    return c
})();
export {
    L as a, Ca as b
};