import { NextResponse } from 'next/server';
import { constants } from 'node:fs';
import { access, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/monitoring';

interface HealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  services: {
    database: string
    resumeStorage: string
  }
}

export async function GET() {
  const status: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      resumeStorage: 'unknown',
    },
  };

  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    status.services.database = 'ok';
  } catch (error) {
    status.status = 'error';
    status.services.database = 'error';
    logger.error('Health check database error', error as Error);
  }

  try {
    const uploadDirectory = join(process.cwd(), "data", "uploads");
    await mkdir(uploadDirectory, { recursive: true });
    await access(uploadDirectory, constants.R_OK | constants.W_OK);
    status.services.resumeStorage = 'ok';
  } catch (error) {
    status.status = 'error';
    status.services.resumeStorage = 'error';
    logger.error('Health check resume storage error', error);
  }

  return NextResponse.json(status, {
    status: status.status === 'ok' ? 200 : 500,
    headers: { "Cache-Control": "no-store" },
  });
}
