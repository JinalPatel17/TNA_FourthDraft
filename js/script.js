(function () {
  const header = document.querySelector(".site-header");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const progressFill = document.querySelector(".progress-fill");
  const links = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = Array.from(links)
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  if (!header) return;

  /* Hamburger toggle (mobile) */
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        hamburger.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Nav: transparent-over-hero -> solid on scroll, plus hide-on-scroll-down (mobile) */
  let lastScrollY = window.scrollY;
  const mobileQuery = window.matchMedia("(max-width: 860px)");

  function onScroll() {
    const currentY = window.scrollY;

    header.classList.toggle("is-scrolled", currentY > 40);

    if (mobileQuery.matches && !(navLinks && navLinks.classList.contains("is-open"))) {
      const scrolledDown = currentY > lastScrollY && currentY > 120;
      header.classList.toggle("is-hidden", scrolledDown);
    } else {
      header.classList.remove("is-hidden");
    }
    lastScrollY = currentY;

    /* Scroll progress fill across full document height */
    if (progressFill) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (currentY / docHeight) * 100 : 0;
      progressFill.style.width = Math.min(100, Math.max(0, pct)) + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Scrollspy - highlight the nav link for the section currently in view */
  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }
})();