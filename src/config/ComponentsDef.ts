import { Constructor } from "../common/types.common.js";
import AdminController from "../controllers/AdminController.js";
import StockController from "../controllers/StockController.js";
import UserController from "../controllers/UserController.js";
import AdminRepository from "../repositories/admin.repositories.js";
import StockRepository from "../repositories/StockRepository.js";
import UserRepository from "../repositories/user.repositories.js";
import AdminService from "../services/Admin.service.js";
import FileUploadService from "../services/FileUploaderService.js";
import ImageProcessingService from "../services/ImageProcessingService.js";
import StockService from "../services/StockService.js";
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
  {
    name: "StockService",
    Class: StockService,
    options: ["StockRepository"],
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
  {
    name: "StockRepository",
    Class: StockRepository,
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
  {
    name: "StockController",
    Class: StockController,
    options: ["StockService"],
  },
] as const;

export type ComponentName =
  | "UserService"
  | "AdminService"
  | "ImageProcessingService"
  | "FileUploadService"
  | "StockService"
  | "UserRepository"
  | "AdminRepository"
  | "StockRepository"
  | "UserController"
  | "StockController"
  | "AdminController";

export interface ComponentDefinition {
  name: ComponentName;
  Class: Constructor<unknown>;
  options: ComponentName[];
}
