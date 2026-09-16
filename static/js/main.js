/* ==========================================================================
   Lightweight, dependency-free interactions:
   - image carousel(s)
   - "Copy" button for the BibTeX block
   ========================================================================== */

// ----- Carousel -----------------------------------------------------------
document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const dotsWrap = carousel.querySelector("[data-dots]");
  if (slides.length === 0) return;
  let index = 0;

  // build dots
  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    dot.addEventListener("click", function () { show(i); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("active", k === index));
    dots.forEach((d, k) => d.classList.toggle("active", k === index));
  }

  const prev = carousel.querySelector("[data-prev]");
  const next = carousel.querySelector("[data-next]");
  if (prev) prev.addEventListener("click", () => show(index - 1));
  if (next) next.addEventListener("click", () => show(index + 1));

  show(0);
});

// ----- Copy BibTeX --------------------------------------------------------
document.querySelectorAll("[data-copy-bibtex]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    const code = btn.parentElement.querySelector(".bibtex code");
    if (!code) return;
    navigator.clipboard.writeText(code.innerText.trim()).then(function () {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = original), 1500);
    });
  });
});


// ----- Speed strip: one tick per commanded step, as in Fig. 4 of the paper --------
// STEPS = [[video time, 1 if a contact cue had fired at that commanded step]].
(function () {
  const video = document.querySelector(".hero-bg");
  const canvas = document.getElementById("stepband");
  if (!video || !canvas || typeof STEPS === "undefined") return;
  const ctx = canvas.getContext("2d");
  const FREE = "#7FD8C4", GATE = "#FF8F87", INK = "#F2F4F5";
  const LABEL = ["MAX SPEED", "LIMITED SPEED"], SUB = ["free space", "near predicted contact"];
  function draw() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (canvas.width !== Math.round(W * devicePixelRatio)) { canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio; }
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const dur = video.duration || STEPS[STEPS.length - 1][0] + 1, now = video.currentTime || 0;
    const X = t => (t / dur) * W, px = X(now);
    ctx.fillStyle = "rgba(20,24,28,0.45)"; ctx.fillRect(0, 0, W, H);
    let mode = null, lastT = -1;
    for (const [t, g] of STEPS) {
      if (t > now) break;
      const x = X(t);
      ctx.fillStyle = g ? GATE : FREE;
      ctx.fillRect(x - 0.75, g ? H * 0.12 : H * 0.22, 1.5, g ? H * 0.76 : H * 0.56);
      mode = g; lastT = t;
    }
    if (now - lastT > 1.5) mode = null;                 // idle: no step in the last 1.5 s
    ctx.fillStyle = "rgba(255,255,255,.10)"; ctx.fillRect(px - 6, 0, 12, H);
    ctx.fillStyle = INK; ctx.fillRect(px - 1, 0, 2, H);
    const lbl = document.getElementById("modelabel");
    if (lbl) {
      const html = mode === null ? "" : LABEL[mode] + '<span class="sub">' + SUB[mode] + "</span>";
      if (lbl.innerHTML !== html) { lbl.innerHTML = html; lbl.className = "mode-label " + (mode === null ? "" : (mode ? "limited" : "max")); }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
