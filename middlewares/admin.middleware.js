require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAdminLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.admintoken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAdminLoggedIn;
