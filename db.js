require("dotenv").config();
const mongoose = require("mongoose");
const connectToDB = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database.");
  } catch (error) {
    console.log("Error while conencting to database. ", error.message);
    process.exit(1);
  }
};

module.exports = connectToDB;
