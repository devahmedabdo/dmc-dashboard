const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: {
        collation: { locale: "en", strength: 2 }, // Example collation, adjust as needed
      },
    },
    permissions: [],
  }
  // { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
module.exports = Role;
