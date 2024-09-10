const express = require("express");
const router = express.Router();
const allroles = require("../middelware/roles");
const Admin = require("../models/admin");
const auth = require("../middelware/auth");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const mail = require("../statics/mail");
const { uploud, remove } = require("../services/uploder");
const handle = require("../services/errorhandler");
router.get("/seeding", (req, res) => {
  try {
    // Your seeding logic here, e.g., inserting data into a database
    console.log("Starting seeding process...");
    const mongoose = require("mongoose");
    const Role = require("../models/role");

    const roles = require("../middelware/roles");
    const permissions = extractIds(roles);
    mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        const role = await new Role({
          name: "الادارة",
          permissions,
        });
        await role.save();

        const admin = await new Admin({
          name: "أحمد عبده",
          password: "12345678*Aa",
          email: "devahmedabdo@gmail.com",
          role: role._id,
        });
        await admin.save();
        console.error("succsefull creat initial data:");

        mongoose.connection.close();
      })
      .catch((err) => {
        console.error("Error creating initial data:", err);
        mongoose.connection.close();
      });
    function extractIds(data) {
      let ids = [];
      function traverse(obj) {
        for (let key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            traverse(obj[key]);
          } else if (key === "id") {
            ids.push(obj[key]);
          }
        }
      }
      traverse(data);
      return ids;
    }
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    throw error; // Re-throw the error to handle it in the caller
  }
});
// get all admins
router.get("/admins", auth.admin("users", "read"), async (req, res) => {
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
    handle(error, res);
  }
});
// update admin
router.patch("/admin/:id", auth.admin("users", "write"), async (req, res) => {
  try {
    const admin = await Admin.findOne({
      _id: req.params.id,
    }).select("name _id email");
    if (!admin) {
      return res.status(404).send(`admin dosn't exist`);
    }
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      admin[e] = req.body[e];
    });
    await admin.save();
    res.status(201).send(admin);
  } catch (error) {
    if (error.name === "ValidationError") {
      if (error.errors) {
        const validationErrors = {};
        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = { message: error.errors[field].message };
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
        [field]: {
          message: `القيمة موجودة مسبقا `,
        },
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
// admin login
router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateToken();

    await admin.populate("role");
    //

    // Function to filter permissions based on admin role permissions
    const filterPermissions = (permissions) => {
      const filteredPermissions = Object.fromEntries(
        Object.entries(permissions).filter(([key, { id }]) =>
          admin.role.permissions.includes(id)
        )
      );

      return Object.keys(filteredPermissions).length > 0
        ? filteredPermissions
        : null;
    };

    // Filter each role based on admin role permissions
    const permissions = Object.entries(allroles).reduce(
      (result, [key, { title, permissions }]) => {
        const filteredPermissions = filterPermissions(permissions);
        if (filteredPermissions) {
          result[key] = {
            title,
            permissions: filteredPermissions,
          };
        }
        return result;
      },
      {}
    );

    //

    res.status(200).send({
      admin: {
        name: admin.name,
        _id: admin._id,
        email: admin.email,
      },
      permissions,
      token,
    });
  } catch (e) {
    res.status(401).send(e.message);
  }
});
// admin logout
router.delete("/adminLogout", async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decode._id, tokens: token });
    if (!admin) {
      return res.status(401).send({ message: "من فضلك قم بتسجيل الدخول اولا" });
    }
    admin.tokens = admin.tokens.filter((ele) => {
      return ele != token;
    });
    await admin.save();
    res.status(200).send();
  } catch (e) {
    console.log(e);
    res.status(405).send(e);
  }
});
// end admin sessions (logout)
router.delete(
  "/adminSessions/:id",
  auth.admin("users", "write"),
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
// request admin reset Password
router.post("/admin/reset-password", async (req, res) => {
  try {
    const admin = await Admin.findOne({
      email: req.body.email,
    });
    if (!admin) {
      return res.status(404).send({ message: "هذا البريد غير موجود" });
    }
    const token = await admin.generateToken();
    admin.token = token;
    mail.sendEmail(
      mail.getEmails("users", "resetPassword", admin, admin.email)
    );
    res.status(200).send();
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
// admin change Password
router.post("/admin/change-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decode._id, tokens: token });
    if (!admin) {
      return res.status(404).send({ message: "هذا المستحدم غير موجود" });
    }
    if (req.body.newPassword != req.body.confirmNewPassword) {
      return res.status(409).send({ message: "كلمات المرور غير متطابقة" });
    }
    admin.password = req.body.newPassword;
    await admin.save();
    res.status(201).send(admin);
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});

// members /////////////////////////////////////////////////////////////////////////
// modify  member
router.post("/admin/member", auth.admin("members", "add"), async (req, res) => {
  try {
    !req.body.convoys ? (req.body.convoys = []) : "";
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === null) {
        delete req.body[key];
      }
    });
    let member = await new Member(req.body);
    if (!req.body.newImage) {
      return res.status(422).send({
        errors: {
          image: {
            message: "حقل الصورة مطلوب",
          },
        },
      });
    }
    await member.save();
    const uploadedImg = await uploud("avatars", [req.body?.newImage]);
    if (uploadedImg) {
      member["image"] = uploadedImg[0];
    } else {
      res.status(409).send({
        message: "خطأ اثناء رفع الصورة",
      });
    }
    // // console.log(await uploud("avatars", [req.body?.newImage]));
    // console.log(member);
    await member.save();
    res.status(201).send(member);
  } catch (error) {
    handle(error, res);
  }
});
router.get(
  "/admin/member/:id",
  auth.admin("members", "read"),
  async (req, res) => {
    try {
      const member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send({ message: "العضو غير موجود" });
      }
      res.status(200).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.patch(
  "/admin/member/:id",
  auth.admin("members", "write"),
  async (req, res) => {
    try {
      let member = await Member.findOne({
        _id: req.params.id,
      });
      if (!member) {
        return res.status(404).send({ message: "العضو غير موجود" });
      }
      let oldStatus = JSON.parse(JSON.stringify(member.status));
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        if (e == "card" || e == "showImg") {
          return;
        }
        member[e] = req.body[e];
        if (req.body[e] === null) {
          delete req.body[e];
        }
      });
      await member.save();

      if (req.body?.newImage) {
        const uploadedImg = await uploud("avatars", [req.body?.newImage]);
        if (uploadedImg) {
          if (member.image) await remove([member.image]);
          member["image"] = uploadedImg[0];
          return;
        } else {
          res.status(409).send({
            message: "خطأ اثناء رفع الصورة",
          });
        }
      }

      await member.save();
      if (oldStatus == 2 && member.status == 3) {
        mail.sendEmail("member23", member, member.email).then((data) => {});
      }
      if (oldStatus == 1 && member.status == 3) {
        mail.sendEmail("member13", member, member.email).then((data) => {});
      }
      res.status(200).send(member);
    } catch (error) {
      console.log(error);
      handle(error, res);
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
      if (!member) {
        return res.status(404).send({ message: "العضو غير موجود" });
      }
      remove([member.image]);
      res.status(200).send(member);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
// get all members this for admin
router.get("/members", auth.admin("members", "read"), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const filter = req.query;
    delete filter.page;
    const members = await Member.aggregate([
      { $match: filter },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "committees",
                localField: "committee",
                foreignField: "_id",
                as: "committee",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                committee: { $arrayElemAt: ["$committee", 0] },
              },
            },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    res.send({
      items: members[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: members[0].count.length ? members[0].count[0].count : 0,
      },
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get(
  "/select/members",
  auth.admin("members", "read"),
  async (req, res) => {
    try {
      const members = await Member.find({}, { name: 1, _id: 1 }).sort({
        "name.first.ar": 1,
      });
      res.send(members);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

// get admin TODO: not important
router.get("/admin/:id", auth.admin("users", "read"), async (req, res) => {
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

module.exports = router;
