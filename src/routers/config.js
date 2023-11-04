const express = require("express");
const router = express.Router();
const Config = require("../models/config");
const auth = require("../middelware/auth");
// all
router.get("/config", async (req, res) => {
  try {
    const config = await Config.findOne({});
    if (!config) {
      return res.status(404).send("no gonfig yet");
    }
    res.send(config);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.put(
  "/config",
  auth.admin("settings", "upgrade"), // TODO: uncomment this
  async (req, res) => {
    try {
      let config = await Config.findOne({});
      if (!config) {
        config = await new Config(req.body);
        await config.save();
        return res.status(201).send(config);
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        config[e] = req.body[e];
      });
      await config.save();
      res.status(200).send(config);
    } catch (e) {
      res.status(400).send("e.message");
    }
  }
);

module.exports = router;
