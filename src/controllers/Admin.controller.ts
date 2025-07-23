import { Request, Response, NextFunction } from "express";
import { AdminAuthResponse, AdminJwtPayload } from "../common/types.common.js";
import Container from "../container/Container.js";
import AdminService from "../services/Admin.service.js";
import { ApiResponse } from "../common/ApiResponse.js";
import { AdminResponse } from "../schemas/Admin.schema.js";
import { HttpSuccess } from "../common/HttpResponse.js";
import { crossSiteSafeCookieOptions } from "../config/cookie.config.js";
import { AuthRequest } from "../schemas/User.schema.js";

export default class AdminController {
  private readonly adminService: AdminService;

  constructor(container: Container) {
    this.adminService = container.resolve<AdminService>("AdminService");
  }

  public readonly createAdmin = async (
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> => {
    const createdAdmin = await this.adminService.createAdmin(
      req.body,
      req.payload as AdminJwtPayload
    );

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
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> => {
    const loginRequest: AuthRequest = req.body;
    const authResponse: AdminAuthResponse =
      await this.adminService.loginAdmin(loginRequest);

    res
      .status(HttpSuccess.LOGGED_IN.statusCode)
      .cookie(
        "accessToken",
        authResponse.accessToken,
        crossSiteSafeCookieOptions
      )
      .json(
        new ApiResponse<{ accessToken: string }>(
          HttpSuccess.LOGGED_IN.statusCode,
          HttpSuccess.LOGGED_IN.message,
          authResponse
        )
      );
  };
}
