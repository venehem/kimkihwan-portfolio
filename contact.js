/* Contact — closing call-to-action with a large phone link, contact list and source credits. */
(function (PF) {
  'use strict';
  const { h, ui } = PF;

  function copyable(item) {
    const value = item.value;
    if (!item.href || !/^mailto:/.test(item.href)) return item.href ? h('a', { class: 'link', href: item.href }, value) : value;
    return h('span', { class: 'copyable' },
      h('a', { class: 'link', href: item.href }, value),
      h('button', {
        class: 'icon-btn icon-btn--small', type: 'button', 'aria-label': `${value} ${ui.label('copy')}`,
        on: { click: () => navigator.clipboard?.writeText(value).then(() => ui.snackbar(ui.label('copied'))) }
      }, h('span', { class: 'icon icon--copy', 'aria-hidden': 'true' })));
  }

  PF.registerSection('contact', {
    label: '연락처 (마무리)',
    description: '큰 전화번호와 연락처, 출처 정보를 보여주는 마지막 섹션',
    defaults: () => ({
      theme: 'light', navLabel: 'Contact', title: 'Contact', phone: { label: '', href: '' },
      contactsTitle: 'Contacts', contacts: [], sourceTitle: '', source: [], ctas: []
    }),
    fields: [
      { key: 'title', label: '제목', type: 'textarea', rows: 2 },
      { key: 'phone.label', label: '큰 번호/문구', type: 'text' },
      { key: 'phone.href', label: '큰 번호 링크 (tel:)', type: 'text' },
      { key: 'contactsTitle', label: '연락처 제목', type: 'text' },
      { key: 'contacts', label: '연락처', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '내용', type: 'text' }, { key: 'href', label: '링크', type: 'text' }] },
      { key: 'sourceTitle', label: '출처 제목', type: 'text' },
      { key: 'source', label: '출처', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '항목', type: 'text' }, { key: 'value', label: '내용', type: 'text' }] },
      { key: 'ctas', label: '버튼', type: 'links' }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx);
      const phone = s.phone || {};
      el.append(
        h('div', { class: 'contact__band', 'data-theme': 'dark' },
          PF.container('contact__band-inner', ui.text('h2', s.title, `${p}.title`, { class: 'contact__title', 'data-reveal': '' }, 'multiline'))),
        PF.container('contact',
          phone.label ? h('a', { class: 'contact__phone', href: phone.href || '#', 'data-reveal': '', dataset: { edit: `${p}.phone.label`, editKind: 'text' } }, phone.label) : null,
          h('div', { class: 'contact__grid' },
            h('div', { 'data-reveal': '' },
              ui.text('h3', s.contactsTitle, `${p}.contactsTitle`, { class: 'profile__label' }),
              h('dl', { class: 'meta', dataset: { edit: `${p}.contacts`, editKind: 'group' } },
                (s.contacts || []).map((c) => h('div', { class: 'meta__row' }, h('dt', null, c.label), h('dd', null, copyable(c)))))),
            h('div', { 'data-reveal': '' },
              ui.text('h3', s.sourceTitle, `${p}.sourceTitle`, { class: 'profile__label' }),
              ui.metaList(s.source, `${p}.source`)),
            h('div', { class: 'contact__cta', 'data-reveal': '' }, ui.buttons(s.ctas, `${p}.ctas`)))));
      return el;
    }
  });
})(window.PF);
