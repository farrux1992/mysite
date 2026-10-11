// ===== Tema (dark / light) =====
// Avval tashrif buyuruvchi tanlagan tema, u bo'lmasa qurilma sozlamasi ishlatiladi.
const root = document.documentElement;
const systemLight = window.matchMedia("(prefers-color-scheme: light)");

function getSavedTheme() {
  try { return localStorage.getItem("theme"); } catch (e) { return null; }
}

function saveTheme(theme) {
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fb" : "#0b1220");

  const btn = document.getElementById("theme-toggle");
  if (btn) {
    const label = theme === "light" ? "Tungi temaga o'tish" : "Yorug' temaga o'tish";
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
}

// Sahifa chizilishidan oldin darhol qo'yiladi
applyTheme(getSavedTheme() || (systemLight.matches ? "light" : "dark"));

// ===== Scroll'da paydo bo'lish =====
// Kontent faqat JS ishlasa va harakat o'chirilmagan bo'lsa yashiriladi
const canReveal = "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canReveal) root.classList.add("reveal-on");

// Tanlov qilinmagan bo'lsa, qurilma temasi o'zgarganda sayt ham o'zgaradi
systemLight.addEventListener("change", (e) => {
  if (!getSavedTheme()) applyTheme(e.matches ? "light" : "dark");
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("theme-toggle");
  btn.hidden = false;
  applyTheme(root.getAttribute("data-theme"));

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    saveTheme(next);
    applyTheme(next);
  });

  // Element ekranga kirganda bir marta paydo bo'ladi
  if (canReveal) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  // Footerdagi yilni avtomatik yangilaydi (JS o'chiq bo'lsa, HTMLdagi yil qoladi)
  document.getElementById("year").textContent = new Date().getFullYear();
});
