const express = require("express");
const router = express.Router();
const roles = require("../middelware/roles");
const Admin = require("../models/admin");
const auth = require("../middelware/auth");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");

// get all admins
router.get("/admins", auth.admin("users", "manage"), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const admins = await Admin.aggregate([
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                role: 1,
                email: 1,
              },
            },
          ],
          count: [{ $count: "total" }],
        },
      },
    ]);

    res.status(200).send({
      items: admins[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: admins[0].count.length ? admins[0].count[0].total : 0,
      },
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
// add admin
router.post("/admin", auth.admin("users", "add"), async (req, res) => {
  try {
    const admin = await new Admin(req.body);
    await admin.save();
    res.status(201).send(admin);
  } catch (error) {
    if (error.name === "ValidationError") {
      if (error.errors) {
        const validationErrors = {};
        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = error.errors[field].message;
          }
        }
        return res.status(422).send({ errors: validationErrors });
      } else {
        return res.status(422).send({ errors: { general: error.message } });
      }
    } else if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      const duplicateError = {
        [field]: `The ${field} '${error.keyValue[field]}' is already in use.`,
      };
      return res.status(422).send({ errors: duplicateError });
    } else {
      return res.status(400).send(error);
    }
  }
});
// update admin
router.patch("/admin/:id", auth.admin("users", "manage"), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    });
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      admin[e] = req.body[e];
    });
    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    if (error.name === "ValidationError") {
      if (error.errors) {
        const validationErrors = {};
        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = error.errors[field].message;
          }
        }
        return res.status(422).send({ errors: validationErrors });
      } else {
        return res.status(422).send({ errors: { general: error.message } });
      }
    } else if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      const duplicateError = {
        [field]: `The ${field} '${error.keyValue[field]}' is already in use.`,
      };
      return res.status(422).send({ errors: duplicateError });
    } else {
      return res.status(400).send(error);
    }
  }
});
// delete admin
router.delete("/admin/:id", auth.admin("users", "delete"), async (req, res) => {
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
// get admin TODO: not important
router.get("/admin/:id", auth.admin("users", "manage"), async (req, res) => {
  try {
    const admin = await Admin.findOne({
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
  auth.admin("users", "manage"),
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

// admin login
router.post("/admin/login", async (req, res) => {
  try {
    console.log(req.body);
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateToken();
    res.status(200).send({ admin, token });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
// admin logout
router.delete(
  "/admin/logout",
  auth.admin("users", "manage"),
  async (req, res) => {
    try {
      req.admin.tokens = req.admin.tokens.filter((ele) => {
        return ele != req.token;
      });
      await req.admin.save();
      res.status(200).send();
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

// request admin reset Password
router.post("/admin/reset-password", async (req, res) => {
  // need email
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
    });
    if (!admin) {
      return res.status(404).send(req.body);
      // return res.status(404).send(`admin dosn't exist`);
    }
    // if admin
    const token = await admin.generateToken();

    // send this token to email via function TODO:
    res.status(200).send({ token: token });
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
// admin change Password
router.post("/admin/change-password/:token", async (req, res) => {
  // need new password and confirm it and token

  try {
    const token = req.params.token;

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
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});

// members //////
// modify  member
router.post("/admin/member", auth.admin("members", "add"), async (req, res) => {
  try {
    const member = await new Member(req.body);
    await member.save();
    res.status(201).send(member);
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
router.get(
  "/admin/member/:id",
  auth.admin("members", "manage"),
  async (req, res) => {
    try {
      const member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send(`Member dosn't exist`);
      }
      res.status(200).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.patch(
  "/admin/member/:id",
  auth.admin("members", "manage"),
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
        if (e == "card") {
          // prevent admin to show member card
          return;
        }
        member[e] = req.body[e];
      });
      await member.save();
      res.status(200).send(member);
    } catch (e) {
      if (e.name == "ValidationError") {
        return res.status(422).send(e.errors);
      }
      res.status(400).send(e);
    }
  }
);
router.delete(
  "/admin/member/:id",
  auth.admin("members", "delete"),
  async (req, res) => {
    try {
      const member = await Member.findOneAndDelete({
        _id: req.params.id,
      });
      res.status(200).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
// get all members this for admin
router.get("/members", auth.admin("members", "manage"), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const filter = req.query;
    delete filter.page;
    const members = await Member.aggregate([
      {
        $facet: {
          data: [
            { $match: filter },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1, // Include or exclude fields based on your requirements
                name: 1,
                // Add more fields as needed
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);
    const pagination = {
      page,
      limit,
      total: members[0].total[0].count,
    };
    res.send({
      pagination,
      items: members[0].data,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get(
  "/select/members",
  auth.admin("members", "manage"),
  async (req, res) => {
    try {
      const members = await Member.find({}, { name: 1, _id: 1 });
      res.send(members);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.get("/", async (req, res) => {
  try {
    console.log("asd");
    res.send("Hellow world");
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
