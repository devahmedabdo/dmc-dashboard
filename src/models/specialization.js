const mongoose = require("mongoose");

const specializationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
  }
  // { timestamps: true }
);

const Specialization = mongoose.model("Specialization", specializationSchema);
module.exports = Specialization;
