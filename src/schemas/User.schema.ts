import { z } from "zod";

const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "minimum 1 character required")
    .max(30, "maximum 30 characters allowed"),
  password: z
    .string()
    .min(1, "minimum 1 character required")
    .max(30, "maximum 30 characters allowed"),
  email: z.string().email(),
});

const userSchema = createUserSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

const userResponseSchema = userSchema.omit({ password: true });

type User = z.infer<typeof userSchema>;
type CreateUserInput = z.infer<typeof createUserSchema>;
type UserResponse = z.infer<typeof userResponseSchema>;

export {
  User,
  userSchema,
  createUserSchema,
  CreateUserInput,
  userResponseSchema,
  UserResponse,
};
