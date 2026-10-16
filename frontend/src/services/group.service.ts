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
};
