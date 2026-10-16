/**
 * Zod Request Validators — Group Membership & User Profile
 * Member 2 (Backend & Auth) — Sprint 2
 *
 * Enforces strict validation for:
 *   - POST /api/v1/groups/:id/join
 *   - PATCH /api/v1/groups/:id/requests/:userId
 *   - PATCH /api/v1/groups/:id/members/:userId
 *   - PUT /api/v1/users/profile
 *   - PUT /api/v1/users/availability
 */

import { z } from 'zod';

export const joinRequestSchema = z.object({
  body: z.object({
    requestNote: z
      .string()
      .max(500, 'Request note cannot exceed 500 characters')
      .optional()
      .default(''),
  }),
});

export const updateMembershipSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'rejected'], {
      required_error: 'Status is required and must be either accepted or rejected',
      invalid_type_error: 'Status must be either accepted or rejected',
    }),
  }),
});

export const profileUpdateSchema = z.object({
  body: z.object({
    bio: z.string().max(1000, 'Bio too long').optional(),
    major: z.string().max(100, 'Major too long').optional(),
    academicYear: z.string().max(50, 'Academic year too long').optional(),
    learningGoals: z.array(z.string()).optional(),
    preferredSubjects: z.array(z.string()).optional(),
  }),
});

export const availabilitySlotSchema = z.object({
  dayOfWeek: z.enum([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm 24-hour format'),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm 24-hour format'),
});

export const availabilityUpdateSchema = z.object({
  body: z.object({
    availability: z.array(availabilitySlotSchema, {
      required_error: 'Availability array is required',
    }),
  }),
});
