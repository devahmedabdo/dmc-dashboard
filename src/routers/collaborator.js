const express = require("express");
const router = express.Router();
const Collaborator = require("../models/collaborator");
const auth = require("../middelware/auth");
// all collaborator
router.get(
  "/collaborators",
  auth.admin("collaporator", "manage"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;

      const collaborators = await Collaborator.aggregate([
        {
          $facet: {
            data: [
              { $match: {} },
              { $skip: skip },
              { $limit: limit },
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
              { $unwind: "$responsible" },
              { $unwind: "$specialization" },
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
      // await collaborators.populate("specialization");
      // await collaborators.populate("responsible");
      // const collaborators = await Collaborator.find({});

      // // await collaborators.populate("specialization");
      // // await collaborators.populate("responsible");
      // res.status(200).send(collaborators);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post(
  "/collaborator",
  auth.admin("collaporator", "add"),

  async (req, res) => {
    try {
      const collaborator = await new Collaborator(req.body);
      await collaborator.save();
      res.status(200).send(collaborator);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.patch(
  "/collaborator/:id",
  auth.admin("collaporator", "manage"),

  async (req, res) => {
    try {
      const collaborator = await Collaborator.findOne({ _id: req.params.id });
      if (!collaborator) {
        return res.status(404).send("no collaborator founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        collaborator[e] = req.body[e];
      });

      await collaborator.save();
      res.status(200).send({
        collaborator,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.delete(
  "/collaborator/:id",
  auth.admin("collaporator", "delete"),

  async (req, res) => {
    const collaborator = await Collaborator.findOneAndDelete({
      _id: req.params.id,
    });
    if (!collaborator) {
      return res.status(404).send("no collaborator founded");
    }
    res.status(200).send(collaborator);
  }
);

router.get(
  "/select/collaborators",
  auth.admin("collaporator", "manage"),
  async (req, res) => {
    try {
      const collaborators = await Collaborator.find({}, { _id: 1, name: 1 });
      res.send(collaborators);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
module.exports = router;
