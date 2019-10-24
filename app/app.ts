import bodyParser from "body-parser";
import express from "express";
import { MongoError } from "mongodb";
import mongoose from "mongoose";
import router from "./routes";

const app: express.Application = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(router);

const db = mongoose.connect("mongodb://shortgun:shortgun@localhost:27017/shortgun",
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err: MongoError): void => {
    if (err) {
      throw err;
    } else {
      app.listen(3000);
    }
});
