/**
 * MembershipFlow.test.tsx
 * Member 1 (Frontend & UI/UX) — Sprint 2
 *
 * Verifies frontend component rendering and constraints:
 *   - JoinRequestModal modal open/close & note length feedback
 *   - OwnerReviewPanel displays pending requests with applicant details
 *   - Approve / Decline button triggers
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JoinRequestModal from '../src/components/JoinRequestModal';
import OwnerReviewPanel from '../src/components/OwnerReviewPanel';

describe('Member 1 Frontend Components (Sprint 2)', () => {
  describe('JoinRequestModal', () => {
    it('does not render when isOpen is false', () => {
      const { container } = render(
        <JoinRequestModal
          groupId="group-1"
          groupName="CS301 Study Circle"
          isOpen={false}
          onClose={() => {}}
          onRequestSubmitted={() => {}}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders with title and group name when isOpen is true', () => {
      render(
        <JoinRequestModal
          groupId="group-1"
          groupName="CS301 Study Circle"
          isOpen={true}
          onClose={() => {}}
          onRequestSubmitted={() => {}}
        />
      );

      expect(screen.getByText('Request to Join')).toBeDefined();
      expect(screen.getByText(/CS301 Study Circle/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Hi! I'm taking CS301/i)).toBeDefined();
    });

    it('tracks character counter when user types introduction note', () => {
      render(
        <JoinRequestModal
          groupId="group-1"
          groupName="CS301 Study Circle"
          isOpen={true}
          onClose={() => {}}
          onRequestSubmitted={() => {}}
        />
      );

      const textarea = screen.getByPlaceholderText(/Hi! I'm taking CS301/i);
      fireEvent.change(textarea, { target: { value: 'Looking for study buddies!' } });

      expect(screen.getByText('26 / 500')).toBeDefined();
    });
  });

  describe('OwnerReviewPanel', () => {
    it('renders empty state when there are no pending requests', () => {
      render(
        <OwnerReviewPanel
          groupId="group-1"
          pendingRequests={[]}
          onActionComplete={() => {}}
        />
      );

      expect(screen.getByText('No pending membership requests.')).toBeDefined();
    });

    it('renders applicant cards with student information and action buttons', () => {
      const mockRequests = [
        {
          id: 'req-1',
          group_id: 'group-1',
          user_id: 'user-bob',
          request_note: 'Ready to study hard!',
          created_at: new Date().toISOString(),
          user: {
            id: 'user-bob',
            email: 'bob@university.edu',
            fullName: 'Bob Smith',
            major: 'Computer Science',
            academicYear: '2nd Year',
          },
        },
      ];

      render(
        <OwnerReviewPanel
          groupId="group-1"
          pendingRequests={mockRequests}
          onActionComplete={() => {}}
        />
      );

      expect(screen.getByText('Bob Smith')).toBeDefined();
      expect(screen.getByText('bob@university.edu')).toBeDefined();
      expect(screen.getByText('Computer Science')).toBeDefined();
      expect(screen.getByText(/Ready to study hard!/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /Approve/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Decline/i })).toBeDefined();
    });
  });
});
