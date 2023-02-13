const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const SECRET = "s3cr3t";

module.exports = function issueToken({ nickname, email }) {
  const expiresIn = 3600;
  const sub = crypto.createHmac("sha256", SECRET).update(email).digest("hex");

  const iat = Date.now();
  const exp = iat + expiresIn;

  return {
    access_token: crypto.randomBytes(8).toString("hex"),
    token_type: "Bearer",
    expires_in: expiresIn,
    id_token: jwt.sign(
      {
        sub,
        email,
        nickname,
        exp,
        iat,
      },
      SECRET
    ),
  };
};
