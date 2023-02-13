async function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let body = [];
    req
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        body = Buffer.concat(body);
        resolve(body);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
