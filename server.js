// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import * as dotenv from "dotenv"; dotenv.config();
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// I M P O R T:  R O U T E S
import usersRouter from "./routes/users.js";
import coffeeRouter from "./routes/coffeeshops.js";
import wrongRoutes from "./routes/wrongPath.js";
import ratingRouter from "./routes/ratings.js";
import commentsRouter from "./routes/comments.js";

// I M P O R T:  E R R O R  H A N D L E R
import { errorHandler } from "./middleware/errorhandler.js";

// C O N N E C T   W I T H   M O N G O O S E  D B
const MONGO_DB_CONNECTION_STRING =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority` ||
  "mongodb://localhost:27017";
const PORT = process.env.PORT || 4000;

mongoose.set("strictQuery", false); // to prevent an erroneous error message
mongoose
  .connect(MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connect with MongoDB: SUCCESS ✅"))
  .catch((err) => console.log("Connect with MongoDB: FAILED ⛔", err));
// for errors which comes after the successfully connection
mongoose.connection.on("error", console.log);

// ========================

// C R E A T E  S E R V E R
const app = express();

// M I D D L E W A R E

// SERVER MIDDLEWARE
app.use(express.json());
app.use(express.static("public"));

app.use(cookieParser());
app.use(
  cors({
    origin: ["https://coffy-paste.vercel.app", "http://localhost:5173"], // hier Render Adresse eintragen
    credentials: true,
  })
);
app.use(morgan("dev"));

// ROUTER MIDDLEWARE
// USERS
app.use("/users", usersRouter);

// COFFEE SHOPS
app.use("/coffeeshops", coffeeRouter);

// RATINGS
app.use("/ratings", ratingRouter);

// COMMENTS
app.use("/comments", commentsRouter);

// ERROR HANDLER
app.use(errorHandler);

// WRONG PATH HANDLER
app.use("*", wrongRoutes);

// S E R V E R - S T A R T
app.listen(PORT, () => {
  console.log("Server runs on Port: " + PORT, "🔄");
});

