const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = require("../server");

test("POST /api/reset returns 204 instead of 5xx", async () => {
  const server = app.listen(0);

  try {
    await new Promise((resolve) => server.once("listening", resolve));
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/reset`, {
      method: "POST",
    });

    assert.equal(response.status, 204);
  } finally {
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
});

test("Reset button uses client-side timer reset", async () => {
  const appJs = await fs.readFile(path.join(__dirname, "..", "app.js"), "utf8");

  assert.match(appJs, /resetBtn\.addEventListener\("click",\s*resetTimer\);/);
  assert.doesNotMatch(appJs, /fetch\("\/api\/reset"/);
});
