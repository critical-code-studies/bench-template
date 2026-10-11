/*
 * core.js - this bench's own state and helpers: its texts fetched, built and indexed, and
 * its references to them. The helpers every bench shares are in bench-kit (kit/base.js,
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

  // ---------- references ----------
  // The bench's references to its sources: a short name for each version (SW.BENCH.ref),
  // then the file and lines: [REF: EX2, count.py:12–14]. A version without a short name
  // is named by the bench's prefix and its id.
  SW.REF = B.ref || {};
  SW.refOf = function (vid, p, n0, n1) {
    var r = SW.REF[vid] || ((B.refPrefix || 'EX') + '-' + vid);
    if (p == null) return r;
    var v = V.byId(vid), part = v && v.build && v.build[p];
    var file = part ? part.src.split('/').pop() : String(p + 1);
    return r + ', ' + file + (n0 != null ? ':' + n0 + (n1 && n1 !== n0 ? '–' + n1 : '') : '');
  };
  // the number of files a version's text is built from, without building it
  SW.nparts = function (vid) { var v = V.byId(vid); return v && v.build ? v.build.length : 1; };
  SW.refText = function (vid, p, n0, n1, nparts) { return '[REF: ' + SW.refOf(vid, p, n0, n1, nparts) + ']'; };
  SW.refTag = function (vid, p, n0, n1, nparts) { var t = SW.refText(vid, p, n0, n1, nparts); return '<span class="swref" data-copy="' + SW.esc(t) + '" title="Click to copy. The bench’s reference to this source">' + SW.esc(t) + '</span>'; };
  SW.cite = function (b, p, n0, n1) {
    var part = b.parts[p];
    var range = n1 && n1 !== n0 ? 'll. ' + n0 + '–' + n1 : 'l. ' + n0;
    return b.v.label + ' (' + b.v.date + '), ' + part.src + ', ' + range + ' ' + SW.refText(b.v.id, p, n0, n1, b.parts.length);
  };

  // ---------- the files in the repository: links and SWHIDs ----------
  // A source file's SWHID (swh:1:cnt:, its git blob hash; js/swhid.js, made by
  // tools/swhid.sh); with the repository as origin, its path, and lines.
  SW.SWHID_ORIGIN = B.repo;
  SW.swhidOf = function (path) { var h = SW.SWHID && SW.SWHID[path]; return h ? 'swh:1:cnt:' + h[0] : ''; };
  // a link that works now: GitHub, at the last commit that changed the file, to the lines
  SW.permalinkOf = function (path, n0, n1) {
    var h = SW.SWHID && SW.SWHID[path]; if (!h) return '';
    return SW.SWHID_ORIGIN + '/blob/' + h[1] + '/source/' + path.split('/').map(encodeURIComponent).join('/') + (n0 != null ? '#L' + n0 + (n1 && n1 !== n0 ? '-L' + n1 : '') : '');
  };
  SW.swhidURL = function (id) { return 'https://archive.softwareheritage.org/' + id; };
  SW.swhidCite = function (path, n0, n1) {
    var id = SW.swhidOf(path); if (!id) return '';
    return id + ';origin=' + SW.SWHID_ORIGIN + ';path=/source/' + path + (n0 != null ? ';lines=' + n0 + (n1 && n1 !== n0 ? '-' + n1 : '') : '');
  };
  SW.filesOf = function (v) { return (v.build || []).map(function (b) { return b.src; }); };
  SW.swhidList = function (files) {
    return files.map(function (f) { var id = SW.swhidOf(f); return '<div class="swhid-row"><a class="mono" href="' + SW.esc(SW.permalinkOf(f) || SW.sourceURL(f)) + '" target="_blank" rel="noopener" title="The file on GitHub">' + SW.esc(f.split('/').pop()) + '</a> ' + (id ? '<button class="swhid mono" title="Copy ' + SW.esc(id) + '" data-copy="' + SW.esc(id) + '">' + SW.esc(id.slice(0, 17)) + '…</button> <a class="swhid-go" href="' + SW.esc(SW.swhidURL(id)) + '" target="_blank" rel="noopener" title="Open in the Software Heritage archive (once the repository is archived there)">↗</a>' : '<span class="faint">no SWHID yet (tools/swhid.sh)</span>') + '</div>'; }).join('');
  };
  // A file in source/, opened in a new tab on GitHub
  SW.sourceURL = function (path) { return B.repo + '/blob/main/source/' + path.split('/').map(encodeURIComponent).join('/'); };
  SW.sourceLink = function (path, text) {
    return '<a href="' + SW.esc(SW.sourceURL(path)) + '" target="_blank" rel="noopener" title="Open ' + SW.esc(path) + ' in a new tab">' + SW.esc(text || path) + ' ↗</a>';
  };

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
