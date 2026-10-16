/**
 * OwnerReviewPanel Component
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Renders the owner management dashboard for reviewing pending applicant requests.
 * Includes distinct "Approve" (green) and "Decline" (red/gray) actions with
 * optimistic/immediate state updates on the roster.
 */

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, AlertCircle } from 'lucide-react';
import { groupService } from '../services/group.service';

interface PendingApplicant {
  id: string;
  group_id: string;
  user_id: string;
  request_note?: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    major?: string | null;
    academicYear?: string | null;
  };
}

interface OwnerReviewPanelProps {
  groupId: string;
  pendingRequests: PendingApplicant[];
  onActionComplete: () => void;
}

export default function OwnerReviewPanel({
  groupId,
  pendingRequests,
  onActionComplete,
}: OwnerReviewPanelProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function handleAction(userId: string, status: 'accepted' | 'rejected') {
    setActionError(null);
    setProcessingId(userId);

    try {
      await groupService.respondToRequest(groupId, userId, status);
      onActionComplete();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        `Failed to ${status === 'accepted' ? 'approve' : 'decline'} request.`;
      setActionError(msg);
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="text-indigo-600" size={20} />
            Owner Dashboard: Pending Membership Requests
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Review student applications and approve members into your group roster.
          </p>
        </div>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {pendingRequests.length} Pending
        </span>
      </div>

      {actionError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {pendingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium">No pending membership requests.</p>
          <p className="text-xs text-gray-400 mt-1">
            When students apply to join your group, their requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((req) => (
            <div
              key={req.id || req.user_id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {req.user?.fullName || 'Student Applicant'}
                  </span>
                  {req.user?.major && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                      {req.user.major}
                    </span>
                  )}
                  {req.user?.academicYear && (
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded">
                      {req.user.academicYear}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{req.user?.email}</p>

                {req.request_note && (
                  <p className="text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200 italic mt-2">
                    &ldquo;{req.request_note}&rdquo;
                  </p>
                )}

                <p className="text-xs text-gray-400">
                  Applied: {new Date(req.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAction(req.user_id, 'accepted')}
                  disabled={processingId === req.user_id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  {processingId === req.user_id ? 'Updating...' : 'Approve'}
                </button>
                <button
                  onClick={() => handleAction(req.user_id, 'rejected')}
                  disabled={processingId === req.user_id}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-200 hover:bg-red-100 hover:text-red-700 text-gray-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <XCircle size={14} />
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
