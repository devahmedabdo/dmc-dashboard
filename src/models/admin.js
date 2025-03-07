const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please Enter Valid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    validate(value) {
      let strongPassword = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      if (!strongPassword.test(value)) {
        throw new Error(
          "Password must include small and capital letter , symbols and numbers"
        );
      }
    },
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  tokens: [],
});

adminSchema.pre("save", async function () {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcryptjs.hash(admin.password, 8);
  }
});
adminSchema.statics.findByCredentials = async function (email, password) {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Error("خطأ في البريد الالكترونى او كلمة المرور");
  }
  const isMatch = await bcryptjs.compare(password, admin.password);
  if (!isMatch) {
    throw new Error("خطأ في البريد الالكترونى او كلمة المرور");
  }
  return admin;
};
adminSchema.methods.generateToken = async function () {
  const admin = this;
  const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET);
  admin.tokens = admin.tokens.concat(token);
  await admin.save();
  return token;
};
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
};
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
