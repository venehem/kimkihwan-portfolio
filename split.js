/* Split — media + copy in two columns (or stacked for wide diagrams). Media is zoomable. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  PF.registerSection('split', {
    label: '이미지 + 텍스트',
    description: '이미지와 설명을 나란히(또는 위아래로) 배치합니다. 이미지를 누르면 크게 볼 수 있습니다.',
    defaults: () => ({
      theme: 'dark', eyebrow: '', title: 'Title', text: '', media: fieldKit.emptyMedia(),
      layout: 'split', mediaFit: 'cover', chips: [], meta: [], link: fieldKit.emptyLink()
    }),
    fields: [
      fieldKit.eyebrow, fieldKit.title, fieldKit.text, fieldKit.media(),
      { key: 'layout', label: '배치', type: 'select', options: [
        { value: 'split', label: '이미지 오른쪽' }, { value: 'split-reverse', label: '이미지 왼쪽' }, { value: 'stacked', label: '위 텍스트, 아래 넓은 이미지' }] },
      { key: 'mediaFit', label: '이미지 맞춤', type: 'select', options: [{ value: 'cover', label: '꽉 채우기' }, { value: 'contain', label: '전체 보이기' }] },
      { key: 'chips', label: '키워드 칩', type: 'strings' },
      { key: 'meta', label: '정보 목록', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '내용', type: 'text' }] },
      fieldKit.link()
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx, { class: `split--${s.layout || 'split'}` });
      el.append(PF.container('split',
        h('div', { class: 'split__copy', 'data-reveal': '' },
          ui.eyebrow(s.eyebrow, `${p}.eyebrow`),
          ui.text('h2', s.title, `${p}.title`, { class: 'split__title' }, 'multiline'),
          ui.text('p', s.text, `${p}.text`, { class: 'split__text' }),
          ui.chips(s.chips, `${p}.chips`),
          ui.metaList(s.meta, `${p}.meta`),
          ui.button(s.link, `${p}.link`, 'arrow')),
        h('div', { class: 'split__visual', 'data-reveal': '' },
          h('div', { class: 'split__frame', 'data-parallax': '0.5' },
            ui.media(s.media, `${p}.media`, { fit: s.mediaFit || 'cover', lightbox: s.id, caption: (s.title || '').replace(/\n/g, ' ') })))));
      return el;
    }
  });
})(window.PF);
