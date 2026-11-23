/* Anime.js v4: radar del sensor, letras del título y cadena de señal */
document.addEventListener("DOMContentLoaded", () => {
  if (!(window.anime && typeof anime.animate === "function") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { animate, stagger } = anime;
  try {
  const $ = (s, r = document) => r.querySelector(s);
  const stage = $(".mask-stage"); if (!stage) return;
  const NS = "http://www.w3.org/2000/svg", R = d => 40 + d * 1.75; // cm → radio (viewBox 600)
  const C = [ "#e9c23a", "#e8892b", "#43b049", "#2f8fd8" ];       // colores de las puntas

  // --- Capas del radar ---
  const ticksLen = 2 * Math.PI * 268, arcLen = 2 * Math.PI * 290;
  const radar = document.createElement("div");
  radar.className = "radar"; radar.setAttribute("aria-hidden", "true");
  radar.innerHTML = `
   <div class="sweep"></div>
   <svg class="layer ticks" viewBox="-300 -300 600 600"><circle r="268" fill="none" stroke="#d5ad5b" stroke-opacity=".45" stroke-width="12" stroke-dasharray="1.4 ${(ticksLen / 180 - 1.4).toFixed(2)}"/></svg>
   <svg class="layer arcs" viewBox="-300 -300 600 600">${C.map((c, i) => `<circle r="290" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(arcLen / 4 - 26).toFixed(1)} ${(arcLen * 3 / 4 + 26).toFixed(1)}" transform="rotate(${i * 90 + 6})"/>`).join("")}</svg>
   <svg class="layer rings" viewBox="-300 -300 600 600">
     <circle class="range r80" r="${R(80)}" fill="none" stroke="#d5ad5b" stroke-opacity=".4" stroke-dasharray="3 6"/>
     <circle class="range r30" r="${R(30)}" fill="none" stroke="#d5ad5b" stroke-opacity=".55" stroke-dasharray="3 6"/>
     <text x="${R(80) + 6}" y="-6" class="rt">80 CM</text><text x="${R(30) + 6}" y="-6" class="rt">30 CM</text>
     ${[0, 1, 2].map(() => `<circle class="ping" r="30" fill="none" stroke="#d5ad5b" stroke-width="1.5" opacity="0"/>`).join("")}
   </svg>
   <svg class="layer actor" viewBox="-300 -300 600 600"><path id="radarPath" fill="none" stroke="none"/><circle id="person" r="9" fill="#f0cb77"/><circle id="personHalo" r="18" fill="none" stroke="#f0cb77" stroke-opacity=".5"/></svg>`;
  stage.prepend(radar);

  // trayectoria en espiral: persona que se acerca al centro
  let d = "";
  for (let i = 0; i <= 70; i++) { const t = i / 70, r = 258 - t * 214, a = (-150 + t * 125) * Math.PI / 180; d += (i ? "L" : "M") + (r * Math.cos(a)).toFixed(1) + " " + (r * Math.sin(a)).toFixed(1); }
  $("#radarPath").setAttribute("d", d);

  // --- Animaciones continuas ---
  animate(".radar .sweep", { rotate: 360, duration: 6000, loop: true, ease: "linear" });
  animate(".radar .arcs", { rotate: 360, duration: 48000, loop: true, ease: "linear" });
  animate(".radar .ticks", { rotate: -360, duration: 90000, loop: true, ease: "linear" });
  animate(".radar .ping", { r: [30, 255], opacity: [.55, 0], duration: 3200, delay: stagger(1000), loop: true, ease: "outSine" });

  // --- La máscara hecha de franjas (estilo animejs.com) ---
  const clip = $("#maskStripes"), full = $("#maskFull"), N = 56, HH = 565, pitch = HH / N, rects = [], jr = Array(N).fill(0);
  for (let i = 0; i < N; i++) { const r = document.createElementNS(NS, "rect"); r.setAttribute("width", 700); clip.appendChild(r); rects.push(r); }
  const M = { k: .2, amp: .1, phase: 0, full: 0, jit: 0 };
  function paint() {
    rects.forEach((r, i) => {
      const h = Math.max(.05, Math.min(1.06, M.k + Math.sin(M.phase + i * .4) * M.amp)) * pitch;
      r.setAttribute("y", (i * pitch + (pitch - h) / 2).toFixed(2)); r.setAttribute("height", h.toFixed(2)); r.setAttribute("x", (-60 + jr[i]).toFixed(1));
    });
    full.setAttribute("opacity", Math.max(0, Math.min(1, M.full)).toFixed(3));
  }
  const looks = { dormida: { k: .2, amp: .1, full: 0, jit: 0 }, despertar: { k: .62, amp: .22, full: .15, jit: 0 }, posesion: { k: 1, amp: .04, full: 1, jit: .7 } };
  function setLook(key) { animate(M, { ...looks[key], duration: 900, ease: "outExpo", onUpdate: paint }); }
  Object.assign(M, looks.dormida); paint();
  animate(M, { phase: [0, Math.PI * 2], duration: 3200, ease: "linear", loop: true, onUpdate: paint });
  setInterval(() => { for (let i = 0; i < N; i++) jr[i] = M.jit > .05 ? (Math.random() - .5) * M.jit * 22 : 0; }, 120);

  // --- Persona acercándose: la distancia manda el estado ---
  const pathEl = $("#radarPath"), len = pathEl.getTotalLength(), person = $("#person"), halo = $("#personHalo"), prog = { t: 0 };
  const label = $(".label-bottom b"), top = $(".label-top"), cap = $(".stage-caption"), topSpan = top.querySelector("span");
  const texts = {
    dormida:   ["DORMIDA", "— SIN PRESENCIA", "LA MÁSCARA DUERME."],
    despertar: ["DESPERTANDO", "— PRESENCIA DETECTADA", "ALGO SE ACERCA…"],
    posesion:  ["POSESIÓN", "— PROXIMIDAD CRÍTICA", "LA MÁSCARA TE HA NOTADO."] };
  let cur = "";
  function apply(key, cm) {
    if (key !== cur) {
      cur = key; stage.classList.remove("s-dormida", "s-despertar", "s-posesion"); stage.classList.add("s-" + key);
      label.textContent = texts[key][0]; cap.textContent = texts[key][2]; setLook(key);
      if (key === "posesion") animate(".hero-mask-image", { scale: [1, 1.04, 1], duration: 500, ease: "outBack" });
    }
    topSpan.textContent = `${texts[key][1]} · ${cm} CM`;
  }
  animate(prog, {
    t: 1, duration: 9000, delay: 600, ease: "inOutSine", alternate: true, loop: true, loopDelay: 1400,
    onUpdate: () => {
      const p = pathEl.getPointAtLength(prog.t * len);
      person.setAttribute("cx", p.x); person.setAttribute("cy", p.y); halo.setAttribute("cx", p.x); halo.setAttribute("cy", p.y);
      const cm = Math.max(5, Math.min(120, Math.round((Math.hypot(p.x, p.y) - 40) / 1.75)));
      apply(cm <= 30 ? "posesion" : cm <= 80 ? "despertar" : "dormida", cm);
    }
  });
  animate(halo, { r: [10, 28], opacity: [.6, 0], duration: 1100, loop: true, ease: "outQuad" });

  // --- Título: letras que entran en cascada ---
  const split = el => [...el.childNodes].forEach(n => {
    if (n.nodeType === 3) { const f = document.createDocumentFragment(); [...n.textContent].forEach(ch => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; f.appendChild(s); }); n.replaceWith(f); }
    else if (n.nodeType === 1 && n.tagName !== "BR") split(n);
  });
  const h1 = $(".hero h1"); h1.setAttribute("aria-label", h1.innerText.replace(/\s+/g, " ").trim()); split(h1);
  animate(".hero h1 .ch", { translateY: ["0.8em", 0], rotate: [10, 0], opacity: [0, 1], delay: (el, i) => 350 + i * 38, duration: 1000, ease: "outExpo" });

  // --- Cadena de señal: pulso secuencial ---
  animate(".signal-chain span", { color: ["#c7becb", "#f0cb77"], delay: stagger(450), duration: 500, alternate: true, loop: true, loopDelay: 1800, ease: "inOutSine" });
  } catch (e) { console.warn("Anime.js fx:", e); }
});
