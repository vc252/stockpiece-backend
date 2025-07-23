import AdminController from "../controllers/Admin.controller.js";
import UserController from "../controllers/User.controller.js";
import AdminRepository from "../repositories/admin.repositories.js";
import UserRepository from "../repositories/user.repositories.js";
import AdminService from "../services/Admin.service.js";
import UserService from "../services/User.service.js";

export const ComponenetsDef = [
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
];
