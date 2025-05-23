// Generated by ts-to-zod
import { z } from 'zod';

const objectIdSchema = z.any();

export const invitationSchema = z.object({
  id: z.union([z.string(), objectIdSchema]).optional(),
  email: z.string(),
  businessId: z.union([z.string(), objectIdSchema]),
  status: z.string(),
  role: z.string(),
  inviter: z.object({
    userId: z.union([z.string(), objectIdSchema]).optional(),
    name: z.string().optional(),
    message: z.string().optional(),
  }),
  assignment: z.object({
    roleTemplateId: z.union([z.string(), objectIdSchema]).optional(),
    isOwner: z.boolean(),
    managerId: z.union([z.string(), objectIdSchema]).optional(),
    departmentId: z.union([z.string(), objectIdSchema]).optional(),
    projectAccess: z
      .array(
        z.object({
          projectId: z.union([z.string(), objectIdSchema]),
          accessTypes: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  security: z
    .object({
      token: z.string(),
      tokenHash: z.string(),
      createdAt: z.date().optional(),
      expiresAt: z.date(),
      usedAt: z.date().optional(),
    })
    .optional(),
  reminders: z
    .array(
      z.object({
        sentAt: z.date(),
        method: z.string(),
      }),
    )
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
