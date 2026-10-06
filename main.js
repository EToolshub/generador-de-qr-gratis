/* QR Gratis · Generador de códigos QR — hecho por Pixolve Agency.
   Todo se calcula en el navegador; solo Imagen y PDF suben el archivo elegido.
   Textos en español e inglés según el atributo lang de la página. */
(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  var LANG = /^en/i.test(document.documentElement.lang) ? "en" : "es";

  var I18N = {
    es: {
      empty: {
        url: "Escribe tu enlace y tu QR aparecerá aquí",
        image: "Sube una imagen y tu QR aparecerá aquí",
        pdf: "Sube un PDF y tu QR aparecerá aquí",
        wifi: "Escribe el nombre de tu red WiFi",
        whatsapp: "Escribe tu número de WhatsApp",
        social: "Escribe tu usuario y tu QR aparecerá aquí",
        vcard: "Escribe al menos un nombre, teléfono o correo",
        location: "Escribe una dirección, un lugar o unas coordenadas",
        phone: "Escribe un número de teléfono",
        sms: "Escribe un número de teléfono",
        email: "Escribe el correo de destino",
        event: "Escribe el nombre y la fecha del evento",
        text: "Escribe tu texto y tu QR aparecerá aquí"
      },
      note: {
        notLink: "Esto no parece un enlace: el QR mostrará el texto tal cual.",
        longLink: "Es un enlace muy largo y el QR saldrá muy denso. Si puedes, usa uno más corto.",
        wifiNoPass: "Falta la contraseña. Si tu red no tiene, elige «Sin contraseña».",
        waCountry: "Revisa el número: tiene que llevar el código de país (por ejemplo 58 para Venezuela).",
        waZero: "El número empieza por 0. Pon primero el código de país y quita el 0 (58 412…, no 0412…).",
        socialUser: "Revisa el usuario: normalmente solo lleva letras, números, puntos y guiones.",
        phoneShort: "Revisa el número: parece incompleto.",
        emailBad: "Revisa el correo: parece incompleto.",
        eventEnd: "La hora de fin es anterior al inicio, así que usamos 1 hora de duración.",
        eventNoStart: "Falta la fecha y hora de inicio.",
        eventNoTitle: "Falta el nombre del evento.",
        contrastBad: "Hay poco contraste entre el código y el fondo, y muchas cámaras no lo leerán. Usa un código oscuro sobre fondo claro.",
        contrastInverted: "Código claro sobre fondo oscuro: casi todos los teléfonos lo leen, pero algunos antiguos no. Pruébalo antes de imprimir.",
        contrastLow: "El contraste es justo. Con un código más oscuro se leerá mejor con poca luz.",
        transparent: "Fondo transparente: ponlo sobre un fondo claro para que se pueda escanear.",
        logo: "Con logo en el centro usamos la corrección de errores máxima. Escanéalo con tu teléfono antes de imprimir.",
        dense: "Tu QR lleva mucha información y salió muy denso. Acorta el contenido o imprímelo grande."
      },
      errTooLong: "Demasiada información para un solo QR. Acorta el texto",
      errTooLongLogo: " o quita el logo.",
      errGeneric: "No se pudo crear el QR. Revisa lo que escribiste e inténtalo otra vez.",
      errBrowser: "Tu navegador no puede usar el generador. Actualízalo o prueba con Chrome, Safari o Firefox.",
      hintDefault: "Pruébalo con la cámara de tu teléfono antes de imprimirlo.",
      hintPrint: function (cm) { return "Imprime el código de <b>" + num(cm) + " × " + num(cm) + " cm</b> o más. Pruébalo con tu teléfono antes de imprimir."; },
      ariaPreview: "Vista previa del código QR: ",
      downloaded: "✓ QR descargado en ",
      downloadFail: "No se pudo descargar. Inténtalo otra vez.",
      copied: "✓ Imagen copiada, ya puedes pegarla",
      copyFail: "Tu navegador no dejó copiar. Usa «Descargar PNG».",
      shareFail: "No se pudo compartir. Usa «Descargar PNG».",
      shareTitle: "Código QR",
      linkCopied: "✓ Enlace copiado",
      linkFail: "No se pudo copiar el enlace.",
      uploaded: "✓ Archivo subido: tu QR está listo",
      logoAdded: "✓ Logo añadido",
      logoNotImage: "Ese archivo no es una imagen.",
      logoBig: "La imagen pesa demasiado (máx. 8 MB).",
      logoBad: "No se pudo leer esa imagen. Prueba con PNG o JPG.",
      logoLoadFail: "No se pudo cargar ese logo. Inténtalo otra vez.",
      preset: "Diseño aplicado. Ahora pon tu contenido.",
      up: {
        notImage: "Ese archivo no es una imagen.",
        notPdf: "Ese archivo no es un PDF.",
        pdfBig: function (size) { return "El PDF pesa " + size + " y el máximo es 4 MB. Comprímelo y vuelve a intentarlo."; },
        tooBig: function (size) { return "El archivo pesa " + size + " y el máximo es 4 MB."; },
        optimizing: "Optimizando la imagen…",
        preparing: "Preparando…",
        uploading: function (p) { return "Subiendo… " + p + " %"; },
        done: "✓ Guardado. Tu QR ya funciona.",
        unreadable: "No pudimos leer esa imagen. Prueba con JPG o PNG.",
        prepFail: "No pudimos preparar la imagen. Prueba con otra.",
        offline: "Sin conexión. Revisa tu internet e inténtalo otra vez.",
        failed: function (status) { return "No se pudo subir el archivo (error " + status + "). Inténtalo otra vez."; },
        codes: {
          origin: "Solo se pueden subir archivos desde esta web.",
          type: "Solo se aceptan imágenes (JPG, PNG, WebP o GIF) y PDF.",
          too_large: "El archivo pesa demasiado: el máximo es 4 MB.",
          empty: "El archivo está vacío.",
          mismatch: "El archivo no parece válido. Prueba con otro.",
          store: "No se pudo guardar el archivo. Inténtalo otra vez en unos segundos."
        }
      },
      miniSub: function (px) { return "PNG · " + px + " px"; },
      fn: { link: "enlace", image: "imagen", pdf: "pdf", file: "archivo", wifi: "wifi", net: "red", whatsapp: "whatsapp", profile: "perfil", contact: "contacto", card: "tarjeta", location: "ubicacion", map: "mapa", phone: "telefono", sms: "sms", email: "correo", event: "evento", text: "texto" }
    },
    en: {
      empty: {
        url: "Type your link and your QR code will show up here",
        image: "Upload an image and your QR code will show up here",
        pdf: "Upload a PDF and your QR code will show up here",
        wifi: "Type your WiFi network name",
        whatsapp: "Type your WhatsApp number",
        social: "Type your username and your QR code will show up here",
        vcard: "Type at least a name, phone or email",
        location: "Type an address, a place or coordinates",
        phone: "Type a phone number",
        sms: "Type a phone number",
        email: "Type the email address",
        event: "Type the event name and start date",
        text: "Type your text and your QR code will show up here"
      },
      note: {
        notLink: "This doesn't look like a link, so the QR code will show the text as is.",
        longLink: "That's a very long link and the QR code will be very dense. Use a shorter one if you can.",
        wifiNoPass: "The password is missing. If your network has none, choose “No password”.",
        waCountry: "Check the number: it needs the country code (for example 1 for the US).",
        waZero: "The number starts with 0. Put the country code first and drop the leading 0.",
        socialUser: "Check the username: it usually only has letters, numbers, dots and dashes.",
        phoneShort: "Check the number: it looks incomplete.",
        emailBad: "Check the email: it looks incomplete.",
        eventEnd: "The end time is before the start, so we used a 1-hour duration.",
        eventNoStart: "The start date and time are missing.",
        eventNoTitle: "The event name is missing.",
        contrastBad: "There's too little contrast between the code and the background, and many cameras won't read it. Use a dark code on a light background.",
        contrastInverted: "Light code on a dark background: most phones read it, but some older ones don't. Test it before printing.",
        contrastLow: "The contrast is borderline. A darker code will scan better in low light.",
        transparent: "Transparent background: place it on a light background so it can be scanned.",
        logo: "With a logo in the middle we use the highest error correction. Scan it with your phone before printing.",
        dense: "Your QR code carries a lot of data and came out very dense. Shorten the content or print it large."
      },
      errTooLong: "Too much data for a single QR code. Shorten the text",
      errTooLongLogo: " or remove the logo.",
      errGeneric: "We couldn't create the QR code. Check what you typed and try again.",
      errBrowser: "Your browser can't run the generator. Update it or try Chrome, Safari or Firefox.",
      hintDefault: "Test it with your phone camera before printing.",
      hintPrint: function (cm) { return "Print the code at least <b>" + num(cm) + " × " + num(cm) + " cm (" + num(Math.round(cm / 0.254) / 10) + " in)</b>. Test it with your phone before printing."; },
      ariaPreview: "QR code preview: ",
      downloaded: "✓ QR code downloaded as ",
      downloadFail: "The download failed. Please try again.",
      copied: "✓ Image copied, you can paste it now",
      copyFail: "Your browser didn't allow copying. Use “Download PNG”.",
      shareFail: "Sharing failed. Use “Download PNG”.",
      shareTitle: "QR code",
      linkCopied: "✓ Link copied",
      linkFail: "Couldn't copy the link.",
      uploaded: "✓ File uploaded: your QR code is ready",
      logoAdded: "✓ Logo added",
      logoNotImage: "That file isn't an image.",
      logoBig: "That image is too large (max. 8 MB).",
      logoBad: "We couldn't read that image. Try a PNG or JPG.",
      logoLoadFail: "We couldn't load that logo. Please try again.",
      preset: "Design applied. Now add your content.",
      up: {
        notImage: "That file isn't an image.",
        notPdf: "That file isn't a PDF.",
        pdfBig: function (size) { return "The PDF is " + size + " and the limit is 4 MB. Compress it and try again."; },
        tooBig: function (size) { return "The file is " + size + " and the limit is 4 MB."; },
        optimizing: "Optimizing the image…",
        preparing: "Getting ready…",
        uploading: function (p) { return "Uploading… " + p + "%"; },
        done: "✓ Saved. Your QR code works now.",
        unreadable: "We couldn't read that image. Try a JPG or PNG.",
        prepFail: "We couldn't prepare that image. Try another one.",
        offline: "You're offline. Check your connection and try again.",
        failed: function (status) { return "The upload failed (error " + status + "). Please try again."; },
        codes: {
          origin: "Files can only be uploaded from this website.",
          type: "Only images (JPG, PNG, WebP or GIF) and PDFs are accepted.",
          too_large: "The file is too large: the limit is 4 MB.",
          empty: "The file is empty.",
          mismatch: "The file doesn't look valid. Try another one.",
          store: "We couldn't save the file. Try again in a few seconds."
        }
      },
      miniSub: function (px) { return "PNG · " + px + " px"; },
      fn: { link: "link", image: "image", pdf: "pdf", file: "file", wifi: "wifi", net: "network", whatsapp: "whatsapp", profile: "profile", contact: "contact", card: "card", location: "location", map: "map", phone: "phone", sms: "sms", email: "email", event: "event", text: "text" }
    }
  };
  var T = I18N[LANG];

  function num(n) { return LANG === "es" ? String(n).replace(".", ",") : String(n); }

  // Dirección pública que llevan los QR de Imagen y PDF (en local, la del servidor de pruebas).
  var SITE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? location.origin : "https://generador-de-qr-gratis.vercel.app";

  // Un preset de forma = las tres opciones de la librería a la vez.
  var STYLES = {
    clasico:    { dots: "square",         corners: "square",        cornerDot: "square" },
    redondeado: { dots: "rounded",        corners: "extra-rounded", cornerDot: "dot" },
    puntos:     { dots: "dots",           corners: "dot",           cornerDot: "dot" },
    elegante:   { dots: "classy-rounded", corners: "extra-rounded", cornerDot: "square" }
  };
  var SOCIAL = {
    instagram: "https://instagram.com/",
    tiktok: "https://www.tiktok.com/@",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/@",
    x: "https://x.com/",
    telegram: "https://t.me/",
    linkedin: "https://www.linkedin.com/in/",
    threads: "https://www.threads.net/@"
  };
  // Logos genéricos que toman el color del código (el resto son logotipos de marca con sus colores).
  var LOGO_TINT = { wifi: true, "map-pin": true, utensils: true, "shopping-bag": true };
  // Vista previa en canvas a alta resolución: el SVG reducido deja finas líneas blancas entre módulos.
  var PREVIEW_PX = 800;
  var UPLOAD_MAX = 4 * 1024 * 1024;
  var FONT = "Inter, 'Segoe UI', Arial, sans-serif";

  var state = {
    type: "url",
    style: "clasico",
    fg: "#0b0b0c",
    bg: "#ffffff",
    transparent: false,
    frame: "",          // "" | texto del marco | "custom"
    logo: null,         // dataURL PNG de la imagen central
    logoKind: "",       // "" | "preset" | "file"
    logoId: "",         // id del logo de la galería (whatsapp, wifi…)
    fileLogo: null,     // último logo subido (se conserva para volver a él)
    size: 1024,
    payload: "",
    name: "qr",
    modules: 0,
    uploads: { image: null, pdf: null }
  };

  var card = null;
  var renderGen = 0;
  var logoGen = 0;
  var uploadGen = { image: 0, pdf: 0 };

  // ---------- Utilidades ----------
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }

  // La librería escribe cada carácter como un byte (Latin-1): pasamos el texto
  // ya codificado en UTF-8 para que ñ, tildes, € y emojis se lean bien.
  function utf8(str) {
    var bytes = new TextEncoder().encode(str), out = "";
    for (var i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i]);
    return out;
  }

  function slug(str) {
    return String(str || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  }

  function escapeXml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c];
    });
  }

  function mb(bytes) { return num((bytes / 1048576).toFixed(1)) + " MB"; }

  function toast(text) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.classList.remove("show"); }, 2400);
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] falló:", e); }
  }

  function toBlob(canvas, type, quality) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, type, quality); });
  }

  function blobToImage(blob) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(blob), img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("imagen ilegible")); };
      img.src = url;
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (_) {}
      ta.remove();
      if (ok) resolve(); else reject(new Error("copy"));
    });
  }

  // ---------- Contenido → texto del QR ----------
  function normalizeUrl(raw) {
    if (!raw) return "";
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw;               // ya trae https:, mailto:, tel:…
    if (/^[^\s]+\.[^\s]{2,}$/.test(raw)) return "https://" + raw;  // dominio suelto
    return raw;
  }

  function cleanPhone(raw) {
    var t = String(raw || "").trim(), digits = t.replace(/\D/g, "");
    return digits ? (t.charAt(0) === "+" ? "+" : "") + digits : "";
  }

  function escWifi(s) { return s.replace(/([\\;,:"])/g, "\\$1"); }
  function escVcard(s) { return s.replace(/\\/g, "\\\\").replace(/([;,])/g, "\\$1"); }
  function escIcs(s) { return s.replace(/\\/g, "\\\\").replace(/([;,])/g, "\\$1").replace(/\r?\n/g, "\\n"); }

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function icsLocal(d) {
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "T" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  }

  function buildPayload() {
    var t = state.type, out = { text: "", name: "qr", notes: [] }, fn = T.fn, note = T.note;
    if (t === "url") {
      var raw = val("f-url"), url = normalizeUrl(raw);
      out.text = url;
      if (url) {
        var host = "";
        try { host = new URL(url).hostname.replace(/^www\./, ""); } catch (_) {}
        out.name = "qr-" + (slug(host) || slug(raw) || fn.link);
        if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) out.notes.push(["info", note.notLink]);
        else if (url.length > 300) out.notes.push(["warn", note.longLink]);
      }
    } else if (t === "image" || t === "pdf") {
      var up = state.uploads[t];
      if (up && up.name) {
        out.text = t === "image" ? SITE + "/v?i=" + up.name : SITE + "/f/" + up.name;
        out.name = "qr-" + fn[t] + "-" + (slug(up.fileName.replace(/\.[^.]+$/, "")) || fn.file);
      }
    } else if (t === "wifi") {
      var ssid = val("f-ssid"), pass = $("#f-pass").value, sec = $("#f-sec").value, hidden = $("#f-hidden").checked;
      if (ssid) {
        out.text = "WIFI:T:" + sec + ";S:" + escWifi(ssid) + ";" +
          (sec !== "nopass" ? "P:" + escWifi(pass) + ";" : "") +
          (hidden ? "H:true;" : "") + ";";
        out.name = "qr-wifi-" + (slug(ssid) || fn.net);
        if (sec !== "nopass" && !pass) out.notes.push(["warn", note.wifiNoPass]);
      }
      $("#f-pass").disabled = sec === "nopass";
    } else if (t === "whatsapp") {
      var digits = val("f-wa").replace(/\D/g, "").replace(/^00/, ""), msg = val("f-wa-msg");
      if (digits) {
        out.text = "https://wa.me/" + digits + (msg ? "?text=" + encodeURIComponent(msg) : "");
        out.name = "qr-whatsapp-" + digits.slice(-4);
        if (digits.length < 8 || digits.length > 15) out.notes.push(["warn", note.waCountry]);
        else if (/^0/.test(digits)) out.notes.push(["warn", note.waZero]);
      }
    } else if (t === "social") {
      var net = $("#f-net").value, user = val("f-user");
      if (user) {
        if (/^https?:\/\//i.test(user) || /\.[a-z]{2,}\//i.test(user)) {
          out.text = normalizeUrl(user);
        } else {
          var handle = user.replace(/^@+/, "").replace(/\s+/g, "");
          if (handle) out.text = SOCIAL[net] + handle;
          if (/[^A-Za-z0-9._-]/.test(handle)) out.notes.push(["warn", note.socialUser]);
        }
        out.name = "qr-" + net + "-" + (slug(user.replace(/^@+/, "")) || fn.profile);
      }
    } else if (t === "vcard") {
      var name = val("f-vc-name"), tel = val("f-vc-tel"), mail = val("f-vc-mail"), org = val("f-vc-org"), web = normalizeUrl(val("f-vc-web"));
      if (name || tel || mail) {
        var parts = name.split(/\s+/), last = parts.length > 1 ? parts.pop() : "", first = parts.join(" ");
        var lines = ["BEGIN:VCARD", "VERSION:3.0", "N:" + escVcard(last) + ";" + escVcard(first) + ";;;", "FN:" + escVcard(name || tel || mail)];
        if (org) lines.push("ORG:" + escVcard(org));
        if (tel) lines.push("TEL;TYPE=CELL:" + cleanPhone(tel));
        if (mail) lines.push("EMAIL:" + mail);
        if (web) lines.push("URL:" + web);
        lines.push("END:VCARD");
        out.text = lines.join("\r\n");
        out.name = "qr-" + fn.contact + "-" + (slug(name) || fn.card);
      }
    } else if (t === "location") {
      var loc = val("f-loc");
      if (loc) {
        var coords = loc.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
        out.text = /^https?:\/\//i.test(loc)
          ? loc
          : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(coords ? coords[1] + "," + coords[2] : loc);
        out.name = "qr-" + fn.location + "-" + (slug(loc) || fn.map);
      }
    } else if (t === "phone") {
      var phone = cleanPhone(val("f-tel"));
      if (phone) {
        out.text = "tel:" + phone;
        out.name = "qr-" + fn.phone + "-" + phone.slice(-4);
        if (phone.replace("+", "").length < 7) out.notes.push(["warn", note.phoneShort]);
      }
    } else if (t === "sms") {
      var smsTo = cleanPhone(val("f-sms"));
      if (smsTo) {
        out.text = "SMSTO:" + smsTo + ":" + val("f-sms-msg");
        out.name = "qr-sms-" + smsTo.slice(-4);
        if (smsTo.replace("+", "").length < 7) out.notes.push(["warn", note.phoneShort]);
      }
    } else if (t === "email") {
      var to = val("f-mail"), sub = val("f-mail-sub"), body = val("f-mail-body"), q = [];
      if (to) {
        if (sub) q.push("subject=" + encodeURIComponent(sub));
        if (body) q.push("body=" + encodeURIComponent(body));
        out.text = "mailto:" + to + (q.length ? "?" + q.join("&") : "");
        out.name = "qr-" + fn.email + "-" + (slug(to.split("@")[0]) || fn.contact);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) out.notes.push(["warn", note.emailBad]);
      }
    } else if (t === "event") {
      var title = val("f-ev-title"), startRaw = $("#f-ev-start").value, endRaw = $("#f-ev-end").value;
      var start = startRaw ? new Date(startRaw) : null, end = endRaw ? new Date(endRaw) : null;
      if (title && start && !isNaN(start)) {
        if (!end || isNaN(end) || end <= start) {
          if (end && end <= start) out.notes.push(["warn", note.eventEnd]);
          end = new Date(start.getTime() + 3600000);
        }
        var ev = ["BEGIN:VEVENT", "SUMMARY:" + escIcs(title), "DTSTART:" + icsLocal(start), "DTEND:" + icsLocal(end)];
        if (val("f-ev-loc")) ev.push("LOCATION:" + escIcs(val("f-ev-loc")));
        if (val("f-ev-desc")) ev.push("DESCRIPTION:" + escIcs(val("f-ev-desc")));
        ev.push("END:VEVENT");
        out.text = ev.join("\r\n");
        out.name = "qr-" + fn.event + "-" + (slug(title) || fn.event);
      } else if (title || startRaw) {
        out.notes.push(["info", title ? note.eventNoStart : note.eventNoTitle]);
      }
    } else if (t === "text") {
      var txt = $("#f-text").value;
      $("#text-count").textContent = String(txt.length);
      if (txt.trim()) { out.text = txt; out.name = "qr-" + (slug(txt.split(/\s+/).slice(0, 4).join(" ")) || fn.text); }
    }
    return out;
  }

  // ---------- Opciones de la librería ----------
  function qrOptions(size, type) {
    var st = STYLES[state.style] || STYLES.clasico;
    var opts = {
      width: size,
      height: size,
      type: type,
      data: utf8(state.payload),
      margin: Math.round(size * 0.06),
      qrOptions: { errorCorrectionLevel: state.logo ? "H" : "M" },
      // En SVG clásico, bordes nítidos (crispEdges) para que no aparezcan uniones entre cuadrados.
      dotsOptions: { type: st.dots, color: state.fg, roundSize: !(type === "svg" && state.style === "clasico") },
      cornersSquareOptions: { type: st.corners, color: state.fg },
      cornersDotOptions: { type: st.cornerDot, color: state.fg },
      backgroundOptions: { color: state.transparent ? "transparent" : state.bg },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.36, margin: Math.round(size * 0.008), saveAsBlob: true }
    };
    if (state.logo) opts.image = state.logo;
    return opts;
  }

  function rasterQr(inst) { return inst.getRawData("png").then(blobToImage); }

  // ---------- Marco con texto ----------
  function frameText() {
    return state.frame === "custom" ? val("f-frame-text") : state.frame;
  }

  // Medidas del marco para un ancho W: borde, franja de texto, alto total y radios.
  function frameGeometry(W) {
    var b = Math.round(W * 0.035), band = Math.round(W * 0.17);
    return { b: b, band: band, H: W + band - b, r: Math.round(W * 0.06), ri: Math.round(W * 0.035), inner: W - 2 * b };
  }

  var measureCtx = null;
  function fitFontPx(text, maxWidth, startPx) {
    if (!measureCtx) measureCtx = document.createElement("canvas").getContext("2d");
    var px = startPx;
    for (; px > 10; px -= 2) {
      measureCtx.font = "800 " + px + "px " + FONT;
      if (measureCtx.measureText(text).width <= maxWidth) break;
    }
    return px;
  }

  function roundRectPath(x, y, w, h, r) {
    return "M" + (x + r) + " " + y + "H" + (x + w - r) + "A" + r + " " + r + " 0 0 1 " + (x + w) + " " + (y + r) +
      "V" + (y + h - r) + "A" + r + " " + r + " 0 0 1 " + (x + w - r) + " " + (y + h) +
      "H" + (x + r) + "A" + r + " " + r + " 0 0 1 " + x + " " + (y + h - r) +
      "V" + (y + r) + "A" + r + " " + r + " 0 0 1 " + (x + r) + " " + y + "Z";
  }

  function canvasRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Dibuja el QR (y el marco, si hay) en un canvas de ancho W. Lo usan la vista previa y el PNG.
  function composeCanvas(qrImg, W) {
    var text = frameText(), c = document.createElement("canvas"), x;
    if (!text) {
      c.width = c.height = W;
      c.getContext("2d").drawImage(qrImg, 0, 0, W, W);
      return c;
    }
    var g = frameGeometry(W);
    c.width = W;
    c.height = g.H;
    x = c.getContext("2d");
    x.fillStyle = state.fg;
    canvasRoundRect(x, 0, 0, W, g.H, g.r);
    x.fill();
    x.save();
    canvasRoundRect(x, g.b, g.b, g.inner, g.inner, g.ri);
    x.clip();
    if (state.transparent) x.clearRect(g.b, g.b, g.inner, g.inner);
    else { x.fillStyle = state.bg; x.fillRect(g.b, g.b, g.inner, g.inner); }
    x.drawImage(qrImg, g.b, g.b, g.inner, g.inner);
    x.restore();
    var px = fitFontPx(text, W * 0.84, Math.round(g.band * 0.46));
    x.font = "800 " + px + "px " + FONT;
    x.fillStyle = state.transparent ? "#ffffff" : state.bg;
    x.textAlign = "center";
    x.textBaseline = "alphabetic";
    x.fillText(text, W / 2, (W - g.b + g.H) / 2 + px * 0.35);
    return c;
  }

  // ---------- Avisos de legibilidad ----------
  function luminance(hex) {
    var n = parseInt(hex.slice(1), 16), rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    var lin = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  }

  function renderWarnings(notes) {
    var list = notes.slice(), note = T.note;
    var lf = luminance(state.fg), lb = luminance(state.transparent ? "#ffffff" : state.bg);
    var ratio = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
    if (ratio < 3) list.push(["bad", note.contrastBad]);
    else if (lf > lb) list.push(["warn", note.contrastInverted]);
    else if (ratio < 4.5) list.push(["warn", note.contrastLow]);
    if (state.transparent) list.push(["info", note.transparent]);
    if (state.logo && state.payload) list.push(["info", note.logo]);
    if (state.modules >= 61) list.push(["warn", note.dense]);
    $("#warnings").innerHTML = list.map(function (w) {
      var li = document.createElement("li");
      li.className = w[0];
      li.textContent = w[1];
      return li.outerHTML;
    }).join("");
  }

  function minPrintCm(modules) {
    // ~0,5 mm por módulo (incluido el margen) es un mínimo cómodo para cualquier cámara.
    var cm = (modules + 8) * 0.05;
    return Math.max(2, Math.ceil(cm * 2) / 2);
  }

  // ---------- Render ----------
  function setState(name) {
    card.setAttribute("data-state", name);
    var ready = name === "ready";
    $$("[data-dl], #copy-img, #share-img").forEach(function (b) {
      if (b.closest(".mini-bar")) return;
      b.disabled = !ready;
    });
    updateMiniBar();
  }

  function render() {
    var p = buildPayload();
    state.payload = p.text;
    state.name = p.name;
    $("#empty-msg").textContent = T.empty[state.type] || T.empty.url;

    if (!state.payload) {
      renderGen++;
      state.modules = 0;
      setState("empty");
      renderWarnings(p.notes);
      $("#dl-hint").textContent = T.hintDefault;
      return;
    }

    var inst;
    try {
      inst = new window.QRCodeStyling(qrOptions(PREVIEW_PX, "canvas"));
    } catch (e) {
      renderGen++;
      state.modules = 0;
      var tooLong = /overflow|length/i.test(String(e && e.message || e));
      $("#preview-error").textContent = tooLong ? T.errTooLong + (state.logo ? T.errTooLongLogo : ".") : T.errGeneric;
      setState("error");
      if (!tooLong) console.warn("[render]", e);
      renderWarnings(p.notes);
      return;
    }

    state.modules = inst._qr && inst._qr.getModuleCount ? inst._qr.getModuleCount() : 0;
    setState("ready");
    var typeLabel = $('input[name="type"]:checked + span');
    $("#qr-box").setAttribute("aria-label", T.ariaPreview + (typeLabel ? typeLabel.textContent.trim() : state.type));
    $("#dl-hint").innerHTML = T.hintPrint(state.modules ? minPrintCm(state.modules) : 2);

    var gen = ++renderGen;
    rasterQr(inst).then(function (img) {
      if (gen !== renderGen) return;
      drawPreview(img);
    }).catch(function (e) { console.warn("[preview]", e); });
    renderWarnings(p.notes);
  }

  function drawPreview(img) {
    var out = composeCanvas(img, PREVIEW_PX), cv = $("#qr-canvas"), x = cv.getContext("2d");
    cv.width = out.width;
    cv.height = out.height;
    x.clearRect(0, 0, cv.width, cv.height);
    x.drawImage(out, 0, 0);
    $("#qr-box").classList.toggle("is-transparent", state.transparent);
    syncMiniThumb();
  }

  var renderSoon = debounce(function () { safe(render, "render"); }, 130);

  // ---------- Descargas ----------
  function exportPng(size) {
    var text = frameText(), inner = text ? frameGeometry(size).inner : size;
    return rasterQr(new window.QRCodeStyling(qrOptions(inner, "canvas"))).then(function (img) {
      return toBlob(composeCanvas(img, size), "image/png");
    });
  }

  // «transparent» no es un color SVG 1.1: algunos programas de diseño lo pintan negro.
  function svgSafe(svgText) { return svgText.replace(/fill="transparent"/g, 'fill="none"'); }

  function exportSvg(W) {
    var text = frameText();
    if (!text) {
      return new window.QRCodeStyling(qrOptions(W, "svg")).getRawData("svg").then(function (blob) {
        return blob.text();
      }).then(function (svgText) {
        return new Blob([svgSafe(svgText)], { type: "image/svg+xml" });
      });
    }
    var g = frameGeometry(W);
    return new window.QRCodeStyling(qrOptions(g.inner, "svg")).getRawData("svg").then(function (blob) {
      return blob.text();
    }).then(function (svgText) {
      var qr = new DOMParser().parseFromString(svgSafe(svgText), "image/svg+xml").documentElement;
      qr.setAttribute("x", g.b);
      qr.setAttribute("y", g.b);
      qr.setAttribute("width", g.inner);
      qr.setAttribute("height", g.inner);
      var px = fitFontPx(text, W * 0.84, Math.round(g.band * 0.46));
      var holePath = roundRectPath(g.b, g.b, g.inner, g.inner, g.ri);
      var svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + W + '" height="' + g.H + '" viewBox="0 0 ' + W + " " + g.H + '">',
        '<defs><clipPath id="qrg-inner"><path d="' + holePath + '"/></clipPath></defs>',
        '<path fill-rule="evenodd" fill="' + state.fg + '" d="' + roundRectPath(0, 0, W, g.H, g.r) + holePath + '"/>',
        state.transparent ? "" : '<path fill="' + state.bg + '" d="' + holePath + '"/>',
        '<g clip-path="url(#qrg-inner)">' + new XMLSerializer().serializeToString(qr) + "</g>",
        '<text x="' + W / 2 + '" y="' + ((W - g.b + g.H) / 2 + px * 0.35).toFixed(1) + '" text-anchor="middle" font-family="' + escapeXml(FONT) +
          '" font-weight="800" font-size="' + px + '" fill="' + (state.transparent ? "#ffffff" : state.bg) + '">' + escapeXml(text) + "</text>",
        "</svg>"
      ].join("");
      return new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + svg], { type: "image/svg+xml" });
    });
  }

  function saveBlob(blob, filename) {
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  function download(ext) {
    if (!state.payload || card.getAttribute("data-state") !== "ready") return;
    var size = ext === "svg" ? 1024 : state.size;
    (ext === "svg" ? exportSvg(size) : exportPng(size)).then(function (blob) {
      saveBlob(blob, state.name + (ext === "png" ? "-" + size : "") + "." + ext);
      toast(T.downloaded + ext.toUpperCase());
    }).catch(function (e) {
      console.warn("[download]", e);
      toast(T.downloadFail);
    });
  }

  function initDownloads() {
    $$("[data-dl]").forEach(function (b) {
      b.addEventListener("click", function () { download(b.getAttribute("data-dl")); });
    });

    var copyBtn = $("#copy-img");
    if (navigator.clipboard && window.ClipboardItem && window.isSecureContext) {
      copyBtn.hidden = false;
      copyBtn.addEventListener("click", function () {
        if (!state.payload) return;
        // Safari exige pasar la promesa directamente a ClipboardItem dentro del clic.
        var item = new window.ClipboardItem({ "image/png": exportPng(1024) });
        navigator.clipboard.write([item]).then(function () { toast(T.copied); }).catch(function () { toast(T.copyFail); });
      });
    }

    var shareBtn = $("#share-img");
    var probe = null;
    try { probe = new File([new Blob(["x"], { type: "image/png" })], "qr.png", { type: "image/png" }); } catch (_) {}
    if (probe && navigator.canShare && navigator.share && navigator.canShare({ files: [probe] })) {
      shareBtn.hidden = false;
      shareBtn.addEventListener("click", function () {
        if (!state.payload) return;
        exportPng(1024).then(function (blob) {
          var file = new File([blob], state.name + ".png", { type: "image/png" });
          return navigator.share({ files: [file], title: T.shareTitle });
        }).catch(function (e) {
          if (e && e.name === "AbortError") return;
          toast(T.shareFail);
        });
      });
    }
  }

  // ---------- Subida de archivos (Imagen / PDF) ----------
  function uploadUi(kind) {
    var box = $('[data-upload="' + kind + '"]');
    return {
      box: box,
      drop: $('[data-drop="' + kind + '"]'),
      name: $(".up-name", box),
      status: $(".up-status", box),
      bar: $(".up-bar span", box),
      thumb: $(".up-thumb", box),
      copy: $('[data-copy-link="' + kind + '"]')
    };
  }

  function setUpload(kind, status, text, pct, fileName) {
    var ui = uploadUi(kind);
    ui.box.hidden = false;
    ui.box.setAttribute("data-status", status);
    ui.drop.hidden = status !== "error";
    if (fileName != null) ui.name.textContent = fileName;
    ui.status.textContent = text;
    ui.bar.style.width = (pct || 0) + "%";
    ui.copy.hidden = status !== "done";
  }

  // Reducimos y comprimimos fotos grandes para que el QR abra rápido en cualquier teléfono.
  function prepareImage(file) {
    if (file.type === "image/gif") return Promise.resolve(file); // conserva la animación
    return blobToImage(file).catch(function () { throw new Error(T.up.unreadable); }).then(function (img) {
      var w = img.naturalWidth, h = img.naturalHeight, max = 2000;
      var webSafe = /^image\/(jpeg|png|webp)$/.test(file.type);
      if (webSafe && file.size <= 1.5 * 1048576 && Math.max(w, h) <= max) return file;
      var k = Math.min(1, max / Math.max(w, h));
      var c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(w * k));
      c.height = Math.max(1, Math.round(h * k));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      return toBlob(c, "image/webp", 0.86).then(function (webp) {
        if (webp && webp.type === "image/webp") return webp;
        // Navegadores sin WebP: JPEG sobre fondo blanco.
        var j = document.createElement("canvas"), jx = j.getContext("2d");
        j.width = c.width;
        j.height = c.height;
        jx.fillStyle = "#ffffff";
        jx.fillRect(0, 0, j.width, j.height);
        jx.drawImage(c, 0, 0);
        return toBlob(j, "image/jpeg", 0.86);
      });
    });
  }

  function sendFile(blob, onProgress) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      xhr.setRequestHeader("Content-Type", blob.type);
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = function () {
        var data = null;
        try { data = JSON.parse(xhr.responseText); } catch (_) {}
        if (xhr.status === 201 && data && data.name) resolve(data);
        else reject(new Error((data && T.up.codes[data.code]) || T.up.failed(xhr.status)));
      };
      xhr.onerror = function () { reject(new Error(T.up.offline)); };
      xhr.send(blob);
    });
  }

  function uploadFile(kind, file) {
    if (!file) return;
    var gen = ++uploadGen[kind], ui = uploadUi(kind);
    state.uploads[kind] = null;
    safe(render, "render");

    var isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (kind === "image" ? !/^image\//.test(file.type) : !isPdf) {
      setUpload(kind, "error", kind === "image" ? T.up.notImage : T.up.notPdf, 0, file.name);
      return;
    }
    if (kind === "pdf" && file.size > UPLOAD_MAX) {
      setUpload(kind, "error", T.up.pdfBig(mb(file.size)), 0, file.name);
      return;
    }
    if (kind === "image") ui.thumb.style.backgroundImage = "";
    setUpload(kind, "uploading", kind === "image" ? T.up.optimizing : T.up.preparing, 3, file.name);

    var prepared = kind === "image"
      ? prepareImage(file)
      : Promise.resolve(file.type === "application/pdf" ? file : new Blob([file], { type: "application/pdf" }));

    prepared.then(function (blob) {
      if (gen !== uploadGen[kind]) return null;
      if (!blob) throw new Error(T.up.prepFail);
      if (blob.size > UPLOAD_MAX) throw new Error(T.up.tooBig(mb(blob.size)));
      if (kind === "image") {
        if (ui.thumb.dataset.url) URL.revokeObjectURL(ui.thumb.dataset.url);
        ui.thumb.dataset.url = URL.createObjectURL(blob);
        ui.thumb.style.backgroundImage = "url(" + ui.thumb.dataset.url + ")";
      }
      setUpload(kind, "uploading", T.up.uploading(0), 5);
      return sendFile(blob, function (pct) {
        if (gen === uploadGen[kind]) setUpload(kind, "uploading", T.up.uploading(pct), Math.max(5, pct));
      });
    }).then(function (res) {
      if (!res || gen !== uploadGen[kind]) return;
      state.uploads[kind] = { name: res.name, fileName: file.name };
      setUpload(kind, "done", T.up.done, 100);
      safe(render, "render");
      toast(T.uploaded);
    }).catch(function (e) {
      if (gen !== uploadGen[kind]) return;
      setUpload(kind, "error", (e && e.message) || T.up.failed(0), 0);
    });
  }

  function initUploads() {
    $$("[data-file]").forEach(function (input) {
      var kind = input.getAttribute("data-file");
      input.addEventListener("change", function () {
        var f = input.files && input.files[0];
        input.value = "";
        uploadFile(kind, f);
      });
    });
    $$("[data-drop]").forEach(function (zone) {
      var kind = zone.getAttribute("data-drop");
      zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-over"); });
      zone.addEventListener("dragleave", function () { zone.classList.remove("is-over"); });
      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        zone.classList.remove("is-over");
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        uploadFile(kind, f);
      });
    });
    $$("[data-change]").forEach(function (b) {
      b.addEventListener("click", function () { $('[data-file="' + b.getAttribute("data-change") + '"]').click(); });
    });
    $$("[data-copy-link]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!state.payload) return;
        copyText(state.payload).then(function () { toast(T.linkCopied); }, function () { toast(T.linkFail); });
      });
    });
    // Pegar una imagen (Ctrl+V) cuando el tipo elegido es Imagen.
    document.addEventListener("paste", function (e) {
      if (state.type !== "image") return;
      var items = (e.clipboardData && e.clipboardData.files) || [];
      for (var i = 0; i < items.length; i++) {
        if (/^image\//.test(items[i].type)) { e.preventDefault(); uploadFile("image", items[i]); return; }
      }
    });
  }

  // ---------- Controles ----------
  function showFields() {
    $$("[data-fields]").forEach(function (box) { box.hidden = box.getAttribute("data-fields") !== state.type; });
  }

  function initType() {
    $$('input[name="type"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        state.type = r.value;
        showFields();
        var first = $('[data-fields="' + state.type + '"] input:not([type="file"]), [data-fields="' + state.type + '"] textarea');
        // En móvil no abrimos el teclado solo; en escritorio sí enfocamos el primer campo.
        if (first && window.matchMedia("(hover: hover) and (pointer: fine)").matches) first.focus({ preventScroll: true });
        safe(render, "render");
      });
    });
    $$("[data-watch]").forEach(function (el) {
      el.addEventListener("input", renderSoon);
      el.addEventListener("change", renderSoon);
    });
    var toggle = $("#toggle-pass"), pass = $("#f-pass");
    toggle.addEventListener("click", function () {
      var show = pass.type === "password";
      pass.type = show ? "text" : "password";
      toggle.textContent = toggle.getAttribute(show ? "data-hide" : "data-show");
      toggle.setAttribute("aria-pressed", String(show));
    });
  }

  function initDesign() {
    $$('input[name="style"]').forEach(function (r) {
      r.addEventListener("change", function () { if (r.checked) { state.style = r.value; safe(render, "render"); } });
    });

    var fg = $("#c-fg"), bg = $("#c-bg"), transparent = $("#c-transparent");
    $$('input[name="palette"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        var c = r.value.split("|");
        state.fg = fg.value = c[0];
        state.bg = bg.value = c[1];
        retintLogo();
        safe(render, "render");
      });
    });
    var retintSoon = debounce(retintLogo, 160);
    function onCustom() {
      state.fg = fg.value;
      state.bg = bg.value;
      $$('input[name="palette"]').forEach(function (r) { r.checked = r.value === state.fg + "|" + state.bg; });
      retintSoon();
      renderSoon();
    }
    fg.addEventListener("input", onCustom);
    bg.addEventListener("input", onCustom);
    transparent.addEventListener("change", function () {
      state.transparent = transparent.checked;
      $("#bg-field").classList.toggle("is-disabled", state.transparent);
      safe(render, "render");
    });

    var custom = $("#frame-custom");
    $$('input[name="frame"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        state.frame = r.value;
        custom.hidden = state.frame !== "custom";
        if (state.frame === "custom") $("#f-frame-text").focus({ preventScroll: true });
        safe(render, "render");
      });
    });
    $("#f-frame-text").addEventListener("input", renderSoon);

    $$('input[name="size"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        state.size = parseInt(r.value, 10) || 1024;
        $("#mini-sub").textContent = T.miniSub(state.size);
      });
    });
  }

  // Miniaturas reales de cada forma, dibujadas por el mismo motor que genera tu QR.
  function initStylePreviews() {
    $$("[data-style-prev]").forEach(function (box) {
      var st = STYLES[box.getAttribute("data-style-prev")];
      if (!st) return;
      // Mostramos una esquina ampliada: a este tamaño se aprecia la forma de los módulos.
      var inst = new window.QRCodeStyling({
        width: 220, height: 220, type: "canvas", data: "https://qr.example", margin: 0,
        qrOptions: { errorCorrectionLevel: "L" },
        dotsOptions: { type: st.dots, color: "#18181b" },
        cornersSquareOptions: { type: st.corners, color: "#18181b" },
        cornersDotOptions: { type: st.cornerDot, color: "#18181b" },
        backgroundOptions: { color: "#ffffff" }
      });
      rasterQr(inst).then(function (img) {
        var c = document.createElement("canvas");
        c.width = c.height = 96;
        c.getContext("2d").drawImage(img, 0, 0, 118, 118, 0, 0, 96, 96);
        box.appendChild(c);
      }).catch(function () {});
    });
  }

  // ---------- Logo en el centro ----------
  var logoCache = {};

  // Convierte el logo SVG de /assets/logos en un PNG para el QR (los genéricos, con el color del código).
  function logoDataUrl(id, color) {
    var key = id + (LOGO_TINT[id] ? color : "");
    if (logoCache[key]) return Promise.resolve(logoCache[key]);
    return fetch("/assets/logos/" + id + ".svg").then(function (res) {
      if (!res.ok) throw new Error("logo " + res.status);
      return res.text();
    }).then(function (svg) {
      if (LOGO_TINT[id]) svg = svg.replace(/#0b0b0c/gi, color);
      return blobToImage(new Blob([svg], { type: "image/svg+xml" }));
    }).then(function (img) {
      var c = document.createElement("canvas");
      c.width = c.height = 256;
      c.getContext("2d").drawImage(img, 0, 0, 256, 256);
      logoCache[key] = c.toDataURL("image/png");
      return logoCache[key];
    });
  }

  function applyPresetLogo(id) {
    var gen = ++logoGen;
    state.logoId = id;
    state.logoKind = id ? "preset" : "";
    if (!id) { state.logo = null; safe(render, "render"); return; }
    logoDataUrl(id, state.fg).then(function (url) {
      if (gen !== logoGen) return;
      state.logo = url;
      safe(render, "render");
    }).catch(function (e) {
      console.warn("[logo]", e);
      if (gen === logoGen) toast(T.logoLoadFail);
    });
  }

  function retintLogo() {
    if (state.logoKind === "preset" && LOGO_TINT[state.logoId]) applyPresetLogo(state.logoId);
  }

  function initLogo() {
    var label = $("#logo-upload-label"), text = $("#logo-upload-text"), file = $("#logo-file"), clear = $("#logo-clear");

    function showUploaded(on) {
      label.classList.toggle("is-active", on);
      clear.hidden = !state.fileLogo;
      var img = label.querySelector("img"), icon = label.querySelector("svg");
      if (state.fileLogo) {
        if (!img) { img = document.createElement("img"); img.alt = ""; label.querySelector("span").insertBefore(img, text); }
        img.src = state.fileLogo;
        text.textContent = text.getAttribute(on ? "data-mine" : "data-use");
        if (icon) icon.style.display = "none";
      } else {
        if (img) img.remove();
        text.textContent = text.getAttribute("data-upload");
        if (icon) icon.style.display = "";
      }
    }

    $$('input[name="logo"]').forEach(function (r) {
      r.addEventListener("change", function () {
        if (!r.checked) return;
        showUploaded(false);
        applyPresetLogo(r.value);
      });
    });

    // Volver a elegir «Tu logo» sin subirlo otra vez.
    label.addEventListener("click", function (e) {
      if (state.fileLogo && state.logoKind !== "file") {
        e.preventDefault();
        useFileLogo();
      }
    });

    function useFileLogo() {
      logoGen++;
      state.logo = state.fileLogo;
      state.logoKind = "file";
      state.logoId = "";
      $$('input[name="logo"]').forEach(function (r) { r.checked = false; });
      showUploaded(true);
      safe(render, "render");
    }

    file.addEventListener("change", function () {
      var f = file.files && file.files[0];
      file.value = "";
      if (!f) return;
      if (!/^image\//.test(f.type)) { toast(T.logoNotImage); return; }
      if (f.size > 8 * 1024 * 1024) { toast(T.logoBig); return; }
      blobToImage(f).then(function (img) {
        // Reducimos el logo a 512 px: suficiente para imprimir y mantiene el SVG ligero.
        var max = 512, w = img.naturalWidth || max, h = img.naturalHeight || max;
        var k = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(w * k));
        c.height = Math.max(1, Math.round(h * k));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        state.fileLogo = c.toDataURL("image/png");
        useFileLogo();
        toast(T.logoAdded);
      }).catch(function () { toast(T.logoBad); });
    });

    clear.addEventListener("click", function () {
      state.fileLogo = null;
      if (state.logoKind === "file") {
        state.logo = null;
        state.logoKind = "";
        $('input[name="logo"][value=""]').checked = true;
      }
      showUploaded(false);
      safe(render, "render");
    });
  }

  // ---------- Ejemplos: «Usar este diseño» ----------
  function setRadio(name, value) {
    if (value == null) return;
    var r = $('input[name="' + name + '"][value="' + String(value).replace(/["\\]/g, "\\$&") + '"]');
    if (r && !r.checked) {
      r.checked = true;
      r.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function initPresets() {
    $$("[data-preset]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var p;
        try { p = JSON.parse(btn.getAttribute("data-preset")); } catch (_) { return; }
        setRadio("palette", p.palette);
        setRadio("style", p.style);
        setRadio("frame", p.frame);
        setRadio("logo", p.logo);
        setRadio("type", p.type);
        $("#herramienta").scrollIntoView({ block: "start" });
        toast(T.preset);
      });
    });
  }

  // ---------- Barra inferior en móvil ----------
  var toolVisible = false, previewAbove = false;

  function updateMiniBar() {
    var bar = $("#mini-bar");
    if (!bar || !card) return;
    var show = toolVisible && previewAbove && card.getAttribute("data-state") === "ready";
    bar.setAttribute("data-show", String(show));
    bar.setAttribute("aria-hidden", String(!show));
    bar.querySelector("button").tabIndex = show ? 0 : -1;
  }

  function syncMiniThumb() {
    var src = $("#qr-canvas"), thumb = $("#mini-thumb");
    if (!src || !thumb || !src.width) return;
    var c = thumb.querySelector("canvas");
    if (!c) { c = document.createElement("canvas"); c.width = c.height = 128; thumb.appendChild(c); }
    var x = c.getContext("2d"), k = Math.min(128 / src.width, 128 / src.height);
    var w = src.width * k, h = src.height * k;
    x.clearRect(0, 0, 128, 128);
    x.imageSmoothingQuality = "high";
    x.drawImage(src, (128 - w) / 2, (128 - h) / 2, w, h);
  }

  function initMiniBar() {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      toolVisible = entries[0].isIntersecting;
      updateMiniBar();
    }, { threshold: 0 }).observe($("#herramienta"));
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      previewAbove = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      updateMiniBar();
    }, { threshold: 0 }).observe($("#preview-frame"));
  }

  // ---------- Arranque ----------
  function boot() {
    card = $("#tool-card");
    if (!card) return;
    if (typeof window.QRCodeStyling !== "function" || !("TextEncoder" in window)) {
      $("#preview-error").textContent = T.errBrowser;
      card.setAttribute("data-state", "error");
      return;
    }
    // El navegador puede recordar valores al volver atrás: sincronizamos el estado.
    var checkedType = $('input[name="type"]:checked');
    state.type = checkedType ? checkedType.value : "url";
    showFields();
    var st = $('input[name="style"]:checked'); if (st) state.style = st.value;
    state.fg = $("#c-fg").value || state.fg;
    state.bg = $("#c-bg").value || state.bg;
    state.transparent = $("#c-transparent").checked;
    $("#bg-field").classList.toggle("is-disabled", state.transparent);
    var fr = $('input[name="frame"]:checked'); if (fr) state.frame = fr.value;
    $("#frame-custom").hidden = state.frame !== "custom";
    var sz = $('input[name="size"]:checked'); if (sz) state.size = parseInt(sz.value, 10) || 1024;

    safe(initType, "initType");
    safe(initDesign, "initDesign");
    safe(initLogo, "initLogo");
    safe(initUploads, "initUploads");
    safe(initDownloads, "initDownloads");
    safe(initPresets, "initPresets");
    safe(initMiniBar, "initMiniBar");
    safe(initStylePreviews, "initStylePreviews");
    safe(render, "render");
    var lg = $('input[name="logo"]:checked');
    if (lg && lg.value) applyPresetLogo(lg.value);
    // Cuando llega la tipografía, repintamos para que el texto del marco salga con Inter.
    if (document.fonts && document.fonts.load) document.fonts.load("800 40px Inter").then(renderSoon, function () {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
