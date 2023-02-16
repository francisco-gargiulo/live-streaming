const issueToken = require("../services/issueToken");

module.exports = function (req, res) {
  const { username, password } = req.body;
  const { user } = req.session;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  if (!user) {
    return res.sendStatus(401);
  }

  if (user.username !== username) {
    return res.sendStatus(401);
  }

  if (user.password !== password) {
    if (!req.session.retry) {
      req.session.retry = 1;
    } else {
      req.session.retry += 1;
    }

    if (req.session.retry > 3) {
      req.session.destroy();
      return res.status(403).send("Maximum retries exceeded, please send a new OTP");
    }

    return res.status(400).send(`Incorrect OTP, retry ${req.session.retry} of 3`);
  }

  const token = issueToken(user);

  res.json(token);
};
