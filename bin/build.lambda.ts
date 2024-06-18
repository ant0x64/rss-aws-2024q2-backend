import * as esbuild from "esbuild";

// @ts-ignore
esbuild.build({
  entryPoints: ["./src/lambda/**"],
  bundle: true,
  outdir: "dist",
  outbase: "./src/",
  platform: "node",
  target: "node20",
  format: "cjs",
  minify: true,
});
