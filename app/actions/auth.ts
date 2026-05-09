'use server'

import { signIn } from "@/lib/auth"
import { prisma, basePrisma } from "@/lib/prisma"
import { signUpSchema, type SignUpInput } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { logger, analytics } from "@/lib/monitoring"
import { checkRateLimit } from "@/lib/rate-limit"

/**
 * Check if a user account exists for a given email.
 * Used by login forms to give precise error feedback:
 * - "Account not found" vs "Incorrect password"
 */
export async function checkUserExistsAction(email: string): Promise<{ exists: boolean, role?: string }> {
  try {
    const user = await basePrisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, role: true },
    })
    return { exists: !!user, role: user?.role }
  } catch {
    return { exists: false }
  }
}

export async function signUpAction(data: SignUpInput) {
  try {
    const rateLimit = await checkRateLimit(data.email)
    if (!rateLimit.success) return { error: rateLimit.error }

    const validated = signUpSchema.parse(data)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    })

    if (existingUser) {
      return { error: "An account with this email already exists. Please log in instead." }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
      },
    })

    // Log and track
    analytics.track('user_signup', { userId: user.id, role: validated.role })
    logger.logAuthEvent("SIGNUP_SUCCESS", user.id, { role: validated.role })

    // Auto sign in after signup — NextAuth throws a redirect on success
    try {
      await signIn("credentials", {
        email: validated.email,
        password: validated.password,
        redirectTo: validated.role === 'RECRUITER' ? '/recruiter/dashboard' : '/dashboard',
      })
    } catch (err) {
      if ((err as any).digest?.startsWith('NEXT_REDIRECT')) throw err
    }

    return { success: true }
  } catch (error: unknown) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) throw error

    logger.error("Signup error", error as Error, { metadata: { email: data.email } })

    if (process.env.NODE_ENV === 'development') {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return { error: `Signup failed: ${errorMessage}` }
    }

    return { error: "Failed to create account. Please try again." }
  }
}

export async function signInAction(email: string, password: string) {
  try {
    const rateLimit = await checkRateLimit(email)
    if (!rateLimit.success) return { error: rateLimit.error }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    })

    return { success: true }
  } catch (error) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) throw error

    if (error instanceof AuthError) {
      logger.logAuthEvent("SIGNIN_FAILURE", undefined, { email, type: error.type })
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Incorrect password. Please try again." }
        default:
          return { error: "Authentication failed. Please try again." }
      }
    }
    throw error
  }
}
