/* App shell: theme tokens from settings, header/nav/side indicator/footer, lightbox,
   full-page render pipeline and global link handling. */
(function (PF) {
  'use strict';
  const { h, ui } = PF;
  const root = () => document.getElementById('app');

  /* ---------- Theme (settings → CSS custom properties) ---------- */
  function applyTheme(settings) {
    const t = settings.theme || {};
    const style = document.documentElement.style;
    const map = { accent: '--ref-accent', onAccent: '--ref-accent-on', fontSans: '--ref-font-sans', fontDisplay: '--ref-font-display' };
    Object.entries(map).forEach(([key, prop]) => (t[key] ? style.setProperty(prop, t[key]) : style.removeProperty(prop)));
    const meta = settings.meta || {};
    document.title = meta.title || document.title;
    document.documentElement.lang = meta.lang || 'ko';
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) { desc = h('meta', { name: 'description' }); document.head.append(desc); }
    desc.setAttribute('content', meta.description || '');
  }

  /* ---------- Derived data ---------- */
  function chapters(content) {
    return content.sections.map((s, i) => ({ s, i })).filter(({ s }) => s.visible !== false && PF.sections[s.type]?.isChapter)
      .map(({ s, i }) => ({ id: s.id, number: s.number, title: s.title, subtitle: s.subtitle, media: s.media, path: `sections.${i}`, navLabel: s.navLabel }));
  }

  function navItems(content) {
    const items = content.sections.filter((s) => s.visible !== false && s.navLabel).map((s) => ({ label: s.navLabel, href: `#${s.id}`, id: s.id }));
    return items.concat((content.settings.nav?.extra || []).map((l) => Object.assign({ id: '' }, l)));
  }

  /* ---------- Header ---------- */
  function header(content) {
    const st = content.settings;
    const items = st.header?.showChapterNav === false ? [] : navItems(content);
    const linkAttrs = (l) => Object.assign({ href: l.href, dataset: { navId: l.id || '' } }, l.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {});

    const menu = h('dialog', { class: 'menu', 'aria-label': ui.label('menu') },
      h('div', { class: 'menu__inner' },
        h('button', { class: 'icon-btn menu__close', type: 'button', 'aria-label': ui.label('close'), on: { click: () => menu.close() } }, h('span', { class: 'icon icon--close', 'aria-hidden': 'true' })),
        h('nav', { class: 'menu__nav' }, h('ol', null, items.map((l, i) => h('li', { style: { '--i': i } }, h('a', Object.assign(linkAttrs(l), { on: { click: () => menu.close() } }), l.label)))))));

    const bar = h('header', { class: 'site-header', 'data-theme': 'black' },
      h('a', { class: 'skip-link', href: '#main' }, ui.label('skip')),
      h('div', { class: 'site-header__inner container' },
        h('a', { class: 'brand', href: `#${content.sections[0]?.id || ''}`, dataset: { edit: 'settings.brand.name', editKind: 'text' } }, st.brand?.name || ''),
        h('nav', { class: 'site-nav', 'aria-label': 'Primary' }, h('ul', null, items.map((l) => h('li', null, h('a', Object.assign(linkAttrs(l), { class: 'site-nav__link' }), l.label))))),
        h('div', { class: 'site-header__actions' },
          ui.button(st.header?.cta, 'settings.header.cta', 'tonal'),
          h('button', { class: 'icon-btn site-header__menu', type: 'button', 'aria-label': ui.label('menu'), 'aria-haspopup': 'dialog', on: { click: () => menu.showModal() } }, h('span', { class: 'icon icon--menu', 'aria-hidden': 'true' })))),
      st.ui?.showProgress === false ? null : h('div', { class: 'site-header__progress', 'aria-hidden': 'true' }));
    return [bar, menu];
  }

  function sideDots(content) {
    if (content.settings.ui?.showSideDots === false) return null;
    const items = navItems(content).filter((i) => i.id);
    if (!items.length) return null;
    return h('nav', { class: 'side-dots', 'aria-label': 'Sections' }, h('ul', null, items.map((l) =>
      h('li', null, h('a', { href: l.href, dataset: { navId: l.id } }, h('span', { class: 'side-dots__label' }, l.label))))));
  }

  function footer(content) {
    const f = content.settings.footer || {};
    return h('footer', { class: 'site-footer', 'data-theme': 'black' },
      h('div', { class: 'container site-footer__inner' },
        h('p', { dataset: { edit: 'settings.footer.copyright', editKind: 'text' } }, f.copyright || ''),
        h('ul', { class: 'site-footer__links' }, (f.links || []).map((l, i) => h('li', null, ui.button(l, `settings.footer.links.${i}`, 'text'))))));
  }

  /* ---------- Lightbox (dialog) ---------- */
  const lightbox = (() => {
    let dialog, img, caption, counter, items = [], index = 0;
    function build() {
      img = h('img', { class: 'lightbox__img', alt: '' });
      caption = h('p', { class: 'lightbox__caption' });
      counter = h('span', { class: 'lightbox__count' });
      const btn = (cls, labelKey, icon, fn) => h('button', { class: `icon-btn ${cls}`, type: 'button', 'aria-label': ui.label(labelKey), on: { click: fn } }, h('span', { class: `icon icon--${icon}`, 'aria-hidden': 'true' }));
      dialog = h('dialog', { class: 'lightbox', 'aria-label': ui.label('viewLarge') },
        h('figure', { class: 'lightbox__figure' }, img, h('figcaption', null, counter, caption)),
        btn('lightbox__close', 'close', 'close', () => dialog.close()),
        btn('lightbox__prev', 'prev', 'chevron-left', () => show(index - 1)),
        btn('lightbox__next', 'next', 'chevron-right', () => show(index + 1)));
      dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') show(index + 1);
        if (e.key === 'ArrowLeft') show(index - 1);
      });
      document.body.append(dialog);
    }
    function show(i) {
      index = (i + items.length) % items.length;
      const node = items[index];
      const source = node.querySelector('img, video');
      img.src = source?.currentSrc || source?.src || source?.poster || '';
      img.alt = source?.getAttribute('alt') || source?.getAttribute('aria-label') || '';
      caption.textContent = node.dataset.caption || '';
      counter.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
      dialog.classList.toggle('lightbox--single', items.length < 2);
    }
    return {
      open(node) {
        if (!dialog) build();
        items = [...document.querySelectorAll(`[data-lightbox="${CSS.escape(node.dataset.lightbox)}"]`)];
        dialog.showModal();
        show(items.indexOf(node));
      }
    };
  })();

  /* ---------- Render ---------- */
  function render(opts = {}) {
    const content = PF.store.state;
    const keepY = window.scrollY;
    applyTheme(content.settings);
    const chs = chapters(content);
    const main = h('main', { id: 'main', tabIndex: -1 });
    let currentChapter = '';
    content.sections.forEach((s, i) => {
      if (s.visible === false && !PF.admin?.active) return;
      const def = PF.sections[s.type];
      if (def?.isChapter) currentChapter = s.id;
      const ctx = { path: `sections.${i}`, index: i, chapters: chs, settings: content.settings, chapter: currentChapter };
      let node;
      try {
        node = def ? def.render(s, ctx) : h('section', { class: 'sec sec--unknown', 'data-path': ctx.path }, `Unknown section type: ${s.type}`);
      } catch (err) {
        console.error(err);
        node = h('section', { class: 'sec sec--unknown', 'data-path': ctx.path }, `Render error in "${s.id}": ${err.message}`);
      }
      if (s.visible === false) node.classList.add('is-hidden-section');
      main.append(node);
    });
    const [bar, menu] = header(content);
    root().replaceChildren(bar, menu, sideDots(content) || '', main, footer(content));
    PF.scroll.init(root(), content.settings.motion || {});
    if (opts.preserveScroll) window.scrollTo(0, keepY);
    PF.bus.emit('rendered', { root: root() });
  }

  /* ---------- Global interactions ---------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      if (PF.admin?.active && PF.admin.intercept(e)) return;
      const zoom = e.target.closest('[data-lightbox]');
      if (zoom && !e.target.closest('a, button:not([data-lightbox])')) { lightbox.open(zoom); return; }
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      PF.scroll.scrollTo(id);
      history.replaceState(null, '', `#${id}`);
    });
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-lightbox]')) { e.preventDefault(); lightbox.open(e.target); }
    });

    PF.scroll.on('section', ({ theme, id, chapter }) => {
      const bar = document.querySelector('.site-header');
      if (bar && theme) bar.dataset.theme = theme;
      document.querySelectorAll('[data-nav-id]').forEach((a) => {
        const on = a.dataset.navId && (a.dataset.navId === id || a.dataset.navId === chapter);
        a.classList.toggle('is-active', !!on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      const dots = document.querySelector('.side-dots');
      if (dots) dots.dataset.theme = theme;
    });
    PF.scroll.on('direction', ({ dir, y }) => {
      document.documentElement.classList.toggle('is-header-hidden', dir === 'down' && y > window.innerHeight * 0.5);
    });
  }

  PF.app = { render, bindGlobal, chapters, applyTheme };
})(window.PF);
