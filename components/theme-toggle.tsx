"use client"

import * as React from "react"
import { Moon, Sun, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"


export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-10 h-10" />

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle Appearance Mode"
      className="relative w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/5 hover:bg-white/10 group transition-all duration-500 overflow-hidden"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="light"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
          >
            <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />
          </motion.div>
        ) : (
          <motion.div
            key="dark"
            initial={{ y: 20, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.3, ease: "anticipate" }}
          >
            <Moon className="w-5 h-5 text-blue-400 fill-blue-400/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corner element */}
      <div className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
      </div>
    </Button>
  )
}
