import mongoose from "mongoose";
import { IUser } from "../common/interfaces/user";


const userSchema = new mongoose.Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  university: { type: String, required: true },
  password: { type: String },
  phone_number: { type: String, required: true },
  profile_pic: { public_id: { type: String }, url: { type: String } },
  profile_cover_pic: { public_id: { type: String }, url: { type: String } },
});

export const User = mongoose.model("User", userSchema)

const userVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    tier: { type: Number, default : 0 },
})

export const UserVerification = mongoose.model("UserVerification", userVerificationSchema);

// UserReputation
// - userId
// - averageRating
// - ratingCount
// - completedTasks