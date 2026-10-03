import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createJobSchema } from "@/lib/validations"
import { NextResponse } from "next/server"
import { checkRateLimit, rateLimit } from "@/lib/rate-limit";
import type { Prisma } from "@prisma/client";
import { hasValidRequestOrigin } from "@/lib/security/request-origin";

export async function POST(req: Request) {
  try {
    if (!hasValidRequestOrigin(req)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const session = await auth();
    if (!session?.user?.id || !["RECRUITER", "ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { success } = await rateLimit(`job-create:${session.user.id}`);

    if (!success) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }

    const body = createJobSchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid job details." }, { status: 400 });
    }
    const validatedData = body.data;

    const job = await prisma.job.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        location: validatedData.location,
        type: validatedData.type,
        employmentType: validatedData.employmentType,
        experienceLevel: validatedData.experienceLevel,
        skills: validatedData.skills.join(","),
        recruiterId: session.user.id,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error("[JOBS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limitResult = await checkRateLimit(`jobs-read:${ip}`, "api");
    if (!limitResult.success) {
      return NextResponse.json({ error: limitResult.error }, { status: 429 });
    }
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim().slice(0, 200);
    const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get("limit") ?? "20", 10) || 20));

    const where: Prisma.JobWhereInput = {
      status: "OPEN",
      deletedAt: null,
    };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { location: { contains: query } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          type: true,
          employmentType: true,
          experienceLevel: true,
          skills: true,
          status: true,
          createdAt: true,
          recruiter: { select: { name: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
