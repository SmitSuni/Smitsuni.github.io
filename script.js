(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Tema claro / oscuro (recordado en este navegador)
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const saved = store.get("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = saved || (prefersDark ? "dark" : "light");
  $("#theme").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });

  // Menú móvil
  const nav = $(".nav nav");
  $("#menu").addEventListener("click", () => nav.classList.toggle("open"));
  $$(".nav nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  // Barra de progreso + navegación sólida
  const header = $("#nav"), bar = $("#progress");
  const onScroll = () => {
    const y = scrollY, h = document.body.scrollHeight - innerHeight;
    header.classList.toggle("solid", y > 24);
    bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Aparición al hacer scroll
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("shown");
      if (e.target.classList.contains("stats")) countUp(e.target);
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (el.parentElement.classList.contains("grid") ? (i % 2) * 90 : 0) + "ms";
    reveal.observe(el);
  });
  setTimeout(() => $(".portrait").classList.add("shown"), 200);

  // Contadores animados
  function countUp(box) {
    $$("[data-count]", box).forEach(el => {
      const end = +el.dataset.count, sep = el.dataset.sep, t0 = performance.now(), dur = 1600;
      const fmt = n => sep ? n.toLocaleString("en-US") : String(n);
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Enlace activo en el menú
  const links = new Map($$(".nav nav a").map(a => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove("active"));
      const a = links.get(e.target.id);
      if (a) a.classList.add("active");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => spy.observe(s));

  // Descargar CV en PDF (diálogo de impresión → Guardar como PDF)
  $("#print").addEventListener("click", () => {
    const prev = root.dataset.theme;
    root.dataset.theme = "light";
    $$(".reveal").forEach(el => el.classList.add("shown"));
    setTimeout(() => { window.print(); root.dataset.theme = prev; }, 50);
  });

  $("#year").textContent = new Date().getFullYear();
})();
