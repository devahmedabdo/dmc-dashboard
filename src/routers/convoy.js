const express = require("express");
const router = express.Router();
const Convoy = require("../models/convoy");
const Member = require("../models/member");
const { ObjectId } = require("mongodb");
const auth = require("../middelware/auth");
// add convoy
router.post(
  "/convoy",
  auth.admin("convoys", "add"),

  async (req, res) => {
    try {
      const convoy = await new Convoy(req.body);
      console.log(req.body);
      await convoy.save();
      res.status(200).send(convoy);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

router.get("/convoys", async (req, res) => {
  try {
    let convoys = await Convoy.find({});
    // convoys.populate();
    for (let i = 0; i < convoys.length; i++) {
      await convoys[i].populate("collaborators");
      await convoys[i].populate("forwards.doctor");
    }
    res.status(200).send(convoys);
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
// get convoy details
router.get("/convoy/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const limit = +process.env.LIMIT;

    const convoy = await Convoy.findOne({
      _id: id,
    });

    if (!convoy) {
      return res.status(404).send(`Convoy dosn't exist`);
    }

    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: true,
          convoys: { $in: [ObjectId(id)] },
        },
      },
      {
        $facet: {
          data: [{ $limit: limit }],
          count: [{ $count: "total" }],
        },
      },
    ]);
    members[0].data.forEach((member) => {
      if (!member.showImg) {
        member.image = "";
      }
    });
    convoy.members = members;
    // TODO: Uncomment bellow lines
    // await convoy.populate("collaborators");
    // await convoy.populate("forwards.doctor");
    res.status(200).send(convoy);
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
// get convoy member pagination
router.get("/convoy/members-card/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: true,
          convoys: { $in: [ObjectId(id)] },
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: "total" }],
        },
      },
    ]);

    members[0].data.forEach((member) => {
      if (!member.showImg) {
        member.image = "";
      }
    });

    res.send({
      page,
      limit,
      total: members[0].count[0].total,
      members: members[0].data,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
// delete convoy
router.delete(
  "/convoy/:id",
  auth.admin("convoys", "delete"),

  async (req, res) => {
    try {
      const convoy = await Convoy.findOneAndDelete({
        _id: req.params.id,
      });
      if (!convoy) {
        return res.status(404).send(`convoy dosn't exist`);
      }
      res.status(200).send(convoy);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
// update convoy
router.patch(
  "/convoy/:id",
  auth.admin("convoys", "manage"),

  async (req, res) => {
    try {
      const convoy = await Convoy.findOne({
        _id: req.params.id,
      });
      if (!convoy) {
        return res.status(404).send(`convoy dosn't exist`);
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        convoy[e] = req.body[e];
      });

      await convoy.save();
      res.status(201).send(convoy);
    } catch (e) {
      res.status(400).send(e);
    }
  }
);
router.get("/select/convoys", async (req, res) => {
  try {
    let convoys = await Convoy.find({}, { id: 1, description: 1 });
    res.status(200).send(convoys);
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
module.exports = router;
