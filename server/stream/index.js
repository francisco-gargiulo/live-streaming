const http = require("http");
const cors = require("cors");

const bodyParser = require("./utils/bodyParser");
const streamControllers = require("./controllers/stream");

const router = (req, res) => {
  const { pathname } = new URL(req.url);

  const [path, filename] = pathname.split("/");

  if (!["GET", "PUT"].includes(req.method)) {
    res.statusCode = 405;
    res.end();

    return;
  }

  if (req.method === "PUT") {
    try {
      req.body = bodyParser(req);
    } catch (error) {
      res.statusCode = 400;
      res.end();

      return;
    }
  }

  if (path !== "stream") {
    res.statusCode = 404;
    res.end();

    return;
  }

  req.params = {
    filename,
  };

  streamControllers[req.method](req, res);
};

const server = http.createServer((req, res) => {
  cors()(req, res, () => {
    console.log(`${req.method} ${req.url}`);

    router(req, res);
  });
});

server.listen(3002);
