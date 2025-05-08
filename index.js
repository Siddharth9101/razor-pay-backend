require("dotenv").config();
const Razorpay = require("razorpay");
const express = require("express");
const cors = require("cors");
const app = express();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.use(cors());
app.use(express.json());

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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
