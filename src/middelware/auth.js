const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const Member = require("../models/member");
const roles = require("../middelware/roles");

const member = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const member = await Member.findOne({ _id: decode._id, tokens: token });
    if (!member) {
      return res.status(403).send("please log in");
    }
    req.member = member;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send("خطأ في المصادقة يرجي تسجيل الدخول مجددا");
  }
};

const admin = (permission, type) => {
  // required roles exp [1]
  // console.log(roles);
  return async (req, res, next) => {
    try {
      next();
      return;
      const token = req.header("Authorization").replace("Bearer ", "");
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findOne({ _id: decode._id, tokens: token });
      if (!admin) {
        return res.status(403).send("please log in");
      }
      await admin.populate("role");
      // console.log(admin);
      // console.log(roles[permission].permissions[type]);

      if (
        !admin.role.permissions.includes(roles[permission].permissions[type].id)
      ) {
        return res
          .status(401)
          .send("your role doesn't have the permission for this action");
      }
      req.admin = admin;
      req.token = token;
      next();
    } catch (e) {
      res.status(401).send("خطأ في المصادقة يرجي تسجيل الدخول مجددا");
    }
  };
};

// old
// const admin = (roles) => {
//   // required roles exp [1]
//   console.log(roles);
//   return async (req, res, next) => {
//     try {
//       const token = req.header("Authorization").replace("Bearer ", "");
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       const admin = await Admin.findOne({ _id: decode._id, tokens: token });
//       if (!admin) {
//         return res.status(403).send("please log in");
//       }
//       // lets say admin role = [22,34,56]
//       if (
//         !roles.includes(admin.role) &&
//         admin.role !== "administrator" && // 0 means its allow all admin
//         roles.length > 0 // 0 means its allow all admin
//       ) {
//         return res
//           .status(403)
//           .send("your role doesn't have the permission for this action");
//       }
//       if (
//         !roles.includes(admin.role) &&
//         admin.role !== "administrator" && // 0 means its allow all admin
//         roles.length > 0 // 0 means its allow all admin
//       ) {
//         return res
//           .status(403)
//           .send("your role doesn't have the permission for this action");
//       }
//       req.admin = admin;
//       req.token = token;
//       next();
//     } catch (e) {
//       res.status(401).send({ error: "Please Authenticate" });
//     }
//   };
// };

module.exports = { member, admin };
