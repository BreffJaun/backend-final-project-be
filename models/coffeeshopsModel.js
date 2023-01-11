// I M P O R T   D E P E N D E N C I E S
import { Schema, model } from "mongoose";

// S C H E M A  -  D A T A   S T R U C T U R E
const coffeeShopSchema = new Schema({
  name: { type: String, required: true },
  longitude: String,
  latitude: String,
  img_url: String,
  // location: { type: String, required: true }, // City? oder Long- & Latitude?
  has_sockets: Boolean,
  has_wifi: Boolean,
  has_toilet: Boolean,
  can_take_calls: Boolean,
  seats: Number,
  espresso_price: String,
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 5,
  },
  comments: [String],
}
,
{strictQuery: true}
);

// M O D E L - T E M P L A T E   F O R   D B   E N T R I E S
const CoffeeShopModel = model("coffeeshop", coffeeShopSchema, "coffeeshops");
export default CoffeeShopModel;
