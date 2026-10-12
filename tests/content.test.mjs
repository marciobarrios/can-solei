import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
const content = JSON.parse(readFileSync("content/corpus.json", "utf8"));
const agenda = JSON.parse(readFileSync("content/agenda.json", "utf8"));
const licenses = JSON.parse(
  readFileSync("content/media-licenses.json", "utf8"),
);
test("editorial corpus integrated; stable unique source identities", () => {
  assert.ok(content.sources.length >= 75);
  assert.equal(
    new Set(content.sources.map((s) => s.id)).size,
    content.sources.length,
  );
  assert.equal(content.history.length, 21);
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
test("published media have audited license, matching bytes, dimensions and credits", () => {
  const used = content.media.filter((m) => m.image);
  assert.equal(used.length, 10);
  for (const m of used) {
    const l = licenses.find((l) => l.path === m.image);
    assert.ok(l?.author);
    assert.equal(l.license, "CC BY 4.0");
    assert.ok(l.licenseUrl.startsWith("https:"));
    const b = readFileSync("public" + m.image);
    assert.equal(createHash("sha256").update(b).digest("hex"), l.sha256);
    assert.ok(l.width > 0 && l.height > 0);
  }
  assert.equal(readdirSync("public/media").length, used.length);
  assert.ok(!existsSync("public/research"));
});
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
