/**
 * Group API Service
 * Member 1 (Frontend & UI/UX) — Sprint 1
 */

import apiClient from './apiClient';

export interface CreateGroupPayload {
  name: string;
  description: string;
  subjectId: string;
  maxMembers: number;
  visibility: 'public' | 'private';
  tags: string[];
}

export const groupService = {
  getSubjects: () => apiClient.get('/subjects').then((r) => r.data),

  getGroups: (params?: { subjectId?: string; search?: string }) =>
    apiClient.get('/groups', { params }).then((r) => r.data),

  getGroupById: (id: string) =>
    apiClient.get(`/groups/${id}`).then((r) => r.data),

  createGroup: (data: CreateGroupPayload) =>
    apiClient.post('/groups', data).then((r) => r.data),

  // Sprint 2 (US-05 / US-06) Membership Operations
  requestToJoin: (groupId: string, requestNote: string = '') =>
    apiClient.post(`/groups/${groupId}/join`, { requestNote }).then((r) => r.data),

  getPendingRequests: (groupId: string) =>
    apiClient.get(`/groups/${groupId}/requests`).then((r) => r.data),

  respondToRequest: (groupId: string, userId: string, status: 'accepted' | 'rejected') =>
    apiClient.patch(`/groups/${groupId}/requests/${userId}`, { status }).then((r) => r.data),

  getGroupMembers: (groupId: string) =>
    apiClient.get(`/groups/${groupId}/members`).then((r) => r.data),

  getMyMemberships: () =>
    apiClient.get('/groups/user/my-memberships').then((r) => r.data),

  // Sprint 2 (US-07) Recommendations
  getRecommendations: () =>
    apiClient.get('/groups/recommendations').then((r) => r.data),
};
