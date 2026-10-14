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
