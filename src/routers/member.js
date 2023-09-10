const express = require("express");
const router = express.Router();

const Member = require("../models/member");
const auth = require("../middelware/auth");

// member signup
router.post("/member", async (req, res) => {
  try {
    console.log("sd");
    const member = await new Member(req.body);
    await member.save();
    res.status(201).send(member);
  } catch (e) {
    res.status(400).send(e);
  }
});
// update member
router.patch("/member/:id", auth.member, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      req.member[e] = req.body[e];
    });
    await req.member.save();
    res.status(201).send(req.member);
  } catch (e) {
    res.status(400).send(e);
  }
});
// get member
router.get("/member/:id", auth.member, async (req, res) => {
  try {
    const member = await Admin.findOne({
      _id: req.params.id,
    });
    if (!member) {
      return res.status(404).send(`Member dosn't exist`);
    }
    res.status(200).send(member);
  } catch (e) {
    res.status(400).send(e);
  }
});
// delete member
router.delete("/member/:id", auth.member, async (req, res) => {
  try {
    const member = await Admin.findOneAndDelete({
      _id: req.params.id,
    });
    if (!member) {
      return res.status(404).send(`admin dosn't exist`);
    }
    res.status(200).send(member);
  } catch (e) {
    res.status(400).send(e);
  }
});
// get all members
router.get("/members", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const admins = await Member.aggregate([
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
// member login
router.post("/login", async (req, res) => {
  try {
    const member = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await member.generateToken();
    res.send({ member, token });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
// member logout
router.delete("/logout", auth.member, async (req, res) => {
  try {
    req.member.tokens = req.member.tokens.filter((ele) => {
      return ele != req.token;
    });
    await req.member.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
