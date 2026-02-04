import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createJobSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    const { success } = await rateLimit(ip)

    if (!success) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }

    // CSRF Check
    const origin = req.headers.get("origin")
    const host = req.headers.get("host")
    if (origin && host && !origin.includes(host)) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const session = await auth()

    if (!session || !session.user || session.user.role !== "RECRUITER") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = createJobSchema.parse(body)

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        recruiterId: session.user.id,
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 })
    }

    console.error("[JOBS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const recruiterId = searchParams.get("recruiterId")
    const query = searchParams.get("query")

    // Build filter conditions
    const where: Prisma.JobWhereInput = {
      status: "OPEN", // Default to open jobs
    }

    if (recruiterId) {
      where.recruiterId = recruiterId
      // Recruiters might want to see CLOSED jobs too, so we might relax the status check if recruiterId is present
      delete where.status 
    }

    if (query) {
       where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
       ]
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        recruiter: {
          select: { name: true, email: true },
        },
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("[JOBS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
