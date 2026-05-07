'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signUpAction } from "@/app/actions/auth"
import { Briefcase, User, Mail, Key, ArrowRight, Sparkles, Check } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "APPLICANT" as "APPLICANT" | "RECRUITER",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signUpAction(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      if (formData.role === "RECRUITER") {
        router.push("/recruiter/dashboard")
      } else {
        router.push("/jobs")
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-primary/20 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 text-primary mb-6">
             <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            Get <span className="gradient-text">Started</span>
          </h1>
          <p className="text-muted-foreground font-medium">Join the professional network of RecruitFlow</p>
        </div>

        <Card className="glass border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Select your path and join us</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-4">
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.role === "APPLICANT" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, role: "APPLICANT" })}
                  className={`h-24 flex flex-col gap-2 rounded-2xl transition-all duration-300 border-2 ${formData.role === 'APPLICANT' ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' : 'border-border/50 hover:bg-accent'}`}
                >
                  <User className="w-6 h-6" />
                  <span className="font-bold">Applicant</span>
                  {formData.role === 'APPLICANT' && <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>}
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "RECRUITER" ? "default" : "outline"}
                  onClick={() => setFormData({ ...formData, role: "RECRUITER" })}
                  className={`h-24 flex flex-col gap-2 rounded-2xl transition-all duration-300 border-2 ${formData.role === 'RECRUITER' ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' : 'border-border/50 hover:bg-accent'}`}
                >
                  <Briefcase className="w-6 h-6" />
                  <span className="font-bold">Recruiter</span>
                  {formData.role === 'RECRUITER' && <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center"><Check className="w-3 h-3" /></div>}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-12 h-14 rounded-2xl bg-background/50 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-12 h-14 rounded-2xl bg-background/50 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Security Key</Label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                    className="pl-12 h-14 rounded-2xl bg-background/50 border-border/50 focus:bg-background transition-all"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 pt-2 pb-10">
              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group" disabled={loading}>
                {loading ? "Creating Profile..." : "Join RecruitFlow Now"}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Already have an account?
                </p>
                <Link href="/login">
                   <Button variant="link" className="text-primary font-bold p-0 h-auto hover:no-underline">
                     Sign In Here
                   </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
