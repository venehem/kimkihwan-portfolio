/* Admin mode — edit every piece of content in place.
   Enter: add ?admin to the URL (or #admin, or Ctrl+Shift+E). Changes autosave to this browser (IndexedDB);
   publish by exporting content.js and replacing data/content.js. */
(function (PF) {
  'use strict';
  const { h, store, ui } = PF;
  const cfg = PF.config.admin;
  const sessionKey = PF.config.storage.sessionAdminKey;

  const state = { active: false, selected: null, tab: 'sections', sheetOpen: true };
  let bar, sheet, sheetBody, tabButtons = {}, undoBtn, redoBtn, statusText;

  /* ---------- Settings schema (site-wide) ---------- */
  function settingsFields() {
    const labels = Object.keys(store.get('settings.labels') || {}).map((k) => ({ key: `labels.${k}`, label: `UI 문구 · ${k}`, type: 'text' }));
    return [
      { group: '기본 정보', fields: [
        { key: 'meta.title', label: '브라우저 탭 제목', type: 'text' },
        { key: 'meta.description', label: '사이트 설명 (검색/공유)', type: 'textarea', rows: 2 },
        { key: 'meta.lang', label: '언어 코드', type: 'text' },
        { key: 'brand.name', label: '로고 텍스트', type: 'text' }] },
      { group: '테마', fields: [
        { key: 'theme.accent', label: '포인트 컬러', type: 'color' },
        { key: 'theme.onAccent', label: '포인트 위 글자색', type: 'color' },
        { key: 'theme.fontSans', label: '본문 폰트 (CSS font-family, 비우면 기본)', type: 'text' },
        { key: 'theme.fontDisplay', label: '제목 폰트 (CSS font-family, 비우면 기본)', type: 'text' }] },
      { group: '헤더 · 메뉴', fields: [
        { key: 'header.showChapterNav', label: '상단 메뉴 표시', type: 'toggle' },
        { key: 'header.cta', label: '헤더 버튼', type: 'link' },
        { key: 'nav.extra', label: '추가 메뉴 링크', type: 'links' },
        { key: 'ui.showSideDots', label: '우측 섹션 인디케이터', type: 'toggle' },
        { key: 'ui.showProgress', label: '상단 진행 바', type: 'toggle' }] },
      { group: '스크롤 · 모션', fields: [
        { key: 'motion.smoothWheel', label: '부드러운 휠 스크롤', type: 'toggle', help: '터치 기기·동작 줄이기 설정에서는 자동으로 꺼집니다' },
        { key: 'motion.wheelLerp', label: '휠 감속 (0.05 느림 ~ 0.3 빠름)', type: 'number', min: 0.03, max: 0.5, step: 0.01 },
        { key: 'motion.wheelMultiplier', label: '휠 이동량 배수', type: 'number', min: 0.3, max: 3, step: 0.1 },
        { key: 'motion.reveal', label: '등장 애니메이션', type: 'toggle' }] },
      { group: '푸터', fields: [
        { key: 'footer.copyright', label: '저작권 문구', type: 'text' },
        { key: 'footer.links', label: '푸터 링크', type: 'links' }] },
      { group: 'UI 문구', fields: labels },
      { group: '관리자', fields: [
        { key: 'admin.passcode', label: '관리자 비밀번호', type: 'text', help: '정적 사이트용 간이 잠금입니다. 실제 보안이 필요하면 서버 인증을 사용하세요.' }] }
    ];
  }

  /* ---------- Dialog helpers ---------- */
  function dialog({ title, body, actions }) {
    return new Promise((resolve) => {
      const d = h('dialog', { class: 'admin-dialog', 'aria-labelledby': 'admin-dialog-title' },
        h('form', { method: 'dialog', class: 'admin-dialog__form' },
          h('h2', { id: 'admin-dialog-title', class: 'admin-dialog__title' }, title),
          body,
          h('div', { class: 'admin-dialog__actions' }, actions.map((a) =>
            h('button', { class: ['abtn', `abtn--${a.variant || 'text'}`], value: a.value, type: 'submit' }, a.label)))));
      d.addEventListener('close', () => { resolve(d.returnValue); d.remove(); });
      document.body.append(d);
      d.showModal();
    });
  }

  const confirm = (title, message, okLabel, danger) => dialog({
    title, body: h('p', { class: 'admin-dialog__text' }, message),
    actions: [{ label: '취소', value: 'cancel' }, { label: okLabel, value: 'ok', variant: danger ? 'danger' : 'filled' }]
  }).then((v) => v === 'ok');

  async function login() {
    const pass = store.get('settings.admin.passcode');
    if (!pass || sessionStorage.getItem(sessionKey) === '1') return true;
    const input = h('input', { class: 'input', type: 'password', autocomplete: 'current-password', 'aria-label': '비밀번호', required: true });
    const result = await dialog({
      title: '관리자 모드', body: h('div', { class: 'field' }, h('p', { class: 'admin-dialog__text' }, '비밀번호를 입력하세요.'), input),
      actions: [{ label: '취소', value: 'cancel' }, { label: '들어가기', value: 'ok', variant: 'filled' }]
    });
    if (result === 'ok' && input.value === pass) { sessionStorage.setItem(sessionKey, '1'); return true; }
    if (result === 'ok') ui.snackbar('비밀번호가 맞지 않아요.');
    return false;
  }

  /* ---------- File I/O ---------- */
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = h('a', { href: url, download: name });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  async function exportAs(kind) {
    ui.snackbar('파일을 만드는 중이에요…');
    if (kind === 'js') download('content.js', await store.exportJS(), 'text/javascript');
    else download('content.json', await store.exportJSON(), 'application/json');
    ui.snackbar(kind === 'js' ? 'content.js를 data 폴더의 파일과 바꾸면 게시됩니다.' : 'JSON 백업을 저장했어요.');
  }

  function importFile() {
    const input = h('input', { type: 'file', accept: '.json,.js,application/json,text/javascript' });
    input.addEventListener('change', async () => {
      const f = input.files[0];
      if (!f) return;
      try {
        const data = store.parseImport(await f.text());
        if (await confirm('콘텐츠 가져오기', `"${f.name}"의 내용으로 현재 편집본을 바꿉니다. 되돌리기로 복구할 수 있어요.`, '가져오기')) {
          store.replace(data);
          ui.snackbar('가져왔어요.', { label: '되돌리기', onClick: () => store.undo() });
        }
      } catch (err) { ui.snackbar(`가져오지 못했어요: ${err.message}`); }
    });
    input.click();
  }

  /* ---------- Shell ---------- */
  function abtn(icon, label, onClick, opts = {}) {
    return h('button', { class: ['abtn', `abtn--${opts.variant || 'text'}`, opts.iconOnly && 'abtn--icon'], type: 'button', title: label, 'aria-label': opts.iconOnly ? label : null, on: { click: onClick } },
      icon ? h('span', { class: `icon icon--${icon}`, 'aria-hidden': 'true' }) : null, opts.iconOnly ? null : label);
  }

  function buildBar() {
    undoBtn = abtn('undo', '실행 취소 (Ctrl+Z)', () => store.undo(), { iconOnly: true });
    redoBtn = abtn('redo', '다시 실행 (Ctrl+Shift+Z)', () => store.redo(), { iconOnly: true });
    statusText = h('span', { class: 'admin-bar__status', role: 'status' });
    const exportMenu = h('details', { class: 'admin-menu' },
      h('summary', { class: 'abtn abtn--filled' }, h('span', { class: 'icon icon--download', 'aria-hidden': 'true' }), '내보내기'),
      h('div', { class: 'admin-menu__list' },
        h('button', { type: 'button', on: { click: (e) => { e.target.closest('details').open = false; exportAs('js'); } } }, h('strong', null, 'content.js'), h('small', null, '사이트에 게시할 파일')),
        h('button', { type: 'button', on: { click: (e) => { e.target.closest('details').open = false; exportAs('json'); } } }, h('strong', null, 'content.json'), h('small', null, '백업 / 다른 곳에서 가져오기'))));
    bar = h('div', { class: 'admin-bar', role: 'toolbar', 'aria-label': '관리자 도구', 'data-theme': 'light' },
      h('strong', { class: 'admin-bar__title' }, h('span', { class: 'icon icon--edit', 'aria-hidden': 'true' }), '관리자 모드'),
      statusText,
      h('div', { class: 'admin-bar__group' }, undoBtn, redoBtn),
      h('div', { class: 'admin-bar__group admin-bar__group--end' },
        abtn('settings', '편집 패널', () => toggleSheet(), { variant: 'tonal' }),
        abtn('upload', '가져오기', importFile),
        exportMenu,
        abtn('', '게시본으로 초기화', async () => {
          if (await confirm('편집본 초기화', '이 브라우저에 저장된 편집 내용을 지우고 data/content.js 상태로 되돌립니다.', '초기화', true)) {
            await store.discardDraft();
            ui.snackbar('게시본으로 되돌렸어요.', { label: '되돌리기', onClick: () => store.undo() });
          }
        }),
        abtn('close', '나가기', exit, { iconOnly: true })));
    document.body.append(bar);
  }

  function buildSheet() {
    const tabs = [['sections', '섹션'], ['edit', '편집'], ['site', '사이트 설정']];
    sheetBody = h('div', { class: 'admin-sheet__body', 'data-native-scroll': '' });
    sheet = h('aside', { class: 'admin-sheet', 'aria-label': '편집 패널', 'data-theme': 'light' },
      h('div', { class: 'admin-tabs', role: 'tablist' }, tabs.map(([key, label]) => {
        tabButtons[key] = h('button', { class: 'admin-tab', role: 'tab', type: 'button', on: { click: () => showTab(key) } }, label);
        return tabButtons[key];
      })),
      sheetBody);
    document.body.append(sheet);
  }

  function toggleSheet(force) {
    state.sheetOpen = force ?? !state.sheetOpen;
    document.body.classList.toggle('is-sheet-open', state.sheetOpen);
    PF.scroll.refresh();
  }

  function refreshBar() {
    undoBtn.disabled = !store.canUndo;
    redoBtn.disabled = !store.canRedo;
    statusText.textContent = store.hasDraft ? '편집본 자동 저장됨 · 게시하려면 내보내기' : '게시본과 동일';
  }

  function showTab(key) {
    state.tab = key;
    Object.entries(tabButtons).forEach(([k, b]) => b.setAttribute('aria-selected', String(k === key)));
    const keepScroll = sheetBody.scrollTop;
    const views = { sections: sectionsView, edit: editView, site: siteView };
    sheetBody.replaceChildren(views[key]());
    sheetBody.scrollTop = keepScroll;
  }

  /* ---------- Views ---------- */
  function sectionsView() {
    const list = store.state.sections;
    const typeOptions = Object.values(PF.sections).map((d) => h('option', { value: d.type }, d.label));
    const typeSel = h('select', { class: 'input', 'aria-label': '추가할 섹션 종류' }, typeOptions);
    const help = h('p', { class: 'field__help' });
    const describe = () => { help.textContent = PF.sections[typeSel.value]?.description || ''; };
    typeSel.addEventListener('change', describe);
    describe();

    return h('div', { class: 'admin-view' },
      h('p', { class: 'admin-hint' }, '페이지에서 요소를 클릭하면 해당 섹션 편집으로 이동하고, 글자를 더블클릭하면 바로 고칠 수 있어요.'),
      h('ol', { class: 'section-list' }, list.map((s, i) => {
        const def = PF.sections[s.type];
        const title = (s.navLabel || s.title || s.id || '').replace(/\n/g, ' ');
        return h('li', { class: ['section-row', state.selected === i && 'is-selected', s.visible === false && 'is-hidden'] },
          h('button', { class: 'section-row__main', type: 'button', on: { click: () => select(i, { scroll: true }) } },
            h('span', { class: 'section-row__num' }, String(i + 1).padStart(2, '0')),
            h('span', { class: 'section-row__text' }, h('strong', null, title || '(제목 없음)'), h('small', null, def ? def.label : s.type))),
          h('div', { class: 'section-row__tools' },
            PF.fields.iconBtn(s.visible === false ? 'visibility-off' : 'visibility', s.visible === false ? '보이기' : '숨기기', false,
              () => store.mutate((st) => { st.sections[i].visible = st.sections[i].visible === false; })),
            PF.fields.iconBtn('up', '위로', i === 0, () => move(i, -1)),
            PF.fields.iconBtn('down', '아래로', i === list.length - 1, () => move(i, 1)),
            PF.fields.iconBtn('copy', '복제', false, () => store.mutate((st) => {
              const copy = PF.clone(st.sections[i]); copy.id = `${copy.id}-copy`;
              st.sections.splice(i + 1, 0, copy);
            })),
            PF.fields.iconBtn('delete', '삭제', false, async () => {
              if (await confirm('섹션 삭제', `"${title}" 섹션을 삭제할까요? 되돌리기로 복구할 수 있어요.`, '삭제', true)) {
                store.mutate((st) => st.sections.splice(i, 1));
                state.selected = null;
              }
            })));
      })),
      h('div', { class: 'admin-card' },
        h('h3', { class: 'admin-card__title' }, '섹션 추가'),
        typeSel, help,
        h('button', { class: 'abtn abtn--filled abtn--block', type: 'button', on: { click: () => addSection(typeSel.value) } },
          h('span', { class: 'icon icon--add', 'aria-hidden': 'true' }),
          state.selected != null ? '선택한 섹션 다음에 추가' : '맨 아래에 추가')));
  }

  function editView() {
    const i = state.selected;
    const s = i != null ? store.state.sections[i] : null;
    if (!s) return h('div', { class: 'admin-view' }, h('p', { class: 'admin-empty' }, '편집할 섹션을 [섹션] 탭이나 페이지에서 선택하세요.'));
    const def = PF.sections[s.type] || { fields: [] };
    const base = `sections.${i}`;
    return h('div', { class: 'admin-view' },
      h('div', { class: 'admin-view__head' },
        h('p', { class: 'admin-view__type' }, def.label || s.type),
        h('h2', { class: 'admin-view__title' }, (s.title || s.id || '').replace(/\n/g, ' ')),
        h('button', { class: 'abtn abtn--text', type: 'button', on: { click: () => PF.scroll.scrollTo(s.id) } }, '페이지에서 보기')),
      h('details', { class: 'admin-group' }, h('summary', null, '섹션 공통 설정'), PF.baseFields.map((f) => PF.fields.build(f, base))),
      def.fields.map((f) => PF.fields.build(f, base)));
  }

  function siteView() {
    return h('div', { class: 'admin-view' }, settingsFields().map((g, gi) =>
      h('details', { class: 'admin-group', open: gi === 0 }, h('summary', null, g.group), g.fields.map((f) => PF.fields.build(f, 'settings')))));
  }

  /* ---------- Actions ---------- */
  function move(i, dir) {
    store.mutate((st) => { const [s] = st.sections.splice(i, 1); st.sections.splice(i + dir, 0, s); });
    if (state.selected === i) state.selected = i + dir;
  }

  function addSection(type) {
    const def = PF.sections[type];
    const at = state.selected != null ? state.selected + 1 : store.state.sections.length;
    const section = Object.assign({ id: PF.uid(type), type, visible: true, navLabel: '' }, def.defaults());
    store.mutate((st) => st.sections.splice(at, 0, section));
    select(at, { scroll: true });
  }

  function select(i, opts = {}) {
    state.selected = i;
    document.querySelectorAll('.sec.is-admin-selected').forEach((n) => n.classList.remove('is-admin-selected'));
    const sec = document.querySelector(`.sec[data-path="sections.${i}"]`);
    sec?.classList.add('is-admin-selected');
    if (opts.scroll && sec) PF.scroll.scrollTo(sec);
    toggleSheet(true);
    showTab('edit');
    if (opts.field) focusField(opts.field);
  }

  function focusField(path) {
    // Walk up the path until a matching field exists (group targets point to lists).
    let p = path;
    let node = null;
    while (p && !(node = sheetBody.querySelector(`[data-field-path="${CSS.escape(p)}"]`))) p = p.split('.').slice(0, -1).join('.');
    if (!node) return;
    node.closest('details:not([open])')?.setAttribute('open', '');
    if (node.tagName === 'DETAILS') node.open = true;
    node.scrollIntoView({ block: 'center', behavior: PF.prefersReducedMotion() ? 'auto' : 'smooth' });
    node.classList.remove('is-flash'); void node.offsetWidth; node.classList.add('is-flash');
  }

  /* ---------- Page interaction ---------- */
  function intercept(e) {
    if (e.target.closest('.admin-bar, .admin-sheet, .admin-dialog, [contenteditable="plaintext-only"], [contenteditable="true"]')) return false;
    const target = e.target.closest('[data-edit]');
    const sec = e.target.closest('.sec[data-path]');
    if (!target && !sec) return false;
    if (target) e.preventDefault();
    const index = sec ? Number(sec.dataset.path.split('.')[1]) : state.selected;
    const field = target?.dataset.edit;
    if (field && field.startsWith('settings.')) { toggleSheet(true); showTab('site'); focusField(field.replace(/^settings\./, 'settings.')); return true; }
    if (index != null) select(index, { field });
    return !!target;
  }

  function inlineEdit(e) {
    if (!state.active) return;
    const el = e.target.closest('[data-edit-kind="text"], [data-edit-kind="multiline"]');
    if (!el || el.closest('.admin-sheet, .admin-bar')) return;
    e.preventDefault();
    const path = el.dataset.edit;
    const multiline = el.dataset.editKind === 'multiline';
    el.textContent = store.get(path) ?? '';
    el.setAttribute('contenteditable', 'plaintext-only');
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
    el.classList.add('is-inline-editing');
    el.focus();
    const range = document.createRange(); range.selectNodeContents(el);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    const onInput = () => store.set(path, el.innerText.replace(/\n$/, ''), { silent: true });
    const onKey = (ev) => {
      if (ev.key === 'Escape' || (ev.key === 'Enter' && (!multiline || ev.metaKey || ev.ctrlKey))) { ev.preventDefault(); el.blur(); }
    };
    const finish = () => {
      el.removeEventListener('input', onInput); el.removeEventListener('keydown', onKey);
      el.removeAttribute('contenteditable'); el.classList.remove('is-inline-editing');
      rerender();
      if (state.tab === 'edit') showTab('edit');
    };
    el.addEventListener('input', onInput);
    el.addEventListener('keydown', onKey);
    el.addEventListener('blur', finish, { once: true });
  }

  function bindDrop() {
    document.addEventListener('dragover', (e) => {
      const t = state.active && e.target.closest('[data-edit-kind="media"]');
      if (!t) return;
      e.preventDefault();
      document.querySelectorAll('.is-drop-target').forEach((n) => n !== t && n.classList.remove('is-drop-target'));
      t.classList.add('is-drop-target');
    });
    document.addEventListener('dragleave', (e) => e.target.closest?.('[data-edit-kind="media"]')?.classList.remove('is-drop-target'));
    document.addEventListener('drop', async (e) => {
      const t = state.active && e.target.closest('[data-edit-kind="media"]');
      if (!t) return;
      e.preventDefault();
      t.classList.remove('is-drop-target');
      const f = e.dataTransfer.files[0];
      if (!f || !/^(image|video)\//.test(f.type)) { ui.snackbar('이미지나 영상 파일만 넣을 수 있어요.'); return; }
      const ref = await PF.db.saveMedia(f);
      const path = t.dataset.edit;
      store.set(path, Object.assign({}, store.get(path) || {}, { src: ref, type: f.type.startsWith('video') ? 'video' : 'image' }));
      ui.snackbar('미디어를 교체했어요.', { label: '되돌리기', onClick: () => store.undo() });
    });
  }

  /* ---------- Render sync ---------- */
  const rerender = PF.debounce(() => {
    PF.app.render({ preserveScroll: true });
    if (state.selected != null) document.querySelector(`.sec[data-path="sections.${state.selected}"]`)?.classList.add('is-admin-selected');
  }, cfg.renderDebounce);

  function onChange(evt) {
    refreshBar();
    if (evt.silent) return;
    rerender();
    if (evt.structural) {
      if (state.selected != null && state.selected >= store.state.sections.length) state.selected = null;
      showTab(state.tab);
    } else if (state.tab === 'sections') showTab('sections');
  }

  function exit() {
    sessionStorage.removeItem(sessionKey);
    const url = new URL(location.href);
    url.searchParams.delete(cfg.queryKey);
    if (url.hash === cfg.hash) url.hash = '';
    location.href = url.toString();
  }

  /* ---------- Boot ---------- */
  function requested() {
    const url = new URL(location.href);
    return url.searchParams.has(cfg.queryKey) || url.hash === cfg.hash;
  }

  async function start() {
    if (!(await login())) return;
    state.active = true;
    document.body.classList.add('is-admin', 'is-sheet-open');
    buildBar();
    buildSheet();
    showTab('sections');
    refreshBar();
    store.on('change', onChange);
    document.addEventListener('dblclick', inlineEdit);
    document.addEventListener('click', (e) => {
      document.querySelectorAll('.admin-menu[open]').forEach((m) => { if (!m.contains(e.target)) m.open = false; });
    });
    bindDrop();
    document.addEventListener('keydown', (e) => {
      const typing = e.target.closest('input, textarea, select, [contenteditable]');
      if (typing || !(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      e.shiftKey ? store.redo() : store.undo();
    });
    PF.app.render({ preserveScroll: true });
    if (store.hasDraft) ui.snackbar('이 브라우저에 저장된 편집본을 불러왔어요.');
  }

  function init() {
    document.addEventListener('keydown', (e) => {
      const s = cfg.shortcut;
      if (state.active || e.key.toLowerCase() !== s.key || !!e.shiftKey !== s.shift || !(e.ctrlKey || e.metaKey) !== !s.ctrl) return;
      e.preventDefault();
      const url = new URL(location.href);
      url.searchParams.set(cfg.queryKey, '');
      location.href = url.toString();
    });
    if (requested()) start();
  }

  PF.admin = { init, intercept, get active() { return state.active; } };
})(window.PF);
