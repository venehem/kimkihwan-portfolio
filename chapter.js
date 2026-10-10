/* Chapter opener — giant outline number, media window that expands to full-bleed on scroll,
   then prologue + participation-rate rings. Chapters feed the header nav and the Contents index. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  PF.registerSection('chapter', {
    label: '챕터 오프너',
    description: '큰 번호와 함께 이미지가 창에서 전체 화면으로 확장됩니다. 목차·메뉴에 자동 등록됩니다.',
    isChapter: true,
    defaults: () => ({
      theme: 'black', navLabel: 'New', number: '05', title: 'New chapter', subtitle: '', prologue: '',
      workType: 'Personal work', rates: [], media: fieldKit.emptyMedia(), link: fieldKit.emptyLink()
    }),
    fields: [
      { key: 'number', label: '번호', type: 'text' },
      fieldKit.title,
      { key: 'subtitle', label: '목차용 설명', type: 'text' },
      { key: 'prologue', label: '프롤로그', type: 'textarea', rows: 5 },
      { key: 'workType', label: '작업 형태', type: 'text', help: '예: Personal work, Team work' },
      { key: 'rates', label: '참여율', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '퍼센트', type: 'number', min: 0, max: 100 }] },
      fieldKit.media(),
      fieldKit.link()
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx, { pin: PF.config.pin.chapter, ariaLabel: `${s.number} ${s.title}` });
      el.append(h('div', { class: 'pin__stage' },
        h('div', { class: 'chapter__media' }, ui.media(s.media, `${p}.media`, { fit: 'cover' })),
        h('div', { class: 'chapter__shade', 'aria-hidden': 'true' }),
        ui.text('div', s.number, `${p}.number`, { class: 'chapter__number', 'aria-hidden': 'true' }),
        PF.container('chapter__head',
          h('p', { class: 'eyebrow' }, `Chapter ${s.number || ''}`),
          ui.text('h2', s.title, `${p}.title`, { class: 'chapter__title' }, 'multiline')),
        PF.container('chapter__body',
          h('div', { class: 'chapter__prologue' },
            h('p', { class: 'chapter__label' }, 'Prologue'),
            ui.text('p', s.prologue, `${p}.prologue`, { class: 'chapter__text' })),
          (s.rates && s.rates.length) ? h('div', { class: 'chapter__rates' },
            h('p', { class: 'chapter__label' }, ui.label('participation')),
            s.workType ? h('p', { class: 'chapter__work' }, '[ ', ui.text('span', s.workType, `${p}.workType`), ' ]') : null,
            h('ul', { class: 'rings' }, s.rates.map((r, i) => ui.ring(r, `${p}.rates.${i}`)))) : null,
          ui.button(s.link, `${p}.link`, 'arrow'))
      ));
      return el;
    }
  });
})(window.PF);
