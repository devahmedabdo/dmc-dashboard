const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema(
  {
    visits: {
      type: Number,
    },
    links: [],
  }
  // { timestamps: true }
);

const Awareness = mongoose.model("Awareness", collaboratorSchema);
module.exports = Awareness;
