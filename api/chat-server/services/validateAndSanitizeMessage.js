module.exports = function validateAndSanitizeMessage(message) {
  const maxLength = 100;

  // Trim the message to remove leading and trailing spaces
  const trimmedMessage = message.trim();

  // Check if the message is too short or too long
  if (trimmedMessage.length < 1 || trimmedMessage.length > maxLength) {
    throw new Error("Invalid message length")
      .setCode("INVALID_LENGTH");
  }

  // Sanitize the message to remove any HTML or script tags
  const sanitizedMessage = trimmedMessage
    .replace(/<script.*?>.*?<\/script>/gi, "")
    .replace(/<\/?[^>]+(>|$)/g, "");

  return sanitizedMessage;
};
