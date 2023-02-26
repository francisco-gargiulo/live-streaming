const MAX_DIGITS = 4;

module.exports = function generateRandomOTP() {
  const randomNum = Math.floor(Math.random() * Math.pow(10, MAX_DIGITS));

  return randomNum.toString().padStart(MAX_DIGITS, "0");
};
