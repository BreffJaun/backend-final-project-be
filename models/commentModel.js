// I M P O R T   D E P E N D E N C I E S
import mongoose, {Schema, model} from "mongoose";

// S C H E M A  -  D A T A   S T R U C T U R E
const commentSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: false, unique: true},
  // with unique we check and go sure, that this email doesn`t already exists in the database
  password: {type: String, required: true},
  avatar: {type: String},
  isAdmin: {type: Boolean, default: false},
  isVerified: {type: Boolean, default: false},
  isVerifiedTCP: {type: Boolean, default: false}  // TCP = To Change Password;
}
, 
{strictQuery: true});

// M O D E L - T E M P L A T E   F O R   D B   E N T R I E S
const CommentModel = model('Comment', commentSchema, 'comments');
export default CommentModel;