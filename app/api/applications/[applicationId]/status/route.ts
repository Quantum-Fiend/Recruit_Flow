import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { hasValidRequestOrigin } from "@/lib/security/request-origin";
import { updateApplicationStatusAction } from "@/app/actions/applications";
import { ApplicationStatus } from "@prisma/client";

const routeParamsSchema = z.object({ applicationId: z.string().cuid() });
const statusSchema = z.object({ status: z.nativeEnum(ApplicationStatus) });

export async function PATCH(
  req: Request,
  context: { params: Promise<unknown> },
) {
  try {
    if (!hasValidRequestOrigin(req)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    const routeParams = routeParamsSchema.safeParse(await context.params);
    if (!routeParams.success) {
      return NextResponse.json({ error: "Invalid application ID." }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.id || !["RECRUITER", "ADMIN"].includes(session.user.role)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const limitResult = await rateLimit(`application-status:${session.user.id}`);
    if (!limitResult.success) {
      return new NextResponse("Too many requests", { status: 429 });
    }

    const body = statusSchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? "Invalid status." }, { status: 400 });
    }

    const result = await updateApplicationStatusAction({
      applicationId: routeParams.data.applicationId,
      status: body.data.status,
    });
    if (!result.success) {
      const status = result.error === "Unauthorized" ? 403
        : result.error === "Application not found" ? 404
          : result.error?.startsWith("Invalid status transition") ? 400 : 409;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
