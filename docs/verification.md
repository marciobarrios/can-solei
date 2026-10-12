# Verificación de la primera propuesta

Comprobada en Mac el 12/10/2026. `pnpm lint`, `pnpm typecheck` y `pnpm build` pasan con TypeScript 7.0.2. Exportación estática de ca/es y selector; 22 pruebas Node de contenido/agenda y 12 pruebas Playwright pasan en Chromium, escritorio 1440×1000 y emulación iPhone 13.

El navegador comprueba equivalencia de idiomas, imágenes cargadas, ausencia de errores de página, categorías/búsqueda/zoom/lista accesible del mapa, teclado, agenda pasada/futura/cancelada y aviso de antigüedad, lightbox con foco confinado y restaurado, Escape, menú móvil, ausencia de desbordamiento, enlace de salto y movimiento reducido. La emulación móvil no sustituye una prueba en Safari/iPhone físico.

Axe 4.12.1: 0 violaciones y 0 comprobaciones incompletas tanto en `/ca/` como en `/es/` (48 reglas aprobadas por página). No equivale a una certificación universal WCAG ni cubre cada combinación de estado y tecnología asistiva. Capturas revisadas y resultados privados en `research/evidence/`.

Corpus integrado: 82 referencias, 21 hitos del parque, cronologías separadas de los dos colegios, 36 lugares incluyendo 25 árboles de la guía botánica, seis asuntos futuros con estado explícito, diez imágenes reutilizables y dos referencias externas multimedia. Ocho sesiones oficiales en el snapshot, siete futuras a fecha de investigación; ninguna fixture se publica.

La transferencia Library conservó identidad y versión. ZIP de 55.673.244 bytes, SHA-256 `b928119927222281540191038ba297bb18afacca89ad9997749c05056199bf39`; 97 archivos de su manifiesto verificados. Originales, catálogos, licencias y evidencias permanecen en `research/`, ignorado por Git.

## Límites pendientes

- Agenda automatizable demostrada con fixtures; adaptación y acceso a fuente real pendientes. Fuentes activas vacías, plantilla semanal inactiva, sin secretos nuevos.
- Plano AMB de 2014 y posiciones aproximadas; no es navegación ni auditoría de accesibilidad actual. Las coordenadas verificadas del catálogo botánico no se extrapolan a edificios.
- Obras/propuestas, incoación BCIN y objetivos parlamentarios se distinguen de actuaciones terminadas. La ortofoto vigente no tiene fecha de vuelo confirmada.
- Vídeo oficial enlazado, no descargado: reproducción externa no comprobada. Material histórico sin permiso adecuado solo enlazado.
- ESLint 9 requiere seguimiento por fin de mantenimiento; workspace aislado con API TypeScript 6 para herramientas. Aplicación y build usan compilador 7.
- CI se ejecuta en GitHub al subir. Su estado debe consultarse en Actions; no es un despliegue. No existe preview remoto ni producción autorizada.
