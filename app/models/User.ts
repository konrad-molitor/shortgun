import mongoose, { Schema, Document, SchemaTypes } from "mongoose";
import bcrypt from "bcrypt";
import { Function } from "@babel/types";
import { ObjectID } from "bson";

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
  urls: [{
    ref: "Shortcut",
    type: ObjectID,
  }],
});

UserSchema.pre<IUser>("save", async function (next) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (err) {
      next(err);
    }
});

UserSchema.methods.compare = async function(passwordCandidate: string): Promise<boolean> {
  try {
    return await bcrypt.compare(passwordCandidate, this.password);
  } catch (err) {
    return false;
  }
};

UserSchema.methods.addUrl = async function(shortcutId: mongoose.Types.ObjectId): Promise<mongoose.Document> {
  try {
    this.urls.push(shortcutId);
    return await this.save();
  } catch (e) {
    return e;
  }
};

UserSchema.methods.removeUrl = async function(shortcutId: mongoose.Types.ObjectId): Promise<boolean> {
  try {
    this.urls = this.urls.filter((urlId: mongoose.Types.ObjectId) => !urlId.equals(shortcutId));
    await this.save();
    return true;
  } catch (e) {
    return false;
  }
};

export default mongoose.model<IUser>("User", UserSchema);

export interface IUser extends Document {
  email: string;
  password: string;
  urls: mongoose.Types.ObjectId[];
  compare(passwordCandidate: string): Promise<boolean>;
  addUrl(shortcutId: mongoose.Types.ObjectId): Promise<mongoose.Document>;
  removeUrl(shortcutId: mongoose.Types.ObjectId): Promise<boolean>;
}
