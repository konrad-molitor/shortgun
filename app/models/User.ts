import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { Function } from "@babel/types";

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre<IUser>("save", async function (next) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      next(err);
    }
});

UserSchema.methods.compare = async function (passwordCandidate: string): Promise<boolean> {
  try {
    return await bcrypt.compare(passwordCandidate, this.password);
  } catch (err) {
    return false;
  }
};

export default mongoose.model<IUser>("User", UserSchema);

export interface IUser extends Document {
  email: string;
  password: string;
  compare(passwordCandidate: string): Promise<boolean>;
}
