/**
 * Zod Request Validators — Auth & User
 * Member 2 (Backend & Auth) — Sprint 1
 *
 * Defines and exports Zod schemas for validating:
 *   - POST /api/v1/auth/register
 *   - POST /api/v1/auth/login
 */

import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Full name must be at least 2 characters')
      .max(150, 'Full name too long'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Must be a valid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password too long'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Must be a valid email address')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});
