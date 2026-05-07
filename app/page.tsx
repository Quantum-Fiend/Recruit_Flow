import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth-utils"
import { Briefcase, Users, TrendingUp, CheckCircle, ArrowRight, Shield, Zap, Globe } from "lucide-react"

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>The Next Generation of Hiring is Here</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight">
              Hire <span className="gradient-text">Faster</span>. <br />
              Build <span className="gradient-text">Better</span>.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              RecruitFlow is the intelligent Applicant Tracking System designed for modern teams. 
              Automate your workflow, find top talent, and scale your business with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={user ? (user.role === "RECRUITER" ? "/recruiter/dashboard" : "/jobs") : "/signup"}>
                <Button size="lg" className="text-lg px-10 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 group">
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/jobs">
                <Button size="lg" variant="outline" className="text-lg px-10 h-14 rounded-full border-primary/20 hover:border-primary/50 backdrop-blur-sm">
                  Explore Jobs
                </Button>
              </Link>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">500+</span>
                <span className="text-sm uppercase tracking-widest mt-1">Companies</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">10k+</span>
                <span className="text-sm uppercase tracking-widest mt-1">Hires</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">99%</span>
                <span className="text-sm uppercase tracking-widest mt-1">Satisfaction</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">24/7</span>
                <span className="text-sm uppercase tracking-widest mt-1">Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Features Section */}
      <section className="py-32 bg-accent/30 relative">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Empower Your <span className="text-primary">Recruiting Team</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful tools designed to simplify every step of the hiring journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Briefcase className="w-10 h-10" />}
              title="Smart Job Posting"
              description="Create rich, interactive job descriptions in seconds. Our platform optimizes your listings for search engines automatically."
              color="from-purple-500 to-indigo-500"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Candidate Pipeline"
              description="Visualize your hiring funnel. Drag and drop candidates through custom stages and keep your team in sync."
              color="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10" />}
              title="Secure Processing"
              description="Enterprise-grade security for candidate data. GDPR compliant and encrypted file storage for all resumes."
              color="from-emerald-500 to-teal-500"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 overflow-hidden">
        <div className="container-wide">
          <div className="glass rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map(i => <CheckCircle key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <blockquote className="text-3xl md:text-4xl font-medium leading-snug italic">
                "RecruitFlow transformed our hiring from a chaotic spreadsheet into a streamlined, high-performance engine. We cut our time-to-hire by 40% in the first month."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-400" />
                <div>
                  <p className="font-bold text-lg">Sarah Jenkins</p>
                  <p className="text-muted-foreground uppercase tracking-widest text-xs">Head of People @ TechNova</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block w-px h-64 bg-border mx-12" />
            <div className="grid grid-cols-2 gap-8 flex-shrink-0">
               <StatItem icon={<TrendingUp />} label="Efficiency" value="+45%" />
               <StatItem icon={<Globe />} label="Reach" value="Global" />
               <StatItem icon={<Zap />} label="Speed" value="2x Faster" />
               <StatItem icon={<Users />} label="Team Size" value="Unlimited" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="container-wide relative z-10 text-center text-primary-foreground">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to hire your next star?
          </h2>
          <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
            Join thousands of teams scaling their vision with RecruitFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-12 h-16 rounded-full font-bold">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Decorative CTA background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border">
        <div className="container-wide grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
             <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">RecruitFlow</span>
             </Link>
             <p className="text-muted-foreground">
               Empowering teams to find and hire the best talent globally.
             </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-muted-foreground text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container-wide border-t border-border mt-20 pt-8 text-center text-muted-foreground text-sm">
          <p>© 2026 RecruitFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="glass rounded-[2rem] p-10 border border-white/10 hover-card group">
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-primary mb-2">{icon}</div>
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
    </div>
  )
}
