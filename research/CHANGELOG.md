# Changelog: the research bench

Changes to the research bench (`research/`). The bench keeps its own version numbers, raised by 0.0.1 with each change (the `?v=` on every script and stylesheet in `index.html`); this file records the versions published, newest first.

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
