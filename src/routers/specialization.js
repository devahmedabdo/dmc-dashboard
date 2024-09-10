const express = require("express");
const router = express.Router();
const Specialization = require("../models/specialization");
const Collaborator = require("../models/collaborator");
const auth = require("../middelware/auth");
// all specialization
router.get(
  "/specializations",
  auth.admin("specializations", "read"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;

      const specializations = await Specialization.aggregate([
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: "total" }],
          },
        },
      ]);

      for (let i = 0; i < specializations[0].data.length; i++) {
        const collaborators = await Collaborator.find(
          { specialization: specializations[0].data[i]._id },
          { _id: 1 }
        );
        specializations[0].data[i].collaborators = collaborators;
      }

      res.send({
        pagination: {
          page: page,
          limit: limit,
          total: specializations[0].count.length
            ? specializations[0].count[0].total
            : 0,
        },
        items: specializations[0].data || [],
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post(
  "/specialization",
  auth.admin("specializations", "add"),
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const specialization = await new Specialization(req.body);
      await specialization.save();
      res.status(200).send(specialization);
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
router.patch(
  "/specialization/:id",
  auth.admin("specializations", "write"),
  // auth.admin(["administrator"]), TODO: uncomment this *ngIf="!special.collaborators.length"
  async (req, res) => {
    try {
      const specialization = await Specialization.findOne({
        _id: req.params.id,
      });

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
  "/specialization/:id",
  auth.admin("specializations", "delete"),
  async (req, res) => {
    const specialization = await Specialization.findById(req.params.id);
    if (!specialization) {
      return res.status(404).send({ message: "التخصص لم يعد موجودا" });
    }
    const collaborators = await Collaborator.find({
      specialization: specialization._id,
    });
    if (collaborators.length) {
      return res
        .status(409)
        .send({ message: "لا يمكن حذف التخصص طالما به اطباء" });
    }
    await Specialization.findOneAndDelete({
      _id: req.params.id,
    });

    res.status(200).send(specialization);
  }
);
router.get(
  "/select/specializations",
  auth.admin("specializations", "read"),
  async (req, res) => {
    try {
      const specialization = await Specialization.find(
        {},
        { name: 1, _id: 1 }
      ).sort({
        name: 1,
      });
      res.send(specialization);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
module.exports = router;
