import test from "node:test";
import assert from "node:assert/strict";
import {
  instant,
  normalize,
  deduplicate,
  parseIcal,
  parseJsonLd,
  refresh,
  boundedFetch,
} from "../scripts/agenda.mjs";
const source = "https://www.amb.cat/agenda";
const event = {
  id: "fixture-only",
  title: { ca: "Prova fictícia", es: "Prueba ficticia" },
  start: "2026-10-18T12:00:00",
  end: "2026-10-18T13:00:00",
};
test("Madrid switches offset between October Sundays", () => {
  assert.equal(instant(event.start).value, "2026-10-18T10:00:00Z");
  assert.equal(instant("2026-10-25T12:00:00").value, "2026-10-25T11:00:00Z");
});
test("reject ambiguous and nonexistent local clock times", () => {
  assert.throws(() => instant("2026-10-25T02:30:00"));
  assert.throws(() => instant("2026-03-29T02:30:00"));
});
test("all-day dates remain dates", () =>
  assert.deepEqual(instant("2026-10-18"), {
    value: "2026-10-18",
    allDay: true,
  }));
test("deduplicate UID and preserve newer cancellation over stale response", () => {
  const a = normalize(event, source),
    b = { ...a, sequence: 2, status: "cancelled" };
  assert.deepEqual(deduplicate([b, a, a]), [b]);
});
test("malformed end and untrusted URLs rejected", () => {
  assert.throws(() =>
    normalize({ ...event, end: "2026-10-17T12:00:00" }, source),
  );
  assert.throws(() => normalize(event, "https://example.com"));
});
test("ical folded titles, timezone and cancellation", () => {
  const [result] = parseIcal(
    "BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:fixture\nSUMMARY:Prova\n  fictícia\nDTSTART;TZID=Europe/Madrid:20261025T120000\nDTEND;TZID=Europe/Madrid:20261025T130000\nSTATUS:CANCELLED\nSEQUENCE:2\nEND:VEVENT\nEND:VCALENDAR",
    source,
  );
  assert.equal(result.status, "cancelled");
  assert.equal(result.start, "2026-10-25T11:00:00Z");
  assert.equal(result.title.ca, "Prova fictícia");
});
test("reject unsupported recurrence instead of losing instances", () =>
  assert.throws(() =>
    parseIcal(
      "BEGIN:VCALENDAR\nBEGIN:VEVENT\nRRULE:FREQ=WEEKLY\nEND:VEVENT\nEND:VCALENDAR",
      source,
    ),
  ));
test("JSON-LD graph event parser", () => {
  const data = {
    "@graph": [
      {
        "@type": "Event",
        name: "Fictici",
        startDate: event.start,
        url: source,
      },
    ],
  };
  assert.equal(
    parseJsonLd(
      `<script type="application/ld+json">${JSON.stringify(data)}</script>`,
      source,
    ).length,
    1,
  );
});
test("403, timeout, empty and malformed responses preserve original snapshot", async () => {
  const previous = { checkedAt: "old", events: [normalize(event, source)] };
  const before = JSON.stringify(previous);
  for (const mock of [
    async () => new Response("Forbidden", { status: 403 }),
    async () => {
      throw new Error("timeout");
    },
    async () => new Response("<html>changed</html>"),
  ]) {
    await assert.rejects(
      refresh(previous, [{ url: source, format: "jsonld" }], mock),
    );
    assert.equal(JSON.stringify(previous), before);
  }
  await assert.rejects(refresh(previous, []));
});
test("bounded requests and body size", async () => {
  await assert.rejects(refresh({ events: [] }, Array(9).fill({ url: source })));
  await assert.rejects(
    boundedFetch(
      source,
      async () =>
        new Response("x", { headers: { "content-length": "1000001" } }),
    ),
  );
});
test("valid refresh merges retained events and updates timestamp", async () => {
  const ics =
    "BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:new-fixture\nLOCATION:Parc de Can Solei\nSUMMARY:Prova\nDTSTART:20261025T120000Z\nEND:VEVENT\nEND:VCALENDAR";
  const result = await refresh(
    { events: [normalize(event, source)] },
    [{ url: source, format: "ical" }],
    async () => new Response(ics),
    new Date("2026-10-12T12:00:00Z"),
  );
  assert.equal(result.events.length, 2);
  assert.equal(result.checkedAt, "2026-10-12T12:00:00.000Z");
});
test("provisional seed and official UID collapse by normalized title and instant", () => {
  const a = normalize(event, source);
  const b = {
    ...a,
    id: "official-uid",
    start: "2026-10-18T12:00:00+02:00",
    sequence: 1,
  };
  assert.equal(deduplicate([a, b]).length, 1);
});

test("equal-version updates do not silently resurrect a cancellation", () => {
  const cancelled = { ...normalize(event, source), status: "cancelled" };
  assert.equal(
    deduplicate([cancelled, { ...cancelled, status: "scheduled" }])[0].status,
    "cancelled",
  );
});
test("unrelated venues and missing locations cannot replace the park snapshot", async () => {
  for (const location of ["", "LOCATION:Parc de Montjuïc\n"]) {
    const body = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nUID:other\n${location}SUMMARY:Prova\nDTSTART:20261025T120000Z\nEND:VEVENT\nEND:VCALENDAR`;
    await assert.rejects(
      refresh(
        { events: [] },
        [{ url: source, format: "ical" }],
        async () => new Response(body),
      ),
    );
  }
});
