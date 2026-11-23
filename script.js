/* Anime.js v4 (UMD global `anime`) */
document.addEventListener("DOMContentLoaded", () => {
  window.__ok = true;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const v4 = window.anime && typeof anime.animate === "function";
  const motion = v4 && !reduce;
  const { animate, stagger, utils } = v4 ? anime : {};
  const safe = fn => { try { fn(); } catch (e) { console.warn("Anime.js:", e); } };
  if (!motion) root.classList.add("no-motion");

  // ---- Intro y movimiento del héroe ----
  if (motion) safe(() => {
    animate(".reveal", { opacity: [0, 1], translateY: [24, 0], delay: (el, i) => 250 + i * 180, duration: 1100, ease: "outExpo" });
    animate(".mask-art", { translateY: [10, -10], alternate: true, loop: true, duration: 3600, ease: "inOutSine" });
    animate(".meter i", { scaleY: [0.45, 1.25], delay: stagger(110), alternate: true, loop: true, duration: 550, ease: "inOutSine" });
  });
  else $$(".reveal").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });

  // ---- Estados ----
  const states = {
    dormida:   { name: "DORMIDA / 01",   signal: "SIN PRESENCIA CERCANA",    rep: 100, servos: "SERVOS 90°/90°",   description: "No detecta a nadie. Los ojos permanecen en posición neutra y la máscara parece inactiva.", left: [0, 0], right: [0, 0] },
    despertar: { name: "DESPERTAR / 02", signal: "PRESENCIA DETECTADA",      rep: 58,  servos: "SERVOS 65°/115°",  description: "Una persona se encuentra entre 30 y 80 cm. Los ojos se abren o cambian lentamente hacia una posición de alerta.", left: [-9, 4], right: [9, -4] },
    posesion:  { name: "POSESIÓN / 03",  signal: "PROXIMIDAD CRÍTICA",       rep: 18,  servos: "SERVOS 45°/135°",  description: "La persona está a 30 cm o menos. Los ojos realizan movimientos rápidos y alternados para comunicar un estado intenso.", left: [13, -5], right: [-13, 5] },
    calma:     { name: "CALMA / 04",     signal: "RETORNO AL ESTADO INICIAL", rep: 100, servos: "RETORNO A 90°/90°", description: "La persona se aleja. Después de cinco segundos sin presencia cercana, los ojos regresan lentamente a su posición neutra.", left: [-3, 0], right: [3, 0] }
  };
  const buttons = $$(".state-button"), slider = $("#distanceSlider"), out = $("#sliderOut");
  let current = "dormida", calmTimer = null;

  function render(key, distance) {
    const s = states[key], posesion = key === "posesion";
    current = key;
    buttons.forEach(b => { const on = b.dataset.state === key; b.classList.toggle("active", on); b.setAttribute("aria-pressed", on); });
    $("#stateName").textContent = s.name;
    $("#stateDescription").textContent = s.description;
    $("#distanceValue").innerHTML = `${distance} <small>cm</small>`;
    $("#signalText").textContent = s.signal + " · " + s.servos;
    window.miniMask && miniMask.set(key, distance);
  }
  // Máquina de estados: >80 dormida, 30–80 despertar, ≤30 posesión; al alejarse pasa 5 s por CALMA.
  function fromDistance(d) {
    clearTimeout(calmTimer);
    out.textContent = `${d} cm`;
    if (d > 80) {
      if (current === "despertar" || current === "posesion") {
        render("calma", d);
        calmTimer = setTimeout(() => render("dormida", +slider.value), 5000);
      } else if (current !== "calma") render("dormida", d);
      else { $("#distanceValue").innerHTML = `${d} <small>cm</small>`; calmTimer = setTimeout(() => render("dormida", +slider.value), 5000); }
    } else render(d <= 30 ? "posesion" : "despertar", d);
  }
  slider.addEventListener("input", () => fromDistance(+slider.value));
  buttons.forEach(b => b.addEventListener("click", () => {
    clearTimeout(calmTimer);
    const key = b.dataset.state, d = states[key].rep;
    slider.value = d; out.textContent = `${d} cm`;
    render(key, d);
    if (key === "calma") calmTimer = setTimeout(() => render("dormida", +slider.value), 5000);
  }));

  // ---- Aparición al hacer scroll ----
  const targetsSel = ".section-title, .tech-card, .model-gallery figure, .model-extra figure, .safety-list p, .steps li";
  if (motion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const els = $$(targetsSel, e.target);
      safe(() => animate(els, { opacity: [0, 1], translateY: [20, 0], delay: stagger(90), duration: 800, ease: "outExpo",
        onComplete: () => els.forEach(x => { x.style.transform = ""; }) }));   // libera el transform para el hover
      io.unobserve(e.target);
    }), { threshold: 0.12 });
    $$(".intro, .states-section, .tech-section, .model-section, .safety-section, .process-section").forEach(s => io.observe(s));
  } else root.classList.add("no-motion");

  // ---- Barra superior ----
  const bar = $(".topbar"), onScroll = () => bar.classList.toggle("scrolled", scrollY > 40);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  const links = $$("nav a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle("current", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    $$("section[id]").forEach(s => spy.observe(s));
  }

  // ---- Brillo del cursor y menú móvil ----
  const glow = $(".cursor-glow");
  addEventListener("pointermove", e => { glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`; }, { passive: true });
  const nav = $("nav"), toggle = $(".menu-toggle");
  const setMenu = open => { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open); };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  links.forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });
});
