const mongoose = require("mongoose");

const collaboratorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  address: {
    type: String,
    trim: true,
  },
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Specialization",
  },
  personalPhone: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
});

const Collaborator = mongoose.model("Collaborator", collaboratorSchema);
module.exports = Collaborator;
