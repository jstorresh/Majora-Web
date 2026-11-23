document.addEventListener("DOMContentLoaded",()=>{
  const V=window.VIEWS; if(!V) return;
  const $=s=>document.querySelector(s), tabs=[...document.querySelectorAll(".view-tab")];
  const img=$("#viewerImg"), pins=$("#pins"), list=$("#spotList");
  function show(k){
    const v=V[k];
    tabs.forEach(t=>{const on=t.dataset.view===k;t.classList.toggle("active",on);t.setAttribute("aria-pressed",on);});
    img.src=v.src;img.width=v.w;img.height=v.h;img.alt=v.alt;
    $("#viewerTag").textContent=v.tag;$("#viewerTitle").textContent=v.title;$("#viewerText").textContent=v.text;
    pins.innerHTML="";list.innerHTML="";
    const hot=i=>[...pins.children,...list.children].forEach(el=>el.classList.toggle("hot",+el.dataset.i===i));
    v.spots.forEach((s,i)=>{
      const b=document.createElement("button");b.className="pin";b.dataset.i=i;b.style.left=s.x+"%";b.style.top=s.y+"%";b.textContent=i+1;b.setAttribute("aria-label",s.label);
      const li=document.createElement("li");li.dataset.i=i;li.innerHTML=`<b>${i+1}</b><span><strong>${s.label}</strong>${s.desc}</span>`;
      [b,li].forEach(el=>["mouseenter","focus","click"].forEach(ev=>el.addEventListener(ev,()=>hot(i))));
      pins.appendChild(b);list.appendChild(li);
    });
  }
  tabs.forEach(t=>t.addEventListener("click",()=>show(t.dataset.view)));
  show("frontal");
  const cb=$(".copy-btn");
  if(cb) cb.addEventListener("click",async()=>{try{await navigator.clipboard.writeText($(".code-box pre").textContent);cb.textContent="COPIADO ✓";setTimeout(()=>cb.textContent="COPIAR",1800);}catch(e){cb.textContent="SELECCIONA Y COPIA";}});
});
