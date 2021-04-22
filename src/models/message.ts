import { Schema, model, Types, Document } from "mongoose";
import { IUser } from "./user";

export interface IMessage extends Document {
  title: string;
  content: string;
  timestamp: Date;
  author: IUser["_id"];
}

const MessageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  author: { type: Types.ObjectId, ref: "User", required: true },
});

export default model<IMessage>("Message", MessageSchema);
