const issueToken = require("../services/issueToken");

module.exports = function (req, res) {
  const { username, password } = req.body;

  if (!password) {
    return res.status(400).send("Password is required");
  }

  if (!req.session.user) {
    return res.sendStatus(401);
  }

  if (req.session.user.email !== username) {
    return res.sendStatus(401);
  }

  if (req.session.user.password !== password) {
    return res.sendStatus(401);
  }

  const token = issueToken(req.session.user);

  res.json(token);
};