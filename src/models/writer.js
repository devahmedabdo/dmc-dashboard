const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const writerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      let egNumber = new RegExp("^(\\+?2)?(01)(0|1|2|5)(\\d{8})$");
      if (!egNumber.test(value)) {
        throw new Error("Please Enter an Egyptian number");
      }
    },
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
  tokens: [
    {
      type: String,
      required: true,
    },
  ],
  avatar: {
    type: Buffer,
  },
});

writerSchema.pre("save", async function () {
  const writer = this;
  if (writer.isModified("password")) {
    writer.password = await bcryptjs.hash(writer.password, 8);
  }
});
writerSchema.statics.findByCredentials = async function (email, password) {
  const writer = await Writer.findOne({ email });
  if (!writer) {
    throw new Error("please check your emailww or password");
  }
  const isMatch = await bcryptjs.compare(password, writer.password);
  if (!isMatch) {
    throw new Error("please check your email or password");
  }
  return writer;
};
writerSchema.methods.generateToken = async function () {
  const writer = this;
  const token = jwt.sign(
    { _id: writer._id.toString() },
    process.env.JWT_SECRET
  );
  writer.tokens = writer.tokens.concat(token);
  await writer.save();
  return token;
};
writerSchema.methods.toJSON = function () {
  const writer = this;
  const writerObject = writer.toObject();
  delete writerObject.password;
  return writerObject;
};
writerSchema.virtual("news", {
  ref: "News",
  localField: "_id",
  foreignField: "publisher",
});
const Writer = mongoose.model("Writer", writerSchema);
module.exports = Writer;
