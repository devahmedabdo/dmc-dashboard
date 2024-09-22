const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  disscount: {
    type: Number,
    trim: true,
  },
  postLink: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    default: "0",
  },
  photos: [],
  testimonials: [],
});
const Product = mongoose.model("Product", collaboratorSchema);
module.exports = Product;
