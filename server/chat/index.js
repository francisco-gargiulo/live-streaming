const { Server } = require("socket.io");
const jose = require("jose");

const JWKS = jose.createRemoteJWKSet(
  new URL("https://poprockandcorn.us.auth0.com/.well-known/jwks.json")
);

const io = new Server({
  cors: {
    origin: "*",
  },
});

const messages = [
  {
    type: "user",
    timestamp: Date.now(),
    message: "Hi",
    email: "foo@bar.com",
    nickname: "Foo",
  },
  {
    type: "user",
    timestamp: Date.now(),
    message: "Hello",
    email: "john@doe.com",
    nickname: "John",
  },
  {
    type: "user",
    timestamp: Date.now(),
    message: "Hello motherfuckers!",
    email: "francisco_gargiulo@hotmail.com",
    nickname: "Fran",
  }
];

io.on("connection", async (socket) => {
  socket.emit("load", messages);

  socket.on("message", async (message) => {
    if (!socket.handshake.auth) {
      return;
    }

    try {
      const { payload } = await jose.jwtVerify(
        socket.handshake.auth.id_token,
        JWKS
      );

      messages.push({
        type: "user",
        timestamp: Date.now(),
        message,
        email: payload.email,
        nickname: payload.nickname,
      });

      socket.broadcast.emit("load", messages);
    } catch ({ code }) {
      console.error(code);
      socket.emit(code);
    }
  });
});

io.on("authenticated", () => {
  console.log("authenticated");
});

module.exports = io;
