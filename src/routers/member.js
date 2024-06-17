const express = require("express");
const router = express.Router();

const Member = require("../models/member");
const auth = require("../middelware/auth");
const Config = require("../models/config");
const jwt = require("jsonwebtoken");
const mail = require("../statics/mail");
const Role = require("../models/role");
const Admin = require("../models/admin");

let getAdminEmails = async () => {
  let admins = [];
  // find all role related with member edit
  const roles = await Role.find({ permissions: 105 });
  for (let i = 0; i < roles.length; i++) {
    const relatedAdmins = await Admin.find({ role: roles[i]._id });
    admins.push(...relatedAdmins);
  }
  let emails = admins.map((admin) => {
    return admin.email;
  });
  return emails.join(",");
};
// member signup
router.post("/member", async (req, res) => {
  try {
    req.body.status = "1";
    const config = await Config.findOne({});
    if (!config || !config.acceptSignup) {
      return res.status(404).send({
        message: "عذرا تسجيل الاعضاء الجدد موقوف حاليا",
      });
    }

    !req.body.convoys ? (req.body.convoys = []) : "";
    const member = await new Member(req.body);
    const token = await member.generateToken();
    await member.save();

    mail.sendEmail("signup", {}, await getAdminEmails()).then((data) => {});

    res.status(201).send({ member, token });
  } catch (error) {
    if (error.name === "ValidationError") {
      if (error.errors) {
        const validationErrors = {};
        for (const field in error.errors) {
          if (error.errors.hasOwnProperty(field)) {
            validationErrors[field] = {
              message: error.errors[field].message,
            };
          }
        }
        return res.status(422).send(validationErrors);
      } else {
        return res.status(422).send({ errors: { general: error.message } });
      }
    } else if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyValue)[0];
      const duplicateError = {
        [field]: {
          message: `The ${field} '${error.keyValue[field]}' is already in use.`,
        },
      };
      return res.status(422).send(duplicateError);
    } else {
      return res.status(400).send(error);
    }
  }
});

// update member
router.patch("/member", auth.member, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    updates.forEach((e) => {
      req.member[e] = req.body[e];
    });
    sendMail = req.member.status == "3";
    req.member.status = "2";
    await req.member.save();

    if (sendMail)
      mail
        .sendEmail("member32", req.member, await getAdminEmails())
        .then((data) => {});

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
    // await member.populate("convoys");
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
    const limit = +process.env.LIMIT_OF_USER;
    const skip = (page - 1) * limit;
    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: "3",
        },
      },
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
            // {
            //   $project: {
            //     // // _id: 1,
            //     // name: 1,
            //     // image: 1,
            //     // socialAccounts: 1,
            //     // showImg: 1,
            //     // committee: 1,
            //     // joinDate: 1,
            //   },
            // },
          ],
          count: [{ $count: "total" }],
        },
      },
    ]);
    // TODO: hide img for some

    res.send({
      pagination: {
        page: page,
        limit: limit,
        total: members[0].count[0].total ? members[0].count[0].total : 0,
      },
      items: members[0].data,
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
      return res.status(422).send(`البريد الالكتروني غير موجود`);
    }
    // if member
    const token = await member.generateToken({ expireIn: "10m" });
    mail
      .sendEmail("resetPassword", { member, token }, member.email)
      .then((data) => {});

    res.status(200).send({ success: true });
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
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
      return res.status(404).send(`رابط غير صالح او منتهي`);
    }
    if (req.body.newPassword != req.body.confirmNewPassword) {
      return res.status(422).send(`كلمات المرور غير متطابقه`);
    }
    member.password = req.body.newPassword;
    member.tokens = [];
    await member.save();
    res.status(201).send(member);
  } catch (e) {
    console.log(e);
    res.status(400).send(`رابط غير صالح او منتهي`);
  }
});

module.exports = router;
