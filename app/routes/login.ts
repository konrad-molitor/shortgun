import { Request, Response } from "express";
import jwtSignPromise from "../helpers/jwtSignPromise";
import User from "../models/User";

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const foundUser = await User.findOne({email: req.body.email});
    if (foundUser) {
      if (await foundUser.compare(req.body.password)) {
        try {
          const token = await jwtSignPromise({email: foundUser.email, id: foundUser._id});
          res.send({token});
        } catch (err) {
          res.status(500).send(err);
        }
      } else {
        console.log('pwd')
        res.status(403).send("Invalid password.");
      }
    } else {
      console.log('user')
      res.status(403).send("No such user");
    }
  } catch (e) {
    res.status(500).send("Server error.");
  }
};

export default loginUser;
