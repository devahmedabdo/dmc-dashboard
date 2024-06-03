require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const Role = require("../models/role");

const roles = require("../middelware/roles");
const permissions = extractIds(roles);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const role = await new Role({
      name: "الادارة",
      permissions,
    });
    await role.save();

    const admin = await new Admin({
      name: "أحمد عبده",
      password: "12345678*Aa",
      email: "devahmedabdo@gmail.com",
      role: role._id,
    });
    await admin.save();
    console.error("succsefull creat initial data:");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error creating initial data:", err);
    mongoose.connection.close();
  });
function extractIds(data) {
  let ids = [];
  function traverse(obj) {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        traverse(obj[key]);
      } else if (key === "id") {
        ids.push(obj[key]);
      }
    }
  }
  traverse(data);
  return ids;
}
