// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import RatingModel from "../models/ratingModel.js";

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y 
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue"

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
    // TAKE USERID
    const token = req.cookies.loginCookie;
    const tokenDecoded = jwt.verify(token, JWT_KEY);
    const userId = tokenDecoded.userId;

    // TAKE COFFESHOPID
    const coffeeShopId = req.body.shopid;

    // RATING
    const rating = req.body.rating;  

    const newRating = await RatingModel.create({
      userId: userId,
      coffeeShopId: coffeeShopId,
      rating: rating
    });
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
