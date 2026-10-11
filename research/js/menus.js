/*
 * menus.js - the drop-down menus in the tab row (a button with data-menu in index.html):
 * Versions (this version, Compare, Genealogy) and Help. A bench with views of its own adds
 * a menu here, as the SHRDLU and Spacewar! benches do for their lenses on the code.
 */
(function (root) {
  'use strict';
  var SW = root.SW, B = SW.BENCH;

  var tabMenu = null;
  function closeTabMenu() { if (!tabMenu) return; tabMenu.el.remove(); tabMenu.btn.setAttribute('aria-expanded', 'false'); tabMenu = null; }

  var VERS = [['about', 'This version', 'Its record, sources and annotations'],
              ['compare', 'Compare', 'Two versions side by side'],
              ['genealogy', 'Genealogy', 'How the versions descend']];
  var HELP = [['Getting started', [['tour', 'Take the welcome tour', 'A few stops through the bench'],
                                   ['join', 'Joining the annotation group', 'An invitation, a Hypothesis account and your tokens, step by step'],
                                   ['anno', 'Advanced annotation', 'Rich text, and links between annotations across versions'],
                                   ['codes', 'Codes, links and sharing', 'Every item’s code, links in annotations, Share, Findings and My notes'],
                                   ['paratexts', 'Paratexts', 'Scans and documents: collections, views, metadata, links']]],
              ['Your bench', [['settings', 'Settings', 'Initials, group, theme, fonts'],
                              ['backup', 'Back up everything', 'Notes, drafts, settings and findings in one file'],
                              ['restore', 'Restore from a backup…', 'Brings back notes and drafts beside those here']]],
              ['The project', [['code', 'Source code on GitHub ↗', B.repo.replace(/^https?:\/\//, '')],
                               ['issue', 'Report a problem ↗', 'GitHub issues'],
                               ['about', 'About the bench', 'Version, sources, citation']]]];

  function item(h, on) { return '<button data-pick="' + h[0] + '"' + (on ? ' class="on"' : '') + '><b>' + SW.esc(h[1]) + '</b><span>' + SW.esc(h[2]) + '</span></button>'; }
  function menuHTML(which) {
    if (which === 'help') {
      var dm = document.querySelector('meta[name="bench-date"]');
      return HELP.map(function (g, i) {
        return (i ? '<hr class="menu-rule">' : '') + '<div class="menu-group">' + SW.esc(g[0]) + '</div>' + g[1].map(function (h) { return item(h); }).join('');
      }).join('') + '<div class="help-ver hint">' + SW.esc(B.title) + ' ' + SW.esc(SW.VERSION) + (dm ? ', ' + SW.esc(SW.fmtDate(dm.content)) : '') + '</div>';
    }
    if (which === 'versions') return VERS.map(function (h) { return item(h, SW.state.tab === h[0]); }).join('');
    return '';
  }
  function pick(which, p) {
    if (which === 'versions') { SW.setTab(p); return; }
    if (p === 'tour') SW.tours.start('welcome');
    else if (p === 'codes' || p === 'paratexts') SW.guide(p);
    else if (p === 'anno') SW.notes.help();
    else if (p === 'join') SW.notes.joinHelp();
    else if (p === 'backup') SW.backup.save();
    else if (p === 'restore') SW.backup.restore();
    else if (p === 'about') SW.$('#btn-about').click();
    else if (p === 'settings') SW.$('#btn-settings').click();
    else window.open(p === 'code' ? B.repo : B.repo + '/issues', '_blank', 'noopener');
  }

  SW.$$('#tabs [data-menu]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var which = btn.dataset.menu;
      if (tabMenu && tabMenu.btn === btn) { closeTabMenu(); return; }
      closeTabMenu();
      var r = btn.getBoundingClientRect(), el = SW.el('div', { class: 'tab-menu lens-list', role: 'menu', 'data-w': which }, menuHTML(which));
      document.body.appendChild(el);
      el.style.top = r.bottom + 'px';
      el.style.left = Math.max(6, Math.min(r.left, window.innerWidth - el.offsetWidth - 6)) + 'px';
      btn.setAttribute('aria-expanded', 'true');
      tabMenu = { el: el, btn: btn };
      el.addEventListener('click', function (ev) {
        var t = ev.target.closest('[data-pick]');
        if (!t) return;
        closeTabMenu();
        pick(which, t.dataset.pick);
      });
    });
  });
  document.addEventListener('mousedown', function (e) { if (tabMenu && !tabMenu.el.contains(e.target) && !tabMenu.btn.contains(e.target)) closeTabMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeTabMenu(); });
  window.addEventListener('resize', closeTabMenu);
})(this);
