/**
 * GroupDetailPage Component
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Implements:
 *   - Group metadata, description, course badge, and tags
 *   - Max capacity indicator and live member roster
 *   - Conditional UI state:
 *       • Non-Member: "Request to Join" button (opens JoinRequestModal)
 *       • Pending Applicant: "Application Under Review" status badge
 *       • Active Member: "Active Member" badge & roster list
 *       • Owner: Group management badge + OwnerReviewPanel
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, BookOpen, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { groupService } from '../services/group.service';
import { useAuth } from '../context/AuthContext';
import JoinRequestModal from '../components/JoinRequestModal';
import OwnerReviewPanel from '../components/OwnerReviewPanel';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGroupData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      // Fetch group details
      const groupRes = await groupService.getGroupById(id);
      const groupData = groupRes.data || groupRes;
      setGroup(groupData);

      // Fetch accepted members
      try {
        const membersRes = await groupService.getGroupMembers(id);
        setMembers(membersRes.data || []);
      } catch {
        // Fallback to members array inside group object if available
        if (groupData.members) setMembers(groupData.members);
      }

      // If user is the creator/owner, fetch pending requests
      if (user && groupData.creator_id === user.id) {
        try {
          const reqRes = await groupService.getPendingRequests(id);
          setPendingRequests(reqRes.data || []);
        } catch (e) {
          console.error('Could not fetch pending requests:', e);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Failed to load study group details.'
      );
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error || 'Study group not found.'}</span>
        </div>
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft size={16} /> Back to Browse Groups
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === group.creator_id;
  const isMember = members.some(
    (m) => m.user_id === user?.id || (m.status === 'accepted' && m.user_id === user?.id)
  );
  const isPending = pendingRequests.some((r) => r.user_id === user?.id);
  const isFull = (group.memberCount || members.length) >= group.max_members;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/groups"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Groups
      </Link>

      {/* Main Group Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <BookOpen size={12} />
                Course Group
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {group.visibility === 'public' ? 'Public' : 'Private'}
              </span>
              {isOwner && (
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Shield size={12} /> Group Owner
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {group.name}
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              {group.description}
            </p>
          </div>

          {/* Action Trigger / Membership State */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            {isOwner ? (
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg font-semibold">
                You manage this group
              </span>
            ) : isMember ? (
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1">
                ✓ Enrolled Member
              </span>
            ) : isPending ? (
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg font-semibold">
                ⏳ Request Pending Review
              </span>
            ) : isFull ? (
              <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg font-semibold">
                Group Full
              </span>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                Request to Join Group
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
              <Users size={14} className="text-indigo-600" />
              <span>
                <strong className="text-gray-800">{group.memberCount || members.length}</strong> /{' '}
                {group.max_members} max members
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400 font-medium mr-1">Focus Areas:</span>
            {group.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Owner Review Dashboard (Visible strictly to the creator) */}
      {isOwner && (
        <OwnerReviewPanel
          groupId={group.id}
          pendingRequests={pendingRequests}
          onActionComplete={fetchGroupData}
        />
      )}

      {/* Group Member Roster */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-indigo-600" />
          Active Roster ({members.length})
        </h2>

        {members.length === 0 ? (
          <p className="text-xs text-gray-500">No members currently in roster.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {members.map((m: any) => (
              <div
                key={m.id || m.user_id}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {(m.user?.fullName || m.userFullName || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {m.user?.fullName || m.userFullName || 'Study Member'}
                    </p>
                    {m.role === 'owner' && (
                      <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {m.user?.major || m.user?.email || 'Student'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      <JoinRequestModal
        groupId={group.id}
        groupName={group.name}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestSubmitted={fetchGroupData}
      />
    </div>
  );
}
