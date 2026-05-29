import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getTaskStatus } from '@/lib/meshyClient';

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: job, error } = await supabase
      .from('meshy_jobs')
      .select('*')
      .eq('id', params.jobId)
      .eq('user_id', session.user.id)
      .single();

    if (error || !job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    // Poll Meshy API
    const meshyTask = await getTaskStatus(job.meshy_task_id, job.job_type);

    const statusMap: Record<string, string> = {
      PENDING: 'pending', IN_PROGRESS: 'in_progress',
      SUCCEEDED: 'succeeded', FAILED: 'failed', EXPIRED: 'expired',
    };

    const newStatus = statusMap[meshyTask.status] ?? 'pending';
    const modelUrl = meshyTask.model_urls?.glb ?? null;
    const thumbnailUrl = meshyTask.thumbnail_url ?? null;

    // Update DB if changed
    if (newStatus !== job.status) {
      await supabase.from('meshy_jobs').update({
        status: newStatus,
        progress: meshyTask.progress,
        model_url: modelUrl,
        thumbnail_url: thumbnailUrl,
      }).eq('id', params.jobId);
    }

    return NextResponse.json({
      jobId: params.jobId,
      status: newStatus,
      progress: meshyTask.progress,
      modelUrl,
      thumbnailUrl,
    });
  } catch (err: any) {
    console.error('Meshy status error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
