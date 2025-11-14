'use client';

/**
 * Dashboard Page
 *
 * Authenticated user dashboard showing todo statistics and recent activity.
 * Protected route - requires authentication.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';

interface Stats {
  total: number;
  completed: number;
  active: number;
}

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, active: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/todos/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (isPending || !session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow" data-testid="dashboard-header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TodoApp</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700" data-testid="user-name">
              {session.user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
              data-testid="logout-button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2" data-testid="welcome-message">
            Welcome back, {session.user?.name}!
          </h2>
          <p className="text-gray-600">Here's an overview of your tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-total">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-active">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.active}</div>
            <div className="text-gray-600">Active Tasks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow" data-testid="stat-completed">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
            <div className="text-gray-600">Completed Tasks</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex gap-4">
            <Link
              href="/todos"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              data-testid="view-todos-button"
            >
              View All Todos
            </Link>
            <Link
              href="/todos?action=new"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              data-testid="create-todo-button"
            >
              Create New Todo
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
