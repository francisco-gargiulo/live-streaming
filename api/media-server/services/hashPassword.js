const crypto = require("crypto");

module.exports = function hashPassword(password) {
  // Generate a random salt
  const salt = crypto.randomBytes(16).toString("hex");

  // Hash the password with the salt using SHA-256
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");

  // Return the salt and hash as a single string
  return `${salt}:${hash}`;
};
