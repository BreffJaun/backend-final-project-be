// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();

// I M P O R T:  F U N C T I O N S
import RatingModel from "../models/ratingModel.js";

// Get all ratings
const getRatings = async (req, res, next) => {
  try {
    const ratings = await RatingModel.find({});
  } catch (error) {
    next(error);
  }
};

// Add new Ratings
const addRating = async (req, res, next) => {
  try {
    const userId = req.cookies;
    console.log(userId);
    const newRating = await RatingModel.create(req.body);
    res.status(201).send(newRating);
  } catch (error) {
    next(error);
  }
};

// Delete Ratings
const deleteRating = async (req, res, next) => {
  try {
    res.json(await RatingModel.findByIdAndDelete(req.params.id));
  } catch (error) {
    next(error);
  }
};

// Update Ratings
const updateRating = async (req, res, next) => {
  try {
    res.json(
      await RatingModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

export { addRating, getRatings, deleteRating, updateRating };
