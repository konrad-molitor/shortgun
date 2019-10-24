import bodyParser from "body-parser";
import express from "express";
import jwt from "jsonwebtoken";
import { MongoError } from "mongodb";
import mongoose from "mongoose";
import Shortcut from "./models/Shortcut";
import User from "./models/User";

const app: express.Application = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

interface IRequest extends express.Request {
  user?: any;
}

const auth = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  if (req.get("X-Auth")) {
    const authHeader = req.get("X-Auth") || " ";
    // @ts-ignore: Object is possibly 'null'
    if (authHeader.split(" ")[0] === "Bearer:") {
        const jwtVerifyPromise = (token: string): Promise<any> => {
          return new Promise((resolve, reject) => {
            jwt.verify(token, "supersecret", { algorithms: ["HS256"] }, (err, decoded) => {
              if (err) {
                reject(err);
              } else {
                resolve(decoded);
              }
            });
          });
        };
        try {
          const user = await jwtVerifyPromise(authHeader.split(" ")[1]);
          const foundUser = await User.findById(user.id);
          if (foundUser) {
            const request = req as IRequest;
            request.user = {email: foundUser.email, id: foundUser.id};
            next();
          } else {
            throw new Error("No such user.");
          }
        } catch (e) {
          next(e);
        }
      } else {
        res.status(400).send("Incorrect request headers.");
      }
  } else {
    res.status(401).send("Authorization required.");
  }
};

app.use("/a", auth);

app.post("/a/add", auth, async (req: IRequest, res: express.Response) => {
  if (req.user) {
    if (req.body.longUrl) {
      try {
        const shortcut = new Shortcut({
          longUrl: req.body.longUrl,
          shortUrl: "short",
          author: req.user.id,
        });
        const author = await User.findById(req.user.id);
        const saved = await shortcut.save();
        res.send(saved);
      } catch (e) {
        res.status(500).send(e);
      }
    }
  }
});

app.get("/:shortcut", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const shortcut = await Shortcut.findOne({shortUrl: req.params.shortcut});
    if (shortcut) {
      res.redirect(shortcut.longUrl);
    } else {
      res.redirect("/");
    }
  } catch (e) {
    res.status(500).redirect("/");
  }
});

app.get("/", (req: express.Request, res: express.Response): void => {
  res.send("Hello world!");
});

app.post("/signup", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });
    const saved = await newUser.save();
    res.json(saved.email);
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.post("/login", async (req: express.Request, res: express.Response): Promise<void> => {
  const foundUser = await User.findOne({email: req.body.email});
  if (foundUser) {
    const jwtPromise = (payload: object): Promise<string> => {
      return new Promise((resolve, reject) => {
        jwt.sign(payload, "supersecret", { algorithm: "HS256"}, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      });
    };
    if (await foundUser.compare(req.body.password)) {
      try {
        const token = await jwtPromise({email: foundUser.email, id: foundUser._id});
        res.send(token);
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(403).send("Nope");
    }
  } else {
    res.status(403).send("No such user");
  }
});

const db = mongoose.connect("mongodb://shortgun:shortgun@localhost:27017/shortgun",
  {useNewUrlParser: true, useUnifiedTopology: true},
  (err: MongoError): void => {
    if (err) {
      throw err;
    } else {
      app.listen(3000);
    }
});
