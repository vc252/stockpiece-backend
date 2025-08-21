import { z } from "zod";
import {
  userSchema,
  createUserRequestSchema,
  authRequestSchema,
} from "../schemas/UserSchema.js";
import mongoose, { Document } from "mongoose";

// Type exports
type User = z.infer<typeof userSchema>;
type CreateUserRequest = z.infer<typeof createUserRequestSchema>;
type AuthRequest = z.infer<typeof authRequestSchema>;
type UserResponse = Omit<User, "password" | "refreshToken" | "_id"> & {
  _id: string;
};
type UpdateAvatarResponse = Pick<
  UserResponse,
  "_id" | "username" | "email" | "avatar" | "updatedAt"
>;

interface UserDocument extends User, Document<mongoose.Types.ObjectId> {}

export {
  User,
  CreateUserRequest,
  AuthRequest,
  UserResponse,
  UpdateAvatarResponse,
  UserDocument,
};
