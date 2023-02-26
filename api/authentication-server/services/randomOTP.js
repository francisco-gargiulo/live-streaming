// Define the maximum number of digits for the OTP
const MAX_DIGITS = 4;

// Export a function that generates a random OTP with the specified number of digits
module.exports = function generateRandomOTP() {
  // Generate a random number between 0 and (10 ^ MAX_DIGITS - 1)
  const randomNum = Math.floor(Math.random() * Math.pow(10, MAX_DIGITS));

  // Convert the random number to a string and pad it with leading zeros to ensure it has MAX_DIGITS digits
  return randomNum.toString().padStart(MAX_DIGITS, "0");
};
