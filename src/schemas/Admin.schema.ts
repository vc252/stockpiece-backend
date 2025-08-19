import { z } from "zod";
import { permissions } from "../common/constants.js";
import mongoose from "mongoose";
import { booleanSchema } from "./common.schema.js";

const permissionSchema = z.enum(
  Object.values(permissions) as [string, ...string[]]
);

const adminSchema = z.object({
  _id: z.instanceof(mongoose.Types.ObjectId),
  username: z
    .string()
    .trim()
    .min(1, "minimum 1 character required")
    .max(30, "maximum 30 characters allowed"),
  email: z.string().email(),
  password: z.string().trim(),
  permissions: z.array(permissionSchema),
  isSuperAdmin: booleanSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const creatNonSuperAdminRequestSchema = adminSchema
  .pick(
    {
      username: true,
      email: true,
      permissions: true,
    }
    //we want to put this condition on the password req not while storing
  )
  .extend({
    password: z
      .string()
      .trim()
      .min(3, "minimum 3 character required")
      .max(30, "maximum 30 characters allowed"),
  });

export { adminSchema, creatNonSuperAdminRequestSchema };
