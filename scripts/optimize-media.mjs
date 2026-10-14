import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
const gallery = JSON.parse(
  await readFile("content/media-sources.json", "utf8"),
);
const corpus = JSON.parse(await readFile("content/corpus.json", "utf8"));
await mkdir("public/media", { recursive: true });
const manifest = [];
const resolutionExceptions = JSON.parse(
  await readFile("content/media-resolution-exceptions.json", "utf8"),
);
for (const item of gallery) {
  if (!corpus.media.some((m) => m.id === item.id)) continue;
  if (item.rights_status !== "reuse-with-credit")
    throw new Error(`Rights not cleared: ${item.id}`);
  const input = path.resolve(item.local_path);
  if (!input.startsWith(path.resolve("research/media") + path.sep))
    throw new Error("Invalid media path");
  const bytes = await readFile(input);
  if (createHash("sha256").update(bytes).digest("hex") !== item.sha256)
    throw new Error(`Hash mismatch: ${item.id}`);
  const original = await sharp(bytes).metadata();
  const exception = resolutionExceptions[item.id];
  const approvedNativeSize =
    exception &&
    exception.width === original.width &&
    exception.height === original.height;
  if (
    !approvedNativeSize &&
    (Math.max(original.width, original.height) < 1200 ||
      Math.min(original.width, original.height) < 800)
  )
    throw new Error(`Source below minimum resolution: ${item.id}`);
  const output = `public/media/${item.id}.webp`;
  await sharp(bytes)
    .rotate()
    .resize({
      width: 1800,
      height: 1800,
      fit: "inside",
      withoutEnlargement: true,
    })
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
    license: item.license,
    ...(item.usageRestriction
      ? { usageRestriction: item.usageRestriction }
      : {}),
    licenseUrl: item.license_url,
    ...(exception ? { resolutionException: exception.reason } : {}),
    width: meta.width,
    height: meta.height,
    originalSha256: item.sha256,
    originalWidth: original.width,
    originalHeight: original.height,
    sha256: createHash("sha256").update(derivative).digest("hex"),
    bytes: derivative.length,
    changes:
      "WebP conversion; reduced to fit 1800px; EXIF orientation applied; metadata removed; no enlargement or generative modification",
  });
  const media = corpus.media.find((m) => m.id === item.id);
  media.width = meta.width;
  media.height = meta.height;
}
await writeFile("content/corpus.json", JSON.stringify(corpus, null, 2) + "\n");
await writeFile(
  "content/media-licenses.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Optimized ${manifest.length} approved images; ${manifest.reduce((n, m) => n + m.bytes, 0)} total bytes.`,
);
