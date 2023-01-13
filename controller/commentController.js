// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();

// I M P O R T:  F U N C T I O N S
import CommentModel from "../models/commentModel.js";

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
    const userId = req.cookies;
    console.log(userId);
    const newComment = await CommentModel.create(req.body);
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
    res.json(
      await CommentModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export { addComment, getComments, deleteComment, updateComment };
