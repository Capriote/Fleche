const express = require("express");

const app = express();

app.get("/", (_req, res) => {
  return res.send("Hello World!");
});

app.listen(process.env.port || 3000, () => {
  console.log("Express server listening ");
});
