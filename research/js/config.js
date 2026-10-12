/* config.js - this bench's settings for bench-kit (research/kit). Loaded after kit/base.js, before the rest of the kit and the bench's own scripts.
 * Every value marked EDIT is the template's example: change it for your bench. The kit's README lists every setting. */
(function (root) {
  'use strict';
  root.SW.BENCH = {
    name: 'Example',                                       // EDIT: as in "the Example research bench"
    title: 'Example Research Bench',                       // EDIT: the page title and the About box
    slug: 'example',                                       // EDIT: file names of exports and backups
    store: 'exbench.',                                     // EDIT: the prefix of this bench's keys in the browser's storage (unique per bench)
    base: 'https://critical-code-studies.github.io/bench-template/research/',   // EDIT: where the bench is published
    repo: 'https://github.com/critical-code-studies/bench-template',            // EDIT: its repository (source files link there)
    // references to the sources (kit/refs.js): [REF: EX2, wordfreq.py:12], and the files on GitHub under source/
    refs: { names: { v1: 'EX1', v2: 'EX2' }, prefix: 'EX-', dir: 'source' },   // EDIT: a short name for each version held; before a version without one
    forks: [['main', 'Versions']],                         // EDIT: groups in the version picker, by each version's fork
    start: 'v2',                                           // EDIT: the version shown first
    // the language of the texts: how a line divides into code and comment, and where a
    // routine begins (its name in the first group). For Compare, Genealogy and Read.
    lang: 'plain',                                         // kit/lang-plain.js; or 'macro', 'maclisp', or an adapter of your own
    comment: '#',                                          // EDIT: the comment mark (a string, or a list: ['//', '/*'])
    routine: '^\\s*(?:def|class)\\s+(\\w+)',               // EDIT: a regular expression for a line that begins a routine
    caseFold: false,                                       // true where case means nothing in the language
    entry: 'main',                                         // EDIT: the routine where the program starts (Functional overview)
    // the About box (kit/about.js); purpose, inside and sources are HTML
    about: {
      icon: '<img src="img/icon.svg" alt="" width="40" height="40">',
      author: 'Your Name', citeAuthor: 'Name, Y.',          // EDIT
      purpose: 'A bench for the critical reading of a program’s source code, in its versions. This is the template: replace this text.',   // EDIT
      inside: 'The files of each version as held, divided into lines; nothing is run.',   // EDIT
      sources: 'An invented example: two versions of a small Python program. Details under Versions.',   // EDIT
      code: 'https://github.com/critical-code-studies/bench-template',   // EDIT
      catalogue: { skip: [], held: 'held as source' }
    },
    // the default colour theme's name, and the accent of figures exported on black and on white
    theme: { label: 'Bench', note: 'light text on a dark ground (the default)' },
    accent: { dark: '#e58be0', light: '#a3317a' },
    // the people whose initials or names are written into the text (Compare marks them)
    hands: [
      { k: 'ap', who: 'A. Programmer', re: /\bA\. Programmer\b/, colour: '#2a9d6f' },
      { k: 'br', who: 'B. Reviewer', re: /\bB\. Reviewer\b/, colour: '#d99a1e' }
    ],
    group: '',                                             // EDIT: the Hypothesis group's ID, once you have made one
    relation: 'Example, ',                                 // EDIT: put before a version's label in Dublin Core relation
    topShare: false,
    settings: {
      tour: 'A few stops through reading, comparing and annotating; about a minute.',
      groupHint: 'Annotations are shared through a Hypothesis group: paste its link or ID, and a personal API token (hypothes.is/account/developer). Without them, annotations are kept as drafts in this browser and can be exported or published later.',
      groupPlaceholder: 'https://hypothes.is/groups/…',
      themeHint: 'The colours of the whole bench: listings, annotations and figures. The ◐ button in the top bar switches between your last light and dark themes.'
    },
    tag: 'bk:',   // the prefix of this bench's tags in Hypothesis (a bench made before bench-kit 0.5.0 names its old prefix here)
    tagsHint: 'e.g. provenance, revision',   // EDIT: examples of tags, in the annotate dialog
    joinCard: '',
    // the worked examples in Help ▸ Advanced annotation
    annoHelp: {
      manual: 'https://docs.python.org/3/', manualName: 'Python documentation',
      start: 'read_words divides the text here', search: 'words',
      refA: 'CD, EX1, wordfreq.py:6–20', refB: 'EF, EX2, textutil.py:9–14',
      noteA: 'A note on reading words…', noteB: 'The same in version 2…', quoteA: 'A note on reading words…',
      boxA: 'Version 1, wordfreq.py, lines 6–20', boxB: 'Version 2, textutil.py, lines 9–14',
      tryText: 'The words are found by `WORD.findall`', code: '`WORD.findall`',
      caption: 'A link from an annotation on version 2 to one on version 1. The version 1 annotation lists it under Linked from'
    },
    compare: { comment: '#', normalised: false, reading: 'Reading',
               supplied: ['support files', 'Include the support files, not only the program files'] },
    comparePrefix: 'Example: ',
    genealogy: { set: ['v1', 'v2'], line: 'main', lineNames: { main: 'The main line' } },
    figureNum: { print: '#a3317a', paper: '#a3317a', phosphor: '#e58be0' },
    paratexts: { org: 'critical-code-studies', repo: 'example_paratexts', cache: 'example-paratexts' },   // EDIT: a private repository for scans and documents
    examples: { date: 'e.g. 2020-03-15, or 2020', archive: 'e.g. Computer History Museum', versions: 'e.g. v1, v2',
                refs: 'e.g. [REF: EX2, wordfreq.py:12]', publisher: 'e.g. MIT Press', finding: 'F1' },
    // the first version is lost, and the tree grows from it
    stemma: { root: 'v0', lostBetween: {}, skip: [], lostOnTrunk: true },
    edition: {
      built: function () { return ['Read as', 'Source text, divided into lines']; },
      // tabs set at eight
      layout: function (raw) { return String(raw).replace(/\t/g, '        '); },
      words: false,
      files: ['all files', 'Include the support and documentation files, not only the program files']
    },
    // Help ▸ Referencing and versions (kit/helppages.js): how the bench's references read
    refHelp: {
      example: '[REF: EX2, wordfreq.py:12–14]',
      about: '<p><b>EX</b>, then the version (<b>2</b>); then the file (<b>wordfreq.py</b>) and the lines (<b>12–14</b>).</p>',
      more: '<p>Shorter forms: the version alone, <span class="mono">[REF: EX2]</span>; a whole file, <span class="mono">[REF: EX2, textutil.py]</span>. A lost version is named with the prefix: <span class="mono">EX-v0</span>.</p>',
      form: 'Form: [REF: EX<version>, <file>:<lines>], e.g. [REF: EX2, wordfreq.py:12–14].',
      versions: { title: 'The versions', all: true }
    },
    // Help ▸ What you should read (kit/helppages.js): the bench's reading, as HTML entries in groups.
    // (A bench that repairs its texts to run them adds cards: see the kit's README, Hooks.)
    // sitemap.html (Help ▸ Site map), written by kit/tools/sitemap.js; EDIT: { site: [href, label], opens, files, lost, intro, links } (the kit's README)
    sitemap: true,
    reading: {
      intro: 'Where to begin on reading code as a cultural text.',
      menu: 'Critical code studies',
      groups: [
        ['Critical code studies', [
          'Marino, M. C. (2020) <i>Critical Code Studies</i>. Cambridge, MA: The MIT Press.',
          'Berry, D. M. (2011) <i>The Philosophy of Software: Code and Mediation in the Digital Age</i>. Basingstoke: Palgrave Macmillan.',
          'Berry, D. M. and Marino, M. C. (2024) ‘Reading ELIZA: Critical Code Studies in Action’, <i>Electronic Book Review</i>. Available at: <a href="https://electronicbookreview.com/essay/reading-eliza-critical-code-studies-in-action/" target="_blank" rel="noopener">https://electronicbookreview.com/essay/reading-eliza-critical-code-studies-in-action/</a>.']]
      ]
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
