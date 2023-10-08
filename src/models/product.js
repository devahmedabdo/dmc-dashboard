const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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
    photos: [],
  }
  // { timestamps: true }
);
// collaboratorSchema.virtual("doctors", {
//   ref: "Collaborator",
//   localField: "_id",
//   foreignField: "collaborators",
// });
// collaboratorSchema.virtual("doctors", {
//   ref: "Collaborator",
//   localField: "_id",
//   foreignField: "forwards",
// });
// collaboratorSchema.virtual("forwards", {
//   ref: "Collaborator",
//   localField: "_id",
//   foreignField: "forwards",
// });
const Product = mongoose.model("Product", collaboratorSchema);
module.exports = Product;
