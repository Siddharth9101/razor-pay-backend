require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const connectToDB = require("./configs/db.js");
const authRouter = require("./routes/auth.route.js");
const orderRouter = require("./routes/orders.route.js");
const productRouter = require("./routes/products.route.js");
const userRouter = require("./routes/user.route.js");

// middlewares
app.use(
  cors({
    origin: "https://ecom-react-g6kc.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// connection to db
connectToDB();

// routes
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

// creating server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
