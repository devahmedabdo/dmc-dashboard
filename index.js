const express = require("express");
// const writerRouter = require("./src/routers/writer");
// const newsRouter = require("./src/routers/news");
const adminRouter = require("./src/routers/admin");
const memberRouter = require("./src/routers/member");
const collaboratorRouter = require("./src/routers/collaborator");
const productRouter = require("./src/routers/product");
const orderRouter = require("./src/routers/order");
const awarenessRouter = require("./src/routers/awareness");
const convoyRouter = require("./src/routers/convoy");
const configRouter = require("./src/routers/config");
const roleRouter = require("./src/routers/role");
const facebookRouter = require("./src/routers/facebook");
const specializationRouter = require("./src/routers/specialization");
const committeeRouter = require("./src/routers/committee");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
// connect database
require("./src/db/mongoose");
// to use my route in front
app.use(cors());
// parse automatic
app.use(express.json({ limit: "10mb" }));
//
app.use(adminRouter);
app.use(collaboratorRouter);
app.use(productRouter);
app.use(convoyRouter);
app.use(memberRouter);
app.use(awarenessRouter);
app.use(orderRouter);
app.use(configRouter);
app.use(roleRouter);
app.use(facebookRouter);
app.use(committeeRouter);
app.use(specializationRouter);

app.listen(port, () => {
  console.log("Server is running " + port);
});
