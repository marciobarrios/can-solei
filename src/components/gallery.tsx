"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  ImageIcon,
  BookOpen,
  Maximize2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GardenArt } from "./garden-art";
import type { Corpus, Lang, Media } from "@/lib/types";
export function Gallery({
  corpus,
  lang,
}: {
  corpus: Pick<Corpus, "media">;
  lang: Lang;
}) {
  const es = lang === "es";
  const opener = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState<Media | null>(null);
  const [filter, setFilter] = useState("all");
  const visibleMedia = corpus.media.filter(
    (item) =>
      filter === "all" || item.kind === filter || item.period === filter,
  );
  const images = visibleMedia.filter((item) => item.image);
  const selectedIndex = images.findIndex((item) => item.id === selected?.id);
  const canNavigate = images.length > 1;

  function navigate(direction: number) {
    setSelected((current) => {
      const index = images.findIndex((item) => item.id === current?.id);
      if (index < 0 || !canNavigate) return current;
      return images[(index + direction + images.length) % images.length];
    });
  }

  return (
    <>
      <div
        className="filter-group gallery-filters"
        role="group"
        aria-label={es ? "Filtrar archivo visual" : "Filtrar arxiu visual"}
      >
        {[
          ["all", es ? "Todo" : "Tot"],
          ["historical", es ? "Históricas" : "Històriques"],
          ["document", es ? "Mapas" : "Mapes"],
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
      <div className="gallery-grid grid-cols-1! md:grid-cols-2!">
        {visibleMedia.map((item, index) =>
          !item.image ? (
            <article
              className="media flex flex-col rounded-2xl border border-[#163e35]/15 bg-[#f4f1e7] p-6 sm:p-8"
              key={item.id}
            >
              <span className="mb-6 flex items-center gap-2 text-sm text-[#496057]">
                <BookOpen size={20} aria-hidden="true" />
                {es
                  ? "Referencia de archivo · enlace externo"
                  : "Referència d’arxiu · enllaç extern"}
              </span>
              <h3>{item.title[lang]}</h3>
              <p>{item.description[lang]}</p>
              <p className="credit">
                {item.credit} · {item.license[lang]}
              </p>
              <a
                className="mt-auto flex min-h-11 items-center gap-2 pt-6 underline underline-offset-4"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {es ? "Consultar en el archivo" : "Consultar a l’arxiu"}
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </article>
          ) : (
            <article className={`media media-${item.kind}`} key={item.id}>
              <button
                className="media-preview"
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setSelected(item);
                }}
                aria-label={`${es ? "Abrir" : "Obrir"} ${item.title[lang]}`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title[lang]}
                    loading="lazy"
                    width={item.width ?? 800}
                    height={item.height ?? 600}
                  />
                ) : (
                  <>
                    <GardenArt variant={index % 2 ? "trees" : "lake"} />
                    <span className="media-symbol">
                      {item.kind === "video" ? (
                        <Play size={32} />
                      ) : item.kind === "document" ? (
                        <BookOpen size={32} />
                      ) : (
                        <ImageIcon size={32} />
                      )}
                    </span>
                    <span className="reference-label">
                      {es ? "Referencia externa" : "Referència externa"}
                    </span>
                  </>
                )}
                <span className="expand">
                  <Maximize2 size={16} />
                </span>
              </button>
              <h3>{item.title[lang]}</h3>
              <p>{item.description[lang]}</p>
              <p className="credit">
                {item.credit} ·{" "}
                {item.licenseUrl ? (
                  <a href={item.licenseUrl} target="_blank" rel="noreferrer">
                    {item.license[lang]}
                  </a>
                ) : (
                  item.license[lang]
                )}
              </p>
            </article>
          ),
        )}
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="gallery-dialog"
          showCloseButton={false}
          finalFocus={opener}
          onKeyDown={(event) => {
            if (
              !canNavigate ||
              event.altKey ||
              event.ctrlKey ||
              event.metaKey ||
              event.shiftKey
            )
              return;
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              navigate(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          {selected && (
            <>
              <DialogClose
                className="dialog-close"
                aria-label={es ? "Cerrar" : "Tancar"}
              >
                <X size={22} />
              </DialogClose>
              <DialogTitle className="dialog-title">
                {selected.title[lang]}
              </DialogTitle>
              <DialogDescription>
                {selected.description[lang]}
              </DialogDescription>
              {selected.image ? (
                <div className="relative grid min-h-11 place-items-center">
                  <Image
                    key={selected.id}
                    src={selected.image}
                    alt={selected.title[lang]}
                    width={selected.width ?? 1000}
                    height={selected.height ?? 750}
                    style={{ maxWidth: selected.width ?? 1000 }}
                  />
                  {canNavigate && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 inset-y-0 z-10 my-auto size-11 rounded-full bg-background/95 shadow-md transition-colors"
                        aria-label="Foto anterior"
                        onClick={() => navigate(-1)}
                      >
                        <ChevronLeft className="size-6" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 inset-y-0 z-10 my-auto size-11 rounded-full bg-background/95 shadow-md transition-colors"
                        aria-label={es ? "Foto siguiente" : "Foto següent"}
                        onClick={() => navigate(1)}
                      >
                        <ChevronRight className="size-6" aria-hidden="true" />
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="reference-panel">
                  {selected.kind === "video" ? (
                    <Play size={40} />
                  ) : (
                    <BookOpen size={40} />
                  )}
                  <p>
                    {es
                      ? "Abre el original en la web de su editor."
                      : "Obre l’original al web del seu editor."}
                  </p>
                </div>
              )}
              {canNavigate && (
                <p
                  role="status"
                  aria-atomic="true"
                  className="w-full max-w-none! text-center text-sm tabular-nums text-muted-foreground"
                >
                  {selectedIndex + 1} / {images.length}
                  <span className="sr-only"> · {selected.title[lang]}</span>
                </p>
              )}
              <p className="credit">
                {selected.credit} ·{" "}
                {selected.licenseUrl ? (
                  <a
                    href={selected.licenseUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selected.license[lang]}
                  </a>
                ) : (
                  selected.license[lang]
                )}
              </p>
              <a
                className="primary-link"
                href={selected.url}
                target="_blank"
                rel="noreferrer"
              >
                {es ? "Consultar original" : "Consultar original"}
                <ExternalLink size={16} />
              </a>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
