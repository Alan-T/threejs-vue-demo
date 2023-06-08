import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "./src/assets"),
      },
      {
        find: "vue",
        replacement: "vue/dist/vue.esm-bundler.js", // compile template
      },
    ],
    extensions: [".js"],
  },
  define: {
    "process.env": {},
  },
  css: {
    preprocessorOptions: {
      scss: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            "src/assets/style/breakpoint.scss"
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
});
