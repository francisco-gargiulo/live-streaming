// Import the necessary modules and packages
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const validateAndSanitizeMessage = require("./services/validateAndSanitizeMessage");

// Load environment variables from a .env file
dotenv.config();

// Get the JWT secret from the environment variables
const { JWT_SECRET } = process.env;

// Define constants for error codes
const ERROR_CODES = {
  AUTHENTICATION: "INVALID_ID_TOKEN",
  MESSAGE: "INVALID_MESSAGE",
  UNKNOWN: "UNKNOWN_ERROR",
};

// Define custom errors
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.code = ERROR_CODES.AUTHENTICATION;
  }
}

class MessageError extends Error {
  constructor(message) {
    super(message);
    this.name = "MessageError";
    this.code = ERROR_CODES.MESSAGE;
  }
}

class Message {
  constructor(type, timestamp, message, email, nickname) {
    this.type = type;
    this.timestamp = timestamp;
    this.message = message;
    this.email = email;
    this.nickname = nickname;
  }
}

// Create a new Socket.IO server instance
const io = new Server({
  cors: {
    origin: "*",
  },
});

// Define an array to store chat messages
const chatMessages = [
  new Message("user", Date.now(), "Hi everyone!", "john@doe.com", "John"),
];

// Handle new client connections to the server
io.on("connection", async (socket) => {
  // Emit the current chat messages to the new client
  socket.emit("load", chatMessages);

  // Handle incoming chat messages from the client
  socket.on("message", async (message) => {
    try {
      // Check if the client is authenticated using JWT
      if (!socket.handshake.auth) {
        throw new AuthenticationError("No auth");
      }

      // Check if there is a message
      if (!message) {
        throw new MessageError("No message");
      }

      const sanitizedMessage = validateAndSanitizeMessage(message);

      // Extract the email and nickname from the JWT token
      const { email, nickname } = jwt.verify(auth, JWT_SECRET);

      // Create a new Message object with the incoming message and user info
      const newMessage = new Message(
        "user",
        Date.now(),
        sanitizedMessage,
        email,
        nickname
      );

      // Add the new message to the chatMessages array
      chatMessages.push(newMessage);

      // Broadcast the updated chatMessages to all clients
      socket.broadcast.emit("load", chatMessages);

      console.log(chatMessages);
    } catch (error) {
      // Handle errors by emitting an error event to the client
      socket.emit("error", {
        code: error.code || ERROR_CODES.UNKNOWN,
        message: error.message || "Unknown Error",
      });
    }
  });
});

// Start the server and listen on port 3002
io.listen(3002);
