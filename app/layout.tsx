import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Navbar } from "@/components/navbar"
import { MatrixBackground } from "@/components/matrix-background"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "RecruitFlow | The Advanced Hiring Engine",
  description: "A premium, minimalist, and high-performance applicant tracking system built for the next generation of talent.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Quantum Slate Atmosphere */}
            <div className="quantum-atmosphere" />
            <MatrixBackground />

            <div className="relative min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1 w-full pt-32 md:pt-40 pb-20">
                {children}
              </main>

              <footer className="w-full border-t border-border py-32 mt-auto glass-panel border-x-0 border-b-0">
                 <div className="premium-container grid md:grid-cols-12 gap-16">
                    <div className="md:col-span-6 space-y-8">
                       <h2 className="text-2xl font-black tracking-tighter uppercase text-gradient">RecruitFlow</h2>
                       <p className="text-sm text-muted-foreground max-w-xs font-medium leading-relaxed">
                          The high-performance talent acquisition engine designed for teams who prioritize speed, clarity, and excellence.
                       </p>
                    </div>
                    <div>
                       <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Platform</h4>
                       <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                          <li className="hover:text-foreground cursor-pointer">Network</li>
                          <li className="hover:text-foreground cursor-pointer">Pipelines</li>
                          <li className="hover:text-foreground cursor-pointer">Integrations</li>
                       </ul>
                    </div>
                    <div>
                       <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Support</h4>
                       <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                          <li className="hover:text-foreground cursor-pointer">Documentation</li>
                          <li className="hover:text-foreground cursor-pointer">Help Center</li>
                          <li className="hover:text-foreground cursor-pointer">API Status</li>
                       </ul>
                    </div>
                 </div>
                  <div className="premium-container border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="flex items-center gap-6">
                      <span>&copy; {new Date().getFullYear()} RecruitFlow Inc.</span>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-full">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                        <span>Systems Operational</span>
                      </div>
                    </div>
                    <span className="flex gap-6">
                       <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
                       <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
                    </span>
                  </div>
              </footer>
            </div>

            <Toaster position="bottom-right" richColors expand={false} />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
