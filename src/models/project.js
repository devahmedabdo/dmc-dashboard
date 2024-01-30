const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  title: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "other",
  },
  status: {
    type: Boolean,
    default: false,
  },
  numbers: [
    {
      label: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
  photos: [
    {
      type: String,
      _id: false,
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
