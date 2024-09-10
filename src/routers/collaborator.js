const express = require("express");
const router = express.Router();
const Collaborator = require("../models/collaborator");
const auth = require("../middelware/auth");
// all collaborator
router.get(
  "/collaborators",
  auth.admin("collaborators", "read"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;
      const collaborators = await Collaborator.aggregate([
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $addFields: {
                  responsibleExists: { $ifNull: ["$responsible", false] },
                },
              },
              {
                $lookup: {
                  from: "members",
                  localField: "responsible",
                  foreignField: "_id",
                  as: "responsible",
                },
              },
              {
                $lookup: {
                  from: "specializations",
                  localField: "specialization",
                  foreignField: "_id",
                  as: "specialization",
                },
              },
              {
                $unwind: {
                  path: "$responsible",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $unwind: {
                  path: "$specialization",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  responsible: {
                    $cond: {
                      if: "$responsibleExists",
                      then: "$responsible",
                      else: null,
                    },
                  },
                  specialization: 1,
                  name: 1,
                  personalPhone: 1,
                  phone: 1,
                  address: 1,
                  // Add other fields you want to include in the result
                },
              },
            ],
            total: [{ $count: "count" }],
          },
        },
      ]);
      res.send({
        page,
        limit,
        total: collaborators[0].total[0]?.count || 0,
        items: collaborators[0].data || [],
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post(
  "/collaborator",
  auth.admin("collaborators", "add"),
  async (req, res) => {
    try {
      const collaborator = await new Collaborator(req.body);
      await collaborator.save();
      res.status(200).send(collaborator);
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
  "/collaborator/:id",
  auth.admin("collaborators", "write"),

  async (req, res) => {
    try {
      const collaborator = await Collaborator.findOne({ _id: req.params.id });
      if (!collaborator) {
        return res.status(404).send({ messagae: "الطبيب غير موجود" });
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        collaborator[e] = req.body[e];
      });

      await collaborator.save();
      res.status(200).send({
        collaborator,
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
  "/collaborator/:id",
  auth.admin("collaborators", "delete"),

  async (req, res) => {
    const collaborator = await Collaborator.findOneAndDelete({
      _id: req.params.id,
    });
    if (!collaborator) {
      return res.status(404).send({ messagae: "الطبيب غير موجود" });
    }
    res.status(200).send(collaborator);
  }
);

router.get(
  "/select/collaborators",
  auth.admin("collaborators", "read"),
  async (req, res) => {
    try {
      const collaborators = await Collaborator.find(
        {},
        { _id: 1, name: 1 }
      ).sort({ specialization: 1 });
      res.send(collaborators);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
module.exports = router;
