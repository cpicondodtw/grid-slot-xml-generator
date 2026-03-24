import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function createSheetProxyPlugin(basePath: string, sheetApiUrl?: string): Plugin {
  const routePaths = new Set(["/api/sheets"]);

  if (basePath !== "/") {
    routePaths.add(`${basePath.slice(0, -1)}/api/sheets`);
  }

  const handleRequest = async (
    req: { url?: string },
    res: {
      statusCode: number;
      setHeader(name: string, value: string): void;
      end(body: string): void;
    },
    next: () => void,
  ) => {
    const requestUrl = req.url ? new URL(req.url, "http://localhost") : null;

    if (!requestUrl || !routePaths.has(requestUrl.pathname)) {
      next();
      return;
    }

    res.setHeader("Content-Type", "application/json");

    if (!sheetApiUrl) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Missing SHEET_API_URL." }));
      return;
    }

    const upstreamUrl = new URL(sheetApiUrl);
    const action = requestUrl.searchParams.get("action");
    const sheet = requestUrl.searchParams.get("sheet");

    if (action) {
      upstreamUrl.searchParams.set("action", action);
    }

    if (sheet) {
      upstreamUrl.searchParams.set("sheet", sheet);
    }

    try {
      const response = await fetch(upstreamUrl);
      const body = await response.text();

      res.statusCode = response.status;
      res.end(body);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upstream request failed.";
      res.statusCode = 502;
      res.end(JSON.stringify({ error: message }));
    }
  };

  return {
    name: "sheet-proxy",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleRequest(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        void handleRequest(req, res, next);
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = normalizeBasePath(env.BASE_PATH || "/");
  const sheetApiUrl = env.SHEET_API_URL?.trim() || env.VITE_SHEET_API_URL?.trim();

  return {
    plugins: [react(), createSheetProxyPlugin(basePath, sheetApiUrl)],
    base: basePath,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
