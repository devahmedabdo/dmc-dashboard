const express = require("express");
const router = express.Router();
const Convoy = require("../models/convoy");
const Member = require("../models/member");
const { ObjectId } = require("mongodb");
const auth = require("../middelware/auth");
const { remove, uploud } = require("../services/uploder");
const handle = require("../services/errorhandler");
// add convoy
router.post("/convoy", auth.admin("convoys", "add"), async (req, res) => {
  try {
    const convoy = await new Convoy(req.body);
    await convoy.save();
    if (req.body.participations?.length) {
      for (let i = 0; i < req.body.participations?.length; i++) {
        const member = await Member.findById(req.body.participations[i]);
        member.convoys.push(convoy._id);
        await member.save();
      }
    }
    convoy.photos = await uploud("convoys", req.body?.newPhotos);
    await convoy.save();
    res.status(200).send(convoy);
  } catch (e) {
    handle(e);
  }
});

// for website
router.get("/activeConvoys", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const convoys = await Convoy.aggregate([
      {
        $match: {
          status: "1",
        },
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                description: 1,
                numbers: 1,
              },
            },
            {
              $lookup: {
                from: "specializations",
                localField: "numbers.specialization",
                foreignField: "_id",
                as: "numbersData",
              },
            },
            {
              $addFields: {
                numbers: {
                  $map: {
                    input: "$numbers",
                    as: "specialization",
                    in: {
                      $mergeObjects: [
                        "$$specialization",
                        {
                          specialization: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: "$numbersData",
                                  as: "p",
                                  cond: {
                                    $eq: [
                                      "$$p._id",
                                      "$$specialization.specialization",
                                    ],
                                  },
                                },
                              },
                              0,
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);

    res.send({
      items: convoys[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: convoys[0].count.length ? convoys[0].count[0].count : 0,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
router.get("/convoys", auth.admin("convoys", "read"), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const convoys = await Convoy.aggregate([
      {
        $match: {
          status: req.query.status,
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: "count" }],
        },
      },
    ]);
    for (let i = 0; i < convoys[0].data.length; i++) {
      const members = await Member.find(
        { convoys: convoys[0].data[i]._id },
        { _id: 1 }
      );
      convoys[0].data[i].members = members;
    }
    res.send({
      items: convoys[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: convoys[0].count.length ? convoys[0].count[0].count : 0,
      },
    });
  } catch (e) {
    res.status(400).send(e);
  }
});
// get convoy details
router.get("/convoy/:id", async (req, res) => {
  try {
    const limit = +process.env.LIMIT_OF_USER;

    const id = req.params.id;
    let convoy = await Convoy.findOne({
      _id: id,
    });

    if (!convoy) {
      return res.status(404).send(`Convoy dosn't exist`);
    }

    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: "3",
          convoys: { $in: [ObjectId(id)] },
        },
      },
      {
        $facet: {
          data: [
            { $skip: 0 },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                image: 1,
                socialAccounts: 1,
                showImg: 1,
                convoys: 1,
                committee: 1,
                joinDate: 1,
              },
            },
            {
              $lookup: {
                from: "committees",
                localField: "committee",
                foreignField: "_id",
                as: "committee",
              },
            },
            {
              $unwind: "$committee",
            },
          ],
          count: [{ $count: "total" }],
        },
      },
    ]);
    members[0].data.forEach((member) => {
      if (!member.showImg) {
        member.image = "";
      }
      delete member.showImg;
    });
    await convoy.populate("numbers.specialization");
    await convoy.populate("collaborators");
    await convoy.populate("collaborators.specialization");
    await convoy.populate({
      path: "forwards.doctor",
      select: "name specialization",
    });
    await convoy.populate({
      path: "forwards.doctor.specialization",
      select: "name icon",
    });
    convoy.members = members[0].data;

    collabs = {};
    forwards = {};

    convoy.collaborators.forEach((coll) => {
      if (collabs[coll.specialization.name + "*" + coll.specialization.icon]) {
        collabs[coll.specialization.name + "*" + coll.specialization.icon].push(
          coll.name
        );
      } else {
        collabs[coll.specialization.name + "*" + coll.specialization.icon] = [
          coll.name,
        ];
      }
    });
    convoy.forwards.forEach((coll) => {
      if (
        forwards[
          coll.doctor.specialization.name +
            "*" +
            coll.doctor.specialization.icon
        ]
      ) {
        forwards[
          coll.doctor.specialization.name +
            "*" +
            coll.doctor.specialization.icon
        ].push({
          doctor: coll.doctor.name,
          total: coll.total,
        });
      } else {
        forwards[
          coll.doctor.specialization.name +
            "*" +
            coll.doctor.specialization.icon
        ] = [
          {
            doctor: coll.doctor.name,
            total: coll.total,
          },
        ];
      }
    });
    let convoyCollaborators = [];
    let convoyForwards = [];

    Object.keys(collabs).forEach((key) => {
      convoyCollaborators.push({
        title: key.split("*")[0],
        icon: key.split("*")[1],
        doctors: collabs[key],
      });
    });
    Object.keys(forwards).forEach((key) => {
      convoyForwards.push({
        title: key.split("*")[0],
        icon: key.split("*")[1],
        doctors: forwards[key],
      });
    });
    res.status(200).send({
      convoy,
      convoyCollaborators,
      convoyForwards,
      members: members[0].data,
      pagination: {
        page: 1,
        limit: limit,
        total: members[0].count.length ? members[0].count[0].total : 0,
      },
    });
  } catch (e) {
    res.status(401).send("401" + e);
  }
});
// get convoy member pagination
router.get("/convoy/members-card/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT_OF_USER;
    const skip = (page - 1) * limit;

    const members = await Member.aggregate([
      {
        $match: {
          card: true,
          status: "3",
          convoys: { $in: [ObjectId(id)] },
        },
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 1,
                name: 1,
                image: 1,
                socialAccounts: 1,
                showImg: 1,
                committee: 1,
                joinDate: 1,
              },
            },
            {
              $lookup: {
                from: "committees",
                localField: "committee",
                foreignField: "_id",
                as: "committee",
              },
            },
            {
              $unwind: "$committee",
            },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);

    members[0].data.forEach((member) => {
      if (!member.showImg) {
        member.image = "";
      }
    });

    res.send({
      items: members[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: members[0].count.length ? members[0].count[0].count : 0,
      },
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
      remove(convoy.photos);

      const members = await Member.find({ convoys: convoy._id });
      for (let i = 0; i < members.length; i++) {
        let index = members[i].convoys.indexOf(convoy._id);
        members[i].convoys.splice(index, 1);
        await members[i].save();
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
  auth.admin("convoys", "write"),
  async (req, res) => {
    try {
      let convoyID = req.params.id;
      const convoy = await Convoy.findOne({
        _id: convoyID,
      });
      const clonedconvoy = JSON.parse(JSON.stringify(convoy));
      const updates = Object.keys(req.body);
      if (!convoy) {
        return res.status(404).send(`convoy dosn't exist`);
      }
      updates.forEach((e) => {
        convoy[e] = req.body[e];
      });
      await convoy.save();

      const members = await Member.find({ convoys: convoyID });
      for (let i = 0; i < members.length; i++) {
        if (!convoy.participations.includes(members[i]._id)) {
          // we shuold remove the convoys id from member
          let index = members[i].convoys.indexOf(convoyID);
          members[i].convoys.splice(index, 1);
          await members[i].save();
        }
      }

      if (convoy.participations?.length) {
        for (let i = 0; i < convoy.participations.length; i++) {
          const member = await Member.findById(req.body.participations[i]); // search to member
          if (
            !member.convoys.includes(convoyID) // member not have this convoy
          ) {
            // i added member
            member.convoys.push(convoy._id);
          }
          await member.save();
        }
      }
      if (req.body?.newPhotos) {
        req.body.photos.push(...(await uploud("convoys", req.body?.newPhotos)));
      }
      const deletedPhotos = clonedconvoy.photos.filter((ele) => {
        return !req.body.photos.includes(ele);
      });
      await remove(deletedPhotos);
      updates.forEach((e) => {
        convoy[e] = req.body[e];
      });
      await convoy.save();
      res.status(201).send(convoy);
    } catch (e) {
      console.log(e);
      if (e.name == "ValidationError") {
        return res.status(422).send(e.errors);
      }
      res.status(400).send(e);
    }
  }
);
router.get("/select/convoys", async (req, res) => {
  try {
    let convoys = await Convoy.find(
      { status: "1" },
      { id: 1, description: { address: 1 } }
    );
    res.status(200).send(convoys);
  } catch (e) {
    res.status(400).send(e);
  }
});
module.exports = router;
