import mongoose from "mongoose";
import { User } from "../schemas/User.schema.js";
import * as argon from "argon2";
import { logger } from "../utils/logger.js";

const userSchema = new mongoose.Schema<User>(
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
    refreshToken: {
      type: String,
      default: null,
    },
    hasUsedReferral: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    accountValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      logger.debug("password not modified");
      return next();
    }

    const hashedPassword = await argon.hash(this.password);
    logger.debug(`password modified: ${hashedPassword}`);
    this.password = hashedPassword;
    this.updatedAt = new Date();
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
