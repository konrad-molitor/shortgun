import cors from "cors";
import dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
import bodyParser from "body-parser";
import express from "express";
import { MongoError } from "mongodb";
import mongoose from "mongoose";
import router from "./routes";

const app: express.Application = express();
app.use(cors({
  origin: "http://localhost",
}));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(router);

// @ts-ignore
const db = mongoose.connect(process.env.DB_URL,
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err: MongoError): void => {
    if (err) {
      throw err;
    } else {
      app.listen(3000);
    }
});
