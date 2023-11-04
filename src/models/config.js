const mongoose = require("mongoose");

const configSchema = mongoose.Schema(
  {
    visits: {
      type: Number,
    },
    links: [],
  }
  // { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);
module.exports = Config;
