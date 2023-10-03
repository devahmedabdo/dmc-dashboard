const express = require("express");
const router = express.Router();
const Convoy = require("../models/convoy");
const multer = require("multer");
const auth = require("../middelware/auth");
const uploads = multer({
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|gif|webp)$/i)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
// router.post("/add", auth.admin(['administrator']), uploads.single("image"), async (req, res) => {
router.post("/convoy", uploads.array("photos", 5), async (req, res) => {
  try {
    const convoy = await new Convoy(req.body);
    if (req.files.length > 0) {
      if (req.files.length !== 5) {
        return res.status(403).send({ photosCount: true });
      }
      req.files.forEach((photo) => {
        convoy.photos.push(photo.buffer);
      });
    }
    await convoy.save();
    res.status(200).send(req.files);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/adds", uploads.array("photos", 5), async (req, res) => {
  try {
    // const convoy = await new Convoy(req.body);
    // await convoy.save();console.log(req);
    res.status(200).send(req.files);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/convoys", async (req, res) => {
  try {
    let convoys = await Convoy.find({});
    for (let i = 0; i < convoys.length; i++) {
      await convoys[i].populate("collaborators");
      await convoys[i].populate("forwards.doctor");
    }
    res.status(200).send(convoys);
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
router.patch(
  "/replies/:id",
  auth.admin(["administrator"]),
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

router.get("/news/:id", auth.admin(["administrator"]), async (req, res) => {
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
router.get("/news", auth.admin(["administrator"]), async (req, res) => {
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
router.delete("/news/:id", auth.admin(["administrator"]), async (req, res) => {
  const news = await News.findOneAndDelete({
    _id: req.params.id,
    publisher: req.writer._id,
  });
  if (!news) {
    return res.status(404).send("No News found to delete");
  }
  res.status(200).send(news);
});

router.get("/t", auth.admin(["administrator"]), (req, res) => {
  try {
    res.status(200).send("hellow");
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
module.exports = router;
