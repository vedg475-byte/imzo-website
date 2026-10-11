
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // Mobile navigation
  if (menuToggle && nav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕ Close" : "☰ Menu";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰ Menu";
      });
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰ Menu";
      }
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Reveal sections as they enter the viewport
  const revealElements = document.querySelectorAll(
    ".section-heading, .service-card, .about-visual, .about-copy, .step, .cta-band, .contact-grid"
  );

  revealElements.forEach((element) => element.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // Contact form: validate and prepare an email draft
  const contactForm = document.querySelector("#contactForm");
  const formMessage = document.querySelector("#formMessage");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        formMessage.textContent = "Please complete all required fields.";
        formMessage.className = "form-message error";
        return;
      }

      const subject = `Project enquiry from ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${service || "Not specified"}`,
        "",
        "Project details:",
        message
      ].join("\n");

      const mailto =
        "mailto:vedg475@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      formMessage.textContent =
        "Your email draft is ready. Please send it from your email app.";
      formMessage.className = "form-message success";

      window.location.href = mailto;
    });
  }

  // Current year in footer, if a year placeholder exists
  const yearElement = document.querySelector("[data-current-year]");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
