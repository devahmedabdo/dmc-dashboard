const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const auth = require("../middelware/auth");
// all Products
router.get(
  "/orders",
  auth.admin("orders", "read"),

  async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +process.env.LIMIT;
      const skip = (page - 1) * limit;
      const orders = await Order.aggregate([
        {
          $match: {
            status: req.query.status || 0,
          },
        },
        {
          $facet: {
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $lookup: {
                  from: "products",
                  localField: "products.product",
                  foreignField: "_id",
                  as: "productsData",
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                  email: 1,
                  phone: 1,
                  phone_2: 1,
                  city: 1,
                  street: 1,
                  status: 1,
                  products: {
                    $map: {
                      input: "$products",
                      as: "product",
                      in: {
                        $mergeObjects: [
                          "$$product",
                          {
                            product: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: "$productsData",
                                    as: "p",
                                    cond: {
                                      $eq: ["$$p._id", "$$product.product"],
                                    },
                                  },
                                },
                                0,
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            ],
            count: [{ $count: "count" }],
          },
        },
      ]);

      res.send({
        items: orders[0].data,
        pagination: {
          page: page,
          limit: limit,
          total: orders[0].count.length ? orders[0].count[0].count : 0,
        },
      });
    } catch (e) {
      res.status(400).send(e.message);
    }
  }
);
router.post("/order", async (req, res) => {
  try {
    const order = await new Order(req.body);
    await order.save();
    //  TODO: send Email to user
    res.status(200).send(order);
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
router.patch("/order/:id", auth.admin("orders", "write"), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      return res.status(404).send("no order founded");
    }
    // TODO: send email to user
    order.status = req.body.status;
    await order.save();
    res.status(200).send({
      order,
    });
  } catch (e) {
    if (e.name == "ValidationError") {
      return res.status(422).send(e.errors);
    }
    res.status(400).send(e);
  }
});
router.delete(
  "/order/:id",
  auth.admin("orders", "delete"),
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
  auth.admin("orders", "delete"),

  async (req, res) => {
    const orders = await Order.deleteMany({
      status: 2,
    });
    if (!orders) {
      return res.status(404).send("no orders founded");
    }
    res.status(200).send(orders);
  }
);

module.exports = router;
