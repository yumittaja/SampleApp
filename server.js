const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;
const demoResetFaultEnabled = process.env.ENABLE_DEMO_RESET_FAULT === "true";

// Serve the static files (index.html, styles.css, app.js) from the project root
app.use(express.static(path.join(__dirname)));

// Demo fault endpoint — only raises an HTTP 500 when explicitly enabled.
app.post("/api/reset", (req, res) => {
  if (!demoResetFaultEnabled) {
    res.status(204).end();
    return;
  }

  throw new Error("Reset failed: simulated internal server error");
});

app.listen(port, () => {
  console.log(`Perfect Cup is running on port ${port}`);
});
