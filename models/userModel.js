// I M P O R T   D E P E N D E N C I E S
import mongoose, { Schema, model } from "mongoose";

// S C H E M A  -  D A T A   S T R U C T U R E
const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: false, unique: true },
    // with unique we check and go sure, that this email doesn`t already exists in the database
    myFavCoff: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isVerifiedTCP: { type: Boolean, default: false }, // TCP = To Change Password;
    friends: [{ type: Schema.Types.ObjectId, ref: "User", unique: true }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    topShops: [
      { type: Schema.Types.ObjectId, ref: "Coffeeshop", unique: true },
    ],
    visitedShops: [
      { type: Schema.Types.ObjectId, ref: "Coffeeshop", unique: true },
    ],
  }
);

// M O D E L - T E M P L A T E   F O R   D B   E N T R I E S
const UserModel = model("User", userSchema, "users");
export default UserModel;
