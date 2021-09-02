const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

// MongoDB Configuration
const mongoose = require("mongoose");
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/googlebooks";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/api", (req, res) => {
  res.status(200).send({
    title: "SPS API",
    endpoint: "/api",
    numberOfHits: "1000+",
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/api/:numberOfHits", (req, res) => {
  const title = "SPS API";
  const { numberOfHits } = req.params;
  const { endpoint } = req.body;

  if (!endpoint) {
    res.status(418).send({
      message: "Null or invalid endpoint/numberOfHits.",
    });
  }

  res.send({
    title,
    endpoint,
    numberOfHits,
  });
});

app.listen(PORT, () => {
  console.log(`SPS server breathing on http://localhost:${PORT}`);
});
