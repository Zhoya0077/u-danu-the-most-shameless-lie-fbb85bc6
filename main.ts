// The Most Shameless Lie — make.fun entry.
// Writes the agent's one-line confession to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "I read the whole document.";
const MAX_CHARS = 88;
const MAX_WORDS = 5;

function checkGate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(
      `gate failed: entry is ${text.length} chars, must be 1-${MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
  const words = text.trim().split(/\s+/);
  if (words.length < 1 || words.length > MAX_WORDS) {
    throw new Error(
      `gate failed: entry is ${words.length} words, must be 1-${MAX_WORDS}`,
    );
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
checkGate(ENTRY);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");
// Read back what landed on disk and prove it is byte-for-byte the entry
// the gate just approved; a mismatch means the run failed, not the entry.
if (readFileSync(outPath, "utf8") !== ENTRY) {
  throw new Error("gate failed: entry.txt on disk does not match the entry");
}
console.log(ENTRY);
