const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    permissions: [],
  }
  // { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
