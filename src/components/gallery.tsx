"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import {
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
  return (
    <>
      <div
        className="filter-group gallery-filters"
        role="group"
        aria-label={es ? "Filtrar archivo visual" : "Filtrar arxiu visual"}
      >
        {[
          ["all", es ? "Todo" : "Tot"],
          ["photo", es ? "Fotografías" : "Fotografies"],
          ["video", es ? "Vídeos" : "Vídeos"],
          ["document", es ? "Documentos" : "Documents"],
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
      <div className="gallery-grid">
        {corpus.media
          .filter((m) => filter === "all" || m.kind === filter)
          .map((item, index) => (
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
          ))}
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
                <Image
                  src={selected.image}
                  alt={selected.title[lang]}
                  width={selected.width ?? 1000}
                  height={selected.height ?? 750}
                  style={{ maxWidth: selected.width ?? 1000 }}
                />
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
