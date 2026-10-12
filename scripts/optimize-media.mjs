import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
const gallery = JSON.parse(
  await readFile("research/media/curated-web-gallery.json", "utf8"),
);
const corpus = JSON.parse(await readFile("content/corpus.json", "utf8"));
await mkdir("public/media", { recursive: true });
const manifest = [];
for (const item of gallery) {
  if (!corpus.media.some((m) => m.id === item.id)) continue;
  if (item.rights_status !== "reuse-with-credit")
    throw new Error(`Rights not cleared: ${item.id}`);
  // Cloud locations are provenance only. Resolve through known archive-relative suffix.
  const suffix = item.local_path.split("/media/")[1];
  if (!suffix || suffix.includes("..")) throw new Error("Invalid media path");
  const input = path.resolve("research/media", suffix);
  const bytes = await readFile(input);
  if (createHash("sha256").update(bytes).digest("hex") !== item.sha256)
    throw new Error(`Hash mismatch: ${item.id}`);
  const output = `public/media/${item.id}.webp`;
  await sharp(bytes)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(output);
  const meta = await sharp(output).metadata();
  const derivative = await readFile(output);
  manifest.push({
    id: item.id,
    path: "/" + output.replace("public/", ""),
    author: item.author,
    source: item.source_url,
    sourceDate: item.date,
    license: "CC BY 4.0",
    licenseUrl: item.license_url,
    width: meta.width,
    height: meta.height,
    originalSha256: item.sha256,
    sha256: createHash("sha256").update(derivative).digest("hex"),
    bytes: derivative.length,
    changes:
      "WebP conversion; metadata removed; no enlargement or generative modification",
  });
}
await writeFile(
  "content/media-licenses.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Optimized ${manifest.length} approved images; ${manifest.reduce((n, m) => n + m.bytes, 0)} total bytes.`,
);
