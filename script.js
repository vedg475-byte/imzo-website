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
        formData.append("subject", `New IMZO project enquiry - ${formData.get("service")}`);
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
  // IMZO three-project glass carousel: arrows, dots, keyboard and swipe.
  const projectCarousel = document.querySelector(".imzo-project-carousel");

  if (projectCarousel) {
    const projectSlides = Array.from(projectCarousel.querySelectorAll(".imzo-project-slide"));
    const previousButton = projectCarousel.querySelector(".imzo-carousel-prev");
    const nextButton = projectCarousel.querySelector(".imzo-carousel-next");
    const projectDots = Array.from(projectCarousel.querySelectorAll(".imzo-carousel-dots button"));
    const projectCount = projectCarousel.querySelector(".imzo-carousel-count b");
    const projectStage = projectCarousel.querySelector(".imzo-carousel-stage");
    let currentProject = 0;
    let swipeStartX = null;

    const showProject = index => {
      currentProject = (index + projectSlides.length) % projectSlides.length;

      projectSlides.forEach((slide, slideIndex) => {
        const position = (slideIndex - currentProject + projectSlides.length) % projectSlides.length;
        const active = position === 0;
        slide.classList.toggle("is-active", active);
        slide.classList.toggle("is-next", position === 1);
        slide.classList.toggle("is-prev", position === projectSlides.length - 1);
        slide.classList.toggle("is-hidden", position !== 0 && position !== 1 && position !== projectSlides.length - 1);
        slide.setAttribute("aria-hidden", String(!active));
      });

      projectDots.forEach((dot, dotIndex) => {
        const active = dotIndex === currentProject;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });

      if (projectCount) projectCount.textContent = String(currentProject + 1).padStart(2, "0");
    };

    if (previousButton) {
      previousButton.addEventListener("click", () => showProject(currentProject - 1));
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => showProject(currentProject + 1));
    }

    projectDots.forEach((dot, index) => {
      dot.addEventListener("click", () => showProject(index));
    });

    if (projectStage) {
      projectStage.addEventListener("pointerdown", event => {
        swipeStartX = event.clientX;
      });

      projectStage.addEventListener("pointerup", event => {
        if (swipeStartX === null) return;
        const distance = event.clientX - swipeStartX;
        swipeStartX = null;

        if (Math.abs(distance) > 45) {
          showProject(currentProject + (distance < 0 ? 1 : -1));
        }
      });

      projectStage.addEventListener("pointercancel", () => {
        swipeStartX = null;
      });
    }

    projectCarousel.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") {
        showProject(currentProject - 1);
      } else if (event.key === "ArrowRight") {
        showProject(currentProject + 1);
      }
    });

    showProject(0);
  }
    // IMZO: lightweight 3D container scroll animation
  const scrollStage = document.querySelector(
    ".imzo-project-carousel .imzo-carousel-stage"
  );

  if (
    scrollStage &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    let scrollFramePending = false;

    const updateScrollAnimation = () => {
      const progress = Math.min(
        Math.max(window.scrollY / 360, 0),
        1
      );

      const remaining = 1 - progress;

      scrollStage.style.setProperty(
        "--imzo-scroll-rotate",
        `${9 * remaining}deg`
      );

      scrollStage.style.setProperty(
        "--imzo-scroll-y",
        `${14 * remaining}px`
      );

      scrollStage.style.setProperty(
        "--imzo-scroll-scale",
        `${0.98 + 0.02 * progress}`
      );

      scrollFramePending = false;
    };

    const requestScrollUpdate = () => {
      if (scrollFramePending) return;

      scrollFramePending = true;
      window.requestAnimationFrame(updateScrollAnimation);
    };

    window.addEventListener("scroll", requestScrollUpdate, {
      passive: true
    });

    window.addEventListener("resize", requestScrollUpdate, {
      passive: true
    });

    updateScrollAnimation();
  }

  // IMZO footer: smooth back-to-top button
  const footerTopButton = document.querySelector(".imzo-footer-top");

  if (footerTopButton) {
    footerTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
    });
  }
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();