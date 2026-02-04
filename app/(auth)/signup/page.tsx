'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { signUpAction } from "@/app/actions/auth"

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
      // Redirect based on role
      if (formData.role === "RECRUITER") {
        router.push("/recruiter/dashboard")
      } else {
        router.push("/jobs")
      }
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            RecruitFlow
          </h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Choose your account type and fill in your details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={formData.role === "APPLICANT" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "APPLICANT" })}
                    className="w-full"
                  >
                    Applicant
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "RECRUITER" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, role: "RECRUITER" })}
                    className="w-full"
                  >
                    Recruiter
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
