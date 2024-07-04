import { BuildOptions, ConfigEnv, UserConfig, defineConfig } from "vite"

import path from "path"

import react from "@vitejs/plugin-react-swc"
import fs from "fs-extra"
import { visualizer } from "rollup-plugin-visualizer"
import { PackageJson } from "type-fest"
import { checker } from "vite-plugin-checker"
import dts from "vite-plugin-dts"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import styleLint from "vite-plugin-stylelint"
import reactSVG from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig(async (env: ConfigEnv): Promise<UserConfig> => {
  const plugins = [
    nodePolyfills(),
    tsconfigPaths(),
    checker({
      eslint: !process.env.VITEST && { lintCommand: 'eslint "src/**/*.{ts,tsx,js,jsx}"' },
      typescript: true,
    }),
    styleLint({ fix: !process.env.VITEST, cache: false }),
    react(),
    reactSVG(),
    env.mode !== "package"
      ? visualizer({ open: true })
      : dts({ include: ["src"], insertTypesEntry: true, outDir: "es", staticImport: true }),
  ]

  const build: BuildOptions = (() => {
    if (env.mode !== "package") return undefined
    const packageJson = fs.readJSONSync(path.resolve(__dirname, "package.json")) as PackageJson

    return {
      lib: { entry: path.resolve(__dirname, "src/index.ts"), fileName: "index", formats: ["es"], name: "react-boiler" },
      outDir: path.resolve(__dirname, "es"),
      rollupOptions: {
        external: [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.peerDependencies)],
      },
    }
  })()

  return {
    build,
    css: { preprocessorOptions: { scss: { quietDeps: true } } },
    esbuild: { legalComments: "none" },
    plugins,
    resolve: { alias: { ["styles"]: path.resolve(__dirname, "src", "styles") } },
    server: { host: true },
    test: {
      coverage: { include: ["src/utils/**/*.{ts,tsx,js,jsx}", "src/entities/**/*.{ts,tsx,js,jsx}"], provider: "v8" },
      environment: "jsdom",
    },
  }
})
