class SimrsPatientSidebar extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._moduleType = null;
    this._router = null;
    this._route = null;
  }

  set config(cfg) {
    if (!cfg || !cfg.data) return;
    this._data = cfg.data;
    this._moduleType = cfg.moduleType;
    this._router = cfg.router;
    this._route = cfg.route;
    this.render();
  }

  navigate(path) {
    if (this._router && this._route && this._data) {
      const noParamRoutes = ["satusehat"];
      if (noParamRoutes.includes(path)) {
        this._router.navigate([path], {
          relativeTo: this._route,
          info: { pelayanan: this._moduleType },
        });
      } else {
        this._router.navigate([path, this._data.noCheckin], {
          relativeTo: this._route,
        });
      }
    }
  }

  _buildMenus() {
    if (this._moduleType === "IGD") {
      return `
                <a href="javascript:void(0)" data-path="satusehat" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> SATUSEHAT</a>
                <a href="javascript:void(0)" data-path="triase" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Triase</a>
                <a href="javascript:void(0)" data-path="igd" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Pelayanan IGD</a>
                <a href="javascript:void(0)" data-path="farmasi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Obat / BHP</a>
                <a href="javascript:void(0)" data-path="lab" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input LAB</a>
                <a href="javascript:void(0)" data-path="radiologi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input RADIOLOGI</a>
                <a href="javascript:void(0)" data-path="cppt-igd" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> CPPT IGD</a>
                <a href="javascript:void(0)" data-path="ringkasan-pulang" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Ringkasan Pulang</a>
                <a href="javascript:void(0)" data-path="pemberian-obat" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Pemberian Obat</a>
            </div>
            <div class="list-group mb-1">
                    <a href="javascript:void(0)" data-path="rincian" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Billing</a>
                    <a href="javascript:void(0)" data-path="checkout" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Checkout</a>
                    <a href="javascript:void(0)" data-path="transferinap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Transfer Inap</a>
                    <a href="javascript:void(0)" data-path="rujuk" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Rujuk Inap</a>
                </div>
            `;
    } else if (this._moduleType === "POLI") {
        const poliStr = (this._data && this._data.poli) ? this._data.poli.toUpperCase() : '';
        const poliNamaStr = (this._data && this._data.poliNama) ? this._data.poliNama.toUpperCase() : '';
        const isPoliGigi = poliStr.includes('GIGI') || poliNamaStr.includes('GIGI');
      
      const specificLinks = isPoliGigi 
        ? `<a href="javascript:void(0)" data-path="poli-gigi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> PRMRJ Poli Gigi</a>`
        : `<a href="javascript:void(0)" data-path="edukasi-poli" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Edukasi Pasien</a>
           <a href="javascript:void(0)" data-path="prmrj" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> PRMRJ</a>`;

      return `
                <a href="javascript:void(0)" data-path="satusehat" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> SATUSEHAT</a>
                ${specificLinks}
                <a href="javascript:void(0)" data-path="poli" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Pelayanan POLI</a>
                <a href="javascript:void(0)" data-path="farmasi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Obat / BMHP</a>
                <a href="javascript:void(0)" data-path="lab" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input LAB</a>
                <a href="javascript:void(0)" data-path="radiologi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input RADIOLOGI</a>
            </div>
            <div class="list-group mb-1">
                    <a href="javascript:void(0)" data-path="rincianpoli" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Billing</a>
                    <a href="javascript:void(0)" data-path="pindahpoli" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Rujuk Internal</a>
                    <a href="javascript:void(0)" data-path="checkoutpoli" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Checkout</a>
                    <a href="javascript:void(0)" data-path="transferinap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Transfer Inap</a>
                    <a href="javascript:void(0)" data-path="rujuk" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Rujuk</a>
                </div>
            `;
    } else {
      // INAP
      return `
                <a href="javascript:void(0)" data-path="satusehat" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> SATUSEHAT</a>
                <a href="javascript:void(0)" data-path="inap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Pelayanan Inap</a>
                <a href="javascript:void(0)" data-path="kamar-bedah" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Kamar Bedah</a>
                <a href="javascript:void(0)" data-path="farmasi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input Obat / BHP</a>
                <a href="javascript:void(0)" data-path="lab" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input LAB</a>
                <a href="javascript:void(0)" data-path="radiologi" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Input RADIOLOGI</a>
            </div>
            <div class="list-group mb-1">
                    <a href="javascript:void(0)" data-path="rincianinap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Billing</a>
                    <a href="javascript:void(0)" data-path="checkoutinap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Checkout</a>
                    <a href="javascript:void(0)" data-path="rujukinap" class="list-group-item list-group-item-action"><i class="bi bi-chevron-right"></i> Rujuk</a>
                </div>
            `;
    }
  }

  render() {
    const d = this._data;
    const showCheckin = this._moduleType !== "INAP";
    const showNik = this._moduleType !== "INAP";

    this.innerHTML = `
            <div class="card g-0 small mb-1">
                <div class="card-header text-center bg-success text-light">
                    <img src="assets/img/avatar.jpeg" class="img-fluid rounded-circle" width="200" height="200" alt="...">
                    <h6 class="text-uppercase text-light fw-bold lh-1 my-2" id="spd-nama">${d.nama || "-"}</h6>
                    <span class="text-warning fw-bold h4" id="spd-cabar">${d.cabar || "-"}</span><br>
                    <span class="text-warning" id="spd-jnsPeserta">${d.jnsPeserta || "-"}</span>
                </div>
                <div class="card-body lh-1 p-1">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <tbody>
                                ${
                                  showCheckin
                                    ? `
                                <tr><th scope="row" class="text-end">No. Checkin</th><td id="spd-noCheckin">${d.noCheckin || "-"}</td></tr>
                                <tr><th scope="row" class="text-end">Tgl. Checkin</th><td id="spd-tglInput">${d.tglInput || "-"}</td></tr>
                                `
                                    : ""
                                }
                                <tr><th scope="row" class="text-end">No.RM</th><td id="spd-noMr">${d.noMr || "-"}</td></tr>
                                <tr><th scope="row" class="text-end">Tgl.Lahir</th><td id="spd-tglLahir">${d.tglLahir || "-"}</td></tr>
                                <tr><th scope="row" class="text-end">J.Kelamin</th><td id="spd-kelamin">${d.kelamin || "-"}</td></tr>
                                ${showNik ? `<tr><th scope="row" class="text-end">NIK</th><td id="spd-nik">${d.nik || "-"}</td></tr>` : ""}
                                <tr><th scope="row" class="text-end">No. Kartu</th><td id="spd-noKartu">${d.noKartu || d.noBpjs || "-"}</td></tr>
                                <tr><th scope="row" class="text-end">Diagnosa</th><td id="spd-diagnosa">${d.diagnosa || "-"}</td></tr>
                                <tr><th scope="row" class="text-end">DPJP</th><td id="spd-dpjp">${d.dpjp || "-"}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="list-group mb-1" id="spd-menu-container">
                <button type="button"
                    class="list-group-item list-group-item-action list-group-item-warning border"
                    id="spd-icare-btn">
                    <i class="bi bi-chevron-right"></i> iCare JKN
                </button>
                ${this._buildMenus()}
            </div>
        `;

    this.querySelectorAll("a[data-path]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        this.querySelectorAll("a[data-path]").forEach((el) =>
          el.classList.remove("active"),
        );
        a.classList.add("active");
        this.navigate(a.getAttribute("data-path"));
      });
    });

    const pathParts = window.location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    const secondToLast = pathParts[pathParts.length - 2];

    let activeLink = this.querySelector('a[data-path="' + lastPart + '"]');
    if (!activeLink && secondToLast) {
      activeLink = this.querySelector('a[data-path="' + secondToLast + '"]');
    }

    if (activeLink) {
      activeLink.classList.add("active");
    } else {
      const defaultSeg =
        this._moduleType === "POLI"
          ? "poli"
          : this._moduleType === "INAP"
            ? "inap"
            : "igd";
      const defaultLink = this.querySelector(
        'a[data-path="' + defaultSeg + '"]',
      );
      if (defaultLink) defaultLink.classList.add("active");
    }

    const icareBtn = this.querySelector("#spd-icare-btn");
    if (icareBtn) {
      icareBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof this.onIcareClick === "function") this.onIcareClick();
      });
    }
  }
}

customElements.define("simrs-patient-sidebar", SimrsPatientSidebar);
