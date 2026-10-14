"use client";
import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import type { Lang } from "@/lib/types";
export function Header({ lang }: { lang: Lang }) {
  const es = lang === "es";
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        {es ? "Saltar al contenido" : "Saltar al contingut"}
      </a>
      <header className="site-header">
        <Link className="brand" href={`/${lang}/`}>
          <Leaf size={24} strokeWidth={1.5} />
          <span>
            Can Solei<span>i Ca l’Arnús</span>
          </span>
        </Link>
        <nav
          id="main-navigation"
          className={open ? "is-open" : ""}
          aria-label={es ? "Navegación principal" : "Navegació principal"}
        >
          {[
            ["mapa", es ? "Explora" : "Explora"],
            ["historia", es ? "Historia" : "Història"],
            ["escoles", es ? "Escuelas" : "Escoles"],
            ["agenda", "Agenda"],
            ["arxiu", es ? "Archivo" : "Arxiu"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div
            className="language-switch"
            role="group"
            aria-label={es ? "Idioma" : "Idioma"}
          >
            <Link
              href="/ca/"
              scroll={false}
              hrefLang="ca"
              aria-current={!es ? "page" : undefined}
              lang="ca"
            >
              CA
            </Link>
            <Link
              href="/es/"
              scroll={false}
              hrefLang="es"
              aria-current={es ? "page" : undefined}
              lang="es"
            >
              ES
            </Link>
          </div>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={es ? "Menú principal" : "Menú principal"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
