'use server'

import { signIn } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { signUpSchema, type SignUpInput } from "@/lib/validations"
import bcrypt from "bcryptjs"
import { logger, analytics } from "@/lib/monitoring"
import { checkRateLimit } from "@/lib/rate-limit"

export async function signUpAction(data: SignUpInput) {
  try {
    const validated = signUpSchema.parse(data);
    const rateLimit = await checkRateLimit(validated.email.toLowerCase());
    if (!rateLimit.success) return { error: rateLimit.error };
    if (Buffer.byteLength(validated.password, "utf8") > 72) {
      return { error: "Password must be 72 bytes or fewer." };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return {
        error:
          "An account with this email already exists. Please log in instead.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: validated.role,
      },
    });

    // Log and track
    analytics.track("user_signup", { userId: user.id, role: validated.role });
    logger.logAuthEvent("SIGNUP_SUCCESS", user.id, { role: validated.role });

    const signInUrl = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
      redirectTo:
        validated.role === "RECRUITER"
          ? "/recruiter/dashboard"
          : "/dashboard",
    });
    if (new URL(signInUrl).searchParams.has("error")) {
      throw new Error("The new account could not be signed in.");
    }

    return { success: true };
  } catch (error: unknown) {
    const digest =
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string"
        ? (error as { digest: string }).digest
        : undefined;
    if (digest?.startsWith("NEXT_REDIRECT")) throw error;

    logger.error("Signup error", error as Error, {
      action: "signup",
    });

    if (process.env.NODE_ENV === "development") {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { error: `Signup failed: ${errorMessage}` };
    }

    return { error: "Failed to create account. Please try again." };
  }
}
