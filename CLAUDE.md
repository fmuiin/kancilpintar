# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- No build step, package manager, test suite, or linter. Plain HTML, CSS, and ES modules served as static files.
- Run locally: `python3 -m http.server 8000`, then open `http://localhost:8000`. Opening `index.html` directly (`file://`) will not work because the modules fail to load.
- Deploy: GitHub Pages serves the repo root from `main`. Pushing to `main` is the deploy.
- Service worker only registers over http(s), so offline behaviour can only be tested through the local server, not `file://`.

## Architecture

- `index.html` holds every screen as a `<section class="screen">` (`namescr`, `home`, `adv`, `tg`, `mem`) plus one shared overlay `#ov` for win screens. Screens are switched by `show(id)` in `js/app.js`, which also clears pending timers, closes the overlay, and stops speech.
- `js/app.js` contains all game logic in one file, in three sections: Petualangan (`startAdv`), Tebak Gambar (`startTg`), and Cari Pasangan (`startMem`, levels defined by the `MEM` array).
- Every game is built from the same pieces. Each question is an object `q` with `prompt`, `visual`, `answers`, and an `onRight(first)` callback, rendered by `mountQuiz(root, q)`. Question factories (`countQ`, `letterPicQ`, `wordQ`) produce these. A new game mode should reuse them rather than add a new quiz renderer.
- `js/data.js` is the only content source. `WORDS` feeds Tebak Gambar and Cari Pasangan, `COUNT_ITEMS` feeds counting questions, and `STOPS` defines the adventure route (`type` is `count` with `max`, or `letter`). Changing lessons means editing this file, not the game code.
- Speech and sound live in `js/audio.js`. All spoken text must go through `say()`, which plays a recording from `CLIPS` when the exact sentence is registered there, and otherwise uses `speechSynthesis` with `id-ID`. `sfx` is the WebAudio tone set.
- Timers must be created with `later()` from `app.js`, not `setTimeout`, so that `show()` can cancel them when the child leaves a screen.
- Persistence is localStorage only, with keys `kp-name`, `kp-stars`, and `kp-sound`. Stars are added through `addStars()`, which also saves and repaints home. Nothing is sent to a server, and that promise is stated in the README, so do not add network calls for user data.
- `sw.js` precaches the `CORE` list and caches all same-origin GET responses at runtime, preferring the network. A new file needs to be added to `CORE`, and `CACHE` should be bumped so installed copies refresh.

## Conventions

- The app is for children aged about 4 who cannot read. All user-facing text is Indonesian, short, and read aloud. Keep new prompts in that style.
- Code comments and README are also in Indonesian. Match that when editing.
- Icons and characters are inline SVG (`js/art.js`) and emoji. There are no image assets for the game content.
- `prefers-reduced-motion` is checked once in `utils.js` as `reduce`. Animations must be skipped when it is set.
