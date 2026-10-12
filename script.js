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
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton ? submitButton.textContent : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      if (status) status.textContent = "Sending your enquiry...";

      try {
        const formData = new FormData(form);
        formData.append("access_key", "a821e845-066b-40b5-9a75-6324193b9bc0");
        formData.append("subject", `New IMZO project enquiry â€” ${formData.get("service")}`);
        formData.append("from_name", "IMZO Website");

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Submission failed");
        }

        if (status) {
          status.textContent = "Thanks! Your enquiry has been sent. We'll get back to you soon.";
        }
        form.reset();
      } catch (error) {
        console.error("IMZO enquiry form error:", error);
        if (status) {
          status.textContent = "Sorry, your enquiry could not be sent. Please try again.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();