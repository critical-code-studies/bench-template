/*
 * read.js - Read: a version's files as held, line by line, with the group's annotations
 * (bench-kit's readnotes.js), a search, the file picker, filters and export. Replace the
 * highlighting (hl) with one for the bench's language, and add what else the bench reads
 * in its texts (assembled words, repairs, defined names) to rowHTML.
 */
(function (root) {
  'use strict';
  var SW = root.SW, N = SW.notes;
  var view = SW.$('#view-read');
  var R = SW.views.read = {};
  var build = null, notes = [], counts = {}, noted = {}, anchorSel = null;
  // tapes: which of the version's files to show: 'all', or a single file's index.
  var opts = { words: false, norm: false, tapes: SW.store.get('read.file', '0'), onlyNoted: false, by: '', notes: SW.store.get('read.notes', 'inline'), show: SW.store.get('read.show', 'all'), ghosts: SW.store.get('read.ghosts', true) };
  // show: whose annotations Read shows: 'all', 'mine' (those you started) or 'none';
  // cycled from the chevron on the Annotations heading.
  var SHOW = { all: '▾ All', mine: '▾ Mine', open: '▾ Open', none: '▸ None' }, SHOW_NEXT = { all: 'mine', mine: 'open', open: 'none', none: 'all' };
  function isMine(n) { var me = SW.me().initials; return N.mine(n) || (!!me && n.by === me); }
  // notes: 'inline' (each thread under its lines, the default), 'margin' (cards
  // beside the lines) or 'off' (initials at the line end); chosen from the notes button.
  function marginOn() { return opts.notes === 'margin'; }

  // Annotations in Read (threads, ghosts, the margin, the selection, export): bench-kit's readnotes.js
  var K = SW.readNotes({ view: view, R: R, opts: opts, isMine: isMine, showsTape: showsTape, filtering: filtering,
    keptLines: keptLines, tapeInfo: tapeInfo });
  var paintNotes = K.paintNotes, layoutMargin = K.layoutMargin, wireMargin = K.wireMargin,
    threadClick = K.threadClick, threadFor = K.threadFor, loadGhosts = K.loadGhosts, MODES = K.MODES, modeOf = K.modeOf,
    setNotes = K.setNotes, modeBtn = K.modeBtn, live = K.live, paintSel = K.paintSel, annotateSel = K.annotateSel,
    listingDoc = K.listingDoc, ro = null;

  // ---------- the files a version is read from ----------
  // A version is a set of files (versions.js), read one after another. Plain labels for
  // each: program files, support files, and documentation (shown, not compared).
  var ROLE = { program: 'program', support: 'support', doc: 'documentation' };
  function tapeInfo(b) {
    return b.parts.map(function (part, pi) {
      var name = part.src.split('/').pop();
      return { pi: pi, supplied: part.role !== 'program', star: false, title: '', label: name + (part.role !== 'program' ? ' (' + ROLE[part.role] + ')' : '') };
    });
  }
  function showsTape(pi) { return opts.tapes === 'all' || +opts.tapes === pi; }
  function tapeOptions(b, info) {
    var o = [['all', 'All ' + info.length + ' files']].concat(info.map(function (t) { return [String(t.pi), (t.pi + 1) + '. ' + t.label]; }));
    return o.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === String(opts.tapes) ? ' selected' : '') + '>' + SW.esc(x[1]) + '</option>'; }).join('');
  }

  // ---------- highlighting ----------
  // Code and comment, as core.js divides them (SW.parseLine, by SW.BENCH.comment); numbers
  // marked in the code. A bench for one language gives it its own, as the SHRDLU and
  // Spacewar! benches do.
  SW.hlLine = function (raw, b) { return hl(raw, b); };
  function hl(raw) {
    var p = SW.parseLine(raw);
    var code = p.code, h = '', re = /(^|[^\w.])(\d+(?:\.\d+)?)(?![\w.])/g, last = 0, m;
    while ((m = re.exec(code))) { var s0 = m.index + m[1].length; h += SW.esc(code.slice(last, s0)) + '<span class="num">' + m[2] + '</span>'; last = s0 + m[2].length; }
    h += SW.esc(code.slice(last));
    if (p.comment) h += '<span class="cm">' + SW.esc(p.comment) + '</span>';
    return h;
  }

  // ---------- rendering ----------
  function rowHTML(b, L) {
    var k = L.p + ':' + L.n, cls = 'ln';
    if (b.errorsAt[k]) cls += ' err';
    if (b.kind && b.kind[k]) cls += ' k' + b.kind[k];
    var mk = N.marginMark(k, counts[k]);
    if (noted[k]) cls += ' noted';
    return '<div class="' + cls + '" id="L' + L.p + '-' + L.n + '" data-p="' + L.p + '" data-n="' + L.n + '">' +
      '<span class="n" style="--d:' + String(L.n).length + '"><button class="qa" tabindex="-1" title="Annotate this">+A</button>' + L.n + '</span><span class="a"></span><span class="w"></span>' +
      '<span class="t">' + (L.raw ? hl(L.raw, b) : ' ') + '</span><span class="mk">' + mk + '</span></div>';
  }

  function render() {
    var b = build;
    view.innerHTML = '';
    var tb = SW.el('div', { class: 'toolbar' });
    tb.innerHTML =
      '<input type="search" id="rd-find" placeholder="Find text or /regex/ …">' +
      '<button class="btn" id="rd-prev" title="Previous match">↑</button><button class="btn" id="rd-next" title="Next match">↓</button>' +
      '<span class="hint" id="rd-hits"></span><span class="sep"></span>' +
      '<details class="menu"><summary class="btn" title="What the listing shows">View ▾</summary><div class="menu-body">' +
      '<label class="check" title="Hide every line that no annotation covers, so the listing reads as the discussion so far. A dashed rule marks where lines are left out. Exports of the whole listing follow the filter."><input type="checkbox" id="rd-noted"' + (opts.onlyNoted ? ' checked' : '') + '> Only annotated lines</label>' +
      '<label class="check" title="Show only annotations (and the lines they cover) in which these initials take part, as author or in a reply">Annotations by <select id="rd-by"><option value="">anyone</option></select></label>' +
      '</div></details><span class="hint" id="rd-nf"></span>' +
      '<span class="undo-pair"><button class="btn" id="rd-undo" disabled title="Undo">↶</button><button class="btn" id="rd-redo" disabled title="Redo">↷</button></span>';
    if (b.v.build && b.parts.length > 1) {
      var ti = tapeInfo(b);
      tb.appendChild(SW.el('label', { class: 'check tape-pick', title: 'The files this version is read from, in order. Choose one to read, or All to read them in order.' },
        'File <select id="rd-tape">' + tapeOptions(b, ti) + '</select>'));
    }
    tb.appendChild(SW.el('span', { class: 'sep' }));
    if (b.v.build && SW.edition) tb.appendChild(SW.edition.menu(function () { return build; }));
    // one Export menu: the listing (as shown, or the annotated lines only) to Word or
    // Markdown, or the annotations with their lines into My notes
    var exm = SW.el('details', { class: 'menu more-menu' });
    exm.innerHTML = '<summary class="btn" title="Export this version’s listing, or put its annotations in My notes">⤓ Export ▾</summary><div class="menu-body">' +
      '<p class="hint">The listing, as shown</p><button class="btn ghost" data-ex="all:docx">⤓ Word</button><button class="btn ghost" data-ex="all:md">⤓ Markdown</button>' +
      '<p class="hint">The annotated lines only</p><button class="btn ghost" data-ex="noted:docx">⤓ Word</button><button class="btn ghost" data-ex="noted:md">⤓ Markdown</button>' +
      '<p class="hint">Private</p><button class="btn ghost" data-ex="noted:tray" title="Each annotation with the lines it covers, as one excerpt in My notes">＋ My notes: the annotations</button></div>';
    exm.addEventListener('click', function (e) {
      var x = e.target.closest('[data-ex]'); if (!x) return;
      exm.open = false;
      var k = x.dataset.ex.split(':'), noted = k[0] === 'noted';
      var dp = listingDoc(b, null, { onlyNoted: noted });
      if (k[1] === 'tray') { dp.then(function (d) { if (!d.blocks.some(function (bl) { return bl.type === 'code'; })) { SW.toast('No annotations on this version yet.'); return; } SW.tray.addDoc(d); }); return; }
      Promise.resolve(dp).then(function (d) { SW.exportDoc(d, SW.BENCH.slug + '-' + b.v.id + (noted ? '-annotations' : '-listing'), k[1]); });
    });
    tb.appendChild(exm);
    tb.appendChild(SW.el('button', { class: 'btn notes-mode', id: 'rd-notes-mode', onclick: function () {
      var i = MODES.indexOf(modeOf(opts.notes));
      setNotes(MODES[(i + 1) % MODES.length][0]);
    } }));
    view.appendChild(tb);

    if (!b.v.build) {
      var lost = SW.el('div', { class: 'pad prose' });
      lost.innerHTML = '<h2>' + SW.esc(b.v.label) + '</h2><p>' + SW.esc(b.v.summary) + '</p><p class="muted">The bench holds no text of this version. Its record is under Versions ▸ This version.</p>';
      view.appendChild(lost);
      return;
    }
    view.appendChild(SW.el('div', { class: 'selbar', id: 'rd-selbar' }));
    renderListing();
    wireTb(tb);
    modeBtn();
  }

  // The listing alone, so choosing a file keeps the toolbar (and a search) as it is.
  function renderListing() {
    var b = build, info = tapeInfo(b), bar = SW.$('#rd-selbar', view);
    SW.$$('.rd-body', view).forEach(function (x) { x.remove(); });
    var wrap = SW.el('div', { class: 'rd-body' + (marginOn() ? ' with-margin' : '') });
    var box = SW.el('div', { class: 'listing hide-words' });
    var margin = SW.el('div', { class: 'note-margin', 'aria-label': 'Annotations' });
    b.parts.forEach(function (part, pi) {
      if (!showsTape(pi)) return;
      var t = info[pi], sec = SW.el('div', { class: 'part' });
      sec.innerHTML = '<div class="part-head" data-p="' + pi + '">' +
        '<div class="ph-main">' + (b.parts.length > 1 ? '<span class="ph-num">File ' + (pi + 1) + ' of ' + b.parts.length + '</span>' : '') +
        '<span class="ph-title">' + SW.esc(t.label) + '</span> ' + SW.refTag(b.v.id, pi, null, null, b.parts.length) + '</div>' +
        '<div class="ph-sub">' + SW.sourceLink(part.src, part.src.split('/').pop()) + ' · ' + ({ program: 'a program file', support: 'a support file', doc: 'documentation' }[part.role] || 'text file') + ' · ' + b.lines[pi].length + ' lines</div>' +
        '<div class="lncols"><span class="n" title="The line’s number in the source file">Line</span><span class="a"></span><span class="w"></span>' +
        '<span class="t" title="The source as held">Source</span>' +
        '<span class="mk" title="Initials of anyone who has annotated the line; click them to read">Annotations<button class="ann-cyc" data-ann title="Show all annotations, only yours, only open questions, or none (click to change)">' + SHOW[opts.show] + '</button><button class="ann-cyc ghost-sw' + (opts.ghosts ? ' on' : '') + '" data-ghosts aria-pressed="' + !!opts.ghosts + '" title="Ghosts: annotations made on other versions, shown faintly on the lines here that match">Ghosts</button></span></div></div>';
      sec.insertAdjacentHTML('beforeend', b.lines[pi].map(function (L) { return rowHTML(b, L); }).join(''));
      box.appendChild(sec);
    });
    wrap.appendChild(box);
    wrap.appendChild(margin);
    view.insertBefore(wrap, bar);
    wireBox(box);
    wireMargin(margin);
    applyFilter();
    paintSel();
    // Cards placed while Read was hidden all measure 0: place them again when it shows.
    if (ro) ro.disconnect();
    if (root.ResizeObserver) {
      ro = new ResizeObserver(function () {
        if (!marginOn() || !wrap.getClientRects().length) return;
        K.refit();
      });
      ro.observe(wrap);
    }
  }

  function wireBox(box) {
    K.wireLit(box, '.ithread'); K.wireDrop(box);
    box.addEventListener('click', function (e) {
      if (e.target.closest('[data-ghosts]')) {
        opts.ghosts = !opts.ghosts; SW.store.set('read.ghosts', opts.ghosts);
        SW.$$('[data-ghosts]', view).forEach(function (b) { b.classList.toggle('on', opts.ghosts); b.setAttribute('aria-pressed', String(opts.ghosts)); });
        if (opts.ghosts) SW.toast('Looking for annotations on the other versions…', 2500);
        loadGhosts().then(function () {
          paintNotes();
          if (opts.ghosts) SW.toast(K.ghostCount() ? K.ghostCount() + ' ghost annotation' + (K.ghostCount() === 1 ? '' : 's') + ' from other versions' : 'No annotations on other versions match lines here', 3500);
        });
        return;
      }
      if (e.target.closest('[data-ann]')) {
        opts.show = SHOW_NEXT[opts.show] || 'all'; SW.store.set('read.show', opts.show);
        SW.$$('[data-ann]', view).forEach(function (b) { b.textContent = SHOW[opts.show]; });
        paintNotes();
        SW.toast(opts.show === 'all' ? 'Showing all annotations' : opts.show === 'mine' ? 'Showing only your annotations' : opts.show === 'open' ? 'Showing only open questions' : 'Annotations hidden', 2500);
        return;
      }
      if (e.target.closest('.part-head')) return;   // tape headers only label (their source link opens GitHub)
      if (e.target.closest('.inote')) { threadClick(e); return; }   // note buttons are wired by N.wire
      // +A by a line number: a quick annotation on that line, or on the selection it is in
      var qa = e.target.closest('.qa');
      if (qa) {
        var qr = qa.closest('.ln'), qp = +qr.dataset.p, qn = +qr.dataset.n, s0 = SW.state.sel;
        var r0 = s0 && s0.p === qp && qn >= s0.n0 && qn <= s0.n1 ? s0 : { p: qp, n0: qn, n1: qn };
        SW.state.sel = r0; paintSel(); SW.writeQuery();
        annotateSel();
        return;
      }
      var dot = e.target.closest('.note-dot');
      if (dot) { showNotesFor(dot.dataset.k); return; }
      var row = e.target.closest('.ln');
      if (!row) return;
      var p = +row.dataset.p, n = +row.dataset.n;
      
      if (e.shiftKey && anchorSel && anchorSel.p === p) {
        SW.state.sel = { p: p, n0: Math.min(anchorSel.n, n), n1: Math.max(anchorSel.n, n) };
      } else {
        anchorSel = { p: p, n: n };
        SW.state.sel = { p: p, n0: n, n1: n };
      }
      paintSel();
      SW.writeQuery();
      var k = p + ':' + n;
      if (counts[k] && opts.notes !== 'hide') {
        var card = opts.notes !== 'off' && threadFor(k);
        if (card) { card.scrollIntoView({ block: 'nearest' }); card.classList.add('flash'); setTimeout(function () { card.classList.remove('flash'); }, 900); }
        else showNotesFor(k);
      }
    });
  }

  // ↶ ↷: undo and redo what was done to annotations (notes.js keeps the steps)
  function paintUndo() {
    var u = SW.$('#rd-undo', view), r = SW.$('#rd-redo', view); if (!u) return;
    var h = N.history();
    u.disabled = !h.undo || h.busy; r.disabled = !h.redo || h.busy;
    u.title = h.undo ? 'Undo ' + h.undo + ' (⌘Z)' : 'Undo: nothing to undo yet';
    r.title = h.redo ? 'Redo ' + h.redo + ' (⇧⌘Z)' : 'Redo: nothing to redo';
  }
  SW.on('notes-history', paintUndo);

  function wireTb(tb) {
    SW.$('#rd-undo', tb).onclick = function () { N.undo(); };
    SW.$('#rd-redo', tb).onclick = function () { N.redo(); };
    setTimeout(paintUndo, 0);
    var tapeSel = SW.$('#rd-tape', tb);
    if (tapeSel) tapeSel.onchange = function () { opts.tapes = tapeSel.value; SW.store.set('read.file', tapeSel.value); renderListing(); view.scrollTop = 0; };
    SW.$('#rd-noted', tb).onchange = function (e) { opts.onlyNoted = e.target.checked; applyFilter(); view.scrollTop = 0; };
    SW.$('#rd-by', tb).onchange = function (e) { opts.by = e.target.value; applyFilter(); view.scrollTop = 0; };
    fillBy();

    var find = SW.$('#rd-find', tb), hits = [], hi = -1;
    function search() {
      SW.$$('.ln.cur', view).forEach(function (e) { e.classList.remove('cur'); });
      hits = [];
      var q = find.value;
      if (!q) { SW.$('#rd-hits', tb).textContent = ''; return; }
      var re;
      try { re = /^\/.*\/$/.test(q) ? new RegExp(q.slice(1, -1), 'i') : new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); }
      catch (err) { SW.$('#rd-hits', tb).textContent = 'bad pattern'; return; }
      var keep = filtering() ? keptLines() : null;
      build.lines.forEach(function (ls, pi) { ls.forEach(function (L) { if (!L.away && re.test(L.raw) && (!keep || keep[L.p + ':' + L.n])) hits.push(L); }); });
      SW.$('#rd-hits', tb).textContent = hits.length + ' match' + (hits.length === 1 ? '' : 'es');
      hi = -1; step(1);
    }
    function step(d) {
      if (!hits.length) return;
      hi = (hi + d + hits.length) % hits.length;
      R.goto(hits[hi].p, hits[hi].n, true);
    }
    find.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.shiftKey ? step(-1) : (hits.length && find.dataset.q === find.value ? step(1) : (find.dataset.q = find.value, search())); } });
    SW.$('#rd-next', tb).onclick = function () { if (find.dataset.q !== find.value) { find.dataset.q = find.value; search(); } else step(1); };
    SW.$('#rd-prev', tb).onclick = function () { step(-1); };
  }

  var openNotesKey = null, binInPanel = false;
  function showNotesFor(k, quiet) {
    var parts = k.split(':'), p = +parts[0], n = +parts[1];
    var ts = N.threads(notes).filter(function (t) { return t.note.anchor && t.note.anchor.p === p && t.note.anchor.n0 === n; });
    var c = counts[k], n1 = c ? c.n1 : n;
    // No citation here: the version and file are in the page title and part
    // header, and every thread in this panel is on the line just clicked.
    void n1;
    var html = '<p style="margin-top:0"><button class="btn" data-act="new">✎ Annotate this line</button> ' +
      '<button class="btn" data-act="bin" title="Deleted annotations on this version: restore them, or delete them for good">🗑 Bin</button></p>' +
      (ts.map(function (t) { return N.renderThread(t, null); }).join('') || '<p class="hint">No annotations yet.</p>') +
      '<div class="panel-bin"' + (binInPanel ? '' : ' hidden') + '><h4>Deleted annotations</h4><div></div></div>';
    var body = SW.drawer('Annotations', html);
    body.dataset.notes = k;
    openNotesKey = k;
    N.wire(body, build.v.id, notes);
    var pb = body.querySelector('.panel-bin'), binBtn = body.querySelector('[data-act="bin"]');
    function openBin() { N.showBin(pb.lastChild, { vid: build.v.id }); }
    if (binInPanel) openBin();
    binBtn.classList.toggle('on', binInPanel);
    binBtn.onclick = function (e) {
      e.stopPropagation();
      binInPanel = pb.hidden;
      pb.hidden = !binInPanel;
      binBtn.classList.toggle('on', binInPanel);
      if (binInPanel) { openBin(); pb.scrollIntoView({ block: 'nearest' }); }
    };
    body.querySelector('[data-act="new"]').onclick = function () {
      var L = build.lines[p][n - 1];
      N.dialog({ vid: build.v.id, kind: 'line', anchor: { p: p, n0: n, n1: n, src: build.parts[p].src }, quote: L ? L.raw : '',
                 heading: 'Annotate', anchorText: SW.cite(build, p, n, n) });
    };
    void quiet;
  }

  R.goto = function (p, n, flash) {
    // A line in a file not shown (a search hit, a note, a link): show that file.
    if (build.parts[p] && !showsTape(p)) {
      opts.tapes = String(p);
      var ts = SW.$('#rd-tape', view);
      if (ts) ts.value = String(p);
      renderListing();
    }
    var el = SW.$('#L' + p + '-' + n, view);
    if (!el) return;
    el.scrollIntoView({ block: 'center' });
    if (flash) {
      SW.$$('.ln.cur', view).forEach(function (e) { e.classList.remove('cur'); });
      el.classList.add('cur');
    }
  };

  // ---------- notes filter ----------
  // Lines covered by notes, limited to those in which the chosen initials take part.
  function keptLines() {
    var keep = {};
    Object.keys(counts).forEach(function (k) {
      var c = counts[k];
      if (opts.by && c.by.indexOf(opts.by) < 0) return;
      for (var n = c.n0; n <= c.n1; n++) keep[c.p + ':' + n] = true;
    });
    return keep;
  }
  function filtering() { return opts.onlyNoted || !!opts.by; }
  function fillBy() {
    var sel = SW.$('#rd-by', view);
    if (!sel) return;
    var who = {};
    Object.keys(counts).forEach(function (k) { counts[k].by.forEach(function (x) { who[x] = 1; }); });
    if (opts.by) who[opts.by] = 1;
    sel.innerHTML = '<option value="">anyone</option>' + Object.keys(who).sort().map(function (x) {
      return '<option value="' + SW.esc(x) + '"' + (x === opts.by ? ' selected' : '') + '>' + SW.esc(x) + '</option>';
    }).join('');
  }
  function applyFilter() {
    var on = filtering(), keep = on ? keptLines() : null, shown = 0, gap = false;
    SW.$$('.listing .ln', view).forEach(function (row) {
      var k = row.dataset.p + ':' + row.dataset.n, hide = on && !keep[k];
      row.classList.toggle('nf-hide', hide);
      row.classList.toggle('nf-jump', on && !hide && gap);
      if (hide) gap = true; else { gap = false; shown++; }
    });
    SW.$$('.listing .part', view).forEach(function (sec) {
      sec.classList.toggle('nf-empty', on && !SW.$('.ln:not(.nf-hide)', sec));
    });
    var out = SW.$('#rd-nf', view);
    if (out) out.textContent = on ? shown + ' annotated line' + (shown === 1 ? '' : 's') + (opts.by ? ' with ' + opts.by : '') : '';
    var box = SW.$('.listing', view);
    if (box) {
      var none = SW.$('.nf-none', box);
      if (on && !shown && !none) box.insertBefore(SW.el('p', { class: 'hint nf-none pad' }, opts.by ? 'No annotations by ' + opts.by + ' on this version' + (opts.tapes === 'all' ? '' : ' and tape') + '.' : 'No annotated lines on this version' + (opts.tapes === 'all' ? '' : ' and tape') + ' yet.'), box.firstChild);
      else if ((!on || shown) && none) none.remove();
    }
    if (build && SW.$('.rd-body', view)) paintNotes();   // the notes follow the lines left showing
  }

  function refreshNotes() {
    if (!build) return;
    N.list(build.v.id).then(function (all) {
      notes = all; K.set({ notes: all });
      counts = N.countsByLine(all);
      noted = {};
      Object.keys(counts).forEach(function (k) {
        var c = counts[k];
        for (var n = c.n0; n <= c.n1; n++) noted[c.p + ':' + n] = true;
      });
      SW.$$('.ln', view).forEach(function (row) {
        var k = row.dataset.p + ':' + row.dataset.n, mk = row.querySelector('.mk');
        if (mk) mk.innerHTML = N.marginMark(k, counts[k]);
        row.classList.toggle('noted', !!noted[k]);
      });
      fillBy();
      applyFilter();
      if (opts.ghosts) loadGhosts(true).then(paintNotes);
      // keep an open panel current; a closed one stays closed (the refresh runs every 20 seconds)
      if (openNotesKey && SW.$('#drawer-body').dataset.notes === openNotesKey && document.body.classList.contains('drawer-open')) showNotesFor(openNotesKey, true);
    });
  }

  R.show = function (b) {
    if (build !== b && !(b.parts[+opts.tapes] || opts.tapes === 'all')) opts.tapes = '0';
    build = b; K.set({ build: b });
    R.build = b;
    render();
    refreshNotes();
    live();
    var s = SW.state.sel;
    if (s) setTimeout(function () { R.goto(s.p, s.n0, false); }, 0);
  };
  SW.on('notes', function (vid) { if (build && vid === build.v.id) refreshNotes(); });
  SW.on('goto', function (g) { if (build && g.tab === 'read') { SW.setTab('read'); setTimeout(function () { R.goto(g.p, g.n, true); paintSel(); }, 0); } });
  // Lines change height with the window or the code size: the cards follow.
  var relay = null;
  window.addEventListener('resize', function () { clearTimeout(relay); relay = setTimeout(function () { if (build && marginOn()) layoutMargin(); }, 120); });
  SW.on('codetext', function () { if (build && marginOn()) setTimeout(function () { layoutMargin(); }, 50); });
})(this);
