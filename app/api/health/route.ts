import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/monitoring';

interface HealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  services: {
    database: string
    uploadthing: string
  }
}

export async function GET() {
  const status: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      uploadthing: 'ok', // Assumed since it's a SaaS
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

  return NextResponse.json(status, {
    status: status.status === 'ok' ? 200 : 500,
  });
}
