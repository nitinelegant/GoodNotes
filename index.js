import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("error in connection", err);
  });
const app = express();
//to make input as json
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*" }));

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});