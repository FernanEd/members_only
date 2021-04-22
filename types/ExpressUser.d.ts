import { IUser } from "../src/models/user";
declare global {
  declare namespace Express {
    export interface User {
      id: string;
    }
  }
}
