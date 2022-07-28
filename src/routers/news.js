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
router.post("/add", auth, async (req, res) => {
  try {
    const news = await new News(req.body);
    news.publisher = req.writer._id;
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post("/add/:id", auth, uploads.single("image"), async (req, res) => {
  try {
    const news = await  News.findById(req.params.id);
    news.image = req.file.buffer;
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/news/:id", auth, async (req, res) => {
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
router.get("/news", auth, async (req, res) => {
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
router.patch("/news/:id", auth, uploads.single("image"), async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      publisher: req.writer._id,
    });
    if (!news) {
      return res.status(404).send("No News found to edit");
    }
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      news[e] = req.body[e];
    });
    if (req.file) {
      news.image = req.file.buffer;
    }
    await news.save();
    res.status(200).send(news);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.delete("/news/:id", auth, async (req, res) => {
  const news = await News.findOneAndDelete({
    _id: req.params.id,
    publisher: req.writer._id,
  });
  if (!news) {
    return res.status(404).send("No News found to delete");
  }
  res.status(200).send(news);
});

module.exports = router;
