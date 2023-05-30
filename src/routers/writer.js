const express = require("express");
const router = express.Router();

/////
////
const Writer = require("../models/writer");
const multer = require("multer");
const auth = require("../middelware/auth");
const uploads = multer({
  limits: {
    fieldSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg|gif)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});
router.post("/signup", async (req, res) => {
  try {
    const writer = await new Writer(req.body);
    console.log(req.body);

    // const token = await writer.generateToken();
    await writer.save();
    res.send();
    // res.send({ writer, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get("/", async (req, res) => {
  try {
    const writer = await Writer.find();
    // console.log(req.body);

    // const token = await writer.generateToken();

    res.send(writer);
    // res.send({ writer, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/writerImg", auth, uploads.single("avatar"), async (req, res) => {
  console.log(req.file);
  try {
    req.writer.avatar = req.file.buffer;
    await req.writer.save();
    res.send();
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
    // if (req.file) {
    //   req.writer.avatar = req.file.buffer;
    // }
    await req.writer.save();
    console.log(req.writer);
    res.status(200).send(req.writer);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/writer", auth, async (req, res) => {
  try {
    await req.writer.populate("news");
    res.status(200).send({ profile: req.writer, news: req.writer.news });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post("/email", async (req, res) => {
  try {
    const email = await Writer.findOne({ email: req.body.email });
    // console.log(req.body);
    if (!email) return res.status(200).send(false);
    res.status(200).send(true);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.delete("/writer", auth, async (req, res) => {
  try {
    await req.writer.remove();
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
    res.status(200).send();
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
