import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function normalizeBasePath(basePath: string) {
  if (!basePath || basePath === "/") {
    return "/";
  }

  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = normalizeBasePath(env.BASE_PATH || "/");

  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
