/**
 * ProfilePage Component
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Implements:
 *   - Academic profile setup: Major, Academic Year, Bio, Learning Goals
 *   - Interactive weekly recurring availability matrix across Monday–Sunday
 *   - Time-slot selection (e.g., Morning, Afternoon, Evening)
 *   - Live save feedback with network state handling
 */

import React, { useEffect, useState } from 'react';
import { User, Calendar, Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../services/auth.service';

interface AvailabilitySlot {
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string;
  endTime: string;
}

const DAYS_OF_WEEK: Array<AvailabilitySlot['dayOfWeek']> = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export default function ProfilePage() {
  const [bio, setBio] = useState('');
  const [major, setMajor] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [goalsInput, setGoalsInput] = useState('');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New slot temporary state
  const [selectedDay, setSelectedDay] = useState<AvailabilitySlot['dayOfWeek']>('monday');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');

  useEffect(() => {
    async function fetchCurrentProfile() {
      try {
        setLoading(true);
        const res = await authService.getMe();
        const profile = res.data?.profile || {};
        if (profile.bio) setBio(profile.bio);
        if (profile.major) setMajor(profile.major);
        if (profile.academic_year) setAcademicYear(profile.academic_year);
        if (profile.learning_goals) setLearningGoals(profile.learning_goals);
        if (profile.availability) setAvailability(profile.availability);
      } catch (err: any) {
        setErrorMsg('Could not fetch existing profile data.');
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentProfile();
  }, []);

  function handleAddGoal(e: React.KeyboardEvent | React.MouseEvent) {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = goalsInput.trim();
    if (trimmed && !learningGoals.includes(trimmed)) {
      setLearningGoals([...learningGoals, trimmed]);
      setGoalsInput('');
    }
  }

  function handleRemoveGoal(tagToRemove: string) {
    setLearningGoals(learningGoals.filter((g) => g !== tagToRemove));
  }

  function handleAddSlot() {
    if (startTime >= endTime) {
      setErrorMsg('End time must be after start time.');
      return;
    }
    setErrorMsg(null);
    setAvailability([...availability, { dayOfWeek: selectedDay, startTime, endTime }]);
  }

  function handleRemoveSlot(index: number) {
    setAvailability(availability.filter((_, idx) => idx !== index));
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await authService.updateProfile({
        bio,
        major,
        academicYear,
        learningGoals,
      });

      await authService.updateAvailability(availability);
      setSuccessMsg('Academic profile and availability saved successfully!');
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.error?.message ||
        'Failed to save profile changes.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="text-indigo-600" /> Academic Profile & Availability
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Provide your major, study goals, and weekly recurring free slots so StudySync can match you with compatible peers.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Academic Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            1. Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Major / Degree</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Academic Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other students about your focus, current courses, and what kind of study partner you are looking for..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Learning Goals & Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={goalsInput}
                onChange={(e) => setGoalsInput(e.target.value)}
                onKeyDown={handleAddGoal}
                placeholder="e.g., SE301 Exam Prep, LeetCode, Algorithms"
                className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Add Goal
              </button>
            </div>
            {learningGoals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {learningGoals.map((g, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    #{g}
                    <button
                      type="button"
                      onClick={() => handleRemoveGoal(g)}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Availability Matrix Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={18} />
              2. Recurring Weekly Availability Slots
            </h2>
            <span className="text-xs text-gray-500">Used for schedule overlap peer matching</span>
          </div>

          {/* Add Slot Controls */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-wrap items-center gap-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as any)}
              className="border border-gray-300 rounded-lg p-2 text-xs font-medium bg-white outline-none"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <span>From:</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
              />
              <span>To:</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="border border-gray-300 rounded-lg p-1.5 bg-white text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleAddSlot}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus size={14} /> Add Slot
            </button>
          </div>

          {/* Render Active Availability Slots */}
          <div className="space-y-2 mt-4">
            {availability.length === 0 ? (
              <p className="text-xs text-gray-500 italic py-2">
                No availability slots configured yet. Add intervals above to activate compatibility matching.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs"
                  >
                    <div>
                      <span className="font-bold text-indigo-900 capitalize block">
                        {slot.dayOfWeek}
                      </span>
                      <span className="text-indigo-700">
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove time slot"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Profile & Availability'}
          </button>
        </div>
      </form>
    </div>
  );
}
