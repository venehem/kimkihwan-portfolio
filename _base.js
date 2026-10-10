/* Section registry helpers.
   A section type registers:
     PF.registerSection('type', {
       label, description,
       defaults: () => ({...}),          // initial data for a new section of this type
       fields: [ ...field specs ],       // drives the Admin form (see js/admin/fields.js)
       render: (section, ctx) => Node    // ctx: { path, index, chapters, settings }
     });
   Field spec: { key, label, type: text|textarea|number|toggle|select|color|media|link|links|strings|list,
                 options?, fields? (for list), help?, itemLabel? } */
(function (PF) {
  'use strict';
  const { h } = PF;

  /** Fields every section has, prepended in the admin form. */
  PF.baseFields = [
    { key: 'id', label: '앵커 ID', type: 'text', help: '주소 #앵커와 메뉴 링크에 쓰입니다. 영문·숫자·하이픈 권장' },
    { key: 'visible', label: '노출', type: 'toggle' },
    { key: 'theme', label: '배경 테마', type: 'select', options: () => PF.config.themes },
    { key: 'navLabel', label: '메뉴 이름', type: 'text', help: '입력하면 상단 메뉴와 우측 인디케이터에 표시됩니다' }
  ];

  /** Reusable field fragments */
  PF.fieldKit = {
    media: (key = 'media', label = '이미지 / 영상') => ({ key, label, type: 'media' }),
    link: (key = 'link', label = '링크 버튼') => ({ key, label, type: 'link' }),
    eyebrow: { key: 'eyebrow', label: '상단 라벨', type: 'text' },
    title: { key: 'title', label: '제목', type: 'textarea', rows: 2 },
    text: { key: 'text', label: '본문', type: 'textarea', rows: 4 },
    emptyLink: () => ({ label: '', href: '', newTab: false }),
    emptyMedia: () => ({ type: 'image', src: '', poster: '', alt: '' })
  };

  PF.registerSection = function (type, def) {
    PF.sections[type] = Object.assign({ type, fields: [], defaults: () => ({}) }, def);
  };

  /** Common <section> shell */
  PF.shell = function (section, ctx, opts = {}) {
    const attrs = {
      id: section.id,
      class: ['sec', `sec--${section.type}`, opts.class],
      'data-theme': section.theme || 'dark',
      'data-section': '',
      'data-path': ctx.path,
      'aria-label': opts.ariaLabel || section.navLabel || (section.title || '').replace(/\n/g, ' ') || null
    };
    if (ctx.chapter) attrs['data-chapter'] = ctx.chapter;
    const el = h('section', attrs);
    if (opts.pin) {
      el.setAttribute('data-pin', '');
      el.setAttribute('data-pin-length', opts.pin);
    }
    return el;
  };

  PF.container = (cls, ...children) => h('div', { class: ['container', cls] }, ...children);
})(window.PF);
