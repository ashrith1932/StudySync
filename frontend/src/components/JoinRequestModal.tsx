/**
 * JoinRequestModal Component
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Allows students to submit a personalized introduction note (max 500 chars)
 * when requesting to join a study group.
 */

import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { groupService } from '../services/group.service';

interface JoinRequestModalProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export default function JoinRequestModal({
  groupId,
  groupName,
  isOpen,
  onClose,
  onRequestSubmitted,
}: JoinRequestModalProps) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await groupService.requestToJoin(groupId, note);
      onRequestSubmitted();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Failed to submit join request. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Request to Join</h2>
        <p className="text-sm text-gray-600 mb-4">
          Send a request to the owner of <span className="font-semibold text-indigo-700">{groupName}</span>.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Introduction / Motivation Note
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Hi! I'm taking CS301 this semester and free on Tuesday afternoons. Looking forward to preparing together!"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Explain your study availability and academic goals.</span>
              <span>{note.length} / 500</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
