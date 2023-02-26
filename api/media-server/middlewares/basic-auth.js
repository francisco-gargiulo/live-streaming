/**
 * The Basic Authentication scheme is defined in RFC 2617. It allows clients to
 * authenticate with a server by sending a Base64-encoded username and password
 * in the Authorization header of the request. The server then checks the
 * provided credentials against a list of authorized users and grants access if
 * the credentials are valid. If the credentials are invalid, the server sends
 * a 401 Unauthorized response with a WWW-Authenticate header that indicates
 * that Basic Authentication is required and includes a realm parameter to
 * indicate the protection space. The client can then retry the request with
 * the correct credentials.
 */

const users = require("../database/users.json");
const verifyPassword = require("../services/verifyPassword");

module.exports = function (
  { headers: { authorization: authHeader } },
  res,
  next
) {
  // Extract the authentication scheme and credentials from the Authorization
  // header
  const [scheme, credentials] = (authHeader && authHeader.split(" ")) || [];

  // If the authentication scheme is not "Basic" or no credentials are
  // provided, send a 401 Unauthorized response with a WWW-Authenticate header
  if (scheme !== "Basic" || !credentials) {
    res.set("WWW-Authenticate", 'Basic realm="Authentication Required"');
    res.sendStatus(401);

    return;
  }

  // Extract the username and password from the base64-encoded credentials
  const [username, password] = Buffer.from(credentials, "base64")
    .toString()
    .split(":");

  // If both the username and password are valid, call the next middleware
  // in the stack
  if (username && password) {
    if (verifyPassword(password, users[username])) {
      next();

      return;
    }
  }

  // If the username and password are invalid, send a 401 Unauthorized
  // response with a WWW-Authenticate header
  res.set("WWW-Authenticate", 'Basic realm="Authentication Required"');
  res.status(401).send("Invalid Credentials");
};
