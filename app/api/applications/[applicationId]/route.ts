import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await auth()

    if (!session || !session.user || (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { applicationId } = await params

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return new NextResponse("Application not found", { status: 404 })
    }

    // Soft delete
    await prisma.application.update({
      where: { id: applicationId },
      data: { deletedAt: new Date() },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[APPLICATION_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
