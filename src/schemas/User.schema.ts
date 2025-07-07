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
  refreshToken: z.string().trim(),
  hasUsedReferral: z.boolean(),
  lastLogin: z.date(),
  avatar: z.string().trim(),
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

// Type exports
type User = z.infer<typeof userSchema>;
type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
type AuthRequest = z.infer<typeof authRequestSchema>;
type UserResponse = z.infer<typeof userResponseSchema>;

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
