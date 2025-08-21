import mongoose from "mongoose";
import { UserDocument } from "../types/userTypes.js";
import * as argon from "argon2";

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      minlength: [1, "minimum 1 character required"],
      maxLength: [30, "maximum 30 characters allowed"],
      match: [
        /^[A-Za-z0-9._]+$/,
        "Only letters, numbers, dot and underscore allowed",
      ],
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
    isVerified: {
      type: Boolean,
      default: false,
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
      default: "default",
    },
    accountValue: {
      type: Number,
      default: 0,
    },
    loginStreak: {
      type: Number,
      default: 0,
    },
    tradinStreak: {
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
      return next();
    }

    const hashedPassword = await argon.hash(this.password);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
