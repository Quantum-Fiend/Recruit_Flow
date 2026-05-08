import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser } from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return new NextResponse("File too large (Max 10MB)", { status: 400 });
    }

    // Allowed types
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      return new NextResponse("Invalid file type (PDF/DOCX only)", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory in public
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if directory exists
    }

    const uniqueName = `${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
    const path = join(uploadDir, uniqueName);
    
    await writeFile(path, buffer);

    const url = `/uploads/${uniqueName}`;

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
