/* Boot: load content → store → render → admin. */
(function (PF) {
  'use strict';

  async function boot() {
    const source = window.PORTFOLIO_CONTENT;
    if (!source) {
      document.getElementById('app').textContent = 'data/content.js를 불러오지 못했습니다.';
      return;
    }
    await PF.store.init(source);
    PF.app.bindGlobal();
    PF.app.render();
    document.documentElement.classList.add('is-ready');
    // Honour deep links (#chapter-web) after the first layout.
    if (location.hash && location.hash !== PF.config.admin.hash) {
      requestAnimationFrame(() => PF.scroll.scrollTo(location.hash, { instant: true }));
    }
    PF.admin.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.PF);
