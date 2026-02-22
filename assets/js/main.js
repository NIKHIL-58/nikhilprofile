// main.js

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// -------- THEME TOGGLE (dark/light) ----------
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  // Icon: dark -> moon, light -> sun
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fas fa-moon" : "fas fa-sun";
  }
}

// Load saved theme
const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme || "dark");

// Toggle theme
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
}

// -------- Smooth scroll (with navbar offset) ----------
document.querySelectorAll('a.nav-link[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    // Close navbar on mobile
    const navbarCollapse = document.querySelector(".navbar-collapse");
    if (navbarCollapse?.classList.contains("show")) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }

    const yOffset = 85;
    const y = target.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// -------- Active nav link on scroll ----------
const sections = document.querySelectorAll("section[id], header[id]");
const navLinks = document.querySelectorAll(".navbar .nav-link");

function setActiveNav() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 110;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((l) => l.classList.remove("active"));
      document
        .querySelector(`.navbar .nav-link[href="#${sectionId}"]`)
        ?.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveNav);
setActiveNav();

// -------- ScrollReveal animations ----------
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "30px",
    duration: 900,
    delay: 120,
    reset: false,
  });

  sr.reveal(".hero-inner", { interval: 120 });
  sr.reveal("#about .row, #skills .row, #services .row, #experience .timeline, #projects .row, #contact .row", {
    interval: 120,
  });
}

// -------- Contact form -> mailto ----------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value?.trim() || "";
    const email = document.getElementById("email")?.value?.trim() || "";
    const subject = document.getElementById("subject")?.value?.trim() || "";
    const message = document.getElementById("message")?.value?.trim() || "";

    const to = "nikhildubey183@gmail.com";
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;

    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
  });
}