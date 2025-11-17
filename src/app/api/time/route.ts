import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get current server time in epoch format
    const serverTime = Date.now();

    return NextResponse.json({
      epoch: serverTime,
      timestamp: new Date(serverTime).toISOString(),
      timezone: 'UTC',
    });
  } catch (error) {
    console.error('Error fetching server time:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch server time',
        epoch: Date.now(),
      },
      { status: 500 }
    );
  }
}
