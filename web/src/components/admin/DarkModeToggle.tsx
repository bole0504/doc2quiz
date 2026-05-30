"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "docx2quiz_dark";

export function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    const isDark = saved === "1";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem(KEY, next ? "1" : "0");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  if (!mounted) return <div className="h-[34px] w-[34px]" />;

  return (
    <button
      onClick={toggle}
      title={dark ? "Chuyển sáng" : "Chuyển tối"}
      className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] text-[var(--textMuted)] transition-colors hover:bg-[var(--bgSubtle)] hover:text-[var(--text)]"
    >
      {dark ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
