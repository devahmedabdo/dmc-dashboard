const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  }
  // { timestamps: true }
);

const Awareness = mongoose.model("Awareness", collaboratorSchema);
module.exports = Awareness;
