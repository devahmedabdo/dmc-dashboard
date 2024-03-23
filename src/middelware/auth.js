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
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findOne({ _id: decode._id, tokens: token });
      if (!admin) {
        return res.status(401).send("please log in");
      }
      await admin.populate("role");

      if (
        !admin.role.permissions.includes(roles[permission].permissions[type].id)
      ) {
        return res.status(402).send("ليس لديك صلاحية للوصول لهذا المحتوى");
      }
      req.admin = admin;
      req.token = token;
      next();
    } catch (e) {
      console.log(e);
      res.status(401).send("خطأ في المصادقة يرجي تسجيل الدخول مجددا");
    }
  };
};

module.exports = { member, admin };
