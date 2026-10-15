import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";
const content = JSON.parse(readFileSync("content/corpus.json", "utf8"));
const agenda = JSON.parse(readFileSync("content/agenda.json", "utf8"));
const licenses = JSON.parse(
  readFileSync("content/media-licenses.json", "utf8"),
);
const resolutionExceptions = JSON.parse(
  readFileSync("content/media-resolution-exceptions.json", "utf8"),
);
test("editorial corpus integrated; stable unique source identities", () => {
  assert.ok(content.sources.length >= 75);
  assert.equal(
    new Set(content.sources.map((s) => s.id)).size,
    content.sources.length,
  );
  assert.equal(content.history.length, 20);
  assert.equal(content.schools.length, 2);
  assert.equal(
    content.places.filter((p) => p.id.startsWith("tree-")).length,
    25,
  );
});
test("every localized field has equivalent nonempty ca and es keys", () => {
  function walk(o) {
    if (o && typeof o === "object") {
      if ("ca" in o || "es" in o) {
        assert.equal(typeof o.ca, "string");
        assert.equal(typeof o.es, "string");
        assert.ok(o.ca.trim());
        assert.ok(o.es.trim());
      }
      Object.values(o).forEach(walk);
    }
  }
  walk(content);
  walk(agenda);
});
test("all claims and media resolve source references", () => {
  const ids = new Set(content.sources.map((s) => s.id));
  for (const item of [
    ...content.places,
    ...content.history,
    ...content.curiosities,
    ...content.future,
    ...content.schools.flatMap((s) => s.milestones),
  ]) {
    assert.ok(item.sources.length);
    item.sources.forEach((id) => assert.ok(ids.has(id), id));
  }
  content.media.forEach((m) => assert.ok(ids.has(m.source)));
});
test("school foundations, relocation and proposal distinctions retained", () => {
  const text = JSON.stringify(content);
  for (const date of ["1969", "1986", "2007-03-28", "1930-11", "2010", "2014"])
    assert.ok(text.includes(date));
  assert.ok(
    content.future
      .find((m) => m.title.es === "Un expediente de protección")
      .text.es.includes("no se ha confirmado"),
  );
  assert.ok(
    content.future
      .find((m) => m.title.es === "PA-3, calle de Sant Bru 205")
      .text.es.includes("no se acredita la finalización"),
  );
});
test("no unverified GPS for buildings and no research paths in public content", () => {
  content.places
    .filter((p) => !p.id.startsWith("tree-"))
    .forEach((p) => assert.equal(p.coordinates, undefined));
  assert.ok(!JSON.stringify(content).includes("/workspace/"));
  assert.ok(!JSON.stringify(content).includes("research/"));
});
test("published media have audited license, matching bytes, dimensions and credits", async () => {
  const used = content.media.filter((m) => m.image);
  assert.equal(used.length, 14);
  for (const m of used) {
    const l = licenses.find((l) => l.path === m.image);
    assert.ok(l?.author);
    assert.ok(
      [
        "CC BY 4.0",
        "CC BY-SA 4.0",
        "CC BY-NC-SA 2.0",
        "Public domain",
      ].includes(l.license),
    );
    if (m.id.startsWith("museu-")) {
      assert.equal(l.license, "CC BY-NC-SA 2.0");
      assert.ok(l.usageRestriction.includes("Noncommercial"));
      assert.ok(m.license.es.includes("uso no comercial"));
      assert.equal(m.licenseUrl, l.licenseUrl);
    }
    assert.ok(l.licenseUrl.startsWith("https:"));
    const b = readFileSync("public" + m.image);
    assert.equal(createHash("sha256").update(b).digest("hex"), l.sha256);
    const actual = await sharp(b).metadata();
    assert.equal(actual.width, m.width);
    assert.equal(actual.height, m.height);
    assert.equal(actual.width, l.width);
    assert.equal(actual.height, l.height);
    const exception = resolutionExceptions[m.id];
    if (exception) {
      assert.equal(actual.width, exception.width);
      assert.equal(actual.height, exception.height);
      assert.equal(l.originalWidth, actual.width);
      assert.equal(l.originalHeight, actual.height);
      assert.equal(l.resolutionException, exception.reason);
    } else {
      assert.ok(Math.max(actual.width, actual.height) >= 1200, m.id);
      assert.ok(Math.min(actual.width, actual.height) >= 800, m.id);
    }
    assert.ok(
      Math.max(l.originalWidth, l.originalHeight) >=
        Math.max(l.width, l.height),
    );
  }
  assert.equal(
    readdirSync("public/media").filter((file) => file.endsWith(".webp")).length,
    used.length,
  );
  assert.ok(!existsSync("public/research"));
});
test("static previews match their audited parents and responsive candidates", async () => {
  const files = [];
  for (const media of content.media.filter((item) => item.image)) {
    const license = licenses.find((item) => item.path === media.image);
    assert.equal(license.previews.sourceSha256, license.sha256);
    assert.ok(media.preview.src.endsWith(".webp"));
    for (const format of ["avif", "webp"]) {
      const candidates = license.previews.files.filter((file) =>
        file.path.endsWith(`.${format}`),
      );
      assert.equal(
        media.preview[format],
        candidates.map((file) => `${file.path} ${file.width}w`).join(", "),
      );
      for (const file of candidates) {
        const bytes = readFileSync(`public${file.path}`);
        const meta = await sharp(bytes).metadata();
        assert.equal(hash(bytes), file.sha256);
        assert.equal(bytes.length, file.bytes);
        assert.equal(meta.width, file.width);
        assert.equal(meta.height, file.height);
        assert.ok(file.width <= license.width);
        assert.ok(
          Math.abs(
            file.height - (file.width * license.height) / license.width,
          ) <= 1,
        );
        assert.ok(file.bytes < license.bytes);
        files.push(file.path.split("/").pop());
      }
    }
    assert.ok(
      license.previews.files.some((file) => file.path === media.preview.src),
    );
  }
  assert.deepEqual(readdirSync("public/media/previews").sort(), files.sort());
});
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
test("eight real editorial sessions, seven future on research date; simulation absent", () => {
  assert.equal(agenda.events.length, 8);
  assert.equal(
    agenda.events.filter(
      (e) => Date.parse(e.start) > Date.parse("2026-10-12T12:00:00Z"),
    ).length,
    7,
  );
  assert.equal(agenda.automaticIngestionEnabled, false);
  assert.ok(!JSON.stringify(agenda).includes("fixture"));
  agenda.events.forEach((e) => {
    assert.ok(e.url.startsWith("https://www.amb.cat/"));
    assert.equal(
      new Intl.DateTimeFormat("es", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(e.start)),
      "12:00",
    );
  });
});
test("research excluded and no production cron configured", () => {
  assert.ok(
    readFileSync(".gitignore", "utf8").split("\n").includes("research/"),
  );
  assert.ok(!existsSync("vercel.json"));
  assert.equal(readdirSync(".github/workflows").length, 1);
});
