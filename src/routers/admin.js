const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");
const auth = require("../middelware/auth");

// admin
router.post("/admin", async (req, res) => {
  try {
    const admin = await new Admin(req.body);
    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/admins", auth.admin([]), async (req, res) => {
  try {
    const page = +req.query.page || 0;
    const limit = +process.env.LIMIT;

    const admins = await Admin.aggregate([
      {
        $facet: {
          data: [{ $match: {} }, { $skip: page * limit }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]);

    res.send({
      page,
      limit,
      total: admins[0].total[0].count,
      admins: admins[0].data,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(admin);
    const token = await admin.generateToken();

    res.send({ admin, token });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
router.patch("/writer", auth.auth, async (req, res) => {
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
router.get("/writer", auth.auth, async (req, res) => {
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
router.delete("/writer", auth.auth, async (req, res) => {
  try {
    await req.writer.remove();
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.delete("/logout", auth.auth, async (req, res) => {
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
router.delete("/logoutAll", auth.auth, async (req, res) => {
  try {
    req.writer.tokens = [];
    await req.writer.save();
    res.status(200).send("Signed out from all devices");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
