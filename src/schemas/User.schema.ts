import mongoose from "mongoose";
import { z } from "zod";

// Base user schema with all fields
const userSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  username: z
    .string()
    .trim()
    .min(1, "minimum 1 character required")
    .max(30, "maximum 30 characters allowed"),
  email: z.string().email(),
  password: z.string().trim(),
  refreshToken: z.string().trim().nullable(),
  hasUsedReferral: z.boolean(),
  lastLogin: z.date().nullable(),
  avatar: z.string().trim().url("Avatar must be a valid URL").nullable(),
  accountValue: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Derive other schemas from userSchema
const createUserRequestSchema = userSchema
  .pick({
    username: true,
    email: true,
  })
  .extend({
    password: z
      .string()
      .trim()
      .min(1, "minimum 1 character required")
      .max(30, "maximum 30 characters allowed"),
    couponCode: z.string().optional(),
  });

const authRequestSchema = userSchema
  .pick({
    username: true,
  })
  .extend({
    password: z
      .string()
      .trim()
      .min(1, "minimum 1 character required")
      .max(30, "maximum 30 characters allowed"),
  });

const userResponseSchema = userSchema
  .omit({
    password: true,
    refreshToken: true,
  })
  .extend({
    _id: z.string(), // Convert ObjectId to string for API responses
  });

export const updateAvatarRequestSchema = z.object({
  avatar: z.string().url("Avatar must be a valid URL"),
});

export type UpdateAvatarRequest = z.infer<typeof updateAvatarRequestSchema>;

export const UpdateAvatarResponseSchema = z.object({
  _id: z.string(),
  username: z.string(),
  email: z.string().email(),
  avatar: z.string().url(),
  updatedAt: z.date(),
});

// Type exports
type User = z.infer<typeof userSchema>;
type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
type AuthRequest = z.infer<typeof authRequestSchema>;
type UserResponse = Omit<User, "password" | "refreshToken" | "_id"> & {
  _id: string;
};
export type UpdateAvatarResponse = z.infer<typeof UpdateAvatarResponseSchema>;

export {
  User,
  userSchema,
  createUserRequestSchema,
  CreateUserRequest,
  authRequestSchema,
  AuthRequest,
  userResponseSchema,
  UserResponse,
};
