"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Briefcase, LayoutDashboard, Search, LogOut, User, Menu, X, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useSession, signOut } from "next-auth/react"

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
    { name: "Opportunities", href: "/jobs", icon: Globe },
    ...(session?.user?.role === "RECRUITER" 
      ? [{ name: "Talent Console", href: "/recruiter/dashboard", icon: LayoutDashboard }]
      : session?.user 
        ? [{ name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard }]
        : []
    ),
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-500 w-full",
        isScrolled 
          ? "bg-[#050507]/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl shadow-black/50" 
          : "bg-transparent py-8"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-xl shadow-white/10 group-hover:rotate-6 transition-all duration-500">
            <Briefcase className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            RECRUITFLOW
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl px-2 py-1.5 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2.5 px-5 h-11 rounded-xl transition-all duration-300 font-bold text-sm",
                  pathname === link.href 
                    ? "bg-white text-black hover:bg-white hover:text-black shadow-lg shadow-white/5" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-black tracking-tight text-white">{session.user.name}</span>
                <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">
                  {session.user.role}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-xl border-white/10 hover:border-white/20 hover:bg-white/5 h-12 w-12 transition-all active:scale-90"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5 text-white/50" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="rounded-xl px-8 h-12 font-bold text-white/50 hover:text-white hover:bg-white/5">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl px-8 h-12 bg-white text-black font-black hover:bg-zinc-200 shadow-xl shadow-white/5 transition-all active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-xl text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu (Centrally Focused) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#050507] border-b border-white/5 px-6 py-12 animate-in slide-in-from-top duration-500">
          <div className="flex flex-col gap-6 max-w-sm mx-auto text-center">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-center gap-4 p-5 rounded-2xl transition-all font-black text-lg border border-transparent",
                  pathname === link.href ? "bg-white text-black shadow-2xl" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="w-6 h-6" />
                <span>{link.name}</span>
              </Link>
            ))}
            
            <div className="h-px bg-white/5 my-4" />
            
            {session ? (
              <Button 
                variant="ghost" 
                className="h-16 rounded-2xl font-black text-xl text-white/30 hover:text-white"
                onClick={() => signOut()}
              >
                <LogOut className="w-6 h-6 mr-3" />
                Sign Out
              </Button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                   <Button className="w-full h-16 rounded-2xl bg-white text-black font-black text-xl">Get Started</Button>
                </Link>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                   <Button variant="outline" className="w-full h-16 rounded-2xl border-white/10 font-black text-xl">Sign In</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
