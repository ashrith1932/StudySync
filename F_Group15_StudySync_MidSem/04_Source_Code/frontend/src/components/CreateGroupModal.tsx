/**
 * CreateGroupModal
 * Member 1 (Frontend & UI/UX) — Sprint 1
 * User Story: US-03 — Group leader creates a study group
 */

import { useState, type FormEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { groupService } from '../services/group.service';
import type { Subject, StudyGroup } from '../types';

interface Props {
  subjects: Subject[];
  onClose: () => void;
  onCreated: (group: StudyGroup) => void;
}

export default function CreateGroupModal({ subjects, onClose, onCreated }: Props) {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId]     = useState('');
  const [maxMembers, setMaxMembers]   = useState(8);
  const [visibility, setVisibility]   = useState<'public' | 'private'>('public');
  const [tagInput, setTagInput]       = useState('');
  const [tags, setTags]               = useState<string[]>([]);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!subjectId) { setError('Please select a subject.'); return; }
    setLoading(true);
    try {
      const res = await groupService.createGroup({ name, description, subjectId, maxMembers, visibility, tags });
      onCreated(res.data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to create group.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Create Study Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. DSA Masters — Section B"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="What will this group focus on? How often will you meet?"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="">Select a subject...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.code} — {s.name}</option>
              ))}
            </select>
          </div>

          {/* Max Members + Visibility */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Members</label>
              <input type="number" min={2} max={50} value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
              <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optional)</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag and press Enter"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button type="button" onClick={addTag}
                className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg text-gray-600 transition">
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t} className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => setTags((p) => p.filter((x) => x !== t))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition disabled:opacity-60">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
