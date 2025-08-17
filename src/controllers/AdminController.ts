import { Request, Response, NextFunction } from "express";
import { AdminAuthResponse } from "../common/types.common.js";
import Container from "../container/Container.js";
import AdminService from "../services/Admin.service.js";
import { ApiResponse } from "../common/ApiResponse.js";
import {
  AdminResponse,
  CreateNonSuperAdminRequest,
} from "../schemas/Admin.schema.js";
import { HttpSuccess } from "../common/HttpResponse.js";
import { crossSiteSafeCookieOptions } from "../config/cookie.config.js";
import { AuthRequest } from "../schemas/User.schema.js";
import { BaseController } from "./BaseController.js";

export default class AdminController extends BaseController {
  private readonly adminService: AdminService;

  constructor(container: Container) {
    super(container);
    this.adminService = this.resolve<AdminService>("AdminService");
  }

  public readonly createAdmin = async (
    req: Request<object, object, CreateNonSuperAdminRequest>,
    res: Response<ApiResponse<AdminResponse>>,
    _: NextFunction
  ): Promise<void> => {
    const createdAdmin = await this.adminService.createAdmin(req.body);

    res
      .status(200)
      .json(
        new ApiResponse<AdminResponse>(
          HttpSuccess.ADMIN_CREATED.statusCode,
          HttpSuccess.ADMIN_CREATED.message,
          createdAdmin
        )
      );
  };

  public readonly loginAdmin = async (
    req: Request<object, object, AuthRequest>,
    res: Response,
    _: NextFunction
  ): Promise<void> => {
    const loginRequest = req.body;
    const authResponse = await this.adminService.loginAdmin(loginRequest);

    res
      .status(HttpSuccess.LOGGED_IN.statusCode)
      .cookie(
        "accessToken",
        authResponse.accessToken,
        crossSiteSafeCookieOptions
      )
      .json(
        new ApiResponse<AdminAuthResponse>(
          HttpSuccess.LOGGED_IN.statusCode,
          HttpSuccess.LOGGED_IN.message,
          authResponse
        )
      );
  };
}
