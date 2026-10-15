"use client";
import { useState, useSyncExternalStore } from "react";
import { ArrowDown, CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agenda, Lang } from "@/lib/types";
const subscribe = (notify: () => void) => {
  const timer = setInterval(notify, 60000);
  return () => clearInterval(timer);
};
const getNow = () => Math.floor(Date.now() / 60000) * 60000;
export function HeroBadge({
  agenda,
  lang,
  referenceNow,
}: {
  agenda: Agenda;
  lang: Lang;
  referenceNow: number;
}) {
  const es = lang === "es";
  const now = useSyncExternalStore(subscribe, getNow, () => referenceNow);
  const event = agenda.events
    .filter((event) => event.status === "scheduled" && Date.parse(event.start) >= now)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];

  if (!event) {
    return (
      <a href="#recorregut" className="art-badge">
        <ArrowDown size={22} aria-hidden="true" />
        <span>{es ? "Pasea por sus historias" : "Passeja per les seves històries"}</span>
      </a>
    );
  }

  const date = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Madrid",
  }).format(new Date(event.start));
  const formatTime = (value: string) =>
    new Intl.DateTimeFormat(lang, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    }).format(new Date(value));
  const time = event.allDay
    ? es ? "Todo el día" : "Tot el dia"
    : event.end
      ? `${formatTime(event.start)} – ${formatTime(event.end)}`
      : `${es ? "a las" : "a les"} ${formatTime(event.start)}`;

  return (
    <a
      href="#agenda"
      className="art-badge max-w-[calc(100%-24px)]"
      aria-label={`${es ? "Ver agenda: próxima actividad" : "Veure agenda: propera activitat"}, ${event.title[lang]}, ${date}, ${time}`}
    >
      <span className="min-w-0 max-w-[240px]!">
        <span className="block max-w-none! text-[10px] font-semibold tracking-[0.1em] opacity-70 uppercase">
          {es ? "Próxima actividad" : "Propera activitat"}
        </span>
        <span className="mt-1.5 block max-w-none! text-base font-semibold text-pretty">
          {event.title[lang]}
        </span>
        <span className="mt-2 flex max-w-none! items-center gap-3">
          <CalendarDays size={26} strokeWidth={1.5} className="shrink-0" aria-hidden="true" />
          <time dateTime={event.start} className="min-w-0">
            <span className="block max-w-none! text-[14px] font-normal">{date}</span>{" "}
            <span className="block max-w-none! text-[12px] opacity-70">{time}</span>
          </time>
        </span>
      </span>
    </a>
  );
}

export function AgendaPanel({
  agenda,
  lang,
  referenceNow,
}: {
  agenda: Agenda;
  lang: Lang;
  referenceNow: number;
}) {
  const es = lang === "es";
  const [filter, setFilter] = useState("upcoming");
  const now = useSyncExternalStore(subscribe, getNow, () => referenceNow);
  const events = agenda.events.filter((e) => {
    const past = Date.parse(e.end ?? e.start) < now;
    return (
      filter === "all" ||
      (filter === "upcoming" && !past) ||
      (filter === "past" && past) ||
      (filter === "cancelled" && e.status === "cancelled")
    );
  });
  const date = (value: string) =>
    new Intl.DateTimeFormat(es ? "es-ES" : "ca-ES", {
      day: "numeric",
      month: "long",
      timeZone: "Europe/Madrid",
    }).format(new Date(value.length === 10 ? value + "T12:00:00Z" : value));
  const time = (value: string) =>
    new Intl.DateTimeFormat(lang, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Madrid",
    }).format(new Date(value));
  return (
    <>
      <div className="agenda-heading">
        <div>
          <h2>{es ? "El próximo paseo" : "La propera passejada"}</h2>
          <p>
            {es
              ? "Actividades para mirar el parque de otra manera."
              : "Activitats per mirar el parc d’una altra manera."}
          </p>
        </div>
        <CalendarDays size={42} strokeWidth={1} />
      </div>
      <div className="agenda-status">
        <span className="status-dot" />
        <p>
          {es
            ? "Selección de actividades de la AMB"
            : "Selecció d’activitats de l’AMB"}
          {agenda.checkedAt ? ` · ${date(agenda.checkedAt)}` : ""}.{" "}
          {es
            ? "La sincronización automática aún no está activada. Confirma cambios en la ficha oficial."
            : "La sincronització automàtica encara no està activada. Confirma canvis a la fitxa oficial."}
        </p>
      </div>
      {agenda.checkedAt &&
      now - Date.parse(agenda.checkedAt) > 14 * 86400000 ? (
        <p className="stale-notice">
          {es
            ? "La selección lleva más de dos semanas sin comprobarse. Consulta la agenda oficial."
            : "La selecció fa més de dues setmanes que no es comprova. Consulta l’agenda oficial."}
        </p>
      ) : null}
      <div
        className="filter-group agenda-filters"
        role="group"
        aria-label={es ? "Filtrar agenda" : "Filtrar agenda"}
      >
        {[
          ["upcoming", es ? "Próximas" : "Properes"],
          ["past", es ? "Archivo" : "Arxiu"],
          ["cancelled", es ? "Canceladas" : "Cancel·lades"],
          ["all", es ? "Todas" : "Totes"],
        ].map(([key, label]) => (
          <Button
            variant="ghost"
            key={key}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="events" aria-live="polite">
        {events.length ? (
          events.map((e) => (
            <article className="event" key={e.id}>
              <time dateTime={e.start}>
                {date(e.start)}
                <span>
                  {e.allDay
                    ? es
                      ? "Todo el día"
                      : "Tot el dia"
                    : `${time(e.start)}${e.end ? " – " + time(e.end) : ""}`}
                </span>
              </time>
              <div>
                <h3>{e.title[lang]}</h3>
                <p>{e.location}</p>
                {e.description ? (
                  <p className="mt-3! max-w-prose text-sm! leading-relaxed">
                    {e.description[lang]}
                  </p>
                ) : null}
                {e.program ? (
                  <div className="mt-3 max-w-prose">
                    <a
                      href={e.program.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold underline decoration-current/40 underline-offset-4 hover:decoration-current"
                    >
                      {e.program.name[lang]}
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                    <p className="text-sm! leading-relaxed">
                      {e.program.description[lang]}
                    </p>
                  </div>
                ) : null}
                {e.status !== "scheduled" && (
                  <strong className="event-status">
                    {e.status === "cancelled"
                      ? es
                        ? "Cancelada"
                        : "Cancel·lada"
                      : es
                        ? "Aplazada; fecha por confirmar"
                        : "Ajornada; data per confirmar"}
                  </strong>
                )}
              </div>
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${es ? "Ficha oficial" : "Fitxa oficial"}: ${e.title[lang]}`}
              >
                <span>{es ? "Ficha oficial" : "Fitxa oficial"}</span>
                <ExternalLink size={18} />
              </a>
            </article>
          ))
        ) : (
          <p className="empty">
            {es
              ? "No hay actividades en esta selección. Consulta las fuentes oficiales antes de planear tu visita."
              : "No hi ha activitats en aquesta selecció. Consulta les fonts oficials abans de planificar la visita."}
          </p>
        )}
      </div>
      <p className="fine-print">
        {es
          ? "Horas de Badalona (Europe/Madrid). Las actividades pueden cambiar o cancelarse."
          : "Hores de Badalona (Europe/Madrid). Les activitats poden canviar o cancel·lar-se."}
      </p>
    </>
  );
}
