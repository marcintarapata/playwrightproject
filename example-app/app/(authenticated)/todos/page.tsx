'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

export default function TodosPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    } else if (session) {
      fetchTodos();
    }
  }, [session, isPending, router]);

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    if (res.ok) {
      const data = await res.json();
      setTodos(data);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, priority }),
    });
    if (res.ok) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      fetchTodos();
    }
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    if (res.ok) fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this todo?')) {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      fetchTodos();
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  if (isPending || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">TodoApp</Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Back to Dashboard</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Todos</h1>

        {/* Create Form */}
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow mb-8" data-testid="create-todo-form">
          <h2 className="text-xl font-bold mb-4">Create New Todo</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded"
              data-testid="todo-title-input"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              data-testid="todo-description-input"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-4 py-2 border rounded"
              data-testid="todo-priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" data-testid="create-todo-button">
              Create Todo
            </button>
          </div>
        </form>

        {/* Filter */}
        <div className="mb-4 flex gap-2" data-testid="todo-filter">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} data-testid="filter-all">All</button>
          <button onClick={() => setFilter('active')} className={`px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} data-testid="filter-active">Active</button>
          <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} data-testid="filter-completed">Completed</button>
        </div>

        {/* Todos List */}
        <div className="space-y-4" data-testid="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="text-center text-gray-500 py-8" data-testid="empty-state">No todos found</div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between" data-testid={`todo-item-${todo.id}`}>
                <div className="flex items-center gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id, todo.completed)}
                    className="w-5 h-5"
                    data-testid={`todo-checkbox-${todo.id}`}
                  />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${todo.completed ? 'line-through text-gray-500' : ''}`} data-testid={`todo-title-${todo.id}`}>{todo.title}</h3>
                    {todo.description && <p className="text-gray-600 text-sm" data-testid={`todo-description-${todo.id}`}>{todo.description}</p>}
                    <span className={`text-xs px-2 py-1 rounded ${todo.priority === 'high' ? 'bg-red-100 text-red-800' : todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`} data-testid={`todo-priority-${todo.id}`}>
                      {todo.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-600 hover:text-red-800"
                  data-testid={`todo-delete-${todo.id}`}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
