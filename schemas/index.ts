import { UserRole } from "@/types";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const UpdateUserSchema = z.object({
  id: z.string().min(6),
  name: z.string().min(6, {
    message: "Name is required"
  }),
  email: z.string().email({
    message: "Email is required",
  }),
});


export const blogSchema = z.object({
  title: z.string().min(6, {
    message: "Title is required"
  }),
  description: z.string().optional(),
  userId: z.string(),
  content: z.object({}),
  version: z.number(),
  seoPath: z.string().regex(/^[a-z0-9-]+$/).min(4, {
    message: "SEO path is required"
  }),
});

export const UploadFileToStorage = z.object({
  userId: z.string().min(1),
  key: z.string().min(1),
  url: z.string().min(1),
  name: z.string().min(1),
  size: z.number().min(1),
});

export const UpdateAvatar = z.object({
  path: z.string().min(6, {
    message: "Image url is required"
  }),
  id: z.string().min(6).optional(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required!",
  }),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
}).refine((data) => {
  if (data.password && !data.newPassword) {
    return false;
  }
  return true;
}, {
  message: "New password is required!",
  path: ["newPassword"],
}).refine((data) => {
  if (data.newPassword && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required!",
  path: ["password"],
});


export const createChatRoomSchema = z.object({
  userIds: z.array(z.string()),
  name: z.string().min(1, {
    message: "Room name is required"
  }),
});