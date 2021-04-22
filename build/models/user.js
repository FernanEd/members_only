"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.model("User", UserSchema);
