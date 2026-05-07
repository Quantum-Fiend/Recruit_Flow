import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "RecruitFlow | Modern Applicant Tracking System",
  description: "Streamline your hiring process with RecruitFlow. Manage job postings, track applications, and optimize your recruitment workflow with our production-grade ATS.",
  keywords: ["ATS", "recruitment", "hiring", "job board", "applicant tracking", "hiring software", "recruiter tools"],
  authors: [{ name: "RecruitFlow Team" }],
  openGraph: {
    title: "RecruitFlow | Modern Applicant Tracking System",
    description: "Streamline your hiring process with RecruitFlow.",
    url: "https://recruitflow.vercel.app",
    siteName: "RecruitFlow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RecruitFlow Dashboard preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RecruitFlow | Modern Applicant Tracking System",
    description: "Streamline your hiring process with RecruitFlow.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import { Navbar } from "@/components/navbar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative min-h-screen flex flex-col page-bg">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
