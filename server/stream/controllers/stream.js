const fs = require("fs");

module.exports = {
  PUT: async (req, res) => {
    const { filename } = req.params;
    try {
      const body = req.body;

      await fs.promises.writeFile(`${__dirname}/files/${filename}`, body);

      res.end(body);
    } catch (error) {
      res.statusCode = 400;
      res.end();
    }
  },
  GET: async (request, response) => {
    const { filename } = request.params;
    try {
      const file = await fs.promises.readFile(`${__dirname}/files/${filename}`);

      response.end(file);
    } catch (error) {
      response.statusCode = 404;
      response.end();
    }
  },
};
