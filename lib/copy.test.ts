import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { links } from "./links.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const emDash = "\u2014";
const enDash = "\u2013";

const blockedTerms = [
  [108, 97, 121, 111, 102, 102],
  [105, 110, 116, 101, 114, 99, 111, 109],
].map((codes) => String.fromCharCode(...codes));

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git" || entry === "package-lock.json") continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      walk(path, acc);
      continue;
    }
    if (entry.endsWith(".test.ts")) continue;
    if (/\.(md|tsx?|css|svg|yml|mjs|json)$/.test(entry)) acc.push(path);
  }
  return acc;
}

test("public copy avoids blocked punctuation and terms", () => {
  const files = walk(root);
  assert.ok(files.length > 10);
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.equal(text.includes(emDash), false, file);
    assert.equal(text.includes(enDash), false, file);
    assert.equal(/\bSQL\b/.test(text), false, file);
    assert.equal(/\bCV\b/.test(text), false, file);
    assert.equal(text.includes("VERCEL_URL"), false, file);
    for (const term of blockedTerms) {
      assert.equal(text.toLowerCase().includes(term), false, file);
    }
  }
});

test("resume, email, and LinkedIn use the real destinations", () => {
  assert.equal(links.email, "mailto:samarcher9@gmail.com");
  assert.equal(links.resume, "/sam-archer-resume.pdf");
  assert.equal(links.linkedin, "https://www.linkedin.com/in/sam-archer-550a4a63/");
  assert.equal(existsSync(new URL("../public/sam-archer-resume.pdf", import.meta.url)), true);
  assert.equal(existsSync(new URL("../public/resume.pdf", import.meta.url)), false);
});
