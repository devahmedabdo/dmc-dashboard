const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const auth = require("../middelware/auth");
// all project admins
router.get(
  "/panel/projects",
  auth.admin("projects", "read"),
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;
      const project = await Project.aggregate([
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            count: [{ $count: "count" }],
          },
        },
      ]);

      res.send({
        items: project[0].data || [],
        pagination: {
          page: page,
          limit: limit,
          total: project[0].count.length ? project[0].count[0].count : 0,
        },
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
// all project website
router.get("/projects", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;
    const project = await Project.aggregate([
      { $match: { status: req.query.status } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          count: [{ $count: "count" }],
        },
      },
    ]);

    res.send({
      items: project[0].data || [],
      pagination: {
        page: page,
        limit: limit,
        total: project[0].count.length ? project[0].count[0].count : 0,
      },
    });
  } catch (e) {
    res.status(400).send({ e });
  }
});
router.post("/project", auth.admin("projects", "add"), async (req, res) => {
  try {
    const project = await new Project(req.body);
    await project.save();
    res.status(200).send(project);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.patch(
  "/project/:id",
  auth.admin("projects", "write"),

  async (req, res) => {
    try {
      const project = await Project.findOne({ _id: req.params.id });
      if (!project) {
        return res.status(404).send({ message: "المشروع غير موجود" });
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        project[e] = req.body[e];
      });
      await project.save();
      res.status(200).send({
        project,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.delete(
  "/project/:id",
  auth.admin("projects", "delete"),

  async (req, res) => {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
    });
    if (!project) {
      return res.status(404).send({ message: "المشروع غير موجود" });
    }
    res.status(200).send(project);
  }
);

module.exports = router;
