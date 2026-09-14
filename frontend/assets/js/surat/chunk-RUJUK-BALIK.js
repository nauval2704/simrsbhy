var RujukBalikComponent = (() => {
  class RujukBalikComponent {
    static render(data) {
      const noMr = data?.noMr || data?.norm || '-';
      const nama = data?.nama || '-';
      const noCheckin = data?.noCheckin || '-';

      // Find or create container
      let container = document.getElementById('rujukbalik-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'rujukbalik-container';
        container.style.cssText = 'padding: 20px; max-width: 1200px; margin: 0 auto;';

        // Find app-root and append container
        const appRoot = document.querySelector('app-root');
        if (appRoot) {
          // Try to find router-outlet and insert after it
          const routerOutlet = appRoot.querySelector('router-outlet');
          if (routerOutlet && routerOutlet.parentNode) {
            routerOutlet.parentNode.insertBefore(container, routerOutlet.nextSibling);
          } else {
            appRoot.appendChild(container);
          }
        } else {
          document.body.appendChild(container);
        }
      }

      container.innerHTML = `
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-primary text-white py-3">
            <h5 class="mb-0"><i class="bi bi-arrow-clockwise me-2"></i>Rujuk Balik</h5>
          </div>
          <div class="card-body">
            <div class="row g-3 mb-3">
              <div class="col-md-3">
                <label class="f-label">No. RM</label>
                <input type="text" class="f-input" value="${noMr}" disabled style="background:#e9ecef;">
              </div>
              <div class="col-md-4">
                <label class="f-label">Nama Pasien</label>
                <input type="text" class="f-input" value="${nama}" disabled style="background:#e9ecef;">
              </div>
              <div class="col-md-3">
                <label class="f-label">No. Checkin</label>
                <input type="text" class="f-input" value="${noCheckin}" disabled style="background:#e9ecef;">
              </div>
            </div>

            <div class="alert alert-info py-2">
              <i class="bi bi-info-circle me-1"></i>
              Fitur Rujuk Balik sedang dalam pengembangan.
            </div>
          </div>
        </div>
      `;
    }
  }

  return RujukBalikComponent;
})();

export { RujukBalikComponent };
