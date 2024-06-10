const express = require("express");
const router = express.Router();
const Config = require("../models/config");
const Convoy = require("../models/convoy");
const Project = require("../models/project");
const auth = require("../middelware/auth");
// all
router.get("/config", async (req, res) => {
  try {
    const config = await Config.findOne({});
    if (!config) {
      return res.status(404).send("no gonfig yet");
    }

    let convoys = await Convoy.countDocuments({
      status: "1",
    });
    let projects = await Project.countDocuments({
      status: true,
    });

    const numbers = [
      {
        name: "قوافل طبية",
        number: convoys,
        icon: "ambulance",
      },
      // {
      //   name: "مقالات طبية",
      //   number: 20,
      //   icon: "document",
      // },
      {
        name: "حالات رعاية",
        number: config.numberOfPatient,
        icon: "fever",
      },
      {
        name: "مشاريع خيرية",
        number: projects,
        icon: "suitcase",
      },
    ];

    res.send({ config, numbers });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get(
  "/panel/config",
  auth.admin("settings", "read"),
  async (req, res) => {
    try {
      const config = await Config.findOne({});
      if (!config) {
        return res.status(404).send("no gonfig yet");
      }

      res.send(config);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.put(
  "/config",
  auth.admin("settings", "write"), // TODO: uncomment this
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
      if (e.name == "ValidationError") {
        return res.status(422).send(e.errors);
      }
      res.status(400).send(e);
    }
  }
);

module.exports = router;
