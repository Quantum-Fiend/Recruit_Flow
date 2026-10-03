import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { access, chmod, copyFile, mkdir, readFile, readdir, unlink } from "node:fs/promises";
import { basename, join } from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const legacyDirectory = join(process.cwd(), "public", "uploads");
const privateDirectory = join(process.cwd(), "data", "uploads");
const legacyNamePattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}-[A-Za-z0-9._-]{1,255}$/i;

async function migrate() {
  await mkdir(legacyDirectory, { recursive: true });
  await mkdir(privateDirectory, { recursive: true, mode: 0o700 });
  await chmod(privateDirectory, 0o700);

  const legacyEntries = await readdir(legacyDirectory, { withFileTypes: true });
  if (legacyEntries.some((entry) => !entry.isFile() || !legacyNamePattern.test(entry.name))) {
    throw new Error("Unexpected file or directory in legacy resume storage; migration stopped.");
  }

  for (const entry of legacyEntries) {
    const sourcePath = join(legacyDirectory, entry.name);
    const destinationPath = join(privateDirectory, entry.name);
    try {
      await copyFile(sourcePath, destinationPath, constants.COPYFILE_EXCL);
    } catch (error) {
      if (!(error instanceof Error && "code" in error && error.code === "EEXIST")) {
        throw error;
      }
      const [source, destination] = await Promise.all([
        readFile(sourcePath),
        readFile(destinationPath),
      ]);
      const sourceHash = createHash("sha256").update(source).digest("hex");
      const destinationHash = createHash("sha256").update(destination).digest("hex");
      if (sourceHash !== destinationHash) {
        throw new Error("A private resume already exists with different contents; migration stopped.");
      }
    }
    await chmod(destinationPath, 0o600);
  }

  const applications = await prisma.application.findMany({
    where: { resumeUrl: { startsWith: "/uploads/" } },
    select: { resumeUrl: true },
    distinct: ["resumeUrl"],
  });

  let migrated = 0;
  for (const { resumeUrl } of applications) {
    const filename = basename(new URL(resumeUrl, "http://localhost").pathname);
    if (!resumeUrl.startsWith("/uploads/") || !legacyNamePattern.test(filename)) {
      throw new Error("A legacy resume path is invalid; refusing to migrate unsafe storage paths.");
    }
    await access(join(privateDirectory, filename));

    await prisma.application.updateMany({
      where: { resumeUrl },
      data: { resumeUrl: `/api/resumes/${encodeURIComponent(filename)}` },
    });
    migrated += 1;
  }

  const remainingLegacyReferences = await prisma.application.count({
    where: { resumeUrl: { startsWith: "/uploads/" } },
  });
  if (remainingLegacyReferences > 0) {
    throw new Error("Legacy resume references remain; refusing to remove publicly served files.");
  }

  const legacyEntriesForCleanup = await readdir(legacyDirectory, { withFileTypes: true });
  for (const entry of legacyEntriesForCleanup) {
    if (!entry.isFile()) {
      throw new Error("Unexpected directory entry in legacy resume storage; cleanup stopped.");
    }
    await unlink(join(legacyDirectory, entry.name));
  }

  console.info(`Moved ${migrated} legacy resume file(s) to private storage.`);
}

migrate()
  .catch((error: unknown) => {
    console.error("Private resume migration failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
