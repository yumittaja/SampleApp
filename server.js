const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8000;

// Serve the static files (index.html, styles.css, app.js) from the project root
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Perfect Cup is running on port ${port}`);
});
