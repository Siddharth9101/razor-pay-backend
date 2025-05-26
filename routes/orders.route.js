const { Router } = require("express");
const {
  generateOrderId,
  createOrder,
  getAllOrders,
  getAllOrdersAdmin,
  updateStatus,
} = require("../controllers/orders.controller");
const isLoggedIn = require("../middlewares/auth.middleware.js");
const isAdminLoggedIn = require("../middlewares/admin.middleware.js");

const router = Router();

router.get("/", isLoggedIn, getAllOrders);
router.get("/admin", isAdminLoggedIn, getAllOrdersAdmin);
router.post("/create-order", isLoggedIn, generateOrderId);
router.post("/add-order", isLoggedIn, createOrder);
router.put("/:orderId", isAdminLoggedIn, updateStatus);

module.exports = router;
