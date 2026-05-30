import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { imageTo3D } from '@/lib/meshyClient';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { imageUrl } = await req.json();
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });

    const { taskId } = await imageTo3D(imageUrl);

    const { data: job, error } = await supabase.from('meshy_jobs').insert({
      user_id: session.user.id,
      meshy_task_id: taskId,
      job_type: 'image_to_3d',
      status: 'pending',
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ jobId: job.id, taskId });
  } catch (err: any) {
    console.error('Meshy image-to-3d error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
