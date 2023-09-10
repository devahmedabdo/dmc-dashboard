const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    special: {
      type: String,
      required: true,
      trim: true,
    },

    // image1: {
    //   type: Buffer,
    // },
    // image2: {
    //   type: Buffer,
    // },
    // image3: {
    //   type: Buffer,
    // },
    // image4: {
    //   type: Buffer,
    // },
    // image5: {
    //   type: Buffer,
    // },
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
const Collaborator = mongoose.model("Collaborator", collaboratorSchema);
module.exports = Collaborator;
