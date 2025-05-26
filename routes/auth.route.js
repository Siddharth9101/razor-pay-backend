const { Router } = require("express");
const {
  signUpUser,
  signInUser,
  logoutUser,
  loginAdmin,
  checkIsAdmin,
} = require("../controllers/auth.controller");

const router = Router();

router.post("/signup", signUpUser);
router.post("/login", signInUser);
router.get("/logout", logoutUser);
router.post("/loginAdmin", loginAdmin);
router.get("/check-admin", checkIsAdmin);

module.exports = router;
