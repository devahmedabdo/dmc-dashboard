const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decode._id, tokens: token });
    if (!admin) {
      return res.status(400).send("please log in");
    }
    req.admin = admin;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};
const admin = (roles) => {
  console.log(roles);
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findOne({ _id: decode._id, tokens: token });
      if (!admin) {
        return res.status(400).send("please log in");
      }
      if (!roles.includes(admin.role) && admin.role !== "administrator") {
        return res
          .status(403)
          .send("your role doesn't have the permission for this action");
      }
      req.admin = admin;
      req.token = token;
      next();
    } catch (e) {
      res.status(401).send({ error: "Please Authenticate" });
    }
  };
};

// const checkRole = (roles, adminRole) => {
//   if (adminRole === "administrator" || roles.includes(adminRole)) {
//     return true;
//   }
//   return false;
// };
module.exports = { auth, admin };
