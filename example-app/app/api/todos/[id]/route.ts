import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db.delete(todos).where(and(eq(todos.id, parseInt(params.id)), eq(todos.userId, session.user.id)));
  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const updated = await db.update(todos)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(todos.id, parseInt(params.id)), eq(todos.userId, session.user.id)))
    .returning().get();

  return NextResponse.json(updated);
}
