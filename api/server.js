// ─── Dependency hints for Vercel's file tracer ───────────────────────────────
// Vercel traces `import` / `require` calls to decide which node_modules to
// bundle into the serverless function.  Our pre-built `dist/server/**` files
// use bare-specifier imports (e.g. `import { H3Event } from "h3-v2"`) that the
// tracer can't follow because they live in *already-built* JS, not source.
//
// The lines below are **never executed** — they exist purely so that Vercel's
// static analysis picks up every npm package the SSR bundle needs at runtime.
// prettier-ignore
if (false) {
  require("react");
  require("react/jsx-runtime");
  require("react-dom");
  require("react-dom/server");
  require("@tanstack/react-router");
  require("@tanstack/react-router/ssr/server");
  require("@tanstack/router-core");
  require("@tanstack/router-core/ssr/client");
  require("@tanstack/router-core/ssr/server");
  require("@tanstack/react-query");
  require("@tanstack/history");
  require("h3-v2");
  require("seroval");
  require("gsap");
  require("gsap/ScrollTrigger");
  require("lenis");
  require("framer-motion");
  require("three");
  require("@react-three/fiber");
  require("@react-three/drei");
}
// ─────────────────────────────────────────────────────────────────────────────

import handlerMod from "../dist/server/server.js";

const handler = handlerMod.default ?? handlerMod;

export default async function (req, res) {
  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${req.url}`;
    
    const webReq = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req,
      duplex: "half",
    });
    
    const webRes = await handler.fetch(webReq, {}, {});
    
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
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal Server Error:\n\n" + (err.stack || err.toString()));
  }
}
