import { test } from "node:test";
import assert from "node:assert/strict";
import { handleUpload, handleFile, NAME_RE, MAX_BYTES } from "../api/_lib/files.js";

const ORIGIN = "https://generador-de-qr-gratis.vercel.app";
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
const WEBP = Buffer.concat([Buffer.from("RIFF"), Buffer.from([0, 0, 0, 0]), Buffer.from("WEBPVP8 ")]);
const GIF = Buffer.from("GIF89a....");
const PDF = Buffer.from("%PDF-1.7\n...");

function uploadRequest(body, type, { origin = ORIGIN, method = "POST", length } = {}) {
  const headers = { host: "generador-de-qr-gratis.vercel.app", "content-type": type };
  if (origin) headers.origin = origin;
  if (length !== undefined) headers["content-length"] = String(length);
  return new Request(`${ORIGIN}/api/upload`, { method, headers, body: method === "POST" ? body : undefined });
}

function fakePut() {
  const calls = [];
  const put = async (pathname, body, options) => { calls.push({ pathname, body, options }); return { url: "https://x/" + pathname }; };
  return { put, calls };
}

for (const [label, body, type, ext, kind] of [
  ["PNG", PNG, "image/png", "png", "image"],
  ["JPG", JPG, "image/jpeg", "jpg", "image"],
  ["WebP", WEBP, "image/webp", "webp", "image"],
  ["GIF", GIF, "image/gif", "gif", "image"],
  ["PDF", PDF, "application/pdf", "pdf", "pdf"]
]) {
  test(`guarda un ${label} válido con nombre aleatorio y caché larga`, async () => {
    const { put, calls } = fakePut();
    const res = await handleUpload(uploadRequest(body, type), { put });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.match(data.name, NAME_RE);
    assert.ok(data.name.endsWith("." + ext));
    assert.equal(data.kind, kind);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].pathname, "f/" + data.name);
    assert.deepEqual(calls[0].body, body);
    assert.equal(calls[0].options.access, "public");
    assert.equal(calls[0].options.contentType, type);
    assert.equal(calls[0].options.addRandomSuffix, false);
    assert.equal(calls[0].options.cacheControlMaxAge, 31536000);
  });
}

test("los nombres no se repiten", async () => {
  const { put } = fakePut();
  const names = new Set();
  for (let i = 0; i < 50; i++) {
    const res = await handleUpload(uploadRequest(PNG, "image/png"), { put });
    names.add((await res.json()).name);
  }
  assert.equal(names.size, 50);
});

test("rechaza subidas desde otro sitio o sin origen", async () => {
  const { put, calls } = fakePut();
  const res = await handleUpload(uploadRequest(PNG, "image/png", { origin: "https://otro-sitio.com" }), { put });
  assert.equal(res.status, 403);
  assert.equal((await res.json()).code, "origin");
  assert.equal((await handleUpload(uploadRequest(PNG, "image/png", { origin: null }), { put })).status, 403);
  assert.equal(calls.length, 0);
});

test("rechaza métodos distintos de POST", async () => {
  const { put } = fakePut();
  assert.equal((await handleUpload(uploadRequest(null, "image/png", { method: "GET" }), { put })).status, 405);
});

test("rechaza formatos no permitidos", async () => {
  const { put, calls } = fakePut();
  for (const type of ["text/html", "image/svg+xml", "application/zip", ""]) {
    const res = await handleUpload(uploadRequest(Buffer.from("<html>"), type), { put });
    assert.equal(res.status, 415, type);
  }
  assert.equal(calls.length, 0);
});

test("rechaza archivos disfrazados (el contenido no coincide con el tipo)", async () => {
  const { put, calls } = fakePut();
  const res = await handleUpload(uploadRequest(Buffer.from("<script>alert(1)</script>"), "image/png"), { put });
  assert.equal(res.status, 415);
  assert.match((await res.json()).error, /imagen/);
  const res2 = await handleUpload(uploadRequest(PNG, "application/pdf"), { put });
  assert.equal(res2.status, 415);
  assert.equal(calls.length, 0);
});

test("rechaza archivos vacíos y demasiado grandes", async () => {
  const { put, calls } = fakePut();
  assert.equal((await handleUpload(uploadRequest(Buffer.alloc(0), "image/png"), { put })).status, 400);
  const big = Buffer.concat([PNG, Buffer.alloc(64)]);
  assert.equal((await handleUpload(uploadRequest(big, "image/png"), { put, maxBytes: 32 })).status, 413);
  assert.equal((await handleUpload(uploadRequest(PNG, "image/png", { length: MAX_BYTES + 1 }), { put })).status, 413);
  assert.equal(calls.length, 0);
});

test("si el almacenamiento falla, responde 502 con un mensaje claro", async () => {
  const put = async () => { throw new Error("store down"); };
  const original = console.error;
  console.error = () => {};
  try {
    const res = await handleUpload(uploadRequest(PNG, "image/png"), { put });
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.equal(body.code, "store");
    assert.match(body.error, /No se pudo guardar/);
  } finally {
    console.error = original;
  }
});

class NotFound extends Error {}
const blobs = {
  "f/AbCdEfGhIj12.png": { url: "https://store.public.blob.vercel-storage.com/f/AbCdEfGhIj12.png", downloadUrl: "https://store.public.blob.vercel-storage.com/f/AbCdEfGhIj12.png?download=1" }
};
const head = async (pathname) => { if (!blobs[pathname]) throw new NotFound(); return blobs[pathname]; };
const isNotFound = (e) => e instanceof NotFound;
const fileRequest = (qs) => new Request(`${ORIGIN}/api/file?${qs}`);

test("/f/<nombre> redirige al archivo con caché", async () => {
  const res = await handleFile(fileRequest("name=AbCdEfGhIj12.png"), { head, isNotFound });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get("location"), blobs["f/AbCdEfGhIj12.png"].url);
  assert.match(res.headers.get("cache-control"), /s-maxage=31536000/);
});

test("/f/<nombre>?dl=1 redirige a la descarga", async () => {
  const res = await handleFile(fileRequest("name=AbCdEfGhIj12.png&dl=1"), { head, isNotFound });
  assert.equal(res.headers.get("location"), blobs["f/AbCdEfGhIj12.png"].downloadUrl);
});

test("nombres inválidos o inexistentes dan 404 sin consultar el almacén por rutas raras", async () => {
  let asked = 0;
  const countingHead = async (p) => { asked++; return head(p); };
  for (const qs of ["name=../secret.png", "name=AbCdEfGhIj12.exe", "name=", "name=a.png", "name=AbCdEfGhIj12.png%2F..", ""]) {
    assert.equal((await handleFile(fileRequest(qs), { head: countingHead, isNotFound })).status, 404, qs);
  }
  assert.equal(asked, 0);
  assert.equal((await handleFile(fileRequest("name=ZZZZZZZZZZZZ.pdf"), { head, isNotFound })).status, 404);
});

test("si el almacén falla al leer, responde 502", async () => {
  const original = console.error;
  console.error = () => {};
  try {
    const res = await handleFile(fileRequest("name=AbCdEfGhIj12.png"), { head: async () => { throw new Error("boom"); }, isNotFound });
    assert.equal(res.status, 502);
  } finally {
    console.error = original;
  }
});
