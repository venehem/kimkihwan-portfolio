/* Hero — full-bleed media pinned while it insets into a rounded frame and a statement fades in. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  PF.registerSection('hero', {
    label: '히어로 (풀스크린)',
    description: '첫 화면. 스크롤하면 미디어가 프레임 안으로 줄어들며 문장이 나타납니다.',
    defaults: () => ({
      theme: 'black', eyebrow: 'Portfolio', title: 'Title', subtitle: '', statement: '',
      media: fieldKit.emptyMedia(), ctas: []
    }),
    fields: [
      fieldKit.eyebrow, fieldKit.title,
      { key: 'subtitle', label: '부제', type: 'textarea', rows: 2 },
      { key: 'statement', label: '스크롤 후 문장', type: 'textarea', rows: 2 },
      fieldKit.media(),
      { key: 'ctas', label: '버튼', type: 'links' }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx, { pin: PF.config.pin.hero });
      el.append(h('div', { class: 'pin__stage' },
        h('div', { class: 'hero__media' }, ui.media(s.media, `${p}.media`, { eager: true, fit: 'cover' })),
        h('div', { class: 'hero__shade', 'aria-hidden': 'true' }),
        PF.container('hero__content', h('div', { 'data-reveal': '' },
          ui.eyebrow(s.eyebrow, `${p}.eyebrow`),
          ui.text('h1', s.title, `${p}.title`, { class: 'hero__title' }, 'multiline'),
          ui.text('p', s.subtitle, `${p}.subtitle`, { class: 'hero__subtitle' }, 'multiline'),
          ui.buttons(s.ctas, `${p}.ctas`))),
        PF.container('hero__statement', ui.text('p', s.statement, `${p}.statement`, { class: 'hero__statement-text' }, 'multiline')),
        h('div', { class: 'hero__cue', 'aria-hidden': 'true' }, h('span', null, ui.label('scroll')), h('i'))
      ));
      return el;
    }
  });
})(window.PF);
