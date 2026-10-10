/* Shared UI building blocks used by section renderers.
   Every editable node gets data-edit="<content path>" so Admin mode can target it. */
(function (PF) {
  'use strict';
  const { h, isBlank } = PF;
  const label = (key) => PF.getPath(PF.store.state, `settings.labels.${key}`) || key;

  /** Text node bound to a content path. kind: 'text' | 'multiline' */
  function text(tag, value, path, attrs = {}, kind = 'text') {
    if (isBlank(value) && !PF.admin?.active) return null;
    const multiline = kind === 'multiline' || String(value || '').includes('\n');
    const el = h(tag, Object.assign({ dataset: { edit: path, editKind: multiline ? 'multiline' : 'text' } }, attrs),
      multiline ? PF.lines(value) : value);
    return el;
  }

  /** <img> or <video>. idb:// sources are resolved asynchronously. */
  function media(m, path, opts = {}) {
    const data = m || {};
    const isVideo = data.type === 'video';
    const cls = ['media', opts.class, isVideo ? 'media--video' : 'media--image', opts.fit ? `media--${opts.fit}` : ''];
    const wrap = h('div', { class: cls, dataset: { edit: path, editKind: 'media' } });
    if (isBlank(data.src)) {
      wrap.classList.add('media--empty');
      return wrap;
    }
    let node;
    if (isVideo) {
      node = h('video', { muted: true, loop: true, playsInline: true, autoplay: !PF.prefersReducedMotion(), preload: 'metadata', 'aria-label': data.alt || '' });
      node.muted = true;
      if (data.poster) setSrc(node, 'poster', data.poster);
      wrap.append(node, videoToggle(node));
    } else {
      node = h('img', { alt: data.alt || '', loading: opts.eager ? 'eager' : 'lazy', decoding: 'async', draggable: 'false' });
      if (opts.eager) node.setAttribute('fetchpriority', 'high');
      wrap.append(node);
    }
    setSrc(node, 'src', data.src);
    if (opts.lightbox) {
      wrap.classList.add('media--zoomable');
      wrap.dataset.lightbox = opts.lightbox;
      wrap.dataset.caption = opts.caption || data.alt || '';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'button');
      wrap.setAttribute('aria-label', `${data.alt || ''} ${label('viewLarge')}`.trim());
    }
    return wrap;
  }

  function setSrc(node, attr, src) {
    if (PF.db.isLocalMedia(src)) PF.db.resolveMedia(src).then((url) => { node[attr] = url; });
    else node[attr] = src;
  }

  function videoToggle(video) {
    const btn = h('button', { class: 'media__toggle', type: 'button', 'aria-label': label('pause') }, h('span', { class: 'icon icon--pause', 'aria-hidden': 'true' }));
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) { video.play(); btn.setAttribute('aria-label', label('pause')); btn.firstChild.className = 'icon icon--pause'; }
      else { video.pause(); btn.setAttribute('aria-label', label('play')); btn.firstChild.className = 'icon icon--play'; }
    });
    return btn;
  }

  /** MD3 button variants: filled | tonal | outlined | text */
  function button(link, path, variant) {
    if (!link || (isBlank(link.label) && !PF.admin?.active)) return null;
    const v = variant || link.variant || 'text';
    const attrs = { class: ['btn', `btn--${v}`], href: link.href || '#', dataset: { edit: path, editKind: 'link' } };
    if (link.newTab) Object.assign(attrs, { target: '_blank', rel: 'noopener noreferrer' });
    return h('a', attrs, h('span', { class: 'btn__label' }, link.label || '—'),
      v === 'text' || v === 'arrow' ? h('span', { class: 'icon icon--arrow', 'aria-hidden': 'true' }) : null);
  }

  function buttons(list, path) {
    const items = (list || []).map((l, i) => button(l, `${path}.${i}`)).filter(Boolean);
    return items.length ? h('div', { class: 'btn-row' }, items) : null;
  }

  /** Circular participation-rate indicator (animated via --value when revealed). */
  function ring(item, path) {
    const value = Number(item.value) || 0;
    return h('li', { class: 'ring', style: { '--value': value }, dataset: { edit: path, editKind: 'group' } },
      h('span', { class: 'ring__dial', 'aria-hidden': 'true' },
        svgRing(),
        h('span', { class: 'ring__value' }, h('span', { dataset: { count: value } }, String(value)), '%')),
      h('span', { class: 'ring__label' }, item.label),
      h('span', { class: 'visually-hidden' }, `${item.label} ${value}%`));
  }

  function svgRing() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.classList.add('ring__svg');
    ['ring__track', 'ring__bar'].forEach((cls) => {
      const c = document.createElementNS(ns, 'circle');
      c.setAttribute('cx', '50'); c.setAttribute('cy', '50'); c.setAttribute('r', '45');
      c.setAttribute('pathLength', '100');
      c.classList.add(cls);
      svg.append(c);
    });
    return svg;
  }

  function chips(list, path) {
    if (!list || !list.length) return null;
    return h('ul', { class: 'chips', dataset: { edit: path, editKind: 'group' } },
      list.map((c) => h('li', { class: 'chip' }, c)));
  }

  function metaList(list, path) {
    if (!list || !list.length) return null;
    return h('dl', { class: 'meta', dataset: { edit: path, editKind: 'group' } },
      list.map((m) => h('div', { class: 'meta__row' }, h('dt', null, m.label), h('dd', null, m.value))));
  }

  function eyebrow(value, path) {
    return text('p', value, path, { class: 'eyebrow' });
  }

  /* ---------- Snackbar (MD3) ---------- */
  let snackTimer;
  function snackbar(message, action) {
    let bar = document.querySelector('.snackbar');
    if (!bar) {
      bar = h('div', { class: 'snackbar', role: 'status', 'aria-live': 'polite' });
      document.body.append(bar);
    }
    bar.replaceChildren(h('span', { class: 'snackbar__text' }, message));
    if (action) bar.append(h('button', { class: 'snackbar__action', type: 'button', on: { click: () => { action.onClick(); bar.classList.remove('is-open'); } } }, action.label));
    bar.classList.add('is-open');
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => bar.classList.remove('is-open'), action ? 6000 : 3000);
  }

  PF.ui = { text, media, button, buttons, ring, chips, metaList, eyebrow, snackbar, label, setSrc };
})(window.PF);
