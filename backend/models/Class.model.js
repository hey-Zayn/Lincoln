const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
}, { timestamps: true });

const Class = mongoose.model("Class", ClassSchema);
module.exports = Class;
