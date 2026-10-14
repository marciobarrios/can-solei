"use client";
import { useState, useSyncExternalStore } from "react";
import { CalendarDays, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agenda, Lang } from "@/lib/types";
const subscribe = (notify: () => void) => {
  const timer = setInterval(notify, 60000);
  return () => clearInterval(timer);
};
const getNow = () => Math.floor(Date.now() / 60000) * 60000;
export function NextEvent({
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

  if (!event) return null;

  const date = new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(event.start));
  const time = event.allDay
    ? es ? "Todo el día" : "Tot el dia"
    : new Intl.DateTimeFormat(lang, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Madrid",
      }).format(new Date(event.start));

  return (
    <aside
      aria-label={es ? "Próximo evento" : "Propera activitat"}
      className="mt-4 flex min-w-0 items-center gap-2 text-xs"
    >
      <CalendarDays size={14} className="shrink-0 text-[#50675e]" aria-hidden="true" />
      <time dateTime={event.start} className="shrink-0 whitespace-nowrap text-[#50675e]">
        {date} · {time}
      </time>
      <a
        href={event.url}
        target="_blank"
        rel="noreferrer"
        title={event.title[lang]}
        className="flex min-h-11 min-w-0 items-center underline decoration-[#9bb0a1] underline-offset-4 hover:decoration-current"
      >
        <span className="truncate">{event.title[lang]}</span>
      </a>
      <span aria-hidden="true" className="text-[#9bb0a1]">·</span>
      <a
        href="#agenda"
        aria-label={es ? "Ver toda la agenda" : "Veure tota l’agenda"}
        className="inline-flex min-h-11 shrink-0 items-center text-[#50675e]! hover:text-[#16332c]! hover:underline hover:underline-offset-4"
      >
        Agenda
      </a>
    </aside>
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
