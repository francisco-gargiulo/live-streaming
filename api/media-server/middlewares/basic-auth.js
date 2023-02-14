const users = require("../database/users.json");

module.exports = function (
  { headers: { authorization: authHeader } },
  res,
  next
) {
  const [scheme, credentials] = (authHeader && authHeader.split(" ")) || [];

  if (scheme !== "Basic" || !credentials) {
    res.set("WWW-Authenticate", 'Basic realm="Authentication Required"');
    res.sendStatus(401);

    return;
  }

  const [username, password] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");

  if (username && password) {
    if (users[username] === password) {
      next();

      return;
    }
  }

  res.set("WWW-Authenticate", 'Basic realm="Authentication Required"');
  res.status(401).send("Invalid Credentials");
};
