/**
 * Group Membership Controller
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * Implements:
 *   - POST  /api/v1/groups/:id/join
 *   - GET   /api/v1/groups/:id/requests
 *   - PATCH /api/v1/groups/:id/requests/:userId
 *   - GET   /api/v1/groups/:id/members
 *   - PATCH /api/v1/groups/:id/members/:userId
 *   - GET   /api/v1/groups/user/my-memberships
 */

import { groupRepository, membershipRepository } from '../repositories/group.repository.js';
import { sendSuccess, sendError } from '../utils/response.js';

/**
 * Submit join request (US-05 / FR-008 / TC-009)
 * POST /api/v1/groups/:id/join
 */
export function requestToJoin(req, res) {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;
    const { requestNote = '' } = req.body || {};

    const group = groupRepository.findById(groupId);
    if (!group) {
      return sendError(res, 'Study group not found.', 404);
    }

    // Guard: Prevent self-joining by creator
    if (group.creator_id === userId) {
      return sendError(res, 'Group creator is already the owner of this group.', 400);
    }

    // Guard: Check existing membership / duplicate request
    const existing = membershipRepository.findByGroupAndUser(groupId, userId);
    if (existing) {
      if (existing.status === 'accepted') {
        return sendError(res, 'You are already a member of this study group.', 409);
      }
      if (existing.status === 'pending') {
        return sendError(res, 'You already have a pending join request for this group.', 409);
      }
    }

    // Guard: Check group capacity
    const currentMemberCount = groupRepository.memberCount(groupId);
    if (currentMemberCount >= group.max_members) {
      return sendError(res, 'This study group has reached its maximum capacity.', 400);
    }

    const membership = membershipRepository.create(groupId, userId, requestNote);
    return sendSuccess(res, membership, 'Join request submitted successfully.', 201);
  } catch (err) {
    console.error('[requestToJoin]', err);
    return sendError(res, 'Failed to submit join request.', 500);
  }
}

/**
 * Get pending join requests for owner review (US-06 / FR-009 / TC-010)
 * GET /api/v1/groups/:id/requests
 */
export function getPendingRequests(req, res) {
  try {
    const groupId = req.params.id;
    const userId = req.user.id;

    const group = groupRepository.findById(groupId);
    if (!group) {
      return sendError(res, 'Study group not found.', 404);
    }

    // Role check: Only group creator / owner can view requests
    if (group.creator_id !== userId) {
      return sendError(res, 'Forbidden: Only the group owner can view pending membership requests.', 403);
    }

    const pendingRequests = membershipRepository.findWithUserDetails(groupId, 'pending');
    return sendSuccess(res, pendingRequests, 'Pending requests retrieved successfully.');
  } catch (err) {
    console.error('[getPendingRequests]', err);
    return sendError(res, 'Failed to retrieve pending requests.', 500);
  }
}

/**
 * Approve or decline a pending membership request (US-06 / FR-010 / TC-010 / TC-010-B)
 * PATCH /api/v1/groups/:id/requests/:userId
 * (Also supported at PATCH /api/v1/groups/:id/members/:userId per API spec)
 */
export function respondToRequest(req, res) {
  try {
    const groupId = req.params.id;
    const applicantId = req.params.userId;
    const ownerId = req.user.id;
    const { status } = req.body;

    const group = groupRepository.findById(groupId);
    if (!group) {
      return sendError(res, 'Study group not found.', 404);
    }

    // Role check: Only group creator / owner can approve or reject
    if (group.creator_id !== ownerId) {
      return sendError(res, 'Forbidden: Only the group owner can respond to membership requests.', 403);
    }

    const membership = membershipRepository.findByGroupAndUser(groupId, applicantId);
    if (!membership) {
      return sendError(res, 'Membership request not found.', 404);
    }

    if (membership.status !== 'pending') {
      return sendError(res, `Cannot modify request: Current status is '${membership.status}'.`, 400);
    }

    // Invariant: Enforce capacity cap before accepting
    if (status === 'accepted') {
      const currentMemberCount = groupRepository.memberCount(groupId);
      if (currentMemberCount >= group.max_members) {
        return sendError(res, 'Cannot accept request: Study group has reached maximum member capacity.', 400);
      }
    }

    const updated = membershipRepository.updateStatus(groupId, applicantId, status);
    const updatedCount = groupRepository.memberCount(groupId);

    return sendSuccess(
      res,
      { ...updated, currentMemberCount: updatedCount },
      `Membership request ${status} successfully.`
    );
  } catch (err) {
    console.error('[respondToRequest]', err);
    return sendError(res, 'Failed to update membership request.', 500);
  }
}

/**
 * List all members of a study group
 * GET /api/v1/groups/:id/members
 */
export function getGroupMembers(req, res) {
  try {
    const groupId = req.params.id;
    const group = groupRepository.findById(groupId);
    if (!group) {
      return sendError(res, 'Study group not found.', 404);
    }

    const members = membershipRepository.findWithUserDetails(groupId, 'accepted');
    return sendSuccess(res, members, 'Group members retrieved successfully.');
  } catch (err) {
    console.error('[getGroupMembers]', err);
    return sendError(res, 'Failed to retrieve members.', 500);
  }
}

/**
 * List all group memberships for authenticated user
 * GET /api/v1/groups/user/my-memberships
 */
export function getMyMemberships(req, res) {
  try {
    const userId = req.user.id;
    const memberships = membershipRepository.findByUser(userId);

    const enriched = memberships.map((m) => {
      const group = groupRepository.findById(m.group_id);
      return {
        ...m,
        group: group
          ? {
              id: group.id,
              name: group.name,
              description: group.description,
              maxMembers: group.max_members,
              memberCount: groupRepository.memberCount(group.id),
            }
          : null,
      };
    });

    return sendSuccess(res, enriched, 'User memberships retrieved.');
  } catch (err) {
    console.error('[getMyMemberships]', err);
    return sendError(res, 'Failed to retrieve memberships.', 500);
  }
}
