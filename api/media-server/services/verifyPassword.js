const crypto = require("crypto");

module.exports = function verifyPassword(password, storedHash) {
  // Extract the salt and hash from the stored value
  const [salt, hash] = storedHash.split(":");

  // Hash the password with the salt using SHA-256
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha256")
    .toString("hex");

  // Compare the computed hash to the stored hash
  return computedHash === hash;
}
