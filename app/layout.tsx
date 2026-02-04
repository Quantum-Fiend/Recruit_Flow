import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
