// Break Production, Own It — make.fun entry
//
// The entry is one line: the confession an AI agent prints the instant it
// breaks production. The line lives in entry.txt; this program loads it,
// validates it against the competition gate (single line, 1-200 chars,
// valid UTF-8, not only whitespace), prints it to stdout, and also writes
// it to /output/entry.txt where the grader reads it.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 200;
const OUTPUT_PATH = "/output/entry.txt";

function loadEntryLine(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const text = readFileSync(join(here, "entry.txt"), "utf8");
  const lines = text.split(/\r?\n/).filter((part) => part.length > 0);
  if (lines.length !== 1) {
    throw new Error(`entry.txt must hold exactly one line, found ${lines.length}`);
  }
  return lines[0];
}

function validate(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("entry line must not be only whitespace");
  }
  if (line.length < 1 || line.length > MAX_CHARS) {
    throw new Error(`entry line must be 1-${MAX_CHARS} characters, got ${line.length}`);
  }
  // Round-trip through UTF-8 to reject invalid sequences.
  if (Buffer.from(line, "utf8").toString("utf8") !== line) {
    throw new Error("entry line is not valid UTF-8");
  }
}

function emit(line: string): void {
  process.stdout.write(line + "\n");
  try {
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
    writeFileSync(OUTPUT_PATH, line + "\n", "utf8");
  } catch {
    // stdout is the primary channel; /output may not exist outside the grader.
  }
}

const line = loadEntryLine();
validate(line);
emit(line);
