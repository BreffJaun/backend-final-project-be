// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

// I M P O R T:  F U N C T I O N S
import UserModel from "../models/userModel.js";
import { JSONCookie } from "cookie-parser";
import { json } from "express";

// I M P O R T  &  D E C L A R E   K E Y S
const JWT_KEY = process.env.SECRET_JWT_KEY || "DefaultValue";
const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_EMAIL = process.env.SENDGRID_EMAIL;
const BE_HOST = process.env.BE_HOST;
const FE_HOST = process.env.FE_HOST;

//========================

// GET List of all users
export async function usersGetAll(req, res, next) {
  try {
    res.json(await UserModel.find().populate(["friends", "comments"]));
  } catch (err) {
    next(err);
  }
}

// POST (Add) a new User
export async function usersPostUser(req, res, next) {
  try {
    const newUser = req.body;
    // in the UserModel we check if the given email-address is unique
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const createdUser = await UserModel.create({
      ...newUser,
      password: hashedPassword,
    });

    // AVATAR IMPLEMENT BEGIN //
    if (req.file) {
      await UserModel.findByIdAndUpdate(createdUser._id, {
        avatar: `${BE_HOST}/${req.file.path}`,
      });
    } else {
      await UserModel.findByIdAndUpdate(createdUser._id, {
        avatar: `${BE_HOST}/assets/images/coffypaste_icon_avatar.png`,
      });
    }
    // AVATAR IMPLEMENT END //

    // VERIFY EMAIL IMPLEMENT BEGIN //
    sgMail.setApiKey(SENDGRID_KEY);
    const verifyToken = jwt.sign(
      { email: newUser.email, _id: createdUser._id },
      JWT_KEY,
      { expiresIn: "1h" }
    );
    const msg = {
      to: newUser.email, // Change to your recipient
      from: SENDGRID_EMAIL, // Change to your verified sender
      subject: "VERIFICATION of your 'Coffy Paste' Account",
      // text: `To verify your email, please click on this link: ${BE_HOST}/users/verify/${verifyToken}`,
      html: `
      <div>
      <p>Hi ${newUser.userName}, </p>

      <p>We're happy you signed up for Coffy Paste. To start your tasty journey and exploring
      your favourite Coffeeshops, please verify your email.</p>

      <p><a href="${BE_HOST}/users/verify/${verifyToken}" 
      style="background-color: orange; border-radius: 7px; width: 50px; height: 20px; text-decoration: none;">
      Verify now</a></p>
    
      <p>Welcome to Coffy Paste!<br>
      Your Coffy Paste Team </p>
      
      <div>`,
    };
    const response = await sgMail.send(msg);
    // VERIFY EMAIL IMPLEMENT END //

    res.status(201).json({
      message:
        "Please verify your account via the link in the email we send you, to use your Profile.",
    });
  } catch (err) {
    next(err);
  }
}

// GET Verify new User via Email
export async function verifyEmail(req, res, next) {
  try {
    const verifyToken = req.params.token;
    const decodedVerifyToken = jwt.verify(verifyToken, JWT_KEY);
    const id = decodedVerifyToken._id;
    const user = await UserModel.findByIdAndUpdate(id, { isVerified: true });
    // res.json({message: 'E-Mail is now SUCCESSFULLY verified!'});

    res.redirect(`${FE_HOST}/login`);
    // if we have a frontend, we can direct the successful verification to the login page
  } catch (err) {
    next(err);
  }
}

// POST Request email for forgotten password
export async function forgotPassword(req, res, next) {
  try {
    const userData = req.body;
    const userFromDb = await UserModel.findOne({ email: userData.email });
    if (!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err;
    }

    // VERIFY EMAIL IMPLEMENT BEGIN //
    sgMail.setApiKey(SENDGRID_KEY);
    const verifyToken = jwt.sign(
      { email: userFromDb.email, _id: userFromDb._id },
      JWT_KEY,
      { expiresIn: "1h" }
    );
    const msg = {
      to: userFromDb.email, // Change to your recipient
      from: SENDGRID_EMAIL, // Change to your verified sender
      subject: "SET A NEW PASSWORD for your 'Coffy Paste' Account",
      // text: `To change your password, please click on this link: ${BE_HOST}/users/setnewpassword/${verifyToken}`,
      html: `
      <div>
      <p>Hi ${userFromDb.userName}, </p>

      <p>a request has been received to change the password 
      for your Coffy Paste account</p>

      <p><a href="${BE_HOST}/users/reset/${verifyToken}" 
      style="background-color: orange; border-radius: 7px; width: 50px; height: 20px; text-decoration: none;">
      Reset password</a></p>
    
      <p>If you did not initiate this request, please contact 
      us immediately at ${SENDGRID_EMAIL}</p>

      <p>Thank you,<br>
      your Coffy Paste Team </p>
      
      <div>`,
    };
    const response = await sgMail.send(msg);
    // VERIFY EMAIL IMPLEMENT END //

    res
      .status(201)
      .json({ message: "You got send an Email to set your new password." });
  } catch (err) {
    next(err);
  }
}

// GET Verify reset token
export async function verifyResetToken (req, res, next) {
  try {
    const verifyToken = req.params.token;
    const decodedVerifyToken = jwt.verify(verifyToken, JWT_KEY);
    const id = decodedVerifyToken._id;
    const user = await UserModel.findByIdAndUpdate(id, { isVerifiedTCP: true });
    res.redirect(`${FE_HOST}/setnewpassword`);
  } catch (err) {
    next(err);
  }
}

// POST Change (forgotten) password after email request
export async function setNewPassword(req, res, next) {
  try {
    // CHECK IF ACCOUNT IS VERIFIED WITH EMAIL
    const email = req.body.email;
    const userFromDb = await UserModel.findOne({ email: email });
    if (!userFromDb.isVerifiedTCP) {
      res.status(422).json({message: "Account not verified to change password"});    
    }
    // CHANGE AND ENCRYPT NEW PASSWORD
    const id = userFromDb._id;
    const newPassword = req.body.password;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await UserModel.findByIdAndUpdate(id, {
        password: hashedPassword,
        isVerifiedTCP: false,
      });
      console.log(updatedUser);
      res.status(200).json({ message: "Set new Password was SUCCESSFUL!"});
    } else {
      res.status(422).json({message: "Set new Password was FAILED!"});
    }
  } catch (err) {
    next(err);
  }
}

// GET a specific User
export async function usersGetSpecific(req, res, next) {
  try {
    if (!(await UserModel.findById(req.params.id))) {
      const err = new Error("No USER with this id in Database!");
      err.statusCode = 422;
      throw err;
    }
    res
      .status(200)
      .json(
        await UserModel.findById(req.params.id).populate([
          "friends",
          "comments",
          "topShops",
        ])
      );
  } catch (err) {
    next(err);
  }
}

// PATCH (Update) specific User
export async function usersPatchSpecific(req, res, next) {
  try {
    // DEFINE NEEDED VARIABLES //
    const userData = req.body;
    // console.log(userData);
    const id = req.params.id;
    console.log(id);
    // DEFINE NEEDED VARIABLES //

    // CHECK IF AUTHORIZED //
    console.log(req.token.userId);
    if (id !== req.token.userId) {
      const err = new Error("Not Authorized!");
      err.statusCode = 401;
      throw err;
    }
    // CHECK IF AUTHORIZED //

    // CHECK & UPDATE EVERY GIVEN PARAMETER START //
    // CHECK FIRSTNAME START //
    if (userData.firstName) {
      const userName = userData.userName;
      const user = await UserModel.findByIdAndUpdate(id, {
        userName: userName,
        new: true,
      });
    }
    // CHECK FIRSTNAME END //

    // CHECK CITY START //
    if (userData.city) {
      const city = userData.city;
      const user = await UserModel.findByIdAndUpdate(id, {
        city: city,
        new: true,
      });
    }
    // CHECK CITY END //

    // CHECK EMAIL START //
    // if (userData.email) {
    //   const userFromDb = await UserModel.find(
    //     { email: userData.email },
    //     { id: { $not: req.params.id } }
    //   );
    //   // console.log(userFromDb);
    //   if (userFromDb.length > 0) {
    //     const err = new Error("There is already a user with this email!");
    //     err.statusCode = 401;
    //     throw err;
    //   } else {
    //     const newEmail = userData.email;
    //     const updatedUser = await UserModel.findByIdAndUpdate(id, {
    //       email: newEmail,
    //       new: true,
    //     });
    //   }
    // }
    // CHECK EMAIL END //

    // CHECK PASSWORD START //
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await UserModel.findByIdAndUpdate(id, {
        password: hashedPassword,
        new: true,
      });
    }
    // CHECK PASSWORD END //

    // CHECK AVATAR BEGIN //
    if (req.file) {
      await UserModel.findByIdAndUpdate(id, {
        avatar: `http://localhost:2404/${req.file.path}`,
      });
    }
    // CHECK AVATAR END //
    // CHECK & UPDATE EVERY GIVEN PARAMETER END //

    res.json(await UserModel.findById(id));
  } catch (err) {
    next(err);
  }
}

// Delete specific User
export async function usersDeleteSpecific(req, res, next) {
  try {
    if (req.params.id !== req.token.userId) {
      const err = new Error("Not Authorized! DELETE");
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json(await UserModel.findByIdAndDelete(req.params.id));
  } catch (err) {
    next(err);
  }
}

// POST Login a User
export async function usersPostLogin(req, res, next) {
  try {
    const userData = req.body;
    const userFromDb = await UserModel.findOne({ email: userData.email });
    const isVerified = userFromDb.isVerified;
    if (!isVerified) {
      const err = new Error(
        "User is not verified yet, please verify yourself using the link in your email. If the link is older than an hour, please request a new one."
      );
      err.statusCode = 401;
      throw err;
    }
    if (!userFromDb) {
      const err = new Error("There is no user with this email!");
      err.statusCode = 401;
      throw err;
    }
    const checkPassword = await bcrypt.compare(
      userData.password,
      userFromDb.password
    );
    if (!checkPassword) {
      const err = new Error("Invalid password!");
      err.statusCode = 401;
      throw err;
    }
    const token = jwt.sign(
      {
        email: userFromDb.email,
        userId: userFromDb._id,
      },
      JWT_KEY,
      { expiresIn: "1d" }
    );

    // INSERT COOKIE CODE BEGIN //
    const oneHour = 1000 * 60 * 60;
    res
      .cookie("loginCookie", token, {
        maxAge: oneHour,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        auth: "loggedin",
        email: userFromDb.email,
        userId: userFromDb._id,
        message: "Login SUCCESSFUL!",
      });
    // INSERT COOKIE CODE BEGIN //
  } catch (err) {
    next(err);
  }
}

// GET Logout a User
export async function usersGetLogout(req, res, next) {
  try {
    res.clearCookie("loginCookie");
    res.status(200).json({ message: "Logout SUCCESSFULLY!" });
  } catch (err) {
    next(err);
  }
}

// GET Check if User is already loggedin (if token is still valid)
export async function usersChecklogin(req, res, next) {
  try {
    const token = req.cookies.loginCookie;
    const tokenDecoded = jwt.verify(token, JWT_KEY);
    console.log("Token in Cookie is valid. User is loggedin");
    res
      .status(200)
      .json({
        message: "SUCCESFULLY LOGGED IN",
        userId: tokenDecoded.userId,
      })
      .end();
  } catch (err) {
    next(err);
    // res.status(401).end()
  }
}

// ADD new friend
export async function addFriend(req, res, next) {
  try {
    const friendId = req.body.friend;
    const userId = req.body.user;
    if (friendId !== userId) {
      const userData = await UserModel.findById(userId).populate("friends");
      const found =
        userData &&
        userData.friends.find(
          (friend) => friend._id.toString() === friendId.toString()
        );

      if (!found) {
        await UserModel.findByIdAndUpdate(
          userId,
          { $push: { friends: friendId } },
          { new: true }
        );
        res.status(201).json({ message: "new friend added" });
      }
    }
    res.status(401).json({ message: "friend already exists" });
  } catch (error) {
    next(error);
  }
}

export async function deleteFriend(req, res, next) {
  try {
    const friendId = req.body.friend;
    const userId = req.body.user;
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    );

    res.status(200).json({ message: "friend deleted" });
  } catch (error) {
    next(error);
  }
}
