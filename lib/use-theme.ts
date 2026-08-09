import { useCallback, useEffect, useState } from "react";

type ThemeState = "light" | "dark" | "system";

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);
    let savedTheme: ThemeState | null = null;
    try {
      savedTheme = localStorage.getItem("theme") as ThemeState | null;
    } catch {
      // The default theme remains usable when browser storage is unavailable.
    }

    // Resolve current actual theme
    if (savedTheme === "dark" || savedTheme === "light") {
      setResolvedTheme(savedTheme);
    } else {
      setResolvedTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const isCurrentlyDark = root.getAttribute("data-theme") !== "light";

    const newTheme = isCurrentlyDark ? "light" : "dark";

    setResolvedTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // Apply the theme for this session even if it cannot be persisted.
    }
    root.setAttribute("data-theme", newTheme);
  }, []);

  return { mounted, resolvedTheme, toggleTheme };
}
