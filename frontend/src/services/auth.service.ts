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
};
