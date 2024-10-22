import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    // check if user exists
    const isValidUser = await User.findOne({ email });
    if (isValidUser) {
      return next(errorHandler(400, "User already exists"));
    }
    // hashing password
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isValidUser = await User.findOne({ email });
    if (!isValidUser) {
      return next(errorHandler(404, "User not found"));
    }
    const isValidPassword = bcryptjs.compareSync(
      password,
      isValidUser.password
    );
    if (!isValidPassword) {
      return next(errorHandler(401, "Invalid password"));
    }
    const token = jwt.sign({ id: isValidUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = isValidUser._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      message: "User logged in successfully",
      rest,
    });
  } catch (error) {
    next(error);
  }
};
