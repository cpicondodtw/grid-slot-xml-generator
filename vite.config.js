import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
function normalizeBasePath(basePath) {
    if (!basePath || basePath === "/") {
        return "/";
    }
    var withLeadingSlash = basePath.startsWith("/") ? basePath : "/".concat(basePath);
    return withLeadingSlash.endsWith("/") ? withLeadingSlash : "".concat(withLeadingSlash, "/");
}
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var basePath = normalizeBasePath(env.BASE_PATH || "/");
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
