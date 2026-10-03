"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Check, Moon, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const subscribeToMount = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({
  className,
  labeled = false,
}: {
  className?: string;
  labeled?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToMount,
    getClientSnapshot,
    getServerSnapshot,
  );
  const currentTheme = mounted ? theme ?? "system" : "system";
  const Icon =
    currentTheme === "light" ? Sun : currentTheme === "dark" ? Moon : SunMoon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={labeled ? "ghost" : "outline"}
          size={labeled ? "default" : "icon"}
          className={cn(className)}
          aria-label="Choose color theme"
          title="Choose color theme"
        >
          <Icon aria-hidden="true" />
          {labeled && <span>Appearance</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-menu">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={setTheme}
        >
          {(["light", "dark", "system"] as const).map((option) => (
            <DropdownMenuRadioItem
              key={option}
              value={option}
              className="theme-menu-item"
            >
              {option === "light" ? (
                <Sun aria-hidden="true" />
              ) : option === "dark" ? (
                <Moon aria-hidden="true" />
              ) : (
                <SunMoon aria-hidden="true" />
              )}
              <span>{option[0].toUpperCase() + option.slice(1)}</span>
              {currentTheme === option && (
                <Check className="theme-menu-check" aria-hidden="true" />
              )}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
