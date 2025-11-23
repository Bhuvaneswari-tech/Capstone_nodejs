const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, validate: [validator.isEmail, "Invalid email"] },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  tenantId: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
