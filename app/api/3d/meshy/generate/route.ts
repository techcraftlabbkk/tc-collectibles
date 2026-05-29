import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { textTo3D } from '@/lib/meshyClient';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { prompt, artStyle = 'realistic' } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });

    const { taskId } = await textTo3D(prompt, artStyle);

    // Record job in DB
    const { data: job, error } = await supabase.from('meshy_jobs').insert({
      user_id: session.user.id,
      meshy_task_id: taskId,
      job_type: 'text_to_3d',
      prompt,
      status: 'pending',
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ jobId: job.id, taskId });
  } catch (err: any) {
    console.error('Meshy generate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
