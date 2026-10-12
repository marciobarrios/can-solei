import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { refresh } from "./agenda.mjs";
const path = "content/agenda.json";
try {
  const previous = JSON.parse(await readFile(path, "utf8"));
  const sources = JSON.parse(
    await readFile("content/agenda-sources.json", "utf8"),
  );
  const next = await refresh(previous, sources);
  await mkdir("research/evidence", { recursive: true });
  await writeFile(
    "research/evidence/agenda-latest.json",
    JSON.stringify(next, null, 2) + "\n",
  );
  await writeFile(path + ".tmp", JSON.stringify(next, null, 2) + "\n");
  await rename(path + ".tmp", path);
  console.log(
    `Validated ${next.events.length} events. Rebuild required; no deployment triggered.`,
  );
} catch (error) {
  console.error(`Agenda unchanged: ${error.message}`);
  process.exitCode = 1;
}
