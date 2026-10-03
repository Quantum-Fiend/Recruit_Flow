import type { ApplicationStatus } from "@prisma/client";
import { basePrisma } from "@/lib/prisma";

export async function persistApplicationTransition({
  applicationId,
  from,
  to,
  actorId,
}: {
  applicationId: string;
  from: ApplicationStatus;
  to: ApplicationStatus;
  actorId: string;
}): Promise<boolean> {
  return basePrisma.$transaction(async (transaction) => {
    const result = await transaction.application.updateMany({
      where: {
        id: applicationId,
        status: from,
        deletedAt: null,
      },
      data: { status: to },
    });
    if (result.count !== 1) return false;

    await transaction.applicationHistory.create({
      data: {
        applicationId,
        oldStatus: from,
        newStatus: to,
        changedById: actorId,
      },
    });
    return true;
  });
}
