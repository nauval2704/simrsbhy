class SuratCanvas extends HTMLElement {
  constructor() {
    super();
    this._mode = 'pen';
    this._color = '#000000';
    this._width = 2;
    this.isDrawing = false;
    this._canvasDataUrl = null;
  }

  get canvasDataUrl() {
    return this._canvasDataUrl;
  }

  set canvasDataUrl(url) {
    this._canvasDataUrl = url;
    if (url) {
      this.loadDataUrl(url);
    }
  }

  connectedCallback() {
    if (this.querySelector('.surat-body')) return;

    const originalContent = this.innerHTML;

    this.innerHTML = `
<div class="surat-body">
  <div class="surat-toolbar">
    <button id="rp-back-btn" style="display:none;">Kembali</button>
    <div class="toolbar-sep"></div>
    <label>Tebal:</label>
    <input type="range" id="rp-width" min="1" max="10" value="2" title="Ketebalan">
    <div class="toolbar-sep"></div>
    <button id="rp-eraser-btn">Hapus</button>
    <button id="rp-clear-btn">Clear</button>
    <div class="toolbar-sep"></div>
    <button id="rp-zoom-out-btn" title="Perkecil">-</button>
    <button id="rp-zoom-in-btn" title="Perbesar">+</button>
    <div class="toolbar-sep"></div>
    <button id="rp-fs-btn">Layar Penuh</button>
    <button id="rp-print-btn">Cetak / PDF</button>
    <button id="rp-submit-btn">Simpan Draft</button>
  </div>
  <div class="surat-document">
    <canvas class="surat-canvas" id="rp-canvas"></canvas>
    <div class="surat-content">
      ${originalContent}
    </div>
  </div>
</div>`;

    this.attachEvents();
    setTimeout(() => {
      this.initCanvas();
      if (this.canvasDataUrl) {
        this.loadDataUrl(this.canvasDataUrl);
      }
    }, 50);
  }

  attachEvents() {
    this.querySelector('#rp-back-btn').addEventListener('click', () => {
      document.exitFullscreen().catch(() => {});
    });
    this.querySelector('#rp-eraser-btn').addEventListener('click', (e) => {
      if (this._mode === 'pen') {
        this._mode = 'eraser';
        e.target.classList.add('active');
      } else {
        this._mode = 'pen';
        e.target.classList.remove('active');
      }
    });
    this.querySelector('#rp-clear-btn').addEventListener('click', () => {
      if (!confirm('Bersihkan seluruh coretan?')) return;
      const canvas = this.querySelector('#rp-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    this.querySelector('#rp-zoom-in-btn').addEventListener('click', () => {
      const doc = this.querySelector('.surat-document');
      const currentZoom = parseFloat(getComputedStyle(doc).zoom) || 1;
      doc.style.zoom = currentZoom + 0.1;
    });
    this.querySelector('#rp-zoom-out-btn').addEventListener('click', () => {
      const doc = this.querySelector('.surat-document');
      const currentZoom = parseFloat(getComputedStyle(doc).zoom) || 1;
      doc.style.zoom = Math.max(0.2, currentZoom - 0.1);
    });
    this.querySelector('#rp-fs-btn').addEventListener('click', () => {
      const body = this.querySelector('.surat-body');
      if (!document.fullscreenElement) {
        (body || document.documentElement).requestFullscreen().catch(() => {});
      }
    });
    this.querySelector('#rp-print-btn').addEventListener('click', () => window.print());
    this.querySelector('#rp-submit-btn').addEventListener('click', (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.textContent = 'Menyimpan...';
      this.dispatchEvent(new CustomEvent('save', { detail: { canvasData: this.toDataURL() } }));
    });
    this.querySelector('#rp-width').addEventListener('input', (e) => {
      this._width = parseFloat(e.target.value);
    });

    document.addEventListener('fullscreenchange', () => {
      const fsBtn = this.querySelector('#rp-fs-btn');
      const backBtn = this.querySelector('#rp-back-btn');
      if (!fsBtn || !backBtn) return;
      if (document.fullscreenElement) {
        fsBtn.style.display = 'none';
        backBtn.style.display = 'block';
      } else {
        fsBtn.style.display = 'block';
        backBtn.style.display = 'none';
      }
    });
  }

  initCanvas() {
    const canvas = this.querySelector('#rp-canvas');
    if (!canvas) return;

    const W = 816;
    const H = 1247;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const activePointers = new Set();

    canvas.addEventListener('pointerdown', (e) => {
      activePointers.add(e.pointerId);
      if (activePointers.size > 1) {
        if (this.isDrawing) {
          ctx.closePath();
          this.isDrawing = false;
        }
        return; // Ignore multi-touch to allow native pan/zoom
      }

      if (e.pointerType !== 'pen' && e.pointerType !== 'mouse' && e.pointerType !== 'touch') return;
      this.isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      ctx.beginPath();
      ctx.moveTo(x, y);

      if (this._mode === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 20;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = this._color;
        let pressure = e.pressure !== undefined ? Number(e.pressure) : 0.5;
        if (isNaN(pressure) || pressure <= 0 || pressure > 1) pressure = 0.5;
        ctx.lineWidth = this._width * (pressure * 2.5);
      }
      if (e.pointerType !== 'touch') e.preventDefault();
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!this.isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      if (this._mode === 'pen') {
        let pressure = e.pressure !== undefined ? Number(e.pressure) : 0.5;
        if (isNaN(pressure) || pressure <= 0 || pressure > 1) pressure = 0.5;
        ctx.lineWidth = this._width * (pressure * 2.5);
      }
      ctx.lineTo(x, y);
      ctx.stroke();
      if (e.pointerType !== 'touch') e.preventDefault();
    });

    const removePointer = (e) => {
      activePointers.delete(e.pointerId);
      if (this.isDrawing) {
        ctx.closePath();
        this.isDrawing = false;
      }
    };
    canvas.addEventListener('pointerup', removePointer);
    canvas.addEventListener('pointerout', removePointer);
    canvas.addEventListener('pointercancel', removePointer);
  }

  loadDataUrl(url) {
    if (!url) return;
    this._canvasDataUrl = url;
    const canvas = this.querySelector('#rp-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 816, 1247);
    };
    img.src = url;
  }

  toDataURL() {
    const canvas = this.querySelector('#rp-canvas');
    return canvas ? canvas.toDataURL('image/png') : null;
  }

  resetSubmitButton() {
    const btn = this.querySelector('#rp-submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Simpan Draft';
    }
  }

  setSubmitSuccess() {
    const btn = this.querySelector('#rp-submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Tersimpan';
      setTimeout(() => {
        btn.textContent = 'Simpan Draft';
      }, 3000);
    }
  }
}
customElements.define('surat-canvas', SuratCanvas);
