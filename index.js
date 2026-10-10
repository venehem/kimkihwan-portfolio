/* Contents index — generated from chapter sections, with a cursor-following preview on hover. */
(function (PF) {
  'use strict';
  const { h, ui } = PF;

  /** Split a single-line title into stacked chunks (CONTENTS → CON / TEN / TS). */
  function stack(title, size) {
    if (String(title).includes('\n')) return String(title);
    const chunks = String(title).match(new RegExp(`.{1,${size}}`, 'g')) || [];
    return chunks.join('\n');
  }

  PF.registerSection('index', {
    label: '목차 (자동)',
    description: '챕터 섹션을 자동으로 모아 목차를 만듭니다.',
    defaults: () => ({ theme: 'dark', title: 'CONTENTS', text: '', chunk: 3 }),
    fields: [
      { key: 'title', label: '큰 제목', type: 'textarea', rows: 2, help: '줄바꿈이 없으면 글자 수(분할 단위)로 나눠 쌓습니다' },
      { key: 'chunk', label: '분할 단위(글자)', type: 'number', min: 1, max: 12 },
      { key: 'text', label: '안내 문구', type: 'text' }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx);
      const preview = h('div', { class: 'index__preview', 'aria-hidden': 'true' });
      const list = h('ol', { class: 'index__list' }, ctx.chapters.map((c, i) => {
        const item = h('li', { class: 'index__item', 'data-reveal': '', style: { '--i': i } },
          h('a', { class: 'index__link', href: `#${c.id}`, dataset: { previewIndex: i } },
            h('span', { class: 'index__num' }, c.number),
            h('span', { class: 'index__body' },
              h('span', { class: 'index__title' }, c.title),
              c.subtitle ? h('span', { class: 'index__sub' }, c.subtitle) : null),
            h('span', { class: 'icon icon--arrow', 'aria-hidden': 'true' })));
        return item;
      }));

      // Preview images (only on precise pointers)
      ctx.chapters.forEach((c, i) => {
        const thumb = ui.media(c.media, `${c.path}.media`, { class: 'index__thumb', fit: 'cover' });
        thumb.dataset.i = i;
        preview.append(thumb);
      });

      list.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const link = e.target.closest('[data-preview-index]');
        preview.classList.toggle('is-visible', !!link);
        if (!link) return;
        preview.style.setProperty('--mx', `${e.clientX}px`);
        preview.style.setProperty('--my', `${e.clientY}px`);
        preview.querySelectorAll('.index__thumb').forEach((n) => n.classList.toggle('is-active', n.dataset.i === link.dataset.previewIndex));
      });
      list.addEventListener('pointerleave', () => preview.classList.remove('is-visible'));

      el.append(PF.container('index',
        h('div', { class: 'index__head' },
          ui.text('h2', stack(s.title, Number(s.chunk) || 3), `${p}.title`, { class: 'index__title-big', 'data-reveal': '' }, 'multiline'),
          ui.text('p', s.text, `${p}.text`, { class: 'index__hint' })),
        list), preview);
      return el;
    }
  });
})(window.PF);
