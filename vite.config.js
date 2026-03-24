var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
function createSheetProxyPlugin(basePath, sheetApiUrl) {
    var _this = this;
    var routePaths = new Set(["/api/sheets"]);
    if (basePath !== "/") {
        routePaths.add("".concat(basePath.slice(0, -1), "/api/sheets"));
    }
    var handleRequest = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var requestUrl, upstreamUrl, action, sheet, response, body, error_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requestUrl = req.url ? new URL(req.url, "http://localhost") : null;
                    if (!requestUrl || !routePaths.has(requestUrl.pathname)) {
                        next();
                        return [2 /*return*/];
                    }
                    res.setHeader("Content-Type", "application/json");
                    if (!sheetApiUrl) {
                        res.statusCode = 500;
                        res.end(JSON.stringify({ error: "Missing SHEET_API_URL." }));
                        return [2 /*return*/];
                    }
                    upstreamUrl = new URL(sheetApiUrl);
                    action = requestUrl.searchParams.get("action");
                    sheet = requestUrl.searchParams.get("sheet");
                    if (action) {
                        upstreamUrl.searchParams.set("action", action);
                    }
                    if (sheet) {
                        upstreamUrl.searchParams.set("sheet", sheet);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(upstreamUrl)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 3:
                    body = _a.sent();
                    res.statusCode = response.status;
                    res.end(body);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    message = error_1 instanceof Error ? error_1.message : "Upstream request failed.";
                    res.statusCode = 502;
                    res.end(JSON.stringify({ error: message }));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return {
        name: "sheet-proxy",
        configureServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                void handleRequest(req, res, next);
            });
        },
        configurePreviewServer: function (server) {
            server.middlewares.use(function (req, res, next) {
                void handleRequest(req, res, next);
            });
        },
    };
}
export default defineConfig(function (_a) {
    var _b, _c;
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var basePath = normalizeBasePath(env.BASE_PATH || "/");
    var sheetApiUrl = ((_b = env.SHEET_API_URL) === null || _b === void 0 ? void 0 : _b.trim()) || ((_c = env.VITE_SHEET_API_URL) === null || _c === void 0 ? void 0 : _c.trim());
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
