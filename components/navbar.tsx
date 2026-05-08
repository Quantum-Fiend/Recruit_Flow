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
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        isScrolled
          ? "bg-background/40 backdrop-blur-3xl border-b border-border/50 py-4 shadow-2xl shadow-black/10"
          : "bg-transparent py-8"
      )}
    >
      <div className="premium-container flex items-center justify-between gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group flex-shrink-0">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-105 transition-all duration-500">
            <Command className="w-5 h-5 text-background" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase text-gradient group-hover:opacity-80 transition-opacity">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav Pill */}
        <nav className="hidden lg:flex items-center bg-secondary/20 border border-border/40 rounded-2xl p-1 backdrop-blur-3xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-6 h-10 rounded-xl transition-all duration-500 font-bold text-[11px] uppercase tracking-widest whitespace-nowrap",
                pathname === link.href
                  ? "bg-background text-primary shadow-lg shadow-black/5"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
              )}
            >
              <link.icon className="w-3.5 h-3.5" />
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-xs font-black tracking-tighter leading-tight text-foreground">{session.user.name}</span>
                <span className="text-[10px] text-primary/60 font-black uppercase tracking-widest">
                  {session.user.role}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign Out"
                className="w-11 h-11 rounded-xl bg-secondary/50 hover:bg-destructive/10 border border-border/50 hover:border-destructive/30 transition-all group"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-6 h-11 rounded-xl font-black text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all inline-flex items-center"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <Button className="h-11 px-8 rounded-xl font-black text-[11px] uppercase tracking-widest sapphire-gradient text-white hover:scale-[1.05] active:scale-[0.98] shadow-2xl shadow-primary/20 transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center transition-all hover:bg-secondary/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="md:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-3xl border-b border-border shadow-2xl overflow-hidden"
          >
            <div className="premium-container py-10 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-5 px-6 py-5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest",
                    pathname === link.href
                      ? "bg-primary/5 text-primary border border-primary/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-border my-4" />

              {session ? (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-5 px-6 py-5 rounded-2xl text-destructive hover:bg-destructive/5 border border-transparent hover:border-destructive/10 font-black text-xs uppercase tracking-widest transition-all text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <div className="grid gap-3">
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-14 rounded-2xl sapphire-gradient text-white font-black text-xs uppercase tracking-widest flex items-center justify-center shadow-xl shadow-primary/20"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-14 rounded-2xl border border-border bg-secondary text-foreground font-black text-xs uppercase tracking-widest flex items-center justify-center hover:bg-secondary/80 transition-all"
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
