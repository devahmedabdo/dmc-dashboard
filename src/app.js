const express = require("express");
const writerRouter = require("./routers/writer");
const newsRouter = require("./routers/news");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
// connect database
require("./db/mongoose");
// to use my route in front
app.use(cors());
// parse automatic
app.use(express.json());
//
app.use(writerRouter);
app.use(newsRouter);

app.listen(port, () => {
  console.log("Server is running " + port);
});
