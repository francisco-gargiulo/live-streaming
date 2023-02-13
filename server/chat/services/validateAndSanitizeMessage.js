module.exports = function validateAndSanitizeMessage(message) {
  // Trim the message to remove leading and trailing spaces
  let sanitizedMessage = message.trim();

  // Check if the message is too short or too long
  if (sanitizedMessage.length < 1 || sanitizedMessage.length > 100) {
    const error = new Error("Invalid message length");

    error.code = "INVALID_LENGTH";

    throw error;
  }

  // Sanitize the message to remove any HTML or script tags
  sanitizedMessage = sanitizedMessage.replace(/<script.*?>.*?<\/script>/gi, "");
  sanitizedMessage = sanitizedMessage.replace(/<\/?[^>]+(>|$)/g, "");

  return sanitizedMessage;
};
