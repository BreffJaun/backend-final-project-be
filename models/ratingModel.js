// I M P O R T   D E P E N D E N C I E S
import { Schema, model } from "mongoose";

// S C H E M A  -  D A T A   S T R U C T U R E
const ratingSchema = new Schema(
  {
    userId: String,
    coffeeShopId: String,
    rating: { type: Number, required: true },
  },
  { timestamps: true }
);

// M O D E L - T E M P L A T E   F O R   D B   E N T R I E S
const RatingModel = model("Rating", ratingSchema, "ratings");
export default RatingModel;
