(function () {
  const originalFetch = window.fetch;
  const apiOrigin = window.location.hostname === 'localhost'
    ? 'http://localhost:1822'
    : 'http://36.66.36.106:1822';
  const apiPaths = ['/simrsba/', '/farmasi/', '/apotek/', '/gudang/', '/operasi/', '/admisi/'];

  function isApiRequest(input) {
    const url = typeof input === 'string' ? input : input && input.url;
    if (!url) return false;
    if (url.startsWith('/') || url.startsWith(apiOrigin)) return true;
    try {
      const pathname = new URL(url, window.location.origin).pathname;
      return apiPaths.some((path) => pathname.startsWith(path));
    } catch (error) {
      return false;
    }
  }

  function getToken() {
    try {
      const rawAccessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (rawAccessToken) {
        let parsedToken;
        try { parsedToken = JSON.parse(rawAccessToken); } catch (error) { parsedToken = rawAccessToken; }
        if (typeof parsedToken === 'string') return normalizeToken(parsedToken);
        if (parsedToken && (parsedToken.idToken || parsedToken.token)) return normalizeToken(parsedToken.idToken || parsedToken.token);
      }

      const rawUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user && (user.idToken || user.token)) return normalizeToken(user.idToken || user.token);
      }

      return normalizeToken(localStorage.getItem('idToken') || localStorage.getItem('token') || sessionStorage.getItem('token') || '');
    } catch (error) {
      return '';
    }
  }

  function normalizeToken(token) {
    return String(token || '').trim().replace(/^Bearer\s+/i, '').replace(/^"|"$/g, '');
  }

  window.fetch = function (input, init) {
    const token = isApiRequest(input) ? getToken() : '';

    if (!token) return originalFetch.call(this, input, init);

    const headers = new Headers((init && init.headers) || (input && input.headers) || {});
    if (!headers.has('x-token')) headers.set('x-token', token);
    if (!headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + token);

    return originalFetch.call(this, input, Object.assign({}, init, { headers }));
  };

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__authApiRequest = isApiRequest(url);
    return originalOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    if (this.__authApiRequest) {
      const token = getToken();
      if (token) {
        this.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }
    return originalSend.call(this, body);
  };
})();
