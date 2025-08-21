import Container from "../container/Container.js";
import FileUploadService from "../services/FileUploaderService.js";
import { Admin, AdminResponse } from "../types/AdminTypes.js";
import { User, UserResponse } from "../types/userTypes.js";

/**
 * Maps a User object to a UserResponse object by:
 * - Converting _id from ObjectId to string
 * - Removing sensitive fields like hashedPassword
 */
function mapUserToUserResponse(user: User): UserResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...userFields } = user;

  //provide the default avatar url
  if (userFields.avatar === "default") {
    userFields.avatar = Container.getInstance()
      .resolve<FileUploadService>("FileUploadService")
      .getDefaultAvatarUrl();
  }

  return {
    ...userFields,
    _id: user._id.toString(),
  };
}

function mapAdminToAdminResponse(admin: Admin): AdminResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...adminFields } = admin;

  return {
    ...adminFields,
    _id: admin._id.toString(),
  };
}

export { mapUserToUserResponse, mapAdminToAdminResponse };
