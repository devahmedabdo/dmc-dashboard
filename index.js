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
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
// connect database
require("./src/db/mongoose");
// to use my route in front
app.use(cors());
// parse automatic
app.use(express.json());
//
app.use(adminRouter);
app.use(collaboratorRouter);
app.use(productRouter);
app.use(convoyRouter);
app.use(memberRouter);
app.use(awarenessRouter);
app.use(orderRouter);
// app.use(newsRouter);

app.listen(port, () => {
  console.log("Server is running " + port);
});
