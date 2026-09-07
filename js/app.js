/* ==========================================================================
   PARA VOS ♡ — lógica
   --------------------------------------------------------------------------
   ÍNDICE RÁPIDO (buscá estos comentarios para editar cada parte):
   - MENSAJES / TEXTOS -> memoryData, flowerMeanings
   - ANIMACIÓN DE ENTRADA -> runIntro()
   - PÉTALOS DE FONDO -> spawnPetals()
   - NAVEGACIÓN ENTRE PÁGINAS -> goToPage()
   - RAMO DE FLORES -> growBouquet()
   - RECUERDOS / LUPA -> initMemories()
   - DETALLES ESCONDIDOS -> initEasterEggs()
   ========================================================================== */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     MENSAJES / TEXTOS DE CADA RECUERDO
     Cambiá acá el título, la fecha (opcional) y la descripción de
     cada recuerdo. "id" debe coincidir con data-memory del HTML.
     ------------------------------------------------------------------ */
  var memoryData = {
    "1": {
      title: "Recuerdo #01",
      date: "",
      desc: "Es la captura más antigua que encontré. Es como el primer recuerdo."
    },
    "2": {
      title: "Recuerdo #02",
      date: "",
      desc: "Fue incréible lo que tardamos, hasta ahora te recuerdo frustrada sin saber que hacer xDD"
    },
    "3": {
      title: "Recuerdo #03",
      date: "",
      desc: "Y nada, estabamos mimiendo. Quedó piola la pijamada antes de morir escalando."
    },
    "4": {
      title: "Recuerdo #04",
      date: "",
      desc: "Muchas wins mías, pero es lo que tengo de captura contigo jasjaksda y casi todo en roblox. Respeta."
    },
    "5": {
      title: "Recuerdo #05",
      date: "",
      desc: "Tu gato me pareció piola la verdad. Aguante Nari!! Es la única captura que tengo uu cuida a tu hijo."
    },
    "6": {
      title: "Recuerdo #06",
      date: "",
      desc: "La rachaaaa. Aunque no veas mis videos, ahi está nuestro homúnculo. Tenemos que pensar un mejor nombre."
    }
  };

  /* ------------------------------------------------------------------
     SIGNIFICADOS DE LAS FLORES DEL RAMO (estructura preparada).
     Cada flor del ramo (ver growBouquet) puede tener un "meaning".
     Cambiá estos textos por lo que quieras que representen.
     ------------------------------------------------------------------ */
  var flowerMeanings = [
    "Esta flor es por un recuerdo que me hace reír solo.",
    "Esta es por algo que admiro mucho de ti (no te diré, loca).",
    "Esta es por las bromas que hacemos y que nadie entendería (Viva nuestro autismo).",
    "Esta es un deseo para ti: que te vaya increíble en todo lo que hagas."
  ];

  /* ==================================================================
     PÉTALOS DE FONDO
     ================================================================== */
  function spawnPetals() {
    if (reducedMotion) return;
    var layer = document.getElementById("petal-layer");
    var symbols = ["✿", "❀", "❁"];

    function makePetal() {
      var petal = document.createElement("span");
      petal.className = "petal";
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.fontSize = 12 + Math.random() * 14 + "px";
      petal.style.setProperty("--drift", (Math.random() * 80 - 40) + "px");
      petal.style.animationDuration = 9 + Math.random() * 8 + "s";
      layer.appendChild(petal);
      setTimeout(function () { petal.remove(); }, 18000);
    }

    for (var i = 0; i < 4; i++) {
      setTimeout(makePetal, i * 1500);
    }
    setInterval(makePetal, 3200);
  }

  /* ==================================================================
     0.5. DESCUBRIMIENTO DEL REGALO
     ================================================================== */
  function initBirthdayDiscovery() {
    var discovery = document.getElementById("birthday-discovery");
    var flameButton = document.getElementById("magic-flame");
    var reveal = document.getElementById("birthday-reveal");
    var gift = document.getElementById("birthday-gift");
    var birthdayScreen = document.getElementById("birthday-screen");
    if (!discovery || !flameButton || !reveal || !gift || !birthdayScreen) return;

    var audioSoplido = document.getElementById("audio-soplido");
    var audioCumpleanos = document.getElementById("audio-cumpleanos");

    flameButton.addEventListener("click", function () {
      // El clic de la llama permite iniciar el audio sin que el navegador lo bloquee.
      if (audioSoplido && audioCumpleanos) {
        audioSoplido.currentTime = 0;
        audioCumpleanos.pause();
        audioCumpleanos.currentTime = 0;

        var soplidoPromise = audioSoplido.play();
        if (soplidoPromise && typeof soplidoPromise.then === "function") {
          soplidoPromise.then(function () {
            // Arrancamos la canción un poquito antes de que termine el soplido
            // para compensar la pequeña latencia de carga/decodificación del navegador.
            var startMusic = function () {
              var duration = audioSoplido.duration;
              var lead = 0.9; // segundos de margen para evitar el silencio
              var delay = Number.isFinite(duration) ? Math.max(0, (duration - lead) * 1000) : 1650;

              setTimeout(function () {
                audioCumpleanos.currentTime = 0;
                audioCumpleanos.play().catch(function () {});
              }, delay);
            };

            if (Number.isFinite(audioSoplido.duration) && audioSoplido.duration > 0) {
              startMusic();
            } else {
              audioSoplido.addEventListener("loadedmetadata", startMusic, { once: true });
            }
          }).catch(function () {});
        }
      }

      discovery.classList.add("lit");
      flameButton.disabled = true;
      flameButton.setAttribute("aria-hidden", "true");
      flameButton.style.pointerEvents = "none";
      var hint = discovery.querySelector(".flame-hint");
      if (hint) hint.hidden = true;
      setTimeout(function () { reveal.hidden = false; }, 420);

      var confetti = document.createElement("div");
      confetti.className = "discovery-confetti";
      confetti.setAttribute("aria-hidden", "true");
      for (var i = 0; i < (window.innerWidth <= 600 ? 55 : 95); i++) {
        var piece = document.createElement("span");
        piece.style.left = (Math.random() * 100) + "%";
        piece.style.setProperty("--delay", (Math.random() * 2.8) + "s");
        piece.style.setProperty("--duration", (3.4 + Math.random() * 2.8) + "s");
        piece.style.setProperty("--drift", ((Math.random() - .5) * 150) + "px");
        piece.style.background = ["#f6d34a", "#e7a7a0", "#9aaa75", "#d6a85d", "#c994b8"][i % 5];
        confetti.appendChild(piece);
      }
      setTimeout(function () { discovery.appendChild(confetti); }, 350);
    });

    gift.addEventListener("click", function () {
      discovery.classList.add("fade-out");
      birthdayScreen.hidden = false;
      setTimeout(function () { discovery.remove(); }, 900);
    });
  }

  /* ==================================================================
     0. PRESENTACIÓN DE CUMPLEAÑOS
     ================================================================== */
  function initBirthdayGate() {
    var birthdayScreen = document.getElementById("birthday-screen");
    var yesBtn = document.getElementById("birthday-yes");
    var noBtn = document.getElementById("birthday-no");
    var greeting = document.getElementById("birthday-greeting");
    var message = document.getElementById("birthday-message");
    var question = document.getElementById("birthday-question");
    var response = document.getElementById("birthday-response");
    var memeBox = document.getElementById("birthday-meme");
    var memePlaceholder = document.getElementById("birthday-meme-placeholder");
    var memeImage = document.getElementById("birthday-meme-image");

    if (!birthdayScreen || !yesBtn || !noBtn) return;

    var noCount = 0;

    var stages = [
      {
        message: "QUEEEE? Como te atreves a decirle que no a mi regalo. Ábrelo!",
        question: "",
        meme: "images/meme1.jpg"
      },
      {
        message: "Me esforcé haciendo esto y seguís diciendo que no? Respeta, que te pasa",
        question: "",
        meme: "images/meme2.jpg"
      },
      {
        message: "Bueno, entonces no quieres el regalo. Así son, uno que se esmera y así te pagan.",
        question: "Por última vez, ¿quieres ver el regalo?",
        meme: "images/meme3.jpg"
      },
      {
        message: "Bueno, te jodes. Es mi programa así que tenés que aceptarlo, je.",
        question: "Disfruta el pequeño presente y feliz cumpleaños, qlera",
        meme: null
      }
    ];

    function showMeme(path) {
      if (!memeBox) return;
      if (!path) {
        memeBox.hidden = true;
        memeBox.style.display = "none";
        return;
      }

      memeBox.hidden = false;
      memeBox.style.display = "block";
      memePlaceholder.hidden = false;
      memePlaceholder.style.display = "flex";
      memePlaceholder.querySelector("small").textContent = "Coloca tu imagen en " + path;
      memeImage.hidden = true;
      memeImage.src = path;
      memeImage.onload = function () {
        memePlaceholder.hidden = true;
        memePlaceholder.style.display = "none";
        memeImage.hidden = false;
        memeImage.style.display = "block";
      };
      memeImage.onerror = function () {
        memePlaceholder.hidden = false;
        memePlaceholder.style.display = "flex";
        memeImage.hidden = true;
        memeImage.style.display = "none";
      };
    }

    function updateYesSize() {
      yesBtn.classList.remove("yes-level-1", "yes-level-2", "yes-level-3", "yes-level-4");
      if (noCount > 0) yesBtn.classList.add("yes-level-" + noCount);
    }

    function showStage(stageIndex) {
      var stage = stages[stageIndex];
      greeting.hidden = true;
      message.textContent = stage.message;
      question.textContent = stage.question;
      question.hidden = !stage.question;
      response.textContent = "";
      showMeme(stage.meme);
      updateYesSize();

      noBtn.hidden = stageIndex === 3;
      yesBtn.classList.toggle("yes-final", stageIndex === 3);

      birthdayScreen.classList.remove("nope");
      void birthdayScreen.offsetWidth;
      birthdayScreen.classList.add("nope");
    }

    yesBtn.addEventListener("click", function () {
      birthdayScreen.classList.add("fade-out");
      setTimeout(function () {
        birthdayScreen.remove();
        var introScreen = document.getElementById("intro-screen");
        if (introScreen) {
          introScreen.classList.add("ready");
          runIntro();
        }
      }, 700);
    });

    noBtn.addEventListener("click", function () {
      if (noCount >= stages.length) return;
      noCount += 1;
      showStage(noCount - 1);
    });
  }

  /* ==================================================================
     DETALLES EXTRA DE CUMPLEAÑOS — solo decoración
     ================================================================== */
  function initBirthdayEffects() {
    var screen = document.getElementById("birthday-screen");
    var stage = document.querySelector("#birthday-screen .birthday-stage");
    if (!screen || !stage) return;

    var effects = document.createElement("div");
    effects.className = "birthday-effects";
    effects.setAttribute("aria-hidden", "true");
    screen.insertBefore(effects, screen.firstChild);

    var confettiCount = window.innerWidth <= 600 ? 68 : 110;
    var confettiSymbols = ["", "", "", "", "", "", ""];

    for (var i = 0; i < confettiCount; i++) {
      var piece = document.createElement("span");
      piece.className = "birthday-confetti";
      piece.textContent = confettiSymbols[i % confettiSymbols.length];
      piece.style.left = (Math.random() * 100) + "%";
      piece.style.setProperty("--drift", ((Math.random() - .5) * 150) + "px");
      piece.style.setProperty("--rotation", ((Math.random() * 900) - 450) + "deg");
      piece.style.setProperty("--fall-time", (4 + Math.random() * 3) + "s");
      piece.style.setProperty("--fall-delay", (Math.random() * 4.8) + "s");
      piece.style.background = ["#f6d34a", "#e7a7a0", "#9aaa75", "#d6a85d", "#c994b8"][i % 5];
      effects.appendChild(piece);
    }

    var fireworks = [
      { left: "7%", top: "16%", color: "#e7a7a0", delay: ".15s", scale: "1.35" },
      { left: "93%", top: "16%", color: "#f0c74b", delay: ".45s", scale: "1.25" },
      { left: "14%", top: "78%", color: "#9aaa75", delay: ".8s", scale: "1.05" },
      { left: "86%", top: "78%", color: "#c994b8", delay: "1.05s", scale: "1.05" },
      { left: "50%", top: "7%", color: "#d6a85d", delay: "1.3s", scale: "1.15" },
      { left: "50%", top: "93%", color: "#e7a7a0", delay: "1.55s", scale: ".9" }
    ];

    fireworks.forEach(function (data) {
      var firework = document.createElement("span");
      firework.className = "birthday-firework";
      firework.style.left = data.left;
      firework.style.top = data.top;
      firework.style.color = data.color;
      firework.style.setProperty("--fire-delay", data.delay);
      firework.style.setProperty("--fire-scale", data.scale || "1");
      effects.appendChild(firework);
    });

    var balloons = [
      { left: "3%", top: "29%", color: "#e7a7a0", delay: ".1s", rotate: "-8deg" },
      { left: "8%", top: "72%", color: "#f6d34a", delay: ".55s", rotate: "7deg" },
      { left: "94%", top: "29%", color: "#9aaa75", delay: ".35s", rotate: "8deg" },
      { left: "88%", top: "72%", color: "#c994b8", delay: ".8s", rotate: "-6deg" }
    ];
    balloons.forEach(function (data) {
      var balloon = document.createElement("span");
      balloon.className = "birthday-balloon";
      balloon.style.left = data.left;
      balloon.style.top = data.top;
      balloon.style.background = data.color;
      balloon.style.setProperty("--balloon-delay", data.delay);
      balloon.style.setProperty("--balloon-rotate", data.rotate);
      effects.appendChild(balloon);
    });

    [
      { text: "✦", left: "5%", top: "48%", delay: ".2s" },
      { text: "✧", left: "94%", top: "49%", delay: ".9s" },
      { text: "✦", left: "17%", top: "90%", delay: "1.3s" },
      { text: "✧", left: "83%", top: "89%", delay: "1.7s" },
      { text: "✦", left: "20%", top: "8%", delay: ".6s" },
      { text: "✧", left: "80%", top: "8%", delay: "1.1s" }
    ].forEach(function (data) {
      var sparkle = document.createElement("span");
      sparkle.className = "birthday-sparkle";
      sparkle.textContent = data.text;
      sparkle.style.left = data.left;
      sparkle.style.top = data.top;
      sparkle.style.setProperty("--spark-delay", data.delay);
      effects.appendChild(sparkle);
    });
  }

  /* ==================================================================
     1. ANIMACIÓN DE ENTRADA
     ================================================================== */
  function runIntro() {
    var introScreen = document.getElementById("intro-screen");
    var envelope = document.getElementById("envelope");
    var mainContent = document.getElementById("main-content");
    var skipBtn = document.getElementById("skip-intro");

    function finishIntro() {
      introScreen.classList.add("fade-out");
      mainContent.hidden = false;
      setTimeout(function () { introScreen.remove(); }, 850);
    }

    if (reducedMotion) {
      // versión reducida: casi sin animación, va directo
      envelope.classList.add("open");
      setTimeout(finishIntro, 900);
      skipBtn.addEventListener("click", finishIntro);
      return;
    }

    // secuencia normal (~3.5s)
    setTimeout(function () { envelope.classList.add("open"); }, 900);
    setTimeout(finishIntro, 3600);

    skipBtn.addEventListener("click", finishIntro);
  }

  /* ==================================================================
     NAVEGACIÓN ENTRE PÁGINAS
     ================================================================== */
  var bouquetGrown = false;

  function goToPage(pageName) {
    var pages = document.querySelectorAll(".page");
    var current = document.querySelector(".page.active");
    var target = document.querySelector('.page[data-page="' + pageName + '"]');
    if (!target || target === current) return;

    function show() {
      pages.forEach(function (p) { p.classList.remove("active"); });
      target.classList.add("active");
      target.classList.add("entering");
      setTimeout(function () { target.classList.remove("entering"); }, 650);

      if (pageName === "bouquet" && !bouquetGrown) {
        bouquetGrown = true;
        setTimeout(growBouquet, 500);
      }
      window.scrollTo(0, 0);
    }

    if (current && !reducedMotion) {
      current.classList.add("leaving");
      setTimeout(function () {
        current.classList.remove("leaving");
        show();
      }, 480);
    } else {
      show();
    }
  }

  function initNavigation() {
    document.querySelectorAll("[data-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        goToPage(btn.getAttribute("data-goto"));
      });
    });
  }

  /* ==================================================================
     3. RAMO DE FLORES — se construye a mano en SVG
     ================================================================== */
  function growBouquet() {
    var container = document.getElementById("bouquet-container");
    var svg = document.getElementById("bouquet-svg");
    var note = document.getElementById("bouquet-note");
    var continueBtn = document.getElementById("bouquet-continue");
    var ns = "http://www.w3.org/2000/svg";

    function el(tag, attrs) {
      var node = document.createElementNS(ns, tag);
      for (var key in attrs) node.setAttribute(key, attrs[key]);
      return node;
    }

    /* --- envoltorio de papel + moño, dibujados una sola vez --- */
    function buildWrap() {
      var wrap = el("path", {
        d: "M108,340 L152,232 L188,232 L232,340 Z",
        fill: "var(--crema-oscuro)",
        stroke: "var(--marron-suave)",
        "stroke-width": 2,
        class: "wrap-shape"
      });
      var fold = el("path", {
        d: "M108,340 L170,296 L232,340 Z",
        fill: "rgba(122,92,52,0.08)",
        class: "wrap-shape"
      });
      var ribbon = el("rect", {
        x: 138, y: 226, width: 64, height: 16,
        fill: "var(--amarillo-fuerte)",
        class: "wrap-shape"
      });
      var bowLeft = el("path", { d: "M170,234 L142,214 L150,238 Z", fill: "var(--amarillo)", stroke: "var(--amarillo-fuerte)", "stroke-width": 1.5, class: "wrap-shape" });
      var bowRight = el("path", { d: "M170,234 L198,214 L190,238 Z", fill: "var(--amarillo)", stroke: "var(--amarillo-fuerte)", "stroke-width": 1.5, class: "wrap-shape" });
      var knot = el("circle", { cx: 170, cy: 232, r: 7, fill: "var(--amarillo-fuerte)", class: "wrap-shape" });
      [wrap, fold, ribbon, bowLeft, bowRight, knot].forEach(function (n, i) {
        n.style.animationDelay = (i * 0.05) + "s";
        svg.appendChild(n);
      });
    }

    /* --- girasol: doble corona de pétalos, centro con semillas y volumen --- */
    function makeSunflower(cx, cy, size, meaningIndex) {
      var g = el("g", { class: "flower" + (meaningIndex != null ? " has-meaning" : "") });

      // Dos coronas desfasadas: da una silueta más natural y menos "geométrica".
      var outerCount = 18;
      var innerCount = 18;

      for (var p = 0; p < outerCount; p++) {
        var angle = (p / outerCount) * Math.PI * 2 - Math.PI / 2;
        var px = cx + Math.cos(angle) * size * 0.58;
        var py = cy + Math.sin(angle) * size * 0.58;
        var petalLen = size * (0.48 + (p % 3) * 0.025);
        g.appendChild(el("ellipse", {
          cx: px, cy: py,
          rx: size * 0.12, ry: petalLen,
          transform: "rotate(" + (angle * 180 / Math.PI) + " " + px + " " + py + ")",
          fill: p % 2 === 0 ? "#f7ca43" : "#f3bd31",
          stroke: "#d9a522",
          "stroke-width": 0.55,
          opacity: 0.98
        }));
      }

      for (var q = 0; q < innerCount; q++) {
        var angle2 = (q / innerCount) * Math.PI * 2 - Math.PI / 2 + Math.PI / innerCount;
        var px2 = cx + Math.cos(angle2) * size * 0.38;
        var py2 = cy + Math.sin(angle2) * size * 0.38;
        g.appendChild(el("ellipse", {
          cx: px2, cy: py2,
          rx: size * 0.105, ry: size * 0.39,
          transform: "rotate(" + (angle2 * 180 / Math.PI) + " " + px2 + " " + py2 + ")",
          fill: "#ffd34f",
          stroke: "#dda925",
          "stroke-width": 0.45
        }));
      }

      // Centro aterciopelado.
      g.appendChild(el("circle", {
        cx: cx, cy: cy, r: size * 0.34, fill: "#70451f", stroke: "#593516", "stroke-width": 1
      }));

      // Semillas en espiral, más parecidas a un girasol real.
      var seedCount = 54;
      for (var d = 0; d < seedCount; d++) {
        var theta = d * 2.39996;
        var radius = Math.sqrt(d / seedCount) * size * 0.30;
        var sx = cx + Math.cos(theta) * radius;
        var sy = cy + Math.sin(theta) * radius;
        g.appendChild(el("circle", {
          cx: sx, cy: sy,
          r: Math.max(0.7, size * 0.018),
          fill: d % 2 === 0 ? "#3f2816" : "#8a5a2c",
          opacity: 0.95
        }));
      }

      return g;
    }

    /* --- tiger lily: 6 pétalos recurvados, manchas, nervaduras y estambres --- */
    function makeTigerLily(cx, cy, size, meaningIndex) {
      var g = el("g", { class: "flower" + (meaningIndex != null ? " has-meaning" : "") });
      var petalColor = "#e9781d";
      var petalLight = "#f39a2f";
      var edgeColor = "#c95e13";
      var spotColor = "#7f3514";

      // Cada pétalo sale del centro, se ensancha y se curva hacia atrás.
      for (var p = 0; p < 6; p++) {
        var angle = (p / 6) * Math.PI * 2 - Math.PI / 2;
        var deg = angle * 180 / Math.PI;
        var length = size * (0.88 + (p % 2) * 0.05);
        var width = size * 0.22;

        var d = [
          "M", cx, cy,
          "C", cx - width, cy - length * 0.22,
               cx - width * 0.92, cy - length * 0.72,
               cx - width * 0.25, cy - length,
          "C", cx - width * 0.04, cy - length * 1.08,
               cx + width * 0.10, cy - length * 1.05,
               cx + width * 0.28, cy - length * 0.91,
          "C", cx + width * 0.72, cy - length * 0.60,
               cx + width * 0.78, cy - length * 0.25,
               cx, cy,
          "Z"
        ].join(" ");

        // Dibujamos el pétalo apuntando hacia arriba y lo rotamos alrededor del centro.
        var petal = el("path", {
          d: d,
          fill: p % 2 === 0 ? petalColor : petalLight,
          stroke: edgeColor,
          "stroke-width": 0.75,
          transform: "rotate(" + (deg + 90) + " " + cx + " " + cy + ")"
        });
        g.appendChild(petal);

        // Nervadura central.
        g.appendChild(el("path", {
          d: "M" + cx + "," + (cy - 3) +
             " C" + (cx + size * 0.01) + "," + (cy - length * 0.35) +
             " " + (cx + size * 0.01) + "," + (cy - length * 0.68) +
             " " + cx + "," + (cy - length * 0.91),
          fill: "none",
          stroke: "#c65b13",
          "stroke-width": 0.65,
          opacity: 0.6,
          transform: "rotate(" + (deg + 90) + " " + cx + " " + cy + ")"
        }));

        // Manchas oscuras características del tiger lily.
        var spots = [
          [0.34, -0.05, 1.45], [0.46, 0.08, 1.25], [0.55, -0.10, 1.15],
          [0.63, 0.11, 0.95], [0.72, -0.06, 0.82]
        ];
        spots.forEach(function (sp) {
          var r = size * sp[0];
          var lateral = size * sp[1];
          var localX = lateral;
          var localY = -r;
          var petalRotation = deg + 90;
          var rad = petalRotation * Math.PI / 180;
          var rx = cx + localX * Math.cos(rad) - localY * Math.sin(rad);
          var ry = cy + localX * Math.sin(rad) + localY * Math.cos(rad);
          g.appendChild(el("ellipse", {
            cx: rx, cy: ry,
            rx: sp[2], ry: sp[2] * 0.72,
            fill: spotColor,
            opacity: 0.9,
            transform: "rotate(" + (deg + 110) + " " + rx + " " + ry + ")"
          }));
        });
      }

      // Estambres largos y curvados, con anteras oscuras.
      for (var e = 0; e < 6; e++) {
        var eangle = (e / 6) * Math.PI * 2 + 0.18;
        var ex = cx + Math.cos(eangle) * size * 0.48;
        var ey = cy + Math.sin(eangle) * size * 0.48;
        var mx = cx + Math.cos(eangle) * size * 0.18;
        var my = cy + Math.sin(eangle) * size * 0.18;
        g.appendChild(el("path", {
          d: "M" + cx + "," + cy + " Q" + mx + "," + my + " " + ex + "," + ey,
          stroke: "#8b4a1a",
          "stroke-width": 1.05,
          fill: "none",
          "stroke-linecap": "round"
        }));
        g.appendChild(el("ellipse", {
          cx: ex, cy: ey, rx: 2.1, ry: 1.15,
          fill: "#5b3218",
          transform: "rotate(" + (eangle * 180 / Math.PI) + " " + ex + " " + ey + ")"
        }));
      }

      g.appendChild(el("circle", {
        cx: cx, cy: cy, r: size * 0.11, fill: "#d87918", stroke: "#a84d12", "stroke-width": 0.6
      }));

      return g;
    }

    /* --- lirios del valle: racimo integrado al tallo del ramo --- */
    function makeLilyOfValley(cx, cy, size, meaningIndex, side, branch) {
      var g = el("g", { class: "flower" + (meaningIndex != null ? " has-meaning" : "") });
      side = side || 1;
      branch = branch || {};

      // Cada racimo tiene su propia rama, pero todas nacen del mismo
      // punto del ramo para que se sientan parte del arreglo.
      var p0 = branch.p0 || { x: 170, y: 232 };
      var p1 = branch.p1 || (side < 0 ? { x: 160, y: 205 } : { x: 181, y: 208 });
      var p2 = branch.p2 || (side < 0 ? { x: 155, y: 181 } : { x: 186, y: 181 });
      var p3 = branch.p3 || (side < 0 ? { x: 150, y: 154 } : { x: 191, y: 154 });

      var stemPath =
        "M" + p0.x + "," + p0.y +
        " C" + p1.x + "," + p1.y + " " +
        p2.x + "," + p2.y + " " + p3.x + "," + p3.y;

      g.appendChild(el("path", {
        d: stemPath,
        stroke: "#78945a",
        "stroke-width": 2.2,
        fill: "none",
        "stroke-linecap": "round"
      }));

      // Posiciones normalizadas sobre el tallo. Las campanitas salen de él
      // mediante pedicelos cortos y visibles, alternando ambos lados.
      var bells = [
        { t: 0.22, side: -1, s: 1.00 },
        { t: 0.34, side:  1, s: 0.94 },
        { t: 0.46, side: -1, s: 0.88 },
        { t: 0.58, side:  1, s: 0.82 },
        { t: 0.63, side: -1, s: 0.79 },
        { t: 0.69, side: -1, s: 0.75 },
        { t: 0.79, side:  1, s: 0.68 },
        { t: 0.88, side: -1, s: 0.60 }
      ];

      // Puntos aproximados a lo largo de la curva real del tallo.
      function stemPoint(t) {
        var u = 1 - t;
        return {
          x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
          y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
        };
      }

      bells.forEach(function (b) {
        var anchor = stemPoint(b.t);
        var dir = b.side;
        var bx = anchor.x + dir * 5.5;
        var by = anchor.y + 5.5;

        // Pedicelo que sale exactamente del tallo y termina en la flor.
        g.appendChild(el("path", {
          d: "M" + anchor.x + "," + anchor.y +
             " Q" + (anchor.x + dir * 4.0) + "," + (anchor.y + 1.8) +
             " " + bx + "," + by,
          stroke: "#86a061",
          "stroke-width": 0.95,
          fill: "none",
          "stroke-linecap": "round"
        }));

        var w = size * 0.13 * b.s;
        var h = size * 0.17 * b.s;

        // Campanita blanca del lirio del valle.
        var bellPath = [
          "M", bx - w, by - h * 0.48,
          "C", bx - w * 0.96, by - h * 0.02, bx - w * 0.72, by + h * 0.43, bx, by + h * 0.52,
          "C", bx + w * 0.72, by + h * 0.43, bx + w * 0.96, by - h * 0.02, bx + w, by - h * 0.48,
          "C", bx + w * 0.52, by - h * 0.70, bx - w * 0.52, by - h * 0.70, bx - w, by - h * 0.48,
          "Z"
        ].join(" ");

        g.appendChild(el("path", {
          d: bellPath,
          fill: "#fffdf6",
          stroke: "#d9d0bb",
          "stroke-width": 0.7
        }));

        g.appendChild(el("path", {
          d: "M" + (bx - w * 0.52) + "," + (by - h * 0.10) +
             " Q" + bx + "," + (by + h * 0.30) +
             " " + (bx + w * 0.52) + "," + (by - h * 0.10),
          fill: "none",
          stroke: "#e5dece",
          "stroke-width": 0.6,
          opacity: 0.9
        }));
      });

      // Hojas propias del lirio del valle: nacen de la misma rama y se
      // colocan detrás de las campanitas para que el racimo tenga volumen.
      var leafData = branch.leaves || [
        { t: 0.28, side: side < 0 ? -1 : 1, len: 20, width: 7, angle: side < 0 ? -32 : 32 },
        { t: 0.55, side: side < 0 ? 1 : -1, len: 17, width: 6, angle: side < 0 ? 22 : -22 }
      ];

      leafData.forEach(function (leafInfo) {
        var anchor = stemPoint(leafInfo.t);
        var dir = leafInfo.side;
        var len = leafInfo.len * (size / 28);
        var width = leafInfo.width * (size / 28);
        var tipX = anchor.x + dir * len;
        var tipY = anchor.y - len * 0.38;
        var d =
          "M" + anchor.x + "," + anchor.y +
          " C" + (anchor.x + dir * len * 0.25) + "," + (anchor.y - width * 1.8) +
          " " + (tipX - dir * len * 0.22) + "," + (tipY - width) +
          " " + tipX + "," + tipY +
          " C" + (tipX - dir * len * 0.16) + "," + (tipY + width * 1.2) +
          " " + (anchor.x + dir * len * 0.18) + "," + (anchor.y + width * 1.4) +
          " " + anchor.x + "," + anchor.y + " Z";

        g.insertBefore(el("path", {
          d: d,
          fill: "#82995d",
          opacity: 0.92,
          transform: "rotate(" + leafInfo.angle + " " + anchor.x + " " + anchor.y + ")"
        }), g.firstChild.nextSibling);
      });

      return g;
    }

    function buildFlowers() {
      // definición de un gradiente sutil (queda disponible por si se usa en otras flores)
      var defs = el("defs", {});
      var grad = el("radialGradient", { id: "centerShade" });
      grad.appendChild(el("stop", { offset: "0%", "stop-color": "#c98f16" }));
      grad.appendChild(el("stop", { offset: "100%", "stop-color": "#e8b93f", "stop-opacity": 0 }));
      defs.appendChild(grad);
      svg.appendChild(defs);

      buildWrap();

      // tallos: nacen todos desde el centro del moño hacia cada flor
      var stems = [
        { d: "M170,232 C151,198 137,151 130,112", delay: 0 },
        { d: "M170,232 C170,180 170,120 170,62",  delay: 0.12 },
        { d: "M170,232 C189,198 203,151 210,104", delay: 0.24 },
      ];
      stems.forEach(function (s) {
        var stem = el("path", { d: s.d, class: "stem" });
        stem.style.animationDelay = s.delay + "s";
        svg.appendChild(stem);
      });

      // hojas repartidas sobre algunos tallos
      var leaves = [
        { x: 149, y: 204, r: -38, rx: 18, ry: 7 },
        { x: 190, y: 204, r: 34,  rx: 18, ry: 7 },
      ];
      leaves.forEach(function (pos, i) {
        var leaf = el("path", {
          d: "M" + (pos.x - pos.rx) + "," + pos.y +
             " C" + (pos.x - pos.rx * 0.35) + "," + (pos.y - pos.ry * 1.8) +
             " " + (pos.x + pos.rx * 0.65) + "," + (pos.y - pos.ry * 0.8) +
             " " + (pos.x + pos.rx) + "," + pos.y +
             " C" + (pos.x + pos.rx * 0.35) + "," + (pos.y + pos.ry * 1.8) +
             " " + (pos.x - pos.rx * 0.65) + "," + (pos.y + pos.ry * 0.8) +
             " " + (pos.x - pos.rx) + "," + pos.y + " Z",
          transform: "rotate(" + pos.r + " " + pos.x + " " + pos.y + ")",
          class: "leaf"
        });
        leaf.style.animationDelay = (0.55 + i * 0.12) + "s";
        svg.appendChild(leaf);
      });

      // las 4 flores principales, clicables, cada una con un significado
      // "sunflower" = girasol, "tigerlily" = tiger lily, "lily" = lirio del valle
      var mainFlowers = [
        { x: 130, y: 112, size: 40, type: "tigerlily" },
        { x: 170, y: 62,  size: 50, type: "sunflower" },
        { x: 210, y: 104, size: 40, type: "tigerlily" }
      ];
      mainFlowers.forEach(function (f, i) {
        var g;
        if (f.type === "sunflower") g = makeSunflower(f.x, f.y, f.size, i);
        else if (f.type === "tigerlily") g = makeTigerLily(f.x, f.y, f.size, i);
        else g = makeLilyOfValley(f.x, f.y, f.size, i);

        g.setAttribute("data-meaning-index", i);
        g.style.animationDelay = (1.1 + i * 0.22) + "s";
        g.addEventListener("click", function () { showFlowerMeaning(i); });
        g.addEventListener("keyup", function (e) { if (e.key === "Enter") showFlowerMeaning(i); });
        svg.appendChild(g);
      });

      // Cuatro ramas de lirios del valle. Las dos nuevas se integran entre
      // las ramas principales para llenar el centro sin amontonar las flores.
      var lilyClusters = [
        { size: 34, side: -1, delay: 1.90, branch: {
          p0: {x:170,y:232}, p1:{x:158,y:202}, p2:{x:151,y:174}, p3:{x:145,y:146},
          leaves: [
            {t:0.27,side:-1,len:18,width:7,angle:-28},
            {t:0.52,side:1,len:16,width:6,angle:18}
          ]
        }},
        { size: 32, side: -1, delay: 2.00, branch: {
          p0: {x:170,y:232}, p1:{x:149,y:205}, p2:{x:137,y:178}, p3:{x:128,y:150},
          leaves: [
            {t:0.25,side:-1,len:17,width:6.5,angle:-34},
            {t:0.50,side:1,len:15,width:6,angle:16},
            {t:0.72,side:-1,len:13,width:5.5,angle:-26}
          ]
        }},
        { size: 34, side:  1, delay: 2.05, branch: {
          p0: {x:170,y:232}, p1:{x:182,y:202}, p2:{x:189,y:174}, p3:{x:195,y:146},
          leaves: [
            {t:0.27,side:1,len:18,width:7,angle:28},
            {t:0.52,side:-1,len:16,width:6,angle:-18}
          ]
        }},
        { size: 32, side:  1, delay: 2.15, branch: {
          p0: {x:170,y:232}, p1:{x:191,y:205}, p2:{x:203,y:178}, p3:{x:212,y:150},
          leaves: [
            {t:0.25,side:1,len:17,width:6.5,angle:34},
            {t:0.50,side:-1,len:15,width:6,angle:-16},
            {t:0.72,side:1,len:13,width:5.5,angle:26}
          ]
        }}
      ];
      lilyClusters.forEach(function (f, i) {
        var lily = makeLilyOfValley(170, 232, f.size, i === 0 ? 3 : null, f.side, f.branch);
        lily.style.animationDelay = f.delay + "s";
        svg.appendChild(lily);
      });

      // pétalos sueltos cayendo cerca del envoltorio
      for (var k = 0; k < 4; k++) {
        var fp = el("ellipse", {
          cx: 130 + Math.random() * 80,
          cy: 250 + Math.random() * 15,
          rx: 5, ry: 8,
          fill: "var(--amarillo-suave)",
          class: "petal"
        });
        fp.style.animationDelay = (2.9 + k * 0.15) + "s";
        svg.appendChild(fp);
      }

      var totalDelay = reducedMotion ? 300 : 3300;
      setTimeout(function () {
        note.hidden = false;
        continueBtn.hidden = false;
      }, totalDelay);
    }

    buildFlowers();

    function showFlowerMeaning(index) {
      var popup = document.getElementById("flower-meaning-popup");
      var text = document.getElementById("flower-meaning-text");
      text.textContent = flowerMeanings[index] || "Una flor más para vos ♡";
      popup.hidden = false;
    }

    document.getElementById("close-meaning").addEventListener("click", function () {
      document.getElementById("flower-meaning-popup").hidden = true;
    });
  }

  /* ==================================================================
     4. RECUERDOS + LUPA
     ================================================================== */
  function initMemories() {
    var desk = document.getElementById("memories-desk");
    var magnifier = document.getElementById("magnifier");
    var isTouch = window.matchMedia("(max-width: 720px)").matches || ("ontouchstart" in window);

    if (!isTouch) {
      desk.addEventListener("mousemove", function (e) {
        magnifier.style.opacity = "1";
        magnifier.style.left = e.clientX + "px";
        magnifier.style.top = e.clientY + "px";

        // resaltar recuerdo cercano
        document.querySelectorAll(".memory-card").forEach(function (card) {
          var rect = card.getBoundingClientRect();
          var cx = rect.left + rect.width / 2;
          var cy = rect.top + rect.height / 2;
          var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          card.classList.toggle("hovered", dist < 110);
        });
      });
      desk.addEventListener("mouseleave", function () {
        magnifier.style.opacity = "0";
        document.querySelectorAll(".memory-card").forEach(function (c) { c.classList.remove("hovered"); });
      });
    } else {
      magnifier.style.display = "none";
    }

    document.querySelectorAll(".memory-card").forEach(function (card) {
      function open() { openMemory(card.getAttribute("data-memory")); }
      card.addEventListener("click", open);
      card.addEventListener("keyup", function (e) { if (e.key === "Enter") open(); });
    });

    document.getElementById("modal-close").addEventListener("click", closeMemory);
    document.getElementById("memory-modal").addEventListener("click", function (e) {
      if (e.target.id === "memory-modal") closeMemory();
    });
    document.addEventListener("keyup", function (e) {
      if (e.key === "Escape") closeMemory();
    });
  }

  function openMemory(id) {
    var data = memoryData[id];
    if (!data) return;
    document.getElementById("modal-title").textContent = data.title;
    document.getElementById("modal-date").textContent = data.date || "";
    document.getElementById("modal-desc").textContent = data.desc;

    var photo = document.getElementById("modal-photo");
    photo.innerHTML = '<img src="assets/recuerdos/recuerdo-0' + id + '.jpg" alt="' + data.title + '">';

    document.getElementById("memory-modal").hidden = false;
  }

  function closeMemory() {
    document.getElementById("memory-modal").hidden = true;
  }

  /* ==================================================================
     DETALLES ESCONDIDOS
     ================================================================== */
  function initEasterEggs() {
    var cat = document.getElementById("hidden-cat-home");
    if (cat) {
      cat.addEventListener("click", function () {
        alert("Miau (encontraste a Nari, ja)");
      });
    }

    var roblox = document.getElementById("hidden-roblox");
    if (roblox) {
      roblox.addEventListener("click", function () {
        alert("¿te acordás de todas las veces que nos metimos a Roblox sin ningún plan? jaja");
      });
    }
  }

  /* ==================================================================
     INICIO
     ================================================================== */
  document.addEventListener("DOMContentLoaded", function () {
    spawnPetals();
    initBirthdayDiscovery();
    initBirthdayGate();
    initBirthdayEffects();
    initNavigation();
    initMemories();
    initEasterEggs();
  });
})();
