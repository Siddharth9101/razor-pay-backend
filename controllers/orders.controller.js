const Razorpay = require("razorpay");
const OrderModel = require("../models/Order.model.js");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const generateOrderId = async (req, res) => {
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
};

const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !products ||
      !totalAmount ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userId = req.userId;

    const newOrder = new OrderModel({
      userId,
      products,
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentDate: new Date(),
    });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .populate("products")
      .sort({ createdAt: -1 });

    if (!orders) {
      res.status(200).json([]);
    }

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const status = req.body.status;

    await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { orderStatus: status },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Order status updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  generateOrderId,
  createOrder,
  getAllOrders,
  getAllOrdersAdmin,
  updateStatus,
};
