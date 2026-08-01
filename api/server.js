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
  try {
    const h = await getHandler();
    // Convert Node req/res to Web Request/Response
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;
    
    const webReq = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
    });
    
    const webRes = await h.fetch(webReq, {}, {});
    
    res.statusCode = webRes.status;
    webRes.headers.forEach((v, k) => res.setHeader(k, v));
    
    if (webRes.body) {
      const reader = webRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.end();
    }
  } catch (err) {
    console.error("Vercel Serverless Error:", err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
