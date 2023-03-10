// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import express from "express";
import multer from "multer";

// I M P O R T:  F U N C T I O N S
import { validateRequest } from "../middleware/validator.js";
import {
  userValidator,
  userUpdateValidator,
} from "../middleware/userValidator.js";

// I M P O R T:  C O N T R O L L E R
import {
  usersGetAll,
  usersPostUser,
  usersGetSpecific,
  usersPatchSpecific,
  usersDeleteSpecific,
  usersPostLogin,
  usersGetLogout,
  usersChecklogin,
  verifyEmail,
  forgotPassword,
  setNewPassword,
  addFriend,
  deleteFriend,
  verifyResetToken
} from "../controller/usersController.js";

import { auth } from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

// ========================

// D E F I N E   M U L T E R   I N S T A N C E
const upload = multer({ dest: "uploads/" });

// C R E A T E   R O U T E S
const router = express.Router();

router
  .route("/")
  .get(auth, usersGetAll)
  .post(upload.single("avatar"), userValidator, validateRequest, usersPostUser);

router.route("/verify/:token").get(verifyEmail);

router.route("/login").post(usersPostLogin);

router.route("/logout").get(usersGetLogout);

router.route("/checklogin").get(usersChecklogin);

router.route("/friends").patch(auth, addFriend).delete(auth, deleteFriend);

router.route("/forgotpassword").post(forgotPassword);

router.route("/reset/:token").get(verifyResetToken);

router.route("/setnewpassword").post(setNewPassword);

router
  .route("/:id")
  .get(auth, usersGetSpecific)
  .patch(userUpdateValidator, validateRequest, auth, usersPatchSpecific)
  .delete(auth, usersDeleteSpecific);

export default router;
