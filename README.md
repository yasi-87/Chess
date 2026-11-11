# Nightfall Chess

## Stockfish licensing and source

This application ships the full, single-threaded Stockfish.js 19.0.1 WebAssembly engine in `assets/stockfish/`. The matching `.js` and `.wasm` files are distributed under GPL-3.0; the license text is included as `assets/stockfish/Copying.txt`.

Corresponding upstream source is available from the tagged Stockfish.js 19.0.1 release at <https://github.com/nmrugg/stockfish.js/tree/v19.0.1> and the Stockfish 19 source at <https://github.com/official-stockfish/Stockfish/tree/sf_19>. The Stockfish.js project documents the full single-threaded build and its source build process at <https://github.com/nmrugg/stockfish.js>. The engine assets used here are `stockfish-19-single.js` and `stockfish-19-single.wasm`, not the Lite build.

The bundled ECO opening data comes from Lichess's `chess-openings` project and is dedicated to the public domain under CC0 1.0: <https://github.com/lichess-org/chess-openings>.

## Run locally

Install dependencies with `npm install`, then run `npm start` and open <http://127.0.0.1:4173>. The full engine downloads roughly 95 MB on first use and needs no cross-origin isolation headers because it is single-threaded.