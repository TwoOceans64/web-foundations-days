const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeBtn = document.querySelector("#theme-toggle");

const STORAGE_KEY = "day4-draft";
const THEME_KEY = "day4-theme";

// --- Update counts ---
function updateCounts() {
  const text = textarea.value;
  const length = text.length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} ${words === 1 ? "word" : "words"}`;

  charCount.classList.remove("warning", "over");
  if (length > 200) {
    charCount.classList.add("over");
  } else if (length > 180) {
    charCount.classList.add("warning");
  }
}

// --- Save draft ---
function saveDraft() {
  localStorage.setItem(STORAGE_KEY, textarea.value);
}

// --- Restore draft ---
function restoreDraft() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) textarea.value = saved;
}

// --- Clear everything ---
function clearAll() {
  textarea.value = "";
  localStorage.removeItem(STORAGE_KEY);
  updateCounts();
}

// --- Theme toggle ---
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function toggleTheme() {
  const current = document.body.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
}

// --- Event listeners ---
textarea.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

clearBtn.addEventListener("click", clearAll);
themeBtn.addEventListener("click", toggleTheme);

// --- On load ---
restoreDraft();
const savedTheme = localStorage.getItem(THEME_KEY) || "light";
applyTheme(savedTheme);
updateCounts();