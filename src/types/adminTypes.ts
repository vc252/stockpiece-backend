import { z } from "zod";
import {
  adminSchema,
  creatNonSuperAdminRequestSchema,
} from "../schemas/Admin.schema.js";

type Admin = z.infer<typeof adminSchema>;
type CreateNonSuperAdminRequest = z.infer<
  typeof creatNonSuperAdminRequestSchema
>;
type CreateAdminRequest = CreateNonSuperAdminRequest & {
  isSuperAdmin?: boolean;
};
type AdminResponse = Omit<Admin, "password" | "_id"> & {
  _id: string;
};

export { Admin, CreateNonSuperAdminRequest, CreateAdminRequest, AdminResponse };
