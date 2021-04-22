"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MessageSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    author: { type: mongoose_1.Types.ObjectId, ref: "User", required: true },
});
exports.default = mongoose_1.model("Message", MessageSchema);
