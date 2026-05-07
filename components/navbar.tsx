"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { LayoutDashboard, LogOut, Menu, X, Command, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Network", href: "/jobs", icon: Globe },
    ...(session?.user?.role === "RECRUITER"
      ? [{ name: "Console", href: "/recruiter/dashboard", icon: LayoutDashboard }]
      : session?.user
        ? [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
        : []
    ),
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/85 backdrop-blur-2xl border-b border-white/5 py-3 shadow-2xl shadow-black/20"
          : "bg-transparent py-6"
      )}
    >
      <div className="premium-container flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 sapphire-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-500">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase text-foreground">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav Pill */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/8 rounded-2xl p-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 px-5 h-9 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest whitespace-nowrap",
                pathname === link.href
                  ? "bg-background text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <div className="w-px h-5 bg-white/10" />

          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold tracking-tight leading-tight">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">
                  {session.user.role}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-xl border-white/10 hover:bg-white/5 hover:border-destructive/50 transition-all group"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 h-9 rounded-xl font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all inline-flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 h-9 rounded-xl font-bold text-xs uppercase tracking-widest sapphire-gradient text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 inline-flex items-center"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-3xl border-b border-white/8 shadow-2xl"
          >
            <div className="premium-container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm tracking-tight",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-white/8 my-2" />

              {session ? (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-destructive hover:bg-destructive/10 font-bold text-sm tracking-tight transition-all text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <div className="grid gap-2">
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-12 rounded-xl sapphire-gradient text-white font-bold text-sm flex items-center justify-center"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/5 text-foreground font-bold text-sm flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
