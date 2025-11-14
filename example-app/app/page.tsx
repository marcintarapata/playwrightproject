/**
 * Landing Page
 *
 * Public homepage with marketing content and CTAs for registration/login.
 * Accessible to all users (authenticated and unauthenticated).
 */

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" data-testid="header">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600" data-testid="logo">
            TodoApp
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 transition"
              data-testid="nav-login"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              data-testid="nav-register"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center" data-testid="hero-section">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6" data-testid="hero-title">
          Organize Your Life
          <br />
          <span className="text-blue-600">One Task at a Time</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" data-testid="hero-description">
          A powerful, intuitive todo application built with modern web technologies.
          Manage your tasks efficiently and boost your productivity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            data-testid="cta-primary"
          >
            Start For Free
          </Link>
          <Link
            href="/login"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
            data-testid="cta-secondary"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20" data-testid="features-section">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Stay Organized
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition" data-testid="feature-card-1">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">
              Create, edit, and organize your tasks with ease. Set priorities and track completion
              status effortlessly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition" data-testid="feature-card-2">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Visualize your productivity with real-time statistics and progress indicators on your
              dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition" data-testid="feature-card-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">
              Your data is encrypted and secure. Only you have access to your tasks and personal
              information.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20" data-testid="cta-section">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already organizing their lives with TodoApp.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition inline-block"
            data-testid="cta-bottom"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t" data-testid="footer">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 TodoApp. Built with Next.js and Playwright for testing demonstration.</p>
          <p className="mt-2 text-sm">
            Part of the Enterprise Playwright Testing Framework Example
          </p>
        </div>
      </footer>
    </div>
  );
}
