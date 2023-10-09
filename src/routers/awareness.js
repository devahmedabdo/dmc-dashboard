const express = require("express");
const router = express.Router();
const Awareness = require("../models/awareness");
const auth = require("../middelware/auth");
// all awareness
router.get("/awareness", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const awareness = await Awareness.aggregate([
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
      total: awareness[0].total[0]?.count || 0,
      awareness: awareness[0].data || [],
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post(
  "/awareness",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const awareness = await new Awareness(req.body);
      await awareness.save();
      res.status(200).send(awareness);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.patch(
  "/awareness/:id",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const awareness = await Awareness.findOne({ _id: req.params.id });
      console.log(awareness);
      if (!awareness) {
        return res.status(404).send("no awareness founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        awareness[e] = req.body[e];
      });

      await awareness.save();
      res.status(200).send({
        awareness,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.delete(
  "/awareness/:id",
  // auth.admin(["administrator"]), TODO: uncomment this,
  async (req, res) => {
    const awareness = await Awareness.findOneAndDelete({
      _id: req.params.id,
    });
    if (!awareness) {
      return res.status(404).send("no awareness founded");
    }
    res.status(200).send(awareness);
  }
);

module.exports = router;
