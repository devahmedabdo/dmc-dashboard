const express = require("express");
const router = express.Router();
const Collaborator = require("../models/collaborator");
const auth = require("../middelware/auth");
// all collaborator
router.get("/collaborator", auth.admin([]), async (req, res) => {
  try {
    const collaborators = await Collaborator.find({});
    res.status(200).send(collaborators);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post(
  "/collaborator",
  // auth.admin(["administrator"]), TODO: uncomment this
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
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const collaborator = await Collaborator.find({ _id: req.params.id });
      if (!collaborator) {
        return res.status(404).send("no collaborator founded");
      }
      const updates = Object.keys(req.body);

      updates.forEach((e) => {
        collaborator[e] = req.body[e];
      });

      await collaborator.save();
      // res.status(200).send(updates);
      res.status(200).send({
        body: req.body,
        collaborator,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.delete(
  "/collaborator/:id",
  // auth.admin(["administrator"]), TODO: uncomment this,
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

module.exports = router;
