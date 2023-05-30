const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const writerSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    trim: true,
    validate(value) {
      if (value < 16) {
        throw new Error("Age must be larger than 15");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error("Please Enter a valid phone number");
      }
    },
  },
  email: {
    type: String,
    required: true,
    // trim: true,
    // unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please Enter Valid Email");
      }
    },
  },
  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    // validate(value) {
    //   let strongPassword = new RegExp(
    //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
    //   );
    //   if (!strongPassword.test(value)) {
    //     throw new Error(
    //       "Password must include small and capital letter , symbols and numbers"
    //     );
    //   }
    // },
  },
  // city: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // street: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // governate: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // country: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // gender: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  // accountType: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  tokens: [
    {
      type: String,
      // required: true,
    },
  ],
  avatar: {
    type: String,
    // required: true,
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
