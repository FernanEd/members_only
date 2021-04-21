import { Schema, model, Types, Document } from "mongoose";

export interface IUser extends Document {
  name: {
    first: string;
    last: string;
  };
  username: string;
  password: string;
  membershipStatus: "noob" | "member";
  isAdmin?: boolean;
}

const UserSchema = new Schema({
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membershipStatus: {
    type: String,
    enum: ["noob", "member"],
    default: "noob",
  },
  isAdmin: { type: Boolean, default: false },
});

export default model<IUser>("User", UserSchema);
