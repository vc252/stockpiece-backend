import mongoose from "mongoose";
import { z } from "zod";
import { booleanSchema } from "./commonSchema.js";

// Base user schema with all fields
const userSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  username: z
    .string()
    .trim()
    .min(1, "minimum 1 character required")
    .max(30, "maximum 30 characters allowed")
    .regex(
      /^[A-Za-z0-9._]+$/,
      "Only letters, numbers, dot and underscore allowed"
    ),
  email: z.string().email(),
  isVerified: booleanSchema.default(false),
  password: z.string().trim(),
  refreshToken: z.string().trim().nullable(),
  hasUsedReferral: booleanSchema,
  lastLogin: z.date().nullable(),
  avatar: z.string().trim().url("Avatar must be a valid URL").nullable(),
  accountValue: z.coerce.number().default(0),
  loginStreak: z.number().default(0),
  tradinStreak: z.number().default(0),
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

const authRequestSchema = z.object({
  identifier: z.string().trim(),
  password: z.string().trim(),
});

// Type exports
export { userSchema, createUserRequestSchema, authRequestSchema };
