# Procedencia y reutilización de imágenes

El inventario publicable está en `content/media-licenses.json`: autor, fuente original, aviso legal, fecha conocida, dimensiones, hash del original y del derivado y modificaciones. Las diez imágenes se distribuyen conforme a CC BY 4.0 y sus avisos de origen. Deben conservarse los créditos y enlaces visibles de la galería y el mapa; no se afirma respaldo institucional.

- Fotografías de la guía AMB 2012: Ernest Costa i Savoia / AMB. Se seleccionaron fotografías contemporáneas de paisaje y arquitectura, excluyendo material histórico atribuido a terceros.
- Plano botánico AMB 2014: Trimatge / AMB. Conversión WebP; la interfaz añade marcadores aproximados sobre el plano.
- Imagen de camino de la memoria AMB 2019–2023: AMB, sin fotógrafo individual indicado en la fuente.
- Ortofotos: Institut Cartogràfic i Geològic de Catalunya (ICGC), según las condiciones enlazadas en el inventario. La capa vigente se identifica por consulta, sin inventar fecha de vuelo.

Los derivados eliminan metadatos y no se amplían ni se modifican generativamente. `pnpm images:build` regenera manualmente los derivados solo con originales locales auditados. El build habitual utiliza los assets ya curados y no necesita research.

Se preservan localmente los catálogos y avisos originales en `research/`. Las fotografías históricas Flickr con licencia no comercial, las referencias Commons sin original verificado y cualquier derecho incierto no se redistribuyen. El vídeo documental abre la fuente oficial. No se heredan permisos del proyecto Can Peguera.

La ilustración SVG de portada es una interpretación gráfica original claramente indicada, no documentación fotográfica histórica. No se concede una licencia general que sustituya las licencias de terceros.
