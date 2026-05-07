import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Zap, Shield, Sparkles, ArrowRight, Globe, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section - Centered & Premium */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/70 mb-10">
          <Sparkles className="w-4 h-4 text-white" />
          <span>The New Standard in Recruitment</span>
        </div>
        
        <h1 className="heading-xl text-gradient mb-8 max-w-4xl">
          Hire Smarter. <br />
          <span className="text-white">Build Faster.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/50 max-w-2xl font-medium leading-relaxed mb-12">
          RecruitFlow is the high-performance talent engine designed for modern teams who prioritize speed, clarity, and excellence.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <Button className="btn-premium w-full sm:w-auto text-lg group">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/jobs" className="w-full sm:w-auto">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 w-full sm:w-auto font-bold text-lg">
              Explore Opportunities
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40 grayscale contrast-200">
           <span className="font-black text-2xl tracking-tighter">VOLT</span>
           <span className="font-black text-2xl tracking-tighter">ZENITH</span>
           <span className="font-black text-2xl tracking-tighter">ORION</span>
           <span className="font-black text-2xl tracking-tighter">SPECTRA</span>
        </div>
      </section>

      {/* Feature Grid - Centered & Clean */}
      <section className="w-full py-24 border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
           <FeatureCard 
             icon={<Zap />} 
             title="Lightning Velocity" 
             description="Submit applications and review candidates in milliseconds. Zero friction, total speed." 
           />
           <FeatureCard 
             icon={<Shield />} 
             title="Enterprise Security" 
             description="Production-grade encryption and data isolation for all your talent acquisition needs." 
           />
           <FeatureCard 
             icon={<Globe />} 
             title="Global Pipeline" 
             description="Reach top talent across the globe with automated job distribution and insights." 
           />
        </div>
      </section>

      {/* Social Proof - Premium Cards */}
      <section className="w-full py-24 bg-white/[0.02] border-y border-white/5">
         <div className="max-w-4xl mx-auto text-center px-4">
            <div className="flex justify-center gap-1 mb-6">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-white fill-white" />)}
            </div>
            <blockquote className="text-3xl md:text-4xl font-bold leading-tight mb-10 tracking-tight">
              &ldquo;RecruitFlow has transformed our hiring process. It's clean, insanely fast, and built for modern scale.&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
               <div className="text-left">
                  <p className="font-bold text-lg">Marcus Chen</p>
                  <p className="text-sm text-white/50 font-medium tracking-wide">CTO @ Nebula Dynamics</p>
               </div>
            </div>
         </div>
      </section>

      {/* Final Call to Action */}
      <section className="w-full py-32 flex flex-col items-center text-center">
         <div className="glass-panel p-12 md:p-20 max-w-4xl w-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to hire your next <br /><span className="text-white/40">superstar?</span></h2>
            <Link href="/signup">
               <Button className="btn-premium px-12 h-16 text-xl">Start Your Journey</Button>
            </Link>
         </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-panel p-10 interactive-card flex flex-col items-start text-left gap-6 group">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl shadow-white/5">
        {icon}
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-white/50 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
