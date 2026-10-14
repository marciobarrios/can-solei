# Verificación de la primera propuesta

Comprobada en Mac el 12/10/2026. `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan con TypeScript 7.0.2. Exportación estática de ca/es y selector; 22 pruebas Node de contenido/agenda y 12 pruebas Playwright pasan en Chromium, escritorio 1440×1000 y emulación iPhone 13.

El navegador comprueba equivalencia de idiomas, imágenes cargadas, ausencia de errores de página, categorías/búsqueda/zoom/lista accesible del mapa, teclado, agenda pasada/futura/cancelada y aviso de antigüedad, lightbox con foco confinado y restaurado, Escape, menú móvil, ausencia de desbordamiento, enlace de salto y movimiento reducido. La emulación móvil no sustituye una prueba en Safari/iPhone físico.

Axe 4.12.1: 0 violaciones y 0 comprobaciones incompletas tanto en `/ca/` como en `/es/` (48 reglas aprobadas por página). No equivale a una certificación universal WCAG ni cubre cada combinación de estado y tecnología asistiva. Capturas revisadas y resultados privados en `research/evidence/`.

Corpus integrado: 89 referencias, 21 hitos del parque, cronologías separadas de los dos colegios, 36 lugares incluyendo 25 árboles de la guía botánica, seis asuntos futuros con estado explícito, once imágenes reutilizables: ocho fotografías históricas y tres recursos cartográficos. Ocho sesiones oficiales en el snapshot, siete futuras a fecha de investigación; ninguna fixture se publica.

La transferencia Library conservó identidad y versión. ZIP de 55.673.244 bytes, SHA-256 `b928119927222281540191038ba297bb18afacca89ad9997749c05056199bf39`; 97 archivos de su manifiesto verificados. Originales, catálogos, licencias y evidencias permanecen en `research/`, ignorado por Git.

## Límites pendientes

- Agenda automatizable demostrada con fixtures; adaptación y acceso a fuente real pendientes. Fuentes activas vacías, plantilla semanal inactiva, sin secretos nuevos.
- Plano AMB de 2014 y posiciones aproximadas; no es navegación ni auditoría de accesibilidad actual. Las coordenadas verificadas del catálogo botánico no se extrapolan a edificios.
- Obras/propuestas, incoación BCIN y objetivos parlamentarios se distinguen de actuaciones terminadas. La ortofoto vigente no tiene fecha de vuelo confirmada.
- Vídeo oficial enlazado, no descargado: reproducción externa no comprobada. Ocho fotos históricas del museo incorporadas bajo CC BY-NC-SA 2.0 tras confirmar uso no comercial; el material sin derechos verificados sigue sin publicarse.
- ESLint 9 requiere seguimiento por fin de mantenimiento; workspace aislado con API TypeScript 6 para herramientas. Aplicación y build usan compilador 7.
- CI se ejecuta en GitHub al subir. Su estado debe consultarse en Actions; no es un despliegue. No existe preview remoto ni producción autorizada.

## Ampliación de la galería (12/10/2026)

Se sustituyeron siete imágenes pequeñas por nueve fotografías de originales verificados (siete de Wikimedia Commons y dos de AMB). Se mantienen el plano y las dos ortofotos. Mínimo: 1200 píxeles en el lado largo y 800 en el corto, verificado contra los archivos decodificados. Galería a una columna en móvil y dos en escritorio.

Lint, 22 pruebas de contenido/agenda y compilación con `next build --webpack` correctos. La compilación habitual con Turbopack no pudo completarse en este entorno por una restricción al abrir un puerto durante el procesamiento de CSS; Webpack sí produjo la exportación estática. No se ha desplegado.

Las 12 pruebas Playwright pasan tras el cambio, incluyendo carga y resolución de todas las imágenes, número de columnas, lightbox y navegación por teclado. Capturas finales de móvil y escritorio revisadas visualmente.

## Fotografías históricas del museo (12/10/2026)

Tras confirmar el usuario el carácter cultural y no comercial de la web, se verificaron las ocho licencias individuales en Flickr y se incorporaron ocho originales de 1600 píxeles en el lado largo, sin recorte, ampliación ni eliminación de marcas de agua. Créditos de autor y archivo, fechas aproximadas y CC BY-NC-SA 2.0 visibles en catalán y castellano. Se añadió el filtro Históricas y se sustituyó la referencia genérica al álbum. Total: 17 fotografías, tres imágenes cartográficas y un vídeo enlazado.

Lint, 22 pruebas Node, compilación Webpack y 12 pruebas Playwright correctos. Las pruebas de navegador cubren además las ocho fotos del filtro histórico, la apertura de la fotografía del lago de 1936 y su aviso de uso no comercial.

## Selección editorial del 14/10/2026

Retirados el vídeo y las nueve fotografías actuales. La galería conserva las ocho fotografías históricas y los tres mapas y ortofotos, con filtros Todo / Históricas / Mapas y sus equivalentes en catalán. Los derivados retirados se guardan en research, fuera de la exportación pública.

## Corrección de enlaces salientes del 14 de octubre de 2026

Se recuperaron ocho destinos del Museu de Badalona: cinco números de Carrer dels Arbres en `/pdf/carrerdelsarbres/`, los inventarios de obras y enseñanza en `/pdf/ahbdn/` y la ficha catalana de la exposición Evarist Arnús. Las rutas se obtuvieron de los índices oficiales [tercera época](https://museudebadalona.cat/publicacions/tercera-epoca/), [cuarta época](https://museudebadalona.cat/publicacions/quarta-epoca/) y [AHBDN](https://museudebadalona.cat/arxiu/ahbdn/); los PDF descargados contienen los artículos anunciados. Las referencias de la torre del reloj y de los hitos de 1883, 1888 y 1900 apuntan ahora a los estudios H03/H04, más precisos que el anuncio de exposición H05.

La guía educativa S23 apunta al PDF municipal vigente de 2026–2027; se verificaron las fichas de Artur Martorell y Lola Anglada. S07 y S13 usan los enlaces permanentes de sus artículos. Se retiraron tres referencias sin citas en los hitos, lugares o medios: H38 (agenda antigua del museo desaparecida), S22 (guía educativa anterior no accesible; se conserva S23) y S33 (portada escolar paginada y mutable). Ningún relato pierde sus fuentes. El catálogo pasa de 89 a 86 referencias.

El botón de original del plano botánico abre el PDF de AMB con `#page=6`: se comprobó visualmente que esa página es el plano mostrado. Los registros de procedencia conservan la ficha editorial, sin el fragmento inválido. Las dos ortofotos abren directamente el GetMap oficial del encuadre del parque y de su capa correspondiente (vigente o 1993), conservando sus créditos y licencias. La capa vigente puede cambiar con las actualizaciones del ICGC; la imagen local mantiene su fecha de consulta original.

Validación sobre la rama corregida:

- 120 destinos salientes únicos comprobados mediante GET y seguimiento de redirecciones: 119 respondieron 200 al primer intento; UPCommons respondió 418 con filtro de seguridad y 200 al repetir, con el título esperado. Este filtro externo puede reaparecer; no se considera una URL rota.
- Los ocho eventos conservan sus fichas oficiales. No se han cambiado los datos de la agenda.
- Lint, TypeScript, 22 pruebas de contenido/agenda y exportación estática con Webpack correctos; 12 pruebas Playwright correctas en escritorio y móvil.
- Chromium: los 86 enlaces del catálogo y los tres destinos de los diálogos cartográficos coinciden con los datos corregidos tanto en CA como en ES. Capturas de galería revisadas en escritorio y móvil; no hay cambios de diseño.
- Las comprobaciones de red son una observación puntual, no una garantía de disponibilidad futura de terceros. No se añaden peticiones de terceros a la CI.

## Ortofoto y nueva investigación — 15/10/2026

Sustituida la ortofoto color de 1993 (resolución nativa 2,5 m) por la capa ICGC en blanco y negro de 1994 (50 cm). Fecha de vuelo verificada por GetFeatureInfo en el centro del parque: 01/06/1994. Imagen inspeccionada, inventarios y textos CA/ES actualizados; se conserva el material anterior fuera de `public`.

Validación: 22 pruebas de contenido/agenda correctas (`node --test tests/*.test.mjs`); exportación estática y TypeScript correctos (`node node_modules/next/dist/bin/next build --webpack`). Revisión manual en el build local, filtro Mapes y modal de la ortofoto: título, fecha, imagen, crédito y enlace visibles. Captura local en `research/review/ortofoto-1994-desktop.png`. El navegador registra un 404 preexistente de `favicon.ico`. Cambios locales, sin despliegue. Investigación adicional y límites de reutilización en `docs/recerca-historica-2026-10-15.md`; sus candidatos no se han añadido a la galería.

Verificación de la rama de PR sobre `origin/main` (`5bc827a`): lint correcto, 22 pruebas de contenido/agenda y 18 pruebas de navegador (escritorio y móvil) correctas; build Webpack y TypeScript correctos. Las pruebas usan un puerto independiente para comprobar la exportación de este worktree. Se conserva el enlace directo al GetMap oficial incorporado en main, actualizado a la capa de 1994.

## Curiosidades y referencias visibles — 15/10/2026

Tres tarjetas bilingües después de Historia, con fuentes y navegación al lugar del mapa. Los enlaces restablecen filtros y búsqueda, seleccionan el lugar y llevan el foco a su ficha, también al repetir el mismo enlace o cargarlo directamente. Dos referencias externas en la galería: Salvany 1912 (Históricas) y planos de 1859 (Mapas). Se mantienen once imágenes locales y sus licencias; hay trece entradas de archivo en total.

Lint, build Webpack/TypeScript, 22 pruebas de contenido y 22 pruebas de navegador correctos. Revisión visual en castellano a 1200 px y catalán a 390 px, incluidas las tarjetas y la referencia de archivo. Capturas locales: `research/review/curiosities-desktop.png`, `research/review/curiosities-mobile.png`, `research/review/archive-reference-mobile.png`.

## Foto de 1912 y planos de 1859 como imágenes — 15/10/2026

Se reemplazan las dos referencias por tres reproducciones reales: foto estereoscópica completa y dos plantas separadas. Total: catorce imágenes, nueve en Históricas y cinco en Mapas. Las excepciones de resolución se limitan a estos tres IDs con sus dimensiones exactas; no hay interpolación ni modificación generativa.

22 pruebas de contenido, 22 pruebas de navegador, lint y build Webpack/TypeScript correctos. Se comprueba apertura de las tres imágenes, crédito, enlace original y anchura del visor no superior al original en móvil y escritorio. Revisión visual de la foto en ES/móvil y planta baja en CA/escritorio. Capturas: `research/review/stereo-1912-mobile.png` y `research/review/plan-1859-desktop.png`.
