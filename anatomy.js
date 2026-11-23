/* Sección de anatomía guiada por scroll — Anime.js v4 */
document.addEventListener("DOMContentLoaded", () => {
  const sec = document.getElementById("anatomia"), D = window.ANATOMY; if (!sec || !D) return;
  const $ = (s, r = sec) => r.querySelector(s), NS = "http://www.w3.org/2000/svg";
  const v4 = window.anime && typeof anime.animate === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { animate, stagger } = v4 ? anime : {};
  const svg = $(".an-svg"), labels = $(".an-labels"), solid = $(".an-solid"), lines = $(".an-lines");
  const n = D.spots.length, paths = [], dots = [], tags = [];
  D.spots.forEach((s, i) => {
    const ly = 6 + i * ((D.ar - 14) / Math.max(1, n - 1));
    const p = document.createElementNS(NS, "path");
    p.setAttribute("d", `M${s.x} ${s.y} L${66} ${ly} L${69} ${ly}`); p.setAttribute("pathLength", 100); p.setAttribute("class", "leader");
    svg.appendChild(p); paths.push(p);
    const c = document.createElementNS(NS, "circle"); c.setAttribute("r", .9); c.setAttribute("class", "sig"); c.setAttribute("cx", s.x); c.setAttribute("cy", s.y); svg.appendChild(c); dots.push(c);
    const t = document.createElement("span"); t.className = "an-tag"; t.style.top = (ly / D.ar * 100) + "%"; t.innerHTML = `<b>${i + 1}</b>${s.label}`; labels.appendChild(t); tags.push(t);
  });
  // señal: puntos que recorren cada guía (solo en el paso 3)
  const sigAnims = v4 ? paths.map((p, i) => { const o = { t: 0 }, len = p.getTotalLength();
    return animate(o, { t: 1, duration: 1800, delay: i * 250, loop: true, ease: "inOutSine", autoplay: false,
      onUpdate: () => { const q = p.getPointAtLength(o.t * len); dots[i].setAttribute("cx", q.x); dots[i].setAttribute("cy", q.y); } }); }) : [];

  let cur = -1;
  function go(s) {
    if (s === cur) return; cur = s;
    sec.classList.remove("step-0", "step-1", "step-2"); sec.classList.add("step-" + s);
    sec.querySelectorAll(".an-steps li").forEach(li => li.classList.toggle("on", +li.dataset.s === s));
    if (!v4) return;
    animate(sec, { backgroundColor: s === 1 ? "#d9d5cd" : "#17131d", duration: 800, ease: "outExpo" });
    animate(solid, { opacity: s === 0 ? 1 : 0, duration: 700, ease: "outQuad" });
    animate(lines, { opacity: s === 0 ? 0 : 1, duration: 700, ease: "outQuad" });
    animate(paths, { strokeDashoffset: s === 0 ? 100 : 0, delay: stagger(110), duration: 900, ease: "outExpo" });
    animate(tags, { opacity: s === 0 ? 0 : 1, translateX: s === 0 ? 0 : [14, 0], delay: stagger(110, { start: 250 }), duration: 700, ease: "outExpo" });
    animate(dots, { opacity: s === 2 ? 1 : 0, duration: 400 });
    sigAnims.forEach(a => s === 2 ? a.play() : a.pause());
  }
  const mark = $(".mark"), scrub = $(".scrub");
  for (let i = 0; i < 28; i++) scrub.insertBefore(document.createElement("b"), mark);
  let tick = false;
  function update() {
    tick = false;
    const r = sec.getBoundingClientRect(), span = r.height - innerHeight;
    if (r.bottom < 0 || r.top > innerHeight) return;
    const p = Math.max(0, Math.min(1, -r.top / span));
    mark.style.left = (4 + p * 92) + "%";
    go(p < .34 ? 0 : p < .67 ? 1 : 2);
  }
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update); go(0); update();
});
