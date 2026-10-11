# bench-template

**Author:** David M. Berry  
**Version:** 0.1.22 (bench-kit 0.22.1)

A starting point for a critical code studies research bench: a static site for reading, comparing and annotating the versions of a program's source code with a group. It is built on [bench-kit](https://github.com/critical-code-studies/bench-kit), the modules shared by the [SHRDLU](https://critical-code-studies.github.io/SHRDLU/research/) and [Spacewar!](https://spacewar1962.github.io/spacewar/research/) benches, and runs as it stands, on an invented example: two versions of a small Python program and a lost first sketch.

## What a new bench has

- **Read**: each version's files, line by line, as held; a search; annotations under their lines or as cards in the margin, shared through a Hypothesis group; ghosts (annotations from other versions on lines that match); citations, links, export to Word and Markdown; a reading edition.
- **Functional overview**: the program read from its source: where it starts (the routine named by `entry` in `config.js`) and what it calls, in order; what each file runs as it is loaded; each file's routines and those other files call; the calls between the files.
- **Versions**: each version's record and annotations, **Compare** (as text, or as the routines that differ) and **Genealogy** (stemma, flow, tree, lineage).
- **Findings**: the bench's own findings, with evidence, and the group's.
- **My notes**: a private tray of excerpts, figures and findings for writing.
- **Paratexts**: scans, documents, recordings and links, in a private GitHub repository.
- **Help**: a welcome tour, joining the group, advanced annotation, Settings, backup and restore, the About box.

There is no build step and nothing to install: plain HTML, CSS and JavaScript, served by GitHub Pages.

## Starting a bench

1. On GitHub, **Use this template** to make a repository of your own, then clone it with the kit:
   ```
   git clone --recurse-submodules https://github.com/YOUR-ORG/YOUR-BENCH
   ```
2. Put the sources under `source/`, one folder per version, and replace the example's files there.
3. Describe the versions in `research/js/versions.js`: for each, an id, label, date, authors, summary, status, and its files (`build`); for a lost version, no files. Set how they descend (`PARENT`) and the lines of descent (`LINES`).
4. Set the bench in `research/js/config.js`. Every value marked EDIT is the example's: the name and title, the storage prefix (unique to the bench), where it is published (`base`) and its repository (`repo`), a short reference for each version (`refs.names`), the version shown first (`start`), the comment mark and the pattern for a routine's first line in the sources' language, the routine where the program starts (`entry`), the About box, the people named in the text (`hands`), the genealogy's set and line, and the paratexts repository. The kit's README lists every setting.
5. Replace the example finding in `research/js/findings-data.js`, the check in `research/js/findings-checks.js`, and the tour's stops in `research/js/tour.js`.
6. Change the name in the title, header and descriptions of `research/index.html`, `research/join.html` and `index.html`, and the icon (`research/img/icon.svg`).
7. Commit, then make the SWHIDs of the sources (for citations and permalinks) and commit those:
   ```
   research/tools/swhid.sh
   ```
8. Turn on GitHub Pages (Settings ▸ Pages: the main branch, root). The bench is then at `https://YOUR-ORG.github.io/YOUR-BENCH/research/`.

To look at it locally, serve the repository's folder (the bench reads its sources over HTTP, so opening the file directly does not work):
```
python3 -m http.server 8000
```
and open `http://localhost:8000/research/`.

## Annotation and paratexts

Annotations are shared through a [Hypothesis](https://web.hypothes.is/) group. Make a private group, put its ID in `config.js` (`group`), and invite members with the bench's invitation link (Help ▸ Joining the annotation group). Each member adds their own Hypothesis API token under ⚙ Settings. Without a group and token, annotations are kept as drafts in the browser.

Paratexts live in a private GitHub repository named in `config.js` (`paratexts`), with a `catalogue.json` and a `files/` folder. Each member reads and adds to it with a fine-grained token of their own (⚙ Settings ▸ Paratexts).

## The language of the sources

The template reads any source text with the kit's plain adapter (`lang: 'plain'`): a comment runs from the comment mark to the end of the line, and a routine begins where the `routine` pattern matches. Highlighting in Read is the same (the kit's, or a bench's `hl`, given to `SW.readView` in `research/js/read.js`), and the Functional overview (`kit/functional.js`) finds calls as a routine's name followed by `(`; a bench reads its language better with `SW.BENCH.functional.analyse` (the kit's README). A bench that can run its program (on an emulator or an interpreter) can give the overview a second mode beside the reading, Recorded run (`SW.BENCH.functional.recorded`), as the Spacewar! bench does; a switch then appears in its heading. A bench for one language can give its own adapter, as the SHRDLU bench does for MacLisp (`lang-maclisp.js`) and the Spacewar! bench for PDP-1 MACRO (`lang-macro.js`), and its own highlighting and views beside Read.

## Releases

On each change to `research/`, raise the version on every `?v=` in `research/index.html` by 0.0.1 (all alike, so browsers fetch fresh copies), set the `bench-date` meta there to the day, and add the change to `research/CHANGELOG.md`. The version at the top of this README follows it.

## The kit

`research/kit` is a git submodule of bench-kit. To take a newer kit:
```
git submodule update --remote research/kit
```
then test the bench and commit the new pointer. Changes to the shared modules are made in bench-kit itself, not inside `research/kit`.

## Layout

```
index.html              opens the bench
source/                 the sources, one folder per version
research/
  index.html            the bench: its tabs, views and scripts
  join.html             the invitation link's page
  css/research.css      the bench's colours and themes, and its own styles (the shared ones are kit/bench.css)
  js/versions.js        the versions and their descent
  js/config.js          the bench's settings for the kit
  js/core.js            fetching and dividing the texts, references, links
  js/read.js            Read: the bench's hooks for the kit's Read view
  js/compare-defs.js    Compare's second mode (routines)
  js/findings-*.js      the bench's findings and checks
  js/tour.js            the welcome tour
  js/swhid.js           the sources' SWHIDs (tools/swhid.sh)
  js/main.js            the views, in the order of the tabs (the frame is kit/shell.js)
  kit/                  bench-kit (submodule)
  tests/                the annotation tests (open tests/annotations.html)
  tools/swhid.sh        makes js/swhid.js
```
