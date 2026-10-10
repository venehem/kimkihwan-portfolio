/* Sticky story — the stage pins while text steps advance; media cross-fades/zooms per step. */
(function (PF) {
  'use strict';
  const { h, ui, fieldKit } = PF;

  const pad = (n) => String(n).padStart(2, '0');

  PF.registerSection('story', {
    label: '스티키 스토리',
    description: '화면이 고정된 채 휠을 내리면 단계별로 이미지와 설명이 바뀝니다.',
    defaults: () => ({
      theme: 'black', eyebrow: '', title: 'Story', mediaFit: 'contain',
      steps: [{ kicker: '', title: 'Step 1', text: '', media: fieldKit.emptyMedia(), tags: [], link: fieldKit.emptyLink() }]
    }),
    fields: [
      fieldKit.eyebrow, fieldKit.title,
      { key: 'mediaFit', label: '이미지 맞춤', type: 'select', options: [{ value: 'contain', label: '전체 보이기' }, { value: 'cover', label: '꽉 채우기' }] },
      { key: 'steps', label: '단계', type: 'list', itemLabel: 'title', fields: [
        { key: 'kicker', label: '라벨', type: 'text' },
        { key: 'title', label: '제목', type: 'textarea', rows: 2 },
        { key: 'text', label: '설명', type: 'textarea', rows: 4 },
        fieldKit.media(),
        { key: 'tags', label: '태그', type: 'strings' },
        fieldKit.link()
      ], newItem: () => ({ kicker: '', title: '새 단계', text: '', media: fieldKit.emptyMedia(), tags: [], link: fieldKit.emptyLink() }) }
    ],
    render(s, ctx) {
      const p = ctx.path;
      const steps = s.steps || [];
      const n = Math.max(1, steps.length);
      const el = PF.shell(s, ctx, { pin: n * PF.config.pin.storyPerStep, class: `story--${s.mediaFit || 'contain'}` });
      el.dataset.steps = n;

      const frames = steps.map((st, i) => h('div', {
        class: ['story__frame', i === 0 && 'is-active'], dataset: { stepIndex: i }
      }, ui.media(st.media, `${p}.steps.${i}.media`, { fit: s.mediaFit || 'contain', lightbox: s.id, caption: (st.title || '').replace(/\n/g, ' ') })));

      const panels = steps.map((st, i) => {
        const sp = `${p}.steps.${i}`;
        return h('article', { class: ['story__panel', i === 0 && 'is-active'], dataset: { stepIndex: i, stepPanel: '' }, 'aria-hidden': String(i !== 0) },
          ui.text('p', st.kicker, `${sp}.kicker`, { class: 'story__kicker' }),
          ui.text('h3', st.title, `${sp}.title`, { class: 'story__title' }, 'multiline'),
          ui.text('p', st.text, `${sp}.text`, { class: 'story__text' }),
          ui.chips(st.tags, `${sp}.tags`),
          ui.button(st.link, `${sp}.link`, 'arrow'));
      });

      const dots = steps.map((st, i) => h('button', {
        class: ['story__dot', i === 0 && 'is-active'], type: 'button',
        dataset: { stepIndex: i, stepDot: '' }, 'aria-current': i === 0 ? 'step' : 'false',
        'aria-label': `${pad(i + 1)} ${(st.title || '').replace(/\n/g, ' ')}`,
        on: { click: () => PF.scroll.scrollToStep(el, i) }
      }, h('span', { class: 'story__dot-num' }, pad(i + 1))));

      el.append(h('div', { class: 'pin__stage' },
        h('div', { class: 'story__media' }, frames),
        PF.container('story__layout',
          h('header', { class: 'story__head' },
            ui.eyebrow(s.eyebrow, `${p}.eyebrow`),
            ui.text('h2', s.title, `${p}.title`, { class: 'story__heading' }, 'multiline')),
          h('div', { class: 'story__panels' }, panels),
          h('nav', { class: 'story__nav', 'aria-label': `${(s.title || '').replace(/\n/g, ' ')} steps` },
            h('span', { class: 'story__progress', 'aria-hidden': 'true' }, h('i')),
            dots))));
      return el;
    }
  });
})(window.PF);
