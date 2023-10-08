const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middelware/auth");
// all Products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send(products);
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
    } catch (e) {
      res.status(400).send(e.message);
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
