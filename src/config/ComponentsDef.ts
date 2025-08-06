import { Constructor } from "../common/types.common.js";
import AdminController from "../controllers/Admin.controller.js";
import UserController from "../controllers/User.controller.js";
import AdminRepository from "../repositories/admin.repositories.js";
import UserRepository from "../repositories/user.repositories.js";
import AdminService from "../services/Admin.service.js";
import FileUploadService from "../services/FileUploaderService.js";
import ImageProcessingService from "../services/ImageProcessingService.js";
import UserService from "../services/User.service.js";

export const ComponenetsDef: ComponentDefinition[] = [
  //services
  {
    name: "UserService",
    Class: UserService,
    options: ["UserRepository"],
  },
  {
    name: "AdminService",
    Class: AdminService,
    options: ["AdminRepository"],
  },
  {
    name: "ImageProcessingService",
    Class: ImageProcessingService,
    options: [],
  },
  {
    name: "FileUploadService",
    Class: FileUploadService,
    options: ["ImageProcessingService"],
  },
  //repositories
  {
    name: "UserRepository",
    Class: UserRepository,
    options: [],
  },
  {
    name: "AdminRepository",
    Class: AdminRepository,
    options: [],
  },
  //controllers
  {
    name: "UserController",
    Class: UserController,
    options: ["UserService"],
  },
  {
    name: "AdminController",
    Class: AdminController,
    options: ["AdminService"],
  },
] as const;

export type ComponentName =
  | "UserService"
  | "AdminService"
  | "ImageProcessingService"
  | "FileUploadService"
  | "UserRepository"
  | "AdminRepository"
  | "UserController"
  | "AdminController";

export interface ComponentDefinition {
  name: ComponentName;
  Class: Constructor<unknown>;
  options: ComponentName[];
}
