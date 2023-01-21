const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI, {
    //  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!~~ from.root");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
