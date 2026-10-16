/**
 * Zod Request Validators — Study Groups
 * Member 2 (Backend & Auth) — Sprint 1
 */

import { z } from 'zod';

export const createGroupSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Group name is required' })
      .min(3, 'Name must be at least 3 characters')
      .max(200, 'Name too long'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(10, 'Description must be at least 10 characters')
      .max(1000, 'Description too long'),
    subjectId: z
      .string({ required_error: 'Subject ID is required' })
      .uuid('Subject ID must be a valid UUID'),
    maxMembers: z
      .number()
      .int()
      .min(2, 'Must allow at least 2 members')
      .max(50, 'Cannot exceed 50 members')
      .default(8),
    visibility: z.enum(['public', 'private']).default('public'),
    tags: z.array(z.string()).default([]),
  }),
});
