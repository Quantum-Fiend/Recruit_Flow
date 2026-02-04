import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isValidTransition } from "@/lib/workflow"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { ApplicationStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

const statusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1"
    
    // Rate Limiting
    const limitResult = await rateLimit(ip)
    if (!limitResult.success) {
      return new NextResponse("Too many requests", { status: 429 })
    }

    // CSRF Check
    const origin = headersList.get("origin")
    const host = headersList.get("host")
    if (origin && host && !origin.includes(host)) {
       return new NextResponse("Forbidden", { status: 403 })
    }

    const session = await auth()

    if (!session || !session.user || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { applicationId } = await params
    const body = await req.json()
    const { status: newStatus } = statusSchema.parse(body)

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return new NextResponse("Application not found", { status: 404 })
    }

    if (!isValidTransition(application.status, newStatus)) {
      return new NextResponse(
        `Invalid transition from ${application.status} to ${newStatus}`,
        { status: 400 }
      )
    }

    // Perform update and history creation in a transaction
    const [updatedApplication] = await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
      }),
      prisma.applicationHistory.create({
        data: {
          applicationId,
          oldStatus: application.status,
          newStatus,
          changedById: session.user.id,
        },
      }),
    ])

    return NextResponse.json(updatedApplication)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }
    
    console.error("[APPLICATION_STATUS_UPDATE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
