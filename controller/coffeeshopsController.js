// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();
// import bcrypt from 'bcrypt';
// import jwt from "jsonwebtoken";

// I M P O R T:  F U N C T I O N S
import CoffeeshopModel from "../models/coffeeshopsModel.js";

// I M P O R T  &  D E C L A R E   B C R Y P T   K E Y
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue";
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;

//========================

// Get all Coffeeshops
const getCoffeeshop = async (req, res, next) => {
  try {
    const coffeeshops = await CoffeeshopModel.find();
    res.json(coffeeshops);
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

export { addCoffeeshop, getCoffeeshop, deleteCoffeeshop, updateCoffeeshop };
