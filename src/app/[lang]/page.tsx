import type { Metadata } from "next";
import {
  ArrowUpRight,
  Leaf,
  MapPin,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/header";
import { GardenArt } from "@/components/garden-art";
import { ParkMap } from "@/components/park-map";
import { Gallery } from "@/components/gallery";
import { AgendaPanel, HeroBadge } from "@/components/agenda";
import type { Corpus, Agenda, Lang } from "@/lib/types";
import rawCorpus from "../../../content/corpus.json";
import rawAgenda from "../../../content/agenda.json";
const corpus = rawCorpus as Corpus;
const buildTime = Date.now();
const agenda = rawAgenda as Agenda;
export function generateStaticParams() {
  return [{ lang: "ca" }, { lang: "es" }];
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      "Can Solei i Ca l’Arnús · " +
      (lang === "es"
        ? "Un parque, muchas historias"
        : "Un parc, moltes històries"),
    description:
      lang === "es"
        ? "Descubre el patrimonio, la naturaleza y las historias del parque de Can Solei i Ca l’Arnús, en Badalona."
        : "Descobreix el patrimoni, la natura i les històries del parc de Can Solei i Ca l’Arnús, a Badalona.",
    robots: { index: false, follow: true },
  };
}
function Sources({ ids }: { ids: string[] }) {
  return (
    <div className="source-links">
      {ids.map((id) => {
        const s = corpus.sources.find((s) => s.id === id);
        return s ? (
          <a key={id} href={s.url} target="_blank" rel="noreferrer">
            {s.publisher}
            <ExternalLink size={12} />
          </a>
        ) : null;
      })}
    </div>
  );
}
export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const es = lang === "es";
  return (
    <>
      <Header lang={lang} />
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="location">
              <MapPin size={16} />
              Badalona, Barcelonès
            </div>
            <h1>
              {es
                ? "Un parque, muchas historias."
                : "Un parc, moltes històries."}
            </h1>
            <p>
              {es
                ? "Hay lugares que se descubren caminando. Entre jardines, agua y memoria, Can Solei i Ca l’Arnús te espera."
                : "Hi ha llocs que es descobreixen caminant. Entre jardins, aigua i memòria, Can Solei i Ca l’Arnús t’espera."}
            </p>
            <a className="primary-link" href="#mapa">
              {es ? "Encuentra tu próximo rincón" : "Troba el teu proper racó"}
              <ArrowUpRight size={20} />
            </a>
            <div className="hero-foot">
              <Leaf size={18} />
              <span>
                {es
                  ? "Dos fincas. Un patrimonio compartido."
                  : "Dues finques. Un patrimoni compartit."}
              </span>
            </div>
          </div>
          <figure className="hero-art">
            <GardenArt />
            <figcaption>
              {es
                ? "Una mirada ilustrada al parque. Interpretación, no fotografía histórica."
                : "Una mirada il·lustrada al parc. Interpretació, no fotografia històrica."}
            </figcaption>
            <HeroBadge agenda={agenda} lang={lang} referenceNow={buildTime} />
          </figure>
        </section>
        <div className="intro-strip">
          <p>
            {es
              ? "El jardín también es un archivo."
              : "El jardí també és un arxiu."}
          </p>
          <span>
            {es
              ? "Una guía cultural independiente para mirar, aprender y volver."
              : "Una guia cultural independent per mirar, aprendre i tornar."}
          </span>
          <a href="#fonts">
            {es ? "Cómo lo documentamos" : "Com ho documentem"}
            <ArrowUpRight size={17} />
          </a>
        </div>
        <section id="recorregut" className="section estates-section">
          <div className="section-heading">
            <h2>
              {es
                ? "Dos fincas, un mismo paseo"
                : "Dues finques, una mateixa passejada"}
            </h2>
            <div>
              <p>{corpus.intro[lang]}</p>
              <Sources ids={["H01", "H04"]} />
            </div>
          </div>
          <div className="estates">
            <article>
              <span className="estate-symbol">
                <Leaf size={35} strokeWidth={1} />
              </span>
              <h3>Can Solei</h3>
              <p>{corpus.estates.solei[lang]}</p>
              <Sources ids={["H01", "H11", "H31"]} />
              <a className="text-link" href="#mapa">
                {es ? "Explorar Can Solei" : "Explorar Can Solei"}
                <ArrowUpRight size={17} />
              </a>
            </article>
            <article>
              <span className="estate-symbol">
                <BookOpen size={35} strokeWidth={1} />
              </span>
              <h3>Ca l’Arnús</h3>
              <p>{corpus.estates.arnus[lang]}</p>
              <Sources ids={["H04", "H06", "H08"]} />
              <a className="text-link" href="#mapa">
                {es ? "Explorar Ca l’Arnús" : "Explorar Ca l’Arnús"}
                <ArrowUpRight size={17} />
              </a>
            </article>
          </div>
        </section>
        <section id="mapa" className="section map-section">
          <div className="section-heading">
            <h2>
              {es ? "Piérdete en los detalles" : "Perd-te en els detalls"}
            </h2>
            <p>
              {es
                ? "Elige un lugar en el plano o en la lista. Cada rincón guarda una parte de la historia."
                : "Tria un lloc al plànol o a la llista. Cada racó guarda una part de la història."}
            </p>
          </div>
          <ParkMap
            corpus={{ places: corpus.places, sources: corpus.sources }}
            lang={lang}
          />
          <p className="fine-print">
            {es
              ? "Este esquema no certifica itinerarios accesibles ni acceso al interior de los edificios. Consulta la información oficial antes de la visita."
              : "Aquest esquema no certifica itineraris accessibles ni accés a l’interior dels edificis. Consulta la informació oficial abans de la visita."}
          </p>
        </section>
        <section id="curiositats" className="section">
          <div className="section-heading">
            <h2>{es ? "¿Sabías que…?" : "Sabies que…?"}</h2>
            <p>
              {es
                ? "Pequeñas historias para mirar el parque con otros ojos."
                : "Petites històries per mirar el parc amb uns altres ulls."}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {corpus.curiosities.map((item, index) => {
              const place = corpus.places.find((p) => p.id === item.placeId)!;
              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-[#163e35]/15 bg-[#f4f1e7] p-6 sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="mb-5 text-sm tabular-nums text-[#496057]"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mb-4! text-2xl leading-tight">
                    {item.title[lang]}
                  </h3>
                  <p className="mb-5 leading-relaxed">{item.text[lang]}</p>
                  <Sources ids={item.sources} />
                  <a
                    className="mt-auto flex min-h-11 items-center gap-2 pt-6 text-sm underline underline-offset-4"
                    href={`#mapa-${item.placeId}`}
                  >
                    <MapPin size={16} aria-hidden="true" className="shrink-0" />
                    {es
                      ? `Ver ${place.name.es} en el mapa`
                      : `Veure ${place.name.ca} al mapa`}
                  </a>
                </article>
              );
            })}
          </div>
        </section>
        <section id="historia" className="section history-section">
          <div className="section-heading">
            <h2>
              {es ? "El tiempo entre los árboles" : "El temps entre els arbres"}
            </h2>
            <p>
              {es
                ? "De fincas privadas a espacio compartido. Sigue las fechas documentadas de su transformación."
                : "De finques privades a espai compartit. Segueix les dates documentades de la seva transformació."}
            </p>
          </div>
          <ol className="timeline">
            {corpus.history.map((m, i) => (
              <li key={i}>
                <div className="timeline-year">
                  {es && m.year === "Inicis del s. XX"
                    ? "Principios del s. XX"
                    : m.year}
                </div>
                <div>
                  <h3>{m.title[lang]}</h3>
                  <p>{m.text[lang]}</p>
                  <Sources ids={m.sources} />
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section id="escoles" className="section schools-section">
          <div className="section-heading">
            <h2>
              {es ? "Crecer junto al parque" : "Créixer al costat del parc"}
            </h2>
            <p>
              {es
                ? "Artur Martorell y Lola Anglada: dos historias escolares con cronologías propias."
                : "Artur Martorell i Lola Anglada: dues històries escolars amb cronologies pròpies."}
            </p>
          </div>
          <div className="schools">
            {corpus.schools.map((s) => (
              <article key={s.id}>
                <h3>{s.name}</h3>
                <p className="school-intro">{s.intro[lang]}</p>
                <Sources
                  ids={
                    s.id === "artur"
                      ? ["S01", "S03", "S22"]
                      : ["S06", "S09", "S14", "S18"]
                  }
                />
                <ol>
                  {s.milestones.map((m, i) => (
                    <li
                      key={i}
                      className="grid-cols-[minmax(min-content,4.6875rem)_minmax(0,1fr)]!"
                    >
                      <span>{m.year}</span>
                      <div>
                        <h4>{m.title[lang]}</h4>
                        <p>{m.text[lang]}</p>
                        <Sources ids={m.sources} />
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
        <section id="natura" className="nature-section">
          <div className="nature-art">
            <GardenArt variant="trees" />
          </div>
          <div className="nature-copy">
            <Leaf size={40} strokeWidth={1} />
            <h2>
              {es ? "Un jardín que sigue vivo" : "Un jardí que continua viu"}
            </h2>
            <p>{corpus.nature[lang]}</p>
            <Sources ids={["M01", "H33", "H34", "H42"]} />
            <a className="text-link" href="#mapa">
              {es
                ? "Descubre la naturaleza del parque"
                : "Descobreix la natura del parc"}
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section id="agenda" className="section agenda-section">
          <AgendaPanel agenda={agenda} lang={lang} referenceNow={buildTime} />
        </section>
        <section id="arxiu" className="section archive-section">
          <div className="section-heading">
            <h2>{es ? "Otras miradas al parque" : "Altres mirades al parc"}</h2>
            <p>
              {es
                ? "Fotografías históricas y mapas. Un archivo para seguir descubriendo."
                : "Fotografies històriques i mapes. Un arxiu per continuar descobrint."}
            </p>
          </div>
          <Gallery corpus={{ media: corpus.media }} lang={lang} />
        </section>
        <section id="fonts" className="section sources-section">
          <div className="section-heading">
            <p className="text-lg! leading-snug! font-semibold">
              {es ? "Cada historia, su fuente" : "Cada història, la seva font"}
            </p>
            <p>
              {es ? "Revisión editorial" : "Revisió editorial"}:{" "}
              {corpus.reviewedAt}.{" "}
              {es
                ? "Las fuentes se enlazan junto a los hechos. Las dudas y los proyectos en trámite se señalan expresamente."
                : "Les fonts s’enllacen al costat dels fets. Els dubtes i els projectes en tràmit s’assenyalen expressament."}
            </p>
          </div>
          <details>
            <summary>
              {es
                ? "Consultar las fuentes y los créditos"
                : "Consultar les fonts i els crèdits"}{" "}
              <span>{corpus.sources.length}</span>
            </summary>
            <ul>
              {corpus.sources.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                    <ExternalLink size={14} />
                  </a>
                  <span>
                    {s.publisher}
                    {s.date ? " · " + s.date : ""}
                  </span>
                </li>
              ))}
            </ul>
          </details>
          <p className="fine-print max-w-none!">
            {es
              ? "Ilustraciones: creación original para esta guía. Plano: Trimatge / AMB, 2014, CC BY 4.0, con marcadores añadidos. Las fotografías tienen crédito y licencia individual; los materiales sin permiso confirmado se enlazan en su web original."
              : "Il·lustracions: creació original per a aquesta guia. Plànol: Trimatge / AMB, 2014, CC BY 4.0, amb marcadors afegits. Les fotografies tenen crèdit i llicència individual; els materials sense permís confirmat s’enllacen al web original."}
          </p>
        </section>
      </main>
      <footer>
        <div className="footer-brand">
          <Leaf size={28} />
          <span>Can Solei i Ca l’Arnús</span>
        </div>
        <p>
          {es
            ? "Un parque para volver a mirar."
            : "Un parc per tornar a mirar."}
        </p>
        <span>
          {es
            ? "Guía cultural independiente. No es una web oficial."
            : "Guia cultural independent. No és un web oficial."}
        </span>
        <a href="#main">
          {es ? "Volver arriba" : "Tornar a dalt"}
          <ArrowUpRight size={15} />
        </a>
      </footer>
    </>
  );
}
