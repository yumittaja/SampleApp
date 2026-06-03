const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.join(__dirname, "..");

test("reset remains client-only with no /api/reset calls", () => {
  const appJs = fs.readFileSync(path.join(repoRoot, "app.js"), "utf8");
  const serverJs = fs.readFileSync(path.join(repoRoot, "server.js"), "utf8");

  assert.doesNotMatch(appJs, /fetch\s*\(\s*["']\/api\/reset["']/);
  assert.doesNotMatch(serverJs, /app\.post\s*\(\s*["']\/api\/reset["']/);
  assert.match(appJs, /resetBtn\.addEventListener\(\s*["']click["'],\s*resetTimer\s*\)/);

  const resetTimerMatch = appJs.match(/function resetTimer\(\)\s*\{([^}]*)\}/);
  assert.ok(resetTimerMatch, "Expected resetTimer function to exist");
  const resetTimerBody = resetTimerMatch[1];

  assert.match(resetTimerBody, /stopTimer\(\);/);
  assert.match(resetTimerBody, /seconds\s*=\s*0;/);
  assert.match(resetTimerBody, /timerDisplay\.textContent\s*=\s*formatTime\(0\);/);
});
