import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ticketSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export const ticketUpdateSchema = z.object({
  title: z.string().min(5).max(200).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assigned_to: z.number().int().positive().nullable().optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment too long"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const accountDeletionSchema = z.object({
  confirmEmail: z.string().email("Please enter your email to confirm deletion"),
});

export const orgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(100, "Name too long"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug too long")
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Slug must be lowercase letters, numbers, and hyphens (no leading/trailing hyphens)"),
  description: z.string().max(500, "Description too long").optional().default("").transform(v => v || null),
});

export const orgUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, "Invalid slug format")
    .optional(),
  description: z.string().max(500).optional().nullable(),
});

export const orgMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ORG_ADMIN", "ORG_MEMBER"]).default("ORG_MEMBER"),
});

export const orgMemberRoleSchema = z.object({
  role: z.enum(["ORG_ADMIN", "ORG_MEMBER"]),
});