const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const auth = require("../middelware/auth");
const mongoose = require("mongoose");
const { remove, uploud } = require("../services/uploder");
const handle = require("../services/errorhandler");
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
      { $match: { status: true } },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                date: 1,
                title: 1,
                _id: 1,
                address: 1,
              },
            },
          ],
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
router.get("/project/:id", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    let project = await Project.findOne(
      {
        _id: id,
      },
      { status: 0 }
    );

    if (!project) {
      return res.status(404).send(`project dosn't exist`);
    }
    const more = await Project.aggregate([
      { $match: { _id: { $ne: id }, status: true } },
      { $sample: { size: 4 } },
      {
        $project: {
          date: 1,
          title: 1,
          _id: 1,
          address: 1,
        },
      },
    ]);

    res.send({ project, more });
  } catch (e) {
    console.log(e);
    res.status(400).send({ e });
  }
});
router.post("/project", auth.admin("projects", "add"), async (req, res) => {
  try {
    const project = await new Project(req.body);
    await project.save();
    project.photos = await uploud("projects", req.body?.newPhotos);
    await project.save();
    res.status(200).send(project);
  } catch (e) {
    handle(e, res);
  }
});
router.patch(
  "/project/:id",
  auth.admin("projects", "write"),

  async (req, res) => {
    try {
      const project = await Project.findOne({ _id: req.params.id });
      const clonedproject = JSON.parse(JSON.stringify(project));
      const updates = Object.keys(req.body);
      if (!project) {
        return res.status(404).send({ message: "المشروع غير موجود" });
      }

      updates.forEach((e) => {
        project[e] = req.body[e];
      });
      await project.save();

      if (req.body?.newPhotos?.length) {
        req.body.photos.push(
          ...(await uploud("projects", req.body?.newPhotos))
        );
        const deletedPhotos = clonedproject.photos.filter((ele) => {
          return !req.body.photos.includes(ele);
        });
        await remove(deletedPhotos);
        updates.forEach((e) => {
          convoy[e] = req.body[e];
        });
        await project.save();
      }

      res.status(200).send(project);
    } catch (e) {
      console.log(e);
      handle(e, res);
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
    remove(project.photos);

    res.status(200).send(project);
  }
);

module.exports = router;
