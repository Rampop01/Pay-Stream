import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data/reports.json');

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { reason, reporterAddress } = await req.json();

    if (!reason || !reporterAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure data directory exists
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Load existing reports
    let reports = [];
    if (fs.existsSync(DATA_FILE)) {
      reports = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }

    // Add new report
    const newReport = {
      id: Date.now().toString(),
      contentId: id,
      reason,
      reporterAddress,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    reports.push(newReport);
    fs.writeFileSync(DATA_FILE, JSON.stringify(reports, null, 2));

    console.log(`[REPORT] Content ${id} reported by ${reporterAddress}: ${reason}`);

    return NextResponse.json({ success: true, report: newReport });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json({ error: 'Failed to process report' }, { status: 500 });
  }
}
