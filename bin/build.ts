import * as esbuild from "esbuild";

// @ts-ignore
esbuild.build({
  entryPoints: ["./lambda/**"],
  bundle: true,
  outdir: "dist",
  outbase: "./",
  platform: "node",
  target: "node20",
  format: "cjs",
  minify: true,
});
