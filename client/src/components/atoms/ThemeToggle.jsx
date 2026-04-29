import { Sun, Moon } from "lucide-react";
import { useStore } from "../../store/useStore.js";

export default function ThemeToggle() {
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-full p-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
      onClick={toggleTheme}
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      style={{ lineHeight: 0 }}
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-yellow-400" />
      ) : (
        <Moon size={16} className="text-zinc-600" />
      )}
    </button>
  );
}

