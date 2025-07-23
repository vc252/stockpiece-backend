import mongoose from "mongoose";
import adminModel from "../models/admin.model.js";
import {
  Admin,
  adminSchema,
  CreateAdminRequest,
} from "../schemas/Admin.schema.js";
import { parseDbResponseOrThrow } from "../utils/parseOrThrow.util.js";

export default class AdminRepository {
  public readonly createAdmin = async (
    admin: CreateAdminRequest
  ): Promise<Admin> => {
    const createdAdmin = await adminModel.create(admin);
    return parseDbResponseOrThrow<Admin>(adminSchema, createdAdmin.toObject());
  };

  public readonly superAdminExists = async (): Promise<{
    _id: mongoose.Types.ObjectId;
  } | null> => {
    return await adminModel.exists({
      isSuperAdmin: true,
    });
  };

  public readonly usernameOrEmailExists = async (
    username: string,
    email: string
  ): Promise<{
    _id: mongoose.Types.ObjectId;
  } | null> => {
    return await adminModel.exists({
      $or: [{ email }, { username }],
    });
  };

  public readonly findByUsername = async (
    username: string
  ): Promise<Admin | null> => {
    const admin = await adminModel
      .findOne({
        username,
      })
      .lean();

    return parseDbResponseOrThrow<Admin>(adminSchema, admin);
  };
}
