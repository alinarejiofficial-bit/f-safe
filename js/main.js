(() => {
  const body = document.body;

  // Preloader — quick brand flash, then dismiss
  const preloader = document.querySelector(".preloader");
  const finishPreloader = () => {
    if (!preloader || preloader.classList.contains("is-done")) return;
    preloader.classList.add("is-done");
    body.classList.remove("is-loading");
  };
  window.addEventListener("load", () => {
    setTimeout(finishPreloader, 420);
  });
  // Safety fallback if load is delayed
  setTimeout(finishPreloader, 1600);

  // Sticky header
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.classList.toggle("is-open");
    nav?.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    body.style.overflow = open ? "hidden" : "";
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle?.classList.remove("is-open");
      nav.classList.remove("is-open");
      body.style.overflow = "";
    });
  });

  // Scroll reveals
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // FAQ accordion + entrance
  const faqSection = document.querySelector("[data-faq]");
  if (faqSection) {
    if ("IntersectionObserver" in window) {
      const faqIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              faqSection.classList.add("is-inview");
              faqIo.unobserve(faqSection);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
      );
      faqIo.observe(faqSection);
    } else {
      faqSection.classList.add("is-inview");
    }
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-item__trigger");
    btn?.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq-item__trigger")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("is-open", !open);
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  // Contact form (front-end only)
  const form = document.querySelector(".contact-form form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = form.querySelector(".form-note");
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      if (note) {
        note.textContent = "Please fill in your name, email, and message.";
        note.style.color = "#c45512";
      }
      return;
    }

    const subject = encodeURIComponent(`Enquiry from ${name}`);
    const bodyText = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${data.get("phone") || "-"}\nService: ${
        data.get("service") || "-"
      }\n\n${message}`
    );
    window.location.href = `mailto:Fsafe25@yahoo.com?subject=${subject}&body=${bodyText}`;
    if (note) {
      note.textContent = "Opening your email client…";
      note.style.color = "#1f7a4d";
    }
    form.reset();
  });

  // Keep hero background sharp — no parallax/zoom on the image

  // Floating contact FAB — messages button expands social icons upward
  const fab = document.querySelector("[data-fab]");
  const fabToggle = fab?.querySelector(".fab__toggle");
  const fabMenu = fab?.querySelector(".fab__menu");

  const setFabOpen = (open) => {
    fab.classList.toggle("is-open", open);
    fabToggle.setAttribute("aria-expanded", String(open));
    fabToggle.setAttribute("aria-label", open ? "Close messages" : "Open messages");
    fabMenu?.setAttribute("aria-hidden", String(!open));
  };

  fabToggle?.addEventListener("click", () => {
    setFabOpen(!fab.classList.contains("is-open"));
  });
  document.addEventListener("click", (e) => {
    if (!fab?.classList.contains("is-open")) return;
    if (fab.contains(e.target)) return;
    setFabOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !fab?.classList.contains("is-open")) return;
    setFabOpen(false);
  });
})();
