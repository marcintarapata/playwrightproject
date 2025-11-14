import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { todos } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userTodos = await db.select().from(todos).where(eq(todos.userId, session.user.id)).orderBy(todos.createdAt);
  return NextResponse.json(userTodos);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const newTodo = await db.insert(todos).values({
    userId: session.user.id,
    title: body.title,
    description: body.description,
    priority: body.priority || 'medium',
    completed: false,
  }).returning().get();

  return NextResponse.json(newTodo);
}
