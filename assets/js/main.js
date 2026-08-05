const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

document.getElementById("year").textContent = new Date().getFullYear();

function syncThemeIcon() {
  const isDark = root.dataset.theme === "dark";
  themeIcon.className = isDark ? "fas fa-sun" : "fas fa-moon";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeToggle.title = isDark ? "Switch to light theme" : "Switch to dark theme";
}

syncThemeIcon();

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  syncThemeIcon();
});

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  siteNav.classList.toggle("open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 12); }
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-25% 0px -62% 0px", threshold: 0 });
sections.forEach((section) => activeSectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -30px" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector("span");
  const formData = new FormData(contactForm);
  const payload = Object.fromEntries(formData.entries());
  payload._replyto = payload.email;

  submitButton.disabled = true;
  submitLabel.textContent = "Sending…";
  formStatus.className = "form-status";
  formStatus.textContent = "Sending your message…";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === "true")) {
      throw new Error(result.message || "Unable to send message");
    }

    contactForm.reset();
    formStatus.className = "form-status success";
    formStatus.textContent = "Thanks — your message was sent successfully. I’ll reply by email.";
  } catch (error) {
    formStatus.className = "form-status error";
    formStatus.textContent = "The message could not be sent. Please email me directly at nikhildubey183@gmail.com.";
  } finally {
    submitButton.disabled = false;
    submitLabel.textContent = "Send message";
  }
});

