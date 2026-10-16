/**
 * Auth API Service
 * Member 1 (Frontend & UI/UX) — Sprint 1
 */

import apiClient from './apiClient';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  register: (data: RegisterPayload) =>
    apiClient.post('/auth/register', data).then((r) => r.data),

  login: (data: LoginPayload) =>
    apiClient.post('/auth/login', data).then((r) => r.data),

  getMe: () =>
    apiClient.get('/auth/me').then((r) => r.data),

  updateProfile: (data: {
    bio?: string;
    major?: string;
    academicYear?: string;
    learningGoals?: string[];
    preferredSubjects?: string[];
  }) => apiClient.put('/users/profile', data).then((r) => r.data),

  updateAvailability: (availability: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>) => apiClient.put('/users/availability', { availability }).then((r) => r.data),
};
