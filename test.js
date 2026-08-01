const { createServer } = require("node:http");
createServer(async (req, res) => {
  try {
    const url = "http://localhost/" + req.url;
    const webReq = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    });
    console.log("Success!");
    res.end("OK");
  } catch (err) {
    console.error("Error creating request:", err);
    res.statusCode = 500;
    res.end("ERROR");
  }
}).listen(3000, () => {
  console.log("Server listening on 3000");
  fetch("http://localhost:3000", { method: "POST", body: "test" }).then(() => process.exit(0));
});
