const UserModel = require("../models/User.model.js");
const OrderModel = require("../models/Order.model.js");
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).select("-password");

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateRole = async (req, res) => {
  try {
    const userId = req.params.userId;
    const status = req.body.status;

    await UserModel.findByIdAndUpdate(
      userId,
      {
        $set: { isAdmin: status },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "User role updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await OrderModel.find({ userId });

    if (orders.length > 0) {
      await OrderModel.deleteMany({ userId });
    }

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = {
  getAllUsers,
  updateRole,
  deleteUser,
};
