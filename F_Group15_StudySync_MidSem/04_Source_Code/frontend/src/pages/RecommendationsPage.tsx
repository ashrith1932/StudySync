/**
 * RecommendationsPage Component
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Implements:
 *   - Algorithmic study group recommendations hub (US-07 / FR-011, FR-012)
 *   - Displays overall compatibility badge (e.g., "88% Match")
 *   - Color-coded visual affinity indicators (Emerald >= 80%, Amber >= 50%, Slate < 50%)
 *   - Explainable breakdown tags (subject match, schedule overlap, shared goals)
 *   - Direct link to inspect group details or submit join requests
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { groupService } from '../services/group.service';

interface RecommendedGroup {
  groupId: string;
  groupName: string;
  description?: string;
  subjectCode?: string;
  maxMembers?: number;
  currentMemberCount?: number;
  compatibilityScore: number;
  breakdown?: {
    subjectMatch?: number;
    scheduleMatch?: number;
    goalMatch?: number;
  };
  matchedCriteria?: string[];
  tags?: string[];
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError(null);
        const res = await groupService.getRecommendations();
        const list = res.data || [];
        setRecommendations(list);
      } catch (err: any) {
        // If Member 3's recommendation endpoint returns mock or empty in dev, gracefully fallback
        setError(
          err.response?.data?.message ||
          'Matching engine is computing recommendations. Make sure your profile and availability are filled out.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  function getBadgeColor(score: number) {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }

  function getBarColor(score: number) {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-indigo-500';
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600" /> Peer & Group Recommendations
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Algorithmic study group suggestions ranked by course subject alignment (40%), schedule availability overlap (40%), and learning goal similarity (20%).
          </p>
        </div>

        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-xs font-semibold rounded-xl transition-colors self-start md:self-auto"
        >
          Update Profile & Availability
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : error && recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4">
          <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-600">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Setup Profile to Unlock Recommendations</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            {error}
          </p>
          <div className="pt-2">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Configure Availability Slots
            </Link>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h2 className="text-base font-bold text-gray-900">No Recommended Groups Yet</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
            We haven&apos;t found new groups matching your schedule or subjects. Try exploring the group catalog or updating your profile!
          </p>
          <Link
            to="/groups"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            Browse All Study Groups <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const score = rec.compatibilityScore || 0;
            return (
              <div
                key={rec.groupId}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top Bar: Badge & Subject */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      {rec.subjectCode || 'Study Group'}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getBadgeColor(
                        score
                      )} flex items-center gap-1`}
                    >
                      <Sparkles size={12} />
                      {score}% Match
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-lg font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                    <Link to={`/groups/${rec.groupId}`}>{rec.groupName}</Link>
                  </h2>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                    {rec.description || 'No description provided.'}
                  </p>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                      <span>Affinity Strength</span>
                      <span>{score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getBarColor(score)} transition-all duration-500`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Explainable Criteria Tags */}
                  {rec.matchedCriteria && rec.matchedCriteria.length > 0 && (
                    <div className="space-y-1 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Why this matches:
                      </span>
                      {rec.matchedCriteria.map((c, i) => (
                        <p key={i} className="text-xs text-gray-700 flex items-center gap-1.5">
                          <span className="text-indigo-500">✓</span> {c}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Users size={14} className="text-indigo-500" />
                    <span>
                      {rec.currentMemberCount ?? 1} / {rec.maxMembers ?? 8} members
                    </span>
                  </div>

                  <Link
                    to={`/groups/${rec.groupId}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Group <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
