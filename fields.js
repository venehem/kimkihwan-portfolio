/* Schema-driven form controls for Admin mode.
   build(spec, basePath) → element. Values are read from / written to PF.store by path. */
(function (PF) {
  'use strict';
  const { h, store } = PF;

  const join = (base, key) => (base ? `${base}.${key}` : key);
  const val = (path) => store.get(path);
  const set = (path, v) => store.set(path, v);
  let seq = 0;
  const fid = () => `f-${++seq}`;

  function wrap(spec, path, control, id) {
    return h('div', { class: ['field', `field--${spec.type}`], dataset: { fieldPath: path } },
      spec.label ? h('label', { class: 'field__label', for: id }, spec.label) : null,
      control,
      spec.help ? h('p', { class: 'field__help', id: `${id}-help` }, spec.help) : null);
  }

  const builders = {
    text(spec, path) {
      const id = fid();
      const input = h('input', { id, class: 'input', type: 'text', value: val(path) ?? '', 'aria-describedby': spec.help ? `${id}-help` : null,
        on: { input: (e) => set(path, e.target.value) } });
      return wrap(spec, path, input, id);
    },
    textarea(spec, path) {
      const id = fid();
      const ta = h('textarea', { id, class: 'input input--area', rows: spec.rows || 3, 'aria-describedby': spec.help ? `${id}-help` : null,
        on: { input: (e) => set(path, e.target.value) } });
      ta.value = val(path) ?? '';
      return wrap(spec, path, ta, id);
    },
    number(spec, path) {
      const id = fid();
      const input = h('input', { id, class: 'input', type: 'number', value: val(path) ?? '', min: spec.min, max: spec.max, step: spec.step || 'any',
        on: { input: (e) => set(path, e.target.value === '' ? '' : Number(e.target.value)) } });
      return wrap(spec, path, input, id);
    },
    toggle(spec, path) {
      const id = fid();
      const input = h('input', { id, class: 'switch__input', type: 'checkbox', role: 'switch', checked: val(path) !== false,
        on: { change: (e) => set(path, e.target.checked) } });
      return h('div', { class: 'field field--toggle', dataset: { fieldPath: path } },
        h('label', { class: 'switch', for: id }, h('span', { class: 'field__label' }, spec.label), input, h('span', { class: 'switch__track', 'aria-hidden': 'true' })),
        spec.help ? h('p', { class: 'field__help' }, spec.help) : null);
    },
    select(spec, path) {
      const id = fid();
      const options = typeof spec.options === 'function' ? spec.options() : spec.options;
      const current = val(path);
      const sel = h('select', { id, class: 'input', on: { change: (e) => set(path, e.target.value) } },
        options.map((o) => h('option', { value: o.value, selected: o.value === current }, o.label)));
      return wrap(spec, path, sel, id);
    },
    color(spec, path) {
      const id = fid();
      const text = h('input', { class: 'input', type: 'text', value: val(path) || '', 'aria-label': `${spec.label} HEX`,
        on: { change: (e) => { set(path, e.target.value); picker.value = e.target.value; } } });
      const picker = h('input', { id, class: 'color', type: 'color', value: val(path) || '#000000',
        on: { input: (e) => { set(path, e.target.value); text.value = e.target.value; } } });
      return wrap(spec, path, h('div', { class: 'field__row' }, picker, text), id);
    },
    strings(spec, path) {
      const id = fid();
      const ta = h('textarea', { id, class: 'input input--area', rows: 3, 'aria-describedby': `${id}-help`,
        on: { input: (e) => set(path, e.target.value.split('\n').map((s) => s.trim()).filter(Boolean)) } });
      ta.value = (val(path) || []).join('\n');
      return wrap(Object.assign({ help: '한 줄에 하나씩 입력하세요' }, spec), path, ta, id);
    },
    link(spec, path, opts = {}) {
      const fields = [
        { key: 'label', label: '버튼 문구', type: 'text' },
        { key: 'href', label: '주소 (https://, #앵커, mailto:, tel:)', type: 'text', help: '비워두면 버튼이 표시되지 않습니다' },
        { key: 'newTab', label: '새 탭에서 열기', type: 'toggle' }
      ];
      if (opts.variant) fields.push({ key: 'variant', label: '버튼 스타일', type: 'select', options: [
        { value: 'filled', label: '채움' }, { value: 'tonal', label: '톤' }, { value: 'outlined', label: '외곽선' }, { value: 'text', label: '텍스트' }, { value: 'arrow', label: '화살표' }] });
      if (val(path) == null) PF.setPath(store.state, path, { label: '', href: '', newTab: false });
      if (val(`${path}.newTab`) == null) PF.setPath(store.state, `${path}.newTab`, false);
      return h('fieldset', { class: 'fieldset', dataset: { fieldPath: path } },
        h('legend', null, spec.label), fields.map((f) => build(f, path)));
    },
    links(spec, path) {
      return builders.list(Object.assign({
        itemLabel: 'label',
        newItem: () => ({ label: '새 버튼', href: '#', newTab: false, variant: 'outlined' }),
        renderItem: (itemPath) => builders.link({ label: '' }, itemPath, { variant: true })
      }, spec), path);
    },
    media(spec, path) {
      const m = val(path) || {};
      const id = fid();
      const preview = h('div', { class: 'media-field__preview' });
      const paint = () => {
        const cur = val(path) || {};
        preview.replaceChildren();
        if (!cur.src) { preview.append(h('span', { class: 'media-field__empty' }, '미디어 없음')); return; }
        const node = cur.type === 'video' ? h('video', { muted: true, playsInline: true, preload: 'metadata' }) : h('img', { alt: '' });
        PF.ui.setSrc(node, 'src', cur.src);
        preview.append(node);
      };
      paint();
      const update = (patch) => { set(path, Object.assign({}, val(path) || {}, patch)); paint(); srcInput.value = (val(path) || {}).src || ''; };
      const file = h('input', { type: 'file', accept: PF.config.media.accept, hidden: true, on: { change: async (e) => {
        const f = e.target.files[0];
        if (!f) return;
        if (f.size > PF.config.media.maxInlineBytes) PF.ui.snackbar('파일이 커서 내보내기 용량이 커질 수 있어요. 가능하면 assets 폴더 경로를 사용하세요.');
        const ref = await PF.db.saveMedia(f);
        update({ src: ref, type: f.type.startsWith('video') ? 'video' : 'image' });
        e.target.value = '';
      } } });
      const srcInput = h('input', { id, class: 'input', type: 'text', value: m.src && !PF.db.isLocalMedia(m.src) ? m.src : (m.src || ''),
        placeholder: 'assets/img/... 또는 https://', on: { change: (e) => update({ src: e.target.value }) } });
      const typeSel = h('select', { class: 'input', 'aria-label': '미디어 종류', on: { change: (e) => update({ type: e.target.value }) } },
        [['image', '이미지'], ['video', '영상']].map(([v, l]) => h('option', { value: v, selected: (m.type || 'image') === v }, l)));
      return h('fieldset', { class: 'fieldset media-field', dataset: { fieldPath: path } },
        h('legend', null, spec.label),
        preview,
        h('div', { class: 'field__row' },
          h('button', { class: 'abtn abtn--tonal', type: 'button', on: { click: () => file.click() } }, h('span', { class: 'icon icon--upload', 'aria-hidden': 'true' }), '파일 올리기'),
          typeSel,
          h('button', { class: 'abtn abtn--text', type: 'button', on: { click: () => update({ src: '' }) } }, '비우기')),
        file,
        h('label', { class: 'field__label', for: id }, '경로 / URL'), srcInput,
        build({ key: 'alt', label: '대체 텍스트 (설명)', type: 'text' }, path),
        (m.type === 'video') ? build({ key: 'poster', label: '영상 포스터 이미지 경로', type: 'text' }, path) : null,
        h('p', { class: 'field__help' }, '이미지를 페이지의 해당 위치에 끌어다 놓아도 교체됩니다.'));
    },
    list(spec, path) {
      const items = val(path) || [];
      const fs = h('fieldset', { class: 'fieldset list-field', dataset: { fieldPath: path } }, h('legend', null, `${spec.label} (${items.length})`));
      const mutate = (fn) => store.mutate((st) => { const arr = PF.getPath(st, path) || PF.setPath(st, path, []) && PF.getPath(st, path); fn(arr); }, { path });
      items.forEach((item, i) => {
        const itemPath = `${path}.${i}`;
        const title = (typeof item === 'object' ? PF.getPath(item, spec.itemLabel || 'title') : item) || `#${i + 1}`;
        const tools = h('div', { class: 'list-item__tools' },
          iconBtn('up', '위로', i === 0, () => mutate((a) => a.splice(i - 1, 0, a.splice(i, 1)[0]))),
          iconBtn('down', '아래로', i === items.length - 1, () => mutate((a) => a.splice(i + 1, 0, a.splice(i, 1)[0]))),
          iconBtn('copy', '복제', false, () => mutate((a) => a.splice(i + 1, 0, PF.clone(a[i])))),
          iconBtn('delete', '삭제', false, () => mutate((a) => a.splice(i, 1))));
        const body = spec.renderItem ? spec.renderItem(itemPath) : h('div', { class: 'list-item__body' }, (spec.fields || []).map((f) => build(f, itemPath)));
        const details = h('details', { class: 'list-item', dataset: { fieldPath: itemPath } },
          h('summary', null, h('span', { class: 'list-item__num' }, String(i + 1).padStart(2, '0')), h('span', { class: 'list-item__title' }, String(title).replace(/\n/g, ' ')), tools),
          body);
        fs.append(details);
      });
      fs.append(h('button', { class: 'abtn abtn--outlined abtn--block', type: 'button', on: { click: () => mutate((a) => a.push(spec.newItem ? spec.newItem() : emptyFrom(spec.fields))) } },
        h('span', { class: 'icon icon--add', 'aria-hidden': 'true' }), `${spec.label} 추가`));
      return fs;
    }
  };

  function emptyFrom(fields = []) {
    const o = {};
    fields.forEach((f) => {
      const empty = { media: PF.fieldKit.emptyMedia(), link: PF.fieldKit.emptyLink(), list: [], strings: [], links: [], toggle: true, number: 0 }[f.type];
      PF.setPath(o, f.key, empty !== undefined ? PF.clone(empty) : '');
    });
    return o;
  }

  function iconBtn(icon, label, disabled, fn) {
    return h('button', { class: 'icon-btn icon-btn--small', type: 'button', 'aria-label': label, title: label, disabled,
      on: { click: (e) => { e.preventDefault(); e.stopPropagation(); fn(); } } }, h('span', { class: `icon icon--${icon}`, 'aria-hidden': 'true' }));
  }

  function build(spec, basePath) {
    const path = join(basePath, spec.key);
    const b = builders[spec.type] || builders.text;
    return b(spec, path);
  }

  PF.fields = { build, iconBtn, emptyFrom };
})(window.PF);
