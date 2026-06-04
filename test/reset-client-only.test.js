// Regression test: POST /api/reset must not exist on the server.
// The Reset button performs a client-side reset only and must not
// depend on any server endpoint.
const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { createServer } = require("node:http");
const express = require("express");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");

function buildApp() {
  const app = express();
  app.use(express.static(appRoot));
  return app;
}

describe("POST /api/reset", () => {
  let server;
  let baseUrl;

  before(() =>
    new Promise((resolve) => {
      server = createServer(buildApp());
      server.listen(0, "127.0.0.1", () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    })
  );

  after(() => new Promise((resolve) => server.close(resolve)));

  it("returns 404 because the route does not exist", async () => {
    const res = await fetch(`${baseUrl}/api/reset`, { method: "POST" });
    assert.equal(
      res.status,
      404,
      `Expected 404 but got ${res.status}`
    );
  });
});
