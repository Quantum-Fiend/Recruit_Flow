'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { 
  Command, 
  Menu, 
  X, 
  LogOut, 
  User, 
  ChevronDown, 
  Bell, 
  Search,
  Activity
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Engine", href: "/jobs" },
    { name: "Network", href: "#" },
    { name: "Changelog", href: "#" },
    { name: "Docs", href: "#" },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? "py-4" : "py-8"
    }`}>
      <nav className="premium-container">
        <div className={`relative px-6 py-4 flex items-center justify-between rounded-2xl transition-all duration-500 ${
          isScrolled 
            ? "glass-panel backdrop-blur-3xl shadow-2xl border-border/40" 
            : "bg-transparent border-transparent"
        }`}>
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sapphire-gradient rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
               <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-gradient">RecruitFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {session ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-xl glass-panel p-0 overflow-hidden hover:border-primary/50 transition-colors">
                        <div className="w-full h-full sapphire-gradient flex items-center justify-center text-white font-black text-xs">
                          {session.user?.name?.[0] || 'U'}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass-panel backdrop-blur-3xl border-border/50 rounded-2xl p-2 mt-4" align="end">
                      <DropdownMenuLabel className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/60 p-3">
                        {session.user?.name || 'User'}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem className="rounded-xl p-3 focus:bg-primary/10 group cursor-pointer">
                         <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="font-bold">Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="rounded-xl p-3 focus:bg-destructive/10 group cursor-pointer text-destructive">
                         <LogOut className="mr-2 h-4 w-4" />
                         <span className="font-bold">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-4">
                  <Link
                    href="/login"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                  <Link href="/signup">
                    <Button className="btn-quantum h-10 px-6 rounded-xl text-[10px] shadow-xl">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </AnimatePresence>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-xl text-muted-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 right-0 p-4"
          >
            <div className="glass-panel backdrop-blur-3xl rounded-3xl p-8 space-y-8 shadow-2xl border-border/50">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-black tracking-tighter uppercase text-gradient"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-8 border-t border-border/50 flex flex-col gap-4">
                {session ? (
                  <Button
                    variant="outline"
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }}
                    className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] text-destructive border-destructive/30 hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="btn-quantum w-full h-14 rounded-2xl text-[10px]">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
