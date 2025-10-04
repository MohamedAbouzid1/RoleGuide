import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { data } = body;

    // Verify the draft belongs to the user
    const draft = await prisma.draft.findFirst({
      where: {
        id: params.id,
        userId: (session.user as any).id,
      },
    });

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const snapshot = await prisma.snapshot.create({
      data: {
        draftId: params.id,
        data: data || {},
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(snapshot, { status: 201 });
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}