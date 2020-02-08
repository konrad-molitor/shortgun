import { Response } from "express";
import { IRequest } from "../middleware/auth";
import User from "../models/User";

const getProfile = async (req: IRequest, res: Response) => {
  if (req.user) {
    try {
      const user = await User.findById(req.user.id).select(["_id", "email", "urls"]).populate({
        path: "urls",
        select: ["longUrl", "shortUrl", "_id", "preview", "pageTitle"],
      });
      res.send(user);
    } catch (e) {
      res.status(500).send("Server error.");
    }
  }
};

export default getProfile;
