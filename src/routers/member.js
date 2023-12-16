const express = require("express");
const router = express.Router();

const Member = require("../models/member");
const auth = require("../middelware/auth");

// member signup
router.post("/member", async (req, res) => {
  try {
    req.body.status = false;
    req.body.new = true;
    const member = await new Member(req.body);
    await member.save();
    // TODO: send mail to admin
    res.status(201).send(member);
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});

// update member
router.patch("/member", auth.member, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      req.member[e] = req.body[e];
    });
    req.member.status = false;
    await req.member.save();
    res.status(201).send(req.member);
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
// get member
router.get("/member", auth.member, async (req, res) => {
  try {
    const member = req.member;
    await member.populate("convoys");
    res.status(200).send(member);
  } catch (e) {
    res.status(400).send(e);
  }
});
// delete member
router.delete("/member", auth.member, async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({
      _id: req.member._id,
    });
    if (!member) {
      return res.status(404).send(`Member dosn't exist`);
    }
    res.status(200).send(member);
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
    // TODO: hide img for some

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
router.post("/member/login", async (req, res) => {
  try {
    const member = await Member.findByCredentials(
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
router.delete("/member/logout", auth.member, async (req, res) => {
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

// request member reset Password
router.post("/member/reset-password", async (req, res) => {
  // need email
  try {
    const member = await Member.findOne({
      email: req.body.email,
    });
    if (!member) {
      return res.status(422).send(`member dosn't exist`);
    }
    // if member
    const token = await member.generateToken();

    // send this token to email via function TODO:
    res.status(200).send(token);
  } catch (e) {
    res.status(400).send(e);
  }
});
// member change Password
router.post("/member/change-password/:token", async (req, res) => {
  // need new password and confirm it and token
  try {
    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findOne({ _id: decode._id, tokens: token });
    if (!member) {
      return res.status(404).send(`member dosn't exist`);
    }
    if (req.body.newPassword != req.body.confirmNewPassword) {
      return res.status(422).send(`new passwords dosn't match`);
    }
    member.password = req.body.newPassword;
    await member.save();
    res.status(201).send(member);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
