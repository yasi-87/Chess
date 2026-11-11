import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Chess } from "chess.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = "https://raw.githubusercontent.com/lichess-org/chess-openings/master";
const entries = [];
const seen = new Set();

for (const volume of ["a", "b", "c", "d", "e"]) {
  const contents = execFileSync(
    process.platform === "win32" ? "curl.exe" : "curl",
    ["--fail", "--location", "--silent", "--show-error", `${source}/${volume}.tsv`],
    { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 }
  );
  const rows = contents.trimEnd().split(/\r?\n/);
  if (rows.shift() !== "eco\tname\tpgn") throw new Error(`Unexpected opening data header in ${volume}.tsv.`);

  for (const [index, row] of rows.entries()) {
    const [eco, name, pgn] = row.split("\t");
    if (!/^[A-E]\d{2}$/.test(eco) || !name || !pgn) {
      throw new Error(`Invalid opening record in ${volume}.tsv at row ${index + 2}.`);
    }

    const game = new Chess();
    game.loadPgn(pgn);
    const moves = game.history({ verbose: true }).map(move => `${move.from}${move.to}${move.promotion || ""}`);
    const position = game.fen().split(" ").slice(0, 3).join(" ");
    const key = `${eco}\t${name}\t${position}\t${moves.join(" ")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ e: eco, n: name, p: position, m: moves });
  }
}

if (entries.length < 1000) throw new Error(`Opening database unexpectedly small: ${entries.length} records.`);
await writeFile(
  new URL("../openings.json", import.meta.url),
  `${JSON.stringify({ source: "Lichess chess-openings, CC0 1.0", entries })}\n`
);
console.log(`Built openings.json with ${entries.length} ECO opening lines from ${source}.`);
