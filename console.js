/* Consola de estados: máscara real con ojos animados + radar de distancia (Anime.js v4) */
document.addEventListener("DOMContentLoaded", () => {
  const D = window.MINI, svg = document.getElementById("miniSvg"); if (!D || !svg) return;
  const $ = id => document.getElementById(id);
  const v4 = window.anime && typeof anime.animate === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const A = v4 ? anime.animate : null, host = svg.closest(".console-visual");
  const R = d => 60 + d * 2, ANG = -38 * Math.PI / 180;                    // cm → radio del radar
  const S = { lx: 0, ly: 12, rx: 0, ry: 12, lid: .66, pup: 1, d: 100 };
  const looks = {
    dormida:   { lx: 0,  ly: 14, rx: 0,  ry: 14, lid: .66, pup: 1 },
    despertar: { lx: 8,  ly: -4, rx: -8, ry: -4, lid: .1,  pup: 1.1 },
    posesion:  { lx: 0,  ly: 0,  rx: 0,  ry: 0,  lid: 0,   pup: .5 },
    calma:     { lx: 0,  ly: 8,  rx: 0,  ry: 8,  lid: .38, pup: .9 } };
  function paint() {
    ["L", "R"].forEach(k => {
      const c = D[k], gx = c[0] + S["" + k.toLowerCase() + "x"], gy = c[1] + S[k.toLowerCase() + "y"];
      $("gaze" + k).setAttribute("transform", `translate(${gx.toFixed(1)} ${gy.toFixed(1)})`);
      $("pup" + k).setAttribute("r", (9 * S.pup).toFixed(2));
      $("cov" + k).setAttribute("cx", D["c" + k][0]); $("cov" + k).setAttribute("cy", D["c" + k][1]);
      const lid = $("lid" + k); lid.setAttribute("x", c[0] - D.re - 2); lid.setAttribute("width", D.re * 2 + 4);
      lid.setAttribute("y", c[1] - D.re - 2); lid.setAttribute("height", Math.max(0, S.lid * (D.re * 2 + 4)).toFixed(1));
    });
    const r = R(S.d), x = D.cx0 + Math.cos(ANG) * r, y = D.cy0 + Math.sin(ANG) * r;
    ["mdot", "mdotHalo"].forEach(i => { $(i).setAttribute("cx", x.toFixed(1)); $(i).setAttribute("cy", y.toFixed(1)); });
  }
  let key = "", move = null, shake = null, haloA = null;
  function to(target, ms, ease) { if (move) move.pause(); if (!A) { Object.assign(S, target); paint(); return; }
    move = A(S, { ...target, duration: ms, ease: ease || "outExpo", onUpdate: paint }); }
  window.miniMask = {
    set(k, distance) {
      if (shake) { shake.pause(); shake = null; }
      if (k !== key) {
        key = k; host.dataset.s = k;
        to(looks[k], k === "calma" ? 1800 : k === "posesion" ? 350 : 800, k === "posesion" ? "outBack" : "outExpo");
        $("mdot").setAttribute("fill", k === "posesion" ? "#ff6a5e" : "#f0cb77");
        if (k === "posesion" && A) shake = A(S, { lx: [-18, 18], rx: [18, -18], duration: 220, delay: 400, alternate: true, loop: 9, ease: "inOutSine", onUpdate: paint });
      }
      if (A) A(S, { d: distance, duration: 600, ease: "outQuad", onUpdate: paint }); else { S.d = distance; paint(); }
    } };
  paint();
  if (A) { haloA = A($("mdotHalo"), { r: [10, 28], opacity: [.6, 0], duration: 1100, loop: true, ease: "outQuad" }); }
  window.miniMask.set("dormida", 100);
});
