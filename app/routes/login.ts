import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const loginUser = async (req: Request, res: Response): Promise<void> => {
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
};

export default loginUser;
