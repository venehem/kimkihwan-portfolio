/* Feature — full-bleed parallax media with revealed headline, copy and optional stats. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  PF.registerSection('feature', {
    label: '풀블리드 피처',
    description: '화면 가득 찬 이미지/영상이 패럴랙스로 움직이고 문구가 떠오릅니다.',
    defaults: () => ({
      theme: 'black', eyebrow: '', title: 'Feature', text: '', media: fieldKit.emptyMedia(),
      align: 'center', titleStyle: 'default', stats: [], link: fieldKit.emptyLink()
    }),
    fields: [
      fieldKit.eyebrow, fieldKit.title, fieldKit.text, fieldKit.media(),
      { key: 'align', label: '문구 정렬', type: 'select', options: [{ value: 'left', label: '왼쪽' }, { value: 'center', label: '가운데' }, { value: 'right', label: '오른쪽' }] },
      { key: 'titleStyle', label: '제목 스타일', type: 'select', options: [{ value: 'default', label: '기본 (산세리프)' }, { value: 'serif-accent', label: '세리프 + 포인트 컬러' }] },
      { key: 'stats', label: '정보/수치', type: 'list', itemLabel: 'label', fields: [
        { key: 'label', label: '라벨', type: 'text' }, { key: 'value', label: '값 (숫자면 카운트 애니메이션)', type: 'text' },
        { key: 'suffix', label: '단위', type: 'text' }] },
      fieldKit.link()
    ],
    render(s, ctx) {
      const p = ctx.path;
      const el = PF.shell(s, ctx, { class: [`feature--${s.align || 'center'}`, `feature--${s.titleStyle || 'default'}`].join(' ') });
      const numeric = (v) => /^-?\d+(\.\d+)?$/.test(String(v).trim());
      el.append(
        h('div', { class: 'feature__media', 'data-parallax': '1' }, ui.media(s.media, `${p}.media`, { fit: 'cover' })),
        h('div', { class: 'feature__shade', 'aria-hidden': 'true' }),
        PF.container('feature__content', h('div', { class: 'feature__inner', 'data-reveal': '' },
          ui.eyebrow(s.eyebrow, `${p}.eyebrow`),
          ui.text('h2', s.title, `${p}.title`, { class: 'feature__title' }, 'multiline'),
          ui.text('p', s.text, `${p}.text`, { class: 'feature__text' }),
          (s.stats && s.stats.length) ? h('dl', { class: 'stats', dataset: { edit: `${p}.stats`, editKind: 'group' } }, s.stats.map((st) =>
            h('div', { class: 'stats__item' },
              h('dt', null, st.label),
              h('dd', null,
                numeric(st.value) ? h('span', { dataset: { count: st.value } }, Number(st.value).toLocaleString()) : st.value,
                st.suffix ? h('small', null, ` ${st.suffix}`) : null)))) : null,
          ui.button(s.link, `${p}.link`, 'arrow'))));
      return el;
    }
  });
})(window.PF);
