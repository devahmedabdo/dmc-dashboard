const mongoose = require("mongoose");

const configSchema = mongoose.Schema(
  {
    numberOfPatient: {
      type: Number,
    },
    acceptOrder: {
      type: Boolean,
      default: false,
    },
    acceptSignup: {
      type: Boolean,
      default: false,
    },
    links: [
      {
        label: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    galleryEmails: {
      type: [String],
      min: 1,
    },
    donations: {
      type: [
        {
          method: String,
          value: String,
          project: String,
        },
      ],
    },
  }
  // { timestamps: true }
);

const Config = mongoose.model("Config", configSchema);
module.exports = Config;
