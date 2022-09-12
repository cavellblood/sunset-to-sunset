import legacy from "@vitejs/plugin-legacy";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";

// https://vitejs.dev/config/
export default ({ command }) => ({
  root: path.resolve(__dirname, "src"),
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: "../dist/",
    rollupOptions: {
      input: {
        "sunset-to-sunset": "./src/js/sunset-to-sunset.ts",
        test: "./src/tests/index.html",
      },
      output: {
        sourcemap: true,
        entryFileNames: `assets/[name].min.js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  publicDir: "./src/tests",
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    nodeResolve({
      moduleDirectories: ["node_modules"],
    }),
  ],
  server: {
    port: 3100,
  },
});
