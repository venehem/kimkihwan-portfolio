/* PF — app namespace + small DOM/data utilities shared by every module.
   Classic scripts (not ES modules) so the site also runs from file:// with no server. */
(function (global) {
  'use strict';

  const PF = global.PF = global.PF || {};

  /** Hyperscript: h('div', { class: 'x', on: { click: fn }, dataset: {} }, ...children) */
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === 'class') el.className = Array.isArray(value) ? value.filter(Boolean).join(' ') : value;
        else if (key === 'style' && typeof value === 'object') {
          for (const [prop, v] of Object.entries(value)) el.style.setProperty(prop, v);
        } else if (key === 'dataset') Object.assign(el.dataset, value);
        else if (key === 'on') {
          for (const [type, fn] of Object.entries(value)) el.addEventListener(type, fn);
        } else if (key === 'text') el.textContent = value;
        else if (key in el && typeof value !== 'string') el[key] = value;
        else el.setAttribute(key, value === true ? '' : value);
      }
    }
    append(el, children);
    return el;
  }

  function append(el, children) {
    for (const child of children.flat(Infinity)) {
      if (child === undefined || child === null || child === false || child === '') continue;
      el.append(child instanceof Node ? child : document.createTextNode(String(child)));
    }
    return el;
  }

  /** Read/write nested values with dotted paths: "sections.3.steps.0.title" */
  function getPath(obj, path) {
    if (!path) return obj;
    return String(path).split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  }

  function setPath(obj, path, value) {
    const keys = String(path).split('.');
    const last = keys.pop();
    const target = keys.reduce((acc, key, i) => {
      if (acc[key] == null) acc[key] = /^\d+$/.test(keys[i + 1] || last) ? [] : {};
      return acc[key];
    }, obj);
    target[last] = value;
    return obj;
  }

  const clone = (v) => (typeof structuredClone === 'function' ? structuredClone(v) : JSON.parse(JSON.stringify(v)));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
  const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;

  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function slugify(text) {
    return String(text || '').trim().toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') || uid('section');
  }

  /** Multi-line text → spans per line (used for reveal-by-line typography). */
  function lines(text, className = 'line') {
    return String(text || '').split('\n').map((line, i) =>
      h('span', { class: className, style: { '--i': i } }, h('span', { class: `${className}__inner` }, line)));
  }

  const prefersReducedMotion = () => global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = () => global.matchMedia('(pointer: coarse)').matches;

  /** Lightweight pub/sub */
  function emitter() {
    const map = new Map();
    return {
      on(type, fn) { (map.get(type) || map.set(type, new Set()).get(type)).add(fn); return () => map.get(type).delete(fn); },
      emit(type, payload) { (map.get(type) || []).forEach((fn) => fn(payload)); }
    };
  }

  Object.assign(PF, {
    h, append, getPath, setPath, clone, clamp, isBlank, uid, debounce, slugify, lines,
    prefersReducedMotion, isCoarsePointer, emitter,
    bus: emitter(),
    sections: PF.sections || {}   // section type registry (see js/sections/*.js)
  });
})(window);
