import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { format } from "prettier";

// Run locally after curating originals. Normal site builds only copy these files.
const corpus = JSON.parse(await readFile("content/corpus.json", "utf8"));
const licenses = JSON.parse(
  await readFile("content/media-licenses.json", "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
await mkdir("public/media/previews", { recursive: true });

for (const media of corpus.media.filter((item) => item.image)) {
  const license = licenses.find((item) => item.path === media.image);
  const input = await readFile(`public${media.image}`);
  if (!license || hash(input) !== license.sha256)
    throw new Error(`Missing or stale audited original: ${media.id}`);
  const widths = [
    ...new Set([480, 800, 1200].map((width) => Math.min(width, license.width))),
  ];
  const previews = [];
  for (const format of ["avif", "webp"]) {
    for (const width of widths) {
      const { data, info } = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality: format === "avif" ? 60 : 80 })
        .toBuffer({ resolveWithObject: true });
      const path = `/media/previews/${media.id}-${width}.${format}`;
      await writeFile(`public${path}`, data);
      previews.push({
        path,
        width: info.width,
        height: info.height,
        bytes: data.length,
        sha256: hash(data),
      });
    }
  }
  // Derivatives inherit the parent entry's author, source, license and restrictions.
  license.previews = {
    sourceSha256: license.sha256,
    changes:
      "Resized from published WebP without cropping or enlargement; AVIF quality 60 / WebP quality 80; metadata removed",
    files: previews,
  };
  media.preview = {
    src: previews.find((item) => item.path.endsWith(".webp")).path,
    avif: previews
      .filter((item) => item.path.endsWith(".avif"))
      .map((item) => `${item.path} ${item.width}w`)
      .join(", "),
    webp: previews
      .filter((item) => item.path.endsWith(".webp"))
      .map((item) => `${item.path} ${item.width}w`)
      .join(", "),
  };
}
await writeFile(
  "content/corpus.json",
  await format(JSON.stringify(corpus), { parser: "json" }),
);
await writeFile(
  "content/media-licenses.json",
  await format(JSON.stringify(licenses), { parser: "json" }),
);
console.log(
  `Generated static previews for ${licenses.filter((item) => item.previews).length} images.`,
);
