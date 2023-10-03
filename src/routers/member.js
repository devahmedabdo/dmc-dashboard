const express = require("express");
const router = express.Router();

const Member = require("../models/member");
const auth = require("../middelware/auth");

// member signup
router.post("/member", async (req, res) => {
  try {
    req.body.status = false;
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
    req.member.status = false;
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
// get all members this for admin
router.get("/members", auth.admin(["administrator"]), async (req, res) => {
  try {
    const page = +req.query.page || 0;
    const limit = +process.env.LIMIT;
    const members = await Member.aggregate([
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
      total: members[0].total[0].count,
      members: members[0].data,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
// get all members card
router.get("/members-card", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: true,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: "total" }],
        },
      },
    ]);

    res.send({
      page,
      limit,
      total: members[0].count[0].total,
      members: members[0].data,
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
