/* Shared runtime for the saas-ui-skills previews.
 *
 * 1. Teaches the Tailwind Play CDN about the shadcn/ui semantic colors
 *    (bg-background, text-muted-foreground, border, ...) so the example
 *    markup renders exactly like the real components.
 * 2. Applies the saved / preferred color scheme before paint (no flash).
 * 3. Exposes toggleTheme() for the header button and boots lucide icons.
 *
 * Load order in each page:
 *   <script src="https://cdn.tailwindcss.com"></script>
 *   <script src="./theme.js"></script>
 *   <link rel="stylesheet" href="./theme.css" />
 *   <script src="https://unpkg.com/lucide@latest"></script>
 */

// 1. Tailwind config — the CDN global `tailwind` exists once its script ran.
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
};

// 2. Apply theme before first paint to avoid a flash of the wrong scheme.
(function applyStoredTheme() {
  try {
    var saved = localStorage.getItem("theme");
    var prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {
    /* localStorage blocked — default to light. */
  }
})();

// 3. Header toggle.
function toggleTheme() {
  var isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch (e) {
    /* ignore */
  }
}

// Inject a small brand favicon so every preview avoids a 404.
(function setFavicon() {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
    '<rect width="32" height="32" rx="7" fill="#0f172a"/>' +
    '<text x="16" y="22" font-family="Inter,system-ui,sans-serif" font-size="18"' +
    ' font-weight="700" fill="#ffffff" text-anchor="middle">S</text></svg>';
  var link = document.querySelector("link[rel='icon']") || document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = "data:image/svg+xml," + encodeURIComponent(svg);
  document.head.appendChild(link);
})();

// Boot icons once the DOM (and the lucide script below) are ready.
window.addEventListener("DOMContentLoaded", function () {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
});
