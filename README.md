# Can Solei i Ca l’Arnús

Guía cultural independiente, bilingüe català/castellano, del parque de Badalona. Primera propuesta estática, sin despliegue de producción ni agenda automática activa.

## Ejecutar

```sh
pnpm install --frozen-lockfile
pnpm dev --port 3017
pnpm lint
pnpm test
pnpm build
pnpm preview
```

Desarrollo: http://localhost:3017/ca/ y /es/. Exportación: `out/`. Preview estático: http://localhost:3018/. El servidor local solo está disponible mientras el proceso permanezca activo.

## Stack verificado el 12 de octubre de 2026

Next 16.4.0, React 19.3.0, Tailwind 4.3.3, shadcn 4.21.4 (estilo `base-nova`, primitivas `@base-ui/react` 1.9.0), pnpm 12.4.2 y **TypeScript 7.0.2 estable**. Microsoft publicó TS7 estable el 8 de julio de 2026: no se usa native-preview. `pnpm exec tsc --version` confirma el compilador 7; Next conserva el valor por defecto de `experimental.useTypeScriptCli`, introducido como experimental en 16.4.

TypeScript 7 no expone la API JavaScript anterior. Las herramientas ESLint que dependen de esa API se resuelven específicamente a `@typescript/typescript6` en el workspace separado `tooling/lint` con el alias oficial de Microsoft; el compilador de la aplicación y de Next sigue siendo 7. Esta separación sigue el mecanismo de compatibilidad documentado por Microsoft. No se desactiva la comprobación de tipos.

- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
- https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli
- https://ui.shadcn.com/docs/installation/next

## Contenido y derechos

`content/corpus.json` contiene únicamente contenido editorial curado y referencias. `content/agenda.json` es la última instantánea oficial comprobada. La carpeta **`research/` está excluida de Git**: preserva originales, PDFs, catálogos de fuentes/licencias, archivos Library y evidencias. No modificar esa separación. Los scripts y builds no requieren publicar research.

Las ilustraciones SVG son interpretaciones originales, nunca fotografías históricas. El plano publicado por AMB en 2014 se presenta con marcadores de posiciones aproximadas, no navegación precisa ni certificación de accesibilidad. Cada asset fotográfico debe tener autor, fuente, licencia y permiso de reutilización documentados; si falta uno, se enlaza el original sin redistribuir la imagen. Los permisos de otros proyectos no se heredan.

## Bajo consumo

Páginas precompiladas `/ca/`, `/es/` y selector `/`. Mapa, filtros y lightbox funcionan en el cliente, sin API ni base de datos. Fuentes de sistema, sin analytics ni iframes cargados de entrada. Imágenes servidas como derivados optimizados en build; sin servicio de transformación por petición. Agenda con hasta ocho peticiones por actualización, nunca por visita.

La [agenda](docs/agenda.md) documenta pruebas, límites y activación futura. Su plantilla semanal está fuera de `.github/workflows` y es inactiva. CI valida código y exportación; no publica ni despliega.

ESLint se fija en 9.39.5 por los rangos declarados de los plugins de Next 16.4; npm lo marca como versión sin mantenimiento. ESLint 10 ejecuta el lint pero esos plugins aún no declaran compatibilidad. La actualización queda identificada como mantenimiento pendiente, sin ocultar advertencias ni forzar peers.

La [verificación](docs/verification.md) detalla comprobaciones y límites; [derechos de imágenes](docs/media-rights.md) explica la selección. Pruebas de navegador: `pnpm exec playwright install chromium` y `pnpm test:browser` después del build.
