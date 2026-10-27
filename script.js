(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";

  // Péndolas del puente: siguen la curva de cada cable (Bézier cuadrática)
  const DECK = 176;
  const spans = [
    { p0: [30, 176], p1: [130, 150], p2: [230, 50], from: 0.25, step: 0.125 },
    { p0: [230, 50], p1: [400, 250], p2: [570, 50], from: 0.0625, step: 0.0625 },
    { p0: [570, 50], p1: [670, 150], p2: [770, 176], from: 0.125, step: 0.125 }
  ];
  const q = (a, b, c, t) => (1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c;
  const hangers = $("#hangers");
  let n = 0;
  spans.forEach(s => {
    for (let t = s.from; t < 1 - 1e-6; t += s.step) {
      const x = q(s.p0[0], s.p1[0], s.p2[0], t), y = q(s.p0[1], s.p1[1], s.p2[1], t);
      if (DECK - y < 4) continue;
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", x.toFixed(1)); l.setAttribute("x2", x.toFixed(1));
      l.setAttribute("y1", y.toFixed(1)); l.setAttribute("y2", DECK);
      l.style.animationDelay = (1.6 + n++ * 0.04) + "s";
      hangers.appendChild(l);
    }
  });

  // Celosía bajo el tablero
  const truss = $("#truss");
  let d = "";
  for (let x = 20; x < 780; x += 20) d += `M${x} 186 L${x + 10} 196 L${x + 20} 186 `;
  d += "M20 196H780";
  const tp = document.createElementNS(NS, "path");
  tp.setAttribute("d", d);
  truss.appendChild(tp);

  // Aparición sobria al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
  }), { threshold: 0.1 });
  $$(".reveal").forEach(el => io.observe(el));

  // CV en PDF
  $("#print").addEventListener("click", () => {
    $$(".reveal").forEach(el => el.classList.add("shown"));
    setTimeout(() => window.print(), 50);
  });

  $("#year").textContent = new Date().getFullYear();
})();
