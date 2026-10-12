import { Temporal } from "@js-temporal/polyfill";

export const TIME_ZONE = "Europe/Madrid";
const OFFICIAL_HOSTS = new Set([
  "www.amb.cat",
  "amb.cat",
  "www.badalona.cat",
  "badalona.cat",
  "www.badalona.cat",
]);
export function officialUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !OFFICIAL_HOSTS.has(url.hostname) ||
    url.username ||
    url.password
  )
    throw new Error("Unofficial source");
  return url.href;
}
export function instant(value, zone = TIME_ZONE) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return { value, allDay: true };
  if (/([zZ]|[+-]\d{2}:\d{2})$/.test(value))
    return { value: Temporal.Instant.from(value).toString(), allDay: false };
  if (zone !== TIME_ZONE) throw new Error("Unsupported time zone");
  return {
    value: Temporal.PlainDateTime.from(value)
      .toZonedDateTime(zone, { disambiguation: "reject" })
      .toInstant()
      .toString(),
    allDay: false,
  };
}
export function normalize(raw, sourceUrl) {
  const start = instant(raw.start, raw.timeZone);
  const end = raw.end ? instant(raw.end, raw.timeZone) : null;
  if (!raw.id || !raw.title?.ca || !raw.title?.es)
    throw new Error("Incomplete event");
  if (end && (end.allDay !== start.allDay || end.value < start.value))
    throw new Error("Invalid end");
  if (
    raw.status &&
    !["scheduled", "cancelled", "postponed"].includes(raw.status)
  )
    throw new Error("Unknown status");
  return {
    id: String(raw.id),
    title: raw.title,
    start: start.value,
    end: end?.value ?? null,
    allDay: start.allDay,
    timeZone: TIME_ZONE,
    status: raw.status ?? "scheduled",
    url: officialUrl(raw.url ?? sourceUrl),
    source: officialUrl(sourceUrl),
    updated: raw.updated ?? null,
    sequence: Number(raw.sequence ?? 0),
    location: raw.location ?? "",
    category: raw.category ?? "nature",
  };
}
export function deduplicate(events) {
  const rows = [];
  const canonical = (event) =>
    `${event.title.ca
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")}|${instant(event.start).value}`;
  for (const event of events) {
    const at = rows.findIndex(
      (previous) =>
        previous.id === event.id || canonical(previous) === canonical(event),
    );
    if (at < 0) {
      rows.push(event);
      continue;
    }
    const previous = rows[at];
    if (
      event.sequence > previous.sequence ||
      (event.sequence === previous.sequence &&
        ((event.updated ?? "") > (previous.updated ?? "") ||
          ((event.updated ?? "") === (previous.updated ?? "") &&
            (previous.status !== "cancelled" || event.status === "cancelled"))))
    ) {
      // Preserve curated translation when a machine source supplies only the original name.
      rows[at] = {
        ...event,
        title:
          event.title.es === event.title.ca &&
          previous.title.ca === event.title.ca
            ? previous.title
            : event.title,
      };
    }
  }
  return rows.sort(
    (a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id),
  );
}
function icalDate(value) {
  if (/^\d{8}$/.test(value))
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  if (!/^\d{8}T\d{6}Z?$/.test(value)) throw new Error("Unsupported iCal date");
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}${value.endsWith("Z") ? "Z" : ""}`;
}
const unescapeText = (value) =>
  value.replace(/\\n/gi, "\n").replace(/\\([,;\\])/g, "$1");
export function parseIcal(text, sourceUrl) {
  if (!text.includes("BEGIN:VCALENDAR") || !text.includes("END:VCALENDAR"))
    throw new Error("Invalid iCalendar");
  const blocks = [
    ...text
      .replace(/\r?\n[ \t]/g, "")
      .matchAll(/BEGIN:VEVENT\r?\n([\s\S]*?)END:VEVENT/g),
  ];
  return blocks.map(([, block]) => {
    const fields = {};
    const zones = {};
    for (const line of block.trim().split(/\r?\n/)) {
      const colon = line.indexOf(":");
      if (colon < 0) continue;
      const [key, ...params] = line.slice(0, colon).split(";");
      fields[key] = line.slice(colon + 1);
      zones[key] = params.find((p) => p.startsWith("TZID="))?.slice(5);
    }
    if (fields.RRULE || fields["RECURRENCE-ID"])
      throw new Error("Recurring iCal requires explicit expansion and review");
    if (!fields.DTSTART || !fields.SUMMARY || !fields.UID)
      throw new Error("Incomplete iCal event");
    const title = unescapeText(fields.SUMMARY);
    return normalize(
      {
        id: fields.UID,
        title: { ca: title, es: title },
        start: icalDate(fields.DTSTART),
        end: fields.DTEND ? icalDate(fields.DTEND) : null,
        timeZone: zones.DTSTART,
        status:
          fields.STATUS === "CANCELLED"
            ? "cancelled"
            : fields.STATUS === "TENTATIVE"
              ? "postponed"
              : "scheduled",
        url: fields.URL,
        location: fields.LOCATION ? unescapeText(fields.LOCATION) : undefined,
        sequence: fields.SEQUENCE,
        updated: fields["LAST-MODIFIED"]
          ? instant(icalDate(fields["LAST-MODIFIED"])).value
          : null,
      },
      sourceUrl,
    );
  });
}
export function parseJsonLd(html, sourceUrl) {
  const scripts = [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const nodes = [];
  function visit(node) {
    if (Array.isArray(node)) node.forEach(visit);
    else if (node && typeof node === "object") {
      if ([node["@type"]].flat().some((t) => String(t).endsWith("Event")))
        nodes.push(node);
      if (node["@graph"]) visit(node["@graph"]);
    }
  }
  scripts.forEach(([, body]) => visit(JSON.parse(body)));
  if (!nodes.length)
    throw new Error("No supported event data; keep last valid result");
  return nodes.map((e) =>
    normalize(
      {
        id: e["@id"] ?? e.url ?? `${sourceUrl}#${e.startDate}`,
        title: typeof e.name === "string" ? { ca: e.name, es: e.name } : e.name,
        start: e.startDate,
        end: e.endDate,
        url: e.url,
        status: String(e.eventStatus).endsWith("EventCancelled")
          ? "cancelled"
          : String(e.eventStatus).endsWith("EventPostponed")
            ? "postponed"
            : "scheduled",
        location: e.location?.name,
      },
      sourceUrl,
    ),
  );
}
export async function boundedFetch(url, fetcher = fetch) {
  officialUrl(url);
  const response = await fetcher(url, {
    redirect: "error",
    signal: AbortSignal.timeout(10000),
    headers: {
      Accept: "text/calendar,text/html,application/ld+json",
      "User-Agent": "can-solei-research/0.1 (bounded official agenda check)",
    },
  });
  if (!response.ok) throw new Error(`Official source HTTP ${response.status}`);
  if (Number(response.headers.get("content-length")) > 1_000_000)
    throw new Error("Response too large");
  const reader = response.body.getReader();
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 1_000_000) throw new Error("Response too large");
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
export async function refresh(
  previous,
  sources,
  fetcher = fetch,
  now = new Date(),
) {
  if (sources.length > 8)
    throw new Error("Maximum eight official requests per refresh");
  const next = [];
  // Transactional snapshot: any failure leaves the entire last valid snapshot intact.
  for (const source of sources) {
    if (!["ical", "jsonld"].includes(source.format))
      throw new Error("Unsupported source format");
    const body = await boundedFetch(source.url, fetcher);
    next.push(
      ...(source.format === "ical"
        ? parseIcal(body, source.url)
        : parseJsonLd(body, source.url)
      ).filter((event) => /can solei|ca l[’' ]?arn[uú]s/i.test(event.location)),
    );
  }
  if (!sources.length || !next.length)
    throw new Error("Empty update requires editorial confirmation");
  return {
    ...previous,
    checkedAt: now.toISOString(),
    mode: "official-ingestion",
    events: deduplicate([...previous.events, ...next]),
  };
}
