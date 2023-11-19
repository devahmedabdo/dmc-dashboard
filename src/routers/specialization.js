const express = require("express");
const router = express.Router();
const Specialization = require("../models/specialization");
const auth = require("../middelware/auth");
// all specialization
router.get(
  "/specializations",
  auth.admin("specialization", "manage"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;

      const specialization = await Specialization.aggregate([
        {
          $facet: {
            data: [{ $match: {} }, { $skip: skip }, { $limit: limit }],
            total: [{ $count: "count" }],
          },
        },
      ]);

      res.send({
        page,
        limit,
        total: specialization[0].total[0]?.count || 0,
        items: specialization[0].data || [],
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post(
  "/specialization",
  auth.admin("specialization", "add"),
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const specialization = await new Specialization(req.body);
      await specialization.save();
      res.status(200).send(specialization);
    } catch (e) {
      if (e.name == "ValidationError") {
        return res.status(422).send(e.errors);
      }
      res.status(400).send(e);
    }
  }
);
router.patch(
  "/specialization/:id",
  auth.admin("specialization", "manage"),
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const specialization = await Specialization.findOne({
        _id: req.params.id,
      });
      console.log(specialization);
      if (!specialization) {
        return res.status(404).send("no specialization founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        specialization[e] = req.body[e];
      });

      await specialization.save();
      res.status(200).send({
        specialization,
      });
    } catch (e) {
      if (e.name == "ValidationError") {
        return res.status(422).send(e.errors);
      }
      res.status(400).send(e);
    }
  }
);
router.delete(
  "/specialization/:id",
  auth.admin("specialization", "delete"),
  // auth.admin(["administrator"]), TODO: uncomment this,
  async (req, res) => {
    const specialization = await Specialization.findOneAndDelete({
      _id: req.params.id,
    });
    if (!specialization) {
      return res.status(404).send("no specialization founded");
    }
    res.status(200).send(specialization);
  }
);
router.get(
  "/select/specializations",
  auth.admin("specialization", "manage"),
  async (req, res) => {
    try {
      const specialization = await Specialization.find({}, { name: 1, _id: 1 });
      res.send(specialization);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
module.exports = router;
