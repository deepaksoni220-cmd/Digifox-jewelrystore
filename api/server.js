import { createServer } from "node:http";
import { createServerAdapter } from "@whatwg-node/server";

// Import the built server entry from TanStack Start
let handler;

async function getHandler() {
  if (!handler) {
    // The built server entry from `npm run build`
    const mod = await import("../dist/server/server.js");
    handler = mod.default ?? mod;
  }
  return handler;
}

export default async function (req, res) {
  const h = await getHandler();
  // Convert Node req/res to Web Request/Response
  const url = `http://${req.headers.host}${req.url}`;
  const webReq = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
  });
  const webRes = await h.fetch(webReq, {}, {});
  res.statusCode = webRes.status;
  webRes.headers.forEach((v, k) => res.setHeader(k, v));
  const body = await webRes.text();
  res.end(body);
}
