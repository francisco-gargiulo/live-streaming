const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

// Export a function that issues a new JWT access token
module.exports = function issueToken({ nickname, username }) {
  const expiresIn = 3600; // The token expires in 1 hour
  const sub = crypto
    .createHmac("sha256", JWT_SECRET) // Create a SHA-256 HMAC using the JWT secret and the username
    .update(username)
    .digest("hex"); // Convert the result to a hexadecimal string

  const iat = Date.now(); // The token is issued now
  const exp = iat + expiresIn; // The token expires after the specified number of seconds

  return {
    access_token: crypto.randomBytes(8).toString("hex"), // Generate a random 8-byte string as the access token
    token_type: "Bearer", // The token type is Bearer
    expires_in: expiresIn, // The token expires after the specified number of seconds
    id_token: jwt.sign(
      {
        // Generate a JWT containing the user's nickname, email, and other data
        sub, // The JWT subject is the SHA-256 HMAC of the username
        email: username, // The email is the username
        nickname,
        exp, // The token expiration time
        iat, // The token issuance time
      },
      JWT_SECRET // Sign the JWT using the JWT secret
    ),
  };
};
