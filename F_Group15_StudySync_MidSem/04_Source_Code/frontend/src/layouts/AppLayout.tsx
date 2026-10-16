/**
 * App Layout Wrapper
 * Member 1 (Frontend & UI/UX) — Sprint 1
 *
 * Wraps authenticated pages with Navbar + main content container.
 */

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-200 text-center text-xs text-gray-400 py-3">
        © 2026 StudySync — Collaborative Study Platform
      </footer>
    </div>
  );
}
