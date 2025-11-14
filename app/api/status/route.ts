import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logFile = path.join(process.cwd(), 'automation.log');
    const recordFile = path.join(process.cwd(), 'posted-videos.json');

    let lastLogs = '';
    let records = [];

    try {
      const logData = await fs.readFile(logFile, 'utf-8');
      const logs = logData.split('\n').filter(l => l.trim());
      lastLogs = logs.slice(-20).join('\n');
    } catch {
      lastLogs = 'No logs yet';
    }

    try {
      const recordData = await fs.readFile(recordFile, 'utf-8');
      records = JSON.parse(recordData);
    } catch {
      records = [];
    }

    return NextResponse.json({
      status: 'running',
      environment: {
        pexelsConfigured: !!process.env.PEXELS_API_KEY,
        instagramConfigured: !!(process.env.INSTAGRAM_USERNAME && process.env.INSTAGRAM_PASSWORD),
      },
      stats: {
        totalVideosPosted: records.length,
        lastPosted: records.length > 0 ? records[records.length - 1].postedAt : null,
      },
      recentLogs: lastLogs,
      recentPosts: records.slice(-5),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
