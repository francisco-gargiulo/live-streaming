const express = require("express");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { SESSION_SECRET } = process.env;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.post("/auth/start", require("./controllers/start"));
app.post("/auth/verify", require("./controllers/verify"));

app.listen(3001);
