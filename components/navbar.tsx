"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Briefcase, LayoutDashboard, Search, LogOut, User, Menu, X, Command } from "lucide-react"
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Browse Network", href: "/jobs", icon: Search },
    ...(session?.user?.role === "RECRUITER" 
      ? [{ name: "Talent Console", href: "/recruiter/dashboard", icon: LayoutDashboard }]
      : session?.user 
        ? [{ name: "Command Center", href: "/dashboard", icon: LayoutDashboard }]
        : []
    ),
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled 
          ? "bg-background/80 backdrop-blur-xl border-b border-border py-4 shadow-2xl shadow-black/5" 
          : "bg-transparent py-8"
      )}
    >
      <div className="premium-container flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-all"
        >
          <div className="w-10 h-10 bg-foreground text-background rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500">
            <Command className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav - High End Pill */}
        <nav className="hidden lg:flex items-center gap-1 glass p-1.5 rounded-2xl">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2.5 px-6 h-11 rounded-xl transition-all duration-500 font-black text-xs uppercase tracking-widest",
                  pathname === link.href 
                    ? "bg-foreground text-background hover:bg-foreground hover:text-background shadow-xl shadow-foreground/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          <div className="w-px h-8 bg-border/50 mx-2" />
          
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-black tracking-tight">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                  {session.user.role}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-12 h-12 rounded-2xl bg-foreground/5 border border-foreground/5 hover:bg-foreground/10 group active:scale-95 transition-all"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl px-8 h-12 font-black text-xs uppercase tracking-widest">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl px-8 h-12 bg-foreground text-background font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-2xl shadow-foreground/10 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-2xl glass"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Premium Full Screen Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-border py-12 px-6 shadow-2xl"
          >
            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-5 p-8 rounded-3xl transition-all font-black text-xl tracking-tighter border border-transparent",
                      pathname === link.href ? "bg-foreground/5 border-border" : "hover:bg-foreground/5"
                    )}
                  >
                    <link.icon className="w-6 h-6" />
                    <span>{link.name}</span>
                  </Button>
                </Link>
              ))}
              <div className="h-px bg-border my-4" />
              {session ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-5 p-8 rounded-3xl text-destructive hover:bg-destructive/5 font-black text-xl tracking-tighter"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-6 h-6" />
                  Logout Session
                </Button>
              ) : (
                <div className="grid gap-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-16 rounded-2xl font-black text-lg">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-16 rounded-2xl bg-foreground text-background font-black text-lg">Initialize System</Button>
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
