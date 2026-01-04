import mongoose, { Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  createAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword: () => Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return compareValue(password, this.password);
};
const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
