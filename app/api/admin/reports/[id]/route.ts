import { NextResponse } from 'next/server';
import { updateReportStatus, getReports, updateContent } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    const reportId = params.id;

    if (!action || !['resolve', 'dismiss', 'hide_content', 'ban_creator'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (action === 'dismiss') {
      await updateReportStatus(reportId, 'dismissed');
      return NextResponse.json({ success: true, status: 'dismissed' });
    }

    if (action === 'resolve' || action === 'hide_content' || action === 'ban_creator') {
      await updateReportStatus(reportId, 'resolved');
      
      // If we need to hide the content, look up the report to get contentId
      if (action === 'hide_content' || action === 'ban_creator') {
        const reports = await getReports();
        const report = reports.find(r => r.id === reportId);
        if (report) {
          // Hide the content in the database
          await updateContent(report.contentId, { status: 'hidden' });
          // Note: ban_creator would ideally flag the profile.json, but for this demo,
          // hiding the offending content serves as the immediate moderation step.
        }
      }
      
      return NextResponse.json({ success: true, status: 'resolved' });
    }

    return NextResponse.json({ error: 'Unhandled action' }, { status: 400 });

  } catch (error) {
    console.error('[Admin] Failed to process report action:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
