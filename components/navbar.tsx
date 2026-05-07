"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { LayoutDashboard, Search, LogOut, Menu, X, Command, Globe, Briefcase } from "lucide-react"
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
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Network", href: "/jobs", icon: Globe },
    ...(session?.user?.role === "RECRUITER" 
      ? [{ name: "Talent Console", href: "/recruiter/dashboard", icon: LayoutDashboard }]
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
          ? "bg-background/80 backdrop-blur-xl border-b border-border py-4 shadow-xl" 
          : "bg-transparent py-8"
      )}
    >
      <div className="premium-container flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-all"
        >
          <div className="w-10 h-10 sapphire-gradient rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform duration-500">
            <Command className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase text-foreground">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav - Sapphire Pill */}
        <nav className="hidden lg:flex items-center gap-2 bg-foreground/5 border border-foreground/10 rounded-2xl p-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2.5 px-6 h-10 rounded-xl transition-all duration-400 font-bold text-xs uppercase tracking-widest",
                  pathname === link.href 
                    ? "bg-background text-foreground shadow-md" 
                    : "text-muted-foreground hover:text-foreground"
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
          
          <div className="w-px h-6 bg-border mx-2" />
          
          {session ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-black tracking-tight">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-0.5">
                  {session.user.role}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-11 h-11 rounded-xl border-border hover:bg-foreground/5 transition-all group"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl px-6 h-11 font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl px-8 h-11 sapphire-gradient text-white font-black text-xs uppercase tracking-widest hover:opacity-90 shadow-xl shadow-primary/20 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 rounded-xl bg-foreground/5 border border-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Sapphire Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-background/98 backdrop-blur-2xl border-b border-border py-12 px-6 shadow-2xl"
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
                      "w-full justify-start gap-5 p-7 rounded-2xl transition-all font-black text-lg tracking-tighter",
                      pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-foreground/5 text-muted-foreground"
                    )}
                  >
                    <link.icon className="w-6 h-6" />
                    <span>{link.name}</span>
                  </Button>
                </Link>
              ))}
              <div className="h-px bg-border my-6" />
              {session ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-5 p-7 rounded-2xl text-destructive hover:bg-destructive/10 font-black text-lg tracking-tighter"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </Button>
              ) : (
                <div className="grid gap-3">
                   <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-14 rounded-xl sapphire-gradient text-white font-black">Initialize Recruitment</Button>
                   </Link>
                   <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-xl font-black">Sign In</Button>
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
