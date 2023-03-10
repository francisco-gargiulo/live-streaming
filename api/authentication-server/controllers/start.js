const sendOTP = require("../services/sendOTP");
const randomOTP = require("../services/randomOTP");

module.exports = async function (req, res) {
  const username = req.body.username;
  const nickname = req.body.nickname;

  if (!username) {
    return res.status(400).send("username is required");
  }

  if (!nickname) {
    return res.status(400).send("nickname is required");
  }

  const password = randomOTP();

  try {
    await sendOTP(username, password);

    req.session.user = { username, nickname, password };

    res.sendStatus(200);
  } catch (error) {
    console.log(error);

    return res.sendStatus(500);
  }
};
