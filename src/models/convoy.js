const mongoose = require("mongoose");

const convoySchema = mongoose.Schema(
  {
    description: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      order: {
        type: Number,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    numbers: [
      {
        specialization: {
          type: String,
          required: true,
          trim: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    forwards: [
      {
        doctor: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Collaborator",
          // doctor
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],

    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Collaborator",
      },
    ],
    photos: {
      type: Buffer,
      required: true,
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

convoySchema.methods.toJSON = function () {
  const news = this;
  const newsObject = news.toObject();
  // delete newsObject.puplisher;
  return newsObject;
};

const Convoy = mongoose.model("Convoy", convoySchema);
module.exports = Convoy;
