'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createJobAction } from "@/app/actions/jobs"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

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
      toast.success("Job posted successfully!")
      router.push("/recruiter/jobs")
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="border-b border-white/10 glass sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            RecruitFlow
          </Link>
          <Link href="/recruiter/jobs">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 animate-in">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Post a New Job
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to create a new job posting
            </p>
          </div>

          <Card className="glass border-white/10">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Enter the information for your job posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={8}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum 50 characters
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel">Experience Level *</Label>
                    <Input
                      id="experienceLevel"
                      placeholder="e.g., Mid Level, Senior"
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Job Type *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={formData.type === type ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, type: type as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" })}
                          className="w-full"
                        >
                          {type.replace("_", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Employment Type *</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["OFFICE", "REMOTE", "HYBRID"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={formData.employmentType === type ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, employmentType: type as "OFFICE" | "REMOTE" | "HYBRID" })}
                          className="w-full"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills *</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate skills with commas
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Posting..." : "Post Job"}
                  </Button>
                  <Link href="/recruiter/jobs" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
