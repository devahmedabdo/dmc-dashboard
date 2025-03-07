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
        trim: true,
      },
      date: {
        type: String,
        required: true,
        trim: true,
      },
      postLink: {
        type: String,
        required: true,
        trim: true,
      },
    },
    numbers: [
      {
        specialization: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Specialization",
          // doctor
        },
        total: Number,
        _id: false,
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
        total: Number,
        _id: false,
      },
    ],
    status: {
      type: String,
      required: true,
      default: "0",
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Collaborator",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Member",
      },
    ],
    photos: [],

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

// convoySchema.methods.toJSON = function () {
//   const convoy = this;
//   const convoyObject = convoy.toObject();
//   // delete newsObject.puplisher;
//   return convoyObject;
// };
// convoySchema.virtual("Member", {
//   ref: "Member",
//   localField: "_id",
//   foreignField: "convoys",
// });
// convoySchema.virtual("convoys", {
//   ref: "Member",
//   localField: "_id",
//   foreignField: "convoys",
// });
const Convoy = mongoose.model("Convoy", convoySchema);
module.exports = Convoy;
