const express = require("express");
const session = require("express-session");

const SESSION_SECRET = "s3cr3t";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/start", require("./controllers/start"));
app.post("/token", require("./controllers/token"));

app.listen(3000);
