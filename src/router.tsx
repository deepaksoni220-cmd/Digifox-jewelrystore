import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Derive the basepath from the Vite base so the app works both at "/" and when
  // embedded under a sub-path (e.g. "/my-site/"). Safe for normal builds
  // (BASE_URL "/" → undefined).
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: base || undefined,
  });

  return router;
};
