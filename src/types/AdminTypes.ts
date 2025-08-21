import { z } from "zod";
import {
  adminSchema,
  creatNonSuperAdminRequestSchema,
} from "../schemas/AdminSchema.js";
import mongoose, { Document } from "mongoose";

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

interface AdminDocument extends Admin, Document<mongoose.Types.ObjectId> {}

export {
  Admin,
  CreateNonSuperAdminRequest,
  CreateAdminRequest,
  AdminResponse,
  AdminDocument,
};
