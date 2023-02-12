const express = require("express");
const session = require("express-session");

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const crypto = require("crypto");

const SMTP_USERNAME = "";
const SMTP_PASSWORD = "";
const SMTP_HOST = "email-smtp.us-east-1.amazonaws.com";
const SMTP_PORT = 465;

const SECRET = "s3cr3t";

const app = express();

app.use(express.json());

app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// rate limit niddleware
app.use((req, res, next) => {
  const currentTime = Date.now();

  // initialize navigation
  if (!req.session.navigation) {
    req.session.navigation = {};
  }

  // initialize url history
  if (!req.session.navigation[req.url]) {
    req.session.navigation[req.url] = {
      calls: 1,
      timestamp: currentTime,
    };

    return next();
  }

  // reset after 5s
  if (currentTime - req.session.navigation[req.url].timestamp > 5000) {
    req.session.navigation[req.url] = {
      calls: 1,
      timestamp: currentTime,
    };

    return next();
  }

  req.session.navigation[req.url].calls += 1;

  if (req.session.navigation[req.url].calls > 5) {
    return res.status(429).send("Too Many Requests");
  }

  next();
});

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "francisco_gargiulo@hotmail.com",
    to: email,
    subject: "OTP",
    text: `Your OTP is ${otp}`,
  };

  return await transporter.sendMail(mailOptions);
};

app.post("/start", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const otp = Math.floor(Math.random() * 1000000);

  try {
    await sendOTP(email, otp);

    req.session.otp = otp;
    req.session.email = email;

    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    return res.sendStatus(500);
  }
});

function issueAccessToken(email) {
  const expiresIn = 3600;
  const currentTime = Date.now();

  return {
    access_token: crypto.randomBytes(8).toString("hex"),
    token_type: "Bearer",
    expires_in: expiresIn,
    id_token: jwt.sign(
      {
        sub: crypto.createHmac("sha256", SECRET).update(email).digest("hex"),
        email,
        exp: currentTime + 3600,
        iat: currentTime,
      },
      SECRET
    ),
  };
}

app.post("/verify", (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).send("OTP is required");
  }

  if (req.session.otp !== otp) {
    res.sendStatus(401);
  } else {
    const accessToken = issueAccessToken(req.session.email);
    res.json(accessToken);
  }

  // no retries
  delete req.session.otp;
});

app.listen(3000);
