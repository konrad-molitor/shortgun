import { Request, Response } from "express";
import User from "../models/User";

const signup = async (req: Request, res: Response): Promise<void> => {
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
};

export default signup;
