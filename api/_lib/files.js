// Lógica compartida de subida y lectura de archivos (Imagen / PDF).
// Cada error lleva un `code` estable: la web lo traduce al idioma del visitante.
// Las funciones reciben `put` / `head` por parámetro para poder probarlas sin Vercel Blob.
import { randomBytes } from "node:crypto";

// Vercel limita el cuerpo de una petición a 4,5 MB: dejamos margen.
export const MAX_BYTES = 4 * 1024 * 1024;

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

// Solo aceptamos estos formatos, y comprobamos los primeros bytes del archivo
// para que nadie suba otra cosa disfrazada de imagen o PDF.
const TYPES = {
  "image/jpeg": { ext: "jpg", kind: "image", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", kind: "image", magic: (b) => b.subarray(0, 8).equals(PNG_SIGNATURE) },
  "image/webp": { ext: "webp", kind: "image", magic: (b) => b.toString("latin1", 0, 4) === "RIFF" && b.toString("latin1", 8, 12) === "WEBP" },
  "image/gif": { ext: "gif", kind: "image", magic: (b) => b.toString("latin1", 0, 4) === "GIF8" },
  "application/pdf": { ext: "pdf", kind: "pdf", magic: (b) => b.toString("latin1", 0, 5) === "%PDF-" }
};

// Nombre público del archivo: 12 caracteres aleatorios + extensión (imposible de adivinar).
export const NAME_RE = /^[A-Za-z0-9_-]{12}\.(jpg|png|webp|gif|pdf)$/;

const newId = () => randomBytes(9).toString("base64url");

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

// Solo aceptamos subidas hechas desde la propia web (mismo dominio).
export function isSameOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost;
  try { originHost = new URL(origin).host; } catch { return false; }
  const hosts = [request.headers.get("x-forwarded-host"), request.headers.get("host")];
  try { hosts.push(new URL(request.url).host); } catch { /* sin URL absoluta */ }
  return hosts.some((h) => h && h.toLowerCase() === originHost.toLowerCase());
}

export async function handleUpload(request, { put, maxBytes = MAX_BYTES, makeId = newId }) {
  if (request.method !== "POST") return json(405, { code: "method", error: "Método no permitido." });
  if (!isSameOrigin(request)) return json(403, { code: "origin", error: "Subida no permitida desde este sitio." });

  const type = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  const spec = TYPES[type];
  if (!spec) return json(415, { code: "type", error: "Solo se aceptan imágenes (JPG, PNG, WebP o GIF) y PDF." });

  const tooBig = { code: "too_large", error: "El archivo pesa demasiado: el máximo es 4 MB." };
  if (Number(request.headers.get("content-length") || 0) > maxBytes) return json(413, tooBig);

  const body = Buffer.from(await request.arrayBuffer());
  if (!body.length) return json(400, { code: "empty", error: "El archivo está vacío." });
  if (body.length > maxBytes) return json(413, tooBig);
  if (!spec.magic(body)) return json(415, { code: "mismatch", error: "El archivo no parece un " + (spec.kind === "pdf" ? "PDF" : "archivo de imagen") + " válido." });

  const name = `${makeId()}.${spec.ext}`;
  try {
    await put(`f/${name}`, body, {
      access: "public",
      contentType: type,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000
    });
  } catch (error) {
    console.error("[upload] no se pudo guardar", error);
    return json(502, { code: "store", error: "No se pudo guardar el archivo. Inténtalo otra vez en unos segundos." });
  }
  return json(201, { name, kind: spec.kind });
}

// /f/<nombre> → redirige al archivo guardado (con ?dl=1 fuerza la descarga).
export async function handleFile(request, { head, isNotFound }) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name") || "";
  const notFound = () => new Response("Archivo no encontrado", {
    status: 404,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=60" }
  });
  if (!NAME_RE.test(name)) return notFound();

  try {
    const blob = await head(`f/${name}`);
    const target = url.searchParams.get("dl") === "1" ? blob.downloadUrl : blob.url;
    return new Response(null, {
      status: 302,
      headers: { location: target, "cache-control": "public, max-age=3600, s-maxage=31536000" }
    });
  } catch (error) {
    if (isNotFound(error)) return notFound();
    console.error("[file] no se pudo leer", error);
    return new Response("No se pudo abrir el archivo. Inténtalo otra vez.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" }
    });
  }
}
