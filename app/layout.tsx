import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Navbar } from "@/components/navbar";
import { MatrixBackground } from "@/components/matrix-background";
import { Command } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "RecruitFlow | The Advanced Hiring Engine",
  description:
    "A premium, minimalist, and high-performance applicant tracking system built for the next generation of talent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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

              <footer className="w-full border-t border-border/40 py-32 mt-auto relative overflow-hidden bg-background">
                {/* Footer Atmosphere */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                  <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
                </div>

                <div className="premium-container relative z-10">
                  <div className="grid md:grid-cols-12 gap-16 mb-24">
                    <div className="md:col-span-6 space-y-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sapphire-gradient rounded-lg flex items-center justify-center shadow-2xl">
                          <Command className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-xl font-black tracking-tighter uppercase text-gradient">
                          RecruitFlow
                        </h2>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-sm font-medium leading-relaxed opacity-60">
                        The high-performance talent acquisition engine designed
                        for engineering teams who prioritize speed, technical
                        depth, and excellence.
                      </p>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-full w-fit">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Global Systems Operational
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/40">
                        Infrastructure
                      </h4>
                      <ul className="space-y-4 text-xs font-bold text-muted-foreground">
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Neural Engine
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Vector Pipelines
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Edge Nodes
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Telemetry
                        </li>
                      </ul>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/40">
                        Resources
                      </h4>
                      <ul className="space-y-4 text-xs font-bold text-muted-foreground">
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Changelog
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Documentation
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Security
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          API Status
                        </li>
                      </ul>
                    </div>

                    <div className="md:col-span-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-foreground/40">
                        Company
                      </h4>
                      <ul className="space-y-4 text-xs font-bold text-muted-foreground">
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          About Ops
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Privacy
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Terms
                        </li>
                        <li className="hover:text-primary cursor-pointer transition-colors">
                          Legal
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">
                    <div className="flex items-center gap-8">
                      <span>
                        &copy; {new Date().getFullYear()} RecruitFlow Inc.
                      </span>
                      <span>Built for Excellence</span>
                    </div>
                    <div className="flex gap-8">
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        Twitter
                      </span>
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        GitHub
                      </span>
                      <span className="hover:text-primary cursor-pointer transition-colors">
                        LinkedIn
                      </span>
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <Toaster position="bottom-right" richColors expand={false} />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
