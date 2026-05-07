"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Briefcase, LayoutDashboard, Search, LogOut, User, Menu, X } from "lucide-react"
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
    { name: "Browse Jobs", href: "/jobs", icon: Search },
    ...(session?.user?.role === "RECRUITER" 
      ? [{ name: "Recruiter Dashboard", href: "/recruiter/dashboard", icon: LayoutDashboard }]
      : session?.user 
        ? [{ name: "My Dashboard", href: "/dashboard", icon: LayoutDashboard }]
        : []
    ),
  ]

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-lg" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
            <Briefcase className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight gradient-text">
            RecruitFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-2 px-4 py-2 h-10 rounded-full transition-all duration-300",
                  pathname === link.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-medium leading-none">{session.user.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                  {session.user.role}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-primary/20 hover:border-primary/50"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full px-6">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border p-4 animate-in">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  pathname === link.href ? "bg-primary/10 text-primary" : "hover:bg-accent"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {session ? (
              <Button 
                variant="ghost" 
                className="justify-start gap-3 text-destructive hover:bg-destructive/10"
                onClick={() => signOut()}
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
