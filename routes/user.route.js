const { Router } = require("express");
const isAdminLoggedIn = require("../middlewares/admin.middleware.js");
const {
  getAllUsers,
  updateRole,
  deleteUser,
} = require("../controllers/user.controller.js");

const router = Router();

router.get("/", isAdminLoggedIn, getAllUsers);
router.put("/:userId", isAdminLoggedIn, updateRole);
router.delete("/:userId", isAdminLoggedIn, deleteUser);

module.exports = router;
