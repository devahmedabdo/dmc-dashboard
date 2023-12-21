const mongoose = require("mongoose");

const committeesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});

const Committee = mongoose.model("Committee", committeesSchema);
module.exports = Committee;
