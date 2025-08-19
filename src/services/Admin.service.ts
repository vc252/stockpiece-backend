import { getApiError } from "../common/HttpResponse.js";
import { mapAdminToAdminResponse } from "../common/mappings.js";
import { AdminAuthResponse, AdminJwtPayload } from "../types/commonTypes.js";
import Container from "../container/Container.js";
import AdminRepository from "../repositories/AdminRepository.js";
import {
  Admin,
  AdminResponse,
  CreateNonSuperAdminRequest,
} from "../types/adminTypes.js";
import { AuthRequest } from "../types/userTypes.js";
import { logger } from "../utils/logger.js";
import * as argon from "argon2";
import env from "../config/env.config.js";
import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { roles } from "../common/constants.js";
import { BaseService } from "./BaseService.js";

export default class AdminService extends BaseService {
  private readonly adminRepository: AdminRepository;

  constructor(container: Container) {
    super(container);
    this.adminRepository = this.resolve<AdminRepository>("AdminRepository");
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

  public readonly createAdmin = async (admin: CreateNonSuperAdminRequest) => {
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
    let admin;

    if (loginRequest.identifier.includes("@")) {
      //then it might be an email
      admin = await this.adminRepository.findByEmail(loginRequest.identifier);
    } else {
      admin = await this.adminRepository.findByUsername(
        loginRequest.identifier
      );
    }

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
      _id: admin._id.toString(),
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
