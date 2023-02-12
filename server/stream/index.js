const cors = require("cors");
const fs = require("fs");

const router = require("router")();

router.use(cors());

router
  .route("/stream/:filename")
  .get(function (request, response) {
    const { filename } = request.params;

    try {
      const file = fs.readFileSync(`${__dirname}/files/${filename}`);

      response.end(file);
    } catch (error) {
      response.statusCode = 404;
      response.end();
    }

    return;
  })
  .put(function (request, response) {
    const { filename } = request.params;

    let body = [];
    return request
      .on("data", function (chunk) {
        body.push(chunk);
      })
      .on("end", function () {
        body = Buffer.concat(body);

        try {
          fs.writeFileSync(`${__dirname}/files/${filename}`, body);

          response.end(body);
        } catch (error) {
          console.log(error);

          response.statusCode = 400;
          response.end();
        }
      });
  });

module.exports = require("http").createServer(function (request, response) {
  router(request, response, function () {
    response.statusCode = 404;
    response.end();
  });
});
