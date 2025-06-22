import mongoose from "mongoose";
import * as argon from "argon2";
import { User } from "../schemas/User.schema.js";

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
      minLength: [1, "minimum 1 character required"],
      maxLength: [30, "maximum 30 characters allowed"],
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
  },
  { timestamps: true }
);

//hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const hashedPassword = await argon.hash(this.password);
      this.password = hashedPassword;
    }
    this.updatedAt = new Date();
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
