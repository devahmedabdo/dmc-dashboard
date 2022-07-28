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
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Writer",
    },
    image: {
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
