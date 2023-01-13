// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import express from "express";

// I M P O R T:  C O N T R O L L E R
import {
  addRating,
  getRatings,
  deleteRating,
  updateRating,
} from "../controller/ratingController.js";

import { auth } from "../middleware/auth.js";

// C R E A T E   R O U T E S
const router = express.Router();

router.route("/").get(getRatings).post(addRating);

router.route("/:id").patch(auth, updateRating).delete(auth, deleteRating);

export default router;
