const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const validateAndSanitizeMessage = require("./services/validateAndSanitizeMessage");

const { JWT_SECRET } = process.env;

const io = new Server({
  cors: {
    origin: "*",
  },
});

const messages = [
  {
    type: "user",
    timestamp: Date.now(),
    message: "test",
    email: "john@doe.com",
    nickname: "John",
  },
];

io.on("connection", async (socket) => {
  socket.emit("load", messages);

  socket.on("message", async (message) => {
    if (!socket.handshake.auth) {
      return;
    }

    try {
      const sanitizedMessage = validateAndSanitizeMessage(message);

      const { email, nickname } = jwt.verify(
        socket.handshake.auth.id_token,
        JWT_SECRET
      );

      messages.push({
        type: "user",
        timestamp: Date.now(),
        message: sanitizedMessage,
        email,
        nickname,
      });

      socket.broadcast.emit("load", messages);
    } catch ({ code }) {
      socket.emit("error", { code });
    }
  });
});

io.on("authenticated", () => {
  console.log("authenticated");
});

io.listen(3002);
