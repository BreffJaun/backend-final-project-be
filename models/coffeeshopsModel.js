// I M P O R T   D E P E N D E N C I E S
import mongoose, { Schema, model } from "mongoose";

// S C H E M A  -  D A T A   S T R U C T U R E
const coffeeShopSchema = new Schema(
  {
    name: { type: String, required: true },
    img_url: String,
    location: {
      address: {
        street: { type: String, required: true },
        number: { type: String, required: true },
        zip: { type: String, required: true },
        city: { type: String, required: true },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
      },
    },
    services: {
      has_sockets: Boolean,
      has_wifi: Boolean,
      has_toilet: Boolean,
      can_take_calls: Boolean,
    },
    seats: Number,
    espresso_price: String,
    rating: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { strictQuery: true }
);

// M O D E L - T E M P L A T E   F O R   D B   E N T R I E S
const CoffeeShopModel = model("Coffeeshop", coffeeShopSchema, "coffeeshops");
export default CoffeeShopModel;
