# Changelog: the research bench

Changes to the research bench (`research/`). The bench keeps its own version numbers, raised by 0.0.1 with each change (the `?v=` on every script and stylesheet in `index.html`); this file records the versions published, newest first.

## 0.1.50 (2026-10-13)

- bench-kit 0.43.0: Read's card lens, for a bench whose files are fixed-column listings (off unless the bench sets SW.BENCH.columns); MAD's identification field where the bench's layout puts it.

## 0.1.49 (2026-10-13)

- bench-kit 0.42.0: Help ▸ Marks and conventions, the marks for losses, restorations, corrections and doubtful readings with their Leiden forms, beside the kintsugi of the repairs; a paratext's lacunae drawn where they are as gold seams (in text, over a PDF page, under audio and video), never closed up, a restoration kept inside its seam and marked in every export.

## 0.1.48 (2026-10-13)

- bench-kit 0.41.1: a paratext can carry translations beside the original, one record under one code, chosen from a language row above the view (a working or machine translation says so), and set side by side with the original.

## 0.1.47 (2026-10-13)

- bench-kit 0.40.1: the stars on a paratext's card rate it (a click on one was read as a click on a collection); a rating shows at once on the card and in the open panel, averages too, and is not undone by an earlier save returning.

## 0.1.46 (2026-10-13)

- bench-kit 0.40.0: a version opened at a line is drawn there; a row in a name's pop-up selects its line; a bar offers to reload when a newer release is live; the paratext panel tightened and ratings from a card; a double-click in a find field selects all of it. The kit also offers layers.js (code in layers) and catalogue.js (what is known to have existed, held or not), off unless a bench sets SW.BENCH.layers or SW.BENCH.catalogue.

## 0.1.45 (2026-10-12)

- bench-kit 0.35.1: Chrome is given a minute to start in the tests on GitHub.

## 0.1.44 (2026-10-12)

- bench-kit 0.35.0: the tests run on GitHub on every push (`.github/workflows/tests.yml`, `kit/tools/test.js`); `node research/kit/tools/test.js` runs them by hand.

## 0.1.43 (2026-10-12)

- bench-kit 0.34.1: paratext PDFs are opened with PDF.js's eval turned off (CVE-2024-4367).

## 0.1.42 (2026-10-12)

- bench-kit 0.34.0: `tests/annotations.html` is now this bench's values and the kit's runner, which loads the scripts from `index.html`; a script added to the page needs no change to the tests.

## 0.1.41 (2026-10-12)

- bench-kit 0.33.0: `node research/kit/tools/styles.js` checks a stylesheet change against the last commit in every state and theme.

## 0.1.40 (2026-10-12)

- bench-kit 0.32.0: a site map (`sitemap.html`, written by `node research/kit/tools/sitemap.js`), linked from the tab row, Help and the no-JavaScript note; `sitemap: true` in `js/config.js`.

## 0.1.39 (2026-10-12)

- bench-kit 0.31.1: the kit's tests (94: annotations, the version list, builds, the Help menu and more) run through `kit/tests/run.js`; make a release with `node research/kit/tools/release.js next "What changed."`.

## 0.1.38 (2026-10-12)

- bench-kit 0.30.0: the annotation tests are the kit's (`tests/annotations.test.js` keeps this bench's values); the side panel, annotate dialog and toast are made by the kit (the tags' example is `tagsHint` in `js/config.js`); the annotated-line and small-screen styles are the kit's.

## 0.1.37 (2026-10-12)

- bench-kit 0.29.0: the version list's machinery (links, descent, ancestry, loading) is the kit's (`kit/versionlist.js`, loaded before `js/versions.js`); `js/versions.js` keeps the records.

## 0.1.36 (2026-10-12)

- bench-kit 0.28.0: the tab row's buttons no longer repeat their lenses (`data-lenses`): the kit reads them from `SW.BENCH.lenses.menus` in `js/analyse.js`. Help ▾ can be changed item by item (`SW.BENCH.menus.help`, in the kit's README).

## 0.1.35 (2026-10-12)

- bench-kit 0.27.0: the gold of repairs is `--kin` (and `--kin-bg`), as on the Spacewar! bench, where it was `--gold`. The chosen rating in Findings is now in gold.

## 0.1.34 (2026-10-12)

- bench-kit 0.26.0: the colour themes, the type, the menus' panel, gold, the annotation marks and the genealogy figures' colour schemes are the kit's (`kit/themes.css`, loaded after `kit/bench.css`); `css/research.css` keeps the bench's default colours. Computed colours unchanged in every theme and figure scheme.

## 0.1.33 (2026-10-12)

- bench-kit 0.25.0 as released: its README, changelog and version number now name `kit/builds.js` (the kit reports 0.25.0).

## 0.1.32 (2026-10-12)

- bench-kit 0.25.0: fetching, building and opening a version at a line are the kit's (`kit/builds.js`); `js/core.js` keeps how a line divides and what each line is.

## 0.1.31 (2026-10-12)

- bench-kit 0.24.4: the kinds of line (definitions, comments) and My notes' sync styled by the kit.

## 0.1.30 (2026-10-12)

- bench-kit 0.24.3: a drag over a paratext picture no longer selects the words the system finds in it (Live Text).

## 0.1.29 (2026-10-12)

- bench-kit 0.24.2: paratext pictures and PDF pages zoom and move smoothly, and a drag no longer selects.

## 0.1.28 (2026-10-12)

- bench-kit 0.24.1: PDF paratexts side by side zoom, move and turn their pages as pictures do.

## 0.1.27 (2026-10-12)

- bench-kit 0.24.0: a PDF paratext is drawn a page at a time, to drag, zoom and page through as a picture is.

## 0.1.26 (2026-10-12)

- bench-kit 0.23.1: a PDF paratext zooms again (− ＋), by its frame's width.

## 0.1.25 (2026-10-12)

- bench-kit 0.23.0 (`kit/kintsugi.js`: the repairs in Read in gold, for a bench that reads a version otherwise than it is held; the template has none).

## 0.1.24 (2026-10-12)

- Text ▾ and the Analyse view (bench-kit 0.22.2, `kit/lenses.js`), with two lenses in `js/analyse.js` for any language: Comments (every comment, searchable; across the versions, the comments against the lines of code) and Routines (every routine, how often other lines name it, where it is defined; across the versions, which versions define each).

## 0.1.22 (2026-10-12)

- bench-kit 0.22.1: wide menus kept on screen.

## 0.1.21 (2026-10-12)

- bench-kit 0.22.0 (a Graphics tab, `kit/graphics.js`, for a bench that draws its program).

## 0.1.20 (2026-10-12)

- bench-kit 0.21.0: Read is the kit's; `js/read.js` is the call to it, where a bench adds its language, its files' names, a Key, the pop-up on a name and its repairs.

## 0.1.19 (2026-10-12)

- bench-kit 0.20.0; the menus' panel styles are the kit's now.

## 0.1.18 (2026-10-12)

- bench-kit 0.19.0: Help ▸ Referencing and versions and What you should read, from `refHelp` and `reading` in `js/config.js`.

## 0.1.17 (2026-10-11)

- `css/research.css` without the rules the template never uses (Spacewar's and SHRDLU's views, carried over in the copy it began from): 1,073 lines to 272, the colours and themes kept.

## 0.1.16 (2026-10-11)

- bench-kit 0.18.0: the styles every bench shares are the kit's `kit/bench.css`, loaded before `css/research.css`, which keeps the colours and the bench's own parts.

## 0.1.15 (2026-10-11)

- bench-kit 0.17.3: Flow's columns in place with the code shown.

## 0.1.14 (2026-10-11)

- bench-kit 0.17.2: Genealogy's Flow at full zoom draws the code text only for what is on screen.

## 0.1.13 (2026-10-11)

- bench-kit 0.17.1: a shorter Tech stack row in the About box.

## 0.1.12 (2026-10-11)

- The frame from bench-kit 0.17.0: `js/main.js` gives only the views (`kit/shell.js` does the rest), the menus are `kit/menus.js`, Versions ▸ This version is `kit/version.js`, and references and SWHIDs are `kit/refs.js` (set as `refs` in `js/config.js`). `js/menus.js` and `js/about.js` are gone.

## 0.1.8 (2026-10-11)

- bench-kit 0.16.2: the About box's Bench kit row in one line.

## 0.1.7 (2026-10-11)

- bench-kit 0.16.1: its README lists everything a bench provides and every setting and hook.

## 0.1.6 (2026-10-11)

- bench-kit 0.16.0: the Functional overview can have a second mode, Recorded run, beside Read from the source, for a bench that can run its program (`SW.BENCH.functional.recorded`; the README). The template has none, so no switch.

## 0.1.5 (2026-10-11)

- bench-kit 0.15.0: the Functional overview can take the entry (`entry(b)`), file names (`fileLabel`) and start-up text (`loadTitle`, `startUpLede`) from the bench.

## 0.1.4 (2026-10-11)

- bench-kit 0.14.0: the Functional overview takes a bench's own reading in full (see the kit's README, and the SHRDLU bench's `js/functional.js` as an example).

## 0.1.3 (2026-10-11)

- The Functional overview from bench-kit 0.13.0 (`kit/functional.js`), where it now lives for every bench.

## 0.1.2 (2026-10-11)

- The Functional overview tab: where the program starts (`SW.BENCH.entry`) and what it calls, in order, and what each of those calls; what each file runs as it is loaded; each file's routines and entry points; the calls between the files, as a matrix. Read from the source; exported to Word or Markdown.

## 0.1.1 (2026-10-11)

- The template: Read, Versions (this version, Compare, Genealogy), Findings, My notes and Paratexts, on bench-kit, with an invented example program in two versions under `source/`.
