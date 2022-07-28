const jwt = require("jsonwebtoken");
const Writer = require("../models/writer");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const writer = await Writer.findOne({ _id: decode._id, tokens: token });
    if (!writer) {
      return res.status(400).send("please log in");
    }
    req.writer = writer;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
