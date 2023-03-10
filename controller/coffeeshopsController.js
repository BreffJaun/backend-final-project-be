// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();
import CoffeeShopModel from "../models/coffeeshopsModel.js";
import UserModel from "../models/userModel.js";

// import bcrypt from 'bcrypt';
// import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import CoffeeshopModel from "../models/coffeeshopsModel.js";

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue";
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

//========================

// Get all Coffeeshops
const getCoffeeshops = async (req, res, next) => {
  try {
    const coffeeshops = await CoffeeshopModel.find();
    res.status(201).json(coffeeshops);
  } catch (error) {
    next(error);
  }
};

// Get ONE Coffeeshop
const getCoffeeshop = async (req, res, next) => {
  try {
    const shopId = req.params.id;
    const coffeeshop = await CoffeeshopModel.findById(shopId).populate([
      "comments",
      "rating",
    ]);
    res.status(200).json(coffeeshop);
  } catch (error) {
    next(error);
  }
};

// Add new Coffeeshops
const addCoffeeshop = async (req, res, next) => {
  try {
    const newCoffeeshop = await CoffeeshopModel.create(req.body);
    res.status(201).send(newCoffeeshop);
  } catch (error) {
    next(error);
  }
};

// Delete Coffeeshops
const deleteCoffeeshop = async (req, res, next) => {
  try {
    res.json(await CoffeeshopModel.findByIdAndDelete(req.params.id));
  } catch (error) {
    next(error);
  }
};

// Update Coffeeshops
const updateCoffeeshop = async (req, res, next) => {
  try {
    res.json(
      await CoffeeshopModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
    );
  } catch (error) {
    next(error);
  }
};

// ADD TOP SHOPS
const addFavShop = async (req, res, next) => {
  try {
    const userId = req.body.userId
    const shopId = req.params.shopid
    const user = await UserModel.findById(userId);
    const shopInUser = user.topShops.find(shop => shop._id.toString() === shopId.toString());
    if (!shopInUser) {
      const currShop = await UserModel.findByIdAndUpdate(userId, {
        $push: {topShops: shopId}
      });
      res.status(201).json({message: 'Shop ADDED to favourites'})
    } else {
      res.status(400).json({message: 'Is already a TOP SHOP!'})
    }
  } catch (error) {
    next(error);
  }
};

// DELETE FAVSHOP
const deleteFavShop = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const shopId = req.params.shopid;
    const currShop = await UserModel.findByIdAndUpdate(userId, {
      $pull: { topShops: shopId },
    });
    res.status(201).json({ message: "Shop DELETED from favourites" });
  } catch (error) {
    next(error);
  }
};

export {
  addCoffeeshop,
  getCoffeeshops,
  deleteCoffeeshop,
  updateCoffeeshop,
  addFavShop,
  deleteFavShop,
  getCoffeeshop,
};
