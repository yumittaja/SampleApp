const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("Reset button uses local resetTimer instead of /api/reset fault hook", () => {
  const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

  assert.match(appJs, /resetBtn\.addEventListener\("click",\s*resetTimer\)/);
  assert.doesNotMatch(appJs, /fetch\(\s*["']\/api\/reset["']/);
});
