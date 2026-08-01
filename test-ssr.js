import handler from "./api/server.js";
import http from "node:http";

http.createServer((req, res) => {
  handler(req, res).catch(err => {
    console.error("Handler error:", err);
    res.statusCode = 500;
    res.end(err.stack);
  });
}).listen(3002, () => {
  console.log("Listening on http://localhost:3002");
});
