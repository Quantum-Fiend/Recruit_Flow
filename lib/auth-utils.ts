import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireRole(role: string | string[]) {
  const user = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(user.role)) {
    redirect("/")
  }
  
  return user
}

export async function requireRecruiter() {
  return requireRole("RECRUITER")
}

export async function requireApplicant() {
  return requireRole("APPLICANT")
}
