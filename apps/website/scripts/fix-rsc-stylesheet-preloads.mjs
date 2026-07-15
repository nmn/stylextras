import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDirectory = fileURLToPath(new URL("../dist/public", import.meta.url));
let updatedFiles = 0;

async function updateHtmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await updateHtmlFiles(file);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;

    const source = await readFile(file, "utf8");
    const output = source
      .replaceAll('as="stylesheet"', 'as="style"')
      // React's embedded RSC resource hint otherwise recreates the invalid
      // preload during hydration even after the static link is corrected.
      .replaceAll(',\\"stylesheet\\"]', ',\\"style\\"]');
    if (source === output) continue;
    await writeFile(file, output);
    updatedFiles += 1;
  }
}

await updateHtmlFiles(publicDirectory);
console.log(`Corrected stylesheet preloads in ${updatedFiles} HTML files.`);
