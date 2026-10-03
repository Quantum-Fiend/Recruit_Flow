import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { z } from "zod"
import { hasValidRequestOrigin } from "@/lib/security/request-origin"
import { rateLimit } from "@/lib/rate-limit"

export async function DELETE(
  req: Request,
  context: { params: Promise<unknown> }
) {
  try {
    if (!hasValidRequestOrigin(req)) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    const session = await auth()

    if (!session || !session.user || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const limit = await rateLimit(`application-delete:${session.user.id}`)
    if (!limit.success) {
      return NextResponse.json({ error: limit.error }, { status: 429 })
    }

    const routeParams = z.object({ applicationId: z.string().cuid() }).safeParse(await context.params)
    if (!routeParams.success) {
      return new NextResponse("Invalid application ID", { status: 400 })
    }
    const { applicationId } = routeParams.data

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: { select: { recruiterId: true } } },
    })

    if (!application) {
      return new NextResponse("Application not found", { status: 404 })
    }
    if (session.user.role !== "ADMIN" && application.job.recruiterId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const deleted = await prisma.application.updateMany({
      where: {
        id: applicationId,
        deletedAt: null,
        ...(session.user.role === "ADMIN" ? {} : { job: { recruiterId: session.user.id } }),
      },
      data: { deletedAt: new Date() },
    })
    if (deleted.count !== 1) {
      return new NextResponse("Application changed or not found", { status: 409 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[APPLICATION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
