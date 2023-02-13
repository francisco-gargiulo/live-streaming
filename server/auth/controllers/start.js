const sendOTP = require("../services/sendOTP");

module.exports = async function startController(req, res) {
  const email = req.body.email;
  const nickname = req.body.nickname;

  if (!email) {
    return res.status(400).send("email is required");
  }

  if (!nickname) {
    return res.status(400).send("nickname is required");
  }

  const otp = Math.floor(Math.random() * 1000000);

  try {
    await sendOTP(email, otp);

    req.session.user = { email, nickname, password: otp };

    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    return res.sendStatus(500);
  }
};
