const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const auth = require("../middelware/auth");
const handle = require("../services/errorhandler");
const { uploud, remove } = require("../services/uploder");
// all Products
router.get("/products", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +process.env.LIMIT_OF_USER;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      {
        $facet: {
          data: [
            {
              $match: {
                status: "1",
              },
            },
            {
              $project: {
                // Include only the fields you need
                name: 1,
                photos: 1,
                price: 1,
                disscount: 1,
                // Add other fields as needed
              },
            },
            { $skip: skip },
            { $limit: limit },
          ],
          count: [{ $count: "count" }],
        },
      },
    ]);

    for (let i = 0; i < products[0].data.length; i++) {
      if (products[0].data[i].photos.length > 2)
        products[0].data[i].photos.length = 2;
    }

    res.send({
      items: products[0].data,
      pagination: {
        page: page,
        limit: limit,
        total: products[0].count.length ? products[0].count[0].count : 0,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});
// all Products
router.get("/product/:id", async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);

    const product = await Product.findOne(
      {
        _id: id,
        status: "1",
      },
      {
        status: 0,
        __v: 0,
      }
    );

    if (!product) {
      return res.status(404).send(`Product dosn't exist`);
    }
    const more = await Product.aggregate([
      { $match: { _id: { $ne: id }, status: "1" } },
      { $sample: { size: 4 } },
    ]);

    for (let i = 0; i < more.length; i++) {
      if (more[i].photos.length > 2) more[i].photos.length = 2;
    }

    res.send({ product, more });
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});
router.get(
  "/panel/products",
  auth.admin("gallery", "read"),
  async (req, res) => {
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
  }
);
router.post("/product", auth.admin("gallery", "add"), async (req, res) => {
  try {
    const product = await new Product(req.body);
    await product.save();
    if (req.body?.newPhotos?.length) {
      product.photos = await uploud("products", req.body?.newPhotos);
      await product.save();
    }
    res.status(200).send({ product });
  } catch (error) {
    handle(error, res);
  }
});
router.patch(
  "/product/:id",
  auth.admin("gallery", "write"),
  async (req, res) => {
    try {
      const product = await Product.findOne({ _id: req.params.id });
      const clonedProd = JSON.parse(JSON.stringify(product));
      if (!product) {
        return res.status(404).send("no product founded");
      }
      const updates = Object.keys(req.body);
      updates.forEach((e) => {
        product[e] = req.body[e];
      });
      await product.save();

      req.body.photos.push(...(await uploud("products", req.body?.newPhotos)));
      const deletedPhotos = clonedProd.photos.filter((ele) => {
        return !req.body.photos.includes(ele);
      });
      await remove(deletedPhotos);
      updates.forEach((e) => {
        product[e] = req.body[e];
      });
      await product.save();
      res.status(200).send(product);
    } catch (error) {
      handle(error, res);
    }
  }
);
router.delete(
  "/product/:id",
  auth.admin("gallery", "delete"),
  async (req, res) => {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).send("no product founded");
    }
    remove(product.photos);
    res.status(200).send(product);
  }
);

module.exports = router;
