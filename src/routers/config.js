const express = require("express");
const router = express.Router();
const Config = require("../models/config");
const auth = require("../middelware/auth");
// all awareness
router.get("/config", async (req, res) => {
  try {
    const config = await Config.findOne({});
    res.send(config);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.put(
  "/config/",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const config = await Config.findOne({ _id: req.params.id });
      console.log(config);
      if (!config) {
        return res.status(404).send("no config founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        config[e] = req.body[e];
      });

      await config.save();
      res.status(200).send({
        config,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);

module.exports = router;
