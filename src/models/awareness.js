const mongoose = require("mongoose");

const awarenessSchema = mongoose.Schema(
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

const Awareness = mongoose.model("Awareness", awarenessSchema);
module.exports = Awareness;
