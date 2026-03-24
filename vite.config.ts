import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "/grid-slot-xml-generator/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});