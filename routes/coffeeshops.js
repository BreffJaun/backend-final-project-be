// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import express from "express";

// I M P O R T:  F U N C T I O N S


// I M P O R T:  C O N T R O L L E R
import {
  addCoffeeshop,
  deleteCoffeeshop,
  updateCoffeeshop,
  getCoffeeshop,
} from "../controller/coffeeshopsController.js";

import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

// ========================

// C R E A T E   R O U T E S
const router = express.Router();

router
  .route("/")
    .get(getCoffeeshop)
    .post(auth, admin, addCoffeeshop);

router
  .route("/:id")
    .patch(auth, admin, updateCoffeeshop)
    .delete(auth, admin, deleteCoffeeshop);

export default router;
