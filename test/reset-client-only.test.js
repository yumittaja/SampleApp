const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");

test("reset remains client-only with no /api/reset calls", () => {
  const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const serverJs = fs.readFileSync(path.join(repoRoot, "server.js"), "utf8");

  assert.match(appJs, /function\s+resetTimer\s*\(\)\s*\{/);
  assert.doesNotMatch(appJs, /fetch\s*\(\s*["']\/api\/reset["']/);
  assert.doesNotMatch(serverJs, /app\.post\s*\(\s*["']\/api\/reset["']/);
  assert.match(appJs, /resetBtn\.addEventListener\(\s*["']click["']\s*,\s*resetTimer\s*\)/);
});
