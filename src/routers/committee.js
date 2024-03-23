const express = require("express");
const router = express.Router();
const Committee = require("../models/committee");
const auth = require("../middelware/auth");
const Member = require("../models/member");
// all committee
router.get(
  "/committees",
  auth.admin("committees", "read"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;

      const committees = await Committee.aggregate([
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: "total" }],
          },
        },
      ]);
      for (let i = 0; i < committees[0].data.length; i++) {
        const members = await Member.find(
          { committee: committees[0].data[i]._id },
          { _id: 1 }
        );
        committees[0].data[i].members = members;
      }

      res.send({
        pagination: {
          page: page,
          limit: limit,
          total: committees[0].count.length ? committees[0].count[0].total : 0,
        },
        items: committees[0].data || [],
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post("/committee", auth.admin("committees", "add"), async (req, res) => {
  try {
    const committee = await new Committee(req.body);
    await committee.save();
    res.status(200).send(committee);
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
router.patch(
  "/committee/:id",
  auth.admin("committees", "write"),
  async (req, res) => {
    try {
      const committee = await Committee.findOne({
        _id: req.params.id,
      });

      if (!committee) {
        return res.status(404).send("no committee founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        committee[e] = req.body[e];
      });

      await committee.save();
      res.status(200).send({
        committee,
      });
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
  }
);
router.delete(
  "/committee/:id",
  auth.admin("committees", "delete"),
  async (req, res) => {
    const committee = await Committee.findById(req.params.id);
    if (!committee) {
      return res.status(404).send({ message: "التخصص لم يعد موجودا" });
    }
    const members = await Member.find({
      committee: committee._id,
    });
    if (members.length) {
      return res
        .status(409)
        .send({ message: "لا يمكن حذف اللجنة طالما بها اعضاء" });
    }
    await Committee.findOneAndDelete({
      _id: req.params.id,
    });

    res.status(200).send(committee);
  }
);

router.get("/select/committees", async (req, res) => {
  try {
    const committee = await Committee.find({}, { name: 1, _id: 1 });
    res.send(committee);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
module.exports = router;
