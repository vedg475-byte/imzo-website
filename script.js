(() => {
  "use strict";
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }));
  }

  // Smoothly reveal sections when they enter the viewport.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Preselect a service when someone clicks a service card CTA.
  document.querySelectorAll("[data-service]").forEach(link => {
    link.addEventListener("click", () => {
      const select = document.querySelector("#service");
      if (select) {
        const desired = link.dataset.service;
        const matchingOption = Array.from(select.options).find(option => option.value === desired || option.text === desired);
        if (matchingOption) select.value = matchingOption.value;
      }
    });
  });

  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const subject = `Project enquiry — ${data.get("service")}`;
      const body = [
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Service: ${data.get("service")}`,
        `Budget: ${data.get("budget")}`,
        "",
        "Project details:",
        data.get("message")
      ].join("\n");

      // Replace this placeholder with the agency's real email before publishing.
      const businessEmail = "vedg475@gmail.com";

      if (businessEmail.endsWith(".example")) {
        status.textContent = "Demo mode: form validation works. Before launch, replace hello@vertexdigital.example in script.js with your real email address.";
        status.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }

      const mailto = `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = "Opening your email app with the enquiry details…";
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(businessEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

window.open(gmailUrl, "_blank");
    });
  }

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();