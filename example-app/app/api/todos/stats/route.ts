import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userTodos = await db.select().from(todos).where(eq(todos.userId, session.user.id));

  const stats = {
    total: userTodos.length,
    completed: userTodos.filter(t => t.completed).length,
    active: userTodos.filter(t => !t.completed).length,
  };

  return NextResponse.json(stats);
}
