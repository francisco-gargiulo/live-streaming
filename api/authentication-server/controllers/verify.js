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
    return res.sendStatus(401);
  }

  const token = issueToken(user);

  res.json(token);
};
