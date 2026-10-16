/**
 * DashboardPage — Authenticated Home
 * Member 1 (Frontend & UI/UX) — Sprint 1
 */

import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Search, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(' ')[0] ?? 'Student';

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white p-8 mb-8">
        <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back 👋</p>
        <h1 className="text-3xl font-bold mb-2">{firstName}</h1>
        <p className="text-indigo-200 text-sm">Ready to study smarter together?</p>
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/groups"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-start gap-3 group">
          <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
            <Search size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Browse Groups</p>
            <p className="text-sm text-gray-500 mt-0.5">Find study groups for your courses</p>
          </div>
        </Link>

        <Link to="/groups"
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-start gap-3 group">
          <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
            <Users size={20} className="text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Create a Group</p>
            <p className="text-sm text-gray-500 mt-0.5">Start a new study group as leader</p>
          </div>
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-start gap-3">
          <div className="bg-purple-100 p-3 rounded-lg">
            <BookOpen size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">My Groups</p>
            <p className="text-sm text-gray-500 mt-0.5">Manage your enrolled study groups</p>
          </div>
        </div>
      </div>
    </div>
  );
}
