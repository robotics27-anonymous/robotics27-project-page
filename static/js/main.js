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
