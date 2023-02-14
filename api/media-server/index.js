const express = require("express");
const cors = require("cors");
const fs = require("fs");

const authenticate = require("./middlewares/basic-auth");

const app = express();

app.use(
  express.raw({
    type: "application/vnd.apple.mpegurl",
    limit: "50mb",
  })
);

app.use(cors());

app.put("/static/:filename", authenticate, (req, res) => {
  const { filename } = req.params;

  try {
    fs.writeFileSync(`${__dirname}/media/${filename}`, req.body);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/static/:filename", (req, res) => {
  const { filename } = req.params;

  try {
    res.send(fs.readFileSync(`${__dirname}/media/${filename}`));
  } catch (err) {
    console.error(err);
    res.statusStatus(404);
  }
});

app.listen(3003, () => {
  console.log("Server listening on port 3003");
});
