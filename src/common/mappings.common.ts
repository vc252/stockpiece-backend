import { User, UserResponse } from "../schemas/User.schema.js";

/**
 * Maps a User object to a UserResponse object by:
 * - Converting _id from ObjectId to string
 * - Removing sensitive fields like hashedPassword
 */
export function mapUserToUserResponse(user: User): UserResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userFields } = user;

  return {
    ...userFields,
    _id: user._id.toString(),
  };
}
