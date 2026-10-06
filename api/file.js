// GET /f/<nombre> (reescrito a /api/file?name=<nombre>) — abre el archivo guardado.
import { head, BlobNotFoundError } from "@vercel/blob";
import { handleFile } from "./_lib/files.js";

export function GET(request) {
  return handleFile(request, { head, isNotFound: (error) => error instanceof BlobNotFoundError });
}
