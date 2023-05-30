const mongoose = require("mongoose");

const newsSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    replies: {
      type: Array,
      // required: true,
      // trim: true,
      // default: [],
    },

    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Writer",
    },
    image1: {
      type: Buffer,
    },
    image2: {
      type: Buffer,
    },
    image3: {
      type: Buffer,
    },
    image4: {
      type: Buffer,
    },
  },
  { timestamps: true }
);

newsSchema.methods.toJSON = function () {
  const news = this;
  const newsObject = news.toObject();
  delete newsObject.puplisher;
  return newsObject;
};
const News = mongoose.model("News", newsSchema);
module.exports = News;
