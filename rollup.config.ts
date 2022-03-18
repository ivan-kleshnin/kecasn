import typescriptPlugin from "@rollup/plugin-typescript"
import {defineConfig} from "rollup"
import dtsPlugin from "rollup-plugin-dts"
import {terser as terserPlugin} from "rollup-plugin-terser"
import packageJson from "./package.json"

export default defineConfig([
  // Transpile sources to CJS and ESM and type definitions
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        plugins: [terserPlugin()],
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        plugins: [terserPlugin()],
        sourcemap: true,
      }
    ],
    external: [],
    plugins: [
      // resolvePlugin({
      //   extensions: [".ts", ".tsx"/*, ".js", ".jsx"*/]
      // }),
      typescriptPlugin({tsconfig: "./tsconfig.json"}),
    ],
  },

  // Concat type definitions into a single file
  {
    input: "dist/esm/types/src/index.d.ts",
    output: {file: "dist/index.d.ts", format: "esm"},
    plugins: [
      dtsPlugin()
    ],
  }
])
