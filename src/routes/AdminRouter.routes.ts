import CommonRoutesConfig from "../config/common.routes.config.js";
import { creatNonSuperAdminRequestSchema } from "../schemas/Admin.schema.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import validate from "../middlewares/validation.middleware.js";
import {
  verifyAdminJwt,
  checkSuperAdmin,
} from "../middlewares/auth.middleware.js";
import Container from "../container/Container.js";
import AdminController from "../controllers/AdminController.js";
import { authRequestSchema } from "../schemas/User.schema.js";

export default class AdminRouter extends CommonRoutesConfig {
  private readonly adminController: AdminController;

  constructor(name: string, basePath: string, container: Container) {
    super(name, basePath, container);

    this.adminController = this.resolve<AdminController>("AdminController");
  }

  public configurRoutes(): void {
    // Create admin route - requires super admin privileges
    this.router
      .route("/")
      .post(
        validate(creatNonSuperAdminRequestSchema),
        verifyAdminJwt,
        checkSuperAdmin,
        asyncHandler(this.adminController.createAdmin)
      );

    this.router
      .route("/login")
      .post(
        validate(authRequestSchema),
        asyncHandler(this.adminController.loginAdmin)
      );
  }
}
