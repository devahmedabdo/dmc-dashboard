const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const memberSchema = mongoose.Schema({
  name: {
    first: {
      ar: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
    },
    last: {
      ar: {
        type: String,
        required: true,
        trim: true,
      },
      en: {
        type: String,
        required: true,
        trim: true,
      },
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
  joinDate: {
    type: String,
    trim: true,
    required: true,
  },
  socialAccounts: {
    facebook: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    twitter: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
  },
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
  committee: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Committee",
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "0",
  },
  // 0 blocked
  // 1 new
  // 2 update req
  // 3 active

  card: {
    type: Boolean,
    required: true,
  },
  showImg: {
    type: Boolean,
    required: true,
    default: false,
  },
  convoys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Convoy",
    },
  ],
  tokens: [],
});

memberSchema.pre("save", async function () {
  const member = this;
  if (member.isModified("password")) {
    member.password = await bcryptjs.hash(member.password, 8);
  }
});
memberSchema.statics.findByCredentials = async function (email, password) {
  const member = await Member.findOne({ email });
  if (!member) {
    throw new Error("please check your email or password");
  }
  const isMatch = await bcryptjs.compare(password, member.password);
  if (!isMatch) {
    throw new Error("please check your email or password");
  }
  return member;
};
memberSchema.methods.generateToken = async function () {
  const member = this;
  const token = jwt.sign(
    { _id: member._id.toString() },
    process.env.JWT_SECRET
  );
  member.tokens = member.tokens.concat(token);
  await member.save();
  return token;
};
memberSchema.methods.toJSON = function () {
  const member = this;
  const memberObject = member.toObject();
  delete memberObject.password;
  return memberObject;
};

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
