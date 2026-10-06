// POST /api/upload — guarda una imagen o PDF en Vercel Blob y devuelve su nombre público.
import { put } from "@vercel/blob";
import { handleUpload } from "./_lib/files.js";

export function POST(request) {
  return handleUpload(request, { put });
}
