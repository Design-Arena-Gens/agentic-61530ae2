import { NextRequest, NextResponse } from 'next/server';
import { LuxuryVideoAutomation } from '@/lib/automation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check required environment variables
    const pexelsApiKey = process.env.PEXELS_API_KEY;
    const instagramUsername = process.env.INSTAGRAM_USERNAME;
    const instagramPassword = process.env.INSTAGRAM_PASSWORD;

    if (!pexelsApiKey || !instagramUsername || !instagramPassword) {
      return NextResponse.json(
        { error: 'Missing required environment variables' },
        { status: 500 }
      );
    }

    // Run automation
    const automation = new LuxuryVideoAutomation({
      pexelsApiKey,
      instagramUsername,
      instagramPassword,
    });

    await automation.run();

    return NextResponse.json({
      success: true,
      message: 'Automation completed successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Automation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
