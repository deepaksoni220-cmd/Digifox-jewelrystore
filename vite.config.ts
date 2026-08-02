// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      // Bundle ALL npm dependencies into the SSR output ONLY in production.
      // On Vercel's serverless runtime the `dist/server/` files are the only JS shipped
      // to the function — bare-specifier imports for packages like h3-v2,
      // seroval, three, etc. can't resolve because node_modules isn't
      // reliably included.
      // During local dev (`vite dev`), bundling everything breaks React (module is not defined).
      noExternal: process.env.NODE_ENV === "production" ? true : undefined,
    },
  },
});
