/**
 * GroupListPage — Study Group Directory
 * Member 1 (Frontend & UI/UX) — Sprint 1
 * User Story: US-04 — Browse groups with search & subject filter
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { groupService } from '../services/group.service';
import GroupCard from '../components/GroupCard';
import CreateGroupModal from '../components/CreateGroupModal';
import type { StudyGroup, Subject } from '../types';

export default function GroupListPage() {
  const navigate = useNavigate();
  const [groups, setGroups]           = useState<(StudyGroup & { memberCount?: number })[]>([]);
  const [subjects, setSubjects]       = useState<Subject[]>([]);
  const [search, setSearch]           = useState('');
  const [subjectId, setSubjectId]     = useState('');
  const [isLoading, setIsLoading]     = useState(true);
  const [showCreate, setShowCreate]   = useState(false);

  useEffect(() => {
    groupService.getSubjects().then((r) => setSubjects(r.data));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (subjectId) params.subjectId = subjectId;

    groupService.getGroups(params)
      .then((r) => setGroups(r.data))
      .finally(() => setIsLoading(false));
  }, [search, subjectId]);

  function subjectNameFor(subjectIdParam: string) {
    return subjects.find((s) => s.id === subjectIdParam)?.name ?? 'Unknown';
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study Groups</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and join collaborative study groups</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Create Group
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, description, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="relative sm:w-56">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none transition"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-44" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No groups found.</p>
          <p className="text-sm mt-1">Try a different search or create a new group!</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{groups.length} group{groups.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((g) => (
              <GroupCard
                key={g.id}
                group={{ ...g, subjectName: subjectNameFor(g.subjectId) }}
                onClick={() => navigate(`/groups/${g.id}`)}
              />
            ))}
          </div>
        </>
      )}

      {/* Create Group Modal */}
      {showCreate && (
        <CreateGroupModal
          subjects={subjects}
          onClose={() => setShowCreate(false)}
          onCreated={(newGroup) => {
            setGroups((prev) => [{ ...newGroup, memberCount: 1 }, ...prev]);
            setShowCreate(false);
            navigate(`/groups/${newGroup.id}`);
          }}
        />
      )}
    </div>
  );
}
