const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const validateAndSanitizeMessage = require("./services/validateAndSanitizeMessage");

const SECRET = "s3cr3t";

const io = new Server({
  cors: {
    origin: "*",
  },
});

const messages = [];

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
        SECRET
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

io.listen(3001);
