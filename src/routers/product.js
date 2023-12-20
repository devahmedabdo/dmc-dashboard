const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middelware/auth");
// all Products
router.get("/products", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $facet: {
          data: [
            {
              $match: {
                status: 1,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    res.send({
      items: products[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: products[0].count.length ? products[0].count[0].count : 0,
      },
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/panel/products", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $facet: {
          data: [
            {
              $match: {
                status: req.query.status || 0,
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);
    res.send({
      items: products[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: products[0].count.length ? products[0].count[0].count : 0,
      },
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.post(
  "/product",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const product = await new Product(req.body);
      await product.save();
      res.status(200).send(product);
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
            message: `The ${field} '${error.keyValue[field]}' is already in use.`,
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
  "/product/:id",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      if (!product) {
        return res.status(404).send("no product founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        product[e] = req.body[e];
      });

      await product.save();
      res.status(200).send({
        product,
      });
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
            message: `The ${field} '${error.keyValue[field]}' is already in use.`,
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
  "/product/:id",
  // auth.admin(["administrator"]), TODO: uncomment this,
  async (req, res) => {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).send("no product founded");
    }
    res.status(200).send(product);
  }
);

module.exports = router;
