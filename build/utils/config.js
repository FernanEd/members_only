"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MONGODB_URI = process.env.MONGODB_URI || "";
var PORT = process.env.PORT || 4001;
var SESSION_SECRET = process.env.SESSION_SECRET || "lol";
var MEMBER_CODE = process.env.MEMBER_CODE || "";
exports.default = {
    MONGODB_URI: MONGODB_URI,
    PORT: PORT,
    SESSION_SECRET: SESSION_SECRET,
    MEMBER_CODE: MEMBER_CODE,
};
