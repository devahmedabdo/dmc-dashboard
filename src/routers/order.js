const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middelware/auth");
// all Products
router.get(
  "/orders",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;
      const orders = await Order.find({ read: req.query.read })
        .skip(skip)
        .limit(limit)
        .populate("products.product")
        .exec();
      const total = await Order.countDocuments({ read: req.query.read });

      for (let i = 0; i < orders.length; i++) {
        await orders[i].populate("products.product");
      }
      res.send({
        orders,
        page,
        limit,
        total,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post(
  "/order",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const order = await new Order(req.body);
      await order.save();
      res.status(200).send(order);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.patch(
  "/order/:id",
  // auth.admin(["administrator"]), TODO: uncomment this
  async (req, res) => {
    try {
      const order = await Order.findOne({ _id: req.params.id });
      if (!order) {
        return res.status(404).send("no order founded");
      }
      order.read = true;
      await order.save();
      res.status(200).send({
        order,
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.delete(
  "/order/:id",
  // auth.admin(["administrator"]), TODO: uncomment this,
  async (req, res) => {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
    });
    if (!order) {
      return res.status(404).send("no order founded");
    }
    res.status(200).send(order);
  }
);
router.delete(
  "/orders",
  // auth.admin(["administrator"]), TODO: uncomment this,
  async (req, res) => {
    const orders = await Order.deleteMany({
      read: req.query.read,
    });
    if (!orders) {
      return res.status(404).send("no orders founded");
    }
    res.status(200).send(orders);
  }
);

module.exports = router;
