const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (menuToggle) menuToggle.textContent = "☰";
  });
});

const filters = document.querySelectorAll(".filter");
const dishes = document.querySelectorAll(".dish");

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(filter => filter.classList.remove("active"));
    button.classList.add("active");
    const category = button.dataset.category;
    dishes.forEach(dish => {
      dish.hidden = category !== "all" && dish.dataset.category !== category;
    });
  });
});

const dateInput = document.querySelector("#guestDate");
if (dateInput) {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString().split("T")[0];
  dateInput.min = localDate;
}

const reservationForm = document.querySelector("#reservationForm");
const formMessage = document.querySelector("#formMessage");

reservationForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!reservationForm.reportValidity()) return;

  const data = new FormData(reservationForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const date = String(data.get("date") || "");
  const time = String(data.get("time") || "");
  const guests = String(data.get("guests") || "");
  const notes = String(data.get("notes") || "").trim();

  const subject = `Table reservation request - ${name}`;
  const body = [
    "Hello Ember & Oak,",
    "",
    "I would like to request a table reservation.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Date: ${date}`,
    `Time: ${time}`,
    `Guests: ${guests}`,
    `Special requests: ${notes || "None"}`,
    "",
    "Please confirm availability.",
    "",
    "Thank you."
  ].join("\n");

  if (formMessage) {
    formMessage.textContent = "Your email app will open with the reservation details. Send the email to complete your request.";
    formMessage.classList.add("show");
  }

  window.location.href =
    `mailto:vedg475@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
