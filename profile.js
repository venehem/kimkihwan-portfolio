/* Profile — greeting, years-of-experience counter, career timeline, info, contacts, skills. */
(function (PF) {
  'use strict';
  const { h, ui } = PF;

  const block = (title, path, body) => h('div', { class: 'profile__block', 'data-reveal': '' },
    ui.text('h3', title, path, { class: 'profile__label' }), body);

  PF.registerSection('profile', {
    label: '프로필 (About)',
    description: '인사말, 경력 연차, 이력, 연락처, 스킬',
    defaults: () => ({
      theme: 'light', navLabel: 'About', title: 'Hello', badge: '', stat: { value: '10', suffix: 'YEARS', label: 'EXPERIENCE' },
      careerTitle: 'About me', career: [], info: [], contactsTitle: 'Contacts', contacts: [], skillsTitle: 'Skills', skills: []
    }),
    fields: [
      { key: 'title', label: '인사말', type: 'textarea', rows: 2 },
      { key: 'badge', label: '인사말 옆 작은 라벨', type: 'text' },
      { key: 'stat.value', label: '경력 숫자', type: 'text' },
      { key: 'stat.suffix', label: '숫자 단위', type: 'text' },
      { key: 'stat.label', label: '숫자 설명', type: 'text' },
      { key: 'careerTitle', label: '이력 제목', type: 'text' },
      { key: 'career', label: '이력', type: 'list', itemLabel: 'name', fields: [
        { key: 'period', label: '기간', type: 'text' }, { key: 'name', label: '회사/브랜드', type: 'text' }] },
      { key: 'info', label: '기본 정보', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '내용', type: 'textarea', rows: 2 }] },
      { key: 'contactsTitle', label: '연락처 제목', type: 'text' },
      { key: 'contacts', label: '연락처', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '내용', type: 'text' },
        { key: 'href', label: '링크 (tel:, mailto:, https://)', type: 'text' }] },
      { key: 'skillsTitle', label: '스킬 제목', type: 'text' },
      { key: 'skills', label: '스킬', type: 'list', itemLabel: 'name', fields: [
        { key: 'abbr', label: '약어 (아이콘)', type: 'text' }, { key: 'name', label: '이름', type: 'text' }] }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx);
      const stat = s.stat || {};
      el.append(PF.container('profile',
        h('header', { class: 'profile__head', 'data-reveal': '' },
          h('h2', { class: 'profile__title' },
            ui.text('span', s.title, `${p}.title`, null, 'multiline'),
            ui.text('sup', s.badge, `${p}.badge`, { class: 'profile__badge' })),
          h('p', { class: 'profile__stat', dataset: { edit: `${p}.stat.value`, editKind: 'group' } },
            h('span', { class: 'profile__stat-value', dataset: { count: stat.value } }, stat.value),
            h('span', { class: 'profile__stat-label' }, h('span', null, stat.suffix), h('span', null, stat.label)))),
        h('div', { class: 'profile__grid' },
          block(s.careerTitle, `${p}.careerTitle`, h('dl', { class: 'timeline', dataset: { edit: `${p}.career`, editKind: 'group' } },
            (s.career || []).map((c) => h('div', { class: 'timeline__row' }, h('dt', null, c.period), h('dd', null, c.name))))),
          block('', `${p}.info`, ui.metaList(s.info, `${p}.info`)),
          block(s.contactsTitle, `${p}.contactsTitle`, h('dl', { class: 'meta', dataset: { edit: `${p}.contacts`, editKind: 'group' } },
            (s.contacts || []).map((c) => h('div', { class: 'meta__row' }, h('dt', null, c.label),
              h('dd', null, c.href ? h('a', { href: c.href, class: 'link' }, c.value) : c.value))))),
          h('div', { class: 'profile__block profile__block--wide', 'data-reveal': '' },
            ui.text('h3', s.skillsTitle, `${p}.skillsTitle`, { class: 'profile__label' }),
            h('ul', { class: 'skills', dataset: { edit: `${p}.skills`, editKind: 'group' } },
              (s.skills || []).map((sk, i) => h('li', { class: 'skill', style: { '--i': i } },
                h('span', { class: 'skill__icon', 'aria-hidden': 'true' }, sk.abbr),
                h('span', { class: 'skill__name' }, sk.name))))))));
      return el;
    }
  });
})(window.PF);
