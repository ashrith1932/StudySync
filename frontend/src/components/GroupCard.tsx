/**
 * GroupCard Component
 * Member 1 (Frontend & UI/UX) — Sprint 1
 * User Story: US-04 — Student browses available study groups
 */

import { Users, BookOpen, Lock } from 'lucide-react';
import type { StudyGroup } from '../types';

interface GroupCardProps {
  group: StudyGroup & { memberCount?: number; subjectName?: string };
  onClick?: () => void;
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  const isFull = group.memberCount !== undefined && group.memberCount >= group.maxMembers;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2">
          {group.name}
        </h3>
        {group.visibility === 'private' && (
          <Lock size={14} className="text-gray-400 mt-0.5 shrink-0" />
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{group.description}</p>

      {/* Tags */}
      {group.tags && group.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {group.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Subject + Members */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <BookOpen size={13} />
          <span className="font-medium">{group.subjectName || 'Subject'}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${isFull ? 'text-red-500' : ''}`}>
          <Users size={13} />
          <span>
            {group.memberCount ?? '—'}/{group.maxMembers}
            {isFull && ' (Full)'}
          </span>
        </div>
      </div>
    </div>
  );
}
