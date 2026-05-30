const MESHY_API_BASE = 'https://api.meshy.ai/v2';

function getHeaders() {
  const key = process.env.MESHY_API_KEY;
  if (!key) throw new Error('MESHY_API_KEY environment variable is not set');
  return { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' };
}

export interface MeshyTask {
  id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED';
  progress: number;
  model_urls?: { glb?: string; fbx?: string; obj?: string; usdz?: string };
  thumbnail_url?: string;
  created_at: number;
  finished_at?: number;
}

// Text → 3D (two-step: preview then refine)
export async function textTo3D(prompt: string, artStyle = 'realistic'): Promise<{ taskId: string }> {
  const res = await fetch(`${MESHY_API_BASE}/text-to-3d`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      mode: 'preview',
      prompt,
      art_style: artStyle,
      negative_prompt: 'low quality, blurry',
    }),
  });
  if (!res.ok) throw new Error(`Meshy text-to-3D failed: ${await res.text()}`);
  const data = await res.json();
  return { taskId: data.result };
}

// Image → 3D
export async function imageTo3D(imageUrl: string): Promise<{ taskId: string }> {
  const res = await fetch(`${MESHY_API_BASE}/image-to-3d`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      image_url: imageUrl,
      enable_pbr: true,
    }),
  });
  if (!res.ok) throw new Error(`Meshy image-to-3D failed: ${await res.text()}`);
  const data = await res.json();
  return { taskId: data.result };
}

// Poll job status
export async function getTaskStatus(taskId: string, jobType: 'text_to_3d' | 'image_to_3d'): Promise<MeshyTask> {
  const endpoint = jobType === 'text_to_3d' ? 'text-to-3d' : 'image-to-3d';
  const res = await fetch(`${MESHY_API_BASE}/${endpoint}/${taskId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error(`Meshy status check failed: ${await res.text()}`);
  return res.json();
}
