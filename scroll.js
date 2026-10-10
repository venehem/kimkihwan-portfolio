/* Scroll engine — wheel smoothing + scroll-driven state written to CSS custom properties.
   Sections declare behaviour with data attributes; CSS does the actual visuals:
     [data-pin]         sticky stage; writes --p (0→1) across its scroll length (data-pin-length, in vh)
     [data-steps="n"]   on a pin; toggles .is-active on [data-step-index] children, writes --step-p
     [data-hscroll]     on a pin; vertical wheel → horizontal track translation (--x)
     [data-reveal]      adds .is-in once it enters the viewport
     [data-parallax=k]  writes --py (-1→1 around viewport centre) multiplied by k
     [data-count]       counts up to its numeric value on reveal
     [data-section]     tracked for active chapter / header theme */
(function (PF) {
  'use strict';
  const { clamp } = PF;
  const events = PF.emitter();

  let pins = [], parallaxEls = [], sectionEls = [], io = null;
  let vh = window.innerHeight;
  let ticking = false, lastY = window.scrollY;
  let settings = {};

  /* ---------- Smooth wheel ---------- */
  const wheel = { target: window.scrollY, current: window.scrollY, running: false, enabled: false, anchor: null };

  function maxScroll() { return document.documentElement.scrollHeight - window.innerHeight; }

  function isNativeScrollTarget(target) {
    return target.closest && target.closest('[data-native-scroll], dialog[open], .admin-sheet, .admin-bar, textarea, select');
  }

  function onWheel(e) {
    if (!wheel.enabled || e.ctrlKey || e.defaultPrevented || isNativeScrollTarget(e.target)) return;
    if (document.querySelector('dialog[open]')) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vh : 1;
    const dy = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : 0) * unit * (settings.wheelMultiplier || 1);
    if (!dy) return;
    e.preventDefault();
    wheel.anchor = null;
    if (!wheel.running) wheel.current = window.scrollY;
    wheel.target = clamp(wheel.target + dy, 0, maxScroll());
    startWheel();
  }

  function startWheel() {
    if (wheel.running) return;
    wheel.running = true;
    requestAnimationFrame(stepWheel);
  }

  function stepWheel() {
    const lerp = settings.wheelLerp || 0.1;
    // Re-resolve anchored targets every frame: lazy media above can shift layout mid-flight.
    if (wheel.anchor) {
      const y = yFor(wheel.anchor.target);
      if (y !== null) wheel.target = clamp(y + wheel.anchor.offset, 0, maxScroll());
    }
    wheel.current += (wheel.target - wheel.current) * lerp;
    if (Math.abs(wheel.target - wheel.current) < 0.5) wheel.current = wheel.target;
    window.scrollTo(0, wheel.current);
    if (wheel.current !== wheel.target) requestAnimationFrame(stepWheel);
    else { wheel.running = false; wheel.anchor = null; }
  }

  /* ---------- Measurements ---------- */
  function measureHScroll(pin) {
    const track = pin.el.querySelector('[data-hscroll-track]');
    const stage = pin.el.querySelector('.pin__stage');
    if (!track || !stage) return;
    const distance = Math.max(0, track.scrollWidth - stage.clientWidth);
    pin.distance = distance;
    pin.el.style.setProperty('--pin-length', (distance / vh + 0.35).toFixed(3));
  }

  function measure() {
    vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    pins.forEach((pin) => { if (pin.hscroll) measureHScroll(pin); });
    update();
  }

  /* ---------- Per-frame update ---------- */
  function update() {
    ticking = false;
    const y = window.scrollY;
    const docH = maxScroll();
    document.documentElement.style.setProperty('--page-p', docH > 0 ? (y / docH).toFixed(4) : 0);

    for (const pin of pins) {
      const rect = pin.el.getBoundingClientRect();
      const range = rect.height - vh;
      const p = range > 0 ? clamp(-rect.top / range) : 0;
      if (Math.abs(p - pin.p) < 0.0005 && pin.ready) continue;
      pin.ready = true;
      pin.p = p;
      pin.el.style.setProperty('--p', p.toFixed(4));
      if (pin.hscroll) pin.el.style.setProperty('--x', `${(-p * pin.distance).toFixed(1)}px`);
      if (pin.steps) {
        const n = pin.steps;
        const raw = p * n;
        const active = Math.min(n - 1, Math.floor(raw));
        pin.el.style.setProperty('--step-p', (raw - active).toFixed(4));
        if (active !== pin.active) {
          pin.active = active;
          pin.el.dataset.activeStep = active;
          pin.el.querySelectorAll('[data-step-index]').forEach((node) => {
            const on = Number(node.dataset.stepIndex) === active;
            node.classList.toggle('is-active', on);
            if (node.matches('[data-step-panel]')) node.setAttribute('aria-hidden', String(!on));
            if (node.matches('[data-step-dot]')) node.setAttribute('aria-current', on ? 'step' : 'false');
          });
        }
      }
    }

    for (const el of parallaxEls) {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) continue;
      const offset = clamp((rect.top + rect.height / 2 - vh / 2) / vh, -1, 1);
      el.style.setProperty('--py', (offset * (Number(el.dataset.parallax) || 1)).toFixed(4));
    }

    // Active section = the one under the header line.
    const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sys-header-h')) || 64) * 0.5;
    let current = null;
    for (const el of sectionEls) {
      const r = el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) { current = el; break; }
    }
    if (current && current !== update.current) {
      update.current = current;
      events.emit('section', { el: current, id: current.id, theme: current.dataset.theme, chapter: current.dataset.chapter });
    }

    const dir = y > lastY + 2 ? 'down' : y < lastY - 2 ? 'up' : null;
    if (dir) events.emit('direction', { dir, y });
    lastY = y;
  }

  function onScroll() {
    if (!wheel.running) { wheel.target = window.scrollY; wheel.current = window.scrollY; }
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  /* ---------- Reveal + counters ---------- */
  function countUp(el) {
    const end = Number(String(el.dataset.count).replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(end) || PF.prefersReducedMotion()) return;
    const decimals = (String(end).split('.')[1] || '').length;
    const duration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sys-dur-xlong')) * 1.4 || 1400;
    const start = performance.now();
    const fmt = new Intl.NumberFormat(document.documentElement.lang || undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    (function frame(now) {
      const t = clamp((now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt.format(end * eased);
      if (t < 1) requestAnimationFrame(frame);
    })(start);
  }

  function observe(root) {
    io && io.disconnect();
    const revealOn = settings.reveal !== false && !PF.prefersReducedMotion();
    const targets = root.querySelectorAll('[data-reveal]');
    if (!revealOn || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }

  /* ---------- Navigation ---------- */
  function yFor(target) {
    if (typeof target === 'number') return target;
    const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
    if (!el) return null;
    return el.getBoundingClientRect().top + window.scrollY;
  }

  function scrollTo(target, opts = {}) {
    const y = yFor(target);
    if (y === null) return false;
    const top = clamp(y + (opts.offset || 0), 0, maxScroll());
    if (wheel.enabled && !opts.instant) {
      wheel.current = window.scrollY;
      wheel.target = top;
      wheel.anchor = typeof target === 'number' ? null : { target, offset: opts.offset || 0 };
      startWheel();
    } else {
      window.scrollTo({ top, behavior: opts.instant || PF.prefersReducedMotion() ? 'auto' : 'smooth' });
    }
    return true;
  }

  /** Scroll so a pinned section shows a given step (0-based). */
  function scrollToStep(pinEl, index) {
    const n = Number(pinEl.dataset.steps) || 1;
    const range = pinEl.offsetHeight - vh;
    scrollTo(yFor(pinEl) + range * ((index + 0.5) / n));
  }

  /* ---------- Lifecycle ---------- */
  function init(root, opts = {}) {
    settings = opts;
    wheel.enabled = !!opts.smoothWheel && !PF.prefersReducedMotion() && !PF.isCoarsePointer();
    pins = [...root.querySelectorAll('[data-pin]')].map((el) => ({
      el, p: -1, active: -1, ready: false,
      steps: Number(el.dataset.steps) || 0,
      hscroll: el.hasAttribute('data-hscroll'),
      distance: 0
    }));
    pins.forEach((pin) => { if (pin.el.dataset.pinLength) pin.el.style.setProperty('--pin-length', pin.el.dataset.pinLength); });
    parallaxEls = [...root.querySelectorAll('[data-parallax]')];
    sectionEls = [...root.querySelectorAll('[data-section]')];
    update.current = null;
    observe(root);
    measure();
    // Images change track widths once loaded.
    root.querySelectorAll('[data-hscroll] img').forEach((img) => { if (!img.complete) img.addEventListener('load', measureDebounced, { once: true }); });
  }

  const measureDebounced = PF.debounce(measure, 120);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measureDebounced);

  PF.scroll = { init, scrollTo, scrollToStep, on: events.on, refresh: measure };
})(window.PF);
