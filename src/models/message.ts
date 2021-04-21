import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./user";

export interface IMessage extends Document {
  title: string;
  timestamp: Date;
  author: IUser["_id"];
}

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: Types.ObjectId, ref: "User" },
});

export default model<IMessage>("User", MessageSchema);
