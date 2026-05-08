'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createJobAction } from "@/app/actions/jobs"
import { ArrowLeft, Plus, Zap, Target, Shield, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function NewJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    type: "FULL_TIME" as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
    employmentType: "OFFICE" as "OFFICE" | "REMOTE" | "HYBRID",
    experienceLevel: "",
    skills: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const skillsArray = formData.skills.split(",").map(s => s.trim()).filter(Boolean)

    const result = await createJobAction({
      ...formData,
      skills: skillsArray,
    })

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("Position Deployed Successfully")
      router.push("/recruiter/dashboard")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-wrapper animate-slide-up"
    >
      <div className="max-w-5xl mx-auto space-y-10">
         {/* Navigation */}
         <Link href="/recruiter/dashboard">
            <Button variant="ghost" className="rounded-xl h-12 px-6 group font-bold text-muted-foreground hover:text-foreground">
               <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" />
               Back to Console
            </Button>
         </Link>

         {/* Header Identity */}
         <header className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass-panel text-[10px] font-black uppercase tracking-widest text-primary">
               <Plus className="w-4 h-4" />
               <span>New Position</span>
            </div>
            <h1 className="h-lg">Deploy New Position.</h1>
            <p className="text-lg text-muted-foreground font-medium">
               Initialize a new talent acquisition sequence within the global engineering pipeline.
            </p>
         </header>

         {/* Deployment Interface */}
         <Card className="premium-card p-8 md:p-12 bg-card/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-10">

               {/* Row 1: Title full width */}
               <div className="space-y-3">
                  <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Position Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Infrastructure Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="h-14 rounded-xl bg-secondary border-border font-bold text-base focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
                  />
               </div>

               {/* Row 2: Description full width */}
               <div className="space-y-3">
                  <div className="flex items-center justify-between ml-1">
                     <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Job Description</Label>
                     <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         formData.description.length < 50 ? "text-amber-500" : "text-emerald-500"
                     )}>
                         {formData.description.length}/50 min
                     </span>
                  </div>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and technical challenges..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="rounded-xl bg-secondary border-border font-medium text-base focus-visible:ring-1 focus-visible:ring-primary/30 transition-all resize-none p-5"
                  />
               </div>

               {/* Row 3: Location + Experience Level side-by-side */}
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                     <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Location</Label>
                     <Input
                       id="location"
                       placeholder="e.g., San Francisco / Remote"
                       value={formData.location}
                       onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                       required
                       className="h-14 rounded-xl bg-secondary border-border font-bold"
                     />
                  </div>
                  <div className="space-y-3">
                     <Label htmlFor="experienceLevel" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Experience Level</Label>
                     <Input
                       id="experienceLevel"
                       placeholder="e.g., Senior / L5"
                       value={formData.experienceLevel}
                       onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                       required
                       className="h-14 rounded-xl bg-secondary border-border font-bold"
                     />
                  </div>
               </div>

               {/* Row 4: Job Type + Employment Mode side-by-side */}
               <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Job Type</Label>
                     <div className="grid grid-cols-2 gap-2">
                       {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map((type) => (
                         <Button
                           key={type}
                           type="button"
                           variant="ghost"
                           onClick={() => setFormData({ ...formData, type: type as any })}
                           className={cn(
                             "h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border border-transparent transition-all",
                             formData.type === type ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                           )}
                         >
                           {type.replace("_", " ")}
                         </Button>
                       ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Work Mode</Label>
                     <div className="grid grid-cols-3 gap-2">
                       {["OFFICE", "REMOTE", "HYBRID"].map((type) => (
                         <Button
                           key={type}
                           type="button"
                           variant="ghost"
                           onClick={() => setFormData({ ...formData, employmentType: type as any })}
                           className={cn(
                             "h-11 rounded-xl font-black text-[10px] uppercase tracking-widest border border-transparent transition-all",
                             formData.employmentType === type ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                           )}
                         >
                           {type}
                         </Button>
                       ))}
                     </div>
                  </div>
               </div>

               {/* Row 5: Skills full width */}
               <div className="space-y-3">
                  <Label htmlFor="skills" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Required Skills</Label>
                  <Input
                    id="skills"
                    placeholder="React, TypeScript, Node.js, Kubernetes..."
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    required
                    className="h-14 rounded-xl bg-secondary border-border font-bold"
                  />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 ml-1">Separate skills with commas</p>
               </div>

               {/* Action Footer */}
               <div className="pt-8 border-t border-border flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    className="flex-[2] h-14 rounded-xl font-black sapphire-gradient text-white shadow-xl shadow-primary/30 group active:scale-[0.98] transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                       <span className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Deploying...</span>
                       </span>
                    ) : (
                       <span className="flex items-center gap-3">
                          Deploy Position
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                       </span>
                    )}
                  </Button>
                  <Link href="/recruiter/dashboard" className="flex-1">
                    <Button type="button" variant="outline" className="w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest text-muted-foreground hover:bg-secondary border-border transition-all">
                      Cancel
                    </Button>
                  </Link>
               </div>
            </form>
         </Card>

         {/* Disclaimer */}
         <div className="flex items-center justify-center gap-2 text-center opacity-30 text-[10px] font-black uppercase tracking-widest py-4">
            <Shield className="w-4 h-4" />
            <span>Enterprise Compliance Verified</span>
         </div>
      </div>
    </motion.div>
  )
}
