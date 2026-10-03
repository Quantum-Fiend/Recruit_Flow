"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BriefcaseBusiness,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRecruiter = session?.user?.role === "RECRUITER";
  const dashboardHref = isRecruiter ? "/recruiter/dashboard" : "/dashboard";
  const navLinks = session
    ? [
        { label: "Overview", href: dashboardHref, icon: LayoutDashboard },
        {
          label: isRecruiter ? "Jobs" : "Find jobs",
          href: isRecruiter ? "/recruiter/jobs" : "/jobs",
          icon: BriefcaseBusiness,
        },
      ]
    : [{ label: "Explore jobs", href: "/jobs", icon: BriefcaseBusiness }];
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="app-header">
      <nav className="app-navbar" aria-label="Main navigation">
        <Link
          href="/"
          className="app-brand"
          aria-label="RecruitFlow home"
          onClick={closeMobileMenu}
        >
          <span className="app-brand-mark">
            <Command aria-hidden="true" />
          </span>
          <span>RecruitFlow</span>
        </Link>

        <div className="app-nav-links">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn("app-nav-link", active && "app-nav-link-active")}
              >
                <Icon aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>

        <div className="app-nav-actions">
          {session ? (
            <>
              {isRecruiter && (
                <Link href="/recruiter/jobs/new" className="nav-create-job">
                  <Button className="dashboard-primary-action">
                    Create a job
                  </Button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="account-trigger"
                    aria-label={`Account menu for ${session.user?.name ?? "user"}`}
                  >
                    <span className="account-avatar" aria-hidden="true">
                      {session.user?.name?.trim().charAt(0).toUpperCase() ?? "U"}
                    </span>
                    <span className="account-name">
                      {session.user?.name ?? "Account"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="account-menu">
                  <DropdownMenuLabel className="account-menu-label">
                    <span>{session.user?.name ?? "Your account"}</span>
                    <span>{isRecruiter ? "Recruiter" : "Candidate"}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardHref}>
                      <UserRound aria-hidden="true" />
                      My workspace
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="account-signout"
                    onClick={() => void signOut({ callbackUrl: "/" })}
                  >
                    <LogOut aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="app-auth-actions">
              <Link href="/login" className="nav-sign-in">
                Sign in
              </Link>
              <Link href="/signup">
                <Button className="dashboard-primary-action">
                  Get started
                </Button>
              </Link>
            </div>
          )}
          <Button
            variant="outline"
            size="icon"
            className="mobile-nav-toggle"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-nav-panel" id="mobile-navigation">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "mobile-nav-link",
                pathname === href && "mobile-nav-link-active",
              )}
              onClick={closeMobileMenu}
            >
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
          {session ? (
            <button
              className="mobile-nav-link account-signout"
              onClick={() => {
                closeMobileMenu();
                void signOut({ callbackUrl: "/" });
              }}
            >
              <LogOut aria-hidden="true" />
              Sign out
            </button>
          ) : (
            <Link href="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
              <UserRound aria-hidden="true" />
              Sign in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
