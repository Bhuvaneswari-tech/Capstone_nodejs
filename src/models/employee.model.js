const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true, min: 0 },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
