import { getApiError } from "../common/HttpResponse.js";
import { mapAdminToAdminResponse } from "../common/mappings.common.js";
import { AdminAuthResponse, AdminJwtPayload } from "../common/types.common.js";
import Container from "../container/Container.js";
import AdminRepository from "../repositories/admin.repositories.js";
import {
  Admin,
  AdminResponse,
  CreateNonSuperAdminRequest,
} from "../schemas/Admin.schema";
import { AuthRequest } from "../schemas/User.schema.js";
import { logger } from "../utils/logger.js";
import * as argon from "argon2";
import env from "../config/env.config.js";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { roles } from "../common/constants.common.js";

export default class AdminService {
  private readonly adminRepository: AdminRepository;

  constructor(container: Container) {
    this.adminRepository =
      container.resolve<AdminRepository>("AdminRepository");
  }

  //this function won't be used by an Api
  public readonly createSuperAdmin = async (
    admin: CreateNonSuperAdminRequest
  ): Promise<boolean> => {
    const superAdminExists = await this.adminRepository.superAdminExists();

    if (superAdminExists) {
      return false;
    }

    await this.adminRepository.createAdmin({
      ...admin,
      isSuperAdmin: true,
    });
    return true;
  };

  public readonly createAdmin = async (
    admin: CreateNonSuperAdminRequest,
    payload: AdminJwtPayload
  ) => {
    if (!payload?.isSuperAdmin) {
      throw getApiError("FORBIDDEN");
    }

    if (
      !this.adminRepository.usernameOrEmailExists(admin.username, admin.email)
    ) {
      throw getApiError("CONFLICT");
    }

    const createdAdmin = await this.adminRepository.createAdmin(admin);
    const adminResponse: AdminResponse = mapAdminToAdminResponse(createdAdmin);

    logger.notice(`admin created: `, adminResponse);

    return adminResponse;
  };

  public readonly loginAdmin = async (
    loginRequest: AuthRequest
  ): Promise<AdminAuthResponse> => {
    const admin = await this.adminRepository.findByUsername(
      loginRequest.username
    );

    if (!admin) {
      throw getApiError("INVALID_CREDENTIALS");
    }

    if (!(await argon.verify(admin.password, loginRequest.password))) {
      throw getApiError("INVALID_CREDENTIALS");
    }

    return {
      accessToken: this.getAdminAccessToken(admin),
    };
  };

  private readonly getAdminAccessToken = (admin: Admin): string => {
    const payload: AdminJwtPayload = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
      permissions: admin.permissions || [],
      role: roles.ADMIN,
      isSuperAdmin: admin.isSuperAdmin,
    };

    const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
      expiresIn: env.ADMIN_ACCESS_TOKEN_EXPIRY as StringValue,
    });

    return accessToken;
  };
}
