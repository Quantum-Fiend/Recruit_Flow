'use server'

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { signUpSchema, type SignUpInput } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

import { logger, analytics } from "@/lib/monitoring"
import { checkRateLimit } from "@/lib/rate-limit"

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
      return { error: "User with this email already exists" }
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

    // Auto sign in after signup
    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    })

    return { success: true }
  } catch (error: unknown) {
    logger.error("Signup error", error as Error, { metadata: { email: data.email } })
    
    // Provide more specific error message in development
    if (process.env.NODE_ENV === 'development') {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      return { error: `Signup failed: ${errorMessage}` }
    }
    
    return { error: "Failed to create account. Please try again later." }
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
    
    // Auth success logging is usually handled in NextAuth callbacks
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      logger.logAuthEvent("SIGNIN_FAILURE", undefined, { email, type: error.type })
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
