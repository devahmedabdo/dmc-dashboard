const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");
const auth = require("../middelware/auth");
const Member = require("../models/member");

// add admin should be an administrator
router.post("/admin", auth.admin(["administrator"]), async (req, res) => {
  try {
    const admin = await new Admin(req.body);
    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});
// update admin
router.patch("/admin/:id", auth.admin([]), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }

    // check who try to update same admin or administrator ?
    if (
      req.admin._id.toString() != admin._id.toString() &&
      req.admin.role != "administrator"
    ) {
      return res
        .status(403)
        .send("you are not the same admin or administrator");
    }
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      admin[e] = req.body[e];
    });
    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});
// get admin
router.get("/admin/:id", auth.admin([]), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    // check who try to update same admin or administrator ?
    if (
      req.admin._id.toString() != admin._id.toString() &&
      req.admin.role != "administrator"
    ) {
      return res
        .status(403)
        .send("you are not the same admin or administrator");
    }

    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});
// delete admin
router.delete("/admin/:id", auth.admin(["administrator"]), async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }

    res.status(200).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});
// end admin sessions
router.delete("/admin/session/:id", auth.admin([]), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }

    // check who try to update same admin or administrator ?
    if (
      req.admin._id.toString() != admin._id.toString() &&
      req.admin.role != "administrator"
    ) {
      return res
        .status(403)
        .send("you are not the same admin or administrator");
    }
    admin.tokens = [];
    await admin.save();
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e);
  }
});
// get all admins
router.get("/admins", auth.admin(["administrator"]), async (req, res) => {
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
// admin login
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
// admin logout
router.delete("/logout", auth.admin([]), async (req, res) => {
  try {
    req.admin.tokens = req.writer.tokens.filter((ele) => {
      return ele != req.token;
    });
    await req.admin.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});
// admin change Password
router.post("/admin/password/:id", auth.admin([]), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    // check who try to update same admin or administrator ?
    if (
      req.admin._id.toString() != admin._id.toString() &&
      req.admin.role != "administrator"
    ) {
      return res
        .status(403)
        .send("you are not the same admin or administrator");
    }
    // if (
    //   req.body.password == req.body.confirmPassword &&
    //   req.body.oldPassword == req.admin.password
    // ) {
    // }
    console.log({
      old_password: req.body.oldPassword,
      new_password: req.body.newPassword,
      old_password: req.body.confirmNewPassword,
      current_password: req.admin.password,
    });
    // admin.password = req.b
    admin.save();
    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});
// members //////////////////////////////////////////////////////////////////////////////
// modify member
router.patch(
  "/admin/member/:id",
  auth.admin(["administrator"]),
  async (req, res) => {
    try {
      console.log("asfdf  ");
      const member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send(`Member dosn't exist`);
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        req.member[e] = req.body[e];
      });
      await member.save();
      res.status(201).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.delete(
  "/admin/member/:id",
  auth.admin(["administrator"]),
  async (req, res) => {
    try {
      const member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send(`member dosn't exist`);
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        req.member[e] = req.body[e];
      });
      await member.save();
      res.status(201).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/test", async (req, res) => {
  try {
    res.send("fuck");
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
