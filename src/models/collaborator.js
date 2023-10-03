const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    specialist: {
      type: String,
      required: true,
      trim: true,
    },
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
