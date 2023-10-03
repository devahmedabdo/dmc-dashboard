const express = require("express");
const router = express.Router();

const Admin = require("../models/admin");
const auth = require("../middelware/auth");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");

// add admin should be an administrator
router.post("/admin", auth.admin(["administrator"]), async (req, res) => {
  try {
    const admin = await new Admin(req.body);
    console.log(admin);
    await admin.save();
    console.log("no");
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
      if (req.admin.role != "administrator" && admin[e] == "role") {
        return;
      }
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
// end admin sessions (logout)
router.delete(
  "/admin/sessions/:id",
  auth.admin(["administrator"]),
  async (req, res) => {
    try {
      const admin = await Admin.findOne({
        _id: req.params.id,
      });
      if (!admin) {
        return res.status(404).send(`admin dosn't exist`);
      }
      admin.tokens = [];
      await admin.save();
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
// get all admins
router.get("/admins", auth.admin(["administrator"]), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const admins = await Admin.aggregate([
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

    res.status(200).send({
      page,
      limit,
      total: admins[0].count[0].total,
      admins: admins[0].data,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
// admin login
router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateToken();
    console.log(token);

    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
// admin logout
router.delete("/admin/logout", auth.admin([]), async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter((ele) => {
      return ele != req.token;
    });
    await req.admin.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// request admin reset Password
router.post("/admin/reset-password", async (req, res) => {
  // need email
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    // if admin
    const token = await admin.generateToken();

    // send this token to email via function TODO:
    res.status(200).send(token);
  } catch (e) {
    res.status(400).send(e);
  }
});
// admin change Password
router.post("/admin/change-password", async (req, res) => {
  // need new password and confirm it and token

  try {
    const token = req.body.token;

    console.log(token);
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decode._id, tokens: token });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    if (req.body.newPassword != req.body.confirmNewPassword) {
      return res.status(422).send(`new passwords dosn't match`);
    }
    admin.password = req.body.newPassword;
    console.log(admin);

    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

// members //////
// modify  member
router.patch(
  "/admin/member/:id",
  auth.admin(["administrator"]),
  async (req, res) => {
    try {
      const member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send(`Member dosn't exist`);
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        member[e] = req.body[e];
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
      res.status(200).send();
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/test", async (req, res) => {
  try {
    await console.log("asd");
    res.send("fuck");
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
