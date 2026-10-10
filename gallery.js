/* Horizontal gallery — the stage pins and the vertical wheel moves the card track sideways. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  const newItem = () => ({ media: fieldKit.emptyMedia(), caption: '', text: '', link: fieldKit.emptyLink() });

  PF.registerSection('gallery', {
    label: '가로 스크롤 갤러리',
    description: '휠을 내리면 카드가 가로로 흘러갑니다. 카드를 누르면 크게 볼 수 있습니다.',
    defaults: () => ({ theme: 'black', eyebrow: '', title: 'Gallery', text: '', cardSize: 'landscape', items: [newItem()] }),
    fields: [
      fieldKit.eyebrow, fieldKit.title, fieldKit.text,
      { key: 'cardSize', label: '카드 비율', type: 'select', options: [
        { value: 'landscape', label: '가로형 (4:3)' }, { value: 'portrait', label: '세로형 (3:4)' }, { value: 'square', label: '정사각형' }, { value: 'wide', label: '와이드 (16:9)' }] },
      { key: 'items', label: '카드', type: 'list', itemLabel: 'caption', newItem, fields: [
        fieldKit.media(), { key: 'caption', label: '캡션', type: 'text' }, { key: 'text', label: '보조 설명', type: 'text' }, fieldKit.link()] }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx, { pin: 1, class: `gallery--${s.cardSize || 'landscape'}` });
      el.setAttribute('data-hscroll', '');
      const items = s.items || [];
      el.append(h('div', { class: 'pin__stage' },
        PF.container('gallery__head',
          h('div', { 'data-reveal': '' },
            ui.eyebrow(s.eyebrow, `${p}.eyebrow`),
            ui.text('h2', s.title, `${p}.title`, { class: 'gallery__title' }, 'multiline')),
          h('div', { class: 'gallery__aside', 'data-reveal': '' },
            ui.text('p', s.text, `${p}.text`, { class: 'gallery__text' }),
            h('div', { class: 'gallery__progress', 'aria-hidden': 'true' }, h('i')))),
        h('ul', { class: 'gallery__track', 'data-hscroll-track': '' }, items.map((it, i) => {
          const ip = `${p}.items.${i}`;
          return h('li', { class: 'card' },
            ui.media(it.media, `${ip}.media`, { fit: 'cover', lightbox: s.id, caption: it.caption, class: 'card__media' }),
            h('div', { class: 'card__body' },
              h('span', { class: 'card__index' }, String(i + 1).padStart(2, '0')),
              ui.text('h3', it.caption, `${ip}.caption`, { class: 'card__title' }),
              ui.text('p', it.text, `${ip}.text`, { class: 'card__text' }),
              ui.button(it.link, `${ip}.link`, 'arrow')));
        }))));
      return el;
    }
  });
})(window.PF);
