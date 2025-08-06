import { NextFunction, Request, Response } from "express";
import { getApiError } from "../common/HttpResponse.js";
import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { UserJwtPayload, AdminJwtPayload } from "../common/types.common.js";
import { logger } from "../utils/logger.js";

const verifyUserJwt = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    throw getApiError("ACCESS_TOKEN_MISSING");
  }

  try {
    const payload = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    req.payload = payload as UserJwtPayload;
    next();
  } catch (err) {
    throw getApiError("INVALID_ACCESS_TOKEN", err);
  }
};

const verifyAdminJwt = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!accessToken) {
    throw getApiError("ACCESS_TOKEN_MISSING");
  }

  try {
    const payload = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
    req.payload = payload as AdminJwtPayload;
    next();
  } catch (err) {
    throw getApiError("INVALID_ACCESS_TOKEN", err);
  }
};

const checkPermissions = (requiredPermissions: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.payload) {
      throw getApiError("UNAUTHORIZED");
    }

    const hasPermissions = requiredPermissions.every((permission) => {
      return req.payload?.permissions.includes(permission);
    });

    if (!hasPermissions) {
      throw getApiError("FORBIDDEN");
    }

    next();
  };
};

const checkSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.debug("payload: ", req.payload);
  if (!req.payload) {
    throw getApiError("UNAUTHORIZED");
  }

  if (!req.payload.isSuperAdmin) {
    throw getApiError("FORBIDDEN");
  }

  next();
};

export { verifyUserJwt, verifyAdminJwt, checkPermissions, checkSuperAdmin };
