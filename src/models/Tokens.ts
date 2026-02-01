import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: { expires: 0}}
}, { timestamps: true })

export const Token = mongoose.model("Token", tokenSchema)