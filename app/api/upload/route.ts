import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/auth-utils";
import { sanitizeFileName, validateFile } from "@/lib/file-security";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
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

    // Create uploads directory in public
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${randomUUID()}-${sanitizeFileName(file.name)}`;
    const path = join(uploadDir, uniqueName);

    await writeFile(path, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
