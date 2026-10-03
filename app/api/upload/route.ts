import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeFile, mkdir, chmod } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/auth-utils";
import { sanitizeFileName, validateFile } from "@/lib/file-security";
import { checkRateLimit } from "@/lib/rate-limit";
import { hasValidRequestOrigin } from "@/lib/security/request-origin";

export async function POST(req: Request) {
  try {
    if (!hasValidRequestOrigin(req)) {
      return new NextResponse("Request origin is not allowed.", { status: 403 });
    }
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (user.role !== "APPLICANT") {
      return new NextResponse("Only applicants can upload resumes.", { status: 403 });
    }
    const limit = await checkRateLimit(user.id, "upload");
    if (!limit.success) {
      return NextResponse.json({ error: limit.error }, { status: 429 });
    }
    const contentLength = Number(req.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > 5 * 1024 * 1024 + 128 * 1024) {
      return new NextResponse("Request exceeds the 5 MB resume limit.", { status: 413 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return new NextResponse("Invalid multipart upload request.", { status: 400 });
    }
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return new NextResponse(validation.error ?? "Invalid file", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const extension = file.name.match(/\.(pdf|docx?)$/i)?.[0].toLowerCase();
    const validSignature = extension === ".pdf"
      ? buffer.subarray(0, 5).toString() === "%PDF-"
      : extension === ".docx"
        ? buffer.subarray(0, 2).toString() === "PK"
        : extension === ".doc"
          ? buffer.subarray(0, 8).equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]))
          : false;
    if (!validSignature) {
      return new NextResponse("Resume content does not match a supported file format.", { status: 400 });
    }

    const uploadDir = join(process.cwd(), "data", "uploads");
    await mkdir(uploadDir, { recursive: true, mode: 0o700 });
    await chmod(uploadDir, 0o700);

    if (!extension) {
      return new NextResponse("Unsupported resume file extension", { status: 400 });
    }
    const safeBaseName = sanitizeFileName(file.name)
      .replace(/\.(pdf|docx?)$/i, "")
      .slice(0, 150);
    const uniqueName = `${user.id}-${randomUUID()}-${safeBaseName}${extension}`;
    const path = join(uploadDir, uniqueName);

    await writeFile(path, buffer, { flag: "wx", mode: 0o600 });

    const url = `/api/resumes/${encodeURIComponent(uniqueName)}`;

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
