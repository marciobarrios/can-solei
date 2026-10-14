"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, ExternalLink, Search, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Corpus, Lang } from "@/lib/types";
export function ParkMap({
  corpus,
  lang,
}: {
  corpus: Pick<Corpus, "places" | "sources">;
  lang: Lang;
}) {
  const es = lang === "es";
  const [filter, setFilter] = useState("heritage");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(corpus.places[0]?.id ?? "");
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    let frame = 0;
    const selectLinkedPlace = () => {
      const id = window.location.hash.slice(6);
      if (
        !window.location.hash.startsWith("#mapa-") ||
        !corpus.places.some((p) => p.id === id)
      )
        return;
      setFilter("all");
      setQuery("");
      setSelected(id);
      frame = requestAnimationFrame(() => {
        const detail = document.getElementById("map-place-detail");
        detail?.focus({ preventScroll: true });
        detail?.scrollIntoView({ block: "center" });
      });
    };
    const repeatLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor =
        event.target.closest<HTMLAnchorElement>('a[href^="#mapa-"]');
      if (anchor && anchor.hash === window.location.hash) selectLinkedPlace();
    };
    frame = requestAnimationFrame(selectLinkedPlace);
    window.addEventListener("hashchange", selectLinkedPlace);
    document.addEventListener("click", repeatLink);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", selectLinkedPlace);
      document.removeEventListener("click", repeatLink);
    };
  }, [corpus.places]);
  const labels = {
    all: es ? "Todos" : "Tots",
    heritage: es ? "Patrimonio" : "Patrimoni",
    nature: es ? "Naturaleza" : "Natura",
    school: es ? "Escuelas" : "Escoles",
  };
  const places = corpus.places.filter(
    (p) =>
      (filter === "all" || p.category === filter) &&
      p.name[lang]
        .toLocaleLowerCase(lang)
        .includes(query.toLocaleLowerCase(lang)),
  );
  const active = places.find((p) => p.id === selected) ?? places[0];
  return (
    <div className="explorer">
      <div className="map-controls">
        <div
          className="filter-group"
          role="group"
          aria-label={es ? "Filtrar lugares" : "Filtrar llocs"}
        >
          {Object.entries(labels).map(([value, label]) => (
            <Button
              variant="ghost"
              key={value}
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
            >
              {label}
            </Button>
          ))}
        </div>
        <label className="search">
          <Search size={18} />
          <span className="sr-only">{es ? "Buscar lugar" : "Cercar lloc"}</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={es ? "Buscar un rincón…" : "Cercar un racó…"}
          />
        </label>
      </div>
      <div className="map-toolbar">
        <p>
          {es
            ? "Plano de referencia de 2014. Posiciones orientativas sobre el documento."
            : "Plànol de referència de 2014. Posicions orientatives sobre el document."}
        </p>
        <Button
          variant="outline"
          onClick={() => setZoom(!zoom)}
          aria-pressed={zoom}
        >
          {zoom ? <ZoomOut size={16} /> : <ZoomIn size={16} />}{" "}
          {zoom ? (es ? "Reducir" : "Reduir") : es ? "Ampliar" : "Ampliar"}
        </Button>
      </div>
      <div className="map-layout">
        <div
          className="map-stage"
          role="region"
          tabIndex={0}
          aria-label={
            es
              ? "Plano desplazable con teclado; lista equivalente a continuación"
              : "Plànol desplaçable amb teclat; llista equivalent a continuació"
          }
        >
          <div className={`map-canvas ${zoom ? "zoomed" : ""}`}>
            <Image
              src="/media/amb-botanical-map.webp"
              width={1600}
              height={1136}
              alt={
                es
                  ? "Plano botánico AMB de 2014 con las dos fincas, edificios y veinticinco árboles. Todos los puntos seleccionables aparecen en la lista."
                  : "Plànol botànic AMB de 2014 amb les dues finques, edificis i vint-i-cinc arbres. Tots els punts seleccionables apareixen a la llista."
              }
              className="map-document"
            />
            {places.map((p) => (
              <button
                key={p.id}
                className={`map-pin ${active?.id === p.id ? "is-active" : ""}`}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                aria-label={p.name[lang]}
                aria-pressed={active?.id === p.id}
                onClick={() => setSelected(p.id)}
              >
                <MapPin size={18} />
                <span>{p.name[lang]}</span>
              </button>
            ))}
          </div>
        </div>
        <aside
          className="map-details"
          aria-label={
            es ? "Lista accesible de lugares" : "Llista accessible de llocs"
          }
        >
          <p className="result-count" aria-live="polite">
            {places.length} {es ? "lugares" : "llocs"}
          </p>
          <div className="place-list">
            {places.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                aria-pressed={active?.id === p.id}
              >
                {p.name[lang]}
                <span>{p.estate === "solei" ? "Can Solei" : "Ca l’Arnús"}</span>
              </button>
            ))}
          </div>
          {!active ? (
            <p>
              {es
                ? "No hay coincidencias. Prueba otro nombre o filtro."
                : "No hi ha coincidències. Prova un altre nom o filtre."}
            </p>
          ) : (
            <article
              id="map-place-detail"
              tabIndex={-1}
              className="place-detail scroll-mt-28"
              aria-live="polite"
            >
              <h3>{active.name[lang]}</h3>
              <p>{active.detail[lang]}</p>
              <div className="source-links">
                {active.sources.map((id) => {
                  const s = corpus.sources.find((s) => s.id === id);
                  return s ? (
                    <a key={id} href={s.url} target="_blank" rel="noreferrer">
                      {s.publisher}
                      <ExternalLink size={12} />
                    </a>
                  ) : null;
                })}
              </div>
              {active.coordinates && (
                <a
                  className="text-link"
                  href={`https://www.openstreetmap.org/?mlat=${active.coordinates[0]}&mlon=${active.coordinates[1]}#map=18/${active.coordinates[0]}/${active.coordinates[1]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {es
                    ? "Coordenada del dossier de 2014 en OpenStreetMap"
                    : "Coordenada del dossier de 2014 a OpenStreetMap"}
                  <ExternalLink size={14} />
                </a>
              )}
            </article>
          )}
        </aside>
      </div>
      <p className="map-credit">
        Trimatge / AMB, 2014 ·{" "}
        <a
          href="https://www.amb.cat/s/web/amb/avis-legal.html"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>{" "}
        ·{" "}
        {es
          ? "Conversión WebP y marcadores añadidos. Accesos y servicios actuales no verificados."
          : "Conversió WebP i marcadors afegits. Accessos i serveis actuals no verificats."}
      </p>
    </div>
  );
}
