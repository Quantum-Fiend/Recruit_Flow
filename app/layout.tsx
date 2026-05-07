import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "RecruitFlow | Next-Generation Talent Acquisition",
  description: "Experience the future of hiring with RecruitFlow's minimalist, high-performance applicant tracking system.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark bg-[#050507] selection:bg-white selection:text-black`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Global Atmosphere & Background Effects */}
            <div className="atmosphere" />
            
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              
              {/* Centered App Container */}
              <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {children}
              </main>

              {/* Global Footer (Centered) */}
              <footer className="w-full border-t border-white/5 py-12 mt-auto">
                 <div className="max-w-[1400px] mx-auto px-4 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                       &copy; {new Date().getFullYear()} RecruitFlow Engine. Built for the modern talent stack.
                    </p>
                 </div>
              </footer>
            </div>
            
            <Toaster position="bottom-center" richColors theme="dark" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
