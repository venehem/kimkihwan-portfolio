/* App-level configuration that is NOT content (content lives in data/content.js).
   Keep theme names in sync with [data-theme] blocks in css/tokens.css. */
(function (PF) {
  'use strict';

  PF.config = {
    storage: {
      dbName: 'pf-portfolio',
      dbVersion: 1,
      stores: { state: 'state', media: 'media' },
      draftKey: 'draft',
      sessionAdminKey: 'pf-admin-session',
      mediaScheme: 'idb://'
    },
    themes: [
      { value: 'black', label: 'Black' },
      { value: 'dark', label: 'Dark' },
      { value: 'ink', label: 'Ink (blue grey)' },
      { value: 'stone', label: 'Stone (warm grey)' },
      { value: 'taupe', label: 'Taupe' },
      { value: 'light', label: 'Light' }
    ],
    /** Pin length (in viewport heights) per scroll-driven section type. */
    pin: { hero: 2, chapter: 2.6, storyPerStep: 1, featureExtra: 0 },
    history: { limit: 80 },
    admin: { queryKey: 'admin', hash: '#admin', shortcut: { key: 'e', ctrl: true, shift: true }, renderDebounce: 220 },
    media: { maxInlineBytes: 25 * 1024 * 1024, accept: 'image/*,video/*' },
    breakpoints: { compact: 600, medium: 840, expanded: 1200 }
  };
})(window.PF);
