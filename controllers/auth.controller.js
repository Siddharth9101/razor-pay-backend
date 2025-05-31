require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.model.js");

const signUpUser = async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    const ifUserExists = await UserModel.findOne({ email });

    if (ifUserExists) {
      return res
        .status(400)
        .json({ message: "Email already registered. Try logging in." });
    }

    const newUser = new UserModel({ email, password, fullname });
    await newUser.save();

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, fullname: newUser.fullname },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User signed up successfully",
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        addresses: newUser.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signInUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist. Try signing up." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user._id, email: user.email, fullname: user.fullname },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        fullname: user.fullname,
        email: user.email,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const result = await UserModel.findOne({ email });

    if (!result) {
      return res
        .status(400)
        .json({ message: "User does not exist. Try signing up." });
    }

    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isAdmin = result.isAdmin;
    if (isAdmin === false) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
      {
        id: result._id,
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, _id: result._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const checkIsAdmin = async (req, res) => {
  try {
    const token = req.headers.admintoken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    res.status(200).json({ message: "Authorized" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error/Token Expired" });
  }
};

module.exports = {
  signUpUser,
  signInUser,
  logoutUser,
  loginAdmin,
  checkIsAdmin,
};
