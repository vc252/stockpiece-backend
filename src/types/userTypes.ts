import { z } from "zod";
import {
  userSchema,
  createUserRequestSchema,
  authRequestSchema,
} from "../schemas/User.schema.js";

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

export {
  User,
  CreateUserRequest,
  AuthRequest,
  UserResponse,
  UpdateAvatarResponse,
};
