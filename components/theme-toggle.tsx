"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  labeled = false,
}: {
  className?: string;
  labeled?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      type="button"
      variant={labeled ? "ghost" : "outline"}
      size={labeled ? "default" : "icon"}
      className={cn(className)}
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Icon aria-hidden="true" />
      {labeled && <span>{isDark ? "Light appearance" : "Dark appearance"}</span>}
    </Button>
  );
}
