const mongoose = require("mongoose");

const configSchema = mongoose.Schema(
  {
    visits: {
      type: Number,
    },
    links: [],
    bgRemoverKey: {
      type: String,
      trim: true,
    },
  }
  // { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);
module.exports = Config;
