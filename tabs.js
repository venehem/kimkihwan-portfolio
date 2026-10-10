/* Tabs + carousel — MD3 primary tabs; each panel is a scroll-snap carousel with prev/next. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  const newSlide = () => ({ media: fieldKit.emptyMedia(), caption: '' });

  function carousel(items, path, group) {
    const track = h('ul', { class: 'carousel__track', 'data-native-scroll': '', tabIndex: 0 },
      items.map((it, i) => h('li', { class: 'carousel__slide', 'aria-roledescription': 'slide', 'aria-label': `${i + 1} / ${items.length}` },
        ui.media(it.media, `${path}.${i}.media`, { fit: 'contain', lightbox: group, caption: it.caption }),
        ui.text('p', it.caption, `${path}.${i}.caption`, { class: 'carousel__caption' }))));
    const counter = h('span', { class: 'carousel__count', 'aria-live': 'polite' }, `1 / ${items.length}`);
    const go = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: PF.prefersReducedMotion() ? 'auto' : 'smooth' });
    const prev = h('button', { class: 'icon-btn', type: 'button', 'aria-label': ui.label('prev'), on: { click: () => go(-1) } }, h('span', { class: 'icon icon--chevron-left', 'aria-hidden': 'true' }));
    const next = h('button', { class: 'icon-btn', type: 'button', 'aria-label': ui.label('next'), on: { click: () => go(1) } }, h('span', { class: 'icon icon--chevron-right', 'aria-hidden': 'true' }));
    const sync = () => {
      const slides = [...track.children];
      const center = track.scrollLeft + track.clientWidth / 2;
      let idx = 0;
      slides.forEach((s, i) => { if (s.offsetLeft <= center) idx = i; });
      counter.textContent = `${idx + 1} / ${items.length}`;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    track.addEventListener('scroll', PF.debounce(sync, 60), { passive: true });
    requestAnimationFrame(sync);
    return h('div', { class: ['carousel', items.length === 1 && 'carousel--single'] }, track,
      items.length > 1 ? h('div', { class: 'carousel__controls' }, counter, h('div', { class: 'carousel__buttons' }, prev, next)) : null);
  }

  PF.registerSection('tabs', {
    label: '탭 + 슬라이더',
    description: '탭으로 카테고리를 나누고 각 탭 안에서 이미지를 넘겨봅니다.',
    defaults: () => ({ theme: 'stone', eyebrow: '', title: 'Tabs', text: '', tabs: [{ label: 'Tab 1', items: [newSlide()] }] }),
    fields: [
      fieldKit.eyebrow, fieldKit.title, fieldKit.text,
      { key: 'tabs', label: '탭', type: 'list', itemLabel: 'label', newItem: () => ({ label: '새 탭', items: [newSlide()] }), fields: [
        { key: 'label', label: '탭 이름', type: 'text' },
        { key: 'items', label: '슬라이드', type: 'list', itemLabel: 'caption', newItem: newSlide, fields: [
          fieldKit.media(), { key: 'caption', label: '캡션', type: 'text' }] }] }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx);
      const tabs = s.tabs || [];
      const baseId = `${s.id}-tab`;
      const tabButtons = [];
      const panels = [];

      function select(i, focus) {
        tabButtons.forEach((b, j) => {
          const on = i === j;
          b.setAttribute('aria-selected', String(on));
          b.tabIndex = on ? 0 : -1;
          panels[j].hidden = !on;
        });
        el.style.setProperty('--tab-index', i);
        if (focus) tabButtons[i].focus();
      }

      tabs.forEach((t, i) => {
        tabButtons.push(h('button', {
          class: 'tab', type: 'button', role: 'tab', id: `${baseId}-${i}`, 'aria-controls': `${baseId}-panel-${i}`,
          dataset: { edit: `${p}.tabs.${i}.label`, editKind: 'text' }, on: { click: () => select(i) }
        }, t.label));
        panels.push(h('div', { class: 'tabs__panel', role: 'tabpanel', id: `${baseId}-panel-${i}`, 'aria-labelledby': `${baseId}-${i}` },
          carousel(t.items || [], `${p}.tabs.${i}.items`, `${s.id}-${i}`)));
      });

      const tablist = h('div', { class: 'tabs__list', role: 'tablist', style: { '--tab-count': tabs.length } }, tabButtons, h('span', { class: 'tabs__indicator', 'aria-hidden': 'true' }));
      tablist.addEventListener('keydown', (e) => {
        const cur = tabButtons.indexOf(document.activeElement);
        if (cur < 0) return;
        const map = { ArrowRight: 1, ArrowLeft: -1, Home: -cur, End: tabs.length - 1 - cur };
        if (!(e.key in map)) return;
        e.preventDefault();
        select((cur + map[e.key] + tabs.length) % tabs.length, true);
      });

      el.append(PF.container('tabs',
        h('header', { class: 'tabs__head', 'data-reveal': '' },
          h('div', null, ui.eyebrow(s.eyebrow, `${p}.eyebrow`), ui.text('h2', s.title, `${p}.title`, { class: 'tabs__title' }, 'multiline')),
          ui.text('p', s.text, `${p}.text`, { class: 'tabs__text' })),
        tabs.length > 1 ? tablist : null,
        h('div', { class: 'tabs__panels', 'data-reveal': '' }, panels)));
      if (tabs.length) select(0);
      return el;
    }
  });
})(window.PF);
