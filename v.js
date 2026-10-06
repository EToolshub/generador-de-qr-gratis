/* QR Gratis · visor de imágenes compartidas con un QR (/v?i=<nombre>).
   Habla el idioma del teléfono que escanea: español por defecto, inglés si el navegador está en inglés. */
(function () {
  "use strict";

  var NAME_RE = /^[A-Za-z0-9_-]{12}\.(jpg|png|webp|gif)$/;
  var EN = /^en\b/i.test(navigator.language || "");
  var TEXT = EN ? {
    lang: "en", title: "Shared image | QR Gratis", loading: "Loading image…",
    fail: "This image doesn't exist or is no longer available.", download: "Download image",
    made: "Want your own QR code? <b>Make one for free →</b>", home: "/en/", alt: "Image shared with a QR code"
  } : {
    lang: "es", title: "Imagen compartida | QR Gratis", loading: "Cargando imagen…",
    fail: "Esta imagen no existe o ya no está disponible.", download: "Descargar imagen",
    made: "¿Quieres tu propio QR? <b>Créalo gratis →</b>", home: "/", alt: "Imagen compartida con un código QR"
  };

  function boot() {
    var state = document.getElementById("v-state");
    var img = document.getElementById("v-img");
    var dl = document.getElementById("v-dl");
    var made = document.getElementById("v-made");
    var name = new URLSearchParams(location.search).get("i") || "";

    document.documentElement.lang = TEXT.lang;
    document.title = TEXT.title;
    state.textContent = TEXT.loading;
    dl.textContent = TEXT.download;
    made.innerHTML = TEXT.made;
    made.href = TEXT.home;
    img.alt = TEXT.alt;

    function fail() {
      state.textContent = TEXT.fail;
      state.hidden = false;
      img.hidden = true;
      dl.hidden = true;
    }

    if (!NAME_RE.test(name)) { fail(); return; }
    img.onload = function () { state.hidden = true; img.hidden = false; dl.hidden = false; };
    img.onerror = fail;
    img.src = "/f/" + name;
    dl.href = "/f/" + name + "?dl=1";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
