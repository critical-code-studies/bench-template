/*
 * core.js - this bench's own state and helpers: its texts fetched, built and indexed (its
 * references and the files' SWHIDs are bench-kit's kit/refs.js, set in js/config.js). The helpers every bench shares are in bench-kit (kit/base.js,
 * kit/md.js, kit/themes.js), loaded before this file.
 *
 * A "build" is one version fetched and divided into lines: the unit that every view reads
 * from. Builds are cached, so moving between views or comparing versions never reads the
 * files again. What a view needs of one: b.v (the version), b.parts (its files: src, role,
 * raw), b.lines[file][line - 1] ({ p, n, raw, norm }), b.errorsAt and b.kind (marks by
 * "file:line"), b.asm (null: a bench that assembles or indexes its texts puts that here).
 */
(function (root) {
  'use strict';

  var V = root.SWVersions;
  var SW = root.SW;   // made by kit/base.js
  var B = SW.BENCH;

  SW.BASE_URI = B.base;
  // numbers in octal, for the kit's views that show machine words
  SW.oct = function (n, w) { if (n == null) return ''; var s = (n >>> 0).toString(8); while (s.length < (w || 6)) s = '0' + s; return s; };

  // ---------- fetching and building ----------
  var textCache = {};
  SW.fetchText = function (path) {
    if (textCache[path]) return textCache[path];
    var url = V.SRC + path.split('/').map(encodeURIComponent).join('/');
    // revalidated, so a corrected transcription is not served from an old cache
    textCache[path] = fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not fetch ' + path + ' (' + r.status + ')');
      return r.text();
    });
    return textCache[path];
  };

  // One line divided into code and comment: the comment from the first of the bench's
  // comment marks (SW.BENCH.comment) to the end of the line, the mark included. Both
  // keep their spacing, so the listing shows the line as written.
  SW.parseLine = function (raw) {
    var s = String(raw || '').replace(/\n$/, ''), marks = [].concat(B.comment == null ? '#' : B.comment).filter(Boolean), ci = -1;
    marks.forEach(function (m) { var i = s.indexOf(m); if (i >= 0 && (ci < 0 || i < ci)) ci = i; });
    return { labels: [], loc: '', code: ci >= 0 ? s.slice(0, ci) : s, comment: ci >= 0 ? s.slice(ci) : '' };
  };
  function splitLines(t) { var ls = String(t).replace(/\r\n?/g, '\n').split('\n'); if (ls.length > 1 && ls[ls.length - 1] === '') ls.pop(); return ls; }

  // Build = fetch + divide + mark. Cached per version.
  var buildCache = {};
  SW.build = function (id) {
    var v = V.byId(id);
    if (!v) return Promise.reject(new Error('Unknown version ' + id));
    if (buildCache[id]) return buildCache[id];
    buildCache[id] = V.load(v, SW.fetchText).then(function (L) {
      var t0 = performance.now();
      var b = { v: v, dialect: v.dialect, parts: L.parts, asm: null, ms: 0 };
      index(b);
      b.ms = Math.round(performance.now() - t0);
      return b;
    });
    buildCache[id].catch(function () { delete buildCache[id]; });
    return buildCache[id];
  };

  // What each line is, for the marks in Read: def (a routine begins here, by the bench's
  // pattern, SW.BENCH.routine), com (a line of comment only).
  function index(b) {
    var re = B.routine ? new RegExp(B.routine) : null;
    b.lines = b.parts.map(function (p, pi) {
      return splitLines(p.raw).map(function (r, i) { return { p: pi, n: i + 1, raw: r, norm: r }; });
    });
    b.errorsAt = {}; b.kind = {}; b.sym = {};
    b.lines.forEach(function (ls, pi) {
      if (b.parts[pi].role === 'doc') return;
      ls.forEach(function (L) {
        var k = pi + ':' + L.n, pl = SW.parseLine(L.raw), m = re && re.exec(pl.code);
        if (m) { b.kind[k] = 'def'; var name = (m[1] || m[0]).trim(); if (!b.sym[name]) b.sym[name] = { name: name, p: pi, n: L.n }; }
        else if (!pl.code.trim() && pl.comment.trim()) b.kind[k] = 'com';
      });
    });
  }

  // Open a version at a line range (or its record when there is none).
  SW.openAt = function (vid, a) {
    var same = !vid || vid === SW.state.v;
    if (!same) SW.select(vid);
    if (!a) { SW.setTab('about'); return; }
    SW.state.sel = { p: a.p, n0: a.n0, n1: a.n1 != null ? a.n1 : a.n0 };
    SW.setTab('read');   // draws Read at the selection if it was not yet showing this version
    if (same) SW.emit('goto', { p: a.p, n: a.n0, tab: 'read' });
  };
  SW.current = function () { return SW.state.v ? SW.build(SW.state.v) : Promise.reject(new Error('no version')); };

  // ---------- ghosts (kit/base.js, SW.ghostMatch) ----------
  // lines as keys: comments, spacing and case set aside; blank lines count for nothing
  SW.lineKey = function (t) { return SW.parseLine(t).code.replace(/\s+/g, ' ').trim().toLowerCase(); };

  SW.docMeta = function (b) {
    return [
      ['Version', b.v.label], ['Reference', SW.refText(b.v.id)], ['Date', b.v.date], ['Authors', b.v.authors],
      ['Sources', b.parts.map(function (p) { return p.src + (p.role !== 'program' ? ' (' + p.role + ')' : ''); }).join('; ')],
      ['Generated', SW.fmtDate(SW.today()) + ', ' + B.title + ' v' + SW.VERSION]
    ];
  };
})(this);
