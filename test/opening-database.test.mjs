import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { Chess } from "chess.js";

const database = JSON.parse(await readFile(new URL("../openings.json", import.meta.url), "utf8"));

test("ECO entries are legal move lines that reach their indexed positions", () => {
  assert.match(database.source, /CC0/i);
  assert.ok(database.entries.length >= 1000);

  const root = { children: new Map(), entries: [] };
  for (const entry of database.entries) {
    assert.match(entry.e, /^[A-E]\d{2}$/);
    let node = root;
    for (const uci of entry.m) {
      if (!node.children.has(uci)) node.children.set(uci, { children: new Map(), entries: [] });
      node = node.children.get(uci);
    }
    node.entries.push(entry);
  }

  const game = new Chess();
  function verify(node) {
    for (const entry of node.entries) {
      assert.equal(game.fen().split(" ").slice(0, 3).join(" "), entry.p, `${entry.e} ${entry.n}`);
    }
    for (const [uci, child] of node.children) {
      const move = game.moves({ verbose: true }).find(candidate =>
        candidate.from === uci.slice(0, 2)
        && candidate.to === uci.slice(2, 4)
        && (candidate.promotion || "") === (uci[4] || "")
      );
      assert.ok(move, `Opening line contains illegal move ${uci}`);
      game.move(move);
      verify(child);
      game.undo();
    }
  }
  verify(root);
});
