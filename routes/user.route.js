const { Router } = require("express");
const isAdminLoggedIn = require("../middlewares/admin.middleware.js");
const {
  getAllUsers,
  updateRole,
} = require("../controllers/user.controller.js");

const router = Router();

router.get("/", isAdminLoggedIn, getAllUsers);
router.put("/:userId", isAdminLoggedIn, updateRole);

module.exports = router;
