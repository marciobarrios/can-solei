# Agenda oficial y actualización semanal

## Estado real

La web sirve una instantánea editorial verificada en `content/agenda.json`. No hay cron activo, backend, secretos ni despliegue. La ingesta desde AMB y Badalona no se considera operativa hasta probarla desde el entorno final: las consultas directas del investigador devolvieron HTTP 403 aunque el índice web mostraba fichas. No se eluden esos bloqueos. La prueba adicional desde el Mac el 12/10/2026 recibió una respuesta superior al límite de 1 MB y se detuvo: tampoco valida un parser operativo.

## Arquitectura

Una exportación estática de Next no cambia al escribir un JSON durante una petición. Una función de Vercel tampoco debe tratar su disco temporal como almacenamiento persistente. Hay dos opciones: almacenar eventos en una base persistente y leerlos en ejecución, o conservar un snapshot y regenerar la web. Esta propuesta elige **snapshot en Git + build**, sin base de datos ni funciones por visita.

`pnpm agenda:update` lee `content/agenda-sources.json`, permite como máximo 8 peticiones HTTPS a dominios oficiales, 10 segundos por petición y 1 MB por respuesta. No sigue redirects. Admite iCalendar no recurrente y JSON-LD Event; cualquier cambio de formato, bloqueo, fallo o resultado vacío conserva el último snapshot completo. Los parsers rechazan recurrencias no expandidas, horas ambiguas/no existentes y fechas finales inválidas. Solo se aceptan eventos cuyo lugar identifica Can Solei o Ca l’Arnús; un lugar ausente requiere revisión y adaptación documentada. Los UID y secuencias conservan cancelaciones nuevas frente a respuestas antiguas. La ausencia de un evento no se interpreta como cancelación.

Los eventos se normalizan a instantes UTC y se muestran con `Europe/Madrid`. Se preservan fechas de día completo. El cambio de octubre está probado: 12:00 locales son 10:00 UTC el 18/10 y 11:00 UTC el 25/10. Las fixtures de pruebas son explícitamente ficticias y nunca alimentan la web.

## Activación futura, sin servicios nuevos

1. Comprobar una fuente oficial accesible desde el runner final, sin resolver 403 con técnicas de evasión. Preferir iCal oficial o JSON-LD; adaptar el parser solo con evidencias nuevas en `research/`.
2. Configurar exclusivamente URLs verificadas en `content/agenda-sources.json`. No usar búsquedas web como API ni inventar endpoints.
3. Ejecutar `pnpm agenda:update`, revisar el diff editorial, traducciones y cancelaciones; ejecutar `pnpm test && pnpm build`.
4. Con autorización posterior, añadir una tarea semanal a GitHub Actions que proponga un PR con el snapshot, usando su token integrado con permisos mínimos. El archivo `docs/agenda-weekly.example.yml` es una plantilla inactiva. No copia corpus privado a artifacts ni Git.
5. Una vez autorizado un despliegue, integrar Git con Vercel: al incorporar el snapshot, un único rebuild actualizaría los archivos estáticos. No se ha creado integración ni hook de despliegue.

Una alternativa Vercel Cron necesitaría una función y almacenamiento persistente o disparar un rebuild; no basta con modificar un JSON local. Hobby admite cadencia semanal, con límites diarios y precisión dentro de la hora. Cron usa UTC; los eventos conservan Europe/Madrid independientemente del horario del job. No se incluye `crons` en configuración de producción.

Fuentes oficiales consultadas el 12/10/2026:

- https://nextjs.org/docs/app/guides/static-exports
- https://vercel.com/docs/cron-jobs
- https://vercel.com/docs/cron-jobs/manage-cron-jobs
