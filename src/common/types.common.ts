import { Request, Response, NextFunction } from "express";
import UserRepository from "../repositories/user.repositories.js";
import UserService from "../services/User.service.js";
import CommonRoutesConfig from "../config/common.routes.config.js";
import Container from "../container/Container.js";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

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

type UserAuthResponse = {
  accessToken: string;
  refreshToken: string;
};

type AdminAuthResponse = {
  accessToken: string;
};

interface RouterOptions {
  name: string;
  basePath: string;
}

// _id: user._id,
// username: user.username,
// avatar: user.avatar,
// lastLogin: user.lastLogin,
// createdAt: user.createdAt,

interface UserJwtPayload extends JwtPayload {
  _id: mongoose.Types.ObjectId;
  username: string;
  avatar: string | null;
  email: string;
  lastLogin: Date | null;
  role: string;
}

interface AdminJwtPayload extends JwtPayload {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  permissions: string[];
  role: string;
  isSuperAdmin: boolean;
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
  UserAuthResponse,
  UserJwtPayload,
  AdminJwtPayload,
  AdminAuthResponse,
};
