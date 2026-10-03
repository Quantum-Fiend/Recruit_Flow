import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: "RecruitFlow | Hiring, thoughtfully",
    template: "%s | RecruitFlow",
  },
  description:
    "A clear, collaborative workspace for finding great people and building thoughtful hiring processes.",
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
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <Navbar />
            <main className="app-main">{children}</main>
            <footer className="app-footer">
              <span className="app-footer-brand">RecruitFlow</span>
              <span>Thoughtful hiring starts with a clearer process.</span>
              <span>© {new Date().getFullYear()} RecruitFlow</span>
            </footer>
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
