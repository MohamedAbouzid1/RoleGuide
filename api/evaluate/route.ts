import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { evaluateResume } from '@/lib/ai';
import { CV } from '@/lib/types';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cv = (await req.json()) as CV;
    const evaluation = await evaluateResume(cv);
    return NextResponse.json(evaluation);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to evaluate' }, { status: 500 });
  }
}

