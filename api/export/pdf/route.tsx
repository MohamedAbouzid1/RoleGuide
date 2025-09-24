import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { renderToStream } from '@react-pdf/renderer';
import { CV } from '@/lib/types';
import { CVTemplate } from '@/components/pdf/CVTemplate';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  try {
    const cv = (await req.json()) as CV;
    const stream = await renderToStream(<CVTemplate cv={cv} />);
    const readable = await stream;
    return new Response(readable as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="lebenslauf.pdf"'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to export PDF' }), { status: 500 });
  }
}

