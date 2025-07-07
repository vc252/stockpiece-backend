import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user.repositories.js";
import UserService from "../services/User.service.js";
import CommonRoutesConfig from "../config/common.routes.config.js";
import Container from "../container/Container.js";

type keyValueObject = {
  [key: string]: string | number;
};

type Controller = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

type UserRepositoryType = typeof UserRepository;

type UserServiceType = typeof UserService;

type RouterDefType = {
  name: string;
  basePath: string;
  RouterClass: new (
    name: string,
    basePath: string,
    routerOptions: keyValueObject
  ) => CommonRoutesConfig;
  routerOptions: keyValueObject;
}[];

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

interface RouterOptions {
  name: string;
  basePath: string;
}

//if we don't use the generic type then we would have
//narrow the type later on using if conditions
//while in case of any we do whatever we want
type Constructor<T> = new (cotainer: Container) => T;

export {
  keyValueObject,
  Controller,
  UserRepositoryType,
  UserService,
  UserServiceType,
  RouterOptions,
  RouterDefType,
  Constructor,
  AuthResponse,
};
