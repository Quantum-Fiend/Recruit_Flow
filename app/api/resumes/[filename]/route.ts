import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<unknown> };
const paramsSchema = z.object({
  filename: z.string().regex(/^(?:[A-Za-z0-9_-]{1,64}-)?[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}-[A-Za-z0-9._-]{1,170}$/i),
});

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) {
    return new NextResponse("Resume not found", { status: 404 });
  }
  const { filename } = params.data;

  const role = session.user.role;
  if (!["APPLICANT", "RECRUITER", "ADMIN"].includes(role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const resumeUrl = `/api/resumes/${encodeURIComponent(filename)}`;
  const application = await prisma.application.findFirst({
    where: {
      resumeUrl,
      ...(role === "ADMIN"
        ? {}
        : role === "RECRUITER"
          ? { job: { recruiterId: session.user.id } }
          : { applicantId: session.user.id }),
    },
    select: { resumeName: true },
  });
  if (!application) {
    return new NextResponse("Resume not found", { status: 404 });
  }

  try {
    const file = await readFile(join(process.cwd(), "data", "uploads", filename));
    const extension = filename.toLowerCase().split(".").pop();
    const contentType = extension === "pdf"
      ? "application/pdf"
      : extension === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/msword";
    const disposition = extension === "pdf" ? "inline" : "attachment";

    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `${disposition}; filename="resume.${extension}"; filename*=UTF-8''${encodeURIComponent(application.resumeName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return new NextResponse("Resume not found", { status: 404 });
    }
    console.error("[RESUME_READ_ERROR]", error);
    return new NextResponse("Could not read resume", { status: 500 });
  }
}
