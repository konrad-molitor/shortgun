import mongoose, { Document, Schema } from "mongoose";

const MessageSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    user: {
        type: String,
    },
});

export interface IMessage extends Document {
    email: string;
    message: string;
    user?: string;
}

export default mongoose.model<IMessage>("Message", MessageSchema);
