require("dotenv").config();
const Razorpay = require("razorpay");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("./models/User.model.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const connectToDB = require("./db.js");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.use(
  cors({
    origin: "https://ecom-react-g6kc.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

connectToDB();

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).send("Amount is required");
  }
  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
    receipt: "order_rcptid_" + new Date().getTime(),
  };
  try {
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating order");
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    const ifUserExists = await User.findOne({ email });

    if (ifUserExists) {
      return res
        .status(400)
        .json({ message: "Email already registered. Try logging in." });
    }

    const newUser = new User({ email, password, fullname });
    await newUser.save();

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, fullname: newUser.fullname },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User signed up successfully",
      user: { fullname: newUser.fullname, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      user: { fullname: user.fullname, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
