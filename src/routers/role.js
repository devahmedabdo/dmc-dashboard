const express = require("express");
const router = express.Router();
const Role = require("../models/role");
const auth = require("../middelware/auth");
const permissions = require("../middelware/roles");

// all role
router.get("/roles", auth.admin("roles", "manage"), async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const roles = await Role.aggregate([
      {
        $facet: {
          data: [{ $match: {} }, { $skip: skip }, { $limit: limit }],
          count: [{ $count: "total" }],
        },
      },
    ]);

    res.send({
      pagination: {
        page: page,
        limit: limit,
        total: roles[0].count.length ? roles[0].count[0].total : 0,
      },
      items: roles[0].data || [],
      permissions,
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post(
  "/role",
  auth.admin("roles", "add"), //TODO: uncomment this
  async (req, res) => {
    try {
      const role = await new Role(req.body);
      await role.save();
      // res.status(200).send(roles);
      res.status(200).send(role);
    } catch (error) {
      if (error.name === "ValidationError") {
        if (error.errors) {
          const validationErrors = {};
          for (const field in error.errors) {
            if (error.errors.hasOwnProperty(field)) {
              validationErrors[field] = {
                message: error.errors[field].message,
              };
            }
          }
          return res.status(422).send({ errors: validationErrors });
        } else {
          return res.status(422).send({ errors: { general: error.message } });
        }
      } else if (error.code === 11000) {
        // Duplicate key error
        const field = Object.keys(error.keyValue)[0];
        const duplicateError = {
          [field]: {
            message: `القيمة موجودة مسبقا `,
          },
        };
        return res.status(422).send({ errors: duplicateError });
      } else {
        return res.status(400).send(error);
      }
    }
  }
);
router.patch(
  "/role/:id",
  auth.admin("roles", "manage"), // TODO: uncomment this

  async (req, res) => {
    try {
      const role = await Role.findOne({ _id: req.params.id });
      console.log(role);
      if (!role) {
        return res.status(404).send("no role founded");
      }
      if (role.title == "ادمن") {
        return res.status(409).send("صلاحية الادمن غير قابلة للتعديل");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        role[e] = req.body[e];
      });

      await role.save();
      res.status(200).send({
        role,
      });
    } catch (e) {
      if (error.name === "ValidationError") {
        if (error.errors) {
          const validationErrors = {};
          for (const field in error.errors) {
            if (error.errors.hasOwnProperty(field)) {
              validationErrors[field] = {
                message: error.errors[field].message,
              };
            }
          }
          return res.status(422).send({ errors: validationErrors });
        } else {
          return res.status(422).send({ errors: { general: error.message } });
        }
      } else if (error.code === 11000) {
        // Duplicate key error
        const field = Object.keys(error.keyValue)[0];
        const duplicateError = {
          [field]: {
            message: `القيمة موجودة مسبقا `,
          },
        };
        return res.status(422).send({ errors: duplicateError });
      } else {
        return res.status(400).send(error);
      }
    }
  }
);
router.delete(
  "/role/:id",
  auth.admin("roles", "delete"), // TODO: uncomment this

  async (req, res) => {
    const role = await Role.findOneAndDelete({
      _id: req.params.id,
    });
    if (!role) {
      return res.status(404).send("no role founded");
    }
    res.status(200).send(role);
  }
);
// select
router.get(
  "/select/roles",
  auth.admin("roles", "manage"), // TODO: uncomment this
  async (req, res) => {
    try {
      const roles = await Role.find({}, { name: 1, _id: 1 });
      res.send(roles);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
module.exports = router;
