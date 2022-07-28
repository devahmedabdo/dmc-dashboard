const express = require("express");
const router = express.Router();
const Writer = require("../models/writer");
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
router.post("/signup", uploads.single("avatar"), async (req, res) => {
  try {
    const writer = await new Writer(req.body);
    writer.avatar = req.file.buffer;
    await writer.save();
    res.send(writer);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post("/login", async (req, res) => {
  try {
    const writer = await Writer.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await writer.generateToken();
    if (!writer) {
      throw new Error("No Writer Found");
    }
    res.send({ writer, token });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
router.patch("/writer", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      req.writer[e] = req.body[e];
    });
    if (req.file) {
      writer.avatar = req.file.buffer;
    }
    await req.writer.save();
    res.status(200).send(req.writer);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/writer", auth, async (req, res) => {
  try {
    await req.writer.populate("news");
    res.status(200).send({ profile: req.writer, your_news: req.writer.news });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.delete("/writer", auth, async (req, res) => {
  try {
    const writer = await Writer.findByIdAndDelete(req.writer._id);
    if (!writer) {
      return res.status(404).send("No writer is found to delete");
    }
    res.status(200).send("Deleted Successfully");
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.delete("/logout", auth, async (req, res) => {
  try {
    req.writer.tokens = req.writer.tokens.filter((ele) => {
      return ele != req.token;
    });
    await req.writer.save();
    res.status(200).send("Signed out");
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/logoutAll", auth, async (req, res) => {
  try {
    req.writer.tokens = [];
    await req.writer.save();
    res.status(200).send("Signed out from all devices");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
