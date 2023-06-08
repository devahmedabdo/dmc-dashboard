const express = require("express");
const router = express.Router();
const News = require("../models/news");
const multer = require("multer");
const auth = require("../middelware/auth");
const uploads = multer({
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
router.post("/add", auth.auth, uploads.single("image"), async (req, res) => {
  try {
    const news = await new News(req.body);
    news.publisher = req.writer._id;
    // news.image = req.file.buffer;

    // blog        find
    // mainComment creat
    // mainComment save
    // blog.comments.push()
    // blog.comments.save()

    // mainComment find
    // branch creat
    // branch save
    // mainComment.replies push branch
    // mainComment.save()

    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.patch(
  "/replies/:id",
  auth.auth,
  uploads.single("image"),
  async (req, res) => {
    try {
      const mainNews = await News.find({});
      // publisher: req.writer._id,

      if (!mainNews) {
        return res.status(200).send("no main news");
      }
      const branchNews = await new News(req.body);
      // branchNews.publisher = req.writer._id;
      // news.image = req.file.buffer;
      // mainNews.replies.push(branchNews);
      console.log(mainNews);
      // await mainNews.save();
      res.status(200).send(mainNews);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);

router.get("/news/:id", auth.auth, async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      publisher: req.writer._id,
    });
    if (!news) {
      return res.status(404).send("No News found to for this id");
    }
    await news.populate("publisher");
    res.status(200).send({ news, publisher: news.publisher.name });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/news", auth.auth, async (req, res) => {
  try {
    const news = await News.find({ publisher: req.writer._id });
    if (!news) {
      return res.status(404).send("No News found for you");
    }
    res.status(200).send({ news, publisher: req.writer.name });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// router.patch("/news/:id", auth.auth, uploads.single("image"), async (req, res) => {
//   try {
//     const news = await News.findOne({
//       _id: req.params.id,
//       publisher: req.writer._id,
//     });
//     if (!news) {
//       return res.status(404).send("No News found to edit");
//     }
//     const updates = Object.keys(req.body);
//     updates.forEach((e) => {
//       news[e] = req.body[e];
//     });
//     if (req.file) {
//       news.image = req.file.buffer;
//     }
//     await news.save();
//     res.status(200).send(news);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });
router.delete("/news/:id", auth.auth, async (req, res) => {
  const news = await News.findOneAndDelete({
    _id: req.params.id,
    publisher: req.writer._id,
  });
  if (!news) {
    return res.status(404).send("No News found to delete");
  }
  res.status(200).send(news);
});
router.get("/timeline", async (req, res) => {
  try {
    let timeline = await News.find({});
    let arr = [];
    for (let i = 0; i < timeline.length; i++) {
      await timeline[i].populate("publisher");
      arr.push(timeline[i]);
    }

    res.status(200).send(arr);
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
router.get("/t", auth.auth, (req, res) => {
  try {
    res.status(200).send("hellow");
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
module.exports = router;
