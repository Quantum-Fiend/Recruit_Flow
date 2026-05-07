import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Navbar } from "@/components/navbar"

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
            {/* Sapphire Slate Atmosphere */}
            <div className="sapphire-aura" />

            <div className="relative min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1 w-full pt-24 md:pt-28 pb-16">
                {children}
              </main>

              <footer className="w-full border-t border-border py-20 mt-auto">
                 <div className="premium-container grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                       <h2 className="text-xl font-black tracking-tighter mb-4">RECRUITFLOW</h2>
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
                 <div className="premium-container border-t border-border mt-12 pt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>&copy; {new Date().getFullYear()} RecruitFlow Inc.</span>
                    <span className="flex gap-6">
                       <span className="hover:text-foreground cursor-pointer">Privacy</span>
                       <span className="hover:text-foreground cursor-pointer">Terms</span>
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
