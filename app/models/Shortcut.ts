import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

const ShortcutSchema = new Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortUrl: {
    type: String,
    unique: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  preview: {
    type: String,
  },
  pageTitle: {
    type: String,
  },
});

export interface IShortcut extends Document {
  longUrl: string;
  shortUrl: string;
  author: IUser["_id"];
  preview?: string;
  pageTitle?: string;
}

export default mongoose.model<IShortcut>("Shortcut", ShortcutSchema);
