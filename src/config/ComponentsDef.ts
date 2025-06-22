import UserController from "../controllers/User.controller.js";
import UserRepository from "../repositories/user.repositories.js";
import UserService from "../services/User.service.js";

export const ComponenetsDef = [
  //services
  {
    name: "userService",
    Class: UserService,
    options: ["userRepository"],
  },
  //repositories
  {
    name: "userRepository",
    Class: UserRepository,
    options: [],
  },
  //controllers
  {
    name: "userController",
    Class: UserController,
    options: ["userService"],
  },
];
