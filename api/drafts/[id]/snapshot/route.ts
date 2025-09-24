import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session as any)?.user?.id as string | undefined;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { data } = body;
    const draft = await prisma.draft.findFirst({ where: { id: params.id, userId } });
    if (!draft) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const snapshot = await prisma.snapshot.create({
      data: {
        draftId: draft.id,
        data,
      },
    });
    return NextResponse.json(snapshot);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 });
  }
}

