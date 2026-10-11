/*
 * versions.js - the versions this bench holds, and how they descend from one another.
 *
 * Each record is a witness: a surviving set of files (build), or a lost version known
 * from the record (no build). Files are under source/ and shown exactly as held.
 * roles: 'program' (the program itself), 'support' (files around it), 'doc'
 * (documentation: shown in Read, never compared).
 *
 * The two versions here are an invented example. Replace them with your own.
 */
(function (root) {
  'use strict';

  var SRC = '../source/';

  function files(dir, list) {
    return list.map(function (x) {
      var f = typeof x === 'string' ? { src: x } : x;
      f.src = dir + f.src;
      f.role = f.role || 'program';
      return f;
    });
  }

  // fork: the group a version is listed under in the version picker (SW.BENCH.forks)
  // status: 'recovered' (held), 'lost' (known only from the record), 'reconstructed'
  var VERSIONS = [
    { id: 'v0', label: 'The first sketch', date: '2019', sort: 20190000, authors: 'A. Programmer',
      fork: 'main', status: 'lost', medium: null,
      summary: 'A first sketch, mentioned in the README of version 1 but not kept. An example of a lost version: the bench lists it, and annotations can still be kept on its record.' },
    { id: 'v1', label: 'Version 1', date: 'March 2020', sort: 20200300, authors: 'A. Programmer',
      fork: 'main', status: 'recovered', medium: 'Source files',
      summary: 'The first version kept: one Python file that reads a text file, counts its words and prints the ten most frequent.',
      build: files('v1/', ['wordfreq.py', { src: 'README.txt', role: 'doc' }]) },
    { id: 'v2', label: 'Version 2', date: 'June 2021', sort: 20210600, authors: 'A. Programmer and B. Reviewer',
      fork: 'main', status: 'recovered', medium: 'Source files',
      summary: 'The reading of words moved into a module of its own (textutil.py), with a regular expression in place of the loop over characters; common words can be left out, and the number printed chosen.',
      build: files('v2/', ['wordfreq.py', 'textutil.py', { src: 'README.txt', role: 'doc' }]) }
  ];

  // One dialect: the files are read, not run. Kept for the views that ask.
  var DIALECTS = { text: { label: 'Source text (read, not run)', options: {} } };

  VERSIONS.forEach(function (v) {
    v.dialect = 'text';
    v.buildNotes = (v.buildNotes || []).map(function (t) { return { by: 'log', who: 'build log', date: '', text: t }; });
    v.url = function () { return '#v=' + encodeURIComponent(v.id); };
  });

  function byId(id) {
    for (var i = 0; i < VERSIONS.length; i++) if (VERSIONS[i].id === id) return VERSIONS[i];
    return null;
  }

  // ---------- descent ----------
  // parent: the version it was made from. witnessOf: another copy of the same files, not a
  // step of its own. also and influence: other versions it draws on.
  var PARENT = { v1: 'v0', v2: 'v1' };
  var WITNESS = {};
  var ALSO = {};
  var INFLUENCE = {};
  VERSIONS.forEach(function (v) {
    v.parent = PARENT[v.id] || null;
    v.witnessOf = WITNESS[v.id] || null;
    v.also = ALSO[v.id] || [];
    v.influence = INFLUENCE[v.id] || [];
  });
  function ancestry(id) {
    var v = byId(id), chain = [];
    if (!v) return chain;
    var cur = v.witnessOf || v.id;
    while (cur) { chain.unshift(cur); var p = byId(cur); cur = p && p.parent; }
    if (v.witnessOf) chain[chain.length - 1] = v.id;
    return chain;
  }
  // lines of descent, for the genealogy: each to its last version (tip)
  var LINES = [
    { id: 'main', label: 'The main line (v0 → v2)', tip: 'v2' }
  ];
  LINES.forEach(function (l) { l.ids = ancestry(l.tip); });

  function findTitle() { return 1; }

  function load(v, fetchText) {
    if (!v.build) return Promise.resolve({ version: v, parts: [], files: [] });
    return Promise.all(v.build.map(function (b) { return fetchText(b.src); })).then(function (texts) {
      var parts = v.build.map(function (b, i) {
        var raw = texts[i];
        return { src: b.src, role: b.role, raw: raw, text: raw, patch: null, title: 1, end: null };
      });
      return { version: v, parts: parts, files: parts.map(function (p) { return { name: p.src.split('/').pop(), text: p.role === 'doc' ? '' : p.text, doc: p.role === 'doc' }; }) };
    });
  }

  var api = { VERSIONS: VERSIONS, TRANSFORMS: {}, DIALECTS: DIALECTS, byId: byId, load: load,
              findTitle: findTitle, SRC: SRC, LINES: LINES, ancestry: ancestry };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SWVersions = api;
})(this);
