const { Router } = require("express");
const {
  getAllProducts,
  createProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const upload = require("../configs/multer.js");
const isAdminLoggedIn = require("../middlewares/admin.middleware.js");

const router = Router();

router.get("/", getAllProducts);
router.post("/create", isAdminLoggedIn, upload.single("image"), createProduct);
router.delete("/:id", isAdminLoggedIn, deleteProduct);

module.exports = router;
