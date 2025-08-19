import mongoose from "mongoose";
import { Admin } from "../types/adminTypes.js";
import { permissions } from "../common/constants.js";
import * as argon from "argon2";

const adminSchema = new mongoose.Schema<Admin>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [1, "minimum 1 character required"],
      maxLength: [30, "maximum 30 characters allowed"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },
    permissions: {
      type: [String],
      enum: Object.values(permissions),
      validate: {
        validator: function (arr: string[]) {
          return Array.isArray(arr) && new Set(arr).size === arr.length;
        },
        message: "Permission already granted",
      },
      default: [],
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    const hashedPassword = await argon.hash(this.password);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

const adminModel = mongoose.model("Admin", adminSchema);

export default adminModel;
