const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

async function connectDb() {
  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");
}

module.exports = { connectDb };
