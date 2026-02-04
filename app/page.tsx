import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-utils"
import { Briefcase, Users, TrendingUp, CheckCircle } from "lucide-react"

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href={user.role === "RECRUITER" ? "/recruiter/dashboard" : "/jobs"}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Streamline Your Hiring Process
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            RecruitFlow is a production-grade Applicant Tracking System that helps companies post jobs, 
            manage applicants, and track hiring workflows from application to final decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Hiring Today
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Everything You Need to Hire Better
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Briefcase className="w-8 h-8" />}
            title="Job Management"
            description="Create, edit, and manage job postings with ease. Track applications in real-time."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Applicant Tracking"
            description="Organize candidates through your hiring pipeline from application to offer."
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Analytics Dashboard"
            description="Get insights into your hiring process with comprehensive analytics."
          />
          <FeatureCard
            icon={<CheckCircle className="w-8 h-8" />}
            title="Status Management"
            description="Move candidates through stages: Applied → Shortlisted → Interview → Hired"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass rounded-2xl p-12 text-center max-w-3xl mx-auto border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join companies using RecruitFlow to build better teams faster.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2026 RecruitFlow. Built with Next.js, Prisma, and NextAuth.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass rounded-xl p-6 border border-white/10 hover-lift">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
