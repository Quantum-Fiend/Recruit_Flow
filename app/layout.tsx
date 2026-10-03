import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  applicationName: "RecruitFlow",
  title: {
    default: "RecruitFlow | A clearer way to hire",
    template: "%s | RecruitFlow",
  },
  description:
    "A clear, collaborative workspace for finding great people and building thoughtful hiring processes.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <Navbar />
            <main className="app-main">{children}</main>
            <footer className="app-footer">
              <div className="app-footer-copy">
                <span className="app-footer-brand">RecruitFlow</span>
                <span>Thoughtful hiring starts with a clearer process.</span>
              </div>
              <nav className="app-footer-links" aria-label="Footer navigation">
                <Link href="/jobs">Explore roles</Link>
                <Link href="/login">Sign in</Link>
                <Link href="/signup">Create account</Link>
              </nav>
              <span>© {new Date().getFullYear()} RecruitFlow</span>
            </footer>
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
