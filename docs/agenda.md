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

## Revisión editorial del 14/10/2026

Los ocho eventos publicados coinciden en título, fecha, parque y horario (12–13 h) con el contenido oficial de AMB disponible en el lector/índice web. No se ha encontrado evidencia para modificar sus fechas o retirar actividades. La sesión del 11/10 está en el archivo; las siete siguientes corresponden al 18 y 25/10 y al 1, 8, 15, 22 y 29/11.

Se corrigieron siete enlaces que apuntaban a la agenda general bajo la etiqueta «Ficha oficial». Ahora cada actividad enlaza a su convocatoria específica, recogida en `content/agenda.json`, con el identificador de recinto 2470367. La agenda general mezcla parques y repite títulos en distintas localidades, por lo que no basta con buscar por nombre.

La comprobación usa contenido indexado (fichas próximas rastreadas dos días antes; listado y ficha del 11/10, seis días antes). Los seis intentos de apertura directa de fichas próximas devolvieron errores de caché del lector; no se certifican cambios o cancelaciones posteriores al rastreo. Se conserva `checkedAt` anterior para no presentar esta revisión del índice como una sincronización nueva con el origen. La ingesta automática sigue desactivada. Esta revisión no verifica que la selección cubra todos los actos del parque.

## Programa de las actividades: 15/10/2026

Los ocho eventos de la selección incluyen el programa Jugatecambiental (Jugateca Ambiental en castellano), su enlace oficial y una breve descripción en ambos idiomas. La descripción resume la [ficha de la Jugatecambiental del parque publicada por la AMB](https://www.amb.cat/es/web/territori/espai-public/parcs/punts-interes/detall/-/puntinteres/parc-de-can-solei-i-de-ca-l-arnus/2470367/11656): juego y descubrimiento familiar, talleres creativos y actividades dirigidas por naturalistas. Se muestra junto a cada evento, también en el archivo, conservando el enlace a su convocatoria específica. El campo `program` es opcional para no atribuir automáticamente futuras actividades a este programa. Esta ampliación editorial no cambia `checkedAt` ni implica una nueva comprobación de fechas o cancelaciones.

Las descripciones individuales de los ocho eventos se transcriben del cartel `3_CSCA_cartell_tardor_2026_NM_revNC_net.jpg`, aportado por el usuario el 15/10/2026, y se traducen al castellano. Se muestran en un párrafo antes del enlace a la Jugateca. El cartel lleva el encabezado «PRIMAVERA 2026», aunque las fechas de las actividades corresponden a septiembre–noviembre de 2026; se han emparejado las descripciones por título y fecha, sin modificar las fechas ni los horarios publicados.
