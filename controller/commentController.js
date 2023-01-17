// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import CommentModel from "../models/commentModel.js";
import UserModel from "../models/userModel.js";
import CoffeeShopModel from "../models/coffeeshopsModel.js";

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue";

// Get all comments
const getComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.find({});
  } catch (error) {
    next(error);
  }
};

// Add new Comments
const addComment = async (req, res, next) => {
  try {
    // TAKE USERID
    const token = req.cookies.loginCookie;
    const tokenDecoded = jwt.verify(token, JWT_KEY);
    const userId = tokenDecoded.userId;

    // TAKE COFFESHOPID
    const coffeeShopId = req.body.shopId;

    // COMMENT
    const comment = req.body.comment;
    console.log(comment, coffeeShopId, userId);
    const newComment = await CommentModel.create({
      userId: userId,
      coffeeShopId: coffeeShopId,
      comment: comment,
    });
    const pushInCoffeshop = await CoffeeShopModel.findByIdAndUpdate(
      coffeeShopId ,
      { $push: { comments: newComment._id } }
    );
    const pushInUser = await UserModel.findByIdAndUpdate(
      userId ,
      { $push: { comments: newComment._id } }
    );
    res.status(201).send(newComment);
  } catch (error) {
    next(error);
  }
};

// Delete Comments
const deleteComment = async (req, res, next) => {
  try {
    res.json(await CommentModel.findByIdAndDelete(req.params.id));
  } catch (error) {
    next(error);
  }
};

// Update Comments
const updateComment = async (req, res, next) => {
  try {
    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    const pushInCoffeshop = await CoffeeShopModel.findByIdAndUpdate(
      { coffeeShopId },
      { $push: { comments: updatedComment } }
    );
    const pushInUser = await UserModel.findByIdAndUpdate(
      { userId },
      { $push: { comments: updatedComment } }
    );
    res.json(updateComment);
  } catch (error) {
    next(error);
  }
};

export { addComment, getComments, deleteComment, updateComment };
