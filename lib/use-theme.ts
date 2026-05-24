import { useCallback, useEffect, useState } from "react";

type ThemeState = "light" | "dark" | "system";

export function useThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as ThemeState | null;

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
    localStorage.setItem("theme", newTheme);
    root.setAttribute("data-theme", newTheme);
  }, []);

  return { mounted, resolvedTheme, toggleTheme };
}
