# Generador de QR Gratis

Generador de códigos QR **gratis, sin registro y sin marca de agua**. Hecho por [Pixolve Agency](https://pixolve-agency.vercel.app/).

**Web:** https://generador-de-qr-gratis.vercel.app/ (español) · https://generador-de-qr-gratis.vercel.app/en/ (English)

## Qué hace
- **13 tipos de QR:** enlace, imagen, PDF, WiFi, WhatsApp, redes sociales (Instagram, TikTok, Facebook, YouTube, X, Telegram, LinkedIn, Threads), contacto (vCard), ubicación (Google Maps), teléfono, SMS, correo, evento de calendario y texto.
- **Diseño:** 4 formas, colores con avisos de contraste, fondo transparente, marco con texto («Escanéame», «Ver menú»… o el tuyo) y, en el centro, los logos de WhatsApp, Instagram y otras redes, iconos o tu propio logo. Con logo, la corrección de errores sube a «H» automáticamente.
- **Descargas:** PNG (512 / 1024 / 2048 px), SVG para imprenta, copiar imagen y compartir (si el navegador lo permite). Indica el tamaño mínimo de impresión.
- **Ejemplos listos:** cuatro diseños reales hechos con el propio generador; «Usar este diseño» los aplica con un clic.
- **Español e inglés:** dos páginas estáticas (`/` y `/en/`) enlazadas con `hreflang`. Los textos dinámicos están en el diccionario `I18N` de `main.js` y el visor de imágenes habla el idioma del teléfono que escanea.
- Acentos, ñ y emojis se codifican en UTF-8 para que se lean bien en cualquier teléfono.

## ¿Caducan los QR?
- **Enlace, WiFi, WhatsApp, redes, contacto, ubicación, teléfono, SMS, correo, evento y texto:** son QR **estáticos**. El contenido va dentro del propio dibujo, se generan en el navegador del visitante y funcionan para siempre, aunque esta web dejara de existir.
- **Imagen y PDF:** el archivo se guarda en Vercel Blob (almacén `generador-qr-archivos`) **sin fecha de caducidad**. El QR apunta a `…/v?i=<id>` (imagen) o `…/f/<id>` (PDF), así que funciona mientras exista el proyecto y su almacén. Si el plan gratuito de Vercel llega a su límite de almacenamiento o transferencia, las subidas y descargas de archivos se pausan hasta el mes siguiente; los QR estáticos no se ven afectados.

## Archivos
| Archivo | Para qué |
|---|---|
| `index.html` | Página en español: herramienta, ejemplos, textos, preguntas frecuentes y datos para Google (JSON-LD) |
| `en/index.html` | La misma página en inglés (si cambias una, cambia también la otra) |
| `qr.css` | Estilos |
| `main.js` | Lógica del generador (navegador) |
| `lib/vendor/qr-code-styling.js` | Motor de QR, [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) 1.9.2 (MIT), copiado para no depender de un CDN |
| `api/upload.js` | `POST /api/upload`: guarda una imagen o PDF (máx. 4 MB, solo desde este dominio, se comprueba el formato real) |
| `api/file.js` | `GET /f/<id>`: abre el archivo guardado (`?dl=1` lo descarga) |
| `api/_lib/files.js` | Lógica compartida de las dos funciones |
| `v.html`, `v.js` | Visor que se abre al escanear un QR de imagen |
| `tests/` | Pruebas de las funciones (`npm test`) |
| `robots.txt`, `sitemap.xml` | Para que Google indexe la web (los archivos subidos quedan fuera) |
| `og-qr.png`, `og-qr-en.png` | Imagen que aparece al compartir el enlace en WhatsApp o redes |
| `assets/icons.svg` | Iconos de la interfaz ([Lucide](https://lucide.dev), ISC) y logotipos de marca ([Simple Icons](https://simpleicons.org), CC0) |
| `assets/logos/` | Logos para el centro del QR (los genéricos usan `#0b0b0c`, que la web cambia por el color del código) |
| `assets/ejemplos/` | Ejemplos de la galería, generados con la propia herramienta (apuntan a esta web) |
| `vercel.json` | Rutas limpias, reescritura de `/f/<id>`, caché y cabeceras |

## Desarrollo
```bash
npm install
npm test                 # pruebas de las funciones de subida
python3 -m http.server   # solo la parte estática (las subidas necesitan Vercel)
```

Al cambiar `qr.css` o `main.js`, actualiza el `?v=` en `index.html` para que los navegadores descarguen la versión nueva.

## Publicación
Proyecto de Vercel `generador-de-qr-gratis`, conectado a este repositorio: cada cambio en `main` se publica solo. La variable `BLOB_READ_WRITE_TOKEN` la añade Vercel al conectar el almacén Blob.

## Google
1. En [Google Search Console](https://search.google.com/search-console) añade la propiedad `https://generador-de-qr-gratis.vercel.app/` (tipo «Prefijo de URL») y verifícala con la etiqueta HTML o el archivo que te dé Google.
2. En «Sitemaps», envía `sitemap.xml`.
3. En «Inspección de URLs», pide la indexación de la página principal.

## Créditos
- Motor de QR: [qr-code-styling](https://github.com/kozakdenys/qr-code-styling) 1.9.2 (MIT).
- Iconos: [Lucide](https://lucide.dev) (ISC). Logotipos de marca: [Simple Icons](https://simpleicons.org) (CC0); son marcas de sus dueños y se usan solo para identificar cada red.

## Publicidad
Los huecos para anuncios (`.ad-slot`) están en `index.html`, ocultos con `hidden`. Para activar AdSense, pega tu código dentro y quita el atributo. Antes, añade el aviso de cookies donde indica el comentario `TODO cookies` del `<head>`.
