const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;

module.exports = function issueToken({ nickname, username }) {
  const expiresIn = 3600;
  const sub = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(username)
    .digest("hex");

  const iat = Date.now();
  const exp = iat + expiresIn;

  return {
    access_token: crypto.randomBytes(8).toString("hex"),
    token_type: "Bearer",
    expires_in: expiresIn,
    id_token: jwt.sign(
      {
        sub,
        email: username,
        nickname,
        exp,
        iat,
      },
      JWT_SECRET
    ),
  };
};
