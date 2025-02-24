/**
 * @flow strict
 */

import { Features, transform } from "lightningcss";
import { compile } from "tailwindcss";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let filePath = path.join(__dirname, "../theme.css");
filePath = filePath.replace("file:", "");

export async function makeCompiler(
  theme: string = fs.readFileSync(filePath, "utf-8")
): Promise<(clases: string | string[]) => string> {
  let { build } = await compile(`${theme}\n\n@tailwind utilities;`);
  return (classes: string | string[]): string => {
    const candidates =
      typeof classes === "string" ? classes.split(" ") : classes;

    const cssLines = optimizeCss(build(candidates));
    return cssLines;
  };
}

export function optimizeCss(
  input: string,
  {
    file = "input.css",
    minify = false,
  }: {
    file?: string;
    minify?: boolean;
  } = {}
): string {
  return transform({
    filename: file,
    code: new Uint8Array(Buffer.from(input)),
    // minify,
    sourceMap: false,
    drafts: {
      customMedia: true,
    },
    nonStandard: {
      deepSelectorCombinator: true,
    },
    include: Features.Nesting,
    // exclude: Features.LogicalProperties,
    targets: {
      safari: (16 << 16) | (4 << 8),
    },
    errorRecovery: true,
  }).code.toString();
}
